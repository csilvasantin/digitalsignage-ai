/* Asas de los paneles Opciones, Avanzado y Experto.
   Ratón, dedo y teclado. El tamaño se recuerda en este navegador. */
(function () {
  'use strict';
  var KEY = 'digitalsignage_frame_sizes_v1';
  var panels = {
    left: { id: 'panel-options', css: '--ds-w-left', def: 340 },
    right: { id: 'panel-advanced', css: '--ds-w-right', def: 380 },
    bottom: { id: 'panel-expert', css: '--ds-h-bottom', def: 320 }
  };

  function maxOf(side) {
    if (side === 'bottom') return Math.max(160, window.innerHeight - 122);
    if (window.innerWidth <= 720) return Math.max(220, window.innerWidth * 0.92);
    return Math.max(220, Math.min(760, window.innerWidth * 0.6));
  }
  function minOf(side) { return side === 'bottom' ? 120 : 220; }
  function clamp(side, px) {
    return Math.round(Math.max(minOf(side), Math.min(maxOf(side), px)));
  }
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function save(sizes) {
    try { localStorage.setItem(KEY, JSON.stringify(sizes)); } catch (e) {}
  }
  var sizes = load();

  function apply(side) {
    var spec = panels[side];
    var px = sizes[side] == null ? spec.def : clamp(side, sizes[side]);
    document.documentElement.style.setProperty(spec.css, px + 'px');
    var handle = document.getElementById('ds-resize-' + side);
    if (!handle) return;
    handle.setAttribute('aria-valuenow', String(px));
    handle.setAttribute('aria-valuemin', String(minOf(side)));
    handle.setAttribute('aria-valuemax', String(Math.round(maxOf(side))));
  }
  function setSize(side, px) {
    sizes[side] = clamp(side, px);
    save(sizes);
    apply(side);
  }
  function reset(side) {
    sizes[side] = null;
    save(sizes);
    apply(side);
  }
  function syncOpen() {
    Object.keys(panels).forEach(function (side) {
      var el = document.getElementById(panels[side].id);
      document.documentElement.classList.toggle('ds-open-' + side, !!(el && !el.hasAttribute('hidden')));
    });
  }

  function makeHandle(side) {
    var handle = document.createElement('div');
    handle.id = 'ds-resize-' + side;
    handle.className = 'ds-resize ds-resize-' + side;
    handle.setAttribute('role', 'separator');
    handle.tabIndex = 0;
    handle.setAttribute('aria-orientation', side === 'bottom' ? 'horizontal' : 'vertical');
    handle.setAttribute('aria-label', side === 'left' ? 'Resize options panel' : side === 'right' ? 'Resize advanced panel' : 'Resize expert panel');
    handle.addEventListener('dblclick', function () { reset(side); });
    handle.addEventListener('keydown', function (event) {
      var step = event.shiftKey ? 64 : 16;
      var current = sizes[side] == null ? panels[side].def : sizes[side];
      if (event.key === 'Enter') { reset(side); event.preventDefault(); return; }
      if (event.key === 'Home') { setSize(side, minOf(side)); event.preventDefault(); return; }
      if (event.key === 'End') { setSize(side, maxOf(side)); event.preventDefault(); return; }
      var dir = 0;
      if (side === 'left' && event.key === 'ArrowRight') dir = 1;
      if (side === 'left' && event.key === 'ArrowLeft') dir = -1;
      if (side === 'right' && event.key === 'ArrowLeft') dir = 1;
      if (side === 'right' && event.key === 'ArrowRight') dir = -1;
      if (side === 'bottom' && event.key === 'ArrowUp') dir = 1;
      if (side === 'bottom' && event.key === 'ArrowDown') dir = -1;
      if (!dir) return;
      setSize(side, current + dir * step);
      event.preventDefault();
    });
    handle.addEventListener('pointerdown', function (event) {
      if (event.button != null && event.button !== 0) return;
      handle.setPointerCapture(event.pointerId);
      document.documentElement.classList.add('ds-resizing');
      var start = side === 'bottom' ? event.clientY : event.clientX;
      var base = sizes[side] == null ? panels[side].def : sizes[side];
      function move(ev) {
        var delta = side === 'bottom' ? start - ev.clientY : side === 'left' ? ev.clientX - start : start - ev.clientX;
        setSize(side, base + delta);
      }
      function up() {
        document.documentElement.classList.remove('ds-resizing');
        handle.removeEventListener('pointermove', move);
        handle.removeEventListener('pointerup', up);
        handle.removeEventListener('pointercancel', up);
      }
      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', up);
      handle.addEventListener('pointercancel', up);
      event.preventDefault();
    });
    document.body.appendChild(handle);
    apply(side);
  }

  if (!document.getElementById('panel-options')) return;
  Object.keys(panels).forEach(makeHandle);
  syncOpen();
  var observer = new MutationObserver(syncOpen);
  Object.keys(panels).forEach(function (side) {
    var el = document.getElementById(panels[side].id);
    if (el) observer.observe(el, { attributes: true, attributeFilter: ['hidden'] });
  });
  window.addEventListener('resize', function () {
    Object.keys(panels).forEach(apply);
  });
}());
