/* Netmend AskVideo: Gemini watches the YouTube URL once and writes timestamped notes; the chat then runs on those notes (fast, cheap). */
(function () {
  function nmLang(){var l=(document.documentElement.lang||"pt").toLowerCase();return l.indexOf("en")===0?"en":l.indexOf("es")===0?"es":"pt";}
  function nmT(en, pt, es){var l=nmLang();return l==="en"?en:l==="es"?es:pt;}
  var $ = NM.$, FREE_Q = 5, tab = "yt", ctx = null, asked = 0;
  NM.init({ tool: "askvideo", freeLimit: 3, unit: "videos", freeText: nmT("3 videos a day, 5 questions per video, summary and timestamps.", "3 vídeos por dia, 5 perguntas por vídeo, resumo e marcas de tempo.", "3 vídeos al día, 5 preguntas por vídeo, resumen y marcas de tiempo."), proText: nmT("Unlimited videos and questions, blog / thread / LinkedIn / study notes, Markdown export. Pay once.", "Vídeos e perguntas sem limite, artigo / fio / LinkedIn / notas de estudo, exportação Markdown. Pague uma vez.", "Vídeos y preguntas sin límite, artículo / hilo / LinkedIn / apuntes, exportación Markdown. Pague una vez."), onLicense: paintPro });
  document.querySelectorAll(".nm-tabs button").forEach(function (b) {
    b.onclick = function () {
      tab = b.getAttribute("data-tab");
      document.querySelectorAll(".nm-tabs button").forEach(function (x) { x.classList.toggle("on", x === b); });
      document.querySelectorAll(".nm-pane").forEach(function (p) { p.hidden = p.getAttribute("data-pane") !== tab; });
    };
  });
  function ytId(u) {
    var m = String(u).match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/|\/live\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  }
  function ts(s) { var p = String(s).split(":").map(Number), t = 0; p.forEach(function (x) { t = t * 60 + (x || 0); }); return t; }
  function linkify(text) {
    var safe = NM.esc(text);
    if (!ctx || !ctx.id) return safe;
    return safe.replace(/\b(\d{1,2}:\d{2}(?::\d{2})?)\b/g, function (m) { return '<a href="https://www.youtube.com/watch?v=' + ctx.id + "&t=" + ts(m) + 's" target="_blank" rel="noopener noreferrer">' + m + "</a>"; });
  }
  function analysisPrompt(lang) {
    return "Analyse this video. Write in " + lang + ". Return JSON only:\n" +
      '{"title":"video title or a short descriptive title","summary":"3-5 sentence summary","key_points":[{"time":"m:ss","point":"one line"}],"notes":"detailed notes of everything said and shown, in order, with m:ss timestamps every 30-90 seconds; include names, numbers, tools, prices, steps. 400-1500 words."}\n' +
      "Use 5-12 key_points. Only state what is in the video.";
  }
  function paintPro() {
    var a = $("proacts"); if (!a) return;
    var kindLabel = { "blog post": nmT("Make a blog post", "Fazer um artigo", "Hacer un artículo"), "X thread": nmT("Make an X thread", "Fazer um fio no X", "Hacer un hilo en X"), "LinkedIn post": nmT("Make a LinkedIn post", "Fazer uma publicação no LinkedIn", "Hacer una publicación de LinkedIn"), "study notes": nmT("Make study notes", "Fazer notas de estudo", "Hacer apuntes") };
    a.innerHTML = ["blog post", "X thread", "LinkedIn post", "study notes"].map(function (k) { return '<button class="btn ghost" type="button" data-gen="' + k + '">' + (NM.isPro() ? "" : "Pro: ") + kindLabel[k] + "</button>"; }).join("") +
      '<button class="btn ghost" type="button" id="mdx">' + (NM.isPro() ? "" : "Pro: ") + nmT("Export Markdown", "Exportar Markdown", "Exportar Markdown") + "</button>";
    a.querySelectorAll("[data-gen]").forEach(function (b) { b.onclick = function () { gen(b.getAttribute("data-gen")); }; });
    $("mdx").onclick = function () {
      if (!NM.isPro()) return NM.status("qstatus", nmT("Markdown export is part of Pro.", "A exportação Markdown faz parte do Pro.", "La exportación Markdown forma parte de Pro."), "bad");
      NM.download(new Blob([toMd()], { type: "text/markdown" }), NM.slug(ctx.title) + ".md");
    };
  }
  function toMd() {
    var o = "# " + ctx.title + "\n\n" + (ctx.url ? ctx.url + "\n\n" : "") + nmT("## Summary\n", "## Resumo\n", "## Resumen\n") + ctx.summary + nmT("\n\n## Key moments\n", "\n\n## Momentos-chave\n", "\n\n## Momentos clave\n");
    (ctx.key_points || []).forEach(function (k) { o += "- " + k.time + " " + k.point + "\n"; });
    o += nmT("\n## Q&A\n", "\n## Perguntas e respostas\n", "\n## Preguntas y respuestas\n"); document.querySelectorAll("#chat .nm-msg").forEach(function (m) { o += (m.classList.contains("me") ? nmT("\n**Q:** ", "\n**P:** ", "\n**P:** ") : nmT("**A:** ", "**R:** ", "**R:** ")) + m.textContent + "\n"; });
    return o;
  }
  function addMsg(text, me) {
    var d = document.createElement("div"); d.className = "nm-msg " + (me ? "me" : "ai");
    d.innerHTML = me ? NM.esc(text) : linkify(text); $("chat").appendChild(d); return d;
  }
  function render() {
    var h = '<h3 style="margin-top:18px">' + NM.esc(ctx.title || nmT("Video", "Vídeo", "Vídeo")) + "</h3>";
    if (ctx.id) h += '<p class="note"><a href="https://www.youtube.com/watch?v=' + ctx.id + '" target="_blank" rel="noopener noreferrer">' + nmT("Open on YouTube", "Abrir no YouTube", "Abrir en YouTube") + "</a></p>";
    h += "<p>" + linkify(ctx.summary || "") + "</p><h4>" + nmT("Key moments", "Momentos-chave", "Momentos clave") + "</h4><ul>";
    (ctx.key_points || []).forEach(function (k) { h += "<li>" + linkify((k.time ? k.time + " " : "") + k.point) + "</li>"; });
    h += "</ul>";
    $("out").innerHTML = h; $("chatbox").hidden = false; $("chat").innerHTML = ""; asked = 0; paintPro();
  }
  $("go").onclick = function () {
    if (!NM.getKey()) return NM.status("status", NM.friendlyError("NOKEY"), "bad");
    if (!NM.canUse()) return NM.status("status", NM.limitMsg(), "bad");
    var lang = $("lang").value, req, id = null, url = null;
    if (tab === "yt") {
      url = ($("yt").value || "").trim(); id = ytId(url);
      if (!id) return NM.status("status", nmT("That does not look like a YouTube video link.", "Isto não parece uma ligação de um vídeo do YouTube.", "Eso no parece un enlace de un vídeo de YouTube."), "bad");
      req = { parts: [{ fileData: { fileUri: "https://www.youtube.com/watch?v=" + id } }, { text: analysisPrompt(lang) }] };
    } else {
      var t = ($("tr").value || "").trim(); if (t.length < 100) return NM.status("status", nmT("Paste a longer transcript.", "Cole uma transcrição mais longa.", "Pegue una transcripción más larga."), "bad");
      req = { parts: [{ text: analysisPrompt(lang) + "\n\nTRANSCRIPT:\n" + t.slice(0, 400000) }] };
    }
    req.json = true; req.temperature = 0.3;
    req.onModel = function (m) { NM.status("status", (tab === "yt" ? nmT("Gemini is watching the video with ", "O Gemini está a ver o vídeo com ", "Gemini está viendo el vídeo con ") : nmT("Reading the transcript with ", "A ler a transcrição com ", "Leyendo la transcripción con ")) + m + "… (20–90 s)"); };
    $("go").disabled = true;
    NM.gemini(req).then(function (d) {
      if (!d || !d.summary) throw new Error(nmT("No analysis came back. Try again, or paste the transcript.", "Não voltou nenhuma análise. Tente outra vez ou cole a transcrição.", "No volvió ningún análisis. Inténtelo de nuevo o pegue la transcripción."));
      ctx = d; ctx.id = id; ctx.url = url; NM.consume(); render();
      NM.status("status", nmT("Done. Ask anything below.", "Feito. Pergunte o que quiser abaixo.", "Hecho. Pregunte lo que quiera abajo."), "ok");
    }).catch(function (e) {
      var m = NM.friendlyError(e);
      if (/video|fileUri|youtube|INVALID_ARGUMENT/i.test(m)) m = nmT("Gemini could not open this video (it must be public). Paste its transcript instead. Details: ", "O Gemini não conseguiu abrir este vídeo (tem de ser público). Cole a transcrição. Detalhe: ", "Gemini no pudo abrir este vídeo (tiene que ser público). Pegue la transcripción. Detalle: ") + m;
      NM.status("status", NM.esc(m), "bad");
    }).then(function () { $("go").disabled = false; });
  };
  function context() { return "VIDEO: " + ctx.title + "\nSUMMARY: " + ctx.summary + "\nTIMESTAMPED NOTES:\n" + ctx.notes; }
  function ask() {
    var q = ($("q").value || "").trim(); if (!q || !ctx) return;
    if (!NM.isPro() && asked >= FREE_Q) return NM.status("qstatus", nmT("Free plan: " + FREE_Q + " questions per video. Pro removes the limit.", "Plano grátis: " + FREE_Q + " perguntas por vídeo. O Pro tira o limite.", "Plan gratis: " + FREE_Q + " preguntas por vídeo. Pro quita el límite."), "bad");
    addMsg(q, true); $("q").value = ""; $("ask").disabled = true; NM.status("qstatus", nmT("Thinking…", "A pensar…", "Pensando…"));
    var hist = Array.prototype.map.call(document.querySelectorAll("#chat .nm-msg"), function (m) { return (m.classList.contains("me") ? "Q: " : "A: ") + m.textContent; }).slice(-10).join("\n");
    NM.gemini({ system: "You answer questions about one video using only the notes provided. Cite m:ss timestamps when relevant. If the notes do not cover it, say so. Answer in " + $("lang").value + ". Plain text, no markdown headings.", prompt: context() + "\n\nCONVERSATION SO FAR:\n" + hist + "\n\nQUESTION: " + q, temperature: 0.3 })
      .then(function (a) { asked++; addMsg(a.trim(), false); NM.status("qstatus", NM.isPro() ? "" : nmT((FREE_Q - asked) + " free questions left for this video.", "Restam " + (FREE_Q - asked) + " perguntas grátis neste vídeo.", "Quedan " + (FREE_Q - asked) + " preguntas gratis en este vídeo.")); })
      .catch(function (e) { NM.status("qstatus", NM.esc(NM.friendlyError(e)), "bad"); })
      .then(function () { $("ask").disabled = false; });
  }
  function gen(kind) {
    if (!NM.isPro()) return NM.status("qstatus", nmT("Making a " + kind + " is part of Pro.", "Isto faz parte do Pro.", "Esto forma parte de Pro."), "bad");
    NM.status("qstatus", nmT("Writing the " + kind + "…", "A escrever…", "Escribiendo…"));
    NM.gemini({ prompt: context() + "\n\nWrite a " + kind + " based on this video, in " + $("lang").value + ". Do not invent facts. Credit the video creator generically (\"in this video\").", temperature: 0.6 })
      .then(function (a) { addMsg("[" + kind + "]\n" + a.trim(), false); NM.status("qstatus", "", ""); })
      .catch(function (e) { NM.status("qstatus", NM.esc(NM.friendlyError(e)), "bad"); });
  }
  $("ask").onclick = ask;
  $("q").addEventListener("keydown", function (e) { if (e.key === "Enter") ask(); });
})();
