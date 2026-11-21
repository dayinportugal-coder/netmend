/* Netmend Sheets AI browser playground: same prompts as the Apps Script functions, batched in one call. */
(function () {
  function nmLang(){var l=(document.documentElement.lang||"pt").toLowerCase();return l.indexOf("en")===0?"en":l.indexOf("es")===0?"es":"pt";}
  function nmT(en, pt, es){var l=nmLang();return l==="en"?en:l==="es"?es:pt;}
  var $ = NM.$, FREE_ROWS = 20;
  NM.init({ tool: "sheets-ai", freeLimit: 3, unit: "runs", freeText: nmT("NETMEND_AI and NETMEND_TRANSLATE, 50 AI cells a day in your sheet; 3 test runs a day here.", "NETMEND_AI e NETMEND_TRANSLATE, 50 células de IA por dia na folha; 3 testes por dia aqui.", "NETMEND_AI y NETMEND_TRANSLATE, 50 celdas de IA al día en la hoja; 3 pruebas al día aquí."), proText: nmT("All 6 functions, no daily cap, Fill selected cells, 200 rows per run here. Pay once.", "As 6 funções, sem limite diário, preencher as células selecionadas, 200 linhas por execução aqui. Pague uma vez.", "Las 6 funciones, sin límite diario, rellenar las celdas seleccionadas, 200 filas por ejecución aquí. Pague una vez.") });
  var PH = nmLang() === "en"
    ? { ai: "e.g. Reply politely to this review in one sentence", translate: "e.g. Spanish", extract: "e.g. email address", classify: "e.g. Praise, Complaint, Question", sentiment: "(nothing needed)" }
    : nmLang() === "es"
      ? { ai: "p. ej. Responda con educación a esta reseña en una frase", translate: "p. ej. español", extract: "p. ej. dirección de correo", classify: "p. ej. Elogio, Queja, Pregunta", sentiment: "(no hace falta nada)" }
      : { ai: "p. ex. Responda com educação a esta avaliação numa frase", translate: "p. ex. espanhol", extract: "p. ex. endereço de e-mail", classify: "p. ex. Elogio, Queixa, Pergunta", sentiment: "(não é preciso nada)" };
  $("fn").onchange = function () { $("arg").placeholder = PH[$("fn").value]; };
  function instr(fn, arg) {
    if (fn === "ai") return arg || "Improve this text";
    if (fn === "translate") return "Translate into " + (arg || "English") + ", keeping tone";
    if (fn === "extract") return "Extract the " + (arg || "key fact") + "; if not present, return an empty string";
    if (fn === "classify") return "Classify into exactly one of: " + (arg || "Positive, Negative") + "; return the category name only";
    return "Return one word: Positive, Neutral or Negative";
  }
  $("go").onclick = function () {
    var fn = $("fn").value;
    if (!NM.isPro() && ["extract", "classify", "sentiment"].indexOf(fn) >= 0) {
      // allow trying Pro functions in the playground, but tell the user
      NM.status("status", nmT("Preview of a Pro function (in your sheet it needs Pro)…", "Pré-visualização de uma função Pro (na folha precisa de Pro)…", "Vista previa de una función Pro (en la hoja necesita Pro)…"));
    }
    if (!NM.getKey()) return NM.status("status", NM.friendlyError("NOKEY"), "bad");
    if (!NM.canUse()) return NM.status("status", NM.limitMsg(), "bad");
    var rows = ($("rows").value || "").split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean);
    if (!rows.length) return NM.status("status", nmT("Paste at least one value.", "Cole pelo menos um valor.", "Pegue al menos un valor."), "bad");
    var max = NM.isPro() ? 200 : FREE_ROWS;
    if (rows.length > max) { rows = rows.slice(0, max); }
    var p = "You act as a spreadsheet AI function applied to each input separately. Task: " + instr(fn, ($("arg").value || "").trim()) +
      ".\nAnswers must be concise, plain text, no markdown, no preamble.\nReturn JSON only: {\"results\":[\"answer for input 1\", ...]} with exactly " + rows.length + " items, same order.\n\nINPUTS:\n" +
      rows.map(function (r, i) { return (i + 1) + ". " + r; }).join("\n");
    $("go").disabled = true; NM.status("status", nmT("Running " + rows.length + " rows…", "A executar " + rows.length + " linhas…", "Ejecutando " + rows.length + " filas…"));
    NM.gemini({ prompt: p, json: true, temperature: 0.3 }).then(function (d) {
      var res = (d && d.results) || [];
      NM.consume();
      var h = '<div class="scroll"><table><tr><th>#</th><th>' + nmT("A (input)", "A (entrada)", "A (entrada)") + '</th><th>B: =NETMEND_' + fn.toUpperCase() + '(A)</th></tr>';
      rows.forEach(function (r, i) { h += "<tr><td>" + (i + 2) + "</td><td>" + NM.esc(r) + "</td><td>" + NM.esc(res[i] == null ? "" : res[i]) + "</td></tr>"; });
      h += '</table></div><p class="nm-actions"><button class="btn ghost" type="button" id="cp">' + nmT("Copy column B", "Copiar a coluna B", "Copiar la columna B") + "</button></p>";
      $("out").innerHTML = h;
      $("cp").onclick = function () { NM.copy(rows.map(function (_, i) { return String(res[i] == null ? "" : res[i]).replace(/\s+/g, " "); }).join("\n"), this); };
      NM.status("status", nmT("Done. In your sheet this is one formula dragged down.", "Feito. Na folha isto é uma fórmula arrastada para baixo.", "Hecho. En la hoja esto es una fórmula arrastrada hacia abajo."), "ok");
    }).catch(function (e) { NM.status("status", NM.esc(NM.friendlyError(e)), "bad"); }).then(function () { $("go").disabled = false; });
  };
  $("copycode").onclick = function () {
    var b = this;
    fetch("Netmend.gs").then(function (r) { return r.text(); }).then(function (t) { NM.copy(t, b); });
  };
})();
