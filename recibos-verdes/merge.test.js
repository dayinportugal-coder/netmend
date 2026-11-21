var assert = require("assert");
var M = require("./merge.js");

function row(partial) {
  return Object.assign({
    date: "2026-02-01",
    numero: "",
    referencia: "",
    nif: "512345678",
    nome: "CLIENTE EXEMPLO",
    baseC: 100000,
    totalC: 123000,
    kind: "fatura-recibo",
    isolado: false,
    cancelled: false,
    amountBad: false,
    pairedAway: false,
    file: "a.csv"
  }, partial || {});
}

var a = row({ referencia: "FR ATSIRE01FR/1", baseC: 100000 });
var b = row({ referencia: "FR ATSIRE01FR/2", baseC: 200000 });
var iso = row({ referencia: "AI/1", baseC: 40000, isolado: true, kind: "isolado" });

var once = M.dedupeRows([a, b, iso]);
var twice = M.dedupeRows([a, b, iso, a, b, iso]);
assert.strictEqual(twice.receipts.length, once.receipts.length);
assert.strictEqual(twice.isolados.length, 1);
assert.strictEqual(twice.receipts.reduce(function (s, r) { return s + r.baseC; }, 0), 300000);

var saved = M.dedupeRows([a, b]).receipts;
var again = M.dedupeRows(saved.concat([a, b, iso]));
assert.strictEqual(again.receipts.length, 2);
assert.strictEqual(again.isolados.length, 1);

var q2 = row({ referencia: "FR ATSIRE01FR/3", baseC: 300000, date: "2026-05-01" });
var next = M.dedupeRows(saved.concat([q2]));
assert.strictEqual(next.receipts.length, 3);
assert.strictEqual(next.receipts.reduce(function (s, r) { return s + r.baseC; }, 0), 600000);

var cancelled = row({ referencia: "FR ATSIRE01FR/1", baseC: 100000, cancelled: true, status: "Anulado", file: "q1-new.csv" });
var replaced = M.dedupeRows(saved.concat([cancelled, b]));
assert.strictEqual(replaced.receipts.length, 1);
assert.strictEqual(replaced.receipts[0].referencia, "FR ATSIRE01FR/2");
assert.strictEqual(replaced.droppedCancelled, 1);

var y2025 = row({ referencia: "FR/9", date: "2025-06-01", baseC: 500000 });
var y2026 = row({ referencia: "FR/9", date: "2026-06-01", baseC: 700000 });
var mixed = M.dedupeRows([y2025, y2026]);
assert.strictEqual(mixed.receipts.length, 2);
var only26 = M.filterByYear(mixed.receipts.concat(mixed.isolados), 2026);
assert.strictEqual(only26.length, 1);
assert.strictEqual(only26[0].baseC, 700000);
assert.deepStrictEqual(M.yearsIn([y2025, y2026]), ["2025", "2026"]);
assert.strictEqual(M.defaultYear(["2025", "2026"], "2026-11-21"), "2026");
assert.strictEqual(M.defaultYear(["2025", "2026"], "2026-01-15"), "2025");

console.log("merge.test.js ok");
