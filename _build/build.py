#!/usr/bin/env python3
"""Generate Netmend SEO pages for bank statements and Excel functions."""
from __future__ import annotations
import html, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).parent))
from banks import BANKS
from banks_rest import REST
from banks_rest2 import REST2
from banks_rest3 import REST3
from banks_round2 import BANKS2
from funcs import FUNCS, LANGS, LNAME, BOOL, names as fn_names
from guides import HOWTOS, COMPARES

BANKS = BANKS + REST + REST2 + REST3 + BANKS2
BASE = "https://dayinportugal-coder.github.io/netmend"
MAIL = "dayinportugal@gmail.com"
GIG = "https://www.fiverr.com/dayinportugal/convert-pdf-invoices-and-documents-into-a-clean-excel-spreadsheet"

def esc(s: str) -> str:
    return html.escape(s, quote=True)

def faq_schema(url: str, faqs: list) -> str:
    ents = []
    for q, a in faqs:
        ents.append({
            "@type": "Question",
            "name": q,
            "acceptedAnswer": {"@type": "Answer", "text": re.sub("<[^>]+>", "", a)},
        })
    data = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": ents, "url": url}
    return '<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False) + "</script>"

def breadcrumbs(items: list[tuple[str, str]]) -> str:
    # items: (name, url) last may be name-only current
    parts = []
    for name, url in items:
        if url:
            parts.append(f'<a href="{esc(url)}">{esc(name)}</a>')
        else:
            parts.append(esc(name))
    return '<p class="crumbs">' + " · ".join(parts) + "</p>"

def page_shell(title, meta, canonical, extra_head, body, depth=2):
    rel = "../" * depth
    og = f"{BASE}/assets/og-image.png"
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(meta)}">
<link rel="canonical" href="{esc(canonical)}">
<meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(meta)}">
<meta property="og:image" content="{og}"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{rel}assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="{rel}assets/tools.css">
{extra_head}
</head><body>
{body}
<footer><div class="wrap">© 2026 Netmend · run by Pedro Carvalho · EU-based · No cookies, no trackers, no sign-up. Free tools run in your browser.</div></footer>
</body></html>
"""

def translate_formula(f: str, to: str) -> str:
    """Translate an English formula to another Excel language (names, booleans, separators, decimals)."""
    if to == "en":
        return f
    mapping = {}
    for en, row in __import__("funcs").NAMES.items():
        mapping[en] = row[LANGS.index(to)]
    out, i = [], 0
    while i < len(f):
        ch = f[i]
        if ch == '"':
            j = f.find('"', i + 1)
            if j < 0:
                j = len(f) - 1
            out.append(f[i:j + 1])
            i = j + 1
            continue
        m = re.match(r"[A-Za-z_][A-Za-z0-9_.]*", f[i:])
        if m:
            w = m.group(0)
            rest = f[i + len(w):]
            if rest.lstrip().startswith("("):
                out.append(mapping.get(w.upper(), w) if w.upper() in mapping or w.upper() in mapping else mapping.get(w.upper(), w))
            else:
                bu = BOOL["en"]
                if w.upper() in ("TRUE", "FALSE"):
                    out.append(BOOL[to][w.upper()])
                else:
                    out.append(w)
            i += len(w)
            continue
        if ch == ",":
            # argument comma vs decimal? in our English examples commas are separators
            # decimals use 0.05 etc.
            out.append(";")
            i += 1
            continue
        if ch == "." and i > 0 and f[i - 1].isdigit() and i + 1 < len(f) and f[i + 1].isdigit():
            out.append(",")
            i += 1
            continue
        out.append(ch)
        i += 1
    return "".join(out)

def bank_tool(b, depth_from_tool=1):
    # From /statement-to-csv/<slug>/ : app.js is ../app.js, assets ../../, demo ../../samples
    fmt = b["fmt"]
    sep = b["sep"]
    fmt_opts = [
        ("auto", "Detect automatically", fmt == "auto"),
        ("eu", "European 1.234,56", fmt == "eu"),
        ("us", "UK/US 1,234.56", fmt == "us"),
    ]
    sep_opts = [
        (";", "Excel in Europe (; and ,)", sep == ";"),
        (",", "Excel UK/US, Google Sheets (, and .)", sep == ","),
    ]
    def opts(items):
        bits = []
        for val, lab, sel in items:
            bits.append(f'<option value="{val}"{" selected" if sel else ""}>{esc(lab)}</option>')
        return "".join(bits)
    return f"""
<div class="tool">
<label for="file">PDF statement (stays on your computer)</label>
<input id="file" type="file" accept="application/pdf">
<p class="note">No statement at hand? <button id="demo" type="button" class="btn ghost" style="padding:5px 10px" data-src="../../samples/demo-statement.pdf">Try our demo statement</button> (fictional data)</p>
<div class="row">
<div><label for="mode">Output</label><select id="mode"><option value="tx">Transactions only</option><option value="all">Every text row (raw table)</option></select></div>
<div><label for="fmt">Number format</label><select id="fmt">{opts(fmt_opts)}</select></div>
<div><label for="sep">CSV for</label><select id="sep">{opts(sep_opts)}</select></div>
</div>
<div id="out" hidden><p id="stats" class="note"></p><p><button id="dl" class="btn" disabled>Download CSV</button></p>
<div class="scroll"><table id="preview"></table></div>
<p class="note">Check the totals against your statement before you use the file. If a column is in the wrong place, try “Every text row”, or send it to us.</p></div>
</div>
<p class="note">How it stays private: the page uses the open-source pdf.js library (Mozilla) to read the file locally. There is no server and no upload. You can disconnect from the internet after the page loads and it still works.</p>
"""

def render_bank(b, all_banks):
    url = f"{BASE}/statement-to-csv/{b['slug']}/"
    # Paid conversion CTA goes to the live Fiverr gig (minimum $20).
    related = [x for x in all_banks if x["slug"] in b["related"]]
    others = "".join(
        f'<a href="../{esc(x["slug"])}/"><b>{esc(x["name"])}</b> statement to CSV</a>' for x in related
    )
    faqs_html = "".join(f"<details><summary>{esc(q)}</summary><p>{a}</p></details>" for q, a in b["faqs"])
    head = f'''<script type="application/ld+json">{json.dumps({
        "@context":"https://schema.org","@type":"WebApplication",
        "name": f"Convert {b['name']} bank statement PDF to CSV",
        "url": url, "applicationCategory":"BusinessApplication",
        "operatingSystem":"Any (web browser)",
        "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
        "publisher":{"@type":"Organization","name":"Netmend","url":BASE+"/"}
    }, ensure_ascii=False)}</script>
{faq_schema(url, b["faqs"])}
<script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js"></script>
<script defer src="../app.js"></script>'''
    body = f"""
<header><div class="wrap"><a href="../../"><img src="../../assets/logo.svg" alt="Netmend"></a>
<nav><a href="../../#services">Services</a><a href="../">Statement converter</a><a class="cta" href="{GIG}">From $20</a></nav></div></header>
<div class="hero"><div class="wrap">
{breadcrumbs([("Netmend","../../"),("Bank statement → CSV","../"),(b["name"], "")])}
<h1>{b["h1"]}</h1>
<p>{b["lead"]}</p>
<div class="pills"><span>{esc(b["region"])}</span><span>100% in your browser</span><span>No account</span><span>From $20 if you want it done</span></div>
</div></div>
<section><div class="wrap">
<h2>Convert a {esc(b["name"])} PDF now</h2>
<p class="lead">The defaults below are set for a typical {esc(b["name"])} file. You can still change them. The file never leaves your computer.</p>
{bank_tool(b)}
</div></section>
<section class="alt"><div class="wrap">
<h2>The {esc(b["name"])} statement format</h2>
<div class="facts">
<div><b>Dates</b>{b["date"]}</div>
<div><b>Numbers</b>{b["decimal"]}</div>
<div><b>Region</b>{esc(b["region"])}</div>
</div>
<h3>Where to download the official file</h3>
{b["download"]}
<h3>What the PDF contains</h3>
<p>{b["pdf"]}</p>
<h3>Official CSV or Excel, when the bank offers one</h3>
{b["csv"] if b["csv"].lstrip().startswith("<") else "<p>"+b["csv"]+"</p>"}
<h3>What to watch for</h3>
{b["tips"]}
<p class="note"><b>Sources</b> (checked 12/11/2026). {b["sources"]} Banks change layouts without notice: treat the first row of your own file as the authority.</p>
</div></section>
<section id="done-for-you"><div class="wrap">
<h2>Need it done for you? From $20</h2>
<p class="lead">The free tool is for a clean, text-based PDF. For scans, password files, a packed year of statements or a layout that has to match your accounting software, we convert them and check every total against the opening and closing balance.</p>
<div class="grid">
<div class="card"><b>Done-for-you conversion</b><div class="price">$20 <small>/ 20 pages</small></div>
<p>75 pages $40 · 200 pages $80. Totals reconciled. 48h. Pay on Fiverr.</p>
<a class="btn" href="{GIG}">Need it done for you? From $20</a></div>
<div class="card"><b>Privacy</b><p>Your statement is processed only for the order and deleted after delivery. This page itself never uploads the file.</p>
<p class="note">Who handles the data: Pedro Carvalho (Netmend), <a href="mailto:{MAIL}">{MAIL}</a>. No address, phone or national ID is asked for or published.</p></div>
</div>
</div></section>
<section class="alt"><div class="wrap"><h2>FAQ</h2>{faqs_html}</div></section>
<section><div class="wrap">
<h2>Other bank guides</h2>
<div class="banklist">{others}<a href="../"><b>All banks</b> and the main converter</a></div>
<p class="note" style="margin-top:16px"><a href="../../excel-functions/">Excel formula translator</a> · <a href="../../wall-of-love/">Testimonial wall</a> · <a href="../../pin-maker/">Pinterest pin maker</a> · <a href="../../">All Netmend services</a></p>
</div></section>
"""
    return page_shell(b["title"], b["meta"], url, head, body, depth=2)

def render_func(f, allf):
    n = fn_names(f["en"])
    url = f"{BASE}/excel-functions/{f['slug']}/"
    title = f"{f['en']} in Portuguese = {n['pt']} (Spanish {n['es']}, French {n['fr']}, German {n['de']}, Italian {n['it']}) · Netmend"
    meta = f"What is {f['en']} in Portuguese? {n['pt']}. Also {n['es']}, {n['fr']}, {n['de']}, {n['it']}. Syntax and a worked example in all 6 languages, plus a free formula translator."
    examples = []
    for lang in LANGS:
        formula = translate_formula(f["example"], lang)
        syntax = translate_formula(f["syntax"], lang)
        examples.append(
            f'<div><b>{esc(LNAME[lang])} — {esc(n[lang])}</b>'
            f'<pre>{esc(syntax)}</pre>'
            f'<pre>{esc(formula)}</pre></div>'
        )
    related = [x for x in allf if x["slug"] in f["related"]]
    rel_html = "".join(
        f'<a href="../{esc(x["slug"])}/"><b>{esc(x["en"])}</b> = {esc(fn_names(x["en"])["pt"])}</a>'
        for x in related
    )
    faqs_html = "".join(f"<details><summary>{esc(q)}</summary><p>{a}</p></details>" for q, a in f["faqs"])
    aliases = " = ".join(n[l] for l in LANGS)
    email = f"mailto:{MAIL}?subject=" + html.escape(f"Netmend - Excel help ({f['en']})", quote=True).replace(" ", "%20")
    head = f'''<script type="application/ld+json">{json.dumps({
        "@context":"https://schema.org","@type":"TechArticle",
        "headline": title, "url": url,
        "inLanguage": LANGS,
        "author":{"@type":"Organization","name":"Netmend","url":BASE+"/"},
        "description": meta
    }, ensure_ascii=False)}</script>
{faq_schema(url, f["faqs"])}
<script src="../data.js"></script>'''
    # translator widget with this function's example pre-filled
    body = f"""
<header><div class="wrap"><a href="../../"><img src="../../assets/logo.svg" alt="Netmend"></a>
<nav><a href="../../#services">Services</a><a href="../">Formula translator</a><a class="cta" href="#done-for-you">Sheet fix $25</a></nav></div></header>
<div class="hero"><div class="wrap">
{breadcrumbs([("Netmend","../../"),("Excel functions","../"),(f"{f['en']} = {n['pt']}", "")])}
<h1>{esc(f['en'])} in Portuguese = <span>{esc(n['pt'])}</span></h1>
<p>{esc(aliases)}. {esc(f['purpose'])}</p>
<div class="pills"><span>6 languages</span><span>Syntax + example</span><span>Fixes , vs ;</span><span>Free translator</span></div>
</div></div>
<section><div class="wrap">
<h2>What {esc(f['en'])} does</h2>
<p class="lead">{esc(f['why'])}</p>
<p>{esc(f['purpose'])}</p>
<h2>Syntax and a worked example in 6 languages</h2>
<p class="lead">English Excel uses commas between arguments and a dot decimal. Most European Excel versions use semicolons and a decimal comma. TRUE / FALSE also change name. The translator below applies all three.</p>
<div class="facts">{''.join(examples)}</div>
<h2>Common mistakes</h2>
{f['mistakes']}
</div></section>
<section class="alt"><div class="wrap">
<h2>Translate a formula with {esc(f['en'])}</h2>
<p class="lead">Paste any formula. Function names and separators are converted between English, Portuguese, Spanish, French, German and Italian.</p>
<div class="tool">
<label for="f">Formula</label>
<textarea id="f" style="min-height:70px;font-family:monospace">{esc(f['example'])}</textarea>
<div class="row"><div><label for="from">From</label><select id="from"></select></div><div><label for="to">To</label><select id="to"></select></div></div>
<p><button class="btn ghost" id="swap" type="button">⇄ Swap</button></p>
<label for="res">Result</label><textarea id="res" readonly style="min-height:70px;font-family:monospace"></textarea>
<p class="note" id="unk"></p><p><button class="btn" id="cp" type="button">Copy result</button></p>
<p class="note">Sheet names and cell references are not translated. Google Sheets accepts English function names, but uses your locale’s separators.</p>
</div>
</div></section>
<section id="done-for-you"><div class="wrap">
<h2>Stuck with a spreadsheet? We fix it. From $25</h2>
<p class="lead">Broken lookups, a running balance that will not stay still, a translated workbook full of #NAME? errors. Fixed price after we see the file. 48h.</p>
<p><a class="btn" href="{email}">Send the sheet</a></p>
<p class="note">Who handles the data: Pedro Carvalho (Netmend), <a href="mailto:{MAIL}">{MAIL}</a>. Files are used only for the order and deleted after delivery. No address, phone or national ID is asked for or published.</p>
</div></section>
<section class="alt"><div class="wrap"><h2>FAQ</h2>{faqs_html}</div></section>
<section><div class="wrap">
<h2>Related functions</h2>
<div class="fnlist">{rel_html}<a href="../"><b>All 30 guides</b> and the translator</a></div>
<p class="note" style="margin-top:16px"><a href="../../statement-to-csv/">Bank statement → CSV</a> · <a href="../../wall-of-love/">Testimonial wall</a> · <a href="../../pin-maker/">Pinterest pin maker</a> · <a href="../../">All Netmend services</a></p>
</div></section>
<script src="../app.js"></script>
"""
    return page_shell(title, meta, url, head, body, depth=2)

def patch_css():
    css = ROOT / "assets" / "tools.css"
    t = css.read_text()
    extra = """
.crumbs{font-size:13px;color:var(--muted);margin:0 0 10px}
.crumbs a{color:var(--sail);text-decoration:none;border-bottom:1px solid rgba(244,241,234,.35)}
.hero .crumbs a{color:var(--sail)}
section .crumbs a{color:var(--teal)}
.facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin:18px 0}
.facts>div{border:1px solid #e6e2d8;border-radius:12px;padding:14px;background:#fff}
.facts b{display:block;color:var(--teal);font-size:12px;text-transform:uppercase;letter-spacing:.04em;margin:0 0 6px}
pre{background:#0B1F33;color:#F4F1EA;padding:10px 12px;border-radius:8px;overflow:auto;font-size:12.5px;line-height:1.45;margin:8px 0 0}
.banklist,.fnlist{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px;margin-top:14px}
.banklist a,.fnlist a{display:block;border:1px solid #e6e2d8;border-radius:12px;padding:12px 14px;text-decoration:none;color:var(--ink);background:#fff}
.banklist a:hover,.fnlist a:hover{border-color:var(--coral)}
.banklist a b,.fnlist a b{display:block;color:var(--navy)}
"""
    if ".banklist" not in t:
        css.write_text(t.rstrip() + "\n" + extra)

def patch_app_js():
    p = ROOT / "statement-to-csv" / "app.js"
    t = p.read_text()
    old = "document.getElementById('demo').addEventListener('click',async function(){var r=await fetch('../samples/demo-statement.pdf');var b=await r.blob();b.name='demo-statement.pdf';handle(b)});"
    new = "document.getElementById('demo').addEventListener('click',async function(){var src=this.getAttribute('data-src')||'../samples/demo-statement.pdf';var r=await fetch(src);var b=await r.blob();b.name='demo-statement.pdf';handle(b)});"
    if old in t:
        t = t.replace(old, new, 1)
        p.write_text(t)
    elif "getAttribute('data-src')" not in t:
        raise SystemExit("app.js demo handler not found")
    # also add data-src on the main tool page button
    idx = ROOT / "statement-to-csv" / "index.html"
    it = idx.read_text()
    it = it.replace(
        '<button id="demo" type="button" class="btn ghost" style="padding:5px 10px">Try our demo statement</button>',
        '<button id="demo" type="button" class="btn ghost" style="padding:5px 10px" data-src="../samples/demo-statement.pdf">Try our demo statement</button>',
        1,
    )
    idx.write_text(it)

def insert_before(path: Path, marker: str, block: str):
    t = path.read_text()
    if marker not in t:
        raise SystemExit(f"marker not found in {path}: {marker}")
    if "id=\"bank-guides\"" in t or "id=\"function-guides\"" in t and path.name and "bank-guides" in block and "bank-guides" in t:
        return
    path.write_text(t.replace(marker, block + marker, 1))

def patch_statement_index(banks):
    path = ROOT / "statement-to-csv" / "index.html"
    t = path.read_text()
    cards = "".join(
        f'<a href="{esc(b["slug"])}/"><b>{esc(b["name"])}</b> PDF → CSV</a>' for b in banks
    )
    section = f'''
<section class="alt" id="bank-guides"><div class="wrap">
<h2>Guides for {len(banks)} banks</h2>
<p class="lead">Each page explains that bank’s real columns, date format, decimal separator and where to download the official PDF or CSV — then embeds the same private converter, with the right number format already selected.</p>
<div class="banklist">{cards}</div>
</div></section>
'''
    if 'id="bank-guides"' in t:
        t = re.sub(r'<section class="alt" id="bank-guides">.*?</section>\n', "", t, count=1, flags=re.S)
    # insert before "More free tools"
    marker = '<section><div class="wrap"><h2>More free tools</h2>'
    if marker not in t:
        raise SystemExit("statement index marker missing")
    t = t.replace(marker, section + marker, 1)
    # link how-to guides from the more-tools row
    if 'href="../guides/"' not in t and 'href="guides/"' not in t:
        t = t.replace(
            '<a href="../excel-functions/">Excel functions in 6 languages</a>',
            '<a href="../guides/">PDF to Excel guides</a><a href="../compare/">Comparisons</a><a href="../excel-functions/">Excel functions in 6 languages</a>',
            1,
        )
    path.write_text(t)
    # FAQ which banks - already exists, leave it

def patch_excel_index(funcs):
    path = ROOT / "excel-functions" / "index.html"
    t = path.read_text()
    cards = []
    for f in funcs:
        n = fn_names(f["en"])
        cards.append(f'<a href="{esc(f["slug"])}/"><b>{esc(f["en"])} = {esc(n["pt"])}</b> {esc(n["es"])} · {esc(n["fr"])} · {esc(n["de"])} · {esc(n["it"])}</a>')
    section = f'''
<section id="function-guides"><div class="wrap">
<h2>30 function guides (names, syntax and examples in 6 languages)</h2>
<p class="lead">Each page is a proper reference: what the function does, the syntax and a worked example in English, Portuguese, Spanish, French, German and Italian, plus the mistakes that usually produce a quiet wrong number.</p>
<div class="fnlist">{''.join(cards)}</div>
</div></section>
'''
    if 'id="function-guides"' in t:
        t = re.sub(r'<section id="function-guides">.*?</section>\n', "", t, count=1, flags=re.S)
    marker = '<section><div class="wrap"><h2>More free tools</h2>'
    if marker not in t:
        raise SystemExit("excel index marker missing")
    path.write_text(t.replace(marker, section + marker, 1))

def patch_homepage(banks):
    path = ROOT / "index.html"
    t = path.read_text()
    old = '<a class="btn" href="statement-to-csv/">Open the converter</a></div>'
    more = max(0, len(banks) - 6)
    new = (
        '<a class="btn" href="statement-to-csv/">Open the converter</a>'
        '<p class="note" style="margin-top:10px"><a href="statement-to-csv/#bank-guides">'
        f'Guides for Revolut, Wise, N26, Millennium bcp, CGD, Chase and {more} more</a></p></div>'
    )
    if "bank-guides" not in t and old in t:
        t = t.replace(old, new, 1)
    else:
        t = re.sub(
            r"Guides for Revolut, Wise, N26, Millennium bcp, CGD, Chase and \d+ more",
            f"Guides for Revolut, Wise, N26, Millennium bcp, CGD, Chase and {more} more",
            t,
            count=1,
        )
    old2 = '<a class="btn" href="excel-functions/">Translate a formula</a></div>'
    new2 = (
        '<a class="btn" href="excel-functions/">Translate a formula</a>'
        '<p class="note" style="margin-top:10px"><a href="excel-functions/#function-guides">'
        "VLOOKUP = PROCV and 29 other function guides</a></p></div>"
    )
    if "function-guides" not in t and old2 in t:
        t = t.replace(old2, new2, 1)
    section = (
        '\n<section id="guides"><div class="wrap">\n'
        "<h2>PDF to Excel guides and comparisons</h2>\n"
        '<p class="lead">How to get invoices, receipts and statements into a spreadsheet, '
        "including the official QuickBooks and Xero import shapes, plus five honest "
        "comparisons of the formats and tools involved.</p>\n"
        '<p><a class="btn" href="guides/">How-to guides</a> '
        '<a class="btn ghost" href="compare/">Comparisons</a></p>\n'
        "</div></section>\n"
    )
    if 'id="guides"' in t:
        t = re.sub(r'<section id="guides">.*?</section>\n', "", t, count=1, flags=re.S)
    marker = '<section id="samples"><div class="wrap">'
    if marker not in t:
        raise SystemExit("homepage samples marker missing")
    t = t.replace(marker, section + marker, 1)
    path.write_text(t)


def embed_tool(fmt="auto", sep=",", demo="../../samples/demo-statement.pdf", note=""):
    fmt_opts = [
        ("auto", "Detect automatically", fmt == "auto"),
        ("eu", "European 1.234,56", fmt == "eu"),
        ("us", "UK/US 1,234.56", fmt == "us"),
    ]
    sep_opts = [
        (";", "Excel in Europe (; and ,)", sep == ";"),
        (",", "Excel UK/US, Google Sheets (, and .)", sep == ","),
    ]
    def opts(items):
        bits = []
        for val, lab, sel in items:
            bits.append(f'<option value="{val}"{" selected" if sel else ""}>{esc(lab)}</option>')
        return "".join(bits)
    extra = f'<p class="lead">{note}</p>' if note else ""
    return f"""
{extra}
<div class="tool">
<label for="file">PDF (stays on your computer)</label>
<input id="file" type="file" accept="application/pdf">
<p class="note">No file at hand? <button id="demo" type="button" class="btn ghost" style="padding:5px 10px" data-src="{esc(demo)}">Try a demo PDF</button> (fictional data)</p>
<div class="row">
<div><label for="mode">Output</label><select id="mode"><option value="tx">Transactions / likely rows</option><option value="all">Every text row (raw table)</option></select></div>
<div><label for="fmt">Number format</label><select id="fmt">{opts(fmt_opts)}</select></div>
<div><label for="sep">CSV for</label><select id="sep">{opts(sep_opts)}</select></div>
</div>
<div id="out" hidden><p id="stats" class="note"></p><p><button id="dl" class="btn" disabled>Download CSV</button></p>
<div class="scroll"><table id="preview"></table></div>
<p class="note">Check the totals against the original PDF before you use the file. If a column is in the wrong place, try “Every text row”, or send it to us.</p></div>
</div>
<p class="note">How it stays private: the page uses the open-source pdf.js library (Mozilla) to read the file locally. There is no server and no upload. You can disconnect from the internet after the page loads and it still works.</p>
"""

def fiverr_cta():
    return f"""
<section id="done-for-you"><div class="wrap">
<h2>Need it done for you? From $20</h2>
<p class="lead">The free tool is for a clean, text-based PDF. For scans, password files, a packed year of documents or a layout that has to match QuickBooks or Xero, we convert them and check the totals against each document.</p>
<div class="grid">
<div class="card"><b>Done-for-you conversion</b><div class="price">$20 <small>/ 20 pages</small></div>
<p>75 pages $40 · 200 pages $80. Totals reconciled. 48h. Pay on Fiverr.</p>
<a class="btn" href="{GIG}">Need it done for you? From $20</a></div>
<div class="card"><b>Privacy</b><p>Your file is processed only for the order and deleted after delivery. This page itself never uploads the file.</p>
<p class="note">Who handles the data: Pedro Carvalho (Netmend), <a href="mailto:{MAIL}">{MAIL}</a>. No address, phone or national ID is asked for or published.</p></div>
</div>
</div></section>
"""

def _plain(s: str) -> str:
    return s.replace("<span>", "").replace("</span>", "")

def render_article(page, howtos, compares):
    is_guide = page["kind"] == "howto"
    folder = "guides" if is_guide else "compare"
    url = f"{BASE}/{folder}/{page['slug']}/"
    parent_name, parent_href = page["crumbs"]
    related_g = [x for x in howtos if x["slug"] in page.get("related_guides", [])]
    related_c = [x for x in compares if x["slug"] in page.get("related_compare", [])]
    links = []
    for x in related_g:
        href = f"../{esc(x['slug'])}/" if is_guide else f"../../guides/{esc(x['slug'])}/"
        links.append(f'<a href="{href}"><b>{esc(_plain(x["h1"]))}</b></a>')
    for x in related_c:
        href = f"../../compare/{esc(x['slug'])}/" if is_guide else f"../{esc(x['slug'])}/"
        links.append(f'<a href="{href}"><b>{esc(_plain(x["h1"]))}</b></a>')
    if is_guide:
        links.append('<a href="../"><b>All how-to guides</b></a>')
        links.append('<a href="../../compare/"><b>Comparisons</b></a>')
    else:
        links.append('<a href="../"><b>All comparisons</b></a>')
        links.append('<a href="../../guides/"><b>How-to guides</b></a>')
    links.append('<a href="../../statement-to-csv/"><b>Bank statement converter</b> and bank guides</a>')
    faqs_html = "".join(f"<details><summary>{esc(q)}</summary><p>{a}</p></details>" for q, a in page["faqs"])
    if page.get("tool") == "invoice":
        tool = embed_tool(
            fmt="auto", sep=",", demo="../../samples/sample-invoices.pdf",
            note="This converter is built for tables. Use it on a digital invoice or receipt with a real text layer. Switch to “Every text row” if the first preview looks short.",
        )
        tool_h = "Convert a PDF now"
    elif page.get("tool") == "statement":
        tool = embed_tool(
            fmt="auto", sep=",", demo="../../samples/demo-statement.pdf",
            note="Defaults are a starting point. Change the number format to match the PDF. The file never leaves your computer.",
        )
        tool_h = "Convert a statement PDF now"
    else:
        tool, tool_h = "", ""
    tool_section = ""
    if tool:
        tool_section = f'<section><div class="wrap">\n<h2>{tool_h}</h2>\n{tool}\n</div></section>'
    head = f'''{faq_schema(url, page["faqs"])}
<script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js"></script>
<script defer src="../../statement-to-csv/app.js"></script>'''
    body = f"""
<header><div class="wrap"><a href="../../"><img src="../../assets/logo.svg" alt="Netmend"></a>
<nav><a href="../../#services">Services</a><a href="../../statement-to-csv/">Statement converter</a><a class="cta" href="{GIG}">From $20</a></nav></div></header>
<div class="hero"><div class="wrap">
{breadcrumbs([("Netmend","../../"),(parent_name, parent_href),(_plain(page["h1"]), "")])}
<h1>{page["h1"]}</h1>
<p>{page["lead"]}</p>
<div class="pills"><span>Free tool in your browser</span><span>No account</span><span>From $20 if you want it done</span></div>
</div></div>
{tool_section}
<section class="alt"><div class="wrap">
{page["sections"]}
<p class="note"><b>Sources</b> (checked 13/11/2026). Official product help is linked in the text. Menus and templates change: treat the current screen in QuickBooks, Xero or your bank as the authority.</p>
</div></section>
{fiverr_cta()}
<section class="alt"><div class="wrap"><h2>FAQ</h2>{faqs_html}</div></section>
<section><div class="wrap">
<h2>Related guides</h2>
<div class="banklist">{''.join(links)}</div>
<p class="note" style="margin-top:16px"><a href="../../excel-functions/">Excel formula translator</a> · <a href="../../wall-of-love/">Testimonial wall</a> · <a href="../../pin-maker/">Pinterest pin maker</a> · <a href="../../">All Netmend services</a></p>
</div></section>
"""
    return page_shell(page["title"], page["meta"], url, head, body, depth=2)

def render_hub(kind, pages, title, meta, h1, lead):
    folder = "guides" if kind == "howto" else "compare"
    url = f"{BASE}/{folder}/"
    cards = "".join(f'<a href="{esc(p["slug"])}/"><b>{p["h1"]}</b></a>' for p in pages)
    if kind == "howto":
        other = '<p class="note" style="margin-top:16px"><a href="../compare/">Honest comparisons</a> · <a href="../statement-to-csv/#bank-guides">Bank statement guides</a> · <a href="../">All Netmend services</a></p>'
    else:
        other = '<p class="note" style="margin-top:16px"><a href="../guides/">PDF to Excel how-to guides</a> · <a href="../statement-to-csv/#bank-guides">Bank statement guides</a> · <a href="../">All Netmend services</a></p>'
    cta = f"""
<section id="done-for-you" class="alt"><div class="wrap">
<h2>Need it done for you? From $20</h2>
<p class="lead">Clean, text-based PDFs you can do yourself with the free tool. Scans, packed years and accounting-template work, from $20 on Fiverr.</p>
<p><a class="btn" href="{GIG}">Need it done for you? From $20</a></p>
</div></section>
"""
    body = f"""
<header><div class="wrap"><a href="../"><img src="../assets/logo.svg" alt="Netmend"></a>
<nav><a href="../#services">Services</a><a href="../statement-to-csv/">Statement converter</a><a class="cta" href="{GIG}">From $20</a></nav></div></header>
<div class="hero"><div class="wrap">
{breadcrumbs([("Netmend","../"),(_plain(h1), "")])}
<h1>{h1}</h1>
<p>{lead}</p>
</div></div>
<section><div class="wrap">
<div class="banklist">{cards}</div>
{other}
</div></section>
{cta}
"""
    return page_shell(title, meta, url, "", body, depth=1)


def write_sitemap(banks, funcs, howtos=None, compares=None):
    howtos = howtos or []
    compares = compares or []
    urls = [
        f"{BASE}/",
        f"{BASE}/statement-to-csv/",
        f"{BASE}/wall-of-love/",
        f"{BASE}/pin-maker/",
        f"{BASE}/excel-functions/",
        f"{BASE}/guides/",
        f"{BASE}/compare/",
    ]
    urls += [f"{BASE}/statement-to-csv/{b['slug']}/" for b in banks]
    urls += [f"{BASE}/excel-functions/{f['slug']}/" for f in funcs]
    urls += [f"{BASE}/guides/{p['slug']}/" for p in howtos]
    urls += [f"{BASE}/compare/{p['slug']}/" for p in compares]
    body = '<?xml version="1.0" encoding="UTF-8"?>\n'
    body += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for u in urls:
        body += f"<url><loc>{u}</loc></url>\n"
    body += "</urlset>\n"
    (ROOT / "sitemap.xml").write_text(body)
    return urls

def main():
    patch_css()
    patch_app_js()
    for b in BANKS:
        d = ROOT / "statement-to-csv" / b["slug"]
        d.mkdir(parents=True, exist_ok=True)
        (d / "index.html").write_text(render_bank(b, BANKS))
    for f in FUNCS:
        d = ROOT / "excel-functions" / f["slug"]
        d.mkdir(parents=True, exist_ok=True)
        (d / "index.html").write_text(render_func(f, FUNCS))
    for p in HOWTOS:
        d = ROOT / "guides" / p["slug"]
        d.mkdir(parents=True, exist_ok=True)
        (d / "index.html").write_text(render_article(p, HOWTOS, COMPARES))
    for p in COMPARES:
        d = ROOT / "compare" / p["slug"]
        d.mkdir(parents=True, exist_ok=True)
        (d / "index.html").write_text(render_article(p, HOWTOS, COMPARES))
    (ROOT / "guides").mkdir(parents=True, exist_ok=True)
    (ROOT / "guides" / "index.html").write_text(render_hub(
        "howto", HOWTOS,
        "PDF to Excel how-to guides (invoices, receipts, statements) · Netmend",
        "Free, private guides for turning PDF invoices, receipts and bank statements into spreadsheets you can import into QuickBooks, Xero or Google Sheets.",
        "PDF to Excel <span>how-to guides</span>",
        "Each guide is a working method: the official import shape where it exists, a private in-browser converter for text-based PDFs, and a clear note on what the tool cannot read.",
    ))
    (ROOT / "compare").mkdir(parents=True, exist_ok=True)
    (ROOT / "compare" / "index.html").write_text(render_hub(
        "compare", COMPARES,
        "PDF to Excel comparisons: official CSV vs PDF, CSV vs Excel, and more · Netmend",
        "Honest comparisons of official bank exports versus converting a PDF, CSV versus Excel, in-browser tools versus Acrobat and Excel, QuickBooks versus Xero, and DIY versus done-for-you.",
        "Honest <span>comparisons</span>",
        "When the official file is better, when a conversion is the only option, and when it is worth paying someone. Written to help you choose, not to pretend every job needs us.",
    ))
    patch_statement_index(BANKS)
    patch_excel_index(FUNCS)
    patch_homepage(BANKS)
    urls = write_sitemap(BANKS, FUNCS, HOWTOS, COMPARES)
    print(f"wrote {len(BANKS)} bank pages, {len(FUNCS)} function pages, {len(HOWTOS)} how-tos, {len(COMPARES)} comparisons, sitemap {len(urls)} urls")



if __name__ == "__main__":
    main()
