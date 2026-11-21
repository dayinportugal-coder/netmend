/* Precaches this site's own pages and their static files.
   HTML, CSS and JS are network-first, then cached. Other precached files
   (fonts, icons) stay cache-first. Nothing the user opens from their
   computer is requested or stored. Bump CACHE to drop old copies. */
var CACHE = "netmend-20261121e";
var PRECACHE = [
  "/",
  "/index.html",
  "/efatura/",
  "/efatura/index.html",
  "/efatura/app.js",
  "/efatura/sample/efatura-exemplo.zip",
  "/efatura/sample/efatura-exemplo-a.csv",
  "/efatura/sample/efatura-exemplo-b.csv",
  "/pt/efatura/",
  "/pt/efatura/index.html",
  /* recibos-verdes — keep this block together when rebasing */
  "/recibos-verdes/rules.js",
  "/recibos-verdes/merge.js",
  "/recibos-verdes/store.js",
  "/recibos-verdes/newsletter.js",
  "/recibos-verdes/anexo.js",
  "/recibos-verdes/app.js",
  "/recibos-verdes/app.css",
  "/recibos-verdes/sample/recibos-verdes-exemplo.csv",
  "/pt/recibos-verdes/",
  "/pt/recibos-verdes/index.html",
  "/pt/recibos-verdes/declaracao-trimestral/",
  "/pt/recibos-verdes/declaracao-trimestral/index.html",
  "/pt/recibos-verdes/irs-anexo-b/",
  "/pt/recibos-verdes/irs-anexo-b/index.html",
  "/freelancer-portugal-quarterly/",
  "/freelancer-portugal-quarterly/index.html",
  "/tools/",
  "/tools/index.html",
  "/assets/tools.css",
  "/assets/pwa.js",
  "/assets/fonts/inter-latin.woff2",
  "/assets/logo-light.svg",
  "/assets/logo.svg",
  "/assets/favicon.svg",
  "/assets/favicon.png",
  "/assets/vendor/jszip.min.js",
  "/assets/vendor/xlsx.mini.min.js",
  "/manifest.webmanifest",
  "/assets/icons/icon-192.png",
  "/assets/icons/icon-512.png",
  "/assets/icons/icon-maskable-192.png",
  "/assets/icons/icon-maskable-512.png",
  "/assets/icons/apple-touch-icon.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(caches.open(CACHE).then(function (cache) {
    return cache.addAll(PRECACHE);
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (key) { return key !== CACHE; }).map(function (key) { return caches.delete(key); }));
  }).then(function () { return self.clients.claim(); }).then(function () {
    return self.clients.matchAll({ type: "window" });
  }).then(function (clients) {
    clients.forEach(function (client) { client.postMessage({ type: "nm-update" }); });
  }));
});

function isCode(path) {
  return /\.(?:js|css)$/i.test(path);
}

function networkFirst(request) {
  return fetch(request).then(function (response) {
    if (response && response.ok && response.type === "basic") {
      var copy = response.clone();
      caches.open(CACHE).then(function (cache) { return cache.put(request, copy); });
    }
    return response;
  }).catch(function () { return fallback(request); });
}

function isHtml(request) {
  if (request.mode === "navigate") return true;
  var accept = request.headers.get("accept") || "";
  if (accept.indexOf("text/html") !== -1) return true;
  var path = new URL(request.url).pathname;
  return path.endsWith("/") || path.endsWith(".html");
}

function knownPage(path) {
  if (PRECACHE.indexOf(path) !== -1) return true;
  if (!path.endsWith("/")) return PRECACHE.indexOf(path + "/") !== -1;
  return PRECACHE.indexOf(path + "index.html") !== -1;
}

function fallback(request) {
  var path = new URL(request.url).pathname;
  return caches.match(request).then(function (hit) {
    if (hit) return hit;
    if (!path.endsWith("/")) return caches.match(path + "/");
    return caches.match(path + "index.html");
  });
}

self.addEventListener("fetch", function (event) {
  var request = event.request;
  if (request.method !== "GET") return;
  var url;
  try { url = new URL(request.url); } catch (e) { return; }
  if (url.origin !== self.location.origin) return;
  if (isHtml(request)) {
    if (!knownPage(url.pathname)) return;
    event.respondWith(networkFirst(request));
    return;
  }
  if (isCode(url.pathname)) {
    event.respondWith(networkFirst(request));
    return;
  }
  if (PRECACHE.indexOf(url.pathname) === -1) return;
  event.respondWith(caches.match(request).then(function (cached) {
    if (cached) return cached;
    return fetch(request);
  }));
});
