/* node recibos-verdes/rules.test.js
   Locks the four FAQ examples and the holiday moves from the review. */
var assert = require("assert");
var RV = require("./rules.js");

function eur(cents) { return (cents / 100).toFixed(2); }

/* FAQ Q32 exemplo 1, Filipe. 6 000 € of services → 299,60 €. */
var filipe = RV.estimateQuarter({ amountCents: 600000, activity: "services" });
assert.strictEqual(filipe.relevantCents, 420000);
assert.strictEqual(filipe.monthlyBaseCents, 140000);
assert.strictEqual(filipe.contributionCents, 29960, "Filipe " + eur(filipe.contributionCents));
assert.strictEqual(filipe.headline, "pay");

/* FAQ Q32 exemplo 2, Marta. No income → 20 €. */
var marta = RV.estimateQuarter({ amountCents: 0, activity: "services" });
assert.strictEqual(marta.contributionCents, 2000);
assert.strictEqual(marta.floor20, true);

/* FAQ Q32 exemplo 4, Paulo. 24 000 €, also employed, over 4 × IAS → 738,62 €.
   +25% must not change it (FAQ Q28). */
var paulo = RV.estimateQuarter({ amountCents: 2400000, activity: "services", accumulate: true, adjustmentPct: 25 });
assert.strictEqual(paulo.adjustmentIgnored, true);
assert.strictEqual(paulo.adjustmentApplied, false);
assert.strictEqual(paulo.contributionCents, 73862, "Paulo " + eur(paulo.contributionCents));
assert.strictEqual(paulo.headline, "pay");

/* Under 4 × IAS and also employed: nothing to pay, not a contribution. */
var exempt = RV.estimateQuarter({ amountCents: 100000, activity: "services", accumulate: true });
assert.strictEqual(exempt.headline, "exempt-employed");
assert.strictEqual(exempt.contributionCents, 0);

/* FAQ Q32 exemplo 5, João. Cap at 12 × IAS → 1 379,35 €. */
var joao = RV.estimateQuarter({ amountCents: 6000000, activity: "services" });
assert.strictEqual(joao.capped, true);
assert.strictEqual(joao.monthlyBaseCents, 53713 * 12);
assert.strictEqual(joao.contributionCents, 137935, "João " + eur(joao.contributionCents));

/* FAQ Q34. ENI/EIRL rate 25,2% on Filipe's base: 1 400 × 0,252 = 352,80. */
var eni = RV.estimateQuarter({ amountCents: 600000, activity: "services", regime: "eni" });
assert.strictEqual(eni.contributionCents, 35280, "ENI " + eur(eni.contributionCents));

/* FAQ Q1. 1 Mar 2025 → 1 Mar 2026. 10 Jan 2025 → 1 Jan 2026. */
assert.strictEqual(RV.regimeStartDate("2025-03-01"), "2026-03-01");
assert.strictEqual(RV.regimeStartDate("2025-01-10"), "2026-01-01");
assert.strictEqual(RV.dateInForce("2026-02-28", "2025-03-01"), false);
assert.strictEqual(RV.dateInForce("2026-03-01", "2025-03-01"), true);
var first = RV.estimateQuarter({ amountCents: 600000, beforeRegime: true });
assert.strictEqual(first.headline, "first-year");
assert.strictEqual(first.contributionCents, 0);

/* FAQ Q14. Weekend and national holiday.
   31 Oct 2027 is a Sunday → 1 Nov (All Saints) → 2 Nov.
   30 Apr 2028 is a Sunday → 1 May (Labour Day) → 2 May. */
assert.strictEqual(RV.declarationDeadline(2027, 10), "2027-11-02");
assert.strictEqual(RV.declarationDeadline(2028, 4), "2028-05-02");
assert.strictEqual(RV.quarterDeadline(2026, 1), "2026-04-30");
assert.strictEqual(RV.quarterDeadline(2026, 3), "2026-11-02");

/* Art. 53 / 58, DL 35/2025. */
assert.strictEqual(RV.ivaPosition(1500000).state, "within");
assert.strictEqual(RV.ivaPosition(1500001).state, "over-year");
assert.strictEqual(RV.ivaPosition(1875000).state, "over-year");
assert.strictEqual(RV.ivaPosition(1875001).state, "over-now");

var gUrl = RV.googleCalendarUrl({
  start: "2027-02-01",
  text: "Declaração trimestral Segurança Social",
  details: "Entregar a declaração. https://netmend.app/pt/recibos-verdes/declaracao-trimestral/"
});
assert.ok(gUrl.indexOf("https://calendar.google.com/calendar/render?action=TEMPLATE") === 0);
assert.ok(gUrl.indexOf("dates=20270201/20270202") !== -1);
assert.ok(gUrl.indexOf("512345678") === -1);

var over = RV.limitFlags({ yearBaseCents: 1900000, yearIvaCents: 0, grossCents: 1900000 });
assert.strictEqual(over.ivaOverNow, true);
assert.strictEqual(over.irsDispensa, true);
var mid = RV.limitFlags({ yearBaseCents: 1600000, yearIvaCents: 0, grossCents: 1600000 });
assert.strictEqual(mid.ivaOverYear, true);
assert.strictEqual(mid.ivaOverNow, false);
var charged = RV.limitFlags({ yearBaseCents: 1900000, yearIvaCents: 100, grossCents: 1900000 });
assert.strictEqual(charged.ivaOverNow, false);
var force = RV.limitFlags({ grossCents: 26000000 });
assert.strictEqual(force.simplificadoForce, true);
var watch = RV.limitFlags({ grossCents: 21000000 });
assert.strictEqual(watch.simplificadoWatch, true);
assert.strictEqual(watch.simplificadoForce, false);

var anexo = RV.anexoTaxable(100000, "art151");
assert.strictEqual(anexo.taxableCents, 75000);
assert.strictEqual(anexo.expenseRule, true);
assert.strictEqual(RV.anexoTaxable(100000, "other").taxableCents, 35000);
assert.strictEqual(RV.anexoTaxable(100000, "goods").taxableCents, 15000);
assert.strictEqual(RV.anexoTaxable(100000, "goods").expenseRule, false);

console.log("rules.test.js ok");
