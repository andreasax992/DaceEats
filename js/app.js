/* Enrutador (hash) e inicialización */
(function () {
  var D = window.DACE;
  var view = document.getElementById('view');
  var searchInput = document.getElementById('searchInput');
  var current = null;

  function parse() {
    var h = decodeURIComponent(location.hash || '#/').replace(/^#\/?/, '');
    var parts = h.split('/');
    return { name: parts[0] || 'home', arg: parts.slice(1).join('/') };
  }

  function render() {
    if (current && current._cleanup) current._cleanup();
    var r = parse(), el = null;
    if (r.name === 'cocina') el = D.views.category(r.arg);
    else if (r.name === 'buscar') el = D.views.search(r.arg);
    else if (r.name === 'pedido') el = D.views.checkout();
    else if (r.name === 'seguimiento') el = D.views.tracking();
    else if (r.name === 'home' || r.name === '') el = D.views.home();
    if (!el) return D.go('#/', true);

    current = el;
    view.innerHTML = '';
    view.appendChild(el);
    document.body.classList.toggle('on-checkout', r.name === 'pedido' || r.name === 'seguimiento');
    if (r.name !== 'buscar') searchInput.value = '';
    document.dispatchEvent(new Event('dace:render'));
  }

  D.rerender = function () {
    var y = window.scrollY; render(); window.scrollTo(0, y);
  };

  var last = null;
  window.addEventListener('hashchange', function () {
    var before = last; last = location.hash;
    if (D.cart.isOpen()) D.cart.close();
    render();
    if (before !== location.hash) window.scrollTo(0, 0);
  });

  function syncAdd() {
    document.querySelectorAll('[data-add]').forEach(function (b) {
      var q = D.cart.qty(b.dataset.add);
      b.classList.toggle('has', q > 0);
      b.innerHTML = q > 0 ? q : D.icons.plus;
    });
  }
  document.addEventListener('dace:render', syncAdd);

  /* Búsqueda */
  var form = document.getElementById('searchForm');
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  var t;
  searchInput.addEventListener('input', function () {
    clearTimeout(t);
    t = setTimeout(function () {
      var v = searchInput.value.trim();
      if (!v) { if (parse().name === 'buscar') D.go('#/', true); return; }
      var inSearch = parse().name === 'buscar';
      D.go('#/buscar/' + encodeURIComponent(v), inSearch);
      searchInput.focus();
    }, 180);
  });

  /* Enlaces data-go (botones que navegan) */
  document.addEventListener('click', function (e) {
    var g = e.target.closest('[data-go]');
    if (g && !g.hasAttribute('data-close-cart')) D.go(g.dataset.go);
  });

  last = location.hash;
  render();
})();
