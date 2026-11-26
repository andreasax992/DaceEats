/* Pantalla de pedido + pasarela de pago ficticia (no se piden datos reales) */
(function () {
  var D = window.DACE;
  var ORDER_KEY = 'dace-eats-order';
  var METHODS = [
    { id: 'tarjeta', nombre: 'Tarjeta de demostración', detalle: '•••• •••• •••• 4242' },
    { id: 'saldo', nombre: 'Saldo DACE Pay', detalle: 'Monedero de demostración' }
  ];

  D.order = {
    load: function () { try { return JSON.parse(sessionStorage.getItem(ORDER_KEY)); } catch (e) { return D._order || null; } },
    save: function (o) { D._order = o; try { sessionStorage.setItem(ORDER_KEY, JSON.stringify(o)); } catch (e) {} },
    clear: function () { D._order = null; try { sessionStorage.removeItem(ORDER_KEY); } catch (e) {} }
  };

  function checkout() {
    var groups = D.cart.groups();
    if (!groups.length) return null;
    var method = METHODS[0].id;
    var el = document.createElement('div');
    el.className = 'wrap co';
    el.innerHTML =
      '<a class="back dark" href="#/">' + D.icons.back + ' Seguir comprando</a>' +
      '<h1 class="co-title">Finalizar pedido</h1>' +
      '<div class="co-grid"><div class="co-main">' +

      '<section class="panel"><h2><span class="n">1</span> Entrega</h2>' +
      '<div class="addr"><strong>' + D.esc(D.CONFIG.destino) + '</strong><span>Entrega lo antes posible · 25–35 min</span></div></section>' +

      '<section class="panel"><h2><span class="n">2</span> Método de pago</h2>' +
      '<p class="note">Simulación: no se solicita ni se procesa ningún dato bancario real.</p>' +
      '<div class="methods" role="radiogroup" aria-label="Método de pago">' + METHODS.map(function (m, i) {
        return '<label class="method"><input type="radio" name="pay" value="' + m.id + '"' + (i ? '' : ' checked') + '>' +
          '<span class="method-ico">' + D.icons.check + '</span><span><strong>' + m.nombre + '</strong><small>' + m.detalle + '</small></span></label>';
      }).join('') + '</div></section>' +

      '<section class="panel"><h2><span class="n">3</span> Resumen del pedido</h2>' + groups.map(function (g) {
        return '<div class="co-group"><header><span class="mono" style="--c1:' + g.cat.c1 + ';--c2:' + g.cat.c2 + '">' + g.cat.mono + '</span>' +
          '<div><strong>' + D.esc(g.cat.restaurante) + '</strong><small>Procedencia: ' + D.esc(g.cat.pais) + '</small></div></header>' +
          g.lines.map(function (l) {
            return '<div class="co-line">' + D.media('platos', l.dish.id, l.dish.c, l.dish.n, 'thumb') +
              '<span class="co-q">' + l.qty + '×</span><span class="co-n">' + D.esc(l.dish.n) + '</span><span class="co-p">' + D.fmt(l.total) + '</span></div>';
          }).join('') + '</div>';
      }).join('') + '<button type="button" class="btn light" data-edit>Editar pedido</button></section>' +
      '</div>' +

      '<aside class="co-side"><div class="panel sticky"><h2>Total</h2>' +
      '<dl class="totals"><div><dt>Subtotal</dt><dd>' + D.fmt(D.cart.subtotal()) + '</dd></div>' +
      '<div><dt>Envío</dt><dd class="free">Gratis</dd></div>' +
      '<div><dt>Tarifa de servicio</dt><dd>' + D.fmt(D.cart.fee()) + '</dd></div>' +
      '<div class="grand"><dt>Total</dt><dd>' + D.fmt(D.cart.total()) + '</dd></div></dl>' +
      '<button type="button" class="btn brand block lg" id="payBtn">Pagar ' + D.fmt(D.cart.total()) + '</button>' +
      '<p class="note center">Al pagar confirmas el pedido de demostración.</p></div></aside></div>';

    el.addEventListener('change', function (e) { if (e.target.name === 'pay') method = e.target.value; });
    el.addEventListener('click', function (e) {
      if (e.target.closest('[data-edit]')) D.cart.open();
      if (e.target.closest('#payBtn')) pay(method);
    });
    /* Si el carrito se vacía desde el panel lateral, volvemos al inicio */
    function onCart() { if (!D.cart.count() && location.hash === '#/pedido' && !paying) D.go('#/'); else if (location.hash === '#/pedido' && !paying) D.rerender(); }
    D.cart.subscribe(onCart);
    el._cleanup = function () { D.cart.unsubscribe(onCart); };
    return el;
  }

  var paying = false;
  function pay(methodId) {
    if (paying) return;
    paying = true;
    var m = METHODS.filter(function (x) { return x.id === methodId; })[0];
    var ov = document.getElementById('payOverlay');
    var steps = ['Conectando con DACE Pay', 'Verificando el pago', 'Pago aprobado'];
    var per = (D.CONFIG.pagoSegundos * 1000) / steps.length;
    ov.innerHTML = '<div class="pay-card"><div class="spinner" id="spin"></div>' +
      '<h2 id="payTitle">Procesando el pago…</h2><p class="pay-amount">' + D.fmt(D.cart.total()) + '</p>' +
      '<ul class="pay-steps">' + steps.map(function (s) { return '<li><i></i>' + s + '</li>'; }).join('') + '</ul></div>';
    ov.setAttribute('aria-hidden', 'false'); ov.classList.add('on'); document.body.classList.add('lock');
    var lis = ov.querySelectorAll('li');
    steps.forEach(function (_, i) {
      setTimeout(function () { lis[i].classList.add('active'); }, i * per);
      setTimeout(function () { lis[i].classList.remove('active'); lis[i].classList.add('done'); }, (i + 1) * per - 150);
    });
    setTimeout(function () {
      ov.querySelector('#spin').classList.add('ok');
      ov.querySelector('#payTitle').textContent = '¡Pago realizado!';
    }, steps.length * per - 150);

    setTimeout(function () {
      var groups = D.cart.groups();
      D.order.save({
        id: 'DE-' + (1000 + Math.floor(Math.random() * 9000)),
        t0: Date.now(),
        metodo: m.nombre,
        subtotal: D.cart.subtotal(), fee: D.cart.fee(), total: D.cart.total(),
        grupos: groups.map(function (g) {
          return { cat: g.cat.id, lineas: g.lines.map(function (l) { return { id: l.dish.id, n: l.dish.n, q: l.qty, t: l.total }; }) };
        })
      });
      D.cart.clear();
      paying = false;
      ov.classList.remove('on'); ov.setAttribute('aria-hidden', 'true'); document.body.classList.remove('lock');
      D.go('#/seguimiento');
    }, D.CONFIG.pagoSegundos * 1000 + 500);
  }

  D.views.checkout = checkout;
})();
