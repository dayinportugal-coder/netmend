# How-to and comparison pages, SEO round 2 (13/11/2026).
# Import facts from official Intuit, Xero Central, and (for banks) official help.

GIG = "https://www.fiverr.com/dayinportugal/convert-pdf-invoices-and-documents-into-a-clean-excel-spreadsheet"

HOWTOS = [
dict(
  slug="pdf-invoice-to-excel-quickbooks",
  kind="howto",
  title="Convert PDF invoices to Excel for QuickBooks import (free tool) · Netmend",
  meta="Turn a PDF invoice into a spreadsheet you can map into QuickBooks Online. Official invoice-import columns, what this tool can and cannot read, and when to use a bank-feed file instead.",
  h1="Convert PDF invoices to Excel for <span>QuickBooks</span>",
  lead="QuickBooks will not ingest a supplier PDF for you. It will import a spreadsheet of invoices or bills, if the columns match. This page shows the official import shape, how to get line items out of a text-based PDF, and the mistakes that silently create the wrong invoices.",
  crumbs=("Guides", "../"),
  tool="invoice",
  sections="""
<h2>What QuickBooks actually imports</h2>
<p>There are two different jobs, and they use two different files. Do not mix them up.</p>
<ul>
<li><b>Invoices you sent (sales).</b> In QuickBooks Online, go to Settings → <b>Import data</b> → <b>Invoices</b>. Official help (updated recently, checked 13/11/2026) says each line item needs its own <b>invoice number, customer, invoice date, due date, item amount and item tax code</b>. You can use your own CSV if those columns are there, or download Intuit’s sample file from that screen. One spreadsheet can contain up to 1,000 rows and you can import a maximum of 100 invoices at a time. You cannot add negative charges such as discounts or credit notes on this import. Add new customers or products first, or tick the boxes on the import screen to create them. If you collect tax, map your tax codes to QuickBooks tax codes and choose Exclusive or Inclusive. If some invoices fail, Intuit tells you to note why, and if the file itself looks corrupted, to copy the data into a new CSV and try again.</li>
<li><b>Bills you received (purchases).</b> That is a separate import under Settings → Import data → <b>Bills</b>. Download Intuit’s sample file from that screen and treat those headings as the authority — do not reuse an invoices template for bills, or a bank-transaction template for either of them.</li>
<li><b>Bank or card transactions.</b> A third, different file. QuickBooks Online accepts a 3-column CSV (<b>Date, Description, Amount</b>, with payments negative and deposits positive) or a 4-column CSV (<b>Date, Description, Credit, Debit</b>). That is for money that already moved, not for raising an invoice. Official formatting notes: remove stray zeros, do not put amounts in the Description column, Credit/Debit headers must not say “amount”, keep one date format (Intuit recommends dd/mm/yyyy), and strip weekday text such as “TUE” from the date. Mac users should save as a Windows CSV. For card accounts, upload into a credit-card account, not a bank account — payments often appear as negative because they reduce the card balance.</li>
</ul>
<p>Connecting the bank feed, when QuickBooks offers it, is usually better than any of these files for ongoing bookkeeping. Use a spreadsheet import when the feed does not go back far enough, or when you have a pile of PDFs and no feed.</p>
<h2>How to get line items out of a PDF invoice</h2>
<p>The free tool on this page is the same in-browser converter we built for bank statements. It reads the text layer of a digital PDF on your computer (no upload). It works when the invoice is a real text PDF with a line-item table — description, quantity, unit price, line total. It does not work well on a photographed invoice, a logo-heavy layout with the totals in a random place, or a scanned page. For those, type the lines or use the done-for-you option below.</p>
<ol>
<li>Save the supplier’s PDF (or our sample invoices, if you just want to see the tool).</li>
<li>Drop it in the box below. If the preview looks messy, switch to <b>Every text row (raw table)</b> so wrapped descriptions are not dropped.</li>
<li>Download the CSV and reshape it in Excel or Google Sheets to the QuickBooks invoice or bills template: one row per line item, the invoice number repeated on every line of the same invoice, dates in one format, tax codes that exist in your company file, no discount rows as negatives.</li>
<li>Tick each invoice total against the PDF before you import. Then import from Settings → Import data, and map the columns on the screen.</li>
</ol>
<p>If you only need a payment to match a bank line, you do not import the invoice as a bank transaction. Raise or import the invoice or bill first, then match the bank feed to it. Importing the same amount twice — once as an invoice and once as a bank split — is how balances go wrong.</p>
""",
  faqs=[
    ("Can QuickBooks import a PDF invoice directly?","Not as an invoice or bill. QuickBooks Online imports a CSV (or its sample spreadsheet) of invoices or bills, and a separate CSV or bank-feed file for transactions. You convert the PDF first, then map the columns."),
    ("How many invoices can I import at once?","Official help: up to 100 invoices per import, and up to 1,000 rows in the spreadsheet. Discounts and credit notes cannot go through this invoice import as negative charges."),
    ("Should I import invoices or bank transactions?","If the invoice is a sale or a bill you need on the books, import it as an invoice or a bill. If the money has already hit the bank and you only need the feed to match, use the bank CSV or the live bank feed — not the invoice template."),
  ],
  related_guides=["pdf-invoice-to-excel-xero","scanned-pdf-invoices-to-excel","pdf-invoice-to-google-sheets","bank-statement-to-quickbooks"],
),
dict(
  slug="pdf-invoice-to-excel-xero",
  kind="howto",
  title="Convert PDF invoices to Excel or CSV for Xero import · Netmend",
  meta="Turn a PDF invoice into a spreadsheet you can import into Xero. How Xero’s invoice and bill imports differ from a bank-statement CSV, and how to extract line items privately in your browser.",
  h1="Convert PDF invoices to Excel for <span>Xero</span>",
  lead="Xero will not turn a supplier’s PDF into a bill for you. It will import a CSV of invoices or bills if you use its template, and it will import a bank statement as a different file. This page keeps those jobs apart, then shows how to get line items out of a text-based PDF.",
  crumbs=("Guides", "../"),
  tool="invoice",
  sections="""
<h2>Three different Xero files</h2>
<ul>
<li><b>Sales invoices.</b> Xero documents a CSV import for customer invoices in Central (“Import customer invoices”). Download the official template from Xero and keep the headings exactly as supplied. Repeat the invoice number on every line of a multi-line invoice. Dates and tax types have to match what your Xero organisation already uses. Treat the current template as the authority — Xero can change a column name without changing this page.</li>
<li><b>Bills (purchases).</b> A separate import, usually from Purchases → Bills, with its own CSV template (commonly started from New bill → Import). Do not feed a sales-invoice template into the bills import, or the other way around.</li>
<li><b>Bank statements.</b> A third file. Xero Central documents “Import a bank statement in CSV format”, and also has an article “Import a PDF bank statement”. For the CSV path, you map at least a date and an amount (money in positive, money out negative) and usually a description, then review the lines before you complete the import. Try Xero’s own PDF bank-statement import first when it is offered for your file; if it rejects the PDF or you need more control, convert the statement to CSV and import that. Bank lines are not bills. Importing a supplier invoice as a bank withdrawal, and then again as a bill, will double the expense.</li>
</ul>
<p>A live bank feed remains the cleaner way to get ongoing payments into Xero. Use a file import when you are catching up, when the feed does not cover the period, or when you have a pile of PDF invoices and no bills on the system yet.</p>
<h2>From a PDF invoice to a Xero-ready sheet</h2>
<p>The converter below runs in your browser and never uploads the file. It is the same tool we use for bank-statement tables. It is useful when the invoice is a digital PDF with a clear line-item table. It is a poor fit for a photographed receipt or a designed invoice where the totals sit in a graphic. Use “Every text row” if a description wraps and the first preview looks short.</p>
<ol>
<li>Extract the PDF to CSV with the tool, or type the lines if the layout is too awkward.</li>
<li>Copy the rows into Xero’s official invoice or bill template, one row per line item, with the invoice number repeated, a contact name that exists (or will be created) in Xero, and tax types and account codes your organisation already uses.</li>
<li>Tick each invoice total against the original PDF. Then import in Xero and fix any rows the import report rejects — usually a missing contact, a tax type that does not exist, or a date format mixed between 03/04 and 04/03.</li>
</ol>
""",
  faqs=[
    ("Can Xero import a PDF invoice?","Xero has an official PDF import for some bank statements, documented in Central. Supplier invoices and customer invoices are imported as CSV from Xero’s own templates, not by dropping a PDF bill into the bank import."),
    ("What is the difference between a bill import and a bank import?","A bill is the supplier document you owe. A bank import is money that already left or entered the account. Raise or import the bill, then match the bank line to it. Do not import the same amount as both."),
    ("Why did Xero reject my dates?","Mixed day-first and month-first dates in the same column are the usual cause. Pick one format, say it on the import screen, and stick to it for every row."),
  ],
  related_guides=["pdf-invoice-to-excel-quickbooks","bank-statement-to-xero","scanned-pdf-invoices-to-excel","pdf-invoice-to-google-sheets"],
),
dict(
  slug="pdf-receipts-to-excel",
  kind="howto",
  title="Convert PDF receipts to Excel or CSV (free, private) · Netmend",
  meta="Turn a pack of PDF receipts into a spreadsheet: date, supplier, VAT, total. What a text PDF will give you, why photos fail, and how to check the sum against the papers.",
  h1="Convert PDF receipts to <span>Excel or CSV</span>",
  lead="A receipt is usually one or two totals, not a bank-statement table. The useful spreadsheet is a list: date, supplier, net, VAT, gross, and a category you add yourself. This page shows how far an in-browser PDF tool can take a digital receipt, and when you should type the line instead.",
  crumbs=("Guides", "../"),
  tool="invoice",
  sections="""
<h2>What a useful receipt sheet looks like</h2>
<p>For bookkeeping, one row per receipt is almost always better than one row per word the PDF happened to contain. A practical set of columns is:</p>
<ul>
<li><b>Date</b> — the receipt date, in one format only (DD/MM/YYYY in the UK and Europe, MM/DD/YYYY in the US).</li>
<li><b>Supplier</b> — the name on the receipt, not the payment-processor name if you can help it (a “SumUp” or “Stripe” line is harder to review later).</li>
<li><b>Description</b> — what it was for, in a few words.</li>
<li><b>Net, VAT or sales tax, and gross</b> — as printed. If the receipt has no tax break-down, leave net and VAT blank and keep the gross, rather than inventing a split.</li>
<li><b>Currency</b> and <b>payment method</b> if you have mixed cards or a foreign trip.</li>
<li><b>Source file</b> — the PDF name, so you can find the original in a month’s time.</li>
</ul>
<p>If you later import this into QuickBooks or Xero, you still need their bill or expense template. The sheet above is the working file; their sample CSV is the import file. Do not import receipts as bank transactions if the same card spend will also arrive on the bank feed — you will double-count.</p>
<h2>What the free tool can do</h2>
<p>The converter on this page reads a digital PDF in your browser. It is built around tables, so it behaves best when a receipt or a VAT invoice is a text PDF with the amounts in real characters, not a picture of amounts. Till receipts saved from an email as a proper PDF often work. A photo of a till roll, a WhatsApp screenshot, or a “PDF” that is only an image wrapper usually does not. In that case the honest options are to type the row, to use your accounting app’s receipt-capture tool, or to send the pack as a done-for-you job.</p>
<ol>
<li>Drop one digital receipt (or a short pack if they are already one PDF) into the tool. Start with <b>Every text row</b>.</li>
<li>Copy the useful cells — date, name, totals — into the column layout above. Ignore headers, logos, footers and payment-terminal IDs.</li>
<li>Add the gross amounts up and compare the sum with a pile total you already trust, or with the card statement for the same period. One missing till receipt is easier to spot as a missing total than as a missing file name.</li>
</ol>
<p>For a year of mixed photos and PDFs, a human pass is still cheaper than trusting an automatic extract you did not tick. The tool is there to save typing on the clean digital files, not to invent numbers from a photograph.</p>
""",
  faqs=[
    ("Will this read a photo of a till receipt?","No. The tool reads the text layer of a digital PDF. A photograph is an image. Type that row, use receipt capture in your accounting software, or send the pack to us."),
    ("Should each item on the receipt be its own row?","Only if you need that detail (for example stock or a mixed VAT rate). For most small-business books, one row per receipt with the printed gross is enough and easier to tick."),
    ("Can I import this sheet straight into Xero or QuickBooks?","Not as-is. Copy the rows into that product’s expense, bill or receipt template. And do not also import the same spend from the bank feed without matching the two."),
  ],
  related_guides=["scanned-pdf-invoices-to-excel","pdf-invoice-to-excel-quickbooks","pdf-invoice-to-excel-xero","credit-card-statement-to-excel"],
),
dict(
  slug="bank-statement-to-quickbooks",
  kind="howto",
  title="Import a PDF bank statement into QuickBooks (CSV guide) · Netmend",
  meta="Get a PDF bank statement into QuickBooks Online: official 3-column and 4-column CSV layouts, date traps, and a private in-browser converter when the bank will not give you QBO or CSV.",
  h1="Import a PDF bank statement into <span>QuickBooks</span>",
  lead="The reliable way into QuickBooks is a bank feed, or the bank’s own QBO or CSV download. When all you have is a PDF statement, convert it to the CSV shape Intuit documents, then upload it. This page sticks to those official columns and the checks that catch a bad file before it hits the register.",
  crumbs=("Guides", "../"),
  tool="statement",
  sections="""
<h2>Prefer the bank’s file, or the feed</h2>
<p>If the bank offers a live connection, or a .QBO (QuickBooks), .QFX (Quicken) or official CSV download, use that and skip the PDF. Several banks on our guides already do this for recent activity — for example <a href="../../statement-to-csv/us-bank/">U.S. Bank</a> documents CSV, QFX and QBO for up to three years, and <a href="../../statement-to-csv/pnc/">PNC</a> documents QBO and QFX. A PDF conversion is for older months, a statement someone emailed you, or a bank that only issues a PDF.</p>
<h2>The two CSV layouts QuickBooks Online accepts</h2>
<p>From Intuit’s official article “Format CSV files in Excel to get bank transactions into QuickBooks” (updated 24/08/2026, checked 13/11/2026), you can upload either:</p>
<ul>
<li><b>3 columns:</b> Date, Description, Amount. A payment is negative (for example -100.00). A deposit is positive (200.00).</li>
<li><b>4 columns:</b> Date, Description, Credit, Debit. Put each amount in only one of the two columns; leave the other blank. The headers must be “Credit” and “Debit”, not “Credit amount”.</li>
</ul>
<p>Intuit also tells you to: remove zeros (leave those cells blank); fix any transaction that shows numbers in the Description column; save as a Windows CSV on a Mac; use one date format (they recommend dd/mm/yyyy); and split off weekday text such as “20/11/2018 TUE” with Data → Text to Columns (space-delimited). Each bank’s own CSV is different, and some bank CSVs simply will not import until you reshape them to one of the two layouts above. If the bank offers QFX, QBO or OFX instead, Intuit suggests trying that route.</p>
<p>For <b>credit-card</b> files, Intuit warns that transactions may appear in reverse sign — a payment can look negative because it reduces the card balance. Upload those rows into a credit-card account, not a bank account. See also our <a href="../credit-card-statement-to-excel/">card-statement guide</a>.</p>
<h2>Convert the PDF, then reshape</h2>
<p>The tool below reads the statement in your browser. Leave the file on your computer. Pick a UK/US or European number format to match the PDF. After you download the CSV:</p>
<ol>
<li>Keep only the transaction rows. Delete headings, headers, footers, “balance brought forward” lines and interest summaries unless they are real movements you want in the register.</li>
<li>Reshape to Date / Description / Amount, or Date / Description / Credit / Debit. If your PDF had Money in and Money out, those become Credit and Debit (or a single signed Amount).</li>
<li>Check that opening balance + deposits − withdrawals equals the closing balance printed on the PDF. If it does not, stop. A wrapped description has usually been read as a new row, or a summary total has been kept as a transaction.</li>
<li>In QuickBooks Online, upload the CSV into the right account (Banking / Bank transactions → upload) and map the columns. Review every line before you accept it.</li>
</ol>
<p>Do not also import the same period from a bank feed, or you will create duplicates. If the account is already connected, only upload dates the feed does not cover.</p>
""",
  faqs=[
    ("Can I upload the PDF straight into QuickBooks?","No. QuickBooks Online wants a CSV in the 3-column or 4-column layout, or a bank-feed / QBO file. Convert the PDF first and tick the totals."),
    ("Which is better, 3 columns or 4?","Whichever matches the statement you have with less editing. Money-in / money-out PDFs usually become 4 columns. A single signed amount becomes 3 columns. Both are official."),
    ("Why did QuickBooks reject my dates?","Mixed formats, or a day of the week left in the date cell, are the usual causes. Use one format and strip “TUE”-style suffixes, as Intuit documents."),
  ],
  related_guides=["bank-statement-to-xero","credit-card-statement-to-excel","pdf-invoice-to-excel-quickbooks"],
  related_compare=["official-csv-vs-pdf","quickbooks-vs-xero-pdf"],
),
dict(
  slug="bank-statement-to-xero",
  kind="howto",
  title="Import a PDF bank statement into Xero (CSV guide) · Netmend",
  meta="Get a PDF bank statement into Xero: official CSV import, Xero’s own PDF-statement import, date and sign rules, and a private converter when you need a clean CSV.",
  h1="Import a PDF bank statement into <span>Xero</span>",
  lead="Xero can import a bank statement as CSV, and it also documents a PDF bank-statement import. Start with those official tools. Convert the PDF yourself when Xero will not accept the file, or when you want to tick every total before the lines land in the account.",
  crumbs=("Guides", "../"),
  tool="statement",
  sections="""
<h2>Try Xero’s official imports first</h2>
<p>Xero Central documents two relevant articles: <b>Import a bank statement in CSV format</b> and <b>Import a PDF bank statement</b>. If your organisation offers the PDF import for that account and it accepts your file, use it — there is no reason to convert a statement Xero already reads. When the PDF import is not offered, or it rejects the layout, prepare a CSV and import that instead (Accounting → Bank accounts → the account → Import a statement, then map the columns and review the lines).</p>
<p>A live bank feed is still the better everyday path. Several banks in our <a href="../../statement-to-csv/#bank-guides">bank guides</a> already offer an official CSV or XLS for recent activity (for example Starling feed exports, bunq CSV, ABN AMRO XLS for 18 months, Commerzbank Umsatz CSV). Use those when they cover the dates. Convert a PDF when they do not.</p>
<h2>The CSV Xero expects</h2>
<p>On the official CSV import you map columns on screen. In practice the file that goes through cleanly has:</p>
<ul>
<li>A <b>Date</b> column, in one format only (for example DD/MM/YYYY, MM/DD/YYYY or YYYY-MM-DD — pick the one you will also select in Xero).</li>
<li>An <b>Amount</b> column, with money in as a positive number and money out as a negative number, and with no currency symbols or thousands separators that Xero will misread (1,234.56 in a European locale is a trap).</li>
<li>A <b>Description</b> (and, if you have them and the mapper offers them, payee or reference). Extra columns are fine if you can leave them unmapped.</li>
</ul>
<p>Treat the mapping screen and Xero’s current article as the authority if a heading has changed. The usual failures are mixed date formats, a European decimal comma in a file Xero is reading as US, or a “balance” column imported as if it were an amount — that last mistake posts the running total as a transaction.</p>
<h2>Convert the PDF, then check it</h2>
<p>The tool below runs in your browser. Choose a European or UK/US number format to match the statement. Then:</p>
<ol>
<li>Delete header and footer rows. Keep only actual movements.</li>
<li>Build a single signed Amount column if the PDF had money in and money out separately (in minus out).</li>
<li>Prove the file: opening balance + sum of amounts = closing balance on the PDF. If that identity fails, do not import.</li>
<li>Import in Xero, map Date and Amount (and Description), review the statement lines, and only then complete the import. Do not import a period that is already on the bank feed.</li>
</ol>
""",
  faqs=[
    ("Can Xero import my PDF statement directly?","Sometimes. Xero Central has an official article “Import a PDF bank statement”. Try that first. If it is not available or the file is rejected, convert the PDF to a CSV and use the official CSV import."),
    ("Should amounts be positive or negative?","For the usual single-amount CSV, money in is positive and money out is negative. Do not also import a running-balance column as an amount."),
    ("Why are the dates a day off or in the wrong month?","The statement is probably day-first and the import was told it is month-first, or the other way around. Pick one format for the whole file and say it on the mapping screen."),
  ],
  related_guides=["bank-statement-to-quickbooks","credit-card-statement-to-excel","pdf-invoice-to-excel-xero"],
  related_compare=["official-csv-vs-pdf","quickbooks-vs-xero-pdf"],
),
dict(
  slug="scanned-pdf-invoices-to-excel",
  kind="howto",
  title="Convert scanned PDF invoices to Excel — what actually works · Netmend",
  meta="Honest limits: a scanned invoice is an image. When an in-browser tool can help, when it cannot, and how to check totals if you type or outsource the lines.",
  h1="Convert scanned PDF invoices to <span>Excel</span> — honestly",
  lead="If you cannot select the amount with your cursor and copy it as text, the PDF is a picture. Our free converter reads text, not pixels. This page says that clearly, then shows the options that do work: type the lines, use a dedicated OCR step, or have the pack keyed and ticked against each total.",
  crumbs=("Guides", "../"),
  tool="invoice",
  sections="""
<h2>Text PDF versus scanned PDF</h2>
<p>A <b>digital invoice</b> from a supplier’s billing system usually has a text layer. You can highlight “£120.00”, search for the invoice number, and a converter can read the table. A <b>scanned</b> or photographed invoice is an image placed on a PDF page. It may look sharp, and it may even be called a PDF, but there are no characters to extract — only pixels. The free tool on this page, like most local PDF-table tools, will return a blank or a jumble of random letters if there is no text layer.</p>
<p>A quick test: open the file, try to highlight a total, and copy it into a notes app. If you get the number, try the converter below (start with “Every text row”). If you get nothing, or a single letter, stop — running the tool again will not invent the missing text.</p>
<h2>What to do with a scan</h2>
<ul>
<li><b>Ask for a digital copy.</b> Many suppliers can resend the original PDF from their invoicing software. That is the cheapest fix, and it is the official document.</li>
<li><b>Type the rows.</b> For a handful of invoices this is faster than setting up OCR, and you see each total as you go. Use a simple sheet: invoice number, date, supplier, description, net, tax, gross. Tick each gross against the paper or the scan before you add the next one.</li>
<li><b>OCR, if you accept the error rate.</b> Adobe Acrobat, Apple’s PDF tools, Google Drive, and similar software can try to recognise the characters. They make quiet mistakes: a 3 that becomes an 8, a decimal comma that disappears, a line that is skipped. If you use OCR, you still have to tick every invoice total against the scan. OCR is a typing aid, not a source of truth.</li>
<li><b>Done for you.</b> If you have a packed folder of scans, mixed languages, or a layout that has to match QuickBooks or Xero, we key the lines and check each document total. That is the paid option below — it is not a magic scan button on this page.</li>
</ul>
<p>The tool is still here because mixed packs are common: three digital invoices and two scans. Run the digital files through it, type the scans, and keep one working sheet. Then, if you need to import into <a href="../pdf-invoice-to-excel-quickbooks/">QuickBooks</a> or <a href="../pdf-invoice-to-excel-xero/">Xero</a>, copy the rows into that product’s official template and map the columns there.</p>
<h2>How to tick a pack so mistakes do not slip through</h2>
<ol>
<li>Number the source files and put that name on each spreadsheet row.</li>
<li>For every invoice, compare the printed gross (and the tax total, if it is shown) with the sum of the lines you captured. If a document has three lines of 40, 40 and 40 and a gross of 132, you are missing tax or you have the wrong currency.</li>
<li>Add a pack total — the sum of every gross — and compare it with a control you already trust, such as a purchase ledger or a card-statement total for the same suppliers and dates. A pack that only “looks complete” is how one invoice gets dropped.</li>
</ol>
""",
  faqs=[
    ("Why is the preview empty?","The file is probably a scan or a photograph. This tool only reads a text layer. Try highlighting a total in the PDF; if you cannot copy it, the tool cannot read it either."),
    ("Can you “enable OCR” in the free tool?","No. Building a reliable, private OCR engine into this page would still leave you ticking every total, and it would fail quietly on poor scans. We would rather say so than ship a button that guesses."),
    ("Is a scanned PDF still a valid invoice?","Often yes, as a picture of the document — but your tax rules are not this page’s job. For the spreadsheet, treat the scan as evidence and type or key the numbers, then tick them."),
  ],
  related_guides=["pdf-receipts-to-excel","pdf-invoice-to-excel-quickbooks","pdf-invoice-to-excel-xero","pdf-invoice-to-google-sheets"],
),
dict(
  slug="credit-card-statement-to-excel",
  kind="howto",
  title="Convert a PDF credit card statement to Excel or CSV · Netmend",
  meta="Turn a credit-card statement PDF into a spreadsheet. Official downloads (for example American Express Excel/CSV), sign conventions, and how to tick payments, purchases and the closing balance.",
  h1="Convert a credit card statement PDF to <span>Excel or CSV</span>",
  lead="A card statement is not a current-account statement. Payments reduce what you owe; purchases increase it. This page shows when the card issuer already gives you Excel or CSV, how to convert the official PDF when that is all you have, and how to import the result without flipping the signs.",
  crumbs=("Guides", "../"),
  tool="statement",
  sections="""
<h2>Use the issuer’s spreadsheet when they offer one</h2>
<p>Some card issuers already export activity as Excel or CSV. <a href="../../statement-to-csv/american-express/">American Express (US)</a>, for example, officially lets you download the previous two years of transactions as PDF, Excel or CSV, and to fetch an official billing-statement PDF (archived statements can take up to 24 hours). When that official download covers your dates, use it. Convert the billing-statement PDF when the period is older, when you were only sent the PDF, or when you need the rows to tick against that statement’s front-page totals.</p>
<p>Bank-issued cards (Capital One, Chase, Halifax and others) usually keep the official document as a monthly PDF under statements. A live activity export, if it exists, is not always the same as the official statement. Our <a href="../../statement-to-csv/#bank-guides">bank guides</a> say, bank by bank, what is official.</p>
<h2>What to watch for on a card PDF</h2>
<ul>
<li><b>The summary is not a transaction.</b> Previous balance, payments received, new charges, fees, interest, the amount due and the payment date belong on the front page. If you leave “new charges 1,234.00” in the CSV as a row, you will double the spend.</li>
<li><b>Payments and refunds have the opposite effect from a purchase.</b> In QuickBooks Online, Intuit tells you to upload card activity into a <b>credit-card account</b>, not a bank account, because the signs often look “backwards” (a payment can appear negative because it reduces the balance). In Xero, map the amounts so a purchase increases the card balance and a payment decreases it, then review the import before you accept it.</li>
<li><b>Instalment plans, interest and fees</b> are real rows, but they are not purchases. Keep them, and check that purchases + fees + interest − payments − credits = the new balance on the statement.</li>
<li><b>Pending authorisations</b> can appear in an app feed and not on the official statement. Convert the official PDF, not a screenshot of recent activity, if you need the file to tie out.</li>
</ul>
<h2>Convert, then prove the statement</h2>
<p>The tool below reads a digital (text-based) statement PDF in your browser. It will not read a photographed bill. Choose UK/US or European numbers to match the PDF. Then:</p>
<ol>
<li>Delete the summary block and any “amount due” lines from the CSV. Keep payments, purchases, refunds, fees and interest.</li>
<li>Prove the identity: previous balance + purchases + fees + interest − payments − credits = new balance, using the figures on the PDF. If this fails, a summary total is still in the file, or a wrapped merchant name has been read as an amount.</li>
<li>For QuickBooks, reshape to the official 3-column or 4-column bank CSV and upload into the card account. For Xero, use the official CSV bank import (or Xero’s own PDF import if it accepts this issuer). For a spreadsheet you will only review, the raw columns are fine.</li>
</ol>
""",
  faqs=[
    ("Is a card statement the same as a bank statement for import?","No. Upload it as a credit-card account. A payment reduces the card balance; treating it as a current-account withdrawal will invert your books."),
    ("Does American Express already give me Excel?","On US accounts, official help says yes: the previous two years of transactions can be downloaded as PDF, Excel or CSV. The official monthly statement is still the billing-statement PDF."),
    ("Why don’t the rows add up to the new balance?","Usually a front-page total was kept as a transaction, or interest and fees were dropped. Rebuild the identity from the statement summary before you import."),
  ],
  related_guides=["bank-statement-to-quickbooks","bank-statement-to-xero","pdf-receipts-to-excel"],
  related_compare=["official-csv-vs-pdf","csv-vs-excel"],
),
dict(
  slug="pdf-invoice-to-google-sheets",
  kind="howto",
  title="Convert PDF invoices to Google Sheets (free, private) · Netmend",
  meta="Turn a PDF invoice into a Google Sheet: extract the table in your browser, import the CSV, fix dates and decimals, and tick each invoice total before you share the file.",
  h1="Convert PDF invoices to <span>Google Sheets</span>",
  lead="Google Sheets will open a CSV, but it will not read a PDF invoice for you. Extract the line items on your computer, import the CSV into a Sheet, then fix the date and decimal traps that Sheets applies automatically — especially if you work in Europe or paste a US invoice into a European spreadsheet.",
  crumbs=("Guides", "../"),
  tool="invoice",
  sections="""
<h2>Extract first, then import</h2>
<p>The converter below runs in your browser and never uploads the invoice. It is useful when the PDF is a digital file with a line-item table. It is not useful on a scan or a photograph — see <a href="../scanned-pdf-invoices-to-excel/">scanned invoices</a>. Use “Every text row” if the first preview drops a wrapped description. Download the CSV to your computer, then in Google Sheets: File → Import → Upload, and import as a new sheet or a new tab.</p>
<p>On the import dialog, be deliberate:</p>
<ul>
<li>Choose the separator that matches the file (comma for a UK/US export from our tool, semicolon if you picked the European Excel option).</li>
<li>Convert text to numbers, dates and formulas only if you have already looked at a sample row. Sheets is helpful, and that is the problem: <b>03/04/2026</b> will become 3 April or 4 March depending on the locale of the spreadsheet, and <b>1,25</b> may become a thousand-and-twenty-five or a quarter.</li>
<li>If in doubt, import the columns as plain text, then use a helper column with <code>DATE</code>, <code>VALUE</code> or <code>SUBSTITUTE</code> to build real dates and numbers you can check. Our <a href="../../excel-functions/">formula translator</a> has the equivalent function names if your Sheets locale is not English (Google Sheets often still accepts English names, but it uses your locale’s separators).</li>
</ul>
<h2>A working sheet that you can tick</h2>
<p>Once the raw extract is in, build a clean tab rather than editing the import in place:</p>
<ol>
<li>One row per line item, with the invoice number repeated, plus a header row you type yourself (invoice number, date, supplier, description, quantity, unit price, net, tax, gross).</li>
<li>A second tab that lists one row per invoice: invoice number, the printed total from the PDF, and a <code>SUMIF</code> (or <code>SOMA.SE</code> in Portuguese Excel) of the line grosses. Every row on that tab should match. If it does not, stop and fix the extract before you share the file.</li>
<li>Keep a column with the original PDF file name, so a mismatch can be opened and checked.</li>
</ol>
<p>If the destination is QuickBooks or Xero, this Sheet is a working file, not the import file. Copy the checked rows into that product’s official template — see the <a href="../pdf-invoice-to-excel-quickbooks/">QuickBooks</a> and <a href="../pdf-invoice-to-excel-xero/">Xero</a> guides. Sheets is a fine place to clean the data; it is not a substitute for their column names.</p>
""",
  faqs=[
    ("Can I open a PDF directly in Google Sheets?","No usefully. Sheets opens CSVs and Excel files. Convert the PDF on your computer first, then import the CSV. A Drive OCR step on a scan is a separate, error-prone process — tick every total if you use it."),
    ("Why did 03/04 become the wrong day?","The spreadsheet locale decided whether that is 3 April or 4 March. Import dates as text first, or set the locale to match the invoice, then confirm the first few rows against the PDF."),
    ("Should I pick comma or semicolon in the tool?","Comma for typical Google Sheets and UK/US Excel (dot decimals). Semicolon for most mainland-European Excel. You can change this on the converter before you download, and again on the Sheets import dialog."),
  ],
  related_guides=["pdf-invoice-to-excel-quickbooks","pdf-invoice-to-excel-xero","scanned-pdf-invoices-to-excel","pdf-receipts-to-excel"],
  related_compare=["csv-vs-excel"],
),
]

COMPARES = [
dict(
  slug="official-csv-vs-pdf",
  kind="compare",
  title="Official bank CSV vs converting a statement PDF — which should you use? · Netmend",
  meta="An honest comparison: when a bank’s official CSV, XLS, QBO or MT940 is the right file, and when converting the official PDF statement is the only way to get a spreadsheet that ties out.",
  h1="Official bank CSV vs converting the <span>PDF</span>",
  lead="If the bank will give you a spreadsheet, take it. Converting the official PDF is the fallback, and sometimes the better record. This page is a comparison, not a sales pitch for either route.",
  crumbs=("Compare", "../"),
  tool="statement",
  sections="""
<h2>What the two files actually are</h2>
<p>An <b>official transaction export</b> (CSV, XLS, QBO, QFX, MT940, CAMT.053, midata) is a data file the bank generated from the same ledger as the app. It is usually the cleanest set of columns, and it is what accounting tools are built to import. It is not always a statement. Some banks say so in as many words: <a href="../../statement-to-csv/starling/">Starling</a> calls its feed-export CSV a transaction summary, not a verifiable monthly statement; <a href="../../statement-to-csv/nationwide/">Nationwide midata</a> is a comparison-site file that deliberately omits the last 31 days; <a href="../../statement-to-csv/commerzbank/">Commerzbank</a> distinguishes an Umsatz CSV from the Kontoauszug in the Postfach; <a href="../../statement-to-csv/us-bank/">U.S. Bank</a> lets you download three years of transactions but seven years of e-statement PDFs.</p>
<p>An <b>official statement PDF</b> is the document with the letterhead, the period, and the printed opening and closing balances. It is what a lender, a landlord, an auditor or a tax enquiry usually asks for. It is a poor working file until someone turns the table into rows. That is the only job a converter has.</p>
<h2>When the official export is the right choice</h2>
<ul>
<li>The dates you need are inside the export window (18 months of ABN AMRO XLS, two years of American Express Excel/CSV, three years of U.S. Bank CSV/QBO, twelve months of a Starling feed export, and so on).</li>
<li>You are importing into software that already understands that file (QBO into QuickBooks, official CSV into Xero, MT940 or CAMT.053 into an accountant’s tool).</li>
<li>You do not need the printed “True Copy” or letterhead in the same file — you can keep the PDF in a folder and work from the export.</li>
</ul>
<h2>When converting the PDF is the right choice</h2>
<ul>
<li>The bank never offered a spreadsheet, or the official export does not go back far enough.</li>
<li>You were only sent the PDF (a client, a tenant, a solicitor).</li>
<li>You need the rows to <b>tie out</b> to a specific statement: opening balance + movements = closing balance, with no missing 31-day gap and no mid-month feed that includes pending items.</li>
<li>The official export is a summary without a running balance, and you want a check column you can tick against the PDF.</li>
</ul>
<p>A converted PDF is only as good as the layout and the check. A text-based official PDF usually converts cleanly. A scan does not. And a conversion is not a certified copy of the statement — if a third party asked for the statement, send the official PDF, and keep the spreadsheet for the books.</p>
<p>The tool below is the converter we mean: it runs in your browser, and it is the wrong first step whenever the bank will still generate a CSV or XLS for the same dates. Our <a href="../../statement-to-csv/#bank-guides">bank-by-bank guides</a> start with that official path, then offer this fallback.</p>
""",
  faqs=[
    ("Is the official CSV “more accurate” than the PDF?","They should come from the same ledger, but they are not the same document. The PDF is the statement, with printed balances. The CSV is a data extract, sometimes for a different date range, and sometimes without pending or end-of-weekend items. Tick whichever file you use against the question you are trying to answer."),
    ("Can I throw the PDF away if I have the CSV?","Not if someone may ask for an official statement. Keep the PDF. Use the CSV (or a conversion) as the working file."),
    ("Which should I import into Xero or QuickBooks?","The bank’s official QBO, QFX or CSV, or a live feed, when it covers the dates. Convert the PDF only when that file does not exist or does not go back far enough, then reshape it to the official import layout."),
  ],
  related_guides=["bank-statement-to-quickbooks","bank-statement-to-xero"],
  related_compare=["csv-vs-excel","diy-vs-done-for-you","browser-vs-acrobat-vs-excel"],
),
dict(
  slug="csv-vs-excel",
  kind="compare",
  title="CSV vs Excel for bank statements — which format should you export? · Netmend",
  meta="An honest comparison of CSV and Excel after a statement conversion or a bank download: what each format keeps, what it breaks, and which one QuickBooks, Xero and Google Sheets actually want.",
  h1="CSV vs Excel for <span>bank statements</span>",
  lead="CSV is a plain text table. Excel is a workbook. For bank statements and invoice line items, the plain file is usually the one you should hand to another program — if you can stop Excel from “helping” the dates first.",
  crumbs=("Compare", "../"),
  tool="statement",
  sections="""
<h2>What each format is</h2>
<p>A <b>CSV</b> (comma-separated values, or semicolon-separated in much of Europe) is a text file. One row per line, one column per field, nothing else — no colours, no formulas, no hidden sheets, no number formats. QuickBooks Online’s official bank upload, Xero’s official CSV bank import, and most “upload a spreadsheet” screens are built around this. Our converter downloads a CSV, not an .xlsx, for that reason.</p>
<p>An <b>Excel workbook</b> (.xlsx) can hold several tabs, formulas, filters and formatting. It is the better file for a human review: a second tab that proves opening + movements = closing, a <code>SUMIF</code> per invoice, a colour on a row that failed the check. It is a worse interchange format, because the next program may not read the formulas, and because Excel itself may have already rewritten “03-09-2026” or “01/02” the last time someone double-clicked the file. Some banks’ “Excel” downloads are actually CSVs with an .xls name (<a href="../../statement-to-csv/revolut/">Revolut</a> is a documented example). Always look at the real file type.</p>
<h2>When CSV is the right thing to hand over</h2>
<ul>
<li>You are importing into QuickBooks, Xero, Google Sheets, or any tool with a column mapper.</li>
<li>You want a file that will still open in ten years without a particular version of Excel.</li>
<li>You need European and US/UK systems to agree on separators: you can choose comma or semicolon deliberately, and say so to the person who will open it.</li>
</ul>
<h2>When Excel is the right thing to keep</h2>
<ul>
<li>You are reviewing a packed year, and you want a proof tab, frozen headers, and a filter on the description.</li>
<li>You need two views of the same data (raw extract, and a cleaned import tab).</li>
<li>You will do further work — VAT analysis, a running balance, a pivot — before anyone imports anything.</li>
</ul>
<p>The practical habit is: <b>convert or download to CSV, immediately save a working copy as .xlsx, and never do the cleaning in the only copy of the CSV</b>. When the proof tab is clean, File → Export or Save As CSV from the import tab, and upload that. If you open a CSV in Excel to “just tidy the dates”, you are in the danger zone that official import guides keep warning about: a US Excel will turn a UK 05/03/2026 into 3 May, and it will do it silently.</p>
<p>Google Sheets sits in the middle. It imports CSV well if you set the separator and the locale yourself — see <a href="../pdf-invoice-to-google-sheets/">PDF invoices to Google Sheets</a> — but it has the same date-locale trap. The converter below gives you the CSV; what you do with it next is the choice this page is about.</p>
""",
  faqs=[
    ("Which format does QuickBooks want?","A CSV in the official 3-column or 4-column layout, or a QBO/QFX/OFX file from the bank. Not a formatted Excel workbook with a proof tab still in it."),
    ("Which format does Xero want?","A CSV you can map on the official import screen (or, when it is offered, Xero’s own PDF statement import). An .xlsx full of formulas is not the starting point."),
    ("Why does my CSV look like one column in Excel?","It is probably semicolon-separated and Excel expected commas, or the other way around. Use Data → From Text/CSV and pick the delimiter, instead of double-clicking the file."),
  ],
  related_guides=["bank-statement-to-quickbooks","bank-statement-to-xero","pdf-invoice-to-google-sheets"],
  related_compare=["official-csv-vs-pdf","browser-vs-acrobat-vs-excel"],
),
dict(
  slug="browser-vs-acrobat-vs-excel",
  kind="compare",
  title="In-browser PDF converter vs Adobe Acrobat vs Excel Power Query · Netmend",
  meta="An honest comparison of three ways to turn a PDF table into a spreadsheet: a private in-browser tool, Adobe Acrobat’s export, and Excel’s Get Data from PDF.",
  h1="In-browser converter vs Acrobat vs <span>Excel</span>",
  lead="Three ordinary ways to get a table out of a PDF: export it from Adobe Acrobat, pull it into Excel with Get Data / Power Query, or run a converter in your browser. None of them is magic, and all three fail on a scan. This page says what each one is good at so you can pick on purpose.",
  crumbs=("Compare", "../"),
  tool="statement",
  sections="""
<h2>The one thing they all need</h2>
<p>A <b>text layer</b>. If you cannot highlight and copy an amount from the PDF, Acrobat’s table export, Excel’s “From PDF” and our in-browser tool will all struggle or return nothing useful. For scans, see <a href="../scanned-pdf-invoices-to-excel/">scanned invoices</a> — the work is typing, OCR plus ticking, or a done-for-you pass, not a different export button.</p>
<h2>Adobe Acrobat (and similar paid PDF editors)</h2>
<p>Acrobat can export a PDF to Excel, Word or a spreadsheet-like table, and it has OCR for scans if you pay for that feature. It is often the best of the three when the invoice is a designed layout: logos, two-column addresses, totals in a box on the right. It also keeps you inside a tool you may already have, and the export can be a real .xlsx.</p>
<p>The costs are money, and trust: the file is opened in a heavy desktop or cloud application, and a “Export to Excel” that is almost right is still wrong until you tick the totals. Acrobat does not know that a bank statement’s “balance brought forward” is not a transaction, or that an Amex front-page “new charges” total must not be imported twice. You still have to clean the sheet.</p>
<h2>Excel Get Data / Power Query (From PDF)</h2>
<p>Recent Microsoft Excel versions can load a PDF as a data source (Data → Get Data → From File → From PDF). When it works, it is excellent: you get a query you can refresh if next month’s statement has the same layout, you can filter out header rows, and you never leave Excel. Power Query is also honest about tables — it will often show you several detected tables (the summary block, the transactions, the footnotes) and let you pick.</p>
<p>The limits: you need a desktop Excel that includes that command (it is not in every edition, and it is not in Google Sheets). A slightly different statement layout next month can break the query. European versus US number formats still need a careful change type step, or 1.234 becomes 1.234 or 1234 in the wrong way. And the PDF has to sit where Excel can read it; this is a good choice for a bookkeeper who already lives in Excel, not for someone who just wants a CSV to upload to Xero tonight.</p>
<h2>An in-browser converter (the tool on this page)</h2>
<p>Our tool runs locally with pdf.js, never uploads the file, and is free. It is built for statement-style tables and will also take a straightforward invoice table. You can pick a European or UK/US number format and a comma or semicolon CSV, which is the bit most generic “PDF to Excel” sites get wrong. There is no account, no page limit, and you can disconnect from the internet after the page has loaded.</p>
<p>It is the wrong tool when the layout is a designed one-off invoice, when the file is a scan, when you need a refreshable query, or when you already paid for Acrobat and it is doing a clean export. It is the right tool when you have a text-based statement or a simple tabular invoice, you want the file to stay on the computer, and you are willing to tick the totals — which you should do with the other two methods as well.</p>
<p>A fair default: try the official bank CSV or XLS first (<a href="../official-csv-vs-pdf/">official export vs PDF</a>). If you do not have one, try this tool for a statement, or Excel From PDF if you already work in desktop Excel. Use Acrobat when the page is a designed layout rather than a table. Tick the printed totals whichever route you took.</p>
""",
  faqs=[
    ("Which method is the most accurate?","None of them, until you check the printed totals. A clean text PDF will usually come out well from all three. The differences show up on awkward layouts, and on whether you notice a dropped row."),
    ("Does the free tool replace Acrobat?","No. Acrobat is stronger on designed pages and offers OCR if you pay for it. The free tool is stronger on privacy, cost, and European versus US number formats for straightforward tables."),
    ("Can Google Sheets read a PDF the way Excel can?","Not with an equivalent “From PDF” query. Convert to CSV first, then import the CSV — and set the locale yourself."),
  ],
  related_guides=["bank-statement-to-quickbooks","bank-statement-to-xero","scanned-pdf-invoices-to-excel","pdf-invoice-to-google-sheets"],
  related_compare=["official-csv-vs-pdf","csv-vs-excel","diy-vs-done-for-you"],
),
dict(
  slug="quickbooks-vs-xero-pdf",
  kind="compare",
  title="QuickBooks vs Xero when your source is a PDF statement or invoice · Netmend",
  meta="An honest comparison of QuickBooks Online and Xero when the file you have is a PDF: official bank-import rules, invoice and bill templates, and where a conversion still has to happen first.",
  h1="QuickBooks vs Xero when the source is a <span>PDF</span>",
  lead="Neither QuickBooks Online nor Xero is “better at PDFs” in a general sense. They import different official files, they name the columns differently, and Xero documents a PDF bank-statement import that QuickBooks does not. This page compares those official paths so you can pick a method, not a mascot.",
  crumbs=("Compare", "../"),
  tool="statement",
  sections="""
<h2>Bank and card statements</h2>
<p>Both products prefer a <b>live bank feed</b> when the bank offers one. Use that for current months. The comparison below is for catch-up work, a PDF you were sent, or a period the feed does not cover.</p>
<ul>
<li><b>QuickBooks Online</b> does not import a bank-statement PDF as a PDF. Official help tells you to upload a <b>CSV</b> in a 3-column (Date, Description, Amount, with withdrawals negative) or 4-column (Date, Description, Credit, Debit) layout, or to use QBO / QFX / OFX from the bank. There are strict formatting notes — one date format, no weekday text, no zeros, Credit/Debit headers without the word “amount”, and card files must go into a credit-card account. See <a href="../bank-statement-to-quickbooks/">import a PDF statement into QuickBooks</a>.</li>
<li><b>Xero</b> documents a <b>CSV bank-statement import</b> (you map date and amount, usually with money in positive and money out negative) and, separately, an official article <b>“Import a PDF bank statement”</b>. If that PDF import is available for your organisation and it accepts the file, you can skip a conversion. If it is not, or it rejects the layout, convert the PDF to CSV and use the official CSV import. See <a href="../bank-statement-to-xero/">import a PDF statement into Xero</a>.</li>
</ul>
<p>That PDF-import article is a real, documented difference in Xero’s favour — when it works. It is not a reason to switch products by itself, and it does not mean Xero will read every bank’s PDF. Always review the imported lines. Neither product will notice a dropped page for you.</p>
<h2>Invoices and bills</h2>
<p>On sales invoices and supplier bills, the two products are more alike than they are different: <b>both want a CSV in their own template, not a PDF</b>. You convert or type the line items, then import.</p>
<ul>
<li><b>QuickBooks Online:</b> Settings → Import data → Invoices (official required fields include invoice number, customer, invoice date, due date, item amount, item tax code; 100 invoices and 1,000 rows per import; no negative discounts). Bills are a separate import, with a separate sample file. Details in the <a href="../pdf-invoice-to-excel-quickbooks/">QuickBooks invoice guide</a>.</li>
<li><b>Xero:</b> official CSV templates for customer invoices and for bills, with headings you should not rename. Repeat the invoice number on every line of a multi-line invoice, and use tax types and account codes that already exist in the organisation. Details in the <a href="../pdf-invoice-to-excel-xero/">Xero invoice guide</a>.</li>
</ul>
<p>Do not import an invoice as a bank withdrawal in either product if you also intend to raise the invoice or bill. That is how expenses get posted twice. The PDF conversion, in both worlds, is only the step that produces a working spreadsheet.</p>
<h2>A fair way to choose a method (not a product)</h2>
<p>If you already live in one of the two, stay there — this page is not a switch recommendation. If you are importing a <b>bank PDF today</b>: try Xero’s official PDF import when you are on Xero and it is offered; otherwise convert to the official CSV shape for the product you have. If you are importing <b>invoices</b>: convert or type the lines, then use that product’s sample file. If you are on neither product and only need a spreadsheet, use the tool below and keep a CSV plus a proof tab — see <a href="../csv-vs-excel/">CSV vs Excel</a>.</p>
""",
  faqs=[
    ("Does Xero import PDFs and QuickBooks does not?","Xero documents a PDF import for some bank statements. QuickBooks Online’s official bank upload is a CSV or a QBO/QFX/OFX file. Neither product’s official invoice or bill import is “drop a PDF invoice here”."),
    ("Which official CSV is simpler?","QuickBooks is stricter about exactly two layouts. Xero lets you map columns on screen, which is more flexible and also easier to map wrongly (for example a running balance as an amount). Both need a check against the printed totals."),
    ("Should I pick a product based on this?","No. Pick a product on the rest of your books. This page only compares what each one officially accepts when the source happened to be a PDF."),
  ],
  related_guides=["bank-statement-to-quickbooks","bank-statement-to-xero","pdf-invoice-to-excel-quickbooks","pdf-invoice-to-excel-xero"],
  related_compare=["official-csv-vs-pdf","diy-vs-done-for-you"],
),
dict(
  slug="diy-vs-done-for-you",
  kind="compare",
  title="DIY PDF-to-Excel vs paying someone — when each is worth it · Netmend",
  meta="An honest comparison of doing a PDF-to-spreadsheet conversion yourself with a free in-browser tool, versus paying from $20 to have the totals checked for you.",
  h1="DIY conversion vs <span>paying someone</span>",
  lead="The free tool on this page is enough for a clean, text-based statement or a simple invoice table, if you are willing to tick the totals. Paying someone is worth it when the file is a scan, a packed year, a messy layout, or a delivery that has to match QuickBooks or Xero without you spending the evening on it. Here is how to decide, without the usual “just book us” evasions.",
  crumbs=("Compare", "../"),
  tool="statement",
  sections="""
<h2>When doing it yourself is the right call</h2>
<ul>
<li>You have one or two <b>digital</b> PDFs, and you can already highlight the amounts as text.</li>
<li>The layout is a straightforward table: a bank statement, a card statement, or an invoice with a normal line-item grid.</li>
<li>You can spend 10–20 minutes checking that opening + movements = closing, or that each invoice gross matches the PDF.</li>
<li>The bank will still generate an official CSV or XLS for the same dates — in which case you should not convert anything; see <a href="../official-csv-vs-pdf/">official CSV vs PDF</a>.</li>
</ul>
<p>In those cases, paying is a waste. Use the official export, or use the converter below, save the CSV, tick the totals, and stop. Our price is not a better method for a file you can already tick.</p>
<h2>When paying someone is the right call</h2>
<ul>
<li><b>Scans and photos.</b> The free tool will not read them. Typing a packed folder of till receipts or photographed invoices is real work; that is the job.</li>
<li><b>Volume.</b> A year of monthly statements, or a shoebox of mixed invoices, is several evenings of careful checking. A fixed pack of 20 pages from $20, 75 pages for $40, or 200 pages for $80 is often cheaper than your time, and the totals are checked against each document.</li>
<li><b>Layout that fights the tool.</b> Multi-column statements, summary blocks that look like transactions, password files you would rather not wrestle with, or an invoice design with the tax box in a graphic.</li>
<li><b>A target template.</b> If the delivery has to land in a QuickBooks or Xero import file, already mapped and already ticked, that is more than “get me some columns”.</li>
</ul>
<p>What you should still expect when you pay: the official PDFs stay the official documents; the spreadsheet is a working file; and a human check against printed totals is the point of the fee. A cheap automated service that does not tick the balances is not a bargain. We delete the files after delivery; this page itself never uploads them.</p>
<h2>A simple rule</h2>
<p>If you can tick the file tonight, do it yourself. If you already know you will not, or you have tried the tool and the preview is wrong, use the paid option. The converter is below either way — try it on one PDF before you decide. Other honest comparisons: <a href="../browser-vs-acrobat-vs-excel/">this tool vs Acrobat vs Excel</a>, and <a href="../official-csv-vs-pdf/">official bank exports vs a conversion</a>.</p>
""",
  faqs=[
    ("Is the free tool a trial of the paid service?","No. The tool is free, with no account and no page limit. The paid job is for files the tool is a poor fit for, or for packs you do not want to tick yourself."),
    ("What does from $20 actually buy?","Up to 20 pages for $20, 75 pages for $40, or 200 pages for $80, as a spreadsheet, with totals checked against the documents, in 48 hours, paid on Fiverr. Scans, messy layouts and accounting-template mapping are the reason to use it."),
    ("Will you convert a file the bank could have exported as CSV?","We can, if that is all you have. If you can still generate the official CSV or XLS, do that instead — it is faster and you should not pay anyone for it."),
  ],
  related_guides=["scanned-pdf-invoices-to-excel","bank-statement-to-quickbooks","bank-statement-to-xero"],
  related_compare=["official-csv-vs-pdf","browser-vs-acrobat-vs-excel"],
),
]
