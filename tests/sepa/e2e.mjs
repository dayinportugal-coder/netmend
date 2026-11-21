/* Headless Chrome check for /pt/ficheiro-sepa/.
   XSDs are the ISO 20022 schemas (SWIFT Standards Workstation / Standards Editor),
   kept under tests/ only. Source noted in each file.
   Run: node tests/sepa/e2e.mjs
*/
import { createRequire } from "node:module";
import { execFileSync, spawn } from "node:child_process";
import { createReadStream, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

function loadPuppeteer() {
  const candidates = [
    "/tmp/sepa-deps/package.json",
    fileURLToPath(new URL("../../package.json", import.meta.url))
  ];
  for (const pkg of candidates) {
    if (!existsSync(pkg)) continue;
    try { return createRequire(pkg)("puppeteer-core"); }
    catch (e) { /* try the next place */ }
  }
  throw new Error("Install puppeteer-core before this test (npm install --prefix /tmp/sepa-deps puppeteer-core).");
}
const puppeteer = loadPuppeteer();

const root = fileURLToPath(new URL("../../", import.meta.url));
const outDir = "/opt/cursor/artifacts";
mkdirSync(outDir, { recursive: true });

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".webmanifest": "application/manifest+json",
  ".txt": "text/plain; charset=utf-8",
  ".xsd": "application/xml"
};

function startServer() {
  const server = createServer((req, res) => {
    const url = new URL(req.url, "http://127.0.0.1");
    let rel = decodeURIComponent(url.pathname);
    if (rel.endsWith("/")) rel += "index.html";
    const file = normalize(join(root, rel));
    if (!file.startsWith(root)) {
      res.writeHead(403);
      res.end();
      return;
    }
    if (!existsSync(file)) {
      res.writeHead(404);
      res.end("missing");
      return;
    }
    res.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" });
    createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

function assert(cond, message) {
  if (!cond) throw new Error(message);
}

const server = await startServer();
const port = server.address().port;
const base = "http://127.0.0.1:" + port;
const logs = [];
const third = [];

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"]
});

async function hookDownloads(page) {
  await page.evaluate(() => {
    window.__downloads = [];
    const orig = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (this.download && this.href) window.__downloads.push({ name: this.download, href: this.href });
      return orig.apply(this, arguments);
    };
  });
}

async function clickDownload(page) {
  await page.evaluate(() => document.getElementById("download").click());
}
async function lastDownload(page) {
  return page.evaluate(async () => {
    const item = window.__downloads[window.__downloads.length - 1];
    const text = await (await fetch(item.href)).text();
    return { name: item.name, text: text };
  });
}

function validate(xml, version) {
  const file = "/tmp/sepa-pain-" + version + ".xml";
  writeFileSync(file, xml);
  const xsd = join(root, "tests/sepa/xsd/pain.001.001.0" + version + ".xsd");
  execFileSync("xmllint", ["--noout", "--schema", xsd, file], { stdio: "pipe" });
}

try {
  const page = await browser.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") logs.push(msg.text());
  });
  page.on("pageerror", (err) => logs.push(String(err)));
  page.on("request", (req) => {
    const raw = req.url();
    if (raw.startsWith("data:") || raw.startsWith("blob:")) return;
    try {
      const host = new URL(raw).hostname;
      if (host !== "127.0.0.1" && host !== "localhost") third.push(raw);
    } catch (e) { /* ignore */ }
  });
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(base + "/pt/ficheiro-sepa/", { waitUntil: "networkidle0" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle0" });
  await hookDownloads(page);

  const h1 = await page.$eval("h1", (el) => el.textContent.replace(/\s+/g, " ").trim());
  assert(/Criar ficheiro SEPA XML/.test(h1), "H1: " + h1);
  assert((await page.$eval("html", (el) => el.lang)) === "pt-PT", "lang");
  const hreflang = await page.$$eval("link[hreflang]", (els) => els.map((el) => el.getAttribute("hreflang") + " " + el.getAttribute("href")));
  assert(hreflang.some((v) => v.startsWith("x-default ") && v.endsWith("/pt/ficheiro-sepa/")), "x-default");
  assert(hreflang.some((v) => v.startsWith("pt-PT ")), "hreflang pt");
  assert(hreflang.some((v) => v.startsWith("es-ES ")), "hreflang es");
  assert(hreflang.some((v) => v.startsWith("en ")), "hreflang en");

  await page.click("#example");
  await page.waitForFunction(() => document.getElementById("c-count").textContent === "3");
  const sum = await page.$eval("#c-sum", (el) => el.textContent);
  assert(sum === "2.985,31 €", "control sum " + sum);
  const disabled = await page.$eval("#download", (el) => el.disabled);
  assert(!disabled, "download should be enabled for the example");
  const problems = await page.$eval("#problems", (el) => el.innerText);
  assert(/é→e/.test(problems) && /º→o/.test(problems) && /ª→a/.test(problems), "transliteration missing: " + problems);
  assert(/Jose Exemplo no 2a/.test(problems), "converted name missing: " + problems);
  const badCount = await page.$$eval("#problems li.bad", (els) => els.length);
  assert(badCount === 0, "example has blocking problems:\n" + problems);
  assert((await page.$eval("#c-errors", (el) => el.textContent)) === "0", "example should show 0 errors");
  const table = await page.$eval("#preview-body", (el) => [...el.querySelectorAll("td")].map((td) => ((td.querySelector("input") || {}).value || "") + " " + td.innerText).join(" "));
  assert(table.includes("Jose Exemplo no 2a"), "table still has the original name");
  assert(!table.includes("José") && !table.includes("nº"), "table should show the SEPA name");

  await clickDownload(page);
  const v09 = await lastDownload(page);
  assert(v09.name === "ficheiro-sepa.xml", "filename " + v09.name);
  assert(v09.text.includes("urn:iso:std:iso:20022:tech:xsd:pain.001.001.09"), "namespace 09");
  assert(v09.text.includes("<NbOfTxs>3</NbOfTxs>"), "count");
  assert(v09.text.includes("<CtrlSum>2985.31</CtrlSum>"), "ctrl");
  assert(v09.text.includes("<Cd>SEPA</Cd>"), "service level");
  assert(v09.text.includes("<ChrgBr>SLEV</ChrgBr>"), "charge bearer");
  assert(v09.text.includes("<BtchBookg>true</BtchBookg>"), "batch");
  assert(v09.text.includes("<Id>NOTPROVIDED</Id>"), "debtor agent");
  assert(v09.text.includes("<Nm>Jose Exemplo no 2a</Nm>"), "creditor name");
  assert(!v09.text.includes("José") && !v09.text.includes("º"), "accent leaked into XML");
  assert(v09.text.includes('Ccy="EUR">1234.56<'), "amount 1");
  assert(v09.text.includes('Ccy="EUR">1500.00<'), "amount 2");
  assert(v09.text.includes('Ccy="EUR">250.75<'), "amount 3");
  assert(v09.text.includes("<BICFI>EXMPESMM</BICFI>"), "creditor BICFI");
  assert(v09.text.includes("<Dt>"), "execution date choice");
  assert(v09.text.includes("PT50999900000000000000182"), "debtor IBAN");
  const ids = [...v09.text.matchAll(/<EndToEndId>([^<]+)<\/EndToEndId>/g)].map((m) => m[1]);
  assert(ids.length === 3 && new Set(ids).size === 3, "EndToEndId not unique: " + ids.join(", "));
  validate(v09.text, "9");

  await page.select("#pain-version", "03");
  await clickDownload(page);
  const v03 = await lastDownload(page);
  assert(v03.text.includes("pain.001.001.03"), "namespace 03");
  assert(v03.text.includes("<BIC>EXMPESMM</BIC>"), "BIC on v03");
  assert(!v03.text.includes("<Dt>"), "v03 date is not wrapped");
  validate(v03.text, "3");
  await page.select("#pain-version", "09");

  await page.screenshot({ path: join(outDir, "sepa_pt_example.png"), fullPage: true });

  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await page.evaluate(() => window.scrollTo(0, 0));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflow <= 1, "horizontal overflow " + overflow);
  const dropTop = await page.$eval("#drop", (el) => el.getBoundingClientRect().top);
  assert(dropTop < 812, "drop zone not on the first screen: " + dropTop);
  await page.screenshot({ path: join(outDir, "sepa_pt_375.png"), fullPage: true });

  await page.setViewport({ width: 1280, height: 900 });
  await page.evaluate(() => {
    document.querySelector("details").open = true;
    document.getElementById("paste").value = "Nome;IBAN;Montante;Referência\nFORNECEDOR EXEMPLO;PT50999900000000000000001;10,00;Teste EXEMPLO";
    document.getElementById("parse-paste").click();
  });
  await page.waitForFunction(() => document.getElementById("problems").innerText.indexOf("PT50999900000000000000001") !== -1);
  const badText = await page.$eval("#problems", (el) => el.innerText);
  assert(/mod 97/.test(badText), "mod 97 not mentioned: " + badText);
  assert(await page.$eval("#download", (el) => el.disabled), "bad IBAN should block download");
  await (await page.$("#results")).screenshot({ path: join(outDir, "sepa_pt_bad_iban.png") });

  await page.evaluate(() => {
    document.getElementById("paste").value = "Nome;IBAN;Montante;Referência\nFORNECEDOR EXEMPLO;999900000000000000100;10,00;Teste NIB";
    document.getElementById("parse-paste").click();
  });
  await page.waitForFunction(() => /NIB/.test(document.getElementById("problems").innerText));

  await page.evaluate(() => {
    document.getElementById("paste").value = [
      "Nome;IBAN;Montante;Referência",
      "BdP EXEMPLO;PT50 0002 0123 1234 5678 9015 4;10,00;BdP",
      "MANUAL 1;PT50089000000987654321007;11,00;M1",
      "MANUAL 2;PT50089100000123456789087;12,00;M2",
      "NIB PURO;999900000000000000182;13,00;NIB"
    ].join("\n");
    document.getElementById("parse-paste").click();
  });
  await page.waitForFunction(() => document.getElementById("c-count").textContent === "4");
  assert((await page.$eval("#c-errors", (el) => el.textContent)) === "0", "real-format PT50 IBANs should pass:\n" + await page.$eval("#problems", (el) => el.innerText));
  await clickDownload(page);
  const real = await lastDownload(page);
  assert(real.text.includes("PT50000201231234567890154"), "BdP example missing");
  assert(real.text.includes("PT50089000000987654321007"), "manual IBAN missing");
  assert(real.text.split("PT50999900000000000000182").length - 1 >= 2, "plain NIB was not converted");
  validate(real.text, "9");

  await page.evaluate(() => {
    document.getElementById("paste").value = "Nome;IBAN;Montante;Referência\nFORNECEDOR EXEMPLO;PT50999900010000000000167;0,123;Ambiguo\nOUTRO EXEMPLO;PT50999900010000000000264;10,005;Ambiguo 2";
    document.getElementById("parse-paste").click();
  });
  await page.waitForFunction(() => /0,123/.test(document.getElementById("problems").innerText) && /10,005/.test(document.getElementById("problems").innerText));
  assert(await page.$eval("#download", (el) => el.disabled), "ambiguous amounts should block download");

  await page.evaluate(() => {
    document.getElementById("paste").value = "Nome;IBAN;Montante;Referência\nFORNECEDOR EXEMPLO;PT50999900010000000000167;10,00;Um EXEMPLO\nOUTRO EXEMPLO;PT50999900010000000000167;10,00;Dois EXEMPLO";
    document.getElementById("parse-paste").click();
  });
  await page.waitForFunction(() => /mesmo IBAN/.test(document.getElementById("problems").innerText));
  const dupBad = await page.$$eval("#problems li.bad", (els) => els.length);
  assert(dupBad === 0, "duplicate should be a warning");
  assert(!(await page.$eval("#download", (el) => el.disabled)), "warning should still allow download");

  const many = ["Nome;IBAN;Montante;Referência"];
  for (let i = 1; i <= 60; i++) many.push("FORNECEDOR EXEMPLO;PT50999900010000000000167;" + i + ",00;Linha EXEMPLO " + i);
  await page.evaluate((text) => {
    document.getElementById("paste").value = text;
    document.getElementById("parse-paste").click();
  }, many.join("\n"));
  await page.waitForFunction(() => document.getElementById("c-count").textContent === "60");
  assert((await page.$eval("#c-errors", (el) => el.textContent)) === "0", "60 rows should validate");
  await clickDownload(page);
  const big = await lastDownload(page);
  assert(big.text.includes("<NbOfTxs>60</NbOfTxs>"), "60 rows were dropped");
  validate(big.text, "9");

  await page.evaluate(() => {
    const el = document.getElementById("dbtr-name");
    el.value = "EMPRESA GUARDADA";
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
  const stored = await page.evaluate(() => localStorage.getItem("netmend.sepa.debtor.v1"));
  assert(stored && stored.includes("EMPRESA GUARDADA"), "localStorage did not keep the debtor");
  await page.click("#dbtr-clear");
  const cleared = await page.evaluate(() => localStorage.getItem("netmend.sepa.debtor.v1"));
  assert(cleared == null, "clear left localStorage: " + cleared);
  assert((await page.$eval("#dbtr-name", (el) => el.value)) === "", "name not cleared");

  await page.click("#pro");
  const pro = await page.$eval("#pro-note", (el) => el.textContent);
  assert(/Pro em breve/.test(pro), pro);
  assert(!/[€$]\s*\d|\d\s*€|\bpreço\b|\bprice\b/i.test(pro), "pro note has a price: " + pro);

  await page.click("#template");
  await page.waitForFunction(() => window.__downloads.some((d) => d.name === "modelo-sepa.xlsx"));

  assert(third.length === 0, "third-party requests:\n" + third.join("\n"));
  assert(logs.length === 0, "console errors:\n" + logs.join("\n"));
  console.log("e2e ok");
  if (process.env.SKIP_LIGHTHOUSE !== "1") await new Promise((resolve, reject) => {
    const lh = spawn("npx", ["--yes", "lighthouse@11.7.1", base + "/pt/ficheiro-sepa/", "--only-categories=pwa", "--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage", "--output=json", "--output-path=/tmp/lh-sepa.json", "--quiet", "--chrome-path=/usr/bin/google-chrome"], { stdio: "inherit" });
    lh.on("exit", (code) => (code === 0 ? resolve() : reject(new Error("lighthouse exit " + code))));
  });
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
