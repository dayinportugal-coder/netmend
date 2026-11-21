/* Netmend Chat PDF: PDFs as inline parts in the first turn, multi-turn chat with Gemini. */
(function () {
  function nmLang(){var l=(document.documentElement.lang||"pt").toLowerCase();return l.indexOf("en")===0?"en":l.indexOf("es")===0?"es":"pt";}
  function nmT(en, pt, es){var l=nmLang();return l==="en"?en:l==="es"?es:pt;}
  var $ = NM.$, parts = [], names = [], history = [];
  NM.init({ tool: "chat-pdf", freeLimit: 10, unit: "questions", freeText: nmT("10 questions a day, 1 PDF per chat, answers with page numbers.", "10 perguntas por dia, 1 PDF por conversa, respostas com números de página.", "10 preguntas al día, 1 PDF por conversación, respuestas con números de página."), proText: nmT("Unlimited questions, up to 5 PDFs per chat to compare, Markdown export. Pay once.", "Perguntas sem limite, até 5 PDF por conversa para comparar, exportação Markdown. Pague uma vez.", "Preguntas sin límite, hasta 5 PDF por conversación para comparar, exportación Markdown. Pague una vez.") });
  $("pdf").onchange = function () {
    var fs = Array.prototype.slice.call(this.files || []);
    var max = NM.isPro() ? 5 : 1;
    if (fs.length > max) { NM.status("files", NM.isPro() ? nmT("Up to 5 files.", "Até 5 ficheiros.", "Hasta 5 ficheros.") : nmT("Free plan: 1 PDF per chat. Pro compares up to 5. Using the first file.", "Plano grátis: 1 PDF por conversa. O Pro compara até 5. A usar o primeiro ficheiro.", "Plan gratis: 1 PDF por conversación. Pro compara hasta 5. Se usa el primer fichero."), "bad"); fs = fs.slice(0, max); }
    var total = fs.reduce(function (a, f) { return a + f.size; }, 0);
    if (total > 19 * 1024 * 1024) { parts = []; return NM.status("files", nmT("The files add up to more than 19 MB. Use smaller files.", "Os ficheiros somam mais de 19 MB. Use ficheiros mais pequenos.", "Los ficheros suman más de 19 MB. Use ficheros más pequeños."), "bad"); }
    Promise.all(fs.map(NM.fileToPart)).then(function (ps) {
      parts = ps.map(function (p) { p.inlineData.mimeType = "application/pdf"; return p; }); names = fs.map(function (f) { return f.name; });
      history = []; $("chat").innerHTML = ""; $("starters").hidden = !parts.length;
      if (parts.length) NM.status("files", nmT("Loaded: ", "Carregado: ", "Cargado: ") + names.map(NM.esc).join(", ") + nmT(". Ask a question or pick a starter.", ". Faça uma pergunta ou escolha um ponto de partida.", ". Haga una pregunta o elija un punto de partida."), "ok");
    });
  };
  function add(text, me) {
    var d = document.createElement("div"); d.className = "nm-msg " + (me ? "me" : "ai"); d.textContent = text; $("chat").appendChild(d); return d;
  }
  function ask(q) {
    q = (q || $("q").value || "").trim();
    if (!q) return;
    if (!parts.length) return NM.status("status", nmT("Choose a PDF first.", "Escolha primeiro um PDF.", "Elija primero un PDF."), "bad");
    if (!NM.getKey()) return NM.status("status", NM.friendlyError("NOKEY"), "bad");
    if (!NM.canUse()) return NM.status("status", NM.limitMsg(), "bad");
    add(q, true); $("q").value = ""; $("ask").disabled = true; NM.status("status", nmT("Reading the document…", "A ler o documento…", "Leyendo el documento…"));
    var first = { role: "user", parts: parts.concat([{ text: "Documents: " + names.join(", ") + ". Answer my questions using only these documents." }]) };
    var ack = { role: "model", parts: [{ text: "Understood. I will answer from the documents and cite page numbers." }] };
    var contents = [first, ack].concat(history, [{ role: "user", parts: [{ text: q }] }]);
    NM.gemini({ contents: contents, temperature: 0.2, system: "You answer questions about the user's PDF documents. Cite page numbers like (p. 4)" + (names.length > 1 ? " and the file name" : "") + ". If the answer is not in the documents, say so plainly. Reply in the language of the question. Plain text, short paragraphs or simple bullets with '-'." })
      .then(function (a) {
        history.push({ role: "user", parts: [{ text: q }] }, { role: "model", parts: [{ text: a }] });
        add(a.trim(), false); NM.consume(); NM.status("status", "", "");
      }).catch(function (e) { NM.status("status", NM.esc(NM.friendlyError(e)), "bad"); })
      .then(function () { $("ask").disabled = false; });
  }
  $("ask").onclick = function () { ask(); };
  $("q").addEventListener("keydown", function (e) { if (e.key === "Enter") ask(); });
  document.querySelectorAll("[data-q]").forEach(function (b) { b.onclick = function () { ask(b.getAttribute("data-q")); }; });
  $("reset").onclick = function () { history = []; $("chat").innerHTML = ""; };
  $("export").onclick = function () {
    if (!NM.isPro()) return NM.status("status", nmT("Chat export is part of Pro.", "A exportação da conversa faz parte do Pro.", "La exportación del chat forma parte de Pro."), "bad");
    var o = nmT("# Chat about ", "# Conversa sobre ", "# Conversación sobre ") + names.join(", ") + "\n\n";
    history.forEach(function (h) { o += (h.role === "user" ? nmT("**Q:** ", "**P:** ", "**P:** ") : nmT("**A:** ", "**R:** ", "**R:** ")) + h.parts[0].text + "\n\n"; });
    NM.download(new Blob([o], { type: "text/markdown" }), "chat-" + NM.slug(names[0]) + ".md");
  };
})();
