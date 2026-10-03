/* ── Cabecera de digitalsignage.ai ──────────────────────────────────────────────
   Fuente ÚNICA de la barra y sus menús para todas las páginas. Cada HTML solo lleva
   el marcador <header class="dsn" data-site-header> con el logo (único enlace a
   inicio); aquí se añade el resto. Estilos en /assets/menu.css. No dupliques la barra
   en los HTML: tests/cabecera.test.mjs comprueba que el marcador es idéntico. */
(()=>{
const bar=document.querySelector('[data-site-header] .dsn-bar');if(!bar)return;
const header=bar.parentElement;
let first='en';try{first=sessionStorage.getItem('admira-language')||'en'}catch{}
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const L=(es,en)=>`<span data-es="${esc(es)}" data-en="${esc(en)}">${first==='en'?en:es}</span>`;
const P={
studio:'M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.6 2.6M15.1 15.1l2.6 2.6M6.3 17.7l2.6-2.6M15.1 8.9l2.6-2.6',
store:'M4 10v10h16V10M3 10l2-6h14l2 6zM9 20v-6h6v6',
app:'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
biz:'M14.7 6.3a4 4 0 0 0-5.4 5.2l-5.8 5.8a1.7 1.7 0 0 0 2.4 2.4l5.8-5.8a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.4-.6-.6-2.4z',
layers:'M12 3l9 5-9 5-9-5zM3 12.5l9 5 9-5M3 17l9 5 9-5',
bolt:'M13 2L4 14h7l-1 8 9-12h-7z',
plug:'M9 7V3M15 7V3M6 7h12v4a6 6 0 0 1-12 0zM12 17v4',
terminal:'M4 5h16v14H4zM7.5 9.5l3 2.5-3 2.5M12.5 15h4',
cube:'M12 2.5l8.5 4.8v9.4L12 21.5l-8.5-4.8V7.3zM12 12l8.5-4.7M12 12L3.5 7.3M12 12v9.5',
wave:'M3 12h1.5M6.5 9v6M10 5.5v13M13.5 8v8M17 10v4M20.5 12h.5',
send:'M21 3L3 10.5l7 2.5 2.5 7zM10 13l5-5',
globe:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9s-1.2 6.5-3.6 9c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3z',
spark:'M12 3l2.1 6.9L21 12l-6.9 2.1L12 21l-2.1-6.9L3 12l6.9-2.1z',
cloud:'M7 18h10.5a3.8 3.8 0 0 0 .4-7.6A6 6 0 0 0 6.3 9.6 4.2 4.2 0 0 0 7 18z',
book:'M4 4.5h5.5A2.5 2.5 0 0 1 12 7v13a2 2 0 0 0-2-2H4zM20 4.5h-5.5A2.5 2.5 0 0 0 12 7v13a2 2 0 0 1 2-2h6z',
code:'M14 3H6v18h12V7zM14 3v4h4M10 12l-2 2 2 2M14 12l2 2-2 2',
help:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.6 9.4a2.5 2.5 0 1 1 3.4 2.4c-.6.3-1 .9-1 1.6v.4M12 17h.01',
pen:'M4 20h4L19 9l-4-4L4 16zM14 6l4 4',
play:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM10 8.6v6.8l5.6-3.4z',
building:'M4 21V5l8-3v19M12 9h8v12M3 21h18M7 7.5h2M7 11.5h2M7 15.5h2M15 13h2M15 17h2',
compass:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15.5 8.5l-2 5-5 2 2-5z',
list:'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
mail:'M3 5.5h18v13H3zM3.5 6.5l8.5 6.5 8.5-6.5',
login:'M10 17l5-5-5-5M15 12H3M14 3.5h6v17h-6',
chev:'M6 9l6 6 6-6',tv:'M3 6.5h18v11H3zM8.5 21h7M12 17.5V21M10 10l4 2-4 2z',menu:'M4 7h16M4 12h16M4 17h16',close:'M6 6l12 12M18 6L6 18'};
const ico=(k,c='')=>`<svg class="dsn-i ${c}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${P[k]}"/></svg>`;
const IMG={studio:'/assets/screens/studio.jpg',store:'/assets/screens/store.jpg',app:'/assets/screens/app.jpg',biz:'/assets/screens/biz.jpg',tv:'/assets/screens/tv.jpg',hero:'/assets/hero.png'};
const AN='https://www.admiranext.com';
/* Contenido del menú. i = icono, l = etiqueta [es,en], h = destino, img = vista previa, d = una línea [es,en]. */
const PRODUCT={id:'product',label:['Producto','Product'],cols:[
 {title:['Soluciones','Solutions'],items:[
  {i:'studio',l:['Studio','Studio'],h:'/studio/',img:'studio',d:['Crea contenido con IA: imagen, vídeo, voz y música para tus pantallas.','Create AI content: image, video, voice and music for your screens.']},
  {i:'tv',l:['Admira.tv','Admira.tv'],h:'https://admira.tv/',img:'tv',d:['Tu contenido, en todas las pantallas y dispositivos IoT.','Your content, on every screen and IoT device.']},
  {i:'store',l:['Store','Store'],h:'/store/',img:'store',d:['Distribuye el contenido e inventaría cada punto de venta con XpaceOS.','Distribute content and inventory every point of sale with XpaceOS.']},
  {i:'app',l:['App','App'],h:'/app/',img:'app',d:['Retail media y DOOH: tu red abre nuevas oportunidades de negocio.','Retail media and DOOH: your network opens new business opportunities.']},
  {i:'biz',l:['Biz','Biz'],h:'/biz/',img:'biz',d:['Proyectos coordinados con equipos y máquinas: personas y agentes.','Projects coordinated with teams and machines: people and agents.']},]},
 {title:['Plataforma','Platform'],items:[
  {i:'layers',l:['Marca blanca','White label'],h:AN+'/marcablanca/',img:'hero',d:['Tu logo, colores y tono en las cinco soluciones a la vez.','Your logo, colors and tone across all five solutions at once.']},
  {i:'bolt',l:['Propuestas automáticas','Automatic proposals'],h:AN+'/marcablanca/#lanzar',img:'hero',d:['De la web de una marca a su propuesta de marca blanca y su presentación.','From a brand’s website to its white-label proposal and presentation.']},
  {i:'plug',l:['MCP para agentes','MCP for agents'],h:AN+'/mcp/',img:'hero',d:['Cada solución expone su /mcp para que tus agentes la naveguen.','Each solution exposes its /mcp so your agents can navigate it.']},
  {i:'terminal',l:['CLI y modo experto','CLI and expert mode'],h:AN+'/help/',img:'hero',d:['La línea de comandos del equipo de personas y agentes.','The command line for the team of people and agents.']},
  {i:'cube',l:['Gemelo digital','Digital twin'],h:'/store/',img:'store',d:['El espacio, sus equipos y sus superficies en una sola vista.','Your space, its equipment and its surfaces in a single view.']}]},
 {title:['Integraciones','Integrations'],items:[
  {i:'wave',l:['ElevenLabs','ElevenLabs'],h:'/studio/',img:'studio',d:['Voces multilingües ultrarrealistas para tus contenidos en Studio.','Ultra-realistic multilingual voices for your Studio content.']},
  {i:'globe',l:['Google','Google'],h:'/studio/',img:'studio',d:['Imagen 4, Veo 3 y Lyria 3 en Studio, y acceso con tu cuenta de Google.','Imagen 4, Veo 3 and Lyria 3 in Studio, plus sign-in with Google.']},
  {i:'spark',l:['Grok · xAI','Grok · xAI'],h:'https://www.admira.live/',img:'hero',d:['Grok Imagine en Studio y los consejeros GrokBot del Consejo.','Grok Imagine in Studio and the Council’s GrokBot advisors.']},
  {i:'send',l:['Telegram','Telegram'],h:AN+'/help/',img:'hero',d:['AgoraMatrix: personas y agentes coordinados desde Telegram.','AgoraMatrix: people and agents coordinated from Telegram.']},
  {i:'cloud',l:['Cloudflare','Cloudflare'],h:'/store/',img:'store',d:['Webs y entrega de contenidos sobre la red de Cloudflare.','Websites and content delivery on the Cloudflare network.']}]}]};
const RESOURCES={id:'resources',label:['Recursos','Resources'],items:[
 {i:'book',l:['Documentación MCP','MCP documentation'],h:AN+'/mcp/',d:['Qué es AdmiraNeXT y cómo lo navegan los agentes.','What AdmiraNeXT is and how agents navigate it.']},
 {i:'code',l:['llms.txt','llms.txt'],h:AN+'/mcp/llms.txt',d:['El ecosistema resumido para modelos de lenguaje.','The ecosystem summarised for language models.']},
 {i:'help',l:['Ayuda · /help','Help · /help'],h:AN+'/help/',d:['Comandos y protocolo del equipo.','Team commands and protocol.']},
 {i:'pen',l:['Libro de estilo','Style guide'],h:AN+'/libro-de-estilo',d:['Identidad visual y tono de AdmiraNeXT.','AdmiraNeXT’s visual identity and tone.']},
 {i:'play',l:['Demo','Demo'],h:'/demo/',d:['Las cinco soluciones con la marca digitalsignage.ai.','All five solutions branded as digitalsignage.ai.']}]};
const COMPANY={id:'company',label:['Compañía','Company'],items:[
 {i:'building',l:['AdmiraNeXT','AdmiraNeXT'],h:AN+'/',d:['Donde las cosas se conectan a internet con IA.','Where things connect to the internet with AI.']},
 {i:'compass',l:['Filosofía','Philosophy'],h:AN+'/filosofia',d:['La cultura y las máximas del equipo.','The team’s culture and maxims.']},
 {i:'list',l:['Mandamientos','Commandments'],h:AN+'/mandamientos',d:['Los 15 mandamientos de AdmiraNeXT.','AdmiraNeXT’s 15 commandments.']},
 {i:'mail',l:['Contacto','Contact'],h:'mailto:info@admira.com',d:['info@admira.com · Barcelona','info@admira.com · Barcelona']}]};
/* Sign In: no hay un login único; cada solución tiene su acceso. */
const SIGNIN={id:'signin',title:['Entrar en…','Sign in to…'],items:[
 {i:'studio',l:['admira.studio','admira.studio'],h:'https://www.admira.studio/',d:['Contenido','Content']},
 {i:'tv',l:['admira.tv','admira.tv'],h:'https://admira.tv/',d:['Canal y player','Channel and player']},
 {i:'store',l:['admira.store','admira.store'],h:'https://www.admira.store/',d:['Xpacios · sistema operativo','Xpaces · operating system']},
 {i:'app',l:['admira.app','admira.app'],h:'https://www.admira.biz/retailer#access',d:['Coordinación · en admira.biz','Coordination · on admira.biz']},
 {i:'biz',l:['admira.biz','admira.biz'],h:'https://www.admira.app/backoffice',d:['Retail media · en admira.app','Retail media · on admira.app']}]};
const ITEMS=[];
const isExt=h=>/^https?:/.test(h);
const link=(it,desc)=>{const k=ITEMS.push(it)-1;return `<li><a class="dsn-mlink" href="${it.h}" data-k="${k}"><span class="dsn-ico">${ico(it.i)}</span><span class="dsn-mtext"><span class="dsn-mlabel">${L(...it.l)}${isExt(it.h)?'<span class="dsn-ext" aria-hidden="true">↗</span>':''}</span><span class="${desc?'dsn-mdesc':'dsn-sr'}">${L(...it.d)}</span></span></a></li>`;};
const trigger=(m,cls)=>`<button type="button" class="${cls}" id="dsn-t-${m.id}" aria-expanded="false" aria-controls="dsn-p-${m.id}" data-dsn-trigger>${L(...m.label)}${ico('chev','dsn-chev')}</button>`;
const pop=m=>`<div class="dsn-panel dsn-pop" id="dsn-p-${m.id}" hidden>${m.title?`<p class="dsn-col-title">${L(...m.title)}</p>`:''}<ul>${m.items.map(it=>link(it,true)).join('')}</ul></div>`;
const mega=m=>`<div class="dsn-panel dsn-mega" id="dsn-p-${m.id}" hidden>${m.cols.map(c=>`<div class="dsn-col"><p class="dsn-col-title">${L(...c.title)}</p><ul>${c.items.map(it=>link(it,false)).join('')}</ul></div>`).join('')}<div class="dsn-preview" aria-hidden="true"><img alt="" width="1280" height="610" decoding="async"><div class="dsn-preview-body"><strong></strong><p></p></div></div></div>`;
SIGNIN.label=['Entrar','Sign In'];
bar.insertAdjacentHTML('beforeend',
`<button type="button" class="dsn-burger" aria-expanded="false" aria-controls="dsn-drawer">${ico('menu','dsn-open')}${ico('close','dsn-close')}</button>`+
`<div class="dsn-drawer" id="dsn-drawer"><nav class="dsn-nav" data-aria-es="Navegación principal" data-aria-en="Main navigation"><ul class="dsn-list">`+
/* Orden de la barra (Carlos, 3-oct): Compañía · Producto · Recursos · Precios. */
`<li class="dsn-item dsn-item--sm" data-hover>${trigger(COMPANY,'dsn-trigger')}${pop(COMPANY)}</li>`+
`<li class="dsn-item" data-hover>${trigger(PRODUCT,'dsn-trigger')}${mega(PRODUCT)}</li>`+
`<li class="dsn-item dsn-item--sm" data-hover>${trigger(RESOURCES,'dsn-trigger')}${pop(RESOURCES)}</li>`+
`<li class="dsn-item"><a class="dsn-link" href="/pricing/">${L('Precios','Pricing')}</a></li>`+
`</ul></nav><div class="dsn-actions"><div class="dsn-item dsn-item--sm dsn-signin">${trigger(SIGNIN,'dsn-btn dsn-btn--signin')}${pop(SIGNIN)}</div>`+
`<a class="dsn-btn dsn-btn--start" href="/demo/">${L('Empieza gratis','Start for Free')}</a></div></div>`+
`<button type="button" id="language" class="dsn-lang" aria-label="Switch to English">EN</button>`);

const drawer=bar.querySelector('#dsn-drawer'),burger=bar.querySelector('.dsn-burger');
const desktop=matchMedia('(min-width:900px)'),fine=matchMedia('(hover:hover) and (pointer:fine)');
const en=()=>document.documentElement.lang==='en';
const panelOf=b=>document.getElementById(b.getAttribute('aria-controls'));
const linksOf=p=>[...p.querySelectorAll('a')];
let openBtn=null,via='',tOpen=0,tClose=0;
function preview(p,a){const pv=p.querySelector('.dsn-preview');if(!pv||!a)return;const it=ITEMS[a.dataset.k],x=en()?1:0,img=pv.querySelector('img'),src=IMG[it.img];if(img.getAttribute('src')!==src)img.src=src;pv.querySelector('strong').textContent=it.l[x];pv.querySelector('p').textContent=it.d[x];pv.dataset.k=a.dataset.k;p.querySelectorAll('.is-active').forEach(e=>e.classList.remove('is-active'));a.classList.add('is-active');}
function placeMega(p,b){if(!p||!p.classList.contains('dsn-mega'))return;if(innerWidth<900){p.style.left=p.style.right=p.style.width=p.style.margin='';return;}const bar=b.closest('.dsn-bar')||p.offsetParent;if(!bar)return;const br=bar.getBoundingClientRect(),tr=b.getBoundingClientRect(),m=20,x=tr.left-br.left,w=Math.min(1180,br.width-2*m,Math.max(900,br.width-x-m));const left=Math.max(m,Math.min(x,br.width-w-m));p.style.margin='0';p.style.right='auto';p.style.width=w+'px';p.style.left=left+'px';}
addEventListener('resize',()=>{if(openBtn)placeMega(panelOf(openBtn),openBtn);});
function open(b,how,focus){if(openBtn&&openBtn!==b)close(openBtn);const p=panelOf(b);p.hidden=false;placeMega(p,b);b.setAttribute('aria-expanded','true');openBtn=b;via=how;if(p.classList.contains('dsn-mega'))preview(p,p.querySelector('a[aria-current]')||p.querySelector('a'));if(focus){const ls=linksOf(p);(focus==='last'?ls[ls.length-1]:ls[0]).focus();}}
function close(b=openBtn){if(!b)return;panelOf(b).hidden=true;b.setAttribute('aria-expanded','false');if(openBtn===b){openBtn=null;via='';}}
bar.querySelectorAll('[data-dsn-trigger]').forEach(b=>{
 const item=b.closest('.dsn-item');
 b.addEventListener('click',()=>{clearTimeout(tOpen);clearTimeout(tClose);if(openBtn===b){if(via==='hover'){via='click';return;}close(b);}else open(b,'click');});
 b.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();open(b,'key',e.key==='ArrowDown'?'first':'last');}});
 if(item.hasAttribute('data-hover')){
  item.addEventListener('mouseenter',()=>{if(!desktop.matches||!fine.matches)return;clearTimeout(tClose);clearTimeout(tOpen);if(openBtn===b)return;tOpen=setTimeout(()=>open(b,'hover'),openBtn?0:110);});
  item.addEventListener('mouseleave',()=>{if(!desktop.matches||!fine.matches)return;clearTimeout(tOpen);if(openBtn===b&&via==='hover')tClose=setTimeout(()=>close(b),220);});
 }
 item.addEventListener('focusout',e=>{if(desktop.matches&&openBtn===b&&e.relatedTarget&&!item.contains(e.relatedTarget))close(b);});
});
bar.querySelectorAll('.dsn-panel').forEach(p=>{
 if(p.classList.contains('dsn-mega')){const show=e=>{const a=e.target.closest('a[data-k]');if(a)preview(p,a);};p.addEventListener('mouseover',show);p.addEventListener('focusin',show);}
 p.addEventListener('keydown',e=>{const ls=linksOf(p),i=ls.indexOf(document.activeElement);if(i<0)return;let n=null;
  if(e.key==='ArrowDown')n=(i+1)%ls.length;else if(e.key==='ArrowUp')n=(i-1+ls.length)%ls.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=ls.length-1;
  else if((e.key==='ArrowRight'||e.key==='ArrowLeft')&&p.classList.contains('dsn-mega')&&desktop.matches){const cols=[...p.querySelectorAll('.dsn-col')],ci=cols.findIndex(c=>c.contains(ls[i])),row=[...cols[ci].querySelectorAll('a')].indexOf(ls[i]),t=[...cols[(ci+(e.key==='ArrowRight'?1:cols.length-1))%cols.length].querySelectorAll('a')];e.preventDefault();t[Math.min(row,t.length-1)].focus();return;}
  if(n!==null){e.preventDefault();ls[n].focus();}});
});
/* Flechas izquierda/derecha entre los elementos de primer nivel (escritorio), en el orden visible de la barra:
   Compañía → Producto → Recursos → Precios → Entrar → Empieza gratis → idioma (y vuelta al principio). */
const firstLevel=[...bar.querySelectorAll('.dsn-list>li>button,.dsn-list>li>a,.dsn-actions>.dsn-signin>button,.dsn-actions>a,#language')];
firstLevel.forEach((el,i)=>el.addEventListener('keydown',e=>{if(!desktop.matches||!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();firstLevel[(i+(e.key==='ArrowRight'?1:firstLevel.length-1))%firstLevel.length].focus();}));
document.addEventListener('pointerdown',e=>{if(openBtn&&!openBtn.closest('.dsn-item').contains(e.target))close();});
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(openBtn){const b=openBtn;close(b);b.focus();}else if(header.classList.contains('is-open')){drawerTo(false);burger.focus();}});
function burgerLabel(){const o=header.classList.contains('is-open');burger.setAttribute('aria-label',o?(en()?'Close menu':'Cerrar menú'):(en()?'Open menu':'Abrir menú'));}
function drawerTo(on){header.classList.toggle('is-open',on);burger.setAttribute('aria-expanded',String(on));burgerLabel();document.documentElement.classList.toggle('dsn-lock',on);
 [...document.body.children].forEach(el=>{if(el===header||el.tagName==='SCRIPT')return;if(on){if(!el.inert){el.inert=true;el.dataset.dsnInert='';}}else if('dsnInert' in el.dataset){el.inert=false;delete el.dataset.dsnInert;}});if(!on)close();}
burger.addEventListener('click',()=>drawerTo(!header.classList.contains('is-open')));
desktop.addEventListener('change',()=>{drawerTo(false);close();});
drawer.addEventListener('click',e=>{if(e.target.closest('a[href^="#"]'))drawerTo(false);});
/* Página actual: el primer enlace que apunta aquí y el desplegable que lo contiene. */
const here=location.pathname.replace(/index\.html$/,''),seen=new Set();
drawer.querySelectorAll('a[href^="/"]').forEach(a=>{const h=a.getAttribute('href');if(h!==here||seen.has(h))return;seen.add(h);a.setAttribute('aria-current','page');const t=a.closest('.dsn-item')?.querySelector('[data-dsn-trigger]');if(t)t.classList.add('is-current');});
window.dsnMenu={setLang(){const x=en()?'En':'Es';bar.querySelectorAll('[data-aria-es]').forEach(el=>el.setAttribute('aria-label',el.dataset['aria'+x]));burgerLabel();const p=document.getElementById('dsn-p-product');const k=p.querySelector('.dsn-preview').dataset.k;if(k)preview(p,p.querySelector(`a[data-k="${k}"]`));}};
window.dsnMenu.setLang();
})();
/* Fondo puntillado que se ilumina (estilos en /assets/menu.css, sección .dsn-dots). Sin librerías:
   el halo solo se recoloca en un requestAnimationFrame cuando el ratón se mueve; en táctil o con
   prefers-reduced-motion no se escucha el puntero y el halo queda fijo. */
(()=>{
if(document.querySelector('.dsn-dots:not(.dsn-dots--local)'))return;
const LAYERS='<i class="dsn-dots-base"></i><i class="dsn-dots-idle"></i><i class="dsn-dots-halo"></i>';
const d=document.createElement('div');d.className='dsn-dots';d.setAttribute('aria-hidden','true');d.innerHTML=LAYERS;
document.body.prepend(d);
/* Capas locales (p. ej. el héroe claro de la portada, que tapa la capa fija): mismo halo, coordenadas relativas. */
const local=[...document.querySelectorAll('.dsn-dots--local')];local.forEach(el=>{if(!el.children.length)el.innerHTML=LAYERS;});
const fine=matchMedia('(hover:hover) and (pointer:fine)'),calm=matchMedia('(prefers-reduced-motion:reduce)');
let x=0,y=0,raf=0;
const put=(el,px,py)=>{el.style.setProperty('--x',px+'px');el.style.setProperty('--y',py+'px');};
const paint=()=>{raf=0;put(d,x,y);local.forEach(el=>{const r=el.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)put(el,x-r.left,y-r.top);});};
addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||!fine.matches||calm.matches)return;x=e.clientX;y=e.clientY;if(!raf)raf=requestAnimationFrame(paint);},{passive:true});
calm.addEventListener('change',()=>{if(calm.matches)[d,...local].forEach(el=>{el.style.removeProperty('--x');el.style.removeProperty('--y');});});
})();
let lang=sessionStorage.getItem('admira-language')||'en';const language=document.getElementById('language');function translate(){sessionStorage.setItem('admira-language',lang);document.documentElement.lang=lang;document.querySelectorAll("[data-home-logo]").forEach(el=>el.setAttribute("aria-label",lang==="es"?"digitalsignage.ai — Inicio":"digitalsignage.ai — Home"));document.querySelectorAll('[data-es]').forEach(el=>el.innerHTML=el.dataset[lang]);language.textContent=lang==='es'?'EN':'ES';language.setAttribute('aria-label',lang==='es'?'Switch to English':'Cambiar a español');if(window.dsnMenu)window.dsnMenu.setLang(lang);}language.addEventListener('click',()=>{lang=lang==='es'?'en':'es';translate();});
const t=(es,en,tag='span',attrs='')=>`<${tag} ${attrs} data-es="${es.replaceAll('"','&quot;')}" data-en="${en.replaceAll('"','&quot;')}">${es}</${tag}>`;
const feature=(es,en,bodyEs,bodyEn)=>`<div class="feature">${t(es,en,'h4')}${t(bodyEs,bodyEn,'p')}</div>`;
const solution=(id,n,verbEs,verbEn,titleEs,titleEn,introEs,introEn,features,audienceEs,audienceEn,visual)=>`<section class="solution" id="${id}"><div><p class="eyebrow">${n} / ${t(verbEs,verbEn)}</p><div class="domain-title">admira<span>.${id}</span></div>${t(titleEs,titleEn,'h2')}${t(introEs,introEn,'p','class="intro"')}<div class="features">${features}</div><p class="audience">${t('PARA','FOR')} <b>${t(audienceEs,audienceEn)}</b></p><a class="button outline" href="https://admira.${id}">${t('Descubre admira.'+id,'Discover admira.'+id)}</a></div><div class="visual-panel">${visual}</div></section>`;
const panelHead=(name,es,en)=>`<div class="panel-head"><span>${name}</span>${t(es,en)}</div>`;
const asset=(es,en,subEs,subEn)=>`<div class="asset">${t(es,en,'strong')}${t(subEs,subEn)}<div class="bar" aria-hidden="true"></div></div>`;
const signal=(es,en,kindEs,kindEn)=>`<div class="signal">${t(es,en,'strong')}${t(kindEs,kindEn)}</div>`;
const studio=solution('studio','01','CREAR','CREATE','De un briefing a una experiencia.','From a brief to an experience.','La creatividad es el punto de partida. Admira Studio reúne la creación y adaptación de contenido con IA para dar forma a lo que tu marca quiere contar.','Creativity is the starting point. Admira Studio brings together AI content creation and adaptation to shape what your brand wants to say.',feature('Imagen y vídeo','Image and video','Desarrolla piezas visuales para campañas y pantallas, y adapta tu contenido a la experiencia que quieres crear.','Develop visual content for campaigns and screens, and adapt it to the experience you want to create.')+feature('Voz y música','Voice and music','Completa el mensaje con locuciones y contenido musical que acompañan la comunicación en el espacio.','Complete your message with voiceovers and music that support communication throughout your space.')+feature('Contenido para tu ecosistema','Content for your ecosystem','Prepara recursos que puedan formar parte de la programación de tus espacios y de las campañas de tu red.','Prepare assets for your spaces’ schedules and your network’s campaigns.'),'equipos de marketing, marcas y creadores.','marketing teams, brands and creators.',panelHead('STUDIO','FORMATOS CREATIVOS','CREATIVE FORMATS')+`<div class="asset-grid">${asset('Imagen','Image','La identidad visual','Visual identity')}${asset('Vídeo','Video','La historia en movimiento','Stories in motion')}${asset('Voz','Voice','El mensaje que se escucha','A message to be heard')}${asset('Música','Music','La atmósfera de tu marca','Your brand’s atmosphere')}</div>`+t('Una idea. Distintas formas de conectar.','One idea. Different ways to connect.','p','class="panel-caption"'));
const store=solution('store','03','CONTROLAR','CONTROL','La experiencia va más allá de la pantalla.','The experience goes beyond the screen.','Admira Store, con XpaceOS, pone el espacio físico en el centro. Permite coordinar los contenidos y los sistemas que construyen la experiencia del local.','Admira Store, with XpaceOS, puts the physical space at the center. Coordinate the content and systems that shape the in-store experience.',feature('Un espacio, distintos sentidos','One space, multiple senses','Coordina cartelería digital, hilo musical y aromas, junto con los sistemas de wifi, seguridad e IoT del local.','Coordinate digital signage, background music and scent alongside your location’s Wi-Fi, security and IoT systems.')+feature('Gemelo digital e inventario','Digital twin and inventory','Representa el espacio y sus equipos para entender qué hay en cada ubicación y gestionar su experiencia.','Represent your space and its equipment to understand what is installed at each location and manage its experience.')+feature('Contexto y personalización','Context and personalization','Organiza la experiencia por franjas y condiciones, con herramientas de análisis y fidelización para adaptar la comunicación.','Organize experiences by time and conditions, using analytics and loyalty tools to adapt communication.'),'comercios, retailers y operaciones de tienda.','retailers, stores and operations teams.',panelHead('STORE / XPACEOS','EL ESPACIO CONECTADO','THE CONNECTED SPACE')+`<div class="signal-list">${signal('Pantallas','Screens','Contenido','Content')}${signal('Música y voz','Music and voice','Audio','Audio')}${signal('Aromas','Scent','Ambiente','Atmosphere')}${signal('Wifi, seguridad e IoT','Wi-Fi, security and IoT','Equipos','Equipment')}</div>`+t('El gemelo digital reúne la visión del espacio y sus sistemas.','The digital twin brings your space and its systems into one view.','p','class="panel-caption"'));
const app=solution('app','04','COORDINAR','COORDINATE','La tecnología necesita un equipo.','Technology needs a team.','Admira App conecta personas y agentes IA para convertir necesidades en misiones, organizar el trabajo y seguir lo que ocurre en cada espacio.','Admira App connects people and AI agents to turn needs into missions, organize work and follow what happens at each location.',feature('Misiones y seguimiento','Missions and tracking','Estructura el trabajo y consulta su avance para que cada necesidad tenga una tarea y un seguimiento.','Structure work and follow its progress so each need becomes a task that can be tracked.')+feature('Incidencias del comercio','Store incidents','Da de alta establecimientos y equipos, comunica una incidencia y sigue la intervención hasta su cierre.','Register locations and equipment, report an incident and follow the intervention through to completion.')+feature('Talento cerca del espacio','Talent close to your space','Conecta comercios e instaladores para gestionar intervenciones, cuidar los equipos y valorar el servicio recibido.','Connect stores and installers to manage interventions, care for equipment and review the service delivered.'),'comercios, instaladores y equipos de coordinación.','stores, installers and coordination teams.',panelHead('APP / YOKUP','CICLO DE TRABAJO','WORK CYCLE')+`<div class="mission">${t('Una necesidad en el espacio','A need at your location','strong')}${t('El comercio comunica qué ocurre.','The store reports what is happening.')}</div><div class="mission">${t('Una misión para el equipo','A mission for the team','strong')}${t('Personas y agentes coordinan los siguientes pasos.','People and agents coordinate the next steps.')}</div><div class="mission">${t('Seguimiento hasta el cierre','Follow through to completion','strong')}${t('Intervención, resolución y valoración del servicio.','Intervention, resolution and service review.')}</div>`+t('Tecnología global. Talento local.','Global technology. Local talent.','p','class="panel-caption"'));
const biz=solution('biz','05','MONETIZAR','MONETIZE','Convierte tu circuito en retail media.','Turn your network into retail media.','Admira Biz conecta el negocio publicitario con los espacios físicos. Una visión del circuito ayuda a descubrir ubicaciones y planificar dónde tiene sentido comunicar.','Admira Biz connects advertising with physical spaces. A network view helps you discover locations and plan where your message belongs.',feature('Descubre y selecciona espacios','Discover and select spaces','Explora el mapa de ubicaciones y compara circuitos para preparar la selección de una campaña.','Explore the location map and compare networks to prepare a campaign selection.')+feature('Planifica la campaña','Plan your campaign','Define fechas, pases y público objetivo. Evalúa estimaciones de alcance y presupuesto antes de enviar una solicitud.','Define dates, placements and target audiences. Review reach and budget estimates before submitting a request.')+feature('Más superficies para las marcas','More surfaces for brands','Abre oportunidades de retail media en pantallas, hilo musical y avatares, conectando anunciantes y redes de espacios.','Open retail media opportunities across screens, background audio and avatars, connecting advertisers with location networks.'),'anunciantes, agencias y propietarios de redes.','advertisers, agencies and network owners.',panelHead('BIZ / RETAIL MEDIA','MARCA + CIRCUITO','BRAND + NETWORK')+`<div class="network"><div><b>01</b>${t('Pantallas','Screens','small')}</div><div><b>02</b>${t('Audio','Audio','small')}</div><div><b>03</b>${t('Avatares','Avatars','small')}</div></div><div class="signal-list">${signal('Selección del circuito','Network selection','Ubicaciones','Locations')}${signal('Plan de campaña','Campaign plan','Fechas y público','Dates and audience')}</div>`+t('La planificación prepara una solicitud. Disponibilidad y precio requieren confirmación.','Planning prepares a request. Availability and pricing require confirmation.','p','class="panel-caption"'));

const page=document.body.dataset.page||'home';
const content=document.getElementById('detail-content');
if(content)content.innerHTML=({studio,store,app,biz})[page]||'';
const titles={home:['AdmiraNeXT — Cinco soluciones. Un mundo conectado.','AdmiraNeXT — Five pillars. One connected world.'],studio:['Admira Studio — Contenido con IA','Admira Studio — AI content creation'],store:['Admira Store — Control del espacio','Admira Store — Connected space control'],app:['Admira App — Personas y agentes','Admira App — People and agents'],biz:['Admira Biz — Retail media','Admira Biz — Retail media'],pricing:['Precios — digitalsignage.ai · AdmiraNeXT','Pricing — digitalsignage.ai · AdmiraNeXT']};
function updatePageTitle(){if(titles[page])document.title=titles[page][lang==='es'?0:1];}
language.addEventListener('click',updatePageTitle);
translate();updatePageTitle();
