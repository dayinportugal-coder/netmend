/* Anexo B estimate. Uses the same parser as the quarterly tool. Nothing is uploaded. */
(function () {
  "use strict";
  var RV = window.NM_RV;
  var APP = window.NM_RV_APP;
  if (!RV || !APP) return;

  function $(id) { return document.getElementById(id); }
  function money(cents) {
    return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format((cents || 0) / 100);
  }
  function kind() {
    var el = document.querySelector('input[name="coef"]:checked');
    return el ? el.value : "art151";
  }

  var last = null;
  function show(merged) {
    last = merged;
    var gross = 0;
    var ret = 0;
    var n = 0;
    function add(row) {
      if (row.cancelled || row.pairedAway || row.baseC == null) return;
      gross += row.baseC;
      if (row.retC != null) ret += row.retC;
      n++;
    }
    (merged.receipts || []).forEach(add);
    (merged.isolados || []).forEach(add);
    var est = RV.anexoTaxable(gross, kind());
    $("ab-count").textContent = String(n);
    $("ab-gross").textContent = money(gross);
    $("ab-coef").textContent = (est.coef / 100).toFixed(2).replace(".", ",");
    $("ab-taxable").textContent = money(est.taxableCents);
    $("ab-ret").textContent = money(ret);
    $("ab-expense").hidden = !est.expenseRule;
    $("ab-results").hidden = false;
    var flags = RV.limitFlags({ grossCents: gross, yearBaseCents: 0, yearIvaCents: 0 });
    var note = $("ab-regime");
    if (flags.simplificadoForce) note.textContent = "Este total passa 250 000 €. O artigo 28.º, n.º 6, do CIRS faz cessar o regime simplificado no ano seguinte.";
    else if (flags.simplificadoWatch) note.textContent = "Este total está acima de 200 000 € e até 250 000 €. Um único ano nesta faixa não faz cessar o regime; o n.º 6 exige dois anos consecutivos, ou um ano acima de 250 000 €.";
    else note.textContent = "O regime simplificado abrange quem no ano anterior não passou 200 000 € de rendimentos ilíquidos da categoria B (artigo 28.º, n.º 2).";
  }

  function fromFiles(list) {
    var readers = Array.prototype.map.call(list, function (file) {
      return new Promise(function (resolve) {
        var reader = new FileReader();
        reader.onload = function () {
          try {
            var bytes = new Uint8Array(reader.result);
            var head = APP.decodeBytes(bytes.subarray(0, 600));
            var matrix;
            if (/<\s*(html|table|meta|head)/i.test(head)) matrix = APP.matrixFromHtml(APP.decodeBytes(bytes));
            else if (/\.xlsx?$/i.test(file.name)) matrix = APP.matrixFromXlsx(bytes);
            else matrix = APP.matrixFromCsv(APP.decodeBytes(bytes));
            var found = APP.findTable(matrix);
            resolve({ name: file.name, matrix: matrix, map: found.map, headerIndex: found.headerIndex });
          } catch (e) {
            resolve({ name: file.name, matrix: null, map: {}, headerIndex: 0 });
          }
        };
        reader.readAsArrayBuffer(file);
      });
    });
    Promise.all(readers).then(function (files) {
      show(APP.mergeFiles(files.filter(function (f) { return f.matrix; })));
    });
  }

  var input = $("file");
  if (input) input.addEventListener("change", function () {
    if (input.files && input.files.length) fromFiles(input.files);
  });
  document.querySelectorAll('input[name="coef"]').forEach(function (el) {
    el.addEventListener("change", function () { if (last) show(last); });
  });
  var resume = $("resume-year");
  if (resume && window.NM_RV_STORE) {
    window.NM_RV_STORE.latest().then(function (rec) {
      if (!rec || !rec.rows || !rec.rows.length) return;
      resume.hidden = false;
      resume.textContent = "Continuar o ano " + rec.year;
      resume.addEventListener("click", function () {
        show(APP.dedupeRows(rec.rows.slice(), []));
      });
    }).catch(function () {});
  }
})();
