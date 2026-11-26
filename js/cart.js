/* Estado del carrito + panel lateral */
(function () {
  var D = window.DACE;
  var KEY = 'dace-eats-cart';
  var items = {}; // { idPlato: cantidad }
  var listeners = [];

  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    Object.keys(saved).forEach(function (id) {
      if (D.dishById[id] && saved[id] > 0) items[id] = Math.min(99, saved[id] | 0);
    });
  } catch (e) { /* sin almacenamiento: el carrito vive en memoria */ }

  function persist() { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {} }
  function emit() { persist(); listeners.forEach(function (fn) { fn(); }); }

  var cart = (D.cart = {
    subscribe: function (fn) { listeners.push(fn); },
    unsubscribe: function (fn) { listeners = listeners.filter(function (f) { return f !== fn; }); },
    qty: function (id) { return items[id] || 0; },
    count: function () { return Object.keys(items).reduce(function (n, id) { return n + items[id]; }, 0); },
    add: function (id, n) { items[id] = Math.min(99, (items[id] || 0) + (n || 1)); emit(); },
    set: function (id, n) { if (n <= 0) delete items[id]; else items[id] = Math.min(99, n); emit(); },
    remove: function (id) { delete items[id]; emit(); },
    clear: function () { items = {}; emit(); },
    lines: function () {
      return D.dishes.filter(function (p) { return items[p.id]; })
        .map(function (p) { return { dish: p, qty: items[p.id], total: p.p * items[p.id] }; });
    },
    /* Agrupado por cocina de origen, en el orden del catálogo */
    groups: function () {
      var lines = cart.lines();
      return D.cats.map(function (c) {
        return { cat: c, lines: lines.filter(function (l) { return l.dish.c === c.id; }) };
      }).filter(function (g) { return g.lines.length; });
    },
    subtotal: function () { return Math.round(cart.lines().reduce(function (s, l) { return s + l.total; }, 0) * 100) / 100; },
    fee: function () { return cart.count() ? D.CONFIG.tarifaServicio : 0; },
    total: function () { return Math.round((cart.subtotal() + cart.fee()) * 100) / 100; }
  });

  /* ---------- Panel del carrito ---------- */
  var drawer = document.getElementById('cart');
  var scrim = document.getElementById('scrim');
  var cartBtn = document.getElementById('cartBtn');
  var lastFocus = null;

  function render() {
    var groups = cart.groups();
    var body;
    if (!groups.length) {
      body = '<div class="cart-empty"><div class="cart-empty-ico">' + D.icons.bike + '</div>' +
        '<h3>Tu pedido está vacío</h3><p>Elige una cocina del mundo y añade tus platos favoritos.</p>' +
        '<button class="btn" type="button" data-close-cart data-go="#/">Explorar cocinas</button></div>';
    } else {
      body = '<div class="cart-body">' + groups.map(function (g) {
        return '<section class="cart-group"><header><span class="mono" style="--c1:' + g.cat.c1 + ';--c2:' + g.cat.c2 + '">' + g.cat.mono + '</span>' +
          '<div><h4>' + D.esc(g.cat.restaurante) + '</h4><small>Cocina de ' + D.esc(g.cat.pais) + '</small></div></header>' +
          g.lines.map(function (l) {
            var p = l.dish;
            return '<div class="cart-line">' + D.media('platos', p.id, p.c, p.n, 'thumb') +
              '<div class="cart-info"><strong>' + D.esc(p.n) + '</strong><span>' + D.fmt(l.total) + '</span></div>' +
              '<div class="stepper" role="group" aria-label="Cantidad de ' + D.esc(p.n) + '">' +
              '<button type="button" data-dec="' + p.id + '" aria-label="' + (l.qty === 1 ? 'Eliminar ' : 'Quitar uno de ') + D.esc(p.n) + '">' + (l.qty === 1 ? D.icons.trash : D.icons.minus) + '</button>' +
              '<output>' + l.qty + '</output>' +
              '<button type="button" data-inc="' + p.id + '" aria-label="Añadir uno más de ' + D.esc(p.n) + '">' + D.icons.plus + '</button></div></div>';
          }).join('') + '</section>';
      }).join('') + '</div>' +
        '<footer class="cart-foot">' +
        '<dl class="totals"><div><dt>Subtotal</dt><dd>' + D.fmt(cart.subtotal()) + '</dd></div>' +
        '<div><dt>Envío</dt><dd class="free">Gratis</dd></div>' +
        '<div><dt>Tarifa de servicio</dt><dd>' + D.fmt(cart.fee()) + '</dd></div>' +
        '<div class="grand"><dt>Total</dt><dd>' + D.fmt(cart.total()) + '</dd></div></dl>' +
        '<button class="btn brand block lg" type="button" data-checkout>Finalizar pedido · ' + D.fmt(cart.total()) + '</button>' +
        '<button class="btn light block" type="button" data-close-cart>Seguir comprando</button></footer>';
    }
    drawer.innerHTML = '<header class="drawer-head"><div><h2 id="cartTitle">Tu pedido</h2><small>' +
      cart.count() + (cart.count() === 1 ? ' plato' : ' platos') + ' · Entrega en ' + D.esc(D.CONFIG.destino) + '</small></div>' +
      '<button class="icon-btn" type="button" data-close-cart aria-label="Cerrar pedido">' + D.icons.close + '</button></header>' + body;
  }

  function updateBadge() {
    document.getElementById('cartCount').textContent = cart.count();
    document.getElementById('cartTotal').textContent = D.fmt(cart.total());
    document.querySelectorAll('[data-add]').forEach(function (b) {
      var q = cart.qty(b.dataset.add);
      b.classList.toggle('has', q > 0);
      b.innerHTML = q > 0 ? q : D.icons.plus;
    });
  }

  cart.open = function () {
    lastFocus = document.activeElement;
    document.getElementById('toast').classList.remove('show');
    render();
    scrim.hidden = false;
    drawer.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function () { drawer.classList.add('open'); scrim.classList.add('on'); });
    document.body.classList.add('lock');
    var f = drawer.querySelector('.drawer-head .icon-btn'); if (f) f.focus();
  };
  cart.close = function () {
    drawer.classList.remove('open'); scrim.classList.remove('on');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lock');
    setTimeout(function () { if (!drawer.classList.contains('open')) scrim.hidden = true; }, 300);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };
  cart.isOpen = function () { return drawer.classList.contains('open'); };

  cart.subscribe(function () {
    updateBadge();
    if (cart.isOpen()) render();
  });

  cartBtn.addEventListener('click', cart.open);
  scrim.addEventListener('click', cart.close);

  drawer.addEventListener('click', function (e) {
    var t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.inc) cart.add(t.dataset.inc, 1);
    else if (t.dataset.dec) cart.set(t.dataset.dec, cart.qty(t.dataset.dec) - 1);
    else if (t.hasAttribute('data-checkout')) { cart.close(); D.go('#/pedido'); }
    else if (t.hasAttribute('data-close-cart')) { cart.close(); if (t.dataset.go) D.go(t.dataset.go); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && cart.isOpen()) cart.close();
  });

  /* Animación del botón al añadir */
  cart.bump = function () {
    cartBtn.classList.remove('bump'); void cartBtn.offsetWidth; cartBtn.classList.add('bump');
  };

  updateBadge();
})();
