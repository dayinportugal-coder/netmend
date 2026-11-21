/* Language switcher, entry-page redirect, and a banner on other pages.
   Server redirects (Netlify Language / Country, cookie nf_lang) run on entry
   pages. This script never calls geolocation or an IP lookup, and it does not
   set nf_country. A saved choice (cookie nf_lang + localStorage) overrides
   auto-detection on the home page and /tools/ only. Other pages show a
   dismissible banner instead of navigating away. */
(function () {
  var COOKIE = "nf_lang";
  var LS = "nf_lang";
  var DISMISS = "nf_lang_banner_off";
  var ENTRY = { "/": 1, "/tools/": 1, "/en/": 1, "/en/tools/": 1, "/es/": 1 };

  function pathOf() {
    var p = location.pathname || "/";
    if (/\.html?$/i.test(p)) p = p.replace(/index\.html$/i, "");
    if (!p.endsWith("/") && !/\.[a-z0-9]+$/i.test(p)) p += "/";
    if (p === "") p = "/";
    return p;
  }

  function currentLang(p) {
    if (p === "/es" || p.indexOf("/es/") === 0) return "es";
    if (p === "/en" || p.indexOf("/en/") === 0) return "en";
    return "pt";
  }

  function readCookie(name) {
    var m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return m ? decodeURIComponent(m[1]) : "";
  }

  function writePref(lang) {
    if (lang !== "pt" && lang !== "en" && lang !== "es") lang = "pt";
    var sec = location.protocol === "https:" ? ";Secure" : "";
    document.cookie = COOKIE + "=" + lang + ";Path=/;Max-Age=31536000;SameSite=Lax" + sec;
    try { localStorage.setItem(LS, lang); } catch (e) {}
  }

  function toPt(p) {
    if (p.indexOf("/en/freelancer-portugal-quarterly") === 0) return "/recibos-verdes/declaracao-trimestral/";
    if (p === "/en" || p === "/en/") return "/";
    if (p.indexOf("/en/") === 0) return p.slice(3) || "/";
    if (p.indexOf("/es/fichero-sepa") === 0) return "/sepa/";
    if (p === "/es" || p === "/es/") return "/";
    if (p.indexOf("/pt/efatura") === 0) return "/efatura/";
    if (p.indexOf("/pt/ficheiro-sepa") === 0) return "/sepa/";
    if (p.indexOf("/pt/recibos-verdes") === 0) return p.replace(/^\/pt/, "") || "/";
    if (p.indexOf("/freelancer-portugal-quarterly") === 0) return "/recibos-verdes/declaracao-trimestral/";
    return p;
  }

  function toEn(p) {
    var base = toPt(p);
    if (base.indexOf("/recibos-verdes/declaracao-trimestral") === 0) return "/en/freelancer-portugal-quarterly/";
    if (base === "/") return "/en/";
    return "/en" + base;
  }

  function toEs(p) {
    var base = toPt(p);
    if (base === "/") return "/es/";
    if (base === "/sepa/") return "/es/fichero-sepa/";
    return null;
  }

  function urlFor(lang, p) {
    if (lang === "en") return toEn(p);
    if (lang === "es") return toEs(p) || toEn(p);
    return toPt(p);
  }

  function withQuery(dest) {
    if (!dest) return dest;
    return dest + (location.search || "") + (location.hash || "");
  }

  function go(dest) {
    var url = withQuery(dest);
    if (!url || url === location.pathname + location.search + location.hash) return;
    location.replace(url);
  }

  function pick(list, ptPath) {
    var langs = list && list.length ? list : [];
    var i, tag;
    for (i = 0; i < langs.length; i++) {
      tag = String(langs[i] || "").toLowerCase();
      if (!tag || tag === "*") continue;
      if (tag.indexOf("pt") === 0) return "pt";
      if (tag.indexOf("es") === 0) return toEs(ptPath) ? "es" : "en";
      if (tag.indexOf("en") === 0) return "en";
      return "en";
    }
    return "pt";
  }

  function bannerCopy(fromLang, toLang) {
    if (fromLang === "pt" && toLang === "en") return { text: "Esta página também está em inglês.", link: "Ver em inglês" };
    if (fromLang === "pt" && toLang === "es") return { text: "Esta página também está em espanhol.", link: "Ver em espanhol" };
    if (fromLang === "en" && toLang === "pt") return { text: "This page is also available in Portuguese.", link: "View in Portuguese" };
    if (fromLang === "en" && toLang === "es") return { text: "Available in Spanish.", link: "View in Spanish" };
    if (fromLang === "es" && toLang === "pt") return { text: "Esta página también está en portugués.", link: "Ver en portugués" };
    if (fromLang === "es" && toLang === "en") return { text: "Disponible en inglés.", link: "Ver en inglés" };
    return { text: "Available in English.", link: "View in English" };
  }

  function showBanner(targetLang, href) {
    try { if (sessionStorage.getItem(DISMISS) === "1") return; } catch (e) {}
    if (document.getElementById("nm-lang-banner")) return;
    var copy = bannerCopy(currentLang(pathOf()), targetLang);
    var bar = document.createElement("div");
    bar.id = "nm-lang-banner";
    bar.setAttribute("role", "region");
    bar.innerHTML = '<p></p><a></a><button type="button" aria-label="Close">×</button>';
    bar.querySelector("p").textContent = copy.text;
    var a = bar.querySelector("a");
    a.textContent = copy.link;
    a.href = withQuery(href);
    a.addEventListener("click", function () { writePref(targetLang); });
    bar.querySelector("button").addEventListener("click", function () {
      try { sessionStorage.setItem(DISMISS, "1"); } catch (e) {}
      bar.remove();
    });
    document.body.appendChild(bar);
  }

  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[data-lang]") : null;
    if (!a) return;
    writePref(a.getAttribute("data-lang"));
  });

  var p = pathOf();
  var cur = currentLang(p);
  var stored = readCookie(COOKIE);
  if (stored !== "pt" && stored !== "en" && stored !== "es") {
    try { stored = localStorage.getItem(LS) || ""; } catch (e) { stored = ""; }
  }
  var ua = navigator.userAgent || "";
  var bot = /bot|crawler|spider|crawling|googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|facebookexternalhit|embedly|semrush|ahrefs/i.test(ua);

  if (stored === "pt" || stored === "en" || stored === "es") {
    if (stored !== cur && ENTRY[p]) go(urlFor(stored, p));
    else if (stored !== cur && !bot) showBanner(stored, urlFor(stored, p));
    return;
  }
  if (bot || ENTRY[p]) return;

  var want = pick(navigator.languages || [navigator.language || ""], toPt(p));
  if (want !== cur) showBanner(want, urlFor(want, p));
})();
