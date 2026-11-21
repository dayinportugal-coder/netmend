/* Netmend Statement → Excel. Heuristic parse is 100% local (pdf.js). Optional AI mode uses the user's Gemini key only. */
(function () {
  function nmLang(){var l=(document.documentElement.lang||"pt").toLowerCase();return l.indexOf("en")===0?"en":l.indexOf("es")===0?"es":"pt";}
  function nmT(en, pt, es){var l=nmLang();return l==="en"?en:l==="es"?es:pt;}
  var $ = NM.$;
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

  var P = NMStatement;
  var state = { files: [], results: [], busy: false };

  NM.init({
    tool: "statement",
    freeLimit: 1,
    unit: "statements",
    freeText: nmT("One statement a day, first page only, CSV or Excel export. Parsing stays in your browser.", "Um extrato por dia, só a primeira página, exportação CSV ou Excel. A leitura fica no seu browser.", "Un extracto al día, solo la primera página, exportación CSV o Excel. La lectura se queda en su navegador."),
    proText: nmT("Unlimited pages, batch files, and optional AI mode for messy layouts. Pay once.", "Páginas sem limite, vários ficheiros e modo IA opcional para disposições confusas. Pague uma vez.", "Páginas sin límite, varios ficheros y modo IA opcional para diseños confusos. Pague una vez."),
    onLicense: paintLimits
  });

  function paintLimits() {
    var ai = $("ai-mode");
    if (ai) {
      ai.disabled = !NM.isPro();
      if (!NM.isPro()) ai.checked = false;
    }
    var hint = $("ai-hint");
    if (hint) hint.hidden = NM.isPro();
    var file = $("file");
    if (file) file.multiple = NM.isPro();
    NM.paintRemain();
  }
  paintLimits();

  /* Buy links stay on the Gumroad product in assets/nm-products.js (url + product id). */
  (function paintBuyLinks() {
    var p = NM.product();
    document.querySelectorAll("[data-pro-buy]").forEach(function (a) {
      if (p.url) a.href = p.url;
      if (p.productId) a.setAttribute("data-product-id", p.productId);
      if (p.price && a.hasAttribute("data-pro-label")) a.textContent = nmT("Statement Pro", "Pro extratos", "Pro extractos");
    });
  })();

  function setStatus(msg, kind) { NM.status("status", msg ? NM.esc(msg) : "", kind || ""); }

  function rowsToText(rows) {
    return rows.map(function (r) { return r.cells.join(" | "); }).join("\n");
  }

  function aiTransactions(text, fmt) {
    var system = "You extract bank-statement transactions from text taken from a PDF. Reply with JSON only: {\"transactions\":[{\"date\":\"\",\"description\":\"\",\"debit\":null,\"credit\":null,\"amount\":0,\"balance\":null}],\"currency\":\"\"}. Use period decimals. debit and credit are positive numbers or null. amount is signed (negative for money out). Ignore headers, footers, IBANs, page numbers and opening/closing labels unless they sit on a real transaction row. Do not invent rows. Keep the statement's date format. Reply in the same language as the descriptions.";
    return NM.gemini({ json: true, temperature: 0, system: system, prompt: "Number format hint: " + fmt + ".\n\nStatement text:\n" + text.slice(0, 24000) })
      .then(function (data) {
        var list = (data && data.transactions) || data || [];
        if (!Array.isArray(list)) list = [];
        return list.map(function (t) {
          return {
            date: t.date || "",
            description: (t.description || "").replace(/\s+/g, " ").trim(),
            debit: t.debit == null || t.debit === "" ? null : Number(t.debit),
            credit: t.credit == null || t.credit === "" ? null : Number(t.credit),
            amount: t.amount == null || t.amount === "" ? null : Number(t.amount),
            balance: t.balance == null || t.balance === "" ? null : Number(t.balance),
            page: t.page || null
          };
        }).filter(function (t) { return t.date || t.description; });
      });
  }

  async function parseFile(file, opts) {
    var buf = await file.arrayBuffer();
    var extracted = await P.extractRows(pdfjsLib, buf, { maxPages: opts.maxPages });
    var fmt = $("fmt").value;
    var tx = P.toTransactions(extracted.rows, fmt);
    var usedAi = false;
    if (opts.ai) {
      var text = rowsToText(extracted.rows);
      var aiTx = await aiTransactions(text, fmt);
      if (aiTx.length) { tx = aiTx; usedAi = true; }
    }
    tx.forEach(function (t) { t.file = file.name; });
    return {
      file: file.name,
      tx: tx,
      rows: extracted.rows,
      numPages: extracted.numPages,
      readPages: extracted.readPages,
      usedAi: usedAi,
      truncated: extracted.readPages < extracted.numPages
    };
  }

  function allTx() {
    var out = [];
    state.results.forEach(function (r) { out = out.concat(r.tx); });
    return out;
  }

  function render() {
    var tx = allTx();
    var box = $("out");
    var table = $("preview");
    var stats = $("stats");
    if (!state.results.length) { box.hidden = true; return; }
    box.hidden = false;
    var notes = state.results.map(function (r) {
      var s = r.file + ": " + nmT(
        r.tx.length + " transaction" + (r.tx.length === 1 ? "" : "s") + " from " + r.readPages + " of " + r.numPages + " page" + (r.numPages === 1 ? "" : "s"),
        r.tx.length + (r.tx.length === 1 ? " movimento" : " movimentos") + " de " + r.readPages + " de " + r.numPages + (r.numPages === 1 ? " página" : " páginas"),
        r.tx.length + (r.tx.length === 1 ? " movimiento" : " movimientos") + " de " + r.readPages + " de " + r.numPages + (r.numPages === 1 ? " página" : " páginas")
      );
      if (r.truncated) s += nmT(" (free plan reads the first page only)", " (o plano grátis só lê a primeira página)", " (el plan gratis solo lee la primera página)");
      if (r.usedAi) s += nmT(" · AI mode", " · modo IA", " · modo IA");
      return s;
    });
    stats.textContent = notes.join(" · ") + nmT(". In heuristic mode the file never left this browser.", ". No modo heurístico o ficheiro não saiu deste browser.", ". En el modo heurístico el fichero no salió de este navegador.");
    var data = P.tableFrom(tx, { withFile: state.results.length > 1, withPage: true, dec: $("sep").value === ";" ? "," : "." });
    table.innerHTML = "";
    data.slice(0, 301).forEach(function (row, i) {
      var tr = document.createElement("tr");
      row.forEach(function (v) {
        var c = document.createElement(i ? "td" : "th");
        c.textContent = v;
        if (i && /^-?\d/.test(String(v)) && /[.,]\d{2}$/.test(String(v))) c.style.textAlign = "right";
        tr.appendChild(c);
      });
      table.appendChild(tr);
    });
    if (tx.length > 300) {
      var extra = document.createElement("p");
      extra.className = "note";
      extra.textContent = nmT("Preview shows the first 300 rows. The download includes every row.", "A pré-visualização mostra as primeiras 300 linhas. A transferência inclui todas.", "La vista previa muestra las primeras 300 filas. La descarga incluye todas.");
      stats.appendChild(document.createTextNode(nmT(" Preview limited to 300 rows.", " Pré-visualização limitada a 300 linhas.", " Vista previa limitada a 300 filas.")));
    }
    $("dl-xlsx").disabled = !tx.length;
    $("dl-csv").disabled = !tx.length;
  }

  function exportTable(kind) {
    var tx = allTx();
    if (!tx.length) return;
    var sep = $("sep").value;
    var dec = sep === ";" ? "," : ".";
    var multi = state.results.length > 1;
    var table = P.tableFrom(tx, { withFile: multi, withPage: true, dec: dec });
    var base = nmT("statement-netmend", "extrato-netmend", "extracto-netmend");
    if (!multi && state.results[0]) base = nmT("statement-", "extrato-", "extracto-") + NM.slug(state.results[0].file.replace(/\.pdf$/i, ""));
    if (kind === "csv") {
      NM.download(new Blob([P.toCsv(table, sep)], { type: "text/csv;charset=utf-8" }), base + ".csv");
      return;
    }
    if (typeof XLSX === "undefined") { setStatus(nmT("Excel library did not load. Try CSV, or reload the page.", "A biblioteca do Excel não carregou. Tente CSV ou recarregue a página.", "La biblioteca de Excel no se cargó. Pruebe CSV o recargue la página."), "bad"); return; }
    var wb = XLSX.utils.book_new();
    if (multi) {
      state.results.forEach(function (r) {
        var sheet = P.tableFrom(r.tx, { withPage: true, dec: "." });
        var ws = XLSX.utils.aoa_to_sheet(sheet);
        var name = (r.file || "statement").replace(/\.pdf$/i, "").slice(0, 28) || "statement";
        XLSX.utils.book_append_sheet(wb, ws, name);
      });
    }
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(table), nmT("Combined", "Tudo", "Combinado"));
    XLSX.writeFile(wb, base + ".xlsx");
  }

  async function handleFiles(list) {
    var files = Array.prototype.slice.call(list || []).filter(function (f) { return f && /\.pdf$/i.test(f.name) || (f && f.type === "application/pdf"); });
    if (!files.length) { setStatus(nmT("Choose a PDF bank statement.", "Escolha um extrato bancário em PDF.", "Elija un extracto bancario en PDF."), "bad"); return; }
    if (!NM.isPro() && files.length > 1) {
      files = files.slice(0, 1);
      setStatus(nmT("Free plan converts one statement at a time, first page only. Extra files were ignored. Unlock Pro for batch files.", "O plano grátis converte um extrato de cada vez, só a primeira página. Os ficheiros a mais foram ignorados. Desbloqueie o Pro para vários ficheiros.", "El plan gratis convierte un extracto cada vez, solo la primera página. Los ficheros de más se han ignorado. Desbloquee Pro para varios ficheros."), "bad");
    } else {
      setStatus("");
    }
    if (!NM.canUse()) { setStatus(NM.limitMsg(), "bad"); return; }
    var ai = $("ai-mode").checked;
    if (ai && !NM.isPro()) { setStatus(nmT("AI mode is part of Pro.", "O modo IA faz parte do Pro.", "El modo IA forma parte de Pro."), "bad"); return; }
    if (ai && !NM.getKey()) { setStatus(NM.friendlyError("NOKEY"), "bad"); return; }
    state.busy = true;
    $("run").disabled = true;
    state.results = [];
    try {
      for (var i = 0; i < files.length; i++) {
        setStatus(nmT("Reading " + files[i].name + " in your browser…", "A ler " + files[i].name + " no seu browser…", "Leyendo " + files[i].name + " en su navegador…"));
        var rec = await parseFile(files[i], { maxPages: NM.isPro() ? 0 : 1, ai: ai });
        if (!rec.rows.length) {
          setStatus(nmT("No text found in " + files[i].name + ". This PDF is probably a scan. Pro AI mode can try messy layouts if the pages have some text; photographed statements may still fail.", "Não há texto em " + files[i].name + ". Este PDF é provavelmente uma digitalização. O modo IA do Pro pode tentar disposições confusas se as páginas tiverem algum texto; extratos fotografados podem continuar a falhar.", "No hay texto en " + files[i].name + ". Este PDF es probablemente un escaneo. El modo IA de Pro puede intentar diseños confusos si las páginas tienen algo de texto; los extractos fotografiados pueden seguir fallando."), "bad");
        }
        state.results.push(rec);
      }
      var total = allTx().length;
      if (!total && state.results.some(function (r) { return r.rows.length; })) {
        setStatus(nmT("Text was found, but no transactions were detected. Try another number format, or unlock Pro and tick AI mode for messy layouts.", "Encontrou-se texto, mas não se detetaram movimentos. Tente outro formato de número ou desbloqueie o Pro e marque o modo IA para disposições confusas.", "Se encontró texto, pero no se detectaron movimientos. Pruebe otro formato de número, o desbloquee Pro y marque el modo IA para diseños confusos."), "bad");
      } else if (total) {
        NM.consume();
        var trunc = state.results.some(function (r) { return r.truncated; });
        setStatus(nmT(
          total + " transaction" + (total === 1 ? "" : "s") + " ready." + (trunc ? " Free plan stopped after page 1. Pro reads the full statement." : ""),
          total + (total === 1 ? " movimento pronto." : " movimentos prontos.") + (trunc ? " O plano grátis parou na página 1. O Pro lê o extrato inteiro." : ""),
          total + (total === 1 ? " movimiento listo." : " movimientos listos.") + (trunc ? " El plan gratis se detuvo en la página 1. Pro lee el extracto entero." : "")
        ), trunc ? "bad" : "ok");
      }
      render();
    } catch (err) {
      setStatus(nmT("Could not read this PDF (" + ((err && err.message) || err) + "). If it is password-protected, open it and print to PDF first.", "Não foi possível ler este PDF (" + ((err && err.message) || err) + "). Se tiver palavra-passe, abra-o e use imprimir para PDF primeiro.", "No se pudo leer este PDF (" + ((err && err.message) || err) + "). Si tiene contraseña, ábralo e imprima a PDF primero."), "bad");
    } finally {
      state.busy = false;
      $("run").disabled = false;
      paintLimits();
    }
  }

  $("file").addEventListener("change", function (e) { handleFiles(e.target.files); });
  $("run").addEventListener("click", function () { handleFiles($("file").files); });
  $("dl-csv").addEventListener("click", function () { exportTable("csv"); });
  $("dl-xlsx").addEventListener("click", function () { exportTable("xlsx"); });
  ["fmt", "sep"].forEach(function (id) {
    $(id).addEventListener("change", function () {
      if (!state.results.length) return;
      var fmt = $("fmt").value;
      state.results.forEach(function (r) {
        if (!r.usedAi) {
          r.tx = P.toTransactions(r.rows, fmt);
          r.tx.forEach(function (t) { t.file = r.file; });
        }
      });
      render();
    });
  });
  $("ai-mode").addEventListener("change", function () {
    if (this.checked && !NM.isPro()) { this.checked = false; setStatus(nmT("AI mode is part of Pro.", "O modo IA faz parte do Pro.", "El modo IA forma parte de Pro."), "bad"); }
  });

  document.querySelectorAll("[data-demo]").forEach(function (btn) {
    btn.addEventListener("click", async function () {
      var src = btn.getAttribute("data-demo");
      setStatus(nmT("Loading the sample statement…", "A carregar o extrato de exemplo…", "Cargando el extracto de ejemplo…"));
      try {
        var res = await fetch(src);
        var blob = await res.blob();
        var file = new File([blob], src.split("/").pop(), { type: "application/pdf" });
        handleFiles([file]);
      } catch (e) { setStatus(nmT("Could not load the sample PDF.", "Não foi possível carregar o PDF de exemplo.", "No se pudo cargar el PDF de ejemplo."), "bad"); }
    });
  });

  var drop = $("drop");
  ["dragenter", "dragover"].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("on"); });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("on"); });
  });
  drop.addEventListener("drop", function (e) { handleFiles(e.dataTransfer.files); });
})();
