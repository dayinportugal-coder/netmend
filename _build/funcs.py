# 30 most-searched Excel functions. Names match excel-functions/data.js
# (Portugal Portuguese). Examples use English argument separators in `example`;
# the builder localises names, booleans, separators and decimals.

LANGS = ["en","pt","es","fr","de","it"]
LNAME = {"en":"English","pt":"Português (PT)","es":"Español","fr":"Français","de":"Deutsch","it":"Italiano"}
BOOL = {
  "en":{"TRUE":"TRUE","FALSE":"FALSE"},
  "pt":{"TRUE":"VERDADEIRO","FALSE":"FALSO"},
  "es":{"TRUE":"VERDADERO","FALSE":"FALSO"},
  "fr":{"TRUE":"VRAI","FALSE":"FAUX"},
  "de":{"TRUE":"WAHR","FALSE":"FALSCH"},
  "it":{"TRUE":"VERO","FALSE":"FALSO"},
}
# en, pt, es, fr, de, it
NAMES = {
"SUM":["SUM","SOMA","SUMA","SOMME","SUMME","SOMMA"],
"AVERAGE":["AVERAGE","MÉDIA","PROMEDIO","MOYENNE","MITTELWERT","MEDIA"],
"COUNT":["COUNT","CONTAR","CONTAR","NB","ANZAHL","CONTA.NUMERI"],
"COUNTA":["COUNTA","CONTAR.VAL","CONTARA","NBVAL","ANZAHL2","CONTA.VALORI"],
"COUNTIF":["COUNTIF","CONTAR.SE","CONTAR.SI","NB.SI","ZÄHLENWENN","CONTA.SE"],
"COUNTIFS":["COUNTIFS","CONTAR.SE.S","CONTAR.SI.CONJUNTO","NB.SI.ENS","ZÄHLENWENNS","CONTA.PIÙ.SE"],
"SUMIF":["SUMIF","SOMA.SE","SUMAR.SI","SOMME.SI","SUMMEWENN","SOMMA.SE"],
"SUMIFS":["SUMIFS","SOMA.SE.S","SUMAR.SI.CONJUNTO","SOMME.SI.ENS","SUMMEWENNS","SOMMA.PIÙ.SE"],
"IF":["IF","SE","SI","SI","WENN","SE"],
"IFS":["IFS","SE.S","SI.CONJUNTO","SI.CONDITIONS","WENNS","PIÙ.SE"],
"IFERROR":["IFERROR","SE.ERRO","SI.ERROR","SIERREUR","WENNFEHLER","SE.ERRORE"],
"AND":["AND","E","Y","ET","UND","E"],
"VLOOKUP":["VLOOKUP","PROCV","BUSCARV","RECHERCHEV","SVERWEIS","CERCA.VERT"],
"HLOOKUP":["HLOOKUP","PROCH","BUSCARH","RECHERCHEH","WVERWEIS","CERCA.ORIZZ"],
"XLOOKUP":["XLOOKUP","PROCX","BUSCARX","RECHERCHEX","XVERWEIS","CERCA.X"],
"INDEX":["INDEX","ÍNDICE","INDICE","INDEX","INDEX","INDICE"],
"MATCH":["MATCH","CORRESP","COINCIDIR","EQUIV","VERGLEICH","CONFRONTA"],
"ROUND":["ROUND","ARRED","REDONDEAR","ARRONDI","RUNDEN","ARROTONDA"],
"SUMPRODUCT":["SUMPRODUCT","SOMARPRODUTO","SUMAPRODUCTO","SOMMEPROD","SUMMENPRODUKT","MATR.SOMMA.PRODOTTO"],
"DATE":["DATE","DATA","FECHA","DATE","DATUM","DATA"],
"EOMONTH":["EOMONTH","FIMMÊS","FIN.MES","FIN.MOIS","MONATSENDE","FINE.MESE"],
"NETWORKDAYS":["NETWORKDAYS","DIATRABALHOTOTAL","DIAS.LAB","NB.JOURS.OUVRES","NETTOARBEITSTAGE","GIORNI.LAVORATIVI.TOT"],
"CONCATENATE":["CONCATENATE","CONCATENAR","CONCATENAR","CONCATENER","VERKETTEN","CONCATENA"],
"TEXTJOIN":["TEXTJOIN","UNIRTEXTO","UNIRCADENAS","JOINDRE.TEXTE","TEXTVERKETTEN","TESTO.UNISCI"],
"LEFT":["LEFT","ESQUERDA","IZQUIERDA","GAUCHE","LINKS","SINISTRA"],
"RIGHT":["RIGHT","DIREITA","DERECHA","DROITE","RECHTS","DESTRA"],
"MID":["MID","SEG.TEXTO","EXTRAE","STXT","TEIL","STRINGA.ESTRAI"],
"LEN":["LEN","NÚM.CARAT","LARGO","NBCAR","LÄNGE","LUNGHEZZA"],
"TRIM":["TRIM","COMPACTAR","ESPACIOS","SUPPRESPACE","GLÄTTEN","ANNULLA.SPAZI"],
"TEXT":["TEXT","TEXTO","TEXTO","TEXTE","TEXT","TESTO"],
"FILTER":["FILTER","FILTRAR","FILTRAR","FILTRE","FILTER","FILTRO"],
"UNIQUE":["UNIQUE","EXCLUSIVOS","UNICOS","UNIQUE","EINDEUTIG","UNICI"],
"SORT":["SORT","ORDENAR","ORDENAR","TRIER","SORTIEREN","DATI.ORDINA"],
"PMT":["PMT","PGTO","PAGO","VPM","RMZ","RATA"],
}

def names(en):
    row=NAMES[en]
    return {LANGS[i]:row[i] for i in range(6)}

FUNCS = [
dict(slug="vlookup", en="VLOOKUP", purpose="Looks up a value in the first column of a range and returns a value from a column to its right.",
     syntax="=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])",
     example='=VLOOKUP(A2,Prices!A:C,3,FALSE)',
     why="It is still the lookup most tutorials teach, and the name everyone searches: PROCV, BUSCARV, RECHERCHEV, SVERWEIS, CERCA.VERT.",
     mistakes="""<ul>
<li>The fourth argument defaults to approximate match if you omit it. For an exact product code always pass FALSE (FALSO / FAUX / FALSCH / FALSO).</li>
<li>VLOOKUP can only look to the <b>right</b> of the first column. If the return column is to the left, use INDEX/MATCH or XLOOKUP.</li>
<li>Inserting a column inside the table silently shifts col_index_num. INDEX/MATCH and XLOOKUP do not have that problem.</li>
<li>Copied from an English tutorial into Portuguese Excel, the formula fails because of both the name and the comma separators.</li>
</ul>""",
     related=["xlookup","index-indice","match","iferror"],
     faqs=[
       ("What is VLOOKUP in Portuguese?","PROCV, in both Portugal and Brazil. Spanish BUSCARV, French RECHERCHEV, German SVERWEIS, Italian CERCA.VERT."),
       ("Why do I get the wrong row?","You probably omitted FALSE, so Excel is doing an approximate match on an unsorted first column."),
       ("VLOOKUP vs XLOOKUP?","XLOOKUP can look left or right, has a built-in “not found” value, and does not break when you insert columns. Use it if your Excel has it; keep VLOOKUP when you need to share with older Excel."),
     ]),
dict(slug="xlookup", en="XLOOKUP", purpose="Looks up a value in one range and returns the matching value from another range, in any direction.",
     syntax="=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])",
     example='=XLOOKUP(A2,Prices!A:A,Prices!C:C,"not found")',
     why="It replaces most VLOOKUP and INDEX/MATCH work, but the name is still new in other languages (PROCX, BUSCARX, RECHERCHEX, XVERWEIS, CERCA.X).",
     mistakes="""<ul>
<li>lookup_array and return_array must be the same size. A mismatch returns #VALUE!.</li>
<li>match_mode 0 (or omitted) is exact. Use -1 for exact or next smaller (useful for commission tiers). 1 is exact or next larger. 2 is a wildcard match.</li>
<li>If the return array is a whole row or several columns, XLOOKUP spills. When monthly columns are inserted, a hard-coded range such as L:L will not move — look up the header (for example the last heading before “Total”) instead of a fixed column letter.</li>
<li>Not available in very old Excel (Excel 2019 and earlier without Microsoft 365). Have a VLOOKUP or INDEX/MATCH fallback if you share the file.</li>
</ul>""",
     related=["vlookup","index-indice","match","iferror"],
     faqs=[
       ("What is XLOOKUP in Portuguese?","PROCX. Spanish BUSCARX, French RECHERCHEX, German XVERWEIS, Italian CERCA.X."),
       ("How do I return the last two columns before a Total heading?","Do not hard-code column L. Use MATCH or XMATCH on the header row to find “Total”, then return the two columns to its left, or use a table with structured names."),
       ("Can it look to the left?","Yes. The lookup array and the return array are separate, unlike VLOOKUP."),
     ]),
dict(slug="index-indice", en="INDEX", purpose="Returns the value (or reference) at a given row and column position in a range.",
     syntax="=INDEX(array, row_num, [column_num])",
     example="=INDEX(Prices!C:C,2)",
     why="Together with MATCH it is the reliable alternative to VLOOKUP, and it works in older Excel that does not have XLOOKUP.",
     mistakes="""<ul>
<li>INDEX alone is just “the value in position N”. You almost always pair it with MATCH.</li>
<li>A classic exact lookup: <code>=INDEX(Prices!C:C,MATCH(A2,Prices!A:A,0))</code>. The 0 in MATCH is exact match — do not omit it.</li>
<li>If you use a two-dimensional array, you must pass both row_num and column_num.</li>
<li>INDEX names look similar across languages (INDEX stays INDEX in French and German) — the partner function MATCH does not.</li>
</ul>""",
     related=["match","vlookup","xlookup"],
     faqs=[
       ("What is INDEX in Portuguese?","ÍNDICE. Spanish INDICE, French INDEX, German INDEX, Italian INDICE."),
       ("Why use INDEX/MATCH instead of VLOOKUP?","It can look left, it does not break when you insert a column, and you can reuse the MATCH result."),
       ("Does it work in older Excel?","Yes. That is why it is still the standard fallback when XLOOKUP is missing."),
     ]),
dict(slug="match", en="MATCH", purpose="Returns the position of a value in a range (the row or column number, not the value itself).",
     syntax="=MATCH(lookup_value, lookup_array, [match_type])",
     example="=MATCH(A2,Prices!A:A,0)",
     why="It is the engine behind INDEX/MATCH. People search for it under CORRESP, COINCIDIR, EQUIV, VERGLEICH and CONFRONTA.",
     mistakes="""<ul>
<li>match_type 0 is exact. 1 (or omitted) assumes the range is sorted ascending and can return the wrong position. -1 assumes descending order.</li>
<li>MATCH returns a number (the position), not the looked-up value. Wrap it in INDEX to get the value.</li>
<li>The lookup array should be one row or one column, not a block.</li>
</ul>""",
     related=["index-indice","vlookup","xlookup"],
     faqs=[
       ("What is MATCH in Portuguese?","CORRESP. Spanish COINCIDIR, French EQUIV, German VERGLEICH, Italian CONFRONTA."),
       ("Why do I get #N/A?","No exact match (and you used 0), or extra spaces. Try TRIM on both sides, or use XLOOKUP with an if_not_found message."),
       ("MATCH vs XMATCH?","XMATCH is the newer version (search last-to-first, built-in not-found). MATCH is the one that works in older Excel."),
     ]),
dict(slug="sumif", en="SUMIF", purpose="Adds the numbers in a range that meet one condition.",
     syntax="=SUMIF(range, criteria, [sum_range])",
     example='=SUMIF(B:B,"Rent",C:C)',
     why="The everyday “total of this category” formula, under SOMA.SE, SUMAR.SI, SOMME.SI, SUMMEWENN, SOMMA.SE.",
     mistakes="""<ul>
<li>If you fill the formula down a table, lock the ranges (<code>$B:$B</code> and <code>$C:$C</code>). An unlocked SUMIF that shifts one row at a time is a classic silent error.</li>
<li>For several conditions (category and date, or category and project), use SUMIFS, not a second SUMIF.</li>
<li>Criteria that refer to a cell need concatenation: <code>"&gt;="&amp;F1</code>, not <code>"&gt;=F1"</code>.</li>
</ul>""",
     related=["sumifs","countif","sum","sumproduct"],
     faqs=[
       ("What is SUMIF in Portuguese?","SOMA.SE. Spanish SUMAR.SI, French SOMME.SI, German SUMMEWENN, Italian SOMMA.SE."),
       ("Can I use two conditions?","Use SUMIFS (SOMA.SE.S, SUMAR.SI.CONJUNTO, SOMME.SI.ENS, SUMMEWENNS, SOMMA.PIÙ.SE)."),
       ("Text or numbers in the criteria?","Text goes in quotes. A number can be bare or in quotes. Cell references should be concatenated with the operator."),
     ]),
dict(slug="sumifs", en="SUMIFS", purpose="Adds numbers that meet several conditions at once.",
     syntax="=SUMIFS(sum_range, criteria_range1, criteria1, [criteria_range2, criteria2], …)",
     example='=SUMIFS(C:C,B:B,"Rent",A:A,">="&DATE(2026,1,1))',
     why="The standard way to total by category and date, or by account and row number (for a running balance). The argument order is not the same as SUMIF.",
     mistakes="""<ul>
<li>SUMIFS puts the <b>sum range first</b>. SUMIF puts it last (and makes it optional). Mixing the two is the usual #VALUE! or a plausible but wrong total.</li>
<li>Every criteria range must be the same size as the sum range.</li>
<li>A running balance per account in older Excel is often two SUMIFS (money in minus money out) with a “row number &lt;= this row” condition. It works, but it gets heavy on very long lists; a helper column per account can be faster.</li>
</ul>""",
     related=["sumif","countifs","sumproduct","if"],
     faqs=[
       ("What is SUMIFS in Portuguese?","SOMA.SE.S. Spanish SUMAR.SI.CONJUNTO, French SOMME.SI.ENS, German SUMMEWENNS, Italian SOMMA.PIÙ.SE."),
       ("Why is the argument order different from SUMIF?","Historical accident. Remember: SUMIFS starts with the numbers you are adding."),
       ("How do I do a running balance by account?","Add a row-number helper column, then SUMIFS of Money in minus SUMIFS of Money out, both filtered to that account and to rows up to the current one. Transfers between accounts should be two rows (out of A, into B), not one."),
     ]),
dict(slug="countif", en="COUNTIF", purpose="Counts the cells in a range that meet one condition.",
     syntax="=COUNTIF(range, criteria)",
     example='=COUNTIF(B:B,"Rent")',
     why="Simple, and easy to get a quiet 0. The name becomes CONTAR.SE, CONTAR.SI, NB.SI, ZÄHLENWENN, CONTA.SE.",
     mistakes="""<ul>
<li>The ≥ symbol is not an operator. <code>=COUNTIF(E2:E100,"≥500")</code> looks for the literal text “≥500”. Always type <code>&gt;=</code>.</li>
<li>A cell in the criteria needs concatenation: <code>"&gt;="&amp;F1</code>, not <code>"&gt;=F1"</code>.</li>
<li>Numbers stored as text (left-aligned after a CSV import) do not match a numeric criterion. Use VALUE or Text to Columns first.</li>
<li>For dates, use DATE in the criteria: <code>"&gt;="&amp;DATE(2026,7,1)</code>. A typed date string depends on the regional settings and can match nothing.</li>
</ul>""",
     related=["countifs","sumif","count","counta"],
     faqs=[
       ("What is COUNTIF in Portuguese?","CONTAR.SE. Spanish CONTAR.SI, French NB.SI, German ZÄHLENWENN, Italian CONTA.SE."),
       ("Why do I get 0?","A literal ≥, a criterion written as \">=F1\", numbers stored as text, or a date string in the wrong locale are the four usual causes."),
       ("How do I count non-empty cells with a condition?","COUNTIF with \"&lt;&gt;\" counts non-empty cells. For several conditions, use COUNTIFS."),
     ]),
dict(slug="countifs", en="COUNTIFS", purpose="Counts cells that meet several conditions at once.",
     syntax="=COUNTIFS(criteria_range1, criteria1, [criteria_range2, criteria2], …)",
     example='=COUNTIFS(B:B,"Rent",C:C,">100")',
     why="The multi-condition version of COUNTIF. Names: CONTAR.SE.S, CONTAR.SI.CONJUNTO, NB.SI.ENS, ZÄHLENWENNS, CONTA.PIÙ.SE.",
     mistakes="""<ul>
<li>All ranges must be the same size.</li>
<li>The same operator and concatenation rules as COUNTIF apply: <code>"&gt;="&amp;F1</code>, never a typographic ≥.</li>
<li>AND is implicit (every condition at once). For OR, add two COUNTIFS, or use SUMPRODUCT.</li>
</ul>""",
     related=["countif","sumifs","count"],
     faqs=[
       ("What is COUNTIFS in Portuguese?","CONTAR.SE.S. Spanish CONTAR.SI.CONJUNTO, French NB.SI.ENS, German ZÄHLENWENNS, Italian CONTA.PIÙ.SE."),
       ("Can I count with OR, not AND?","Add two COUNTIFS, and subtract the overlap if a row could meet both."),
     ]),
dict(slug="if", en="IF", purpose="Returns one value if a condition is true, and another if it is false.",
     syntax="=IF(logical_test, value_if_true, value_if_false)",
     example='=IF(C2>=100,"ok","low")',
     why="The first function most people meet — and the one whose name changes to SE, SI, WENN, which is easy to miss in a translated workbook.",
     mistakes="""<ul>
<li>Nested IFs become unreadable after three levels. Prefer IFS, or a lookup table with XLOOKUP / VLOOKUP.</li>
<li>To test several conditions together, wrap them in AND / OR (E / OU, Y / O, ET / OU, UND / ODER).</li>
<li>European Excel uses a semicolon between arguments: <code>=SE(C2&gt;=100;"ok";"low")</code>.</li>
</ul>""",
     related=["ifs","iferror","and","vlookup"],
     faqs=[
       ("What is IF in Portuguese?","SE. Spanish SI, French SI, German WENN, Italian SE."),
       ("IF vs IFS?","IFS checks several conditions in order and stops at the first true one. Use it instead of a ladder of nested IFs."),
     ]),
dict(slug="ifs", en="IFS", purpose="Checks several conditions in order and returns the value for the first one that is true.",
     syntax="=IFS(logical_test1, value1, [logical_test2, value2], …)",
     example='=IFS(C2>=1000,"high",C2>=100,"mid",TRUE,"low")',
     why="Cleaner than nested IFs for tiers (high / mid / low). The last TRUE (VERDADEIRO, WAHR…) is the catch-all.",
     mistakes="""<ul>
<li>Conditions are tested top to bottom. Put the tightest test first (C2&gt;=1000 before C2&gt;=100) or a mid-tier will never run.</li>
<li>If no condition is true and there is no final TRUE, IFS returns #N/A. End with TRUE and a default value.</li>
<li>Not in very old Excel. Nested IF is the fallback.</li>
</ul>""",
     related=["if","xlookup","vlookup"],
     faqs=[
       ("What is IFS in Portuguese?","SE.S. Spanish SI.CONJUNTO, French SI.CONDITIONS, German WENNS, Italian PIÙ.SE."),
       ("How do I add a default?","Finish with TRUE (or VERDADEIRO / VRAI / WAHR / VERO) and the default value."),
     ]),
dict(slug="iferror", en="IFERROR", purpose="Returns a fallback value if the formula produces an error, otherwise the formula result.",
     syntax="=IFERROR(value, value_if_error)",
     example='=IFERROR(VLOOKUP(A2,Prices!A:C,3,FALSE),"not found")',
     why="The usual wrapper around a lookup, so a missing code shows “not found” instead of #N/A. Names: SE.ERRO, SI.ERROR, SIERREUR, WENNFEHLER, SE.ERRORE.",
     mistakes="""<ul>
<li>IFERROR catches every error, including #DIV/0! and #VALUE! you might want to see. If you only want to hide #N/A, use IFNA where available.</li>
<li>Do not wrap an entire model in IFERROR — you will hide real mistakes. Use it on the lookup or the external input, not on every total.</li>
</ul>""",
     related=["vlookup","xlookup","if"],
     faqs=[
       ("What is IFERROR in Portuguese?","SE.ERRO. Spanish SI.ERROR, French SIERREUR, German WENNFEHLER, Italian SE.ERRORE."),
       ("IFERROR vs IFNA?","IFNA only catches #N/A, which is what a failed lookup returns. Prefer it when your Excel has it."),
     ]),
dict(slug="and", en="AND", purpose="Returns TRUE only if every condition is true.",
     syntax="=AND(logical1, [logical2], …)",
     example='=AND(C2>0,D2<>"")',
     why="Used inside IF. The name becomes a single letter in several languages (E, Y, ET, UND), which is easy to miss when you translate a formula by hand.",
     mistakes="""<ul>
<li>AND cannot live in a SUMIF criteria on its own. For several conditions on a sum or count, use SUMIFS / COUNTIFS.</li>
<li>In Portuguese the function is just <code>E</code>. A missing letter looks like a broken formula, not a missing function name.</li>
</ul>""",
     related=["if","ifs","sumifs"],
     faqs=[
       ("What is AND in Portuguese?","E. Spanish Y, French ET, German UND, Italian E."),
       ("AND vs OR?","AND needs every test to be true. OR (OU / O / OU / ODER / O) needs only one."),
     ]),
dict(slug="sum", en="SUM", purpose="Adds numbers, ranges or both.",
     syntax="=SUM(number1, [number2], …)",
     example="=SUM(C2:C100)",
     why="The most-used function, and still worth a language page: SOMA, SUMA, SOMME, SUMME, SOMMA. Also the function hidden inside “just type a total” advice.",
     mistakes="""<ul>
<li>SUM ignores text. If a CSV imported amounts as text, the total stays 0. Coerce with VALUE or Text to Columns.</li>
<li>A total that includes another total will double-count. Sum the data rows, not a mix of data and subtotals.</li>
</ul>""",
     related=["sumif","sumifs","average","sumproduct"],
     faqs=[
       ("What is SUM in Portuguese?","SOMA. Spanish SUMA, French SOMME, German SUMME, Italian SOMMA."),
       ("Why is my SUM zero?","The “numbers” are probably text. Check alignment and a VALUE conversion."),
     ]),
dict(slug="average", en="AVERAGE", purpose="Returns the arithmetic mean of numbers, ignoring empty cells and (usually) text.",
     syntax="=AVERAGE(number1, [number2], …)",
     example="=AVERAGE(C2:C100)",
     why="Everyday average, under MÉDIA, PROMEDIO, MOYENNE, MITTELWERT, MEDIA. AVERAGE ignores blanks; a zero is still a zero and will pull the mean down.",
     mistakes="""<ul>
<li>A zero and a blank are not the same. If missing data was entered as 0, AVERAGE will treat it as a real value.</li>
<li>For “average if”, use AVERAGEIF / AVERAGEIFS (not on this short list, but the translator knows them if they are in your formula’s function list… they may be left unchanged if they are not). State the condition clearly or use SUMIF/COUNTIF.</li>
</ul>""",
     related=["sum","count","if"],
     faqs=[
       ("What is AVERAGE in Portuguese?","MÉDIA. Spanish PROMEDIO, French MOYENNE, German MITTELWERT, Italian MEDIA."),
       ("Does it include zeros?","Yes. It skips empty cells, not zeros."),
     ]),
dict(slug="concatenate", en="CONCATENATE", purpose="Joins several pieces of text into one string.",
     syntax="=CONCATENATE(text1, [text2], …)",
     example='=CONCATENATE(A2," ",B2)',
     why="Still widely taught, even though TEXTJOIN and the &amp; operator are usually better. Names: CONCATENAR, CONCATENER, VERKETTEN, CONCATENA.",
     mistakes="""<ul>
<li>CONCATENATE cannot use a delimiter for a whole range. For “join A2:A10 with commas, skip blanks”, use TEXTJOIN.</li>
<li>Microsoft recommends CONCAT or TEXTJOIN in current Excel. CONCATENATE still works, which is why old workbooks keep it.</li>
</ul>""",
     related=["textjoin","text","left","trim"],
     faqs=[
       ("What is CONCATENATE in Portuguese?","CONCATENAR (same in Spanish). French CONCATENER, German VERKETTEN, Italian CONCATENA."),
       ("Should I still use it?","For two or three pieces, <code>=A2&amp;\" \"&amp;B2</code> is enough. For a list, use TEXTJOIN."),
     ]),
dict(slug="textjoin", en="TEXTJOIN", purpose="Joins a range of text with a delimiter, and can skip empty cells.",
     syntax="=TEXTJOIN(delimiter, ignore_empty, text1, [text2], …)",
     example='=TEXTJOIN(", ",TRUE,A2:A10)',
     why="The modern way to build a list, a tag line or an address. Names: UNIRTEXTO, UNIRCADENAS, JOINDRE.TEXTE, TEXTVERKETTEN, TESTO.UNISCI.",
     mistakes="""<ul>
<li>The second argument is a boolean (TRUE to skip blanks). In Portuguese that is VERDADEIRO, not TRUE — the translator will swap it.</li>
<li>Not in very old Excel. CONCATENATE or a helper column is the fallback.</li>
</ul>""",
     related=["concatenate","text","trim","filter"],
     faqs=[
       ("What is TEXTJOIN in Portuguese?","UNIRTEXTO. Spanish UNIRCADENAS, French JOINDRE.TEXTE, German TEXTVERKETTEN, Italian TESTO.UNISCI."),
       ("How do I skip empty cells?","Set ignore_empty to TRUE / VERDADEIRO / VERDADERO / VRAI / WAHR / VERO."),
     ]),
dict(slug="text", en="TEXT", purpose="Formats a number or a date as text, using a format code.",
     syntax='=TEXT(value, format_text)',
     example='=TEXT(C2,"0.00")',
     why="Useful, and dangerous across languages: the format codes themselves are localised (yyyy vs aaaa vs jjjj).",
     mistakes="""<ul>
<li>English date codes use <code>yyyy-mm-dd</code>. Portuguese and Spanish often use <code>aaaa-mm-dd</code>, French <code>aaaa-mm-jj</code>, German <code>jjjj-mm-tt</code>, Italian <code>aaaa-mm-gg</code>. A copied format string is a frequent cause of a date turning into a 5-digit serial.</li>
<li>The result is text, not a number. You cannot SUM a column of TEXT() results without VALUE.</li>
</ul>""",
     related=["date","left","value" if False else "trim"],
     faqs=[
       ("What is TEXT in Portuguese?","TEXTO (same in Spanish). French TEXTE, German TEXT, Italian TESTO."),
       ("Why did my date become ##### or a serial?","The format code is in the wrong language. Use aaaa for Portuguese years, jjjj for German, and so on."),
     ]),
dict(slug="left", en="LEFT", purpose="Returns the first characters of a text string.",
     syntax="=LEFT(text, [num_chars])",
     example="=LEFT(A2,3)",
     why="Everyday text chopping, under ESQUERDA, IZQUIERDA, GAUCHE, LINKS, SINISTRA.",
     mistakes="""<ul>
<li>LEFT counts characters, not words. For a first name, look for the first space with FIND / PROCURAR and then LEFT.</li>
<li>Numbers passed to LEFT become text. Wrap VALUE if you need a number again.</li>
</ul>""",
     related=["right","mid","len","trim","text"],
     faqs=[
       ("What is LEFT in Portuguese?","ESQUERDA. Spanish IZQUIERDA, French GAUCHE, German LINKS, Italian SINISTRA."),
     ]),
dict(slug="right", en="RIGHT", purpose="Returns the last characters of a text string.",
     syntax="=RIGHT(text, [num_chars])",
     example="=RIGHT(A2,4)",
     why="Useful for the last four digits of a card, an IBAN suffix or a year at the end of a code. Names: DIREITA, DERECHA, DROITE, RECHTS, DESTRA.",
     mistakes="""<ul>
<li>Like LEFT, the result is text. Use VALUE for a numeric year.</li>
<li>Combined with LEN, you can drop a prefix: <code>=RIGHT(A2,LEN(A2)-3)</code>.</li>
</ul>""",
     related=["left","mid","len","trim"],
     faqs=[
       ("What is RIGHT in Portuguese?","DIREITA. Spanish DERECHA, French DROITE, German RECHTS, Italian DESTRA."),
     ]),
dict(slug="mid", en="MID", purpose="Returns characters from the middle of a text string, given a start position and a length.",
     syntax="=MID(text, start_num, num_chars)",
     example="=MID(A2,2,5)",
     why="The start position is 1-based. Names: SEG.TEXTO, EXTRAE, STXT, TEIL, STRINGA.ESTRAI — some of the most surprising translations on the list.",
     mistakes="""<ul>
<li>start_num is 1-based (the first character is 1, not 0).</li>
<li>French STXT and German TEIL are easy to miss when you are reading a formula out loud.</li>
</ul>""",
     related=["left","right","len","text"],
     faqs=[
       ("What is MID in Portuguese?","SEG.TEXTO. Spanish EXTRAE, French STXT, German TEIL, Italian STRINGA.ESTRAI."),
     ]),
dict(slug="len", en="LEN", purpose="Returns the number of characters in a text string, including spaces.",
     syntax="=LEN(text)",
     example="=LEN(A2)",
     why="The usual partner of LEFT / RIGHT / MID, under NÚM.CARAT, LARGO, NBCAR, LÄNGE, LUNGHEZZA.",
     mistakes="""<ul>
<li>LEN counts spaces. Use TRIM first if you want the length of the visible text.</li>
<li>A number passed to LEN is converted to text first, so formats can change the count.</li>
</ul>""",
     related=["left","right","mid","trim"],
     faqs=[
       ("What is LEN in Portuguese?","NÚM.CARAT. Spanish LARGO, French NBCAR, German LÄNGE, Italian LUNGHEZZA."),
     ]),
dict(slug="trim", en="TRIM", purpose="Removes extra spaces from text, leaving a single space between words.",
     syntax="=TRIM(text)",
     example="=TRIM(A2)",
     why="The first fix when a VLOOKUP fails on values that “look the same”. Names: COMPACTAR, ESPACIOS, SUPPRESPACE, GLÄTTEN, ANNULLA.SPAZI.",
     mistakes="""<ul>
<li>TRIM removes ordinary spaces (character 32). It does not remove non-breaking spaces from a web or PDF paste (character 160). For those, use SUBSTITUTE on CHAR(160) first.</li>
<li>TRIM does not remove line breaks. SUBSTITUTE on CHAR(10) is the usual follow-up.</li>
</ul>""",
     related=["len","vlookup","text","concatenate"],
     faqs=[
       ("What is TRIM in Portuguese?","COMPACTAR. Spanish ESPACIOS, French SUPPRESPACE, German GLÄTTEN, Italian ANNULLA.SPAZI."),
       ("It still does not match. Why?","A non-breaking space or a trailing line break. SUBSTITUTE those characters, then TRIM."),
     ]),
dict(slug="date", en="DATE", purpose="Builds a real date from a year, month and day, so the result does not depend on the regional date order.",
     syntax="=DATE(year, month, day)",
     example="=DATE(2026,11,12)",
     why="The safe way to write a date in a criterion or a schedule. Names: DATA, FECHA, DATE, DATUM, DATA.",
     mistakes="""<ul>
<li>Typing 12/11/2026 into a formula is ambiguous (12 November or 11 December). DATE(2026,11,12) is not.</li>
<li>Use DATE inside SUMIFS / COUNTIF criteria: <code>"&gt;="&amp;DATE(2026,1,1)</code>.</li>
<li>In Portuguese the function is DATA, which is also a common column heading — a sheet named Data plus a function named DATA is confusing but legal.</li>
</ul>""",
     related=["eomonth","networkdays","text"],
     faqs=[
       ("What is DATE in Portuguese?","DATA. Spanish FECHA, French DATE, German DATUM, Italian DATA."),
       ("Why use DATE instead of typing the date?","Because 03/09 means March in the US and 3 September in Europe. DATE always means year, month, day in that order."),
     ]),
dict(slug="eomonth", en="EOMONTH", purpose="Returns the last day of a month, a given number of months before or after a start date.",
     syntax="=EOMONTH(start_date, months)",
     example="=EOMONTH(A2,0)",
     why="Month-end close, invoice due dates, D7-style “last day of the month” rules. Names: FIMMÊS, FIN.MES, FIN.MOIS, MONATSENDE, FINE.MESE.",
     mistakes="""<ul>
<li><code>EOMONTH(A2,0)</code> is the last day of the month of A2. <code>EOMONTH(A2,1)</code> is the last day of the following month.</li>
<li>The result is a date, not text. Format the cell as a date, or wrap TEXT if you need a label.</li>
</ul>""",
     related=["date","networkdays","text"],
     faqs=[
       ("What is EOMONTH in Portuguese?","FIMMÊS. Spanish FIN.MES, French FIN.MOIS, German MONATSENDE, Italian FINE.MESE."),
       ("First day of next month?","<code>=EOMONTH(A2,0)+1</code>."),
     ]),
dict(slug="networkdays", en="NETWORKDAYS", purpose="Returns the number of working days between two dates, optionally skipping a holiday list.",
     syntax="=NETWORKDAYS(start_date, end_date, [holidays])",
     example="=NETWORKDAYS(A2,B2)",
     why="Turnaround times, SLA clocks, visa or bank “working days”. The Portuguese name DIATRABALHOTOTAL is a mouthful, which is why people search for it.",
     mistakes="""<ul>
<li>NETWORKDAYS counts both the start and the end date if they are working days. For a “days from today until the deadline” clock, check whether you want that inclusive behaviour, or use NETWORKDAYS.INTL / a +1 / -1 adjustment.</li>
<li>Weekends are Saturday and Sunday. For a Friday–Saturday weekend, use NETWORKDAYS.INTL.</li>
<li>Pass a holiday range (a list of dates) as the third argument, not a single typed date, if you have more than one holiday.</li>
</ul>""",
     related=["date","eomonth"],
     faqs=[
       ("What is NETWORKDAYS in Portuguese?","DIATRABALHOTOTAL. Spanish DIAS.LAB, French NB.JOURS.OUVRES, German NETTOARBEITSTAGE, Italian GIORNI.LAVORATIVI.TOT."),
       ("Does it include the start date?","Yes, if that date is a working day. Test with a Monday-to-Friday week: the result is 5, not 4."),
     ]),
dict(slug="filter", en="FILTER", purpose="Returns the rows (or columns) of a range that meet a condition, as a dynamic spill array.",
     syntax="=FILTER(array, include, [if_empty])",
     example="=FILTER(A2:C100,C2:C100>0)",
     why="The modern way to make a live subset of a table. Names: FILTRAR, FILTRE, FILTER, FILTRO. Needs a current Excel (Microsoft 365 / 2021).",
     mistakes="""<ul>
<li>The include argument must have the same height (or width) as the array.</li>
<li>If nothing matches and you omit if_empty, you get #CALC!. Always pass a friendly message.</li>
<li>Not in Excel 2019 or earlier. Use AutoFilter, or INDEX/MATCH, as a fallback.</li>
</ul>""",
     related=["unique","sort","sumifs"],
     faqs=[
       ("What is FILTER in Portuguese?","FILTRAR (same in Spanish). French FILTRE, German FILTER, Italian FILTRO."),
       ("Why #CALC!?","The filter came back empty. Set the third argument, for example \"no rows\"."),
     ]),
dict(slug="unique", en="UNIQUE", purpose="Returns a list of unique values from a range, as a dynamic spill array.",
     syntax="=UNIQUE(array, [by_col], [exactly_once])",
     example="=UNIQUE(B2:B100)",
     why="Build a category list for a dropdown or a summary. Portuguese Excel in Portugal uses EXCLUSIVOS; Brazil may differ, as our translator page notes.",
     mistakes="""<ul>
<li>UNIQUE is case-insensitive for text. It does not trim spaces — TRIM the column first or you will see “Rent” and “Rent ” as two values.</li>
<li>exactly_once TRUE returns values that appear only once (the opposite of “a distinct list”).</li>
<li>Brazil may use a different name than Portugal. If a name is left unchanged, email us and we will fix the table.</li>
</ul>""",
     related=["filter","sort","countif"],
     faqs=[
       ("What is UNIQUE in Portuguese (Portugal)?","EXCLUSIVOS. Spanish UNICOS, French UNIQUE, German EINDEUTIG, Italian UNICI. Brazil can differ."),
       ("Why are two ‘same’ values both listed?","A trailing space or a non-breaking space. TRIM (and SUBSTITUTE of CHAR(160)) first."),
     ]),
dict(slug="sort", en="SORT", purpose="Sorts a range or array, as a dynamic spill array.",
     syntax="=SORT(array, [sort_index], [sort_order], [by_col])",
     example="=SORT(A2:C100,3,-1)",
     why="A live, formula-based sort (here, by column 3 descending). Names: ORDENAR, TRIER, SORTIEREN, DATI.ORDINA. Needs a current Excel.",
     mistakes="""<ul>
<li>sort_order 1 is ascending, -1 is descending. Omitting it is ascending.</li>
<li>The result spills. Keep empty cells below it, or you get a #SPILL! error.</li>
<li>Not in older Excel. Use the Sort dialog, or a helper column, as a fallback.</li>
</ul>""",
     related=["filter","unique","index-indice"],
     faqs=[
       ("What is SORT in Portuguese?","ORDENAR (same in Spanish). French TRIER, German SORTIEREN, Italian DATI.ORDINA."),
       ("What does #SPILL! mean?","Something is already in the cells the formula needs to fill. Clear them, or move the formula."),
     ]),
dict(slug="sumproduct", en="SUMPRODUCT", purpose="Multiplies ranges together and adds the results. Also a way to do conditional sums in older Excel.",
     syntax="=SUMPRODUCT(array1, [array2], …)",
     example='=SUMPRODUCT((B2:B100="Rent")*(C2:C100))',
     why="Before SUMIFS, this was how you did “total where category = Rent”. It is still the way to do weighted totals and some OR conditions. The Italian name MATR.SOMMA.PRODOTTO is a frequent search.",
     mistakes="""<ul>
<li>A common AI or copy-paste mistake is to add the arrays (<code>+</code>) instead of multiplying them (<code>*</code>). That quietly gives the wrong total.</li>
<li>Do not use whole-column references (B:B) in SUMPRODUCT — it is slow. Stick to the used rows.</li>
<li>The (condition)*(numbers) pattern coerces TRUE/FALSE to 1/0. That is intentional.</li>
</ul>""",
     related=["sumifs","sumif","sum"],
     faqs=[
       ("What is SUMPRODUCT in Portuguese?","SOMARPRODUTO. Spanish SUMAPRODUCTO, French SOMMEPROD, German SUMMENPRODUKT, Italian MATR.SOMMA.PRODOTTO."),
       ("SUMPRODUCT vs SUMIFS?","Use SUMIFS when every condition is a simple “equals / greater than”. Use SUMPRODUCT for weighted totals, OR patterns, or older files."),
     ]),
dict(slug="pmt", en="PMT", purpose="Returns the payment for a loan based on a constant interest rate and a constant payment schedule.",
     syntax="=PMT(rate, nper, pv, [fv], [type])",
     example="=PMT(0.05/12,360,200000)",
     why="Mortgage and loan calculators. Names: PGTO, PAGO, VPM, RMZ, RATA. The rate and the period must be in the same unit, and European decimals matter.",
     mistakes="""<ul>
<li>If the annual rate is 5% and payments are monthly, use <code>5%/12</code> (or <code>0,05/12</code> in European Excel), not 5%.</li>
<li>nper is the number of payments (30 years monthly = 360), not the number of years.</li>
<li>PMT returns a negative number if the present value is a positive loan amount (cash-flow sign convention). Wrap it in ABS or enter the loan as negative, consistently.</li>
</ul>""",
     related=["round","if","date"],
     faqs=[
       ("What is PMT in Portuguese?","PGTO. Spanish PAGO, French VPM, German RMZ, Italian RATA."),
       ("Why is the result negative?","Excel treats the loan (pv) as cash you received and the payment as cash you pay out. Use ABS, or enter pv as negative, and stay consistent."),
       ("European decimal?","In Portuguese or German Excel write <code>0,05/12</code>, not <code>0.05/12</code>."),
     ]),
]

# fix TEXT related list (I used a hack)
for f in FUNCS:
    if f["slug"]=="text":
        f["related"]=["date","left","trim"]
