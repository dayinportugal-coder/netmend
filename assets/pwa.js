/* Install prompt and service worker. No network calls of its own. */
(function () {
  "use strict";
  var pt = (document.documentElement.lang || "").toLowerCase().indexOf("pt") === 0;

  if ("serviceWorker" in navigator) {
    var hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener("message", function (event) {
      if (hadController && event.data && event.data.type === "nm-update") showUpdate();
    });
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (hadController) showUpdate();
    });
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js").catch(function () {});
    });
  }

  var toastStyle = document.createElement("style");
  toastStyle.textContent = ".nm-update{position:fixed;left:12px;right:12px;bottom:12px;z-index:80;display:flex;gap:12px;align-items:center;justify-content:space-between;background:#131419;color:#fff;border:1px solid rgba(255,255,255,.2);border-radius:10px;padding:12px 14px;box-sizing:border-box}.nm-update p{margin:0;font:600 15px/1.4 Inter,system-ui,sans-serif}.nm-update .btn{background:#c2410c;color:#fff;border:0;border-radius:8px;padding:8px 12px;font:600 15px/1.2 Inter,system-ui,sans-serif;cursor:pointer}";
  document.head.appendChild(toastStyle);

  var updateShown = false;
  function showUpdate() {
    if (updateShown) return;
    updateShown = true;
    var bar = document.createElement("div");
    bar.className = "nm-update";
    bar.setAttribute("role", "status");
    var text = document.createElement("p");
    text.textContent = pt ? "Nova versão — atualizar" : "New version — refresh";
    var go = document.createElement("button");
    go.type = "button";
    go.className = "btn";
    go.textContent = pt ? "Atualizar" : "Refresh";
    go.addEventListener("click", function () { window.location.reload(); });
    bar.appendChild(text);
    bar.appendChild(go);
    document.body.appendChild(bar);
  }

  function standalone() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }

  var button = document.createElement("button");
  button.type = "button";
  button.className = "nm-install";
  button.hidden = true;
  button.textContent = pt ? "Instalar app" : "Install app";
  var actions = document.querySelector(".actions");
  if (actions) actions.appendChild(button);
  else {
    button.classList.add("nm-install-fixed");
    document.body.appendChild(button);
  }

  var hint = document.createElement("p");
  hint.className = "nm-ios-hint";
  hint.hidden = true;
  hint.textContent = pt ? "Partilhar → Adicionar ao ecrã principal" : "Share → Add to Home Screen";
  document.body.appendChild(hint);

  var deferred = null;
  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    deferred = event;
    if (!standalone()) button.hidden = false;
  });

  button.addEventListener("click", function () {
    if (!deferred) return;
    deferred.prompt();
    deferred.userChoice.then(function () {
      button.hidden = true;
      deferred = null;
    });
  });

  window.addEventListener("appinstalled", function () {
    button.hidden = true;
    hint.hidden = true;
    deferred = null;
  });

  var ua = navigator.userAgent || "";
  var ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var safari = /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS|Chrome|Chromium/i.test(ua);
  if (ios && safari && !standalone()) hint.hidden = false;
})();
