/* Dedup for recibos verdes. AT exports often leave the number column empty
   and put the document id in Referência. A later row with the same key
   replaces the earlier one, so a cancellation in a new export drops the old copy. */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.NM_RV_MERGE = api;
})(typeof window !== "undefined" ? window : null, function () {
  "use strict";

  function normRef(s) {
    return String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  }

  function dupKey(row) {
    var raw = String(row.numero || row.referencia || "").trim().toUpperCase();
    var year = row.date ? String(row.date).slice(0, 4) : "";
    var nif = row.nif || "";
    var amount = row.baseC == null ? "" : String(row.baseC);
    if (!raw) {
      if (!row.date && row.baseC == null && row.totalC == null) return "";
      return ["plain", row.date || "", nif, amount, row.totalC == null ? "" : String(row.totalC)].join("|");
    }
    var series = "";
    var number = "";
    var embeddedYear = "";
    var m = raw.match(/^([A-Z]+)\s*[-/]\s*(?:(20\d{2})\s*[-/]\s*)?(\d+)$/);
    if (m) {
      series = m[1];
      embeddedYear = m[2] || "";
      number = String(Number(m[3]));
    } else {
      m = raw.match(/^([A-Z]+)\s+(\d+)$/);
      if (m) { series = m[1]; number = String(Number(m[2])); }
      else number = raw.replace(/[^A-Z0-9]/g, "");
    }
    if (!number) return "";
    return [series, number, year || embeddedYear, nif, amount].join("|");
  }

  function pairDocuments(rows) {
    var faturas = [];
    rows.forEach(function (row) {
      if (row.kind === "fatura" && !row.cancelled) faturas.push(row);
    });
    rows.forEach(function (row) {
      if (row.kind !== "recibo") return;
      var ref = normRef(row.referencia);
      if (!ref) return;
      faturas.forEach(function (fat) {
        if (fat.pairedAway) return;
        if (fat.nif && row.nif && fat.nif !== row.nif) return;
        if (normRef(fat.numero) === ref || normRef(fat.referencia) === ref) fat.pairedAway = true;
      });
    });
  }

  /* Later rows win. Cancelled and paired rows stay out of the totals.
     Isolados are deduped too, then listed apart. */
  function dedupeRows(all) {
    pairDocuments(all);
    var kept = Object.create(null);
    var order = [];
    var problems = [];
    all.forEach(function (row, index) {
      var key = dupKey(row);
      if (!key) key = "row|" + index + "|" + (row.file || "");
      if (!kept[key]) {
        kept[key] = row;
        order.push(key);
        return;
      }
      problems.push({ code: "dup", file: row.file || "", doc: row.numero || row.referencia || "", nif: row.nif || "", name: row.nome || "" });
      kept[key] = row;
    });
    var chosen = order.map(function (k) { return kept[k]; });
    function counts(row) {
      return !row.cancelled && !row.amountBad && !row.pairedAway && !!row.date && row.baseC != null;
    }
    return {
      receipts: chosen.filter(function (row) { return counts(row) && !row.isolado; }),
      isolados: chosen.filter(function (row) { return counts(row) && row.isolado; }),
      problems: problems,
      droppedCancelled: chosen.filter(function (row) { return row.cancelled; }).length
    };
  }

  function filterByYear(rows, year) {
    var y = String(year);
    return (rows || []).filter(function (row) { return row.date && String(row.date).slice(0, 4) === y; });
  }

  function yearsIn(rows) {
    var set = Object.create(null);
    (rows || []).forEach(function (row) {
      if (row.date && !row.cancelled && !row.pairedAway) set[String(row.date).slice(0, 4)] = true;
    });
    return Object.keys(set).sort();
  }

  /* Before February, prefer last year when it is in the file. Otherwise the current year, else the latest year present. */
  function defaultYear(years, todayIso) {
    var list = years || [];
    if (!list.length) return "";
    var y = Number(String(todayIso || "").slice(0, 4));
    var month = Number(String(todayIso || "").slice(5, 7));
    var preferred = String(month < 2 ? y - 1 : y);
    if (list.indexOf(preferred) !== -1) return preferred;
    return list[list.length - 1];
  }

  return {
    dupKey: dupKey,
    pairDocuments: pairDocuments,
    dedupeRows: dedupeRows,
    filterByYear: filterByYear,
    yearsIn: yearsIn,
    defaultYear: defaultYear
  };
});
