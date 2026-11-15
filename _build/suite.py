"""Builds the Netmend AI suite pages: python3 _build/suite.py (run from repo root).
Each tool: _build/suite/<slug>.json (meta) + _build/suite/<slug>.body.html (main content). JS lives in /<slug>/app.js."""
import json, html, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
BASE = "https://dayinportugal-coder.github.io/netmend/"
SUITE = [("slides","Netmend Slides"),("sheets-ai","Sheets AI"),("askvideo","AskVideo"),("quiz","Quiz maker"),("chat-pdf","Chat with PDF"),("certificates","Certificates"),("blur","Netmend Blur"),("statement","Statement → Excel"),("resume","Resume tailor"),("formula","Formula AI"),("shots","Shots")]

def head(m, depth):
    up = "../" * depth
    e = html.escape
    ld = {"@context":"https://schema.org","@type":"WebApplication","name":m["name"],"url":BASE+m["slug"]+"/",
          "applicationCategory":"BusinessApplication","operatingSystem":"Any (web browser)",
          "offers":[{"@type":"Offer","price":"0","priceCurrency":"USD"}]+([{"@type":"Offer","price":str(m["price"]),"priceCurrency":"USD","name":"Pro lifetime"}] if m.get("price") else []),
          "publisher":{"@type":"Organization","name":"Netmend","url":BASE}}
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(m["title"])} · Netmend</title>
<meta name="description" content="{e(m["desc"])}">
<link rel="canonical" href="{BASE}{m["slug"]}/">
<meta property="og:title" content="{e(m["title"])} · Netmend">
<meta property="og:description" content="{e(m["desc"])}">
<meta property="og:image" content="{BASE}{m["slug"]}/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{up}assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="{up}assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
<meta name="theme-color" content="#07080b">
<link rel="stylesheet" href="{up}assets/tools.css">
<script type="application/ld+json">{json.dumps(ld)}</script>
</head><body>
<header><div class="wrap"><a href="{up}"><img src="{up}assets/logo-light.svg" alt="Netmend" width="121" height="30"></a>
<nav><a href="{up}tools/">All tools</a><a href="#app">Use it free</a>{f'<a class="cta" href="#pro">Pro ${m["price"]} lifetime</a>' if m.get("price") else ''}</nav></div></header>
'''

def footer(depth):
    up = "../" * depth
    links = "".join(f'<a href="{up}{s}/">{html.escape(n)}</a>' for s, n in SUITE)
    return f'''<section><div class="wrap"><h2>More Netmend tools</h2><div class="toolsnav">{links}<a href="{up}x-post-writer/">X Post Writer</a><a href="{up}tools/">All tools</a></div></div></section>
<footer class="site-footer"><div class="wrap">
<div class="f-grid">
<div class="f-brand"><a href="{up}"><img src="{up}assets/logo-light.svg" alt="Netmend" width="121" height="30" loading="lazy"></a><p>Small, private AI tools that run in your browser with your own free Gemini key. No account, no server, no trackers.</p></div>
<div><h4>AI tools</h4>{"".join(f'<a href="{up}{s}/">{html.escape(n)}</a>' for s, n in SUITE[:4])}</div>
<div><h4>More</h4>{"".join(f'<a href="{up}{s}/">{html.escape(n)}</a>' for s, n in SUITE[4:])}<a href="{up}x-post-writer/">X Post Writer</a></div>
<div><h4>Netmend</h4><a href="{up}tools/">All tools</a><a href="{up}#services">Services</a><a href="mailto:dayinportugal@gmail.com?subject=Netmend">Contact</a></div>
</div>
<div class="f-bottom">© 2026 Netmend · run by Pedro Carvalho · EU-based · No cookies, no trackers, no sign-up. Your files, text and Gemini key stay in your browser and go only to Google's Gemini API. Licences are checked with Gumroad.</div>
</div></footer>
'''

def build(slug):
    m = json.loads((ROOT/"_build/suite"/f"{slug}.json").read_text())
    m["slug"] = slug
    body = (ROOT/"_build/suite"/f"{slug}.body.html").read_text()
    pills = "".join(f"<span>{html.escape(p)}</span>" for p in m["pills"])
    hero = f'''<div class="hero"><div class="wrap">
<p class="crumbs"><a href="../">Netmend</a> · <a href="../tools/">Tools</a> · {html.escape(m["name"])}</p>
<h1>{m["h1"]}</h1>
<p>{m["intro"]}</p>
<div class="pills">{pills}</div>
<p style="margin-top:18px"><a class="btn" href="#app">{html.escape(m.get("cta","Try it free"))}</a></p>
</div></div>
'''
    scripts = "".join(f'<script src="{s}"></script>' for s in m.get("scripts", []))
    out = head(m, 1) + hero + body + footer(1) + scripts + "\n</body></html>\n"
    d = ROOT/slug; d.mkdir(exist_ok=True)
    (d/"index.html").write_text(out)
    print("built", slug)

if __name__ == "__main__":
    import sys
    for s in (sys.argv[1:] or [p.stem.replace(".body","") for p in sorted((ROOT/"_build/suite").glob("*.body.html"))]):
        build(s)
