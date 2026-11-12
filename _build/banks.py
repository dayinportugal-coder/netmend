# Bank-statement format notes for Netmend SEO pages.
# Facts checked on 12 Nov 2026 from official help pages and (where the bank
# does not publish a layout) from current export headers documented by
# independent parsers. Layouts change: each page tells the reader to treat
# their own file as the authority.

BANKS = [
dict(
  slug="revolut",
  name="Revolut",
  short="Revolut",
  title="Convert Revolut bank statement PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert a Revolut PDF statement to CSV in your browser. Official Excel/CSV steps, columns (Type, Started Date, Fee, Balance), ISO timestamps and per-currency accounts.",
  h1="Convert a Revolut bank statement PDF to <span>CSV or Excel</span>",
  lead="Revolut can already give you a spreadsheet. Use that when you can. This page is for when you only have the PDF — and it explains the real columns, dates and fees so the file you import actually ties out.",
  region="Global, one statement per currency account",
  fmt="us", sep=",",
  date="PDF statements commonly print dates day-first (DD/MM/YYYY). The official Excel/CSV export uses timestamps such as 2026-09-02 10:02:51 (ISO date plus time).",
  decimal="CSV/Excel export: dot decimal (12.34 or 1,234.56). Headers follow the app language (English or e.g. Spanish Tipo, Producto, Fecha de inicio, Saldo).",
  download="""Official path, from Revolut Help (“Download an account statement for a specific currency”):
<ol>
<li>In the Revolut app, go to <b>Home</b>.</li>
<li>Below your balance, tap <b>Accounts</b> and select the currency.</li>
<li>Tap <b>More (…)</b> and select <b>Statement</b>.</li>
<li>Choose the timeframe and a document type (<b>PDF</b> or <b>Excel</b>) and tap <b>Generate</b>.</li>
</ol>
<p>The same flow exists in the web app at app.revolut.com. Revolut issues <b>one statement per currency</b>. Official statements include the account holder details, local and international BIC/IBAN, a balance summary, and pending, completed and reverted transactions, including Pocket transactions.</p>""",
  pdf="A Revolut PDF is the official document. Transaction lines typically show a date, a description, an amount and a running balance. Pending and reverted items can appear next to completed ones, which is why a mid-month PDF can list rows that never hit the closing balance.",
  csv="""The “Excel” option is a CSV (it is not a real .xlsx). Current exports use this header:
<code>Type,Product,Started Date,Completed Date,Description,Amount,Fee,Currency,State,Balance</code>
<ul>
<li><b>Amount</b> is signed: money out is negative.</li>
<li><b>Fee</b> is a separate column. An ATM fee is not included in Amount.</li>
<li><b>Started Date</b> is when the payment began; <b>Completed Date</b> is when it settled. A card payment on the 31st can complete in the next month.</li>
<li><b>State</b> may be COMPLETED, pending or reverted. Do not import pending or reverted rows as if they moved the balance.</li>
</ul>
<p>Revolut does not officially publish this layout and has changed it before. Compare the first row of your own file before you rely on a template.</p>""",
  tips="""<ul>
<li>If you can still generate the Excel/CSV, use that and skip the PDF.</li>
<li>When importing into Xero or similar, rewrite the timestamp as a plain date (DD/MM/YYYY or YYYY-MM-DD) and add each non-zero fee as its own row on the same date.</li>
<li>After a PDF conversion, add Amount + Fee and check the running Balance against the PDF.</li>
</ul>""",
  sources="Revolut Help, currency-account statements (help.revolut.com), checked 12/11/2026. CSV header from current exports documented by independent import guides the same day.",
  related=["wise","n26","monzo","barclays"],
  faqs=[
    ("Does Revolut already give me a CSV?","Yes. Choose Excel rather than PDF when you generate the statement. Use our converter only if you already have a PDF and cannot regenerate the file."),
    ("Why don’t the totals match?","Pending or reverted rows, or fees sitting in their own column, are the usual cause. Keep only COMPLETED rows and add Amount and Fee before you compare the balance."),
    ("Can I put several currencies in one file?","Not usefully. Download one statement per currency and keep them in separate sheets or files."),
  ],
),
dict(
  slug="wise",
  name="Wise",
  short="Wise",
  title="Convert Wise bank statement PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert a Wise PDF statement to CSV in your browser. Official CSV/XLSX steps, 23-column layout, DD-MM-YYYY dates and the 365-day limit.",
  h1="Convert a Wise statement PDF to <span>CSV or Excel</span>",
  lead="Wise already offers CSV, Excel, PDF and accounting formats. The trap is the date column: 03-09-2026 is 3 September, not 9 March. This page shows the official download path, the real columns, and how to convert a PDF when that is all you have.",
  region="Global, one statement per currency or jar",
  fmt="us", sep=",",
  date="The official CSV writes dates day-first as DD-MM-YYYY with no locale marker (03-09-2026 is 3 September 2026). A generic spreadsheet in a US locale will swap any day below 13 into the wrong month. PDF statements follow the language you pick when you generate the file.",
  decimal="Official CSV: comma-separated, dot decimals (1234.56). European Excel may still split columns wrongly if you double-click the file — use Data → From Text/CSV.",
  download="""Official path, from the Wise Help Centre (“How do I download a statement?”):
<ol>
<li>Open the currency or jar, or click your initials and choose <b>Statements and reports</b> → <b>Statements</b>.</li>
<li>Select <b>Create a statement</b>. You can choose currencies or jars, a period, a file format and a language.</li>
<li>Enter your Wise password to confirm. For accounting statements, tick the box to show fees separately.</li>
</ol>
<p>Formats on the web: PDF, XLSX, CSV, MT940, QIF or CAMT.053 (version 10). In the app: PDF, CSV and XLSX. <b>Each statement covers at most 365 days</b> — longer periods need several files. Statements only include activity on Wise currency accounts (not payments made with an external card). You can stamp and sign a PDF after address verification.</p>""",
  pdf="A Wise PDF is the official branded statement for one balance (or several, if you selected more than one currency). It lists the period, opening and closing balances, and the transactions for that balance. Descriptions often wrap onto a second line; card merchants can be buried inside a sentence.",
  csv="""A typical personal CSV is comma-separated with around 23 columns. The first line looks like:
<code>\"TransferWise ID\",Date,\"Date Time\",Amount,Currency,Description,\"Payment Reference\",\"Running Balance\",\"Exchange From\",\"Exchange To\",\"Exchange Rate\",\"Payer Name\",\"Payee Name\",\"Payee Account Number\",Merchant,\"Card Last Four Digits\",\"Card Holder Full Name\",Attachment,Note,\"Total fees\",\"Exchange To Amount\",\"Transaction Type\",\"Transaction Details Type\"</code>
<ul>
<li><b>Date</b> is the completion date, day-first (DD-MM-YYYY).</li>
<li><b>Amount</b> is signed. <b>Total fees</b> is a separate column.</li>
<li><b>Merchant</b> usually holds a cleaner shop name than Description.</li>
<li>Business exports may add columns such as Batch ID or Reference.</li>
</ul>
<p>Do not open the CSV “to tidy the dates” in Excel before you import it — that is the edit that most often silently rewrites 03-09 into 9 March.</p>""",
  tips="""<ul>
<li>Prefer the official CSV or XLSX over a PDF conversion whenever you can still log in.</li>
<li>Download each currency separately, or generate a multi-currency zip from Statements and keep the files apart.</li>
<li>If you only have the PDF, set this tool to UK/US numbers and a comma CSV, then check a date after the 12th of the month so you can see whether the day and month landed the right way round.</li>
</ul>""",
  sources="Wise Help Centre, “How do I download a statement?” (wise.com/help), checked 12/11/2026. CSV columns and the day-first Date trap documented from current Wise exports the same day.",
  related=["revolut","n26","monzo","barclays"],
  faqs=[
    ("Does Wise already export CSV?","Yes — and also XLSX, MT940, QIF and CAMT.053 on the web. Convert a PDF only when that official export is no longer available."),
    ("Why are my months wrong after I open the file?","Wise writes 03-09-2026 for 3 September. Excel in a US locale reads that as 9 March. Import the column as text or day-first, or look at a date on the 13th or later to see the real order."),
    ("Can I get more than a year in one file?","No. Official statements are capped at 365 days. Create several statements and concatenate them after you have checked each period."),
  ],
),
dict(
  slug="n26",
  name="N26",
  short="N26",
  title="Convert N26 bank statement PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert an N26 Kontoauszug or bank statement PDF to CSV in your browser. Official monthly PDF and custom CSV activity report, date and number formats, Spaces.",
  h1="Convert an N26 bank statement PDF to <span>CSV or Excel</span>",
  lead="N26 gives you a monthly PDF and, on the web, a custom activity report as PDF or CSV. This page follows the official download path and explains how English and German statements differ, including the number format quirk.",
  region="EEA (N26 Bank GmbH); statements follow the app language",
  fmt="auto", sep=",",
  date="English-language PDFs commonly print dates as DD/MM/YYYY. German-language PDFs may use DD.MM.YYYY. The period is written on the first page (Statement period / Kontoauszug).",
  decimal="This is the quirk: although N26 is a German bank, many English (and some PDF) statements use a dot decimal (1,234.56), not German 1.234,56. German-market files can still use a comma decimal. If amounts look 100 times too large or too small, switch this tool from “Detect automatically” to European or UK/US and convert again.",
  download="""Official path, from N26 Support (“How to get a bank statement”):
<p><b>Monthly balance statements (PDF)</b></p>
<ol>
<li>In the app: <b>Finances</b> → choose the account or Space → gear icon → <b>Balance statements</b> → pick the month.</li>
<li>On the web: Home → the account or Space → <b>Downloads</b> → under <b>Bank statements</b>, pick the month. You can also go via Spaces → Settings.</li>
</ol>
<p><b>Account activity report (custom dates, PDF or CSV)</b> — on the web only:</p>
<ol>
<li>Home → the account or Space → <b>Downloads</b>.</li>
<li>Under <b>Account Activity</b>, enter start and end dates, choose PDF or CSV, and download.</li>
</ol>
<p>N26 says these documents are official and valid without a signature or stamp. They show your name, IBAN and BIC.</p>""",
  pdf="""Monthly PDFs are headed “Bank Statement” (English) or “Kontoauszug” (German). A summary lists Opening Balance / Anfangssaldo and Closing Balance / Schlusssaldo. Transaction lines typically contain:
<ul>
<li>Date</li>
<li>Description (merchant or counterparty; German files may attach an N26 category)</li>
<li>Amount, often with an explicit sign and the currency (for example <code>-EUR 38.75</code>)</li>
<li>Running balance</li>
</ul>
<p>Transfers to and from Spaces appear in the same list as spending. Treat Space transfers as movements between your own pots, not as income or expenses, if you are building a budget.</p>""",
  csv="Prefer the official Account Activity CSV when you can still log in on the web: it already has rows you can open in Excel. Use our converter for monthly PDFs you were sent, or for months where the CSV is no longer offered.",
  tips="""<ul>
<li>Try “Detect automatically” first. If the amounts are wrong, force European (1.234,56) or UK/US (1,234.56) and compare the closing balance.</li>
<li>Download Spaces separately if you need to exclude internal transfers.</li>
<li>Scanned or photographed statements need the paid service — this tool only reads a real text layer.</li>
</ul>""",
  sources="N26 Support EU, “How to get a bank statement” (support.n26.com), checked 12/11/2026. PDF column and number-format notes from current English and German statement layouts documented the same day; number format can follow the statement language, so always check a known amount.",
  related=["revolut","wise","deutsche-bank","ing"],
  faqs=[
    ("Does N26 already give me a CSV?","Yes, as an Account Activity report on the web, for a date range you choose. Monthly balance statements are PDF only."),
    ("Is the number format German or US?","It depends on the file. Many English N26 PDFs use 1,234.56 even though the bank is German. If a total is clearly wrong, switch the number format in the tool and convert again."),
    ("Are Space transfers real spending?","They move money between your own N26 Spaces. Flag them so they don’t inflate income or expenses."),
  ],
),
]
