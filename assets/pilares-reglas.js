/* Perfiles de pilares. Sin ?perfil ni ?ver no hay filtro: la portada sigue igual.
   instalador = sin app · creativo = sin studio · agencia = sin biz
   software = sin tv · total = los cinco. ?ver=store,tv,biz es la combinación a mano.
   despacho y cliente siguen como alias de creativo y software. */
(function (root) {
  var PILARES = ['studio', 'store', 'tv', 'app', 'biz'];
  var PERFILES = {
    instalador: ['studio', 'store', 'tv', 'biz'],
    creativo: ['store', 'tv', 'app', 'biz'],
    agencia: ['studio', 'store', 'tv', 'app'],
    software: ['studio', 'store', 'app', 'biz'],
    total: ['studio', 'store', 'tv', 'app', 'biz']
  };
  var ALIAS = {
    instalador: 'instalador',
    creativo: 'creativo',
    despacho: 'creativo',
    diseno: 'creativo',
    contenidos: 'creativo',
    agencia: 'agencia',
    publicidad: 'agencia',
    software: 'software',
    cliente: 'software',
    total: 'total',
    integracion: 'total'
  };
  var CUENTA = {
    1: { es: 'Una solución', en: 'One pillar', rango: '01 — 01' },
    2: { es: 'Dos soluciones', en: 'Two pillars', rango: '01 — 02' },
    3: { es: 'Tres soluciones', en: 'Three pillars', rango: '01 — 03' },
    4: { es: 'Cuatro soluciones', en: 'Four pillars', rango: '01 — 04' },
    5: { es: 'Cinco soluciones', en: 'Five pillars', rango: '01 — 05' }
  };
  var TROZOS = {
    studio: ['Crea contenido', 'Create content'],
    store: ['distribúyelo a tus espacios', 'distribute it to your spaces'],
    tv: ['reprodúcelo en cada pantalla', 'play it on every screen'],
    app: ['coordina a quienes lo hacen posible', 'coordinate the people behind it'],
    biz: ['monetiza tu red', 'monetize your network']
  };

  function canon(valor) {
    var s = String(valor || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    s = s.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return ALIAS[s] || '';
  }

  function listaDe(valor) {
    if (Array.isArray(valor)) valor = valor.join(',');
    var vistos = {};
    var salida = [];
    String(valor || '').split(/[,+\s]+/).forEach(function (parte) {
      var id = String(parte || '').trim().toLowerCase();
      if (PILARES.indexOf(id) < 0 || vistos[id]) return;
      vistos[id] = true;
      salida.push(id);
    });
    return PILARES.filter(function (id) { return salida.indexOf(id) >= 0; });
  }

  function desdeBusqueda(search) {
    var q = new URLSearchParams(String(search || '').replace(/^\?/, ''));
    var ver = listaDe(q.get('ver'));
    var nombre = canon(q.get('perfil'));
    var ids = null;
    var perfil = '';
    if (ver.length) {
      ids = ver;
      perfil = 'ver';
    } else if (nombre) {
      ids = PERFILES[nombre].slice();
      perfil = nombre;
    }
    if (!ids) return null;
    var hidden = PILARES.filter(function (id) { return ids.indexOf(id) < 0; });
    var qs = perfil === 'ver' ? ('ver=' + ids.join(',')) : ('perfil=' + perfil);
    return { perfil: perfil, ids: ids, hidden: hidden, qs: qs };
  }

  function pilarDeHref(href) {
    var h = String(href || '');
    if (/admira\.studio|\/studio\/?/i.test(h)) return 'studio';
    if (/admira\.store|\/store\/?/i.test(h)) return 'store';
    if (/admira\.tv/i.test(h)) return 'tv';
    if (/admira\.app|\/app\/?/i.test(h)) return 'app';
    if (/admira\.biz|\/biz\/?/i.test(h)) return 'biz';
    return '';
  }

  function cuenta(n) { return CUENTA[n] || CUENTA[5]; }

  function junta(partes, y) {
    if (partes.length <= 1) return partes[0] || '';
    return partes.slice(0, -1).join(', ') + ' ' + y + ' ' + partes[partes.length - 1];
  }

  function frases(ids) {
    var es = ids.map(function (id) { return TROZOS[id][0]; });
    var en = ids.map(function (id) { return TROZOS[id][1]; });
    return {
      es: 'De la idea a la experiencia real. ' + junta(es, 'y') + '.',
      en: 'From the first idea to the real experience. ' + junta(en, 'and') + '.'
    };
  }

  function limpiarTexto(valor, hidden) {
    var out = String(valor == null ? '' : valor);
    var n = 5 - hidden.length;
    var c = cuenta(n);
    out = out.replace(/All five solutions/g, 'The ' + c.en.toLowerCase());
    out = out.replace(/all five solutions/g, 'the ' + c.en.toLowerCase());
    out = out.replace(/Las cinco soluciones/g, 'Las ' + c.es.toLowerCase());
    out = out.replace(/las cinco soluciones/g, 'las ' + c.es.toLowerCase());
    out = out.replace(/cinco soluciones/gi, c.es.toLowerCase());
    out = out.replace(/Cinco soluciones/g, c.es);
    out = out.replace(/Five pillars/g, c.en);
    out = out.replace(/five solutions/gi, c.en.toLowerCase());
    hidden.forEach(function (id) {
      out = out.replace(new RegExp('admira\\.' + id, 'ig'), '');
      if (id === 'studio') out = out.replace(/\bStudio\b/g, '').replace(/\bstudio\b/g, '');
      if (id === 'store') out = out.replace(/\bStore\b/g, '').replace(/\bXpaceOS\b/g, '');
      if (id === 'tv') out = out.replace(/\bAdmira\.tv\b/g, '');
      if (id === 'app') out = out.replace(/\bApp\b/g, '');
      if (id === 'biz') out = out.replace(/\bBiz\b/g, '').replace(/\bDooH\b/g, '').replace(/retail media/ig, '');
    });
    return out.replace(/\s{2,}/g, ' ').replace(/\s+([.,·:])/g, '$1').replace(/·\s*·/g, '·').replace(/\(\s*\)/g, '').trim();
  }

  function aplicarItem(it, filtro) {
    var host = pilarDeHref(it.h);
    if (PILARES.indexOf(it.i) >= 0 && filtro.hidden.indexOf(it.i) >= 0) return null;
    if (PILARES.indexOf(it.i) < 0 && host && filtro.hidden.indexOf(host) >= 0) return null;
    if (PILARES.indexOf(it.i) >= 0 && host && filtro.hidden.indexOf(host) >= 0) {
      it.h = it.i === 'tv' ? 'https://admira.tv/' : ('/' + it.i + '/');
    }
    it.l = it.l.map(function (s) { return limpiarTexto(s, filtro.hidden); });
    it.d = (it.d || []).map(function (s) { return limpiarTexto(s, filtro.hidden); });
    if (!it.l.some(Boolean)) return null;
    return it;
  }

  function aplicarMenu(menus, filtro) {
    if (!filtro || !filtro.hidden.length) return;
    var filtrar = function (items) {
      return items.map(function (it) { return aplicarItem(it, filtro); }).filter(Boolean);
    };
    menus.PRODUCT.cols.forEach(function (col) { col.items = filtrar(col.items); });
    menus.PRODUCT.cols = menus.PRODUCT.cols.filter(function (col) { return col.items.length; });
    menus.RESOURCES.items = filtrar(menus.RESOURCES.items);
    menus.SIGNIN.items = filtrar(menus.SIGNIN.items);
  }

  function regexOculto(hidden) {
    var parts = [];
    hidden.forEach(function (id) {
      parts.push('admira\\.' + id);
      if (id === 'studio') parts.push('\\bStudio\\b', '\\bstudio\\b');
      if (id === 'store') parts.push('\\bStore\\b', '\\bXpaceOS\\b');
      if (id === 'tv') parts.push('Admira\\.tv');
      if (id === 'app') parts.push('\\bApp\\b');
      if (id === 'biz') parts.push('\\bBiz\\b', '\\bDooH\\b', 'retail media');
    });
    return new RegExp(parts.join('|'), 'i');
  }

  root.dsnReglas = {
    PILARES: PILARES,
    PERFILES: PERFILES,
    desdeBusqueda: desdeBusqueda,
    pilarDeHref: pilarDeHref,
    cuenta: cuenta,
    frases: frases,
    limpiarTexto: limpiarTexto,
    aplicarMenu: aplicarMenu,
    regexOculto: regexOculto
  };
})(typeof window !== 'undefined' ? window : globalThis);
