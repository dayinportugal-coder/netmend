/* Excel/CSV → SEPA credit transfer XML (pain.001.001.03, optional .09).
   Runs entirely in the browser. Nothing is uploaded.
   SheetJS community build 0.20.3 (Apache-2.0): assets/vendor/xlsx.LICENSE.txt
   Character set: Banco de Portugal, Manual de Comunicação Cliente-Banco XML (C2B) v04, §3.3,
   plus the EPC Latin conversion (á→a, ç→c, ñ→n, and the same for the other letters in that table).
*/
(function () {
  "use strict";

  var PREVIEW_MAX = 200;
  var STORE = "netmend.sepa.debtor.v1";
  var BEN_STORE = "netmend.sepa.beneficiaries.v1";
  var BATCH_STORE = "netmend.sepa.lastbatch.v1";
  var htmlLang = (document.documentElement.lang || "pt-PT").toLowerCase();
  var lang = htmlLang.indexOf("pt") === 0 ? "pt" : htmlLang.indexOf("es") === 0 ? "es" : "en";

  var EXAMPLE_DEBTOR = {
    name: "EMPRESA EXEMPLO LDA",
    iban: "PT50999900000000000000182",
    bic: ""
  };
  var EXAMPLE_ROWS = [
    ["Nome", "IBAN", "Montante", "Referência", "BIC"],
    ["FORNECEDOR EXEMPLO LDA", "PT50999900010000000000167", "1.234,56", "Fatura EXEMPLO 2025/001", ""],
    ["José Exemplo nº 2ª", "PT50999900010000000000264", "1.500,00", "Vencimento EXEMPLO novembro", ""],
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
      previewCap: "A mostrar as primeiras {max} de {n} linhas. O XML leva todas.",
      summary: "{e} erros, {w} avisos.",
      garbage: "Este ficheiro não parece uma lista de pagamentos. É precisa uma coluna com IBAN (ou NIB de 21 dígitos) e outra com montantes.",
      repeatEmpty: "Ainda não há um lote guardado neste browser.",
      repeatOk: "O último lote voltou a abrir, com a próxima data útil.",
      benSaved: "Beneficiário guardado neste browser.",
      benNeed: "Indique o nome e o IBAN do beneficiário.",
      benBad: "Esse JSON não é uma lista de beneficiários.",
      benWiped: "A lista de beneficiários foi apagada deste browser.",
      confirmWipe: "Apagar todos os beneficiários guardados neste browser?",
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
        "date-weekend": "a data de execução calha a um sábado ou domingo. Confirme se o banco a aceita.",
        "amount-ambiguous": "o montante «{v}» tem um separador seguido de 3 dígitos. Não dá para saber se são milhares ou decimais. Escreva 1.234,56 ou 1234,56.",
        "amount-scientific": "o montante «{v}» está em notação científica. Escreva o número por extenso.",
        "iban-scientific": "o Excel leu o IBAN como número («{v}»). Formate a coluna como texto.",
        "iban-pt50": "o IBAN português «{v}» não começa por PT50.",
        "iban-ccc": "os dígitos de controlo da conta espanhola em «{v}» não batem certo.",
        "nif-missing": "falta o NIF-sufijo de 12 caracteres exigido pela guia AEB/CECA quando o IBAN é espanhol.",
        "nif-format": "o NIF-sufijo tem de ficar com 12 letras ou algarismos."
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
      previewCap: "Se muestran las primeras {max} de {n} filas. El XML las lleva todas.",
      summary: "{e} errores, {w} avisos.",
      garbage: "Este fichero no parece una lista de pagos. Hace falta una columna con IBAN y otra con importes.",
      repeatEmpty: "Todavía no hay un lote guardado en este navegador.",
      repeatOk: "El último lote se ha vuelto a abrir, con la siguiente fecha hábil.",
      benSaved: "Beneficiario guardado en este navegador.",
      benNeed: "Indique el nombre y el IBAN del beneficiario.",
      benBad: "Ese JSON no es una lista de beneficiarios.",
      benWiped: "La lista de beneficiarios se ha borrado de este navegador.",
      confirmWipe: "¿Borrar todos los beneficiarios guardados en este navegador?",
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
        "date-weekend": "la fecha de ejecución cae en sábado o domingo. Confirme que el banco la acepta.",
        "amount-ambiguous": "el importe «{v}» tiene un separador y 3 dígitos. No se distingue miles de decimales. Escriba 1.234,56 o 1234,56.",
        "amount-scientific": "el importe «{v}» está en notación científica. Escriba el número completo.",
        "iban-scientific": "Excel ha leído el IBAN como número («{v}»). Ponga la columna como texto.",
        "iban-pt50": "el IBAN portugués «{v}» no empieza por PT50.",
        "iban-ccc": "los dígitos de control de la cuenta española en «{v}» no coinciden.",
        "nif-missing": "falta el NIF-sufijo de 12 caracteres que pide la guía AEB/CECA cuando el IBAN es español.",
        "nif-format": "el NIF-sufijo tiene que quedar en 12 letras o cifras."
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
      previewCap: "Showing the first {max} of {n} rows. The XML includes every row.",
      summary: "{e} errors, {w} warnings.",
      garbage: "This file does not look like a payment list. It needs an IBAN column and an amount column.",
      repeatEmpty: "There is no saved batch in this browser yet.",
      repeatOk: "The last batch is open again, with the next business day.",
      benSaved: "Beneficiary saved in this browser.",
      benNeed: "Enter the beneficiary name and IBAN.",
      benBad: "That JSON is not a list of beneficiaries.",
      benWiped: "The beneficiary list was deleted from this browser.",
      confirmWipe: "Delete every beneficiary saved in this browser?",
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
        "date-weekend": "the execution date falls on a Saturday or Sunday. Check that the bank accepts it.",
        "amount-ambiguous": "the amount «{v}» has one separator and 3 digits. Thousands and decimals cannot be told apart. Write 1.234,56 or 1234.56.",
        "amount-scientific": "the amount «{v}» is in scientific notation. Write the full number.",
        "iban-scientific": "Excel read the IBAN as a number («{v}»). Format the column as text.",
        "iban-pt50": "the Portuguese IBAN «{v}» does not start with PT50.",
        "iban-ccc": "the Spanish account check digits in «{v}» do not match.",
        "nif-missing": "the 12-character NIF-sufijo required by the AEB/CECA guide is missing for a Spanish IBAN.",
        "nif-format": "the NIF-sufijo has to be 12 letters or digits."
      }
    }
  };
  var T = STR[lang];

  var SEPA = { AD: 1, AL: 1, AT: 1, BE: 1, BG: 1, CH: 1, CY: 1, CZ: 1, DE: 1, DK: 1, EE: 1, ES: 1, FI: 1, FR: 1, GB: 1, GG: 1, GI: 1, GR: 1, HR: 1, HU: 1, IE: 1, IM: 1, IS: 1, IT: 1, JE: 1, LI: 1, LT: 1, LU: 1, LV: 1, MC: 1, MD: 1, ME: 1, MK: 1, MT: 1, NL: 1, NO: 1, PL: 1, PT: 1, RO: 1, RS: 1, SE: 1, SI: 1, SK: 1, SM: 1, VA: 1 };
  var IBAN_LEN = { AD: 24, AE: 23, AL: 28, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22, BR: 29, BY: 28, CH: 21, CR: 22, CY: 28, CZ: 24, DE: 22, DK: 18, DO: 28, EE: 20, EG: 29, ES: 24, FI: 18, FO: 18, FR: 27, GB: 22, GE: 22, GG: 22, GI: 23, GL: 18, GR: 27, GT: 28, HR: 21, HU: 28, IE: 22, IL: 23, IM: 22, IQ: 23, IS: 26, IT: 27, JE: 22, JO: 30, KW: 30, KZ: 20, LB: 28, LC: 32, LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MD: 24, ME: 22, MK: 19, MR: 27, MT: 31, MU: 30, NL: 18, NO: 15, PK: 24, PL: 28, PS: 29, PT: 25, QA: 29, RO: 24, RS: 22, SA: 24, SC: 31, SE: 24, SI: 19, SK: 24, SM: 27, ST: 25, SV: 28, TL: 23, TN: 24, TR: 26, UA: 29, VA: 22, VG: 24, XK: 20 };

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
    "º": "o", "ª": "a",
    "‘": "'", "’": "'", "‚": "'", "′": "'",
    "“": " ", "”": " ", "„": " ", "«": " ", "»": " ",
    "–": "-", "—": "-", "−": "-",
    "#": " ",
    "€": "EUR", "@": "(at)", "&": "+", "_": "-", "\t": " ", "\n": " ", "\r": " "
  };

  var NAME_KEYS = ["nome", "name", "nombre", "beneficiario", "acreedor", "creditor", "fornecedor", "proveedor", "empregado", "empleado", "titular", "payee", "supplier", "nomedobeneficiario", "nombredelbeneficiario", "nomedofornecedor", "nombredelproveedor", "destinatario", "colaborador", "trabalhador", "trabajador", "ordenantebeneficiario", "primeironome", "firstname", "apellido"];
  var NAME2_KEYS = ["apelido", "apelidos", "sobrenome", "apellidos", "apellido", "surname", "lastname", "last"];
  var IBAN_KEYS = ["iban", "nib", "ibanbeneficiario", "ibandelbeneficiario", "numerodeiban", "conta", "cuenta", "numerodeconta", "numerodecuenta", "nconta", "ncuenta", "account"];
  var AMOUNT_KEYS = ["montante", "valor", "amount", "importe", "quantia", "vencimento", "salario", "montanteeur", "valoreur", "importeeur", "valorpagamento", "payment"];
  var REF_KEYS = ["referencia", "descricao", "description", "concepto", "motivo", "remittance", "comunicacao", "descritivo", "detalhe", "detalles", "observacoes", "observaciones", "notes", "note", "memo", "fatura", "factura", "invoice"];
  var BIC_KEYS = ["bic", "swift", "bicswift", "bicbeneficiario", "codigobic", "biccredor", "codigoswift"];
  var UI = {
    pt: { high: "alta", mid: "média", low: "baixa", detected: "Deteção", auto: "preenchido automaticamente", required: "Obrigatório preencher", missing: "Ainda falta", downloadWhy: "Não é possível descarregar", ref: "Pagamento" },
    es: { high: "alta", mid: "media", low: "baja", detected: "Detección", auto: "rellenado automáticamente", required: "Obligatorio rellenar", missing: "Aún falta", downloadWhy: "No se puede descargar", ref: "Pago" },
    en: { high: "high", mid: "medium", low: "low", detected: "Detected", auto: "filled automatically", required: "Must be filled in", missing: "Still missing", downloadWhy: "Cannot download", ref: "Payment" }
  }[lang];
  var MONTHS = {
    pt: ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"],
    es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  }[lang];

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
      ["name2", NAME2_KEYS],
      ["iban", IBAN_KEYS],
      ["amount", AMOUNT_KEYS],
      ["ref", REF_KEYS],
      ["bic", BIC_KEYS]
    ];
    var map = { name: -1, name2: -1, iban: -1, amount: -1, ref: -1, bic: -1, confidence: {} };
    var f, c, best, bestI, sc;
    for (f = 0; f < fields.length; f++) {
      best = 0;
      bestI = -1;
      for (c = 0; c < headers.length; c++) {
        sc = scoreKey(normKey(headers[c]), fields[f][1]);
        if (sc > best) { best = sc; bestI = c; }
      }
      if (best > 0) {
        map[fields[f][0]] = bestI;
        map.confidence[fields[f][0]] = best >= 3 ? "high" : "mid";
      }
    }
    var used = {};
    ["iban", "amount", "name", "name2", "ref", "bic"].forEach(function (key) {
      if (map[key] < 0) return;
      if (used[map[key]]) { map[key] = -1; delete map.confidence[key]; }
      else used[map[key]] = 1;
    });
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
  function ptNibOk(nib) {
    if (!/^\d{21}$/.test(nib)) return false;
    var rem = mod97(nib.slice(0, 19) + "00");
    return String(98 - rem).padStart(2, "0") === nib.slice(19);
  }
  function ibanCheckDigits(country, bban) {
    var rearranged = bban + country + "00";
    var expanded = "", i, code;
    for (i = 0; i < rearranged.length; i++) {
      code = rearranged.charCodeAt(i);
      expanded += code >= 65 && code <= 90 ? String(code - 55) : rearranged.charAt(i);
    }
    return String(98 - mod97(expanded)).padStart(2, "0");
  }
  function esDigit(digits, weights) {
    var sum = 0, i, r;
    for (i = 0; i < digits.length; i++) sum += (digits.charCodeAt(i) - 48) * weights[i];
    r = 11 - (sum % 11);
    if (r === 11) r = 0;
    if (r === 10) r = 1;
    return String(r);
  }
  function esCccOk(iban) {
    var bban = iban.slice(4);
    if (!/^\d{20}$/.test(bban)) return false;
    var d1 = esDigit(bban.slice(0, 8), [4, 8, 5, 10, 9, 7, 3, 6]);
    var d2 = esDigit(bban.slice(10), [1, 2, 4, 8, 5, 10, 9, 7, 3, 6]);
    return bban.charAt(8) === d1 && bban.charAt(9) === d2;
  }
  function isScientific(raw) {
    if (typeof raw === "number") return /e/i.test(String(raw));
    return /^[+-]?\d+(\.\d+)?[eE][+-]?\d+$/.test(String(raw || "").replace(/\s/g, ""));
  }
  function checkIban(raw) {
    if (typeof raw === "number" || isScientific(raw)) return { error: "iban-scientific", value: String(raw) };
    var v = String(raw || "").replace(/[\s.\-_/]/g, "").toUpperCase();
    if (!v) return { error: "iban-missing", value: "" };
    if (/^\d{21}$/.test(v)) {
      if (!ptNibOk(v)) return { error: "iban-nib", value: v };
      v = "PT" + ibanCheckDigits("PT", v) + v;
    }
    if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(v)) return { error: "iban-format", value: v };
    var cc = v.slice(0, 2);
    var need = IBAN_LEN[cc];
    if (!need) return { error: "iban-unknown", value: v, cc: cc };
    if (v.length !== need) return { error: "iban-length", value: v, cc: cc, n: v.length, need: need };
    if (ibanMod97(v) !== 1) return { error: "iban-check", value: v };
    if (!SEPA[cc]) return { error: "iban-country", value: v };
    if (cc === "PT") {
      if (v.slice(0, 4) !== "PT50") return { error: "iban-pt50", value: v };
      if (!ptNibOk(v.slice(4))) return { error: "iban-nib", value: v };
    }
    if (cc === "ES" && !esCccOk(v)) return { error: "iban-ccc", value: v };
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
      var shownNum = String(raw);
      if (isScientific(raw)) return { error: "amount-scientific", value: shownNum };
      if (raw <= 0) return { error: "amount-positive", value: shownNum };
      var fixed = raw.toFixed(2);
      if (Math.abs(raw - Number(fixed)) > 0.0000001) return { error: "amount-decimals", value: shownNum };
      return centsFromNormalized(fixed, shownNum);
    }
    var shown = String(raw == null ? "" : raw).trim();
    if (!shown) return { error: "amount-empty", value: "" };
    if (isScientific(shown)) return { error: "amount-scientific", value: shown };
    var s = shown.replace(/\u00a0/g, "").replace(/\s/g, "").replace(/€/g, "").replace(/eur/ig, "");
    if (!s) return { error: "amount-empty", value: shown };
    if (s.charAt(0) === "-" || s.charAt(0) === "(") return { error: "amount-positive", value: shown };
    if (!/^[0-9.,]+$/.test(s)) return { error: "amount-format", value: shown };
    var commas = s.split(",").length - 1;
    var dots = s.split(".").length - 1;
    var normalized, parts, i, sep;
    if (commas && dots) {
      var lastComma = s.lastIndexOf(",");
      var lastDot = s.lastIndexOf(".");
      if (lastComma > lastDot) {
        parts = s.split(",");
        if (parts[1].length > 2) return { error: "amount-decimals", value: shown };
        if (!parts[0].split(".").every(function (g, idx) { return idx === 0 ? g.length > 0 : g.length === 3; })) return { error: "amount-format", value: shown };
        normalized = parts[0].replace(/\./g, "") + "." + parts[1];
      } else {
        parts = s.split(".");
        if (parts[1].length > 2) return { error: "amount-decimals", value: shown };
        if (!parts[0].split(",").every(function (g, idx) { return idx === 0 ? g.length > 0 : g.length === 3; })) return { error: "amount-format", value: shown };
        normalized = parts[0].replace(/,/g, "") + "." + parts[1];
      }
    } else if (commas + dots === 1) {
      sep = commas ? "," : ".";
      parts = s.split(sep);
      if (parts[1].length === 3) return { error: "amount-ambiguous", value: shown };
      if (parts[1].length > 2) return { error: "amount-decimals", value: shown };
      normalized = parts[0] + "." + parts[1];
    } else if (commas + dots > 1) {
      sep = commas ? "," : ".";
      parts = s.split(sep);
      for (i = 1; i < parts.length; i++) if (parts[i].length !== 3) return { error: "amount-format", value: shown };
      normalized = parts.join("");
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
      rep = CHARMAP[ch] || " ";
      if (!seen[ch]) { seen[ch] = 1; changes.push(ch + "→" + (rep === " " ? " " : rep)); }
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
  function isoFromDate(d) {
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }
  function todayIso() {
    return isoFromDate(new Date());
  }
  function easterSunday(year) {
    var a = year % 19, b = Math.floor(year / 100), c = year % 100;
    var d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
    var g = Math.floor((b - f + 1) / 3);
    var h = (19 * a + b - d - g + 15) % 30;
    var i = Math.floor(c / 4), k = c % 4;
    var l = (32 + 2 * e + 2 * i - h - k) % 7;
    var m = Math.floor((a + 11 * h + 22 * l) / 451);
    var month = Math.floor((h + l - 7 * m + 114) / 31);
    var day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day, 12, 0, 0, 0);
  }
  function targetHoliday(d) {
    var month = d.getMonth() + 1, day = d.getDate(), year = d.getFullYear();
    if (month === 1 && day === 1) return true;
    if (month === 5 && day === 1) return true;
    if (month === 12 && (day === 25 || day === 26)) return true;
    var easter = easterSunday(year);
    var goodFriday = new Date(easter.getTime());
    goodFriday.setDate(easter.getDate() - 2);
    var easterMonday = new Date(easter.getTime());
    easterMonday.setDate(easter.getDate() + 1);
    return isoFromDate(d) === isoFromDate(goodFriday) || isoFromDate(d) === isoFromDate(easterMonday);
  }
  function nextBusinessDay() {
    var d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + 1);
    while (d.getDay() === 0 || d.getDay() === 6 || targetHoliday(d)) d.setDate(d.getDate() + 1);
    return isoFromDate(d);
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
    var lines = [], line = "", inQ = false, i, c;
    for (i = 0; i < text.length && lines.length < 20; i++) {
      c = text.charAt(i);
      if (c === '"') {
        if (inQ && text.charAt(i + 1) === '"') { i++; line += c; continue; }
        inQ = !inQ;
      }
      if (!inQ && (c === "\n" || c === "\r")) {
        if (c === "\r" && text.charAt(i + 1) === "\n") i++;
        if (line.trim()) lines.push(line);
        line = "";
        continue;
      }
      line += c;
    }
    if (line.trim()) lines.push(line);
    var semi = 0, comma = 0, tab = 0, n;
    for (n = 0; n < lines.length; n++) {
      semi = Math.max(semi, countDelim(lines[n], ";"));
      comma = Math.max(comma, countDelim(lines[n], ","));
      tab = Math.max(tab, countDelim(lines[n], "\t"));
    }
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
      version: $("pain-version").value === "03" ? "03" : "09",
      nif: $("dbtr-nif") ? $("dbtr-nif").value : ""
    };
  }

  function currentMap() {
    function num(id) {
      var v = $(id).value;
      return v === "" ? -1 : Number(v);
    }
    var prev = state && state.map ? state.map : {};
    return {
      name: num("map-name"),
      name2: prev.name2 >= 0 ? prev.name2 : -1,
      iban: num("map-iban"),
      amount: num("map-amount"),
      ref: num("map-ref"),
      bic: num("map-bic"),
      confidence: prev.confidence || {}
    };
  }
  function autofillOn() {
    var b = $("autofill");
    return !!(b && b.getAttribute("aria-pressed") === "true");
  }
  function markInput(id, on) {
    var el = $(id);
    if (!el) return;
    if (el.dataset.user === "1") on = false;
    el.dataset.auto = on ? "1" : "";
    var tag = $(id + "-auto");
    if (tag) tag.hidden = !on;
  }
  function defaultReference(dateIso) {
    var parts = String(dateIso || nextBusinessDay()).split("-");
    return UI.ref + " " + (MONTHS[Number(parts[1]) - 1] || "") + "/" + parts[0];
  }
  function applyAutofill() {
    if (!autofillOn() || !state) return;
    var stored = {};
    try { stored = JSON.parse(localStorage.getItem(STORE) || "{}") || {}; } catch (e) { stored = {}; }
    function fillIfEmpty(id, value) {
      var el = $(id);
      if (!el || el.dataset.user === "1" || String(el.value || "").trim() || !value) return;
      el.value = value;
      markInput(id, true);
    }
    fillIfEmpty("dbtr-name", stored.name);
    fillIfEmpty("dbtr-iban", stored.iban);
    fillIfEmpty("dbtr-bic", stored.bic || (window.NetmendBic ? NetmendBic.lookup(stored.iban) : ""));
    if ($("dbtr-date") && !$("dbtr-date").value && $("dbtr-date").dataset.user !== "1") {
      $("dbtr-date").value = nextBusinessDay();
      markInput("dbtr-date", true);
    }
    var byIban = {};
    loadBeneficiaries().forEach(function (b) {
      var key = String(b.iban || "").replace(/[\s.\-]/g, "").toUpperCase();
      if (key) byIban[key] = b;
    });
    var map = state.map || {};
    if (map.name < 0) {
      var needsName = state.dataRows.some(function (row) {
        var iban = map.iban >= 0 ? checkIban(row[map.iban]) : { value: "" };
        return iban.value && byIban[iban.value];
      });
      if (needsName) {
        state.headers.push(lang === "es" ? "Nombre" : lang === "en" ? "Name" : "Nome");
        map.name = state.headers.length - 1;
        state.dataRows.forEach(function (row) { row[map.name] = ""; });
        fillMapSelects();
      }
    }
    var wantRef = $("autofill-ref") && $("autofill-ref").checked;
    var dateIso = ($("dbtr-date") && $("dbtr-date").value) || nextBusinessDay();
    if (wantRef && map.ref < 0) {
      state.headers.push(lang === "es" ? "Referencia" : lang === "en" ? "Reference" : "Referência");
      map.ref = state.headers.length - 1;
      state.dataRows.forEach(function (row) { row[map.ref] = row[map.ref] || ""; });
      fillMapSelects();
    }
    if (map.bic < 0 && window.NetmendBic) {
      var needsBic = state.dataRows.some(function (row) {
        var iban = map.iban >= 0 ? checkIban(row[map.iban]) : { value: "" };
        return iban.value && NetmendBic.lookup(iban.value);
      });
      if (needsBic) {
        state.headers.push("BIC");
        map.bic = state.headers.length - 1;
        state.dataRows.forEach(function (row) { row[map.bic] = row[map.bic] || ""; });
        fillMapSelects();
      }
    }
    state.autoCells = state.autoCells || {};
    function locked(rowNo, key) { return !!(state.userCells && state.userCells[rowNo + ":" + key]); }
    state.dataRows.forEach(function (row, idx) {
      var rowNo = idx + (state.firstRow || 2);
      var iban = map.iban >= 0 ? checkIban(row[map.iban]) : { value: "" };
      if (map.bic >= 0 && !locked(rowNo, "bic") && !String(row[map.bic] || "").trim() && iban.value && window.NetmendBic) {
        var bic = NetmendBic.lookup(iban.value);
        if (bic) { row[map.bic] = bic; state.autoCells[rowNo + ":bic"] = 1; }
      }
      if (map.name >= 0 && !locked(rowNo, "name") && !String(row[map.name] || "").trim() && iban.value && byIban[iban.value]) {
        row[map.name] = byIban[iban.value].name;
        state.autoCells[rowNo + ":name"] = 1;
      }
      if (wantRef && map.ref >= 0 && !locked(rowNo, "ref") && !String(row[map.ref] || "").trim()) {
        row[map.ref] = defaultReference(dateIso);
        state.autoCells[rowNo + ":ref"] = 1;
      }
    });
    if (map.bic >= 0 && window.NetmendBic) {
      var own = checkIban($("dbtr-iban").value);
      if (own.value && !$("dbtr-bic").value.trim() && $("dbtr-bic").dataset.user !== "1") {
        var ownBic = NetmendBic.lookup(own.value);
        if (ownBic) { $("dbtr-bic").value = ownBic; markInput("dbtr-bic", true); }
      }
    }
  }
  function setFieldState(id, invalid) {
    var el = $(id);
    var err = $(id + "-err");
    if (!el) return;
    el.setAttribute("aria-invalid", invalid ? "true" : "false");
    if (err) {
      err.hidden = !invalid;
      err.textContent = invalid ? UI.required : "";
      el.setAttribute("aria-describedby", id + "-err");
    }
  }

  function buildPayments(rows, map) {
    var payments = [];
    var notices = [];
    var r, cells, nameRaw, ibanRaw, amountRaw, refRaw, bicRaw, rowNo, nameKey;
    for (r = 0; r < rows.length; r++) {
      cells = rows[r];
        rowNo = r + (state && state.firstRow ? state.firstRow : 2);
      nameRaw = map.name >= 0 ? cells[map.name] : "";
      if (map.name2 >= 0 && String(cells[map.name2] || "").trim()) nameRaw = (cellStr(nameRaw) + " " + cellStr(cells[map.name2])).trim();
      ibanRaw = map.iban >= 0 ? cells[map.iban] : "";
      amountRaw = map.amount >= 0 ? cells[map.amount] : "";
      refRaw = map.ref >= 0 ? cells[map.ref] : "";
      bicRaw = map.bic >= 0 ? cells[map.bic] : "";
      nameKey = normKey(cells.map(cellStr).join(" "));
      var rowIban = cells.some(function (cell) { return /^[A-Z]{2}\d{2}[A-Z0-9]{10,}$/.test(String(cell || "").replace(/[\s.\-]/g, "").toUpperCase()) || /^\d{21}$/.test(String(cell || "").replace(/\s/g, "")); });
      if (/\b(total|totais|totales|soma|sum|subtotal)\b/.test(nameKey) && !rowIban) {
        notices.push({ level: "warn", who: "", text: fill(T.ignoredTotal, { row: rowNo }) });
        continue;
      }
      if (![nameRaw, ibanRaw, amountRaw, refRaw, bicRaw].some(function (v) { return String(v == null ? "" : v).trim() !== ""; })) continue;
      payments.push({
        row: rowNo,
        dataIndex: r,
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
    else if (name.error === "length") pushIssue(errors, "error", who, "name-length", { n: name.n });
    else if (!name.value) pushIssue(errors, "error", who, "name-missing");
    else if (name.changes.length) pushIssue(warnings, "warn", who, "translit", { field: T.field.name, from: name.from, to: name.value, changes: name.changes.join(", ") });

    if (iban.error) pushIssue(errors, "error", who, iban.error, { v: iban.value, cc: iban.cc, n: iban.n, need: iban.need });
    if (amount.error) pushIssue(errors, "error", who, amount.error, { v: amount.value || cellStr(p.amountRaw) });
    if (String(p.refRaw || "").trim()) {
      if (ref.error === "length") pushIssue(errors, "error", who, "ref-length", { n: ref.n });
      else if (ref.changes.length) pushIssue(warnings, "warn", who, "translit", { field: T.field.ref, from: ref.from, to: ref.value, changes: ref.changes.join(", ") });
    }
    if (bic.error) pushIssue(errors, "error", who, "bic-format", { v: bic.value });

    return {
      row: p.row,
      dataIndex: p.dataIndex,
      nameEmpty: !String(p.nameRaw || "").trim(),
      ibanEmpty: !String(p.ibanRaw || "").trim(),
      amountEmpty: String(p.amountRaw == null ? "" : p.amountRaw).trim() === "",
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
    else if (name.error === "length") pushIssue(errors, "error", who, "name-length", { n: name.n });
    else if (!name.value) pushIssue(errors, "error", who, "name-missing");
    else if (name.changes.length) pushIssue(warnings, "warn", who, "translit", { field: T.field.name, from: name.from, to: name.value, changes: name.changes.join(", ") });
    if (iban.error) pushIssue(errors, "error", who, iban.error, { v: iban.value, cc: iban.cc, n: iban.n, need: iban.need });
    if (bic.error) pushIssue(errors, "error", who, "bic-format", { v: bic.value });
    var nifRaw = String(d.nif || "").trim();
    var nifClean = sepaText(nifRaw, 35);
    var nifValue = (nifClean.value || "").replace(/\s/g, "").toUpperCase();
    if (iban.value && iban.value.slice(0, 2) === "ES") {
      if (!nifValue) pushIssue(errors, "error", who, "nif-missing");
      else if (!/^[A-Z0-9]{12}$/.test(nifValue)) pushIssue(errors, "error", who, "nif-format", { v: nifRaw });
      else if (nifClean.changes && nifClean.changes.length) pushIssue(warnings, "warn", who, "translit", { field: "NIF-sufijo", from: nifRaw, to: nifValue, changes: nifClean.changes.join(", ") });
    } else if (nifValue) {
      if (!/^[A-Z0-9]{12}$/.test(nifValue)) pushIssue(errors, "error", who, "nif-format", { v: nifRaw });
    }
    if (!d.date || !/^\d{4}-\d{2}-\d{2}$/.test(d.date)) pushIssue(errors, "error", who, "date-missing");
    else {
      if (d.date < todayIso()) pushIssue(warnings, "warn", who, "date-past");
      var parts = d.date.split("-");
      var dt = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      var day = dt.getDay();
      if (day === 0 || day === 6) pushIssue(warnings, "warn", who, "date-weekend");
    }
    return { name: name.value || "", iban: iban.value || "", bic: bic.value || "", nif: /^[A-Z0-9]{12}$/.test(nifValue) ? nifValue : "", errors: errors, warnings: warnings };
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
    if (debtor.nif) {
      lines.push("        <Id>");
      lines.push("          <OrgId>");
      lines.push("            <Othr>");
      lines.push("              <Id>" + xmlEscape(debtor.nif) + "</Id>");
      lines.push("            </Othr>");
      lines.push("          </OrgId>");
      lines.push("        </Id>");
    }
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
    $("c-errors").textContent = "0";
    $("c-warnings").textContent = "0";
    if ($("live-summary")) $("live-summary").textContent = "";
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
    var hint = $("map-confidence");
    if (hint) {
      var bits = [];
      [["name", T.field.name], ["iban", "IBAN"], ["amount", T.field.amount], ["ref", T.field.ref], ["bic", "BIC"]].forEach(function (pair) {
        var level = map.confidence && map.confidence[pair[0]];
        if (map[pair[0]] >= 0 && level) bits.push(pair[1] + " (" + (UI[level] || level) + ")");
      });
      hint.hidden = !bits.length;
      hint.textContent = bits.length ? UI.detected + ": " + bits.join(", ") + "." : "";
    }
  }

  function tagAuto(cell, key, row) {
    if (!cell || !state.autoCells || !state.autoCells[row + ":" + key]) return;
    var mark = document.createElement("span");
    mark.className = "auto-tag";
    mark.textContent = UI.auto;
    cell.appendChild(document.createTextNode(" "));
    cell.appendChild(mark);
  }
  function paintMissing(debtorRaw, validated) {
    var missing = [];
    setFieldState("dbtr-name", !String(debtorRaw.name || "").trim());
    setFieldState("dbtr-iban", !String(debtorRaw.iban || "").trim());
    setFieldState("dbtr-date", !String(debtorRaw.date || "").trim());
    if (!String(debtorRaw.name || "").trim()) missing.push({ href: "#dbtr-name", label: T.who.debtor + " — " + T.field.name });
    if (!String(debtorRaw.iban || "").trim()) missing.push({ href: "#dbtr-iban", label: T.who.debtor + " — IBAN" });
    if (!String(debtorRaw.date || "").trim()) missing.push({ href: "#dbtr-date", label: T.who.debtor + " — " + T.field.date });
    validated.forEach(function (item) {
      if (item.nameEmpty) missing.push({ href: "#pay-row-" + item.row, label: fill(T.who.row, { row: item.row }) + " — " + T.field.name });
      if (item.ibanEmpty) missing.push({ href: "#pay-row-" + item.row, label: fill(T.who.row, { row: item.row }) + " — IBAN" });
      if (item.amountEmpty) missing.push({ href: "#pay-row-" + item.row, label: fill(T.who.row, { row: item.row }) + " — " + T.field.amount });
    });
    var box = $("missing-summary");
    if (box) {
      clear(box);
      box.hidden = !missing.length;
      if (missing.length) {
        var p = document.createElement("p");
        p.textContent = UI.missing;
        box.appendChild(p);
        var ul = document.createElement("ul");
        missing.forEach(function (item) {
          var li = document.createElement("li");
          var a = document.createElement("a");
          a.href = item.href;
          a.textContent = item.label;
          li.appendChild(a);
          ul.appendChild(li);
        });
        box.appendChild(ul);
      }
    }
    var reason = $("download-reason");
    var button = $("download");
    if (button && !button.getAttribute("data-label")) button.setAttribute("data-label", button.textContent);
    if (reason && button) {
      var why = missing.length ? UI.downloadWhy + ": " + missing.map(function (item) { return item.label; }).join(", ") + "." : "";
      reason.hidden = !why;
      reason.textContent = why;
      button.setAttribute("aria-describedby", "download-reason");
      button.textContent = why ? button.getAttribute("data-label") + " — " + UI.downloadWhy : button.getAttribute("data-label");
    }
  }
  function render(announce) {
    clearError();
    syncNif();
    if (!state) { clearResults(); return; }
    applyAutofill();
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
    var validated = built.payments.map(validatePayment);
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

    var errorCount = 0, warnCount = 0;
    for (i = 0; i < issues.length; i++) {
      if (issues[i].level === "error") errorCount++;
      else warnCount++;
    }
    $("results").hidden = false;
    $("c-count").textContent = String(validated.length);
    $("c-sum").textContent = formatEUR(cents);
    $("c-errors").textContent = String(errorCount);
    $("c-warnings").textContent = String(warnCount);
    $("sum-note").hidden = !(validAmounts !== validated.length && validated.length);
    if (!$("sum-note").hidden) $("sum-note").textContent = T.sumPartial;

    $("limit-note").hidden = true;

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
      function fieldCell(opts) {
        var cell = document.createElement("td");
        if (opts.numeric) cell.className = "num";
        var input = document.createElement("input");
        input.type = "text";
        input.value = opts.value;
        input.setAttribute("aria-label", fill(T.who.row, { row: opts.row }) + " " + opts.label);
        input.setAttribute("aria-invalid", opts.empty ? "true" : "false");
        var errId = "pay-" + opts.key + "-" + opts.row;
        if (opts.empty) input.setAttribute("aria-describedby", errId);
        input.addEventListener("input", function () {
          if (!state || opts.dataIndex == null) return;
          var row = state.dataRows[opts.dataIndex];
          var col = state.map[opts.key];
          if (!row || col < 0) return;
          row[col] = input.value;
          if (opts.key === "name" && state.map.name2 >= 0) row[state.map.name2] = "";
          state.userCells = state.userCells || {};
          state.userCells[opts.row + ":" + opts.key] = 1;
          if (state.autoCells) delete state.autoCells[opts.row + ":" + opts.key];
        });
        input.addEventListener("change", function () { if (state) render(false); });
        cell.appendChild(input);
        if (opts.empty) {
          var err = document.createElement("span");
          err.id = errId;
          err.className = "bad cell-err";
          err.textContent = UI.required;
          cell.appendChild(err);
        }
        tagAuto(cell, opts.key, opts.row);
        tr.appendChild(cell);
      }
      if (item) {
        tr.id = "pay-row-" + item.row;
        fieldCell({ key: "name", label: T.field.name, value: item.name || cellStr(src.nameRaw), empty: item.nameEmpty, row: item.row, dataIndex: item.dataIndex });
        fieldCell({ key: "iban", label: "IBAN", value: item.iban ? groupIban(item.iban) : cellStr(src.ibanRaw), empty: item.ibanEmpty, row: item.row, dataIndex: item.dataIndex });
        fieldCell({ key: "amount", label: T.field.amount, value: item.amountOk ? formatEUR(item.cents) : cellStr(src.amountRaw), empty: item.amountEmpty, row: item.row, dataIndex: item.dataIndex, numeric: true });
        fieldCell({ key: "ref", label: T.field.ref, value: item.ref || "", empty: false, row: item.row, dataIndex: item.dataIndex });
        fieldCell({ key: "bic", label: "BIC", value: item.bic || "", empty: false, row: item.row, dataIndex: item.dataIndex });
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
    if (!$("preview-note").hidden) $("preview-note").textContent = fill(T.previewCap, { max: PREVIEW_MAX, n: built.payments.length });

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
        nif: debtor.nif,
        date: debtorRaw.date,
        batch: debtorRaw.batch
      }, validated, debtorRaw.version);
      $("download").disabled = false;
    } else {
      lastXml = "";
      $("download").disabled = true;
    }
    paintMissing(debtorRaw, validated, blocked);
    if (announce) {
      var live = $("live-summary");
      if (live) live.textContent = fill(T.summary, { e: errorCount, w: warnCount });
      if (!$("results").hidden) {
        $("results").tabIndex = -1;
        $("results").scrollIntoView({ block: "start" });
        $("results").focus();
      }
    }
  }

  function setGrid(headers, dataRows, fileName, map, firstRow) {
    state = { headers: headers, dataRows: dataRows, fileName: fileName, map: map, firstRow: firstRow || 2, userCells: {}, autoCells: {} };
    clearResults();
    fillMapSelects();
    render(true);
    saveBatch();
  }

  function detectContentMap(rows) {
    var width = 0, r, c, n = rows.length;
    for (r = 0; r < n; r++) width = Math.max(width, rows[r].length);
    var iban = [], amount = [], bic = [], name = [];
    for (c = 0; c < width; c++) {
      iban[c] = 0;
      amount[c] = 0;
      bic[c] = 0;
      name[c] = 0;
      for (r = 0; r < n; r++) {
        var cell = rows[r][c];
        var compact = String(cell == null ? "" : cell).replace(/[\s.\-_/]/g, "");
        var ibanLike = /^\d{21}$/.test(compact) || /^[A-Za-z]{2}\d{2}[A-Za-z0-9]{10,30}$/.test(compact);
        if (ibanLike) iban[c]++;
        var money = compact.replace(/€/g, "").replace(/eur/ig, "");
        if (!ibanLike && (typeof cell === "number" || /^[0-9][0-9.,]*$/.test(money))) amount[c]++;
        if (/^[A-Za-z]{6}[A-Za-z0-9]{2}([A-Za-z0-9]{3})?$/.test(compact)) bic[c]++;
        if (/[A-Za-zÀ-ÿ]{3,}/.test(String(cell || "")) && !/^[A-Za-z]{2}\d{2}/.test(compact)) name[c]++;
      }
    }
    function best(arr, min) {
      var i, bi = -1, bv = 0;
      for (i = 0; i < arr.length; i++) if (arr[i] > bv) { bv = arr[i]; bi = i; }
      return bv >= min ? bi : -1;
    }
    var minHit = Math.max(1, Math.ceil(n * 0.5));
    var map = { iban: best(iban, minHit), amount: best(amount, minHit), name: best(name, 1), bic: best(bic, minHit), ref: -1 };
    var used = {};
    ["iban", "amount", "name", "bic"].forEach(function (key) {
      if (map[key] < 0) return;
      if (used[map[key]]) map[key] = -1;
      else used[map[key]] = 1;
    });
    return map;
  }

  function padRow(row, width) {
    var out = [], c;
    for (c = 0; c < width; c++) out.push(c < row.length ? row[c] : "");
    return out;
  }
  function rowsFromMatrix(matrix, fileName) {
    if (!matrix.length) { showError(T.emptyFile); return; }
    var width = 0, r, c;
    for (r = 0; r < matrix.length; r++) width = Math.max(width, matrix[r].length);
    var best = { i: -1, score: 0, map: null };
    var limit = Math.min(matrix.length, 15);
    for (r = 0; r < limit; r++) {
      var cand = detectMap(matrix[r].map(cellStr));
      var score = (cand.name >= 0 ? 2 : 0) + (cand.iban >= 0 ? 2 : 0) + (cand.amount >= 0 ? 2 : 0) + (cand.ref >= 0 ? 1 : 0) + (cand.bic >= 0 ? 1 : 0);
      if (score > best.score) best = { i: r, score: score, map: cand };
    }
    var headers = [], data, map;
    if (best.score >= 4 && best.map.iban >= 0 && best.map.amount >= 0) {
      for (c = 0; c < width; c++) headers.push(cellStr(matrix[best.i][c]) || fill(T.colLabel, { n: c + 1 }));
      data = matrix.slice(best.i + 1).map(function (row) { return padRow(row, width); }).filter(function (row) {
        return row.some(function (v) { return String(v == null ? "" : v).trim() !== ""; });
      });
      if (!data.length) { showError(T.headerOnly); return; }
      setGrid(headers, data, fileName, best.map, best.i + 2);
      return;
    }
    data = matrix.map(function (row) { return padRow(row, width); });
    map = detectContentMap(data);
    if (map.iban < 0 || map.amount < 0) { showError(T.garbage); return; }
    map.confidence = { iban: "mid", amount: "mid", name: map.name >= 0 ? "low" : undefined };
    for (c = 0; c < width; c++) headers.push(fill(T.colLabel, { n: c + 1 }));
    setGrid(headers, data, fileName, map, 1);
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

  function syncNif() {
    var wrap = $("nif-wrap");
    if (!wrap) return;
    var iban = String($("dbtr-iban").value || "").replace(/\s+/g, "").toUpperCase();
    wrap.hidden = !(lang === "es" || iban.slice(0, 2) === "ES");
  }
  function saveDebtor() {
    try {
      localStorage.setItem(STORE, JSON.stringify({
        name: $("dbtr-name").value,
        iban: $("dbtr-iban").value,
        bic: $("dbtr-bic").value,
        batch: $("dbtr-batch").checked,
        nif: $("dbtr-nif") ? $("dbtr-nif").value : ""
      }));
    } catch (e) { /* private mode */ }
  }
  function loadDebtor() {
    $("dbtr-date").value = nextBusinessDay();
    var raw = null;
    try { raw = localStorage.getItem(STORE); } catch (e) { raw = null; }
    if (!raw) return;
    try {
      var data = JSON.parse(raw);
      if (data.name) $("dbtr-name").value = data.name;
      if (data.iban) $("dbtr-iban").value = data.iban;
      if (data.bic) $("dbtr-bic").value = data.bic;
      if (data.nif && $("dbtr-nif")) $("dbtr-nif").value = data.nif;
      $("dbtr-batch").checked = data.batch !== false;
    } catch (e2) { /* keep the fresh date */ }
    syncNif();
  }
  function saveBatch() {
    if (!state) return;
    try {
      localStorage.setItem(BATCH_STORE, JSON.stringify({
        headers: state.headers,
        dataRows: state.dataRows,
        map: state.map,
        fileName: state.fileName,
        firstRow: state.firstRow,
        debtor: {
          name: $("dbtr-name").value,
          iban: $("dbtr-iban").value,
          bic: $("dbtr-bic").value,
          batch: $("dbtr-batch").checked,
          nif: $("dbtr-nif") ? $("dbtr-nif").value : ""
        }
      }));
    } catch (e) { /* private mode */ }
  }
  function repeatBatch() {
    var raw = null;
    try { raw = localStorage.getItem(BATCH_STORE); } catch (e) { raw = null; }
    if (!raw) { showError(T.repeatEmpty); return; }
    var data;
    try { data = JSON.parse(raw); } catch (e2) { showError(T.repeatEmpty); return; }
    if (!data || !data.dataRows) { showError(T.repeatEmpty); return; }
    if (data.debtor) {
      $("dbtr-name").value = data.debtor.name || "";
      $("dbtr-iban").value = data.debtor.iban || "";
      $("dbtr-bic").value = data.debtor.bic || "";
      if ($("dbtr-nif")) $("dbtr-nif").value = data.debtor.nif || "";
      $("dbtr-batch").checked = data.debtor.batch !== false;
    }
    $("dbtr-date").value = nextBusinessDay();
    setGrid(data.headers, data.dataRows, data.fileName || T.exampleName, data.map, data.firstRow || 2);
    $("example-note").hidden = false;
    $("example-note").textContent = T.repeatOk;
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
    var sample = EXAMPLE_ROWS.slice(1).map(function (row) {
      if (lang === "es") return [row[0], row[1], row[2], row[3], row[4]];
      if (lang === "en") return [row[0], row[1], row[2], row[3], row[4]];
      return row;
    });
    var ws = XLSX.utils.aoa_to_sheet([headers].concat(sample));
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
      if (!$("dbtr-date").value) $("dbtr-date").value = nextBusinessDay();
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
    $(id).addEventListener("change", function () { if (state) render(true); });
  });
  ["dbtr-name", "dbtr-iban", "dbtr-bic", "dbtr-date", "dbtr-nif"].forEach(function (id) {
    if (!$(id)) return;
    $(id).addEventListener("input", function () {
      if ($(id)) $(id).dataset.user = "1";
      markInput(id, false);
      saveDebtor();
      syncNif();
      if (state) render(false);
    });
    $(id).addEventListener("blur", function () { if (state) render(true); });
  });
  $("dbtr-batch").addEventListener("change", function () { saveDebtor(); if (state) render(true); });
  $("pain-version").addEventListener("change", function () { if (state) render(true); });
  if ($("repeat")) $("repeat").addEventListener("click", repeatBatch);
  if ($("autofill")) $("autofill").addEventListener("click", function () {
    var on = $("autofill").getAttribute("aria-pressed") !== "true";
    $("autofill").setAttribute("aria-pressed", on ? "true" : "false");
    if (state) render(true);
  });
  if ($("autofill-ref")) $("autofill-ref").addEventListener("change", function () { if (autofillOn() && state) render(true); });
  $("dbtr-clear").addEventListener("click", function () {
    $("dbtr-name").value = "";
    $("dbtr-iban").value = "";
    $("dbtr-bic").value = "";
    if ($("dbtr-nif")) $("dbtr-nif").value = "";
    $("dbtr-date").value = nextBusinessDay();
    $("dbtr-batch").checked = true;
    try { localStorage.removeItem(STORE); } catch (e) { /* ignore */ }
    syncNif();
    if (state) render(true);
  });

  function loadBeneficiaries() {
    try {
      var raw = localStorage.getItem(BEN_STORE);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) { return []; }
  }
  function storeBeneficiaries(list) {
    try { localStorage.setItem(BEN_STORE, JSON.stringify(list)); } catch (e) { /* private mode */ }
  }
  function renderBeneficiaries() {
    var listEl = $("ben-list");
    if (!listEl) return;
    clear(listEl);
    loadBeneficiaries().forEach(function (ben, index) {
      var li = document.createElement("li");
      var label = document.createElement("span");
      label.textContent = ben.name + " · " + groupIban(ben.iban);
      var use = document.createElement("button");
      use.type = "button";
      use.className = "btn ghost";
      use.textContent = lang === "es" ? "Añadir al lote" : lang === "en" ? "Add to batch" : "Juntar ao lote";
      use.addEventListener("click", function () { addBeneficiaryRow(ben); });
      var edit = document.createElement("button");
      edit.type = "button";
      edit.className = "btn ghost";
      edit.textContent = lang === "es" ? "Editar" : lang === "en" ? "Edit" : "Editar";
      edit.addEventListener("click", function () {
        $("ben-name").value = ben.name;
        $("ben-iban").value = ben.iban;
        $("ben-bic").value = ben.bic || "";
        $("ben-name").dataset.edit = String(index);
      });
      var del = document.createElement("button");
      del.type = "button";
      del.className = "btn ghost";
      del.textContent = lang === "es" ? "Borrar" : lang === "en" ? "Delete" : "Apagar";
      del.addEventListener("click", function () {
        var list = loadBeneficiaries();
        list.splice(index, 1);
        storeBeneficiaries(list);
        renderBeneficiaries();
      });
      li.appendChild(label);
      li.appendChild(use);
      li.appendChild(edit);
      li.appendChild(del);
      listEl.appendChild(li);
    });
  }
  function addBeneficiaryRow(ben) {
    var headers = state ? state.headers.slice() : (lang === "es" ? ["Nombre", "IBAN", "Importe", "Referencia", "BIC"] : lang === "en" ? ["Name", "IBAN", "Amount", "Reference", "BIC"] : ["Nome", "IBAN", "Montante", "Referência", "BIC"]);
    var map = state ? state.map : { name: 0, iban: 1, amount: 2, ref: 3, bic: 4 };
    var width = Math.max(headers.length, 5);
    var row = [];
    var c;
    for (c = 0; c < width; c++) row.push("");
    if (map.name >= 0) row[map.name] = ben.name;
    if (map.iban >= 0) row[map.iban] = ben.iban;
    if (map.bic >= 0) row[map.bic] = ben.bic || "";
    var data = state ? state.dataRows.slice() : [];
    data.push(row);
    if (!state) setGrid(headers, data, T.fileLabel, map, 2);
    else setGrid(headers, data, state.fileName, map, state.firstRow);
  }
  function saveBeneficiary() {
    var name = $("ben-name").value.trim();
    var iban = $("ben-iban").value.trim();
    var bic = $("ben-bic").value.trim();
    if (!name || !iban) { showError(T.benNeed); return; }
    var list = loadBeneficiaries();
    var edit = $("ben-name").dataset.edit;
    var item = { name: name, iban: iban, bic: bic };
    if (edit !== undefined && edit !== "" && list[Number(edit)]) list[Number(edit)] = item;
    else list.push(item);
    $("ben-name").dataset.edit = "";
    storeBeneficiaries(list);
    $("ben-name").value = "";
    $("ben-iban").value = "";
    $("ben-bic").value = "";
    renderBeneficiaries();
    $("example-note").hidden = false;
    $("example-note").textContent = T.benSaved;
  }
  if ($("ben-save")) $("ben-save").addEventListener("click", saveBeneficiary);
  if ($("ben-export")) $("ben-export").addEventListener("click", function () {
    var blob = new Blob([JSON.stringify(loadBeneficiaries(), null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "beneficiarios-sepa.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
  if ($("ben-import-btn") && $("ben-import")) $("ben-import-btn").addEventListener("click", function () { $("ben-import").click(); });
  if ($("ben-import")) $("ben-import").addEventListener("change", function () {
    var file = $("ben-import").files && $("ben-import").files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      var list;
      try { list = JSON.parse(String(reader.result)); } catch (e) { showError(T.benBad); return; }
      if (!Array.isArray(list)) { showError(T.benBad); return; }
      var clean = [];
      list.forEach(function (item) {
        if (!item || !item.name || !item.iban) return;
        clean.push({ name: String(item.name), iban: String(item.iban), bic: item.bic ? String(item.bic) : "" });
      });
      if (!clean.length) { showError(T.benBad); return; }
      storeBeneficiaries(clean);
      renderBeneficiaries();
    };
    reader.readAsText(file);
  });
  if ($("ben-wipe")) $("ben-wipe").addEventListener("click", function () {
    if (!window.confirm(T.confirmWipe)) return;
    storeBeneficiaries([]);
    renderBeneficiaries();
    $("example-note").hidden = false;
    $("example-note").textContent = T.benWiped;
  });

  loadDebtor();
  renderBeneficiaries();
  window.NetmendSepa = {
    lastXml: function () { return lastXml; },
    formatEUR: formatEUR
  };
})();
