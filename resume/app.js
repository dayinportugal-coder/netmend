/* Netmend Resume: local ATS keyword check + Gemini tailoring. No server. */
(function () {
  function nmLang(){var l=(document.documentElement.lang||"pt").toLowerCase();return l.indexOf("en")===0?"en":l.indexOf("es")===0?"es":"pt";}
  function nmT(en, pt, es){var l=nmLang();return l==="en"?en:l==="es"?es:pt;}
  var $ = NM.$, last = null;
  NM.init({ tool: "resume", freeLimit: 1, unit: "tailored CVs", freeText: nmT("Unlimited ATS keyword checks. 1 AI-tailored CV a day as a PDF.", "Verificações ATS de palavras-chave sem limite. 1 CV adaptado por IA por dia, em PDF.", "Comprobaciones ATS de palabras clave sin límite. 1 CV adaptado por IA al día, en PDF."), proText: nmT("Unlimited tailored CVs, cover letters, Modern template, Word export, no Netmend line. Pay once.", "CVs adaptados sem limite, cartas de apresentação, modelo Moderno, exportação Word, sem a linha Netmend. Pague uma vez.", "CV adaptados sin límite, cartas de presentación, plantilla Moderna, exportación Word, sin la línea de Netmend. Pague una vez.") });
  var STOP = ("a an and or the of to in on for with at by from as is are be will you your our we they this that it its their who what which our us able ability must should can may including include etc per about run own plan build lead drive help make get ensure eu remote hybrid full time part day days week weeks month plus nice have has had do does across within into over under more most other than such any all each both also new work working team role job position candidate company years year experience strong good great excellent plus based using use well looking join responsibilities requirements required preferred skills knowledge understanding de da do das dos e em para com por um uma os as o a que na no se ao sua seu experiência el la los las y en con para por una del al es son le les et des du pour avec dans sur une der die das und mit für von zu im den ein eine").split(" ");
  var STOPSET = {}; STOP.forEach(function (w) { STOPSET[w] = 1; });
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
  function words(s) { return norm(s).replace(/[^a-z0-9+#./ -]/g, " ").split(/\s+/).map(function (w) { return w.replace(/^[./-]+|[./-]+$/g, ""); }).filter(function (w) { return w.length > 1 && !STOPSET[w] && !/^\d+$/.test(w); }); }
  function keywords(job) {
    var freq = {}, proper = {};
    String(job).split(/[\n,.;:()\u2022|\/!?]+|\s[-\u2013\u2014]\s/).forEach(function (seg) {
      var raw = seg.trim().split(/\s+/).filter(Boolean);
      var ws = [];
      raw.forEach(function (t, i) {
        var w = words(t)[0]; if (!w) { ws.push(null); return; }
        ws.push(w); freq[w] = (freq[w] || 0) + 1;
        if (i > 0 && /^[A-Z0-9]/.test(t)) proper[w] = 1;
        if (/^[A-Z0-9]{2,6}$/.test(t.replace(/[^A-Za-z0-9]/g, ""))) proper[w] = 1;
      });
      for (var i = 0; i < ws.length - 1; i++) {
        if (!ws[i] || !ws[i + 1]) continue;
        var bg = ws[i] + " " + ws[i + 1]; freq[bg] = (freq[bg] || 0) + 1;
        if (/^[A-Z]/.test(raw[i]) && /^[A-Z0-9]/.test(raw[i + 1])) proper[bg] = 1;
      }
    });
    var list = Object.keys(freq).filter(function (k) {
      var two = k.indexOf(" ") > 0;
      if (two) return proper[k] || freq[k] >= 2;
      return proper[k] || freq[k] >= 2 || /[+#]|\.js$|sql|api|excel|crm|seo/.test(k);
    });
    function score(k) { return freq[k] * (k.indexOf(" ") > 0 ? 2.2 : 1) + (proper[k] ? 1.5 : 0); }
    list.sort(function (x, y) { return score(y) - score(x); });
    var out = [];
    list.forEach(function (k) {
      if (out.length >= 30) return;
      if (/^\d/.test(k)) return;
      if (k.indexOf(" ") < 0 && out.some(function (o) { return o.split(" ").indexOf(k) >= 0; })) return;
      out.push(k);
    });
    return out;
  }
  function ats() {
    var cv = $("cvtext").value, job = $("jobtext").value;
    if (cv.trim().length < 80 || job.trim().length < 80) { NM.status("status", nmT("Paste your CV and the job ad first (a few lines each at least).", "Cole primeiro o CV e o anúncio (pelo menos algumas linhas de cada).", "Pegue primero el CV y el anuncio (al menos unas líneas de cada uno)."), "bad"); return null; }
    var cvn = " " + words(cv).join(" ") + " ";
    var ks = keywords(job), hit = [], miss = [];
    ks.forEach(function (k) { (cvn.indexOf(" " + k + " ") >= 0 ? hit : miss).push(k); });
    var score = ks.length ? Math.round(100 * hit.length / ks.length) : 0;
    var verdict = score >= 70 ? nmT("Strong match", "Boa correspondência", "Buena coincidencia") : score >= 45 ? nmT("Partial match: add the missing words you really have", "Correspondência parcial: acrescente as palavras em falta que realmente tem", "Coincidencia parcial: añada las palabras que faltan y que de verdad tiene") : nmT("Weak match: tailor before you apply", "Correspondência fraca: adapte antes de se candidatar", "Coincidencia débil: adáptelo antes de presentarse");
    $("atsout").innerHTML = '<div class="card"><div class="ats"><div class="big">' + score + '%</div><div><b>' + nmT("ATS keyword match", "Correspondência ATS de palavras-chave", "Coincidencia ATS de palabras clave") + '</b><p class="note">' + verdict + nmT(". Checked " + ks.length + " key terms from the ad, in this browser only.", ". Verificados " + ks.length + " termos do anúncio, só neste browser.", ". Comprobados " + ks.length + " términos del anuncio, solo en este navegador.") + "</p></div></div>" +
      '<p class="note" style="margin-top:10px">' + nmT("In your CV", "No seu CV", "En su CV") + '</p><div class="chips">' + hit.map(function (k) { return '<span class="hit">' + NM.esc(k) + "</span>"; }).join("") + "</div>" +
      '<p class="note">' + nmT("Missing (add only if true for you)", "Em falta (acrescente só se for verdade)", "Faltan (añádalas solo si son ciertas)") + '</p><div class="chips">' + miss.map(function (k) { return '<span class="miss">' + NM.esc(k) + "</span>"; }).join("") + "</div></div>";
    $("atsout").hidden = false;
    return { score: score, miss: miss, hit: hit };
  }
  $("check").onclick = function () { if (ats()) NM.status("status", ""); };
  $("cvfile").onchange = function () {
    var f = this.files[0]; if (!f) return;
    if (/pdf$/i.test(f.type) || /\.pdf$/i.test(f.name)) {
      NM.status("status", nmT("Reading the PDF in your browser…", "A ler o PDF no seu browser…", "Leyendo el PDF en su navegador…"));
      f.arrayBuffer().then(function (buf) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
        return pdfjsLib.getDocument({ data: buf }).promise;
      }).then(function (pdf) {
        var ps = []; for (var i = 1; i <= Math.min(pdf.numPages, 6); i++) ps.push(pdf.getPage(i).then(function (p) { return p.getTextContent(); }).then(function (tc) {
          var out = "", y = null; tc.items.forEach(function (it) { var ny = it.transform[5]; if (y !== null && Math.abs(ny - y) > 2) out += "\n"; else if (out) out += " "; out += it.str; y = ny; }); return out;
        }));
        return Promise.all(ps);
      }).then(function (pages) { $("cvtext").value = pages.join("\n\n").replace(/[ \t]+\n/g, "\n"); NM.status("status", nmT("CV loaded. If it is a scanned image PDF, paste the text instead.", "CV carregado. Se for um PDF de imagem digitalizada, cole o texto.", "CV cargado. Si es un PDF de imagen escaneada, pegue el texto."), "ok"); })
        .catch(function () { NM.status("status", nmT("Could not read that PDF. Paste the text instead.", "Não foi possível ler esse PDF. Cole o texto.", "No se pudo leer ese PDF. Pegue el texto."), "bad"); });
    } else NM.readText(f).then(function (t) { $("cvtext").value = t; });
  };
  $("sample").onclick = function () {
    var lang = nmLang();
    if (lang === "pt") {
      $("cvtext").value = "Alex Morgan\nCoordenador de marketing · alex.morgan@example.com · Lisboa, Portugal\n\nRESUMO\nCoordenador de marketing com 4 anos em software B2B. Trata de newsletters, redes sociais e pequenas campanhas pagas.\n\nEXPERIÊNCIA\nCoordenador de marketing, Brightdesk (B2B SaaS) — 2022–atual\n- Fez a newsletter mensal para 18.000 subscritores; a taxa de abertura subiu de 24% para 31%\n- Geriu as contas de LinkedIn e X e planeou o calendário de conteúdos\n- Montou campanhas de Google Ads com um orçamento mensal de 2.000 EUR\n- Escreveu páginas de destino com a equipa de produto\n\nAssistente de marketing, Casa Verde Hotels — 2020–2022\n- Coordenou eventos e feiras\n- Atualizou o sítio em WordPress\n\nFORMAÇÃO\nLicenciatura em Comunicação, Universidade Nova de Lisboa, 2020\n\nCOMPETÊNCIAS\nMailchimp, WordPress, Google Ads, Canva, Excel, inglês (C1), português (nativo)";
      $("jobtext").value = "Growth Marketing Manager (remoto, UE)\nSomos uma empresa de B2B SaaS à procura de um Growth Marketing Manager para a geração de procura.\nResponsabilidades:\n- Tratar do email marketing e da automação de ciclo de vida no HubSpot\n- Planear e otimizar a aquisição paga em Google Ads e LinkedIn Ads\n- Fazer testes A/B em páginas de destino e reportar a taxa de conversão\n- Construir painéis no Google Analytics 4 e no Looker Studio\n- Trabalhar com as vendas na pontuação de leads e na conversão de MQL para SQL\nRequisitos:\n- 3 ou mais anos em marketing B2B SaaS\n- Prática com HubSpot, Google Ads, LinkedIn Ads, GA4\n- Boa redação em inglês; português ou espanhol é uma mais-valia\n- Orientado por dados, à vontade com Excel e com noções de SEO";
    } else if (lang === "es") {
      $("cvtext").value = "Alex Morgan\nCoordinador de marketing · alex.morgan@example.com · Lisboa, Portugal\n\nRESUMEN\nCoordinador de marketing con 4 años en software B2B. Lleva boletines, redes sociales y pequeñas campañas de pago.\n\nEXPERIENCIA\nCoordinador de marketing, Brightdesk (B2B SaaS) — 2022–actualidad\n- Llevó el boletín mensual a 18.000 suscriptores; la tasa de apertura subió del 24% al 31%\n- Gestionó las cuentas de LinkedIn y X y planificó el calendario de contenidos\n- Montó campañas de Google Ads con un presupuesto mensual de 2.000 EUR\n- Escribió páginas de destino con el equipo de producto\n\nAsistente de marketing, Casa Verde Hotels — 2020–2022\n- Coordinó eventos y ferias\n- Actualizó el sitio en WordPress\n\nFORMACIÓN\nGrado en Comunicación, Universidade Nova de Lisboa, 2020\n\nCOMPETENCIAS\nMailchimp, WordPress, Google Ads, Canva, Excel, inglés (C1), portugués (nativo)";
      $("jobtext").value = "Growth Marketing Manager (remoto, UE)\nSomos una empresa de B2B SaaS que busca un Growth Marketing Manager para la generación de demanda.\nResponsabilidades:\n- Llevar el email marketing y la automatización del ciclo de vida en HubSpot\n- Planificar y optimizar la adquisición de pago en Google Ads y LinkedIn Ads\n- Hacer pruebas A/B en páginas de destino e informar de la tasa de conversión\n- Construir paneles en Google Analytics 4 y Looker Studio\n- Trabajar con ventas en la puntuación de leads y la conversión de MQL a SQL\nRequisitos:\n- 3 o más años en marketing B2B SaaS\n- Práctica con HubSpot, Google Ads, LinkedIn Ads, GA4\n- Buena redacción en inglés; el portugués o el español es una ventaja\n- Orientado a datos, cómodo con Excel y con nociones de SEO";
    } else {
      $("cvtext").value = "Alex Morgan\nMarketing Coordinator · alex.morgan@example.com · Lisbon, Portugal\n\nSUMMARY\nMarketing coordinator with 4 years in B2B software. I run newsletters, social media and small paid campaigns.\n\nEXPERIENCE\nMarketing Coordinator, Brightdesk (B2B SaaS) — 2022–present\n- Ran the monthly newsletter to 18,000 subscribers; open rate up from 24% to 31%\n- Managed LinkedIn and X accounts, planned content calendar\n- Set up Google Ads campaigns with a 2,000 EUR monthly budget\n- Wrote landing pages with the product team\n\nMarketing Assistant, Casa Verde Hotels — 2020–2022\n- Coordinated events and trade fairs\n- Updated the website in WordPress\n\nEDUCATION\nBA Communication, Universidade Nova de Lisboa, 2020\n\nSKILLS\nMailchimp, WordPress, Google Ads, Canva, Excel, English (C1), Portuguese (native)";
      $("jobtext").value = "Growth Marketing Manager (remote, EU)\nWe are a B2B SaaS company looking for a Growth Marketing Manager to own demand generation.\nResponsibilities:\n- Own email marketing and lifecycle automation in HubSpot\n- Plan and optimise paid acquisition on Google Ads and LinkedIn Ads\n- Run A/B tests on landing pages and report on conversion rate\n- Build dashboards in Google Analytics 4 and Looker Studio\n- Work with sales on lead scoring and MQL to SQL conversion\nRequirements:\n- 3+ years in B2B SaaS marketing\n- Hands-on with HubSpot, Google Ads, LinkedIn Ads, GA4\n- Strong copywriting in English; Portuguese or Spanish is a plus\n- Data-driven, comfortable with Excel and SEO basics";
    }
    ats();
  };
  function list(a) { return (a || []).filter(Boolean); }
  function render(d) {
    var e = NM.esc, tpl = NM.isPro() ? $("tpl").value : "classic";
    var h = '<div class="cv ' + tpl + '"><h1>' + e(d.name) + "</h1>" + (d.headline ? '<p class="hl">' + e(d.headline) + "</p>" : "") + (d.contact ? '<p class="ct">' + e(d.contact) + "</p>" : "") +
      (d.summary ? "<h2>" + e(d.labels && d.labels.summary || nmT("Summary", "Resumo", "Resumen")) + "</h2><p>" + e(d.summary) + "</p>" : "") +
      (list(d.skills).length ? "<h2>" + e(d.labels && d.labels.skills || nmT("Skills", "Competências", "Competencias")) + "</h2><p>" + list(d.skills).map(e).join(" · ") + "</p>" : "") +
      (list(d.experience).length ? "<h2>" + e(d.labels && d.labels.experience || nmT("Experience", "Experiência", "Experiencia")) + "</h2>" + d.experience.map(function (x) {
        return '<div class="job"><div>' + e(x.title) + (x.company ? ", " + e(x.company) : "") + "</div><span>" + e(x.dates || "") + "</span></div><ul>" + list(x.bullets).map(function (b) { return "<li>" + e(b) + "</li>"; }).join("") + "</ul>";
      }).join("") : "") +
      (list(d.education).length ? "<h2>" + e(d.labels && d.labels.education || nmT("Education", "Formação", "Formación")) + "</h2>" + d.education.map(function (x) { return "<p>" + e(x) + "</p>"; }).join("") : "") +
      (list(d.extras).length ? "<h2>" + e(d.labels && d.labels.extras || nmT("Other", "Outros", "Otros")) + "</h2>" + d.extras.map(function (x) { return "<p>" + e(x) + "</p>"; }).join("") : "") +
      (NM.isPro() ? "" : '<p style="color:#999;font-size:10px;margin-top:24px">' + nmT("Tailored with Netmend Resume", "Adaptado com o Netmend Resume", "Adaptado con Netmend Resume") + "</p>") + "</div>";
    $("cvout").innerHTML = h;
    $("letterout").innerHTML = d.cover_letter ? '<div class="cv" style="margin-top:24px;page-break-before:always"><div class="letter">' + e(d.cover_letter) + "</div></div>" : "";
    $("cvsec").hidden = false; $("actions").hidden = false;
    $("changes").innerHTML = list(d.changes).length ? '<div class="card" style="margin-top:12px"><b>' + nmT("What changed (check each one)", "O que mudou (confira cada ponto)", "Qué cambió (compruebe cada punto)") + "</b><ul>" + d.changes.map(function (c) { return "<li>" + e(c) + "</li>"; }).join("") + "</ul></div>" : "";
    $("changes").hidden = !list(d.changes).length;
  }
  function asText(d) {
    var t = [d.name, d.headline, d.contact, "", (d.summary || ""), "", nmT("SKILLS", "COMPETÊNCIAS", "COMPETENCIAS"), list(d.skills).join(", "), "", nmT("EXPERIENCE", "EXPERIÊNCIA", "EXPERIENCIA")];
    list(d.experience).forEach(function (x) { t.push(x.title + (x.company ? ", " + x.company : "") + (x.dates ? " (" + x.dates + ")" : "")); list(x.bullets).forEach(function (b) { t.push("- " + b); }); t.push(""); });
    t.push(nmT("EDUCATION", "FORMAÇÃO", "FORMACIÓN")); t = t.concat(list(d.education)); if (list(d.extras).length) { t.push("", nmT("OTHER", "OUTROS", "OTROS")); t = t.concat(d.extras); }
    if (d.cover_letter) t.push("", nmT("COVER LETTER", "CARTA DE APRESENTAÇÃO", "CARTA DE PRESENTACIÓN"), d.cover_letter);
    return t.filter(function (x) { return x != null; }).join("\n");
  }
  $("go").onclick = function () {
    var a = ats(); if (!a) return;
    if (!NM.getKey()) return NM.status("status", NM.friendlyError("NOKEY"), "bad");
    if (!NM.canUse()) return NM.status("status", NM.limitMsg(), "bad");
    var wantLetter = $("letter").checked;
    if (wantLetter && !NM.isPro()) return NM.status("status", nmT("Cover letters are part of Pro. Untick the box or unlock Pro below.", "As cartas de apresentação fazem parte do Pro. Desmarque a caixa ou desbloqueie o Pro mais abaixo.", "Las cartas de presentación forman parte de Pro. Desmarque la casilla o desbloquee Pro más abajo."), "bad");
    if ($("tpl").value === "modern" && !NM.isPro()) NM.status("status", nmT("Modern template is Pro; using Classic.", "O modelo Moderno é Pro; a usar o Clássico.", "La plantilla Moderna es Pro; se usa la Clásica."));
    var lang = $("lang").value;
    var sys = "You are an expert CV writer and ATS specialist. Rewrite the candidate's CV for the job ad. HARD RULES: never invent employers, job titles, dates, degrees, certifications, tools, numbers or achievements that are not in the CV. You may reorder, rephrase, merge, cut and use the ad's wording for things the CV already shows. If a missing keyword is not supported by the CV, do not add it; mention it in changes as a gap. Keep contact details exactly as in the CV (do not add any). Bullets start with a strong verb, max 2 lines, keep real numbers. One page if possible." +
      " Language: " + (lang === "Same as the job ad" ? "the language of the job ad" : lang) + "." +
      " Return JSON only: {\"name\":\"\",\"headline\":\"target title line\",\"contact\":\"contact line copied from CV\",\"summary\":\"3 lines\",\"skills\":[\"...\"],\"experience\":[{\"title\":\"\",\"company\":\"\",\"dates\":\"\",\"bullets\":[\"...\"]}],\"education\":[\"one line each\"],\"extras\":[\"languages, certifications... only if in CV\"],\"labels\":{\"summary\":\"\",\"skills\":\"\",\"experience\":\"\",\"education\":\"\",\"extras\":\"\"},\"changes\":[\"what you changed and gaps you did NOT fill\"]" + (wantLetter ? ",\"cover_letter\":\"a 200-260 word cover letter with greeting and sign-off using only facts from the CV\"" : "") + "}";
    var prompt = "JOB AD:\n" + $("jobtext").value.slice(0, 12000) + "\n\nCV:\n" + $("cvtext").value.slice(0, 15000) + "\n\nKeywords the ad uses that the CV lacks (add only if the CV supports them): " + a.miss.join(", ");
    $("go").disabled = true; NM.status("status", nmT("Tailoring your CV… (10–30 seconds)", "A adaptar o CV… (10–30 segundos)", "Adaptando el CV… (10–30 segundos)"));
    NM.gemini({ prompt: prompt, system: sys, json: true, temperature: 0.3, models: ["gemini-3.5-flash", "gemini-flash-latest", "gemini-2.5-flash", "gemini-3.5-flash-lite", "gemini-flash-lite-latest"] }).then(function (d) {
      NM.consume(); last = d; render(d);
      NM.status("status", nmT("Done. Read every line, then download the PDF.", "Feito. Leia cada linha e depois transfira o PDF.", "Hecho. Lea cada línea y después descargue el PDF."), "ok");
      $("cvsec").scrollIntoView({ behavior: "smooth" });
    }).catch(function (e) { NM.status("status", NM.esc(NM.friendlyError(e)), "bad"); }).then(function () { $("go").disabled = false; });
  };
  $("pdf").onclick = function () { var t = document.title; document.title = NM.slug((last && last.name || "cv") + " cv"); window.print(); setTimeout(function () { document.title = t; }, 500); };
  $("copytxt").onclick = function () { if (last) NM.copy(asText(last), this); };
  $("doc").onclick = function () {
    if (!NM.isPro()) return NM.status("status", nmT("Word export is part of Pro.", "A exportação Word faz parte do Pro.", "La exportación a Word forma parte de Pro."), "bad");
    var html = '<html><head><meta charset="utf-8"></head><body style="font-family:Calibri,Arial,sans-serif">' + $("cvout").innerHTML + $("letterout").innerHTML + "</body></html>";
    NM.download(new Blob([html], { type: "application/msword" }), NM.slug((last && last.name || "cv") + " cv") + ".doc");
  };
})();
