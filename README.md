# DACE EATS

App web de pedidos de comida a domicilio (estilo Uber Eats / Glovo) para un concierto didáctico.
HTML + CSS + JavaScript puros. Sin backend, sin registro, sin pagos reales, sin dependencias.

La app **solo simula el pedido y la entrega**. No hay personajes, repartidores, vídeos ni bailes: eso ocurre en el escenario.

## Publicar en GitHub Pages
1. Sube todo el contenido de esta carpeta a un repositorio.
2. *Settings → Pages → Deploy from a branch → `main` / `(root)`*.
3. Abre la URL que te da GitHub. (También funciona abriendo `index.html` directamente, sin servidor.)

## Imágenes de los platos
Cada plato lleva una **ilustración vectorial propia** (vista cenital, generada por código en `js/illustrations.js`), así que la app se ve completa **sin internet y sin archivos de imagen**.

Si más adelante quieres fotos reales, tienen prioridad sobre las ilustraciones:
- Guarda la foto en `img/platos/<id>.jpg` (cocinas: `img/categorias/<id>.jpg`). Los `id` están en `js/data.js`, p. ej. `italia-pasta-carbonara.jpg`.
- O ejecuta `python3 tools/descargar_fotos.py` (necesita internet; baja fotos libres de Wikimedia Commons y crea `CREDITOS.md`, que debes conservar). Revisa el resultado.
- Opcional: `fotosWikipedia: true` en `js/config.js` busca fotos en Wikipedia cuando no hay foto local (necesita internet).

## Estructura
```
index.html
css/   base.css · catalog.css · cart.css · checkout.css
js/    config.js   → tiempos y tarifas
       data.js     → catálogo completo (9 cocinas, 102 platos)
       utils.js · illustrations.js · cart.js · catalog.js · checkout.js · tracking.js · app.js
img/   platos/ · categorias/
tools/ descargar_fotos.py
```

## Ajustes para el concierto (`js/config.js`)
- `fases`: segundos de *Pedido confirmado → Preparando → En camino* (por defecto 5 + 12 + 14 s ≈ 31 s).
- `pagoSegundos`: duración de la simulación de pago.
- `tarifaServicio`: tarifa fija por pedido.
- Ensayo rápido: añade `?rapido=1` a la URL (x4) o `?velocidad=2` (x2).

## Añadir o cambiar platos
Edita `js/data.js` (JSON válido): `n` nombre, `d` descripción, `p` precio, `s` sección, `o` país de origen (opcional), `pop` 1 para que salga en «Lo más pedido».

## Textos clave en pantalla
«¡Pedido confirmado!» → «Estamos preparando tu pedido» → «¡Tu pedido está en camino!» → «¡Pedido completado!».
En la pantalla final aparece la **Procedencia** del pedido (Italia, Texas, África…), útil como señal para el escenario.
