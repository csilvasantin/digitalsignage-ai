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
const calm=matchMedia('(prefers-reduced-motion:reduce)');
/* La nube, en unidades 0–1, tal como viene en el HTML (contorno sacado del logo de Admira). */
const CLOUD=path.getAttribute('d').replace(/[MZ]/g,'').split('L').map(s=>s.trim().split(/\s+/).map(Number));
const ASPECT=1.595; // ancho/alto real de la nube del logo
const clamp=v=>v<0?0:v>1?1:v,ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,lerp=(a,b,t)=>a+(b-a)*t;
let W=0,H=0,R=26,cloud=[],rect=[],s0=.45,ty0=0,raf=0,last='';

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
  s0=Math.min(1,Math.min(560,innerWidth*.78)/cw);
  const top=frame.offsetTop,headBottom=head.offsetTop+head.offsetHeight;
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
if(video&&'IntersectionObserver' in window)new IntersectionObserver(([e])=>{if(calm.matches)return;if(e.isIntersecting)video.play().catch(()=>{});else video.pause();}).observe(hero);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(layout);
mode();
})();
