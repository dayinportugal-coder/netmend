/* Language switcher + first-visit fallback.
   Server redirects (Netlify Language / Country, cookie nf_lang) run on entry
   pages. This script never calls geolocation or an IP lookup.
   A saved choice (cookie nf_lang + localStorage) always wins over detection.
   Netlify reads nf_lang as the language and nf_country as the country. */
(function () {
  var COOKIE = "nf_lang";
  var COUNTRY = "nf_country";
  var LS = "nf_lang";
  var ENTRIES = {
    "/": 1,
    "/tools/": 1,
    "/statement/": 1,
    "/statement-to-csv/": 1,
    "/excel-functions/": 1,
    "/guides/": 1,
    "/compare/": 1,
    "/x-growth/": 1,
    "/sepa/": 1,
    "/efatura/": 1,
    "/formula/": 1,
    "/recibos-verdes/": 1
  };

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
    var country = lang === "pt" ? "pt" : lang === "es" ? "es" : "us";
    var sec = location.protocol === "https:" ? ";Secure" : "";
    document.cookie = COOKIE + "=" + lang + ";Path=/;Max-Age=31536000;SameSite=Lax" + sec;
    document.cookie = COUNTRY + "=" + country + ";Path=/;Max-Age=31536000;SameSite=Lax" + sec;
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

  function go(dest) {
    if (!dest || dest === pathOf()) return;
    location.replace(dest);
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
    if (stored === "pt" || stored === "en" || stored === "es") writePref(stored);
  }
  if (stored === "pt" || stored === "en" || stored === "es") {
    if (stored !== cur) go(urlFor(stored, p));
    return;
  }

  var ua = navigator.userAgent || "";
  if (/bot|crawler|spider|crawling|googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|facebookexternalhit|embedly|semrush|ahrefs/i.test(ua)) return;

  if (ENTRIES[p] && cur === "pt") {
    writePref("pt");
    return;
  }

  var want = pick(navigator.languages || [navigator.language || ""], toPt(p));
  writePref(want);
  if (want !== cur) go(urlFor(want, p));
})();
