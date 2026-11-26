/* Utilidades compartidas */
(function () {
  var D = (window.DACE = window.DACE || {});
  var data = window.DACE_DATA;
  D.CONFIG = window.DACE_CONFIG;

  D.cats = data.categorias;
  D.dishes = data.platos;
  D.catById = {};
  D.dishById = {};
  D.cats.forEach(function (c) { D.catById[c.id] = c; });
  D.dishes.forEach(function (p) { D.dishById[p.id] = p; });

  var money = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
  D.fmt = function (n) { return money.format(n); };

  D.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  D.norm = function (s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  };

  var HUES = [6, 14, 22, 30, 38, 46, 352];
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }

  /* Bloque de imagen: foto real si existe; si no, plato ilustrado con los colores de la cocina */
  function dishFor(kind, id) {
    if (kind === 'platos') return D.dishById[id];
    return D.dishes.filter(function (p) { return p.c === id && p.pop; })[0] || D.dishes.filter(function (p) { return p.c === id; })[0];
  }

  D.media = function (kind, id, catId, alt, cls) {
    var c = D.catById[catId];
    var d = dishFor(kind, id);
    var src = 'img/' + kind + '/' + id + '.jpg';
    return '<div class="media has-art ' + (cls || '') + '" style="--c1:' + c.c1 + ';--c2:' + c.c2 + '">' +
      (D.art ? D.art(d.a, id) : '') +
      '<img src="' + src + '" alt="' + D.esc(alt || '') + '" loading="lazy" decoding="async" data-q="' + D.esc(d.q) + '" onerror="DACE.photoFallback(this)"></div>';
  };

  /* Si no hay foto local, intenta la imagen principal del artículo de Wikipedia (con caché).
     Si tampoco hay, se elimina la <img> y queda el plato ilustrado. Desactivable en config.js */
  var pending = {};
  function cacheGet(q) { try { return localStorage.getItem('dace-foto:' + q); } catch (e) { return null; } }
  function cacheSet(q, v) { try { localStorage.setItem('dace-foto:' + q, v); } catch (e) {} }
  function wikiPhoto(q) {
    if (pending[q]) return pending[q];
    var url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrlimit=4&prop=pageimages&piprop=thumbnail&pithumbsize=700&gsrsearch=' + encodeURIComponent(q);
    pending[q] = fetch(url).then(function (r) { return r.json(); }).then(function (j) {
      var pages = Object.keys((j.query && j.query.pages) || {}).map(function (k) { return j.query.pages[k]; })
        .filter(function (p) { return p.thumbnail && /\.jpe?g/i.test(p.thumbnail.source); })
        .sort(function (a, b) { return a.index - b.index; });
      var u = pages.length ? pages[0].thumbnail.source : '';
      cacheSet(q, u); return u;
    }).catch(function () { return ''; });
    return pending[q];
  }
  D.photoFallback = function (img) {
    var q = img.dataset.q;
    if (img.dataset.tried || !q || !D.CONFIG || !D.CONFIG.fotosWikipedia) return img.remove();
    img.dataset.tried = '1';
    var cached = cacheGet(q);
    if (cached === '') return img.remove();
    if (cached) { img.src = cached; return; }
    wikiPhoto(q).then(function (u) { if (u) img.src = u; else img.remove(); });
  };

  var toastTimer;
  D.toast = function (msg, actionLabel, action) {
    var t = document.getElementById('toast');
    t.innerHTML = '<span>' + D.esc(msg) + '</span>' + (actionLabel ? '<button type="button">' + D.esc(actionLabel) + '</button>' : '');
    if (actionLabel) t.querySelector('button').onclick = function () { t.classList.remove('show'); action(); };
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 3200);
  };

  D.go = function (hash, replace) {
    if (replace) { history.replaceState(null, '', hash); window.dispatchEvent(new Event('hashchange')); }
    else location.hash = hash;
  };

  D.icons = {
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 13 4 4 10-10"/></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true" style="fill:currentColor;stroke:none"><path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.5 1.3 6.6L12 17.2 6.1 20.5l1.3-6.6L2.5 9.4l6.6-.8z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    bike: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 11a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>'
  };
})();
