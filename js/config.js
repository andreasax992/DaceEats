/* Ajustes de DACE EATS. Edita aquí los tiempos y tarifas. */
(function () {
  var q = new URLSearchParams(location.search);
  // ?rapido=1 acelera todo x4 (útil para ensayar). ?velocidad=2 acelera x2.
  var speed = q.has('rapido') ? 4 : (parseFloat(q.get('velocidad')) || 1);

  window.DACE_CONFIG = {
    // true: si falta la foto local (img/platos/…), se busca una en Wikipedia (necesita internet).
    // Por defecto false: se usan las ilustraciones incluidas (funcionan sin internet).
    fotosWikipedia: false,
    tarifaServicio: 1.49,          // € por pedido
    destino: 'Escenario principal',
    pagoSegundos: 3.6 / speed,     // duración de la simulación de pago
    // Duración (en segundos) de cada fase tras el pago:
    fases: {
      confirmado: 5 / speed,
      preparando: 12 / speed,
      camino: 14 / speed
    }
  };
})();
