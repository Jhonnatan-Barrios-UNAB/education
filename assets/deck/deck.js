/**
 * Reproductor de presentaciones.
 * Espera en la página:
 *   <body data-deck="id-del-recurso" [data-fillable]>
 *   <div class="stage-wrap"><div class="stage"> <section>…</section> … </div></div>
 * Construye la barra de control, la vista general y, si la presentación es
 * una plantilla (data-fillable), el modo para llenarla y guardar respuestas
 * en este navegador.
 */
(function () {
  'use strict';

  var body = document.body;
  var deckId = body.getAttribute('data-deck') || 'deck';
  var fillable = body.hasAttribute('data-fillable');
  var stage = document.querySelector('.stage');
  var wrap = document.querySelector('.stage-wrap');
  var slides = Array.prototype.slice.call(stage.children).filter(function (n) { return n.tagName === 'SECTION'; });
  var total = slides.length;
  var current = 0;
  var STORE = 'edu-deck:' + deckId;

  /* ---------- almacenamiento seguro ---------- */
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) { } }
  };

  /* ---------- interfaz ---------- */
  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    for (var k in attrs) { if (attrs.hasOwnProperty(k)) n.setAttribute(k, attrs[k]); }
    if (html != null) n.innerHTML = html;
    return n;
  }
  var I = {
    back: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    prev: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    next: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
    grid: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    full: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    print: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/></svg>',
    pen: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    erase: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>'
  };

  var title = document.title;
  var subtitle = body.getAttribute('data-course') || '';
  var bar = el('nav', { 'class': 'deck-bar', 'aria-label': 'Controles de la presentación' });
  bar.innerHTML =
    '<a class="deck-btn" href="../../#catalogo" title="Volver al catálogo">' + I.back + '<span class="lbl">Catálogo</span></a>' +
    '<div class="title">' + escapeHTML(title) + (subtitle ? '<small>' + escapeHTML(subtitle) + '</small>' : '') + '</div>' +
    (fillable ? '<button class="deck-btn" type="button" data-act="edit" aria-pressed="false" title="Escribir en la plantilla (E)">' + I.pen + '<span class="lbl">Llenar</span></button>' +
      '<button class="deck-btn" type="button" data-act="clear" title="Borrar mis respuestas">' + I.erase + '<span class="lbl">Borrar</span></button>' : '') +
    '<button class="deck-btn" type="button" data-act="print" title="' + (fillable ? 'Guardar como PDF para entregar' : 'Imprimir o guardar en PDF') + '">' + I.print + '<span class="lbl">PDF</span></button>' +
    '<button class="deck-btn" type="button" data-act="grid" aria-pressed="false" title="Ver todas las diapositivas (G)">' + I.grid + '</button>' +
    '<button class="deck-btn" type="button" data-act="prev" title="Anterior (←)">' + I.prev + '</button>' +
    '<span class="deck-count" aria-live="polite"></span>' +
    '<button class="deck-btn" type="button" data-act="next" title="Siguiente (→)">' + I.next + '</button>' +
    '<button class="deck-btn" type="button" data-act="full" title="Pantalla completa (F)">' + I.full + '</button>';
  body.appendChild(bar);

  var progress = el('div', { 'class': 'deck-progress', 'aria-hidden': 'true' });
  body.appendChild(progress);
  var tapPrev = el('button', { 'class': 'tap prev', 'type': 'button', 'aria-label': 'Diapositiva anterior', 'tabindex': '-1' });
  var tapNext = el('button', { 'class': 'tap next', 'type': 'button', 'aria-label': 'Diapositiva siguiente', 'tabindex': '-1' });
  body.appendChild(tapPrev); body.appendChild(tapNext);
  var toastEl = el('div', { 'class': 'deck-toast', 'role': 'status' });
  body.appendChild(toastEl);
  var note = el('div', { 'class': 'edit-note' }, 'Toca los espacios resaltados para escribir. Se guarda solo en este navegador.');
  body.appendChild(note);

  var countEl = bar.querySelector('.deck-count');
  var btnPrev = bar.querySelector('[data-act="prev"]');
  var btnNext = bar.querySelector('[data-act="next"]');
  var btnGrid = bar.querySelector('[data-act="grid"]');
  var btnEdit = bar.querySelector('[data-act="edit"]');

  function escapeHTML(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var toastT;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
  }

  /* ---------- escala ---------- */
  function fit() {
    var w = wrap.clientWidth, h = wrap.clientHeight;
    var s = Math.min(w / 1920, h / 1080);
    stage.style.transform = 'translate(-50%,-50%) scale(' + (s * 0.98) + ')';
  }
  window.addEventListener('resize', fit);

  /* ---------- navegación ---------- */
  function go(i, fromHash) {
    i = Math.max(0, Math.min(total - 1, i));
    slides[current].classList.remove('is-active');
    slides[current].setAttribute('aria-hidden', 'true');
    current = i;
    slides[current].classList.add('is-active');
    slides[current].removeAttribute('aria-hidden');
    countEl.textContent = (current + 1) + ' / ' + total;
    progress.style.width = ((current + 1) / total * 100) + '%';
    btnPrev.disabled = current === 0;
    btnNext.disabled = current === total - 1;
    if (!fromHash) {
      try { history.replaceState(null, '', '#' + (current + 1)); } catch (e) { }
    }
  }
  function next() { go(current + 1); }
  function prev() { go(current - 1); }
  function fromHash() {
    var n = parseInt((location.hash || '').replace('#', ''), 10);
    return isNaN(n) ? 0 : n - 1;
  }
  window.addEventListener('hashchange', function () { go(fromHash(), true); });

  tapPrev.addEventListener('click', prev);
  tapNext.addEventListener('click', next);

  /* gestos táctiles */
  var tx = null, ty = null;
  wrap.addEventListener('touchstart', function (e) { if (e.touches.length === 1) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; } }, { passive: true });
  wrap.addEventListener('touchend', function (e) {
    if (tx == null || body.classList.contains('is-editing')) return;
    var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) { dx < 0 ? next() : prev(); }
    tx = ty = null;
  });

  /* ---------- vista general ---------- */
  var overview = el('div', { 'class': 'overview', 'role': 'dialog', 'aria-label': 'Todas las diapositivas' });
  var ovGrid = el('div', { 'class': 'overview-grid' });
  overview.appendChild(ovGrid);
  body.appendChild(overview);
  var ovBuilt = false;
  function buildOverview() {
    slides.forEach(function (s, i) {
      var b = el('button', { 'class': 'thumb', 'type': 'button', 'aria-label': 'Ir a la diapositiva ' + (i + 1) });
      var mini = el('div', { 'class': 'mini' });
      var clone = s.cloneNode(true);
      clone.removeAttribute('id');
      clone.classList.remove('is-active');
      clone.removeAttribute('aria-hidden');
      Array.prototype.forEach.call(clone.querySelectorAll('[id]'), function (n) { n.removeAttribute('id'); });
      Array.prototype.forEach.call(clone.querySelectorAll('[contenteditable]'), function (n) { n.removeAttribute('contenteditable'); });
      mini.appendChild(clone);
      b.appendChild(mini);
      b.appendChild(el('span', { 'class': 'n' }, String(i + 1)));
      b.addEventListener('click', function () { closeOverview(); go(i); });
      ovGrid.appendChild(b);
    });
    ovBuilt = true;
  }
  function scaleThumbs() {
    Array.prototype.forEach.call(ovGrid.querySelectorAll('.thumb'), function (t) {
      t.firstChild.style.transform = 'scale(' + (t.clientWidth / 1920) + ')';
    });
  }
  function openOverview() {
    if (!ovBuilt) buildOverview();
    Array.prototype.forEach.call(ovGrid.children, function (t, i) { t.classList.toggle('is-current', i === current); });
    overview.classList.add('is-open');
    btnGrid.setAttribute('aria-pressed', 'true');
    requestAnimationFrame(function () {
      scaleThumbs();
      var cur = ovGrid.children[current];
      if (cur) { cur.focus(); cur.scrollIntoView({ block: 'center' }); }
    });
  }
  function closeOverview() {
    overview.classList.remove('is-open');
    btnGrid.setAttribute('aria-pressed', 'false');
  }
  window.addEventListener('resize', function () { if (overview.classList.contains('is-open')) scaleThumbs(); });

  /* ---------- pantalla completa ---------- */
  function toggleFull() {
    var d = document;
    try {
      if (!d.fullscreenElement && !d.webkitFullscreenElement) {
        var r = d.documentElement;
        (r.requestFullscreen || r.webkitRequestFullscreen).call(r);
      } else {
        (d.exitFullscreen || d.webkitExitFullscreen).call(d);
      }
    } catch (e) { toast('Tu navegador no permite pantalla completa aquí'); }
  }

  /* ---------- modo plantilla ---------- */
  var fields = [];
  var answers = {};
  if (fillable) {
    answers = store.get(STORE) || {};
    var PH = /\[[^\]\n]{0,160}\]/g;
    slides.forEach(function (s, si) {
      var idx = 0;
      /* Cada indicación entre corchetes se vuelve un campo propio,
         así la etiqueta que la acompaña no se puede borrar por accidente. */
      var walker = document.createTreeWalker(s, NodeFilter.SHOW_TEXT, null, false);
      var texts = []; var t;
      while ((t = walker.nextNode())) { PH.lastIndex = 0; if (PH.test(t.nodeValue)) texts.push(t); }
      texts.forEach(function (node) {
        var str = node.nodeValue, last = 0, m;
        var frag = document.createDocumentFragment();
        PH.lastIndex = 0;
        while ((m = PH.exec(str))) {
          if (m.index > last) frag.appendChild(document.createTextNode(str.slice(last, m.index)));
          var key = (s.id || ('s' + si)) + ':' + (idx++);
          var f = document.createElement('span');
          f.className = 'fill';
          f.setAttribute('data-fill', '');
          f.setAttribute('data-key', key);
          f.setAttribute('data-original', m[0]);
          if (typeof answers[key] === 'string' && answers[key] !== '') { f.textContent = answers[key]; f.classList.add('is-filled'); }
          else f.textContent = m[0];
          frag.appendChild(f);
          fields.push(f);
          last = m.index + m[0].length;
        }
        if (last < str.length) frag.appendChild(document.createTextNode(str.slice(last)));
        node.parentNode.replaceChild(frag, node);
      });
    });

    var style = document.createElement('style');
    style.textContent =
      '.stage .fill{display:inline;border-radius:6px;transition:background .15s}' +
      '.stage .fill.is-filled{white-space:pre-wrap;font-style:normal;color:inherit;font-weight:600}' +
      'body.is-editing .stage .fill{background:rgba(182,240,60,.28);cursor:text;padding:0 .15em}' +
      'body.is-editing .stage .fill:focus{outline:3px solid #B6F03C;outline-offset:2px;background:#fff;color:#14123A}' +
      '.stage .fill.is-typing{display:inline-block;min-width:4em;min-height:1.2em}' +
      '@media print{.stage .fill{background:none!important;padding:0!important}}';
    document.head.appendChild(style);

    var saveT;
    stage.addEventListener('input', function (e) {
      var n = e.target.closest('[data-fill]');
      if (!n) return;
      answers[n.getAttribute('data-key')] = n.innerText.replace(/\n$/, '');
      n.classList.add('is-filled');
      clearTimeout(saveT); saveT = setTimeout(save, 400);
    });
    stage.addEventListener('focusin', function (e) {
      var n = e.target.closest('[data-fill]');
      if (!n || n.classList.contains('is-filled')) return;
      /* La indicación entre corchetes se quita al entrar y vuelve si se deja vacío */
      n.textContent = '';
      n.classList.add('is-typing');
    });
    stage.addEventListener('focusout', function (e) {
      var n = e.target.closest('[data-fill]');
      if (!n) return;
      n.classList.remove('is-typing');
      if (!n.innerText.trim()) {
        n.textContent = n.getAttribute('data-original');
        n.classList.remove('is-filled');
        delete answers[n.getAttribute('data-key')];
        save();
      }
    });
    stage.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && e.target.closest('[data-fill]')) { e.target.blur(); e.stopPropagation(); }
    });
  }
  function save() {
    if (!store.set(STORE, answers)) toast('No se pudo guardar en este navegador');
  }
  var noteT;
  function setEditing(on) {
    body.classList.toggle('is-editing', on);
    if (btnEdit) btnEdit.setAttribute('aria-pressed', on ? 'true' : 'false');
    fields.forEach(function (n) {
      if (on) { n.setAttribute('contenteditable', 'true'); n.setAttribute('spellcheck', 'true'); }
      else n.removeAttribute('contenteditable');
    });
    clearTimeout(noteT);
    if (on) { note.classList.add('show'); noteT = setTimeout(function () { note.classList.remove('show'); }, 5000); }
    else note.classList.remove('show');
  }
  function clearAnswers() {
    if (!window.confirm('¿Borrar todo lo que escribiste en esta plantilla?')) return;
    answers = {};
    store.del(STORE);
    fields.forEach(function (n) { n.textContent = n.getAttribute('data-original'); n.classList.remove('is-filled'); });
    ovBuilt = false; ovGrid.innerHTML = '';
    toast('Respuestas borradas');
  }

  /* ---------- botones y teclado ---------- */
  bar.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (!b) return;
    var a = b.getAttribute('data-act');
    if (a === 'prev') prev();
    else if (a === 'next') next();
    else if (a === 'grid') { overview.classList.contains('is-open') ? closeOverview() : openOverview(); }
    else if (a === 'full') toggleFull();
    else if (a === 'print') { closeOverview(); window.print(); }
    else if (a === 'edit') setEditing(!body.classList.contains('is-editing'));
    else if (a === 'clear') clearAnswers();
  });

  document.addEventListener('keydown', function (e) {
    if (e.target.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key;
    if (overview.classList.contains('is-open')) {
      if (k === 'Escape' || k === 'g' || k === 'G') { e.preventDefault(); closeOverview(); }
      return;
    }
    if (k === 'ArrowRight' || k === 'PageDown' || k === ' ' || k === 'ArrowDown') { e.preventDefault(); next(); }
    else if (k === 'ArrowLeft' || k === 'PageUp' || k === 'ArrowUp') { e.preventDefault(); prev(); }
    else if (k === 'Home') { e.preventDefault(); go(0); }
    else if (k === 'End') { e.preventDefault(); go(total - 1); }
    else if (k === 'f' || k === 'F') toggleFull();
    else if (k === 'g' || k === 'G') openOverview();
    else if ((k === 'e' || k === 'E') && fillable) setEditing(!body.classList.contains('is-editing'));
  });

  /* ---------- inicio ---------- */
  slides.forEach(function (s) { s.setAttribute('aria-hidden', 'true'); s.setAttribute('role', 'group'); s.setAttribute('aria-roledescription', 'diapositiva'); });
  fit();
  go(fromHash(), true);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();
