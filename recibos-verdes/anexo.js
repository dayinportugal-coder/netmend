/* Anexo B estimate. One year at a time. Nothing is uploaded. */
(function () {
  "use strict";
  var RV = window.NM_RV;
  var APP = window.NM_RV_APP;
  var MERGE = window.NM_RV_MERGE;
  if (!RV || !APP || !MERGE) return;

  function $(id) { return document.getElementById(id); }
  function money(cents) {
    return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format((cents || 0) / 100);
  }
  function formatCoef(bps) {
    var s = (bps / 10000).toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
    return s.replace(".", ",");
  }
  function kind() {
    var el = document.querySelector('input[name="coef"]:checked');
    return el ? el.value : "art151";
  }
  function reduction() {
    var el = document.querySelector('input[name="reduction"]:checked');
    return el ? el.value : "none";
  }

  var last = null;
  var pickedYear = "";
  var savedRows = [];

  function rowsOf(merged) {
    return (merged.receipts || []).concat(merged.isolados || []);
  }

  function show(merged) {
    last = merged;
    var all = rowsOf(merged);
    var years = MERGE.yearsIn(all);
    var host = $("ab-year");
    if (host) {
      host.hidden = years.length < 2;
      host.textContent = "";
      if (years.length > 1) {
        var label = document.createElement("label");
        label.setAttribute("for", "ab-year-select");
        label.textContent = "Ano";
        var select = document.createElement("select");
        select.id = "ab-year-select";
        years.forEach(function (y) {
          var opt = document.createElement("option");
          opt.value = y;
          opt.textContent = y;
          select.appendChild(opt);
        });
        if (!pickedYear || years.indexOf(pickedYear) === -1) pickedYear = MERGE.defaultYear(years, RV.todayIso());
        select.value = pickedYear;
        select.addEventListener("change", function () {
          pickedYear = select.value;
          var current = host.querySelector(".note");
          if (current) current.textContent = "O ficheiro tem " + years.join(" e ") + ". A mostrar " + pickedYear + ".";
          paint();
        });
        host.appendChild(label);
        host.appendChild(select);
        var note = document.createElement("p");
        note.className = "note";
        note.textContent = "O ficheiro tem " + years.join(" e ") + ". A mostrar " + pickedYear + ".";
        host.appendChild(note);
      } else {
        pickedYear = years[0] || "";
      }
    }
    paint();
  }

  function paint() {
    if (!last) return;
    var all = rowsOf(last);
    var yearRows = pickedYear ? MERGE.filterByYear(all, pickedYear) : all;
    var gross = 0;
    var ret = 0;
    yearRows.forEach(function (row) {
      if (row.baseC != null) gross += row.baseC;
      if (row.retC != null) ret += row.retC;
    });
    var est = RV.anexoTaxable(gross, kind(), reduction());
    var add = RV.expenseAddBack(gross, kind());
    $("ab-count").textContent = String(yearRows.length);
    $("ab-gross").textContent = money(gross);
    $("ab-coef").textContent = formatCoef(est.coefBps);
    $("ab-taxable").textContent = money(est.taxableCents);
    $("ab-ret").textContent = money(ret);
    var expense = $("ab-expense");
    if (!add.applies) expense.hidden = true;
    else {
      expense.hidden = false;
      expense.textContent = add.addCents === 0
        ? "Só com a dedução automática do artigo 25.º (8,54 × IAS = " + money(add.autoCents) + " em 2026), o acréscimo do n.º 13 do artigo 31.º é 0 €. Isso cobre prestações de serviços até " + money(add.ceilingCents) + "."
        : "Sem outras despesas comunicadas, o n.º 13 pode acrescer até " + money(add.addCents) + " (15% do rendimento menos a dedução automática de " + money(add.autoCents) + "). As faturas que comunicar no e-fatura baixam este valor.";
    }
    var flags = RV.limitFlags({ grossCents: gross, yearBaseCents: 0, yearIvaCents: 0 });
    var note = $("ab-regime");
    if (flags.simplificadoForce) note.textContent = "Este ano passa 250 000 €. O artigo 28.º, n.º 6, do CIRS faz cessar o regime simplificado no ano seguinte.";
    else if (flags.simplificadoWatch) note.textContent = "Este ano está acima de 200 000 € e até 250 000 €. Um único ano nesta faixa não faz cessar o regime; o n.º 6 exige dois anos consecutivos, ou um ano acima de 250 000 €.";
    else note.textContent = "O regime simplificado abrange quem no ano anterior não passou 200 000 € de rendimentos ilíquidos da categoria B (artigo 28.º, n.º 2).";
    var dropped = $("ab-dropped");
    if (dropped) {
      var dups = (last.problems || []).filter(function (p) { return p.code === "dup"; }).length;
      var cancelled = last.droppedCancelled || 0;
      dropped.hidden = !(dups || cancelled);
      dropped.textContent = (dups ? dups + " duplicados" : "") + (dups && cancelled ? " e " : "") + (cancelled ? cancelled + " anulados" : "") + " ficaram de fora.";
    }
    $("ab-results").hidden = false;
    var err = $("ab-error");
    if (err) err.hidden = true;
  }

  function fail(message) {
    var err = $("ab-error");
    if (err) { err.hidden = false; err.textContent = message; }
    if ($("ab-results")) $("ab-results").hidden = true;
    last = null;
  }

  function fromFiles(list) {
    var readers = Array.prototype.map.call(list, function (file) {
      return new Promise(function (resolve) {
        var reader = new FileReader();
        reader.onerror = function () { resolve(null); };
        reader.onload = function () {
          try {
            var bytes = new Uint8Array(reader.result);
            var head = APP.decodeBytes(bytes.subarray(0, 600));
            var matrix;
            if (/<\s*(html|table|meta|head)/i.test(head)) matrix = APP.matrixFromHtml(APP.decodeBytes(bytes));
            else if (/\.xlsx?$/i.test(file.name)) matrix = APP.matrixFromXlsx(bytes);
            else matrix = APP.matrixFromCsv(APP.decodeBytes(bytes));
            if (!matrix || !matrix.length) { resolve(null); return; }
            var found = APP.findTable(matrix);
            if (!found.confident) { resolve({ bad: true }); return; }
            resolve({ name: file.name, matrix: matrix, map: found.map, headerIndex: found.headerIndex });
          } catch (e) { resolve(null); }
        };
        reader.readAsArrayBuffer(file);
      });
    });
    Promise.all(readers).then(function (files) {
      var good = files.filter(function (f) { return f && f.matrix; });
      if (!good.length) { fail("Não encontrámos recibos neste ficheiro."); return; }
      var merged = APP.mergeFiles(good);
      if (savedRows.length) merged = MERGE.dedupeRows(savedRows.concat(merged.all || []));
      if (!merged.receipts.length && !(merged.isolados || []).length) { fail("Não encontrámos recibos neste ficheiro."); return; }
      pickedYear = "";
      show(merged);
    });
  }

  var input = $("file");
  if (input) input.addEventListener("change", function () {
    if (input.files && input.files.length) fromFiles(input.files);
  });
  document.querySelectorAll('input[name="coef"], input[name="reduction"]').forEach(function (el) {
    el.addEventListener("change", function () { if (last) paint(); });
  });
  var resume = $("resume-year");
  var hint = $("resume-hint");
  if (resume && window.NM_RV_STORE) {
    window.NM_RV_STORE.latest().then(function (rec) {
      if (!rec || !rec.rows || !rec.rows.length) return;
      resume.hidden = false;
      if (hint) hint.hidden = false;
      resume.textContent = "Continuar o ano " + rec.year;
      resume.addEventListener("click", function () {
        savedRows = MERGE.filterByYear(rec.rows, rec.year);
        pickedYear = String(rec.year);
        show(MERGE.dedupeRows(savedRows));
      });
    }).catch(function () {});
  }
})();
