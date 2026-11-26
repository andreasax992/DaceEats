/* Ilustraciones vectoriales de los platos (vista cenital), generadas por código.
   Cada plato tiene en data.js un campo "a": "tipo:modo:color1:color2:…".
   Para usar una foto real basta con guardarla en img/platos/<id>.jpg: tiene prioridad. */
(function () {
  var D = window.DACE;

  /* ---------- utilidades de dibujo ---------- */
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function rgb(h) { h = h.replace('#', ''); return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); }); }
  function shade(h, f) {
    return '#' + rgb(h).map(function (v) {
      v = f > 0 ? v + (255 - v) * f : v * (1 + f);
      return ('0' + Math.max(0, Math.min(255, Math.round(v))).toString(16)).slice(-2);
    }).join('');
  }
  function lum(h) { var c = rgb(h); return (c[0] * .3 + c[1] * .59 + c[2] * .11) / 255; }
  function n(v) { return Math.round(v * 10) / 10; }
  function tf(x, y, rot) { return rot ? ' transform="rotate(' + n(rot) + ' ' + n(x) + ' ' + n(y) + ')"' : ''; }
  function S(c, w, o) { return ' stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"' + (o ? ' opacity="' + o + '"' : ''); }

  function C(x, y, r, f, o) { return '<circle cx="' + n(x) + '" cy="' + n(y) + '" r="' + n(r) + '" fill="' + f + '"' + (o || '') + '/>'; }
  function E(x, y, rx, ry, f, rot, o) { return '<ellipse cx="' + n(x) + '" cy="' + n(y) + '" rx="' + n(rx) + '" ry="' + n(ry) + '" fill="' + f + '"' + tf(x, y, rot) + (o || '') + '/>'; }
  function R(x, y, w, h, f, rx, rot, o) { return '<rect x="' + n(x - w / 2) + '" y="' + n(y - h / 2) + '" width="' + n(w) + '" height="' + n(h) + '" rx="' + n(rx || 0) + '" fill="' + f + '"' + tf(x, y, rot) + (o || '') + '/>'; }
  function P(d, f, o, g) { return '<path d="' + d + '" fill="' + f + '"' + (g ? ' transform="' + g + '"' : '') + (o || '') + '/>'; }
  function G(t, inner) { return '<g transform="' + t + '">' + inner + '</g>'; }
  function tri(x, y, r, f, rot, o) { // triángulo redondeado
    var pts = [0, 1, 2].map(function (i) { var a = -Math.PI / 2 + i * 2.0944; return [x + Math.cos(a) * r, y + Math.sin(a) * r]; });
    return '<polygon points="' + pts.map(function (p) { return n(p[0]) + ',' + n(p[1]); }).join(' ') + '" fill="' + f + '"' + tf(x, y, rot) + S(f, 3) + (o || '') + '/>';
  }
  function disc(r, k, fn) { for (var i = 0; i < k; i++) { var a = r.rnd() * 6.2832, d = Math.sqrt(r.rnd()) * r.rad; fn(Math.cos(a) * d, Math.sin(a) * d, i); } }
  function scatter(rnd, rad, k, fn) { var out = ''; for (var i = 0; i < k; i++) { var a = rnd() * 6.2832, d = Math.sqrt(rnd()) * rad; out += fn(Math.cos(a) * d, Math.sin(a) * d, i); } return out; }
  function leaf(x, y, s, f, rot) { return E(x, y, s, s * .5, f, rot) + '<path d="M' + n(x - s) + ' ' + n(y) + 'L' + n(x + s) + ' ' + n(y) + '"' + S(shade(f, -.25), .5) + tf(x, y, rot) + '/>'; }

  /* ---------- platos base ---------- */
  function shadow(r) { return '<circle cx="1.8" cy="3.2" r="' + (r || 46) + '" fill="#000" opacity=".3" filter="url(#dBlur)"/>'; }
  function plate() {
    return shadow(46) + C(0, 0, 46, '#f8f7f3') + C(0, 0, 46, 'none', S('#d8d6cd', .8)) + C(0, 0, 38, '#fdfdfb', S('#e8e6de', .8)) +
      '<path d="M-38 -10A40 40 0 0 1 -10 -38" fill="none"' + S('#fff', 1.6, .9) + '/>';
  }
  function bowl(liq) {
    return shadow(44) + C(0, 0, 44, '#f1eee6') + C(0, 0, 44, 'none', S('#d6d3c9', .8)) + C(0, 0, 38, '#d9d5c9') + C(0, 0, 36, shade(liq, -.35)) + C(0, 0, 34, liq) +
      C(-6, -6, 22, shade(liq, .25), ' opacity=".3"') + '<path d="M-40 -10A42 42 0 0 1 -10 -40" fill="none"' + S('#fff', 1.6, .9) + '/>';
  }
  function darkPan(col, r) { return shadow(r) + C(0, 0, r, col) + C(0, 0, r - 3, shade(col, .12)) + C(0, 0, r - 6, shade(col, -.2)); }

  /* ---------- tipos ---------- */
  var T = {};

  T.pasta = function (m, c, rnd) {
    var out = plate();
    if (m === 'nest') {
      var i;
      for (i = 0; i < 9; i++) {
        var r = 5 + i * 3.4, w = 3.3 - i * .05;
        out += E(rnd() * 2 - 1, rnd() * 2 - 1, r, r * .94, 'none', rnd() * 360, S(i % 2 ? shade(c[0], -.1) : c[0], w));
      }
      out += C(0, 0, 4, shade(c[0], -.05)) + E(-5, -6, 10, 4, '#fff', -30, ' opacity=".18"');
      if (c[1] !== c[0]) {
        out += C(-1, -1, 14, c[1], ' opacity=".93"') + scatter(rnd, 15, 12, function (x, y) { return C(x - 1, y - 1, 1 + rnd() * 2, c[1], ' opacity=".85"'); });
        out += E(-4, -5, 6, 3, '#fff', -25, ' opacity=".25"');
      }
      out += scatter(rnd, 17, 14, function (x, y) { return R(x, y, 3.4, 1.8, c[2], .6, rnd() * 180); });
      if (c[3]) out += scatter(rnd, 17, 16, function (x, y) { return C(x, y, .55, c[3]); });
      if (c[2] === '#4f8a2e') out += P('M14 14a8 8 0 0 0 10 0a8 8 0 0 0 -10 0Z', '#9bc34a', S('#6f9a3a', .6));
    } else if (m === 'ravioli') {
      out += C(0, 2, 29, c[1], ' opacity=".7"') + C(0, 2, 29, 'none', S(shade(c[1], -.2), .6));
      for (var k = 0; k < 7; k++) {
        var a = k * 0.8976, x = k === 6 ? 0 : Math.cos(a) * 18, y = k === 6 ? 0 : Math.sin(a) * 18;
        out += R(x, y, 14.5, 14.5, c[0], 2.4, k * 25 + 10, S(shade(c[0], -.2), .6)) + R(x, y, 10.5, 10.5, 'none', 1.6, k * 25 + 10, ' stroke="' + shade(c[0], -.28) + '" stroke-width=".7" stroke-dasharray="1.1 1"') + E(x - 2, y - 2.5, 3.5, 1.5, '#fff', k * 25, ' opacity=".35"');
      }
      for (k = 0; k < 5; k++) out += leaf(Math.cos(k * 1.3 + 1) * 11, Math.sin(k * 1.3 + 1) * 11, 3.2, c[2], k * 60);
    } else if (m === 'gnocchi') {
      out += C(0, 0, 29, c[1], ' opacity=".92"') + C(0, 0, 29, 'none', S(shade(c[1], -.25), .6));
      out += scatter(rnd, 22, 17, function (x, y) {
        var rot = rnd() * 180;
        return E(x, y, 5.4, 3.7, c[0], rot, S(shade(c[0], -.18), .5)) + '<path d="M' + n(x - 2.4) + ' ' + n(y - 1.2) + 'l4.8 2.4M' + n(x - 2.4) + ' ' + n(y + .6) + 'l4.8 2.4"' + S(shade(c[0], -.22), .45) + tf(x, y, rot) + '/>';
      });
      out += scatter(rnd, 20, 12, function (x, y) { return E(x, y, 1.4, .8, c[2], rnd() * 180); });
      out += leaf(0, -1, 5, '#4f8a2e', -30) + leaf(-5, 3, 4, '#5b8c3a', 40);
    } else { // lasagna / bake
      var top = c[2], side = [c[0], c[1], c[0], c[1], c[0]];
      out += R(1, 2, 56, 46, '#000', 6, 0, ' opacity=".16" filter="url(#dBlur)"');
      for (var j = 0; j < 5; j++) out += R(0, 10.5 + j * 3.1, 52, 3.2, side[j], .6, 0);
      out += R(0, 9, 52, 1.2, shade(c[1], -.2), 0, 0);
      out += R(0, -8, 52, 31, shade(top, -.08), 5) + R(0, -8.5, 49, 28, top, 4);
      out += scatter(rnd, 22, 14, function (x, y) { return E(x, y * .6 - 9, 3 + rnd() * 3.5, 2 + rnd() * 2, shade(top, -.28), rnd() * 180, ' opacity=".55"'); });
      out += scatter(rnd, 22, 9, function (x, y) { return E(x, y * .6 - 9, 3, 1.4, shade(top, .35), rnd() * 180, ' opacity=".55"'); });
      out += P('M-26 -8Q-27 -18 -20 -20L-20 -4Z', c[1], ' opacity=".9"') + P('M26 -10Q27 -20 20 -21L20 -5Z', c[1], ' opacity=".9"');
    }
    return out;
  };

  T.pizza = function (m, c, rnd) {
    var out = shadow(46) + C(0, 0, 46, '#b98650') + C(0, 0, 46, 'none', S('#8f6234', 1));
    out += scatter(rnd, 44, 0, function () { return ''; });
    [20, 33, 41].forEach(function (r) { out += C(0, 0, r, 'none', S('#a5733f', .4, .6)); });
    out += C(1, 2, 41, '#000', ' opacity=".18"') + C(0, 0, 41, c[0]) + C(0, 0, 41, 'none', S(shade(c[0], -.3), .8));
    out += scatter(rnd, 38, 26, function (x, y) { return C(x, y, .9 + rnd(), shade(c[0], -.25), ' opacity=".5"'); });
    out += C(0, 0, 36, shade(c[0], -.05)) + C(0, 0, 35, m === 'quattro' ? c[2] : c[1]);
    if (m === 'margherita') {
      var i;
      for (i = 0; i < 9; i++) { var a = i * 0.698 + .3, d = i === 8 ? 0 : 20; out += C(Math.cos(a) * d + rnd() * 3, Math.sin(a) * d + rnd() * 3, 8 + rnd() * 2, c[2], ' opacity=".97"') + C(Math.cos(a) * d - 2, Math.sin(a) * d - 2, 3, '#fff', ' opacity=".5"'); }
      out += scatter(rnd, 30, 14, function (x, y) { return C(x, y, 1.4, shade(c[1], .2), ' opacity=".6"'); });
      for (i = 0; i < 6; i++) out += leaf(Math.cos(i * 1.05 + .4) * 17, Math.sin(i * 1.05 + .4) * 17, 6, c[3], i * 60 + 20);
    } else if (m === 'pepperoni') {
      out += scatter(rnd, 33, 22, function (x, y) { return E(x, y, 4 + rnd() * 3, 3 + rnd() * 2, c[2], rnd() * 180, ' opacity=".8"'); });
      var pts = [[-14, -16], [6, -20], [20, -8], [22, 12], [4, 22], [-16, 16], [-24, -2], [-4, 0], [10, 4], [-8, -6]];
      pts.forEach(function (p, i) {
        out += C(p[0] + 1, p[1] + 1, 7, '#000', ' opacity=".2"') + C(p[0], p[1], 7, c[3]) + C(p[0], p[1], 7, 'none', S(shade(c[3], -.3), .6)) + C(p[0] - 1.6, p[1] - 1.6, 2.4, shade(c[3], .3), ' opacity=".55"');
        out += scatter(rnd, 4.5, 4, function (x, y) { return C(p[0] + x, p[1] + y, .8, shade(c[3], -.35)); });
      });
    } else { // quattro
      var cols = [c[2], '#fbf4e2', c[3], '#f0a04a'];
      for (var q = 0; q < 4; q++) {
        out += '<path d="M0 0L' + n(Math.cos(q * 1.5708) * 35) + ' ' + n(Math.sin(q * 1.5708) * 35) + 'A35 35 0 0 1 ' + n(Math.cos((q + 1) * 1.5708) * 35) + ' ' + n(Math.sin((q + 1) * 1.5708) * 35) + 'Z" fill="' + cols[q] + '" opacity=".9"/>';
        out += scatter(rnd, 26, 9, function (x, y) { var ang = Math.atan2(y, x); var qq = Math.floor(((ang + 6.2832) % 6.2832) / 1.5708); return qq === q ? C(x, y, 2 + rnd() * 2.5, shade(cols[q], q === 2 ? -.35 : .35), ' opacity=".7"') : ''; });
      }
      out += '<path d="M-35 0H35M0 -35V35"' + S('#8f6a2a', .8, .55) + '/>';
    }
    out += '<path d="M0 0L35 0M0 0L17 30M0 0L-17 30M0 0L-35 0M0 0L-17 -30M0 0L17 -30"' + S('#000', .5, .18) + '/>';
    return out;
  };

  T.burger = function (m, c, rnd) { // vista lateral
    var out = shadow(0), bun = c[0], cheese = c[1], patty = c[2], lettuce = c[3];
    out += E(1, 31, 46, 11, '#000', 0, ' opacity=".28" filter="url(#dBlur)"') + E(0, 28, 46, 12, '#f8f7f3', 0, S('#d8d6cd', .8)) + E(0, 27, 36, 8.5, '#fdfdfb');
    out += P('M-24 14H24Q25 24 12 25H-12Q-25 24 -24 14Z', shade(bun, -.08), '');
    out += P('M-24 14H24Q25 20 14 22H-14Q-25 20 -24 14Z', shade(bun, .1), ' opacity=".5"');
    out += P('M-25 5Q-28 14 -22 15H22Q28 14 25 5Z', patty) + scatter(rnd, 22, 16, function (x) { return C(x, 10 + rnd() * 3, 1.3, shade(patty, .25), ' opacity=".6"'); });
    if (m === 'bacon') out += P('M-28 2Q-18 -2 -8 3T12 2T28 4L28 9Q18 6 8 10T-10 8T-28 8Z', '#b5332a') + P('M-28 3Q-18 0 -8 4T12 3T28 5', 'none', S('#e88a7a', 1.3));
    out += P('M-27 -2Q-30 5 -22 6L-12 6L-4 12L2 6L24 6Q31 5 27 -2Z', cheese) + P('M-27 -1Q-20 1 -10 -1', 'none', S(shade(cheese, .3), 1, .8));
    out += P('M-28 -4Q-24 -9 -18 -5T-6 -5T6 -5T18 -5T28 -4Q26 1 22 0H-22Q-26 1 -28 -4Z', lettuce) + P('M-26 -4Q-20 -7 -12 -4', 'none', S(shade(lettuce, .3), .8));
    out += R(-8, -2.5, 15, 4, '#cf3a2a', 1.5) + R(10, -2.5, 15, 4, '#cf3a2a', 1.5);
    out += P('M-26 -4Q-27 -26 0 -27Q27 -26 26 -4Z', bun);
    out += P('M-20 -8Q-18 -22 0 -23Q8 -23 14 -20', 'none', S(shade(bun, .35), 2.4, .5));
    out += P('M-26 -4Q-27 -26 0 -27Q27 -26 26 -4Q10 -2 -26 -4Z', shade(bun, -.18), ' opacity=".3"');
    out += scatter(rnd, 17, 14, function (x, y) { return E(x, -15 + y * .55, 1.9, 1, '#f7e7b8', rnd() * 180); });
    if (m === 'bacon') out += P('M-30 0Q-32 6 -28 9Q-26 5 -27 0Z', '#7a1d12');
    return out;
  };

  T.bowl = function (m, c, rnd) {
    var out = bowl(c[0]), i;
    if (m === 'chili' || m === 'fritopie') {
      out += scatter(rnd, 30, 34, function (x, y) { return C(x, y, 1.2 + rnd() * 2.2, shade(c[0], rnd() > .5 ? -.25 : .2), ' opacity=".7"'); });
      out += scatter(rnd, 28, 12, function (x, y) { return E(x, y, 3.2, 1.9, c[1], rnd() * 180, S(shade(c[1], -.25), .4)); });
      if (m === 'fritopie') for (i = 0; i < 8; i++) { var a = i * .785; out += tri(Math.cos(a) * 31, Math.sin(a) * 31, 6.5, c[1], a * 57.3 + 90); }
      out += scatter(rnd, 16, 20, function (x, y) { return R(x + 4, y - 2, 4, .9, c[2], .4, rnd() * 180); });
      out += leaf(-6, 4, 3.5, '#4f8a2e', 20) + leaf(8, 8, 3.2, '#5b8c3a', -50);
    } else if (m === 'curry') {
      out += scatter(rnd, 26, 6, function (x, y) { return E(x, y, 5, 3.6, shade(c[0], -.28), rnd() * 180) + E(x - 1, y - 1, 3, 1.5, shade(c[0], -.1), rnd() * 180, ' opacity=".7"'); });
      var sp = 'M0 0'; for (i = 1; i <= 36; i++) sp += 'L' + n(Math.cos(i * .5) * i * .6) + ' ' + n(Math.sin(i * .5) * i * .6);
      out += '<path d="' + sp + '" fill="none"' + S(c[1], 1.9, .95) + '/>';
      out += scatter(rnd, 25, 14, function (x, y) { return leaf(x, y, 2.4 + rnd(), c[2], rnd() * 180); });
    } else if (m === 'stew') {
      out += scatter(rnd, 26, 6, function (x, y) { return E(x, y, 6, 4, '#d9a45a', rnd() * 180, S('#a8742f', .5)); });
      out += scatter(rnd, 26, 7, function (x, y) { return E(x, y, 3.6, 2.6, c[1], rnd() * 180, S(shade(c[1], -.3), .4)); });
      out += scatter(rnd, 26, 7, function (x, y) { return C(x, y, 2.3, '#e8873a'); });
      out += scatter(rnd, 25, 16, function (x, y) { return leaf(x, y, 2.5, c[2], rnd() * 180); });
    } else if (m === 'soup') {
      out += scatter(rnd, 26, 14, function (x, y) { return C(x, y, 2.9, c[1], S(shade(c[1], -.2), .4)); });
      out += scatter(rnd, 25, 9, function (x, y) { return E(x, y, 5.5, 2.6, '#a8431f', rnd() * 180, ' opacity=".85"'); });
      out += scatter(rnd, 25, 16, function (x, y) { return leaf(x, y, 2.6, c[2], rnd() * 180); });
      out += C(14, -12, 3.4, '#e0425a', S('#b32d44', .5)) + C(-13, 12, 3.4, '#e0425a', S('#b32d44', .5));
    } else if (m === 'gazpacho') {
      var o = 'M-16 4'; for (i = 0; i < 12; i++) o += 'Q' + (-16 + i * 3 + 1.5) + ' ' + (i % 2 ? -4 : 11) + ' ' + (-16 + i * 3 + 3) + ' 4';
      out += '<path d="' + o + '" fill="none"' + S('#e3b04b', 1.6, .9) + '/>';
      out += scatter(rnd, 22, 7, function (x, y) { return R(x, y, 3.2, 3.2, '#e8c47a', .6, rnd() * 90); });
      out += scatter(rnd, 22, 8, function (x, y) { return C(x, y, 1.2, '#4f8a2e'); }) + E(-6, -6, 10, 4, '#fff', -30, ' opacity=".2"');
    } else if (m === 'onion') {
      out += C(0, 0, 31, c[1]) + C(0, 0, 31, 'none', S(c[0], 2.5));
      out += scatter(rnd, 27, 22, function (x, y) { return E(x, y, 4 + rnd() * 3, 3 + rnd() * 2, c[2], rnd() * 180, ' opacity=".6"'); });
      out += scatter(rnd, 27, 10, function (x, y) { return E(x, y, 3, 1.5, '#fff0b0', rnd() * 180, ' opacity=".55"'); });
      for (i = 0; i < 6; i++) out += R(Math.cos(i * 1.05) * 29, Math.sin(i * 1.05) * 29, 8, 6, '#d9a24a', 1.5, i * 60, S('#a8742f', .5));
    } else if (m === 'noodle') {
      for (i = 0; i < 7; i++) { var y0 = -16 + i * 5; out += '<path d="M-24 ' + y0 + 'Q-14 ' + (y0 - 5) + ' -4 ' + y0 + 'T16 ' + y0 + 'T30 ' + y0 + '" fill="none"' + S(i % 2 ? '#f6e2a8' : '#f1d58a', 2.2) + '/>'; }
      out += scatter(rnd, 26, 14, function (x, y) { return C(x, y, 1, c[0], ' opacity=".5"'); });
      out += E(16, -8, 8, 6.5, '#fffaf0', 0, S('#d9d3c0', .5)) + C(16, -8, 3.4, '#f2a62a') + C(15, -9, 1.2, '#fff', ' opacity=".6"');
      for (i = 0; i < 3; i++) out += E(-14 + i * 5, 16 - i * 4, 8, 3.8, '#e8a9a0', -30 + i * 8, S('#c5857b', .5));
      out += R(-4, -22, 8, 12, '#2b2f2a', 1, 12, ' opacity=".9"');
      out += scatter(rnd, 24, 22, function (x, y) { return C(x, y, 1.1, c[2]); });
    } else if (m === 'mac') {
      out += scatter(rnd, 30, 34, function (x, y) { var rot = rnd() * 360; return '<path d="M-3.4 -.5A3.6 3.6 0 1 1 1 3.2" fill="none"' + S(rnd() > .4 ? c[1] : shade(c[1], -.12), 3.3) + ' transform="translate(' + n(x) + ' ' + n(y) + ') rotate(' + n(rot) + ')"/>'; });
      out += scatter(rnd, 28, 18, function (x, y) { return C(x, y, 1.2, c[2], ' opacity=".7"'); });
      out += E(-6, -8, 10, 4, '#fff', -30, ' opacity=".2"') + leaf(6, 10, 3.2, '#5b8c3a', 30);
    } else if (m === 'tagine') {
      out = darkPan(c[0], 45) + C(0, 0, 40, shade(c[0], .1));
      var rr = [34, 28, 21, 14, 7];
      rr.forEach(function (r, k) { out += C(0, 0, r, shade(c[0], -.05 - k * .04)); out += C(-1.2, -1.5, r - 2, 'none', S(shade(c[0], .22), .7, .5)); });
      out += C(0, 0, 3.2, c[1]) + C(-.8, -.8, 1.2, c[2]);
      for (i = 0; i < 12; i++) out += C(Math.cos(i * .5236) * 38, Math.sin(i * .5236) * 38, 1.5, c[2]);
      out += E(-9, -11, 12, 4, '#fff', -35, ' opacity=".22"');
    }
    return out;
  };

  T.rice = function (m, c, rnd) {
    var out, i;
    if (m === 'paella') {
      out = shadow(46) + R(0, 0, 100, 8, '#2b2b2b', 4, 0) + C(0, 0, 45, '#2e2e2e') + C(0, 0, 43, '#4a4a4a') + C(0, 0, 40, shade(c[0], -.15)) + C(0, 0, 37, c[0]);
      out += scatter(rnd, 36, 90, function (x, y) { return E(x, y, 1.7, .75, rnd() > .5 ? '#f7e08a' : '#e0b030', rnd() * 180, ' opacity=".8"'); });
      for (i = 0; i < 8; i++) out += E(Math.cos(i * .785 + .3) * 24, Math.sin(i * .785 + .3) * 24, 7, 2.2, c[1], i * 45 + 70);
      for (i = 0; i < 6; i++) out += P('M0 0c4 -6 10 -4 9 2c-1 5 -7 6 -9 2z', '#f08a55', S('#c4602f', .6), 'translate(' + n(Math.cos(i * 1.05) * 15 - 4) + ' ' + n(Math.sin(i * 1.05) * 15 - 2) + ') rotate(' + (i * 70) + ')');
      for (i = 0; i < 5; i++) out += E(Math.cos(i * 1.26 + 1) * 28, Math.sin(i * 1.26 + 1) * 28, 5, 3.4, '#2b2f3a', i * 40, S('#586070', .5));
      out += scatter(rnd, 33, 20, function (x, y) { return C(x, y, 1.1, c[2]); });
      out += P('M0 0a9 9 0 0 1 18 0z', '#f7e04a', S('#c9b020', .6), 'translate(18 28) rotate(-20)');
      return out;
    }
    if (m === 'bibimbap') {
      out = shadow(46) + C(0, 0, 46, '#3b3532') + C(0, 0, 43, '#57504b') + C(0, 0, 39, c[0]);
      var cl = ['#e8873a', '#4f8a2e', '#8a5a2f', '#efe4b4', '#a8321f', '#e8873a'];
      for (i = 0; i < 6; i++) {
        var a0 = i * 1.0472, a1 = a0 + .95;
        out += '<path d="M0 0L' + n(Math.cos(a0) * 38) + ' ' + n(Math.sin(a0) * 38) + 'A38 38 0 0 1 ' + n(Math.cos(a1) * 38) + ' ' + n(Math.sin(a1) * 38) + 'Z" fill="' + cl[i] + '" opacity=".92" transform="translate(' + n(Math.cos((a0 + a1) / 2) * 2) + ' ' + n(Math.sin((a0 + a1) / 2) * 2) + ')"/>';
        out += scatter(rnd, 33, 0, function () { return ''; });
        for (var k = 0; k < 6; k++) { var am = a0 + .15 + rnd() * .65, dm = 16 + rnd() * 17; out += R(Math.cos(am) * dm, Math.sin(am) * dm, 5, 1, shade(cl[i], -.25), .4, am * 57 + 90); }
      }
      out += C(0, 0, 13, '#fffaf0') + C(0, 0, 13, 'none', S('#d9d3c0', .5)) + C(0, 0, 6, '#f2a62a') + C(-1.5, -1.5, 2, '#fff', ' opacity=".6"') + C(10, 10, 3, c[1]);
      return out;
    }
    out = plate();
    function grains(r, col, k) { return scatter(rnd, r, k, function (x, y) { return E(x, y, 1.6, .7, rnd() > .5 ? shade(col, .22) : shade(col, -.1), rnd() * 180, ' opacity=".9"'); }); }
    if (m === 'risotto') {
      out += C(0, 0, 31, shade(c[0], -.1)) + C(0, 0, 30, c[0]) + grains(28, c[0], 60);
      out += scatter(rnd, 24, 8, function (x, y) { return P('M-5 1a5 5 0 0 1 10 0z', c[1], S(shade(c[1], -.3), .5), 'translate(' + n(x) + ' ' + n(y) + ') rotate(' + n(rnd() * 360) + ')') + R(x, y + 2, 2, 3.4, '#e8dcc0', .6, rnd() * 20); });
      out += scatter(rnd, 25, 18, function (x, y) { return C(x, y, 1, c[2]); }) + scatter(rnd, 22, 5, function (x, y) { return E(x, y, 3.4, .9, '#fff3c8', rnd() * 180); });
    } else if (m === 'couscous') {
      out += C(0, 0, 31, shade(c[0], -.1)) + C(0, 0, 30, c[0]) + scatter(rnd, 29, 160, function (x, y) { return C(x, y, .6, rnd() > .5 ? shade(c[0], .25) : shade(c[0], -.15)); });
      out += scatter(rnd, 22, 7, function (x, y) { return C(x, y, 3.2, c[1], S(shade(c[1], -.2), .5)) + C(x, y, 1.2, shade(c[1], .25)); });
      out += scatter(rnd, 22, 5, function (x, y) { return E(x, y, 4.5, 2.4, c[2], rnd() * 180, S(shade(c[2], -.25), .5)); });
      out += scatter(rnd, 24, 12, function (x, y) { return C(x, y, 1.8, '#d8b06a', S('#b08a3f', .4)); });
    } else if (m === 'koshari') {
      out += C(0, 0, 32, '#efe4c4') + grains(30, '#efe4c4', 40);
      out += scatter(rnd, 25, 16, function (x, y) { return C(x, y, 1.8, c[1]); }) + scatter(rnd, 25, 9, function (x, y) { return R(x, y, 5, 2, '#f1d58a', 1, rnd() * 180, S('#c9a65a', .4)); });
      out += scatter(rnd, 25, 8, function (x, y) { return C(x, y, 2, '#d8b06a'); });
      out += '<path d="M-14 -4Q-6 -14 4 -6T20 -8"' + ' fill="none"' + S(c[2], 3.4, .92) + '/>' + scatter(rnd, 22, 12, function (x, y) { return '<path d="M0 0q3 -3 6 0" fill="none"' + S('#8a4b1a', 1.2) + ' transform="translate(' + n(x) + ' ' + n(y) + ') rotate(' + n(rnd() * 360) + ')"/>'; });
    } else if (m === 'jollof' || m === 'thieb' || m === 'biryani') {
      out += C(0, 0, 32, shade(c[0], -.12)) + C(0, 0, 31, c[0]) + grains(29, c[0], 110);
      out += scatter(rnd, 26, 14, function (x, y) { return C(x, y, 1.4, shade(c[0], -.3), ' opacity=".6"'); });
      if (m === 'jollof') {
        out += P('M0 0c8 -4 16 4 10 12c-6 6 -14 0 -10 -12z', '#c26a2c', S('#7a3f12', .6), 'translate(-6 -12) rotate(30)') + C(14, -8, 2.6, '#f6efe0', S('#d0c8b0', .6));
        for (var p = 0; p < 4; p++) out += E(-20 + p * 3, 14 + p * 4, 5, 2.8, c[1], 20, S('#a8742f', .5));
        out += scatter(rnd, 28, 10, function (x, y) { return leaf(x, y, 2.4, c[2], rnd() * 180); });
      } else if (m === 'thieb') {
        out += E(-4, -4, 13, 6, c[1], -25, S('#c9b890', .6)) + '<path d="M-14 -2l16 -8M-12 2l16 -8"' + S('#b8a578', .6, .8) + '/>' + C(7, -12, 1, '#2b2f3a');
        out += P('M0 0a9 9 0 0 1 18 0z', c[2], S('#2f5d27', .6), 'translate(8 22) rotate(-30)') + C(-18, 14, 4.5, '#e8873a') + C(-8, 22, 4, '#f6efe0') + C(18, -14, 3.6, '#e8873a');
      } else {
        out += scatter(rnd, 24, 6, function (x, y) { return E(x, y, 6, 4.2, '#b8742f', rnd() * 180, S('#7a4a1a', .6)); });
        out += scatter(rnd, 26, 10, function (x, y) { return C(x, y, 1.8, '#5a2f14'); }) + scatter(rnd, 27, 12, function (x, y) { return leaf(x, y, 2.5, c[2], rnd() * 180); }) + scatter(rnd, 27, 6, function (x, y) { return C(x, y, 1.6, c[1]); });
      }
    } else if (m === 'ugali') {
      out += C(-8, 0, 20, shade(c[0], -.12)) + C(-8, 0, 19, c[0]) + E(-13, -6, 9, 5, '#fff', -30, ' opacity=".5"');
      out += scatter(rnd, 11, 18, function (x, y) { return leaf(14 + x, 4 + y, 4.2, rnd() > .4 ? c[1] : shade(c[1], -.2), rnd() * 180); });
      out += C(-2, 21, 5, c[2], S(shade(c[2], -.2), .5)) + C(8, 22, 5, c[2], S(shade(c[2], -.2), .5)) + C(-1, 21, 1.4, '#f6a6a0') + C(9, 22, 1.4, '#f6a6a0');
    } else if (m === 'teriyaki') {
      out += C(-9, 0, 20, shade(c[0], -.1)) + C(-9, 0, 19, c[0]) + grains(16, c[0], 30).replace(/(<ellipse cx=")([-\d.]+)/g, function (_, a, b) { return a + (parseFloat(b) - 9); });
      out += scatter(rnd, 18, 12, function (x, y) { return E(x - 9, y, .9, .5, '#fff', rnd() * 180) + E(x - 9, y, .8, .4, '#8a6a3a', rnd() * 180); });
      for (var q = 0; q < 5; q++) out += R(16 + (q % 2) * 4, -18 + q * 9, 14, 7.5, c[1], 3, -8 + q * 5, S(shade(c[1], -.3), .5)) + R(14 + (q % 2) * 4, -20 + q * 9, 9, 2, shade(c[1], .35), 1, -8 + q * 5, ' opacity=".6"');
      out += scatter(rnd, 10, 12, function (x, y) { return R(16 + x, y, 3, .9, c[2], .4, rnd() * 180); });
    }
    return out;
  };

  T.grill = function (m, c, rnd) {
    var out, i;
    if (m === 'fajitas') {
      out = darkPan('#222', 46) + C(0, 0, 36, '#2b2b2b');
      out += scatter(rnd, 30, 7, function (x, y) { return E(x, y, 5, 3, '#fff', rnd() * 180, ' opacity=".25"'); });
      for (i = 0; i < 4; i++) out += P('M-8 0a9 9 0 0 1 16 0', 'none', S('#c9a0d8', 2.4), 'translate(' + (-14 + i * 11) + ' ' + (-12 + (i % 2) * 24) + ') rotate(' + (i * 70) + ')');
      for (i = 0; i < 9; i++) out += R(-18 + (i % 3) * 14 + rnd() * 4, -14 + Math.floor(i / 3) * 14 + rnd() * 4, 15, 5, c[0], 2.4, rnd() * 180, S('#a8742f', .5)) + '<path d="M-3 -1l2 2M1 -1l2 2"' + S('#6a4a20', .8) + tf(0, 0, 0) + ' transform="translate(' + (-18 + (i % 3) * 14) + ' ' + (-14 + Math.floor(i / 3) * 14) + ')"/>';
      for (i = 0; i < 10; i++) out += R(-22 + rnd() * 44, -22 + rnd() * 44, 13, 3.8, i % 2 ? c[1] : c[2], 1.8, rnd() * 180, ' opacity=".95"');
      return out;
    }
    out = plate();
    if (m === 'ribs') {
      [[-6, -14, -14], [4, 8, -14]].forEach(function (rk, k) {
        var x = rk[0], y = rk[1], rot = rk[2];
        out += G('translate(' + x + ' ' + y + ') rotate(' + rot + ')', R(1, 2, 62, 17, '#000', 6, 0, ' opacity=".2" filter="url(#dBlur)"') + R(0, 0, 62, 17, c[0], 6, 0, S(shade(c[0], -.3), .8)) + R(0, -2, 58, 8, c[1], 4, 0, ' opacity=".85"') +
          [-22, -11, 0, 11, 22].map(function (bx) { return '<path d="M' + bx + ' -8L' + bx + ' 8"' + S(shade(c[0], -.35), .9, .7) + '/>'; }).join('') +
          [-26, -15, -4, 7, 18, 29].map(function (bx) { return E(bx, 9.5, 2.6, 1.5, c[2], 0, S('#c9bda0', .4)); }).join('') +
          scatter(rnd, 26, 14, function (px, py) { return C(px, py * .3 - 1, .8, '#2b1208', ' opacity=".7"'); }) + E(-8, -4, 18, 2.2, '#fff', 0, ' opacity=".28"'));
      });
      out += '<path d="M-24 22q8 -6 16 0t16 0" fill="none"' + S('#7a1d12', 1.6, .8) + '/>';
    } else if (m === 'sausage') {
      var sp = 'M0 0'; for (i = 1; i <= 60; i++) sp += 'L' + n(Math.cos(i * .22) * (3 + i * .4)) + ' ' + n(Math.sin(i * .22) * (3 + i * .4));
      out += '<path d="' + sp + '" fill="none"' + S('#000', 10.5, .16) + ' transform="translate(1.5 2)"/>' + '<path d="' + sp + '" fill="none"' + S(c[1], 10) + '/>' + '<path d="' + sp + '" fill="none"' + S(c[0], 8.4) + '/>' + '<path d="' + sp + '" fill="none"' + S(shade(c[0], .35), 1.6, .7) + ' transform="translate(-1.5 -2)"/>';
      out += scatter(rnd, 24, 26, function (x, y) { return C(x, y, .9, '#2a0f06', ' opacity=".55"'); });
      out += '<path d="M-22 22q6 -6 12 0t12 0t12 0" fill="none"' + S(c[2], 2.2, .95) + '/>';
    } else if (m === 'slices') {
      for (i = 0; i < 5; i++) {
        var x = -16 + i * 9, y = -10 + i * 5;
        out += G('translate(' + x + ' ' + y + ') rotate(' + (-18 + i * 3) + ')', R(1.5, 2, 24, 31, '#000', 4, 0, ' opacity=".18"') + R(0, 0, 24, 31, c[0], 4, 0) + R(0, 0, 19.5, 26, shade(c[1], .05), 3, 0) + R(0, 0, 13, 20, shade(c[1], .25), 2, 0, ' opacity=".7"') + R(0, 12, 21, 3, c[2], 1, 0, ' opacity=".5"'));
      }
      out += scatter(rnd, 30, 10, function (x, y) { return leaf(x, y, 3, c[2] === '#2b6b2b' ? '#4f8a2e' : '#6a8a3a', rnd() * 180); });
    } else if (m === 'chicken') {
      for (i = 0; i < 3; i++) {
        var px = -8 + i * 6, py = -18 + i * 15;
        out += G('translate(' + px + ' ' + py + ') rotate(' + (-20 + i * 8) + ')', E(2, 2.5, 20, 9, '#000', 0, ' opacity=".2"') + E(-4, 0, 16, 9.5, c[0], 0, S(shade(c[0], -.3), .6)) + E(-5, -2, 11, 4, c[1], 0, ' opacity=".7"') + R(15, 0, 12, 3.8, '#efe4cf', 1.8, 0) + C(22, -2, 2.4, '#efe4cf') + C(22, 2, 2.4, '#efe4cf') + scatter(rnd, 12, 7, function (x, y) { return C(x - 4, y * .6, 1.1, '#3a1208', ' opacity=".6"'); }));
      }
      out += P('M0 0a8 8 0 0 1 16 0z', '#f7e04a', S('#c9b020', .6), 'translate(18 26) rotate(-15)') + C(-24, 22, 5, 'none', S('#a050b0', 1.6)) + leaf(-22, -22, 4, c[2], 40) + leaf(-12, 26, 4, c[2], -30);
    } else if (m === 'skewers') {
      for (i = 0; i < 3; i++) {
        var sy = -17 + i * 17;
        out += G('translate(0 ' + sy + ') rotate(-14)', R(0, 0, 66, 1.6, '#c9a46a', .8, 0) + [-22, -9, 4, 17].map(function (cx, k) { return (k % 2 ? R(cx, 0, 10, 9, c[1], 2, 0, S(shade(c[1], -.3), .5)) : R(cx, 0, 11, 9.5, c[0], 2.4, 0, S(shade(c[0], -.3), .5)) + R(cx - 1, -2, 6, 2, shade(c[0], .3), 1, 0, ' opacity=".6"')); }).join('') + C(-30, 0, 3, '#e0c8f0', ' opacity=".8"'));
      }
      out += P('M0 0a9 9 0 0 1 18 0z', '#f7e04a', S('#c9b020', .6), 'translate(14 28) rotate(-10)') + leaf(-24, 26, 4, c[2], 20);
    } else if (m === 'ham') {
      for (i = 0; i < 6; i++) {
        var ang = -.5 + i * .5, hx = Math.cos(ang) * 14 - 3, hy = Math.sin(ang) * 14 - 2;
        out += E(hx + 1, hy + 1.5, 21, 9, '#000', ang * 57 + 20, ' opacity=".16"') + E(hx, hy, 21, 9, c[0], ang * 57 + 20, S(c[2], .6)) + E(hx, hy, 17, 6, shade(c[0], .12), ang * 57 + 20) + E(hx, hy, 9, 3, c[1], ang * 57 + 20, ' opacity=".6"');
      }
    }
    return out;
  };

  T.flat = function (m, c, rnd) {
    var out, i;
    if (m === 'injera') {
      out = shadow(46) + C(0, 0, 46, '#cdbb92') + C(0, 0, 44.5, c[0]) + scatter(rnd, 43, 120, function (x, y) { return C(x, y, .5 + rnd() * .8, shade(c[0], -.22), ' opacity=".55"'); });
      var bl = [[-12, -12, c[1]], [10, -13, '#8a5a2a'], [14, 8, '#e3b04b'], [-8, 12, c[2]], [0, 0, '#f6efe0']];
      bl.forEach(function (b, k) { out += C(b[0] + .8, b[1] + 1.2, 10.5, '#000', ' opacity=".18"') + C(b[0], b[1], 10, b[2], S(shade(b[2], -.25), .6)) + C(b[0] - 2, b[1] - 2.5, 3.8, shade(b[2], .3), ' opacity=".5"'); });
      out += E(0, 0, 6, 4.6, '#fffaf0', 0, S('#d9d3c0', .5)) + C(0, 0, 2.2, '#f2a62a');
      return out;
    }
    out = plate();
    if (m === 'naan') {
      var np = 'M-34 6Q-33 -22 4 -24Q36 -22 34 8Q30 28 -4 26Q-30 26 -34 6Z';
      out += P(np, '#000', ' opacity=".18"', 'translate(1.5 2)') + P(np, c[0], S(shade(c[0], -.3), .8)) + P('M-28 4Q-27 -16 2 -19', 'none', S(shade(c[0], .3), 2.4, .5));
      out += scatter(rnd, 28, 16, function (x, y) { return E(x, y * .8, 3 + rnd() * 3, 2 + rnd() * 2, shade(c[0], -.3), rnd() * 180, ' opacity=".5"'); });
      out += scatter(rnd, 28, 24, function (x, y) { return R(x, y * .8, 2.6, 1.2, c[2], .5, rnd() * 180); }) + scatter(rnd, 25, 10, function (x, y) { return E(x, y * .8, 3.5, 1.6, '#fff3c8', rnd() * 180, ' opacity=".5"'); });
    } else if (m === 'taco') {
      for (i = 0; i < 3; i++) {
        var a = -30 + i * 30, tx = -20 + i * 18, ty = 16 - i * 4;
        out += G('translate(' + tx + ' ' + ty + ') rotate(' + (a - 90) + ')', P('M-16 0A16 16 0 0 1 16 0Z', '#000', ' opacity=".18"', 'translate(1 2)') + P('M-16 0A16 16 0 0 1 16 0Z', c[0], S(shade(c[0], -.25), .7)) + P('M-12 -1A12 12 0 0 1 12 -1Z', shade(c[0], .12), '') +
          scatter(rnd, 10, 10, function (x, y) { return C(x * .9, -3 + y * .5, 2.3, c[1]); }) + scatter(rnd, 10, 5, function (x, y) { return R(x, -3 + y * .5, 3, 2.6, '#f2c230', .6, rnd() * 90); }) + scatter(rnd, 11, 8, function (x, y) { return leaf(x, -3 + y * .6, 2, c[2], rnd() * 180); }));
      }
      out += C(24, 26, 4.2, '#7aa53a', S('#4f7a1a', .5)) + C(-26, -24, 3, '#e0425a');
    } else if (m === 'quesadilla') {
      for (i = 0; i < 3; i++) {
        var qa = -10 + i * 5;
        out += G('translate(' + (-10 + i * 7) + ' ' + (-12 + i * 10) + ') rotate(' + qa + ')', P('M-20 10Q0 -24 20 10Z', '#000', ' opacity=".18"', 'translate(1 2)') + P('M-20 10Q0 -24 20 10Z', c[0], S(shade(c[0], -.3), .7)) + P('M-20 10H20', 'none', S(c[1], 3.2)) + scatter(rnd, 11, 6, function (x, y) { return R(x, y - 3, 6, .9, shade(c[0], -.35), .4, 40); }));
      }
      out += C(24, 24, 4.2, '#7aa53a') + leaf(-26, 24, 3.4, c[2], 30);
    } else if (m === 'tostada') {
      [[-14, -12], [14, -10], [0, 14]].forEach(function (p, k) {
        out += C(p[0] + 1, p[1] + 1.5, 15, '#000', ' opacity=".18"') + C(p[0], p[1], 15, c[0], S(shade(c[0], -.3), .6)) + C(p[0], p[1], 12.5, c[2], ' opacity=".9"') +
          scatter(rnd, 10, 8, function (x, y) { return C(p[0] + x, p[1] + y, 2.4, c[1], S(shade(c[1], -.25), .4)); }) + C(p[0] + 1, p[1], 3.4, '#f6efe0', ' opacity=".9"') + C(p[0] - 4, p[1] + 5, 1.8, '#e0425a');
      });
    } else if (m === 'wrap') {
      [[-8, -14, -20], [8, 12, -20]].forEach(function (b, k) {
        out += G('translate(' + b[0] + ' ' + b[1] + ') rotate(' + b[2] + ')', R(1, 2, 54, 24, '#000', 11, 0, ' opacity=".18"') + R(0, 0, 54, 24, c[0], 11, 0, S(shade(c[0], -.3), .7)) + R(-14, -2, 26, 14, shade(c[0], .1), 6, 0, ' opacity=".6"') + '<path d="M-24 -6Q-10 -10 4 -6"' + ' fill="none"' + S(shade(c[0], -.28), .7) + '/>' +
          E(25, 0, 7, 11.5, shade(c[0], -.12), 0, S(shade(c[0], -.3), .6)) + E(25, 0, 5.4, 9.5, '#f2e4b8', 0) + C(24, -3, 2.4, c[1]) + C(25, 3, 2.2, '#4a2a18') + C(27, 0, 1.8, c[2]) + C(23, 4, 1.6, '#f2c230'));
      });
    } else if (m === 'enchilada') {
      for (i = 0; i < 3; i++) {
        out += R(-1 + 1, -16 + i * 16 + 1, 52, 14, '#000', 7, -6, ' opacity=".16"') + R(0, -16 + i * 16, 52, 14, c[0], 7, -6, S(shade(c[0], -.25), .6));
      }
      out += R(0, -2, 54, 52, c[1], 10, -6, ' opacity=".78"') + scatter(rnd, 24, 28, function (x, y) { return C(x, y, 1.2 + rnd() * 2, shade(c[1], rnd() > .5 ? -.2 : .25), ' opacity=".6"'); });
      out += '<path d="M-24 -4l4 -4l4 4l4 -4l4 4l4 -4l4 4l4 -4l4 4l4 -4"' + ' fill="none"' + S(c[2], 2.2, .95) + '/>' + '<path d="M-24 12l4 -4l4 4l4 -4l4 4l4 -4l4 4l4 -4l4 4"' + ' fill="none"' + S(c[2], 2, .95) + '/>';
      out += scatter(rnd, 25, 18, function (x, y) { return R(x, y, 3, 1.6, '#fffaf0', .4, rnd() * 180); }) + scatter(rnd, 25, 8, function (x, y) { return leaf(x, y, 2.3, '#4f8a2e', rnd() * 180); });
    } else if (m === 'pita') {
      [[-8, -14, -10], [6, 14, 8]].forEach(function (b) {
        out += G('translate(' + b[0] + ' ' + b[1] + ') rotate(' + b[2] + ')', P('M-26 4A26 26 0 0 1 26 4Z', '#000', ' opacity=".18"', 'translate(1 2)') + P('M-26 4A26 26 0 0 1 26 4Z', c[0], S(shade(c[0], -.3), .7)) + P('M-23 3A23 23 0 0 1 23 3Z', shade(c[0], .12), '') +
          scatter(rnd, 17, 8, function (x, y) { return R(x, -6 + y * .35, 9, 3.4, c[1], 1.4, rnd() * 40 - 20, S(shade(c[1], -.3), .4)); }) + scatter(rnd, 16, 4, function (x, y) { return C(x, -6 + y * .4, 2.6, c[2]); }) + scatter(rnd, 16, 6, function (x, y) { return R(x, -5 + y * .4, 6, 1, '#fffaf0', .4, 0); }));
      });
    } else if (m === 'galette') {
      out += G('rotate(8)', R(1, 2, 66, 66, '#000', 4, 0, ' opacity=".2"') + R(0, 0, 66, 66, c[0], 3, 0, S(shade(c[0], -.3), .7)) + scatter(rnd, 30, 40, function (x, y) { return C(x, y, 1 + rnd() * 1.4, shade(c[0], rnd() > .5 ? -.22 : .22), ' opacity=".6"'); }) + R(0, 0, 36, 36, '#f4dca0', 1.5, 0) + R(0, 0, 36, 36, 'none', 1.5, 0, S(shade(c[0], -.15), 1)) +
        scatter(rnd, 14, 10, function (x, y) { return R(x, y, 8, 5, c[2], 1.6, rnd() * 180, S(shade(c[2], -.2), .4)); }) + C(0, 0, 8.5, '#fffaf0', S('#e6dcc0', .5)) + C(0, 0, 3.8, '#f2a62a') + C(-1.2, -1.2, 1.2, '#fff', ' opacity=".6"'));
    } else if (m === 'toast') {
      [[-6, -12, -8], [4, 12, 6]].forEach(function (b, k) {
        out += G('translate(' + b[0] + ' ' + b[1] + ') rotate(' + b[2] + ')', R(1, 2, 44, 28, '#000', 4, 0, ' opacity=".18"') + R(0, 3, 42, 5, c[2], 1, 0) + R(0, 0, 42, 24, c[0], 4, 0, S(shade(c[0], -.3), .7)) + R(0, -1, 36, 19, c[1], 3, 0) +
          scatter(rnd, 16, 12, function (x, y) { return E(x, y * .7, 4, 2.6, shade(c[1], -.3), rnd() * 180, ' opacity=".55"'); }) + scatter(rnd, 16, 6, function (x, y) { return E(x, y * .7, 3, 1.3, '#fff0b0', rnd() * 180, ' opacity=".5"'); }));
      });
    } else if (m === 'crepe') {
      [[-8, -10, 20], [10, 10, -25]].forEach(function (b, k) {
        out += G('translate(' + b[0] + ' ' + b[1] + ') rotate(' + b[2] + ')', P('M-24 18Q0 -34 24 18Q0 8 -24 18Z', '#000', ' opacity=".16"', 'translate(1 2)') + P('M-24 18Q0 -34 24 18Q0 8 -24 18Z', c[0], S(shade(c[0], -.3), .6)) + P('M-12 14Q0 -14 12 14', 'none', S(shade(c[0], -.2), .8, .7)) +
          scatter(rnd, 18, 22, function (x, y) { return C(x, y * .7 - 2, .9, '#fff', ' opacity=".9"'); }) + scatter(rnd, 14, 8, function (x, y) { return C(x, y * .6, 1.3, shade(c[0], -.3), ' opacity=".5"'); }));
      });
      out += P('M0 0a8 8 0 0 1 16 0z', c[1], S('#c9b020', .8), 'translate(14 26) rotate(-20)') + P('M2 -2a6 6 0 0 1 12 0z', shade(c[1], .4), '', 'translate(14 26) rotate(-20)');
    }
    return out;
  };

  T.bites = function (m, c, rnd) {
    var out = plate(), i;
    function dip(x, y, col) { return C(x + .8, y + 1, 8, '#000', ' opacity=".18"') + C(x, y, 8, '#f1eee6', S('#d6d3c9', .6)) + C(x, y, 6, col) + C(x - 1.6, y - 1.6, 2, '#fff', ' opacity=".45"'); }
    if (m === 'samosa') {
      [[-14, -12, 15], [14, -8, -10], [0, 16, 40]].forEach(function (p) {
        out += tri(p[0] + 1, p[1] + 1.5, 15, '#000', p[2], ' opacity=".18"') + tri(p[0], p[1], 15, c[0], p[2]) + tri(p[0], p[1], 11, shade(c[0], .12), p[2]) + tri(p[0], p[1], 15, 'none', p[2], S(shade(c[0], -.3), .5)) +
          scatter(rnd, 8, 10, function (x, y) { return C(p[0] + x, p[1] + y, .9, shade(c[0], -.35), ' opacity=".6"'); }) + E(p[0] - 3, p[1] - 4, 4, 1.6, '#fff', p[2], ' opacity=".3"');
      });
      out += dip(-24, 26, c[1]) + dip(26, 24, c[2]);
    } else if (m === 'fritter') {
      out += scatter(rnd, 25, 8, function (x, y) { var r = 7 + rnd() * 2; return C(x + 1, y + 1.5, r, '#000', ' opacity=".16"') + C(x, y, r, c[0], S(shade(c[0], -.3), .6)) + scatter(rnd, r - 2, 7, function (a, b) { return C(x + a, y + b, 1 + rnd() * 1.4, rnd() > .5 ? c[1] : shade(c[0], -.3), ' opacity=".8"'); }) + C(x - 2, y - 2.5, 2.3, shade(c[0], .35), ' opacity=".55"'); });
      out += dip(28, 28, c[2]);
    } else if (m === 'nachos') {
      out += scatter(rnd, 30, 26, function (x, y) { return tri(x, y, 8 + rnd() * 2, c[0], rnd() * 360, S(shade(c[0], -.25), .4)); });
      out += '<path d="M-24 -8Q-14 -22 0 -10T24 -6M-20 10Q-8 0 4 12T26 14" fill="none"' + S(c[1], 3.6, .95) + '/>';
      out += scatter(rnd, 26, 7, function (x, y) { return C(x, y, 2.6, c[2], S('#2f5d27', .8)) + C(x, y, 1, c[1]); }) + scatter(rnd, 27, 12, function (x, y) { return R(x, y, 2.2, 2.2, '#e0425a', .5, rnd() * 90); });
      out += C(18, 20, 5, '#7aa53a', S('#4f7a1a', .5)) + C(-20, 18, 4.5, '#f6efe0', S('#d6d3c9', .5));
    } else if (m === 'plantain') {
      out += scatter(rnd, 26, 14, function (x, y) { var rot = rnd() * 90; return R(x + .8, y + 1, 9, 9, '#000', 2, rot, ' opacity=".16"') + R(x, y, 9, 9, c[0], 2.4, rot, S(c[1], 1)) + R(x - 1, y - 1, 4, 3.5, shade(c[0], .35), 1.2, rot, ' opacity=".5"') + C(x + 1, y + 1, .7, c[1]); });
      out += dip(26, 26, c[2]) + scatter(rnd, 30, 8, function (x, y) { return C(x, y, .9, '#d8b06a'); });
    } else if (m === 'sushi') {
      out = shadow(46) + R(0, 0, 84, 60, '#2e2e30', 6, 0) + R(0, 0, 82, 58, '#3b3b3e', 5, 0) + R(-18, -18, 26, 1, '#fff', .4, 0, ' opacity=".06"');
      [-26, -10, 6].forEach(function (x, k) {
        out += C(x + 1, -9 + 1.5, 8, '#000', ' opacity=".3"') + C(x, -9, 8, c[2]) + C(x, -9, 5.8, '#f8f8f0') + C(x, -9, 3, k === 1 ? '#7aa53a' : c[1]) + C(x - 1, -10, 1, '#fff', ' opacity=".5"');
      });
      [-26, -6, 14].forEach(function (x, k) {
        out += R(x + 1, 13 + 1.5, 18, 8, '#000', 3, 0, ' opacity=".3"') + R(x, 13, 18, 8, '#f8f8f0', 3, 0) + R(x, 11, 19, 7, k === 1 ? '#d9532a' : c[1], 3, 0) + '<path d="M' + (x - 7) + ' 10l14 0M' + (x - 5) + ' 12.5l12 0"' + S(shade(k === 1 ? '#d9532a' : c[1], .35), .8, .8) + '/>';
      });
      out += C(30, 8, 5, '#7aa53a', S('#4f7a1a', .6)) + C(30, -10, 6, '#f2a0a8') + C(32, -12, 3, '#f7c0c4');
    } else if (m === 'dumpling') {
      out += scatter(rnd, 0, 0, function () { return ''; });
      var pts = [[-24, -12], [-8, -16], [10, -14], [-20, 8], [-2, 6], [18, 8]];
      pts.forEach(function (p, k) {
        out += G('translate(' + p[0] + ' ' + p[1] + ') rotate(' + (-10 + k * 6) + ')', P('M-9 4Q-9 -10 0 -10Q9 -10 9 4Q0 8 -9 4Z', '#000', ' opacity=".18"', 'translate(1 1.5)') + P('M-9 4Q-9 -10 0 -10Q9 -10 9 4Q0 8 -9 4Z', c[0], S(shade(c[0], -.25), .6)) +
          '<path d="M-7 -3l1.8 -2.4M-4 -5l1.8 -2.4M-1 -6.4l1.8 -2M2 -6l1.8 -2M5 -4l1.4 -1.8" fill="none"' + S(shade(c[0], -.3), .8) + '/>' + P('M-7 5Q0 8 7 5', 'none', S(c[1], 1.8)) + E(-3, -3, 3, 1.4, '#fff', 0, ' opacity=".4"'));
      });
      out += dip(26, 26, c[2]);
    } else if (m === 'roll') {
      [[-6, -16, -22], [0, 4, -22], [6, 22, -22]].forEach(function (p, k) {
        out += G('translate(' + p[0] + ' ' + p[1] + ') rotate(' + p[2] + ')', R(1, 2, 50, 12, '#000', 6, 0, ' opacity=".18"') + R(0, 0, 50, 12, c[0], 6, 0, S(shade(c[0], -.3), .6)) + R(-2, -2, 40, 3.4, shade(c[0], .4), 1.6, 0, ' opacity=".5"') +
          (k === 1 ? E(25, 0, 6, 6, shade(c[0], -.1), 0) + E(25, 0, 4.6, 4.6, '#f2e4b8', 0) + C(24, -1, 1.6, c[1]) + C(26, 1.5, 1.4, c[2]) : ''));
      });
      out += dip(27, -24, c[2]);
    } else if (m === 'tamal') {
      [[-6, -18, -12], [4, 4, 8], [-10, 24, -8]].forEach(function (p, k) {
        out += G('translate(' + p[0] + ' ' + p[1] + ') rotate(' + p[2] + ')', R(1, 2, 48, 16, '#000', 7, 0, ' opacity=".18"') + R(0, 0, 48, 16, c[0], 7, 0, S(shade(c[0], -.3), .6)) + [-16, -8, 0, 8, 16].map(function (x) { return '<path d="M' + x + ' -7q2 7 0 14"' + ' fill="none"' + S(shade(c[0], -.3), .6, .8) + '/>'; }).join('') + R(-16, 0, 1.6, 16, '#8a6a3a', 0, 0));
      });
      out += E(26, 4, 8, 6, '#f2c230', 0, S('#c99a1a', .6)) + C(26, 4, 2.4, c[1]) + C(-26, 24, 3.4, c[2]);
    } else if (m === 'pie') {
      [[-14, -12, 18], [14, -8, -8], [0, 16, 36]].forEach(function (p) {
        out += tri(p[0] + 1, p[1] + 1.5, 15, '#000', p[2], ' opacity=".18"') + tri(p[0], p[1], 15, c[0], p[2]) + tri(p[0], p[1], 11, shade(c[0], .15), p[2]) + '<path d="M' + (p[0] - 6) + ' ' + p[1] + 'l12 0M' + (p[0] - 4) + ' ' + (p[1] + 4) + 'l8 0"' + S(shade(c[0], -.25), .6) + tf(p[0], p[1], p[2]) + '/>' +
          C(p[0] + 7, p[1] + 3, 2.6, c[1]) + scatter(rnd, 7, 7, function (x, y) { return C(p[0] + x, p[1] + y, .7, '#fff3c8'); });
      });
      out += leaf(-24, 26, 4, c[1], 20);
    } else if (m === 'dolma') {
      for (i = 0; i < 9; i++) { var dx = -18 + (i % 3) * 18 + (Math.floor(i / 3) % 2) * 4, dy = -16 + Math.floor(i / 3) * 16; out += R(dx + .8, dy + 1.5, 15, 8, '#000', 4, 8, ' opacity=".16"') + R(dx, dy, 15, 8, c[0], 4, 8, S(shade(c[0], -.3), .6)) + R(dx - 1, dy - 1, 9, 1.8, shade(c[0], .35), 1, 8, ' opacity=".6"') + '<path d="M' + (dx - 4) + ' ' + (dy - 3) + 'l8 6"' + S(shade(c[0], -.3), .5) + '/>'; }
      out += P('M0 0a8 8 0 0 1 16 0z', '#f7e04a', S('#c9b020', .7), 'translate(14 30) rotate(-20)') + C(-26, 28, 3.8, c[2], S('#a8742f', .5));
    } else if (m === 'croquette') {
      var cp = [[-20, -14], [0, -18], [20, -12], [-14, 8], [8, 6], [24, 14]];
      cp.forEach(function (p, k) {
        var rot = -20 + k * 14;
        out += E(p[0] + 1, p[1] + 1.5, 10, 7, '#000', rot, ' opacity=".18"') + E(p[0], p[1], 10, 7, c[0], rot, S(shade(c[0], -.3), .6)) + scatter(rnd, 7, 8, function (x, y) { return C(p[0] + x, p[1] + y * .7, .7, shade(c[0], rnd() > .5 ? -.3 : .3), ' opacity=".8"'); }) + E(p[0] - 3, p[1] - 3, 4, 1.6, '#fff', rot, ' opacity=".35"');
      });
      out += E(-6, 24, 9, 7, shade(c[0], -.1), 0) + E(-6, 24, 6.8, 5.2, c[1], 0) + C(-8, 23, 1.2, '#e8d9a0') + leaf(-26, 20, 3.4, c[2], 30) + leaf(26, -26, 3.2, c[2], -40);
    } else if (m === 'bravas') {
      out += scatter(rnd, 27, 16, function (x, y) { var rot = rnd() * 90; return R(x + .8, y + 1, 9, 9, '#000', 2, rot, ' opacity=".14"') + R(x, y, 9, 9, c[0], 2, rot, S(shade(c[0], -.28), .6)) + R(x - 1, y - 1, 4, 3.5, shade(c[0], .35), 1.2, rot, ' opacity=".55"'); });
      out += '<path d="M-26 -8q6 -8 12 0t12 0t12 0t12 0M-22 10q6 -8 12 0t12 0t12 0" fill="none"' + S(c[1], 3.2, .95) + '/>' + '<path d="M-24 2q6 -6 12 0t12 0t12 0t12 0" fill="none"' + S(c[2], 2.2, .95) + '/>' + leaf(24, -26, 3.4, '#4f8a2e', 30);
    }
    return out;
  };

  T.veg = function (m, c, rnd) {
    var out, i;
    if (m === 'rata') {
      out = plate(); var cols = [c[2], c[1], c[0], '#e8c14a'];
      for (i = 0; i < 26; i++) { var a = i * .62, d = 3 + i * 1.22; out += C(Math.cos(a) * d + .8, Math.sin(a) * d + 1, 6.4, '#000', ' opacity=".14"'); }
      for (i = 25; i >= 0; i--) { var a2 = i * .62, d2 = 3 + i * 1.22, col = cols[i % 3]; out += C(Math.cos(a2) * d2, Math.sin(a2) * d2, 6.4, col, S(shade(col, -.3), .5)) + C(Math.cos(a2) * d2 - 1, Math.sin(a2) * d2 - 1.4, 2.4, shade(col, .35), ' opacity=".45"'); }
      out += leaf(0, 0, 4.2, '#4f8a2e', 20) + leaf(2, 2, 3.4, '#5b8c3a', -50);
      return out;
    }
    if (m === 'guac') {
      out = plate() + C(0, 0, 0, '#fff');
      for (i = 0; i < 9; i++) { var ga = i * .7; out += tri(Math.cos(ga) * 30, Math.sin(ga) * 30, 8, '#e3b04b', ga * 57 + 90, S('#b8862a', .4)); }
      out += C(.8, 1.5, 20, '#000', ' opacity=".18"') + C(0, 0, 20, '#f1eee6', S('#d6d3c9', .8)) + C(0, 0, 17, c[0]) + scatter(rnd, 15, 22, function (x, y) { return C(x, y, 1.3 + rnd() * 2, shade(c[0], rnd() > .5 ? -.2 : .25), ' opacity=".7"'); }) +
        scatter(rnd, 14, 7, function (x, y) { return R(x, y, 3, 3, c[1], .6, rnd() * 90); }) + scatter(rnd, 14, 5, function (x, y) { return R(x, y, 2.6, 2.6, '#f6efe0', .6, rnd() * 90); }) + scatter(rnd, 14, 7, function (x, y) { return leaf(x, y, 2, '#3f7a2e', rnd() * 180); });
      return out;
    }
    out = plate();
    if (m === 'corn') {
      out += R(0, 0, 60, 18, '#000', 9, -12, ' opacity=".18"') + R(0, 0, 60, 17, c[0], 8.5, -12, S(shade(c[0], -.3), .8));
      out += G('rotate(-12)', [-24, -16, -8, 0, 8, 16, 24].map(function (x) { return [-6, -2, 2, 6].map(function (y) { return C(x, y, 2.4, shade(c[0], (x + y) % 3 ? .2 : -.1), ' opacity=".9"'); }).join(''); }).join('') + R(0, -5, 52, 2.4, '#fff', 1, 0, ' opacity=".25"') + R(-6, 2, 30, 4, '#f7e08a', 2, 0, ' opacity=".8"') + scatter(rnd, 24, 14, function (x, y) { return C(x, y * .3, 1.2, c[2], ' opacity=".9"'); }) + scatter(rnd, 24, 12, function (x, y) { return R(x, y * .3, 2.6, 1.2, c[1], .5, rnd() * 180); }));
      out += P('M-34 -14Q-44 -4 -38 8Q-32 0 -30 -12Z', '#7aa53a', S('#4f7a1a', .6)) + P('M-34 -10Q-40 -2 -36 6', 'none', S('#4f7a1a', .6));
      out += '<path d="M-28 22Q-18 16 -8 22T14 22"' + ' fill="none"' + S('#d03b2b', 0) + '/>';
    } else if (m === 'salad') {
      out += scatter(rnd, 28, 18, function (x, y) { return leaf(x, y, 8, rnd() > .5 ? c[0] : shade(c[0], .2), rnd() * 180); });
      out += scatter(rnd, 26, 6, function (x, y) { return P('M-6 0A6 6 0 0 1 6 0Z', c[1], S(shade(c[1], -.25), .5), 'translate(' + n(x) + ' ' + n(y) + ') rotate(' + n(rnd() * 360) + ')') + E(x, y - 1, 2.4, 1, '#fff', 0, ' opacity=".4"'); });
      out += scatter(rnd, 25, 6, function (x, y) { return C(x, y, 4.4, '#d6e8b4', S('#8fb866', 1)) + C(x, y, 2.6, '#eaf5d0') + C(x, y, .6, '#9ec06e'); });
      out += scatter(rnd, 22, 5, function (x, y) { return C(x, y, 3.3, 'none', S('#9a4a8a', 1.4)); });
      out += R(0, 0, 15, 11, c[2], 1.8, -10, S('#d6d3c9', .6)) + R(-1, -2, 8, 4, '#fff', 1, -10, ' opacity=".6"');
      out += scatter(rnd, 25, 7, function (x, y) { return E(x, y, 2.6, 2, '#2b2230', 0, S('#4a3a5a', .5)) + C(x - .6, y - .6, .7, '#fff', ' opacity=".5"'); }) + scatter(rnd, 28, 16, function (x, y) { return C(x, y, .5, '#6a8a3a'); });
    } else if (m === 'dip') {
      for (i = 0; i < 8; i++) { var da = i * .785 + .2; out += P('M-8 -7L8 -7L0 9Z', '#e8c58a', S('#b88a4a', .5), 'translate(' + n(Math.cos(da) * 30) + ' ' + n(Math.sin(da) * 30) + ') rotate(' + n(da * 57 + 90) + ')') + P('M-6 -5L6 -5L0 6Z', '#f3dcae', '', 'translate(' + n(Math.cos(da) * 30) + ' ' + n(Math.sin(da) * 30) + ') rotate(' + n(da * 57 + 90) + ')'); }
      out += C(.8, 1.5, 21, '#000', ' opacity=".18"') + C(0, 0, 21, '#f1eee6', S('#d6d3c9', .8)) + C(0, 0, 18, c[0]) + C(-4, -5, 10, '#fff', ' opacity=".4"');
      var sw = 'M0 0'; for (i = 1; i <= 26; i++) sw += 'L' + n(Math.cos(i * .55) * i * .55) + ' ' + n(Math.sin(i * .55) * i * .55);
      out += '<path d="' + sw + '" fill="none"' + S('#c9b020', 1.3, .8) + '/>' + C(0, 0, 3, '#2b2230') + scatter(rnd, 13, 12, function (x, y) { return leaf(x, y, 1.8, c[1], rnd() * 180); });
    } else if (m === 'pisto') {
      out += C(0, 0, 31, shade(c[0], -.2)) + C(0, 0, 30, c[0]) + scatter(rnd, 29, 70, function (x, y) { var k = rnd(); return R(x, y, 4.6, 4.6, k < .4 ? '#d03b2b' : k < .7 ? c[1] : '#e8873a', 1, rnd() * 90, S('#00000022', .3)); });
      out += C(1, 1.5, 13, '#000', ' opacity=".18"') + P('M-13 0Q-14 -11 -3 -13Q10 -16 14 -4Q16 8 4 12Q-9 15 -13 0Z', '#fffaf0', S('#e6dcc0', .6)) + C(0, 0, 6, c[2]) + C(-1.6, -1.8, 2, '#fff', ' opacity=".6"') + P('M-10 -4Q-6 -9 0 -9', 'none', S('#d6c8a0', 1, .7));
      out += scatter(rnd, 28, 6, function (x, y) { return leaf(x, y, 2.4, c[1], rnd() * 180); });
    }
    return out;
  };

  T.bread = function (m, c, rnd) {
    var out = plate(), i;
    if (m === 'bruschetta') {
      [[-16, -14, -14], [14, -10, 12], [-2, 16, -4]].forEach(function (p) {
        out += G('translate(' + p[0] + ' ' + p[1] + ') rotate(' + p[2] + ')', R(1, 2, 31, 21, '#000', 6, 0, ' opacity=".18"') + R(0, 0, 31, 21, shade(c[0], -.15), 6, 0) + R(0, 0, 27, 17, c[0], 5, 0) + scatter(rnd, 10, 10, function (x, y) { return R(x, y * .8, 3.6, 3.6, c[1], .8, rnd() * 90, S(shade(c[1], -.25), .3)) + C(x - .6, y * .8 - .6, .7, shade(c[1], .4), ' opacity=".7"'); }) + leaf(3, -2, 4.6, c[2], 20) + E(-6, -5, 7, 1.4, '#fff', 0, ' opacity=".35"'));
      });
    } else if (m === 'focaccia') {
      out += R(1, 2, 62, 44, '#000', 7, -6, ' opacity=".18"') + R(0, 0, 62, 44, shade(c[0], -.15), 7, -6) + R(0, 0, 58, 40, c[0], 6, -6) +
        G('rotate(-6)', scatter(rnd, 26, 34, function (x, y) { return C(x * 1.1, y * .72, 1.3, shade(c[0], -.28), ' opacity=".7"') + C(x * 1.1 - .3, y * .72 - .3, .6, shade(c[0], .3), ' opacity=".6"'); }) + [[-18, -6, 20], [8, 6, -10], [18, -10, 40]].map(function (s) { return '<path d="M' + s[0] + ' ' + s[1] + 'l9 0" ' + S(c[2], .9) + tf(s[0], s[1], s[2]) + '/>' + [1, 2, 3, 4, 5].map(function (k) { return '<path d="M' + (s[0] + k * 1.7) + ' ' + s[1] + 'l1 -2.4M' + (s[0] + k * 1.7) + ' ' + s[1] + 'l1 2.4"' + S(c[1], .8) + tf(s[0], s[1], s[2]) + '/>'; }).join(''); }).join('') + scatter(rnd, 26, 16, function (x, y) { return C(x * 1.1, y * .72, .5, '#fff'); }) + E(-8, -14, 22, 2.4, '#fff', 0, ' opacity=".25"'));
    } else if (m === 'cornbread') {
      [[-14, -14], [14, -14], [-14, 14], [14, 14]].forEach(function (p, k) {
        out += R(p[0] + .8, p[1] + 1.5, 26, 26, '#000', 4, 0, ' opacity=".16"') + R(p[0], p[1], 26, 26, c[1], 4, 0) + R(p[0], p[1], 23.5, 23.5, c[0], 3, 0) + scatter(rnd, 9, 10, function (x, y) { return C(p[0] + x, p[1] + y, .8, shade(c[0], rnd() > .5 ? -.2 : .3), ' opacity=".7"'); }) + R(p[0] - 3, p[1] - 8, 12, 1.8, '#fff', .8, 0, ' opacity=".3"');
      });
      out += R(0, 0, 11, 8, c[2], 1.6, -8, S('#c9b020', .5)) + R(-1, -1.5, 6, 2, '#fff', .8, -8, ' opacity=".5"');
    } else if (m === 'pantomate') {
      [[-14, -16, -20], [10, -6, 15], [-6, 18, -6]].forEach(function (p) {
        out += G('translate(' + p[0] + ' ' + p[1] + ') rotate(' + p[2] + ')', E(1, 2, 24, 11.5, '#000', 0, ' opacity=".18"') + E(0, 0, 24, 11.5, c[0], 0, S(shade(c[0], -.3), .7)) + E(0, 0, 20.5, 8.4, '#f3dcae', 0) + E(0, 0, 18, 6.6, c[1], 0, ' opacity=".82"') +
          scatter(rnd, 14, 14, function (x, y) { return C(x, y * .45, 1.2 + rnd() * .8, shade(c[1], rnd() > .5 ? -.25 : .3), ' opacity=".7"'); }) + E(-6, -3, 9, 1.4, '#fff', 0, ' opacity=".5"') + scatter(rnd, 16, 8, function (x, y) { return C(x, y * .5, .5, '#fff'); }));
      });
      out += leaf(26, 24, 3.6, c[2], 30);
    }
    return out;
  };

  T.dessert = function (m, c, rnd) {
    var out = plate(), i;
    if (m === 'tiramisu') {
      out += R(1, 3, 48, 36, '#000', 3, 0, ' opacity=".14" filter="url(#dBlur)"');
      out += R(0, 11, 46, 6, c[0], 1, 0) + R(0, 5.5, 46, 5, c[1], 1, 0) + R(0, 1, 46, 4.5, c[0], 1, 0) + R(0, -3.5, 46, 4.5, c[1], 1, 0) + '<path d="M-23 6.5H23M-23 0H23" ' + S('#fff', .6, .5) + '/>';
      out += R(0, -15, 46, 14, shade(c[2], .12), 2.4) + scatter(rnd, 22, 90, function (x, y) { return C(x * 1.03, -15 + y * .3, .55 + rnd() * .7, rnd() > .5 ? c[2] : shade(c[2], .4), ' opacity=".85"'); });
      out += leaf(14, -16, 4.2, '#4f8a2e', 30) + C(-14, -16, 2.2, '#5a2f14', S('#3a1a0a', .4)) + C(-9, -13, 2, '#5a2f14', S('#3a1a0a', .4));
    } else if (m === 'cream' || m === 'brulee') {
      out += C(.8, 1.5, 33, '#000', ' opacity=".16"') + C(0, 0, 33, '#fbfaf6', S('#d6d3c9', .8)) + C(0, 0, 30, '#efece4') + C(0, 0, 27, m === 'brulee' ? shade(c[0], -.3) : c[0]);
      if (m === 'brulee') {
        out += C(0, 0, 26, c[0]) + C(0, 0, 26, 'none', S(c[2], 2.4, .7)) + scatter(rnd, 22, 10, function (x, y) { return '<path d="M0 0l' + n(rnd() * 12 - 6) + ' ' + n(rnd() * 12 - 6) + 'l' + n(rnd() * 8 - 4) + ' ' + n(rnd() * 8 - 4) + '" fill="none"' + S(c[2], .6, .8) + ' transform="translate(' + n(x) + ' ' + n(y) + ')"/>'; });
        out += E(-8, -10, 14, 5, '#fff', -35, ' opacity=".4"') + scatter(rnd, 22, 20, function (x, y) { return C(x, y, .8, shade(c[0], .35), ' opacity=".7"'); }) + R(10, 12, 5, 1.2, c[1], .5, -30, ' opacity=".7"');
      } else {
        var sp = 'M0 0'; for (i = 1; i <= 30; i++) sp += 'L' + n(Math.cos(i * .5) * i * .72) + ' ' + n(Math.sin(i * .5) * i * .72);
        out += C(0, 0, 14, c[1], ' opacity=".8"') + '<path d="' + sp + '" fill="none"' + S(c[1], 2, .9) + '/>' + E(-8, -9, 12, 4, '#fff', -35, ' opacity=".5"');
        out += scatter(rnd, 15, 5, function (x, y) { return lum(c[1]) < .4 && lum(c[2]) < .5 ? E(x, y, 3.2, 2, c[2], rnd() * 180, S(shade(c[2], -.3), .4)) : C(x, y, 1.6, c[2]); });
        out += leaf(14, -14, 4, '#4f8a2e', 30);
      }
    } else if (m === 'cannoli') {
      [[-6, -16, -18], [0, 2, -18], [6, 20, -18]].forEach(function (p, k) {
        out += G('translate(' + p[0] + ' ' + p[1] + ') rotate(' + p[2] + ')', R(1, 2, 52, 13, '#000', 6.5, 0, ' opacity=".18"') + R(0, 0, 52, 13, c[0], 6.5, 0, S(shade(c[0], -.3), .6)) + scatter(rnd, 22, 12, function (x, y) { return C(x * 1.1, y * .3, 1 + rnd(), shade(c[0], rnd() > .5 ? -.25 : .3), ' opacity=".6"'); }) + R(-4, -3, 38, 2.4, '#fff', 1, 0, ' opacity=".3"') +
          [-1, 1].map(function (s) { return E(s * 26, 0, 4.5, 6, c[1], 0, S('#e0d6bc', .5)) + C(s * 26 - s, -1, 1, c[2]) + C(s * 26 + s, 2, .9, c[2]); }).join(''));
      });
      out += scatter(rnd, 34, 40, function (x, y) { return C(x, y, .5, '#fff', ' opacity=".8"'); });
    } else if (m === 'pie') {
      out += C(1, 2, 38, '#000', ' opacity=".16"') + C(0, 0, 38, c[0], S(shade(c[0], -.3), .8)); for (i = 0; i < 24; i++) out += C(Math.cos(i * .2618) * 36, Math.sin(i * .2618) * 36, 3.2, shade(c[0], .06), S(shade(c[0], -.3), .5));
      out += C(0, 0, 33, c[1]) + C(0, 0, 31, shade(c[1], -.08)) + C(-3, -4, 20, shade(c[1], .25), ' opacity=".3"');
      [[0, 0], [10, 0], [18, 0], [24, 0]].forEach(function (rad, k) { var cnt = [1, 6, 10, 14][k]; for (var q = 0; q < cnt; q++) { var a = q / cnt * 6.2832 + k; var px = Math.cos(a) * [0, 10, 18, 25][k], py = Math.sin(a) * [0, 10, 18, 25][k]; out += E(px, py, 5.6, 3.4, c[2], a * 57, S(shade(c[2], -.35), .6)) + '<path d="M-3 0h6" ' + S(shade(c[2], -.35), .5) + tf(px, py, a * 57) + ' transform="translate(' + n(px) + ' ' + n(py) + ') rotate(' + n(a * 57) + ')"/>' + E(px - 1, py - 1, 2.6, 1, shade(c[2], .4), a * 57, ' opacity=".5"'); } });
    } else if (m === 'quiche') {
      out += C(1, 2, 38, '#000', ' opacity=".16"') + C(0, 0, 38, c[0], S(shade(c[0], -.3), .8)); for (i = 0; i < 24; i++) out += C(Math.cos(i * .2618) * 36, Math.sin(i * .2618) * 36, 3.2, shade(c[0], .08), S(shade(c[0], -.3), .5));
      out += C(0, 0, 32, c[1]) + scatter(rnd, 30, 20, function (x, y) { return C(x, y, 2 + rnd() * 3, shade(c[1], rnd() > .5 ? -.12 : .12), ' opacity=".6"'); }) + scatter(rnd, 30, 18, function (x, y) { return R(x, y, 4.4, 2.2, c[2], .6, rnd() * 180); }) + scatter(rnd, 30, 14, function (x, y) { return leaf(x, y, 2, '#4f8a2e', rnd() * 180); });
      out += '<path d="M0 0L36 -10M0 0L30 20"' + S('#8a5a1a', .8, .6) + '/>' + E(-8, -12, 12, 3, '#fff', -35, ' opacity=".3"');
    } else if (m === 'tortilla') {
      out += C(1, 2, 36, '#000', ' opacity=".16"') + C(0, 0, 36, shade(c[1], -.1), S('#a8742f', .8)) + C(0, 0, 34, c[0]) + scatter(rnd, 33, 40, function (x, y) { return C(x, y, 1 + rnd() * 2, shade(c[0], rnd() > .5 ? -.2 : .25), ' opacity=".55"'); });
      out += '<path d="M0 0L36 -12A38 38 0 0 1 28 24Z" fill="' + shade(c[0], .2) + '"' + S('#c9a02a', .8) + '/>' + '<path d="M6 -2L32 -8M8 4L30 4M6 10L26 16" fill="none"' + S(shade(c[0], -.2), 1, .6) + '/>' + scatter(rnd, 20, 8, function (x, y) { return C(x + 18, y + 4, 1.4, c[2], ' opacity=".7"'); }) + E(-10, -12, 14, 3.4, '#fff', -35, ' opacity=".3"');
    } else if (m === 'cake') {
      out += R(1, 3, 48, 44, '#000', 6, 0, ' opacity=".14" filter="url(#dBlur)"') + R(0, -2, 46, 38, shade(c[0], -.3), 6) + R(0, -2, 43, 35, c[0], 5) + scatter(rnd, 22, 40, function (x, y) { return C(x * 1.0, y * .8 - 2, .8 + rnd(), shade(c[0], rnd() > .5 ? -.25 : .25), ' opacity=".6"'); }) +
        '<path d="M-22 -12Q0 -20 22 -12Q22 -2 14 6Q0 12 -14 6Q-22 -2 -22 -12Z" fill="' + c[2] + '" opacity=".55"/>' + E(-6, -10, 12, 3, '#fff', -15, ' opacity=".35"');
      out += C(14, 10, 10, '#000', ' opacity=".15"') + C(14, 8, 10, c[1], S('#e0d6bc', .6)) + C(11, 5, 3, '#fff', ' opacity=".7"');
    } else if (m === 'tatin') {
      out += C(1, 2, 38, '#000', ' opacity=".16"') + C(0, 0, 38, c[0], S(shade(c[0], -.3), .8)) + C(0, 0, 36, shade(c[0], .08));
      for (i = 0; i < 12; i++) { var a = i * .5236; out += E(Math.cos(a) * 22, Math.sin(a) * 22, 14, 6.5, c[1], a * 57, S(shade(c[1], -.35), .7)) + E(Math.cos(a) * 22, Math.sin(a) * 22, 9, 2.4, shade(c[1], .3), a * 57, ' opacity=".7"'); }
      for (i = 0; i < 6; i++) { var b = i * 1.0472 + .5; out += E(Math.cos(b) * 8, Math.sin(b) * 8, 8, 4.5, shade(c[1], -.05), b * 57, S(shade(c[1], -.35), .6)); }
      out += C(0, 0, 3.4, c[2]) + C(0, 0, 36, 'none', S(c[2], 2, .5)) + E(-10, -14, 14, 3.4, '#fff', -35, ' opacity=".35"');
    } else if (m === 'croissant') {
      var segs = [[-30, 10, 7, 5, -70], [-23, 1, 9, 6.5, -55], [-13, -6, 10.5, 8, -35], [0, -9, 11.5, 9, -10], [13, -6, 10.5, 8, 20], [23, 1, 9, 6.5, 45], [30, 10, 7, 5, 60]];
      out += E(2, 10, 36, 12, '#000', 0, ' opacity=".07" filter="url(#dBlur)"');
      segs.forEach(function (s) { out += E(s[0], s[1], s[2] * 1.15, s[3] * 1.2, c[1], s[4], S(shade(c[1], -.2), .5)); });
      segs.slice().reverse().forEach(function (s, k) { out += E(s[0], s[1], s[2], s[3], c[0], s[4], S(shade(c[0], -.25), .6)) + E(s[0] - 1, s[1] - 2, s[2] * .6, s[3] * .35, shade(c[0], .4), s[4], ' opacity=".55"'); });
    } else if (m === 'macarons') {
      var mc = [c[0], c[1], c[2], '#e8b8d0', '#cfa66a'], mp = [[-18, -14], [6, -16], [20, 4], [-4, 14], [-24, 10]];
      mp.forEach(function (p, k) { out += C(p[0] + 1, p[1] + 1.5, 11, '#000', ' opacity=".16"') + C(p[0], p[1], 11, shade(mc[k], -.12)) + C(p[0], p[1], 9.6, mc[k], S(shade(mc[k], -.25), .5)) + C(p[0] - 2.4, p[1] - 3, 3.6, shade(mc[k], .45), ' opacity=".55"') + C(p[0], p[1], 11, 'none', S(shade(mc[k], .2), .8, .8)); });
    } else if (m === 'churros') {
      for (i = 0; i < 5; i++) { var cy = -22 + i * 9.5; out += R(-4 + 1, cy + 1.5, 52, 6.6, '#000', 3.3, -8, ' opacity=".16"') + R(-4, cy, 52, 6.6, c[0], 3.3, -8, S(shade(c[0], -.3), .6)) + G('rotate(-8)', [-20, -14, -8, -2, 4, 10, 16, 22].map(function (x) { return '<path d="M' + x + ' ' + (cy - 3) + 'v6"' + S(shade(c[0], -.28), .6, .7) + '/>'; }).join('')) + scatter(rnd, 20, 14, function (x, y) { return C(x - 4, cy + y * .12, .5, c[2]); }); }
      out += C(27 + 1, 23 + 1.5, 11, '#000', ' opacity=".18"') + C(27, 23, 11, '#f1eee6', S('#d6d3c9', .8)) + C(27, 23, 8.4, c[1]) + C(24, 20, 3, '#fff', ' opacity=".25"');
    } else if (m === 'balls') {
      var light = lum(c[0]) > .6;
      if (!light) {
        out += C(0, 0, 33, '#f1eee6', S('#d6d3c9', .8)) + C(0, 0, 30, '#ddd8cb') + C(0, 0, 28, c[1], ' opacity=".9"') + C(-4, -5, 18, shade(c[1], .3), ' opacity=".4"');
        [[-10, -8], [10, -9], [-12, 10], [9, 10], [0, 0]].forEach(function (p) { out += C(p[0] + .8, p[1] + 1.4, 8.4, '#000', ' opacity=".2"') + C(p[0], p[1], 8.4, c[0], S(shade(c[0], -.3), .5)) + C(p[0] - 2.4, p[1] - 3, 3, shade(c[0], .5), ' opacity=".6"') + R(p[0] + 2, p[1] + 2, 2.6, 1.2, c[2], .4, 30) + R(p[0] - 1, p[1] + 3, 2.6, 1.2, c[2], .4, -20); });
      } else {
        [[-12, -12, '#f2a0b0'], [12, -12, '#9ac7a8'], [-12, 12, '#cfa6d8'], [12, 12, '#f6dc9a']].forEach(function (p, k) { out += C(p[0] + 1, p[1] + 1.5, 11, '#000', ' opacity=".16"') + C(p[0], p[1], 11, c[0], S('#e0d6bc', .6)) + C(p[0], p[1], 6, p[2], ' opacity=".9"') + C(p[0] - 3, p[1] - 4, 3.2, '#fff', ' opacity=".7"') + scatter(rnd, 9, 8, function (x, y) { return C(p[0] + x, p[1] + y, .6, '#fff'); }); });
        out += leaf(0, 0, 3.4, c[2], 40);
      }
    } else if (m === 'baklava') {
      [[-14, -14], [14, -14], [-14, 14], [14, 14]].forEach(function (p, k) {
        out += G('translate(' + p[0] + ' ' + p[1] + ') rotate(' + (k % 2 ? -8 : 8) + ')', '<polygon points="0,-16 16,0 0,16 -16,0" fill="#000" opacity=".16" transform="translate(1 2)"/>' + '<polygon points="0,-16 16,0 0,16 -16,0" fill="' + c[0] + '"' + S(shade(c[0], -.3), .7) + '/>' + '<polygon points="0,-12 12,0 0,12 -12,0" fill="' + shade(c[0], .12) + '"/>' + '<path d="M-10 -2L10 -2M-8 2L8 2M-6 -6L6 -6M-6 6L6 6" ' + S(shade(c[0], -.25), .6, .7) + '/>' + C(0, 0, 3, c[2], S(shade(c[2], -.3), .4)) + E(-3, -6, 4, 1.4, '#fff', 0, ' opacity=".45"'));
      });
      out += scatter(rnd, 30, 14, function (x, y) { return C(x, y, .9, c[2]); });
    }
    return out;
  };

  T.drink = function (m, c, rnd) {
    var out = shadow(40) + C(0, 0, 40, '#fff', ' opacity=".95"') + C(0, 0, 40, 'none', S('#d6d3c9', 1)) + C(0, 0, 34, c[0], ' opacity=".95"') + C(0, 0, 34, 'none', S(shade(c[0], -.25), 1));
    out += C(-6, -6, 22, shade(c[0], .3), ' opacity=".35"');
    var sp = 'M0 0'; for (var i = 1; i <= 36; i++) sp += 'L' + n(Math.cos(i * .5) * i * .7) + ' ' + n(Math.sin(i * .5) * i * .7);
    out += '<path d="' + sp + '" fill="none"' + S(c[1], 2.6, .9) + '/>';
    if (m === 'lassi') out += scatter(rnd, 24, 7, function (x, y) { return R(x, y, 5, 5, c[2], 1, rnd() * 90, ' opacity=".9"'); }) + leaf(16, -14, 4, '#4f8a2e', 30);
    else out += scatter(rnd, 26, 40, function (x, y) { return C(x, y, .7 + rnd() * .5, c[1] === '#c88a2a' ? c[1] : '#a8742f', ' opacity=".9"'); }) + R(-8, 4, 34, 3.2, '#9a6a2a', 1.6, -35) + R(-8, 4, 34, 1, '#c8924a', .5, -35, ' opacity=".7"');
    out += G('translate(14 -26) rotate(28)', R(0, 0, 4, 38, '#fff', 2, 0, S('#d9302a', .6)) + [-12, -4, 4, 12].map(function (y) { return R(0, y, 4, 4, '#d9302a', 0, 0); }).join('')) + E(-10, -14, 13, 4, '#fff', -40, ' opacity=".5"');
    return out;
  };

  /* ---------- API ---------- */
  var DEFS = '<defs><filter id="dBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.7"/></filter></defs>';

  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }

  D.art = function (spec, seedStr, extraClass) {
    var p = spec.split(':'), fn = T[p[0]];
    if (!fn) return '';
    var body = '';
    try { body = fn(p[1], p.slice(2), rng(hash(seedStr))); } catch (e) { return ''; }
    return '<svg class="art ' + (extraClass || '') + '" viewBox="-54 -54 108 108" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false" style="fill:none;stroke:none">' + DEFS + body + '</svg>';
  };
})();
