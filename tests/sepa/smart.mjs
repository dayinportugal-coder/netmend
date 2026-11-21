/* Headless checks for messy sheets, header-less rows, auto-fill and required fields. */
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { createReadStream, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire("/tmp/sepa-deps/package.json");
const puppeteer = require("puppeteer-core");
const root = fileURLToPath(new URL("../../", import.meta.url));
const outDir = "/opt/cursor/artifacts";
mkdirSync(outDir, { recursive: true });
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".webmanifest": "application/manifest+json", ".xsd": "application/xml" };

function assert(cond, message) { if (!cond) throw new Error(message); }
async function clipShot(page, startSel, endSel, file) {
  const box = await page.evaluate((start, end) => {
    const s = document.querySelector(start).getBoundingClientRect();
    const e = document.querySelector(end).getBoundingClientRect();
    const y = Math.max(0, Math.min(s.top, e.top) + window.scrollY - 12);
    const bottom = Math.max(s.bottom, e.bottom) + window.scrollY + 16;
    return { x: 0, y, width: document.documentElement.clientWidth, height: Math.max(240, bottom - y) };
  }, startSel, endSel);
  await page.screenshot({ path: file, clip: box, captureBeyondViewport: true });
}
async function previewText(page) {
  return page.$eval("#preview-body", (el) => [...el.querySelectorAll("tr")].map((tr) => [...tr.children].map((td) => {
    const input = td.querySelector("input");
    return ((input ? input.value : "") + " " + td.innerText).trim();
  }).join("\t")).join("\n"));
}

const server = createServer((req, res) => {
  let rel = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname);
  if (rel.endsWith("/")) rel += "index.html";
  const file = normalize(join(root, rel));
  if (!file.startsWith(root) || !existsSync(file)) { res.writeHead(404); res.end("missing"); return; }
  res.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" });
  createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = "http://127.0.0.1:" + server.address().port;
const logs = [];
const browser = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });

try {
  const page = await browser.newPage();
  page.on("pageerror", (err) => logs.push(String(err)));
  page.on("console", (msg) => { if (msg.type() === "error") logs.push(msg.text()); });
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(base + "/pt/ficheiro-sepa/", { waitUntil: "networkidle0" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle0" });

  const messy = [
    "Folha interna da EMPRESA EXEMPLO",
    "",
    "Nome do beneficiário;Apelido;N.º IBAN;Valor (€);Descrição",
    "FORNECEDOR;EXEMPLO LDA;PT50 9999 0001 0000 0000 0016 7;1.234,56 €;Fatura EXEMPLO",
    "José;Exemplo;PT50.9999.0001.0000.0000.0026.4;EUR 1.500,00;Vencimento EXEMPLO",
    "NIB EXEMPLO;;003500000000000000126;10,00;Teste NIB",
    "Total;;;;"
  ].join("\n");
  await page.evaluate((text) => {
    document.getElementById("dbtr-name").value = "EMPRESA EXEMPLO LDA";
    document.getElementById("dbtr-iban").value = "PT50999900000000000000182";
    document.getElementById("paste").value = text;
    document.getElementById("parse-paste").click();
  }, messy);
  await page.waitForFunction(() => document.getElementById("c-count").textContent === "3");
  const hint = await page.$eval("#map-confidence", (el) => el.textContent);
  assert(/IBAN/.test(hint) && /alta|média/.test(hint), "confidence: " + hint);
  const table = await previewText(page);
  assert(table.includes("FORNECEDOR EXEMPLO LDA"), "merged name missing: " + table);
  assert(table.includes("Jose Exemplo"), "second name: " + table);
  assert(table.includes("PT50 0035"), "NIB not converted: " + table);
  assert(!/Total/.test(table), "totals row kept");
  assert((await page.$eval("#c-errors", (el) => el.textContent)) === "0", await page.$eval("#problems", (el) => el.innerText));

  await page.evaluate(() => {
    document.getElementById("paste").value = "FORNECEDOR EXEMPLO LDA;PT50999900010000000000167;EUR 99,00\n";
    document.getElementById("parse-paste").click();
  });
  await page.waitForFunction(() => document.getElementById("c-count").textContent === "1" && document.getElementById("c-sum").textContent.indexOf("99,00") !== -1);
  assert(/IBAN/.test(await page.$eval("#map-confidence", (el) => el.textContent)), "header-less confidence");

  await page.evaluate(() => {
    localStorage.setItem("netmend.sepa.debtor.v1", JSON.stringify({ name: "ORDENANTE GUARDADO", iban: "PT50003500000000000000126", bic: "" }));
    localStorage.setItem("netmend.sepa.beneficiaries.v1", JSON.stringify([{ name: "BENEFICIARIO GUARDADO", iban: "PT50999900010000000000167", bic: "" }]));
    document.getElementById("dbtr-name").value = "";
    document.getElementById("dbtr-iban").value = "";
    document.getElementById("dbtr-bic").value = "";
    delete document.getElementById("dbtr-name").dataset.user;
    delete document.getElementById("dbtr-iban").dataset.user;
    delete document.getElementById("dbtr-bic").dataset.user;
    document.getElementById("paste").value = ";PT50999900010000000000167;25,00;\nCAIXA EXEMPLO;PT50003500000000000000126;10,00;\n";
    document.getElementById("autofill-ref").checked = false;
    document.getElementById("parse-paste").click();
  });
  await page.waitForFunction(() => document.getElementById("download").disabled === true);
  const off = await page.evaluate(() => ({
    name: document.getElementById("dbtr-name").value,
    bic: [...document.querySelectorAll("#preview-body td")].map((td) => ((td.querySelector("input") || {}).value || "") + " " + td.innerText).join(" "),
    reason: document.getElementById("download-reason").textContent,
    invalid: document.getElementById("dbtr-name").getAttribute("aria-invalid")
  }));
  assert(off.name === "", "autofill off wrote the debtor: " + off.name);
  assert(!/CGDIPTPL|BENEFICIARIO GUARDADO|Pagamento /.test(off.bic), "autofill off changed the row: " + off.bic);
  assert(off.invalid === "true", "missing name not aria-invalid");
  assert(/Não é possível descarregar/.test(off.reason), off.reason);
  await clipShot(page, "#dbtr-name", "#download-reason", join(outDir, "sepa_pt_missing.png"));
  await clipShot(page, "#missing-summary", "#preview-body", join(outDir, "sepa_pt_missing_rows.png"));

  await page.click("#autofill");
  await page.evaluate(() => { document.getElementById("autofill-ref").checked = true; document.getElementById("autofill-ref").dispatchEvent(new Event("change")); });
  await page.evaluate(() => {
    const box = document.getElementById("confirm-map");
    if (box && !box.checked) { box.checked = true; box.dispatchEvent(new Event("change")); }
  });
  await page.waitForFunction(() => document.getElementById("dbtr-bic").value === "CGDIPTPL");
  const on = await page.evaluate(() => ({
    name: document.getElementById("dbtr-name").value,
    iban: document.getElementById("dbtr-iban").value,
    auto: document.getElementById("dbtr-name-auto").hidden,
    row: [...document.querySelectorAll("#preview-body td")].map((td) => ((td.querySelector("input") || {}).value || "") + " " + td.innerText).join(" "),
    errors: document.getElementById("c-errors").textContent,
    disabled: document.getElementById("download").disabled
  }));
  assert(on.name === "ORDENANTE GUARDADO", on.name);
  assert(on.iban === "PT50003500000000000000126", on.iban);
  assert(on.auto === false, "auto mark hidden");
  assert(on.row.includes("BENEFICIARIO GUARDADO"), on.row);
  assert(on.row.includes("CGDIPTPL"), on.row);
  assert(/Pagamento /.test(on.row), on.row);
  assert(on.errors === "0" && on.disabled === false, JSON.stringify(on));
  await page.evaluate(() => {
    const orig = HTMLAnchorElement.prototype.click;
    window.__xml = "";
    HTMLAnchorElement.prototype.click = function () {
      if (this.download && this.href && this.href.indexOf("blob:") === 0) window.__href = this.href;
      return orig.apply(this, arguments);
    };
  });
  await page.evaluate(() => document.getElementById("download").click());
  const xml = await page.evaluate(async () => (await fetch(window.__href)).text());
  assert(xml.includes("CGDIPTPL") && xml.includes("pain.001.001.09"), "xml missing autofill");
  const xsd = join(root, "tests/sepa/xsd/pain.001.001.09.xsd");
  writeFileSync("/tmp/sepa-smart.xml", xml);
  execFileSync("xmllint", ["--noout", "--schema", xsd, "/tmp/sepa-smart.xml"], { stdio: "pipe" });

  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflow <= 1, "overflow " + overflow);
  await page.screenshot({ path: join(outDir, "sepa_pt_autofill_375.png"), fullPage: true });
  await page.setViewport({ width: 1280, height: 900 });
  await clipShot(page, "h2", "#preview-body", join(outDir, "sepa_pt_autofill.png"));
  await page.screenshot({ path: join(outDir, "sepa_pt_autofill_full.png"), fullPage: true });

  assert(logs.length === 0, logs.join("\n"));
  console.log("smart ok");
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
