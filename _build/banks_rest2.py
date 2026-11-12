REST2 = [
dict(
  slug="ing",
  name="ING",
  short="ING",
  title="Convert ING bank statement PDF or CSV to Excel (NL and DE formats) · Netmend",
  meta="Convert an ING statement to CSV or tidy the official file. ING Netherlands CSV (YYYYMMDD, semicolon) and German ING-DiBa Kontoauszug (TT.MM.JJJJ, 1.234,56).",
  h1="Convert an ING statement to <span>CSV or Excel</span>",
  lead="ING is not one file format. The Dutch “Mijn ING” CSV is officially documented and uses YYYYMMDD dates. A German ING-DiBa Kontoauszug PDF looks completely different. This page covers both so you do not import 20260131 as a serial number or a US date.",
  region="ING Netherlands (Mijn ING) and ING-DiBa Germany; short note on other countries",
  fmt="eu", sep=";",
  date="Netherlands official CSV: dates as YYYYMMDD with no separators (for example 20260131). If you open the file carelessly, Excel will treat that as a large number, not a date. German PDFs: TT.MM.JJJJ (DD.MM.YYYY) for Buchung and Valuta.",
  decimal="Both markets use a European decimal comma. The Dutch official CSV is semicolon-separated. German PDFs print 1.234,56. Choose “Excel in Europe”.",
  download="""<p><b>ING Netherlands (Mijn ING)</b> — official CSV (ING published a January 2026 format note):</p>
<ol>
<li>Log in to Mijn ING (ing.nl) or the app and open the account.</li>
<li>Download or export movements and choose the CSV option.</li>
<li>Keep the file as text until you have set the date column to YYYYMMDD → a real date.</li>
</ol>
<p>Typical Dutch CSV columns: <code>Datum;Naam / Omschrijving;Rekening;Tegenrekening;Code;Af Bij;Bedrag (EUR);Mutatiesoort;Mededelingen;Saldo na mutatie;Tag</code>. <b>Af Bij</b> tells you whether the amount is Af (out) or Bij (in). <b>Bedrag</b> is usually unsigned, so the sign comes from Af/Bij, not from a minus in the number.</p>
<p><b>ING-DiBa Germany</b> — in Online-Banking or the app, open Kontoauszüge / Postfach and download the monthly PDF. A transaction line typically has Buchung, Valuta, Auftraggeber/Empfänger, Buchungstext, Verwendungszweck, Betrag, Währung and Saldo.</p>""",
  pdf="A German Kontoauszug is a classic European PDF: two dates, a counterparty, a purpose line that often wraps, a signed or Soll/Haben amount, and a running Saldo. A Dutch official statement PDF, when you need one for proof, is separate from the Mijn ING CSV — use the CSV for Excel work.",
  csv="If you already have the Dutch official CSV, do not run it through a PDF converter. Import it with a semicolon delimiter, then split Datum with TEXT or DATE from the YYYYMMDD digits, and build a signed amount from Af/Bij and Bedrag. Use our PDF tool for German (or other) Kontoauszüge you only have as a PDF.",
  tips="""<ul>
<li>Never let Excel auto-open a Dutch Datum column. Force it to text, then build a date with <code>=DATE(LEFT(A2,4),MID(A2,5,2),RIGHT(A2,2))</code>.</li>
<li>ING Spain, Belgium, Italy or Australia use yet other banking sites. Check a date after the 12th and a known amount before you trust the first conversion.</li>
</ul>""",
  sources="ING Netherlands official CSV format note, January 2026 (assets.ing.com, “ING_CSV_Mijn_ING_Januari2026”). German column names from current ING-DiBa Kontoauszug layouts, checked 12/11/2026.",
  related=["deutsche-bank","n26","bbva","barclays"],
  faqs=[
    ("Which ING is this for?","The official YYYYMMDD CSV is ING Netherlands. The PDF section describes a German ING-DiBa Kontoauszug. Other ING countries differ — check your own header row."),
    ("Why did Excel turn my dates into 20,260,131?","Dutch Datum is YYYYMMDD with no dashes. Import as text, then build a date with DATE/LEFT/MID/RIGHT."),
    ("Is Bedrag already signed?","In the official Dutch CSV, usually not: look at the Af/Bij column and apply the sign yourself."),
  ],
),
dict(
  slug="barclays",
  name="Barclays",
  short="Barclays UK",
  title="Convert Barclays UK bank statement PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert a Barclays UK statement PDF to CSV. Official Online Banking statements, transaction CSV export, Date / Paid In / Paid Out / Balance, and day-first dates.",
  h1="Convert a Barclays UK statement PDF to <span>CSV or Excel</span>",
  lead="Barclays gives you official PDF statements and a separate CSV export of account transactions. Use the CSV when you can. This page shows both paths and the PDF columns for when the export does not cover the period you need.",
  region="United Kingdom (Barclays UK)",
  fmt="us", sep=",",
  date="PDF statement dates are typically DD/MM/YYYY. Some on-screen or older exports show a date as “DD Mon” without a year — add the year from the statement period before you import across a New Year boundary.",
  decimal="UK format: 1,234.56. Choose UK/US numbers and a comma CSV (or “Excel in Europe” if your copy of Excel uses a decimal comma).",
  download="""Official PDF statements, from Barclays Help (“How can I view Online Statements?”):
<ol>
<li>In the Barclays app: <b>Help/More</b> on the home page, then <b>Statements</b>.</li>
<li>In Online Banking: under your name, open <b>Online Statements</b>, choose the account, and download the PDF. Statements from July 2013 onwards are in the archive if you registered in time; they also sit in My Barclays documents / Cloud It.</li>
</ol>
<p>For a spreadsheet of recent transactions (not the official monthly statement): open the account’s transactions, set a date range, then use <b>Export All</b> and choose CSV. That file is the one to import into Excel or accounting software when the period is still available.</p>""",
  pdf="A typical Barclays UK current-account PDF lists Date, Description, Paid In, Paid Out and Balance. Only one of Paid In or Paid Out is filled on each row. Payment references can wrap onto a second line under the same date.",
  csv="The official statement is a PDF. The transaction CSV typically has Date, Description, Paid In, Paid Out and Balance. Prefer that official CSV. Use our converter for older PDF statements, or for PDFs someone emailed you.",
  tips="""<ul>
<li>Do not confuse the official PDF (proof of the period, opening and closing balances) with the transaction export (rows for a date range you choose).</li>
<li>If a CSV date has no year, add it before you sort.</li>
</ul>""",
  sources="Barclays Help, “How can I view Online Statements?” (barclays.co.uk), checked 12/11/2026. CSV/PDF column notes (Date, Description, Paid In, Paid Out, Balance) from current UK layouts the same day.",
  related=["lloyds","hsbc","natwest","santander","monzo"],
  faqs=[
    ("Can I download a CSV from Barclays?","Yes, from the account’s transaction list (Export All), for a date range the bank still offers. Official monthly statements remain PDFs."),
    ("Paid In and Paid Out vs one Amount column?","The bank uses two columns. Our tool outputs a single signed Amount (money out negative) plus Balance. You can split it back in Excel if you prefer."),
    ("Does this cover Barclays in Africa or the US?","No. Those are different banks and layouts. Check a date after the 12th and a known amount."),
  ],
),
dict(
  slug="hsbc",
  name="HSBC UK",
  short="HSBC UK",
  title="Convert HSBC UK bank statement PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert an HSBC UK statement PDF to CSV. Official PDF statements, separate transaction download (often no header, signed amount), and day-first dates such as 12 Mar 2026.",
  h1="Convert an HSBC UK statement PDF to <span>CSV or Excel</span>",
  lead="HSBC UK official statements are PDFs. There is a separate transaction download (Excel or CSV) from the transaction list — and that file often has no header row. This page covers both, so you do not lose the first payment or misread the date.",
  region="United Kingdom (HSBC UK). Other HSBC countries differ.",
  fmt="us", sep=",",
  date="PDF statements use day-first UK dates. The transaction CSV commonly uses a day-first date such as “12 Mar 2026” (or DD/MM/YYYY), which some US tools will swap.",
  decimal="UK format: 1,234.56. Choose UK/US numbers.",
  download="""Official PDF, from HSBC UK (“How to get a bank statement online”):
<ol>
<li>App: log on → select the account → <b>View statements</b> → pick the month.</li>
<li>Online banking: quick links → <b>Statements</b> → choose the type, year and month and download. You can view, download, print or share a statement as a PDF.</li>
</ol>
<p>HSBC UK says you can access up to six years of statements. Digital statements are PDF. Other formats are offered from the <b>transaction list</b>, not from the official statement:</p>
<ol>
<li>Choose the account → <b>Search and filter</b> → set the date range → <b>Search</b>.</li>
<li>Scroll to the bottom of the list → <b>Download</b> → choose the format (CSV or Excel) → Continue.</li>
</ol>""",
  pdf="An HSBC UK current-account PDF is the official period document (opening and closing balances, the month’s transactions, any interest or charges). Transaction rows typically show a date, a description and an amount or paid in/out, with a running balance. Credit-card statements are a different document (payment due, interest summary) — convert them separately.",
  csv="The transaction download is often a file with <b>no header row</b> and three columns: date, description, and a signed amount (money out negative). There may be no running balance. Because there is no header, the first transaction can be mistaken for column titles if a tool “detects headers”. Prefer this official download when the period is available; use our PDF converter for older official statements or for PDFs you were sent.",
  tips="""<ul>
<li>When you open an HSBC CSV, do not tick “My data has headers” until you have looked at row 1.</li>
<li>HSBC says a current or savings statement may not be issued in a quiet period (no debits, balance between £0 and £1 million). The annual statement is still issued.</li>
<li>Other HSBC countries (Hong Kong, US, Mexico, France…) have different online banking and date formats.</li>
</ul>""",
  sources="HSBC UK, “How to get a bank statement online” and the FAQ “Can I download digital statements in different formats?” (hsbc.co.uk), checked 12/11/2026. Transaction-CSV layout (often no header; date, description, signed amount) from current UK downloads the same day.",
  related=["barclays","lloyds","natwest","santander","monzo"],
  faqs=[
    ("Is the official statement a CSV?","No. Official statements are PDFs. CSV or Excel comes from the transaction list, for a date range you search."),
    ("Why did my first payment become a column title?","Many HSBC transaction CSVs have no header row. Import with “no headers” and name the columns yourself."),
    ("Can I share a statement as proof of address?","HSBC UK says a downloaded digital statement is valid for that; they do not issue stamped paper copies as a matter of course."),
  ],
),
dict(
  slug="monzo",
  name="Monzo",
  short="Monzo",
  title="Convert Monzo bank statement PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert a Monzo PDF statement to CSV, or use the official CSV. App download steps, PDF columns, and the official CSV (id, created in ISO UTC, signed amount).",
  h1="Convert a Monzo statement PDF to <span>CSV or Excel</span>",
  lead="Monzo already lets you download PDF, CSV or QIF from the app. Use the official CSV when you can. This page shows that file’s columns — including the UTC timestamp — and how to convert a PDF when that is all you have.",
  region="United Kingdom (Monzo Bank). Pots have their own statements.",
  fmt="us", sep=",",
  date="PDF statements use DD/MM/YYYY. The official CSV “created” field is an ISO 8601 UTC timestamp such as 2019-01-05T14:35:41Z, which is not your local UK time late in the evening (a payment at 23:30 UK can fall on the next UTC day).",
  decimal="UK format in the PDF and CSV: dot decimal (12.34). Amounts in the official CSV are signed (money out negative) and often in major units (pounds), not pence — check a known payment.",
  download="""Official path, from Monzo Help (“Getting a bank statement”):
<ol>
<li>Tap <b>Home</b> in the app menu bar.</li>
<li>Tap the three dots underneath your card.</li>
<li>Tap <b>Bank statements</b>.</li>
<li>Choose the date range and the format: <b>PDF, CSV or QIF</b>.</li>
</ol>
<p>Pots have statements too. Monzo says statements are original legal documents (useful for a mortgage or visa) and that the name and address printed are those on the final day of the range you picked. Closed accounts are emailed a password-protected history (the password arrives by text).</p>""",
  pdf="A Monzo PDF typically lists Date, Description, Amount (GBP) and Balance (GBP), plus your details as they stood at the end of the period. It is the file to send as proof. Transaction descriptions are usually clean compared with older high-street PDFs.",
  csv="""The official CSV is a different, richer file than the PDF table. A commonly documented header is:
<code>id,created,amount,currency,local_amount,local_currency,category,emoji,description,address,notes,receipt,category_split</code>
<p>Use <b>created</b> (trim the time, and decide whether you want UTC or UK local time), <b>description</b>, <b>amount</b> and, if you spend abroad, the local_amount and local_currency columns. Category is Monzo’s own tag, useful for budgets, not a legal description.</p>""",
  tips="""<ul>
<li>Prefer the official CSV or QIF for bookkeeping, and the PDF for landlords, visas and mortgages.</li>
<li>Download Pots separately if you need to exclude or include them deliberately.</li>
<li>Our converter is for a PDF you already have (for example a period you can no longer regenerate).</li>
</ul>""",
  sources="Monzo Help, “Getting a bank statement” (monzo.com/help), checked 12/11/2026. Official CSV columns from Monzo community documentation of the current export; confirm the first row of your file.",
  related=["revolut","wise","barclays","lloyds"],
  faqs=[
    ("Does Monzo already give me a CSV?","Yes — PDF, CSV and QIF from Bank statements in the app. Convert a PDF only when you no longer have that export."),
    ("Why is a late-evening payment on the next day?","The CSV timestamp is UTC. UK time is UTC+0 or UTC+1. Convert to local time if you need the calendar day you actually spent."),
    ("What name appears on an old statement?","The name and address as they were on the last day of the range, not necessarily today’s details."),
  ],
),
]
# starling is not in our 18 - I accidentally related monzo to starling. Fix in builder or here.
# I'll remove starling from related in a patch.
