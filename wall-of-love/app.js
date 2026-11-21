// Netmend free testimonial wall generator. Everything happens in the browser.
function nmLang(){var l=(document.documentElement.lang||"pt").toLowerCase();return l.indexOf("en")===0?"en":l.indexOf("es")===0?"es":"pt";}
function nmT(en,pt,es){var l=nmLang();return l==="en"?en:l==="es"?es:pt;}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function parse(txt){
  return txt.split(/\n\s*\n/).map(function(b){var l=b.trim().split('\n').map(function(x){return x.trim()}).filter(Boolean);if(!l.length)return null;
    var head=l[0].split('|').map(function(x){return x.trim()});var stars=0;var m=(head[2]||'').match(/[1-5]/);if(m)stars=+m[0];
    return {name:head[0]||'',role:head[1]||'',stars:stars,text:l.slice(1).join(' '),src:(head[3]||'')}}).filter(function(t){return t&&t.text});
}
function gen(){
  var items=parse(document.getElementById('src').value);
  var theme=document.getElementById('theme').value,acc=document.getElementById('acc').value,cols=document.getElementById('cols').value,title=document.getElementById('title').value.trim();
  var bg=theme==='dark'?'#0f1720':'#ffffff',card=theme==='dark'?'#18222d':'#f7f6f2',fg=theme==='dark'?'#eef2f5':'#1d2a36',mu=theme==='dark'?'#9fb0bf':'#5b6672';
  var id='nmw'+Math.random().toString(36).slice(2,7);
  var css='.'+id+'{background:'+bg+';color:'+fg+';padding:24px;border-radius:16px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}'+
  '.'+id+' h3{margin:0 0 16px;font-size:24px;text-align:center}'+
  '.'+id+' .g{columns:'+cols+' 260px;column-gap:16px}'+
  '.'+id+' .c{break-inside:avoid;background:'+card+';border-radius:12px;padding:16px;margin:0 0 16px;border-top:3px solid '+acc+'}'+
  '.'+id+' .s{color:'+acc+';letter-spacing:2px;font-size:15px}'+
  '.'+id+' p{margin:8px 0 10px;line-height:1.5;font-size:15px}'+
  '.'+id+' .n{font-weight:700;font-size:14px}.'+id+' .r{color:'+mu+';font-size:13px}'+
  '.'+id+' .a{display:inline-grid;place-items:center;width:34px;height:34px;border-radius:50%;background:'+acc+';color:#fff;font-weight:700;margin-right:10px;vertical-align:middle}';
  var html='<div class="'+id+'">'+(title?'<h3>'+esc(title)+'</h3>':'')+'<div class="g">'+items.map(function(t){
    var ini=t.name.split(/\s+/).map(function(w){return w[0]||''}).join('').slice(0,2).toUpperCase();
    return '<div class="c">'+(t.stars?'<div class="s" aria-label="'+t.stars+nmT(' out of 5 stars',' de 5 estrelas',' de 5 estrellas')+'">'+'★'.repeat(t.stars)+'☆'.repeat(5-t.stars)+'</div>':'')+
    '<p>'+esc(t.text)+'</p><div><span class="a">'+esc(ini)+'</span><span><span class="n">'+esc(t.name)+'</span>'+(t.role?' <span class="r">· '+esc(t.role)+'</span>':'')+
    (t.src?' <span class="r">· '+(/^https?:\/\//.test(t.src)?'<a href="'+esc(t.src)+'" rel="nofollow noopener" style="color:inherit">'+nmT('source','fonte','fuente')+'</a>':esc(t.src))+'</span>':'')+'</span></div></div>'}).join('')+'</div></div>';
  var out='<!-- '+nmT('Testimonial wall made free with Netmend: https://netmend.app/wall-of-love/','Mural de testemunhos feito grátis com a Netmend: https://netmend.app/wall-of-love/','Muro de testimonios hecho gratis con Netmend: https://netmend.app/wall-of-love/')+' -->\n<style>'+css+'</style>\n'+html;
  document.getElementById('preview').innerHTML=out;document.getElementById('code').value=out;
  document.getElementById('count').textContent=items.length+nmT(' testimonial(s)', items.length===1?' testemunho':' testemunhos', items.length===1?' testimonio':' testimonios');
}
['src','theme','acc','cols','title'].forEach(function(i){document.getElementById(i).addEventListener('input',gen)});
document.getElementById('copy').addEventListener('click',function(){var c=document.getElementById('code');c.select();navigator.clipboard?navigator.clipboard.writeText(c.value):document.execCommand('copy');this.textContent=nmT('Copied ✓','Copiado ✓','Copiado ✓')});
document.getElementById('dlh').addEventListener('click',function(){var v='<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+nmT('Wall of love','Mural de testemunhos','Muro de testimonios')+'</title><body style="margin:0;padding:20px;background:#eee">'+document.getElementById('code').value+'</body>';var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([v],{type:'text/html'}));a.download='wall-of-love.html';a.click()});
gen();
