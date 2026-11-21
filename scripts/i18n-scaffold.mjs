#!/usr/bin/env node
/* One-shot scaffold: mirror English pages under /en/, make root pages the
   pt-PT shell (content translated afterwards), promote existing /pt/ pages,
   301 the duplicate /pt/ URLs, and write hreflang, the switcher, sitemap
   and _redirects. Safe to re-run only on a clean English tree. */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const ORIGIN = "https://netmend.app";
const SKIP_DIRS = new Set([".git", "node_modules", "tests", "en", ".netlify", "scripts", "pt", "es"]);

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const rel = path.relative(ROOT, full);
    if (rel.split(path.sep).some((p) => SKIP_DIRS.has(p))) continue;
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (name.endsWith(".html") && !name.startsWith("google")) out.push(full);
  }
  return out;
}

function toUrl(file) {
  let rel = path.relative(ROOT, file).split(path.sep).join("/");
  if (rel.endsWith("/index.html")) rel = rel.slice(0, -"index.html".length);
  else if (rel === "index.html") rel = "";
  if (!rel.startsWith("/")) rel = "/" + rel;
  if (!rel.endsWith("/") && !rel.endsWith(".html")) rel += "/";
  if (rel === "") rel = "/";
  return rel;
}

function fileForUrl(urlPath) {
  if (urlPath.endsWith(".html")) return path.join(ROOT, urlPath.slice(1));
  const rel = urlPath === "/" ? "index.html" : urlPath.slice(1) + "index.html";
  return path.join(ROOT, rel);
}

const files = walk(ROOT);
const pages = new Set(files.map(toUrl));
[
  "/es/",
  "/es/fichero-sepa/",
  "/pt/efatura/",
  "/pt/ficheiro-sepa/",
  "/pt/recibos-verdes/",
  "/pt/recibos-verdes/declaracao-trimestral/",
  "/en/",
  "/en/recibos-verdes/",
  "/en/freelancer-portugal-quarterly/"
].forEach((p) => pages.add(p));
for (const p of [...pages]) {
  if (!p.startsWith("/en/") && !p.startsWith("/pt/") && !p.startsWith("/es/")) {
    pages.add(p === "/" ? "/en/" : "/en" + p);
  }
}

function canonPath(pathname) {
  if (!pathname) return null;
  let p = pathname.split("?")[0].split("#")[0];
  try { p = decodeURI(p); } catch (e) {}
  if (!p.startsWith("/")) p = "/" + p;
  if (p.endsWith("/index.html")) p = p.slice(0, -"index.html".length);
  if (p === "") p = "/";
  if (pages.has(p)) return p.endsWith(".html") || p.endsWith("/") ? p : p + "/";
  if (!p.endsWith("/") && !p.endsWith(".html") && pages.has(p + "/")) return p + "/";
  return null;
}

function pageDir(urlPath) {
  if (urlPath.endsWith(".html")) return urlPath.replace(/[^/]+$/, "");
  return urlPath.endsWith("/") ? urlPath : urlPath + "/";
}

function ptFromEn(p) {
  if (p.indexOf("/en/freelancer-portugal-quarterly") === 0) return "/recibos-verdes/declaracao-trimestral/";
  if (p === "/en/" || p === "/en") return "/";
  if (p.startsWith("/en/")) return p.slice(3) || "/";
  return p;
}

function mapPage(canon, mode) {
  if (canon === "/pt/efatura/") return "/efatura/";
  if (canon === "/pt/ficheiro-sepa/") return "/sepa/";
  if (canon === "/pt/recibos-verdes/") return "/recibos-verdes/";
  if (canon === "/pt/recibos-verdes/declaracao-trimestral/") return "/recibos-verdes/declaracao-trimestral/";
  if (canon.startsWith("/pt/")) return canon.replace(/^\/pt/, "") || "/";
  if (canon.startsWith("/es/")) return canon;
  if (canon.startsWith("/en/")) {
    if (mode === "en") return canon;
    return ptFromEn(canon);
  }
  if (mode === "promote" && (canon === "/efatura/" || canon === "/sepa/" || canon === "/freelancer-portugal-quarterly/")) {
    return canon === "/freelancer-portugal-quarterly/" ? "/en/freelancer-portugal-quarterly/" : "/en" + canon;
  }
  if (mode === "pt" && canon === "/freelancer-portugal-quarterly/") return "/recibos-verdes/declaracao-trimestral/";
  if (mode === "en") {
    if (canon === "/freelancer-portugal-quarterly/") return "/en/freelancer-portugal-quarterly/";
    return canon === "/" ? "/en/" : "/en" + canon;
  }
  if (mode === "es") {
    if (canon === "/") return "/es/";
    if (canon === "/sepa/") return "/en/sepa/";
    if (canon === "/efatura/") return "/efatura/";
    if (canon === "/tools/" || canon === "/statement/" || canon === "/statement-to-csv/") return "/en" + canon;
    return canon === "/" ? "/es/" : canon;
  }
  return canon;
}

function rewriteRaw(raw, sourcePath, mode) {
  if (raw == null) return raw;
  const original = String(raw);
  const trimmed = original.trim();
  if (!trimmed || /^(mailto:|tel:|javascript:|data:|#)/i.test(trimmed)) return original;
  let href = trimmed;
  let hash = "";
  let query = "";
  const hashAt = href.indexOf("#");
  if (hashAt >= 0) { hash = href.slice(hashAt); href = href.slice(0, hashAt); }
  const qAt = href.indexOf("?");
  if (qAt >= 0) { query = href.slice(qAt); href = href.slice(0, qAt); }
  if (!href) return original;
  let pathname = null;
  if (/^https?:\/\//i.test(href)) {
    let u;
    try { u = new URL(href); } catch (e) { return original; }
    if (u.hostname !== "netmend.app" && u.hostname !== "www.netmend.app") return original;
    pathname = u.pathname;
  } else if (href.startsWith("//")) return original;
  else {
    pathname = new URL(href, "https://netmend.app" + pageDir(sourcePath)).pathname;
  }
  const canon = canonPath(pathname);
  if (canon) return mapPage(canon, mode) + query + hash;
  if (!pathname.startsWith("/")) pathname = "/" + pathname;
  return pathname + query + hash;
}

function alternates(dest) {
  const home = { pt: "/", en: "/en/", es: "/es/" };
  const sepa = { pt: "/sepa/", en: "/en/sepa/", es: "/es/fichero-sepa/" };
  const special = {
    "/": home,
    "/en/": home,
    "/es/": home,
    "/sepa/": sepa,
    "/en/sepa/": sepa,
    "/es/fichero-sepa/": sepa,
    "/recibos-verdes/": { pt: "/recibos-verdes/", en: "/en/recibos-verdes/" },
    "/en/recibos-verdes/": { pt: "/recibos-verdes/", en: "/en/recibos-verdes/" },
    "/recibos-verdes/declaracao-trimestral/": { pt: "/recibos-verdes/declaracao-trimestral/", en: "/en/freelancer-portugal-quarterly/" },
    "/en/freelancer-portugal-quarterly/": { pt: "/recibos-verdes/declaracao-trimestral/", en: "/en/freelancer-portugal-quarterly/" }
  };
  if (special[dest]) return special[dest];
  if (dest.startsWith("/en/")) {
    const pt = ptFromEn(dest);
    return { pt: pt, en: dest };
  }
  return { pt: dest, en: dest === "/" ? "/en/" : "/en" + dest };
}

function hreflangBlock(dest) {
  const alt = alternates(dest);
  const lines = [];
  lines.push(`<link rel="alternate" hreflang="pt-PT" href="${ORIGIN}${alt.pt}">`);
  lines.push(`<link rel="alternate" hreflang="en" href="${ORIGIN}${alt.en}">`);
  if (alt.es) lines.push(`<link rel="alternate" hreflang="es" href="${ORIGIN}${alt.es}">`);
  lines.push(`<link rel="alternate" hreflang="x-default" href="${ORIGIN}${alt.pt}">`);
  return lines.join("\n");
}

function switcher(dest, lang) {
  const alt = alternates(dest);
  const label = lang === "en" ? "Language" : "Idioma";
  const item = (code, href, text) => {
    const cur = code === lang ? ' aria-current="true"' : "";
    return `<a href="${href}" hreflang="${code === "pt" ? "pt-PT" : code}" lang="${code === "pt" ? "pt-PT" : code === "es" ? "es" : "en"}" data-lang="${code}"${cur}>${text}</a>`;
  };
  const esHref = alt.es || "/es/";
  return `<span class="lang-switch" role="navigation" aria-label="${label}">${item("pt", alt.pt, "PT")}<span aria-hidden="true">|</span>${item("en", alt.en, "EN")}<span aria-hidden="true">|</span>${item("es", esHref, "ES")}</span>`;
}

function htmlLang(lang) {
  if (lang === "pt") return "pt-PT";
  if (lang === "es") return "es-ES";
  return "en";
}

function transform(html, sourcePath, destPath, mode, lang) {
  let out = html;
  out = out.replace(/\s(href|src|data-src|poster|action)=("([^"]*)"|'([^']*)')/gi, (full, attr, quoted, dq, sq) => {
    const value = dq != null ? dq : sq;
    const quote = dq != null ? '"' : "'";
    const next = rewriteRaw(value, sourcePath, mode);
    return ` ${attr}=${quote}${next}${quote}`;
  });
  out = out.replace(/https:\/\/(?:www\.)?netmend\.app(\/[^\s"'<>\\]*)?/g, (full, pathname) => {
    const pathOnly = pathname || "/";
    const canon = canonPath(pathOnly);
    if (!canon) return ORIGIN + (pathOnly.startsWith("/") ? pathOnly : "/" + pathOnly);
    return ORIGIN + mapPage(canon, mode);
  });
  const canonical = `${ORIGIN}${destPath}`;
  if (/<link rel="canonical"[^>]*>/i.test(out)) out = out.replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonical}">`);
  else out = out.replace(/<head([^>]*)>/i, `<head$1>\n<link rel="canonical" href="${canonical}">`);
  out = out.replace(/<link rel="alternate"[^>]*hreflang="[^"]+"[^>]*>\s*/gi, "");
  out = out.replace(/<link rel="canonical"[^>]*>/i, (m) => m + "\n" + hreflangBlock(destPath));
  out = out.replace(/<meta property="og:url"[^>]*>/i, `<meta property="og:url" content="${canonical}">`);
  if (!/property="og:url"/i.test(out)) {
    out = out.replace(/<link rel="canonical"[^>]*>/i, (m) => m + `\n<meta property="og:url" content="${canonical}">`);
  }
  out = out.replace(/<html[^>]*>/i, `<html lang="${htmlLang(lang)}">`);
  if (!/class="lang-switch"/.test(out)) {
    if (/<nav\b[^>]*>/i.test(out)) out = out.replace(/<\/nav>/i, switcher(destPath, lang) + "</nav>");
    else out = out.replace(/<header\b[^>]*>/i, (m) => m + switcher(destPath, lang));
  }
  if (!/\/assets\/lang\.js/.test(out)) {
    out = out.replace(/<\/body>/i, '<script src="/assets/lang.js"></script>\n</body>');
  }
  if (lang === "pt") out = out.replaceAll("Made by Pedro Carvalho in Portugal", "Feito por Pedro Carvalho em Portugal");
  return out;
}

function writeFile(urlPath, html) {
  const dest = fileForUrl(urlPath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
}

const sources = new Map(files.map((f) => [f, fs.readFileSync(f, "utf8")]));

const todo = [];
for (const file of files) {
  const sourcePath = toUrl(file);
  const html = sources.get(file);
  const enPath = sourcePath === "/freelancer-portugal-quarterly/"
    ? "/en/freelancer-portugal-quarterly/"
    : sourcePath === "/" ? "/en/" : "/en" + sourcePath;
  writeFile(enPath, transform(html, sourcePath, enPath, "en", "en"));
  if (sourcePath === "/freelancer-portugal-quarterly/") continue;
  writeFile(sourcePath, transform(html, sourcePath, sourcePath, "pt", "pt"));
  todo.push(sourcePath);
}

const promotions = [
  ["/pt/efatura/index.html", "/pt/efatura/", "/efatura/"],
  ["/pt/ficheiro-sepa/index.html", "/pt/ficheiro-sepa/", "/sepa/"],
  ["/pt/recibos-verdes/index.html", "/pt/recibos-verdes/", "/recibos-verdes/"],
  ["/pt/recibos-verdes/declaracao-trimestral/index.html", "/pt/recibos-verdes/declaracao-trimestral/", "/recibos-verdes/declaracao-trimestral/"]
];
const promoted = new Set(promotions.map((p) => p[2]));
for (const [rel, sourcePath, destPath] of promotions) {
  const html = fs.readFileSync(path.join(ROOT, rel), "utf8");
  writeFile(destPath, transform(html, sourcePath, destPath, "promote", "pt"));
}

function stub(lang, dest, title, linkText) {
  const l = htmlLang(lang);
  return `<!doctype html>
<html lang="${l}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<link rel="canonical" href="${ORIGIN}${dest}">
<meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0;url=${dest}">
<script>location.replace(${JSON.stringify(dest)})</script>
</head>
<body><p><a href="${dest}">${linkText}</a></p></body>
</html>
`;
}

const stubs = [
  ["/pt/efatura/", "pt", "/efatura/", "A redirecionar…", "e-fatura para Excel"],
  ["/pt/ficheiro-sepa/", "pt", "/sepa/", "A redirecionar…", "Ficheiro SEPA"],
  ["/pt/recibos-verdes/", "pt", "/recibos-verdes/", "A redirecionar…", "Recibos verdes"],
  ["/pt/recibos-verdes/declaracao-trimestral/", "pt", "/recibos-verdes/declaracao-trimestral/", "A redirecionar…", "Declaração trimestral"],
  ["/freelancer-portugal-quarterly/", "en", "/en/freelancer-portugal-quarterly/", "Redirecting…", "Quarterly helper in English"]
];
for (const [at, lang, dest, title, text] of stubs) writeFile(at, stub(lang, dest, title, text));

let es = fs.readFileSync(path.join(ROOT, "es/fichero-sepa/index.html"), "utf8");
es = transform(es, "/es/fichero-sepa/", "/es/fichero-sepa/", "es", "es");
es = es.replaceAll('href="/en/sepa/"', 'href="/en/sepa/"');
writeFile("/es/fichero-sepa/", es);

const esHome = `<!doctype html>
<html lang="es-ES">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Netmend · Herramientas gratis y privadas para PDF, Excel y extractos</title>
<meta name="description" content="Herramientas gratis que se ejecutan en el navegador: fichero SEPA XML, extractos bancarios y Excel. No se envía nada y no hay que crear una cuenta.">
<link rel="canonical" href="https://netmend.app/es/">
<link rel="alternate" hreflang="pt-PT" href="https://netmend.app/">
<link rel="alternate" hreflang="en" href="https://netmend.app/en/">
<link rel="alternate" hreflang="es" href="https://netmend.app/es/">
<link rel="alternate" hreflang="x-default" href="https://netmend.app/">
<meta property="og:type" content="website">
<meta property="og:url" content="https://netmend.app/es/">
<meta property="og:site_name" content="Netmend">
<meta property="og:title" content="Netmend · Herramientas gratis y privadas">
<meta property="og:description" content="Fichero SEPA XML y otras herramientas en el navegador. No se envía nada.">
<meta property="og:image" content="https://netmend.app/assets/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0b0c0f">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/tools.css">
</head>
<body>
<header><div class="wrap">
<a href="/es/"><img src="/assets/logo-light.svg" alt="Netmend" width="121" height="30"></a>
<nav><a href="/es/fichero-sepa/">Fichero SEPA</a><a href="/en/tools/">Herramientas</a><span class="lang-switch" role="navigation" aria-label="Idioma"><a href="/" hreflang="pt-PT" lang="pt-PT" data-lang="pt">PT</a><span aria-hidden="true">|</span><a href="/en/" hreflang="en" lang="en" data-lang="en">EN</a><span aria-hidden="true">|</span><a href="/es/" hreflang="es" lang="es" data-lang="es" aria-current="true">ES</a></span></nav>
</div></header>
<main>
<section class="hero"><div class="wrap">
<h1>Herramientas gratis para <span>PDF, Excel y extractos</span></h1>
<p>Se ejecutan en el navegador. Los ficheros no se envían y no hay que crear una cuenta.</p>
<div class="pills"><span>Fichero SEPA XML en español</span><span>El resto del sitio está en portugués y en inglés</span><span>Sin geolocalización</span></div>
</div></section>
<section><div class="wrap">
<h2>En español</h2>
<div class="list">
<a href="/es/fichero-sepa/"><b>Crear fichero SEPA XML</b><span>Excel o CSV para transferencias por lote. El fichero se queda en este ordenador.</span></a>
</div>
<h2>También en Netmend</h2>
<p class="lead">La página principal está en portugués de Portugal. La versión en inglés reúne las mismas herramientas.</p>
<p><a href="/">Português (Portugal)</a> · <a href="/en/">English</a> · <a href="/en/tools/">All tools in English</a></p>
</div></section>
</main>
<footer class="site-footer"><div class="wrap">
<div class="f-bottom">© 2026 Netmend · Hecho por Pedro Carvalho en Portugal · Sin rastreadores. Una cookie recuerda solo el idioma.</div>
</div></footer>
<script src="/assets/lang.js"></script>
</body>
</html>
`;
writeFile("/es/", esHome);

const enHub = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Portuguese green receipts · Netmend</title>
<meta name="description" content="Tools for Portuguese freelancers on green receipts: the quarterly Social Security declaration, 2026 VAT and the exemption threshold. In the browser. Nothing is uploaded.">
<link rel="canonical" href="https://netmend.app/en/recibos-verdes/">
<link rel="alternate" hreflang="pt-PT" href="https://netmend.app/recibos-verdes/">
<link rel="alternate" hreflang="en" href="https://netmend.app/en/recibos-verdes/">
<link rel="alternate" hreflang="x-default" href="https://netmend.app/recibos-verdes/">
<meta property="og:url" content="https://netmend.app/en/recibos-verdes/">
<meta property="og:title" content="Portuguese green receipts · Netmend">
<meta property="og:image" content="https://netmend.app/assets/og-image.png">
<meta name="theme-color" content="#0b0c0f">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/tools.css">
<link rel="stylesheet" href="/recibos-verdes/app.css">
</head>
<body>
<header><div class="wrap">
<a href="/en/"><img src="/assets/logo-light.svg" alt="Netmend" width="121" height="30"></a>
<nav><a href="/en/tools/">Tools</a><a class="cta" href="/en/freelancer-portugal-quarterly/">Open the helper</a><span class="lang-switch" role="navigation" aria-label="Language"><a href="/recibos-verdes/" hreflang="pt-PT" lang="pt-PT" data-lang="pt">PT</a><span aria-hidden="true">|</span><a href="/en/recibos-verdes/" hreflang="en" lang="en" data-lang="en" aria-current="true">EN</a><span aria-hidden="true">|</span><a href="/es/" hreflang="es" lang="es" data-lang="es">ES</a></span></nav>
</div></header>
<main>
<div class="hero"><div class="wrap">
<p class="crumbs"><a href="/en/">Netmend</a> · <a href="/en/tools/">Tools</a> · Green receipts</p>
<h1>Green receipts for <span>freelancers in Portugal</span></h1>
<p>The quarterly Social Security declaration, VAT and the exemption threshold. The calculation stays in this browser.</p>
</div></div>
<section><div class="wrap">
<div class="list">
<a href="/en/freelancer-portugal-quarterly/"><b>Quarterly declaration</b><span>Estimate the monthly contribution and the amount to declare. Nothing is uploaded.</span></a>
<a href="/en/efatura/"><b>e-fatura to Excel</b><span>The purchase side: supplier invoices and VAT, in the browser.</span></a>
</div>
</div></section>
</main>
<footer class="site-footer"><div class="wrap">
<div class="f-bottom">© 2026 Netmend · Made by Pedro Carvalho in Portugal · No trackers. One cookie remembers only the language.</div>
</div></footer>
<script src="/assets/lang.js"></script>
</body>
</html>
`;
writeFile("/en/recibos-verdes/", enHub);

const OTHER = ["fr","de","it","nl","pl","sv","da","no","nb","nn","fi","cs","sk","sl","hr","hu","ro","bg","el","ru","uk","tr","ar","he","fa","hi","th","vi","id","ms","zh","ja","ko","ca","gl","eu","ga","cy","is","lt","lv","et","sq","mk","sr","bs","mt","af","sw","hy","ka","az","kk","uz","bn","ta","te","ur","pa","ne","si","my","km","lo","am"].join(",");

const entries = [
  ["/", "/en/", "/es/"],
  ["/tools/", "/en/tools/", null],
  ["/statement/", "/en/statement/", null],
  ["/statement-to-csv/", "/en/statement-to-csv/", null],
  ["/excel-functions/", "/en/excel-functions/", null],
  ["/guides/", "/en/guides/", null],
  ["/compare/", "/en/compare/", null],
  ["/x-growth/", "/en/x-growth/", null],
  ["/sepa/", "/en/sepa/", "/es/fichero-sepa/"],
  ["/efatura/", "/en/efatura/", null],
  ["/formula/", "/en/formula/", null],
  ["/recibos-verdes/", "/en/recibos-verdes/", null]
];

let redirects = `# Language routing. Portuguese (pt-PT) is the default and x-default.
# English lives at /en/… . A 301 from the old English URL to /en/ would make
# that URL unreachable as Portuguese, so those paths are NOT redirected.
# Netlify Language= reads Accept-Language (first tag only) and the nf_lang
# cookie, which overrides it. Country= is Netlify GeoIP (no permission prompt).
# nf_country overrides GeoIP when the visitor picks a language.
# Rules are entry pages only, 302, forced because the file exists.
# Order: pt language, then PT/BR country, then es, then ES country, then en,
# then other languages. No Accept-Language and no PT/BR/ES country → the
# Portuguese file (bots).

/pt/efatura  /efatura/  301!
/pt/ficheiro-sepa  /sepa/  301!
/pt/recibos-verdes/declaracao-trimestral  /recibos-verdes/declaracao-trimestral/  301!
/pt/recibos-verdes  /recibos-verdes/  301!
/freelancer-portugal-quarterly  /en/freelancer-portugal-quarterly/  301!

`;
for (const [pt, en, es] of entries) {
  const self = pt === "/" ? "/index.html" : pt + "index.html";
  const esTarget = es || en;
  redirects += `# ${pt}\n`;
  redirects += `${pt}  ${self}  200!  Language=pt\n`;
  redirects += `${pt}  ${self}  200!  Country=pt,br\n`;
  redirects += `${pt}  ${esTarget}  302!  Language=es\n`;
  redirects += `${pt}  ${esTarget}  302!  Country=es\n`;
  redirects += `${pt}  ${en}  302!  Language=en\n`;
  redirects += `${pt}  ${en}  302!  Language=${OTHER}\n\n`;
}
fs.writeFileSync(path.join(ROOT, "_redirects"), redirects);

function sitemapUrls() {
  const urls = new Set();
  function walkAll(dir) {
    for (const name of fs.readdirSync(dir)) {
      if (name === ".git" || name === "node_modules" || name === "tests" || name === ".netlify" || name === "scripts") continue;
      const full = path.join(dir, name);
      if (fs.statSync(full).isDirectory()) walkAll(full);
      else if (name.endsWith(".html") && !name.startsWith("google")) {
        const u = toUrl(full);
        if (u.startsWith("/pt/")) continue;
        if (u === "/freelancer-portugal-quarterly/") continue;
        urls.add(u);
      }
    }
  }
  walkAll(ROOT);
  return [...urls].sort();
}
let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;
for (const u of sitemapUrls()) {
  const alt = alternates(u);
  xml += `<url><loc>${ORIGIN}${u}</loc>`;
  xml += `<xhtml:link rel="alternate" hreflang="pt-PT" href="${ORIGIN}${alt.pt}"/>`;
  xml += `<xhtml:link rel="alternate" hreflang="en" href="${ORIGIN}${alt.en}"/>`;
  if (alt.es) xml += `<xhtml:link rel="alternate" hreflang="es" href="${ORIGIN}${alt.es}"/>`;
  xml += `<xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}${alt.pt}"/>`;
  xml += `</url>\n`;
}
xml += `</urlset>\n`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml);

const todoPaths = todo.filter((p) => !promoted.has(p));
fs.writeFileSync(path.join(ROOT, "scripts/pt-todo.txt"), todoPaths.join("\n") + "\n");
console.log("pages", files.length, "to translate", todoPaths.length, "promoted", promoted.size);
