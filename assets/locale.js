/* English is the default. Spanish is a choice, including the frame: Opciones, Avanzado, Experto. */
(function () {
  'use strict';
  var KEY = 'ds-lang';
  var SKIP = '#yb-stage, #yb-deck, #yb-msg, #yb-source, #pilot-status, #lang-toggle, script, style';
  var originalText = new WeakMap();
  var originalHtml = new WeakMap();
  var HTML = {
    'hero-title': 'Espacios que <span class="g">responden</span>.',
    'launchpad-title': 'Abre el producto, no el <em>folleto</em>.',
    'cases-title': 'Dos espacios en los que puedes <em>entrar</em>.',
    'your-brand-title': 'Mira Admira con tu <em>marca</em>.'
  };
  var ES = {
    'Skip to main content': 'Saltar al contenido',
    'Options': 'Opciones',
    'Advanced': 'Avanzado',
    'Expert': 'Experto',
    'Products': 'Productos',
    'Cases': 'Casos',
    'Twenty solutions': 'Veinte soluciones',
    'White label': 'Marca blanca',
    'Your brand': 'Tu marca',
    'Start a pilot': 'Empezar un piloto',
    'Close options': 'Cerrar opciones',
    'Close advanced': 'Cerrar avanzado',
    'Close expert': 'Cerrar experto',
    'Six products, one launchpad': 'Seis productos, una lanzadera',
    'Field cases': 'Casos de campo',
    'Start from your role': 'Empieza por tu oficio',
    'Network blueprint': 'Plano de la red',
    'Live proof desk': 'Mesa de pruebas en vivo',
    'Go further': 'Seguir',
    'Help for humans': 'Ayuda para personas',
    'Edición en español': 'Edición en español',
    'For the people who have to integrate, audit or operate it.': 'Para quien tiene que integrar, auditar u operar.',
    'MCP door': 'Puerta MCP',
    'The agent-facing entry: manifest and llms.txt.': 'La entrada para agentes: manifest y llms.txt.',
    'Trust ledger': 'Libro de confianza',
    'Source-backed architecture claims, one by one.': 'Afirmaciones de arquitectura, una a una, con su fuente.',
    'Field atlas': 'Atlas de campo',
    'Patterns for stores, workplaces and venues.': 'Patrones para tiendas, lugares de trabajo y locales.',
    'System states': 'Estados del sistema',
    'What empty, loading and failed look like.': 'Cómo se ven vacío, cargando y fallo.',
    'Signal rhythm': 'Ritmo de la señal',
    'The motion language, with reduced-motion rules.': 'El lenguaje de movimiento, con reglas de movimiento reducido.',
    'Turn a site conversation into a working brief.': 'Convierte una conversación de sitio en un encargo útil.',
    'This document': 'Este documento',
    'Raw sources': 'Fuentes en bruto',
    'Product endpoints, read from the cards': 'Destinos de producto, leídos de las tarjetas',
    'Release': 'Versión',
    'Brand runtime': 'Marca en ejecución',
    'Products on the launchpad': 'Productos en la lanzadera',
    'Catalogue entries': 'Fichas del catálogo',
    'Idle': 'En reposo',
    'Open Signal · six products, one launchpad': 'Señal abierta · seis productos, una lanzadera',
    'Six products you can open right now: create the content, run the screens, sell the airtime, twin the space, keep it working and see who did what. Start with one. Each of them can carry your brand instead of ours.': 'Seis productos que puedes abrir ahora: crea el contenido, opera las pantallas, vende el aire, gemela el espacio, mantenlo en marcha y mira quién hizo qué. Empieza por uno. Cada uno puede llevar tu marca en lugar de la nuestra.',
    'Start a pilot →': 'Empezar un piloto →',
    'Open the six products': 'Abrir los seis productos',
    'Create': 'Crear',
    'Run': 'Operar',
    'Sell': 'Vender',
    'Twin': 'Gemelar',
    'Maintain': 'Mantener',
    'Coordinate': 'Coordinar',
    'Sign-in required': 'Hace falta entrar',
    'Open demo': 'Demo abierta',
    'Open demo · Spanish': 'Demo abierta · en español',
    'Launchpad · live products': 'Lanzadera · productos en vivo',
    'Every card opens the product itself, on its own domain, as it runs today. Where a product needs an account, the card says so.': 'Cada tarjeta abre el producto, en su dominio, tal como funciona hoy. Si hace falta una cuenta, la tarjeta lo dice.',
    'Generative content made for screens: images, video and audio announcements, produced and sent straight to the network that will play them.': 'Contenido generativo para pantallas: imágenes, vídeo y avisos de audio, producidos y enviados a la red que los va a reproducir.',
    'Ask for access →': 'Pedir acceso →',
    'The channel engine. Playlists, players and per-screen settings for one display or a whole circuit, with a record of what each device played.': 'El motor del canal. Listas, reproductores y ajustes por pantalla, para un display o un circuito entero, con constancia de lo que reprodujo cada equipo.',
    'Open the channel ↗': 'Abrir el canal ↗',
    'Retail media on a map. Search a store, open its profile, see its screens and plan a campaign across the surfaces you pick.': 'Medios de retail sobre un mapa. Busca una tienda, abre su ficha, mira sus pantallas y planea una campaña en las superficies que elijas.',
    'Open the map ↗': 'Abrir el mapa ↗',
    'clearchannel.tv edition ↗': 'edición clearchannel.tv ↗',
    'A digital twin you can walk through. Screens, background music, scent and wifi of a retail space, supervised from one place.': 'Un gemelo digital que se puede recorrer. Pantallas, música de fondo, aroma y wifi de un espacio de retail, vistos desde un solo sitio.',
    'Enter the twin ↗': 'Entrar en el gemelo ↗',
    'Where shops and installers meet to look after connected equipment. Every fault in one list, diagnosed and assigned to someone who can fix it.': 'Donde tiendas e instaladores se encuentran para cuidar el equipo conectado. Cada avería en una lista, diagnosticada y asignada a quien puede arreglarla.',
    'Open the incident desk ↗': 'Abrir la mesa de incidencias ↗',
    'The team of AI agents behind the work, in the open: a council you can question and a scoreboard of who did what today.': 'El equipo de agentes de IA detrás del trabajo, a la vista: un consejo al que puedes preguntar y un marcador de quién hizo qué hoy.',
    'Meet the council ↗': 'Conocer al consejo ↗',
    'Scoreboard ↗': 'Marcador ↗',
    'Not sure which one comes first? Describe the place and the moment you want to change. Five short answers, no budget question.': '¿No sabes por cuál empezar? Describe el lugar y el momento que quieres cambiar. Cinco respuestas cortas, sin pregunta de presupuesto.',
    'Write a pilot brief →': 'Escribir un piloto →',
    'Field cases · open to inspect': 'Casos de campo · se pueden inspeccionar',
    'Both are demonstrations, and both say so. Neither is presented as a customer deployment: no physical players are assigned and no audience figure is claimed.': 'Los dos son demostraciones, y los dos lo dicen. Ninguno se presenta como un despliegue de cliente: no hay reproductores físicos asignados ni se afirma una cifra de audiencia.',
    'Concept demo · built from public data': 'Demo de concepto · hecha con datos públicos',
    'A coffee shop, rebuilt as a twin.': 'Una cafetería, reconstruida como gemelo.',
    'The Starbucks at Passeig de Gràcia 103, operated in Spain by Alsea, modelled from a 360° capture and public information. Six wall screens and the till displays run playlists and background music inside the twin. Unplug a screen there and a real incident opens in Yokup.': 'El Starbucks de Passeig de Gràcia 103, operado en España por Alsea, modelado a partir de una captura 360° y de información pública. Seis pantallas de pared y las del mostrador llevan listas y música de fondo dentro del gemelo. Desenchufa una pantalla allí y se abre una incidencia real en Yokup.',
    'Shows': 'Muestra',
    'Twin, playlists, music and incident handling working together': 'Gemelo, listas, música e incidencias trabajando juntos',
    'Products': 'Productos',
    'Not claimed': 'No se afirma',
    'A commercial relationship with Starbucks or Alsea, or playback on their hardware': 'Una relación comercial con Starbucks o Alsea, ni reproducción en su hardware',
    'Open the store profile ↗': 'Abrir la ficha de la tienda ↗',
    'Prototype · no physical venue': 'Prototipo · sin local físico',
    'A café-bookshop where the shelf sells.': 'Una cafetería-librería donde la estantería vende.',
    'A fictional café-bookshop built to test one idea: every object in the room can be a surface. Six books and six records on the shelf are interactive and link out to where they can be bought or played, and an operations layer tracks nineteen items in the room.': 'Una cafetería-librería ficticia para probar una idea: cada objeto de la sala puede ser una superficie. Seis libros y seis discos de la estantería son interactivos y enlazan donde se pueden comprar o escuchar, y una capa de operaciones sigue diecinueve piezas de la sala.',
    'Interactive objects, a 3D room and an operations view in one model': 'Objetos interactivos, una sala 3D y una vista de operaciones en un solo modelo',
    'A real venue, assigned devices or live telemetry; item states are simulated': 'Un local real, equipos asignados o telemetría en vivo; los estados de las piezas están simulados',
    'Enter the Cafebrería ↗': 'Entrar en la Cafebrería ↗',
    'See it with your brand': 'Verlo con tu marca',
    'White label · live fitting': 'Marca blanca · prueba en vivo',
    'Type your website and the white-label desk drafts your logo, colours and typeface onto the products. Or try the fitting room first with three sample identities.': 'Escribe tu web y el escritorio de marca blanca propone tu logo, tus colores y tu letra sobre los productos. O prueba antes el probador con tres identidades de muestra.',
    'Your website': 'Tu web',
    'Dress it in my brand ↗': 'Vestirlo con mi marca ↗',
    'See it with my brand': 'Verlo con mi marca',
    'Fitting room': 'Probador',
    'Built-in sample': 'Muestra incluida',
    'Open the four products in this identity ↗': 'Abrir los cuatro productos con esta identidad ↗',
    'Open the deck ↗': 'Abrir la presentación ↗',
    'Lumbre Café, BRUMELLE and Frescaria are invented brands used to show the system. They do not represent any real company. The screen content in this mock is illustrative.': 'Lumbre Café, BRUMELLE y Frescaria son marcas inventadas para enseñar el sistema. No representan a ninguna empresa real. El contenido de esta maqueta es ilustrativo.',
    'Help (humans)': 'Ayuda (personas)',
    'MCP (agents)': 'MCP (agentes)',
    'Pilot brief': 'Piloto',
    'Spanish edition': 'Edición en español',
    'Read.': 'Leer.',
    'Draft.': 'Proponer.',
    'Wear.': 'Vestir.',
    'Copy brief': 'Copiar el encargo',
    'Share this configuration →': 'Compartir esta configuración →'
  };

  function skipped(node) {
    var el = node.nodeType === 1 ? node : node.parentElement;
    return !el || el.closest(SKIP);
  }

  function applyHtml(lang) {
    Object.keys(HTML).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (!originalHtml.has(el)) originalHtml.set(el, el.innerHTML);
      el.innerHTML = lang === 'es' ? HTML[id] : originalHtml.get(el);
    });
  }

  function walk(node, lang) {
    if (!node || skipped(node)) return;
    if (node.nodeType === 3) {
      if (!originalText.has(node)) originalText.set(node, node.nodeValue);
      var raw = originalText.get(node);
      var key = raw.trim();
      if (!Object.prototype.hasOwnProperty.call(ES, key)) return;
      var next = lang === 'es' ? ES[key] : key;
      node.nodeValue = raw.replace(key, next);
      return;
    }
    if (node.nodeType !== 1 || node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;
    if (HTML[node.id]) return;
    Array.prototype.forEach.call(node.childNodes, function (child) { walk(child, lang); });
  }

  function paint(lang) {
    lang = lang === 'es' ? 'es' : 'en';
    document.documentElement.lang = lang;
    applyHtml(lang);
    walk(document.body, lang);
    var toggle = document.getElementById('lang-toggle');
    if (toggle) {
      toggle.textContent = lang === 'es' ? 'EN' : 'ES';
      toggle.setAttribute('aria-pressed', lang === 'es' ? 'true' : 'false');
      toggle.setAttribute('aria-label', lang === 'es' ? 'Switch to English' : 'Ver en castellano');
      toggle.setAttribute('lang', lang === 'es' ? 'en' : 'es');
    }
    if (lang === 'es' && document.title.indexOf('six live products') !== -1) {
      document.title = 'Digital Signage AI — seis productos en vivo para espacios que responden';
    }
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent('ds-lang', { detail: { lang: lang } }));
  }

  function mount() {
    var right = document.querySelector('.frame-right');
    if (right && !document.getElementById('lang-toggle')) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'frame-btn';
      button.id = 'lang-toggle';
      button.addEventListener('click', function () {
        paint(document.documentElement.lang === 'es' ? 'en' : 'es');
      });
      right.insertBefore(button, right.firstChild);
    }
    var saved = 'en';
    try { saved = localStorage.getItem(KEY) === 'es' ? 'es' : 'en'; } catch (e) {}
    paint(saved);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
}());
