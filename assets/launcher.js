/* ── Portada lanzadera de digitalsignage.ai (encargo 5677, fase 1) ─────────────────
   Se carga DESPUÉS de /assets/app.js (cabecera + idioma) y ANTES de /assets/pilares.js.
   Hace cuatro cosas, sin librerías ni peticiones a terceros:
   1) Marco de la casa: paneles «Options», «Advanced» y «Expert» (línea de comandos).
   2) Idioma: reutiliza el botón #language de app.js; aquí solo se recuerda la elección
      y se traducen título, descripción y aria-labels de la portada.
   3) Perfiles (?perfil / ?ver de pilares-reglas.js): oculta la tarjeta entera.
   4) Miniaturas vivas de cada tarjeta. Un único reloj; solo se mueven las visibles.
      Con prefers-reduced-motion, ahorro de datos o «Paused» quedan en un estado fijo. */
(()=>{
const doc=document,root=doc.documentElement,$=(s,c=doc)=>c.querySelector(s),$$=(s,c=doc)=>[...c.querySelectorAll(s)];
const isEs=()=>root.lang==='es';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
/* Texto bilingüe con el mismo contrato que app.js: translate() lo vuelve a pintar al cambiar de idioma. */
const L=(es,en)=>`<span data-es="${esc(es)}" data-en="${esc(en)}">${isEs()?es:en}</span>`;
const put=(el,es,en)=>{if(!el)return;el.dataset.es=es;el.dataset.en=en;el.innerHTML=isEs()?es:en};

/* ── Perfiles: fuera la tarjeta y el paso de la solución que no aplica ── */
const filtro=window.dsnPilares;
if(filtro&&filtro.hidden&&filtro.hidden.length){
 const hid=new Set(filtro.hidden);
 $$('[data-pilar]').forEach(el=>{if(hid.has(el.dataset.pilar))el.remove()});
 put($('[data-lz-count]'),'Tus productos.<br>Elige por dónde empezar.','Your products.<br>Pick where you start.');
 $$('.lz-btn--ghost[href="#solutions"]').forEach(a=>put(a,'Ver las soluciones','See the solutions'));
}
const perfil=filtro&&filtro.perfil&&filtro.perfil!=='ver'?filtro.perfil:'total';
$$('[data-lz-profiles] a').forEach(a=>{if(a.dataset.p===perfil)a.setAttribute('aria-current','true')});

/* ── Idioma ── */
const langBtn=$('#language');
const TITLE=['AdmiraNeXT — Todas las pantallas de tus tiendas, en una sola red viva','AdmiraNeXT — Every screen in your stores, run as one living network'];
const DESC=['Crea contenido con IA, emítelo en cualquier dispositivo, ve cada tienda como un gemelo digital, envía técnicos y vende el tiempo de tus pantallas. Seis productos de AdmiraNeXT, una lanzadera.','Create content with AI, play it on any device, see every store as a digital twin, send technicians and sell your screen time as media. Six AdmiraNeXT products, one launcher.'];
function langSync(){const i=isEs()?0:1;
 try{localStorage.setItem('admira-language',isEs()?'es':'en')}catch(e){}
 if(!(filtro&&filtro.hidden&&filtro.hidden.length))doc.title=TITLE[i];
 const d=$('meta[name=description]');if(d)d.content=DESC[i];
 $$('.lz [data-aria-es]').forEach(el=>el.setAttribute('aria-label',el.dataset[isEs()?'ariaEs':'ariaEn']));
 $$('[data-lz-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lzLang===(isEs()?'es':'en'))));
}
function setLang(l){if((l==='es')!==isEs()&&langBtn)langBtn.click()}
if(langBtn)langBtn.addEventListener('click',()=>setTimeout(langSync,0));
$$('[data-lz-lang]').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lzLang)));
langSync();

/* ── Paneles del marco ── */
const tools=$$('.lz-tool');
const panelOf=b=>doc.getElementById(b.getAttribute('aria-controls'));
function closeAll(focus){tools.forEach(b=>{if(b.getAttribute('aria-expanded')==='true'){b.setAttribute('aria-expanded','false');panelOf(b).hidden=true;if(focus)b.focus()}})}
function openPanel(b){closeAll();b.setAttribute('aria-expanded','true');const p=panelOf(b);p.hidden=false;const f=p.querySelector('input,a,button');if(f)f.focus({preventScroll:true})}
tools.forEach(b=>b.addEventListener('click',()=>b.getAttribute('aria-expanded')==='true'?closeAll(true):openPanel(b)));
doc.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll(true)});
doc.addEventListener('pointerdown',e=>{if(!e.target.closest('.lz-panel,.lz-tool'))closeAll()});
$$('.lz-panel a[href^="#"]').forEach(a=>a.addEventListener('click',()=>closeAll()));

/* ── Movimiento ── */
const calm=matchMedia('(prefers-reduced-motion:reduce)');
const saver=!!(navigator.connection&&navigator.connection.saveData);
let paused=false;try{paused=localStorage.getItem('lz-motion')==='off'}catch(e){}
const still=()=>calm.matches||paused;
const video=$('[data-lz-video]');
function motionSync(){root.classList.toggle('lz-still',still());
 $$('[data-lz-motion]').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.lzMotion==='off')===still())));
 if(video){if(still()||saver)video.pause();else{const p=video.play();if(p&&p.catch)p.catch(()=>{})}}
 if(still())DEMOS.forEach(d=>d.rest());
}
function setMotion(on){paused=!on;try{localStorage.setItem('lz-motion',on?'on':'off')}catch(e){}motionSync()}
$$('[data-lz-motion]').forEach(b=>b.addEventListener('click',()=>setMotion(b.dataset.lzMotion==='on')));
calm.addEventListener('change',()=>motionSync());

/* ── Miniaturas ── cada una expone tick(n) (n = paso, 5 por segundo) y rest() (estado fijo). */
const DEMOS=[];
const demo=(name,make)=>{const el=$(`[data-demo="${name}"]`);if(!el)return;const d=make(el);d.el=el;d.n=0;d.on=false;DEMOS.push(d)};
const NS='http://www.w3.org/2000/svg';
const svg=(tag,attrs,parent)=>{const e=doc.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);parent.appendChild(e);return e};
const fmt=n=>n.toLocaleString(isEs()?'es-ES':'en-GB');

/* 01 · admira.studio: se escribe un briefing y salen tres formatos. */
demo('studio',el=>{
 const t=$('[data-t]',el),s=$('[data-s]',el),n=$('[data-n]',el);
 const BRIEFS=[['Promo de otoño, tono cálido, 10 s','Autumn promo, warm tone, 10 s'],['Novedad de la semana para el escaparate','This week’s new arrival, for the window'],['Horario de fiestas, con nuestra marca','Holiday opening hours, on brand']];
 let k=-1;
 const show=(b,len,phase)=>{const txt=BRIEFS[b][isEs()?0:1];t.textContent=len==null?txt:txt.slice(0,len);
  el.classList.toggle('is-gen',phase===1);el.classList.toggle('is-ready',phase===2);
  if(phase===0)put(s,'Escribiendo el briefing…','Writing the brief…');
  if(phase===1)put(s,'Generando tres formatos…','Generating three formats…');
  if(phase===2)put(s,'Listo para publicar','Ready to publish');
  n.textContent=phase===2?'3 / 3':phase===1?'0 / 3':''};
 return{tick(i){const c=i%64;if(c===0)k=(k+1)%BRIEFS.length;if(k<0)k=0;
   if(c<26)show(k,Math.round(c*2.2),0);else if(c<42)show(k,null,1);else show(k,null,2)},
  rest(){show(0,null,2)}}});

/* 02 · admira.tv: la cola avanza y cambia de dispositivo. */
demo('tv',el=>{
 const q=$('[data-q]',el),d=$('[data-d]',el),s=$('[data-s]',el),n=$('[data-n]',el);
 const DEV=[['Tótem','Totem'],['Escaparate','Window'],['Carta digital','Menu board']];
 const ITEMS=[[['Carta de otoño','Autumn menu'],'0:15','#FFCC00'],[['Película de marca','Brand film'],'0:30','#FF3366'],[['Oferta del barrio · 2×1','Local offer · 2 for 1'],'0:10','#33FF99'],[['Pedido listo · turno 42','Order ready · ticket 42'],'0:08','#26DEEC'],[['Hilo musical · Calma','Background music · Calm'],'3:20','#a99bff']];
 let head=0,dev=0;
 d.innerHTML=DEV.map(x=>`<span>${L(...x)}</span>`).join('');
 const chips=$$('span',d).filter(x=>x.parentElement===d);
 const draw=()=>{q.innerHTML=[0,1,2,3].map(j=>{const it=ITEMS[(head+j)%ITEMS.length];return `<li><u style="--k:${it[2]}"></u>${L(...it[0])}<em>${j===0?L('EN EMISIÓN','ON AIR'):it[1]}</em>${j===0?'<s></s>':''}</li>`}).join('');
  chips.forEach((c,j)=>c.classList.toggle('is-on',j===dev));
  put(s,'Playlist de «'+DEV[dev][0]+'»','Playlist for “'+DEV[dev][1]+'”');n.textContent=ITEMS.length+' '+(isEs()?'piezas':'items')};
 draw();
 return{tick(i){const c=i%20;if(c===0&&i){head=(head+1)%ITEMS.length;if(head%2===0)dev=(dev+1)%DEV.length;draw()}
   const bar=$('s',q);if(bar)bar.style.setProperty('--p',Math.min(100,(c+1)*5)+'%')},
  rest(){draw();const bar=$('s',q);if(bar)bar.style.setProperty('--p','40%')}}});

/* 03 · XpaceOS: los equipos del plano se encienden; uno avisa y se recupera. */
demo('store',el=>{
 const nodes=$$('.n',el),s=$('[data-s]',el),n=$('[data-n]',el);
 const paint=(on,warn)=>{nodes.forEach((x,j)=>{x.classList.toggle('is-on',j<on&&j!==warn);x.classList.toggle('is-warn',j===warn)});
  const ok=Math.min(on,nodes.length)-(warn>=0&&warn<on?1:0);
  if(warn>=0)put(s,'Aviso: una pantalla no responde','Alert: one screen is not responding');
  else if(on<nodes.length)put(s,'Conectando los equipos del local…','Connecting the store’s devices…');
  else put(s,'Todo el local en línea','Whole store online');
  n.textContent=ok+' / '+nodes.length};
 return{tick(i){const c=i%70;if(c<27)paint(Math.floor(c/3)+1,-1);else if(c<42)paint(9,-1);else if(c<58)paint(9,3);else paint(9,-1)},
  rest(){paint(9,-1)}}});

/* 04 · Yokup: las incidencias pasan de abierta a resuelta. */
demo('yokup',el=>{
 const cols=[0,1,2].map(j=>$(`[data-c="${j}"]`,el)),s=$('[data-s]',el),n=$('[data-n]',el);
 const JOBS=[[['Tótem apagado','Totem offline'],['Tienda 12','Store 12']],[['Cambio de player','Player swap'],['Tienda 07','Store 07']],[['Alta de pantalla','New screen'],['Tienda 21','Store 21']],[['Sin música','Music off'],['Tienda 03','Store 03']]];
 let st=[0,0,1,2],done=0;
 const draw=()=>{cols.forEach((c,j)=>{c.innerHTML=JOBS.map((job,k)=>st[k]===j?`<div class="lz-tk">${L(...job[0])}<small>${j===2?L('con foto','photo proof'):L(...job[1])}</small></div>`:'').join('')});
  put(s,'Intervenciones de hoy','Today’s jobs');n.textContent=st.filter(x=>x===2).length+' / '+JOBS.length};
 draw();
 return{tick(i){if(!i||i%11)return;
   if(st.every(x=>x===2)){st=[0,0,1,2]}else{let k=(done++)%JOBS.length,g=0;while(st[k]===2&&g++<JOBS.length)k=(k+1)%JOBS.length;st[k]++}
   draw()},
  rest(){st=[0,1,2,2];draw()}}});

/* 05 · admira.biz: el circuito en el mapa, impresiones y huecos vendidos. */
demo('biz',el=>{
 const g=$('[data-g]',el),p=$('[data-p]',el),bars=$$('[data-b] i',el),s=$('[data-s]',el),n=$('[data-n]',el);
 for(let y=14;y<214;y+=18)for(let x=14;x<320;x+=18)svg('circle',{class:'g',cx:x,cy:y,r:1},g);
 const PTS=[[40,150],[92,96],[150,120],[206,70],[262,104]];
 const pins=PTS.map(([x,y],j)=>{svg('circle',{class:'h',cx:x,cy:y,r:7,style:`animation-delay:${j*.45}s`},p);return svg('circle',{class:'p',cx:x,cy:y,r:4.5},p)});
 let imp=1840,sold=0;const H=[38,62,48,80,56,70];
 const draw=()=>{pins.forEach((c,j)=>c.classList.toggle('is-sold',j<sold));bars.forEach((b,j)=>b.style.setProperty('--v',H[j]+'%'));
  put(s,'Impresiones del circuito (simulación)','Circuit impressions (simulated)');n.textContent=fmt(imp)};
 draw();
 return{tick(i){imp+=3+(i*7)%9;if(i%6===0){H.push(H.shift());H[5]=30+(i*13)%60}if(i%14===0)sold=(sold+1)%(PTS.length+1);draw()},
  rest(){sold=3;draw()}}});

/* 06 · admira.live: la mesa del Consejo cuenta lo que pasa en las otras cinco. */
demo('live',el=>{
 const seats=$('[data-seats]',el),lines=$('[data-l]',el),say=$('[data-say]',el),s=$('[data-s]',el),n=$('[data-n]',el);
 const POS=[[160,86],[226,104],[236,146],[160,170],[84,146],[94,104]];
 const ls=POS.map(([x,y])=>svg('line',{class:'l',x1:x,y1:y,x2:160,y2:128},lines));
 const ss=POS.map(([x,y])=>svg('circle',{class:'s',cx:x,cy:y,r:11},seats));
 const TALK=[[['Contenido','Content'],['tres formatos listos para publicar.','three formats ready to publish.']],[['Emisión','Playout'],['la playlist del escaparate ya está en el aire.','the window playlist is on air.']],[['Operaciones','Operations'],['una pantalla no responde; abro incidencia.','one screen is not responding; opening an incident.']],[['Servicio','Service'],['técnico en tienda, cierre con foto.','technician on site, closed with a photo.']],[['Medios','Media'],['hueco de la tarde vendido en el circuito.','afternoon slot sold on the circuit.']],[['Consejo','Council'],['prioridad de hoy: la tienda piloto.','today’s priority: the pilot store.']]];
 let k=0;
 const draw=()=>{ss.forEach((c,j)=>c.classList.toggle('is-on',j===k));ls.forEach((c,j)=>c.classList.toggle('is-on',j===k));
  say.innerHTML=`<b>${L(...TALK[k][0])}:</b> ${L(...TALK[k][1])}`;
  put(s,'Agentes en la mesa','Agents at the table');n.textContent=POS.length+' / '+POS.length};
 draw();
 return{tick(i){if(i&&i%13===0){k=(k+1)%TALK.length;draw()}},rest(){k=5;draw()}}});

/* Un solo reloj a 5 pasos por segundo; solo avanzan las miniaturas visibles y con la pestaña activa. */
if('IntersectionObserver' in window){
 const io=new IntersectionObserver(es=>es.forEach(e=>{const d=DEMOS.find(x=>x.el===e.target);if(d)d.on=e.isIntersecting}),{rootMargin:'40px'});
 DEMOS.forEach(d=>io.observe(d.el));
 const rise=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');rise.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
 $$('.lz-rise').forEach(el=>rise.observe(el));
}else{DEMOS.forEach(d=>d.on=true);$$('.lz-rise').forEach(el=>el.classList.add('is-in'))}
setInterval(()=>{if(still()||doc.hidden)return;DEMOS.forEach(d=>{if(d.on)d.tick(d.n++)})},200);
/* Los pasos del héroe se iluminan en orden, como un recorrido. */
const flow=$$('[data-lz-flow] li');let fi=0;
setInterval(()=>{if(still()||doc.hidden||!flow.length)return;flow.forEach((li,j)=>li.classList.toggle('is-on',j===fi%flow.length));fi++},1400);
/* Al cambiar de idioma, las cifras y textos pintados a mano se rehacen en el siguiente paso. */
if(langBtn)langBtn.addEventListener('click',()=>setTimeout(()=>DEMOS.forEach(d=>still()?d.rest():d.tick(d.n)),0));
motionSync();
if(!still())DEMOS.forEach(d=>d.tick(d.n++));

/* ── Experto: línea de comandos de la portada ── */
const out=$('[data-lz-out]'),form=$('[data-lz-cli]'),inp=$('#lz-cmd');
const SOL={studio:'/studio/',pixeria:'https://www.pixeria.com/',tv:'https://admira.tv/',queue:'https://admira.tv/gestorColas/',store:'/store/',xpaceos:'https://www.xpaceos.com/',yokup:'https://www.yokup.com/',app:'/app/',biz:'/biz/',clearchannel:'https://www.clearchannel.tv/',live:'https://www.admira.live/'};
const say=(h)=>{out.insertAdjacentHTML('beforeend',h+'\n');out.scrollTop=out.scrollHeight};
const T=(es,en)=>isEs()?es:en;
const HELP=()=>T(
'<b>solutions</b>        lista las soluciones\n<b>open</b> &lt;nombre&gt;    abre una: open tv\n<b>go</b> solutions|demos\n<b>lang</b> en|es\n<b>motion</b> on|off     mueve o para las miniaturas\n<b>profile</b> &lt;perfil&gt;  los de «Avanzado»\n<b>pilot</b>            empieza un piloto\n<b>clear</b>            limpia la pantalla',
'<b>solutions</b>        list the solutions\n<b>open</b> &lt;name&gt;      open one: open tv\n<b>go</b> solutions|demos\n<b>lang</b> en|es\n<b>motion</b> on|off     play or pause the miniatures\n<b>profile</b> &lt;role&gt;   the ones under “Advanced”\n<b>pilot</b>            start a pilot\n<b>clear</b>            clear the screen');
function run(raw){const [cmd,arg]=raw.trim().toLowerCase().split(/\s+/);if(!cmd)return;
 say('<b>›</b> '+esc(raw.trim()));
 if(cmd==='help'||cmd==='?')return say(HELP());
 if(cmd==='clear'){out.innerHTML='';return}
 if(cmd==='solutions'||cmd==='ls')return say(Object.keys(SOL).join('  '));
 if(cmd==='open'){if(SOL[arg]){say(T('Abriendo ','Opening ')+esc(SOL[arg])+'…');location.href=SOL[arg];return}return say(T('No conozco esa solución. Prueba: ','Unknown solution. Try: ')+Object.keys(SOL).join(', '))}
 if(cmd==='go'){const el=doc.getElementById(arg==='demos'?'demos':arg==='solutions'?'solutions':'');if(el){closeAll();el.scrollIntoView({behavior:still()?'auto':'smooth'});return}return say(T('Secciones: solutions, demos','Sections: solutions, demos'))}
 if(cmd==='lang'){if(arg==='es'||arg==='en'){setLang(arg);return say(arg==='es'?'Idioma: español':'Language: English')}return say('lang en|es')}
 if(cmd==='motion'){if(arg==='on'||arg==='off'){setMotion(arg==='on');return say(T('Miniaturas: ','Miniatures: ')+(arg==='on'?T('en marcha','playing'):T('en pausa','paused')))}return say('motion on|off')}
 if(cmd==='profile'){if(['instalador','creativo','agencia','software'].includes(arg)){location.href='/?perfil='+arg;return}if(arg==='total'){location.href='/';return}return say('profile instalador|creativo|agencia|software|total')}
 if(cmd==='pilot'){location.href='/pilot';return}
 say(T('Comando desconocido. Escribe help.','Unknown command. Type help.'));
}
if(form){form.addEventListener('submit',e=>{e.preventDefault();run(inp.value);inp.value=''});
 say(T('Lanzadera de AdmiraNeXT. Escribe <b>help</b>.','AdmiraNeXT launcher. Type <b>help</b>.'))}
})();
