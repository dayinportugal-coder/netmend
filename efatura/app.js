/* e-fatura CSV → Excel. Runs entirely in the browser.
   Handles the Portal das Finanças "Consultar faturas → Obter dados para Excel" export:
   semicolon (or sniffed) CSV, Portuguese decimals, Windows-1252 or UTF-8/UTF-16,
   NIF glued to the issuer name, positive credit notes, and amounts over 1 000
   written with a thousands dot. Headers vary (Setor/Sector, Situação/Estado).
   SheetJS community build 0.20.3 (Apache-2.0): assets/vendor/xlsx.LICENSE.txt
*/
(function () {
  "use strict";

  var FREE_MAX = 3;
  var EFATURA_URL = "https://faturas.portaldasfinancas.gov.pt/";
  var lang = (document.documentElement.lang || "en").toLowerCase().indexOf("pt") === 0 ? "pt" : "en";

  var STR = {
    en: {
      docs: "Documents",
      total: "Net total",
      pending: "Pending",
      invalid: "Invalid NIFs",
      yes: "Yes",
      no: "No",
      noSector: "No sector",
      rows: "rows",
      dupChip: "duplicates removed",
      limit: "The free tool merges 3 files at a time. {n} files were found, so only the first 3 were used.",
      proNote: "Pro is not for sale yet. No payment is taken. The free tool already merges 3 files on this computer.",
      sampleFail: "The example file could not be loaded. Check your connection and try again.",
      readFail: "That file could not be read.",
      noneParsed: "None of these files look like an e-fatura CSV. Export with “Obter dados para Excel” and drop the file as it is, without opening it in Excel first.",
      empty: "No invoices left after removing cancelled documents.",
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
      sheetF: ["Date", "Month", "Issuer NIF", "Issuer name", "NIF valid", "Type", "Number", "ATCUD", "Sector", "Status", "Total", "Taxable base", "VAT", "Source file"],
      sheetS: ["Sector", "Documents", "Total"],
      sheetN: ["NIF", "Name", "NIF valid", "Documents", "Total"],
      sheetM: ["Month", "Documents", "Total"],
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
        "too-big": "File too large"
      },
      detail: {
        dup: "Removed. Same issuer NIF, document number, date and type were already in the merge.",
        credit: "The credit note was positive in the export. The amount is now negative.",
        nif: "The NIF does not pass the check digit.",
        "nif-prefix": "The check digit passes, but the first digits are not a known Portuguese NIF type.",
        "nif-digits": "The NIF does not have 9 digits.",
        "nif-missing": "The issuer NIF is missing.",
        pending: "Pending, or no sector. Classify it on e-fatura.",
        cancelled: "Cancelled document. Left out of the totals.",
        truncated: "This file has 300 or more rows. The portal keeps only the latest 300 per export.",
        amount: "The total could not be read as a number, so it was left out of the sums.",
        "too-big": "Skipped. Files over 15 MB are not read in the browser."
      }
    },
    pt: {
      docs: "Documentos",
      total: "Total líquido",
      pending: "Pendentes",
      invalid: "NIF inválidos",
      yes: "Sim",
      no: "Não",
      noSector: "Sem setor",
      rows: "linhas",
      dupChip: "duplicados removidos",
      limit: "A versão grátis junta 3 ficheiros de cada vez. Encontrámos {n}, por isso só os 3 primeiros foram usados.",
      proNote: "O Pro ainda não está à venda. Não há qualquer pagamento. A versão grátis já junta 3 ficheiros neste computador.",
      sampleFail: "Não foi possível carregar o exemplo. Verifique a ligação e tente de novo.",
      readFail: "Não foi possível ler esse ficheiro.",
      noneParsed: "Nenhum destes ficheiros parece um CSV do e-fatura. Exporte com “Obter dados para Excel” e largue o ficheiro tal como vem, sem o abrir no Excel primeiro.",
      empty: "Não restaram faturas depois de retirar os documentos anulados.",
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
      truncated: "300 ou mais linhas. A exportação do portal pára nas 300: exporte um período mais curto e junte os ficheiros.",
      sheetF: ["Data", "Mês", "NIF emitente", "Nome emitente", "NIF válido", "Tipo", "Número", "ATCUD", "Setor", "Situação", "Total", "Base tributável", "IVA", "Ficheiro"],
      sheetS: ["Setor", "Documentos", "Total"],
      sheetN: ["NIF", "Nome", "NIF válido", "Documentos", "Total"],
      sheetM: ["Mês", "Documentos", "Total"],
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
        "too-big": "Ficheiro grande"
      },
      detail: {
        dup: "Removido. O mesmo NIF, número, data e tipo já estavam na junção.",
        credit: "A nota de crédito vinha com valor positivo. O valor ficou negativo.",
        nif: "O NIF não passa no dígito de controlo.",
        "nif-prefix": "O dígito de controlo bate certo, mas os primeiros dígitos não são um tipo de NIF português conhecido.",
        "nif-digits": "O NIF não tem 9 dígitos.",
        "nif-missing": "Falta o NIF do emitente.",
        pending: "Pendente ou sem setor. Classifique no e-fatura.",
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

  function isPending(status, sector) {
    if (/pend|falta|aguard|por class|por valid|incomplet/.test(normKey(status))) return true;
    return sectorBlank(sector);
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
    var num = normKey(row.numero);
    if (!row.nif && !num && !normKey(row.atcud)) return "";
    if (!num) return [row.nif, normKey(row.atcud), row.date, normKey(row.tipo), String(row.totalC)].join("|");
    return [row.nif, num, row.date, normKey(row.tipo)].join("|");
  }

  function rank(row) {
    var r = 0;
    if (!row.pending) r += 4;
    if (!sectorBlank(row.sector)) r += 2;
    if (row.nifValid) r += 1;
    return r;
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
      if (!atcud) {
        var foundAtcud = (numero + " " + combined).match(/\b([A-Z0-9]{8,}-\d+)\b/i);
        if (foundAtcud) atcud = foundAtcud[1];
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
      var row = {
        date: date,
        month: date ? date.slice(0, 7) : "",
        nif: nifInfo.nif,
        nifValid: nifInfo.valid,
        nifReason: nifInfo.reason,
        nome: nome,
        tipo: tipo,
        numero: numero,
        atcud: atcud,
        sector: sector,
        status: status,
        totalC: totalC,
        baseC: baseC,
        ivaC: ivaC,
        file: filename,
        pending: isPending(status, sector),
        cancelled: isCancelled(tipo, status),
        creditFixed: creditFixed,
        amountBad: totalRaw !== "" && totalC == null
      };
      out.push(row);
    });
    return { error: false, rows: out, problems: problems, delim: delim };
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
      result.problems.forEach(function (p) { problems.push(p); });
      result.rows.forEach(function (row) {
        if (row.cancelled) {
          problems.push({ code: "cancelled", file: row.file, doc: row.numero, nif: row.nif, name: row.nome, detail: "cancelled" });
          return;
        }
        if (row.creditFixed) problems.push({ code: "credit", file: row.file, doc: row.numero, nif: row.nif, name: row.nome, detail: "credit" });
        if (!row.nifValid) problems.push({ code: "nif", file: row.file, doc: row.numero, nif: row.nif, name: row.nome, detail: row.nifReason || "nif" });
        if (row.pending) problems.push({ code: "pending", file: row.file, doc: row.numero, nif: row.nif, name: row.nome, detail: "pending" });
        if (row.amountBad) problems.push({ code: "amount", file: row.file, doc: row.numero, nif: row.nif, name: row.nome, detail: "amount" });
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
    return { docs: docs, problems: problems, parsed: parsed, files: files };
  }

  function groupSum(docs, keyFn) {
    var map = Object.create(null);
    var order = [];
    docs.forEach(function (row) {
      var key = keyFn(row);
      if (!map[key]) { map[key] = { key: key, n: 0, totalC: 0 }; order.push(key); }
      map[key].n++;
      if (row.totalC != null) map[key].totalC += row.totalC;
    });
    return order.map(function (k) { return map[k]; });
  }

  function euros(cents) {
    if (cents == null) return "";
    return cents / 100;
  }

  function buildSheet(rows, numberCols) {
    var ws = XLSX.utils.aoa_to_sheet(rows);
    var ref = ws["!ref"];
    if (!ref) return ws;
    var range = XLSX.utils.decode_range(ref);
    numberCols.forEach(function (c) {
      for (var r = range.s.r + 1; r <= range.e.r; r++) {
        var addr = XLSX.utils.encode_cell({ r: r, c: c });
        if (ws[addr] && ws[addr].t === "n") ws[addr].z = "#,##0.00";
      }
    });
    ws["!autofilter"] = { ref: ref };
    return ws;
  }

  function buildWorkbook(model) {
    var docs = model.docs;
    var validLabel = function (row) { return row.nifValid ? t.yes : t.no; };
    var fRows = [t.sheetF];
    docs.forEach(function (row) {
      fRows.push([row.date, row.month, row.nif, row.nome, validLabel(row), row.tipo, row.numero, row.atcud, sectorName(row.sector), row.status, euros(row.totalC), euros(row.baseC), euros(row.ivaC), row.file]);
    });
    var sectors = groupSum(docs, function (row) { return sectorName(row.sector); });
    sectors.sort(function (a, b) { return b.totalC - a.totalC; });
    var sRows = [t.sheetS];
    var sTotal = 0, sN = 0;
    sectors.forEach(function (g) { sRows.push([g.key, g.n, euros(g.totalC)]); sTotal += g.totalC; sN += g.n; });
    sRows.push([t.totalRow, sN, euros(sTotal)]);

    var byNifMap = Object.create(null);
    docs.forEach(function (row) {
      var key = row.nif || "—";
      if (!byNifMap[key]) byNifMap[key] = { nif: row.nif, nome: row.nome, valid: row.nifValid, n: 0, totalC: 0 };
      var g = byNifMap[key];
      g.n++;
      if (row.totalC != null) g.totalC += row.totalC;
      if (row.nome && row.nome.length > g.nome.length) g.nome = row.nome;
    });
    var nifGroups = Object.keys(byNifMap).map(function (k) { return byNifMap[k]; });
    nifGroups.sort(function (a, b) { return b.totalC - a.totalC; });
    var nRows = [t.sheetN];
    var nTotal = 0, nN = 0;
    nifGroups.forEach(function (g) {
      nRows.push([g.nif, g.nome, g.valid ? t.yes : t.no, g.n, euros(g.totalC)]);
      nTotal += g.totalC; nN += g.n;
    });
    nRows.push([t.totalRow, "", "", nN, euros(nTotal)]);

    var months = groupSum(docs, function (row) { return row.month || "—"; });
    months.sort(function (a, b) { return a.key < b.key ? -1 : 1; });
    var mRows = [t.sheetM];
    var mTotal = 0, mN = 0;
    months.forEach(function (g) { mRows.push([g.key, g.n, euros(g.totalC)]); mTotal += g.totalC; mN += g.n; });
    mRows.push([t.totalRow, mN, euros(mTotal)]);

    var pRows = [t.sheetP];
    if (!model.problems.length) pRows.push([t.noneIssue, "", "", "", "", ""]);
    model.problems.forEach(function (p) {
      pRows.push([t.issue[p.code] || p.code, p.file, p.doc, p.nif, p.name, t.detail[p.detail] || t.detail[p.code] || ""]);
    });

    var wb = XLSX.utils.book_new();
    var widths = function (ws, cols) { ws["!cols"] = cols.map(function (w) { return { wch: w }; }); };
    var wsF = buildSheet(fRows, [10, 11, 12]);
    widths(wsF, [12, 10, 14, 36, 12, 22, 16, 16, 28, 18, 14, 16, 12, 28]);
    var wsS = buildSheet(sRows, [2]);
    widths(wsS, [36, 14, 16]);
    var wsN = buildSheet(nRows, [4]);
    widths(wsN, [14, 36, 12, 14, 16]);
    var wsM = buildSheet(mRows, [2]);
    widths(wsM, [12, 14, 16]);
    var wsP = buildSheet(pRows, []);
    widths(wsP, [22, 28, 16, 14, 36, 72]);
    XLSX.utils.book_append_sheet(wb, wsF, "Faturas");
    XLSX.utils.book_append_sheet(wb, wsS, "Por setor");
    XLSX.utils.book_append_sheet(wb, wsN, "Por NIF");
    XLSX.utils.book_append_sheet(wb, wsM, "Por mês");
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

  function render(model) {
    var docs = model.docs;
    var totalC = 0, invalid = 0;
    docs.forEach(function (row) {
      if (row.totalC != null) totalC += row.totalC;
      if (!row.nifValid) invalid++;
    });
    var pending = docs.filter(function (row) { return row.pending; });
    model.totalC = totalC;
    model.invalid = invalid;
    model.pending = pending;

    $("c-docs").textContent = String(docs.length);
    $("c-total").textContent = money(totalC);
    $("c-pending").textContent = String(pending.length);
    $("c-invalid").textContent = String(invalid);
    $("c-docs-l").textContent = t.docs;
    $("c-total-l").textContent = t.total;
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

    var limit = $("limit-note");
    if (model.dropped > 0) {
      limit.hidden = false;
      limit.textContent = t.limit.replace("{n}", String(model.found));
    } else limit.hidden = true;

    var warn = $("warn-note");
    var truncated = model.problems.some(function (p) { return p.code === "truncated"; });
    warn.hidden = !truncated;
    if (truncated) warn.textContent = t.truncated;

    var sBody = $("sector-body");
    clear(sBody);
    var sectors = groupSum(docs, function (row) { return sectorName(row.sector); });
    sectors.sort(function (a, b) { return b.totalC - a.totalC; });
    sectors.forEach(function (g) {
      var tr = document.createElement("tr");
      tr.appendChild(td(g.key));
      tr.appendChild(td(String(g.n), "num"));
      tr.appendChild(td(money(g.totalC), "num"));
      sBody.appendChild(tr);
    });

    var pendWrap = $("pending-wrap");
    var pBody = $("pending-body");
    clear(pBody);
    if (pending.length) {
      pendWrap.hidden = false;
      pending.forEach(function (row) {
        var tr = document.createElement("tr");
        tr.appendChild(td(showDate(row.date)));
        tr.appendChild(td(row.nome));
        tr.appendChild(td(row.nif));
        tr.appendChild(td(row.numero));
        tr.appendChild(td(row.status || t.noSector, "warn"));
        tr.appendChild(td(money(row.totalC), "num"));
        pBody.appendChild(tr);
      });
    } else pendWrap.hidden = true;

    var body = $("preview-body");
    clear(body);
    docs.forEach(function (row) {
      var tr = document.createElement("tr");
      tr.appendChild(td(showDate(row.date)));
      tr.appendChild(td(row.nome));
      var nifCell = td(row.nif, row.nifValid ? "" : "bad");
      if (!row.nifValid) nifCell.title = t.detail[row.nifReason] || t.detail.nif;
      tr.appendChild(nifCell);
      tr.appendChild(td(row.tipo));
      tr.appendChild(td(sectorName(row.sector), row.pending ? "warn" : ""));
      tr.appendChild(td(row.status, row.pending ? "warn" : ""));
      tr.appendChild(td(money(row.totalC), "num" + (row.totalC < 0 ? " bad" : "")));
      body.appendChild(tr);
    });

    $("results").hidden = false;
    $("download").disabled = docs.length === 0;
    $("empty-note").hidden = docs.length !== 0;
    if (!docs.length) $("empty-note").textContent = t.empty;
    state = model;
  }

  var state = null;
  var generation = 0;

  function showError(msg) {
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
      if (!all.length) { showError(t.noneParsed); $("results").hidden = true; state = null; return; }
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
      if (!model.parsed) { showError(t.noneParsed); $("results").hidden = true; state = null; return; }
      render(model);
      var results = $("results");
      if (results && typeof results.scrollIntoView === "function") results.scrollIntoView({ block: "nearest" });
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
    XLSX.writeFile(wb, "efatura-netmend.xlsx");
  });
})();
