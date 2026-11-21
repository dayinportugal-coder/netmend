/* Recibos verdes → quarterly Social Security figures, VAT and withholding.
   Runs in the browser. The file is not uploaded.
   Rates live in rules.js (RULES.year). SheetJS community 0.20.3 (Apache-2.0). */
(function () {
  "use strict";

  var RV = window.NM_RV;
  if (!RV) return;
  var RULES = RV.RULES;
  var PREVIEW_MAX = 200;
  var FREE_MAX = 12;
  var MAX_BYTES = 15 * 1024 * 1024;

  var lang = (document.documentElement.lang || "en").toLowerCase().indexOf("pt") === 0 ? "pt" : "en";
  var locale = lang === "pt" ? "pt-PT" : "en-IE";

  var STR = {
    en: {
      proNote: "Pro coming soon. It is not available yet, and this button does not take a payment.",
      sampleFail: "The example file could not be loaded. Check your connection and try again.",
      readFail: "That file could not be read.",
      tooBig: "Skipped. Files over 15 MB are not read in the browser.",
      noneParsed: "Those files do not look like a receipt table. Export with “Exportar tabela” or map the columns below.",
      needMap: "The column names were not recognised. Choose what each column is, then apply.",
      limit: "The free tool reads {max} files at a time. {n} were found, so only the first {max} were used.",
      emptyManual: "Type a quarterly or monthly amount. Leave a box empty to skip that period. 0 means no income that period.",
      previewCap: "Showing the first {max} of {n} rows. The Excel file has every row.",
      noClients: "Manual mode has no clients. Withholding you type is the quarter total, not a per-client split.",
      simRow: "Simulator",
      noneIssue: "None",
      docs: "Receipts",
      base: "Base (no VAT)",
      iva: "VAT charged",
      ret: "IRS withheld",
      problems: "Issues",
      validYes: "Yes",
      validNo: "No",
      sheetR: ["Date", "Receipt", "Client NIF", "Client name", "NIF valid", "Base (no VAT)", "VAT", "IRS withheld", "Status", "Quarter", "File"],
      sheetQ: ["Quarter", "Receipts", "Base to declare (no VAT)", "VAT charged", "IRS withheld", "Relevant income", "Monthly base", "Estimated monthly contribution", "Declare by"],
      sheetC: ["NIF", "Name", "NIF valid", "Receipts", "Base (no VAT)", "VAT", "IRS withheld"],
      sheetP: ["Issue", "File", "Receipt", "NIF", "Name", "Detail"],
      totalRow: "Total",
      estimateNote: "Estimate only, not a Segurança Social figure. Worker rate 21.4% for " + RULES.year + ". Confirm before you file.",
      issue: { dup: "Duplicate", nif: "Invalid NIF", cancelled: "Cancelled", mismatch: "Base + VAT", amount: "Amount", "no-date": "No date", "too-big": "File too large", credit: "Credit note", isolado: "Occasional", paired: "Invoice already received" },
      detail: {
        dup: "Same series, number, year, client NIF and amount. This copy was left out. A/1 in another year is kept.",
        nif: "The NIF does not pass the check digit.",
        "nif-prefix": "The check digit passes, but the first digits are not a known Portuguese NIF type.",
        "nif-digits": "The NIF does not have 9 digits.",
        "nif-missing": "The client NIF is missing.",
        cancelled: "Cancelled receipt. Left out of the totals.",
        credit: "Credit note. The amount was subtracted.",
        isolado: "Occasional transaction (ato isolado). Listed apart and left out of the quarterly totals.",
        paired: "Invoice left out. The same income is already counted on the receipt, at the receipt date (FAQ question 18: declare the way you declare for income tax).",
        mismatch: "Base plus VAT does not match the total (nor base plus VAT minus withholding). Difference over €0.01.",
        amount: "The base could not be read as a number, so the row was left out of the sums.",
        "no-date": "No date, so the row was left out of the quarter and of the yearly VAT total.",
        "too-big": "Skipped. Files over 15 MB are not read in the browser."
      },
      qName: ["Q1", "Q2", "Q3", "Q4"],
      qMonths: ["Jan–Mar", "Apr–Jun", "Jul–Sep", "Oct–Dec"],
      contribMonths: ["April, May and June", "July, August and September", "October, November and December", "January, February and March"],
      declare: "File the quarterly declaration by {date}. Saturday, Sunday and Portuguese national holidays move to the next business day (FAQ question 14).",
      toType: "Amount to type (no VAT)",
      relevant: "Relevant income, coefficient {coef}",
      adjusted: "Relevant income after the {pct}% option",
      monthly: "Monthly base (1/3)",
      pay: "Estimated monthly contribution",
      payNote: "For {months}. Each month is paid between the 10th and the 20th of the following month.",
      floor: "The calculated contribution was under €20, so the estimate uses the €20 floor for this regime.",
      zeroFloor: "No income in this quarter: the FAQ sets the contribution at €20 a month until the next declaration.",
      cap: "The monthly base is capped at 12 × IAS ({max}).",
      exempt: "Monthly relevant income is under 4 × IAS ({four}). If you also have a job, the other pay is at least 1 × IAS, and the other conditions on the Segurança Social FAQ hold, this quarter may be exempt. If they do not, the estimate without that exemption is the amount above.",
      under5: "The remainder after 4 × IAS produced a contribution under €5, so the FAQ says it does not count.",
      ivaWithin: "At or under €15,000. On these figures the article 53 exemption would still be available next year, if the other conditions hold.",
      ivaYear: "Over €15,000, and not over €18,750. The exemption can last until 31 December. From 1 January it ends, and the change declaration is due within 15 business days of the last day of the year.",
      ivaNow: "Over €18,750 (the €15,000 line exceeded by more than 25%). The exemption ends when that happens. Tax is due from that moment, and the change declaration is due within 15 business days.",
      ivaLead: "Year {year}, from the bases in this page (no VAT): {amount}. This is not the full legal turnover. The article 53 turnover also includes some exempt supplies, and it excludes others. See the sources below.",
      activityServices: "70% for services",
      activityGoods: "20% for goods",
      activityHosp: "20% for hotels and restaurants",
      firstYear: "Exempt in the first year",
      nothingToPay: "Nothing to pay",
      straddle: "This quarter crosses the start of enrolment. Use months to split it.",
      inProgress: "This quarter is still open. The total can still change.",
      iasWarning: "A year after 2026 still uses the 2026 IAS, until the new order is published.",
      ivaCharged: "These documents charged VAT, so the article 53 exemption is not the regime of this file. The bar is only the sum of the bases. It is not a statement that the exemption applies.",
      readFail: "That file could not be read. Use a CSV, an Excel file (.xlsx or .xls), or the HTML table some portals save as .xls. If the columns are not recognised, map them below.",
      mapIgnore: "Ignore",
      mapApply: "Apply columns",
      mapLegend: "Columns in {file}",
      statusFile: "{n} receipts in the totals. {p} issues.",
      statusManual: "Simulator for {year}.",
      col: { data: "Date", numero: "Receipt number", nif: "Client NIF", nome: "Client name", base: "Base (no VAT)", iva: "VAT", retencao: "IRS withheld", estado: "Status", total: "Total", tipo: "Document type", referencia: "Reference" }
    },
    pt: {
      proNote: "Pro em breve. Ainda não está disponível e este botão não cobra nada.",
      sampleFail: "Não foi possível carregar o exemplo. Verifique a ligação e tente de novo.",
      readFail: "Não foi possível ler este ficheiro. Serve um CSV, um Excel (.xlsx ou .xls) ou a tabela HTML que alguns portais gravam como .xls. Se as colunas não forem reconhecidas, associe-as em baixo.",
      tooBig: "Ignorado. Ficheiros acima de 15 MB não são lidos no browser.",
      noneParsed: "Estes ficheiros não parecem uma tabela de recibos. Exporte com “Exportar tabela” ou associe as colunas em baixo.",
      needMap: "Não reconheci os nomes das colunas. Diga o que é cada uma e aplique.",
      limit: "A versão grátis lê {max} ficheiros de cada vez. Encontrámos {n}, por isso só os {max} primeiros foram usados.",
      emptyManual: "Escreva um rendimento trimestral ou mensal. Uma caixa vazia salta esse período. 0 quer dizer que não houve rendimento.",
      previewCap: "A mostrar as primeiras {max} de {n} linhas. O Excel traz todas.",
      noClients: "No simulador não há clientes. A retenção que escrever é o total do trimestre, não a divisão por cliente.",
      simRow: "Simulador",
      noneIssue: "Nenhum",
      docs: "Recibos",
      base: "Base (sem IVA)",
      iva: "IVA liquidado",
      ret: "IRS retido",
      problems: "Problemas",
      validYes: "Sim",
      validNo: "Não",
      sheetR: ["Data", "Recibo", "NIF adquirente", "Nome", "NIF válido", "Base (sem IVA)", "IVA", "Retenção IRS", "Estado", "Trimestre", "Ficheiro"],
      sheetQ: ["Trimestre", "Recibos", "Base a declarar (sem IVA)", "IVA liquidado", "Retenção IRS", "Rendimento relevante", "Base mensal", "Contribuição mensal estimada", "Entregar até"],
      sheetC: ["NIF", "Nome", "NIF válido", "Recibos", "Base (sem IVA)", "IVA", "Retenção IRS"],
      sheetP: ["Problema", "Ficheiro", "Recibo", "NIF", "Nome", "Detalhe"],
      totalRow: "Total",
      estimateNote: "Estimativa, não é um valor da Segurança Social. Taxa de 21,4% dos trabalhadores independentes em " + RULES.year + ". Confirme antes de entregar.",
      issue: { dup: "Duplicado", nif: "NIF inválido", cancelled: "Anulado", mismatch: "Base + IVA", amount: "Valor", "no-date": "Sem data", "too-big": "Ficheiro grande", credit: "Nota de crédito", isolado: "Ato isolado", paired: "Fatura já recebida" },
      detail: {
        dup: "Mesma série, número, ano, NIF e valor. Esta cópia ficou de fora. Um A/1 de outro ano mantém-se.",
        nif: "O NIF não passa no dígito de controlo.",
        "nif-prefix": "O dígito de controlo bate certo, mas os primeiros dígitos não são um tipo de NIF português conhecido.",
        "nif-digits": "O NIF não tem 9 dígitos.",
        "nif-missing": "Falta o NIF do adquirente.",
        cancelled: "Recibo anulado. Ficou de fora dos totais.",
        credit: "Nota de crédito. O valor foi subtraído.",
        isolado: "Ato isolado. Fica numa lista à parte e fora dos totais do trimestre.",
        paired: "Fatura deixada de fora. O mesmo rendimento já conta no recibo, na data do recibo (FAQ, pergunta 18: declara-se como no IRS, e nestes recibos isso é o momento do recebimento).",
        mismatch: "A base mais o IVA não batem certo com o total (nem a base mais o IVA menos a retenção). Diferença acima de 0,01 €.",
        amount: "A base não foi lida como número, por isso a linha ficou de fora das somas.",
        "no-date": "Sem data, por isso a linha ficou de fora do trimestre e do total anual de IVA.",
        "too-big": "Ignorado. Ficheiros acima de 15 MB não são lidos no browser."
      },
      qName: ["1.º trimestre", "2.º trimestre", "3.º trimestre", "4.º trimestre"],
      qMonths: ["jan–mar", "abr–jun", "jul–set", "out–dez"],
      contribMonths: ["abril, maio e junho", "julho, agosto e setembro", "outubro, novembro e dezembro", "janeiro, fevereiro e março"],
      declare: "Entregar a declaração trimestral até {date}. Sábado, domingo e feriado nacional passam para o dia útil seguinte (FAQ, pergunta 14).",
      toType: "Valor a escrever (sem IVA)",
      relevant: "Rendimento relevante, coeficiente {coef}",
      adjusted: "Rendimento relevante com a opção de {pct}%",
      monthly: "Base mensal (1/3)",
      pay: "Contribuição mensal estimada",
      payNote: "Para {months}. O pagamento de cada mês é entre o dia 10 e o dia 20 do mês seguinte.",
      floor: "A contribuição calculada ficava abaixo de 20 €, por isso a estimativa usa o mínimo de 20 € deste regime.",
      zeroFloor: "Sem rendimento neste trimestre: o FAQ fixa a contribuição em 20 € por mês até à declaração seguinte.",
      cap: "A base mensal fica no teto de 12 × IAS ({max}).",
      exempt: "O rendimento relevante mensal fica abaixo de 4 × IAS ({four}). Se também tem trabalho por conta de outrem, o ordenado é pelo menos 1 × IAS e se verificam as outras condições do FAQ da Segurança Social, este trimestre pode estar isento. Se não se verificarem, a estimativa sem essa isenção é o valor acima.",
      under5: "O remanescente depois de 4 × IAS dava uma contribuição abaixo de 5 €. O FAQ diz que esse valor não releva.",
      ivaWithin: "Até 15 000 €, inclusive. Com estes valores, a isenção do artigo 53.º ainda caberia no ano seguinte, se as outras condições se mantiverem.",
      ivaYear: "Acima de 15 000 € e sem ultrapassar 18 750 €. A isenção pode manter-se até 31 de dezembro. A partir de 1 de janeiro deixa de se aplicar, e a declaração de alterações entrega-se nos 15 dias úteis a seguir ao último dia do ano.",
      ivaNow: "Acima de 18 750 € (o limiar de 15 000 € excedido em mais de 25%). A isenção cessa nesse momento. O imposto é devido a partir daí, e a declaração de alterações entrega-se nos 15 dias úteis seguintes.",
      ivaLead: "Ano {year}, com as bases desta página (sem IVA): {amount}. Não é o volume de negócios legal completo. O artigo 53.º inclui algumas operações isentas e exclui outras. Veja as fontes em baixo.",
      activityServices: "70% nos serviços",
      activityGoods: "20% nos bens",
      activityHosp: "20% na hotelaria e restauração",
      firstYear: "Isento no 1.º ano",
      nothingToPay: "Nada a pagar",
      straddle: "Este trimestre atravessa o início do enquadramento. Use os meses para o separar.",
      inProgress: "Trimestre em curso. O total ainda pode mudar.",
      iasWarning: "Um ano depois de 2026 usa o IAS de 2026, até sair a portaria do IAS novo.",
      ivaCharged: "Estes documentos liquidaram IVA, por isso o regime do artigo 53.º não é o deste ficheiro. A barra é só a soma das bases. Não diz que a isenção se aplica.",
      readFail: "Não foi possível ler este ficheiro. Serve um CSV, um Excel (.xlsx ou .xls) ou a tabela HTML que alguns portais gravam como .xls. Se as colunas não forem reconhecidas, associe-as em baixo.",
      mapIgnore: "Ignorar",
      mapApply: "Aplicar colunas",
      mapLegend: "Colunas em {file}",
      statusFile: "{n} recibos nos totais. {p} problemas.",
      statusManual: "Simulador de {year}.",
      col: { data: "Data", numero: "N.º do recibo", nif: "NIF do adquirente", nome: "Nome do adquirente", base: "Valor base (sem IVA)", iva: "IVA", retencao: "Retenção de IRS", estado: "Estado", total: "Valor total", tipo: "Tipo de documento", referencia: "Referência" }
    }
  };
  var t = STR[lang];

  var ALIASES = {
    data: ["data de emissao", "data emissao", "data do recibo", "data recibo", "data documento", "data do documento", "data"],
    numero: ["n recibo", "no recibo", "nr recibo", "num recibo", "numero do recibo", "numero recibo", "n do recibo", "numero de recibo", "n documento", "numero documento", "numero do documento", "recibo", "numero"],
    nif: ["nif adquirente", "nif do adquirente", "nipc adquirente", "nif cliente", "nif do cliente", "contribuinte adquirente", "nif", "nipc"],
    nome: ["nome adquirente", "nome do adquirente", "designacao adquirente", "adquirente", "nome do cliente", "cliente", "nome"],
    base: ["valor base", "base tributavel", "valor da base", "incidencia", "valor sem iva", "valor iliquido", "rendimento iliquido", "valor tributavel", "base"],
    iva: ["valor do iva", "valor iva", "iva liquidado", "total iva", "iva"],
    retencao: ["retencao irs", "retencao na fonte", "irs retido", "valor da retencao", "valor retido", "retencao", "irs"],
    estado: ["situacao do recibo", "estado do recibo", "situacao", "estado", "anulado"],
    total: ["valor total do documento", "valor total", "total do documento", "valor a receber", "importancia", "montante", "total"],
    tipo: ["tipo de documento", "tipo documento", "tipo de recibo", "natureza do documento", "natureza", "tipo"],
    referencia: ["referencia do documento", "documento de origem", "fatura de origem", "n fatura origem", "referencia", "ref"]
  };
  var MAP_FIELDS = ["data", "numero", "nif", "nome", "base", "iva", "retencao", "estado", "total", "tipo", "referencia"];

  function $(id) { return document.getElementById(id); }

  function normKey(s) {
    return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  function aliasScore(header, alias) {
    if (!header || !alias) return 0;
    if (header === alias) return 1000 + alias.length;
    if (header.indexOf(alias + " ") === 0) return 700 + alias.length;
    if (alias.indexOf(header + " ") === 0 && header.length >= 4) return 500 + header.length;
    if (alias.length >= 3 && (" " + header + " ").indexOf(" " + alias + " ") !== -1) return 400 + alias.length;
    return 0;
  }

  function mapColumns(cells) {
    var headers = cells.map(normKey);
    var candidates = [];
    headers.forEach(function (header, index) {
      if (!header) return;
      Object.keys(ALIASES).forEach(function (field) {
        ALIASES[field].forEach(function (alias) {
          var score = aliasScore(header, alias);
          if (score) candidates.push({ field: field, index: index, score: score });
        });
      });
    });
    candidates.sort(function (a, b) { return b.score - a.score; });
    var map = {};
    var used = {};
    candidates.forEach(function (c) {
      if (map[c.field] != null || used[c.index]) return;
      map[c.field] = c.index;
      used[c.index] = true;
    });
    return map;
  }

  function mapConfident(map) {
    if (!map) return false;
    var hasMoney = map.base != null || (map.total != null && map.iva != null);
    var hasId = map.data != null || map.numero != null;
    return hasMoney && hasId;
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
    var n = 0, inQ = false;
    for (var i = 0; i < line.length; i++) {
      var c = line[i];
      if (c === '"') {
        if (inQ && line[i + 1] === '"') { i++; continue; }
        inQ = !inQ;
      } else if (!inQ && c === delim) n++;
    }
    return n;
  }

  function detectDelim(text) {
    var lines = text.split(/\r?\n/).filter(function (l) { return l.trim() && !/^sep=.$/i.test(l.trim()); }).slice(0, 25);
    var best = ";", bestScore = -1;
    [";", ",", "\t", "|"].forEach(function (d) {
      var counts = lines.map(function (l) { return countDelim(l, d); }).filter(function (c) { return c > 0; });
      if (!counts.length) return;
      counts.sort(function (a, b) { return a - b; });
      var mode = counts[Math.floor(counts.length / 2)];
      var consistent = counts.filter(function (c) { return c === mode; }).length;
      var score = mode * 100 + consistent + (d === ";" ? 0.5 : 0);
      if (score > bestScore) { best = d; bestScore = score; }
    });
    return best;
  }

  function parseCsv(text, delim) {
    var rows = [], row = [], cur = "", inQ = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (inQ) {
        if (c === '"') {
          if (text[i + 1] === '"') { cur += '"'; i++; }
          else inQ = false;
        } else cur += c;
      } else if (c === '"') inQ = true;
      else if (c === delim) { row.push(cur); cur = ""; }
      else if (c === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; }
      else if (c !== "\r") cur += c;
    }
    if (cur.length || row.length) { row.push(cur); rows.push(row); }
    return rows.filter(function (r) { return r.some(function (cell) { return String(cell).trim() !== ""; }); });
  }

  function parseMoneyCents(raw) {
    if (raw == null || raw === "") return null;
    if (typeof raw === "number" && isFinite(raw)) return Math.round(raw * 100);
    var s = String(raw).replace(/\u00a0/g, " ").trim();
    if (!s || s === "-" || s === "—" || s === "–") return null;
    var neg = false;
    if (/^\(.*\)$/.test(s)) { neg = true; s = s.slice(1, -1).trim(); }
    s = s.replace(/[^\d,.\-]/g, "");
    if (!s || s === "-" || s === "." || s === ",") return null;
    if (s.charAt(0) === "-") { neg = !neg; s = s.slice(1); }
    s = s.replace(/-/g, "");
    if (!s) return null;
    var hasC = s.indexOf(",") !== -1, hasD = s.indexOf(".") !== -1;
    if (hasC && hasD) {
      if (s.lastIndexOf(",") > s.lastIndexOf(".")) s = s.replace(/\./g, "").replace(",", ".");
      else s = s.replace(/,/g, "");
    } else if (hasC) s = s.replace(/\./g, "").replace(",", ".");
    else if (hasD && /^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
    var n = Number(s);
    if (!isFinite(n)) return null;
    return Math.round((neg ? -n : n) * 100);
  }

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function parseDate(raw) {
    if (raw instanceof Date && !isNaN(raw.getTime())) {
      return raw.getFullYear() + "-" + pad(raw.getMonth() + 1) + "-" + pad(raw.getDate());
    }
    if (typeof raw === "number" && raw > 20000 && raw < 80000) {
      var utc = new Date(Date.UTC(1899, 11, 30) + Math.round(raw) * 86400000);
      return utc.getUTCFullYear() + "-" + pad(utc.getUTCMonth() + 1) + "-" + pad(utc.getUTCDate());
    }
    var s = String(raw || "").trim();
    var m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return m[1] + "-" + m[2] + "-" + m[3];
    m = s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})/);
    if (!m) return "";
    var y = m[3];
    if (y.length === 2) y = (Number(y) > 50 ? "19" : "20") + y;
    return y + "-" + pad(Number(m[2])) + "-" + pad(Number(m[1]));
  }

  function cell(row, map, field) {
    var i = map[field];
    if (i == null || i >= row.length) return "";
    return row[i] == null ? "" : row[i];
  }

  function cellText(row, map, field) {
    var v = cell(row, map, field);
    if (v instanceof Date) return parseDate(v);
    return String(v).trim();
  }

  function isCancelled(status) {
    var key = normKey(status);
    return key.indexOf("anulad") !== -1 || key.indexOf("cancel") !== -1;
  }

  function findTable(rows) {
    var best = -1, bestScore = 0, bestMap = null;
    var limit = Math.min(rows.length, 30);
    for (var i = 0; i < limit; i++) {
      var map = mapColumns(rows[i]);
      var score = Object.keys(map).length;
      if (!mapConfident(map)) score = 0;
      if (score > bestScore) { bestScore = score; best = i; bestMap = map; }
    }
    if (best < 0) return { headerIndex: 0, map: mapColumns(rows[0] || []), confident: false };
    return { headerIndex: best, map: bestMap, confident: true };
  }

  function matrixFromCsv(text) {
    var cleaned = String(text || "").replace(/^\uFEFF/, "");
    var lines = cleaned.split(/\r?\n/).filter(function (l) { return !/^sep=.$/i.test(l.trim()); });
    return parseCsv(lines.join("\n"), detectDelim(lines.join("\n")));
  }

  function matrixFromHtml(text) {
    if (typeof DOMParser === "undefined") return [];
    var doc = new DOMParser().parseFromString(String(text || ""), "text/html");
    var best = [];
    var tables = doc.querySelectorAll("table");
    for (var i = 0; i < tables.length; i++) {
      var rows = [];
      var trs = tables[i].querySelectorAll("tr");
      for (var r = 0; r < trs.length; r++) {
        var cells = [];
        var tds = trs[r].querySelectorAll("th,td");
        for (var c = 0; c < tds.length; c++) cells.push(String(tds[c].textContent || "").replace(/\s+/g, " ").trim());
        if (cells.some(function (cell) { return cell; })) rows.push(cells);
      }
      if (rows.length > best.length) best = rows;
    }
    return best;
  }

  function matrixFromXlsx(bytes) {
    if (typeof XLSX === "undefined" || !XLSX.read) return [];
    var wb = XLSX.read(bytes, { type: "array", cellDates: true });
    var best = [];
    wb.SheetNames.forEach(function (name) {
      var rows = XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1, raw: true, defval: "", blankrows: false });
      if (rows.length > best.length) best = rows;
    });
    return best;
  }

  function normNumero(s) {
    return String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  }

  function docKind(tipo) {
    var key = normKey(tipo);
    if (!key) return "unknown";
    if (key.indexOf("ato isolado") !== -1 || key.indexOf("acto isolado") !== -1) return "isolado";
    if (key.indexOf("nota de credito") !== -1 || key === "nc") return "credit";
    if (key.indexOf("nota de debito") !== -1 || key === "nd") return "debit";
    if (key.indexOf("fatura recibo") !== -1 || key.indexOf("factura recibo") !== -1 || key === "fr") return "fatura-recibo";
    if ((key.indexOf("recibo") !== -1) && key.indexOf("fatura") === -1 && key.indexOf("factura") === -1) return "recibo";
    if (key.indexOf("fatura") !== -1 || key.indexOf("factura") !== -1 || key === "ft") return "fatura";
    return "other";
  }

  function normRef(s) {
    return String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  }

  function quarterOf(iso) {
    if (!iso || iso.length < 7) return null;
    var month = Number(iso.slice(5, 7));
    if (!month || month < 1 || month > 12) return null;
    return { year: Number(iso.slice(0, 4)), q: Math.floor((month - 1) / 3) + 1, key: iso.slice(0, 4) + "-T" + (Math.floor((month - 1) / 3) + 1) };
  }

  function buildReceipts(matrix, map, headerIndex, filename) {
    var out = [];
    var problems = [];
    var data = matrix.slice(headerIndex + 1);
    data.forEach(function (cells) {
      if (!cells || !cells.some(function (c) { return String(c == null ? "" : c).trim() !== ""; })) return;
      if (normKey(cells[0]) === "total" || normKey(cells[0]) === "totais") return;
      var status = cellText(cells, map, "estado");
      var numero = cellText(cells, map, "numero");
      var tipo = cellText(cells, map, "tipo");
      var referencia = cellText(cells, map, "referencia");
      var kind = docKind(tipo);
      var nome = cellText(cells, map, "nome");
      var nifInfo = RV.checkNif(cellText(cells, map, "nif"));
      var date = parseDate(cell(cells, map, "data"));
      var baseRaw = cell(cells, map, "base");
      var baseC = parseMoneyCents(baseRaw);
      var ivaC = parseMoneyCents(cell(cells, map, "iva"));
      var retC = parseMoneyCents(cell(cells, map, "retencao"));
      var totalC = parseMoneyCents(cell(cells, map, "total"));
      if (baseC == null && totalC != null && ivaC != null) {
        var derived = totalC - ivaC;
        if (derived >= 0) baseC = derived;
      }
      var blank = !numero && !nome && !nifInfo.nif && !date && baseC == null && totalC == null;
      if (blank) return;
      var amountBad = String(baseRaw == null ? "" : baseRaw).trim() !== "" && baseC == null && !(totalC != null && ivaC != null);
      if (kind === "credit") {
        if (baseC != null && baseC > 0) baseC = -baseC;
        if (ivaC != null && ivaC > 0) ivaC = -ivaC;
        if (retC != null && retC > 0) retC = -retC;
        if (totalC != null && totalC > 0) totalC = -totalC;
      }
      var mismatch = false;
      if (baseC != null && ivaC != null && totalC != null) {
        var gross = Math.abs((baseC + ivaC) - totalC) <= 1;
        var net = retC != null && Math.abs((baseC + ivaC - retC) - totalC) <= 1;
        mismatch = !gross && !net;
      }
      out.push({
        date: date,
        quarter: quarterOf(date),
        numero: numero,
        tipo: tipo,
        referencia: referencia,
        kind: kind,
        isolado: kind === "isolado",
        nome: nome,
        nif: nifInfo.nif,
        nifValid: nifInfo.valid,
        nifReason: nifInfo.reason,
        baseC: baseC,
        ivaC: ivaC,
        retC: retC,
        totalC: totalC,
        status: status,
        cancelled: isCancelled(status),
        amountBad: amountBad,
        mismatch: mismatch,
        file: filename
      });
    });
    return { rows: out, problems: problems };
  }

  function rowProblems(row) {
    var list = [];
    if (row.cancelled) list.push({ code: "cancelled", detail: "cancelled" });
    if (row.kind === "credit") list.push({ code: "credit", detail: "credit" });
    if (row.isolado) list.push({ code: "isolado", detail: "isolado" });
    if (row.pairedAway) list.push({ code: "paired", detail: "paired" });
    if (!row.nifValid && (row.nif || row.nome)) list.push({ code: "nif", detail: row.nifReason || "nif" });
    if (row.mismatch) list.push({ code: "mismatch", detail: "mismatch" });
    if (row.amountBad) list.push({ code: "amount", detail: "amount" });
    if (!row.date && !row.cancelled) list.push({ code: "no-date", detail: "no-date" });
    return list;
  }

  function countsInTotals(row, opts) {
    if (row.cancelled || row.amountBad || row.isolado || row.pairedAway || !row.date || row.baseC == null) return false;
    if (opts && opts.startDate && !RV.dateInForce(row.date, opts.startDate)) return false;
    return true;
  }

  function dupKey(row) {
    var s = String(row.numero || "").trim().toUpperCase();
    var series = "";
    var number = "";
    var m = s.match(/^([A-Z]+)\s*[-/]\s*(?:(20\d{2})\s*[-/]\s*)?(\d+)$/);
    if (m) { series = m[1]; number = String(Number(m[3])); }
    else {
      m = s.match(/^([A-Z]+)\s+(\d+)$/);
      if (m) { series = m[1]; number = String(Number(m[2])); }
      else number = s.replace(/[^A-Z0-9]/g, "");
    }
    if (!number) return "";
    var year = row.date ? row.date.slice(0, 4) : "";
    var amount = row.baseC == null ? "" : String(row.baseC);
    return [series, number, year, row.nif || "", amount].join("|");
  }

  /* A fatura and a later recibo for the same income count once.
     FAQ Q18: declare as you declare for IRS. For these receipts that moment
     is payment, so the recibo (or fatura-recibo) is kept and the fatura whose
     number is in Referência is left out. */
  function pairDocuments(rows) {
    var faturas = [];
    rows.forEach(function (row) {
      if (row.kind === "fatura" && !row.cancelled) faturas.push(row);
    });
    rows.forEach(function (row) {
      if (row.kind !== "recibo") return;
      var ref = normRef(row.referencia);
      if (!ref) return;
      faturas.forEach(function (fat) {
        if (fat.pairedAway) return;
        if (fat.nif && row.nif && fat.nif !== row.nif) return;
        if (normRef(fat.numero) === ref) fat.pairedAway = true;
      });
    });
  }

  function mergeFiles(files) {
    var problems = [];
    var all = [];
    files.forEach(function (file) {
      if (file.tooBig) {
        problems.push({ code: "too-big", detail: "too-big", file: file.name, doc: "", nif: "", name: "" });
        return;
      }
      if (!file.matrix) return;
      buildReceipts(file.matrix, file.map, file.headerIndex, file.name).rows.forEach(function (row) { all.push(row); });
    });
    pairDocuments(all);
    var kept = Object.create(null);
    var order = [];
    all.forEach(function (row) {
      rowProblems(row).forEach(function (p) {
        problems.push({ code: p.code, detail: p.detail, file: row.file, doc: row.numero, nif: row.nif, name: row.nome });
      });
      if (row.cancelled || row.amountBad || row.pairedAway || row.isolado || !row.date) return;
      var key = dupKey(row);
      if (!key) key = "row|" + order.length + "|" + row.file;
      if (!kept[key]) {
        kept[key] = row;
        order.push(key);
        return;
      }
      problems.push({ code: "dup", detail: "dup", file: row.file, doc: row.numero, nif: row.nif, name: row.nome });
    });
    var receipts = order.map(function (k) { return kept[k]; });
    receipts.sort(function (a, b) {
      if (a.date !== b.date) return a.date < b.date ? -1 : 1;
      return String(a.numero).localeCompare(String(b.numero));
    });
    return { receipts: receipts, problems: problems, isolados: all.filter(function (row) { return row.isolado && !row.cancelled; }) };
  }

  function money(cents) {
    if (cents == null || !isFinite(cents)) return "";
    return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(cents / 100);
  }

  function showDate(iso) {
    if (!iso) return "";
    var p = iso.split("-");
    if (p.length < 3) return iso;
    return Number(p[2]) + "/" + Number(p[1]) + "/" + p[0];
  }

  function coefLabel(activity) {
    if (activity === "goods") return t.activityGoods;
    if (activity === "hospitality") return t.activityHosp;
    return t.activityServices;
  }

  function quarterLabel(year, q) {
    return t.qName[q - 1] + " " + year + " (" + t.qMonths[q - 1] + ")";
  }

  function optionsFromForm() {
    var activityEl = document.querySelector('input[name="activity"]:checked');
    var regimeEl = document.querySelector('input[name="regime"]:checked');
    var adjustEl = $("adjust");
    var startEl = $("start-date");
    return {
      activity: activityEl ? activityEl.value : "services",
      regime: regimeEl && regimeEl.value === "eni" ? "eni" : "ti",
      adjustmentPct: adjustEl ? Number(adjustEl.value) : 0,
      accumulate: !!($("accumulate") && $("accumulate").checked),
      startDate: startEl && startEl.value ? startEl.value : ""
    };
  }

  function quarterState(amount, exemptAmount, straddle) {
    if (straddle) return "straddle";
    if (amount === 0 && exemptAmount > 0) return "first-year";
    return "";
  }

  function modelFromReceipts(receipts, problems, opts, isolados) {
    var quarters = Object.create(null);
    var years = Object.create(null);
    var clients = Object.create(null);
    var clientOrder = [];
    receipts.forEach(function (row) {
      if (row.cancelled || row.amountBad || row.isolado || row.pairedAway || !row.date || row.baseC == null || !row.quarter) return;
      var inForce = !opts.startDate || RV.dateInForce(row.date, opts.startDate);
      var qk = row.quarter.key;
      if (!quarters[qk]) quarters[qk] = { year: row.quarter.year, q: row.quarter.q, key: qk, count: 0, amount: 0, exemptAmount: 0, iva: 0, ret: 0 };
      var q = quarters[qk];
      if (inForce) {
        q.count++;
        q.amount += row.baseC;
        if (row.retC != null) q.ret += row.retC;
      } else q.exemptAmount += row.baseC;
      if (row.ivaC != null) q.iva += row.ivaC;
      var yk = String(row.quarter.year);
      if (!years[yk]) years[yk] = { year: row.quarter.year, base: 0, iva: 0 };
      years[yk].base += row.baseC;
      if (row.ivaC != null) years[yk].iva += row.ivaC;
      if (!inForce) return;
      var ck = row.nif || ("name:" + normKey(row.nome));
      if (!clients[ck]) {
        clients[ck] = { nif: row.nif, nome: row.nome, valid: row.nifValid, n: 0, base: 0, iva: 0, ret: 0 };
        clientOrder.push(ck);
      }
      var c = clients[ck];
      c.n++;
      c.base += row.baseC;
      if (row.ivaC != null) c.iva += row.ivaC;
      if (row.retC != null) c.ret += row.retC;
      if (row.nome && row.nome.length > (c.nome || "").length) c.nome = row.nome;
      if (row.nifValid) c.valid = true;
    });
    var qList = Object.keys(quarters).map(function (k) { return quarters[k]; });
    qList.sort(function (a, b) { return a.key < b.key ? -1 : 1; });
    var yList = Object.keys(years).map(function (k) { return years[k]; });
    yList.sort(function (a, b) { return a.year - b.year; });
    var cList = clientOrder.map(function (k) { return clients[k]; });
    cList.sort(function (a, b) { return b.ret - a.ret || b.base - a.base; });
    qList.forEach(function (q) { q.phase = quarterState(q.amount, q.exemptAmount, false); });
    return {
      source: "file",
      receipts: receipts,
      problems: problems,
      isolados: isolados || [],
      quarters: qList,
      years: yList,
      clients: cList,
      options: opts
    };
  }

  function readManualAmount(id) {
    var el = $(id);
    if (!el) return null;
    var raw = String(el.value || "").trim();
    if (!raw) return null;
    return parseMoneyCents(raw);
  }

  function modelFromManual(opts) {
    var year = Number($("year") && $("year").value) || RULES.year;
    var grain = document.querySelector('input[name="grain"]:checked');
    var monthly = grain && grain.value === "month";
    var buckets = [0, 0, 0, 0];
    var seen = [false, false, false, false];
    var iva = [0, 0, 0, 0];
    var ret = [0, 0, 0, 0];
    var exemptBuckets = [0, 0, 0, 0];
    var straddles = [false, false, false, false];
    if (monthly) {
      for (var m = 1; m <= 12; m++) {
        var cents = readManualAmount("m" + m);
        if (cents == null) continue;
        var qi = Math.floor((m - 1) / 3);
        var monthIso = year + "-" + (m < 10 ? "0" : "") + m + "-01";
        if (opts.startDate && !RV.dateInForce(monthIso, opts.startDate)) exemptBuckets[qi] += cents;
        else buckets[qi] += cents;
        seen[qi] = true;
      }
    } else {
      for (var q = 1; q <= 4; q++) {
        var amount = readManualAmount("q" + q);
        if (amount == null) continue;
        buckets[q - 1] = amount;
        seen[q - 1] = true;
      }
    }
    for (var k = 1; k <= 4; k++) {
      var iv = readManualAmount("q" + k + "-iva");
      var rt = readManualAmount("q" + k + "-ret");
      if (iv != null) { iva[k - 1] = iv; seen[k - 1] = true; }
      if (rt != null) { ret[k - 1] = rt; seen[k - 1] = true; }
    }
    var quarters = [];
    var baseYear = 0;
    var ivaYear = 0;
    var any = false;
    for (var i = 0; i < 4; i++) {
      if (!seen[i]) continue;
      any = true;
      var phase = "";
      var amountNow = buckets[i];
      var exemptNow = exemptBuckets[i];
      if (!monthly && opts.startDate) {
        var startM = i * 3 + 1;
        var qStart = year + "-" + (startM < 10 ? "0" : "") + startM + "-01";
        var effect = RV.regimeStartDate(opts.startDate);
        var endIso = (function () {
          var d = new Date(Date.UTC(year, startM + 2, 0));
          return d.getUTCFullYear() + "-" + (d.getUTCMonth() < 9 ? "0" : "") + (d.getUTCMonth() + 1) + "-" + (d.getUTCDate() < 10 ? "0" : "") + d.getUTCDate();
        })();
        if (effect && endIso < effect) { exemptNow = amountNow; amountNow = 0; }
        else if (effect && qStart < effect && endIso >= effect) { straddles[i] = true; amountNow = 0; }
      }
      phase = straddles[i] ? "straddle" : quarterState(amountNow, exemptNow, false);
      quarters.push({ year: year, q: i + 1, key: year + "-T" + (i + 1), count: 1, amount: amountNow, exemptAmount: exemptNow, iva: iva[i], ret: ret[i], manual: true, phase: phase });
      baseYear += buckets[i] + exemptBuckets[i];
      ivaYear += iva[i];
    }
    return {
      source: "manual",
      empty: !any,
      receipts: [],
      problems: [],
      quarters: quarters,
      years: any ? [{ year: year, base: baseYear, iva: ivaYear }] : [],
      clients: [],
      options: opts
    };
  }

  function euros(cents) {
    if (cents == null) return "";
    return cents / 100;
  }

  function excelDate(iso) {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
    var p = iso.split("-").map(Number);
    return new Date(Date.UTC(p[0], p[1] - 1, p[2], 12, 0, 0));
  }

  function buildSheet(rows, numberCols, dateCols) {
    var ws = XLSX.utils.aoa_to_sheet(rows, { cellDates: true });
    var ref = ws["!ref"];
    if (!ref) return ws;
    var range = XLSX.utils.decode_range(ref);
    (numberCols || []).forEach(function (c) {
      for (var r = range.s.r + 1; r <= range.e.r; r++) {
        var addr = XLSX.utils.encode_cell({ r: r, c: c });
        if (ws[addr] && ws[addr].t === "n") ws[addr].z = "#,##0.00";
      }
    });
    (dateCols || []).forEach(function (c) {
      for (var r2 = range.s.r + 1; r2 <= range.e.r; r2++) {
        var addr2 = XLSX.utils.encode_cell({ r: r2, c: c });
        var cellV = ws[addr2];
        if (!cellV || cellV.v === "" || cellV.v == null) continue;
        cellV.t = "d";
        cellV.z = "dd/mm/yyyy";
      }
    });
    ws["!autofilter"] = { ref: ref };
    return ws;
  }

  function widths(ws, cols) {
    ws["!cols"] = cols.map(function (w) { return { wch: w }; });
  }

  function buildWorkbook(model) {
    var opts = model.options;
    var rRows = [t.sheetR];
    model.receipts.forEach(function (row) {
      if (row.cancelled || row.amountBad) return;
      rRows.push([
        excelDate(row.date), row.numero, row.nif, row.nome, row.nifValid ? t.validYes : t.validNo,
        euros(row.baseC), euros(row.ivaC), euros(row.retC), row.status,
        row.quarter ? row.quarter.key : "", row.file
      ]);
    });
    if (model.source === "manual") {
      model.quarters.forEach(function (q) {
        rRows.push(["", t.simRow, "", t.simRow, "", euros(q.amount), euros(q.iva), euros(q.ret), t.simRow, q.key, ""]);
      });
    }
    var qRows = [t.sheetQ];
    model.quarters.forEach(function (q) {
      var est = RV.estimateQuarter({ amountCents: q.amount, activity: opts.activity, adjustmentPct: opts.adjustmentPct, accumulate: opts.accumulate, regime: opts.regime, beforeRegime: q.phase === "first-year" });
      qRows.push([
        quarterLabel(q.year, q.q), q.count, euros(q.phase === "first-year" ? (q.exemptAmount || 0) : q.amount), euros(q.iva), euros(q.ret),
        euros(est.adjustedRelevantCents), euros(est.monthlyBaseCents), euros(est.contributionCents),
        excelDate(RV.quarterDeadline(q.year, q.q))
      ]);
    });
    qRows.push([t.estimateNote]);
    var cRows = [t.sheetC];
    if (!model.clients.length) cRows.push([t.noClients]);
    model.clients.forEach(function (c) {
      cRows.push([c.nif, c.nome, c.valid ? t.validYes : t.validNo, c.n, euros(c.base), euros(c.iva), euros(c.ret)]);
    });
    var pRows = [t.sheetP];
    if (!model.problems.length) pRows.push([t.noneIssue, "", "", "", "", ""]);
    model.problems.forEach(function (p) {
      pRows.push([t.issue[p.code] || p.code, p.file, p.doc, p.nif, p.name, t.detail[p.detail] || t.detail[p.code] || ""]);
    });
    var wb = XLSX.utils.book_new();
    var wsR = buildSheet(rRows, [5, 6, 7], [0]);
    widths(wsR, [12, 16, 14, 36, 12, 18, 12, 16, 14, 12, 28]);
    var wsQ = buildSheet(qRows, [2, 3, 4, 5, 6, 7], [8]);
    widths(wsQ, [28, 12, 26, 16, 16, 22, 16, 28, 14]);
    var wsC = buildSheet(cRows, [4, 5, 6]);
    widths(wsC, [14, 36, 12, 12, 18, 12, 16]);
    var wsP = buildSheet(pRows, []);
    widths(wsP, [18, 28, 16, 14, 36, 72]);
    XLSX.utils.book_append_sheet(wb, wsR, "Recibos");
    XLSX.utils.book_append_sheet(wb, wsQ, "Por trimestre");
    XLSX.utils.book_append_sheet(wb, wsC, "Por cliente");
    XLSX.utils.book_append_sheet(wb, wsP, "Problemas");
    return wb;
  }

  function icsEscape(s) {
    return String(s || "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  }

  function fold(line) {
    var out = "";
    var chunk = line;
    while (chunk.length > 73) {
      out += chunk.slice(0, 73) + "\r\n ";
      chunk = chunk.slice(73);
    }
    return out + chunk;
  }

  function buildIcs(model) {
    var years = {};
    model.quarters.forEach(function (q) { years[q.year] = true; });
    if (!Object.keys(years).length) years[RULES.year] = true;
    var events = [];
    Object.keys(years).forEach(function (ys) {
      var year = Number(ys);
      [1, 2, 3, 4].forEach(function (q) {
        var deadlineYear = q === 4 ? year + 1 : year;
        var when = RV.quarterDeadline(year, q);
        if (when < RV.todayIso()) return;
        var stamp = when.replace(/-/g, "");
        var endDate = new Date(Date.UTC(Number(stamp.slice(0, 4)), Number(stamp.slice(4, 6)) - 1, Number(stamp.slice(6, 8)) + 1));
        var end = endDate.getUTCFullYear() + pad(endDate.getUTCMonth() + 1) + pad(endDate.getUTCDate());
        var summary = lang === "pt"
          ? "Declaração trimestral Segurança Social — " + quarterLabel(year, q)
          : "Portugal quarterly Social Security declaration — " + quarterLabel(year, q);
        var desc = t.declare.replace("{date}", showDate(when));
        events.push([
          "BEGIN:VEVENT",
          "UID:netmend-rv-" + year + "-t" + q + "@netmend.app",
          "DTSTAMP:" + stamp + "T120000Z",
          "DTSTART;VALUE=DATE:" + stamp,
          "DTEND;VALUE=DATE:" + end,
          fold("SUMMARY:" + icsEscape(summary)),
          fold("DESCRIPTION:" + icsEscape(desc)),
          "BEGIN:VALARM",
          "TRIGGER:-P7D",
          "ACTION:DISPLAY",
          "DESCRIPTION:" + icsEscape(summary),
          "END:VALARM",
          "BEGIN:VALARM",
          "TRIGGER:-P1D",
          "ACTION:DISPLAY",
          "DESCRIPTION:" + icsEscape(summary),
          "END:VALARM",
          "END:VEVENT"
        ].join("\r\n"));
      });
    });
    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Netmend//Recibos verdes//" + (lang === "pt" ? "PT" : "EN"),
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      events.join("\r\n"),
      "END:VCALENDAR",
      ""
    ].join("\r\n");
  }

  function td(text, className, cents) {
    var el = document.createElement("td");
    if (className) el.className = className;
    el.textContent = text == null ? "" : String(text);
    if (cents != null) el.setAttribute("data-cents", String(cents));
    return el;
  }

  function clear(node) { while (node && node.firstChild) node.removeChild(node.firstChild); }

  function fillTable(body, rows, make) {
    clear(body);
    rows.forEach(function (row) { body.appendChild(make(row)); });
  }

  var current = null;

  function render(model) {
    current = model;
    var results = $("results");
    var reveal = results.hidden;
    var empty = $("empty-note");
    if (model.empty) {
      results.hidden = true;
      empty.hidden = false;
      empty.textContent = t.emptyManual;
      $("download").disabled = true;
      $("download-ics").disabled = true;
      return;
    }
    empty.hidden = true;
    results.hidden = false;
    $("download").disabled = false;
    $("download-ics").disabled = false;

    var base = 0, iva = 0, ret = 0, n = 0;
    model.quarters.forEach(function (q) {
      n += q.count;
      base += q.amount;
      iva += q.iva;
      ret += q.ret;
    });
    $("c-docs").textContent = String(model.source === "manual" ? model.quarters.length : n);
    $("c-docs-l").textContent = t.docs;
    $("c-base").textContent = money(base);
    $("c-base").setAttribute("data-cents", String(base));
    $("c-base-l").textContent = t.base;
    $("c-iva").textContent = money(iva);
    $("c-iva").setAttribute("data-cents", String(iva));
    $("c-iva-l").textContent = t.iva;
    $("c-ret").textContent = money(ret);
    $("c-ret").setAttribute("data-cents", String(ret));
    $("c-ret-l").textContent = t.ret;
    $("c-problems").textContent = String(model.problems.length);
    $("c-problems-l").textContent = t.problems;

    var cards = $("quarter-cards");
    clear(cards);
    var opts = model.options;
    model.quarters.forEach(function (q) {
      var est = RV.estimateQuarter({
        amountCents: q.amount,
        activity: opts.activity,
        adjustmentPct: opts.adjustmentPct,
        accumulate: opts.accumulate,
        regime: opts.regime,
        beforeRegime: q.phase === "first-year"
      });
      if (q.phase === "straddle") est = { headline: "straddle", contributionCents: 0, relevantCents: 0, adjustedRelevantCents: 0, monthlyBaseCents: 0, adjustmentPct: 0, adjustmentApplied: false, adjustmentIgnored: false, floor20: false, capped: false, exemptEmployed: false, ignoredUnder5: false, maxBaseCents: 0, fourIasCents: 0 };
      var card = document.createElement("article");
      card.className = "q-card";
      card.id = "q-" + q.key;
      card.setAttribute("data-quarter", q.key);
      var h = document.createElement("h3");
      h.textContent = quarterLabel(q.year, q.q);
      card.appendChild(h);
      function line(label, value, cents, field) {
        var p = document.createElement("p");
        var b = document.createElement("b");
        b.textContent = label;
        p.appendChild(b);
        p.appendChild(document.createTextNode(" "));
        var span = document.createElement("span");
        span.className = field === "contribution" ? "big" : "";
        span.textContent = value;
        if (cents != null) span.setAttribute("data-cents", String(cents));
        if (field) span.setAttribute("data-field", field);
        p.appendChild(span);
        card.appendChild(p);
      }
      var declareAmount = q.phase === "first-year" ? (q.exemptAmount || 0) : q.amount;
      line(t.toType, money(declareAmount), declareAmount, "declare");
      if (q.phase !== "straddle" && q.phase !== "first-year") {
        line(t.relevant.replace("{coef}", coefLabel(opts.activity)), money(est.relevantCents), est.relevantCents, "relevant");
        if (est.adjustmentApplied) line(t.adjusted.replace("{pct}", String(est.adjustmentPct)), money(est.adjustedRelevantCents), est.adjustedRelevantCents, "adjusted");
        line(t.monthly, money(est.monthlyBaseCents), est.monthlyBaseCents, "base");
      }
      var payText = money(est.contributionCents);
      if (est.headline === "first-year" || q.phase === "first-year") payText = t.firstYear;
      else if (est.headline === "exempt-employed") payText = t.nothingToPay;
      else if (q.phase === "straddle") payText = t.straddle;
      line(t.pay, payText, est.contributionCents, "contribution");
      var contribEl = card.querySelector("[data-field=contribution]");
      if (contribEl && (est.headline === "first-year" || est.headline === "exempt-employed" || q.phase === "straddle" || q.phase === "first-year")) {
        contribEl.setAttribute("data-headline", q.phase === "straddle" ? "straddle" : (est.headline || q.phase));
      }
      var note = document.createElement("p");
      note.textContent = t.payNote.replace("{months}", t.contribMonths[q.q - 1]);
      card.appendChild(note);
      var extra = document.createElement("p");
      var bits = [];
      if (est.floor20 && est.headline !== "exempt-employed" && est.headline !== "first-year") bits.push(q.amount === 0 ? t.zeroFloor : t.floor);
      if (est.capped) bits.push(t.cap.replace("{max}", money(est.maxBaseCents)));
      if (est.exemptEmployed) bits.push(t.exempt.replace("{four}", money(est.fourIasCents)));
      if (est.adjustmentIgnored) bits.push(lang === "pt" ? "A opção de ±25% não se aplica a quem contribui pelo remanescente acima de 4 × IAS (FAQ, pergunta 28)." : "The ±25% option does not apply when you pay on the remainder above 4 × IAS (FAQ question 28).");
      if (est.ignoredUnder5) bits.push(t.under5);
      if (RV.quarterContains(q.year, q.q, RV.todayIso())) bits.push(t.inProgress);
      if (q.year > RULES.year) bits.push(t.iasWarning);
      extra.textContent = bits.join(" ");
      if (bits.length) card.appendChild(extra);
      var due = document.createElement("p");
      due.textContent = t.declare.replace("{date}", showDate(RV.quarterDeadline(q.year, q.q)));
      card.appendChild(due);
      if (q.iva || q.ret) {
        var tax = document.createElement("p");
        tax.textContent = t.iva + ": " + money(q.iva) + " · " + t.ret + ": " + money(q.ret);
        card.appendChild(tax);
      }
      cards.appendChild(card);
    });

    var ivaHost = $("iva-panel");
    clear(ivaHost);
    model.years.forEach(function (y) {
      var pos = RV.ivaPosition(y.base);
      var wrap = document.createElement("div");
      wrap.setAttribute("data-year", String(y.year));
      var lead = document.createElement("p");
      lead.textContent = t.ivaLead.replace("{year}", String(y.year)).replace("{amount}", money(y.base));
      wrap.appendChild(lead);
      var meter = document.createElement("div");
      meter.className = "meter";
      meter.setAttribute("role", "meter");
      meter.setAttribute("aria-valuemin", "0");
      meter.setAttribute("aria-valuemax", String(pos.overrunCents / 100));
      meter.setAttribute("aria-valuenow", String(Math.round(pos.baseCents / 100)));
      meter.setAttribute("aria-label", lead.textContent);
      var fill = document.createElement("div");
      fill.className = "meter-fill";
      fill.style.width = Math.max(0, Math.min(100, pos.ratio * 100)) + "%";
      meter.appendChild(fill);
      var tick = document.createElement("span");
      tick.className = "tick limit";
      tick.textContent = money(pos.limitCents);
      meter.appendChild(tick);
      wrap.appendChild(meter);
      var state = document.createElement("p");
      state.setAttribute("data-field", "iva-state");
      state.textContent = y.iva > 0 ? t.ivaCharged : (pos.state === "over-now" ? t.ivaNow : pos.state === "over-year" ? t.ivaYear : t.ivaWithin);
      wrap.appendChild(state);
      var charged = document.createElement("p");
      charged.textContent = t.iva + ": " + money(y.iva);
      charged.setAttribute("data-cents", String(y.iva));
      wrap.appendChild(charged);
      ivaHost.appendChild(wrap);
    });

    var clients = model.clients.slice(0, PREVIEW_MAX);
    fillTable($("client-body"), clients, function (c) {
      var tr = document.createElement("tr");
      tr.appendChild(td(c.nif));
      tr.appendChild(td(c.nome));
      tr.appendChild(td(c.valid ? t.validYes : t.validNo));
      tr.appendChild(td(String(c.n), "num"));
      tr.appendChild(td(money(c.base), "num", c.base));
      tr.appendChild(td(money(c.iva), "num", c.iva));
      tr.appendChild(td(money(c.ret), "num", c.ret));
      return tr;
    });
    $("client-empty").hidden = model.clients.length > 0;
    $("client-empty").textContent = t.noClients;
    $("client-table").hidden = model.clients.length === 0;

    var shown = model.receipts.filter(function (row) { return countsInTotals(row, model.options); }).slice(0, PREVIEW_MAX);
    var totalRows = model.receipts.filter(function (row) { return countsInTotals(row, model.options); }).length;
    fillTable($("preview-body"), shown, function (row) {
      var tr = document.createElement("tr");
      tr.appendChild(td(showDate(row.date)));
      tr.appendChild(td(row.numero));
      tr.appendChild(td(row.nome));
      tr.appendChild(td(row.nif));
      tr.appendChild(td(money(row.baseC), "num", row.baseC));
      tr.appendChild(td(money(row.ivaC), "num", row.ivaC));
      tr.appendChild(td(money(row.retC), "num", row.retC));
      return tr;
    });
    var previewNote = $("preview-note");
    if (totalRows > PREVIEW_MAX) {
      previewNote.hidden = false;
      previewNote.textContent = t.previewCap.replace("{max}", String(PREVIEW_MAX)).replace("{n}", String(totalRows));
    } else previewNote.hidden = true;
    $("preview-table").hidden = model.source === "manual";

    var probShown = model.problems.slice(0, PREVIEW_MAX);
    fillTable($("problems-body"), probShown, function (p) {
      var tr = document.createElement("tr");
      tr.appendChild(td(t.issue[p.code] || p.code));
      tr.appendChild(td(p.doc));
      tr.appendChild(td(p.nif));
      tr.appendChild(td(p.name));
      tr.appendChild(td(t.detail[p.detail] || ""));
      return tr;
    });
    $("problems-table").hidden = model.problems.length === 0;

    var status = $("status");
    status.textContent = model.source === "manual"
      ? t.statusManual.replace("{year}", String(model.years[0] ? model.years[0].year : RULES.year))
      : t.statusFile.replace("{n}", String(totalRows)).replace("{p}", String(model.problems.length));
    if (reveal && results.scrollIntoView) results.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  var loaded = [];
  var mapOpen = false;

  function showError(msg) {
    var el = $("error");
    if (!msg) { el.hidden = true; el.textContent = ""; return; }
    el.hidden = false;
    el.textContent = msg;
  }

  function renderMap() {
    var host = $("map-panel");
    clear(host);
    var unsure = loaded.some(function (file) { return file.matrix && !mapConfident(file.map); });
    var toggle = $("map-open");
    if (toggle) toggle.hidden = !loaded.length || unsure;
    if (!loaded.length || (!unsure && !mapOpen)) { host.hidden = true; return; }
    host.hidden = false;
    loaded.forEach(function (file, fileIndex) {
      if (!file.matrix || !file.matrix.length) return;
      var fs = document.createElement("fieldset");
      fs.className = "plain";
      var legend = document.createElement("legend");
      legend.textContent = t.mapLegend.replace("{file}", file.name);
      fs.appendChild(legend);
      var headers = file.matrix[file.headerIndex] || [];
      var sample = file.matrix[file.headerIndex + 1] || [];
      headers.forEach(function (header, col) {
        var row = document.createElement("div");
        row.className = "choice";
        var id = "map-" + fileIndex + "-" + col;
        var label = document.createElement("label");
        label.setAttribute("for", id);
        label.textContent = String(header || ("#" + (col + 1))) + (sample[col] != null && String(sample[col]).trim() ? " — " + String(sample[col]).slice(0, 40) : "");
        var select = document.createElement("select");
        select.id = id;
        select.setAttribute("data-file", String(fileIndex));
        select.setAttribute("data-col", String(col));
        var blank = document.createElement("option");
        blank.value = "";
        blank.textContent = t.mapIgnore;
        select.appendChild(blank);
        MAP_FIELDS.forEach(function (field) {
          var opt = document.createElement("option");
          opt.value = field;
          opt.textContent = t.col[field];
          if (file.map[field] === col) opt.selected = true;
          select.appendChild(opt);
        });
        row.appendChild(label);
        row.appendChild(select);
        fs.appendChild(row);
      });
      host.appendChild(fs);
    });
    var apply = document.createElement("button");
    apply.type = "button";
    apply.className = "btn";
    apply.id = "map-apply";
    apply.textContent = t.mapApply;
    apply.addEventListener("click", function () {
      var selects = host.querySelectorAll("select");
      var next = loaded.map(function () { return {}; });
      var used = loaded.map(function () { return {}; });
      Array.prototype.forEach.call(selects, function (select) {
        var fi = Number(select.getAttribute("data-file"));
        var col = Number(select.getAttribute("data-col"));
        if (!select.value || used[fi][select.value]) return;
        next[fi][select.value] = col;
        used[fi][select.value] = true;
      });
      loaded.forEach(function (file, i) { file.map = next[i]; file.headerIndex = file.headerIndex || 0; });
      publishFiles();
    });
    host.appendChild(apply);
  }

  function publishFiles() {
    var unsure = loaded.some(function (file) { return file.matrix && !mapConfident(file.map); });
    if (unsure) mapOpen = true;
    renderMap();
    if (!loaded.length) {
      showError("");
      $("results").hidden = true;
      return;
    }
    if (unsure) {
      showError(t.needMap);
      $("results").hidden = true;
      $("download").disabled = true;
      $("download-ics").disabled = true;
      return;
    }
    showError("");
    var merged = mergeFiles(loaded);
    render(modelFromReceipts(merged.receipts, merged.problems, optionsFromForm(), merged.isolados));
  }

  function takeFiles(fileList) {
    var list = Array.prototype.slice.call(fileList || []);
    var note = $("limit-note");
    if (list.length > FREE_MAX) {
      note.hidden = false;
      note.textContent = t.limit.replace(/\{n\}/g, String(list.length)).replace(/\{max\}/g, String(FREE_MAX));
      list = list.slice(0, FREE_MAX);
    } else note.hidden = true;
    var readers = list.map(function (file) {
      return new Promise(function (resolve) {
        if (file.size > MAX_BYTES) {
          resolve({ name: file.name, tooBig: true, matrix: null, map: {}, headerIndex: 0 });
          return;
        }
        var reader = new FileReader();
        reader.onerror = function () { resolve({ name: file.name, error: true, matrix: null, map: {}, headerIndex: 0 }); };
        reader.onload = function () {
          try {
            var bytes = new Uint8Array(reader.result);
            var head = "";
            try { head = decodeBytes(bytes.subarray(0, 600)); } catch (err) { head = ""; }
            var html = /<\s*(html|table|meta|head)/i.test(head);
            var sheet = /\.xlsx?$/i.test(file.name) || /sheet|excel|officedocument/.test(file.type || "");
            var matrix;
            if (html) matrix = matrixFromHtml(decodeBytes(bytes));
            else if (sheet) matrix = matrixFromXlsx(bytes);
            else matrix = matrixFromCsv(decodeBytes(bytes));
            if (!matrix || !matrix.length) throw new Error("empty");
            var found = findTable(matrix);
            resolve({ name: file.name, matrix: matrix, map: found.map, headerIndex: found.headerIndex, confident: found.confident });
          } catch (e) {
            resolve({ name: file.name, error: true, matrix: null, map: {}, headerIndex: 0 });
          }
        };
        reader.readAsArrayBuffer(file);
      });
    });
    Promise.all(readers).then(function (files) {
      loaded = files.filter(function (f) { return !f.error; });
      var names = $("file-list");
      clear(names);
      files.forEach(function (f) {
        var li = document.createElement("li");
        li.textContent = f.name + (f.tooBig ? " — " + t.tooBig : f.error ? " — " + t.readFail : "");
        names.appendChild(li);
      });
      if (!loaded.length) {
        showError(t.noneParsed);
        $("results").hidden = true;
        return;
      }
      setMode("file");
      publishFiles();
    });
  }

  function setMode(mode) {
    var fileBtn = $("mode-file");
    var manBtn = $("mode-manual");
    fileBtn.setAttribute("aria-pressed", mode === "file" ? "true" : "false");
    manBtn.setAttribute("aria-pressed", mode === "manual" ? "true" : "false");
    $("panel-file").hidden = mode !== "file";
    $("panel-manual").hidden = mode !== "manual";
    if (mode === "manual") {
      render(modelFromManual(optionsFromForm()));
    } else if (loaded.length) {
      publishFiles();
    }
  }

  function wire() {
    var drop = $("drop");
    var input = $("file");
    input.addEventListener("change", function () {
      if (input.files && input.files.length) takeFiles(input.files);
    });
    ["dragenter", "dragover"].forEach(function (ev) {
      drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("on"); });
    });
    ["dragleave", "drop"].forEach(function (ev) {
      drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("on"); });
    });
    drop.addEventListener("drop", function (e) {
      if (e.dataTransfer && e.dataTransfer.files) takeFiles(e.dataTransfer.files);
    });
    $("example").addEventListener("click", function () {
      var url = $("example").getAttribute("data-sample");
      showError("");
      fetch(url).then(function (res) {
        if (!res.ok) throw new Error("sample");
        return res.arrayBuffer();
      }).then(function (buf) {
        var name = url.split("/").pop();
        var file = new File([buf], name, { type: "text/csv" });
        takeFiles([file]);
      }).catch(function () { showError(t.sampleFail); });
    });
    $("mode-file").addEventListener("click", function () { setMode("file"); });
    $("mode-manual").addEventListener("click", function () { setMode("manual"); });
    document.querySelectorAll('input[name="activity"], input[name="regime"], #adjust, #accumulate, input[name="grain"], #year, #start-date').forEach(function (el) {
      el.addEventListener("change", function () {
        if ($("mode-manual").getAttribute("aria-pressed") === "true") render(modelFromManual(optionsFromForm()));
        else if (current && current.source === "file") render(modelFromReceipts(current.receipts, current.problems, optionsFromForm(), current.isolados));
      });
    });
    document.querySelectorAll("#panel-manual input").forEach(function (el) {
      el.addEventListener("input", function () {
        if ($("mode-manual").getAttribute("aria-pressed") === "true") render(modelFromManual(optionsFromForm()));
      });
    });
    var monthBox = $("manual-month");
    var quarterBox = $("manual-quarter");
    function syncGrain() {
      var monthly = document.querySelector('input[name="grain"]:checked').value === "month";
      monthBox.hidden = !monthly;
      quarterBox.hidden = monthly;
    }
    document.querySelectorAll('input[name="grain"]').forEach(function (el) {
      el.addEventListener("change", syncGrain);
    });
    syncGrain();
    $("download").addEventListener("click", function () {
      if (!current || current.empty || typeof XLSX === "undefined") return;
      XLSX.writeFile(buildWorkbook(current), "recibos-verdes-netmend.xlsx", { cellDates: true });
    });
    $("download-ics").addEventListener("click", function () {
      if (!current || current.empty) return;
      var blob = new Blob([buildIcs(current)], { type: "text/calendar;charset=utf-8" });
      var a = document.createElement("a");
      var year = current.years.length ? current.years[current.years.length - 1].year : RULES.year;
      a.href = URL.createObjectURL(blob);
      a.download = "recibos-verdes-prazos-" + year + ".ics";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    });
    if ($("map-open")) $("map-open").addEventListener("click", function () {
      mapOpen = true;
      renderMap();
    });
    $("pro").addEventListener("click", function () {
      var note = $("pro-note");
      note.hidden = false;
      note.textContent = t.proNote;
    });
    $("download").disabled = true;
    $("download-ics").disabled = true;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
  else wire();
})();
