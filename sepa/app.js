/* Excel/CSV → SEPA credit transfer XML (pain.001.001.03, optional .09).
   Runs entirely in the browser. Nothing is uploaded.
   SheetJS community build 0.20.3 (Apache-2.0): assets/vendor/xlsx.LICENSE.txt
   Character set: Banco de Portugal, Manual de Comunicação Cliente-Banco XML (C2B) v04, §3.3,
   plus the EPC Latin conversion (á→a, ç→c, ñ→n, and the same for the other letters in that table).
*/
(function () {
  "use strict";

  var FREE_MAX = 50;
  var PREVIEW_MAX = 200;
  var STORE = "netmend.sepa.debtor.v1";
  var htmlLang = (document.documentElement.lang || "pt-PT").toLowerCase();
  var lang = htmlLang.indexOf("pt") === 0 ? "pt" : htmlLang.indexOf("es") === 0 ? "es" : "en";

  var EXAMPLE_DEBTOR = {
    name: "EMPRESA EXEMPLO LDA",
    iban: "PT53999900000000000000128",
    bic: ""
  };
  var EXAMPLE_ROWS = [
    ["Nome", "IBAN", "Montante", "Referência", "BIC"],
    ["FORNECEDOR EXEMPLO LDA", "PT74999900010000000000123", "1.234,56", "Fatura EXEMPLO 2025/001", ""],
    ["José Exemplo", "PT20999900010000000000222", "1.500,00", "Vencimento EXEMPLO novembro", ""],
    ["PROVEEDOR EJEMPLO SL", "ES8099990001450000000001", "250,75", "Factura EXEMPLO", "EXMPESMM"]
  ];

  var STR = {
    pt: {
      proNote: "Pro em breve. Ainda não está disponível e este botão não cobra nada.",
      exampleDebtor: "O exemplo preencheu um ordenante fictício (EMPRESA EXEMPLO LDA, IBAN de teste). Substitua-o pela sua conta antes de enviar o ficheiro ao banco.",
      readFail: "Não foi possível ler esse ficheiro. Use .xlsx ou CSV.",
      tooBig: "Esse ficheiro passa dos 15 MB. Não é lido neste browser.",
      emptyFile: "O ficheiro não tem linhas.",
      headerOnly: "O ficheiro tem cabeçalhos, mas não tem pagamentos.",
      noRows: "Não há pagamentos para ler. A primeira linha deve ter Nome, IBAN e Montante, ou cole os dados.",
      needMap: "Falta mapear a coluna do nome, do IBAN ou do montante.",
      colTwice: "A mesma coluna está escolhida em dois campos.",
      limit: "A versão grátis inclui {max} pagamentos por ficheiro. Encontrámos {n}, por isso só os {max} primeiros entram no XML.",
      previewCap: "A mostrar as primeiras {max} de {n} linhas. O XML da versão grátis leva as primeiras {free}.",
      pasteEmpty: "Cole primeiro o texto do CSV.",
      xlsxMissing: "A biblioteca da folha de cálculo não carregou. Recarregue a página.",
      noneOption: "— nenhuma —",
      colLabel: "Coluna {n}",
      ignoredTotal: "Linha {row}: linha de totais ignorada.",
      sumPartial: "A soma só conta as linhas com montante válido.",
      downloadName: "ficheiro-sepa.xml",
      sheetName: "Pagamentos",
      templateName: "modelo-sepa.xlsx",
      fileLabel: "Ficheiro",
      pasted: "Texto colado",
      exampleName: "Exemplo fictício",
      field: { name: "nome", iban: "IBAN", amount: "montante", ref: "referência", bic: "BIC", date: "data", e2e: "EndToEndId" },
      who: { row: "Linha {row}", debtor: "Ordenante" },
      issue: {
        "name-missing": "falta o nome.",
        "name-charset": "o carácter «{ch}» não entra no conjunto SEPA.",
        "name-length": "o nome fica com {n} caracteres depois da conversão. O máximo é 70.",
        "iban-missing": "falta o IBAN.",
        "iban-format": "o IBAN «{v}» não tem o formato país + dígitos de controlo.",
        "iban-length": "o IBAN «{v}» tem {n} caracteres. Para {cc} são {need}.",
        "iban-check": "o IBAN «{v}» não passa no dígito de controlo (mod 97).",
        "iban-country": "o IBAN «{v}» não é de um país SEPA.",
        "iban-unknown": "o país «{cc}» do IBAN «{v}» não está na lista de comprimentos.",
        "iban-nib": "o NIB dentro do IBAN «{v}» não passa no dígito de controlo português.",
        "amount-empty": "falta o montante.",
        "amount-format": "o montante «{v}» não foi lido. Use 1.234,56 ou 1234.56.",
        "amount-decimals": "o montante «{v}» tem mais de 2 casas decimais.",
        "amount-positive": "o montante tem de ser maior que zero.",
        "amount-max": "o montante passa de 999.999.999,99 €.",
        "bic-format": "o BIC «{v}» não tem 8 ou 11 caracteres no formato SWIFT.",
        "ref-charset": "o carácter «{ch}» não entra no conjunto SEPA.",
        "ref-length": "a referência fica com {n} caracteres. O máximo é 140.",
        "date-missing": "falta a data de execução.",
        "e2e": "não foi possível gerar um EndToEndId único.",
        translit: "{field}: «{from}» passou a «{to}» ({changes}).",
        duplicate: "o mesmo IBAN e o mesmo montante já estão na linha {other}. Confirme se não é um pagamento a dobrar.",
        "date-past": "a data de execução já passou. Muitos bancos recusam o ficheiro.",
        "date-weekend": "a data de execução calha a um sábado ou domingo. Confirme se o banco a aceita."
      }
    },
    es: {
      proNote: "Pro próximamente. Aún no está disponible y este botón no cobra nada.",
      exampleDebtor: "El ejemplo rellenó un ordenante ficticio (EMPRESA EXEMPLO LDA, IBAN de prueba). Sustitúyalo por su cuenta antes de enviar el fichero al banco.",
      readFail: "No se pudo leer ese fichero. Use .xlsx o CSV.",
      tooBig: "Ese fichero supera los 15 MB. No se lee en este navegador.",
      emptyFile: "El fichero no tiene filas.",
      headerOnly: "El fichero tiene cabeceras, pero no tiene pagos.",
      noRows: "No hay pagos que leer. La primera fila debe tener Nombre, IBAN e Importe, o pegue los datos.",
      needMap: "Falta asignar la columna del nombre, del IBAN o del importe.",
      colTwice: "La misma columna está elegida en dos campos.",
      limit: "La versión gratuita incluye {max} pagos por fichero. Había {n}, así que solo los {max} primeros entran en el XML.",
      previewCap: "Se muestran las primeras {max} de {n} filas. El XML gratuito lleva las primeras {free}.",
      pasteEmpty: "Pegue primero el texto del CSV.",
      xlsxMissing: "La biblioteca de la hoja de cálculo no se cargó. Recargue la página.",
      noneOption: "— ninguna —",
      colLabel: "Columna {n}",
      ignoredTotal: "Fila {row}: fila de totales ignorada.",
      sumPartial: "La suma solo cuenta las filas con importe válido.",
      downloadName: "fichero-sepa.xml",
      sheetName: "Pagos",
      templateName: "modelo-sepa.xlsx",
      fileLabel: "Fichero",
      pasted: "Texto pegado",
      exampleName: "Ejemplo ficticio",
      field: { name: "nombre", iban: "IBAN", amount: "importe", ref: "referencia", bic: "BIC", date: "fecha", e2e: "EndToEndId" },
      who: { row: "Fila {row}", debtor: "Ordenante" },
      issue: {
        "name-missing": "falta el nombre.",
        "name-charset": "el carácter «{ch}» no entra en el juego SEPA.",
        "name-length": "el nombre queda en {n} caracteres tras la conversión. El máximo es 70.",
        "iban-missing": "falta el IBAN.",
        "iban-format": "el IBAN «{v}» no tiene el formato país + dígitos de control.",
        "iban-length": "el IBAN «{v}» tiene {n} caracteres. Para {cc} son {need}.",
        "iban-check": "el IBAN «{v}» no pasa el dígito de control (mod 97).",
        "iban-country": "el IBAN «{v}» no es de un país SEPA.",
        "iban-unknown": "el país «{cc}» del IBAN «{v}» no está en la lista de longitudes.",
        "iban-nib": "el NIB dentro del IBAN «{v}» no pasa el dígito de control portugués.",
        "amount-empty": "falta el importe.",
        "amount-format": "el importe «{v}» no se ha leído. Use 1.234,56 o 1234.56.",
        "amount-decimals": "el importe «{v}» tiene más de 2 decimales.",
        "amount-positive": "el importe tiene que ser mayor que cero.",
        "amount-max": "el importe supera 999.999.999,99 €.",
        "bic-format": "el BIC «{v}» no tiene 8 u 11 caracteres en el formato SWIFT.",
        "ref-charset": "el carácter «{ch}» no entra en el juego SEPA.",
        "ref-length": "la referencia queda en {n} caracteres. El máximo es 140.",
        "date-missing": "falta la fecha de ejecución.",
        "e2e": "no se pudo generar un EndToEndId único.",
        translit: "{field}: «{from}» pasó a «{to}» ({changes}).",
        duplicate: "el mismo IBAN y el mismo importe ya están en la fila {other}. Confirme que no es un pago duplicado.",
        "date-past": "la fecha de ejecución ya ha pasado. Muchos bancos rechazan el fichero.",
        "date-weekend": "la fecha de ejecución cae en sábado o domingo. Confirme que el banco la acepta."
      }
    },
    en: {
      proNote: "Pro coming soon. It is not available yet, and this button does not take a payment.",
      exampleDebtor: "The example filled a fictional debtor (EMPRESA EXEMPLO LDA, a test IBAN). Replace it with your account before you send the file to the bank.",
      readFail: "That file could not be read. Use .xlsx or CSV.",
      tooBig: "That file is over 15 MB. It is not read in this browser.",
      emptyFile: "The file has no rows.",
      headerOnly: "The file has headers but no payments.",
      noRows: "There are no payments to read. The first row should have Name, IBAN and Amount, or paste the data.",
      needMap: "Map the name, IBAN and amount columns.",
      colTwice: "The same column is selected for two fields.",
      limit: "The free tool includes {max} payments per file. {n} were found, so only the first {max} go into the XML.",
      previewCap: "Showing the first {max} of {n} rows. The free XML includes the first {free}.",
      pasteEmpty: "Paste the CSV text first.",
      xlsxMissing: "The spreadsheet library did not load. Reload the page.",
      noneOption: "— none —",
      colLabel: "Column {n}",
      ignoredTotal: "Row {row}: totals row skipped.",
      sumPartial: "The sum only includes rows with a valid amount.",
      downloadName: "sepa-credit-transfer.xml",
      sheetName: "Payments",
      templateName: "sepa-template.xlsx",
      fileLabel: "File",
      pasted: "Pasted text",
      exampleName: "Fictional example",
      field: { name: "name", iban: "IBAN", amount: "amount", ref: "reference", bic: "BIC", date: "date", e2e: "EndToEndId" },
      who: { row: "Row {row}", debtor: "Debtor" },
      issue: {
        "name-missing": "the name is missing.",
        "name-charset": "the character «{ch}» is not in the SEPA set.",
        "name-length": "the name is {n} characters after conversion. The maximum is 70.",
        "iban-missing": "the IBAN is missing.",
        "iban-format": "the IBAN «{v}» does not match country code plus check digits.",
        "iban-length": "the IBAN «{v}» has {n} characters. {cc} needs {need}.",
        "iban-check": "the IBAN «{v}» fails the mod-97 check.",
        "iban-country": "the IBAN «{v}» is not from a SEPA country.",
        "iban-unknown": "the country «{cc}» on IBAN «{v}» is not in the length list.",
        "iban-nib": "the NIB inside IBAN «{v}» fails the Portuguese check digit.",
        "amount-empty": "the amount is missing.",
        "amount-format": "the amount «{v}» could not be read. Use 1.234,56 or 1234.56.",
        "amount-decimals": "the amount «{v}» has more than 2 decimal places.",
        "amount-positive": "the amount has to be greater than zero.",
        "amount-max": "the amount is over €999,999,999.99.",
        "bic-format": "the BIC «{v}» is not 8 or 11 characters in the SWIFT format.",
        "ref-charset": "the character «{ch}» is not in the SEPA set.",
        "ref-length": "the reference is {n} characters. The maximum is 140.",
        "date-missing": "the execution date is missing.",
        "e2e": "a unique EndToEndId could not be built.",
        translit: "{field}: «{from}» became «{to}» ({changes}).",
        duplicate: "the same IBAN and amount are already on row {other}. Check it is not a double payment.",
        "date-past": "the execution date is in the past. Many banks reject the file.",
        "date-weekend": "the execution date falls on a Saturday or Sunday. Check that the bank accepts it."
      }
    }
  };
  var T = STR[lang];

  var SEPA = { AD: 1, AT: 1, BE: 1, BG: 1, CH: 1, CY: 1, CZ: 1, DE: 1, DK: 1, EE: 1, ES: 1, FI: 1, FR: 1, GB: 1, GI: 1, GR: 1, HR: 1, HU: 1, IE: 1, IS: 1, IT: 1, LI: 1, LT: 1, LU: 1, LV: 1, MC: 1, MT: 1, NL: 1, NO: 1, PL: 1, PT: 1, RO: 1, SE: 1, SI: 1, SK: 1, SM: 1, VA: 1 };
  var IBAN_LEN = { AD: 24, AE: 23, AL: 28, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22, BR: 29, BY: 28, CH: 21, CR: 22, CY: 28, CZ: 24, DE: 22, DK: 18, DO: 28, EE: 20, EG: 29, ES: 24, FI: 18, FO: 18, FR: 27, GB: 22, GE: 22, GI: 23, GL: 18, GR: 27, GT: 28, HR: 21, HU: 28, IE: 22, IL: 23, IQ: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28, LC: 32, LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MD: 24, ME: 22, MK: 19, MR: 27, MT: 31, MU: 30, NL: 18, NO: 15, PK: 24, PL: 28, PS: 29, PT: 25, QA: 29, RO: 24, RS: 22, SA: 24, SC: 31, SE: 24, SI: 19, SK: 24, SM: 27, ST: 25, SV: 28, TL: 23, TN: 24, TR: 26, UA: 29, VA: 22, VG: 24, XK: 20 };

  var ALLOWED = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/-?:().,'+ ";
  var CHARMAP = {
    "À": "A", "Á": "A", "Â": "A", "Ã": "A", "Ä": "A", "Å": "A", "Æ": "AE", "Ç": "C",
    "È": "E", "É": "E", "Ê": "E", "Ë": "E", "Ì": "I", "Í": "I", "Î": "I", "Ï": "I",
    "Ð": "D", "Ñ": "N", "Ò": "O", "Ó": "O", "Ô": "O", "Õ": "O", "Ö": "O", "Ø": "O",
    "Ù": "U", "Ú": "U", "Û": "U", "Ü": "U", "Ý": "Y", "Þ": "TH", "ß": "ss",
    "à": "a", "á": "a", "â": "a", "ã": "a", "ä": "a", "å": "a", "æ": "ae", "ç": "c",
    "è": "e", "é": "e", "ê": "e", "ë": "e", "ì": "i", "í": "i", "î": "i", "ï": "i",
    "ð": "d", "ñ": "n", "ò": "o", "ó": "o", "ô": "o", "õ": "o", "ö": "o", "ø": "o",
    "ù": "u", "ú": "u", "û": "u", "ü": "u", "ý": "y", "ÿ": "y", "þ": "th",
    "Š": "S", "š": "s", "Ž": "Z", "ž": "z", "Œ": "OE", "œ": "oe",
    "€": "E", "@": "(at)", "&": "+", "_": "-", "\t": " ", "\n": " ", "\r": " "
  };

  var NAME_KEYS = ["nome", "name", "nombre", "beneficiario", "acreedor", "creditor", "fornecedor", "proveedor", "empregado", "empleado", "titular", "payee", "supplier", "nomedobeneficiario", "nombredelbeneficiario"];
  var IBAN_KEYS = ["iban", "ibanbeneficiario", "ibandelbeneficiario", "conta", "cuenta", "numerodeconta", "numerodecuenta"];
  var AMOUNT_KEYS = ["montante", "valor", "amount", "importe", "quantia", "montanteeur", "valoreur", "importeeur"];
  var REF_KEYS = ["referencia", "descricao", "description", "concepto", "motivo", "remittance", "comunicacao", "descritivo", "detalhe", "detalles", "observacoes", "observaciones", "notes", "note", "memo"];
  var BIC_KEYS = ["bic", "swift", "bicbeneficiario", "codigobic", "biccredor"];

  var state = null;
  var lastXml = "";

  function $(id) { return document.getElementById(id); }
  function fill(s, map) {
    return String(s).replace(/\{(\w+)\}/g, function (_, k) { return map[k] == null ? "" : String(map[k]); });
  }
  function clear(node) { while (node && node.firstChild) node.removeChild(node.firstChild); }

  function normKey(s) {
    var t = String(s || "");
    if (t.normalize) t = t.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return t.toLowerCase().replace(/[^a-z0-9]/g, "");
  }
  function scoreKey(key, list) {
    var i, best = 0;
    for (i = 0; i < list.length; i++) {
      if (key === list[i]) return 3;
      if (list[i].length >= 4 && key.indexOf(list[i]) !== -1) best = Math.max(best, 2);
    }
    return best;
  }
  function detectMap(headers) {
    var fields = [
      ["name", NAME_KEYS],
      ["iban", IBAN_KEYS],
      ["amount", AMOUNT_KEYS],
      ["ref", REF_KEYS],
      ["bic", BIC_KEYS]
    ];
    var map = { name: -1, iban: -1, amount: -1, ref: -1, bic: -1 };
    var f, c, best, bestI, sc;
    for (f = 0; f < fields.length; f++) {
      best = 0;
      bestI = -1;
      for (c = 0; c < headers.length; c++) {
        sc = scoreKey(normKey(headers[c]), fields[f][1]);
        if (sc > best) { best = sc; bestI = c; }
      }
      if (best > 0) map[fields[f][0]] = bestI;
    }
    return map;
  }

  function mod97(numStr) {
    var rem = 0, i;
    for (i = 0; i < numStr.length; i++) rem = (rem * 10 + (numStr.charCodeAt(i) - 48)) % 97;
    return rem;
  }
  function ibanMod97(iban) {
    var rearranged = iban.slice(4) + iban.slice(0, 4);
    var expanded = "", i, code;
    for (i = 0; i < rearranged.length; i++) {
      code = rearranged.charCodeAt(i);
      if (code >= 65 && code <= 90) expanded += String(code - 55);
      else expanded += rearranged.charAt(i);
    }
    return mod97(expanded);
  }
  function ptNibOk(iban) {
    var nib = iban.slice(4);
    if (!/^\d{21}$/.test(nib)) return false;
    var rem = 0, i;
    for (i = 0; i < 19; i++) rem = (rem * 10 + (nib.charCodeAt(i) - 48)) % 97;
    return (98 - rem) === Number(nib.slice(19));
  }
  function checkIban(raw) {
    var v = String(raw || "").replace(/\s+/g, "").toUpperCase();
    if (!v) return { error: "iban-missing", value: "" };
    if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(v)) return { error: "iban-format", value: v };
    var cc = v.slice(0, 2);
    var need = IBAN_LEN[cc];
    if (!need) return { error: "iban-unknown", value: v, cc: cc };
    if (v.length !== need) return { error: "iban-length", value: v, cc: cc, n: v.length, need: need };
    if (ibanMod97(v) !== 1) return { error: "iban-check", value: v };
    if (!SEPA[cc]) return { error: "iban-country", value: v };
    if (cc === "PT" && !ptNibOk(v)) return { error: "iban-nib", value: v };
    return { value: v };
  }
  function checkBic(raw) {
    var v = String(raw || "").replace(/\s+/g, "").toUpperCase();
    if (!v) return { value: "" };
    if (!/^[A-Z]{6}[A-Z2-9][A-NP-Z0-9]([A-Z0-9]{3})?$/.test(v)) return { error: "bic-format", value: v };
    return { value: v };
  }

  function parseAmount(raw) {
    if (typeof raw === "number") {
      if (!isFinite(raw)) return { error: "amount-format", value: String(raw) };
      if (raw <= 0) return { error: "amount-positive", value: String(raw) };
      var fixed = raw.toFixed(2);
      if (Math.abs(raw - Number(fixed)) > 0.000001) return { error: "amount-decimals", value: String(raw) };
      return centsFromNormalized(fixed, String(raw));
    }
    var s = String(raw == null ? "" : raw).trim();
    if (!s) return { error: "amount-empty", value: "" };
    var shown = s;
    s = s.replace(/\u00a0/g, "").replace(/\s/g, "").replace(/€/g, "").replace(/eur/ig, "");
    if (!s) return { error: "amount-empty", value: shown };
    if (s.charAt(0) === "-" || s.charAt(0) === "(") return { error: "amount-positive", value: shown };
    if (!/^[0-9.,]+$/.test(s)) return { error: "amount-format", value: shown };
    var lastComma = s.lastIndexOf(",");
    var lastDot = s.lastIndexOf(".");
    var normalized, parts, frac, i;
    if (lastComma !== -1 && lastDot !== -1) {
      if (lastComma > lastDot) normalized = s.replace(/\./g, "").replace(",", ".");
      else normalized = s.replace(/,/g, "");
    } else if (lastComma !== -1 || lastDot !== -1) {
      var sep = lastComma !== -1 ? "," : ".";
      parts = s.split(sep);
      if (parts.length > 2) {
        for (i = 1; i < parts.length; i++) if (parts[i].length !== 3) return { error: "amount-format", value: shown };
        normalized = parts.join("");
      } else {
        frac = parts[1];
        if (frac.length === 3) normalized = parts.join("");
        else if (frac.length <= 2) normalized = parts[0] + "." + frac;
        else return { error: "amount-decimals", value: shown };
      }
    } else normalized = s;
    if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return { error: "amount-decimals", value: shown };
    return centsFromNormalized(normalized, shown);
  }
  function centsFromNormalized(normalized, shown) {
    var bits = normalized.split(".");
    var euros = Number(bits[0]);
    var frac = bits[1] || "";
    if (frac.length === 1) frac += "0";
    if (!frac) frac = "00";
    if (euros > 999999999) return { error: "amount-max", value: shown };
    var cents = euros * 100 + Number(frac);
    if (cents <= 0) return { error: "amount-positive", value: shown };
    if (cents > 99999999999) return { error: "amount-max", value: shown };
    return { cents: cents, value: shown };
  }

  function sepaText(raw, maxLen) {
    var s = String(raw == null ? "" : raw);
    if (s.normalize) s = s.normalize("NFC");
    var out = "", changes = [], i, ch, rep, seen = {};
    for (i = 0; i < s.length; i++) {
      ch = s.charAt(i);
      if (ALLOWED.indexOf(ch) !== -1) { out += ch; continue; }
      rep = CHARMAP[ch];
      if (!rep) return { error: "charset", ch: ch, from: s };
      if (!seen[ch]) { seen[ch] = 1; changes.push(ch + "→" + rep); }
      out += rep;
    }
    var folded = out.replace(/[ \t\r\n]+/g, " ").replace(/^\/+|\/+$/g, "").replace(/\/{2,}/g, "/").trim();
    if (folded !== out.trim() && changes.indexOf(" /") === -1 && (out.indexOf("//") !== -1 || /^\/|\/$/.test(out))) changes.push("//→/");
    if (folded.length > maxLen) return { error: "length", n: folded.length, from: s, value: folded, changes: changes };
    return { value: folded, from: String(raw == null ? "" : raw).trim(), changes: changes };
  }

  function formatEUR(cents) {
    var neg = cents < 0;
    var n = Math.abs(cents);
    var euros = Math.floor(n / 100);
    var c = String(n % 100);
    if (c.length < 2) c = "0" + c;
    var s = String(euros).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return (neg ? "−" : "") + s + "," + c + " €";
  }
  function centsToXml(cents) {
    var n = Math.abs(cents);
    var euros = Math.floor(n / 100);
    var c = String(n % 100);
    if (c.length < 2) c = "0" + c;
    return (cents < 0 ? "-" : "") + euros + "." + c;
  }
  function xmlEscape(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  }
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function todayIso() {
    var d = new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }
  function isoDateTime(d) {
    var off = -d.getTimezoneOffset();
    var sign = off >= 0 ? "+" : "-";
    var abs = Math.abs(off);
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + "T" + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()) + sign + pad(Math.floor(abs / 60)) + ":" + pad(abs % 60);
  }
  function rand(n) {
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var out = "", i, bytes = new Uint8Array(n);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(bytes);
    else for (i = 0; i < n; i++) bytes[i] = Math.floor(Math.random() * 256);
    for (i = 0; i < n; i++) out += alphabet.charAt(bytes[i] % alphabet.length);
    return out;
  }
  function groupIban(iban) {
    return String(iban || "").replace(/(.{4})/g, "$1 ").trim();
  }

  function decodeBytes(bytes) {
    var b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    if (b.length >= 2 && b[0] === 0xFF && b[1] === 0xFE) return new TextDecoder("utf-16le").decode(b);
    if (b.length >= 2 && b[0] === 0xFE && b[1] === 0xFF) return new TextDecoder("utf-16be").decode(b);
    if (b.length >= 3 && b[0] === 0xEF && b[1] === 0xBB && b[2] === 0xBF) return new TextDecoder("utf-8").decode(b);
    try { return new TextDecoder("utf-8", { fatal: true }).decode(b); }
    catch (e) { return new TextDecoder("windows-1252").decode(b); }
  }
  function countDelim(line, delim) {
    var n = 0, inQ = false, i, c;
    for (i = 0; i < line.length; i++) {
      c = line.charAt(i);
      if (c === '"') {
        if (inQ && line.charAt(i + 1) === '"') { i++; continue; }
        inQ = !inQ;
      } else if (!inQ && c === delim) n++;
    }
    return n;
  }
  function sniffDelim(text) {
    var line = "", inQ = false, i, c;
    for (i = 0; i < text.length; i++) {
      c = text.charAt(i);
      if (c === '"') {
        if (inQ && text.charAt(i + 1) === '"') { i++; line += c; continue; }
        inQ = !inQ;
      }
      if (!inQ && (c === "\n" || c === "\r")) break;
      line += c;
    }
    var semi = countDelim(line, ";");
    var comma = countDelim(line, ",");
    var tab = countDelim(line, "\t");
    if (tab > semi && tab > comma) return "\t";
    if (semi > comma) return ";";
    if (comma > semi) return ",";
    if (semi > 0) return ";";
    return ",";
  }
  function parseCsv(text) {
    text = String(text || "").replace(/^\uFEFF/, "");
    var delim = sniffDelim(text);
    var rows = [], row = [], cell = "", inQ = false, i, c;
    for (i = 0; i < text.length; i++) {
      c = text.charAt(i);
      if (inQ) {
        if (c === '"') {
          if (text.charAt(i + 1) === '"') { cell += '"'; i++; }
          else inQ = false;
        } else cell += c;
      } else if (c === '"') inQ = true;
      else if (c === delim) { row.push(cell); cell = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text.charAt(i + 1) === "\n") i++;
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
      } else cell += c;
    }
    if (cell.length || row.length) { row.push(cell); rows.push(row); }
    return rows.filter(function (r) {
      return r.some(function (cellValue) { return String(cellValue).trim() !== ""; });
    });
  }

  function cellStr(v) {
    if (v == null) return "";
    if (typeof v === "number") return String(v);
    return String(v).trim();
  }
  function looksLikeHeader(headers) {
    var map = detectMap(headers);
    var hits = 0;
    if (map.name !== -1) hits++;
    if (map.iban !== -1) hits++;
    if (map.amount !== -1) hits++;
    return hits >= 2;
  }

  function issueText(code, data) {
    return fill(T.issue[code] || code, data || {});
  }
  function pushIssue(list, level, who, code, data) {
    list.push({ level: level, who: who, text: who + ": " + issueText(code, data) });
  }

  function readDebtor() {
    return {
      name: $("dbtr-name").value,
      iban: $("dbtr-iban").value,
      bic: $("dbtr-bic").value,
      date: $("dbtr-date").value,
      batch: $("dbtr-batch").checked,
      version: $("pain-version").value === "09" ? "09" : "03"
    };
  }

  function currentMap() {
    function num(id) {
      var v = $(id).value;
      return v === "" ? -1 : Number(v);
    }
    return { name: num("map-name"), iban: num("map-iban"), amount: num("map-amount"), ref: num("map-ref"), bic: num("map-bic") };
  }

  function buildPayments(rows, map) {
    var payments = [];
    var notices = [];
    var r, cells, nameRaw, ibanRaw, amountRaw, refRaw, bicRaw, rowNo, nameKey;
    for (r = 0; r < rows.length; r++) {
      cells = rows[r];
      rowNo = r + 2;
      nameRaw = map.name >= 0 ? cells[map.name] : "";
      ibanRaw = map.iban >= 0 ? cells[map.iban] : "";
      amountRaw = map.amount >= 0 ? cells[map.amount] : "";
      refRaw = map.ref >= 0 ? cells[map.ref] : "";
      bicRaw = map.bic >= 0 ? cells[map.bic] : "";
      nameKey = normKey(cellStr(nameRaw));
      if ((nameKey === "total" || nameKey === "soma" || nameKey === "sum") && !String(ibanRaw || "").trim()) {
        notices.push({ level: "warn", who: "", text: fill(T.ignoredTotal, { row: rowNo }) });
        continue;
      }
      if (!String(nameRaw || "").trim() && !String(ibanRaw || "").trim() && !String(amountRaw || "").trim()) continue;
      payments.push({
        row: rowNo,
        nameRaw: nameRaw,
        ibanRaw: ibanRaw,
        amountRaw: amountRaw,
        refRaw: refRaw,
        bicRaw: bicRaw
      });
    }
    return { payments: payments, notices: notices };
  }

  function validatePayment(p) {
    var errors = [];
    var warnings = [];
    var who = fill(T.who.row, { row: p.row });
    var name = sepaText(p.nameRaw, 70);
    var iban = checkIban(cellStr(p.ibanRaw));
    var amount = parseAmount(p.amountRaw);
    var ref = sepaText(p.refRaw, 140);
    var bic = checkBic(cellStr(p.bicRaw));

    if (!String(p.nameRaw || "").trim()) pushIssue(errors, "error", who, "name-missing");
    else if (name.error === "charset") pushIssue(errors, "error", who, "name-charset", { ch: name.ch });
    else if (name.error === "length") pushIssue(errors, "error", who, "name-length", { n: name.n });
    else if (!name.value) pushIssue(errors, "error", who, "name-missing");
    else if (name.changes.length) pushIssue(warnings, "warn", who, "translit", { field: T.field.name, from: name.from, to: name.value, changes: name.changes.join(", ") });

    if (iban.error) pushIssue(errors, "error", who, iban.error, { v: iban.value, cc: iban.cc, n: iban.n, need: iban.need });
    if (amount.error) pushIssue(errors, "error", who, amount.error, { v: amount.value || cellStr(p.amountRaw) });
    if (String(p.refRaw || "").trim()) {
      if (ref.error === "charset") pushIssue(errors, "error", who, "ref-charset", { ch: ref.ch });
      else if (ref.error === "length") pushIssue(errors, "error", who, "ref-length", { n: ref.n });
      else if (ref.changes.length) pushIssue(warnings, "warn", who, "translit", { field: T.field.ref, from: ref.from, to: ref.value, changes: ref.changes.join(", ") });
    }
    if (bic.error) pushIssue(errors, "error", who, "bic-format", { v: bic.value });

    return {
      row: p.row,
      name: name.value || "",
      iban: iban.value || String(p.ibanRaw || "").replace(/\s+/g, "").toUpperCase(),
      ibanOk: !iban.error,
      cents: amount.cents,
      amountOk: !amount.error,
      ref: ref.value || "",
      bic: bic.value || "",
      errors: errors,
      warnings: warnings
    };
  }

  function assignEndToEnd(list, dateIso) {
    var compact = (dateIso || todayIso()).replace(/-/g, "");
    var counts = {};
    var i, ref;
    for (i = 0; i < list.length; i++) {
      ref = list[i].ref;
      if (ref && ref.length <= 35) counts[ref] = (counts[ref] || 0) + 1;
    }
    var used = {};
    for (i = 0; i < list.length; i++) {
      var item = list[i];
      var id = "";
      if (item.ref && item.ref.length <= 35 && counts[item.ref] === 1) id = item.ref;
      if (!id || used[id]) {
        var n = i + 1;
        id = "E2E" + compact + "-" + (n < 10 ? "000" : n < 100 ? "00" : n < 1000 ? "0" : "") + n;
        var guard = 0;
        while (used[id] && guard < 1000) {
          guard++;
          id = "E2E" + compact + "-" + (n < 10 ? "000" : n < 100 ? "00" : n < 1000 ? "0" : "") + n + "X" + guard;
        }
      }
      if (id.length > 35 || used[id]) {
        pushIssue(item.errors, "error", fill(T.who.row, { row: item.row }), "e2e");
        id = "";
      }
      used[id] = 1;
      item.e2e = id;
    }
    var seen = {};
    for (i = 0; i < list.length; i++) {
      item = list[i];
      if (!item.ibanOk || !item.amountOk) continue;
      var key = item.iban + "|" + item.cents;
      if (seen[key]) {
        pushIssue(item.warnings, "warn", fill(T.who.row, { row: item.row }), "duplicate", { other: seen[key] });
      } else seen[key] = item.row;
    }
  }

  function validateDebtor(d) {
    var errors = [], warnings = [], who = T.who.debtor;
    var name = sepaText(d.name, 70);
    var iban = checkIban(d.iban);
    var bic = checkBic(d.bic);
    if (!String(d.name || "").trim()) pushIssue(errors, "error", who, "name-missing");
    else if (name.error === "charset") pushIssue(errors, "error", who, "name-charset", { ch: name.ch });
    else if (name.error === "length") pushIssue(errors, "error", who, "name-length", { n: name.n });
    else if (!name.value) pushIssue(errors, "error", who, "name-missing");
    else if (name.changes.length) pushIssue(warnings, "warn", who, "translit", { field: T.field.name, from: name.from, to: name.value, changes: name.changes.join(", ") });
    if (iban.error) pushIssue(errors, "error", who, iban.error, { v: iban.value, cc: iban.cc, n: iban.n, need: iban.need });
    if (bic.error) pushIssue(errors, "error", who, "bic-format", { v: bic.value });
    if (!d.date || !/^\d{4}-\d{2}-\d{2}$/.test(d.date)) pushIssue(errors, "error", who, "date-missing");
    else {
      if (d.date < todayIso()) pushIssue(warnings, "warn", who, "date-past");
      var parts = d.date.split("-");
      var dt = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      var day = dt.getDay();
      if (day === 0 || day === 6) pushIssue(warnings, "warn", who, "date-weekend");
    }
    return { name: name.value || "", iban: iban.value || "", bic: bic.value || "", errors: errors, warnings: warnings };
  }

  function agentXml(indent, bic, version) {
    var pad = "";
    var i;
    for (i = 0; i < indent; i++) pad += "  ";
    var tag = version === "09" ? "BICFI" : "BIC";
    if (bic) {
      return pad + "<FinInstnId>\r\n" + pad + "  <" + tag + ">" + xmlEscape(bic) + "</" + tag + ">\r\n" + pad + "</FinInstnId>";
    }
    return pad + "<FinInstnId>\r\n" + pad + "  <Othr>\r\n" + pad + "    <Id>NOTPROVIDED</Id>\r\n" + pad + "  </Othr>\r\n" + pad + "</FinInstnId>";
  }

  function buildXml(debtor, payments, version) {
    var now = new Date();
    var msgId = "NM" + now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate()) + pad(now.getHours()) + pad(now.getMinutes()) + pad(now.getSeconds()) + rand(6);
    var pmtId = "PMT" + debtor.date.replace(/-/g, "") + rand(6);
    var cents = 0, i;
    for (i = 0; i < payments.length; i++) cents += payments[i].cents;
    var n = String(payments.length);
    var sum = centsToXml(cents);
    var lines = [];
    lines.push('<?xml version="1.0" encoding="UTF-8"?>');
    lines.push('<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.' + version + '">');
    lines.push("  <CstmrCdtTrfInitn>");
    lines.push("    <GrpHdr>");
    lines.push("      <MsgId>" + xmlEscape(msgId) + "</MsgId>");
    lines.push("      <CreDtTm>" + isoDateTime(now) + "</CreDtTm>");
    lines.push("      <NbOfTxs>" + n + "</NbOfTxs>");
    lines.push("      <CtrlSum>" + sum + "</CtrlSum>");
    lines.push("      <InitgPty>");
    lines.push("        <Nm>" + xmlEscape(debtor.name) + "</Nm>");
    lines.push("      </InitgPty>");
    lines.push("    </GrpHdr>");
    lines.push("    <PmtInf>");
    lines.push("      <PmtInfId>" + xmlEscape(pmtId) + "</PmtInfId>");
    lines.push("      <PmtMtd>TRF</PmtMtd>");
    lines.push("      <BtchBookg>" + (debtor.batch ? "true" : "false") + "</BtchBookg>");
    lines.push("      <NbOfTxs>" + n + "</NbOfTxs>");
    lines.push("      <CtrlSum>" + sum + "</CtrlSum>");
    lines.push("      <PmtTpInf>");
    lines.push("        <SvcLvl>");
    lines.push("          <Cd>SEPA</Cd>");
    lines.push("        </SvcLvl>");
    lines.push("      </PmtTpInf>");
    if (version === "09") {
      lines.push("      <ReqdExctnDt>");
      lines.push("        <Dt>" + debtor.date + "</Dt>");
      lines.push("      </ReqdExctnDt>");
    } else {
      lines.push("      <ReqdExctnDt>" + debtor.date + "</ReqdExctnDt>");
    }
    lines.push("      <Dbtr>");
    lines.push("        <Nm>" + xmlEscape(debtor.name) + "</Nm>");
    lines.push("      </Dbtr>");
    lines.push("      <DbtrAcct>");
    lines.push("        <Id>");
    lines.push("          <IBAN>" + debtor.iban + "</IBAN>");
    lines.push("        </Id>");
    lines.push("      </DbtrAcct>");
    lines.push("      <DbtrAgt>");
    lines.push(agentXml(4, debtor.bic, version));
    lines.push("      </DbtrAgt>");
    lines.push("      <ChrgBr>SLEV</ChrgBr>");
    for (i = 0; i < payments.length; i++) {
      var p = payments[i];
      lines.push("      <CdtTrfTxInf>");
      lines.push("        <PmtId>");
      lines.push("          <EndToEndId>" + xmlEscape(p.e2e) + "</EndToEndId>");
      lines.push("        </PmtId>");
      lines.push("        <Amt>");
      lines.push('          <InstdAmt Ccy="EUR">' + centsToXml(p.cents) + "</InstdAmt>");
      lines.push("        </Amt>");
      if (p.bic) {
        lines.push("        <CdtrAgt>");
        lines.push(agentXml(5, p.bic, version));
        lines.push("        </CdtrAgt>");
      }
      lines.push("        <Cdtr>");
      lines.push("          <Nm>" + xmlEscape(p.name) + "</Nm>");
      lines.push("        </Cdtr>");
      lines.push("        <CdtrAcct>");
      lines.push("          <Id>");
      lines.push("            <IBAN>" + p.iban + "</IBAN>");
      lines.push("          </Id>");
      lines.push("        </CdtrAcct>");
      if (p.ref) {
        lines.push("        <RmtInf>");
        lines.push("          <Ustrd>" + xmlEscape(p.ref) + "</Ustrd>");
        lines.push("        </RmtInf>");
      }
      lines.push("      </CdtTrfTxInf>");
    }
    lines.push("    </PmtInf>");
    lines.push("  </CstmrCdtTrfInitn>");
    lines.push("</Document>");
    return lines.join("\r\n") + "\r\n";
  }

  function showError(msg) {
    clearResults();
    var box = $("error");
    box.hidden = false;
    box.textContent = msg;
  }
  function clearError() {
    $("error").hidden = true;
    $("error").textContent = "";
  }
  function clearResults() {
    $("results").hidden = true;
    $("download").disabled = true;
    $("limit-note").hidden = true;
    $("example-note").hidden = true;
    lastXml = "";
    clear($("problems"));
    clear($("preview-body"));
    clear($("file-list"));
    $("c-count").textContent = "0";
    $("c-sum").textContent = formatEUR(0);
    $("c-problems").textContent = "0";
    $("sum-note").hidden = true;
    $("preview-note").hidden = true;
    $("problems-none").hidden = true;
  }

  function fillMapSelects() {
    var headers = state.headers;
    var ids = ["map-name", "map-iban", "map-amount", "map-ref", "map-bic"];
    var i, sel, o, c;
    for (i = 0; i < ids.length; i++) {
      sel = $(ids[i]);
      clear(sel);
      o = document.createElement("option");
      o.value = "";
      o.textContent = T.noneOption;
      sel.appendChild(o);
      for (c = 0; c < headers.length; c++) {
        o = document.createElement("option");
        o.value = String(c);
        o.textContent = headers[c] || fill(T.colLabel, { n: c + 1 });
        sel.appendChild(o);
      }
    }
    var map = state.map;
    $("map-name").value = map.name >= 0 ? String(map.name) : "";
    $("map-iban").value = map.iban >= 0 ? String(map.iban) : "";
    $("map-amount").value = map.amount >= 0 ? String(map.amount) : "";
    $("map-ref").value = map.ref >= 0 ? String(map.ref) : "";
    $("map-bic").value = map.bic >= 0 ? String(map.bic) : "";
    $("mapping").hidden = false;
  }

  function render() {
    clearError();
    if (!state) { clearResults(); return; }
    var map = currentMap();
    state.map = map;
    var chosen = [map.name, map.iban, map.amount, map.ref, map.bic].filter(function (n) { return n >= 0; });
    var uniq = {};
    var dup = false, i;
    for (i = 0; i < chosen.length; i++) {
      if (uniq[chosen[i]]) dup = true;
      uniq[chosen[i]] = 1;
    }
    var built = buildPayments(state.dataRows, map);
    var included = built.payments.slice(0, FREE_MAX);
    var validated = included.map(validatePayment);
    var debtorRaw = readDebtor();
    assignEndToEnd(validated, debtorRaw.date);
    var debtor = validateDebtor(debtorRaw);

    var issues = debtor.errors.concat(debtor.warnings).concat(built.notices);
    for (i = 0; i < validated.length; i++) issues = issues.concat(validated[i].errors, validated[i].warnings);
    var blocked = debtor.errors.length > 0 || dup || map.name < 0 || map.iban < 0 || map.amount < 0;
    for (i = 0; i < validated.length; i++) if (validated[i].errors.length) blocked = true;
    if (!validated.length) issues.unshift({ level: "error", text: T.noRows });
    if (map.name < 0 || map.iban < 0 || map.amount < 0) issues.unshift({ level: "error", text: T.needMap });
    if (dup) issues.unshift({ level: "error", text: T.colTwice });

    var cents = 0, validAmounts = 0;
    for (i = 0; i < validated.length; i++) {
      if (validated[i].amountOk) { cents += validated[i].cents; validAmounts++; }
    }

    $("results").hidden = false;
    $("c-count").textContent = String(validated.length);
    $("c-sum").textContent = formatEUR(cents);
    $("c-problems").textContent = String(issues.length);
    $("sum-note").hidden = !(validAmounts !== validated.length && validated.length);
    if (!$("sum-note").hidden) $("sum-note").textContent = T.sumPartial;

    $("limit-note").hidden = built.payments.length <= FREE_MAX;
    if (!$("limit-note").hidden) $("limit-note").textContent = fill(T.limit, { max: FREE_MAX, n: built.payments.length });

    var list = $("problems");
    clear(list);
    $("problems-none").hidden = issues.length !== 0;
    for (i = 0; i < issues.length; i++) {
      var li = document.createElement("li");
      li.className = issues[i].level === "error" ? "bad" : "warn";
      li.textContent = issues[i].text;
      list.appendChild(li);
    }

    var body = $("preview-body");
    clear(body);
    var shown = built.payments.slice(0, PREVIEW_MAX);
    var byRow = {};
    for (i = 0; i < validated.length; i++) byRow[validated[i].row] = validated[i];
    for (i = 0; i < shown.length; i++) {
      var src = shown[i];
      var item = byRow[src.row];
      var tr = document.createElement("tr");
      if (!item) tr.className = "extra";
      function td(text, cls) {
        var cell = document.createElement("td");
        if (cls) cell.className = cls;
        cell.textContent = text;
        tr.appendChild(cell);
      }
      if (item) {
        td(item.name || cellStr(src.nameRaw));
        td(groupIban(item.iban));
        td(item.amountOk ? formatEUR(item.cents) : cellStr(src.amountRaw), "num");
        td(item.ref || "");
        td(item.bic || "");
        td(item.e2e || "");
      } else {
        td(cellStr(src.nameRaw));
        td(groupIban(cellStr(src.ibanRaw)));
        td(cellStr(src.amountRaw), "num");
        td(cellStr(src.refRaw));
        td(cellStr(src.bicRaw));
        td("");
        tr.className = "extra";
      }
      body.appendChild(tr);
    }
    $("preview-note").hidden = built.payments.length <= PREVIEW_MAX;
    if (!$("preview-note").hidden) $("preview-note").textContent = fill(T.previewCap, { max: PREVIEW_MAX, n: built.payments.length, free: FREE_MAX });

    var chips = $("file-list");
    clear(chips);
    var chip = document.createElement("li");
    chip.textContent = state.fileName;
    chips.appendChild(chip);

    if (!blocked && validated.length) {
      lastXml = buildXml({
        name: debtor.name,
        iban: debtor.iban,
        bic: debtor.bic,
        date: debtorRaw.date,
        batch: debtorRaw.batch
      }, validated, debtorRaw.version);
      $("download").disabled = false;
    } else {
      lastXml = "";
      $("download").disabled = true;
    }
  }

  function setGrid(headers, dataRows, fileName, headerRow) {
    var map = headerRow ? detectMap(headers) : { name: -1, iban: -1, amount: -1, ref: -1, bic: -1 };
    state = { headers: headers, dataRows: dataRows, fileName: fileName, map: map };
    clearResults();
    fillMapSelects();
    render();
  }

  function rowsFromMatrix(matrix, fileName) {
    if (!matrix.length) { showError(T.emptyFile); return; }
    var width = 0, r, c;
    for (r = 0; r < matrix.length; r++) width = Math.max(width, matrix[r].length);
    var headerRow = looksLikeHeader(matrix[0].map(cellStr));
    var headers = [], data;
    if (headerRow) {
      for (c = 0; c < width; c++) headers.push(cellStr(matrix[0][c]) || fill(T.colLabel, { n: c + 1 }));
      data = matrix.slice(1).map(function (row) {
        var out = [];
        for (c = 0; c < width; c++) out.push(c < row.length ? row[c] : "");
        return out;
      }).filter(function (row) {
        return row.some(function (v) { return String(v == null ? "" : v).trim() !== ""; });
      });
      if (!data.length) { showError(T.headerOnly); return; }
    } else {
      for (c = 0; c < width; c++) headers.push(fill(T.colLabel, { n: c + 1 }));
      data = matrix.map(function (row) {
        var out = [];
        for (c = 0; c < width; c++) out.push(c < row.length ? row[c] : "");
        return out;
      });
    }
    setGrid(headers, data, fileName, headerRow);
  }

  function fromCsvText(text, fileName) {
    var matrix = parseCsv(text);
    if (!matrix.length) { showError(T.emptyFile); return; }
    rowsFromMatrix(matrix, fileName);
  }

  function fromWorkbook(bytes, fileName) {
    if (typeof XLSX === "undefined") { showError(T.xlsxMissing); return; }
    var wb = XLSX.read(bytes, { type: "array" });
    var sheet = wb.Sheets[wb.SheetNames[0]];
    var matrix = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true, defval: "" });
    rowsFromMatrix(matrix, fileName);
  }

  function handleFile(file) {
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) { showError(T.tooBig); return; }
    var name = file.name || T.fileLabel;
    var reader = new FileReader();
    reader.onerror = function () { showError(T.readFail); };
    if (/\.csv$/i.test(name) || /\.txt$/i.test(name) || file.type === "text/csv" || file.type === "text/plain") {
      reader.onload = function () {
        var bytes = new Uint8Array(reader.result);
        fromCsvText(decodeBytes(bytes), name);
      };
      reader.readAsArrayBuffer(file);
      return;
    }
    reader.onload = function () {
      try { fromWorkbook(new Uint8Array(reader.result), name); }
      catch (e) { showError(T.readFail); }
    };
    reader.readAsArrayBuffer(file);
  }

  function saveDebtor() {
    try {
      localStorage.setItem(STORE, JSON.stringify({
        name: $("dbtr-name").value,
        iban: $("dbtr-iban").value,
        bic: $("dbtr-bic").value,
        date: $("dbtr-date").value,
        batch: $("dbtr-batch").checked
      }));
    } catch (e) { /* private mode */ }
  }
  function loadDebtor() {
    var raw = null;
    try { raw = localStorage.getItem(STORE); } catch (e) { raw = null; }
    if (!raw) {
      $("dbtr-date").value = todayIso();
      return;
    }
    try {
      var data = JSON.parse(raw);
      if (data.name) $("dbtr-name").value = data.name;
      if (data.iban) $("dbtr-iban").value = data.iban;
      if (data.bic) $("dbtr-bic").value = data.bic;
      if (data.date) $("dbtr-date").value = data.date;
      $("dbtr-batch").checked = data.batch !== false;
    } catch (e2) {
      $("dbtr-date").value = todayIso();
    }
  }

  function downloadXml() {
    if (!lastXml || $("download").disabled) return;
    var blob = new Blob([lastXml], { type: "application/xml" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = T.downloadName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }

  function downloadTemplate() {
    if (typeof XLSX === "undefined") { showError(T.xlsxMissing); return; }
    var headers = lang === "es"
      ? ["Nombre", "IBAN", "Importe", "Referencia", "BIC"]
      : lang === "en"
        ? ["Name", "IBAN", "Amount", "Reference", "BIC"]
        : ["Nome", "IBAN", "Montante", "Referência", "BIC"];
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.aoa_to_sheet([headers]);
    ws["!cols"] = [{ wch: 32 }, { wch: 34 }, { wch: 14 }, { wch: 32 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, ws, T.sheetName);
    XLSX.writeFile(wb, T.templateName);
  }

  function loadExample() {
    var fillDebtor = !$("dbtr-name").value.trim() && !$("dbtr-iban").value.trim();
    if (fillDebtor) {
      $("dbtr-name").value = EXAMPLE_DEBTOR.name;
      $("dbtr-iban").value = EXAMPLE_DEBTOR.iban;
      $("dbtr-bic").value = EXAMPLE_DEBTOR.bic;
      if (!$("dbtr-date").value) $("dbtr-date").value = todayIso();
    }
    rowsFromMatrix(EXAMPLE_ROWS.map(function (row) { return row.slice(); }), T.exampleName);
    if (fillDebtor) {
      $("example-note").hidden = false;
      $("example-note").textContent = T.exampleDebtor;
    }
  }

  var drop = $("drop");
  ["dragenter", "dragover"].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("on"); });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("on"); });
  });
  drop.addEventListener("drop", function (e) {
    var files = e.dataTransfer && e.dataTransfer.files;
    if (files && files[0]) handleFile(files[0]);
  });
  $("file").addEventListener("change", function () {
    if ($("file").files && $("file").files[0]) handleFile($("file").files[0]);
  });
  $("example").addEventListener("click", loadExample);
  $("template").addEventListener("click", downloadTemplate);
  $("parse-paste").addEventListener("click", function () {
    var text = $("paste").value;
    if (!String(text).trim()) { showError(T.pasteEmpty); return; }
    fromCsvText(text, T.pasted);
  });
  $("download").addEventListener("click", downloadXml);
  $("pro").addEventListener("click", function () {
    $("pro-note").hidden = false;
    $("pro-note").textContent = T.proNote;
  });
  ["map-name", "map-iban", "map-amount", "map-ref", "map-bic"].forEach(function (id) {
    $(id).addEventListener("change", function () { if (state) render(); });
  });
  ["dbtr-name", "dbtr-iban", "dbtr-bic", "dbtr-date"].forEach(function (id) {
    $(id).addEventListener("input", function () { saveDebtor(); if (state) render(); });
  });
  $("dbtr-batch").addEventListener("change", function () { saveDebtor(); if (state) render(); });
  $("pain-version").addEventListener("change", function () { if (state) render(); });
  $("dbtr-clear").addEventListener("click", function () {
    $("dbtr-name").value = "";
    $("dbtr-iban").value = "";
    $("dbtr-bic").value = "";
    $("dbtr-date").value = todayIso();
    $("dbtr-batch").checked = true;
    try { localStorage.removeItem(STORE); } catch (e) { /* ignore */ }
    if (state) render();
  });

  loadDebtor();
  window.NetmendSepa = {
    lastXml: function () { return lastXml; },
    formatEUR: formatEUR
  };
})();
