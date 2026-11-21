/* Recibos verdes — tax figures for the quarterly helper.
   Every number the calculator uses is in RULES, with the year and the
   official page it was read from. Confirmed for RULES.year (2026).
   This file does not fetch anything. */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.NM_RV = api;
})(typeof window !== "undefined" ? window : null, function () {
  "use strict";

  var RULES = {
    year: 2026,
    /* Portaria n.º 480-A/2025/1, de 30 de dezembro. Diário da República. */
    iasCents: 53713,
    /* ISS, FAQ «Novo regime dos Trabalhadores Independentes», 14 jan 2026.
       Coeficientes do rendimento relevante no regime da declaração trimestral. */
    coefServices: 70,
    coefGoods: 20,
    coefHospitality: 20,
    /* Same FAQ, exemplo do Filipe, and art. 168.º do Código dos Regimes
       Contributivos as cited there: taxa dos trabalhadores independentes. */
    rateBps: 2140,
    /* Same FAQ: contribuição fixada em 20 € quando não há rendimentos ou a
       contribuição apurada fica abaixo de 20 € (regime da declaração trimestral). */
    minContributionCents: 2000,
    /* Same FAQ, citing Despacho n.º 599/2019: no remanescente da acumulação,
       uma contribuição apurada abaixo de 5 € não releva. */
    accumulateIgnoreBelowCents: 500,
    /* Option on the quarterly declaration: ±25%, in steps of 5%. */
    adjustmentMin: -25,
    adjustmentMax: 25,
    adjustmentStep: 5,
    /* Cap: 12 × IAS. 537,13 × 12 = 6 445,56 €. FAQ de janeiro de 2026. */
    maxBaseMultiple: 12,
    /* Accumulation with employment: monthly relevant income vs 4 × IAS
       (2 148,52 €). FAQ de janeiro de 2026. */
    accumulateMultiple: 4,
    /* Art. 53.º, n.º 1, do CIVA, redação do Decreto-Lei n.º 35/2025:
       volume de negócios do ano anterior superior a 15 000 € exclui a isenção
       a partir de 1 de janeiro seguinte. */
    ivaLimitCents: 1500000,
    /* Art. 58.º, n.º 2, alínea b), e n.º 4, alínea b): no ano em curso, limiar
       excedido em mais de 25 % (15 000 × 1,25 = 18 750). A AT descreve o corte
       como ultrapassar 18 750 €. Strictly above 18 750. */
    ivaOverrunCents: 1875000,
    /* Art. 101.º, n.º 1, do CIRS (redação da Lei n.º 45-A/2024 na alínea b)):
       reference rates only. The tool does not apply them to a receipt. */
    withholdingArt151Pct: 23,
    withholdingOtherServicesPct: 11.5,
    /* Declaration months: last day of January, April, July, October.
       FAQ ISS, pergunta 14. Weekend moves to the next Monday. Holidays are
       not encoded — the FAQ also moves a deadline that falls on a holiday,
       and this file does not ship a holiday calendar. */
    declarationMonths: [1, 4, 7, 10],
    /* Payment window: day 10 to day 20 of the month after the month the
       contribution refers to. FAQ ISS and seg-social.pt. */
    paymentDayFrom: 10,
    paymentDayTo: 20,
    sources: {
      ias: "https://diariodarepublica.pt/dr/detalhe/portaria/480-a-2025-993056222",
      ssFaq: "https://www.seg-social.pt/ptss/pssd/documento/cmdddzytm006agq2y1ci6tibc",
      ssPage: "https://www.seg-social.pt/trabalhadores-independentes",
      ssJuly2026: "https://www.seg-social.pt/ptss/pssd/noticias/trabalhadores-independentes-entrega-da-declaracao-trimestral-julho-2026",
      civa: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/legislacao/diplomas_legislativos/Documents/Decreto_Lei_35_2025.pdf",
      civaFaq: "https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/questoes_frequentes/pages/faqs-00101.aspx",
      civaNewsletter: "https://info.portaldasfinancas.gov.pt/pt/at/Divulgacao/publicacoes_internas/Newsletter_AT/Documents/Newsletter-39-janeiro-2026.pdf",
      volume: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/legislacao/instrucoes_administrativas/Documents/Oficio_circulado_25062_2025.pdf",
      cirs: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs101.aspx"
    }
  };

  function roundRatio(cents, numer, denom) {
    if (!cents) return 0;
    return Math.round(cents * numer / denom);
  }

  function clampAdjustment(pct) {
    var n = Math.round(Number(pct) || 0);
    if (n < RULES.adjustmentMin) n = RULES.adjustmentMin;
    if (n > RULES.adjustmentMax) n = RULES.adjustmentMax;
    var step = RULES.adjustmentStep;
    n = Math.round(n / step) * step;
    return n;
  }

  /* One quarter of the quarterly-declaration regime (not organized accounting).
     Amounts are cents, without VAT. activity is "services", "goods" or
     "hospitality" — one coefficient for the whole amount. */
  function estimateQuarter(input) {
    var amount = Math.max(0, Math.round(Number(input.amountCents) || 0));
    var activity = input.activity === "goods" || input.activity === "hospitality" ? input.activity : "services";
    var services = activity === "services" ? amount : 0;
    var goods = activity === "goods" ? amount : 0;
    var hospitality = activity === "hospitality" ? amount : 0;
    var adjustment = clampAdjustment(input.adjustmentPct);
    var relevant = roundRatio(services, RULES.coefServices, 100)
      + roundRatio(goods, RULES.coefGoods, 100)
      + roundRatio(hospitality, RULES.coefHospitality, 100);
    var adjusted = roundRatio(relevant, 100 + adjustment, 100);
    var monthlyRelevant = Math.round(adjusted / 3);
    var maxBase = RULES.iasCents * RULES.maxBaseMultiple;
    var four = RULES.iasCents * RULES.accumulateMultiple;
    var accumulate = !!input.accumulate;
    var capped = false;
    var floor20 = false;
    var exemptPossible = false;
    var ignoredUnder5 = false;
    var base = monthlyRelevant;
    if (accumulate && monthlyRelevant < four) exemptPossible = true;
    if (accumulate && monthlyRelevant >= four) {
      base = monthlyRelevant - four;
    }
    if (base > maxBase) {
      base = maxBase;
      capped = true;
    }
    if (base < 0) base = 0;
    var raw = roundRatio(base, RULES.rateBps, 10000);
    var contribution = raw;
    if (accumulate && monthlyRelevant >= four && raw < RULES.accumulateIgnoreBelowCents) {
      contribution = 0;
      ignoredUnder5 = true;
    } else if (amount === 0 || raw < RULES.minContributionCents) {
      contribution = RULES.minContributionCents;
      floor20 = true;
    }
    return {
      activity: activity,
      amountCents: amount,
      servicesCents: services,
      goodsCents: goods,
      hospitalityCents: hospitality,
      adjustmentPct: adjustment,
      relevantCents: relevant,
      adjustedRelevantCents: adjusted,
      monthlyRelevantCents: monthlyRelevant,
      monthlyBaseCents: base,
      contributionCents: contribution,
      rawContributionCents: raw,
      capped: capped,
      floor20: floor20,
      accumulate: accumulate,
      exemptPossible: exemptPossible,
      ignoredUnder5: ignoredUnder5,
      maxBaseCents: maxBase,
      fourIasCents: four
    };
  }

  /* Art. 53.º / 58.º position from a yearly sum of bases (no VAT), in cents.
     "within": at or under 15 000.
     "over-year": over 15 000 and not over 18 750 — exemption until 31 Dec,
     normal regime from 1 Jan.
     "over-now": over 18 750 — exemption ends when the line is crossed. */
  function ivaPosition(baseCents) {
    var base = Math.max(0, Math.round(Number(baseCents) || 0));
    var state = "within";
    if (base > RULES.ivaOverrunCents) state = "over-now";
    else if (base > RULES.ivaLimitCents) state = "over-year";
    var span = RULES.ivaOverrunCents || 1;
    return {
      state: state,
      baseCents: base,
      limitCents: RULES.ivaLimitCents,
      overrunCents: RULES.ivaOverrunCents,
      ratio: Math.min(1, base / span)
    };
  }

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function isoUTC(date) {
    return date.getUTCFullYear() + "-" + pad(date.getUTCMonth() + 1) + "-" + pad(date.getUTCDate());
  }

  /* Last day of `month` (1–12) in `year`, moved to Monday when that day is
     Saturday or Sunday. Does not know public holidays. */
  function declarationDeadline(year, month) {
    var last = new Date(Date.UTC(year, month, 0));
    var dow = last.getUTCDay();
    if (dow === 6) last = new Date(last.getTime() + 2 * 86400000);
    else if (dow === 0) last = new Date(last.getTime() + 86400000);
    return isoUTC(last);
  }

  /* Quarter 1–4 of `year` is declared the following Jan/Apr/Jul/Oct. */
  function quarterDeadline(year, quarter) {
    var q = Number(quarter);
    if (q === 4) return declarationDeadline(year + 1, 1);
    if (q === 1) return declarationDeadline(year, 4);
    if (q === 2) return declarationDeadline(year, 7);
    if (q === 3) return declarationDeadline(year, 10);
    return "";
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

  return {
    RULES: RULES,
    estimateQuarter: estimateQuarter,
    ivaPosition: ivaPosition,
    declarationDeadline: declarationDeadline,
    quarterDeadline: quarterDeadline,
    checkNif: checkNif,
    clampAdjustment: clampAdjustment
  };
});
