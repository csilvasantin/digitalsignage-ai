/* brand.js — marca conmutable de digitalsignage.ai
 *
 * A diferencia del brand.js de clearchannel.tv, aqui NO se reescribe el DOM con
 * expresiones regulares: la marca viaja en atributos data-brand-* desde el HTML,
 * asi que cambiarla es asignar textos, no adivinar cadenas dentro del texto.
 * Conmutar: ?brand=<id> o el propio dominio.
 */
(function () {
  'use strict';

  var BRANDS = {
    neutral: {
      id: 'neutral',
      name: 'Digital Signage AI',
      wordmark: 'digitalsignage.ai',
      mark: '/assets/brand-mark.svg',
      tagline: 'The AI platform for spaces that respond',
      operator: null,
      origin: 'https://www.digitalsignage.ai'
    },
    admira: {
      id: 'admira',
      name: 'Admira Xperience',
      wordmark: 'admira.tv',
      mark: null,
      tagline: 'Espacios que responden',
      operator: 'Admira',
      origin: 'https://www.admira.tv'
    }
  };

  var host = String(window.location.hostname || '').toLowerCase();
  var forced = new URLSearchParams(window.location.search).get('brand');
  var id = (forced && BRANDS[forced]) ? forced
         : (/(^|\.)admira\.tv$/.test(host) ? 'admira' : 'neutral');
  var brand = BRANDS[id];

  document.documentElement.dataset.brand = brand.id;
  window.DSAI_BRAND = brand;

  function apply() {
    document.querySelectorAll('[data-brand-name]').forEach(function (el) {
      el.textContent = brand.name;
    });
    document.querySelectorAll('[data-brand-wordmark]').forEach(function (el) {
      el.innerHTML = '';
      var parts = brand.wordmark.split(/(\.[a-z]+)$/);
      el.appendChild(document.createTextNode(parts[0]));
      if (parts[1]) {
        var tld = document.createElement('em');
        tld.textContent = parts[1];
        el.appendChild(tld);
      }
    });
    document.querySelectorAll('[data-brand-mark]').forEach(function (el) {
      if (!brand.mark) { el.hidden = true; return; }
      el.hidden = false;
      el.setAttribute('src', brand.mark);
    });
    document.querySelectorAll('[data-brand-operator]').forEach(function (el) {
      // sin operador declarado, la fila de "operated by" simplemente no existe
      if (!brand.operator) { el.hidden = true; return; }
      el.hidden = false;
      var slot = el.querySelector('[data-brand-operator-name]');
      if (slot) slot.textContent = brand.operator;
    });
    document.querySelectorAll('[data-brand-id]').forEach(function (el) {
      el.textContent = brand.id;
    });
    document.querySelectorAll('[data-brand-operator-value]').forEach(function (el) {
      el.textContent = brand.operator || 'No operator line';
    });
    document.querySelectorAll('[data-brand-origin]').forEach(function (el) {
      el.textContent = brand.origin.replace(/^https?:\/\//, '');
      el.setAttribute('href', brand.origin + window.location.pathname);
    });
    document.querySelectorAll('[data-brand-choice]').forEach(function (el) {
      if (el.getAttribute('data-brand-choice') === brand.id) {
        el.setAttribute('aria-current', 'true');
      } else {
        el.removeAttribute('aria-current');
      }
    });
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', brand.origin + window.location.pathname);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
