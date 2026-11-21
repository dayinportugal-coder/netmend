/* Netmend suite runtime. Static, no server, no trackers.
   Your Gemini key, usage counter and licence live only in this browser (localStorage).
   Network calls: Google Gemini API (with YOUR key) and Gumroad licence verification. */
(function () {
  var KEY_LS = "netmend-gemini-key";
  var MODELS = ["gemini-3.5-flash-lite", "gemini-flash-lite-latest", "gemini-3.5-flash", "gemini-flash-latest", "gemini-2.5-flash"];
  var REVERIFY_MS = 7 * 24 * 3600 * 1000;
  var NM = window.NM = {};
  var cfg = {};

  function nmLang(){var l=(document.documentElement.lang||"pt").toLowerCase();return l.indexOf("en")===0?"en":l.indexOf("es")===0?"es":"pt";}
  var LANG = nmLang();
  var T = ({
    en: {
      phSaved: "Key saved in this browser (paste a new one to replace it)",
      keySaved: "Gemini key saved on this device only.",
      keyOnlyGoogle: " It goes only to Google, never to Netmend.",
      phEmpty: "Paste your Gemini API key",
      keyNone: "No key saved yet. A free key from Google AI Studio is enough.",
      keyTitle: "Your Gemini API key (free)",
      keySteps: "<ol><li>Open <a href=\"https://aistudio.google.com/app/apikey\" target=\"_blank\" rel=\"noopener noreferrer\">aistudio.google.com</a> and sign in with any Google account.</li><li>Click <b>Create API key</b>. The free tier is enough.</li><li>Paste it here and click Save. It is stored only in this browser and shared by all Netmend tools on this device.</li></ol>",
      keyLabel: "Gemini API key",
      saveKey: "Save key", show: "Show", hide: "Hide", removeKey: "Remove key",
      pasteFirst: "Paste a key first.",
      proOn: "Pro active: no daily limit.",
      remain: "{n} of {max} free {unit} left today in this browser.",
      limit: "You have used the {max} free {unit} for today. Come back tomorrow, or unlock Pro (lifetime, one payment) below.",
      notOnSale: "Pro licences for this tool are not on sale yet. Email us and we will tell you when they open.",
      invalidKey: "Invalid licence key",
      proActive: "Pro is active in this browser.",
      removeLic: "Remove licence",
      buy: "Pro",
      buySoon: "Pro opens soon · get notified",
      mailSubject: " - tell me when it opens",
      planFree: "Free", priceFree: "Free", planPro: "Pro", pricePro: "Lifetime", priceProSmall: "one payment",
      gumroadNote: "Payment and the licence key email are handled by Gumroad, not this site. 14-day refund.",
      licLabel: "Already bought? Paste your licence key",
      activate: "Activate",
      pasteLic: "Paste the licence key from your Gumroad receipt.",
      checking: "Checking with Gumroad…",
      gumroadDown: "Could not reach Gumroad. Check your connection and try again.",
      licDead: "Licence no longer valid: ",
      nokey: "Save your free Gemini API key first (box above). It stays in this browser.",
      badKey: "Google rejected the API key. Copy the whole key again from aistudio.google.com.",
      quota: "Google's free quota for your key is used up for now. Wait a minute and try again.",
      network: "The browser could not reach Google's Gemini API. Check your connection. Nothing was sent to Netmend.",
      badFormat: "The model's answer was not in the expected format. Please try again.",
      emptyAnswer: "The model returned an empty answer",
      noModel: "No Gemini model accepted the request.",
      readFile: "Could not read the file.",
      copied: "Copied", copyPrompt: "Copy:",
      exTitle: "Example of what you get (no key needed to look)",
      exInput: "Input: ",
      exFoot: "To run it on your own content, add a free Gemini key below. It stays in this browser."
    },
    pt: {
      phSaved: "Chave guardada neste browser (cole uma nova para a substituir)",
      keySaved: "Chave Gemini guardada apenas neste dispositivo.",
      keyOnlyGoogle: " Segue só para a Google, nunca para a Netmend.",
      phEmpty: "Cole a chave da API Gemini",
      keyNone: "Ainda não há chave. Uma chave grátis do Google AI Studio chega.",
      keyTitle: "A sua chave da API Gemini (grátis)",
      keySteps: "<ol><li>Abra <a href=\"https://aistudio.google.com/app/apikey\" target=\"_blank\" rel=\"noopener noreferrer\">aistudio.google.com</a> e inicie sessão com qualquer conta Google.</li><li>Clique em <b>Criar chave de API</b>. O escalão grátis chega.</li><li>Cole-a aqui e clique em Guardar. Fica só neste browser e é partilhada por todas as ferramentas Netmend neste dispositivo.</li></ol>",
      keyLabel: "Chave da API Gemini",
      saveKey: "Guardar chave", show: "Mostrar", hide: "Ocultar", removeKey: "Remover chave",
      pasteFirst: "Cole primeiro uma chave.",
      proOn: "Pro ativo: sem limite diário.",
      remain: "Restam {n} de {max} {unit} grátis hoje neste browser.",
      limit: "O limite grátis de hoje ({max} {unit}) está esgotado. Volte amanhã ou desbloqueie o Pro (vitalício, pagamento único) mais abaixo.",
      notOnSale: "As licenças Pro desta ferramenta ainda não estão à venda. Escreva-nos e dizemos quando abrirem.",
      invalidKey: "Chave de licença inválida",
      proActive: "O Pro está ativo neste browser.",
      removeLic: "Remover licença",
      buy: "Licença vitalícia",
      buySoon: "O Pro abre em breve · avisar-me",
      mailSubject: " - avisem-me quando abrir",
      planFree: "Grátis", priceFree: "Grátis", planPro: "Pro", pricePro: "Licença vitalícia", priceProSmall: "pagamento único",
      gumroadNote: "O pagamento e o e-mail com a chave da licença são tratados pela Gumroad, não por este sítio. Reembolso de 14 dias.",
      licLabel: "Já comprou? Cole a chave da licença",
      activate: "Ativar",
      pasteLic: "Cole a chave da licença do recibo da Gumroad.",
      checking: "A verificar com a Gumroad…",
      gumroadDown: "Não foi possível contactar a Gumroad. Verifique a ligação e tente outra vez.",
      licDead: "A licença já não é válida: ",
      nokey: "Guarde primeiro a chave grátis da API Gemini (caixa acima). Fica neste browser.",
      badKey: "A Google rejeitou a chave da API. Copie a chave inteira outra vez de aistudio.google.com.",
      quota: "A quota grátis da Google para esta chave esgotou-se por agora. Espere um minuto e tente de novo.",
      network: "O browser não conseguiu chegar à API Gemini da Google. Verifique a ligação. Nada foi enviado para a Netmend.",
      badFormat: "A resposta do modelo não veio no formato esperado. Tente outra vez.",
      emptyAnswer: "O modelo devolveu uma resposta vazia",
      noModel: "Nenhum modelo Gemini aceitou o pedido.",
      readFile: "Não foi possível ler o ficheiro.",
      copied: "Copiado", copyPrompt: "Copiar:",
      exTitle: "Exemplo do que obtém (não precisa de chave para ver)",
      exInput: "Entrada: ",
      exFoot: "Para o usar no seu conteúdo, acrescente abaixo uma chave Gemini grátis. Fica neste browser."
    },
    es: {
      phSaved: "Clave guardada en este navegador (pegue una nueva para sustituirla)",
      keySaved: "Clave de Gemini guardada solo en este dispositivo.",
      keyOnlyGoogle: " Solo va a Google, nunca a Netmend.",
      phEmpty: "Pegue su clave de la API de Gemini",
      keyNone: "Todavía no hay clave. Una clave gratuita de Google AI Studio es suficiente.",
      keyTitle: "Su clave de la API de Gemini (gratis)",
      keySteps: "<ol><li>Abra <a href=\"https://aistudio.google.com/app/apikey\" target=\"_blank\" rel=\"noopener noreferrer\">aistudio.google.com</a> e inicie sesión con cualquier cuenta de Google.</li><li>Pulse <b>Crear clave de API</b>. El nivel gratuito es suficiente.</li><li>Péguela aquí y pulse Guardar. Se guarda solo en este navegador y la comparten todas las herramientas de Netmend en este dispositivo.</li></ol>",
      keyLabel: "Clave de la API de Gemini",
      saveKey: "Guardar clave", show: "Mostrar", hide: "Ocultar", removeKey: "Quitar clave",
      pasteFirst: "Pegue primero una clave.",
      proOn: "Pro activo: sin límite diario.",
      remain: "Quedan {n} de {max} {unit} gratis hoy en este navegador.",
      limit: "El límite gratis de hoy ({max} {unit}) está agotado. Vuelva mañana o desbloquee Pro (de por vida, un solo pago) más abajo.",
      notOnSale: "Las licencias Pro de esta herramienta aún no están a la venta. Escríbanos y le diremos cuándo se abren.",
      invalidKey: "Clave de licencia no válida",
      proActive: "Pro está activo en este navegador.",
      removeLic: "Quitar licencia",
      buy: "Licencia de por vida",
      buySoon: "Pro próximamente · avíseme",
      mailSubject: " - avísenme cuando se abra",
      planFree: "Gratis", priceFree: "Gratis", planPro: "Pro", pricePro: "Licencia de por vida", priceProSmall: "un solo pago",
      gumroadNote: "El pago y el correo con la clave de licencia los gestiona Gumroad, no este sitio. Reembolso de 14 días.",
      licLabel: "¿Ya lo ha comprado? Pegue su clave de licencia",
      activate: "Activar",
      pasteLic: "Pegue la clave de licencia del recibo de Gumroad.",
      checking: "Comprobando con Gumroad…",
      gumroadDown: "No se ha podido contactar con Gumroad. Compruebe la conexión e inténtelo de nuevo.",
      licDead: "La licencia ya no es válida: ",
      nokey: "Guarde primero la clave gratuita de la API de Gemini (cuadro de arriba). Se queda en este navegador.",
      badKey: "Google ha rechazado la clave de API. Copie la clave entera otra vez desde aistudio.google.com.",
      quota: "La cuota gratuita de Google para esta clave se ha agotado por ahora. Espere un minuto e inténtelo de nuevo.",
      network: "El navegador no ha podido llegar a la API Gemini de Google. Compruebe la conexión. No se ha enviado nada a Netmend.",
      badFormat: "La respuesta del modelo no vino en el formato esperado. Inténtelo de nuevo.",
      emptyAnswer: "El modelo devolvió una respuesta vacía",
      noModel: "Ningún modelo de Gemini aceptó la solicitud.",
      readFile: "No se pudo leer el fichero.",
      copied: "Copiado", copyPrompt: "Copiar:",
      exTitle: "Ejemplo de lo que obtiene (no hace falta clave para verlo)",
      exInput: "Entrada: ",
      exFoot: "Para usarlo con su propio contenido, añada abajo una clave gratuita de Gemini. Se queda en este navegador."
    }
  })[LANG];
  var UNIT = ({
    en: { statements: "statements", uses: "uses", runs: "runs", questions: "questions", formulas: "formulas", exports: "exports", batches: "batches", quizzes: "quizzes", decks: "decks", "tailored CVs": "tailored CVs", videos: "videos" },
    pt: { statements: "extratos", uses: "utilizações", runs: "execuções", questions: "perguntas", formulas: "fórmulas", exports: "exportações", batches: "lotes", quizzes: "questionários", decks: "apresentações", "tailored CVs": "CVs adaptados", videos: "vídeos" },
    es: { statements: "extractos", uses: "usos", runs: "ejecuciones", questions: "preguntas", formulas: "fórmulas", exports: "exportaciones", batches: "lotes", quizzes: "cuestionarios", decks: "presentaciones", "tailored CVs": "CV adaptados", videos: "vídeos" }
  })[LANG];
  function fill(s, map) { return s.replace(/\{(\w+)\}/g, function (_, k) { return map[k] == null ? "" : map[k]; }); }
  function unitWord() { var u = cfg.unit || "uses"; return (UNIT && UNIT[u]) || u; }

  function $(id) { return document.getElementById(id); }
  NM.$ = $;
  NM.esc = function (s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };
  function today() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function lsGet(k, def) { try { var v = localStorage.getItem(k); return v == null ? def : JSON.parse(v); } catch (e) { return def; } }
  function lsSet(k, v) { localStorage.setItem(k, JSON.stringify(v)); }

  /* ---------- key ---------- */
  NM.getKey = function () {
    return (localStorage.getItem(KEY_LS) || localStorage.getItem("netmend-xpw-gemini-key") || "").trim();
  };
  function paintKey() {
    var st = $("nm-key-status"), inp = $("nm-key-input");
    if (!st) return;
    if (NM.getKey()) {
      inp.value = ""; inp.placeholder = T.phSaved;
      st.innerHTML = '<span class="ok">' + T.keySaved + "</span>" + T.keyOnlyGoogle;
    } else {
      inp.placeholder = T.phEmpty;
      st.textContent = T.keyNone;
    }
  }
  function renderKeyBox(el) {
    el.className = "xpw-key nm-key";
    el.innerHTML =
      '<h3 style="margin:0 0 6px">' + T.keyTitle + "</h3>" +
      T.keySteps +
      '<label for="nm-key-input">' + T.keyLabel + "</label>" +
      '<input id="nm-key-input" type="password" autocomplete="off" spellcheck="false">' +
      '<p style="margin-top:12px"><button class="btn" type="button" id="nm-key-save">' + T.saveKey + "</button> " +
      '<button class="btn ghost" type="button" id="nm-key-show">' + T.show + "</button> " +
      '<button class="btn ghost" type="button" id="nm-key-clear">' + T.removeKey + "</button></p>" +
      '<p class="note" id="nm-key-status"></p>';
    $("nm-key-save").onclick = function () {
      var v = ($("nm-key-input").value || "").trim();
      if (!v) { $("nm-key-status").innerHTML = '<span class="bad">' + T.pasteFirst + "</span>"; return; }
      localStorage.setItem(KEY_LS, v); paintKey();
    };
    $("nm-key-show").onclick = function () {
      var i = $("nm-key-input"); i.type = i.type === "password" ? "text" : "password";
      this.textContent = i.type === "password" ? T.show : T.hide;
    };
    $("nm-key-clear").onclick = function () {
      localStorage.removeItem(KEY_LS); localStorage.removeItem("netmend-xpw-gemini-key"); paintKey();
    };
    paintKey();
  }

  /* ---------- usage (free tier) ---------- */
  function useKey(tool) { return "netmend-usage-" + tool; }
  NM.used = function (tool) {
    var u = lsGet(useKey(tool), {});
    return u.date === today() ? Number(u.count) || 0 : 0;
  };
  NM.remaining = function () {
    if (NM.isPro()) return Infinity;
    return Math.max(0, cfg.freeLimit - NM.used(cfg.tool));
  };
  NM.canUse = function () { return NM.remaining() > 0; };
  NM.consume = function () {
    if (NM.isPro()) return;
    lsSet(useKey(cfg.tool), { date: today(), count: NM.used(cfg.tool) + 1 });
    NM.paintRemain();
  };
  NM.paintRemain = function () {
    var el = $("nm-remain"); if (!el) return;
    if (NM.isPro()) { el.innerHTML = '<span class="ok">' + T.proOn + "</span>"; return; }
    var n = NM.remaining();
    el.textContent = fill(T.remain, { n: n, max: cfg.freeLimit, unit: unitWord() });
  };
  NM.limitMsg = function () {
    return fill(T.limit, { max: cfg.freeLimit, unit: unitWord() });
  };

  /* ---------- licence (Gumroad) ---------- */
  function licKey(tool) { return "netmend-license-" + tool; }
  NM.product = function () { return (window.NM_PRODUCTS || {})[cfg.tool] || {}; };
  NM.isPro = function () { var l = lsGet(licKey(cfg.tool), null); return !!(l && l.pro); };
  NM.verifyLicense = function (key, increment) {
    var p = NM.product();
    if (!p.productId) return Promise.resolve({ valid: false, message: T.notOnSale });
    var body = new URLSearchParams({ product_id: p.productId, license_key: String(key).trim(), increment_uses_count: increment ? "true" : "false" });
    return fetch("https://api.gumroad.com/v2/licenses/verify", { method: "POST", body: body }).then(function (r) {
      return r.json().catch(function () { return {}; });
    }).then(function (d) {
      var pu = d.purchase || {};
      var valid = !!d.success && !pu.refunded && !pu.chargebacked && !pu.disputed;
      return { valid: valid, message: d.message || (valid ? "ok" : T.invalidKey), uses: d.uses };
    });
  };
  function paintLicense() {
    var st = $("nm-lic-status"); if (!st) return;
    var l = lsGet(licKey(cfg.tool), null);
    if (l && l.pro) st.innerHTML = '<span class="ok">' + T.proActive + '</span> <button class="btn ghost" type="button" id="nm-lic-remove">' + T.removeLic + "</button>";
    else st.textContent = (l && l.message) ? l.message : "";
    var rm = $("nm-lic-remove");
    if (rm) rm.onclick = function () { localStorage.removeItem(licKey(cfg.tool)); paintLicense(); NM.paintRemain(); if (cfg.onLicense) cfg.onLicense(false); };
  }
  function renderLicenseBox(el) {
    var p = NM.product();
    var buy = p.url
      ? '<a class="btn" id="nm-buy" href="' + NM.esc(p.url) + '" target="_blank" rel="noopener noreferrer">' + T.buy + "</a>"
      : '<a class="btn" id="nm-buy" href="mailto:dayinportugal@gmail.com?subject=' + encodeURIComponent((p.name || "Netmend Pro") + T.mailSubject) + '">' + T.buySoon + "</a>";
    el.innerHTML =
      '<div class="grid nm-plans">' +
      '<div class="card"><b>' + T.planFree + '</b><div class="price">' + T.priceFree + "</div><p>" + NM.esc(cfg.freeText || "") + "</p></div>" +
      '<div class="card"><b>' + T.planPro + '</b><div class="price">' + T.pricePro + " <small>" + T.priceProSmall + "</small></div><p>" + NM.esc(cfg.proText || "") + "</p></div></div>" +
      '<p style="margin-top:18px">' + buy + "</p>" +
      '<p class="note">' + T.gumroadNote + "</p>" +
      '<label for="nm-lic-input">' + T.licLabel + "</label>" +
      '<div class="nm-inline"><input id="nm-lic-input" type="text" autocomplete="off" spellcheck="false" placeholder="XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX">' +
      '<button class="btn sec" type="button" id="nm-lic-go">' + T.activate + "</button></div>" +
      '<p class="note" id="nm-lic-status"></p>';
    $("nm-lic-go").onclick = function () {
      var k = ($("nm-lic-input").value || "").trim();
      var st = $("nm-lic-status");
      if (!k) { st.innerHTML = '<span class="bad">' + T.pasteLic + "</span>"; return; }
      st.textContent = T.checking;
      NM.verifyLicense(k, true).then(function (r) {
        if (r.valid) lsSet(licKey(cfg.tool), { key: k, pro: true, verifiedAt: Date.now() });
        else lsSet(licKey(cfg.tool), { pro: false, message: r.message });
        paintLicense(); NM.paintRemain(); if (cfg.onLicense) cfg.onLicense(r.valid);
        if (!r.valid) st.innerHTML = '<span class="bad">' + NM.esc(r.message) + "</span>";
      }).catch(function () { st.innerHTML = '<span class="bad">' + T.gumroadDown + "</span>"; });
    };
    paintLicense();
  }
  function reverify() {
    var l = lsGet(licKey(cfg.tool), null);
    if (!l || !l.pro || !l.key || Date.now() - (l.verifiedAt || 0) < REVERIFY_MS) return;
    NM.verifyLicense(l.key, false).then(function (r) {
      if (r.valid) { l.verifiedAt = Date.now(); lsSet(licKey(cfg.tool), l); }
      else { lsSet(licKey(cfg.tool), { pro: false, message: T.licDead + r.message }); paintLicense(); NM.paintRemain(); }
    }).catch(function () {});
  }

  /* ---------- Gemini ---------- */
  NM.extractJson = function (text) {
    var t = String(text || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
    try { return JSON.parse(t); } catch (e) {}
    var a = t.indexOf("{"), b = t.lastIndexOf("}");
    if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch (e) {} }
    var c = t.indexOf("["), d = t.lastIndexOf("]");
    if (c >= 0 && d > c) { try { return JSON.parse(t.slice(c, d + 1)); } catch (e) {} }
    throw new Error("The model's answer was not in the expected format. Please try again.");
  };
  function callModel(model, key, req) {
    var body = { contents: req.contents, generationConfig: { temperature: req.temperature == null ? 0.7 : req.temperature } };
    if (req.system) body.systemInstruction = { parts: [{ text: req.system }] };
    if (req.json && !req.tools) body.generationConfig.responseMimeType = "application/json";
    if (req.tools) body.tools = req.tools;
    return fetch("https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent", {
      method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": key }, body: JSON.stringify(body)
    }).then(function (res) {
      return res.text().then(function (raw) {
        var data = null; try { data = JSON.parse(raw); } catch (e) {}
        if (!res.ok) { var err = new Error((data && data.error && data.error.message) || ("HTTP " + res.status)); err.status = res.status; throw err; }
        var c = data && data.candidates && data.candidates[0];
        var text = c && c.content && c.content.parts ? c.content.parts.map(function (p) { return p.thought ? "" : (p.text || ""); }).join("") : "";
        if (!text) { var e2 = new Error("The model returned an empty answer" + (c && c.finishReason ? " (" + c.finishReason + ")" : "") + "."); e2.status = 500; throw e2; }
        return text;
      });
    });
  }
  /* req: {contents | prompt, parts, system, json, tools, temperature, onModel, models (optional order override)} */
  NM.gemini = function (req) {
    var key = NM.getKey();
    if (!key) return Promise.reject(new Error("NOKEY"));
    if (!req.contents) req.contents = [{ role: "user", parts: req.parts || [{ text: req.prompt }] }];
    var i = 0, lastErr, list = req.models || MODELS;
    function next() {
      if (i >= list.length) return Promise.reject(lastErr || new Error("No Gemini model accepted the request."));
      var m = list[i++];
      if (req.onModel) req.onModel(m);
      return callModel(m, key, req).then(function (t) { return req.json ? NM.extractJson(t) : t; }).catch(function (err) {
        lastErr = err;
        var s = err.status, msg = String(err.message || "");
        var retry = s === 404 || s === 429 || s === 500 || s === 503 || /not found|no longer available|not supported|overloaded|expected format/i.test(msg);
        if (s === 400 && /model/i.test(msg)) retry = true;
        if (retry && i < list.length) return next();
        throw err;
      });
    }
    return next();
  };
  NM.friendlyError = function (err) {
    var m = String((err && err.message) || err);
    if (m === "NOKEY") return T.nokey;
    if (/API key not valid|API_KEY_INVALID|PERMISSION_DENIED|401|403/i.test(m)) return T.badKey;
    if (/quota|RESOURCE_EXHAUSTED|429/i.test(m)) return T.quota;
    if (/Failed to fetch|NetworkError|Load failed/i.test(m)) return T.network;
    if (/expected format/i.test(m)) return T.badFormat;
    if (/The model returned an empty answer/i.test(m)) return T.emptyAnswer + m.replace(/^The model returned an empty answer/, "");
    if (/No Gemini model accepted the request/i.test(m)) return T.noModel;
    if (/Could not read the file/i.test(m)) return T.readFile;
    return m;
  };
  NM.fileToPart = function (file) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () { resolve({ inlineData: { mimeType: file.type || "application/pdf", data: String(r.result).split(",")[1] } }); };
      r.onerror = function () { reject(new Error("Could not read the file.")); };
      r.readAsDataURL(file);
    });
  };
  NM.readText = function (file) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader(); r.onload = function () { resolve(String(r.result)); }; r.onerror = reject; r.readAsText(file);
    });
  };
  NM.download = function (blob, name) {
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  };
  NM.status = function (el, html, kind) {
    if (typeof el === "string") el = $(el);
    el.innerHTML = kind ? '<span class="' + kind + '">' + html + "</span>" : html;
  };
  NM.slug = function (s) { return String(s || "netmend").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "netmend"; };
  NM.copy = function (text, btn) {
    function done() { if (!btn) return; var o = btn.textContent; btn.textContent = T.copied; setTimeout(function () { btn.textContent = o; }, 1200); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done).catch(function () { window.prompt(T.copyPrompt, text); });
    else window.prompt(T.copyPrompt, text);
  };


  /* ---------- example output, shown before the key is asked for ---------- */
  var EX_EN = {
    "formula": { ask: "Sum column C when column A is \"Lisbon\" and the date in B is in March 2026.",
      out: "<pre>=SUMIFS(C:C, A:A, \"Lisbon\", B:B, \"&gt;=\"&amp;DATE(2026,3,1), B:B, \"&lt;\"&amp;DATE(2026,4,1))</pre><p>Adds the values in C only for rows where A is Lisbon and B is on or after 1 March and before 1 April 2026. In European Excel the commas become semicolons.</p>" },
    "chat-pdf": { ask: "Question about a 12-page rental contract: \"How much notice do I have to give to leave?\"",
      out: "<p>You must give <b>at least 60 days' written notice</b> before the date you want to leave (page 4, clause 7.2). If you leave in the first 12 months, one month's rent is kept from the deposit (page 5, clause 8.1).</p>" },
    "askvideo": { ask: "A 14-minute YouTube tutorial on pivot tables.",
      out: "<p><b>Summary:</b> how to build a pivot table from a sales list, group dates by month and add a percentage column.</p><ul><li><b>01:10</b> Turn the range into a table first</li><li><b>04:35</b> Group dates by month and year</li><li><b>09:20</b> Show values as % of the grand total</li></ul>" },
    "quiz": { ask: "A one-page text about the water cycle, 3 questions.",
      out: "<ol><li>What process turns liquid water into vapour? <i>a) Condensation b) <b>Evaporation</b> c) Precipitation</i></li><li>Clouds form mainly through… <i>a) <b>Condensation</b> b) Infiltration c) Runoff</i></li><li>True or false: groundwater is part of the water cycle. <i><b>True</b></i></li></ol><p>Exports: Google Form (self-grading), CSV, Kahoot sheet, Moodle GIFT, printable test.</p>" },
    "slides": { ask: "Topic: \"Onboarding plan for a new bookkeeper\", 5 slides.",
      out: "<ol><li>Welcome and first-week goals</li><li>Tools and access: accounting software, bank feeds, shared drive</li><li>Monthly close checklist</li><li>Who to ask: contacts and response times</li><li>30-60-90 day milestones</li></ol><p>Each slide comes with 3 to 5 bullet points and speaker notes, in an editable .pptx file.</p>" },
    "sheets-ai": { ask: "=NETMEND_AI(\"Category of this expense\", A2) on a column of card transactions.",
      out: "<table><tr><th>A (your data)</th><th>Result</th></tr><tr><td>UBER *TRIP LISBOA</td><td>Transport</td></tr><tr><td>CONTINENTE MATOSINHOS</td><td>Groceries</td></tr><tr><td>ADOBE *CREATIVE CLD</td><td>Software</td></tr></table>" },
    "resume": { ask: "A CV for an accounts assistant and a job ad that asks for \"reconciliations, SAP, VAT returns\".",
      out: "<p><b>Keyword match: 6 of 10.</b> Missing: <i>SAP</i>, <i>VAT returns</i>, <i>month-end close</i>, <i>accruals</i>.</p><p>Rewritten bullet: \"Reconciled 14 bank and supplier accounts every month and prepared quarterly VAT returns, cutting month-end close from 6 to 4 days.\"</p>" }
  };
  var EX_PT = {
    "formula": { ask: "Somar a coluna C quando a coluna A é \"Lisboa\" e a data em B é de março de 2026.",
      out: "<pre>=SUMIFS(C:C, A:A, \"Lisboa\", B:B, \"&gt;=\"&amp;DATE(2026,3,1), B:B, \"&lt;\"&amp;DATE(2026,4,1))</pre><p>Soma os valores de C só nas linhas em que A é Lisboa e B é a partir de 1 de março e antes de 1 de abril de 2026. No Excel europeu as vírgulas passam a ponto e vírgula.</p>" },
    "chat-pdf": { ask: "Pergunta sobre um contrato de arrendamento de 12 páginas: \"Com que antecedência tenho de avisar para sair?\"",
      out: "<p>Tem de dar <b>pelo menos 60 dias de aviso por escrito</b> antes da data em que quer sair (página 4, cláusula 7.2). Se sair nos primeiros 12 meses, fica retida uma renda da caução (página 5, cláusula 8.1).</p>" },
    "askvideo": { ask: "Um tutorial de 14 minutos no YouTube sobre tabelas dinâmicas.",
      out: "<p><b>Resumo:</b> como criar uma tabela dinâmica a partir de uma lista de vendas, agrupar datas por mês e acrescentar uma coluna de percentagem.</p><ul><li><b>01:10</b> Transformar primeiro o intervalo numa tabela</li><li><b>04:35</b> Agrupar datas por mês e ano</li><li><b>09:20</b> Mostrar os valores como % do total geral</li></ul>" },
    "quiz": { ask: "Um texto de uma página sobre o ciclo da água, 3 perguntas.",
      out: "<ol><li>Que processo transforma a água líquida em vapor? <i>a) Condensação b) <b>Evaporação</b> c) Precipitação</i></li><li>As nuvens formam-se sobretudo por… <i>a) <b>Condensação</b> b) Infiltração c) Escoamento</i></li><li>Verdadeiro ou falso: a água subterrânea faz parte do ciclo da água. <i><b>Verdadeiro</b></i></li></ol><p>Exportações: Google Forms (com correção), CSV, folha Kahoot, Moodle GIFT, teste para imprimir.</p>" },
    "slides": { ask: "Tema: \"Plano de integração de um novo técnico de contabilidade\", 5 diapositivos.",
      out: "<ol><li>Boas-vindas e objetivos da primeira semana</li><li>Ferramentas e acessos: programa de contabilidade, extratos bancários, pasta partilhada</li><li>Lista do fecho mensal</li><li>A quem perguntar: contactos e prazos de resposta</li><li>Marcos aos 30, 60 e 90 dias</li></ol><p>Cada diapositivo traz 3 a 5 tópicos e notas do orador, num ficheiro .pptx editável.</p>" },
    "sheets-ai": { ask: "=NETMEND_AI(\"Categoria desta despesa\", A2) numa coluna de movimentos do cartão.",
      out: "<table><tr><th>A (os seus dados)</th><th>Resultado</th></tr><tr><td>UBER *TRIP LISBOA</td><td>Transporte</td></tr><tr><td>CONTINENTE MATOSINHOS</td><td>Mercearia</td></tr><tr><td>ADOBE *CREATIVE CLD</td><td>Software</td></tr></table>" },
    "resume": { ask: "Um CV de assistente de contabilidade e um anúncio que pede \"reconciliações, SAP, declarações de IVA\".",
      out: "<p><b>Correspondência de palavras-chave: 6 de 10.</b> Em falta: <i>SAP</i>, <i>declarações de IVA</i>, <i>fecho mensal</i>, <i>acréscimos</i>.</p><p>Tópico reescrito: \"Reconciliou 14 contas bancárias e de fornecedores todos os meses e preparou as declarações trimestrais de IVA, reduzindo o fecho mensal de 6 para 4 dias.\"</p>" }
  };
  var EX_ES = {
    "formula": { ask: "Sumar la columna C cuando la columna A es \"Lisboa\" y la fecha de B es de marzo de 2026.",
      out: "<pre>=SUMIFS(C:C, A:A, \"Lisboa\", B:B, \"&gt;=\"&amp;DATE(2026,3,1), B:B, \"&lt;\"&amp;DATE(2026,4,1))</pre><p>Suma los valores de C solo en las filas en las que A es Lisboa y B es el 1 de marzo o posterior y anterior al 1 de abril de 2026. En Excel europeo las comas pasan a ser punto y coma.</p>" },
    "chat-pdf": { ask: "Pregunta sobre un contrato de alquiler de 12 páginas: \"¿Con cuánta antelación tengo que avisar para irme?\"",
      out: "<p>Debe dar <b>al menos 60 días de preaviso por escrito</b> antes de la fecha en la que quiere irse (página 4, cláusula 7.2). Si se va en los primeros 12 meses, se retiene un mes de renta de la fianza (página 5, cláusula 8.1).</p>" },
    "askvideo": { ask: "Un tutorial de 14 minutos en YouTube sobre tablas dinámicas.",
      out: "<p><b>Resumen:</b> cómo crear una tabla dinámica a partir de una lista de ventas, agrupar fechas por mes y añadir una columna de porcentaje.</p><ul><li><b>01:10</b> Convertir primero el rango en una tabla</li><li><b>04:35</b> Agrupar fechas por mes y año</li><li><b>09:20</b> Mostrar los valores como % del total general</li></ul>" },
    "quiz": { ask: "Un texto de una página sobre el ciclo del agua, 3 preguntas.",
      out: "<ol><li>¿Qué proceso convierte el agua líquida en vapor? <i>a) Condensación b) <b>Evaporación</b> c) Precipitación</i></li><li>Las nubes se forman sobre todo por… <i>a) <b>Condensación</b> b) Infiltración c) Escorrentía</i></li><li>Verdadero o falso: el agua subterránea forma parte del ciclo del agua. <i><b>Verdadero</b></i></li></ol><p>Exportaciones: Google Forms (con corrección), CSV, hoja de Kahoot, Moodle GIFT, examen para imprimir.</p>" },
    "slides": { ask: "Tema: \"Plan de incorporación de un nuevo técnico contable\", 5 diapositivas.",
      out: "<ol><li>Bienvenida y objetivos de la primera semana</li><li>Herramientas y accesos: programa de contabilidad, extractos bancarios, carpeta compartida</li><li>Lista del cierre mensual</li><li>A quién preguntar: contactos y plazos de respuesta</li><li>Hitos a 30, 60 y 90 días</li></ol><p>Cada diapositiva incluye de 3 a 5 viñetas y notas del orador, en un fichero .pptx editable.</p>" },
    "sheets-ai": { ask: "=NETMEND_AI(\"Categoría de este gasto\", A2) en una columna de movimientos de tarjeta.",
      out: "<table><tr><th>A (sus datos)</th><th>Resultado</th></tr><tr><td>UBER *TRIP LISBOA</td><td>Transporte</td></tr><tr><td>CONTINENTE MATOSINHOS</td><td>Alimentación</td></tr><tr><td>ADOBE *CREATIVE CLD</td><td>Software</td></tr></table>" },
    "resume": { ask: "Un CV de auxiliar contable y un anuncio que pide \"conciliaciones, SAP, declaraciones de IVA\".",
      out: "<p><b>Coincidencia de palabras clave: 6 de 10.</b> Faltan: <i>SAP</i>, <i>declaraciones de IVA</i>, <i>cierre mensual</i>, <i>periodificaciones</i>.</p><p>Viñeta reescrita: \"Concilió 14 cuentas bancarias y de proveedores cada mes y preparó las declaraciones trimestrales de IVA, reduciendo el cierre mensual de 6 a 4 días.\"</p>" }
  };
  var EXAMPLES = LANG === "en" ? EX_EN : LANG === "es" ? EX_ES : EX_PT;
  function renderExample(beforeEl) {
    var e = EXAMPLES[cfg.tool];
    if (!e || !beforeEl || $("nm-example")) return;
    var d = document.createElement("div");
    d.id = "nm-example"; d.className = "example nm-example";
    d.innerHTML = '<p class="lbl" style="margin:0 0 6px;font-weight:600">' + T.exTitle + "</p>" +
      '<p class="note" style="margin:0 0 10px">' + T.exInput + NM.esc(e.ask) + "</p>" + e.out +
      '<p class="note" style="margin:10px 0 0">' + T.exFoot + "</p>";
    d.style.padding = "18px 20px"; d.style.marginBottom = "16px";
    beforeEl.parentNode.insertBefore(d, beforeEl);
  }

  /* opts: {tool, freeLimit, unit, freeText, proText, onLicense} */
  NM.init = function (opts) {
    cfg = opts;
    var k = $("nm-key"); if (k) { renderExample(k); renderKeyBox(k); }
    var l = $("nm-license"); if (l) renderLicenseBox(l);
    NM.paintRemain(); reverify();
  };
})();
