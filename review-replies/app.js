/* Netmend Review Replies — free version. Everything runs in this browser; nothing is sent anywhere. */
(function () {
  "use strict";
  var DAILY_LIMIT = 3, USE_LS = "nm_rr_usage";
  var $ = function (id) { return document.getElementById(id); };
  var goEl = $("generate"), outEl = $("out"), statusEl = $("status"), remainEl = $("remain");

  function today() { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  function usage() {
    try { var u = JSON.parse(localStorage.getItem(USE_LS) || "{}"); return u.date === today() ? { date: u.date, count: +u.count || 0 } : { date: today(), count: 0 }; }
    catch (e) { return { date: today(), count: 0 }; }
  }
  function remaining() { return Math.max(0, DAILY_LIMIT - usage().count); }
  function paintRemain() {
    var n = remaining();
    remainEl.innerHTML = n > 0 ? (n === 1 ? "1 free review left today in this browser." : n + " free reviews left today in this browser.")
      : 'Daily free limit reached. Come back tomorrow, or <a href="#pro">join the Pro waitlist</a>.';
    goEl.disabled = n <= 0;
  }

  // Topics: keyword pattern, how to thank for it, how to acknowledge a problem with it.
  var TOPICS = [
    { k: /\b(food|dish|dishes|meal|menu|dessert|pizza|fish|seafood|steak|coffee|cake|pastr\w*|breakfast|lunch|dinner|taste|tasty|delicious|flavou?r\w*|wine|cocktail\w*|drinks?)\b/i, p: "the food", c: "the food" },
    { k: /\b(staff|service|waiter|waitress|server|team|host|hostess|reception\w*|employee\w*|friendly|helpful|attentive|welcom\w*|rude|unfriendly)\b/i, p: "our team", c: "the service" },
    { k: /\b(wait\w*|slow|late|delay\w*|queue|took (?:so |too )?long|minutes|hour)\b/i, p: "how quickly we looked after you", c: "the waiting time" },
    { k: /\b(price\w*|expensive|cheap|value|overpriced|cost\w*|bill|charged?)\b/i, p: "the value for money", c: "the price" },
    { k: /\b(clean\w*|dirty|hygiene|toilet\w*|bathroom\w*|smell\w*)\b/i, p: "how clean everything was", c: "cleanliness" },
    { k: /\b(atmosphere|ambien\w*|cosy|cozy|decor|music|noisy|noise|loud|view|terrace|vibe)\b/i, p: "the atmosphere", c: "the atmosphere and noise" },
    { k: /\b(room|bed|apartment|stay|check-?in|check-?out|shower|breakfast included|wifi|wi-fi)\b/i, p: "your stay", c: "your stay" },
    { k: /\b(location|parking|park|find|located|access\w*)\b/i, p: "the location", c: "access and parking" },
    { k: /\b(doctor|dentist|treatment|appointment|clinic|nurse|therap\w*|haircut|hair|nails|massage)\b/i, p: "the care you received", c: "your appointment" },
    { k: /\b(product\w*|quality|order\w*|delivery|deliver\w*|shop|store|stock)\b/i, p: "the quality", c: "your order" }
  ];
  var NEG = /\b(not|no|never|didn'?t|wasn'?t|weren'?t|isn'?t|don'?t|bad|poor|worst|terrible|awful|horrible|rude|cold|dirty|slow|late|expensive|overpriced|disappoint\w*|unfortunately|sadly|noisy|loud|wrong|forgot|ignored|waited|wait(ing)? for|long wait|mediocre|bland|small portions?|unfriendly|problem|issue|complain\w*)\b/i;

  function analyse(text) {
    var clauses = text.split(/[.!?;\n]+|\bbut\b|\bhowever\b|\balthough\b|\bthough\b/i).map(function (s) { return s.trim(); }).filter(Boolean);
    var praise = [], issues = [];
    clauses.forEach(function (cl) {
      var neg = NEG.test(cl);
      TOPICS.forEach(function (t) {
        if (t.k.test(cl)) {
          var list = neg ? issues : praise, v = neg ? t.c : t.p;
          if (list.indexOf(v) < 0) list.push(v);
        }
      });
    });
    praise = praise.filter(function (p) { return issues.indexOf(p) < 0; });
    return { praise: praise.slice(0, 2), issues: issues.slice(0, 2), visit: /\b(again|back|return\w*|next time|regular|every (week|time))\b/i.test(text) };
  }
  function joinList(a) { return a.length < 2 ? (a[0] || "") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pick(a, i) { return a[i % a.length]; }

  function build(o, i) {
    var name = o.name, biz = o.biz || "us", A = o.a, tone = o.tone, s = o.stars;
    var greet = name ? pick(tone === "pro" ? ["Dear " + name + ",", "Hello " + name + ","] : ["Hi " + name + ",", "Hello " + name + ",", "Dear " + name + ","], i) : pick(tone === "pro" ? ["Hello,", "Dear guest,"] : ["Hi there,", "Hello,", "Hi,"], i);
    var P = A.praise.length ? joinList(A.praise) : "", I = A.issues.length ? joinList(A.issues) : "";
    var contact = o.contact ? (tone === "short" ? " Write to us at " + o.contact + "." : " If you’re willing, please write to us at " + o.contact + " so we can look into it properly.") : (tone === "short" ? " Please get in touch with us directly." : " If you’re willing, please get in touch with us directly so we can look into it properly.");
    var lines = [];
    if (s >= 4) {
      lines.push(pick([
        "Thank you so much for taking the time to leave " + (s === 5 ? "a 5-star review" : "such a kind review") + ".",
        "What a lovely review to read, thank you for sharing it.",
        "Thank you for choosing " + biz + " and for this kind review."
      ], i));
      if (P) lines.push(pick([
        "We’re really happy you enjoyed " + P + ".",
        "It means a lot to hear that " + P + " stood out for you.",
        "We’ll make sure the whole team hears what you said about " + P + "."
      ], i));
      if (I && s === 4) lines.push(pick([
        "We also noted your comment about " + I + ", and we’re working on it.",
        "Thank you as well for the honest note about " + I + "; it helps us improve.",
        "Your point about " + I + " is fair, and we’ve passed it on."
      ], i));
      lines.push(pick(A.visit ? ["We look forward to welcoming you back soon!", "See you again soon!", "We can’t wait to have you back."] : ["We hope to welcome you again soon.", "Hope to see you again!", "You’re always welcome back."], i));
    } else if (s === 3) {
      lines.push(pick(["Thank you for your honest feedback.", "Thank you for taking the time to share your experience.", "We appreciate the balanced review, thank you."], i));
      if (P) lines.push(pick(["We’re glad you liked " + P + ".", "It’s good to hear that " + P + " worked for you.", "Thank you for the kind words about " + P + "."], i));
      lines.push(I ? pick(["We’re sorry that " + I + " didn’t meet your expectations.", "You’re right to point out " + I + ", and we’re looking at how to do better.", "We’ve shared your comments about " + I + " with the team so we can improve."], i)
        : pick(["We’d love to know what would have made it a 5-star visit.", "We’re always trying to improve, and your feedback helps.", "We’d like to do better next time."], i));
      lines.push(pick(["We hope you’ll give us another chance.", "We’d be glad to welcome you back and show you our best.", "Thank you again, and we hope to see you soon."], i));
    } else {
      lines.push(pick(["Thank you for letting us know, and we’re sorry your experience wasn’t what it should have been.", "We’re sorry to read this, and thank you for taking the time to tell us.", "We apologise for your experience and appreciate your honest review."], i));
      if (I) lines.push(pick(["What you describe about " + I + " is not the standard we aim for.", "We take your comments about " + I + " seriously and have shared them with the team.", "We’re looking into what happened with " + I + "."], i));
      if (P && tone !== "short") lines.push("We’re glad at least " + P + " was right.");
      lines.push(contact.trim());
      if (tone !== "short") lines.push(pick(["We hope to have the chance to make it right.", "We’d appreciate the opportunity to do better.", "Thank you again for helping us improve."], i));
    }
    if (tone === "short") {
      // keep the opener, the most important middle line (the issue if there is one) and, for complaints, the contact line
      var mid = lines.slice(1, -1);
      var key = I ? mid.filter(function (l) { return l.indexOf(I) >= 0; })[0] : mid[0];
      lines = [lines[0]].concat(key ? [key] : []).concat(s <= 2 ? [contact.trim()] : []);
    }
    var sign = o.sign ? "\n\n" + (tone === "pro" ? "Kind regards,\n" : "– ") + o.sign : (o.biz ? "\n\n– The " + o.biz + " team" : "");
    return greet + "\n\n" + lines.join(" ") + sign;
  }

  function copy(text, btn) {
    var done = function () { btn.textContent = "Copied"; setTimeout(function () { btn.textContent = "Copy"; }, 1500); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () { fallback(); });
    else fallback();
    function fallback() { var t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); done(); } catch (e) {} t.remove(); }
  }

  goEl.addEventListener("click", function () {
    var review = $("review").value.trim();
    if (review.length < 3 && !confirm("The review box is empty (star-only review). Write generic replies?")) return;
    if (remaining() <= 0) { paintRemain(); return; }
    var stars = +(document.querySelector("input[name=stars]:checked") || { value: 5 }).value;
    var o = { name: $("reviewer").value.trim().split(/\s+/)[0] || "", biz: $("biz").value.trim(), sign: $("sign").value.trim(), contact: $("contact").value.trim(), tone: $("tone").value, stars: stars, a: analyse(review) };
    var order = shuffle([0, 1, 2]);
    outEl.innerHTML = "";
    order.forEach(function (v, n) {
      var text = build(o, v);
      var art = document.createElement("article"); art.className = "xpw-card";
      var hd = document.createElement("header"); var f = document.createElement("span"); f.className = "fmt"; f.textContent = "Draft " + (n + 1); hd.appendChild(f);
      var ch = document.createElement("span"); ch.className = "chars"; ch.textContent = text.length + " characters"; hd.appendChild(ch);
      var pre = document.createElement("pre"); pre.textContent = text; pre.contentEditable = "true"; pre.spellcheck = true;
      var act = document.createElement("div"); act.className = "xpw-actions";
      var b = document.createElement("button"); b.className = "btn ghost"; b.type = "button"; b.textContent = "Copy";
      b.addEventListener("click", function () { copy(pre.innerText, b); });
      act.appendChild(b); art.appendChild(hd); art.appendChild(pre); art.appendChild(act); outEl.appendChild(art);
    });
    var u = usage(); u.count++; try { localStorage.setItem(USE_LS, JSON.stringify(u)); } catch (e) {}
    var found = o.a.praise.concat(o.a.issues);
    statusEl.textContent = (found.length ? "Picked up: " + joinList(found) + ". " : "") + "You can edit a draft right in the box before copying it.";
    paintRemain();
  });
  paintRemain();
})();
