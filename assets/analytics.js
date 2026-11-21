/* Netmend: cookie-free page statistics (Cloudflare Web Analytics).
   No cookies, no localStorage, no personal data. To switch on, paste the site token
   from https://dash.cloudflare.com/?to=/:account/web-analytics (Add a site -> netmend.app -> "Manage site" -> JS snippet)
   between the quotes below. While it is empty, this file does nothing. */
(function () {
  var CF_TOKEN = "";
  if (!CF_TOKEN || location.hostname !== "netmend.app") return;
  var s = document.createElement("script");
  s.defer = true;
  s.src = "https://static.cloudflareinsights.com/beacon.min.js";
  s.setAttribute("data-cf-beacon", JSON.stringify({ token: CF_TOKEN }));
  document.head.appendChild(s);
})();
