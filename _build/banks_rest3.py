REST3 = [
dict(
  slug="lloyds",
  name="Lloyds Bank",
  short="Lloyds",
  title="Convert Lloyds Bank statement PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert a Lloyds Bank UK statement PDF to CSV. Official PDF from Statement options, transaction CSV (Date, Type, Money In, Money Out, Balance), DD/MM/YYYY dates.",
  h1="Convert a Lloyds Bank statement PDF to <span>CSV or Excel</span>",
  lead="Lloyds lets you save an official statement as a PDF and, on the desktop site, export transactions as CSV or QIF. Use the export for Excel work. This page covers both files and the PDF columns for older periods.",
  region="United Kingdom (Lloyds Bank)",
  fmt="us", sep=",",
  date="Dates are day-first DD/MM/YYYY in both the PDF and the usual transaction CSV.",
  decimal="UK format: 1,234.56. Choose UK/US numbers and a comma CSV.",
  download="""Official PDF, from Lloyds Bank (“Download statements”):
<ol>
<li>App: log in, select the account, open the three-dot menu, then <b>Download or print statement</b>.</li>
<li>Online banking: from the account page open <b>Statement options</b> and choose to print, download or order a paper copy (paper copies can take up to ten working days).</li>
</ol>
<p>Lloyds says online banking keeps statements for up to seven years, and the app for at least ten. Credit-card PDFs may need the app or a request via chat — they are not always in the same online-banking menu as current accounts.</p>
<p>For a spreadsheet of transactions, use the desktop <b>Export transactions</b> option (CSV or QIF) on the account, for a date range the bank still offers.</p>""",
  pdf="A typical Lloyds current-account PDF lists Date, Description (and often a Type), Money In, Money Out and Balance. Only one of Money In or Money Out is filled on each row. Opening and closing balances sit in the statement header and should be used to check the file after conversion.",
  csv="The official transaction CSV commonly has Date, Description, Type, Money In (£), Money Out (£) and Balance (£). Prefer that file. Use our converter for PDF statements, or for a period the export no longer covers.",
  tips="""<ul>
<li>Keep the PDF as the official document even when you work from the CSV.</li>
<li>Credit-card statements have a different layout (payment due, interest). Convert them to a separate sheet.</li>
</ul>""",
  sources="Lloyds Bank, “Download statements” (lloydsbank.com/help-guidance/everyday-banking/statements/download-statements.html), checked 12/11/2026. CSV columns (Date, Description, Type, Money In, Money Out, Balance) from current UK exports the same day.",
  related=["barclays","hsbc","natwest","santander","monzo"],
  faqs=[
    ("Does Lloyds offer a CSV?","Yes, via Export transactions on the desktop site (CSV or QIF). Official monthly statements are PDFs."),
    ("How far back can I go?","Lloyds says up to seven years in online banking and at least ten in the app, for statements. Transaction exports usually cover a shorter window."),
    ("Money In / Money Out or one Amount?","The bank uses two columns. Our tool gives a signed Amount (money out negative) plus Balance."),
  ],
),
dict(
  slug="natwest",
  name="NatWest",
  short="NatWest",
  title="Convert NatWest bank statement PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert a NatWest statement PDF to CSV. Official PDF statements, transaction CSV (Date, Type, Description, Paid In, Paid Out, Balance) and DD/MM/YYYY dates.",
  h1="Convert a NatWest statement PDF to <span>CSV or Excel</span>",
  lead="NatWest official statements are PDFs. You can also export recent transactions as a CSV from Online Banking. This page shows both paths and the columns you should expect, so a PDF-only period still becomes a usable sheet.",
  region="United Kingdom (NatWest). Royal Bank of Scotland statements are similar but not identical.",
  fmt="us", sep=",",
  date="Dates are day-first DD/MM/YYYY in the PDF and in the usual transaction CSV.",
  decimal="UK format: 1,234.56. Choose UK/US numbers and a comma CSV.",
  download="""Official statements: in the NatWest app or Online Banking, open <b>Statements</b> (or View statements) for the account and download the monthly PDF. NatWest Help covers requesting a copy if a period is missing.
<p>For a spreadsheet of recent transactions, from Online Banking:</p>
<ol>
<li>Go to <b>Statements &amp; transactions</b> → <b>View transactions</b>.</li>
<li>Choose the account and a date range.</li>
<li>Export as <b>CSV</b>.</li>
</ol>
<p>That export is not a substitute for the official monthly PDF when you need a legal statement.</p>""",
  pdf="A typical NatWest current-account PDF lists Date, Type, Description, Paid In, Paid Out and Balance. Only one of Paid In or Paid Out is filled on each row. References can wrap under the description.",
  csv="The official transaction CSV commonly uses Date, Type, Description, Paid In, Paid Out and Balance, with DD/MM/YYYY dates. Prefer it for any period the bank still lets you export. Use our converter for older PDFs or for files a client emailed you.",
  tips="""<ul>
<li>If you also have an RBS or Ulster Bank statement, treat it as a sibling layout: check the header row rather than reusing a NatWest template blindly.</li>
<li>After conversion, check Paid In − Paid Out against the change in Balance, and against the PDF’s opening and closing figures.</li>
</ul>""",
  sources="NatWest Support Centre pages on viewing statements and on transaction details (natwest.com), checked 12/11/2026. CSV/PDF columns (Date, Type, Description, Paid In, Paid Out, Balance; DD/MM/YYYY) from current UK layouts the same day.",
  related=["lloyds","barclays","hsbc","santander","monzo"],
  faqs=[
    ("Can I get a CSV from NatWest?","Yes, from View transactions in Online Banking, for a date range the bank still offers. Official statements remain PDFs."),
    ("Is this the same as Royal Bank of Scotland?","Close, but not a promise. Check the header row of the RBS file before you reuse a NatWest mapping."),
    ("Why doesn’t the CSV cover four years?","Transaction exports are usually limited to a recent window. Older months have to come from the PDF archive — that is what this converter is for."),
  ],
),
dict(
  slug="chase",
  name="Chase",
  short="Chase",
  title="Convert Chase bank statement PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert a Chase US statement PDF to CSV. Official CSV activity download (MM/DD/YYYY, signed Amount), checking vs credit-card columns, and PDF statements.",
  h1="Convert a Chase bank statement PDF to <span>CSV or Excel</span>",
  lead="Chase already lets you download account activity as a CSV, and official monthly statements as PDFs. The CSV is almost always the better starting point — but checking and credit-card files do not use the same columns, and dates are US-style MM/DD/YYYY.",
  region="United States (JPMorgan Chase). Not Chase UK.",
  fmt="us", sep=",",
  date="US format MM/DD/YYYY in both the activity CSV and the PDF (for example 11/12/2026 is 12 November, not 11 December). A day-first spreadsheet will swap any day below 13.",
  decimal="US format: 1,234.56 (comma thousands, dot decimal). Amounts in the official CSV are signed: withdrawals and purchases are negative, deposits and payments are positive.",
  download="""<p><b>Activity CSV</b> (the file you want for Excel):</p>
<ol>
<li>Sign in at chase.com and open the account.</li>
<li>In Account Activity, use the download icon (or, in some views, Manage spending / Spending Planner → Download Transactions).</li>
<li>Choose <b>Spreadsheet (CSV)</b> or Excel, pick the account and date range, and download.</li>
</ol>
<p>The exact label moves around as Chase updates the site; look for Download next to the activity list. Searching the account first can be required before a longer date range appears.</p>
<p><b>Official PDF statement:</b> Main Menu → <b>Statements &amp; documents</b> → select the account and year → save the statement PDF.</p>""",
  pdf="A Chase checking or savings PDF is the official monthly statement (beginning balance, deposits, withdrawals, ending balance, cheque numbers). Transaction dates are MM/D or MM/DD/YYYY depending on the line. Credit-card PDFs add a post date, a category and a payment-due section — do not mix them with checking in one file.",
  csv="""Checking/savings activity CSV typically has:
<code>Details, Posting Date, Description, Amount, Type, Balance, Check or Slip #</code>
Credit-card CSV typically has:
<code>Transaction Date, Post Date, Description, Category, Type, Amount</code>
and sometimes Memo. Amount is signed. Prefer this official CSV. Use our PDF converter when the activity download will not cover the months you need, or when a client only sent the PDF.""",
  tips="""<ul>
<li>Never assume a “Chase” file is UK-style. Chase UK is a different bank.</li>
<li>Import dates as MM/DD/YYYY or as text, then check a date after the 12th.</li>
<li>If QBO’s bank feed misses authorised users on a card, the official activity CSV (or the PDF) is the fallback — see our note in the FAQ.</li>
</ul>""",
  sources="Chase public pages on paperless statements and Account Activity (chase.com), checked 12/11/2026. CSV column layouts for checking vs credit cards from current Chase activity exports the same day.",
  related=["bank-of-america","wells-fargo","revolut","wise"],
  faqs=[
    ("Does Chase already give me a CSV?","Yes, from Account Activity (Spreadsheet / CSV) for a date range the site still offers. Official monthly statements are PDFs."),
    ("Why are my dates in the wrong month?","Chase uses MM/DD/YYYY. 03/09/2026 is 9 March, not 3 September. Import as US dates, or look at a day after the 12th."),
    ("Checking and credit card in one file?","No. The headers are different (Posting Date and Balance vs Transaction Date and Post Date). Convert or download them separately."),
  ],
),
dict(
  slug="bank-of-america",
  name="Bank of America",
  short="Bank of America",
  title="Convert Bank of America statement PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert a Bank of America PDF to CSV, or tidy the official activity CSV (Date, Description, Amount, Running Bal, MM/DD/YYYY, with a summary block above the header).",
  h1="Convert a Bank of America statement PDF to <span>CSV or Excel</span>",
  lead="Bank of America offers an activity CSV and official PDF statements. The CSV is usable — once you delete the balance-summary block that sits above the real header. Dates are US MM/DD/YYYY.",
  region="United States (Bank of America)",
  fmt="us", sep=",",
  date="MM/DD/YYYY in the activity CSV and on the PDF (11/12/2026 is 12 November). Any day-first importer will swap dates before the 13th.",
  decimal="US format: 1,234.56. In the official checking/savings CSV, Amount is signed (withdrawals negative, deposits positive) and Running Bal is the running balance.",
  download="""<p><b>Activity CSV:</b> sign in, open the account, choose a date range in activity, and download a CSV or Excel file (often up to 18 months, depending on the product). Do this for each account.</p>
<p><b>Official PDF:</b> Statements &amp; Documents (or the Statements tab) → pick the account and period → download the monthly statement.</p>""",
  pdf="A Bank of America checking PDF is the official monthly statement: beginning balance, deposits, withdrawals, other credits or debits, and the ending balance, with transaction dates in US format. Credit-card statements are a different layout (transaction date, post date, payment due). Convert them separately.",
  csv="""A typical checking/savings activity CSV has the columns:
<code>Date, Description, Amount, Running Bal.</code>
<p>Important: the file often <b>starts with a balance-summary block</b> (account name, totals, a few blank rows) <b>before</b> the real header. If you import the file as-is, those lines become “transactions”. Delete everything above the Date, Description, Amount, Running Bal. row, then import. Amount is signed.</p>""",
  tips="""<ul>
<li>Open the CSV in a text editor first and find the real header row before you let Excel guess.</li>
<li>Import dates as MM/DD/YYYY. Check a transaction you remember on a day after the 12th.</li>
<li>Use our PDF converter when the activity download does not reach the months you need.</li>
</ul>""",
  sources="Current Bank of America activity CSV layout (Date, Description, Amount, Running Bal., with a summary block above the header) and MM/DD/YYYY dates, checked 12/11/2026. Download labels vary as the site is updated; look for Statements & Documents and for a download control on the activity list.",
  related=["chase","wells-fargo","revolut","wise"],
  faqs=[
    ("Why does my import start with a random total instead of a payment?","The CSV usually has a short summary above the header. Delete those rows so line 1 is Date, Description, Amount, Running Bal."),
    ("Is Amount signed?","Yes in the usual checking/savings export: withdrawals are negative."),
    ("How far back is the CSV?","Often around 18 months for activity, depending on the account. Older months come from the PDF archive."),
  ],
),
dict(
  slug="wells-fargo",
  name="Wells Fargo",
  short="Wells Fargo",
  title="Convert Wells Fargo bank statement PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert a Wells Fargo statement PDF to CSV, or tidy the official activity CSV (often no header: Date, Amount, *, check number, Description, MM/DD/YYYY).",
  h1="Convert a Wells Fargo statement PDF to <span>CSV or Excel</span>",
  lead="Wells Fargo’s activity CSV is easy to mis-import: it often has no header row, and the PDF transaction table may print the date as M/D without a year. This page shows the official files and how to convert a statement PDF safely.",
  region="United States (Wells Fargo)",
  fmt="us", sep=",",
  date="The activity CSV uses MM/DD/YYYY. Official PDF tables often print the transaction date as M/D (for example 11/12) with the year only in the statement-period header — add the year before you sort across January.",
  decimal="US format: 1,234.56. In the activity CSV, Amount is signed (debits negative, credits positive).",
  download="""<p><b>Activity CSV:</b> sign in, open the account, go to activity for a date range, and choose <b>Download Account Activity</b> (CSV). Do each account separately.</p>
<p><b>Official PDF:</b> <b>Statements &amp; Documents</b> → select the account and period → download the statement PDF, especially when you need months the activity download no longer covers.</p>""",
  pdf="A typical Wells Fargo checking PDF lists Date (often M/D, no year), Check Number, Description, Deposits/Credits, Withdrawals/Debits and an ending daily balance. Because the year may be missing on each line, a January statement that includes late December is the dangerous case. Credit-card statements differ — keep them in their own file.",
  csv="""The Download Account Activity CSV commonly has <b>no header row</b>. The columns, in order, are typically:
<code>Date, Amount, *, a check-number field (often blank), Description</code>
<p>There may be no running balance. Because there is no header, the first transaction is not a title row. Import with “no headers”, then name the columns yourself. Amount is signed.</p>""",
  tips="""<ul>
<li>Do not tick “My data has headers” until you have looked at row 1 of the official CSV.</li>
<li>When converting a PDF, add the year from the statement period to every date.</li>
<li>Use our converter for PDFs; do not run the official CSV through a PDF tool.</li>
</ul>""",
  sources="Current Wells Fargo activity CSV layout (no header; Date, Amount, *, check number, Description; MM/DD/YYYY; signed amounts) and PDF table notes, checked 12/11/2026. Menu labels vary; look for Download Account Activity and Statements & Documents.",
  related=["chase","bank-of-america","revolut","wise"],
  faqs=[
    ("Why is there no header in my CSV?","That is how Wells Fargo’s activity download is commonly built. Import with no headers and assign column names yourself."),
    ("The PDF date has no year. What do I do?","Take the year from the statement period. On a statement that spans December and January, assign the year line by line."),
    ("Is this the same as a Wells Fargo credit-card file?","No. Download or convert cards separately; the columns differ."),
  ],
),
dict(
  slug="deutsche-bank",
  name="Deutsche Bank",
  short="Deutsche Bank",
  title="Convert Deutsche Bank Kontoauszug PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert a Deutsche Bank Kontoauszug PDF to CSV. Buchungstag and Valuta, Soll/Haben, Saldo, TT.MM.JJJJ dates and German 1.234,56 decimals.",
  h1="Convert a Deutsche Bank Kontoauszug PDF to <span>CSV or Excel</span>",
  lead="Deutsche Bank official statements are Kontoauszüge in the online-banking mailbox. German Excel expects a decimal comma and a semicolon CSV. This page lists the usual columns so a converted file ties out to the Saldo.",
  region="Germany (Deutsche Bank). Other country sites differ.",
  fmt="eu", sep=";",
  date="Dates are TT.MM.JJJJ (DD.MM.YYYY), for both Buchungstag (booking date) and Wertstellung / Valuta (value date). They can differ. Do not read 03.04.2026 as 4 March.",
  decimal="German format: 1.234,56 (dot thousands, comma decimal). Choose “Excel in Europe” so the CSV uses a semicolon and a comma decimal.",
  download="""In Deutsche Bank Online-Banking or the app, open the mailbox / Postfach or the Kontoauszüge section and download the monthly PDF. That is the official document (Kontoauszug). Some movement views also offer a CSV or Excel export of recent Umsatz — if you have it, use that for spreadsheet work and keep the PDF as the legal statement.""",
  pdf="A typical German current-account Kontoauszug lists Buchungstag, Wertstellung/Valuta, Verwendungszweck (often several wrapped lines), Soll (debits), Haben (credits) and Saldo. Soll and Haben are separate columns, not a single signed number. The Verwendungszweck is where SEPA references and counterparty names sit; they must stay on the same row as the amount. Credit-card or depot statements are different documents.",
  csv="After conversion you want one row per booking, with both dates, the full Verwendungszweck, Soll, Haben (or a signed Amount) and Saldo. Our tool outputs Date, Description, Amount (Soll negative, Haben positive) and Balance. If a wrapped purpose line becomes a second transaction, try “Every text row” or send us the PDF.",
  tips="""<ul>
<li>Set European numbers and “Excel in Europe” before you convert.</li>
<li>Reconcile: opening Saldo + Haben − Soll = closing Saldo on the PDF.</li>
<li>This is the German Kontoauszug. Deutsche Bank in other countries uses other online banking and may use different date orders.</li>
</ul>""",
  sources="Current Deutsche Bank Kontoauszug layouts (Buchungstag, Valuta, Verwendungszweck, Soll, Haben, Saldo; TT.MM.JJJJ; 1.234,56), checked 12/11/2026. Download from Kontoauszüge / Postfach in Online-Banking.",
  related=["ing","n26","bbva","millennium-bcp"],
  faqs=[
    ("Buchungstag or Valuta?","Keep both. German bookkeeping often books on Buchungstag unless you are asked for Valuta."),
    ("Why does Excel show 1.234 as one thousand?","The number is German: 1.234,56 means one thousand. Use a semicolon CSV and a comma decimal (“Excel in Europe”)."),
    ("Does Deutsche Bank offer a native CSV?","Sometimes, from a Umsatz export in online banking. If you have it, use it. This tool is for the official Kontoauszug PDF."),
  ],
),
]
