/* Aplica el perfil ya resuelto en app.js. Sin pilares ocultos no toca el DOM. */
(function () {
  var f = window.dsnPilares;
  var reglas = window.dsnReglas;
  if (!f || !f.hidden || !f.hidden.length || !reglas) return;
  var hidden = new Set(f.hidden);
  var re = reglas.regexOculto(f.hidden);

  function esOculto(href) {
    var id = reglas.pilarDeHref(href);
    return Boolean(id && hidden.has(id));
  }

  document.querySelectorAll('a.pillar').forEach(function (a) {
    if (esOculto(a.getAttribute('href'))) a.remove();
  });
  document.querySelectorAll('a.pillar').forEach(function (a, i) {
    var num = a.querySelector('.number');
    if (num && num.firstChild && num.firstChild.nodeType === 3) {
      num.firstChild.nodeValue = String(i + 1).padStart(2, '0') + ' / ';
    }
  });

  document.querySelectorAll('a[href]').forEach(function (a) {
    if (esOculto(a.getAttribute('href'))) a.remove();
  });

  document.querySelectorAll('a[href^="/"]').forEach(function (a) {
    if (a.hasAttribute('data-dsn-perfil')) return;
    var href = a.getAttribute('href');
    if (!href || href.indexOf('//') === 0) return;
    var u = new URL(href, location.origin);
    if (f.perfil === 'ver') u.searchParams.set('ver', f.ids.join(','));
    else u.searchParams.set('perfil', f.perfil);
    a.setAttribute('href', u.pathname + u.search + u.hash);
  });

  var cuenta = reglas.cuenta(f.ids.length);
  var hero = document.querySelector('.hero-title');
  if (hero) {
    hero.dataset.es = cuenta.es + '.<br>Un mundo conectado.';
    hero.dataset.en = cuenta.en + '.<br>One connected world.';
    hero.innerHTML = document.documentElement.lang === 'en' ? hero.dataset.en : hero.dataset.es;
  }
  var copy = document.querySelector('.hero-copy');
  if (copy) {
    var frases = reglas.frases(f.ids);
    copy.dataset.es = frases.es;
    copy.dataset.en = frases.en;
    copy.innerHTML = document.documentElement.lang === 'en' ? frases.en : frases.es;
  }
  var rango = document.querySelector('.hero-foot span:last-child');
  if (rango) rango.textContent = cuenta.rango;

  function titulo() {
    var en = document.documentElement.lang === 'en';
    document.title = en
      ? ('AdmiraNeXT — ' + cuenta.en + '. One connected world.')
      : ('AdmiraNeXT — ' + cuenta.es + '. Un mundo conectado.');
  }
  titulo();
  var langBtn = document.getElementById('language');
  if (langBtn) langBtn.addEventListener('click', function () { setTimeout(titulo, 0); });

  function scrub(valor) {
    var s = String(valor || '');
    if (!re.test(s)) return s;
    var bits = s.split(/(?<=[.!?])\s+/);
    var kept = bits.filter(function (b) { return !re.test(b); });
    return kept.join(' ').replace(/\s{2,}/g, ' ').trim();
  }

  function barrer() {
    document.querySelectorAll('a[href]').forEach(function (a) {
      if (esOculto(a.getAttribute('href'))) a.remove();
    });
    document.querySelectorAll('[data-es],[data-en],p,h1,h2,h3,h4,li,small,strong,span,a').forEach(function (el) {
      if (el.closest('header,script,style')) return;
      ['es', 'en'].forEach(function (lang) {
        if (el.dataset && el.dataset[lang]) el.dataset[lang] = scrub(el.dataset[lang]);
      });
      if (el.children.length) return;
      var limpio = scrub(el.textContent);
      if (limpio !== el.textContent) el.textContent = limpio;
      if (!limpio && (el.tagName === 'A' || el.tagName === 'ARTICLE' || el.tagName === 'LI')) el.remove();
    });
  }

  var page = document.body.dataset.page || '';
  if (hidden.has(page)) {
    var main = document.querySelector('main');
    var vuelta = '/?' + (f.perfil === 'ver' ? ('ver=' + encodeURIComponent(f.ids.join(','))) : ('perfil=' + encodeURIComponent(f.perfil)));
    if (main) {
      main.innerHTML = '<section class="hero hero--sub"><div class="hero-content"><h1 class="hero-title">Este perfil sigue en la portada.</h1><p class="hero-copy">El recorrido de este enlace está en la selección de pilares.</p><a class="button" href="' + vuelta + '">Volver a la portada</a></div></section>';
    }
    return;
  }

  barrer();
  if (typeof window.renderPanel === 'function') {
    var orig = window.renderPanel;
    window.renderPanel = function () { orig(); barrer(); };
  }
})();
