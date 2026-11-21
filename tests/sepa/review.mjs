/* Cases from the second SEPA review: header-less amounts, totals, stale BIC, amount columns. */
import { createRequire } from "node:module";
import { createReadStream, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire("/tmp/sepa-deps/package.json");
const puppeteer = require("puppeteer-core");
const root = fileURLToPath(new URL("../../", import.meta.url));
const outDir = "/opt/cursor/artifacts";
mkdirSync(outDir, { recursive: true });
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };

function assert(cond, message) { if (!cond) throw new Error(message); }

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

async function paste(page, text) {
  await page.evaluate((value) => {
    document.getElementById("paste").value = value;
    document.getElementById("parse-paste").click();
  }, text);
  await page.waitForFunction(() => document.getElementById("results").hidden === false || document.getElementById("error").hidden === false);
}
function amounts(page) {
  return page.$$eval("#preview-body tr", (rows) => rows.map((row) => (row.querySelectorAll("input")[2] || {}).value || ""));
}

try {
  const page = await browser.newPage();
  page.on("pageerror", (err) => logs.push(String(err)));
  page.on("console", (msg) => { if (msg.type() === "error") logs.push(msg.text()); });
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(base + "/pt/ficheiro-sepa/", { waitUntil: "networkidle0" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle0" });
  await page.evaluate(() => {
    document.getElementById("dbtr-name").value = "EMPRESA EXEMPLO LDA";
    document.getElementById("dbtr-iban").value = "PT50999900000000000000182";
  });

  await paste(page, [
    "1;ANA EXEMPLO;PT50999900010000000000167;10,00",
    "2;JOSE EXEMPLO;PT50999900010000000000264;20,00",
    "3;RITA EXEMPLO;PT50003500000000000000126;30,00"
  ].join("\n"));
  assert(await page.$eval("#download", (el) => el.disabled), "header-less row numbers enabled download");
  assert((await page.evaluate(() => window.NetmendSepa.lastXml())) === "", "XML built before column confirmation");
  assert(/Confirmo as colunas/.test(await page.$eval("#confirm-map-text", (el) => el.textContent)), "missing confirm sentence");
  const rowAmounts = await amounts(page);
  assert(rowAmounts.join(" ") === "10,00 € 20,00 € 30,00 €", "row numbers used as amounts: " + rowAmounts.join(" | "));
  await page.screenshot({ path: join(outDir, "sepa_pt_confirm.png"), clip: await page.evaluate(() => {
    const s = document.getElementById("confirm-map-label").getBoundingClientRect();
    const e = document.getElementById("download-reason").getBoundingClientRect();
    return { x: 0, y: Math.max(0, s.top + window.scrollY - 24), width: document.documentElement.clientWidth, height: e.bottom + window.scrollY - s.top + 48 };
  }), captureBeyondViewport: true });

  await paste(page, [
    "ANA EXEMPLO;501234567;PT50999900010000000000167;10,00",
    "JOSE EXEMPLO;509876543;PT50999900010000000000264;20,00"
  ].join("\n"));
  assert(!(await amounts(page)).join(" ").includes("501"), "NIF used as amount: " + (await amounts(page)).join(" | "));
  assert(await page.$eval("#download", (el) => el.disabled), "NIF sheet downloaded without confirmation");

  await paste(page, [
    "2026-11-21;ANA EXEMPLO;PT50999900010000000000167;10,00",
    "21/11/2026;JOSE EXEMPLO;PT50999900010000000000264;20,00"
  ].join("\n"));
  assert((await amounts(page)).join(" ") === "10,00 € 20,00 €", "text dates used as amounts: " + (await amounts(page)).join(" | "));

  const xlsx = await page.evaluate(() => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      [new Date(2026, 10, 21), "ANA EXEMPLO", "PT50999900010000000000167", 10],
      [new Date(2026, 10, 22), "JOSE EXEMPLO", "PT50999900010000000000264", 20]
    ]);
    XLSX.utils.book_append_sheet(wb, ws, "Pagamentos");
    return XLSX.write(wb, { bookType: "xlsx", type: "base64" });
  });
  writeFileSync("/tmp/nohdr-date.xlsx", Buffer.from(xlsx, "base64"));
  const input = await page.$("#file");
  await input.uploadFile("/tmp/nohdr-date.xlsx");
  await page.waitForFunction(() => document.getElementById("c-count").textContent === "2");
  assert(!(await amounts(page)).join(" ").includes("46"), "Excel date serial used as amount: " + (await amounts(page)).join(" | "));
  assert((await page.$eval("#map-name", (el) => el.selectedOptions[0].textContent)) === "Coluna 2", "Excel date mapped as the name");
  assert((await page.$eval("#map-bic", (el) => el.value)) === "", "name mapped as BIC on the date file");
  assert(await page.$eval("#download", (el) => el.disabled), "date workbook downloaded without confirmation");

  await paste(page, [
    "Nome;IBAN;Montante",
    "FORNECEDOR EXEMPLO;PT50999900010000000000167;1000,00",
    "OUTRO EXEMPLO;PT50999900010000000000264;2838,02",
    "Total;;10",
    "TOTAL;;3838,02",
    "Total geral;;3.838,02",
    ";;3838,02"
  ].join("\n"));
  assert((await page.$eval("#c-count", (el) => el.textContent)) === "2", "totals counted as payments");
  assert((await page.$eval("#c-sum", (el) => el.textContent)) === "3.838,02 €", "totals changed the sum: " + await page.$eval("#c-sum", (el) => el.textContent));
  const totalNotes = await page.$eval("#problems", (el) => el.innerText);
  assert((totalNotes.match(/totais ignorada/g) || []).length === 4, totalNotes);
  assert(!/falta o IBAN/.test(totalNotes), totalNotes);

  await paste(page, [
    "Fornecedor;IBAN;Valor s/ IVA;IVA;Valor total",
    "ANA EXEMPLO;PT50999900010000000000167;100;23;123"
  ].join("\n"));
  assert((await page.$eval("#c-sum", (el) => el.textContent)) === "123,00 €", "paid the amount before IVA");
  assert(/Valor total/.test(await page.$eval("#map-amount", (el) => el.selectedOptions[0].textContent)), "amount column");
  assert(/várias colunas de valor/.test(await page.$eval("#problems", (el) => el.innerText)), await page.$eval("#problems", (el) => el.innerText));

  await paste(page, "Apellido;Nombre;IBAN;Importe\nGarcia;Lucia;ES8099990001450000000001;10\n");
  assert((await amounts(page)).length === 1);
  assert(/Lucia Garcia/.test(await page.$eval("#preview-body", (el) => el.innerText + " " + [...el.querySelectorAll("input")].map((i) => i.value).join(" "))), "surname-first name");

  await paste(page, "Primeiro nome;Último nome;IBAN;Montante\nAna;Silva;PT50999900010000000000167;10\n");
  assert(/Ana Silva/.test(await page.$eval("#preview-body input", (el) => el.value)), "último nome dropped");
  assert(/Primeiro nome \+ Último nome/.test(await page.$eval("#map-confidence", (el) => el.textContent)), await page.$eval("#map-confidence", (el) => el.textContent));

  await paste(page, "Nome;IBAN;Montante\nANA EXEMPLO;PT50999900010000000000167;12 34\n");
  const spaceProblem = await page.$eval("#problems", (el) => el.innerText);
  assert(/12 34/.test(spaceProblem), spaceProblem);
  assert(!/1\.234,00/.test(await page.$eval("#c-sum", (el) => el.textContent)), "12 34 became 1.234");
  assert(await page.$eval("#download", (el) => el.disabled));
  assert(/erro/.test(await page.$eval("#download-reason", (el) => el.textContent)) && /Problemas/.test(await page.$eval("#download-reason", (el) => el.innerHTML)), await page.$eval("#download-reason", (el) => el.textContent));

  await paste(page, "Nome;IBAN;Montante;BIC\nANA EXEMPLO;PT50003500000000000000126;10,00;BCOMPTPL\n");
  const mismatch = await page.$eval("#problems", (el) => el.innerText);
  assert(/BCOMPTPL/.test(mismatch) && /CGDIPTPL/.test(mismatch), mismatch);
  assert((await page.$eval("#c-errors", (el) => el.textContent)) === "0", mismatch);
  assert(!await page.$eval("#download", (el) => el.disabled), "BIC mismatch blocked download");

  await paste(page, [
    "Nome;IBAN;Montante",
    "ANA EXEMPLO;PT50999900010000000000167;10,00",
    "JOSE EXEMPLO;PT50999900010000000000264;200000,00"
  ].join("\n"));
  assert(/invulgar/.test(await page.$eval("#problems", (el) => el.innerText)), await page.$eval("#problems", (el) => el.innerText));

  await paste(page, "Nome;IBAN;Montante;Referência\nCAIXA EXEMPLO;PT50003300000000000000105;10,00;\n");
  await page.evaluate(() => {
    document.getElementById("dbtr-name").value = "ORDENANTE EXEMPLO";
    document.getElementById("dbtr-iban").value = "PT50003500000000000000126";
    document.getElementById("dbtr-bic").value = "";
    delete document.getElementById("dbtr-bic").dataset.user;
    delete document.getElementById("dbtr-bic").dataset.auto;
    document.getElementById("autofill").checked = true;
    document.getElementById("autofill").dispatchEvent(new Event("change"));
    document.getElementById("autofill-ref").checked = true;
    document.getElementById("autofill-ref").dispatchEvent(new Event("change"));
  });
  await page.waitForFunction(() => document.getElementById("dbtr-bic").value === "CGDIPTPL");
  assert((await page.$eval("#autofill-state", (el) => el.textContent)) === "Ligado", "toggle state");
  assert(/BCOMPTPL/.test(await page.$eval("#preview-body", (el) => [...el.querySelectorAll("input")].map((i) => i.value).join(" "))), "row BIC");
  await page.evaluate(() => {
    const inputs = document.querySelectorAll("#preview-body tr input");
    inputs[1].value = "PT50000700000000000000123";
    inputs[1].dispatchEvent(new Event("input", { bubbles: true }));
    inputs[1].dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.waitForFunction(() => [...document.querySelectorAll("#preview-body input")].some((el) => el.value === "BESCPTPL"));
  await page.evaluate(() => {
    const iban = document.getElementById("dbtr-iban");
    iban.value = "PT50001800000000000000190";
    iban.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.waitForFunction(() => document.getElementById("dbtr-bic").value === "TOTAPTPL");
  await page.evaluate(() => {
    document.getElementById("autofill").checked = false;
    document.getElementById("autofill").dispatchEvent(new Event("change"));
  });
  await page.waitForFunction(() => document.getElementById("dbtr-bic").value === "" && document.getElementById("autofill-state").textContent === "Desligado");
  const afterOff = await page.$eval("#preview-body", (el) => [...el.querySelectorAll("input")].map((i) => i.value).join(" | "));
  assert(!/BESCPTPL|BCOMPTPL|CGDIPTPL|Pagamento de /.test(afterOff), "autofill off left values: " + afterOff);

  await page.evaluate(() => {
    const input = document.querySelector("#preview-body input");
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.focus("#dbtr-iban");
  await page.type("#dbtr-iban", "1");
  await new Promise((resolve) => setTimeout(resolve, 50));

  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflow <= 1, "overflow " + overflow);
  await page.evaluate(() => document.querySelector(".switch").scrollIntoView({ block: "center", behavior: "instant" }));
  await page.screenshot({ path: join(outDir, "sepa_pt_review_375.png") });

  const es = await browser.newPage();
  es.on("pageerror", (err) => logs.push(String(err)));
  await es.goto(base + "/es/fichero-sepa/", { waitUntil: "networkidle0" });
  await es.evaluate(() => {
    document.getElementById("dbtr-name").value = "EMPRESA EJEMPLO";
    document.getElementById("dbtr-iban").value = "ES8099990001450000000001";
    document.getElementById("dbtr-iban").dispatchEvent(new Event("input", { bubbles: true }));
    document.getElementById("paste").value = "Nombre;IBAN;Importe\nLucia Garcia;ES8099990001450000000001;10\n";
    document.getElementById("parse-paste").click();
  });
  await es.waitForFunction(() => document.getElementById("download").disabled === true);
  assert(await es.$eval("#dbtr-nif", (el) => el.getAttribute("aria-invalid")) === "true", "ES NIF not invalid");
  assert(/NIF-sufijo/.test(await es.$eval("#missing-summary", (el) => el.textContent)), await es.$eval("#missing-summary", (el) => el.textContent));
  assert(/NIF-sufijo/.test(await es.$eval("#download-reason", (el) => el.textContent)), await es.$eval("#download-reason", (el) => el.textContent));

  await page.bringToFront();
  await paste(page, [
    "2026-11-21;ANA EXEMPLO;PT50999900010000000000167;10,00;PORTUGAL",
    "2026-11-22;JOSE EXEMPLO;PT50999900010000000000264;20,00;FORNECEDOR"
  ].join("\n"));
  const mapped = await page.evaluate(() => ({
    name: document.getElementById("map-name").selectedOptions[0].textContent,
    bic: document.getElementById("map-bic").value,
    confirmShown: getComputedStyle(document.getElementById("confirm-map-label")).display !== "none"
  }));
  assert(mapped.name === "Coluna 2", "date mapped as name: " + mapped.name);
  assert(mapped.bic === "", "name mapped as BIC");
  assert(mapped.confirmShown, "confirm hidden on a header-less file");
  await page.evaluate(() => { document.getElementById("confirm-map").checked = true; });
  await paste(page, "Nome;IBAN;Montante\nANA EXEMPLO;PT50999900010000000000167;10,00\n");
  const afterHeader = await page.evaluate(() => ({
    shown: getComputedStyle(document.getElementById("confirm-map-label")).display !== "none",
    checked: document.getElementById("confirm-map").checked
  }));
  assert(!afterHeader.shown && !afterHeader.checked, "confirm stayed after a headed file: " + JSON.stringify(afterHeader));

  await page.evaluate(() => {
    const name = document.getElementById("dbtr-name");
    name.focus();
    name.value = "EMPRESA EXEMPLO LDA";
    name.dispatchEvent(new Event("input", { bubbles: true }));
    name.blur();
  });
  const focus = await page.evaluate(() => ({
    id: document.activeElement && document.activeElement.id,
    top: document.getElementById("dbtr-iban").getBoundingClientRect().top
  }));
  assert(focus.id !== "results", "blur moved focus to results");
  await page.focus("#dbtr-iban");
  await page.keyboard.type("PT50");
  const typed = await page.$eval("#dbtr-iban", (el) => el.value);
  assert(typed.indexOf("PT50") !== -1, "could not keep typing in the next field: " + typed);

  assert(logs.length === 0, logs.join("\n"));
  console.log("review ok");
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
