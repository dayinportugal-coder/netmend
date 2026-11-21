/* Install prompt and service worker. No network calls of its own. */
(function () {
  "use strict";
  var htmlLang = (document.documentElement.lang || "").toLowerCase();
  var pt = htmlLang.indexOf("pt") === 0;
  var es = htmlLang.indexOf("es") === 0;

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/sw.js").catch(function () {});
    });
  }

  function standalone() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }

  var button = document.createElement("button");
  button.type = "button";
  button.className = "nm-install";
  button.hidden = true;
  button.textContent = pt || es ? "Instalar app" : "Install app";
  var actions = document.querySelector(".actions");
  if (actions) actions.appendChild(button);
  else {
    button.classList.add("nm-install-fixed");
    document.body.appendChild(button);
  }

  var hint = document.createElement("p");
  hint.className = "nm-ios-hint";
  hint.hidden = true;
  hint.textContent = pt ? "Partilhar → Adicionar ao ecrã principal" : es ? "Compartir → Añadir a la pantalla de inicio" : "Share → Add to Home Screen";
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
