# Applies the shared dark layout (light logo, font preload, rich footer) to every page that uses assets/tools.css.
# Run from the repo root after regenerating pages: python3 _build/apply_layout.py
import re,pathlib,sys
root=pathlib.Path('.')
GUM='https://portugaldiary.gumroad.com/l/leutz'
def footer(p,note):
    return f'''<footer class="site-footer"><div class="wrap">
<div class="f-grid">
<div class="f-brand"><a href="{p or './'}"><img src="{p}assets/logo-light.svg" alt="Netmend" width="121" height="30" loading="lazy"></a><p>Small, private tools for writing on X, plus fixed-price back-office work for small businesses. Everything runs in your browser.</p></div>
<div><h4>Products</h4><a href="{p}x-post-writer/">X Post Writer</a><a href="{p}x-reach-checker/">X Reach Checker</a><a href="{GUM}" target="_blank" rel="noopener noreferrer">Lifetime license $19</a><a href="{p}#services">Done-for-you services</a></div>
<div><h4>Free tools</h4><a href="{p}statement-to-csv/">Statement PDF to CSV</a><a href="{p}excel-functions/">Excel formula translator</a><a href="{p}wall-of-love/">Testimonial wall</a><a href="{p}pin-maker/">Pinterest pin maker</a></div>
<div><h4>Learn</h4><a href="{p}x-growth/">X growth guides</a><a href="{p}guides/">PDF to Excel guides</a><a href="{p}compare/">Comparisons</a><a href="mailto:dayinportugal@gmail.com?subject=Netmend">Contact</a></div>
</div>
<div class="f-bottom">{note}</div>
</div></footer>'''
n=0
for f in sorted(root.rglob('*.html')):
    if '.git' in f.parts or f.parts[0]=='samples': continue
    s=f.read_text()
    if 'tools.css' not in s: continue
    m=re.search(r'href="((?:\.\./)*)assets/tools\.css"',s); p=m.group(1)
    s=s.replace(f'{p}assets/logo.svg" alt="Netmend">',f'{p}assets/logo-light.svg" alt="Netmend" width="121" height="30">')
    lk=re.search(r'<link rel="stylesheet" href="(?:\.\./)*assets/tools\.css">',s).group(0)
    if 'inter-latin.woff2' not in s:
        s=s.replace(lk,f'<link rel="preload" href="{p}assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>\n<meta name="theme-color" content="#07080b">\n'+lk,1)
    fm=re.search(r'<footer><div class="wrap">(.*?)</div></footer>',s,re.S)
    if fm: s=s[:fm.start()]+footer(p,fm.group(1))+s[fm.end():]
    elif 'site-footer' not in s: print('NO FOOTER',f)
    f.write_text(s); n+=1
print(n,'pages')
