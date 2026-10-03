/* ═══ Armazón cuadrático de las landings (metaestilo AdmiraNeXT) ═════════════════════════════════
   Canon de la Galaxia (admira-next-web/assets/admira-frame.md):
   · ☰ Opciones (a la izquierda de la barra) → panel IZQUIERDO: navegación a otras páginas.
   · ▤ Avanzado (extremo derecho)            → panel DERECHO: lo que actúa sobre esta página.
   · ⌘ Experto  (extremo derecho)            → franja INFERIOR: el CLI.
   Independientes, superpuestos (el contenido no se mueve), entran cerrados, Esc cierra el que tiene
   el foco o el último abierto, un clic fuera los cierra. Los tres se redimensionan arrastrando el
   borde interior (ratón, dedo o teclado: role="separator", flechas 16 px, Mayús 64, Inicio/Fin,
   Intro o doble clic = tamaño por defecto); el tamaño se recuerda en localStorage
   admiranext_frame_sizes_v1 y llega a CSS como --yk-w-left/--yk-w-right/--yk-h-bottom.
   Se carga DESPUÉS de /assets/app.js (que pinta la barra del sitio y el idioma).            */
(()=>{
const bar=document.querySelector('[data-site-header] .dsn-bar');if(!bar)return;
const H=document.documentElement,B=document.body,here=B.dataset.sol||'';
const SOL=[
 {id:'studio',n:'01',c:'#FF33CC',v:['Crear','Create'],w:['https://www.admira.studio/','https://pixeria.com/'],m:'pixeria.com'},
 {id:'store', n:'02',c:'#FFCC00',v:['Operar','Operate'],w:['https://www.admira.store/','https://xpaceos.com/'],m:'xpaceos.com'},
 {id:'tv',    n:'03',c:'#33FF99',v:['Emitir','Broadcast'],w:['https://admira.tv/','https://admira.tv/'],m:''},
 {id:'app',   n:'04',c:'#FFFFFF',v:['Monetizar','Monetize'],w:['https://www.admira.app/','https://clearchannel.tv/'],m:'clearchannel.tv'},
 {id:'biz',   n:'05',c:'#FF3366',v:['Cuidar','Care'],w:['https://www.admira.biz/','https://yokup.com/'],m:'yokup.com'}];
const DEMO=['https://www.admira.app/','https://clearchannel.tv/'];
const en=()=>H.lang==='en',X=()=>en()?1:0;
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const L=(es,e)=>`<span data-es="${esc(es)}" data-en="${esc(e)}">${en()?e:es}</span>`;
const WM='<span class="mx-wm" role="img" aria-label="ADmiraNeXT"><span class="yk-wm-admira">ADmira</span><span class="yk-wm-n">N</span><span class="yk-wm-e">e</span><span class="yk-wm-x">X</span><span class="yk-wm-t">T</span></span>';
const VER=(document.querySelector('meta[name="admiranext-version"]')||{}).content||'';

/* ── botones de la barra ── */
const tog=(side,g,es,e)=>`<button type="button" class="mx-tog mx-tog--${side==='left'?'left':'right'}" data-mx-tog="${side}" aria-controls="mx-${side}" aria-expanded="false" title="${esc(es)}"><span class="g" aria-hidden="true">${g}</span><span class="l">${L(es,e)}</span></button>`;
bar.insertAdjacentHTML('afterbegin',tog('left','☰','Opciones','Options'));
bar.insertAdjacentHTML('beforeend',tog('right','▤','Avanzado','Advanced')+tog('bottom','⌘','Experto','Expert'));

/* ── contenido de los paneles ── */
const solNav=SOL.map(s=>`<li><a href="/${s.id}/" style="--c:${s.c}"${s.id===here?' aria-current="page"':''}><i></i>admira.${s.id}<small>${L(s.v[0],s.v[1])}</small></a></li>`).join('');
const webNav=SOL.map(s=>`<li><a href="${s.w[0]}" data-href-es="${s.w[0]}" data-href-en="${s.w[1]}" style="--c:${s.c}" rel="noopener"><i></i>${s.m?L('admira.'+s.id,s.m):'admira.'+s.id}<small>↗</small></a></li>`).join('');
const LEFT=`<div class="mx-blk"><p class="mx-blk-t">${L('Soluciones','Solutions')}</p><ul class="mx-nav">${solNav}</ul></div>
<div class="mx-blk"><p class="mx-blk-t">${L('Webs de producto','Product sites')}</p><ul class="mx-nav">${webNav}</ul></div>
<div class="mx-blk"><p class="mx-blk-t">digitalsignage.ai</p><ul class="mx-nav"><li><a href="/">${L('Inicio','Home')}</a></li><li><a href="/pricing/">${L('Precios','Pricing')}</a></li><li><a href="/demo/">${L('Demo marca blanca','White-label demo')}</a></li></ul></div>
<div class="mx-blk"><p class="mx-blk-t">AdmiraNeXT</p><ul class="mx-nav"><li><a href="https://www.admiranext.com/">admiranext.com<small>↗</small></a></li><li><a href="https://www.admiranext.com/libro-de-estilo">${L('Libro de estilo','Style guide')}<small>↗</small></a></li><li><a href="https://www.admiranext.com/mcp/">MCP<small>↗</small></a></li><li><a href="https://www.admiranext.com/help/">${L('Ayuda · /help','Help · /help')}<small>↗</small></a></li><li><a href="mailto:info@admira.com">info@admira.com</a></li></ul></div>`;
const cur=SOL.find(s=>s.id===here)||SOL[0];
const RIGHT=`<div class="mx-blk"><p class="mx-blk-t">${L('Ir a','Go to')}</p><ul class="mx-nav" data-mx-goto></ul></div>
<div class="mx-blk"><p class="mx-blk-t">${L('Acciones','Actions')}</p><ul class="mx-nav">
<li><button type="button" data-mx-act="lang">${L('Cambiar idioma (ES/EN)','Switch language (ES/EN)')}</button></li>
<li><button type="button" data-mx-act="video">${L('Pausar / reanudar el vídeo','Pause / resume the video')}</button></li>
<li><button type="button" data-mx-act="shot">${L('Ampliar la captura','Enlarge the screenshot')}</button></li>
<li><button type="button" data-mx-act="copy">${L('Copiar el enlace de esta página','Copy this page’s link')}</button></li>
<li><a data-mx-demo href="${DEMO[0]}" data-href-es="${DEMO[0]}" data-href-en="${DEMO[1]}">${L('Abrir la demo (globo)','Open the demo (globe)')}<small>↗</small></a></li></ul></div>
<div class="mx-blk"><p class="mx-blk-t">${L('Metaestilo de esta solución','This solution’s meta-style')}</p>
<div class="mx-swatch" style="--c:${cur.c}"><i></i>${L('acento','accent')} admira.${cur.id} · ${cur.c}</div>
<div class="mx-swatch" style="--c:#33FF99"><i></i>${L('botón de demo','demo button')} · #33FF99</div>
<div class="mx-swatch" style="--c:linear-gradient(90deg,#FFFFFF,#FF3366,#FFCC00,#33FF99,#FF33CC)"><i style="background:var(--c)"></i>${L('paleta ADmiraNeXT','ADmiraNeXT palette')} · #FFFFFF #FF3366 #FFCC00 #33FF99 #FF33CC</div>
<div class="mx-swatch" style="--c:#060c12"><i></i>${L('fondo','background')} · #060c12</div></div>`;
const BOTTOM=`<div class="mx-cli"><pre class="mx-cli-out" data-mx-out aria-live="polite"></pre><form class="mx-cli-form" data-mx-form><label for="mx-cli-in">admira.${here||'site'} ›</label><input id="mx-cli-in" autocomplete="off" spellcheck="false" placeholder="/help"><button type="submit">${L('Ejecutar','Run')}</button></form></div>`;
const rail=(side,g,es,e,body,ft)=>`<aside class="mx-rail mx-rail--${side}" id="mx-${side}" aria-label="${esc(es)}" data-aria-es="${esc(es)}" data-aria-en="${esc(e)}" inert><div class="mx-grip" role="separator" tabindex="0" aria-orientation="${side==='bottom'?'horizontal':'vertical'}" aria-controls="mx-${side}" aria-label="${esc(es)}: tamaño" data-mx-grip="${side}"></div><div class="mx-rail-hd"><span>${g} ${L(es.toUpperCase(),e.toUpperCase())}</span><button type="button" data-mx-close="${side}" aria-label="Cerrar">×</button></div><div class="mx-rail-bd">${body}</div>${ft?`<div class="mx-rail-ft">${WM}<span>${esc(VER)}</span></div>`:''}</aside>`;
B.insertAdjacentHTML('beforeend',rail('left','☰','Opciones','Options',LEFT,1)+rail('right','▤','Avanzado','Advanced',RIGHT,1)+rail('bottom','⌘','Experto · CLI','Expert · CLI',BOTTOM,0));
const R={left:document.getElementById('mx-left'),right:document.getElementById('mx-right'),bottom:document.getElementById('mx-bottom')};
const T={};document.querySelectorAll('[data-mx-tog]').forEach(b=>T[b.dataset.mxTog]=b);

/* ── abrir / cerrar ── */
const order=[];
function setOpen(side,on,focus){const r=R[side];if(!r)return;r.classList.toggle('is-open',on);r.inert=!on;T[side].setAttribute('aria-expanded',String(on));H.classList.toggle('yk-open-'+side,on);
 const i=order.indexOf(side);if(i>=0)order.splice(i,1);if(on){order.push(side);if(side==='right')buildGoto();if(focus){const f=side==='bottom'?r.querySelector('input'):r.querySelector('.mx-rail-bd a,.mx-rail-bd button');f&&f.focus({preventScroll:true});}}
 else if(r.contains(document.activeElement))T[side].focus({preventScroll:true});}
const isOpen=s=>R[s].classList.contains('is-open');
Object.keys(T).forEach(s=>T[s].addEventListener('click',()=>setOpen(s,!isOpen(s),true)));
document.querySelectorAll('[data-mx-close]').forEach(b=>b.addEventListener('click',()=>setOpen(b.dataset.mxClose,false)));
document.addEventListener('keydown',e=>{if(e.key!=='Escape'||document.querySelector('dialog[open]'))return;const f=Object.keys(R).find(s=>R[s].contains(document.activeElement)&&isOpen(s));const s=f||order[order.length-1];if(s){e.stopPropagation();setOpen(s,false);}},true);
document.addEventListener('pointerdown',e=>{if(e.target.closest('.mx-rail,[data-mx-tog],dialog'))return;Object.keys(R).forEach(s=>isOpen(s)&&setOpen(s,false));});

/* ── tamaños ── */
const KEY='admiranext_frame_sizes_v1',DEF={left:320,right:340,bottom:260};
let S={};try{S=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{}
const barH=()=>bar.getBoundingClientRect().height||76;
const lim=s=>s==='bottom'?[120,Math.max(140,innerHeight-barH()-60)]:[220,Math.max(240,innerWidth<=720?innerWidth*.92:Math.min(760,innerWidth*.6))];
const VAR={left:'--yk-w-left',right:'--yk-w-right',bottom:'--yk-h-bottom'};
function apply(s){const [mn,mx]=lim(s),v=Math.round(Math.min(mx,Math.max(mn,S[s]||DEF[s])));H.style.setProperty(VAR[s],v+'px');const g=R[s].querySelector('.mx-grip');g.setAttribute('aria-valuemin',mn|0);g.setAttribute('aria-valuemax',mx|0);g.setAttribute('aria-valuenow',v);return v;}
function size(s,px,save=true){if(px==null)delete S[s];else S[s]=px;const v=apply(s);if(save){try{localStorage.setItem(KEY,JSON.stringify(S))}catch{}}return v;}
['left','right','bottom'].forEach(apply);addEventListener('resize',()=>['left','right','bottom'].forEach(apply));
document.querySelectorAll('[data-mx-grip]').forEach(g=>{const s=g.dataset.mxGrip;
 const at=e=>s==='left'?e.clientX:s==='right'?innerWidth-e.clientX:innerHeight-e.clientY;
 g.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();g.setPointerCapture(e.pointerId);g.classList.add('is-drag');H.classList.add('mx-resizing');
  const mv=ev=>size(s,at(ev),false),up=ev=>{g.releasePointerCapture(ev.pointerId);g.classList.remove('is-drag');H.classList.remove('mx-resizing');size(s,at(ev));g.removeEventListener('pointermove',mv);g.removeEventListener('pointerup',up);g.removeEventListener('pointercancel',up);};
  g.addEventListener('pointermove',mv);g.addEventListener('pointerup',up);g.addEventListener('pointercancel',up);});
 g.addEventListener('dblclick',()=>size(s,null));
 g.addEventListener('keydown',e=>{const now=+g.getAttribute('aria-valuenow'),st=e.shiftKey?64:16,[mn,mx]=lim(s);let v=null;
  const grow=s==='bottom'?['ArrowUp','ArrowDown']:s==='left'?['ArrowRight','ArrowLeft']:['ArrowLeft','ArrowRight'];
  if(e.key===grow[0])v=now+st;else if(e.key===grow[1])v=now-st;else if(e.key==='Home')v=mn;else if(e.key==='End')v=mx;else if(e.key==='Enter'){e.preventDefault();size(s,null);return;}
  if(v!=null){e.preventDefault();size(s,v);}});});

/* ── ▤ Avanzado: «Ir a» y acciones ── */
function buildGoto(){const ul=R.right.querySelector('[data-mx-goto]');ul.innerHTML=[...document.querySelectorAll('main section[id] h2, main section[id] .mx-h1')].map((h,i)=>{const sec=h.closest('section[id]');return `<li><button type="button" data-mx-sec="${sec.id}"><i style="--c:var(--acc)"></i>${esc(h.textContent.trim())}</button></li>`;}).join('');}
R.right.addEventListener('click',e=>{const sb=e.target.closest('[data-mx-sec]');if(sb){goSec(sb.dataset.mxSec);return;}const a=e.target.closest('[data-mx-act]');if(a)act(a.dataset.mxAct);});
const goSec=id=>{const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});return !!el;};
const video=document.querySelector('[data-mx-video]');
function act(k,arg){
 if(k==='lang'){const want=arg||(en()?'es':'en');if((en()?'en':'es')!==want)document.getElementById('language')?.click();return 'idioma: '+want;}
 if(k==='video'&&video){const play=arg?arg==='play':video.paused;if(play)video.play().catch(()=>{});else video.pause();video.dataset.user=play?'':'paused';return play?'vídeo en marcha':'vídeo en pausa';}
 if(k==='shot'){const d=document.querySelector('.mx-shot-dialog');if(d){d.showModal();return 'captura ampliada';}return 'sin captura';}
 if(k==='copy'){navigator.clipboard?.writeText(location.href).catch(()=>{});return 'enlace copiado: '+location.href;}
 return '';}

/* ── ⌘ Experto: CLI ── */
const out=R.bottom.querySelector('[data-mx-out]'),form=R.bottom.querySelector('[data-mx-form]'),inp=form.querySelector('input');
const print=(t,c='')=>{const s=document.createElement('span');if(c)s.className=c;s.textContent=t+'\n';out.appendChild(s);out.scrollTop=out.scrollHeight;};
const PAGES={inicio:'/',home:'/',precios:'/pricing/',pricing:'/pricing/',demo:'/demo/'};SOL.forEach(s=>PAGES[s.id]='/'+s.id+'/');
const VERBS={
 '/help':['lista de órdenes',()=>Object.entries(VERBS).forEach(([k,v])=>print(`  ${k.padEnd(10)} ${v[0]}`))],
 '/ir':['/ir <studio|store|tv|app|biz|inicio|precios|demo>',a=>{const p=PAGES[(a||'').toLowerCase()];if(!p)return print('no conozco esa página: '+(a||'(vacío)'),'e');print('→ '+p,'m');location.href=p;}],
 '/seccion':['/seccion <n|texto> — salta a una sección',a=>{buildGoto();const bs=[...R.right.querySelectorAll('[data-mx-sec]')];const n=parseInt(a,10);const b=Number.isFinite(n)?bs[n-1]:bs.find(x=>x.textContent.toLowerCase().includes((a||'').toLowerCase()));if(!b||!a){bs.forEach((x,i)=>print(`  ${i+1}. ${x.textContent}`));return;}goSec(b.dataset.mxSec);print('→ '+b.textContent,'m');}],
 '/arriba':['vuelve al principio',()=>{scrollTo({top:0});print('↑','m');}],
 '/idioma':['/idioma <es|en>',a=>print(act('lang',a==='en'||a==='es'?a:undefined),'m')],
 '/video':['/video <play|pause>',a=>print(act('video',a),'m')],
 '/demo':['abre el globo de admira.app / clearchannel.tv',()=>{const u=DEMO[X()];print('→ '+u,'m');window.open(u,'_blank','noopener');}],
 '/web':['abre la web de esta solución',()=>{const u=cur.w[X()];print('→ '+u,'m');window.open(u,'_blank','noopener');}],
 '/tokens':['muestra los tokens del metaestilo',()=>{const cs=getComputedStyle(B);['--acc','--mx-demo','--mx-n','--mx-e','--mx-x','--mx-t','--mx-w','--mx-bg','--mx-ink','--mx-display','--mx-head','--mx-body'].forEach(v=>print(`  ${v.padEnd(12)} ${cs.getPropertyValue(v).trim()}`));}],
 '/tamano':['/tamano <left|right|bottom> <px|def>',a=>{const [s,p]=(a||'').split(/\s+/);if(!R[s])return print('panel: left | right | bottom','e');print(`${s}: ${size(s,p==='def'||!p?null:+p)} px`,'m');}],
 '/limpiar':['limpia la salida',()=>{out.textContent='';}]};
let hist=[],hi=0;
print('ADmiraNeXT · metaestilo · '+(VER||'preview'),'c');print('Escribe /help. Tab completa · ↑/↓ historial.','m');
form.addEventListener('submit',e=>{e.preventDefault();const line=inp.value.trim();if(!line)return;hist.push(line);hi=hist.length;inp.value='';print('› '+line,'c');const [v,...rest]=line.split(/\s+/);const f=VERBS[v.startsWith('/')?v:'/'+v];if(!f){print('orden desconocida. /help','e');return;}try{f[1](rest.join(' '))}catch(err){print(String(err),'e')}});
inp.addEventListener('keydown',e=>{if(e.key==='ArrowUp'&&hist.length){e.preventDefault();hi=Math.max(0,hi-1);inp.value=hist[hi];}else if(e.key==='ArrowDown'&&hist.length){e.preventDefault();hi=Math.min(hist.length,hi+1);inp.value=hist[hi]||'';}else if(e.key==='Tab'){const m=Object.keys(VERBS).filter(k=>k.startsWith(inp.value));if(m.length===1){e.preventDefault();inp.value=m[0]+' ';}else if(m.length>1){e.preventDefault();print(m.join('  '),'m');}}});
window.AdmiraFrame={abrir:(s)=>setOpen(s,true),cerrar:(s)=>setOpen(s,false),tamano:(s,px)=>size(s,px),verbos:VERBS};

/* ── idioma: enlaces, títulos y etiquetas que app.js no traduce ── */
function lang(){const x=X();document.querySelectorAll('[data-href-es]').forEach(a=>a.setAttribute('href',a.dataset[x?'hrefEn':'hrefEs']));
 document.querySelectorAll('[data-aria-es]').forEach(el=>el.setAttribute('aria-label',el.dataset[x?'ariaEn':'ariaEs']));
 if(B.dataset.titleEs)document.title=B.dataset[x?'titleEn':'titleEs'];
 document.querySelectorAll('[data-es]').forEach(el=>{const v=el.dataset[x?'en':'es'];if(el.innerHTML!==v)el.innerHTML=v;});
 if(isOpen('right'))buildGoto();}
new MutationObserver(lang).observe(H,{attributes:true,attributeFilter:['lang']});lang();

/* ── vídeo del héroe: sólo mientras se ve; con movimiento reducido, el póster ── */
if(video){const calm=matchMedia('(prefers-reduced-motion:reduce)');if(calm.matches){video.removeAttribute('autoplay');video.pause();}
 if('IntersectionObserver' in window)new IntersectionObserver(([e])=>{if(calm.matches||video.dataset.user==='paused')return;if(e.isIntersecting)video.play().catch(()=>{});else video.pause();}).observe(video);}

/* ── tira de soluciones: la actual a la vista en móvil ── */
const cs=document.querySelector('.mx-strip a[aria-current]');if(cs){const w=cs.parentElement;if(w.scrollWidth>w.clientWidth)w.scrollLeft=Math.max(0,cs.offsetLeft-w.offsetLeft-(w.clientWidth-cs.offsetWidth)/2);}
/* ── captura ampliable ── */
const dlg=document.querySelector('.mx-shot-dialog');if(dlg){document.querySelectorAll('[data-mx-zoom]').forEach(b=>b.addEventListener('click',()=>dlg.showModal()));dlg.querySelector('[data-mx-x]')?.addEventListener('click',()=>dlg.close());dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close();});}
})();
