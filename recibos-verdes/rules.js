/* Recibos verdes — tax figures for the quarterly helper.
   Every number the calculator uses is in RULES, with the year and the
   official page it was read from. Confirmed for RULES.year (2026).
   This file does not fetch anything.
   FAQ questions are from «Perguntas Frequentes — Novo regime dos
   Trabalhadores Independentes», ISS, I.P., 14 January 2026:
   https://www.seg-social.pt/ptss/pssd/documento/cmdddzytm006agq2y1ci6tibc */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.NM_RV = api;
})(typeof window !== "undefined" ? window : null, function () {
  "use strict";

  var RULES = {
    year: 2026,
    /* Portaria n.º 480-A/2025/1. Diário da República. */
    iasCents: 53713,
    /* FAQ Q24. Coefficients of relevant income in the quarterly regime. */
    coefServices: 70,
    coefGoods: 20,
    coefHospitality: 20,
    /* FAQ Q34. Trabalhadores independentes. */
    rateTiBps: 2140,
    /* FAQ Q34. Empresários em nome individual and EIRL, and their spouses. */
    rateEniBps: 2520,
    /* FAQ Q30 and exemplo 2 (Marta): contribution set at 20 € when there is
       no income or the calculated contribution is under 20 €. */
    minContributionCents: 2000,
    /* FAQ Q44, citing Despacho n.º 599/2019: a remainder contribution under
       5 € does not count. */
    accumulateIgnoreBelowCents: 500,
    /* FAQ Q28. ±25%, steps of 5. Not available when paying on the remainder
       above 4 × IAS. */
    adjustmentMin: -25,
    adjustmentMax: 25,
    adjustmentStep: 5,
    /* FAQ exemplo 5: monthly base cap is 12 × IAS = 6 445,56 €. */
    maxBaseMultiple: 12,
    /* FAQ Q35 and exemplo 4 (Paulo): 4 × IAS = 2 148,52 €. */
    accumulateMultiple: 4,
    /* CIVA art. 53.º n.º 1, wording of Decreto-Lei n.º 35/2025. */
    ivaLimitCents: 1500000,
    /* CIVA art. 58.º n.º 2 b) and n.º 4 b): threshold exceeded by more than
       25% (15 000 × 1,25 = 18 750). Strictly above 18 750. */
    ivaOverrunCents: 1875000,
    /* CIRS art. 101.º n.º 1, alíneas b) and c). Reference only. */
    withholdingArt151Pct: 23,
    withholdingOtherServicesPct: 11.5,
    /* CIRS art. 101.º-B n.º 1 d), Decreto-Lei n.º 49/2025, in force 1 July 2025:
       no withholding when each withholding is under 25 €. */
    withholdingWaiverCents: 2500,
    /* CIRS art. 28.º n.º 2, consolidated text (CIRS_07_2025) and AT FAQ 5880.
       Art. 28.º n.º 6: organised accounting is mandatory from the next year
       only after two consecutive years over this amount, or one year by more
       than 25% (n.º 6). 200 000 × 1,25 = 250 000. */
    simplificadoLimitCents: 20000000,
    simplificadoForceCents: 25000000,
    /* CIRS art. 31.º n.º 1, same consolidation. */
    coefArt151: 75,
    coefOtherServices: 35,
    coefGoodsHospitality: 15,
    /* Art. 31.º n.º 13: for alíneas b) and c), documented expenses are compared
       with 15% of those gross service amounts. */
    expenseFloorPct: 15,
    /* CIRS art. 25.º n.º 1 a): 8,54 × IAS. Lei n.º 45-A/2024. */
    deducaoEspecificaFactorBps: 854,
    declarationMonths: [1, 4, 7, 10],
    /* FAQ Q34. Payment from the 10th to the 20th of the following month. */
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
      cirs: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs101.aspx",
      cirsWaiver: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/legislacao/diplomas_legislativos/Documents/Decreto_Lei_49_2025.pdf"
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

  function rateBps(regime) {
    return regime === "eni" ? RULES.rateEniBps : RULES.rateTiBps;
  }

  /* One quarter of the quarterly-declaration regime.
     amountCents is without VAT. activity is services, goods or hospitality.
     regime is "ti" (21,4%) or "eni" (25,2%, FAQ Q34).
     beforeRegime: the 12-month first enrolment has not started (FAQ Q1).
     accumulate: also employed. The ±25% option is ignored when the person
     pays on the remainder above 4 × IAS (FAQ Q28). */
  function estimateQuarter(input) {
    input = input || {};
    var amount = Math.max(0, Math.round(Number(input.amountCents) || 0));
    var activity = input.activity === "goods" || input.activity === "hospitality" ? input.activity : "services";
    var services = activity === "services" ? amount : 0;
    var goods = activity === "goods" ? amount : 0;
    var hospitality = activity === "hospitality" ? amount : 0;
    var requested = clampAdjustment(input.adjustmentPct);
    var relevant = roundRatio(services, RULES.coefServices, 100)
      + roundRatio(goods, RULES.coefGoods, 100)
      + roundRatio(hospitality, RULES.coefHospitality, 100);
    var maxBase = RULES.iasCents * RULES.maxBaseMultiple;
    var four = RULES.iasCents * RULES.accumulateMultiple;
    var accumulate = !!input.accumulate;
    var regime = input.regime === "eni" ? "eni" : "ti";
    var bps = rateBps(regime);
    var monthlyUnadjusted = Math.round(relevant / 3);
    var adjustmentApplied = false;
    var adjustmentIgnored = false;
    var useMonthly = monthlyUnadjusted;
    var adjusted = relevant;

    if (input.beforeRegime) {
      return result({
        amount: amount, activity: activity, services: services, goods: goods, hospitality: hospitality,
        requested: requested, relevant: relevant, adjusted: relevant, monthlyRelevant: monthlyUnadjusted,
        base: 0, contribution: 0, raw: 0, capped: false, floor20: false, accumulate: accumulate,
        headline: "first-year", adjustmentApplied: false, adjustmentIgnored: false,
        exemptEmployed: false, ignoredUnder5: false, maxBase: maxBase, four: four, regime: regime, bps: bps,
        hypothetical: 0
      });
    }

    if (accumulate && monthlyUnadjusted >= four) {
      /* FAQ Q28: no ±25% when contributing on the remainder. */
      if (requested !== 0) adjustmentIgnored = true;
      useMonthly = monthlyUnadjusted;
      adjusted = relevant;
    } else if (!accumulate) {
      adjusted = roundRatio(relevant, 100 + requested, 100);
      useMonthly = Math.round(adjusted / 3);
      adjustmentApplied = requested !== 0;
    } else {
      /* Under 4 × IAS and also employed: the option does not create a payment. */
      useMonthly = monthlyUnadjusted;
      adjusted = relevant;
    }

    var exemptEmployed = accumulate && monthlyUnadjusted < four;
    var capped = false;
    var base = exemptEmployed ? useMonthly : (accumulate ? useMonthly - four : useMonthly);
    if (base > maxBase) { base = maxBase; capped = true; }
    if (base < 0) base = 0;
    var raw = roundRatio(base, bps, 10000);
    var contribution = raw;
    var floor20 = false;
    var ignoredUnder5 = false;
    var headline = "pay";

    if (exemptEmployed) {
      headline = "exempt-employed";
      contribution = 0;
      floor20 = false;
    } else if (accumulate && raw < RULES.accumulateIgnoreBelowCents) {
      contribution = 0;
      ignoredUnder5 = true;
      headline = "under-5";
    } else if (amount === 0 || raw < RULES.minContributionCents) {
      contribution = RULES.minContributionCents;
      floor20 = true;
      headline = "floor";
    }

    var hypothetical = 0;
    if (exemptEmployed) {
      var hypoBase = Math.min(monthlyUnadjusted, maxBase);
      hypothetical = roundRatio(hypoBase, bps, 10000);
      if (hypothetical < RULES.minContributionCents) hypothetical = RULES.minContributionCents;
    }

    return result({
      amount: amount, activity: activity, services: services, goods: goods, hospitality: hospitality,
      requested: requested, relevant: relevant, adjusted: adjusted, monthlyRelevant: useMonthly,
      base: exemptEmployed ? 0 : base, contribution: contribution, raw: raw, capped: capped,
      floor20: floor20, accumulate: accumulate, headline: headline,
      adjustmentApplied: adjustmentApplied, adjustmentIgnored: adjustmentIgnored,
      exemptEmployed: exemptEmployed, ignoredUnder5: ignoredUnder5,
      maxBase: maxBase, four: four, regime: regime, bps: bps, hypothetical: hypothetical
    });
  }

  function result(p) {
    return {
      activity: p.activity,
      regime: p.regime,
      rateBps: p.bps,
      amountCents: p.amount,
      servicesCents: p.services,
      goodsCents: p.goods,
      hospitalityCents: p.hospitality,
      adjustmentPct: p.adjustmentApplied ? p.requested : 0,
      requestedAdjustmentPct: p.requested,
      adjustmentApplied: p.adjustmentApplied,
      adjustmentIgnored: p.adjustmentIgnored,
      relevantCents: p.relevant,
      adjustedRelevantCents: p.adjusted,
      monthlyRelevantCents: p.monthlyRelevant,
      monthlyBaseCents: p.base,
      contributionCents: p.contribution,
      rawContributionCents: p.raw,
      hypotheticalCents: p.hypothetical,
      capped: p.capped,
      floor20: p.floor20,
      accumulate: p.accumulate,
      exemptEmployed: p.exemptEmployed,
      exemptPossible: p.exemptEmployed,
      ignoredUnder5: p.ignoredUnder5,
      headline: p.headline,
      maxBaseCents: p.maxBase,
      fourIasCents: p.four
    };
  }

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

  function addDays(iso, n) {
    var p = iso.split("-").map(Number);
    return isoUTC(new Date(Date.UTC(p[0], p[1] - 1, p[2] + n)));
  }

  /* Anonymous Gregorian computus. Returns YYYY-MM-DD of Easter Sunday. */
  function easterSunday(year) {
    var a = year % 19;
    var b = Math.floor(year / 100);
    var c = year % 100;
    var d = Math.floor(b / 4);
    var e = b % 4;
    var f = Math.floor((b + 8) / 25);
    var g = Math.floor((b - f + 1) / 3);
    var h = (19 * a + b - d - g + 15) % 30;
    var i = Math.floor(c / 4);
    var k = c % 4;
    var l = (32 + 2 * e + 2 * i - h - k) % 7;
    var m = Math.floor((a + 11 * h + 22 * l) / 451);
    var month = Math.floor((h + l - 7 * m + 114) / 31);
    var day = ((h + l - 7 * m + 114) % 31) + 1;
    return year + "-" + pad(month) + "-" + pad(day);
  }

  /* Mainland national holidays: fixed dates plus Good Friday and Corpus Christi.
     Municipal holidays are not included. */
  function nationalHolidays(year) {
    var easter = easterSunday(year);
    var list = [
      year + "-01-01",
      year + "-04-25",
      year + "-05-01",
      year + "-06-10",
      year + "-08-15",
      year + "-10-05",
      year + "-11-01",
      year + "-12-01",
      year + "-12-08",
      year + "-12-25",
      addDays(easter, -2),
      addDays(easter, 60)
    ];
    var set = Object.create(null);
    list.forEach(function (d) { set[d] = true; });
    return set;
  }

  function isWeekend(iso) {
    var p = iso.split("-").map(Number);
    var dow = new Date(Date.UTC(p[0], p[1] - 1, p[2])).getUTCDay();
    return dow === 0 || dow === 6;
  }

  var holidayCache = Object.create(null);
  function holidaySet(year) {
    if (!holidayCache[year]) holidayCache[year] = nationalHolidays(year);
    return holidayCache[year];
  }

  /* FAQ Q14: Saturday, Sunday or a public holiday moves to the next business day. */
  function nextBusinessDay(iso) {
    var d = iso;
    var guard = 0;
    while (guard < 14 && (isWeekend(d) || holidaySet(Number(d.slice(0, 4)))[d])) {
      d = addDays(d, 1);
      guard++;
    }
    return d;
  }

  function declarationDeadline(year, month) {
    var last = new Date(Date.UTC(year, month, 0));
    return nextBusinessDay(isoUTC(last));
  }

  function quarterDeadline(year, quarter) {
    var q = Number(quarter);
    if (q === 4) return declarationDeadline(year + 1, 1);
    if (q === 1) return declarationDeadline(year, 4);
    if (q === 2) return declarationDeadline(year, 7);
    if (q === 3) return declarationDeadline(year, 10);
    return "";
  }

  /* FAQ Q1: the first enrolment takes effect on the 1st day of the 12th month
     after the month the activity started.
     1 March 2025 → 1 March 2026. 10 January 2025 → 1 January 2026. */
  function regimeStartDate(iso) {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
    var y = Number(iso.slice(0, 4));
    var m = Number(iso.slice(5, 7));
    if (!m || m > 12) return "";
    var em = m + 12;
    var ey = y;
    if (em > 12) { em -= 12; ey += 1; }
    return ey + "-" + pad(em) + "-01";
  }

  function addMonthsIso(iso, n) {
    var y = Number(iso.slice(0, 4));
    var m = Number(iso.slice(5, 7)) + n;
    var d = Number(iso.slice(8, 10));
    while (m > 12) { m -= 12; y += 1; }
    while (m < 1) { m += 12; y -= 1; }
    var last = new Date(Date.UTC(y, m, 0)).getUTCDate();
    if (d > last) d = last;
    return y + "-" + pad(m) + "-" + pad(d);
  }

  /* Show the "first year is ending" note only while the effect date is recent:
     not more than 12 months ago, and not more than 15 months ahead. */
  function firstYearNotice(startIso, today) {
    var effect = regimeStartDate(startIso);
    if (!effect || !today) return { show: false, effect: effect || "" };
    var from = addMonthsIso(today, -12);
    var until = addMonthsIso(today, 15);
    return { show: effect >= from && effect <= until, effect: effect };
  }

  function deducaoEspecificaCents() {
    return Math.round(RULES.iasCents * RULES.deducaoEspecificaFactorBps / 100);
  }

  /* Art. 31 n.º 13 for alíneas b) and c): add-back is max(0, 15% of gross − automatic deduction). */
  function expenseAddBack(grossCents, kind) {
    var applies = kind === "art151" || kind === "other" || kind === "al";
    var auto = deducaoEspecificaCents();
    if (!applies) return { applies: false, addCents: 0, autoCents: auto, ceilingCents: 0 };
    var fifteen = Math.round(Math.max(0, grossCents) * RULES.expenseFloorPct / 100);
    return {
      applies: true,
      addCents: Math.max(0, fifteen - auto),
      autoCents: auto,
      ceilingCents: Math.round(auto * 100 / RULES.expenseFloorPct)
    };
  }

  function dateInForce(iso, startIso) {
    if (!startIso) return true;
    var effect = regimeStartDate(startIso);
    if (!effect || !iso) return true;
    return iso >= effect;
  }

  function todayIso() {
    var d = new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function quarterContains(year, quarter, iso) {
    var startM = (Number(quarter) - 1) * 3 + 1;
    var start = year + "-" + pad(startM) + "-01";
    var end = isoUTC(new Date(Date.UTC(year, startM + 2, 0)));
    return iso >= start && iso <= end;
  }

  /* All-day Google Calendar template. End date is exclusive.
     details must not include names, NIFs or amounts. */
  function googleCalendarUrl(opts) {
    var start = String(opts.start || "").replace(/-/g, "");
    var end = addDays(opts.start, 1).replace(/-/g, "");
    return "https://calendar.google.com/calendar/render?action=TEMPLATE&text="
      + encodeURIComponent(opts.text || "")
      + "&dates=" + start + "/" + end
      + "&details=" + encodeURIComponent(opts.details || "");
  }

  /* Which "you crossed a limit" notes apply. Amounts are cents, no VAT.
     yearIvaCents > 0 means these documents already charged VAT. */
  function limitFlags(input) {
    input = input || {};
    var base = Math.max(0, Math.round(Number(input.yearBaseCents) || 0));
    var iva = Math.max(0, Math.round(Number(input.yearIvaCents) || 0));
    var gross = Math.max(0, Math.round(Number(input.grossCents) || 0));
    var exempt = iva === 0;
    return {
      ivaOverYear: exempt && base > RULES.ivaLimitCents && base <= RULES.ivaOverrunCents,
      ivaOverNow: exempt && base > RULES.ivaOverrunCents,
      ssCap: !!input.capped,
      ssRemainder: !!input.remainder,
      ssFirstYearEnded: !!input.leftFirstYear,
      irsDispensa: gross >= RULES.ivaLimitCents,
      simplificadoWatch: gross > RULES.simplificadoLimitCents && gross <= RULES.simplificadoForceCents,
      simplificadoForce: gross > RULES.simplificadoForceCents
    };
  }

  /* Art. 31.º n.º 1. reduction "y1" is −50% and "y2" is −25%, only for
     alíneas b), c) and the AL case that uses c). n.º 11 can block it. */
  function anexoTaxable(grossCents, kind, reduction) {
    var table = {
      art151: { bps: 7500, expense: true, starter: true },
      other: { bps: 3500, expense: true, starter: true },
      goods: { bps: 1500, expense: false, starter: false },
      al: { bps: 3500, expense: true, starter: true },
      alContencao: { bps: 5000, expense: false, starter: false },
      royalties: { bps: 9500, expense: false, starter: false }
    };
    var spec = table[kind] || table.goods;
    var bps = spec.bps;
    var applied = "none";
    if (spec.starter && reduction === "y1") { bps = Math.round(bps * 50 / 100); applied = "y1"; }
    else if (spec.starter && reduction === "y2") { bps = Math.round(bps * 75 / 100); applied = "y2"; }
    var gross = Math.max(0, Math.round(Number(grossCents) || 0));
    return {
      kind: spec === table[kind] ? kind : "goods",
      coefBps: bps,
      coef: bps / 100,
      grossCents: gross,
      taxableCents: Math.round(gross * bps / 10000),
      expenseRule: spec.expense,
      reduction: applied
    };
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
    nextBusinessDay: nextBusinessDay,
    nationalHolidays: nationalHolidays,
    easterSunday: easterSunday,
    regimeStartDate: regimeStartDate,
    dateInForce: dateInForce,
    todayIso: todayIso,
    quarterContains: quarterContains,
    checkNif: checkNif,
    clampAdjustment: clampAdjustment,
    googleCalendarUrl: googleCalendarUrl,
    limitFlags: limitFlags,
    anexoTaxable: anexoTaxable,
    firstYearNotice: firstYearNotice,
    expenseAddBack: expenseAddBack,
    deducaoEspecificaCents: deducaoEspecificaCents
  };
});
