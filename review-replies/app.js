/* Netmend Review Replies — free version. Everything runs in this browser; nothing is sent anywhere. */
(function () {
  "use strict";
  function nmLang(){var l=(document.documentElement.lang||"pt").toLowerCase();return l.indexOf("en")===0?"en":l.indexOf("es")===0?"es":"pt";}
  function nmT(en, pt, es){var l=nmLang();return l==="en"?en:l==="es"?es:pt;}
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
    remainEl.innerHTML = n > 0
      ? (n === 1
        ? nmT("1 free review left today in this browser.", "Resta 1 avaliação grátis hoje neste browser.", "Queda 1 reseña gratis hoy en este navegador.")
        : nmT(n + " free reviews left today in this browser.", "Restam " + n + " avaliações grátis hoje neste browser.", "Quedan " + n + " reseñas gratis hoy en este navegador."))
      : nmT('Daily free limit reached. Come back tomorrow, or <a href="#pro">join the Pro waitlist</a>.', 'Limite grátis do dia atingido. Volte amanhã ou <a href="#pro">entre na lista de espera do Pro</a>.', 'Límite gratis del día alcanzado. Vuelva mañana o <a href="#pro">apúntese a la lista de espera de Pro</a>.');
    goEl.disabled = n <= 0;
  }

  // Topics: keyword pattern, how to thank for it, how to acknowledge a problem with it.
  // The patterns stay in English (they read the review). The phrases are what the reply shows.
  var TOPICS = [
    { k: /\b(food|dish|dishes|meal|menu|dessert|pizza|fish|seafood|steak|coffee|cake|pastr\w*|breakfast|lunch|dinner|taste|tasty|delicious|flavou?r\w*|wine|cocktail\w*|drinks?)\b/i, p: nmT("the food", "a comida", "la comida"), c: nmT("the food", "a comida", "la comida") },
    { k: /\b(staff|service|waiter|waitress|server|team|host|hostess|reception\w*|employee\w*|friendly|helpful|attentive|welcom\w*|rude|unfriendly)\b/i, p: nmT("our team", "a nossa equipa", "nuestro equipo"), c: nmT("the service", "o serviço", "el servicio") },
    { k: /\b(wait\w*|slow|late|delay\w*|queue|took (?:so |too )?long|minutes|hour)\b/i, p: nmT("how quickly we looked after you", "a rapidez do atendimento", "la rapidez con la que le atendimos"), c: nmT("the waiting time", "o tempo de espera", "el tiempo de espera") },
    { k: /\b(price\w*|expensive|cheap|value|overpriced|cost\w*|bill|charged?)\b/i, p: nmT("the value for money", "a relação qualidade-preço", "la relación calidad-precio"), c: nmT("the price", "o preço", "el precio") },
    { k: /\b(clean\w*|dirty|hygiene|toilet\w*|bathroom\w*|smell\w*)\b/i, p: nmT("how clean everything was", "a limpeza", "lo limpio que estaba todo"), c: nmT("cleanliness", "a limpeza", "la limpieza") },
    { k: /\b(atmosphere|ambien\w*|cosy|cozy|decor|music|noisy|noise|loud|view|terrace|vibe)\b/i, p: nmT("the atmosphere", "o ambiente", "el ambiente"), c: nmT("the atmosphere and noise", "o ambiente e o ruído", "el ambiente y el ruido") },
    { k: /\b(room|bed|apartment|stay|check-?in|check-?out|shower|breakfast included|wifi|wi-fi)\b/i, p: nmT("your stay", "a estadia", "su estancia"), c: nmT("your stay", "a estadia", "su estancia") },
    { k: /\b(location|parking|park|find|located|access\w*)\b/i, p: nmT("the location", "a localização", "la ubicación"), c: nmT("access and parking", "o acesso e o estacionamento", "el acceso y el aparcamiento") },
    { k: /\b(doctor|dentist|treatment|appointment|clinic|nurse|therap\w*|haircut|hair|nails|massage)\b/i, p: nmT("the care you received", "o cuidado que recebeu", "la atención que recibió"), c: nmT("your appointment", "a marcação", "su cita") },
    { k: /\b(product\w*|quality|order\w*|delivery|deliver\w*|shop|store|stock)\b/i, p: nmT("the quality", "a qualidade", "la calidad"), c: nmT("your order", "a encomenda", "su pedido") }
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
  function joinList(a) { return a.length < 2 ? (a[0] || "") : a.slice(0, -1).join(", ") + nmT(" and ", " e ", " y ") + a[a.length - 1]; }
  function de(phrase) {
    var l = nmLang();
    if (l === "pt") {
      if (/^a /.test(phrase)) return "da " + phrase.slice(2);
      if (/^o /.test(phrase)) return "do " + phrase.slice(2);
      if (/^as /.test(phrase)) return "das " + phrase.slice(3);
      if (/^os /.test(phrase)) return "dos " + phrase.slice(3);
    }
    if (l === "es" && /^el /.test(phrase)) return "del " + phrase.slice(3);
    return "de " + phrase;
  }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pick(a, i) { return a[i % a.length]; }

  function build(o, i) {
    var name = o.name, biz = o.biz || nmT("us", "este espaço", "este local"), A = o.a, tone = o.tone, s = o.stars;
    var greet = name
      ? pick(tone === "pro"
        ? [nmT("Dear " + name + ",", "Boa tarde, " + name + ",", "Buenas tardes, " + name + ","), nmT("Hello " + name + ",", "Olá " + name + ",", "Hola " + name + ",")]
        : [nmT("Hi " + name + ",", "Olá " + name + ",", "Hola " + name + ","), nmT("Hello " + name + ",", "Olá " + name + ",", "Hola " + name + ","), nmT("Dear " + name + ",", "Boa tarde, " + name + ",", "Buenas tardes, " + name + ",")], i)
      : pick(tone === "pro"
        ? [nmT("Hello,", "Olá,", "Hola,"), nmT("Dear guest,", "Boa tarde,", "Buenas tardes,")]
        : [nmT("Hi there,", "Olá,", "Hola,"), nmT("Hello,", "Viva,", "Buenas,"), nmT("Hi,", "Olá,", "Hola,")], i);
    var P = A.praise.length ? joinList(A.praise) : "", I = A.issues.length ? joinList(A.issues) : "";
    var contact = o.contact
      ? (tone === "short"
        ? nmT(" Write to us at " + o.contact + ".", " Escreva-nos para " + o.contact + ".", " Escríbanos a " + o.contact + ".")
        : nmT(" If you’re willing, please write to us at " + o.contact + " so we can look into it properly.", " Se puder, escreva-nos para " + o.contact + " para tratarmos disto como deve ser.", " Si puede, escríbanos a " + o.contact + " para poder revisarlo como es debido."))
      : (tone === "short"
        ? nmT(" Please get in touch with us directly.", " Contacte-nos diretamente.", " Póngase en contacto con nosotros directamente.")
        : nmT(" If you’re willing, please get in touch with us directly so we can look into it properly.", " Se puder, contacte-nos diretamente para tratarmos disto como deve ser.", " Si puede, póngase en contacto con nosotros directamente para poder revisarlo como es debido."));
    var lines = [];
    if (s >= 4) {
      lines.push(pick([
        nmT("Thank you so much for taking the time to leave " + (s === 5 ? "a 5-star review" : "such a kind review") + ".", "Muito obrigado por ter deixado " + (s === 5 ? "uma avaliação de 5 estrelas" : "uma avaliação tão simpática") + ".", "Muchas gracias por tomarse el tiempo de dejar " + (s === 5 ? "una reseña de 5 estrellas" : "una reseña tan amable") + "."),
        nmT("What a lovely review to read, thank you for sharing it.", "Que avaliação simpática, obrigado por a partilhar.", "Qué reseña tan agradable, gracias por compartirla."),
        nmT("Thank you for choosing " + biz + " and for this kind review.", "Obrigado por ter escolhido " + biz + " e por esta avaliação.", "Gracias por elegir " + biz + " y por esta reseña.")
      ], i));
      if (P) lines.push(pick([
        nmT("We’re really happy you enjoyed " + P + ".", "Ficámos muito contentes por ter gostado " + de(P) + ".", "Nos alegra mucho que haya disfrutado " + de(P) + "."),
        nmT("It means a lot to hear that " + P + " stood out for you.", "Significa muito saber que " + P + " se destacou.", "Significa mucho saber que " + P + " le llamó la atención."),
        nmT("We’ll make sure the whole team hears what you said about " + P + ".", "Vamos transmitir à equipa o que disse sobre " + P + ".", "Haremos llegar a todo el equipo lo que ha dicho sobre " + P + ".")
      ], i));
      if (I && s === 4) lines.push(pick([
        nmT("We also noted your comment about " + I + ", and we’re working on it.", "Também registámos o comentário sobre " + I + " e estamos a tratar disso.", "También hemos tomado nota de su comentario sobre " + I + " y estamos en ello."),
        nmT("Thank you as well for the honest note about " + I + "; it helps us improve.", "Obrigado também pela nota sincera sobre " + I + "; ajuda-nos a melhorar.", "Gracias también por la nota sincera sobre " + I + "; nos ayuda a mejorar."),
        nmT("Your point about " + I + " is fair, and we’ve passed it on.", "A observação sobre " + I + " é justa e já a transmitimos.", "Su apunte sobre " + I + " es justo y ya lo hemos transmitido.")
      ], i));
      lines.push(pick(A.visit
        ? [nmT("We look forward to welcoming you back soon!", "Esperamos recebê-lo de novo em breve!", "¡Esperamos volver a recibirle pronto!"), nmT("See you again soon!", "Até breve!", "¡Hasta pronto!"), nmT("We can’t wait to have you back.", "Teremos todo o gosto em recebê-lo outra vez.", "Estaremos encantados de tenerle de nuevo.")]
        : [nmT("We hope to welcome you again soon.", "Esperamos voltar a recebê-lo.", "Esperamos recibirle otra vez pronto."), nmT("Hope to see you again!", "Esperamos vê-lo outra vez!", "¡Esperamos verle de nuevo!"), nmT("You’re always welcome back.", "É sempre bem-vindo.", "Siempre será bienvenido.")], i));
    } else if (s === 3) {
      lines.push(pick([
        nmT("Thank you for your honest feedback.", "Obrigado pelo comentário sincero.", "Gracias por su comentario sincero."),
        nmT("Thank you for taking the time to share your experience.", "Obrigado por ter partilhado a sua experiência.", "Gracias por tomarse el tiempo de compartir su experiencia."),
        nmT("We appreciate the balanced review, thank you.", "Agradecemos a avaliação equilibrada.", "Agradecemos la reseña equilibrada.")
      ], i));
      if (P) lines.push(pick([
        nmT("We’re glad you liked " + P + ".", "Ainda bem que gostou " + de(P) + ".", "Nos alegra que le gustara " + P + "."),
        nmT("It’s good to hear that " + P + " worked for you.", "É bom saber que " + P + " correu bem.", "Es bueno saber que " + P + " le funcionó."),
        nmT("Thank you for the kind words about " + P + ".", "Obrigado pelas palavras simpáticas sobre " + P + ".", "Gracias por las palabras amables sobre " + P + ".")
      ], i));
      lines.push(I
        ? pick([
          nmT("We’re sorry that " + I + " didn’t meet your expectations.", "Lamentamos que " + I + " não tenha correspondido ao esperado.", "Sentimos que " + I + " no haya estado a la altura."),
          nmT("You’re right to point out " + I + ", and we’re looking at how to do better.", "Tem razão em apontar " + I + " e estamos a ver como fazer melhor.", "Hace bien en señalar " + I + " y estamos viendo cómo hacerlo mejor."),
          nmT("We’ve shared your comments about " + I + " with the team so we can improve.", "Partilhámos com a equipa os comentários sobre " + I + " para melhorarmos.", "Hemos compartido con el equipo sus comentarios sobre " + I + " para mejorar.")
        ], i)
        : pick([
          nmT("We’d love to know what would have made it a 5-star visit.", "Gostaríamos de saber o que teria feito desta visita uma de 5 estrelas.", "Nos gustaría saber qué habría convertido la visita en una de 5 estrellas."),
          nmT("We’re always trying to improve, and your feedback helps.", "Estamos sempre a tentar melhorar e o seu comentário ajuda.", "Siempre intentamos mejorar y su comentario ayuda."),
          nmT("We’d like to do better next time.", "Gostaríamos de fazer melhor da próxima vez.", "Nos gustaría hacerlo mejor la próxima vez.")
        ], i));
      lines.push(pick([
        nmT("We hope you’ll give us another chance.", "Esperamos que nos dê outra oportunidade.", "Esperamos que nos dé otra oportunidad."),
        nmT("We’d be glad to welcome you back and show you our best.", "Teremos todo o gosto em recebê-lo de novo e mostrar o nosso melhor.", "Estaremos encantados de recibirle de nuevo y mostrarle lo mejor."),
        nmT("Thank you again, and we hope to see you soon.", "Obrigado outra vez e esperamos vê-lo em breve.", "Gracias de nuevo y esperamos verle pronto.")
      ], i));
    } else {
      lines.push(pick([
        nmT("Thank you for letting us know, and we’re sorry your experience wasn’t what it should have been.", "Obrigado por nos avisar. Lamentamos que a experiência não tenha sido a que devia.", "Gracias por avisarnos y sentimos que la experiencia no haya sido la que debía."),
        nmT("We’re sorry to read this, and thank you for taking the time to tell us.", "Lamentamos ler isto e obrigado por nos ter dito.", "Sentimos leer esto y gracias por tomarse el tiempo de decírnoslo."),
        nmT("We apologise for your experience and appreciate your honest review.", "Pedimos desculpa pela experiência e agradecemos a avaliação sincera.", "Le pedimos disculpas por su experiencia y agradecemos la reseña sincera.")
      ], i));
      if (I) lines.push(pick([
        nmT("What you describe about " + I + " is not the standard we aim for.", "O que descreve sobre " + I + " não é o padrão a que nos propomos.", "Lo que describe sobre " + I + " no es el nivel al que aspiramos."),
        nmT("We take your comments about " + I + " seriously and have shared them with the team.", "Levamos a sério os comentários sobre " + I + " e já os partilhámos com a equipa.", "Nos tomamos en serio sus comentarios sobre " + I + " y ya los hemos compartido con el equipo."),
        nmT("We’re looking into what happened with " + I + ".", "Estamos a ver o que aconteceu com " + I + ".", "Estamos viendo qué ocurrió con " + I + ".")
      ], i));
      if (P && tone !== "short") lines.push(nmT("We’re glad at least " + P + " was right.", "Ainda bem que, pelo menos, " + P + " correu bem.", "Nos alegra que al menos " + P + " haya estado bien."));
      lines.push(contact.trim());
      if (tone !== "short") lines.push(pick([
        nmT("We hope to have the chance to make it right.", "Esperamos ter a oportunidade de corrigir.", "Esperamos tener la ocasión de corregirlo."),
        nmT("We’d appreciate the opportunity to do better.", "Agradecíamos a oportunidade de fazer melhor.", "Agradeceríamos la oportunidad de hacerlo mejor."),
        nmT("Thank you again for helping us improve.", "Obrigado outra vez por nos ajudar a melhorar.", "Gracias de nuevo por ayudarnos a mejorar.")
      ], i));
    }
    if (tone === "short") {
      var mid = lines.slice(1, -1);
      var key = I ? mid.filter(function (l) { return l.indexOf(I) >= 0; })[0] : mid[0];
      lines = [lines[0]].concat(key ? [key] : []).concat(s <= 2 ? [contact.trim()] : []);
    }
    var sign = o.sign
      ? "\n\n" + (tone === "pro" ? nmT("Kind regards,\n", "Com os melhores cumprimentos,\n", "Atentamente,\n") : "– ") + o.sign
      : (o.biz ? "\n\n– " + nmT("The " + o.biz + " team", "A equipa " + o.biz, "El equipo de " + o.biz) : "");
    return greet + "\n\n" + lines.join(" ") + sign;
  }

  function copy(text, btn) {
    var done = function () { btn.textContent = nmT("Copied", "Copiado", "Copiado"); setTimeout(function () { btn.textContent = nmT("Copy", "Copiar", "Copiar"); }, 1500); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () { fallback(); });
    else fallback();
    function fallback() { var t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); done(); } catch (e) {} t.remove(); }
  }

  goEl.addEventListener("click", function () {
    var review = $("review").value.trim();
    if (review.length < 3 && !confirm(nmT("The review box is empty (star-only review). Write generic replies?", "A caixa da avaliação está vazia (só estrelas). Escrever respostas genéricas?", "El cuadro de la reseña está vacío (solo estrellas). ¿Escribir respuestas genéricas?"))) return;
    if (remaining() <= 0) { paintRemain(); return; }
    var stars = +(document.querySelector("input[name=stars]:checked") || { value: 5 }).value;
    var o = { name: $("reviewer").value.trim().split(/\s+/)[0] || "", biz: $("biz").value.trim(), sign: $("sign").value.trim(), contact: $("contact").value.trim(), tone: $("tone").value, stars: stars, a: analyse(review) };
    var order = shuffle([0, 1, 2]);
    outEl.innerHTML = "";
    order.forEach(function (v, n) {
      var text = build(o, v);
      var art = document.createElement("article"); art.className = "xpw-card";
      var hd = document.createElement("header"); var f = document.createElement("span"); f.className = "fmt"; f.textContent = nmT("Draft ", "Rascunho ", "Borrador ") + (n + 1); hd.appendChild(f);
      var ch = document.createElement("span"); ch.className = "chars"; ch.textContent = text.length + nmT(" characters", " caracteres", " caracteres"); hd.appendChild(ch);
      var pre = document.createElement("pre"); pre.textContent = text; pre.contentEditable = "true"; pre.spellcheck = true;
      var act = document.createElement("div"); act.className = "xpw-actions";
      var b = document.createElement("button"); b.className = "btn ghost"; b.type = "button"; b.textContent = nmT("Copy", "Copiar", "Copiar");
      b.addEventListener("click", function () { copy(pre.innerText, b); });
      act.appendChild(b); art.appendChild(hd); art.appendChild(pre); art.appendChild(act); outEl.appendChild(art);
    });
    var u = usage(); u.count++; try { localStorage.setItem(USE_LS, JSON.stringify(u)); } catch (e) {}
    var found = o.a.praise.concat(o.a.issues);
    statusEl.textContent = (found.length ? nmT("Picked up: ", "Detetámos: ", "Hemos recogido: ") + joinList(found) + ". " : "") + nmT("You can edit a draft right in the box before copying it.", "Pode editar o rascunho na caixa antes de o copiar.", "Puede editar el borrador en el cuadro antes de copiarlo.");
    paintRemain();
  });
  paintRemain();
})();
