/* Dibujos vectoriales para la pantalla de entrega: banderas, mapas e iconos
   de instrumentos y prendas. Todo se genera por código (sin imágenes externas). */
(function () {
  var D = window.DACE;
  var INK = '#2b2118';
  function st(w) { return ' stroke="' + INK + '" stroke-width="' + (w || 2) + '" stroke-linejoin="round" stroke-linecap="round"'; }
  function wrap(inner, vb) { return '<svg viewBox="' + (vb || '0 0 64 64') + '" aria-hidden="true" focusable="false" style="fill:none;stroke:none">' + inner + '</svg>'; }

  /* ---------- Banderas (proporción 3:2) ---------- */
  var FLAGS = {
    it: '<rect width="30" height="60" fill="#009246"/><rect x="30" width="30" height="60" fill="#fff"/><rect x="60" width="30" height="60" fill="#CE2B37"/>',
    tx: '<rect width="90" height="60" fill="#fff"/><rect y="30" x="30" width="60" height="30" fill="#BF0A30"/><rect width="30" height="60" fill="#002868"/>' +
      '<polygon fill="#fff" points="' + (function () { var p = []; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 4.6 : 11; p.push((15 + Math.cos(a) * r).toFixed(1) + ',' + (30 + Math.sin(a) * r).toFixed(1)); } return p.join(' '); })() + '"/>',
    za: '<defs><clipPath id="zaClip"><rect width="90" height="60"/></clipPath></defs><g clip-path="url(#zaClip)">' +
      '<rect width="90" height="30" fill="#DE3831"/><rect y="30" width="90" height="30" fill="#002395"/>' +
      '<path d="M-4 -4L33 30L-4 64M33 30H94" fill="none" stroke="#fff" stroke-width="11"/>' +
      '<path d="M-4 -4L33 30L-4 64M33 30H94" fill="none" stroke="#007A4D" stroke-width="7"/>' +
      '<polygon points="0,4.7 0,55.3 27.8,30" fill="#FFB612"/><polygon points="0,9.5 0,50.5 20.5,30" fill="#000"/></g>'
  };
  D.flag = function (id) {
    return '<svg viewBox="0 0 90 60" class="flag" role="img" aria-label="Bandera" style="fill:none;stroke:none">' + (FLAGS[id] || '') + '</svg>';
  };

  /* ---------- Mapas (contornos simplificados, longitud/latitud) ---------- */
  var MAPS = {
    it: [
      [[7.0, 45.9], [8.5, 46.4], [9.0, 46.0], [9.3, 46.5], [10.4, 46.6], [10.5, 46.9], [11.5, 47.0], [12.2, 47.1], [13.7, 46.5], [13.6, 45.7], [12.4, 45.3], [12.5, 44.9], [12.3, 44.4], [12.6, 44.0], [13.5, 43.6], [14.2, 42.5], [15.1, 42.1], [15.9, 41.9], [16.2, 41.9], [15.9, 41.6], [16.9, 41.1], [17.9, 40.65], [18.5, 40.1], [18.0, 39.95], [17.2, 40.35], [16.7, 40.3], [16.6, 39.7], [17.1, 39.1], [17.1, 38.9], [16.5, 38.7], [16.5, 38.4], [15.7, 37.95], [15.65, 38.25], [15.9, 38.7], [16.2, 39.1], [16.0, 39.4], [15.6, 39.9], [15.3, 40.0], [14.9, 40.2], [14.8, 40.6], [14.35, 40.6], [14.2, 40.8], [13.7, 41.2], [13.2, 41.3], [12.6, 41.5], [12.3, 41.7], [11.8, 42.1], [11.1, 42.4], [10.5, 42.9], [10.3, 43.5], [9.8, 44.1], [8.9, 44.4], [8.5, 44.3], [7.5, 43.8], [7.0, 44.2], [6.9, 45.0], [7.1, 45.5]],
      [[15.6, 38.25], [15.2, 38.3], [14.0, 38.04], [13.35, 38.15], [12.7, 38.2], [12.5, 38.0], [12.4, 37.8], [12.6, 37.6], [13.6, 37.3], [14.3, 37.1], [14.8, 36.7], [15.1, 36.7], [15.3, 37.1], [15.1, 37.5], [15.3, 37.9]],
      [[8.2, 40.9], [8.2, 41.1], [9.2, 41.25], [9.4, 41.2], [9.6, 40.9], [9.8, 40.5], [9.7, 39.9], [9.6, 39.3], [9.1, 39.2], [8.4, 39.4], [8.5, 39.9], [8.4, 40.1], [8.3, 40.6]]
    ],
    tx: [
      [[-103.04, 36.5], [-100.0, 36.5], [-100.0, 34.56], [-99.2, 34.2], [-98.0, 34.1], [-97.1, 33.8], [-96.5, 33.8], [-95.2, 33.9], [-94.5, 33.65], [-94.04, 33.55], [-94.04, 31.99], [-93.8, 31.0], [-93.7, 30.0], [-93.85, 29.7], [-94.7, 29.35], [-95.3, 28.9], [-96.4, 28.35], [-97.0, 27.8], [-97.2, 27.6], [-97.4, 26.9], [-97.15, 25.95], [-97.6, 26.0], [-98.3, 26.1], [-99.1, 26.4], [-99.5, 27.5], [-100.3, 28.3], [-100.7, 29.1], [-101.4, 29.77], [-102.3, 29.88], [-102.7, 29.7], [-103.1, 28.97], [-104.5, 29.6], [-104.9, 30.6], [-106.0, 31.4], [-106.6, 31.8], [-106.62, 32.0], [-103.06, 32.0]]
    ],
    za: [
      [[16.45, -28.6], [17.0, -28.8], [18.0, -28.9], [19.0, -28.4], [20.0, -28.4], [20.0, -24.8], [20.7, -26.8], [22.0, -26.5], [23.0, -25.8], [24.5, -25.6], [25.6, -25.6], [26.0, -24.8], [27.0, -23.7], [27.8, -22.2], [29.4, -22.2], [31.0, -22.3], [31.3, -22.4], [31.5, -23.0], [31.9, -24.5], [31.95, -25.45], [32.0, -26.8], [32.9, -26.85], [32.6, -28.5], [31.9, -28.9], [31.05, -29.85], [30.2, -31.0], [29.4, -32.0], [27.9, -33.0], [25.6, -34.0], [24.0, -34.1], [22.9, -34.0], [22.1, -34.2], [20.0, -34.8], [19.2, -34.4], [18.4, -33.9], [18.3, -33.4], [17.9, -32.6], [17.9, -31.5], [17.1, -30.1], [16.5, -28.9]],
      [[27.0, -29.6], [28.2, -28.7], [28.9, -28.9], [29.4, -29.3], [29.0, -30.0], [28.0, -30.6], [27.4, -30.3]],
      [[30.8, -26.8], [31.1, -26.0], [31.9, -26.3], [31.9, -27.3], [31.2, -27.2]]
    ]
  };

  D.mapSVG = function (cfg) {
    var rings = MAPS[cfg.id], W = 220, H = 200, pad = 18;
    var all = rings.reduce(function (a, r) { return a.concat(r); }, []);
    var lons = all.map(function (p) { return p[0]; }), lats = all.map(function (p) { return p[1]; });
    var lonMin = Math.min.apply(0, lons), lonMax = Math.max.apply(0, lons), latMin = Math.min.apply(0, lats), latMax = Math.max.apply(0, lats);
    var k = Math.cos(((latMin + latMax) / 2) * Math.PI / 180);
    var wsp = (lonMax - lonMin) * k, hsp = latMax - latMin;
    var sc = Math.min((W - 2 * pad) / wsp, (H - 2 * pad) / hsp);
    var ox = (W - wsp * sc) / 2, oy = (H - hsp * sc) / 2;
    function pr(p) { return [ox + (p[0] - lonMin) * k * sc, oy + (latMax - p[1]) * sc]; }
    var d = rings.map(function (r) { return 'M' + r.map(function (p) { var q = pr(p); return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join('L') + 'Z'; }).join('');
    var pin = pr(cfg.pin);
    var px = Math.max(40, Math.min(W - 40, pin[0])), lw = cfg.etiqueta.length * 6.2 + 18;
    var grid = '';
    for (var i = 1; i < 5; i++) grid += '<path d="M' + (W / 5 * i) + ' 0V' + H + 'M0 ' + (H / 5 * i) + 'H' + W + '" stroke="#fff" stroke-width=".6" opacity=".35"/>';
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" class="map-svg" role="img" aria-label="Mapa de ' + D.esc(cfg.etiqueta) + '" style="fill:none;stroke:none">' +
      '<rect width="' + W + '" height="' + H + '" rx="14" fill="#cfe3ee"/>' + grid +
      '<path d="' + d + '" fill="#000" opacity=".15" transform="translate(2 3)"/>' +
      '<path d="' + d + '" fill="#f3ead0" fill-rule="evenodd" stroke="#8a7a4a" stroke-width="1.4" stroke-linejoin="round"/>' +
      '<g transform="translate(' + pin[0].toFixed(1) + ' ' + pin[1].toFixed(1) + ')"><circle r="9" fill="#ff5a1f" opacity=".3" class="pin-pulse"/>' +
      '<path d="M0 0C0 0-8-9-8-15a8 8 0 0 1 16 0C8-9 0 0 0 0z" fill="#ff5a1f" stroke="#fff" stroke-width="2"/><circle cy="-15" r="3" fill="#fff"/></g>' +
      '<g transform="translate(' + px.toFixed(1) + ' ' + Math.max(16, pin[1] - 38).toFixed(1) + ')"><rect x="' + (-lw / 2) + '" y="-11" width="' + lw + '" height="22" rx="11" fill="#0e0f12"/>' +
      '<text y="4" text-anchor="middle" font-size="11" font-weight="700" fill="#fff" font-family="inherit">' + D.esc(cfg.etiqueta) + '</text></g>' +
      '<g transform="translate(' + (W - 20) + ' 22)"><circle r="11" fill="#fff" opacity=".85"/><path d="M0 -7L4 5L0 2L-4 5Z" fill="#0e0f12"/></g></svg>';
  };

  /* ---------- Iconos de instrumentos y prendas ---------- */
  var ICO = {
    tamburello: function () { var j = ''; for (var i = 0; i < 8; i++) { var a = i * .7854; j += '<rect x="-2.5" y="-2" width="5" height="4" rx="1" fill="#E0B93A"' + st(1) + ' transform="translate(' + (32 + Math.cos(a) * 21).toFixed(1) + ' ' + (32 + Math.sin(a) * 21).toFixed(1) + ') rotate(' + (i * 45 + 90) + ')"/>'; } return '<circle cx="32" cy="32" r="25" fill="#7a4a22"' + st(2.4) + '/><circle cx="32" cy="32" r="19" fill="#f1dcae"' + st(1.4) + '/>' + j + '<path d="M24 26q8-5 16 0M24 36q8 5 16 0" ' + st(1.2) + '/>'; },
    zampogna: function () { return '<path d="M26 8v26M32 6v28M38 10v24" ' + st(3.2) + ' stroke="#6b3f22"/><path d="M26 8v26M32 6v28M38 10v24" stroke="#c98a3d" stroke-width="1.4"/><ellipse cx="30" cy="40" rx="17" ry="12" fill="#a8663a"' + st(2.2) + '/><path d="M40 44l14 12" ' + st(3.4) + ' stroke="#6b3f22"/><path d="M40 44l14 12" stroke="#c98a3d" stroke-width="1.4"/><circle cx="52" cy="54" r="1.4" fill="' + INK + '"/><path d="M20 38q10 6 20 0" ' + st(1) + ' opacity=".6"/>'; },
    mandolino: function () { return '<g transform="rotate(-35 32 32)"><path d="M32 30c-12 0-15 8-13 14s8 10 13 10 11-4 13-10-1-14-13-14z" fill="#d9944a"' + st(2.2) + '/><rect x="29.5" y="6" width="5" height="26" fill="#4a2a14"' + st(1.6) + '/><path d="M28 6h8v-3h-8z" fill="#4a2a14"' + st(1.4) + '/><circle cx="32" cy="42" r="5" fill="#2b2118"/><path d="M30 12v40M32 12v40M34 12v40" stroke="#f4efe0" stroke-width=".7"/></g>'; },
    organetto: function () { var k = ''; for (var i = 0; i < 6; i++) k += '<circle cx="' + (11 + (i % 2) * 5) + '" cy="' + (24 + Math.floor(i / 2) * 7) + '" r="1.8" fill="#f4efe0"/>'; var p = ''; for (i = 0; i < 6; i++) p += '<path d="M' + (21 + i * 4) + ' 20V44" stroke="#f4efe0" stroke-width="1.2"/>'; return '<rect x="6" y="16" width="16" height="32" rx="3" fill="#2b2b33"' + st(2) + '/><rect x="42" y="16" width="16" height="32" rx="3" fill="#2b2b33"' + st(2) + '/><path d="M22 20h20v24H22z" fill="#C8102E"' + st(2) + '/>' + p + k + '<circle cx="50" cy="32" r="3" fill="#E0B93A"/>'; },
    violin: function () { return '<g transform="rotate(-30 32 32)"><path d="M32 22c-8 0-11 4-9 9-3 2-5 5-4 10 1 7 8 11 13 11s12-4 13-11c1-5-1-8-4-10 2-5-1-9-9-9z" fill="#b8642a"' + st(2.2) + '/><rect x="30" y="4" width="4" height="22" fill="#2b2118"/><path d="M29 4h6l-1-3h-4z" fill="#2b2118"/><path d="M26 38q-3 3 0 8M38 38q3 3 0 8" ' + st(1.4) + '/><path d="M32 26v24" stroke="#f4efe0" stroke-width=".8"/></g><path d="M8 52L58 14" stroke="#6b3f22" stroke-width="2.4" stroke-linecap="round"/><path d="M8 52L58 14" stroke="#e8dcc0" stroke-width=".8"/>'; },
    banjo: function () { return '<rect x="29.5" y="4" width="5" height="30" fill="#4a2a14"' + st(1.6) + '/><circle cx="32" cy="44" r="17" fill="#8a5a2a"' + st(2.4) + '/><circle cx="32" cy="44" r="14" fill="#f4efe0"' + st(1.4) + '/><path d="M30 6v38M32 6v38M34 6v38" stroke="#6a6a6a" stroke-width=".7"/><rect x="28" y="38" width="8" height="2" fill="#4a2a14"/><circle cx="26" cy="46" r="1" fill="#6a6a6a"/><circle cx="38" cy="46" r="1" fill="#6a6a6a"/><circle cx="32" cy="50" r="1" fill="#6a6a6a"/>'; },
    guitarra: function () { return '<g transform="rotate(-35 32 32)"><path d="M32 28c-6 0-8 4-7 8-3 2-6 5-5 10 1 6 7 9 12 9s11-3 12-9c1-5-2-8-5-10 1-4-1-8-7-8z" fill="#c98a3d"' + st(2.2) + '/><rect x="30" y="4" width="4" height="26" fill="#4a2a14"' + st(1.4) + '/><rect x="28.5" y="2" width="7" height="6" rx="1.5" fill="#4a2a14"/><circle cx="32" cy="42" r="5" fill="#2b2118"/><path d="M32 30v26" stroke="#f4efe0" stroke-width=".8"/></g>'; },
    armonica: function () { var h = ''; for (var i = 0; i < 8; i++) h += '<rect x="' + (14 + i * 4.4) + '" y="28" width="2.6" height="8" rx="1" fill="#2b2118"/>'; return '<rect x="8" y="22" width="48" height="20" rx="3" fill="#aeb4bd"' + st(2) + '/><rect x="8" y="22" width="6" height="20" fill="#7a808a"' + st(1.4) + '/><rect x="50" y="22" width="6" height="20" fill="#7a808a"' + st(1.4) + '/>' + h + '<path d="M16 25h32" stroke="#fff" stroke-width="1" opacity=".7"/>'; },
    bota: function () { return '<path d="M20 6h16v28q0 5 7 7 11 3 11 11v4H18z" fill="#f1f1ee"' + st(2.4) + '/><path d="M20 12h16" ' + st(1.6) + '/><path d="M18 52h36v6H18z" fill="#2b2b33"' + st(2) + '/><path d="M23 20v12" stroke="#fff" stroke-width="2" opacity=".8"/>'; },
    palmas: function () { return '<g transform="rotate(-28 24 32)"><rect x="14" y="14" width="14" height="30" rx="7" fill="#e0a67a"' + st(2) + '/></g><g transform="rotate(28 40 32)"><rect x="34" y="14" width="14" height="30" rx="7" fill="#c98a5a"' + st(2) + '/></g><path d="M32 6v6M20 8l3 5M44 8l-3 5M10 20l5 3M54 20l-5 3" ' + st(2) + ' stroke="#E0B93A"/>'; },
    cascabel: function () { return '<path d="M32 6a4 4 0 0 1 4 4v2h-8v-2a4 4 0 0 1 4-4z" fill="none"' + st(2) + '/><path d="M14 46q2-8 4-20 4-10 14-10t14 10q2 12 4 20z" fill="#E0B93A"' + st(2.4) + '/><path d="M14 46h36v4H14z" fill="#b8932a"' + st(2) + '/><circle cx="32" cy="55" r="4" fill="#b8932a"' + st(2) + '/><path d="M22 26q2-6 8-8" stroke="#fff" stroke-width="2" opacity=".7"/>'; },
    silbato: function () { var h = ''; for (var i = 0; i < 6; i++) h += '<circle cx="' + (26 + i * 5.4) + '" cy="32" r="1.8" fill="#2b2118"/>'; return '<rect x="8" y="27" width="50" height="10" rx="2" fill="#c9ced6"' + st(2) + '/><path d="M8 27h12l-3-6H8z" fill="#7a808a"' + st(1.8) + '/>' + h + '<path d="M10 30h46" stroke="#fff" stroke-width="1.2" opacity=".7"/>'; },
    /* prendas */
    falda: function (c) { return '<path d="M22 12h20l14 42H8z" fill="' + c + '"' + st(2.2) + '/><path d="M22 12h20" ' + st(3) + '/><path d="M26 24l-8 28M32 24v28M38 24l8 28" stroke="' + INK + '" stroke-width="1.2" opacity=".35"/>'; },
    vestido: function (c) { return '<path d="M25 6h14l3 16 14 32H8L22 22z" fill="' + c + '"' + st(2.2) + '/><path d="M22 22h20" ' + st(1.6) + '/><circle cx="32" cy="14" r="1.6" fill="' + INK + '"/>'; },
    camisa: function (c) { return '<path d="M22 8l-14 8 6 12 8-4v28h24V24l8 4 6-12-14-8c-2 5-6 7-10 7s-8-2-10-7z" fill="' + c + '"' + st(2.2) + '/><path d="M32 15v39" stroke="' + INK + '" stroke-width="1.2" opacity=".4"/>'; },
    chaleco: function (c) { return '<path d="M20 8l12 12 12-12 8 8-4 40H16l-4-40z" fill="' + c + '"' + st(2.2) + '/><path d="M32 20v36" stroke="' + INK + '" stroke-width="1.4" opacity=".5"/><circle cx="29" cy="30" r="1.3" fill="#E0B93A"/><circle cx="29" cy="40" r="1.3" fill="#E0B93A"/>'; },
    delantal: function (c) { return '<path d="M22 8h20l4 46H18z" fill="' + c + '"' + st(2.2) + '/><rect x="25" y="32" width="14" height="10" rx="2" fill="none"' + st(1.4) + '/><path d="M22 8q-8 2-10 8M42 8q8 2 10 8" fill="none"' + st(1.6) + '/>'; },
    panuelo: function (c) { return '<path d="M8 14h48L32 54z" fill="' + c + '"' + st(2.2) + '/><circle cx="20" cy="22" r="1.6" fill="#fff" opacity=".8"/><circle cx="32" cy="22" r="1.6" fill="#fff" opacity=".8"/><circle cx="44" cy="22" r="1.6" fill="#fff" opacity=".8"/><circle cx="26" cy="32" r="1.6" fill="#fff" opacity=".8"/><circle cx="38" cy="32" r="1.6" fill="#fff" opacity=".8"/><circle cx="32" cy="42" r="1.6" fill="#fff" opacity=".8"/>'; },
    faja: function (c) { return '<path d="M6 24h52v14H6z" fill="' + c + '"' + st(2.2) + '/><path d="M34 38l-6 16M40 38l2 16" fill="none"' + st(3) + ' stroke="' + c + '"/><circle cx="37" cy="31" r="5" fill="' + c + '"' + st(1.6) + '/>'; },
    pantalon: function (c) { return '<path d="M16 8h32l4 48H36l-4-28-4 28H12z" fill="' + c + '"' + st(2.2) + '/><path d="M16 14h32" ' + st(1.6) + '/>'; },
    gorro: function (c) { return '<path d="M12 40q0-26 20-26t20 26z" fill="' + c + '"' + st(2.2) + '/><rect x="8" y="40" width="48" height="8" rx="4" fill="' + c + '"' + st(2.2) + '/><path d="M12 40h40" stroke="#000" stroke-width="1" opacity=".25"/>'; },
    sombrero: function (c) { return '<path d="M20 38q0-24 12-24t12 24z" fill="' + c + '"' + st(2.2) + '/><path d="M6 38q26 14 52 0-2 10-26 12T6 38z" fill="' + c + '"' + st(2.2) + '/><path d="M20 34h24" stroke="#6b3f22" stroke-width="3"/>'; },
    bonnet: function (c) { return '<path d="M12 40q0-26 24-26 12 0 14 14l-4 14H18z" fill="' + c + '"' + st(2.2) + '/><path d="M18 42q14 8 28 0" fill="none"' + st(1.6) + '/><path d="M44 44l8 8M44 44l-2 10" ' + st(2.4) + ' stroke="#C0392B"/>'; },
    mono: function (c) { return '<path d="M22 6h6v10h8V6h6l2 20 8 8-6 6-6-6v24H24V34l-6 6-6-6 8-8z" fill="' + c + '"' + st(2.2) + '/><path d="M28 16h8v8h-8z" fill="none"' + st(1.4) + '/>'; }
  };
  D.ico = function (id, color) { var f = ICO[id]; return f ? wrap(f(color || '#ccc')) : ''; };
})();
