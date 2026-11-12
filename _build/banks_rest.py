REST = [
dict(
  slug="millennium-bcp",
  name="Millennium bcp",
  short="Millennium bcp",
  title="Convert Millennium bcp bank statement PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert a Millennium bcp (BCP) extracto PDF to CSV. Official download in Documentos em formato digital, DD/MM/AAAA dates, débito/crédito columns and decimal comma.",
  h1="Convert a Millennium bcp extracto PDF to <span>CSV or Excel</span>",
  lead="Millennium bcp’s official extracto is a PDF. Portuguese Excel expects a decimal comma and a semicolon CSV. This page follows the bank’s own download path and the real columns on the statement.",
  region="Portugal (Banco Comercial Português, S.A.)",
  fmt="eu", sep=";",
  date="Dates are day-first, typically DD/MM/AAAA or DD-MM-AAAA. There are often two date columns: data do movimento and data valor (value date). They can differ by one or more business days.",
  decimal="Portuguese format: decimal comma, optional thousand dots (1.234,56). In this tool, choose “Excel in Europe” so the CSV uses a semicolon and a comma decimal, which is what Excel in Portugal expects.",
  download="""Official path, from Millennium bcp Help (“Posso fazer download do meu extrato de conta?”, checked 11/10/2026 and still current on 12/11/2026):
<ol>
<li>Log in on millenniumbcp.pt and open <b>Contas</b>.</li>
<li>Go to <b>Documentos em formato digital</b> → <b>Consultar extratos e notas de lançamento</b>.</li>
<li>Tick the box next to the extracto and click <b>Download</b>.</li>
</ol>
<p>The bank’s Extrato Digital page says the last 12 months stay available on the site and in the app. In the app the path is typically Contas → detail of the account → Extratos. You can also adhere to “Envio por email” so a PDF arrives each month.</p>""",
  pdf="Portuguese current-account extractos list each movement with a movement date, often a value date, a descrição (SEPA references and extra lines often wrap under the same movement), a débito column, a crédito column, and a running saldo. Debits and credits are separate columns — they are not a single signed amount. Multi-line descriptions and page breaks are the usual reason a naive copy-paste splits one movement into two rows.",
  csv="The bank’s official download is the PDF extracto, not a spreadsheet. After conversion you want a row per movement: Data, Data valor (if present), Descrição, Débito, Crédito, Saldo. Our tool outputs Date, Description, Amount (debits negative, credits positive) and Balance. If a column lands in the wrong place, try “Every text row” and we can tidy the layout for you.",
  tips="""<ul>
<li>Set this tool to European numbers and “Excel in Europe” before you convert.</li>
<li>After the download, check that opening saldo + créditos − débitos equals the closing saldo on the PDF. That single check catches almost every misread row.</li>
<li>If the PDF is password-protected, open it and “print to PDF” first so the tool can read the text.</li>
</ul>""",
  sources="Millennium bcp Help, “Gerir a minha Conta no Site”, and the Extrato Digital page (millenniumbcp.pt), checked 12/11/2026. Column layout from current Portuguese extracto PDFs (data, descrição, débito, crédito, saldo).",
  related=["cgd","santander","bbva","caixabank"],
  faqs=[
    ("Does Millennium bcp offer a CSV?","The official document in Documentos em formato digital is a PDF. This converter is for that file. Some screens show a movement list you can export — if you have a CSV already, use that."),
    ("Why does Excel show all the amounts in one column?","Excel in Portugal expects a semicolon CSV. Choose “Excel in Europe” in the tool, or open the file with Data → From Text/CSV."),
    ("What about data valor vs data do movimento?","They can differ. For bookkeeping, most people keep both and book on the movement date unless their accountant asks for the value date."),
  ],
),
dict(
  slug="cgd",
  name="Caixa Geral de Depósitos",
  short="CGD",
  title="Convert CGD (Caixa Geral de Depósitos) statement PDF to CSV/Excel · Netmend",
  meta="Convert a CGD Caixadirecta extracto PDF to CSV. Official digital documents, Data movimento / Data valor, Débito, Crédito, Saldo contabilístico, and DD-MM-AAAA dates.",
  h1="Convert a CGD extracto PDF to <span>CSV or Excel</span>",
  lead="Caixa Geral de Depósitos issues several official PDFs (extracto da conta à ordem, extracto global, cartão de crédito). This page covers the current-account statement: the columns, the Portuguese number format, and where to download it in Caixadirecta.",
  region="Portugal (Caixa Geral de Depósitos)",
  fmt="eu", sep=";",
  date="Dates are typically DD-MM-AAAA (for example 05-03-2025). Current-account statements usually have two dates: Data movimento (or Data mov.) and Data valor. They are not always the same day.",
  decimal="Portuguese format: 1.234,56 (dot thousands, comma decimal). Choose “Excel in Europe” in the tool.",
  download="""Official documents live in Caixadirecta’s <b>Documentos Digitais</b> area (cgd.pt describes Extrato Conta à Ordem, Extrato Global, Extrato Cartão de Crédito and others). The last 24 months of digital documents stay available to consult, copy or save.
<ol>
<li>Log in to Caixadirecta (caixadirecta.cgd.pt or the app).</li>
<li>Open <b>Documentos Digitais</b> (or Extratos / Consultas, depending on the profile the site loads).</li>
<li>Download the <b>Extrato Conta à Ordem</b> as a PDF. The Extrato Global is a monthly pack of several products — convert each current account separately if you need a clean sheet.</li>
</ol>
<p>Some Caixadirecta movement screens also let you export a period as CSV. If you still have that option, use the official CSV and keep the PDF as the proof document.</p>""",
  pdf="A CGD current-account extracto typically lists Data movimento, Data valor, Descritivo, Débito, Crédito and Saldo contabilístico (book balance). The book balance is the one to reconcile on every row. Where an available balance is also printed, it can include holds or overdrafts and should not be used for the check. Débito and Crédito are separate columns. The Extrato Integrado / Extrato Global can group several products in one PDF — only the current-account section should go into a transaction spreadsheet.",
  csv="Official digital statements are PDFs. After conversion you want one row per movement, with both dates if present, the full descritivo, money out, money in, and the book balance. Our tool outputs a signed Amount (debits negative) plus Balance. Transfers between your own CGD accounts (for example conta à ordem to poupança) appear as a debit on one statement and a credit on the other — exclude them if you are measuring spending.",
  tips="""<ul>
<li>Reconcile against the saldo contabilístico, not the available balance.</li>
<li>Export or convert each account on its own. There is no useful “all my CGD accounts in one CSV” for spending analysis.</li>
<li>Set European numbers and a semicolon CSV before you convert.</li>
</ul>""",
  sources="CGD, Documentos Digitais (cgd.pt/Particulares/Documentos-Digitais), checked 12/11/2026. Column names (Data mov./Data valor, Descritivo, Débito, Crédito, Saldo contabilístico) and DD-MM-AAAA / 1.234,56 from current CGD extracto layouts.",
  related=["millennium-bcp","santander","bbva","n26"],
  faqs=[
    ("Extrato Global or Extrato Conta à Ordem?","Use the Conta à Ordem statement for a transaction list. The Extrato Global is a monthly pack of several products and is harder to turn into one clean table."),
    ("Which saldo should I check?","Saldo contabilístico (book balance). The available balance, when printed, can include holds."),
    ("Does Caixadirecta offer CSV?","Some movement screens do. If you can export CSV, use that and keep the PDF as the official document. This tool is for the PDF extracto."),
  ],
),
dict(
  slug="santander",
  name="Santander UK",
  short="Santander UK",
  title="Convert Santander UK bank statement PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert a Santander UK statement PDF to CSV. Official midata CSV download, PDF columns (Date, Description, Money in, Money out, Balance) and day-first dates.",
  h1="Convert a Santander UK statement PDF to <span>CSV or Excel</span>",
  lead="Santander UK already offers a midata CSV of up to 12 months of transactions. Use that when you can. This page covers that official file, the PDF statement layout, and how Spain or Portugal statements differ.",
  region="Santander UK current accounts (notes below for Spain and Portugal)",
  fmt="us", sep=",",
  date="UK PDFs are day-first. Some Santander UK PDF tables print the transaction date as an ordinal day and month without a year (for example “21st January”); the year sits in the statement-period header, so a January statement that also shows late December needs care. Official midata/transaction CSVs use a normal date column.",
  decimal="UK format: 1,234.56 (comma thousands, dot decimal). Choose UK/US numbers and a comma CSV, unless your Excel is set to a European locale.",
  download="""Official midata CSV, from Santander UK (“Midata — helping you compare current accounts”):
<ol>
<li>Log in to Online Banking and open the <b>My Accounts and Transactions</b> tab.</li>
<li>Choose the current account, then <b>Download transactions</b> above the table.</li>
<li>In <b>Download to</b>, select <b>midata (CSV)</b> and download.</li>
</ol>
<p>Midata covers up to 12 months. Personal data such as your name, address and account number is masked, and some sensitive transactions are masked too — so midata is for comparison and analysis, not as a legal statement. For the official monthly PDF, use statements in Online or Mobile Banking.</p>""",
  pdf="A typical Santander UK current-account PDF lists Date, Description, Money in, Money out and Balance. Only one of Money in or Money out is filled on each row. If the date column omits the year, copy the year from the statement period and be careful on statements that span two calendar years.",
  csv="Prefer midata or the ordinary “Download transactions” CSV when you need rows for Excel, and keep the PDF as the official document. Our converter is for PDFs you were sent or for periods midata no longer covers.",
  tips="""<ul>
<li><b>Santander Spain and Portugal</b> use a different online banking path and a European number format (DD/MM/AAAA, 1.234,56, débito/crédito or importe and saldo). If your PDF is in Spanish or Portuguese, set this tool to European numbers and “Excel in Europe”.</li>
<li>Do not treat a midata file as proof of address: personal details are intentionally masked.</li>
</ul>""",
  sources="Santander UK midata help (santander.co.uk), checked 12/11/2026. PDF column notes (Date, Description, Money in, Money out, Balance) from current UK statement layouts the same day.",
  related=["barclays","lloyds","hsbc","natwest","monzo"],
  faqs=[
    ("Should I convert the PDF or download midata?","Download midata (or transaction CSV) for spreadsheet work. Convert the PDF when that export is missing, or when you need the official document turned into rows."),
    ("Why is there no year on the date?","Some UK PDFs print “21st January” and put the year only in the header. Add the year before you sort or import, especially around New Year."),
    ("Does this work for Santander in Spain or Portugal?","The tool will read a text PDF. Switch to European numbers. The download menus are not the same as Santander UK."),
  ],
),
dict(
  slug="bbva",
  name="BBVA",
  short="BBVA",
  title="Convert BBVA bank statement PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert a BBVA extracto PDF to CSV. Fecha de operación and fecha valor, concepto, importe, saldo, DD/MM/YYYY dates and European decimals.",
  h1="Convert a BBVA extracto PDF to <span>CSV or Excel</span>",
  lead="BBVA’s official extracto is a PDF from banca online or the app. Spanish Excel expects a decimal comma. This page lists the usual columns and the date and number formats so the CSV opens cleanly.",
  region="Spain (BBVA); other BBVA countries use local formats",
  fmt="eu", sep=";",
  date="Dates are day-first, typically DD/MM/YYYY or DD/MM/AAAA. Statements usually have Fecha de operación (trade/booking date) and Fecha valor. They can differ by a few days.",
  decimal="Spanish format: 1.234,56 (dot thousands, comma decimal). Choose “Excel in Europe”.",
  download="""In BBVA banca online (bbva.es) or the app:
<ol>
<li>Open <b>Cuentas</b>, select the account and the movement period you need.</li>
<li>For the official extracto, use the account menu and look for <b>Extractos</b> or <b>Correspondencia</b>, then download the PDF.</li>
<li>Some movement screens also let you export a list for a period. If a spreadsheet or CSV is offered, use that for Excel work and keep the PDF as the official document.</li>
</ol>""",
  pdf="A typical Spanish current-account extracto lists Fecha de operación, Fecha valor, Concepto or Movimiento, Importe (sometimes as separate cargo/abono columns) and Saldo. Descriptions and transfer references often wrap onto a second line under the same date. Credit-card extractos are a different document — convert them separately.",
  csv="After conversion you want one row per movement, with both dates if present, the full concepto, a signed amount (or cargo/abono) and the running saldo. Our tool outputs Date, Description, Amount and Balance. If cargo and abono come out in the wrong sign, try “Every text row” or send us the PDF.",
  tips="""<ul>
<li>Set European numbers and a semicolon CSV before you convert.</li>
<li>Reconcile opening saldo ± movements to the closing saldo on the PDF.</li>
<li>This page describes the Spanish extracto. BBVA Mexico or Argentina files often use a different date order or peso formats — check a known amount and a date after the 12th.</li>
</ul>""",
  sources="BBVA public pages on extractos bancarios (bbva.es) and current Spanish extracto layouts (Fecha de operación, Fecha valor, Concepto, Importe, Saldo; DD/MM/YYYY; 1.234,56), checked 12/11/2026. The exact menu label can vary between app versions.",
  related=["caixabank","santander","ing","n26"],
  faqs=[
    ("Fecha de operación or fecha valor?","Keep both if the PDF has them. Most bookkeeping uses the operation date unless your accountant asks for the value date."),
    ("Why are the amounts huge in Excel?","The file is a European CSV. Open it with a semicolon separator, or choose “Excel in Europe” in the tool."),
    ("Can I convert a credit-card extracto?","Yes if it is a text PDF, but the columns differ (no running account saldo in the same way). Convert it to a separate file."),
  ],
),
dict(
  slug="caixabank",
  name="CaixaBank",
  short="CaixaBank",
  title="Convert CaixaBank statement PDF to CSV/Excel (free, private) · Netmend",
  meta="Convert a CaixaBank extracto PDF to CSV. CaixaBankNow download path, fecha / fecha valor, concepto, importe, saldo, DD/MM/AAAA and 1.234,56.",
  h1="Convert a CaixaBank extracto PDF to <span>CSV or Excel</span>",
  lead="CaixaBank issues official PDF extractos through CaixaBankNow. This page covers the usual columns and the Spanish date and number formats, so you can turn that PDF into a sheet Excel in Spain will open correctly.",
  region="Spain (CaixaBank / CaixaBankNow)",
  fmt="eu", sep=";",
  date="Dates are day-first, typically DD/MM/AAAA. You will usually see Fecha and Fecha valor on each movement.",
  decimal="Spanish format: 1.234,56. Choose “Excel in Europe” (semicolon CSV, comma decimal).",
  download="""In CaixaBankNow (caixabank.es / the app):
<ol>
<li>Go to <b>Cuentas</b> → <b>Mis cuentas</b> and select the account.</li>
<li>Use <b>Buscar movimientos</b> (or the equivalent movements search) and set the period.</li>
<li>Download the official extracto as a PDF. If the screen also offers an Excel or CSV export of the movement list, use that for spreadsheet work and keep the PDF as the legal document.</li>
</ol>""",
  pdf="A typical CaixaBank current-account extracto lists Fecha, Fecha valor, Concepto or Movimiento, Importe and Saldo. Importe may be a single signed column or separate cargo/abono columns depending on the product and period. Long SEPA references wrap under the concepto. Credit-card and account extractos should not be mixed in one file.",
  csv="Our tool outputs Date, Description, Amount (signed) and Balance. Set European numbers first. After conversion, check that the last Balance matches the closing saldo on the PDF.",
  tips="""<ul>
<li>Do not mix an account extracto and a card extracto in the same CSV.</li>
<li>If Excel smears an entire row into column A, the separator is wrong — choose “Excel in Europe”. </li>
</ul>""",
  sources="CaixaBank public help on consulting saldo and movements in banca digital (caixabank.es), checked 12/11/2026. Column and format notes (Fecha, Fecha valor, Concepto, Importe, Saldo; DD/MM/AAAA; 1.234,56) from current Spanish extracto layouts the same day.",
  related=["bbva","santander","ing","n26"],
  faqs=[
    ("Is there a native Excel export?","Some CaixaBankNow movement views offer a file export. If you have it, use it. This converter is for the official PDF extracto."),
    ("What number format should I pick?","European 1.234,56 and a semicolon CSV, unless you are opening the file in a US or UK Google Sheet that expects commas."),
    ("Can I convert several months at once?","Yes, one PDF at a time, then concatenate the CSVs after each period’s closing saldo has been checked."),
  ],
),
]
