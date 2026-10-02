/* See ADmiraNeXT with the visitor's brand. Marca Blanca drafts it. The catalog is not written. */
(function () {
  'use strict';
  var PRODUCTS = [
    ['Pixeria', 'Create the content', 'https://www.pixeria.com/'],
    ['admira.tv', 'Run the screens', 'https://admira.tv/canal'],
    ['admira.app', 'Sell the airtime', 'https://admira.app/?lang=en'],
    ['XpaceOS', 'Twin the space', 'https://www.xpaceos.com/admira-xp/?autostart=xtanco'],
    ['Yokup', 'Keep it working', 'https://www.yokup.com/incidencias'],
    ['admira.live', 'See who did what', 'https://www.admira.live/']
  ];

  function t(en, es) {
    return document.documentElement.lang === 'es' ? es : en;
  }

  function colour(value, fallback) {
    return /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\))$/i.test(String(value || '')) ? value : fallback;
  }

  function dress(brand) {
    var stage = document.getElementById('yb-stage');
    if (!stage || !brand) return;
    var modes = brand.colores || {};
    var c = modes[brand.modo] || modes.claro || modes.oscuro || {};
    var set = function (name, value) { stage.style.setProperty(name, value); };
    set('--b-bg', colour(c.fondo, '#F7F0E6'));
    set('--b-surface', colour(c.superficie, '#FFFAF3'));
    set('--b-border', colour(c.borde, '#E2D2BD'));
    set('--b-text', colour(c.texto, '#2A1A12'));
    set('--b-soft', colour(c.textoSuave, '#6E5646'));
    set('--b-primary', colour(c.primario, '#3B2318'));
    set('--b-primary-text', colour(c.primarioTexto, '#FFF7EC'));
    set('--b-accent', colour(c.acento, '#E0703A'));
    set('--b-ok', colour(c.ok, '#4F7D3A'));
    var head = String((brand.tipografia && brand.tipografia.titulos) || '');
    set('--b-head', /^[\w\s,'"-]+$/.test(head) && head ? head : 'var(--serif)');
    var logo = document.getElementById('yb-logo');
    var src = (brand.logo && (brand.logo.imagen || brand.logo.svg)) || '';
    if (logo && /^data:image\/(png|jpeg|webp|gif|svg\+xml);base64,[a-z0-9+/=\s]+$/i.test(src)) {
      logo.src = src;
      logo.alt = brand.nombre || 'Logo';
    } else if (logo && typeof src === 'string' && /^\/marcablanca\/logos\/[\w.-]+\.svg$/.test(src)) {
      logo.src = 'https://www.admiranext.com' + src;
      logo.alt = (brand.nombre || 'Brand') + ' logo';
    }
    var name = document.getElementById('yb-name');
    if (name) name.textContent = brand.nombre || brand.id || '';
    var sector = document.getElementById('yb-sector');
    if (sector) sector.textContent = brand.sector || brand.descripcion || '';
  }

  function ensureDeck() {
    var deck = document.getElementById('yb-deck');
    if (deck) return deck;
    deck = document.createElement('section');
    deck.id = 'yb-deck';
    deck.hidden = true;
    deck.setAttribute('aria-labelledby', 'yb-deck-title');
    var room = document.querySelector('.yb');
    if (room) room.insertAdjacentElement('afterend', deck);
    if (!document.getElementById('yb-deck-style')) {
      var style = document.createElement('style');
      style.id = 'yb-deck-style';
      style.textContent = '#yb-deck{margin-top:28px;display:grid;gap:14px}#yb-deck[hidden]{display:none}#yb-deck .slide{min-height:280px;padding:28px;border:1px solid var(--border);background:var(--deck-bg,#141c1b);color:var(--deck-ink,#f3f0e8)}#yb-deck h3{margin:0 0 8px;font:600 28px/1.15 var(--serif,Georgia)}#yb-deck .slides{display:grid;grid-template-columns:1.2fr 1fr;gap:14px}#yb-deck .grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:16px}#yb-deck .grid a{display:block;padding:12px;text-decoration:none;color:inherit;border:1px solid color-mix(in srgb, currentColor 25%, transparent)}#yb-deck .grid small{display:block;opacity:.75}#yb-deck .aviso{font:13px/1.5 var(--mono,ui-monospace);opacity:.8}#yb-deck .logo{max-height:42px;max-width:180px}#yb-deck .cta{display:inline-block;margin-top:18px;padding:12px 16px;background:var(--deck-accent,#ff5c35);color:#190d09;text-decoration:none;font-weight:700}@media(max-width:800px){#yb-deck .slides,#yb-deck .grid{grid-template-columns:1fr}}';
      document.head.appendChild(style);
    }
    return deck;
  }

  function showDeck(data) {
    var brand = data.propuesta || {};
    var page = data.page || {};
    var modes = brand.colores || {};
    var c = modes[brand.modo] || modes.claro || {};
    var name = brand.nombre || page.title || data.host || '';
    var deck = ensureDeck();
    deck.hidden = false;
    deck.style.setProperty('--deck-bg', colour(c.fondo, '#141c1b'));
    deck.style.setProperty('--deck-ink', colour(c.texto, '#f3f0e8'));
    deck.style.setProperty('--deck-accent', colour(c.acento, '#ff5c35'));
    var logo = (brand.logo && brand.logo.imagen) || page.icon || '';
    var logoHtml = /^data:image\/(png|jpeg|webp|gif|svg\+xml);base64,/i.test(logo) ? '<img class="logo" alt="" src="' + logo + '">' : '';
    var cards = PRODUCTS.map(function (item) {
      return '<a href="' + item[2] + '" rel="noopener"><b>' + item[0] + '</b><small>' + item[1] + '</small></a>';
    }).join('');
    deck.innerHTML = '<div class="slides"><article class="slide"><p class="aviso">' + t('Proposal · not the official brand', 'Propuesta · no es la marca oficial') + '</p>' + logoHtml + '<h3 id="yb-deck-title">' + escapeHtml(name) + '</h3><p>' + escapeHtml(data.aviso || brand.descripcion || '') + '</p><a class="cta" href="/pilot/">' + t('Start a pilot with this brand →', 'Empezar un piloto con esta marca →') + '</a></article><article class="slide"><h3>' + t('The six products, in this identity', 'Los seis productos, con esta identidad') + '</h3><div class="grid">' + cards + '</div></article></div><p class="aviso">' + t('Read by Marca Blanca at admiranext.com/marcablanca. Nothing was saved in the catalog. The generator shortcut prospectUrl (PR #28) is not called from this public page.', 'Leído por Marca Blanca en admiranext.com/marcablanca. No se ha guardado nada en el catálogo. El atajo prospectUrl del generador (PR #28) no se llama desde esta página pública.') + '</p>';
    deck.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
    });
  }

  function boot() {
    var form = document.getElementById('yb-form');
    var note = document.querySelector('.yb-note');
    var button = form && form.querySelector('button[type="submit"]');
    function labels() {
      if (note) {
        note.textContent = t(
          'Your public website is read here through Marca Blanca. The fitting room and a short deck wear that proposal. The brand catalog is not modified, and this page does not call the presentation generator.',
          'Tu web pública se lee aquí a través de Marca Blanca. El probador y una presentación corta visten esa propuesta. El catálogo de marcas no se modifica, y esta página no llama al generador de presentaciones.'
        );
      }
      if (button && !button.dataset.busy) button.textContent = t('See it with my brand', 'Verlo con mi marca');
    }
    labels();
    document.addEventListener('ds-lang', labels);
    if (!form) return;
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      event.stopPropagation();
      var input = document.getElementById('yb-url');
      var msg = document.getElementById('yb-msg');
      var raw = String(input.value || '').trim();
      if (raw && !/^[a-z][a-z0-9+.-]*:\/\//i.test(raw)) raw = 'https://' + raw;
      var url;
      try { url = new URL(raw); } catch (e) { url = null; }
      if (!url || url.protocol !== 'https:' || url.hostname.indexOf('.') === -1) {
        if (msg) msg.textContent = t('Type a public https address, for example https://www.yourbrand.com', 'Escribe una dirección https pública, por ejemplo https://www.tumarca.com');
        input.focus();
        return;
      }
      input.value = url.href;
      if (button) { button.dataset.busy = '1'; button.disabled = true; }
      if (msg) msg.textContent = t('Reading ' + url.hostname + '…', 'Leyendo ' + url.hostname + '…');
      fetch('/api/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ url: url.href })
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (data) { return { status: r.status, data: data }; });
      }).then(function (res) {
        if (button) { button.disabled = false; delete button.dataset.busy; labels(); }
        if (!res.data || !res.data.ok) {
          if (msg) msg.textContent = (res.data && res.data.error) || t('That website could not be read.', 'No se ha podido leer esa web.');
          return;
        }
        var source = document.getElementById('yb-source');
        if (source) source.textContent = res.data.source === 'marcablanca' ? t('Live from Marca Blanca', 'En vivo desde Marca Blanca') : t('Read from the public page', 'Leído de la página pública');
        if (res.data.propuesta) dress(res.data.propuesta);
        showDeck(res.data);
        if (msg) msg.textContent = t('Proposal ready for ' + (res.data.propuesta && res.data.propuesta.nombre || url.hostname) + '. It is not saved in the catalog.', 'Propuesta lista para ' + (res.data.propuesta && res.data.propuesta.nombre || url.hostname) + '. No está guardada en el catálogo.');
      }).catch(function () {
        if (button) { button.disabled = false; delete button.dataset.busy; labels(); }
        if (msg) msg.textContent = t('The brand desk could not be reached. The form below still opens Marca Blanca if you submit again with JavaScript off.', 'No se ha podido llegar al escritorio de marca.');
      });
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
}());
