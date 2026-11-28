/* Vistas del catálogo: inicio, cocina (restaurante), búsqueda y detalle de plato */
(function () {
  var D = window.DACE;
  var STAR = D.icons.star;

  function dishCard(p) {
    return '<article class="dish">' +
      '<div class="dish-body">' +
      '<h3><button type="button" class="dish-link" data-dish="' + p.id + '">' + D.esc(p.n) + '</button></h3>' +
      '<p class="desc">' + D.esc(p.d) + '</p>' +
      '<div class="dish-meta"><span class="price">' + D.fmt(p.p) + '</span>' + (p.o ? '<span class="chip">' + D.esc(p.o) + '</span>' : '') + '</div></div>' +
      '<div class="dish-img">' + D.media('platos', p.id, p.c, p.n) +
      '<button type="button" class="add" data-add="' + p.id + '" aria-label="Añadir ' + D.esc(p.n) + ' al pedido">' + D.icons.plus + '</button></div>' +
      '</article>';
  }

  function storeCard(c) {
    return '<a class="store" href="#/cocina/' + c.id + '">' +
      D.media('categorias', c.id, c.id, 'Cocina de ' + c.pais, 'store-img') +
      '<div class="store-tag">' + D.esc(c.pais) + '</div>' +
      '<div class="store-body"><h3>' + D.esc(c.restaurante) + '</h3>' +
      '<p class="store-sub">' + D.esc(c.cocina) + '</p>' +
      '<div class="store-meta"><span class="rate">' + STAR + c.rating.toFixed(1) + ' <em>(' + c.resenas + ')</em></span>' +
      '<span>' + D.icons.clock + c.tiempo + '</span><span class="free">Envío gratis</span></div></div></a>';
  }

  /* ---------- Inicio ---------- */
  function home() {
    var pops = D.dishes.filter(function (p) { return p.pop; });
    var el = document.createElement('div');
    el.innerHTML =
      '<section class="hero"><div class="wrap hero-in">' +
      '<div class="hero-copy"><span class="pill">' + D.icons.clock + ' Entrega estimada 25–35 min</span>' +
      '<h1>Pide comida de<br>todo el mundo.</h1>' +
      '<p>Elige una cocina, añade tus platos y recíbelos en el escenario.</p>' +
      '<div class="hero-cta"><a class="btn brand lg" href="#cocinas" data-scroll="cocinas">Explorar cocinas ' + D.icons.arrow + '</a>' +
      '<a class="btn light lg" href="#populares" data-scroll="populares">Ver lo más pedido</a></div></div>' +
      '<div class="hero-art" aria-hidden="true">' +
      D.cats.slice(0, 3).map(function (c) { return D.media('categorias', c.id, c.id, '', 'hero-card hc-' + c.id); }).join('') +
      '</div></div></section>' +

      '<div class="wrap">' +
      '<section id="cocinas" class="block"><h2>Cocinas del mundo</h2>' +
      '<div class="cuisines" role="list">' + D.cats.map(function (c) {
        return '<a class="cuisine" role="listitem" href="#/cocina/' + c.id + '">' +
          D.media('categorias', c.id, c.id, '', 'cuisine-img') +
          '<strong>' + D.esc(c.nombre) + '</strong></a>';
      }).join('') + '</div></section>' +

      '<section id="populares" class="block"><h2>Lo más pedido hoy</h2>' +
      '<div class="dish-grid">' + pops.map(dishCard).join('') + '</div></section>' +

      '<section class="block"><h2>Restaurantes cerca de ti</h2>' +
      '<div class="store-grid">' + D.cats.map(storeCard).join('') + '</div></section></div>';
    return el;
  }

  /* ---------- Cocina / restaurante ---------- */
  function category(id) {
    var c = D.catById[id];
    if (!c) return null;
    var dishes = D.dishes.filter(function (p) { return p.c === id; });
    var secs = c.secciones.filter(function (s) { return dishes.some(function (p) { return p.s === s; }); });
    var texas = id === 'america';
    var el = document.createElement('div');
    el.className = 'cat-page' + (texas ? ' texas' : '');
    el.style.setProperty('--c1', c.c1);
    el.style.setProperty('--c2', c.c2);
    el.innerHTML =
      '<section class="cat-hero">' + D.media('categorias', c.id, c.id, 'Cocina de ' + c.pais, 'cat-cover') +
      '<div class="cat-shade"></div>' +
      '<div class="wrap cat-hero-in"><a class="back" href="#/">' + D.icons.back + ' Todas las cocinas</a>' +
      '<div class="cat-title">' + (texas ? '<span class="stars" aria-hidden="true">' + STAR + STAR + STAR + '</span>' : '') +
      '<span class="cat-country">' + D.esc(c.nombre) + '</span>' +
      '<h1>' + D.esc(c.restaurante) + '</h1><p>' + D.esc(c.lema) + '</p>' +
      '<div class="cat-meta"><span class="rate">' + STAR + c.rating.toFixed(1) + ' <em>(' + c.resenas + ')</em></span>' +
      '<span>' + D.icons.clock + c.tiempo + '</span><span>Envío gratis</span><span>' + D.esc(c.cocina) + '</span></div></div></div></section>' +
      '<nav class="sec-nav" aria-label="Secciones del menú"><div class="wrap sec-nav-in">' +
      secs.map(function (s, i) { return '<button type="button" class="' + (i ? '' : 'on') + '" data-sec="s' + i + '">' + D.esc(s) + '</button>'; }).join('') +
      '</div></nav>' +
      '<div class="wrap">' + secs.map(function (s, i) {
        return '<section class="menu-sec" id="s' + i + '"><h2>' + D.esc(s) + '</h2><div class="dish-grid">' +
          dishes.filter(function (p) { return p.s === s; }).map(dishCard).join('') + '</div></section>';
      }).join('') + '</div>';

    /* Navegación entre secciones + resaltado al desplazarse */
    var nav = el.querySelector('.sec-nav');
    var btns = el.querySelectorAll('.sec-nav button');
    nav.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var target = el.querySelector('#' + b.dataset.sec);
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    function spy() {
      var y = window.scrollY + parseFloat(getComputedStyle(document.documentElement).fontSize) * 9;
      var cur = 0;
      secs.forEach(function (_, i) { if (el.querySelector('#s' + i).offsetTop <= y) cur = i; });
      btns.forEach(function (b, i) {
        var on = i === cur;
        if (on && !b.classList.contains('on')) b.scrollIntoView({ inline: 'center', block: 'nearest' });
        b.classList.toggle('on', on);
      });
    }
    window.addEventListener('scroll', spy, { passive: true });
    el._cleanup = function () { window.removeEventListener('scroll', spy); };
    return el;
  }

  /* ---------- Búsqueda ---------- */
  function search(query) {
    var q = D.norm(query).trim();
    var el = document.createElement('div');
    var res = !q ? [] : D.dishes.filter(function (p) {
      var c = D.catById[p.c];
      return D.norm([p.n, p.d, p.o, p.s, c.nombre, c.pais, c.restaurante].join(' ')).indexOf(q) !== -1;
    });
    el.className = 'wrap search-page';
    el.innerHTML = '<h2 class="search-title">' + (res.length ? res.length + (res.length === 1 ? ' resultado' : ' resultados') + ' para “' + D.esc(query) + '”' : 'Sin resultados para “' + D.esc(query) + '”') + '</h2>' +
      (res.length ? '<div class="dish-grid">' + res.map(dishCard).join('') + '</div>'
        : '<div class="empty"><p>Prueba con otro plato o con un país: “pizza”, “Texas”, “Marruecos”…</p><a class="btn" href="#/">Ver todas las cocinas</a></div>');
    return el;
  }

  /* ---------- Detalle de plato ---------- */
  var modal = document.getElementById('dishModal');
  var modalFocus = null;

  function openDish(id) {
    var p = D.dishById[id]; if (!p) return;
    var c = D.catById[p.c];
    var qty = 1;
    modalFocus = document.activeElement;
    modal.innerHTML = '<div class="modal-card" style="--c1:' + c.c1 + ';--c2:' + c.c2 + '">' +
      '<button type="button" class="icon-btn modal-x" data-modal-close aria-label="Cerrar">' + D.icons.close + '</button>' +
      D.media('platos', p.id, p.c, p.n, 'modal-img') +
      '<div class="modal-body"><span class="chip">' + D.esc(c.restaurante) + (p.o ? ' · ' + D.esc(p.o) : '') + '</span>' +
      '<h2>' + D.esc(p.n) + '</h2><p>' + D.esc(p.d) + '</p><div class="modal-price">' + D.fmt(p.p) + '</div></div>' +
      '<div class="modal-foot"><div class="stepper big" role="group" aria-label="Cantidad">' +
      '<button type="button" data-q="-1" aria-label="Quitar uno">' + D.icons.minus + '</button><output id="mq">1</output>' +
      '<button type="button" data-q="1" aria-label="Añadir uno">' + D.icons.plus + '</button></div>' +
      '<button type="button" class="btn brand lg grow" id="mAdd">Añadir al pedido · <span id="mTot">' + D.fmt(p.p) + '</span></button></div></div>';
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    document.body.classList.add('lock');

    modal.onclick = function (e) {
      var b = e.target.closest('button');
      if (e.target === modal || (b && b.hasAttribute('data-modal-close'))) return closeDish();
      if (!b) return;
      if (b.dataset.q) {
        qty = Math.max(1, Math.min(99, qty + parseInt(b.dataset.q, 10)));
        modal.querySelector('#mq').textContent = qty;
        modal.querySelector('#mTot').textContent = D.fmt(p.p * qty);
      } else if (b.id === 'mAdd') {
        D.cart.add(p.id, qty); D.cart.bump(); closeDish();
        D.toast(qty + '× ' + p.n + ' añadido', 'Ver pedido', D.cart.open);
      }
    };
    modal.querySelector('.modal-x').focus();
  }
  function closeDish() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    if (!D.cart.isOpen()) document.body.classList.remove('lock');
    if (modalFocus && modalFocus.focus) modalFocus.focus();
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeDish();
  });

  /* ---------- Eventos globales del catálogo ---------- */
  document.addEventListener('click', function (e) {
    var add = e.target.closest('[data-add]');
    if (add) {
      var p = D.dishById[add.dataset.add];
      D.cart.add(p.id, 1); D.cart.bump();
      D.toast(p.n + ' añadido', 'Ver pedido', D.cart.open);
      return;
    }
    var dish = e.target.closest('[data-dish]');
    if (dish) return openDish(dish.dataset.dish);
    var sc = e.target.closest('[data-scroll]');
    if (sc) { e.preventDefault(); var t = document.getElementById(sc.dataset.scroll); if (t) t.scrollIntoView({ behavior: 'smooth' }); }
  });

  D.views = D.views || {};
  D.views.home = home;
  D.views.category = category;
  D.views.search = search;
})();
