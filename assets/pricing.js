/* ═══ PRECIOS DE digitalsignage.ai — ÚNICA FUENTE DE IMPORTES ═══
   Fijados por Carlos (3-oct-2026): Creator 15 €, Growth 45 € y Professional 99 € al mes;
   con pago anual, un 10 % menos (13,50 € · 40,50 € · 89 €). Team y Enterprise, a medida.
     monthly = precio al mes con pago mensual
     annual  = precio al mes con pago anual
   Moneda: euros (EUR). Si cambian, se tocan SOLO aquí: la página no lleva cifras escritas. */
const PRICES={
  currency:'EUR',
  free:        {monthly:0,  annual:0},
  creator:     {monthly:15, annual:13.5},
  growth:      {monthly:45, annual:40.5},
  professional:{monthly:99, annual:89},
  team:        {custom:true},
  enterprise:  {custom:true}
};

/* Pinta los precios en [data-price] según Individual/Equipo y Mensual/Anual.
   Se carga antes de app.js: deja data-es/data-en en cada pieza para que el traductor ES/EN de app.js
   las recoja al cargar y al cambiar de idioma. */
(()=>{
  const root=document.querySelector('[data-pricing]');if(!root)return;
  const MAIL='info@admira.com';
  const state={billing:'monthly',seats:PRICES.team.minSeats};
  const lang=()=>document.documentElement.lang==='en'?'en':'es';
  const money=(n,i)=>{const en=i===1||(i==null&&lang()==='en');const v=n.toLocaleString(en?'en-US':'es-ES',{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2});return en?'€'+v:v+'\u00a0€';};
  const pct=(p,b)=>b==='annual'&&p.monthly?Math.round((p.monthly-p.annual)/p.monthly*100):0;
  const set=(el,es,en)=>{el.dataset.es=es;el.dataset.en=en;el.innerHTML=lang()==='en'?en:es;};

  function priceHTML(id){
    const p=PRICES[id];
    if(p.custom)return ['<span class="pp-row"><span class="pp-now pp-now--word">A medida</span></span><span class="pp-meta"><span class="pp-per">Volumen y condiciones para tu red</span></span>',
                        '<span class="pp-row"><span class="pp-now pp-now--word">Custom</span></span><span class="pp-meta"><span class="pp-per">Volume and terms for your network</span></span>'];
    const now=p[state.billing],off=pct(p,state.billing);
    const per=p.perSeat?['por puesto y mes','per seat / month']:['al mes','per month'];
    const bill=now===0?['para siempre','forever']:state.billing==='annual'?['pago anual','billed annually']:['pago mensual','billed monthly'];
    const mk=(i,before,saveTxt)=>`<span class="pp-row"><span class="pp-now">${money(now,i)}</span>`+
      (off>0?`<s class="pp-list"><span class="pp-sr">${before} </span>${money(p.monthly,i)}</s>`:'')+
      `</span><span class="pp-meta"><span class="pp-per">${per[i]} · ${bill[i]}</span>`+
      (off>0?`<span class="pp-save">${saveTxt} ${off}%</span>`:'')+'</span>';
    return [mk(0,'Pago mensual','Ahorra'),mk(1,'Monthly','Save')];
  }

  function render(){
    root.querySelectorAll('[data-price]').forEach(el=>{const [es,en]=priceHTML(el.dataset.price);set(el,es,en);});
    /* Equipo: total según puestos (mínimo PRICES.team.minSeats). */
    const t=PRICES.team;
    root.querySelectorAll('[data-seats-value],[data-seats-total],[data-seats-min],[data-seats-minus],[data-seats-plus]').forEach(el=>{const box=el.closest('[data-seats]')||el;box.hidden=!!t.custom;});
    const total=t.custom?0:t[state.billing]*state.seats;
    root.querySelectorAll('[data-seats-value]').forEach(el=>el.textContent=state.seats);
    root.querySelectorAll('[data-seats-total]').forEach(el=>set(el,`${money(total)} <small>al mes por ${state.seats} puestos</small>`,`${money(total)} <small>per month for ${state.seats} seats</small>`));
    root.querySelectorAll('[data-seats-min]').forEach(el=>set(el,`Mínimo ${t.minSeats} puestos`,`${t.minSeats} seats minimum`));
    root.querySelectorAll('[data-seats-minus]').forEach(b=>b.disabled=state.seats<=t.minSeats);
    /* Botones de contacto: no hay pasarela de pago; el asunto lleva plan, modalidad y puestos. */
    root.querySelectorAll('[data-plan-cta]').forEach(a=>{
      const id=a.dataset.planCta,p=PRICES[id],bits=['digitalsignage.ai','Plan '+a.dataset.planName];
      if(p.custom)bits.push('Hablar con ventas');else bits.push(state.billing==='annual'?'pago anual':'pago mensual');
      if(p.perSeat)bits.push(state.seats+' puestos');
      a.href=`mailto:${MAIL}?subject=${encodeURIComponent(bits.join(' · '))}`;
    });
    /* «Ahorra hasta un X%»: el mayor ahorro anual que sale de la tabla, no una cifra escrita a mano. */
    const max=Math.max(...Object.values(PRICES).filter(p=>p&&p.monthly).map(p=>pct(p,'annual')));
    root.querySelectorAll('[data-save-max]').forEach(el=>set(el,`Ahorra un ${max}\u00a0% con el pago anual`,`Save ${max}% billed annually`));
    root.querySelectorAll('[data-billing-switch]').forEach(b=>b.setAttribute('aria-checked',String(state.billing==='annual')));
    root.querySelectorAll('[data-billing]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.billing===state.billing)));
  }

  function audience(which,focus){
    root.querySelectorAll('[data-audience]').forEach(b=>{const on=b.dataset.audience===which;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;if(on&&focus)b.focus();});
    root.querySelectorAll('[data-audience-panel]').forEach(p=>p.hidden=p.dataset.audiencePanel!==which);
  }

  root.addEventListener('click',e=>{
    const a=e.target.closest('[data-audience]');if(a){audience(a.dataset.audience);return;}
    if(e.target.closest('[data-billing-switch]')){state.billing=state.billing==='annual'?'monthly':'annual';render();return;}
    const lb=e.target.closest('[data-billing]');if(lb){state.billing=lb.dataset.billing;render();return;}
    if(e.target.closest('[data-seats-plus]')){state.seats=Math.min(state.seats+1,99);render();return;}
    if(e.target.closest('[data-seats-minus]')){state.seats=Math.max(state.seats-1,PRICES.team.minSeats);render();}
  });
  /* Pestañas Individual / Equipo con flechas, como un tablist. */
  const tablist=root.querySelector('[role=tablist]');
  if(tablist)tablist.addEventListener('keydown',e=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();
    const tabs=[...root.querySelectorAll('[data-audience]')],i=tabs.indexOf(document.activeElement);
    const n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length;
    audience(tabs[n].dataset.audience,true);
  });
  /* Al cambiar de idioma (app.js cambia <html lang>), traduce también las etiquetas accesibles de los controles. */
  const ariaLang=()=>{const x=lang()==='en'?'En':'Es';root.querySelectorAll('[data-aria-es]').forEach(el=>el.setAttribute('aria-label',el.dataset['aria'+x]));};
  new MutationObserver(()=>{ariaLang();render();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  render();audience('individual');ariaLang();
})();
