/* Portada de digitalsignage.ai: héroe con la nube de Admira.
   Una sección alta con un bloque sticky. Al hacer scroll, el vídeo (recortado con la nube del logo de
   Admira, <clipPath id="ch-clip"> en index.html) crece y la nube se transforma en una tarjeta
   redondeada; el fondo pasa de claro a oscuro y aparece la caja amarilla. Sin librerías: un
   requestAnimationFrame por evento de scroll/resize, y nada más. Estilos en style.css (.ch-*).
   Con prefers-reduced-motion no hay zoom: se muestra directamente la tarjeta, sobre fondo claro. */
(()=>{
const hero=document.querySelector('[data-cloud-hero]');if(!hero)return;
const sticky=hero.querySelector('.ch-sticky'),head=hero.querySelector('.ch-head'),frame=hero.querySelector('.ch-frame');
const path=hero.querySelector('#ch-clip path'),video=hero.querySelector('[data-hero-video]'),card=hero.querySelector('.ch-card');
const capBelow=hero.querySelector('.ch-cap--below'),caps=[...hero.querySelectorAll('[data-cap]')];
const calm=matchMedia('(prefers-reduced-motion:reduce)');
/* La nube, en unidades 0–1, tal como viene en el HTML (contorno sacado del logo de Admira). */
const CLOUD=path.getAttribute('d').replace(/[MZ]/g,'').split('L').map(s=>s.trim().split(/\s+/).map(Number));
const ASPECT=1.595; // ancho/alto real de la nube del logo
const clamp=v=>v<0?0:v>1?1:v,ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,lerp=(a,b,t)=>a+(b-a)*t;
let W=0,H=0,R=26,cloud=[],rect=[],s0=.45,ty0=0,raf=0,last='',CH=0,CAPH=0;const GAP=18;

/* Recalcula formas al cambiar el tamaño: la nube «contain» dentro de la tarjeta (sin deformarla) y,
   para cada punto, el punto de la tarjeta redondeada en la misma dirección desde el centro. */
function layout(){
  W=frame.offsetWidth;H=frame.offsetHeight;if(!W||!H)return;
  const cw=Math.min(W,H*ASPECT),ch=cw/ASPECT,ox=(W-cw)/2,oy=(H-ch)/2;
  cloud=CLOUD.map(([x,y])=>[ox+x*cw,oy+y*ch]);
  const cx=W/2,cy=H/2;R=Math.min(26,W*.04);
  const inside=(x,y)=>{const dx=Math.max(R-x,0,x-(W-R)),dy=Math.max(R-y,0,y-(H-R));return x>=0&&x<=W&&y>=0&&y<=H&&(dx===0||dy===0||dx*dx+dy*dy<=R*R);};
  rect=cloud.map(([x,y])=>{const dx=x-cx,dy=y-cy,len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len;let lo=0,hi=Math.hypot(W,H);
    for(let i=0;i<24;i++){const m=(lo+hi)/2;if(inside(cx+ux*m,cy+uy*m))lo=m;else hi=m;}return [cx+ux*lo,cy+uy*lo];});
  /* Tamaño inicial: una nube de ~560 px (o 3/4 del ancho en móvil) justo debajo del titular. */
  s0=Math.min(1,Math.min(560,innerWidth*.78)/cw);CH=ch;
  const top=frame.offsetTop,headBottom=head.offsetTop+head.offsetHeight;
  /* v8: el rótulo va debajo de la nube; en pantallas bajas la nube inicial se reduce para que quepan los dos. */
  CAPH=capReserve();
  if(CAPH&&!calm.matches){const room=sticky.offsetHeight-16-CAPH-GAP-(headBottom+24);s0=Math.max(.3,Math.min(s0,room/ch));}
  ty0=Math.max(0,headBottom+24-(top+H/2-s0*ch/2));
  last='';frameAt(progress());
}
function progress(){
  if(calm.matches)return 1;
  const r=hero.getBoundingClientRect(),run=hero.offsetHeight-sticky.offsetHeight;
  return run>0?clamp(-r.top/run):1;
}
function frameAt(p){
  const still=calm.matches;
  const grow=still?1:ease(clamp(p/.55)),morph=still?1:ease(clamp((p-.1)/.5));
  const dark=still?0:clamp((p-.05)/.4),out=still?0:clamp((p-.08)/.3),box=still?1:clamp((p-.6)/.18);
  const key=[grow,morph,dark,out,box].map(v=>v.toFixed(3)).join();if(key===last)return;last=key;
  const st=hero.style;
  st.setProperty('--s',lerp(s0,1,grow).toFixed(4));st.setProperty('--ty',(ty0*(1-grow)).toFixed(1)+'px');
  if(capBelow)st.setProperty('--cap-y',(frame.offsetTop+ty0*(1-grow)+H/2+lerp(s0,1,grow)*lerp(CH/2,H/2,morph)+GAP).toFixed(1)+'px');
  st.setProperty('--dark',dark.toFixed(3));st.setProperty('--out',out.toFixed(3));st.setProperty('--box',box.toFixed(3));
  hero.classList.toggle('is-card',box>.5);
  /* Al terminar la transformación, la tarjeta usa un recorte redondeado exacto (esquinas limpias). */
  const done=morph>.995;card.style.clipPath=card.style.webkitClipPath=done?`inset(0 round ${R.toFixed(1)}px)`:'';
  if(cloud.length&&!done)path.setAttribute('d','M'+cloud.map(([x,y],i)=>`${(lerp(x,rect[i][0],morph)/W).toFixed(4)} ${(lerp(y,rect[i][1],morph)/H).toFixed(4)}`).join('L')+'Z');
}
const tick=()=>{raf=0;frameAt(progress());};
const ask=()=>{if(!raf)raf=requestAnimationFrame(tick);};
addEventListener('scroll',ask,{passive:true});
addEventListener('resize',()=>{layout();});
function mode(){
  hero.classList.toggle('ch--static',calm.matches);
  /* Movimiento reducido: el vídeo no arranca solo (queda el póster) */
  if(video){if(calm.matches){video.removeAttribute('autoplay');video.pause();}else{video.play&&video.play().catch(()=>{});}}
  layout();
}
calm.addEventListener('change',mode);
/* El vídeo solo se reproduce mientras se ve. */
let seen=true;
if(video&&'IntersectionObserver' in window)new IntersectionObserver(([e])=>{seen=e.isIntersecting;if(calm.matches)return;if(e.isIntersecting)video.play().catch(()=>{});else video.pause();}).observe(hero);
/* v8: un solo vídeo para ES y EN, sin rótulos dentro. Los nombres y claims son texto HTML (.ch-cap, en index.html):
   uno debajo de la nube (fondo claro) y otro dentro de la tarjeta (modo tarjeta). Se sincronizan con video.currentTime
   (requestAnimationFrame mientras se reproduce, timeupdate/seeked como respaldo) con un fundido entre rótulos.
   Tiempos (s) de pixeria/v8/admiranext-v8-timeline.json: cada rótulo cambia a mitad del fundido entre clips;
   durante el estallido verde no hay rótulo y el del final aparece cuando el logo de partículas ya está formado. */
const CUES=[[7.25,13.75,'studio'],[13.75,20.25,'store'],[20.25,26.75,'tv'],[26.75,33.25,'app'],[33.25,40,'biz'],[42,1e9,'finale']];
const SOL={
  studio:['.studio','#FF33CC','Creación y Adaptación de Contenidos','Content Creation and Adaptation'],
  store:['.store','#FFCC00','Distribución, Gestión y Visualización','Distribution, Management and Visualization'],
  tv:['.tv','#33FF99','Reproducción, Emisión y Proof of Play','Playback, Broadcast and Proof of Play'],
  app:['.app','#FFFFFF','Instalaciones, Mantenimiento y Gestión','Installation, Maintenance and Management'],
  biz:['.biz','#FF3366','Nuevos ingresos con DooH y Retail Media','New revenue with DOOH and Retail Media']};
const NXT=[['N','#FF3366'],['e','#FFCC00'],['X','#33FF99'],['T','#FF33CC']];
const lang=()=>document.documentElement.lang==='es'?'es':'en';
const keyAt=t=>{for(const [a,b,k] of CUES)if(t>=a&&t<b)return k;return null;};
function fill(el,k,l){
  const n=el.querySelector('.ch-cap-name'),c=el.querySelector('.ch-cap-claim');
  el.classList.toggle('is-empty',!k);el.dataset.k=k||'';if(!k){n.textContent='';c.textContent='';return;}
  if(k==='finale'){n.innerHTML='ADmira'+NXT.map(([ch,col])=>`<span class="nxc" style="--c:${col}">${ch}</span>`).join('');c.textContent='Retail OS';
    el.style.setProperty('--bar',`linear-gradient(90deg,${NXT.map(([,col],i)=>`${col} ${i*25}% ${(i+1)*25}%`).join(',')})`);return;}
  const [suf,col,es,en]=SOL[k];
  n.innerHTML=`Admira<span class="suf" data-k="${k}" style="--c:${col}">${suf}</span>`;c.textContent=l==='es'?es:en;
  el.dataset.k=k;el.style.setProperty('--bar',col);
}
/* Alto reservado bajo la nube: el rótulo más largo del idioma actual, medido con el ancho real. */
function capReserve(){
  if(!capBelow)return 0;const n=capBelow.querySelector('.ch-cap-name'),c=capBelow.querySelector('.ch-cap-claim');
  const keep=[n.innerHTML,c.textContent,capBelow.className];let h=0;
  capBelow.classList.remove('is-empty');
  for(const k in SOL){fill(capBelow,k,lang());h=Math.max(h,capBelow.offsetHeight);}
  n.innerHTML=keep[0];c.textContent=keep[1];capBelow.className=keep[2];return h;
}
let curK,curL,capRaf=0;
function syncCaps(){
  const k=video?keyAt(video.currentTime||0):null,l=lang();if(k===curK&&l===curL)return;
  const swap=curK!==undefined&&k!==curK;curK=k;curL=l;
  caps.forEach(el=>{clearTimeout(el._t);
    if(!swap){fill(el,k,l);el.classList.remove('is-swap');return;}
    el.classList.add('is-swap');el._t=setTimeout(()=>{fill(el,k,l);el.classList.remove('is-swap');},300);});
}
/* v8.1: color de los puntos que se iluminan con el ratón = solución en pantalla (--glow en <body>, transición en style.css).
   Antes de studio, magenta; estallido verde (40–42 s), verde; final, magenta. --glow-l: variante para fondo claro. */
const GLOW_L={app:'#9AA6AF'};let curG;
function syncGlow(){
  const t=video?video.currentTime||0:0,k=keyAt(t)||(t>=40&&t<42?'burst':'intro');if(k===curG)return;curG=k;
  const col=SOL[k]?SOL[k][1]:k==='burst'?'#33FF99':'#FF33CC';
  document.body.style.setProperty('--glow',col);document.body.style.setProperty('--glow-l',GLOW_L[k]||col);document.body.dataset.sol=k;
}
function capLoop(){syncCaps();syncGlow();capRaf=video&&!video.paused&&!video.ended?requestAnimationFrame(capLoop):0;}
if(video){video.addEventListener('playing',()=>{if(!capRaf)capRaf=requestAnimationFrame(capLoop);});
  ['timeupdate','seeked','pause','loadeddata'].forEach(e=>{video.addEventListener(e,syncCaps);video.addEventListener(e,syncGlow);});}
new MutationObserver(()=>{syncCaps();layout();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
syncCaps();syncGlow();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(layout);
mode();
})();
