# DANCE EATS

Aplicación web de pedidos de comida a domicilio (estilo Uber Eats / Glovo) para un concierto didáctico.
HTML + CSS + JavaScript. Sin backend, sin registro, sin servicios externos de pago y sin dependencias.

## Publicar en GitHub Pages
1. Sube el **contenido** de esta carpeta a un repositorio (`index.html` debe quedar en la raíz).
2. *Settings → Pages → Deploy from a branch → `main` / `(root)`*.
3. Abre la URL que te da GitHub. También funciona abriendo `index.html` directamente.

## Cómo funciona durante el concierto
1. Se elige una cocina, se añaden platos y se finaliza el pedido.
2. Tras el pago aparece el seguimiento: *¡Pedido confirmado!* → *Estamos preparando tu pedido* → *¡Tu pedido está en camino!* → *¡Pedido completado!*
3. En la pantalla final aparece un **código de confirmación** por cada destino (`ITA-0000`, `TEX-0000`, `SUD-0000`). Se pulsa sobre el código para rellenarlo (o se escribe) y se pulsa *Confirmar*.
4. Se abre la **pantalla de entrega**, donde la información va apareciendo **en orden**:
   **1** País y bandera · **2** Mapa · **3** Nombre del baile · **4** Vestimenta tradicional · **5** Fotos de la época · **6** Instrumentos de la época.
   - Avanzar: botón *Siguiente*, barra espaciadora, Enter o flecha derecha. Retroceder: flecha izquierda.
   - Botón *Automático*: avanza solo cada 10 s (`experiencia.autoSegundos` en `js/config.js`).
   - Los huecos numerados con «?» permiten que el público vea cuántos pasos quedan.

Destinos con pantalla de entrega: **Italia** (La Tarantella), **Texas** (Square dance) y **Sudáfrica** (Gumboot dance), a través de la cocina «África».

## Editar el contenido de los bailes
Todo está en `js/danzas.js`: textos, vestimenta, instrumentos y pies de foto. Las banderas, los mapas y los iconos se dibujan por código en `js/danza-art.js`.

## Fotos de época (importante)
Las fotos de la pantalla de entrega **no vienen incluidas**. Guárdalas en `img/danzas/` con estos nombres:
`italia-1.jpg`, `italia-2.jpg`, `texas-1.jpg`, `texas-2.jpg`, `africa-1.jpg`, `africa-2.jpg`
(crea la carpeta si no existe; JPG horizontal de unos 1000 px). Mientras falte una foto se muestra un marco con su pie.
Ajusta el pie y el año en `js/danzas.js` para que coincidan con tu foto.

Opciones para conseguirlas:
- Ejecutar `python3 tools/descargar_fotos.py` en un ordenador con internet: busca fotos libres en Wikimedia Commons, las guarda en `img/` y crea `CREDITOS.md`. **Revisa el resultado**, porque la búsqueda automática puede traer una foto poco adecuada.
- Usar fotografías históricas de dominio público (Wikimedia Commons, Library of Congress, archivos locales) y citar siempre al autor.
La foto de `italia-1` tiene un respaldo en línea (Giorgio Sommer, siglo XIX, Wikimedia Commons) que se usa si hay internet y falta el archivo.

## Imágenes de los platos
Cada plato lleva una ilustración vectorial (`js/illustrations.js`), así que la app se ve completa sin internet. Si guardas una foto en `img/platos/<id>.jpg` (cocinas: `img/categorias/<id>.jpg`), tiene prioridad. Los `id` están en `js/data.js`.

## Estructura
```
index.html
css/   base.css · catalog.css · cart.css · checkout.css · experiencia.css
js/    config.js · data.js · utils.js · illustrations.js · cart.js · catalog.js
       checkout.js · tracking.js · danzas.js · danza-art.js · experiencia.js · app.js
img/   (fotos opcionales)
tools/ descargar_fotos.py
```

## Ajustes (`js/config.js`)
- `fases`: segundos de *Confirmado → Preparando → En camino* (por defecto 5 + 12 + 14 s).
- `pagoSegundos`: duración del procesamiento del pago.
- `tarifaServicio`: tarifa fija por pedido.
- Ensayo rápido: añade `?rapido=1` a la URL (x4) o `?velocidad=2` (x2).
