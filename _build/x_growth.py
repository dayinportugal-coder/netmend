#!/usr/bin/env python3
"""Build the /x-growth/ hub and 30 English SEO pages, then update sitemap and home.

Does not touch x-post-writer/ files.
"""
from __future__ import annotations

import html
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
BASE = "https://dayinportugal-coder.github.io/netmend"
GUMROAD = "https://portugaldiary.gumroad.com/l/leutz"
# Imported below after this file can also be run as a script.
PAGES: list[dict] = []


def esc(s: str) -> str:
    return html.escape(s, quote=True)


def post(fmt: str, text: str) -> str:
    return (
        f'<article class="xpw-card"><header><span class="fmt">{esc(fmt)} · example</span></header>\n'
        f"<pre>{esc(text)}</pre></article>\n"
    )


def posts(items: list[tuple[str, str]]) -> str:
    body = '<div class="xpw-out">\n' + "".join(post(f, t) for f, t in items) + "</div>\n"
    note = (
        '<p class="note">These are original example drafts, written for this page, '
        "for a fictional professional. They are not real posts from a real account, "
        "and they are not a promise of reach, clients or sales. Adapt the structure; "
        "replace every fact with one you can stand behind.</p>\n"
    )
    return body + note


def bullets(items: list[str]) -> str:
    return "<ul>\n" + "".join(f"<li>{item}</li>\n" for item in items) + "</ul>\n"


def paras(*chunks: str) -> str:
    return "".join(f"<p>{c}</p>\n" for c in chunks)


def facts(rows: list[tuple[str, str]]) -> str:
    return (
        '<div class="facts">\n'
        + "".join(f"<div><b>{esc(k)}</b>{v}</div>\n" for k, v in rows)
        + "</div>\n"
    )


def cta_block(prefix: str) -> str:
    writer = f"{prefix}x-post-writer/"
    return f"""
<section id="try-the-writer" class="alt"><div class="wrap">
<h2>Turn one of these ideas into 10 drafts, in your voice</h2>
<p class="lead">The free <a href="{writer}">X Post Writer</a> runs in your browser. Paste a few of your old posts and a rough idea. It writes 10 drafts that follow hook structures like the ones on this page. 3 generations a day, with your own Gemini API key. Nothing is sent to Netmend: there is no server on this tool.</p>
<div class="grid">
<div class="card"><b>Free, in your browser</b><div class="price">$0</div><p>3 generations a day, 10 drafts each time, your own Gemini key. No account.</p>
<p><a class="btn" href="{writer}">Open the free writer</a></p></div>
<div class="card"><b>Lifetime license</b><div class="price">$19 <small>founding, first 50</small> <s>$29</s></div>
<p>Pay once on Gumroad. Founding price $19 for the first 50 licenses, then $29. The free 3-a-day tool remains.</p>
<p><a class="btn sec" href="{GUMROAD}" target="_blank" rel="noopener noreferrer">Pre-order on Gumroad ($19)</a></p></div>
</div>
<p class="note">Payment is handled by Gumroad, not on this site. Questions: <a href="mailto:dayinportugal@gmail.com">dayinportugal@gmail.com</a>. This is a writing aid. It will not post for you, and it cannot promise impressions, followers or sales.</p>
</div></section>
"""


def faq_section(faqs: list[tuple[str, str]]) -> str:
    bits = ['<section id="faq"><div class="wrap"><h2>FAQ</h2>\n']
    for q, a in faqs:
        bits.append(f"<details><summary>{esc(q)}</summary><p>{a}</p></details>\n")
    bits.append("</div></section>\n")
    return "".join(bits)


def faq_jsonld(url: str, faqs: list[tuple[str, str]]) -> str:
    import json

    data = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": q,
                "acceptedAnswer": {"@type": "Answer", "text": re.sub("<[^>]+>", "", a)},
            }
            for q, a in faqs
        ],
        "url": url,
    }
    return json.dumps(data, ensure_ascii=False)


def related_section(current: str, slugs: list[str], prefix: str) -> str:
    by_slug = {p["slug"]: p for p in PAGES}
    bits = ['<section class="alt"><div class="wrap"><h2>Related guides</h2>\n<div class="banklist">\n']
    for s in slugs:
        if s == current or s not in by_slug:
            continue
        p = by_slug[s]
        href = f"{prefix}{s}/" if prefix.endswith("/") or prefix == "" else f"{prefix}{s}/"
        # from an article, related are siblings
        bits.append(f'<a href="../{esc(s)}/"><b>{esc(p["card"])}</b></a>')
    bits.append(f'<a href="../"><b>All X growth guides</b></a>')
    bits.append(f'<a href="../../x-post-writer/"><b>Free X Post Writer</b></a>')
    bits.append("</div>\n<p class=\"note\" style=\"margin-top:16px\"><a href=\"../../\">All Netmend services</a></p>\n</div></section>\n")
    return "".join(bits)


def page_html(p: dict) -> str:
    url = f"{BASE}/x-growth/{p['slug']}/"
    title = p["title"]
    desc = p["description"]
    faqs = p["faqs"]
    crumbs = p["crumbs"]
    h1 = p["h1"]
    hero = p["hero"]
    pills = p.get("pills") or [
        "Example posts you can adapt",
        "Free writer in your browser",
        "Lifetime license $19 for the first 50",
    ]
    pill_html = "".join(f"<span>{esc(x)}</span>" for x in pills)
    faq_script = ""
    if faqs:
        faq_script = f'<script type="application/ld+json">{faq_jsonld(url, faqs)}</script>\n'
    related = p.get("related") or []
    return f"""<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{esc(url)}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:image" content="{BASE}/assets/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="../../assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../../assets/tools.css">
{faq_script}</head><body>
<header><div class="wrap"><a href="../../"><img src="../../assets/logo.svg" alt="Netmend"></a>
<nav><a href="../../#services">Services</a><a href="../../x-post-writer/">X Post Writer</a>
<a class="cta" href="{GUMROAD}" target="_blank" rel="noopener noreferrer">Lifetime $19</a></nav></div></header>
<div class="hero"><div class="wrap">
<p class="crumbs"><a href="../../">Netmend</a> · <a href="../">{esc(crumbs)}</a> · {esc(p["card"])}</p>
<h1>{h1}</h1>
<p>{hero}</p>
<div class="pills">{pill_html}</div>
</div></div>
<section><div class="wrap">
{p["body"]}
</div></section>
{cta_block("../../")}
{faq_section(faqs) if faqs else ""}
{related_section(p["slug"], related, "../")}
<footer><div class="wrap">© 2026 Netmend · run by Pedro Carvalho · EU-based · No cookies, no trackers, no sign-up. Free tools run in your browser.</div></footer>
</body></html>
"""


def hub_html() -> str:
    url = f"{BASE}/x-growth/"
    niches = [p for p in PAGES if p["kind"] == "niche"]
    problems = [p for p in PAGES if p["kind"] == "problem"]

    def cards(items):
        out = ['<div class="banklist">']
        for p in items:
            out.append(
                f'<a href="{esc(p["slug"])}/"><b>{esc(p["card"])}</b><span class="note" style="display:block;margin-top:4px">{esc(p["blurb"])}</span></a>'
            )
        out.append("</div>")
        return "\n".join(out)

    return f"""<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>X post ideas, hook formulas and growth guides · Netmend</title>
<meta name="description" content="Free guides with example X posts you can adapt: ideas by niche, hook formulas, thread structures, reply tactics and bio examples. Plus a free in-browser X Post Writer.">
<link rel="canonical" href="{url}">
<meta property="og:title" content="X post ideas, hook formulas and growth guides · Netmend">
<meta property="og:description" content="Example X posts by niche, hook formulas, thread structures and reply tactics. Free writer in your browser.">
<meta property="og:image" content="{BASE}/assets/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../assets/tools.css">
</head><body>
<header><div class="wrap"><a href="../"><img src="../assets/logo.svg" alt="Netmend"></a>
<nav><a href="../#services">Services</a><a href="../x-post-writer/">X Post Writer</a>
<a class="cta" href="{GUMROAD}" target="_blank" rel="noopener noreferrer">Lifetime $19</a></nav></div></header>
<div class="hero"><div class="wrap">
<p class="crumbs"><a href="../">Netmend</a> · X growth guides</p>
<h1>X post ideas, hooks and <span>growth guides</span></h1>
<p>Practical pages for people who need to write on X in public: example posts by niche, hook formulas, thread structures, reply tactics and bio examples. Every page is a working method, not a promise of reach. When you want drafts in your own voice, the free X Post Writer runs in your browser.</p>
<div class="pills"><span>30 free guides</span><span>Original example posts</span><span>Free writer, 3 generations a day</span><span>Lifetime license $19 for the first 50</span></div>
</div></div>
<section><div class="wrap">
<h2>X post ideas by niche</h2>
<p class="lead">Each guide has specific tips for that job, plus original example posts you can rewrite with your own facts.</p>
{cards(niches)}
</div></section>
<section class="alt"><div class="wrap">
<h2>Problems people actually search for</h2>
<p class="lead">Hooks, threads, replies, bios, timing and a beginner path. Honest about what nobody can guarantee, including us.</p>
{cards(problems)}
</div></section>
{cta_block("../")}
<section><div class="wrap">
<h2>More from Netmend</h2>
<div class="toolsnav">
<a href="../x-post-writer/">X Post Writer</a>
<a href="../statement-to-csv/">Bank statement → CSV</a>
<a href="../wall-of-love/">Testimonial wall</a>
<a href="../pin-maker/">Pinterest pin maker</a>
<a href="../excel-functions/">Excel functions in 6 languages</a>
<a href="../guides/">PDF to Excel guides</a>
<a href="../">All Netmend services</a>
</div>
</div></section>
<footer><div class="wrap">© 2026 Netmend · run by Pedro Carvalho · EU-based · No cookies, no trackers, no sign-up. Free tools run in your browser.</div></footer>
</body></html>
"""


def patch_home() -> None:
    path = ROOT / "index.html"
    text = path.read_text(encoding="utf-8")
    if 'id="x-growth"' in text or "x-growth/" in text.split("id=\"free-tools\"")[-1][:800] and 'href="x-growth/"' in text:
        # still insert if missing the section
        pass
    marker = '<section id="guides">'
    section = """<section id="x-growth"><div class="wrap">
<h2>X post ideas and growth guides</h2>
<p class="lead">Post ideas by niche, hook formulas, thread structures and reply tactics, with example posts you can adapt. The X Post Writer is free in your browser (3 generations a day).</p>
<p><a class="btn" href="x-growth/">X growth guides</a></p>
</div></section>

"""
    if 'id="x-growth"' in text:
        return
    if marker not in text:
        raise SystemExit("home page: expected #guides section not found")
    path.write_text(text.replace(marker, section + marker, 1), encoding="utf-8")


def update_sitemap() -> int:
    path = ROOT / "sitemap.xml"
    text = path.read_text(encoding="utf-8")
    locs = re.findall(r"<loc>(.*?)</loc>", text)
    new = [f"{BASE}/x-growth/"] + [f"{BASE}/x-growth/{p['slug']}/" for p in PAGES]
    missing = [u for u in new if u not in locs]
    if not missing:
        return len(locs)
    insert = "".join(f"<url><loc>{u}</loc></url>\n" for u in missing)
    if not text.endswith("</urlset>\n") and not text.rstrip().endswith("</urlset>"):
        raise SystemExit("sitemap: unexpected ending")
    text = text.rstrip()
    if text.endswith("</urlset>"):
        text = text[: -len("</urlset>")].rstrip() + "\n" + insert + "</urlset>\n"
    path.write_text(text, encoding="utf-8")
    locs = re.findall(r"<loc>(.*?)</loc>", path.read_text(encoding="utf-8"))
    return len(locs)


def build() -> None:
    if len(PAGES) != 30:
        raise SystemExit(f"expected 30 pages, got {len(PAGES)}")
    slugs = [p["slug"] for p in PAGES]
    if len(set(slugs)) != 30:
        raise SystemExit("duplicate slugs")
    hub_dir = ROOT / "x-growth"
    hub_dir.mkdir(exist_ok=True)
    (hub_dir / "index.html").write_text(hub_html(), encoding="utf-8")
    for p in PAGES:
        d = hub_dir / p["slug"]
        d.mkdir(exist_ok=True)
        (d / "index.html").write_text(page_html(p), encoding="utf-8")
    patch_home()
    n = update_sitemap()
    # safety: never wrote to x-post-writer
    print(f"built {len(PAGES)} pages + hub; sitemap urls: {n}")


# ---- page data loaded from the same file below via register() ----
def register(kind, slug, card, blurb, title, description, crumbs, h1, hero, body, faqs, related, pills=None):
    PAGES.append(dict(
        kind=kind, slug=slug, card=card, blurb=blurb, title=title,
        description=description, crumbs=crumbs, h1=h1, hero=hero,
        body=body, faqs=faqs, related=related, pills=pills,
    ))


if __name__ == "__main__":
    import sys
    sys.path.insert(0, str(pathlib.Path(__file__).parent))
    from x_growth_pages import add_pages
    add_pages(register, posts, paras, bullets, facts)
    build()
