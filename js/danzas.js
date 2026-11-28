/* Contenido de la pantalla de entrega: un baile por cada destino del concierto.
   La clave es el id de la cocina (italia, america, africa). Edita aquí los textos.
   Orden en pantalla: país → mapa → baile → vestimenta → fotos de época → instrumentos.
   Fotos: guarda tus imágenes en img/danzas/ con el nombre indicado en "src".
   Si hay "url", se usa como respaldo cuando falta el archivo local (necesita internet). */
window.DACE_DANZAS = {

  italia: {
    codigo: 'ITA',
    pais: 'Italia',
    zona: 'Sur de Italia · Puglia',
    bandera: 'it',
    mapa: { id: 'it', pin: [17.25, 40.47], etiqueta: 'Puglia · Taranto' },
    baile: {
      nombre: 'La Tarantella',
      tipo: 'Baile popular en pareja o en corro',
      epoca: 'Siglos XV al XIX',
      resumen: 'Un baile rapidísimo y alegre que acompañan las palmas y las panderetas. Empieza despacio y va acelerando hasta que a los bailarines casi les falta el aliento.',
      curiosidad: 'Cuenta la leyenda que nació cerca de la ciudad de Taranto: se creía que la picadura de una araña, la tarántula, solo se curaba bailando sin parar. De ahí su nombre.'
    },
    vestimenta: [
      { titulo: 'Ellas', items: [
        { n: 'Falda larga y ancha', d: 'De colores vivos para que vuele al girar', c: '#C8102E', i: 'falda' },
        { n: 'Blusa blanca', d: 'De mangas amplias', c: '#F6F2E8', i: 'camisa' },
        { n: 'Corpiño bordado', d: 'Ajustado, de terciopelo', c: '#1F5FA8', i: 'chaleco' },
        { n: 'Delantal', d: 'Con bordados de colores', c: '#E8B63A', i: 'delantal' },
        { n: 'Cintas y pañuelo', d: 'En el pelo, de colores', c: '#2E9F5B', i: 'panuelo' }
      ] },
      { titulo: 'Ellos', items: [
        { n: 'Camisa blanca', d: 'De algodón o lino', c: '#F6F2E8', i: 'camisa' },
        { n: 'Chaleco oscuro', d: 'Abierto sobre la camisa', c: '#2B2B33', i: 'chaleco' },
        { n: 'Faja roja', d: 'Atada a la cintura', c: '#C8102E', i: 'faja' },
        { n: 'Pantalón oscuro', d: 'Hasta la rodilla o largo', c: '#3A3A44', i: 'pantalon' },
        { n: 'Gorro de fieltro', d: 'Para completar el traje', c: '#5A3A22', i: 'gorro' }
      ] }
    ],
    fotos: [
      { src: 'img/danzas/italia-1.jpg',
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sommer,_Giorgio_-_Die_Tarantella_(Zeno_Fotografie).jpg?width=1000',
        pie: 'Pareja bailando la tarantella', anio: 'Siglo XIX', autor: 'Giorgio Sommer' },
      { src: 'img/danzas/italia-2.jpg', pie: 'Bailarines de tarantella en el sur de Italia', anio: 'Época antigua', autor: '' }
    ],
    instrumentos: [
      { n: 'Tamburello', d: 'Pandero con sonajas que marca el ritmo', epoca: 'Edad Media', i: 'tamburello' },
      { n: 'Zampogna', d: 'Gaita de los pastores del sur', epoca: 'Muy antigua', i: 'zampogna' },
      { n: 'Mandolino', d: 'Cuerdas pulsadas, muy popular en Nápoles', epoca: 'Siglo XVIII', i: 'mandolino' },
      { n: 'Organetto', d: 'Pequeño acordeón de botones', epoca: 'Siglo XIX', i: 'organetto' }
    ]
  },

  america: {
    codigo: 'TEX',
    pais: 'Texas',
    zona: 'Estados Unidos · América del Norte',
    bandera: 'tx',
    mapa: { id: 'tx', pin: [-98.5, 30.6], etiqueta: 'Texas' },
    baile: {
      nombre: 'Square dance',
      tipo: 'Baile de cuadrilla: cuatro parejas en cuadrado',
      epoca: 'Siglo XIX',
      resumen: 'Cuatro parejas forman un cuadrado y bailan siguiendo las voces de una persona, el «caller», que va cantando el paso que toca. Hay que escuchar muy bien para no perderse.',
      curiosidad: 'Los colonos que llegaron a Texas lo trajeron de Europa y lo mezclaron con la música de la frontera. Es el baile folclórico oficial de Texas.'
    },
    vestimenta: [
      { titulo: 'Ellas', items: [
        { n: 'Vestido largo', d: 'De algodón estampado', c: '#2E6FB5', i: 'vestido' },
        { n: 'Enaguas', d: 'Para dar vuelo a la falda', c: '#F6F2E8', i: 'falda' },
        { n: 'Sombrero de ala ancha', d: 'Contra el sol de Texas', c: '#D9B27A', i: 'bonnet' },
        { n: 'Botines', d: 'Cómodos para bailar', c: '#6B3F22', i: 'bota' }
      ] },
      { titulo: 'Ellos', items: [
        { n: 'Camisa de cuadros', d: 'Estilo del oeste', c: '#C0392B', i: 'camisa' },
        { n: 'Pañuelo al cuello', d: 'La «bandana»', c: '#1F3A6B', i: 'panuelo' },
        { n: 'Vaqueros', d: 'Resistentes, de trabajo', c: '#2C4A7A', i: 'pantalon' },
        { n: 'Botas de vaquero', d: 'Con tacón', c: '#7A4A22', i: 'bota' },
        { n: 'Sombrero vaquero', d: 'El clásico de Texas', c: '#D9B27A', i: 'sombrero' }
      ] }
    ],
    fotos: [
      { src: 'img/danzas/texas-1.jpg', pie: 'Baile de cuadrilla en Texas', anio: 'Época antigua', autor: '' },
      { src: 'img/danzas/texas-2.jpg', pie: 'Parejas bailando en un salón de Texas', anio: 'Época antigua', autor: '' }
    ],
    instrumentos: [
      { n: 'Violín (fiddle)', d: 'El rey del baile de cuadrilla', epoca: 'Siglos XVIII–XIX', i: 'violin' },
      { n: 'Banjo', d: 'Sonido brillante, de origen afroamericano', epoca: 'Siglo XIX', i: 'banjo' },
      { n: 'Guitarra', d: 'Acompaña con acordes', epoca: 'Siglo XIX', i: 'guitarra' },
      { n: 'Armónica', d: 'Pequeña y fácil de llevar a caballo', epoca: 'Siglo XIX', i: 'armonica' }
    ]
  },

  africa: {
    codigo: 'SUD',
    pais: 'Sudáfrica',
    zona: 'África austral',
    nota: 'África es un continente con 54 países y miles de culturas. Hoy descubrimos solo una de ellas.',
    bandera: 'za',
    mapa: { id: 'za', pin: [28.05, -26.2], etiqueta: 'Johannesburgo' },
    baile: {
      nombre: 'Gumboot dance',
      tipo: 'Baile de botas de goma (isicathulo)',
      epoca: 'Finales del siglo XIX y siglo XX',
      resumen: 'Un baile de ritmo: los bailarines golpean sus botas de goma, sus muslos y sus palmas para crear música con el propio cuerpo.',
      curiosidad: 'Nació en las minas de oro de Johannesburgo. Dentro de los túneles, con agua hasta los tobillos, los mineros no podían hablar y se comunicaban con golpes de bota.'
    },
    vestimenta: [
      { titulo: 'Los bailarines', items: [
        { n: 'Mono de trabajo', d: 'El de los mineros', c: '#E8873A', i: 'mono' },
        { n: 'Botas de goma', d: 'Blancas o negras, las protagonistas', c: '#F1F1EE', i: 'bota' },
        { n: 'Cascabeles y cadenas', d: 'En los tobillos, suenan al golpear', c: '#C9A02A', i: 'cascabel' },
        { n: 'Casco o gorro', d: 'De minero', c: '#E8B63A', i: 'gorro' },
        { n: 'Pañuelo', d: 'Al cuello, de colores', c: '#C0392B', i: 'panuelo' }
      ] }
    ],
    fotos: [
      { src: 'img/danzas/africa-1.jpg', pie: 'Mineros bailando el gumboot', anio: 'Época antigua', autor: '' },
      { src: 'img/danzas/africa-2.jpg', pie: 'Grupo de bailarines con botas de goma', anio: 'Época antigua', autor: '' }
    ],
    instrumentos: [
      { n: 'Botas de goma', d: 'El instrumento principal: se golpean con las manos', epoca: 'Desde las minas', i: 'bota' },
      { n: 'Palmas y muslos', d: 'Percusión con el propio cuerpo', epoca: 'Desde siempre', i: 'palmas' },
      { n: 'Cascabeles', d: 'Añaden un sonido metálico', epoca: 'Tradicional', i: 'cascabel' },
      { n: 'Silbato de hojalata', d: 'Música «kwela», muy popular en los años 50', epoca: 'Siglo XX', i: 'silbato' }
    ]
  }
};
