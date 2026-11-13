# Bank-statement format notes, SEO round 2 (13/11/2026).
# Facts from official help pages. Layouts change: each page tells the
# reader to treat their own file as the authority.

BANKS2 = [
dict(
  slug="starling",
  name="Starling",
  short="Starling",
  title="Convert Starling bank statement PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert a Starling PDF statement to CSV in your browser. Official monthly True Copy PDFs, 12-month feed exports (PDF or CSV), and when to use each.",
  h1="Convert a Starling bank statement PDF to <span>CSV or Excel</span>",
  lead="Starling already offers a CSV — but it is a transaction summary, not the official monthly statement. This page shows the official download path, what changed in August 2026, and how to convert a True Copy PDF when that is the file you have.",
  region="United Kingdom (Starling Bank)",
  fmt="us", sep=",",
  date="UK statements are day-first (DD/MM/YYYY or a short date such as 12 Sep 2026). Confirm the first dated line on your own PDF or CSV before you import it.",
  decimal="Pound amounts with a dot decimal and optional comma thousands (1,234.56). Use a comma CSV for UK Excel or Google Sheets.",
  download="""Official path, from Starling Help (“How do I get my statements?”):
<ol>
<li>Open your account menu in the top right of the Starling app.</li>
<li>Tap <b>Statements and documents</b>, then <b>Statement history</b>.</li>
<li>Select the month or months you want, tap <b>Download statement</b>, and choose <b>PDF</b> or <b>Large print PDF</b>.</li>
</ol>
<p>Monthly statements cover full calendar months only. They are usually ready between the 4th and the 10th of the following month. If you select more than one month, Starling delivers them together in a ZIP file.</p>
<p>For a custom date range in the last 12 months, stay on Statement history and tap the <b>Go to feed exports</b> link. You can choose current month to date, last 3 full months, or a custom range, then PDF, large-print PDF or <b>CSV</b>.</p>""",
  pdf="From August 2026 Starling changed how statements appear in the app. Each official monthly PDF now carries a “True Copy” stamp at the top and a verifiable identification number, so a third party can confirm it with Starling. That PDF is the record: it is not the same file as a feed export. Transaction lines typically show the date, a description, the amount and a running balance, including fees such as overdraft or loan charges.",
  csv="""Starling still offers a CSV, but Help is explicit: a feed-export CSV is a <b>transaction summary, not a verifiable statement</b>. Use it for spreadsheets and accounting tools (Starling mentions Xero and FreeAgent on its statements feature page). Use the monthly True Copy PDF when a lender, landlord or accountant asks for an official statement.</p>
<p>Starling does not publish the CSV column layout on its Help pages. Open the first row of your own export and keep those headings. Do not assume it includes an opening and closing balance — that is why a conversion from the monthly PDF can still be useful: the PDF is the file you can tick against.</p>""",
  tips="""<ul>
<li>If you only need a spreadsheet of recent activity, generate the official CSV from feed exports and skip the PDF.</li>
<li>If you need a file that ties out, convert the monthly True Copy PDF and check every row against the printed opening and closing balance.</li>
<li>Several months download as a ZIP of PDFs, not one long statement — convert each month, then append the CSVs.</li>
<li>Pending card payments can appear in the app feed but not on a completed monthly statement. Do not mix the two without checking the dates.</li>
</ul>""",
  sources="Starling Help, “How do I get my statements?” (help.starlingbank.com) and Starling’s statements feature page, checked 13/11/2026.",
  related=["monzo","revolut","barclays","lloyds","halifax"],
  faqs=[
    ("Does Starling already give me a CSV?","Yes, from Statement history → Go to feed exports, as PDF, large-print PDF or CSV, for dates in the last 12 months. Starling says that file is a transaction summary, not a verifiable monthly statement."),
    ("What is the True Copy stamp?","From August 2026, official monthly PDFs carry a True Copy stamp and a statement identification number. A third party can use that number to confirm the document with Starling. Feed exports do not replace that."),
    ("Can I get a mid-month official statement?","Full monthly statements are calendar months only. For a custom range, use a feed export (PDF or CSV). That export is not the verifiable monthly statement."),
  ],
),
dict(
  slug="halifax",
  name="Halifax",
  short="Halifax",
  title="Convert Halifax bank statement PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert a Halifax PDF statement to CSV in your browser. Official Online Banking and app download steps, typical UK money-in/money-out columns, and when a PDF is all you have.",
  h1="Convert a Halifax bank statement PDF to <span>CSV or Excel</span>",
  lead="Halifax issues official statements as PDFs from Online Banking and the app. This page shows that download path, what the statement usually looks like, and how to turn a PDF you already saved into a spreadsheet that you can check against the printed balance.",
  region="United Kingdom (Halifax, Bank of Scotland plc / Lloyds Banking Group)",
  fmt="us", sep=",",
  date="UK day-first dates. Some Halifax PDFs print a short date such as 12 Sep 26 rather than 12/09/2026. If your spreadsheet is in a US locale, any day below 13 can be swapped into the wrong month — set the column to text or to DD/MM/YYYY before you import.",
  decimal="Pound sterling, dot decimal, comma thousands (1,234.56). Money in and money out are usually separate columns on the PDF, not a single signed amount.",
  download="""Official Halifax guidance, as reproduced in UK local-authority statement instructions that quote Halifax’s own “Download statements” steps (checked 13/11/2026; Halifax’s public how-to URL returned an error that day, so also trust the labels in your app):
<p><b>In the Halifax app:</b> sign in, select the account, open the three-dot account menu, choose <b>Download or print statement</b>, pick the statements, and follow the prompts. Paper copies are a separate “Order paper statements” option.</p>
<p><b>In Online Banking:</b> sign in, select the account, open <b>Statement options</b>, then print or download a copy.</p>
<p>Menu names change from time to time. If you also see an option to export transactions from Online Banking on a computer, use it when it covers the dates you need. Halifax does not publish a public official guide to a CSV export, so treat the on-screen export dialog as the authority.</p>""",
  pdf="A Halifax current-account PDF is the official monthly document. In the Lloyds Banking Group family, the transaction table commonly prints Date, Description, Type, Money in, Money out and Balance, sometimes with (£) after a heading. Type codes such as DD, DEB or FPI often sit in their own column or at the start of the description. Confirm the headings on the first page of your own file — layouts change, and credit-card statements are a different document (Halifax tells card customers to open the full PDF, not just the summary).",
  csv="""Halifax’s official statement is the PDF. There is no public official description of a Halifax CSV layout. If Online Banking offers an export, open the first row and keep those headings. After a PDF conversion, prefer columns that match the printed table (date, description, type if present, money in, money out, balance) so you can tick each row against the statement.</p>
<p>Do not add money in and money out into the same cell until you have checked the running balance. A blank in one of the two amount columns is normal.</p>""",
  tips="""<ul>
<li>Lenders usually want the official PDF, not a spreadsheet. Convert the PDF for bookkeeping; send the PDF when a third party asks for “your statements”.</li>
<li>After conversion, opening balance + money in − money out should equal the closing balance on that statement. If it does not, a wrapped description or a summary block has probably been read as a transaction.</li>
<li>Credit-card PDFs list payments, fees and interest as well as purchases. Those are not current-account rows — keep them in a separate file.</li>
</ul>""",
  sources="Halifax download steps as quoted from Halifax’s own “Download statements” guide in a UK local-authority bank-statement instructions pack, and Halifax “Understanding Your Credit Card Statement”, checked 13/11/2026. Halifax’s public how-to URL was unavailable that day.",
  related=["lloyds","nationwide","tsb","barclays","santander"],
  faqs=[
    ("Does Halifax give me a CSV?","The official statement is a PDF from the app or Online Banking. Some Online Banking screens also offer a transaction export; Halifax does not publish a public official CSV guide, so use that export only if you can see it, and keep the first row as your template."),
    ("Why is a date such as 5 Mar 26 showing as May?","The PDF is day-first. A spreadsheet in a month-first locale will swap any day below 13. Set the date column to DD/MM/YYYY or to text before you save the CSV."),
    ("Can I convert a photographed statement?","Not reliably with this tool. It reads the text layer of a digital PDF. A photo or a scan is an image, and needs to be typed or sent as a done-for-you job."),
  ],
),
dict(
  slug="nationwide",
  name="Nationwide",
  short="Nationwide",
  title="Convert Nationwide bank statement PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert a Nationwide PDF statement to CSV in your browser. Official midata transaction download (12 months, last 31 days excluded) versus the official PDF statement.",
  h1="Convert a Nationwide statement PDF to <span>CSV or Excel</span>",
  lead="Nationwide already lets you download current-account transactions as midata, but that file is not your official statement and it deliberately leaves out the last 31 days. This page explains both official downloads and how to convert a PDF statement when you need the printed months.",
  region="United Kingdom (Nationwide Building Society)",
  fmt="us", sep=",",
  date="UK day-first dates on statements. midata files are built for comparison sites; do not tidy the date column in Excel before you know whether the file uses DD/MM/YYYY or another format — open it as text first.",
  decimal="Pound sterling, dot decimal. A European Excel that double-clicks a comma CSV may split columns wrongly — use Data → From Text/CSV.",
  download="""Two official downloads, and they are not the same file.</p>
<p><b>Official PDF statements</b> are available in the Internet Bank and the Nationwide app after you sign in. Look for <b>Statements</b> or <b>Documents</b> / <b>My Documents</b> — Nationwide’s public pages confirm that statements can be viewed, downloaded and printed there, including (if you registered in time) historical statements after an account is closed. The exact menu label can change; trust the labels you see once you are signed in.</p>
<p><b>midata transaction download</b>, from Nationwide’s official “About midata” page, is only on the Internet Bank (not the app), and only for current accounts:</p>
<ol>
<li>Log in to the Internet Bank on a Windows or Mac computer.</li>
<li>Select the current account.</li>
<li>Under <b>Transactions</b>, choose <b>Download transactions</b>.</li>
<li>Choose <b>Download midata</b>.</li>
</ol>
<p>The midata file covers up to 12 months of current-account transactions and <b>excludes the 31 days before the download</b>. Nationwide does this because recent transactions are sometimes used to confirm identity. If you have less than 12 months of history, you get what you have, minus those 31 days.</p>""",
  pdf="The PDF is the official statement for that account and period. It includes the society’s branding, the account details and the transactions that belong on that statement. A month with a zero balance and no transactions may not produce a statement at all. Do not treat a midata file as a substitute for this PDF if a lender or a tax enquiry asks for statements.",
  csv="""midata is a government-backed current-account download aimed at comparison providers, not a statement export. Nationwide asks you to send the file in its original format and not to resave it as another type if you are using a comparison site. Nationwide does not publish the column layout on that help page — open the first row of your own file.</p>
<p>For bookkeeping, midata is still useful for the months it covers, with one gap you must not ignore: the most recent 31 days are missing by design. For those days, or for older statement PDFs, convert the official PDF and check the totals against the printed balance.</p>""",
  tips="""<ul>
<li>Need the last month for a mortgage pack? Use the official PDF. midata will not include the last 31 days.</li>
<li>Need a year of current-account transactions for a comparison site? Use midata, and do not edit the file first.</li>
<li>Closed accounts: you must register for online access to historical statements within 6 months of closure (accounts closed on or after 2 February 2018); Nationwide describes up to 5 years of statements in that process.</li>
</ul>""",
  sources="Nationwide, “About midata” (nationwide.co.uk/help/online-banking-help/about-midata) and “Accessing statements for a closed bank account”, checked 13/11/2026.",
  related=["halifax","lloyds","natwest","barclays","tsb"],
  faqs=[
    ("Can I download a Nationwide statement as CSV?","You can download current-account transactions as midata from the Internet Bank (Transactions → Download transactions → Download midata). That is not the official statement, and it excludes the last 31 days. Statements themselves are PDFs."),
    ("Why are the last few weeks missing from my midata file?","Nationwide leaves out the 31 days before the download on purpose, because some firms use recent transactions to confirm identity. Download the latest PDF statement for those days."),
    ("Does midata include savings or credit cards?","Nationwide’s midata page says it is currently only for current accounts."),
  ],
),
dict(
  slug="tsb",
  name="TSB",
  short="TSB",
  title="Convert TSB bank statement PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert a TSB PDF statement to CSV in your browser. Official Digital Inbox download steps, paperless PDFs, and how to turn a statement you already saved into a spreadsheet.",
  h1="Convert a TSB bank statement PDF to <span>CSV or Excel</span>",
  lead="TSB keeps official statements as PDFs in your Digital Inbox, in the app and in Internet Banking. This page follows TSB’s own how-to, then shows how to convert a PDF you have already downloaded when a spreadsheet is what you need.",
  region="United Kingdom (TSB Bank)",
  fmt="us", sep=",",
  date="UK day-first dates. A US-locale spreadsheet will swap days below 13. Set the date column to DD/MM/YYYY or to text before you import.",
  decimal="Pound sterling, dot decimal, optional comma thousands. Transaction tables usually split money in and money out.",
  download="""Official path, from TSB’s “View and download statements” how-to, in the app:
<ol>
<li>Tap the profile icon.</li>
<li>Tap <b>Inbox</b>.</li>
<li>Find and tap the statement.</li>
<li>Tap the download icon (TSB notes this can look different depending on your device).</li>
</ol>
<p>The same Digital Inbox exists in Internet Banking: after you sign in, open <b>Your Inbox</b> at the top right. TSB’s paperless pages say statements and correspondence are held there as PDFs that look the same as the paper versions, and that TSB will not alter or delete items in the Inbox. You can go paperless for some accounts and not others. A duplicate paper copy of a current or savings statement may be charged — see TSB’s charges guide if you order one.</p>
<p>TSB’s public how-to covers the PDF in the Inbox, not a spreadsheet export. If you see an <b>Export</b> control at the bottom of a transaction list in Internet Banking on a computer, that is a separate, on-screen tool: use it if it covers your dates, and treat its format list as the authority. We could not find a TSB Help article that documents a CSV layout.</p>""",
  pdf="A TSB statement PDF from the Digital Inbox is the official document: branding, account details, the period, and the transactions for that period. Descriptions can wrap onto a second line, and payment-type codes may sit beside the description. Credit-card or savings statements, if you have them, are separate Inbox items — do not merge them with a current-account conversion without labelling the source.",
  csv="""There is no official public TSB CSV specification. After a PDF conversion, keep columns that you can tick against the printed statement: date, description, money in, money out and balance where those headings exist. Opening balance plus money in minus money out should match the closing balance on that statement.</p>
<p>If you used an on-screen transaction export instead, do not assume it includes the opening and closing balance printed on the official PDF.</p>""",
  tips="""<ul>
<li>For a mortgage or tenancy pack, download the Inbox PDFs. A spreadsheet is for you or your bookkeeper, not a substitute for the official statement.</li>
<li>Check the Inbox regularly if you are paperless — TSB emails you when something new arrives, but the record lives in the Inbox, not in that email.</li>
<li>Convert one statement at a time, then append the CSVs, so a missed page is obvious when the balances do not chain from one month to the next.</li>
</ul>""",
  sources="TSB, “View and download statements” (tsb.co.uk/help-and-support/how-to/view-and-download-statements.html) and TSB paperless / Digital Inbox help, checked 13/11/2026.",
  related=["lloyds","halifax","barclays","natwest","nationwide"],
  faqs=[
    ("Where are my TSB statements?","In the Digital Inbox: profile icon → Inbox in the app, or Your Inbox at the top right of Internet Banking. Download the PDF from there."),
    ("Does TSB give me a spreadsheet?","TSB’s public how-to only documents the PDF. If Internet Banking shows an Export control on the transaction list, you can use it, but TSB does not publish a CSV layout — check the first row of that file."),
    ("Are Inbox PDFs the same as paper statements?","TSB says paperless documents are in PDF format and look exactly the same as the paper versions."),
  ],
),
dict(
  slug="capital-one",
  name="Capital One",
  short="Capital One",
  title="Convert Capital One bank statement PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert a Capital One PDF statement to CSV in your browser. Official paperless statements (up to 7 years), when they appear, and how to turn a PDF you already have into a spreadsheet.",
  h1="Convert a Capital One statement PDF to <span>CSV or Excel</span>",
  lead="Capital One’s official record is the online statement PDF — up to seven years for active accounts, once you are enrolled in paperless statements. This page follows Capital One’s own help, then shows how to convert that PDF when a spreadsheet is what you need.",
  region="United States (Capital One, N.A.). Other Capital One countries differ.",
  fmt="us", sep=",",
  date="US statements are month-first (MM/DD/YYYY or a short date such as Jan 06, 2026). A day-first spreadsheet locale will swap any day below 13. Set the date column to MM/DD/YYYY or to text before you import.",
  decimal="US dollar, dot decimal, comma thousands (1,234.56). Use a comma-separated CSV.",
  download="""Official path, from Capital One Help (“Online bank statements”):
<p><b>On the website:</b> sign in at capitalone.com, click the account, then click <b>view statements</b>.</p>
<p><b>In the Capital One Mobile app:</b> sign in, tap the account, scroll to the bottom of the page and tap <b>statements</b>.</p>
<p>You need to be enrolled in paperless statements to view them online. Bank statements are typically generated online by the 6th of each month. Savings products are generated quarterly if there is no activity to prompt a monthly statement. Direct accounts are automatically combined into one statement. Capital One says you can view up to seven years of statements online for active accounts.</p>
<p>That help page documents the official PDF statement, not a spreadsheet export. If you see a download or activity-export control on the desktop site, use it when it covers your dates, and treat that dialog as the authority — Capital One does not publish a public official CSV layout for US checking and savings on this page.</p>""",
  pdf="The official Capital One statement is a PDF. It typically includes the account summary, the period, and the transactions that belong on that statement. Combined Direct-account statements put more than one product on the same document — do not treat every line as a single-account transaction without checking which product it belongs to. Credit-card statements, if you have a Capital One card, are a separate product with a different layout (payments reduce the card balance; do not import them into a checking account).",
  csv="""Capital One does not publish a public official CSV specification for US bank statements on its online-statements help page. After a PDF conversion, keep columns you can tick against the printed statement: date, description, amount or debit/credit, and balance where it is printed. Check the opening and closing balances before you import the file anywhere.</p>
<p>If you used an on-screen activity export, it may be a live transaction list rather than the official monthly statement, and it may not include the statement’s running balance. Compare it with the PDF before you rely on it.</p>""",
  tips="""<ul>
<li>If you are not enrolled in paperless statements, do that first — Capital One’s help says you need it to view statements online.</li>
<li>A January statement may not appear until about the 6th. Do not assume the PDF is missing until after that date.</li>
<li>For a tax year, download each monthly PDF and convert them one by one so a missed page shows up when the balances do not chain.</li>
</ul>""",
  sources="Capital One Help, “Online bank statements” (capitalone.com/help-center/checking-savings/online-statements/), checked 13/11/2026.",
  related=["chase","bank-of-america","wells-fargo","us-bank","american-express"],
  faqs=[
    ("How far back can I get Capital One statements?","Capital One says you can view up to seven years of statements online for active accounts, once you are enrolled in paperless statements."),
    ("When is the new statement ready?","Typically generated online by the 6th of each month. Savings products may be quarterly if there is no activity."),
    ("Does Capital One give me a CSV of my statement?","The official document described in Capital One’s online-statements help is the PDF. If the desktop site offers a separate activity download, use it if you can see it, but treat that dialog as the authority — there is no public official CSV layout on that help page."),
  ],
),
dict(
  slug="citibank",
  name="Citibank",
  short="Citibank",
  title="Convert Citibank statement PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert a Citibank (Citi) US PDF statement to CSV in your browser. Where official statements live in Citi Online, and how to turn a PDF you already have into a spreadsheet.",
  h1="Convert a Citibank statement PDF to <span>CSV or Excel</span>",
  lead="Citi’s official statements are PDFs in Citi Online. Unlike some US banks, Citi does not publish a clear public how-to for a personal-account CSV export. This page tells you where the official PDF lives, what to watch for, and how to convert it when a spreadsheet is what you need.",
  region="United States (Citibank, N.A. / Citi Online). Other Citi countries use different sites and formats.",
  fmt="us", sep=",",
  date="US statements are month-first (MM/DD/YYYY). A day-first locale will swap days below 13. Set the date column to MM/DD/YYYY or to text before you import.",
  decimal="US dollar, dot decimal, comma thousands. Use a comma-separated CSV.",
  download="""Official statements and other documents are held in <b>Citi Online</b> under Statements and Documents (Citi’s servicing page for statements and document services). After you sign in, open the account and look for <b>Statements</b> or <b>Statements and Documents</b>, then download the PDF for the period you need.</p>
<p>Citi does not publish a clear, public, step-by-step guide for a US personal-account CSV or OFX export on a help page we could open on 13/11/2026. If you see a download or “download account activity” control once you are signed in, use it when it covers your dates, and treat the formats listed in that dialog as the authority. For anything a lender or accountant will rely on, keep the official PDF as well.</p>
<p>This page is for US Citi Online. Citibank sites in other countries (and Citi commercial / CitiManager card portals) use different menus and file types — do not follow these notes there.</p>""",
  pdf="A Citi statement PDF is the official monthly document: account details, the period, a summary, and the transactions for that period. Credit-card and deposit-account statements are different products. Pending or authorised-but-not-posted items can appear in the live activity view and not on the statement, or the other way around — always convert the PDF you were given, not a screenshot of the activity feed.",
  csv="""There is no official public Citi CSV layout for US personal accounts that we could cite. After a PDF conversion, keep date, description, amount or debit/credit, and the running balance where it is printed. Tick the opening and closing balances before you import the file.</p>
<p>If you did get an on-screen activity export, compare the first and last dates and the total of the rows with the official PDF. An activity export is not automatically the same thing as the statement.</p>""",
  tips="""<ul>
<li>Use the official PDF for anything a third party will rely on. Convert it for bookkeeping.</li>
<li>Do not mix a checking statement and a Citi card statement in one spreadsheet without a column that names the account.</li>
<li>Older or archived statements may take time to become available after you request them — if a PDF is missing, wait and try again in Citi Online before assuming it is gone.</li>
</ul>""",
  sources="Citi Online statements and document services (online.citi.com, Statements and Documents), checked 13/11/2026. No public official US personal CSV specification was available that day; on-screen export labels, if present, take precedence.",
  related=["chase","bank-of-america","wells-fargo","capital-one","us-bank"],
  faqs=[
    ("Does Citibank give me a CSV?","Not in any public official how-to we could cite for US personal accounts. Official statements are PDFs in Statements and Documents. If you see a download control on account activity, use it and keep the first row of that file as your template."),
    ("Is this the same as Chase or Citibank in another country?","No. This page is for US Citi Online. Other Citi countries, and Chase (JPMorgan Chase), are different banks with different files."),
    ("Can I convert a screenshot of Citi activity?","No. This tool needs a digital PDF with a text layer. A screenshot is an image."),
  ],
),
dict(
  slug="us-bank",
  name="U.S. Bank",
  short="U.S. Bank",
  title="Convert U.S. Bank statement PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert a U.S. Bank PDF statement to CSV in your browser. Official e-statements (up to 7 years) and official transaction downloads as CSV, QFX or QBO (up to 3 years, desktop only).",
  h1="Convert a U.S. Bank statement PDF to <span>CSV or Excel</span>",
  lead="U.S. Bank already gives you a spreadsheet: you can download up to three years of transactions as CSV, QFX or QBO in online banking. This page shows that official path, how it differs from the seven-year e-statement PDF, and how to convert a PDF when the download does not go back far enough.",
  region="United States (U.S. Bank). Not USB overseas branches.",
  fmt="us", sep=",",
  date="US month-first dates (MM/DD/YYYY). Set the date column to that format or to text before a day-first Excel locale can swap the days.",
  decimal="US dollar, dot decimal, comma thousands. Official spreadsheet download is a .CSV.",
  download="""Two official files, from U.S. Bank’s knowledge base.</p>
<p><b>E-statements (PDF)</b> — “How do I view, print and download electronic statements and other documents?”:</p>
<ol>
<li>In online banking, select <b>Accounts</b> from the top menu. In the U.S. Bank Mobile App, open the main menu and choose <b>Statements &amp; docs</b>.</li>
<li>Select the document type, then the account, then the year if you need older documents.</li>
<li>Open the link to view, print or download the document.</li>
</ol>
<p>You can view up to seven years of e-statements. The latest e-statement is available after the billing cycle closes. A certificate of deposit does not have regular statements (maturity notices and a year-end interest statement instead).</p>
<p><b>Transaction history download</b> — “How do I download my transaction history?”. This is <b>not available in the mobile app</b>. In online banking you can download up to three years, as Spreadsheet (<b>.CSV</b>), Quicken (<b>.QFX</b>) or QuickBooks (<b>.qbo</b>):</p>
<ol>
<li>Select the account.</li>
<li>In the Transactions tile, select the download icon in the upper-right corner.</li>
<li>Choose the date range and file format, then Download.</li>
</ol>
<p>For transactions more than three years old, U.S. Bank tells you to view your account statements (the PDFs). Direct Connect with bill pay for Quicken and QuickBooks is a separate enrolment.</p>""",
  pdf="The e-statement PDF is the official document for that cycle: summary, transactions, and the balances printed on that statement. It is the file to use when the three-year transaction download does not go back far enough, or when you need a document that shows the official closing balance.",
  csv="""Prefer the official CSV (or QBO for QuickBooks, QFX for Quicken) when the dates fit inside three years. U.S. Bank does not publish the CSV column names on that help page — open the first row of your own download. The official file is a transaction list; it may not include the statement’s printed opening and closing balance in the same way the PDF does.</p>
<p>After a PDF conversion, keep date, description, amount or debit/credit, and the running balance, and tick both printed totals before you import the file.</p>""",
  tips="""<ul>
<li>If you need a spreadsheet for the last three years, use U.S. Bank’s own CSV or QBO download on a computer. Skip the PDF.</li>
<li>If you need year four to seven, or a statement someone already sent you as a PDF, convert the e-statement and check the balances.</li>
<li>Do not look for the transaction download in the mobile app — U.S. Bank says it is not there.</li>
</ul>""",
  sources="U.S. Bank knowledge base, KB0073947 (electronic statements and documents) and KB0069323 (download transaction history), checked 13/11/2026.",
  related=["chase","wells-fargo","bank-of-america","pnc","capital-one"],
  faqs=[
    ("Does U.S. Bank already give me a CSV?","Yes. In online banking (not the app), open the account, use the download icon in the Transactions tile, and choose Spreadsheet (.CSV). Up to three years. QFX and QBO are offered too."),
    ("How far back are official PDFs?","Up to seven years of e-statements in digital banking. The latest one appears after the billing cycle closes."),
    ("Why can’t I download transactions in the app?","U.S. Bank’s help says transaction downloads are not available in the U.S. Bank Mobile App. Use online banking on a computer, or convert the PDF statement."),
  ],
),
dict(
  slug="pnc",
  name="PNC",
  short="PNC",
  title="Convert PNC bank statement PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert a PNC PDF statement to CSV in your browser. Official online statements (up to 7 years for checking), plus official QFX and QBO exports for Quicken and QuickBooks.",
  h1="Convert a PNC bank statement PDF to <span>CSV or Excel</span>",
  lead="PNC’s official statements are PDFs in Online Banking and the app — up to seven years for checking and savings. PNC also offers QFX and QBO exports for Quicken and QuickBooks. This page shows both official paths and how to convert a PDF when you need a plain spreadsheet, or when the history you need is only on the statement.",
  region="United States (PNC Bank, National Association)",
  fmt="us", sep=",",
  date="US month-first dates (MM/DD/YYYY). Set the date column to that format or to text before importing into a day-first spreadsheet.",
  decimal="US dollar, dot decimal, comma thousands. Prefer PNC’s official QBO or QFX when you use QuickBooks or Quicken.",
  download="""Official PDF statements, from PNC “Online Statements and Documents”:</p>
<p><b>In Online Banking:</b> sign on, select <b>Accounts</b>, open the account, select <b>Account Quick View</b>, then <b>Statements and Documents</b>, then <b>View PDF</b>.</p>
<p><b>In the PNC Mobile app:</b> sign in, open the More menu, then <b>Statements and Documents</b>. Choose Online statements, Account documents or Other documents, select the account, then the year.</p>
<p>How far back, from PNC’s legal notes on that page: up to <b>7 years</b> for checking and savings, auto loans and unsecured instalment loans; up to <b>4 years</b> for credit cards; up to <b>5 years</b> for mortgage and home equity; up to <b>10 years</b> for investment accounts. Online history may not be available for closed accounts. Paperless enrolment is per account (Profile and Settings → Alerts and Communication → Paperless in Online Banking, or Paperless Settings in the app).</p>
<p><b>Quicken and QuickBooks:</b> PNC documents a live bank feed, and also a manual Web Connect export. In PNC Online Banking you can export transactions and choose <b>.QFX</b> for Quicken or <b>.QBO</b> for QuickBooks. PNC does not publish a public official CSV guide on those pages — if you need a spreadsheet, convert the official PDF, or open the QFX/QBO in the software it was made for.</p>""",
  pdf="The official statement is the PDF under Statements and Documents. Checking, savings, card and loan statements have different layouts and retention periods — do not mix a card PDF with a checking conversion. The PDF is also the file PNC points former FirstBank customers to when transactions around a conversion are missing from Quicken or QuickBooks.",
  csv="""PNC’s officially documented download formats for software are .QFX (Quicken) and .QBO (QuickBooks), not a public CSV specification. If you need columns in Excel, convert the PDF and keep date, description, amount or debit/credit, and the running balance where it is printed. Tick the opening and closing balances before you use the file.</p>
<p>If you already use QuickBooks or Quicken, the official QBO or QFX export (or the bank feed) is the cleaner path — you should not need a PDF conversion for recent activity.</p>""",
  tips="""<ul>
<li>For QuickBooks, use PNC’s official .QBO export or the bank feed. For Quicken, use .QFX.</li>
<li>For a plain spreadsheet, or for months that only exist as PDFs, convert the statement and check the printed totals.</li>
<li>Card statements are kept for fewer years (up to 4) than checking (up to 7). Do not assume a 2019 card statement is still online.</li>
</ul>""",
  sources="PNC, “Online Statements and Documents” (pnc.com) and “Online Banking with Quicken & QuickBooks” (including the official note that customers can export .QFX or .QBO via Web Connect), checked 13/11/2026.",
  related=["us-bank","chase","bank-of-america","wells-fargo","capital-one"],
  faqs=[
    ("Does PNC give me a CSV?","Not in any public official guide we could cite. PNC does officially let you export .QFX for Quicken and .QBO for QuickBooks from Online Banking. For a spreadsheet, convert the official PDF."),
    ("How far back are PNC statements?","Up to 7 years for checking and savings, 4 years for credit cards, 5 years for mortgage and home equity, 10 years for investment accounts, according to PNC’s notes on the Online Statements page."),
    ("Where do I find the PDF in the app?","More menu → Statements and Documents, then the document type, the account and the year."),
  ],
),
dict(
  slug="american-express",
  name="American Express",
  short="American Express",
  title="Convert American Express statement PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert an American Express billing statement PDF to CSV in your browser. Official US help: two years of transactions as PDF, Excel or CSV, and archived statement PDFs.",
  h1="Convert an American Express statement PDF to <span>CSV or Excel</span>",
  lead="American Express already lets US card members download the last two years of transactions as PDF, Excel or CSV. This page follows Amex’s official help, explains when you still need the billing-statement PDF, and how to convert that PDF when it is the file you have.",
  region="United States (American Express). Other country sites differ.",
  fmt="us", sep=",",
  date="US month-first dates on US statements (MM/DD/YYYY). Other country sites may use day-first dates. Confirm the first dated line before you import.",
  decimal="US dollar on US accounts, dot decimal. Card payments and credits reduce what you owe; purchases increase it. That sign convention is the opposite of a current-account “money out is negative” file — do not import an Amex CSV into a checking account by mistake.",
  download="""Official path, from American Express US Help (“How do I access my transaction history and billing statements?”):
<p>View transaction history and billing statements through your online account. Amex says your previous <b>two years of transactions</b> can be viewed electronically, and that you can sort, filter and <b>download as a PDF, Excel or CSV file</b>.</p>
<p>To access a <b>PDF copy of your statement</b>, including older statements that have been archived, select the statement you need from the list. <b>Archived statements will be available online within 24 hours</b>.</p>
<p>The exact menu names on the site can change; look for activity, statements or billing statements after you sign in. This page is for the US Help article. American Express sites in other countries use different wording and may offer different formats.</p>""",
  pdf="The billing-statement PDF is the official monthly document. It includes the account summary (previous balance, payments, new charges, the amount due and the payment date), plus the list of transactions, fees and interest for that cycle. A transaction-history download for a custom date range is not the same file: it may not include the statement summary or the official minimum payment. When a lender, tax enquiry or employer asks for “your Amex statements”, send the official PDF.",
  csv="""For the last two years, prefer Amex’s own Excel or CSV download — that is the official spreadsheet. Amex does not publish the column names in that Help article; open the first row of your own file. Watch the sign of payments versus purchases, and any “extended” or instalment-plan rows that might also appear in the cycle’s new-charges total.</p>
<p>Convert the billing-statement PDF when the period is older than the two-year activity download, when you were only sent the PDF, or when you need the rows to tick against that statement’s totals. After conversion, check payments, new charges and the closing balance against the front page of the PDF.</p>""",
  tips="""<ul>
<li>If you use QuickBooks, upload card activity into a credit-card account, not a bank account. Intuit warns that card CSVs may show payments as negative amounts because they reduce the card balance.</li>
<li>Membership Rewards or instalment-plan lines can sit next to ordinary purchases. Do not treat every printed line as a cash amount until you have compared the total with the statement summary.</li>
<li>If an older PDF is not there immediately, Amex says archived statements become available within 24 hours of being selected.</li>
</ul>""",
  sources="American Express US Help, “How do I access my transaction history and billing statements?” (americanexpress.com/us/customer-service/faq.transaction-billing-statements-history.html), checked 13/11/2026.",
  related=["capital-one","chase","bank-of-america","wells-fargo","us-bank"],
  faqs=[
    ("Does American Express already give me Excel or CSV?","Yes, for US accounts. Official help says the previous two years of transactions can be downloaded as PDF, Excel or CSV. Use that when it covers your dates."),
    ("When do I still need to convert the PDF?","When the statement is older than that two-year activity window, when it was archived and you only have the PDF, or when you need the rows to match a specific billing statement’s totals."),
    ("Is a transaction-history download the same as a statement?","No. The official billing statement is the PDF you pick from the statement list. The two-year download is activity you can sort and filter."),
  ],
),
dict(
  slug="bunq",
  name="bunq",
  short="bunq",
  title="Convert bunq bank statement PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert a bunq PDF statement to CSV in your browser. Official exports already include PDF, CSV and MT940 — plus card, annual and single-payment statements.",
  h1="Convert a bunq statement PDF to <span>CSV or Excel</span>",
  lead="bunq already exports statements as PDF, CSV or MT940, from the app and from web.bunq.com. Use that official CSV when you can. This page shows the official paths, the other statement types bunq offers, and how to convert a PDF when that is the file you were sent.",
  region="EEA (bunq). Documents are exported in English (the French RIB is the documented exception).",
  fmt="eu", sep=";",
  date="Confirm the first dated line on your own file. bunq’s public Help does not fix a single printed date format, and the app language does not change most documents (Help says documents other than the French RIB are currently English only).",
  decimal="Euro amounts. European Excel usually wants a semicolon separator and a decimal comma; US/UK Excel and Google Sheets usually want a comma separator and a dot decimal. Try both if a total looks ten times too large.",
  download="""Official path, from bunq Help (“How do I export a bank statement?”). Your account must be verified or bunq will not export a statement.</p>
<p><b>From Profile:</b> tap Profile (top left) → <b>Accounting</b> → <b>Export Statement</b>. Choose the bank account, the period and the format (<b>PDF, CSV or MT940</b>), then Export Statement.</p>
<p><b>From a specific account:</b> Home → the account → Settings → Export statement → period and format.</p>
<p><b>On the web:</b> sign in at web.bunq.com, open the account, Settings → Export statement, choose the date and format, then export.</p>
<p><b>Closed accounts:</b> Home → Profile → Archive → Bank Accounts → the account → Export Statement.</p>
<p>Other official documents, from “What types of bank statements can I export?”: a <b>card statement</b> (Profile → Accounting → Card Statements, or from the card’s settings); a <b>single-transaction</b> statement (open the payment → Export); an <b>annual overview</b> (available each January for the previous year, under Accounting → Annual Overview, as PDF); and a <b>statement of fees</b> for the previous year, listed there too. A signed and stamped statement is not the self-export — message bunq Support for that. Self-exports carry no signature or stamp. Image attachments can be included on a PDF export only (toggle “Include Attachments”).</p>""",
  pdf="A bunq bank-statement PDF is generated from your payment history for one IBAN and period. It shows your name and IBAN (bunq notes it can be used as proof of ownership). bunq cannot filter the official file to incoming-only, or remove individual payments, or change the layout — those limits also apply to signed copies from Support. A card statement is a different document (name, last four digits, the name on the card, and the IBAN used for each payment).",
  csv="""If you can still generate the official CSV, use it and skip the PDF. bunq does not publish the CSV column names on those Help articles — open the first row of your own export. Prefer that official CSV for accounting imports; use MT940 if your accountant asked for it.</p>
<p>Convert the PDF when someone sent you only the PDF, when you need to tick rows against a signed paper copy, or when you want a spreadsheet from a card statement that you only have as a PDF. After conversion, check the totals against the PDF before you import the file.</p>""",
  tips="""<ul>
<li>Verify the account first. Unverified accounts cannot export a statement.</li>
<li>Need a stamp or signature? Do not convert a self-export and hope — ask bunq Support for the signed document, then convert that PDF if you also need columns.</li>
<li>Annual overviews and fee statements are year-end documents, not a substitute for a period statement.</li>
<li>Keep one IBAN per file. bunq statements are per bank account.</li>
</ul>""",
  sources="bunq Help, “How do I export a bank statement?” and “What types of bank statements can I export?” (help.bunq.com), checked 13/11/2026.",
  related=["n26","revolut","ing","abn-amro","wise"],
  faqs=[
    ("Does bunq already give me a CSV?","Yes. Export Statement lets you choose PDF, CSV or MT940, in the app and on web.bunq.com, once the account is verified."),
    ("Can I get a signed statement myself?","No. Self-exports have no signature or stamp. bunq Help says to message Support for a signed and stamped statement, and that they will not change its layout or filter out payments."),
    ("What language is the statement in?","Help says documents other than the French RIB are currently available in English only."),
  ],
),
dict(
  slug="abn-amro",
  name="ABN AMRO",
  short="ABN AMRO",
  title="Convert ABN AMRO statement PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert an ABN AMRO rekeningafschrift PDF to CSV in your browser. Official statements go back up to 20 years as PDF; transactions for 18 months come as PDF, TXT, MT940, XLS or CAMT.053.",
  h1="Convert an ABN AMRO statement PDF to <span>CSV or Excel</span>",
  lead="ABN AMRO already gives you a spreadsheet of recent activity: bij- en afschrijvingen for the last 18 months can be downloaded as XLS (and as MT940 or CAMT.053). Official monthly statements (rekeningafschriften) go back much further, but only as PDF. This page shows both official paths, the weekend-date trap, and how to convert an older PDF.",
  region="Netherlands (ABN AMRO). Statements are stored in Dutch or English, depending on your preference at month-end.",
  fmt="eu", sep=";",
  date="Dutch statements are day-first (DD-MM-YYYY or DD/MM/YYYY). A US-locale spreadsheet will swap days below 13. Official monthly statements are stored in the language (Dutch or English) that was set as your preference at the end of that month — you cannot regenerate an old statement in the other language.",
  decimal="Euro, European decimal comma on Dutch documents (1.234,56). Official XLS downloads should already be a spreadsheet; still check that 1,25 is a quarter and not one hundred and twenty-five.",
  download="""Official path, from ABN AMRO “Rekeningafschriften en bij- en afschrijvingen downloaden”.</p>
<p><b>Monthly statements (rekeningafschriften)</b> — PDF only, with your address, available up to 20 years back (the app text says from 2005). In Internet Bankieren, choose the account holder, the account and the type of overview, tick the statement, and download the PDF. You can download up to 50 statements at once, delivered as a ZIP. In the app: Profile → Rekeningen en betalen → Afschriften en jaaroverzicht, then the holder, the type of overview, the account if needed, the period, tick and download. A new monthly statement is made on the last working day of the month and is available on the second working day of the next month, in the language then set in Internet Bankieren.</p>
<p><b>Transactions (bij- en afschrijvingen)</b> — last 18 months, with your address, in <b>PDF, TXT, MT940, XLS or CAMT.053</b>. In Internet Bankieren or the app, choose the holder, the format, a start and end date, and download from the icon next to the account. For English transaction overviews, switch to the English Internet Bankieren environment before you download (you choose the language at download time for this file, unlike stored monthly statements).</p>
<p><b>Weekend trap:</b> if the end date you pick falls on a weekend, Saturday and Sunday transactions are not included. ABN AMRO tells you to use the next working day as the end date. The same applies when a month-end falls on a weekend for a one-month download — those days appear on the next month’s statement.</p>""",
  pdf="The rekeningafschrift PDF is the official monthly document. You cannot search it for one counterparty the way you can search the live transaction list, and you cannot download a filtered “only this supermarket” statement — ABN AMRO says you can filter on screen but not download that filter. Older than 18 months, this PDF is the only official download.",
  csv="""For the last 18 months, prefer ABN AMRO’s official <b>XLS</b> (or CAMT.053 / MT940 if your accountant asked for those). That is already a structured file; you should not need to convert a PDF for recent activity. ABN AMRO does not list the XLS column headings on that help page — open the first row of your own download.</p>
<p>Convert a rekeningafschrift PDF when the period is older than 18 months, when you were only sent the PDF, or when you need the rows to tick against that official monthly statement. After conversion, use a European number format and check the printed opening and closing balances.</p>""",
  tips="""<ul>
<li>Need recent transactions in Excel? Download bij- en afschrijvingen as XLS, and end the date range on a working day.</li>
<li>Need 2019 for a tax enquiry? Download the monthly PDF statements (up to 50 at a time in a ZIP) and convert those.</li>
<li>Do not expect to change the language of a statement that was already stored — only new monthly statements follow the language now set.</li>
<li>A joint-account change or a name change can hide older statements of the previous account. ABN AMRO says to contact them for those.</li>
</ul>""",
  sources="ABN AMRO, “Rekeningafschriften en bij- en afschrijvingen downloaden” (abnamro.nl/nl/prive/betalen/bij-en-afschrijvingen/downloaden.html), checked 13/11/2026.",
  related=["ing","bunq","n26","deutsche-bank","commerzbank"],
  faqs=[
    ("Does ABN AMRO already give me Excel?","Yes, for the last 18 months: download bij- en afschrijvingen and choose XLS (or MT940 or CAMT.053). Official monthly statements going further back are PDF only."),
    ("Why are weekend payments missing?","If your end date is a Saturday or Sunday, ABN AMRO does not include those weekend transactions. Use the next working day as the end date."),
    ("Can I download many statements at once?","Yes — up to 50 rekeningafschriften in one ZIP file."),
  ],
),
dict(
  slug="commerzbank",
  name="Commerzbank",
  short="Commerzbank",
  title="Convert Commerzbank Kontoauszug PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert a Commerzbank Kontoauszug PDF to CSV in your browser. Official Postfach statements, plus official Umsatz exports as PDF or CSV from the transaction list.",
  h1="Convert a Commerzbank statement PDF to <span>CSV or Excel</span>",
  lead="Commerzbank already lets you export recent Umsätze as CSV or PDF from the transaction list. Official Kontoauszüge (the statements themselves) live in the electronic Postfach as PDFs. This page shows both official paths and how to convert a Kontoauszug when that is the file you have.",
  region="Germany (Commerzbank). Other Commerzbank country sites differ.",
  fmt="eu", sep=";",
  date="German statements are day-first (DD.MM.YYYY). A US-locale spreadsheet will swap days below 13. Set the date column to TT.MM.JJJJ / DD.MM.YYYY or to text before you import.",
  decimal="Euro, decimal comma (1.234,56). Use a semicolon-separated CSV for German Excel. If 1,25 becomes 125, the decimal setting is wrong.",
  download="""Two official files, from Commerzbank’s service pages.</p>
<p><b>Kontoauszüge (official statements)</b> — “Kontoauszüge im Postfach finden”:</p>
<ul>
<li><b>In the Banking App:</b> after sign-in, open <b>Profil</b> in the navigation bar, then <b>Postfach</b>. Documents are listed by date. Open the monthly statement to see the movements.</li>
<li><b>In Online Banking:</b> open the electronic Postfach, filter by the account or card you need, and open the matching Kontoauszug.</li>
</ul>
<p>Commerzbank notes that the Postfach is already unlocked for most functions; fully activating it switches existing accounts, depots and cards to electronic delivery. After a product is closed, later statements are under “ehemalige Produkte”. Year-end or account-closure statements are also sent to the address on file. In the last week of the year no weekly statement is produced; there is a year-end statement instead, and the first statement of the new year does not contain the previous year.</p>
<p><b>Umsatz export (transaction list)</b> — “Wie kann ich meine Umsätze exportieren?”. In Online Banking, open the Umsatzübersicht, select the account, click <b>PDF / CSV</b> above the transactions, then either:</p>
<ul>
<li><b>Umsätze exportieren</b> — choose which transactions, then PDF or CSV, then Exportieren; or</li>
<li><b>Umsätze auswählen</b> — tick individual rows, then Exportieren, then PDF or CSV.</li>
</ul>""",
  pdf="The Kontoauszug in the Postfach is the official statement for that period. It is the file to keep for tax, landlords and auditors. An Umsatz-PDF or CSV exported from the transaction list is a list of movements you selected; it is not automatically a substitute for the official Kontoauszug, and it may not carry the same printed opening and closing balance or letterhead.",
  csv="""For recent activity, prefer Commerzbank’s official CSV from the Umsatzübersicht (PDF / CSV → Umsätze exportieren). Commerzbank does not publish the column headings on that service page — open the first row of your own export. German Excel expects a semicolon separator and a decimal comma.</p>
<p>Convert the official Kontoauszug PDF when you need the rows to tick against that statement, when you were only sent the PDF, or when the period is no longer on the live Umsatzübersicht. After conversion, check the printed Saldo against the sum of the rows.</p>""",
  tips="""<ul>
<li>Need a spreadsheet of recent bookings? Use the official Umsatz CSV and skip the PDF.</li>
<li>Need the official monthly statement? Download the Kontoauszug from the Postfach. Convert it only if you also need columns.</li>
<li>Closed-product statements sit under “ehemalige Produkte” — they are easy to miss if you only filter the live account.</li>
<li>Do not merge a card statement and a current-account Kontoauszug in one file without naming the source.</li>
</ul>""",
  sources="Commerzbank, “Kontoauszüge im Postfach finden” and “Wie kann ich meine Umsätze exportieren?” (commerzbank.de/service/…), checked 13/11/2026.",
  related=["deutsche-bank","ing","n26","abn-amro","bunq"],
  faqs=[
    ("Does Commerzbank already give me a CSV?","Yes, of Umsätze (the transaction list): in the Umsatzübersicht click PDF / CSV and export as CSV. The official Kontoauszug in the Postfach is a PDF."),
    ("Is an Umsatz CSV the same as a Kontoauszug?","No. The Kontoauszug is the official statement in the Postfach. The Umsatz export is a list of transactions you chose to download."),
    ("Where do statements for a closed account go?","Commerzbank says that after the last statement of a deleted product, you will find the statements in the Postfach under “ehemalige Produkte”."),
  ],
),
]
