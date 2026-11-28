/* Confirmación y seguimiento del pedido.
   Solo muestra el proceso de compra y entrega: sin personas, avatares ni actuaciones. */
(function () {
  var D = window.DACE;
  var SVGNS = 'http://www.w3.org/2000/svg';

  var PHASES = [
    { key: 'confirmado', titulo: '¡Pedido confirmado!', sub: 'Hemos recibido tu pedido y ya lo estamos enviando a cocina.', paso: 'Confirmado' },
    { key: 'preparando', titulo: 'Estamos preparando tu pedido', sub: 'Las cocinas están poniendo todo a punto.', paso: 'Preparando' },
    { key: 'camino', titulo: '¡Tu pedido está en camino!', sub: 'Va de camino al ' + 'escenario principal.', paso: 'En camino' },
    { key: 'completado', titulo: '¡Pedido completado!', sub: 'Tu pedido ha llegado a su destino. ¡Que aproveche!', paso: 'Entregado' }
  ];

  /* Puntos de salida en el mapa (uno por cocina del pedido) y destino */
  var STARTS = [[70, 70], [80, 290], [250, 40], [250, 320], [60, 180], [380, 300], [380, 50], [170, 175], [470, 95]];
  var DEST = [560, 180];

  function mapSVG(origins) {
    var s = '<svg viewBox="0 0 640 360" class="map" role="img" aria-label="Mapa de la entrega"><defs>' +
      '<pattern id="blk" width="96" height="72" patternUnits="userSpaceOnUse"><rect x="8" y="8" width="80" height="56" rx="8" fill="#fafaf7"/></pattern></defs>' +
      '<rect width="640" height="360" fill="#e7e8e2"/><rect width="640" height="360" fill="url(#blk)"/>' +
      '<path d="M-10 250 C140 200 260 330 420 270 S600 330 660 300 L660 360 L-10 360Z" fill="#cfe4ee"/>' +
      '<path d="M-10 250 C140 200 260 330 420 270 S600 330 660 300" fill="none" stroke="#bcd8e6" stroke-width="3"/>';
    origins.forEach(function (c, i) {
      s += '<path id="route' + i + '" class="route-bg" d="' + routeD(i, origins.length) + '"/><path class="route" d="' + routeD(i, origins.length) + '"/>';
    });
    // destino
    s += '<g transform="translate(' + DEST[0] + ' ' + DEST[1] + ')"><circle r="26" fill="#ff5a1f" opacity=".18" class="pulse"/>' +
      '<path d="M0 22C0 22 -16 6 -16 -6a16 16 0 0 1 32 0C16 6 0 22 0 22z" fill="#ff5a1f" stroke="#fff" stroke-width="3"/><circle cy="-6" r="5.5" fill="#fff"/></g>' +
      '<text x="' + DEST[0] + '" y="' + (DEST[1] + 52) + '" text-anchor="middle" class="map-lbl">Escenario</text>';
    // cocinas y marcadores
    origins.forEach(function (c, i) {
      var st = STARTS[i % STARTS.length];
      s += '<g transform="translate(' + st[0] + ' ' + st[1] + ')"><circle class="kring" r="17"/><rect x="-15" y="-15" width="30" height="30" rx="9" fill="' + c.c1 + '" stroke="#fff" stroke-width="3"/>' +
        '<text y="4" text-anchor="middle" class="mono-lbl">' + c.mono + '</text></g>';
    });
    origins.forEach(function (c, i) {
      s += '<g class="mk" id="mk' + i + '"><circle r="19" fill="#ff5a1f" stroke="#fff" stroke-width="3"/>' +
        '<path d="M-8 -4h16l-1.4 11a2 2 0 0 1-2 1.8h-9.2a2 2 0 0 1-2-1.8z" fill="#fff" stroke="none"/><path d="M-4.5 -4a4.5 4.5 0 0 1 9 0" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>' +
        '<g transform="translate(' + (c.pais.length * 4.1 + 32) + ' 0)"><rect x="-' + (c.pais.length * 4.1 + 10) + '" y="-12" width="' + (c.pais.length * 8.2 + 20) + '" height="24" rx="12" fill="#fff" stroke="#e1e1db"/>' +
        '<text y="4.5" text-anchor="middle" class="mk-lbl">' + D.esc(c.pais) + '</text></g></g>';
    });
    return s + '</svg>';
  }

  function endPoint(i, n) { return [DEST[0] - 130, DEST[1] + (i - (n - 1) / 2) * Math.min(38, 260 / n)]; }
  function routeD(i, n) {
    var s = STARTS[i % STARTS.length], e = endPoint(i, n), mx = s[0] + (e[0] - s[0]) * .55;
    return 'M' + s[0] + ' ' + s[1] + ' C' + mx + ' ' + s[1] + ' ' + mx + ' ' + e[1] + ' ' + e[0] + ' ' + e[1];
  }

  function fmtTime(sec) {
    sec = Math.max(0, Math.ceil(sec));
    return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  }

  function tracking() {
    var order = D.order.load();
    if (!order) return null;
    var cats = order.grupos.map(function (g) { return D.catById[g.cat]; });
    var F = D.CONFIG.fases;
    var t1 = F.confirmado, t2 = t1 + F.preparando, t3 = t2 + F.camino;

    var el = document.createElement('div');
    el.className = 'wrap track';
    el.innerHTML =
      '<div class="track-grid"><section class="track-main">' +
      '<ol class="steps">' + PHASES.map(function (p, i) { return '<li data-step="' + i + '"><i>' + D.icons.check + '</i><span>' + p.paso + '</span></li>'; }).join('') + '</ol>' +
      '<div class="status"><h1 id="tTitle"></h1><p id="tSub"></p></div>' +
      '<div class="map-wrap">' + mapSVG(cats) +
      '<div class="eta" id="tEta"></div><div class="done-badge" id="tDone">' + D.icons.check + '</div></div>' +
      '<div class="bar"><div id="tBar"></div></div>' +
      '<div class="codes" id="tCodes" hidden></div>' +
      '</section>' +
      '<aside class="track-side"><div class="panel"><div class="order-id"><small>Pedido</small><strong>#' + order.id + '</strong></div>' +
      '<div class="from"><small>Procedencia</small><div class="from-chips">' + cats.map(function (c) {
        return '<span class="origin" style="--c1:' + c.c1 + ';--c2:' + c.c2 + '"><b>' + c.mono + '</b>' + D.esc(c.pais) + '</span>';
      }).join('') + '</div></div>' +
      order.grupos.map(function (g) {
        var c = D.catById[g.cat];
        return '<div class="co-group"><header><span class="mono" style="--c1:' + c.c1 + ';--c2:' + c.c2 + '">' + c.mono + '</span><div><strong>' + D.esc(c.restaurante) + '</strong><small>Cocina de ' + D.esc(c.pais) + '</small></div></header>' +
          g.lineas.map(function (l) { return '<div class="sum-line"><span class="co-q">' + l.q + '×</span><span class="co-n">' + D.esc(l.n) + '</span><span class="co-p">' + D.fmt(l.t) + '</span></div>'; }).join('') + '</div>';
      }).join('') +
      '<dl class="totals"><div><dt>Subtotal</dt><dd>' + D.fmt(order.subtotal) + '</dd></div><div><dt>Envío</dt><dd class="free">Gratis</dd></div>' +
      '<div><dt>Tarifa de servicio</dt><dd>' + D.fmt(order.fee) + '</dd></div><div class="grand"><dt>Total pagado</dt><dd>' + D.fmt(order.total) + '</dd></div></dl>' +
      '<p class="note">Pagado con ' + D.esc(order.metodo) + '</p>' +
      '<div class="end" id="tEnd" hidden><button type="button" class="btn brand block lg" id="newOrder">Hacer un nuevo pedido</button></div>' +
      '</div></aside></div>';

    var $ = function (s) { return el.querySelector(s); };
    var steps = el.querySelectorAll('.steps li');
    var paths = Array.prototype.slice.call(el.querySelectorAll('path.route'));
    var lens = [], mks = [];
    var shown = -1;

    function place(i, p) {
      var path = paths[i];
      if (!lens[i]) lens[i] = path.getTotalLength();
      var pt = path.getPointAtLength(lens[i] * p);
      mks[i].setAttribute('transform', 'translate(' + pt.x + ' ' + pt.y + ')');
    }

    function renderCodes() {
      var digits = String(order.id).replace(/\D/g, ''), box = $('#tCodes');
      var rows = order.grupos.filter(function (g) { return D.danzas && D.danzas[g.cat]; });
      if (!rows.length) return;
      var ent = order.entregados || {};
      box.innerHTML = '<h2>Código de confirmación</h2><p>Escribe el código de tu pedido para recibirlo. Pulsa sobre el código para rellenarlo.</p>' +
        rows.map(function (g) {
          var dz = D.danzas[g.cat], c = D.catById[g.cat], code = dz.codigo + '-' + digits, done = !!ent[g.cat];
          return '<form class="code-row' + (done ? ' done' : '') + '" data-cat="' + g.cat + '" data-code="' + code + '" autocomplete="off">' +
            '<div class="code-flag">' + D.flag(dz.bandera) + '</div>' +
            '<div class="code-info"><strong>' + D.esc(dz.pais) + '</strong><small>' + D.esc(c.restaurante) + '</small></div>' +
            '<button type="button" class="code-chip" data-fill aria-label="Usar el código ' + code + '">' + code + '</button>' +
            '<input name="c" maxlength="12" placeholder="Código" aria-label="Código de ' + D.esc(dz.pais) + '">' +
            '<button type="submit" class="btn brand">' + (done ? 'Ver de nuevo' : 'Confirmar') + '</button>' +
            '<span class="code-msg" role="status">' + (done ? '✓ Pedido recibido' : '') + '</span></form>';
        }).join('');
      box.hidden = false;
    }
    $('#tCodes').addEventListener('click', function (e) {
      var f = e.target.closest('[data-fill]'); if (!f) return;
      var row = f.closest('.code-row'), inp = row.querySelector('input');
      if (inp) { inp.value = row.dataset.code; inp.focus(); }
    });
    $('#tCodes').addEventListener('submit', function (e) {
      e.preventDefault();
      var row = e.target.closest('.code-row'), msg = row.querySelector('.code-msg'), inp = row.querySelector('input');
      var norm = function (v) { return String(v).toUpperCase().replace(/[^A-Z0-9]/g, ''); };
      if (!row.classList.contains('done') && norm(inp.value) !== norm(row.dataset.code)) {
        msg.textContent = 'Código incorrecto. Revísalo e inténtalo de nuevo.'; msg.className = 'code-msg err';
        row.classList.remove('shake'); void row.offsetWidth; row.classList.add('shake'); return;
      }
      msg.textContent = '✓ Código correcto'; msg.className = 'code-msg ok';
      setTimeout(function () { D.go('#/entrega/' + row.dataset.cat); }, 450);
    });

    function tick() {
      var el_ = (Date.now() - order.t0) / 1000;
      var ph = el_ < t1 ? 0 : el_ < t2 ? 1 : el_ < t3 ? 2 : 3;
      if (ph !== shown) {
        shown = ph;
        $('#tTitle').textContent = PHASES[ph].titulo;
        $('#tSub').textContent = PHASES[ph].sub;
        el.dataset.phase = PHASES[ph].key;
        steps.forEach(function (li, i) { li.classList.toggle('done', i < ph || ph === 3); li.classList.toggle('active', i === ph && ph < 3); });
        $('#tEnd').hidden = ph !== 3;
        if (ph === 3) renderCodes(); else $('#tCodes').hidden = true;
        $('#tDone').classList.toggle('on', ph === 3);
        var st = $('#tTitle'); st.classList.remove('swap'); void st.offsetWidth; st.classList.add('swap');
      }
      var p = ph < 2 ? 0 : ph === 2 ? (el_ - t2) / F.camino : 1;
      var eased = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      cats.forEach(function (_, i) { place(i, eased); });
      $('#tBar').style.width = Math.min(100, (el_ / t3) * 100) + '%';
      $('#tEta').textContent = ph === 2 ? 'Llegada en ' + fmtTime(t3 - el_) : ph < 2 ? 'Tiempo estimado ' + fmtTime(t3 - el_) : '';
      $('#tEta').hidden = ph === 3;
    }

    mks = cats.map(function (_, i) { return el.querySelector('#mk' + i); });
    tick();
    var timer = setInterval(tick, 100);
    $('#newOrder').addEventListener('click', function () { D.order.clear(); D.go('#/'); });
    el._cleanup = function () { clearInterval(timer); };
    return el;
  }

  D.views.tracking = tracking;
})();
