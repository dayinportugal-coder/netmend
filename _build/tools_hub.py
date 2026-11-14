"""Builds /tools/ hub: python3 _build/tools_hub.py"""
import html, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from suite import head, footer, ROOT
T = [
 ("slides","AI · Presentations","Netmend Slides","PDF, text, URL or a topic into an editable PowerPoint deck.","Free 3/day · Pro $29 lifetime"),
 ("sheets-ai","AI · Google Sheets","Sheets AI","=NETMEND_AI() and friends: AI formulas inside Google Sheets.","Free 50 cells/day · Pro $19 lifetime"),
 ("askvideo","AI · Video","AskVideo","Chat with any YouTube video: summary, timestamps, answers.","Free 3 videos/day · Pro $19 lifetime"),
 ("quiz","AI · Education","Quiz maker","Text or PDF to a quiz: Google Forms, print, Kahoot, Moodle.","Free 3/day · Pro $19 lifetime"),
 ("chat-pdf","AI · Documents","Chat with PDF","Ask a PDF anything and get answers with page numbers.","Free 10 questions/day · Pro $19 lifetime"),
 ("certificates","Events · Education","Certificates","A names list into PDF certificates, in bulk.","Free 10/batch · Pro $19 lifetime"),
 ("blur","Browser extension","Netmend Blur","Blur emails, numbers and anything you click before you share your screen.","Free · Pro $19 lifetime"),
 ("x-post-writer","AI · X / Twitter","X Post Writer","10 X posts or threads in your own voice from one idea.","Free 3/day · lifetime $19"),
 ("x-reach-checker","X / Twitter","X Reach Checker","Why a post got no reach, and a rewrite.","Free"),
 ("statement-to-csv","Finance","Statement PDF to CSV","Bank statement PDFs to CSV / Excel, privately.","Free"),
 ("pin-maker","Marketing","Pinterest pin maker","1000×1500 pins for bloggers, no sign-up.","Free"),
 ("wall-of-love","Marketing","Testimonial wall","A wall of love page from your reviews.","Free"),
 ("excel-functions","Spreadsheets","Excel formula translator","Function names across 6 languages.","Free"),
]
m = {"name":"Netmend tools","title":"All Netmend tools: private AI apps that run in your browser","desc":"AI slides, Sheets AI, chat with YouTube videos and PDFs, quiz maker, certificates and more. Free tiers, lifetime Pro licences, your own Gemini key, no server.","slug":"tools"}
cards = "".join(f'<a class="card" href="../{s}/"><span class="tag">{html.escape(c)}</span><b>{html.escape(n)}</b><p>{html.escape(d)}</p><p class="note">{html.escape(p)}</p></a>' for s,c,n,d,p in T)
body = f'''<div class="hero"><div class="wrap">
<p class="crumbs"><a href="../">Netmend</a> · Tools</p>
<h1>Small AI tools, <span>no subscription</span></h1>
<p>Every Netmend tool runs in your browser. The AI ones use your own free Google Gemini key, so there is no monthly fee: use the free tier, or pay once for a lifetime Pro licence.</p>
<div class="pills"><span>No account</span><span>No server, no trackers</span><span>Your own Gemini key</span><span>Pay once, not monthly</span></div>
</div></div>
<section><div class="wrap"><div class="nm-hub">{cards}</div></div></section>
<section class="alt"><div class="wrap"><h2>How the free AI works</h2>
<p class="lead">Google gives a free Gemini API key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">aistudio.google.com</a>. Paste it once in any Netmend AI tool; it is saved only in your browser and shared by all Netmend tools on that device. Your text and files go from your browser straight to Google, never to Netmend.</p>
<p class="note">Questions: Pedro Carvalho (Netmend), <a href="mailto:dayinportugal@gmail.com">dayinportugal@gmail.com</a>.</p></div></section>
'''
html_out = head(m, 1).replace('<a href="#app">Use it free</a>','') + body + footer(1) + "\n</body></html>\n"
d = ROOT/"tools"; d.mkdir(exist_ok=True); (d/"index.html").write_text(html_out); print("built tools")
