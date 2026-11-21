/* e-fatura CSV → Excel. Runs entirely in the browser.
   Handles the Portal das Finanças "Consultar faturas → Obter dados para Excel" export:
   semicolon (or sniffed) CSV, Portuguese decimals, Windows-1252 or UTF-8/UTF-16,
   NIF glued to the issuer name, positive credit notes, and amounts over 1 000
   written with a thousands dot. Headers vary (Setor/Sector, Situação/Estado).
   SheetJS community build 0.20.3 (Apache-2.0): assets/vendor/xlsx.LICENSE.txt
*/
(function () {
  "use strict";

  var FREE_MAX = 12;
  var PREVIEW_MAX = 200;
  var EFATURA_URL = "https://faturas.portaldasfinancas.gov.pt/";
  var lang = (document.documentElement.lang || "en").toLowerCase().indexOf("pt") === 0 ? "pt" : "en";

  var STR = {
    en: {
      docs: "Documents",
      total: "Net total",
      iva: "Total VAT",
      pending: "Pending",
      invalid: "Invalid NIFs",
      yes: "Yes",
      no: "No",
      noSector: "No sector",
      rows: "rows",
      dupChip: "duplicates removed",
      limit: "The free tool merges {max} files at a time. {n} files were found, so only the first {max} were used.",
      proNote: "Pro coming soon. It is not available yet, and this button does not take a payment.",
      sampleFail: "The example file could not be loaded. Check your connection and try again.",
      readFail: "That file could not be read.",
      noneParsed: "None of these files look like an e-fatura CSV. Export with “Obter dados para Excel” and drop the file as it is, without opening it in Excel first.",
      headerOnly: "This file has the e-fatura column names but no invoice rows.",
      empty: "No invoices left after removing cancelled documents.",
      previewCap: "Showing the first {max} of {n} invoices. The Excel file has every row.",
      pendTitle: "Pending or without a sector",
      pendLead: "These still need a sector on e-fatura. Until then they may not count for the deduction you expect.",
      pendLink: "Open e-fatura to classify them",
      nonePending: "No pending invoices in this file.",
      preview: "Invoices",
      sectors: "By sector",
      colDate: "Date",
      colIssuer: "Issuer",
      colNif: "NIF",
      colType: "Type",
      colSector: "Sector",
      colStatus: "Status",
      colTotal: "Total",
      colDocs: "Documents",
      filesLabel: "Files",
      truncated: "300 or more rows. The portal export stops at 300, so export a shorter period and merge the files.",
      sheetF: ["Date", "Month", "Issuer NIF", "Issuer name", "NIF valid", "Type", "Number", "ATCUD", "Sector", "Status", "Total", "Base (ex VAT)", "VAT", "Source file"],
      sheetS: ["Sector", "Documents", "Base (ex VAT)", "VAT", "Total"],
      sheetN: ["NIF", "Name", "NIF valid", "Documents", "Base (ex VAT)", "VAT", "Total"],
      sheetM: ["Month", "Documents", "Base (ex VAT)", "VAT", "Total"],
      sheetQ: ["Quarter", "Documents", "Base (ex VAT)", "VAT", "Total"],
      sheetP: ["Issue", "File", "Document", "NIF", "Name", "Detail"],
      totalRow: "Total",
      noneIssue: "None",
      issue: {
        dup: "Duplicate",
        credit: "Credit note",
        nif: "Invalid NIF",
        pending: "Pending",
        cancelled: "Cancelled",
        truncated: "Truncated export",
        amount: "Amount",
        mismatch: "Base + VAT",
        "too-big": "File too large"
      },
      detail: {
        dup: "Removed. The same issuer NIF and document number were already in the merge.",
        credit: "The credit note was positive in the export. The amount is now negative.",
        nif: "The NIF does not pass the check digit.",
        "nif-prefix": "The check digit passes, but the first digits are not a known Portuguese NIF type.",
        "nif-digits": "The NIF does not have 9 digits.",
        "nif-missing": "The issuer NIF is missing.",
        pending: "The status is pending. Classify it on e-fatura.",
        "no-sector": "The sector cell is empty. Classify it on e-fatura.",
        mismatch: "Base plus VAT does not equal the total (difference over €0.01).",
        cancelled: "Cancelled document. Left out of the totals.",
        truncated: "This file has 300 or more rows. The portal keeps only the latest 300 per export.",
        amount: "The total could not be read as a number, so it was left out of the sums.",
        "too-big": "Skipped. Files over 15 MB are not read in the browser."
      }
    },
    pt: {
      docs: "Documentos",
      total: "Total líquido",
      iva: "IVA total",
      pending: "Pendentes",
      invalid: "NIF inválidos",
      yes: "Sim",
      no: "Não",
      noSector: "Sem setor",
      rows: "linhas",
      dupChip: "duplicados removidos",
      limit: "A versão grátis junta {max} ficheiros de cada vez. Encontrámos {n}, por isso só os {max} primeiros foram usados.",
      proNote: "Pro em breve. Ainda não está disponível e este botão não cobra nada.",
      sampleFail: "Não foi possível carregar o exemplo. Verifique a ligação e tente de novo.",
      readFail: "Não foi possível ler esse ficheiro.",
      noneParsed: "Nenhum destes ficheiros parece um CSV do e-fatura. Exporte com “Obter dados para Excel” e arraste o ficheiro tal como vem, sem o abrir no Excel primeiro.",
      headerOnly: "Este ficheiro tem os cabeçalhos do e-fatura, mas não tem linhas de faturas.",
      empty: "Não restaram faturas depois de retirar os documentos anulados.",
      previewCap: "A mostrar as primeiras {max} de {n} faturas. O Excel traz todas.",
      pendTitle: "Pendentes ou sem setor",
      pendLead: "Ainda precisam de um setor no e-fatura. Enquanto estiverem assim, podem não contar para a dedução que espera.",
      pendLink: "Abrir o e-fatura para classificar",
      nonePending: "Não há faturas pendentes neste ficheiro.",
      preview: "Faturas",
      sectors: "Por setor",
      colDate: "Data",
      colIssuer: "Emitente",
      colNif: "NIF",
      colType: "Tipo",
      colSector: "Setor",
      colStatus: "Situação",
      colTotal: "Total",
      colDocs: "Documentos",
      filesLabel: "Ficheiros",
      truncated: "300 ou mais linhas. A exportação do portal para nas 300: exporte um período mais curto e junte os ficheiros.",
      sheetF: ["Data", "Mês", "NIF emitente", "Nome emitente", "NIF válido", "Tipo", "Número", "ATCUD", "Setor", "Situação", "Total", "Base (s/ IVA)", "IVA", "Ficheiro"],
      sheetS: ["Setor", "Documentos", "Base (s/ IVA)", "IVA", "Total"],
      sheetN: ["NIF", "Nome", "NIF válido", "Documentos", "Base (s/ IVA)", "IVA", "Total"],
      sheetM: ["Mês", "Documentos", "Base (s/ IVA)", "IVA", "Total"],
      sheetQ: ["Trimestre", "Documentos", "Base (s/ IVA)", "IVA", "Total"],
      sheetP: ["Problema", "Ficheiro", "Documento", "NIF", "Nome", "Detalhe"],
      totalRow: "Total",
      noneIssue: "Nenhum",
      issue: {
        dup: "Duplicado",
        credit: "Nota de crédito",
        nif: "NIF inválido",
        pending: "Pendente",
        cancelled: "Anulada",
        truncated: "Exportação cortada",
        amount: "Valor",
        mismatch: "Base + IVA",
        "too-big": "Ficheiro grande"
      },
      detail: {
        dup: "Removido. O mesmo NIF e o mesmo número de documento já estavam na junção.",
        credit: "A nota de crédito vinha com valor positivo. O valor ficou negativo.",
        nif: "O NIF não passa no dígito de controlo.",
        "nif-prefix": "O dígito de controlo bate certo, mas os primeiros dígitos não são um tipo de NIF português conhecido.",
        "nif-digits": "O NIF não tem 9 dígitos.",
        "nif-missing": "Falta o NIF do emitente.",
        pending: "A situação é pendente. Classifique no e-fatura.",
        "no-sector": "A célula do setor está vazia. Classifique no e-fatura.",
        mismatch: "A base mais o IVA não batem certo com o total (diferença acima de 0,01 €).",
        cancelled: "Documento anulado. Ficou de fora dos totais.",
        truncated: "Este ficheiro tem 300 ou mais linhas. O portal só guarda as 300 mais recentes em cada exportação.",
        amount: "O total não foi lido como número, por isso ficou de fora das somas.",
        "too-big": "Ignorado. Ficheiros acima de 15 MB não são lidos no browser."
      }
    }
  };
  var t = STR[lang];

  var ALIASES = {
    nif: ["nif emitente", "nif do emitente", "nif emissor", "nipc emitente", "nif nipc emitente", "contribuinte emitente", "nif", "nipc"],
    nome: ["nome emitente", "nome do emitente", "designacao social", "designacao do emitente", "designacao", "nome"],
    emitente: ["emitente", "entidade emitente", "identificacao do emitente", "comerciante", "fornecedor"],
    tipo: ["tipo de documento", "tipo documento", "tipo de fatura", "tipo fatura", "tipo"],
    numero: ["numero documento", "numero do documento", "n documento", "num documento", "nr documento", "no documento", "numero fatura", "numero da fatura", "n fatura", "identificacao unica do documento", "identificacao unica", "n fatura atcud", "numero"],
    atcud: ["atcud", "codigo unico do documento", "codigo unico"],
    data: ["data de emissao", "data emissao", "data do documento", "data de documento", "data fatura", "data"],
    total: ["valor total do documento", "valor total", "montante total", "total documento", "importancia", "total", "montante"],
    base: ["base tributavel", "valor base tributavel", "valor da base tributavel", "incidencia", "base"],
    iva: ["valor total do iva", "valor do iva", "valor iva", "total iva", "iva"],
    situacao: ["situacao da fatura", "situacao do documento", "situacao", "estado do documento", "estado"],
    setor: ["setor de atividade", "sector de actividade", "atividade do emitente", "actividade do emitente", "setor", "sector", "atividade", "actividade", "categoria"],
    nifAdq: ["nif adquirente", "nif do adquirente", "nif consumidor"],
    nomeAdq: ["nome adquirente", "nome do adquirente"]
  };

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
        if (field === "emitente" && (header.indexOf("nif") !== -1 || header.indexOf("nome") !== -1 || header.indexOf("designacao") !== -1)) return;
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

  function decodeBytes(bytes) {
    var b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    if (b.length >= 2 && b[0] === 0xFF && b[1] === 0xFE) return { text: new TextDecoder("utf-16le").decode(b), encoding: "utf-16" };
    if (b.length >= 2 && b[0] === 0xFE && b[1] === 0xFF) return { text: new TextDecoder("utf-16be").decode(b), encoding: "utf-16" };
    if (b.length >= 3 && b[0] === 0xEF && b[1] === 0xBB && b[2] === 0xBF) return { text: new TextDecoder("utf-8").decode(b), encoding: "utf-8" };
    try {
      return { text: new TextDecoder("utf-8", { fatal: true }).decode(b), encoding: "utf-8" };
    } catch (e) {
      return { text: new TextDecoder("windows-1252").decode(b), encoding: "windows-1252" };
    }
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
    if (raw == null) return null;
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

  function parseDate(raw) {
    var s = String(raw || "").trim();
    var m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return m[1] + "-" + m[2] + "-" + m[3];
    m = s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})/);
    if (!m) return "";
    var y = m[3];
    if (y.length === 2) y = (Number(y) > 50 ? "19" : "20") + y;
    return y + "-" + m[2].padStart(2, "0") + "-" + m[1].padStart(2, "0");
  }

  function splitEmitente(value) {
    var v = String(value || "").trim();
    var m = v.match(/^(?:PT\s*)?(\d[\d\s]{7,14})\s*[-–—:|/]\s*(.+)$/i);
    if (m) return { nif: m[1], nome: m[2].trim() };
    m = v.match(/^(?:PT\s*)?(\d[\d\s]{7,14})\s+(.+)$/i);
    if (m && m[1].replace(/\D/g, "").length === 9) return { nif: m[1], nome: m[2].trim() };
    m = v.match(/^(.+?)\s*[\(\[]\s*(?:PT\s*)?(\d[\d\s]{7,14})\s*[\)\]]\s*$/i);
    if (m) return { nif: m[2], nome: m[1].trim() };
    m = v.match(/^(?:PT\s*)?(\d[\d\s]{7,14})$/i);
    if (m) return { nif: m[1], nome: "" };
    return { nif: "", nome: v };
  }

  function checkNif(raw) {
    var digits = String(raw || "").toUpperCase().replace(/^PT/, "").replace(/\D/g, "");
    if (!digits) return { nif: "", valid: false, reason: "nif-missing" };
    if (digits.length !== 9) return { nif: digits, valid: false, reason: "nif-digits" };
    var nums = digits.split("").map(Number);
    var sum = 0;
    for (var i = 0; i < 8; i++) sum += nums[i] * (9 - i);
    var rest = sum % 11;
    var check = rest < 2 ? 0 : 11 - rest;
    if (check !== nums[8]) return { nif: digits, valid: false, reason: "nif" };
    var prefixOk = /^(?:45|7[01245789]|9[0189])/.test(digits) || /^[123568]/.test(digits);
    if (!prefixOk) return { nif: digits, valid: false, reason: "nif-prefix" };
    return { nif: digits, valid: true, reason: "" };
  }

  function isCredit(tipo) {
    var key = normKey(tipo);
    if (!key) return false;
    if (key === "nc" || key.indexOf("nc ") === 0) return true;
    return key.indexOf("nota de credito") !== -1 || key.indexOf("nota credito") !== -1;
  }

  function isCancelled(tipo, status) {
    return normKey(tipo).indexOf("anulad") !== -1 || normKey(status).indexOf("anulad") !== -1;
  }

  function sectorBlank(sector) {
    var s = normKey(sector);
    return !s || s === "sem setor" || s === "por classificar" || s === "n a" || s === "na" || s === "nd" || s === "null" || s === "pendente" || s === "sem classificacao";
  }

  function statusPending(status) {
    return /pend|falta|aguard|por class|por valid|incomplet/.test(normKey(status));
  }

  function isPending(status, sector, hasSectorColumn) {
    if (statusPending(status)) return true;
    if (!hasSectorColumn) return false;
    return sectorBlank(sector);
  }

  function splitNumeroAtcud(value) {
    var v = String(value || "").trim();
    if (!v) return { numero: "", atcud: "" };
    var m = v.match(/^(.*?)(?:\s*[\/|;-]\s*|\s+)([A-Z0-9]{8,}-\d+)\s*$/i);
    if (m && normKey(m[1])) return { numero: m[1].replace(/[\s\/|;-]+$/, "").trim(), atcud: m[2].toUpperCase() };
    if (/^[A-Z0-9]{8,}-\d+$/i.test(v)) return { numero: "", atcud: v.toUpperCase() };
    return { numero: v, atcud: "" };
  }

  function normNumero(s) {
    return String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  }

  function cell(row, map, field) {
    var i = map[field];
    if (i == null || i >= row.length) return "";
    return String(row[i] == null ? "" : row[i]).trim();
  }

  function findTable(rows) {
    var best = -1, bestScore = 0, bestMap = null;
    var limit = Math.min(rows.length, 30);
    for (var i = 0; i < limit; i++) {
      var map = mapColumns(rows[i]);
      var score = Object.keys(map).length;
      if (map.total == null) score = 0;
      if (map.nif == null && map.emitente == null && map.nome == null) score = 0;
      if (map.data == null && map.numero == null) score = 0;
      if (score > bestScore) { bestScore = score; best = i; bestMap = map; }
    }
    if (best < 0 || bestScore < 3) return null;
    return { headerIndex: best, map: bestMap };
  }

  function docKey(row) {
    var num = normNumero(row.numero);
    if (row.nif && num) return row.nif + "|" + num;
    var atcud = normNumero(row.atcud);
    if (row.nif && atcud) return row.nif + "|A|" + atcud;
    return "";
  }

  function rank(row) {
    var r = 0;
    if (!row.pending) r += 4;
    if (row.hasSector && !sectorBlank(row.sector)) r += 2;
    if (row.nifValid) r += 1;
    return r;
  }

  function quarterKey(iso) {
    if (!iso || iso.length < 7) return "—";
    var month = Number(iso.slice(5, 7));
    if (!month) return "—";
    return iso.slice(0, 4) + "-T" + (Math.floor((month - 1) / 3) + 1);
  }

  function excelDate(iso) {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
    var p = iso.split("-").map(Number);
    return new Date(Date.UTC(p[0], p[1] - 1, p[2], 12, 0, 0));
  }

  function parseText(text, filename) {
    var cleaned = text.replace(/^\uFEFF/, "");
    var lines = cleaned.split(/\r?\n/).filter(function (l) { return !/^sep=.$/i.test(l.trim()); });
    cleaned = lines.join("\n");
    var delim = detectDelim(cleaned);
    var table = parseCsv(cleaned, delim);
    var found = findTable(table);
    if (!found) return { error: true, rows: [], problems: [] };
    var map = found.map;
    var hasSector = map.setor != null;
    var combinedNumero = map.numero != null && normKey(table[found.headerIndex][map.numero]).indexOf("atcud") !== -1;
    var data = table.slice(found.headerIndex + 1);
    var out = [];
    var problems = [];
    if (data.length >= 300) problems.push({ code: "truncated", file: filename, doc: "", nif: "", name: "", detail: "truncated" });
    data.forEach(function (cells) {
      if (normKey(cells[0]) === "total" || normKey(cells[0]) === "totais") return;
      var tipo = cell(cells, map, "tipo");
      var status = cell(cells, map, "situacao");
      var nifRaw = cell(cells, map, "nif");
      var nome = cell(cells, map, "nome");
      var combined = cell(cells, map, "emitente");
      if (combined) {
        var sp = splitEmitente(combined);
        if (!nifRaw) nifRaw = sp.nif;
        if (!nome) nome = sp.nome;
      }
      if (nifRaw && /[A-Za-zÀ-ÿ]/.test(nifRaw)) {
        var sp2 = splitEmitente(nifRaw);
        if (sp2.nif) { nifRaw = sp2.nif; if (!nome) nome = sp2.nome; }
      }
      var nifInfo = checkNif(nifRaw);
      var numero = cell(cells, map, "numero");
      var atcud = cell(cells, map, "atcud");
      if (combinedNumero || !atcud) {
        var parts = splitNumeroAtcud(numero);
        if (parts.atcud) {
          numero = parts.numero || numero;
          if (!atcud) atcud = parts.atcud;
        }
      }
      var totalRaw = cell(cells, map, "total");
      var totalC = parseMoneyCents(totalRaw);
      var baseC = parseMoneyCents(cell(cells, map, "base"));
      var ivaC = parseMoneyCents(cell(cells, map, "iva"));
      var sector = cell(cells, map, "setor");
      var date = parseDate(cell(cells, map, "data"));
      if (!tipo && !numero && !nifInfo.nif && !date && totalC == null) return;
      var creditFixed = false;
      if (isCredit(tipo) && totalC != null && totalC > 0) {
        totalC = -totalC;
        if (baseC != null && baseC > 0) baseC = -baseC;
        if (ivaC != null && ivaC > 0) ivaC = -ivaC;
        creditFixed = true;
      }
      var pendingReason = "";
      if (statusPending(status)) pendingReason = "pending";
      else if (hasSector && sectorBlank(sector)) pendingReason = "no-sector";
      var mismatch = totalC != null && baseC != null && ivaC != null && Math.abs((baseC + ivaC) - totalC) > 1;
      var row = {
        date: date,
        month: date ? date.slice(0, 7) : "",
        quarter: quarterKey(date),
        nif: nifInfo.nif,
        nifValid: nifInfo.valid,
        nifReason: nifInfo.reason,
        nome: nome,
        tipo: tipo,
        numero: numero,
        atcud: atcud,
        sector: hasSector ? sector : "",
        hasSector: hasSector,
        status: status,
        totalC: totalC,
        baseC: baseC,
        ivaC: ivaC,
        file: filename,
        pending: !!pendingReason,
        pendingReason: pendingReason,
        cancelled: isCancelled(tipo, status),
        creditFixed: creditFixed,
        amountBad: totalRaw !== "" && totalC == null,
        mismatch: mismatch
      };
      out.push(row);
    });
    return { error: false, rows: out, problems: problems, hasSector: hasSector, headerOnly: out.length === 0 };
  }

  function sectorName(raw) {
    return sectorBlank(raw) ? t.noSector : String(raw).trim();
  }

  function money(cents) {
    if (cents == null || !isFinite(cents)) return "";
    return new Intl.NumberFormat(lang === "pt" ? "pt-PT" : "en-IE", { style: "currency", currency: "EUR" }).format(cents / 100);
  }

  function showDate(iso) {
    if (!iso) return "";
    var p = iso.split("-");
    return p[2] + "/" + p[1] + "/" + p[0];
  }

  function merge(files) {
    var kept = Object.create(null);
    var order = [];
    var problems = [];
    var parsed = 0;
    files.forEach(function (file) {
      if (file.tooBig) {
        problems.push({ code: "too-big", file: file.name, doc: "", nif: "", name: "", detail: "too-big" });
        return;
      }
      var result = parseText(file.text, file.name);
      file.encoding = file.encoding;
      if (result.error) {
        file.bad = true;
        return;
      }
      parsed++;
      file.dataRows = result.rows.length;
      file.hasSector = result.hasSector;
      file.headerOnly = result.headerOnly;
      result.problems.forEach(function (p) { problems.push(p); });
      result.rows.forEach(function (row) {
        if (row.cancelled) {
          problems.push({ code: "cancelled", file: row.file, doc: row.numero, nif: row.nif, name: row.nome, detail: "cancelled" });
          return;
        }
        if (row.creditFixed) problems.push({ code: "credit", file: row.file, doc: row.numero, nif: row.nif, name: row.nome, detail: "credit" });
        if (!row.nifValid) problems.push({ code: "nif", file: row.file, doc: row.numero, nif: row.nif, name: row.nome, detail: row.nifReason || "nif" });
        if (row.pending) problems.push({ code: "pending", file: row.file, doc: row.numero, nif: row.nif, name: row.nome, detail: row.pendingReason || "pending" });
        if (row.amountBad) problems.push({ code: "amount", file: row.file, doc: row.numero, nif: row.nif, name: row.nome, detail: "amount" });
        if (row.mismatch) problems.push({ code: "mismatch", file: row.file, doc: row.numero, nif: row.nif, name: row.nome, detail: "mismatch" });
        var key = docKey(row);
        if (!key) key = "row|" + order.length + "|" + row.file;
        if (!kept[key]) {
          kept[key] = row;
          order.push(key);
          return;
        }
        if (rank(row) > rank(kept[key])) {
          var previous = kept[key];
          kept[key] = row;
          problems.push({ code: "dup", file: previous.file, doc: previous.numero, nif: previous.nif, name: previous.nome, detail: "dup" });
        } else {
          problems.push({ code: "dup", file: row.file, doc: row.numero, nif: row.nif, name: row.nome, detail: "dup" });
        }
      });
    });
    var docs = order.map(function (k) { return kept[k]; });
    docs.sort(function (a, b) {
      if (a.date !== b.date) return a.date < b.date ? -1 : 1;
      return a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0;
    });
    return { docs: docs, problems: problems, parsed: parsed, files: files, hasSector: files.some(function (f) { return f.hasSector; }) };
  }

  function groupSum(docs, keyFn) {
    var map = Object.create(null);
    var order = [];
    docs.forEach(function (row) {
      var key = keyFn(row);
      if (!map[key]) { map[key] = { key: key, n: 0, totalC: 0, baseC: 0, ivaC: 0 }; order.push(key); }
      map[key].n++;
      if (row.totalC != null) map[key].totalC += row.totalC;
      if (row.baseC != null) map[key].baseC += row.baseC;
      if (row.ivaC != null) map[key].ivaC += row.ivaC;
    });
    return order.map(function (k) { return map[k]; });
  }

  function euros(cents) {
    if (cents == null) return "";
    return cents / 100;
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
        var cell = ws[addr2];
        if (!cell || cell.v === "" || cell.v == null) continue;
        cell.t = "d";
        cell.z = "dd/mm/yyyy";
      }
    });
    ws["!autofilter"] = { ref: ref };
    return ws;
  }

  function summarySheet(header, groups, labelOf) {
    var rows = [header];
    var n = 0, base = 0, iva = 0, total = 0;
    groups.forEach(function (g) {
      rows.push([labelOf ? labelOf(g) : g.key, g.n, euros(g.baseC), euros(g.ivaC), euros(g.totalC)]);
      n += g.n; base += g.baseC; iva += g.ivaC; total += g.totalC;
    });
    rows.push([t.totalRow, n, euros(base), euros(iva), euros(total)]);
    return rows;
  }

  function buildWorkbook(model) {
    var docs = model.docs;
    var validLabel = function (row) { return row.nifValid ? t.yes : t.no; };
    var fRows = [t.sheetF];
    docs.forEach(function (row) {
      fRows.push([excelDate(row.date), row.month, row.nif, row.nome, validLabel(row), row.tipo, row.numero, row.atcud, row.hasSector ? sectorName(row.sector) : "", row.status, euros(row.totalC), euros(row.baseC), euros(row.ivaC), row.file]);
    });
    var sectors = groupSum(docs.filter(function (row) { return row.hasSector; }), function (row) { return sectorName(row.sector); });
    sectors.sort(function (a, b) { return b.totalC - a.totalC; });
    var sRows = summarySheet(t.sheetS, sectors);

    var byNifMap = Object.create(null);
    docs.forEach(function (row) {
      var key = row.nif || "—";
      if (!byNifMap[key]) byNifMap[key] = { key: key, nif: row.nif, nome: row.nome, valid: row.nifValid, n: 0, totalC: 0, baseC: 0, ivaC: 0 };
      var g = byNifMap[key];
      g.n++;
      if (row.totalC != null) g.totalC += row.totalC;
      if (row.baseC != null) g.baseC += row.baseC;
      if (row.ivaC != null) g.ivaC += row.ivaC;
      if (row.nome && row.nome.length > (g.nome || "").length) g.nome = row.nome;
    });
    var nifGroups = Object.keys(byNifMap).map(function (k) { return byNifMap[k]; });
    nifGroups.sort(function (a, b) { return b.totalC - a.totalC; });
    var nRows = [t.sheetN];
    var nN = 0, nBase = 0, nIva = 0, nTotal = 0;
    nifGroups.forEach(function (g) {
      nRows.push([g.nif, g.nome, g.valid ? t.yes : t.no, g.n, euros(g.baseC), euros(g.ivaC), euros(g.totalC)]);
      nN += g.n; nBase += g.baseC; nIva += g.ivaC; nTotal += g.totalC;
    });
    nRows.push([t.totalRow, "", "", nN, euros(nBase), euros(nIva), euros(nTotal)]);

    var months = groupSum(docs, function (row) { return row.month || "—"; });
    months.sort(function (a, b) { return a.key < b.key ? -1 : 1; });
    var mRows = summarySheet(t.sheetM, months);
    var quarters = groupSum(docs, function (row) { return row.quarter || "—"; });
    quarters.sort(function (a, b) { return a.key < b.key ? -1 : 1; });
    var qRows = summarySheet(t.sheetQ, quarters);

    var pRows = [t.sheetP];
    if (!model.problems.length) pRows.push([t.noneIssue, "", "", "", "", ""]);
    model.problems.forEach(function (p) {
      pRows.push([t.issue[p.code] || p.code, p.file, p.doc, p.nif, p.name, t.detail[p.detail] || t.detail[p.code] || ""]);
    });

    var wb = XLSX.utils.book_new();
    var widths = function (ws, cols) { ws["!cols"] = cols.map(function (w) { return { wch: w }; }); };
    var wsF = buildSheet(fRows, [10, 11, 12], [0]);
    widths(wsF, [12, 10, 14, 36, 12, 22, 16, 16, 28, 18, 14, 16, 12, 28]);
    var wsN = buildSheet(nRows, [4, 5, 6]);
    widths(wsN, [14, 36, 12, 14, 16, 14, 14]);
    var wsM = buildSheet(mRows, [2, 3, 4]);
    widths(wsM, [12, 14, 16, 14, 14]);
    var wsQ = buildSheet(qRows, [2, 3, 4]);
    widths(wsQ, [12, 14, 16, 14, 14]);
    var wsP = buildSheet(pRows, []);
    widths(wsP, [22, 28, 16, 14, 36, 72]);
    XLSX.utils.book_append_sheet(wb, wsF, "Faturas");
    if (model.hasSector) {
      var wsS = buildSheet(sRows, [2, 3, 4]);
      widths(wsS, [36, 14, 16, 14, 14]);
      XLSX.utils.book_append_sheet(wb, wsS, "Por setor");
    }
    XLSX.utils.book_append_sheet(wb, wsN, "Por NIF");
    XLSX.utils.book_append_sheet(wb, wsM, "Por mês");
    XLSX.utils.book_append_sheet(wb, wsQ, "Por trimestre");
    XLSX.utils.book_append_sheet(wb, wsP, "Problemas");
    return wb;
  }

  function td(text, className) {
    var cellEl = document.createElement("td");
    if (className) cellEl.className = className;
    cellEl.textContent = text == null ? "" : String(text);
    return cellEl;
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  function fillLimit(el, dropped, found) {
    if (dropped > 0) {
      el.hidden = false;
      el.textContent = t.limit.replace(/\{n\}/g, String(found)).replace(/\{max\}/g, String(FREE_MAX));
    } else el.hidden = true;
  }

  function render(model) {
    var docs = model.docs;
    var totalC = 0, ivaC = 0;
    var badNifs = Object.create(null);
    docs.forEach(function (row) {
      if (row.totalC != null) totalC += row.totalC;
      if (row.ivaC != null) ivaC += row.ivaC;
      if (!row.nifValid) badNifs[row.nif || ("missing:" + row.nome + "|" + row.numero)] = true;
    });
    var invalid = Object.keys(badNifs).length;
    var pending = docs.filter(function (row) { return row.pending; });
    model.totalC = totalC;
    model.ivaC = ivaC;
    model.invalid = invalid;
    model.pending = pending;

    $("c-docs").textContent = String(docs.length);
    $("c-total").textContent = money(totalC);
    $("c-iva").textContent = money(ivaC);
    $("c-pending").textContent = String(pending.length);
    $("c-invalid").textContent = String(invalid);
    $("c-docs-l").textContent = t.docs;
    $("c-total-l").textContent = t.total;
    $("c-iva-l").textContent = t.iva;
    $("c-pending-l").textContent = t.pending;
    $("c-invalid-l").textContent = t.invalid;

    var fileList = $("file-list");
    clear(fileList);
    var dupCount = model.problems.filter(function (p) { return p.code === "dup"; }).length;
    model.files.forEach(function (file) {
      var li = document.createElement("li");
      if (file.tooBig) {
        li.textContent = file.name + " · " + (lang === "pt" ? "demasiado grande" : "too large");
        fileList.appendChild(li);
        return;
      }
      var bits = [file.name];
      if (file.bad) bits.push(lang === "pt" ? "não reconhecido" : "not recognised");
      else bits.push((file.dataRows || 0) + " " + t.rows);
      if (file.encoding) bits.push(file.encoding);
      li.textContent = bits.join(" · ");
      fileList.appendChild(li);
    });
    if (dupCount) {
      var liDup = document.createElement("li");
      liDup.textContent = dupCount + " " + t.dupChip;
      fileList.appendChild(liDup);
    }

    fillLimit($("limit-note"), model.dropped, model.found);

    var warn = $("warn-note");
    var truncated = model.problems.some(function (p) { return p.code === "truncated"; });
    warn.hidden = !truncated;
    if (truncated) warn.textContent = t.truncated;

    var sectorWrap = $("sector-wrap");
    var sBody = $("sector-body");
    clear(sBody);
    if (model.hasSector) {
      sectorWrap.hidden = false;
      var sectors = groupSum(docs.filter(function (row) { return row.hasSector; }), function (row) { return sectorName(row.sector); });
      sectors.sort(function (a, b) { return b.totalC - a.totalC; });
      sectors.forEach(function (g) {
        var tr = document.createElement("tr");
        tr.appendChild(td(g.key));
        tr.appendChild(td(String(g.n), "num"));
        tr.appendChild(td(money(g.baseC), "num"));
        tr.appendChild(td(money(g.ivaC), "num"));
        tr.appendChild(td(money(g.totalC), "num"));
        sBody.appendChild(tr);
      });
    } else sectorWrap.hidden = true;

    var pendWrap = $("pending-wrap");
    var pBody = $("pending-body");
    clear(pBody);
    if (pending.length) {
      pendWrap.hidden = false;
      pending.slice(0, PREVIEW_MAX).forEach(function (row) {
        var tr = document.createElement("tr");
        tr.appendChild(td(showDate(row.date)));
        tr.appendChild(td(row.nome));
        tr.appendChild(td(row.nif));
        tr.appendChild(td(row.numero));
        tr.appendChild(td(row.status || (row.pendingReason === "no-sector" ? t.noSector : ""), "warn"));
        tr.appendChild(td(money(row.totalC), "num"));
        pBody.appendChild(tr);
      });
    } else pendWrap.hidden = true;

    var body = $("preview-body");
    clear(body);
    docs.slice(0, PREVIEW_MAX).forEach(function (row) {
      var tr = document.createElement("tr");
      tr.appendChild(td(showDate(row.date)));
      tr.appendChild(td(row.nome));
      var nifCell = td(row.nif, row.nifValid ? "" : "bad");
      if (!row.nifValid) nifCell.title = t.detail[row.nifReason] || t.detail.nif;
      tr.appendChild(nifCell);
      tr.appendChild(td(row.tipo));
      var sectorCell = td(row.hasSector ? sectorName(row.sector) : "", row.pending && row.hasSector ? "warn" : "");
      sectorCell.classList.add("col-sector");
      tr.appendChild(sectorCell);
      tr.appendChild(td(row.status, row.pending ? "warn" : ""));
      tr.appendChild(td(money(row.totalC), "num" + (row.totalC < 0 ? " bad" : "")));
      body.appendChild(tr);
    });
    document.querySelectorAll(".col-sector").forEach(function (el) { el.hidden = !model.hasSector; });
    var cap = $("preview-note");
    if (docs.length > PREVIEW_MAX) {
      cap.hidden = false;
      cap.textContent = t.previewCap.replace("{max}", String(PREVIEW_MAX)).replace("{n}", String(docs.length));
    } else cap.hidden = true;

    $("results").hidden = false;
    $("download").disabled = docs.length === 0;
    $("empty-note").hidden = docs.length !== 0;
    if (!docs.length) $("empty-note").textContent = t.empty;
    state = model;
  }

  var state = null;
  var generation = 0;

  function clearResults() {
    state = null;
    $("results").hidden = true;
    clear($("file-list"));
    $("download").disabled = true;
    $("limit-note").hidden = true;
    $("warn-note").hidden = true;
    $("empty-note").hidden = true;
    if ($("preview-note")) $("preview-note").hidden = true;
    ["c-docs", "c-total", "c-iva", "c-pending", "c-invalid"].forEach(function (id) {
      if ($(id)) $(id).textContent = id === "c-docs" || id === "c-pending" || id === "c-invalid" ? "0" : "";
    });
  }

  function showError(msg) {
    clearResults();
    var box = $("error");
    box.hidden = false;
    box.textContent = msg;
  }
  function clearError() { $("error").hidden = true; $("error").textContent = ""; }

  function setBusy(on) {
    $("example").disabled = on;
    $("download").disabled = on || !state || !state.docs.length;
    $("file").disabled = on;
  }

  function expand(items) {
    var jobs = items.map(function (item) {
      var name = item.name || "ficheiro.csv";
      if (/\.zip$/i.test(name)) {
        if (typeof JSZip === "undefined") return Promise.reject(new Error("zip"));
        return JSZip.loadAsync(item.bytes).then(function (zip) {
          var inner = [];
          zip.forEach(function (path, entry) {
            if (entry.dir) return;
            if (/(^|\/)__MACOSX\//.test(path)) return;
            var base = path.split("/").pop();
            if (!base || base.charAt(0) === ".") return;
            if (!/\.csv$/i.test(base)) return;
            inner.push(entry.async("uint8array").then(function (bytes) { return { name: base, bytes: bytes }; }));
          });
          return Promise.all(inner);
        });
      }
      return Promise.resolve([item]);
    });
    return Promise.all(jobs).then(function (groups) {
      var flat = [];
      groups.forEach(function (g) { flat = flat.concat(g); });
      return flat;
    });
  }

  function run(items) {
    var gen = ++generation;
    clearError();
    return expand(items).then(function (all) {
      if (gen !== generation) return;
      if (!all.length) { showError(t.noneParsed); return; }
      var found = all.length;
      var dropped = Math.max(0, found - FREE_MAX);
      var used = all.slice(0, FREE_MAX);
      var files = used.map(function (item) {
        if (item.bytes && item.bytes.length > 15 * 1024 * 1024) return { name: item.name, tooBig: true, text: "", encoding: "" };
        var decoded = decodeBytes(item.bytes);
        return { name: item.name, text: decoded.text, encoding: decoded.encoding, bytes: item.bytes };
      });
      var model = merge(files);
      model.dropped = dropped;
      model.found = found;
      if (!model.parsed) { showError(t.noneParsed); return; }
      if (!model.docs.length && model.files.some(function (f) { return f.headerOnly; }) && !model.problems.some(function (p) { return p.code === "cancelled"; })) {
        showError(t.headerOnly);
        return;
      }
      render(model);
    }).catch(function () {
      if (gen !== generation) return;
      showError(t.readFail);
    });
  }

  function fromFileList(fileList) {
    var files = Array.prototype.slice.call(fileList || []);
    if (!files.length) return;
    setBusy(true);
    Promise.all(files.map(function (f) {
      return f.arrayBuffer().then(function (buf) { return { name: f.name, bytes: new Uint8Array(buf) }; });
    })).then(run).catch(function () { showError(t.readFail); }).then(function () {
      setBusy(false);
      $("file").value = "";
    });
  }

  var drop = $("drop");
  $("file").addEventListener("change", function () { fromFileList($("file").files); });
  ["dragenter", "dragover"].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("on"); });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("on"); });
  });
  drop.addEventListener("drop", function (e) { fromFileList(e.dataTransfer && e.dataTransfer.files); });

  $("example").addEventListener("click", function () {
    var url = $("example").getAttribute("data-sample");
    setBusy(true);
    fetch(url).then(function (res) {
      if (!res.ok) throw new Error("sample");
      return res.arrayBuffer();
    }).then(function (buf) {
      return run([{ name: "efatura-exemplo.zip", bytes: new Uint8Array(buf) }]);
    }).catch(function () { showError(t.sampleFail); }).then(function () { setBusy(false); });
  });

  $("pro").addEventListener("click", function () {
    var note = $("pro-note");
    note.hidden = false;
    note.textContent = t.proNote;
  });

  $("download").addEventListener("click", function () {
    if (!state || !state.docs.length || typeof XLSX === "undefined") return;
    var wb = buildWorkbook(state);
    XLSX.writeFile(wb, "efatura-netmend.xlsx", { cellDates: true });
  });
})();
