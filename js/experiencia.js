/* Pantalla de entrega: la información aparece poco a poco y en orden.
   Se avanza con el botón «Siguiente», con la barra espaciadora o con las flechas.
   Orden: 1 País y bandera · 2 Mapa · 3 Baile · 4 Vestimenta · 5 Fotos de la época · 6 Instrumentos */
(function () {
  var D = window.DACE;
  D.danzas = window.DACE_DANZAS;

  /* Foto local; si no existe, foto en línea (si hay); si tampoco, queda el marco con el pie */
  D.phFallback = function (img) {
    if (!img.dataset.t && img.dataset.url) { img.dataset.t = '1'; img.src = img.dataset.url; }
    else img.remove();
  };

  var ORDEN = ['pais', 'mapa', 'baile', 'ropa', 'fotos', 'musica'];
  var TITULOS = { pais: 'El país', mapa: 'Dónde está', baile: 'Nuestro baile', ropa: 'Vestimenta tradicional', fotos: 'Fotos de la época', musica: 'Instrumentos de la época' };

  function body(k, d) {
    var h = '<h3 class="ex-h">' + TITULOS[k] + '</h3>';
    if (k === 'pais') {
      return h + '<div class="ex-flag">' + D.flag(d.bandera) + '</div><div class="ex-country">' + D.esc(d.pais) + '</div><div class="ex-zone">' + D.esc(d.zona) + '</div>' +
        (d.nota ? '<p class="ex-note">' + D.esc(d.nota) + '</p>' : '');
    }
    if (k === 'mapa') return h + '<div class="ex-map">' + D.mapSVG(d.mapa) + '</div>';
    if (k === 'baile') {
      return h + '<div class="dance-name">' + D.esc(d.baile.nombre) + '</div>' +
        '<div class="chips"><span class="chip">' + D.esc(d.baile.tipo) + '</span><span class="chip era">' + D.esc(d.baile.epoca) + '</span></div>' +
        '<p class="dance-txt">' + D.esc(d.baile.resumen) + '</p><p class="dance-fun"><b>¿Sabías que…?</b> ' + D.esc(d.baile.curiosidad) + '</p>';
    }
    if (k === 'ropa') {
      return h + d.vestimenta.map(function (g) {
        return '<div class="cl-group"><h4>' + D.esc(g.titulo) + '</h4><ul>' + g.items.map(function (it) {
          return '<li><span class="cl-ico">' + D.ico(it.i, it.c) + '</span><span><b>' + D.esc(it.n) + '</b><small>' + D.esc(it.d) + '</small></span></li>';
        }).join('') + '</ul></div>';
      }).join('');
    }
    if (k === 'fotos') {
      return h + '<div class="photos">' + d.fotos.map(function (f, i) {
        return '<figure class="ph ph' + i + '"><div class="ph-img"><div class="ph-fallback"><span>Fotografía de época</span><b>' + D.esc(f.pie) + '</b></div>' +
          '<img src="' + f.src + '"' + (f.url ? ' data-url="' + D.esc(f.url) + '"' : '') + ' alt="' + D.esc(f.pie) + '" loading="lazy" onerror="DACE.phFallback(this)"></div>' +
          '<figcaption><b>' + D.esc(f.pie) + '</b><small>' + D.esc(f.anio) + (f.autor ? ' · ' + D.esc(f.autor) : '') + '</small></figcaption></figure>';
      }).join('') + '</div>';
    }
    return h + '<ul class="inst">' + d.instrumentos.map(function (it) {
      return '<li><span class="in-ico">' + D.ico(it.i) + '</span><span class="in-txt"><b>' + D.esc(it.n) + '</b><small>' + D.esc(it.d) + '</small><em>' + D.esc(it.epoca) + '</em></span></li>';
    }).join('') + '</ul>';
  }

  function marcarEntregado(catId) {
    var o = D.order.load();
    if (!o) return;
    o.entregados = o.entregados || {};
    o.entregados[catId] = true;
    D.order.save(o);
  }

  function experiencia(catId) {
    var d = D.danzas[catId];
    if (!d || !D.order.load()) return null;
    var order = D.order.load();
    var digits = String(order.id).replace(/\D/g, '');
    var shown = 0, autoTimer = null;

    var el = document.createElement('div');
    el.className = 'ex';
    el.style.setProperty('--c1', D.catById[catId].c1);
    el.style.setProperty('--c2', D.catById[catId].c2);
    el.innerHTML =
      '<div class="wrap ex-in">' +
      '<header class="ex-top"><div><span class="ex-badge">' + D.icons.check + ' Código confirmado · ' + d.codigo + '-' + digits + '</span>' +
      '<h1>¡Tu pedido de ' + D.esc(d.pais) + ' ha llegado!</h1></div></header>' +
      '<div class="ex-grid">' + ORDEN.map(function (k, i) {
        return '<section class="ex-card k-' + k + '" data-i="' + i + '" aria-label="' + TITULOS[k] + '">' +
          '<div class="ghost" aria-hidden="true"><span>' + (i + 1) + '</span><small>?</small></div><div class="ex-body">' + body(k, d) + '</div></section>';
      }).join('') + '</div></div>' +
      '<div class="ex-bar"><div class="wrap ex-bar-in">' +
      '<button type="button" class="btn light" data-act="back" aria-label="Volver al pedido"><span class="ic-d">' + D.icons.back + '</span><span class="ic-m">' + D.icons.close + '</span><span class="lbl">Volver al pedido</span></button>' +
      '<div class="dots" aria-hidden="true">' + ORDEN.map(function () { return '<i></i>'; }).join('') + '</div>' +
      '<button type="button" class="btn light" data-act="prev" aria-label="Paso anterior">' + D.icons.back + '</button>' +
      '<button type="button" class="btn brand lg" data-act="next"></button>' +
      '<button type="button" class="btn light" data-act="auto" aria-pressed="false">Automático</button>' +
      '</div></div>';

    var cards = el.querySelectorAll('.ex-card'), dots = el.querySelectorAll('.dots i');
    var nextBtn = el.querySelector('[data-act=next]'), prevBtn = el.querySelector('[data-act=prev]'), autoBtn = el.querySelector('[data-act=auto]');

    function paint() {
      cards.forEach(function (c, i) { c.classList.toggle('on', i < shown); c.classList.toggle('now', i === shown - 1); });
      dots.forEach(function (x, i) { x.classList.toggle('on', i < shown); });
      prevBtn.disabled = shown === 0;
      nextBtn.innerHTML = shown >= ORDEN.length ? 'Terminar ' + D.icons.check : (shown === 0 ? 'Empezar ' : 'Siguiente ') + D.icons.arrow;
      if (shown > 0) cards[shown - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    function finish() { stopAuto(); marcarEntregado(catId); D.go('#/seguimiento'); }
    function next() { if (shown >= ORDEN.length) return finish(); shown++; paint(); if (shown >= ORDEN.length) stopAuto(); }
    function prev() { if (shown > 0) { shown--; paint(); } }
    function stopAuto() { clearInterval(autoTimer); autoTimer = null; autoBtn.setAttribute('aria-pressed', 'false'); autoBtn.classList.remove('active'); }
    function toggleAuto() {
      if (autoTimer) return stopAuto();
      autoBtn.setAttribute('aria-pressed', 'true'); autoBtn.classList.add('active');
      if (shown === 0) next();
      autoTimer = setInterval(function () { if (shown < ORDEN.length) next(); else stopAuto(); }, (D.CONFIG.experiencia.autoSegundos) * 1000);
    }

    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b) return;
      var a = b.dataset.act;
      if (a === 'next') next(); else if (a === 'prev') prev(); else if (a === 'auto') toggleAuto();
      else if (a === 'back') { stopAuto(); marcarEntregado(catId); D.go('#/seguimiento'); }
    });

    function onKey(e) {
      var tag = (document.activeElement || {}).tagName;
      if (tag === 'INPUT') return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
      else if ((e.key === ' ' || e.key === 'Enter') && tag !== 'BUTTON') { e.preventDefault(); next(); }
    }
    document.addEventListener('keydown', onKey);
    el._cleanup = function () { stopAuto(); document.removeEventListener('keydown', onKey); };
    paint();
    return el;
  }

  D.views.experiencia = experiencia;
})();
