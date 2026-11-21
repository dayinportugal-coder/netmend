/* Netmend X Reach Checker. Local checks run in this browser with no key.
   Gemini analysis uses the visitor's key, stored only in localStorage. */
(function (root) {
  function nmLang(){var l=(typeof document!=="undefined"&&document.documentElement&&document.documentElement.lang||"pt").toLowerCase();return l.indexOf("en")===0?"en":l.indexOf("es")===0?"es":"pt";}
  function nmT(en, pt, es){var l=nmLang();return l==="en"?en:l==="es"?es:pt;}
  var KEY_LS = "netmend-xrc-gemini-key";
  var KEY_FALLBACK = "netmend-xpw-gemini-key";
  var USE_LS = "netmend-xrc-usage";
  var DAILY_LIMIT = 3;
  var MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-3.8-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash"
  ];

  var FILLERS = [
    /^\s*so[,.\s]+/i,
    /^\s*just\s+(wanted|a\s+quick|sharing|posted|dropping)/i,
    /^\s*i\s+(just\s+)?(wanted\s+to\s+(share|post|say)|thought\s+i(?:'d| would))/i,
    /^\s*quick\s+(post|update|thread|share)/i,
    /^\s*(?:a\s+)?thread\s*(?:on|about|:)/i,
    /^\s*let\s+me\s+(share|tell|introduce)/i,
    /^\s*(?:i(?:'m| am)|we(?:'re| are))\s+(excited|thrilled|happy)\s+to\s+(announce|share)/i,
    /^\s*happy\s+to\s+announce/i,
    /^\s*check\s+(this|out|my)\b/i,
    /^\s*i\s+just\s+(posted|published|dropped)\b/i
  ];

  var BAIT = [
    /\b(?:like|rt|retweet|repost|share|follow)\s+(?:if|and|for)\b/i,
    /\b(?:drop a|smash the|hit follow|link in (?:my )?bio)\b/i,
    /\b(?:comment\s+(?:yes|no|below|if)|say yes if)\b/i,
    /\bdm me\b/i,
    /\bagree\s*\?\s*$/i
  ];

  function countChars(s) {
    return Array.from(s || "").length;
  }

  function firstLine(text) {
    var t = String(text || "").replace(/^\s+/, "");
    if (!t) return "";
    var nl = t.split(/\n/)[0].trim();
    if (nl && (t.indexOf("\n") !== -1 || nl.length <= 200)) return nl;
    var sent = t.match(/^[\s\S]{1,200}?(?:[.!?…]|$)/);
    return (sent ? sent[0] : t.slice(0, 140)).trim();
  }

  function urlsOf(text) {
    var out = [];
    var re = /\bhttps?:\/\/[^\s<>)"']+/gi;
    var m;
    while ((m = re.exec(text))) out.push(m[0].replace(/[.,;:!?)]+$/, ""));
    re = /(?:^|\s)(www\.[^\s<>)"']+)/gi;
    while ((m = re.exec(text))) out.push(m[1].replace(/[.,;:!?)]+$/, ""));
    return out;
  }

  function hashtagsOf(text) {
    var out = [];
    var re = /(^|[\s(])#([^\s#]+)/g;
    var m;
    while ((m = re.exec(text))) out.push(m[2]);
    return out;
  }

  function mentionsOf(text) {
    var out = [];
    var re = /(^|[^a-zA-Z0-9_])@([a-zA-Z0-9_]{1,15})\b/g;
    var m;
    while ((m = re.exec(text))) out.push(m[2]);
    return out;
  }

  function countEmoji(s) {
    try {
      var m = String(s || "").match(/\p{Extended_Pictographic}/gu);
      return m ? m.length : 0;
    } catch (e) {
      return 0;
    }
  }

  function letterCaseRatio(s) {
    var letters = String(s || "").match(/[A-Za-zÀ-ÿ]/g) || [];
    if (letters.length < 20) return 0;
    var upper = letters.filter(function (ch) { return ch === ch.toUpperCase() && ch !== ch.toLowerCase(); }).length;
    return upper / letters.length;
  }

  function hourFromFields(when, zone) {
    if (!when) return null;
    var m = String(when).match(/T(\d{2})/);
    if (!m) return null;
    return { hour: Number(m[1]), zone: zone || nmT("the timezone you chose", "o fuso que escolheu", "la zona horaria que eligió") };
  }

  function analyze(text, opts) {
    opts = opts || {};
    var raw = String(text || "");
    var trimmed = raw.trim();
    var checks = [];
    var n = countChars(trimmed);
    var line = firstLine(trimmed);
    var urls = urlsOf(trimmed);
    var tags = hashtagsOf(trimmed);
    var ments = mentionsOf(trimmed);
    var emojis = countEmoji(trimmed);
    var hasBreak = /\n/.test(trimmed);

    function add(id, status, title, detail, weight) {
      checks.push({ id: id, status: status, title: title, detail: detail, weight: weight });
    }

    if (!trimmed) {
      add("length", "fail", nmT("No text", "Sem texto", "Sin texto"), nmT("Paste the post you published, or a draft, before running the check.", "Cole a publicação que fez, ou um rascunho, antes de correr a verificação.", "Pegue la publicación que hizo, o un borrador, antes de ejecutar la comprobación."), 40);
    } else if (n < 40) {
      add("length", "warn", nmT("Very short", "Muito curto", "Muy corto"), nmT("This is " + n + " characters. A short line can work if the hook is sharp, but there is little here for someone to reply to or share.", "São " + n + " caracteres. Uma linha curta pode resultar se o gancho for afiado, mas há pouco aqui para alguém responder ou partilhar.", "Son " + n + " caracteres. Una línea corta puede funcionar si el gancho es agudo, pero hay poco para que alguien responda o comparta."), 8);
    } else if (n > 280 && n <= 600) {
      add("length", "warn", nmT("Longer than 280 characters", "Mais de 280 caracteres", "Más de 280 caracteres"), nmT("This is " + n + " characters. A standard account cannot post this as one tweet. On Premium, long posts can work, but a wall of text often loses people before the point.", "São " + n + " caracteres. Uma conta normal não publica isto num só post. No Premium, os posts longos podem resultar, mas um bloco de texto perde pessoas antes da ideia.", "Son " + n + " caracteres. Una cuenta normal no puede publicarlo en un solo post. En Premium, los posts largos pueden funcionar, pero un bloque de texto pierde a la gente antes de la idea."), 7);
    } else if (n > 600) {
      add("length", "fail", nmT("Very long post", "Publicação muito longa", "Publicación muy larga"), nmT("This is " + n + " characters. Even where long posts are allowed, this is hard to finish. Cut it, or split it into a short hook plus a thread.", "São " + n + " caracteres. Mesmo onde os posts longos são permitidos, é difícil chegar ao fim. Corte, ou divida num gancho curto e num fio.", "Son " + n + " caracteres. Incluso donde se permiten posts largos, es difícil terminarlo. Córtelo o divídalo en un gancho corto y un hilo."), 14);
    } else {
      add("length", "pass", nmT("Length is in a usable range", "O tamanho está num intervalo útil", "La longitud está en un intervalo útil"), nmT(n + " characters, within the classic 280-character post. Length alone will not decide reach.", n + " caracteres, dentro do post clássico de 280. O tamanho, por si, não decide o alcance.", n + " caracteres, dentro del post clásico de 280. La longitud, por sí sola, no decide el alcance."), 0);
    }

    if (trimmed) {
      var startsUrl = /^(?:https?:\/\/|www\.)/i.test(line);
      var startsTag = /^#/.test(line);
      var startsAt = /^@/.test(line);
      var onlyEmoji = line && countEmoji(line) > 0 && countChars(line.replace(/\p{Extended_Pictographic}/gu, "").replace(/\s/g, "")) === 0;
      var fillerHit = FILLERS.some(function (re) { return re.test(line); });
      if (!line) {
        add("hook", "fail", nmT("No first line", "Sem primeira linha", "Sin primera línea"), nmT("The first line is empty. On X, that line is the post: if it does not stand alone, most people never read the rest.", "A primeira linha está vazia. No X, essa linha é a publicação: se não se percebe sozinha, a maior parte das pessoas não lê o resto.", "La primera línea está vacía. En X, esa línea es la publicación: si no se entiende sola, la mayoría no lee el resto."), 16);
      } else if (startsUrl) {
        add("hook", "fail", nmT("The first line is a link", "A primeira linha é uma ligação", "La primera línea es un enlace"), nmT("Opening with a URL gives people nothing to read before they are sent away. Put the point first and leave the link for a reply.", "Abrir com um URL não dá nada para ler antes de sair. Ponha a ideia primeiro e deixe a ligação para uma resposta.", "Abrir con una URL no da nada que leer antes de salir. Ponga la idea primero y deje el enlace para una respuesta."), 16);
      } else if (startsTag) {
        add("hook", "fail", nmT("The first line starts with a hashtag", "A primeira linha começa com um hashtag", "La primera línea empieza por un hashtag"), nmT("A hashtag is a weak opening. Lead with a sentence a stranger can understand.", "Um hashtag é uma abertura fraca. Comece com uma frase que um desconhecido perceba.", "Un hashtag es una apertura débil. Empiece con una frase que un desconocido entienda."), 14);
      } else if (startsAt) {
        add("hook", "warn", nmT("The first line starts with @", "A primeira linha começa com @", "La primera línea empieza por @"), nmT("Posts that begin with an @ are often treated as replies, which usually reach fewer people than a standalone post. Put the name later, or mention them in a reply.", "As publicações que começam com @ são muitas vezes tratadas como respostas e chegam a menos pessoas do que um post autónomo. Ponha o nome mais à frente ou mencione-o numa resposta.", "Las publicaciones que empiezan por @ suelen tratarse como respuestas y llegan a menos gente que un post independiente. Ponga el nombre más adelante o menciónelo en una respuesta."), 12);
      } else if (onlyEmoji) {
        add("hook", "fail", nmT("The first line is only emoji", "A primeira linha é só emoji", "La primera línea es solo un emoji"), nmT("There is no sentence for a stranger to hold onto. Write a first line that states the point.", "Não há uma frase a que um desconhecido se agarre. Escreva uma primeira linha que diga a ideia.", "No hay una frase a la que un desconocido se agarre. Escriba una primera línea que diga la idea."), 14);
      } else if (fillerHit) {
        add("hook", "fail", nmT("The hook is throat-clearing", "O gancho é uma entrada vazia", "El gancho es un preámbulo vacío"), nmT("The first line starts with filler (“just wanted to share”, “quick thread”, “check this out”). That line is the post. Say the actual point first.", "A primeira linha começa com enchimento (“só queria partilhar”, “fio rápido”, “vejam isto”). Essa linha é a publicação. Diga primeiro a ideia.", "La primera línea empieza con relleno (“solo quería compartir”, “hilo rápido”, “miren esto”). Esa línea es la publicación. Diga primero la idea."), 14);
      } else if (countChars(line) < 20) {
        add("hook", "warn", nmT("The first line is very thin", "A primeira linha é muito fina", "La primera línea es muy escasa"), nmT("“" + line + "” is short and may not stand alone. A stranger should understand the topic from this line alone.", "“" + line + "” é curta e pode não se perceber sozinha. Um desconhecido deve perceber o tema só com esta linha.", "“" + line + "” es corta y puede no entenderse sola. Un desconocido debe entender el tema solo con esta línea."), 7);
      } else if (!hasBreak && n > 200) {
        add("hook", "warn", nmT("No break after the hook", "Sem quebra depois do gancho", "Sin salto tras el gancho"), nmT("This is one block of text, so the first line never gets a chance to land on its own. Put a line break after the opening sentence.", "Isto é um bloco só, por isso a primeira linha nunca assenta sozinha. Ponha uma quebra de linha depois da frase de abertura.", "Esto es un solo bloque, así que la primera línea nunca se asienta sola. Ponga un salto de línea tras la frase de apertura."), 7);
      } else {
        add("hook", "pass", nmT("The first line can stand alone", "A primeira linha percebe-se sozinha", "La primera línea se entiende sola"), nmT("The opening is a real sentence, not a link, a tag, or filler. That is the part most people will actually see.", "A abertura é uma frase a sério, não uma ligação, uma etiqueta ou enchimento. É a parte que a maior parte das pessoas vê.", "La apertura es una frase de verdad, no un enlace, una etiqueta o relleno. Es la parte que la mayoría verá."), 0);
      }
    }

    if (trimmed) {
      if (urls.length >= 2) {
        add("links", "fail", nmT("More than one external link", "Mais do que uma ligação externa", "Más de un enlace externo"), nmT("There are " + urls.length + " links in the post. Links in the main post often get less distribution than the same text with the link in a reply you write yourself.", "Há " + urls.length + " ligações na publicação. Ligações no post principal costumam ter menos distribuição do que o mesmo texto com a ligação numa resposta sua.", "Hay " + urls.length + " enlaces en la publicación. Los enlaces en el post principal suelen tener menos distribución que el mismo texto con el enlace en una respuesta suya."), 14);
      } else if (urls.length === 1) {
        add("links", "warn", nmT("External link in the post", "Ligação externa na publicação", "Enlace externo en la publicación"), nmT("There is a link in the main post (“" + urls[0] + "”). A common pattern that keeps more of the distribution: post the text, then add the link in your first reply.", "Há uma ligação no post principal (“" + urls[0] + "”). Um padrão que costuma guardar mais distribuição: publique o texto e ponha a ligação na primeira resposta.", "Hay un enlace en el post principal (“" + urls[0] + "”). Un patrón que suele conservar más distribución: publique el texto y ponga el enlace en la primera respuesta."), 10);
      } else {
        add("links", "pass", nmT("No external link in the post", "Sem ligação externa na publicação", "Sin enlace externo en la publicación"), nmT("Nothing here sends the reader off X in the main post. If you need a link, it is usually safer in a reply.", "Nada aqui tira o leitor do X no post principal. Se precisar de uma ligação, costuma ser mais seguro numa resposta.", "Nada aquí saca al lector de X en el post principal. Si necesita un enlace, suele ser más seguro en una respuesta."), 0);
      }
    }

    if (trimmed) {
      if (tags.length >= 3) {
        add("hashtags", "fail", nmT("Too many hashtags", "Hashtags a mais", "Demasiados hashtags"), nmT("There are " + tags.length + " hashtags. On X, a stack of tags often looks like spam and can hurt distribution. One is usually enough; zero is fine.", "Há " + tags.length + " hashtags. No X, uma pilha de etiquetas parece spam e pode prejudicar a distribuição. Um chega; zero também está bem.", "Hay " + tags.length + " hashtags. En X, una pila de etiquetas parece spam y puede perjudicar la distribución. Uno suele bastar; cero también está bien."), 12);
      } else if (tags.length === 2) {
        add("hashtags", "warn", nmT("Two hashtags", "Dois hashtags", "Dos hashtags"), nmT("Two hashtags is already a lot for a single X post. If they are not doing real work, drop them.", "Dois hashtags já é muito para um post no X. Se não fizerem trabalho real, retire-os.", "Dos hashtags ya es mucho para un post en X. Si no hacen un trabajo real, quítelos."), 6);
      } else if (tags.length === 1) {
        add("hashtags", "pass", nmT("At most one hashtag", "No máximo um hashtag", "Como mucho un hashtag"), nmT("One hashtag, which is within a sensible range. Many posts do better with none.", "Um hashtag, dentro de um intervalo sensato. Muitos posts resultam melhor sem nenhum.", "Un hashtag, dentro de un intervalo sensato. Muchos posts funcionan mejor sin ninguno."), 0);
      } else {
        add("hashtags", "pass", nmT("No hashtags", "Sem hashtags", "Sin hashtags"), nmT("Fine. Hashtags are optional on X and are not required for reach.", "Está bem. Os hashtags são opcionais no X e não são precisos para o alcance.", "Está bien. Los hashtags son opcionales en X y no hacen falta para el alcance."), 0);
      }
    }

    if (trimmed) {
      var issues = [];
      if (/\u2014/.test(trimmed)) issues.push(nmT("an em dash (—), which is a common AI tell and is worth replacing with a comma, a colon, or a full stop", "um travessão (—), um sinal frequente de texto de IA, que vale a pena trocar por vírgula, dois pontos ou ponto final", "una raya (—), una señal frecuente de texto de IA, que conviene cambiar por una coma, dos puntos o un punto"));
      if (letterCaseRatio(trimmed) >= 0.6) issues.push(nmT("a high share of capital letters, which reads as shouting", "muitas maiúsculas, que se lêem como gritaria", "muchas mayúsculas, que se leen como gritos"));
      if (!hasBreak && n > 180 && n <= 280) issues.push(nmT("no line break in a long post, so it lands as a wall of text", "sem quebra de linha num post longo, por isso cai como um bloco de texto", "sin salto de línea en un post largo, así que cae como un bloque de texto"));
      if (/[!?]{3,}/.test(trimmed)) issues.push(nmT("repeated question or exclamation marks", "pontos de interrogação ou exclamação repetidos", "signos de interrogación o exclamación repetidos"));
      if (emojis >= 5) issues.push(nmT(emojis + " emoji, which starts to look noisy rather than useful", emojis + " emojis, que começam a parecer ruído em vez de ajuda", emojis + " emojis, que empiezan a parecer ruido en vez de ayuda"));
      if (issues.length >= 2) {
        add("formatting", "fail", nmT("Formatting gets in the way", "A formatação atrapalha", "El formato estorba"), nmT("This post has " + issues.join("; ") + ". Clean that up before you worry about anything else.", "Esta publicação tem " + issues.join("; ") + ". Limpe isso antes de se preocupar com o resto.", "Esta publicación tiene " + issues.join("; ") + ". Límpielo antes de preocuparse por lo demás."), 12);
      } else if (issues.length === 1) {
        add("formatting", "warn", nmT("Formatting issue", "Problema de formatação", "Problema de formato"), nmT("This post has " + issues[0] + ".", "Esta publicação tem " + issues[0] + ".", "Esta publicación tiene " + issues[0] + "."), 6);
      } else {
        add("formatting", "pass", nmT("Formatting is clean", "A formatação está limpa", "El formato está limpio"), nmT("No wall of text, no all-caps, no emoji pile, no repeated punctuation. The layout is not standing in the way.", "Sem bloco de texto, sem tudo em maiúsculas, sem pilha de emojis, sem pontuação repetida. A disposição não atrapalha.", "Sin bloque de texto, sin todo en mayúsculas, sin pila de emojis, sin puntuación repetida. La disposición no estorba."), 0);
      }
    }

    if (trimmed) {
      var baitHit = BAIT.some(function (re) { return re.test(trimmed); });
      var softAsk = /\b(?:what do you think|thoughts\s*\?|agree\s*\?)\s*$/i.test(trimmed);
      if (baitHit) {
        add("cta", "fail", nmT("Engagement-bait CTA", "Chamada a gostar ou a seguir", "Llamada a dar me gusta o a seguir"), nmT("The text asks for likes, follows, comments on cue, or a “link in bio”. That kind of call to action is easy to recognise and often gets less distribution, not more.", "O texto pede gostos, seguidores, comentários de comando ou uma “ligação na bio”. Esse tipo de chamada reconhece-se depressa e costuma ter menos distribuição, não mais.", "El texto pide me gusta, seguidores, comentarios a la orden o un “enlace en la bio”. Ese tipo de llamada se reconoce enseguida y suele tener menos distribución, no más."), 14);
      } else if (softAsk) {
        add("cta", "warn", nmT("A generic closing question", "Uma pergunta de fecho genérica", "Una pregunta de cierre genérica"), nmT("“What do you think?” and “Thoughts?” are overused closers. A specific question about a fact in the post is easier to answer.", "“O que acha?” e “Opiniões?” são fechos gastos. Uma pergunta concreta sobre um facto da publicação é mais fácil de responder.", "“¿Qué le parece?” y “¿Opiniones?” son cierres gastados. Una pregunta concreta sobre un dato de la publicación es más fácil de responder."), 6);
      } else if (/\?/.test(trimmed)) {
        add("cta", "pass", nmT("A real question is in the post", "Há uma pergunta a sério na publicação", "Hay una pregunta de verdad en la publicación"), nmT("There is a question in the text, and it is not a like-if-you-agree cue. That gives people something concrete to reply to.", "Há uma pergunta no texto e não é um “goste se concorda”. Dá às pessoas algo concreto para responder.", "Hay una pregunta en el texto y no es un “me gusta si está de acuerdo”. Da a la gente algo concreto que responder."), 0);
      } else {
        add("cta", "warn", nmT("Nothing obvious to reply to", "Nada óbvio a que responder", "Nada obvio a lo que responder"), nmT("The post does not ask a real question and does not leave a clear point of disagreement. Reach is not only replies, but a post with no handle for a response is easier to scroll past.", "A publicação não faz uma pergunta a sério nem deixa um ponto claro de discordância. O alcance não são só respostas, mas um post sem sítio para responder é mais fácil de passar.", "La publicación no hace una pregunta de verdad ni deja un punto claro de desacuerdo. El alcance no son solo las respuestas, pero un post sin sitio para responder es más fácil de pasar."), 5);
      }
    }

    if (trimmed) {
      if (ments.length >= 6) {
        add("mentions", "fail", nmT("A long list of mentions", "Uma lista longa de menções", "Una lista larga de menciones"), nmT("There are " + ments.length + " @mentions. A tag list is easy to ignore and can make the post look like a mass ping.", "Há " + ments.length + " @menções. Uma lista de etiquetas ignora-se facilmente e pode parecer um aviso em massa.", "Hay " + ments.length + " @menciones. Una lista de etiquetas se ignora con facilidad y puede parecer un aviso masivo."), 12);
      } else if (ments.length >= 3) {
        add("mentions", "warn", nmT("Several @mentions", "Várias @menções", "Varias @menciones"), nmT("There are " + ments.length + " mentions. Mention people you are actually talking to, not a list you hope will share the post.", "Há " + ments.length + " menções. Mencione pessoas com quem está mesmo a falar, não uma lista que espera que partilhe o post.", "Hay " + ments.length + " menciones. Mencione a personas con las que de verdad habla, no una lista que espera que comparta el post."), 6);
      } else if (/^@/.test(trimmed)) {
        add("mentions", "warn", nmT("Starts as a mention", "Começa como menção", "Empieza como mención"), nmT("Because the post starts with @, it may be treated as a reply, with a smaller audience than a standalone post.", "Como a publicação começa com @, pode ser tratada como resposta, com um público menor do que um post autónomo.", "Como la publicación empieza por @, puede tratarse como respuesta, con un público menor que un post independiente."), 10);
      } else {
        add("mentions", "pass", nmT("Mentions are under control", "As menções estão controladas", "Las menciones están controladas"), ments.length ? nmT("There " + (ments.length === 1 ? "is 1 mention" : "are " + ments.length + " mentions") + ", which is a reasonable number.", (ments.length === 1 ? "Há 1 menção" : "Há " + ments.length + " menções") + ", um número razoável.", (ments.length === 1 ? "Hay 1 mención" : "Hay " + ments.length + " menciones") + ", un número razonable.") : nmT("No @mentions, so this will not be read as a reply or a tag list.", "Sem @menções, por isso isto não se lê como resposta nem como lista de etiquetas.", "Sin @menciones, así que esto no se lee como respuesta ni como lista de etiquetas."), 0);
      }
    }

    var when = hourFromFields(opts.when, opts.timezone);
    if (when) {
      var h = when.hour;
      var z = when.zone;
      if (h >= 0 && h < 6) {
        add("timing", "warn", nmT("Posted in a quiet window", "Publicado numa hora calma", "Publicado en una hora tranquila"), nmT("You said this went out at " + String(h).padStart(2, "0") + ":00–" + String(h).padStart(2, "0") + ":59 in " + z + ". That is a quiet stretch for many audiences. This is not a prediction, and the exact weights are not public; it is only a reason to try a window when your replies usually arrive.", "Indicou que saiu às " + String(h).padStart(2, "0") + ":00–" + String(h).padStart(2, "0") + ":59 em " + z + ". É uma faixa calma para muitos públicos. Não é uma previsão e os pesos exatos não são públicos; é só um motivo para experimentar a hora em que as respostas costumam chegar.", "Indicó que salió a las " + String(h).padStart(2, "0") + ":00–" + String(h).padStart(2, "0") + ":59 en " + z + ". Es una franja tranquila para muchos públicos. No es una predicción y los pesos exactos no son públicos; es solo un motivo para probar la hora en la que suelen llegar las respuestas."), 7);
      } else if (h >= 22 || h < 8) {
        add("timing", "warn", nmT("Posted at the edge of the day", "Publicado à beira do dia", "Publicado al borde del día"), nmT("You said this went out around " + String(h).padStart(2, "0") + ":00 in " + z + ". Early morning and late night can be thin. If your usual replies come later, test that window next time.", "Indicou que saiu por volta das " + String(h).padStart(2, "0") + ":00 em " + z + ". De manhã cedo e à noite tarde o público pode ser fino. Se as respostas costumam chegar mais tarde, teste essa hora da próxima vez.", "Indicó que salió alrededor de las " + String(h).padStart(2, "0") + ":00 en " + z + ". A primera hora y a última de la noche el público puede ser escaso. Si las respuestas suelen llegar más tarde, pruebe esa hora la próxima vez."), 5);
      } else {
        add("timing", "pass", nmT("Posted in a daytime window", "Publicado numa hora de dia", "Publicado en una hora diurna"), nmT("You said this went out around " + String(h).padStart(2, "0") + ":00 in " + z + ". That is inside an ordinary daytime span. Timing is only one factor, and it is not a guarantee of reach.", "Indicou que saiu por volta das " + String(h).padStart(2, "0") + ":00 em " + z + ". Está dentro de um período diurno normal. A hora é só um fator e não garante alcance.", "Indicó que salió alrededor de las " + String(h).padStart(2, "0") + ":00 en " + z + ". Está dentro de un periodo diurno normal. La hora es solo un factor y no garantiza alcance."), 0);
      }
    } else {
      add("timing", "warn", nmT("No post time given", "Sem hora de publicação", "Sin hora de publicación"), nmT("Timing can matter because the first hour of replies is often used as a signal. Add an approximate time and timezone above if you want this check. We do not see your X analytics.", "A hora pode importar porque a primeira hora de respostas é muitas vezes um sinal. Acrescente uma hora aproximada e o fuso acima se quiser esta verificação. Não vemos as estatísticas do X.", "La hora puede importar porque la primera hora de respuestas suele ser una señal. Añada una hora aproximada y la zona horaria arriba si quiere esta comprobación. No vemos las estadísticas de X."), 0);
    }

    var media = opts.media || "unknown";
    var mediaWord = media === "image" ? nmT("an image", "uma imagem", "una imagen") : media === "video" ? nmT("a video", "um vídeo", "un vídeo") : media === "poll" ? nmT("a poll", "uma sondagem", "una encuesta") : media;
    if (media === "none") {
      add("media", "warn", nmT("Text only", "Só texto", "Solo texto"), nmT("You marked this as a text-only post. That can be fine. For a product, a screenshot, or a before/after, an image often helps the post stop the scroll. This tool cannot see media, so this is only what you told it.", "Marcou isto como publicação só de texto. Pode estar bem. Para um produto, uma captura ou um antes/depois, uma imagem costuma parar o scroll. Esta ferramenta não vê media, por isso isto é só o que indicou.", "Marcó esto como publicación solo de texto. Puede estar bien. Para un producto, una captura o un antes/después, una imagen suele parar el scroll. Esta herramienta no ve el media, así que esto es solo lo que indicó."), 4);
    } else if (media === "image" || media === "video" || media === "poll") {
      add("media", "pass", nmT("You added media", "Acrescentou media", "Añadió media"), nmT("You marked this post as having " + media + ". This tool only reads the text, so it cannot score the image, video or poll itself.", "Marcou esta publicação como tendo " + mediaWord + ". Esta ferramenta só lê o texto, por isso não avalia a imagem, o vídeo ou a sondagem.", "Marcó esta publicación como que tiene " + mediaWord + ". Esta herramienta solo lee el texto, así que no valora la imagen, el vídeo o la encuesta."), 0);
    } else {
      add("media", "pass", nmT("Media not checked", "Media não verificado", "Media no comprobado"), nmT("This tool only reads the text you paste. If the post had an image, a video or a poll, that is outside this checklist.", "Esta ferramenta só lê o texto que cola. Se a publicação tinha imagem, vídeo ou sondagem, isso fica fora desta lista.", "Esta herramienta solo lee el texto que pega. Si la publicación tenía imagen, vídeo o encuesta, eso queda fuera de esta lista."), 0);
    }

    var score = 100;
    checks.forEach(function (c) {
      if (c.status === "fail") score -= (c.weight || 14);
      else if (c.status === "warn" && c.weight) score -= c.weight;
    });
    score = Math.max(0, Math.min(100, Math.round(score)));
    var band = score >= 80 ? nmT("Solid", "Sólido", "Sólido") : score >= 55 ? nmT("Mixed", "Misto", "Mixto") : nmT("Weak", "Fraco", "Débil");
    var summary = score >= 80
      ? nmT("The text does not show the usual reach problems. That is not a promise of impressions.", "O texto não mostra os problemas de alcance habituais. Isto não promete impressões.", "El texto no muestra los problemas de alcance habituales. Esto no promete impresiones.")
      : score >= 55
        ? nmT("The text has some of the usual reach problems. Fix the warnings below, then edit before you post again.", "O texto tem alguns dos problemas de alcance habituais. Corrija os avisos abaixo e edite antes de publicar outra vez.", "El texto tiene algunos de los problemas de alcance habituales. Corrija los avisos de abajo y edite antes de publicar otra vez.")
        : nmT("The text has several of the usual reach problems. The items marked Fail are the ones to fix first.", "O texto tem vários dos problemas de alcance habituais. Os pontos marcados como Falha são os primeiros a corrigir.", "El texto tiene varios de los problemas de alcance habituales. Los puntos marcados como Fallo son los primeros que hay que corregir.");

    return {
      score: score,
      band: band,
      summary: summary,
      chars: n,
      checks: checks,
      hook: line,
      urls: urls,
      hashtags: tags,
      mentions: ments
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { analyze: analyze, countChars: countChars, firstLine: firstLine, urlsOf: urlsOf, hashtagsOf: hashtagsOf };
  }

  if (typeof document === "undefined") return;

  var keyEl = document.getElementById("api-key");
  var showEl = document.getElementById("toggle-key");
  var saveEl = document.getElementById("save-key");
  var clearEl = document.getElementById("clear-key");
  var keyStatus = document.getElementById("key-status");
  var postEl = document.getElementById("post");
  var whenEl = document.getElementById("when");
  var zoneEl = document.getElementById("timezone");
  var mediaEl = document.getElementById("media");
  var checkEl = document.getElementById("check");
  var rewriteEl = document.getElementById("rewrite");
  var statusEl = document.getElementById("status");
  var outEl = document.getElementById("out");
  var remainEl = document.getElementById("remain");

  var lastReport = null;

  function today() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function usage() {
    try {
      var u = JSON.parse(localStorage.getItem(USE_LS) || "{}");
      if (u.date !== today()) return { date: today(), count: 0 };
      return { date: u.date, count: Number(u.count) || 0 };
    } catch (e) {
      return { date: today(), count: 0 };
    }
  }
  function setUsage(u) {
    localStorage.setItem(USE_LS, JSON.stringify(u));
  }
  function remaining() {
    return Math.max(0, DAILY_LIMIT - usage().count);
  }
  function paintRemain() {
    var n = remaining();
    var local = nmT("Local checks are free and unlimited in this browser.", "As verificações locais são grátis e sem limite neste browser.", "Las comprobaciones locales son gratis y sin límite en este navegador.");
    var ai = n === 1
      ? nmT("1 free AI diagnosis and rewrite left today.", "Resta 1 diagnóstico e reescrita de IA grátis hoje.", "Queda 1 diagnóstico y reescritura de IA gratis hoy.")
      : nmT(n + " free AI diagnoses and rewrites left today.", "Restam " + n + " diagnósticos e reescritas de IA grátis hoje.", "Quedan " + n + " diagnósticos y reescrituras de IA gratis hoy.");
    if (remainEl) remainEl.textContent = local + " " + ai;
    if (rewriteEl) rewriteEl.disabled = n <= 0;
  }
  function getKey() {
    return (localStorage.getItem(KEY_LS) || localStorage.getItem(KEY_FALLBACK) || "").trim();
  }
  function keySaved() {
    return !!getKey();
  }
  function paintKey() {
    if (!keyEl || !keyStatus) return;
    if (keySaved()) {
      keyEl.value = "";
      keyEl.placeholder = nmT("Key saved in this browser (paste a new one to replace it)", "Chave guardada neste browser (cole uma nova para a substituir)", "Clave guardada en este navegador (pegue una nueva para sustituirla)");
      var reused = !localStorage.getItem(KEY_LS) && localStorage.getItem(KEY_FALLBACK);
      var onlyHere = nmT(" It is never sent to Netmend. We have no server for this tool.", " Nunca é enviada para a Netmend. Esta ferramenta não tem servidor.", " Nunca se envía a Netmend. Esta herramienta no tiene servidor.");
      keyStatus.innerHTML = reused
        ? '<span class="ok">' + nmT("API key reused from X Post Writer, on this device only.", "Chave da API reutilizada do X Post Writer, só neste dispositivo.", "Clave de API reutilizada de X Post Writer, solo en este dispositivo.") + "</span>" + onlyHere
        : '<span class="ok">' + nmT("API key saved on this device only.", "Chave da API guardada apenas neste dispositivo.", "Clave de API guardada solo en este dispositivo.") + "</span>" + onlyHere;
    } else {
      keyEl.placeholder = nmT("Paste your Gemini API key", "Cole a chave da API Gemini", "Pegue su clave de la API de Gemini");
      keyStatus.textContent = nmT("No key saved yet. You can still run the local checks. A free Gemini key from Google AI Studio is enough for the rewrite.", "Ainda não há chave. Pode na mesma correr as verificações locais. Uma chave Gemini grátis do Google AI Studio chega para a reescrita.", "Todavía no hay clave. Aun así puede ejecutar las comprobaciones locales. Una clave gratuita de Gemini de Google AI Studio basta para la reescritura.");
    }
  }

  if (showEl) {
    showEl.textContent = nmT("Show", "Mostrar", "Mostrar");
    showEl.addEventListener("click", function () {
      keyEl.type = keyEl.type === "password" ? "text" : "password";
      showEl.textContent = keyEl.type === "password" ? nmT("Show", "Mostrar", "Mostrar") : nmT("Hide", "Ocultar", "Ocultar");
    });
  }
  if (saveEl) {
    saveEl.addEventListener("click", function () {
      var v = (keyEl.value || "").trim();
      if (!v) {
        keyStatus.innerHTML = '<span class="bad">' + nmT("Paste a key first.", "Cole primeiro uma chave.", "Pegue primero una clave.") + "</span>";
        return;
      }
      localStorage.setItem(KEY_LS, v);
      keyEl.value = "";
      paintKey();
    });
  }
  if (clearEl) {
    clearEl.addEventListener("click", function () {
      localStorage.removeItem(KEY_LS);
      keyEl.value = "";
      paintKey();
    });
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function copyText(text, btn) {
    function done() {
      var old = btn.textContent;
      btn.textContent = nmT("Copied", "Copiado", "Copiado");
      setTimeout(function () { btn.textContent = old; }, 1200);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () {
        window.prompt(nmT("Copy this text:", "Copiar este texto:", "Copiar este texto:"), text);
      });
    } else {
      window.prompt(nmT("Copy this text:", "Copiar este texto:", "Copiar este texto:"), text);
    }
  }

  function collectOpts() {
    return {
      when: whenEl ? whenEl.value : "",
      timezone: zoneEl ? zoneEl.value : "",
      media: mediaEl ? mediaEl.value : "unknown"
    };
  }

  function meterSvg(score) {
    var r = 36;
    var c = 2 * Math.PI * r;
    var color = score >= 80 ? "#1b7a3d" : score >= 55 ? "#8a5a00" : "#b3261e";
    var dash = (score / 100) * c;
    return '<svg class="xrc-meter" viewBox="0 0 92 92" aria-hidden="true">' +
      '<circle cx="46" cy="46" r="' + r + '" fill="none" stroke="#e6e2d8" stroke-width="8"/>' +
      '<circle cx="46" cy="46" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="8" ' +
      'stroke-linecap="round" transform="rotate(-90 46 46)" stroke-dasharray="' + dash.toFixed(1) + " " + c.toFixed(1) + '"/>' +
      "</svg>";
  }

  function renderLocal(report, extraHtml) {
    var html = '<div class="xrc-score">' + meterSvg(report.score) +
      '<div><div class="num">' + report.score + " / 100</div>" +
      '<div class="tagline">' + esc(report.band) + "</div>" +
      '<p class="lbl">' + esc(report.summary) + " " + nmT("This is a checklist of common problems in the text, not a prediction of impressions and not the official X algorithm.", "Isto é uma lista de problemas comuns no texto, não uma previsão de impressões nem o algoritmo oficial do X.", "Esto es una lista de problemas comunes en el texto, no una predicción de impresiones ni el algoritmo oficial de X.") + "</p></div></div>";
    html += '<div class="xrc-checks">';
    report.checks.forEach(function (c) {
      var sev = c.status === "fail" ? nmT("Fail", "Falha", "Fallo") : c.status === "warn" ? nmT("Check", "Ver", "Revisar") : nmT("Pass", "Passa", "Pasa");
      html += '<article class="xrc-check"><span class="sev ' + c.status + '">' + sev + "</span><div><h3>" +
        esc(c.title) + "</h3><p>" + esc(c.detail) + "</p></div></article>";
    });
    html += "</div>";
    if (extraHtml) html += extraHtml;
    outEl.innerHTML = html;
  }

  function renderRewrites(data) {
    var items = (data && data.rewrites) || [];
    var html = "";
    if (data && data.summary) {
      html += '<p class="note">' + esc(data.summary) + "</p>";
    }
    if (data && data.notes) {
      html += '<p class="note">' + esc(data.notes) + "</p>";
    }
    html += '<div class="xpw-out xrc-rewrites">';
    items.forEach(function (it, idx) {
      var label = it.label || (nmT("Rewrite ", "Reescrita ", "Reescritura ") + (idx + 1));
      var text = it.text || "";
      html += '<article class="xpw-card"><header><span class="fmt">' + (idx + 1) + " · " + esc(label) +
        '</span></header><span class="chars">' + countChars(text) + nmT(" characters", " caracteres", " caracteres") + "</span><pre>" + esc(text) +
        '</pre><div class="xpw-actions"><button type="button" class="btn ghost" data-copy="' + idx +
        '">' + nmT("Copy", "Copiar", "Copiar") + "</button></div></article>";
    });
    html += "</div>";
    return { html: html, items: items };
  }

  function extractJson(s) {
    if (!s) throw new Error(nmT("Empty model response.", "Resposta vazia do modelo.", "Respuesta vacía del modelo."));
    var t = s.trim();
    var fence = t.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fence) t = fence[1].trim();
    var start = t.indexOf("{");
    var end = t.lastIndexOf("}");
    if (start >= 0 && end > start) t = t.slice(start, end + 1);
    return JSON.parse(t);
  }

  function callModel(model, key, prompt) {
    var url = "https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(model) + ":generateContent?key=" + encodeURIComponent(key);
    var body = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, responseMimeType: "application/json" }
    };
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.text().then(function (raw) {
        var data;
        try { data = JSON.parse(raw); } catch (e) { data = null; }
        if (!res.ok) {
          var msg = (data && data.error && data.error.message) || ("HTTP " + res.status);
          var err = new Error(msg);
          err.status = res.status;
          throw err;
        }
        var text = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts
          ? data.candidates[0].content.parts.map(function (p) { return p.text || ""; }).join("")
          : "";
        return extractJson(text);
      });
    });
  }

  function generateWithFallback(key, prompt) {
    var i = 0;
    var lastErr;
    function next() {
      if (i >= MODELS.length) throw lastErr || new Error(nmT("No Gemini model accepted the request.", "Nenhum modelo Gemini aceitou o pedido.", "Ningún modelo de Gemini aceptó la solicitud."));
      var model = MODELS[i++];
      statusEl.textContent = nmT("Rewriting with " + model + "…", "A reescrever com " + model + "…", "Reescribiendo con " + model + "…");
      return callModel(model, key, prompt).catch(function (err) {
        lastErr = err;
        var m = String(err.message || "");
        var retryable = err.status === 404 || err.status === 400 || /not found|unknown model|not supported/i.test(m);
        if (retryable && i < MODELS.length) return next();
        throw err;
      });
    }
    return next();
  }

  function buildPrompt(post, report, opts) {
    var findings = report.checks.map(function (c) {
      return "- [" + c.status + "] " + c.title + ": " + c.detail;
    }).join("\n");
    return [
      "You are a writing assistant that explains why an X (Twitter) post may have had weak reach, then rewrites it.",
      "Be honest: nobody outside X knows the exact ranking weights. Do not invent impression numbers, follower counts, or “this will go viral”. Do not claim official algorithm knowledge.",
      "Write in the same language as the original post. If the post is in English, write in English. Keep the author's facts; do not invent figures, testimonials, or results.",
      "No em dashes. At most one hashtag, and only if the original used hashtags usefully. Do not add a link unless the original had one, and if it did, prefer a version that moves the link out of the main post (mention that the link can go in a reply).",
      "Each rewrite must be at most 280 characters, unless the original was a long Premium post and the user clearly needed the length; even then prefer a tight version under 280 plus an optional second, slightly longer variant.",
      "Use the local checklist as a starting point, but you may add a short observation if it is clearly about the text (for example a buried lede).",
      "",
      "ORIGINAL POST:",
      post,
      "",
      "OPTIONAL CONTEXT:",
      "Post time: " + (opts.when || "not given") + " (" + (opts.timezone || "n/a") + ")",
      "Media as marked by the user: " + (opts.media || "unknown"),
      "Local checklist score: " + report.score + " / 100 (" + report.band + ")",
      "Local findings:",
      findings,
      "",
      "Return JSON only, with this shape:",
      '{"summary":"2-4 sentence diagnosis, honest about uncertainty","notes":"short list of what you changed and why","rewrites":[{"label":"short name of the approach","text":"full rewritten post"}]}',
      "Write exactly 3 rewrites, each with a different approach (for example: tighter hook, fact first, question first). Do not include hashtag stacks, engagement bait, or a sales close the author did not already use."
    ].join("\n");
  }

  function runLocal() {
    var post = (postEl.value || "").trim();
    if (!post) {
      statusEl.innerHTML = '<span class="bad">' + nmT("Paste the post first.", "Cole primeiro a publicação.", "Pegue primero la publicación.") + "</span>";
      postEl.focus();
      lastReport = null;
      outEl.innerHTML = "";
      return null;
    }
    var opts = collectOpts();
    var report = analyze(post, opts);
    lastReport = { post: post, opts: opts, report: report };
    renderLocal(report);
    statusEl.innerHTML = '<span class="ok">' + nmT("Local check done.", "Verificação local feita.", "Comprobación local hecha.") + "</span> " + report.chars + nmT(" characters. The AI rewrite is optional and uses your Gemini key.", " caracteres. A reescrita por IA é opcional e usa a sua chave Gemini.", " caracteres. La reescritura por IA es opcional y usa su clave de Gemini.");
    return lastReport;
  }

  if (checkEl) {
    checkEl.addEventListener("click", function () {
      runLocal();
    });
  }

  if (rewriteEl) {
    rewriteEl.addEventListener("click", function () {
      var ctx = runLocal();
      if (!ctx) return;
      var key = getKey();
      if (!key) {
        statusEl.innerHTML = '<span class="bad">' + nmT("Save a Gemini API key first to get the diagnosis and rewrite. The local checklist above does not need a key.", "Guarde primeiro uma chave da API Gemini para o diagnóstico e a reescrita. A lista local acima não precisa de chave.", "Guarde primero una clave de la API de Gemini para el diagnóstico y la reescritura. La lista local de arriba no necesita clave.") + "</span>";
        document.getElementById("setup").scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (remaining() <= 0) {
        statusEl.innerHTML = '<span class="bad">' + nmT("You have used the 3 free AI rewrites for today in this browser. Local checks stay unlimited. Come back tomorrow, or reserve the founding lifetime licence below.", "Já usou as 3 reescritas de IA grátis de hoje neste browser. As verificações locais continuam sem limite. Volte amanhã ou reserve a licença vitalícia de fundador mais abaixo.", "Ha usado las 3 reescrituras de IA gratis de hoy en este navegador. Las comprobaciones locales siguen sin límite. Vuelva mañana o reserve la licencia de por vida de fundador más abajo.") + "</span>";
        paintRemain();
        return;
      }
      rewriteEl.disabled = true;
      if (checkEl) checkEl.disabled = true;
      statusEl.textContent = nmT("Asking Gemini for a diagnosis and rewrite…", "A pedir ao Gemini um diagnóstico e uma reescrita…", "Pidiendo a Gemini un diagnóstico y una reescritura…");
      var prompt = buildPrompt(ctx.post, ctx.report, ctx.opts);
      generateWithFallback(key, prompt).then(function (data) {
        if (!data || !data.rewrites || !data.rewrites.length) throw new Error(nmT("The model returned no rewrites. Try again.", "O modelo não devolveu reescritas. Tente outra vez.", "El modelo no devolvió reescrituras. Inténtelo de nuevo."));
        var u = usage();
        u.count += 1;
        setUsage(u);
        paintRemain();
        var block = renderRewrites(data);
        renderLocal(ctx.report, block.html);
        outEl.querySelectorAll("[data-copy]").forEach(function (btn) {
          btn.addEventListener("click", function () {
            var i = Number(btn.getAttribute("data-copy"));
            var it = block.items[i];
            copyText((it && it.text) || "", btn);
          });
        });
        statusEl.innerHTML = '<span class="ok">' + nmT("Done.", "Feito.", "Hecho.") + "</span> " + nmT("Read the diagnosis and edit a rewrite before you post it. The model can still be wrong.", "Leia o diagnóstico e edite uma reescrita antes de publicar. O modelo ainda pode errar.", "Lea el diagnóstico y edite una reescritura antes de publicarla. El modelo todavía puede equivocarse.");
      }).catch(function (err) {
        var m = String(err.message || err);
        if (/API key|api key|invalid|PERMISSION|401|403/i.test(m)) {
          m = nmT("Google rejected the API key. Check that you copied the whole key from aistudio.google.com, and that the free Gemini API is enabled on that key.", "A Google rejeitou a chave da API. Confirme que copiou a chave inteira de aistudio.google.com e que a API Gemini grátis está ativa nessa chave.", "Google ha rechazado la clave de API. Compruebe que copió la clave entera de aistudio.google.com y que la API gratuita de Gemini está activa en esa clave.");
        } else if (/quota|resource exhausted|429/i.test(m)) {
          m = nmT("Google's free quota for this key is used up for now. Wait and try again, or create a new key in AI Studio. The local checklist is still available.", "A quota grátis da Google para esta chave esgotou-se por agora. Espere e tente outra vez, ou crie uma chave nova no AI Studio. A lista local continua disponível.", "La cuota gratuita de Google para esta clave se ha agotado por ahora. Espere e inténtelo de nuevo, o cree una clave nueva en AI Studio. La lista local sigue disponible.");
        } else if (/Failed to fetch|NetworkError|CORS/i.test(m)) {
          m = nmT("The browser could not reach Google's Gemini API. Check your connection, or try another network. Nothing was sent to Netmend.", "O browser não conseguiu chegar à API Gemini da Google. Verifique a ligação ou tente outra rede. Nada foi enviado para a Netmend.", "El navegador no ha podido llegar a la API Gemini de Google. Compruebe la conexión o pruebe otra red. No se ha enviado nada a Netmend.");
        }
        statusEl.innerHTML = '<span class="bad">' + esc(m) + "</span>";
        paintRemain();
      }).then(function () {
        if (checkEl) checkEl.disabled = false;
        if (remaining() > 0) rewriteEl.disabled = false;
      });
    });
  }

  paintKey();
  paintRemain();

  root.NetmendReach = { analyze: analyze, countChars: countChars };
})(typeof window !== "undefined" ? window : this);
