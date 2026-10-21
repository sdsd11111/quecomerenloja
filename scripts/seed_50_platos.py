import json
import re
import urllib.parse
import pymysql

# 1. Conexión a la base de datos
db_url = 'mysql://quecomerlojadinamic-313931562a:%7BbS_c5HrdlrW@mysql.us.stackcp.com:46630/quecomerlojadinamic-313931562a'
parsed = urllib.parse.urlparse(db_url)
conn = pymysql.connect(
    host=parsed.hostname,
    port=parsed.port,
    user=parsed.username,
    password=urllib.parse.unquote(parsed.password),
    database=parsed.path[1:],
    connect_timeout=15,
    charset='utf8mb4'
)
cursor = conn.cursor()

# Cargar restaurantes resumen para sacar direccion y parroquia
with open(r'C:\Users\Smart\.gemini\antigravity-ide\brain\4645f903-7257-4b50-986f-aa3f925a13c9\scratch\restaurantes_resumen.json', 'r', encoding='utf-8') as f:
    rest_info_list = json.load(f)
rest_dict = {r['id_local']: r for r in rest_info_list}

# Cargar items crudos
with open(r'C:\Users\Smart\.gemini\antigravity-ide\brain\4645f903-7257-4b50-986f-aa3f925a13c9\scratch\raw_items.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

# Definición de los 50 Platos con metadata SEO rica, historia, ingredientes y FAQs
PLATOS_METADATA = [
    # ── Tradicional Lojana y de la Sierra ──
    {
        'slug': 'repe-lojano',
        'nombre': 'Repe Lojano',
        'titulo_h1': 'Repe Lojano: Sopa Tradicional de Guineo Verde y Quesillo',
        'seccion': 'Tradicional Lojana',
        'meta_title': 'Repe Lojano en Loja | Dónde Comer la Mejor Sopa Tradicional',
        'meta_description': 'Guía del auténtico Repe Lojano en la ciudad de Loja: caldo espeso de guineo verde, quesillo artesanal y culantro. Restaurantes tradicionales, precios y horarios.',
        'descripcion_corta': 'El repe lojano es la sopa bandera de Loja, elaborada con guineo verde cocido y majado, quesillo fresco desmenuzado y culantro picado. De textura cremosa y sabor reconfortante.',
        'historia_tradicion': 'Nacido en los hogares campesinos de la provincia de Loja, el repe aprovecha la abundancia de guineo verde (plátano verde de seda) de los valles templados como Malacatos y Vilcabamba. Es considerado patrimonio gastronómico inmaterial de Loja.',
        'ingredientes_clave': ['Guineo verde (seda)', 'Quesillo fresco lojano', 'Culantro fresco', 'Leche o fondo blanco', 'Ajo y cebolla blanca'],
        'faqs': [
            {'q': '¿Qué ingredientes lleva el auténtico repe lojano?', 'a': 'Lleva guineo verde cocinado y batido, quesillo tierno desmenuzado, un toque de leche y culantro finamente picado.'},
            {'q': '¿Dónde comer el mejor repe en Loja?', 'a': 'En restaurantes tradicionales del centro y El Valle como Salón Lolita, CocinArte, Los Sartenes y Repe & Bolón.'},
            {'q': '¿Cuánto cuesta un plato de repe lojano?', 'a': 'El precio oscila entre $2.50 y $4.50 USD en la mayoría de restaurantes de Loja.'}
        ],
        'volumen_busqueda': 5000,
        'regex': r'\brepe\b'
    },
    {
        'slug': 'cecina-lojana',
        'nombre': 'Cecina Lojana',
        'titulo_h1': 'Cecina Lojana: Carne de Cerdo Ahumada al Carbón',
        'seccion': 'Tradicional Lojana',
        'meta_title': 'Cecina Lojana en Loja | Dónde Comer la Auténtica Cecina a la Brasa',
        'meta_description': 'Dónde comer la mejor cecina lojana en Loja Ecuador: finos filetes de cerdo marinados y asados al carbón con yuca cocida y ensalada criolla. Locales recomendados y precios.',
        'descripcion_corta': 'Finos filetes de carne de cerdo adobados con especias tradicionales, secados y asados al carbón, acompañados de yuca suave y cebolla curtida.',
        'historia_tradicion': 'La cecina es uno de los platos más representativos de Loja y Catamayo. La técnica de cecinado se usaba antiguamente para conservar la carne, convirtiéndose hoy en un manjar a las brasas.',
        'ingredientes_clave': ['Carne de cerdo (pierna o lomo)', 'Achiote en pasta', 'Ajo y comino', 'Yuca cocida', 'Cebolla colorada curtida'],
        'faqs': [
            {'q': '¿Con qué se acompaña la cecina lojana?', 'a': 'Se sirve tradicionalmente con yuca cocinada bien suave, ensalada criolla de cebolla y tomate, y ají de pepa de zambo.'},
            {'q': '¿Cuánto cuesta un plato de cecina en Loja?', 'a': 'Una porción de cecina cuesta entre $6.00 y $12.00 USD según el restaurante y tamaño de la porción.'}
        ],
        'volumen_busqueda': 1000,
        'regex': r'\bcecina\b|\bcecinas\b'
    },
    {
        'slug': 'tamales-lojanos',
        'nombre': 'Tamales Lojanos',
        'titulo_h1': 'Tamales Lojanos: El Tradicional Bocado en Hoja de Achira',
        'seccion': 'Tradicional Lojana',
        'meta_title': 'Tamales Lojanos en Loja | Dónde Comer y Comprar Tamales Tradicionales',
        'meta_description': 'Descubre los mejores tamales lojanos en Loja Ecuador: masa suave de maíz cocinada al vapor en hoja de achira con relleno jugoso de pollo o cerdo y huevo duro.',
        'descripcion_corta': 'Masa delicada de maíz envuelta en hoja de achira con relleno especiado de pollo o cerdo, cocida al vapor y perfecta para el café de la tarde.',
        'historia_tradicion': 'El tamal lojano se distingue de otros tamales del país por su textura sumamente fina y el aroma particular que le otorga la hoja de achira fresca cultivada en los huertos lojanos.',
        'ingredientes_clave': ['Maíz blanco seco molido', 'Pollo o cerdo desmechado', 'Hoja de achira', 'Manteca de cerdo', 'Huevo duro y pimiento'],
        'faqs': [
            {'q': '¿A qué hora se acostumbra comer tamales en Loja?', 'a': 'Es el infaltable del desayuno y del café de la tarde (16:00 a 18:30) junto a una taza de café lojano de filtro.'},
            {'q': '¿Cuánto cuesta un tamal lojano?', 'a': 'Entre $1.00 y $2.50 USD según la cafetería.'}
        ],
        'volumen_busqueda': 1500,
        'regex': r'\btamal\b|\btamales\b'
    },
    {
        'slug': 'humitas-loja',
        'nombre': 'Humitas en Loja',
        'titulo_h1': 'Humitas Lojanas: Dulces y de Sal con Choclo Tierno',
        'seccion': 'Tradicional Lojana',
        'meta_title': 'Humitas en Loja | Dónde Comer las Mejores Humitas con Café',
        'meta_description': 'Guía de las mejores humitas en Loja: choclo tierno molido con quesillo y mantequilla, cocinadas al vapor en panca de choclo. Cafeterías y locales tradicionales.',
        'descripcion_corta': 'Bocadillos suaves elaborados a base de choclo tierno recién molido con abundante quesillo y mantequilla, envueltos en sus propias hojas.',
        'historia_tradicion': 'Tradición de origen prehispánico perfeccionada con quesillo lojano de las haciendas ganaderas locales.',
        'ingredientes_clave': ['Choclo tierno desgranado', 'Quesillo lojano', 'Mantequilla de campo', 'Huevos de campo', 'Pancas de choclo'],
        'faqs': [
            {'q': '¿Qué diferencia a la humita lojana?', 'a': 'El uso de quesillo fresco artesanal con abundante grasa natural que le da cremosidad única.'}
        ],
        'volumen_busqueda': 1000,
        'regex': r'\bhumita\b|\bhumitas\b'
    },
    {
        'slug': 'quimbolitos-loja',
        'nombre': 'Quimbolitos Lojanos',
        'titulo_h1': 'Quimbolitos Lojanos: El Dulce Esponjoso en Hoja de Achira',
        'seccion': 'Tradicional Lojana',
        'meta_title': 'Quimbolitos en Loja | Dónde Probar los Mejores Quimbolitos Tradicionales',
        'meta_description': 'Encuentra los quimbolitos más suaves y esponjosos de Loja: masa batida al vapor con pasas y un toque de licor en hoja de achira.',
        'descripcion_corta': 'Bizcocho dulce y esponjoso cocinado al vapor en hoja de achira, decorado con pasas y aromatizado con esencia natural.',
        'historia_tradicion': 'Postre tradicional de las tardes de tertulia lojana, acompañante fiel de las cafeterías del casco colonial.',
        'ingredientes_clave': ['Harina de trigo y maíz', 'Mantequilla y azúcar', 'Huevos batidos a punto de nieve', 'Pasas', 'Hoja de achira'],
        'faqs': [
            {'q': '¿Qué es un quimbolito?', 'a': 'Un pastelito esponjoso al vapor envuelto en hoja de achira típico de la serranía lojana.'}
        ],
        'volumen_busqueda': 300,
        'regex': r'\bquimbolito\b|\bquimbolitos\b'
    },
    {
        'slug': 'cuy-asado-loja',
        'nombre': 'Cuy Asado en Loja',
        'titulo_h1': 'Cuy Asado en Loja: El Plato Festivo por Excelencia',
        'seccion': 'Tradicional Lojana',
        'meta_title': 'Cuy Asado en Loja | Dónde Comer el Mejor Cuy en el Valle y la Ciudad',
        'meta_description': 'Los mejores restaurantes de cuy asado en Loja: asado lentamente a la brasa hasta lograr una piel crocante y carne tierna. Acompañado de papas y ají de pepa.',
        'descripcion_corta': 'Cuy asado entero a la brasa con carbón de leña, de piel crujiente y carne jugosa, servido con papas doradas, mote y salsa de pepa de zambo.',
        'historia_tradicion': 'El sector de El Valle en Loja es el epicentro gastronómico del cuy asado, una tradición familiar de más de medio siglo.',
        'ingredientes_clave': ['Cuy seleccionado', 'Adobo criollo con ajo y comino', 'Papas cocidas y doradas', 'Ají de pepa de zambo', 'Lechuga y tomate'],
        'faqs': [
            {'q': '¿Cuánto cuesta un cuy entero en Loja?', 'a': 'Un cuy entero oscila entre $20.00 y $26.00 USD, y medio cuy entre $11.00 y $14.00 USD.'},
            {'q': '¿Dónde comer cuy asado en Loja?', 'a': 'El sector El Valle concentra los asaderos más famosos como El Recreo, Salón Lolita y Mama Lola.'}
        ],
        'volumen_busqueda': 800,
        'regex': r'\bcuy\b'
    },
    {
        'slug': 'gallina-cuyada-loja',
        'nombre': 'Gallina Cuyada en Loja',
        'titulo_h1': 'Gallina Cuyada en Loja: Sabor a Leña con Sazón Tradicional',
        'seccion': 'Tradicional Lojana',
        'meta_title': 'Gallina Cuyada en Loja | Dónde Probar este Plato Único Lojano',
        'meta_description': 'Guía de la gallina cuyada en Loja: pollo de campo marinado y asado con la misma técnica y aliño del cuy asado tradicional. Locales y precios.',
        'descripcion_corta': 'Gallina criolla adobada con la receta secreta del cuy y asada pacientemente al carbón, logrando un dorado perfecto y sabor ahumado.',
        'historia_tradicion': 'Una innovación netamente lojana nacida en los asaderos de El Valle para quienes disfrutan el sabor del adobo de cuy en carne de ave.',
        'ingredientes_clave': ['Gallina criolla de campo', 'Aliño tradicional con achiote y manteca', 'Papas doradas', 'Ají de pepa', 'Mote cocido'],
        'faqs': [
            {'q': '¿Qué es la gallina cuyada?', 'a': 'Es gallina asada a la brasa adobada exactamente con el mismo aliño y proceso del cuy asado lojano.'}
        ],
        'volumen_busqueda': 500,
        'regex': r'gallina cuyada'
    },
    {
        'slug': 'arveja-con-guineo-loja',
        'nombre': 'Arveja con Guineo',
        'titulo_h1': 'Arveja con Guineo: El Clásico Almuerzo de los Hogares Lojanos',
        'seccion': 'Tradicional Lojana',
        'meta_title': 'Arveja con Guineo en Loja | Dónde Comer Esta Sopa Emblemática',
        'meta_description': 'Dónde tomar sopa de arveja con guineo en Loja: sopa cremosa de arveja seca, guineo verde picado, quesillo y culantro. Restaurantes típicos lojanos.',
        'descripcion_corta': 'Sopa espesa y nutritiva preparada con arvejas secas cocidas a fuego lento, guineo verde cortado en cubos y quesillo fresco desmenuzado.',
        'historia_tradicion': 'Es el almuerzo cotidiano por excelencia en la provincia de Loja, caracterizado por su equilibrio calórico y sabor casero entrañable.',
        'ingredientes_clave': ['Arveja verde seca', 'Guineo verde lojano', 'Quesillo artesanal', 'Refrito criollo con cebolla y ajo', 'Culantro picado'],
        'faqs': [
            {'q': '¿Es lo mismo arveja con guineo que repe?', 'a': 'No. El repe es una crema batida de guineo verde con quesillo; la arveja con guineo lleva legumbre (arveja seca) cocida entera con cubos de guineo.'}
        ],
        'volumen_busqueda': 400,
        'regex': r'arveja.*guineo|arvejas.*guineo'
    },
    {
        'slug': 'sango-loja',
        'nombre': 'Sango Lojano y de Camarón',
        'titulo_h1': 'Sango Lojano: De Maíz Tostado con Quesillo y Mariscos',
        'seccion': 'Tradicional Lojana',
        'meta_title': 'Sango en Loja | Dónde Comer Sango Tradicional y de Mariscos',
        'meta_description': 'Plato tradicional lojano preparado a base de harina de maíz tostado con refrito de achiote, abundante quesillo o camarones salteados.',
        'descripcion_corta': 'Guiso espeso y aromático de harina de maíz tostado con cebolla, achiote, quesillo derretido o mariscos, servido bien caliente.',
        'historia_tradicion': 'Alimento de raíz andina que alimentó a generaciones de lojanos por su gran aporte energético durante las faenas del campo.',
        'ingredientes_clave': ['Harina de maíz tostado', 'Quesillo lojano', 'Achiote y cebolla blanca', 'Fondo de carne o mariscos', 'Culantro'],
        'faqs': [
            {'q': '¿Cómo se prepara el sango lojano?', 'a': 'Se disuelve harina de maíz tostado en caldo caliente sobre un refrito criollo, incorporando quesillo fresco hasta que derrita.'}
        ],
        'volumen_busqueda': 300,
        'regex': r'\bsango\b'
    },
    {
        'slug': 'locro-loja',
        'nombre': 'Locros y Sopas Tradicionales',
        'titulo_h1': 'Locros en Loja: Sopa Tradicional de Papas con Queso y Aguacate',
        'seccion': 'Tradicional Lojana',
        'meta_title': 'Locros de Papa en Loja | Dónde Comer Sopas Tradicionales',
        'meta_description': 'Los mejores locros de papa en Loja: caldo espeso con queso derretido, leche de campo y rodajas de aguacate fresco.',
        'descripcion_corta': 'Sopa espesada por la cocción de papas andinas con leche, quesillo y hierbas aromáticas, acompañada de aguacate.',
        'historia_tradicion': 'Plato andino fundamental de la sierra ecuatoriana con presencia indiscutible en los menús ejecutivos y tradicionales de Loja.',
        'ingredientes_clave': ['Papa chola y chola negra', 'Queso o quesillo tierno', 'Leche entera', 'Aguacate', 'Cebolla blanca y orégano'],
        'faqs': [
            {'q': '¿Con qué se sirve el locro de papa?', 'a': 'Con aguacate fresco cortado en tajadas y ají criollo al gusto.'}
        ],
        'volumen_busqueda': 300,
        'regex': r'\blocro\b|\blocros\b'
    },
    {
        'slug': 'chicharron-loja',
        'nombre': 'Chicharrones y Piqueos de Cerdo',
        'titulo_h1': 'Chicharrones en Loja: Trozos Crocantes de Cerdo con Mote',
        'seccion': 'Tradicional Lojana',
        'meta_title': 'Chicharrones en Loja | Dónde Comer Piqueos Tradicionales de Cerdo',
        'meta_description': 'Descubre los chicharrones más crujientes de Loja: carne y grasa de cerdo cocinada en su propia paila con mote caliente y ají.',
        'descripcion_corta': 'Trozos de cerdo fritos en paila de bronce en su propia grasa hasta alcanzar un color dorado crujiente por fuera y jugoso por dentro.',
        'historia_tradicion': 'Típico de los fines de semana en las ferias y picanterías tradicionales lojanas.',
        'ingredientes_clave': ['Carne y lonja de cerdo', 'Sal y comino', 'Mote pelado cocido', 'Tostado', 'Limón y ají'],
        'faqs': [
            {'q': '¿Con qué se acompaña el chicharrón?', 'a': 'Con abundante mote caliente, tostado y cebollita picada.'}
        ],
        'volumen_busqueda': 300,
        'regex': r'\bchicharron\b|\bchicharrones\b'
    },

    # ── Desayunos y Tradicional ──
    {
        'slug': 'bolones-loja',
        'nombre': 'Bolones de Verde en Loja',
        'titulo_h1': 'Bolones de Verde en Loja: Queso, Chicharrón y Mixtos',
        'seccion': 'Desayunos y Tradicional',
        'meta_title': 'Bolones en Loja | Los Mejores Bolones de Verde para el Desayuno',
        'meta_description': 'Dónde desayunar los mejores bolones en Loja: verde frito o cocinado, majado a mano con abundante queso criollo o chicharrón crocante y café pasado.',
        'descripcion_corta': 'Esferas generosas de plátano verde majado y dorado con corazón de queso fundido, chicharrón de cerdo o mixtos.',
        'historia_tradicion': 'El rey del desayuno lojano junto al café filtrado de altura, popularizado en cafeterías del casco histórico y mercados.',
        'ingredientes_clave': ['Plátano verde dominico o barraganete', 'Quesillo lojano', 'Chicharrón de cerdo', 'Manteca de cerdo o mantequilla', 'Sal al gusto'],
        'faqs': [
            {'q': '¿Qué variedades de bolón hay en Loja?', 'a': 'Bolón de queso, de chicharrón y mixto (queso y chicharrón). También se preparan de plátano maduro o pintón.'},
            {'q': '¿Cuánto cuesta un bolón en Loja?', 'a': 'Entre $1.50 y $3.50 USD dependiendo del tamaño y acompañamientos (huevo frito, bistec o café).'}
        ],
        'volumen_busqueda': 500,
        'regex': r'\bbolon\b|\bbolones\b'
    },
    {
        'slug': 'tigrillo-loja',
        'nombre': 'Tigrillo en Loja',
        'titulo_h1': 'Tigrillo en Loja: Plátano Verde Majado con Quesillo y Huevo',
        'seccion': 'Desayunos y Tradicional',
        'meta_title': 'Tigrillo en Loja | Dónde Comer el Mejor Tigrillo para Desayunar',
        'meta_description': 'Guía del tigrillo en Loja: plátano verde salteado con refrito criollo, huevo revuelto y quesillo lojano derretido con bistec o carne.',
        'descripcion_corta': 'Plátano verde majado cocinado a la sartén con refrito, huevo, leche y hebras generosas de quesillo fundido.',
        'historia_tradicion': 'Originario de la provincia vecina de El Oro, adoptado con fervor en Loja y enriquecido con el excepcional quesillo artesanal de la zona.',
        'ingredientes_clave': ['Plátano verde majado', 'Quesillo lojano', 'Huevos de campo', 'Leche entera', 'Cebolla blanca y achiote'],
        'faqs': [
            {'q': '¿Con qué carne se pide el tigrillo en Loja?', 'a': 'Se suele servir con carne asada, cecina lojana o bistec de carne y una taza de café caliente.'}
        ],
        'volumen_busqueda': 400,
        'regex': r'\btigrillo\b|\btigrillos\b'
    },
    {
        'slug': 'empanadas-loja',
        'nombre': 'Empanadas de Verde y Morocho',
        'titulo_h1': 'Empanadas en Loja: Crujientes de Verde, Morocho y Viento',
        'seccion': 'Desayunos y Tradicional',
        'meta_title': 'Empanadas en Loja | Dónde Comer Empanadas de Verde y Morocho',
        'meta_description': 'Las mejores empanadas de verde, morocho y queso en Loja: masa crujiente recién frita rellena de queso, carne o pollo con ají criollo.',
        'descripcion_corta': 'Empanadas doradas y crocantes rellenas de quesillo derretido, carne o pollo desmechado, servidas con ají de tomate de árbol.',
        'historia_tradicion': 'Acompañamiento clásico para el café de media mañana y la merienda en Loja.',
        'ingredientes_clave': ['Masa de plátano verde o morocho', 'Quesillo lojano', 'Carne de res o pollo', 'Aceite para freír', 'Ají casero'],
        'faqs': [
            {'q': '¿Dónde comer empanadas de verde en Loja?', 'a': 'En cafeterías como Apetitto, Dumas, La Huerta y los tradicionales puestos de San Sebastián.'}
        ],
        'volumen_busqueda': 350,
        'regex': r'\bempanada\b|\bempanadas\b'
    },
    {
        'slug': 'cafe-especialidad-loja',
        'nombre': 'Café de Especialidad y Filtrados',
        'titulo_h1': 'Café de Especialidad en Loja: Cuna del Mejor Café del Ecuador',
        'seccion': 'Cafeterías y Bebidas',
        'meta_title': 'Café de Especialidad en Loja | Las Mejores Cafeterías de Altura',
        'meta_description': 'Ruta del café de especialidad en Loja: granos arábicos de Puyango, Quilanga y Vilcabamba en métodos de filtrado V60, Chemex y Espresso.',
        'descripcion_corta': 'Cafés de altura con notas cítricas, achocolatadas y florales, tostados y servidos en métodos artesanales por baristas lojanos.',
        'historia_tradicion': 'Loja es reconocida a nivel internacional como la capital cafetalera del Ecuador, ganadora constante de concursos Taza Dorada.',
        'ingredientes_clave': ['Grano arábigo lojano (Typica, Bourbon, Geisha)', 'Agua a temperatura controlada', 'Molienda fresca', 'Métodos de extracción artesanal'],
        'faqs': [
            {'q': '¿Qué hace tan especial al café de Loja?', 'a': 'La altura de cultivo (entre 1,400 y 2,100 msnm), el microclima andino y el cuidado artesanal del beneficio.'}
        ],
        'volumen_busqueda': 1200,
        'regex': r'filtrado|chemex|v60|aeropress|prensa francesa|espresso|cappuccino|latte|americano|mocca'
    },

    # ── Mariscos y Costeña ──
    {
        'slug': 'parihuela-loja',
        'nombre': 'Parihuela de Mariscos',
        'titulo_h1': 'Parihuela en Loja: Sopa Concentrada de Mariscos del Pacífico',
        'seccion': 'Mariscos y Costeña',
        'meta_title': 'Parihuela en Loja | Dónde Comer Sopa de Mariscos en Loja',
        'meta_description': 'Guía de la parihuela en Loja: caldo concentrado de camarón, calamar, mejillón y concha con ají y culantro. Restaurantes marinos recomendados.',
        'descripcion_corta': 'Potente caldo marino con pescado y frutos del mar frescos traídos desde la costa ecuatoriana, condimentado con ají amarillo y limón.',
        'historia_tradicion': 'Popularizada en Loja por la cercanía con la provincia de El Oro y la influencia de la cocina marina peruana-ecuatoriana.',
        'ingredientes_clave': ['Camarones frescos', 'Calamar y mejillones', 'Pescado blanco', 'Ají amarillo', 'Culantro y limón sutil'],
        'faqs': [
            {'q': '¿Dónde comer parihuela en Loja?', 'a': 'En marisquerías especializadas como Arsenia, Riscomar y El Pirata Cordovez.'},
            {'q': '¿Qué precio tiene la parihuela?', 'a': 'Entre $8.00 y $14.00 USD según el surtido de mariscos.'}
        ],
        'volumen_busqueda': 300,
        'regex': r'\bparihuela\b'
    },
    {
        'slug': 'encebollado-loja',
        'nombre': 'Encebollados en Loja',
        'titulo_h1': 'Encebollado en Loja: Albacora Fresca, Yuca y Chifles',
        'seccion': 'Mariscos y Costeña',
        'meta_title': 'Encebollado en Loja | Las Mejores Encebollerías de la Ciudad',
        'meta_description': 'Dónde tomar el mejor encebollado en Loja Ecuador: caldo reconfortante de albacora fresca con yuca suave, cebolla encurtida, chifles y canguil.',
        'descripcion_corta': 'El plato rey de las mañanas ecuatorianas: sopa especiada de albacora con yuca tierna, coronada con cebolla morada encurtida y chifles.',
        'historia_tradicion': 'Consumido masivamente como desayuno reconfortante y revitalizador en toda Loja.',
        'ingredientes_clave': ['Lomo de albacora fresca', 'Yuca suave', 'Cebolla colorada encurtida', 'Culantro y comino', 'Chifles crocantes'],
        'faqs': [
            {'q': '¿Cuánto cuesta un encebollado en Loja?', 'a': 'El encebollado sencillo cuesta entre $2.50 y $3.50 USD; los mixtos con camarón alcanzan $4.50 - $6.00 USD.'},
            {'q': '¿Cuáles son las encebollerías más conocidas de Loja?', 'a': 'Encebollados El Huaquillitas, Suco\'s Encebollados, Mar y Fuego y La Terraza.'}
        ],
        'volumen_busqueda': 800,
        'regex': r'\bencebollado\b|\bencebollados\b'
    },
    {
        'slug': 'ceviche-pescado-loja',
        'nombre': 'Ceviche de Pescado y Estilo Peruano',
        'titulo_h1': 'Ceviche de Pescado en Loja: Frescura con Leche de Tigre',
        'seccion': 'Mariscos y Costeña',
        'meta_title': 'Ceviche de Pescado en Loja | Dónde Comer Ceviche Estilo Peruano y Nacional',
        'meta_description': 'Dónde comer ceviche de pescado fresco en Loja: corvina marinada al momento en zumo de limón sutil con cebolla morada, choclo, camote y cancha.',
        'descripcion_corta': 'Cubos de pescado blanco fresco marinados en limón recién exprimido con ají limo, culantro, cebolla y guarniciones crocantes.',
        'historia_tradicion': 'Loja tiene una profunda admiración por la gastronomía marina del norte peruano y de la costa sur ecuatoriana.',
        'ingredientes_clave': ['Pescado blanco (corvina o dorado)', 'Zumo de limón sutil fresco', 'Cebolla morada en pluma', 'Ají limo o criollo', 'Choclo y camote'],
        'faqs': [
            {'q': '¿Cómo se sirve el ceviche peruano en Loja?', 'a': 'Se marina al instante en leche de tigre y se acompaña con camote dulce, choclo desgranado y maíz cancha tostado.'}
        ],
        'volumen_busqueda': 600,
        'regex': r'ceviche.*pescado|ceviche peruano|cebiche peruano|ceviche blanco'
    },
    {
        'slug': 'ceviche-concha-loja',
        'nombre': 'Ceviche de Concha Negra',
        'titulo_h1': 'Ceviche de Concha Negra en Loja: Sabor Intenso a Manglar',
        'seccion': 'Mariscos y Costeña',
        'meta_title': 'Ceviche de Concha en Loja | Dónde Probar Conchas Negras Frescas',
        'meta_description': 'Los mejores ceviches de concha prieta en Loja: conchas vivas abiertas al momento con su jugo oscuro natural, cebolla, limón y aceite de oliva.',
        'descripcion_corta': 'Ceviche de concha negra extraída de los manglares de la costa, servido con su propio líquido natural y acentuado con limón y cebolla.',
        'historia_tradicion': 'Llega a Loja en transporte refrigerado desde Puerto Bolívar y San Lorenzo, siendo uno de los platos marinos más codiciados.',
        'ingredientes_clave': ['Conchas negras frescas vivas', 'Zumo de limón', 'Cebolla colorada finamente picada', 'Culantro fresco', 'Aceite y mostaza opcional'],
        'faqs': [
            {'q': '¿Cuánto cuesta un ceviche de concha en Loja?', 'a': 'Entre $9.00 y $14.00 USD según la temporada y abundancia del molusco.'}
        ],
        'volumen_busqueda': 500,
        'regex': r'ceviche.*concha|cebiche.*concha'
    },
    {
        'slug': 'ceviche-camaron-loja',
        'nombre': 'Ceviche de Camarón',
        'titulo_h1': 'Ceviche de Camarón en Loja: El Clásico con Salsa Criolla',
        'seccion': 'Mariscos y Costeña',
        'meta_title': 'Ceviche de Camarón en Loja | Dónde Comer Ceviche Fresco de Camarones',
        'meta_description': 'Los mejores ceviches de camarón en Loja: camarones tiernos en caldo cítrico con tomate, cebolla morada, mostaza, chifles y canguil.',
        'descripcion_corta': 'Camarones cocidos a punto en caldo cítrico aromatizado, combinados con tomate riñón fresco, cebolla y toque de naranja.',
        'historia_tradicion': 'El preferido de las familias en almuerzos de fin de semana en Loja.',
        'ingredientes_clave': ['Camarones de piscina o mar', 'Caldo concentrado de camarón', 'Tomate riñón licuado y picado', 'Cebolla colorada', 'Limón y naranja'],
        'faqs': [
            {'q': '¿Con qué se acompaña el ceviche de camarón?', 'a': 'Con chifles de plátano verde, canguil recién reventado y tostado lojano.'}
        ],
        'volumen_busqueda': 600,
        'regex': r'ceviche.*camar[on]|cebiche.*camar[on]'
    },
    {
        'slug': 'arroz-marinero-loja',
        'nombre': 'Arroz Marinero y con Mariscos',
        'titulo_h1': 'Arroz Marinero en Loja: Salteado con Camarón, Calamar y Concha',
        'seccion': 'Mariscos y Costeña',
        'meta_title': 'Arroz Marinero en Loja | Dónde Pedir Arroz con Mariscos Generoso',
        'meta_description': 'Dónde comer arroz marinero en Loja: arroz al wok con mariscos surtidos salteados en achiote, verduras crujientes y plátano maduro frito.',
        'descripcion_corta': 'Arroz cargado de mariscos salteados a fuego vivo con pimientos, culantro y especias marinas, coronado con maduros fritos.',
        'historia_tradicion': 'Plato festivo para compartir en las principales marisquerías de Loja.',
        'ingredientes_clave': ['Arroz blanco de grano largo', 'Camarones, calamares y concha', 'Pimiento verde y rojo', 'Achiote criollo', 'Plátano maduro'],
        'faqs': [
            {'q': '¿Para cuántas personas alcanza un arroz marinero?', 'a': 'Generalmente se sirve en porciones muy generosas para 1 a 2 personas.'}
        ],
        'volumen_busqueda': 400,
        'regex': r'arroz marinero|arroz con mariscos|arroz con camaron'
    },
    {
        'slug': 'cazuela-mariscos-loja',
        'nombre': 'Cazuela de Mariscos',
        'titulo_h1': 'Cazuela de Mariscos en Loja: Masa de Verde y Maní al Horno',
        'seccion': 'Mariscos y Costeña',
        'meta_title': 'Cazuela de Mariscos en Loja | Sabor Tradicional en Paila de Barro',
        'meta_description': 'Dónde comer cazuela de mariscos en Loja: masa suave de verde majado con pasta de maní y pescado o camarón, gratinada al horno de barro.',
        'descripcion_corta': 'Guiso horneado en tiesto de barro con masa de plátano verde rallado, pasta de maní puro y mariscos salteados.',
        'historia_tradicion': 'Herencia de la cocina manabita apreciada en Loja por su textura suave y reconfortante aroma a maní tostado.',
        'ingredientes_clave': ['Plátano verde rallado', 'Pasta de maní tostado', 'Pescado y camarón', 'Refrito con achiote y cebolla', 'Tiesto de barro'],
        'faqs': [
            {'q': '¿Cómo se sirve la cazuela de mariscos?', 'a': 'Hirviendo directamente en su cazuela de barro, con arroz blanco y rodajas de limón.'}
        ],
        'volumen_busqueda': 350,
        'regex': r'cazuela'
    },
    {
        'slug': 'encocado-loja',
        'nombre': 'Encocados de Mariscos y Pescado',
        'titulo_h1': 'Encocado en Loja: Salsa de Leche de Coco y Especias Costeñas',
        'seccion': 'Mariscos y Costeña',
        'meta_title': 'Encocado de Mariscos en Loja | Dónde Comer Encocados Tradicionales',
        'meta_description': 'Descubre los mejores encocados en Loja: camarones, pescado o mixtos cocinados en reducción de leche de coco natural y chillangua.',
        'descripcion_corta': 'Mariscos frescos cocidos a fuego lento en leche de coco recién extraída con pimientos, cebolla y hierbas de monte.',
        'historia_tradicion': 'Aporte de la gastronomía afroecuatoriana que ha conquistado los paladares lojanos.',
        'ingredientes_clave': ['Leche de coco natural', 'Camarones o filete de pescado', 'Pimiento y cebolla', 'Chillangua o culantro', 'Arroz blanco y patacones'],
        'faqs': [
            {'q': '¿Qué es el encocado?', 'a': 'Un guiso tradicional donde la proteína marina se cocina en salsa reducida de coco natural.'}
        ],
        'volumen_busqueda': 300,
        'regex': r'encocado'
    },
    {
        'slug': 'camarones-apanados-loja',
        'nombre': 'Camarones Apanados y al Ajillo',
        'titulo_h1': 'Camarones Apanados y al Ajillo en Loja',
        'seccion': 'Mariscos y Costeña',
        'meta_title': 'Camarones en Loja | Dónde Comer Camarones Apanados y al Ajillo',
        'meta_description': 'Dónde pedir camarones apanados crocantes o al ajillo en Loja: camarones dorados con patacones, arroz y salsa tártara de la casa.',
        'descripcion_corta': 'Camarones gigantes empanizados y fritos hasta quedar sumamente crocantes, o bañados en mantequilla con ajo dorado y perejil.',
        'historia_tradicion': 'Uno de los platos más pedidos en cualquier marisquería y restaurante lojano.',
        'ingredientes_clave': ['Camarones seleccionados', 'Panko o pan rallado', 'Ajo picado y mantequilla', 'Patacones de verde', 'Salsa tártara'],
        'faqs': [
            {'q': '¿Con qué vienen acompañados?', 'a': 'Con arroz blanco, patacones calientes y ensalada fresca con salsa tártara.'}
        ],
        'volumen_busqueda': 350,
        'regex': r'camaron apanado|camarones apanados|camaron al ajillo|camarones al ajillo'
    },
    {
        'slug': 'cangrejos-loja',
        'nombre': 'Cangrejos y Cangrejadas',
        'titulo_h1': 'Cangrejadas en Loja: Cangrejo Rojo Criollo a la Olla',
        'seccion': 'Mariscos y Costeña',
        'meta_title': 'Cangrejos en Loja | Dónde Comer Cangrejadas y Carapachos Rellenos',
        'meta_description': 'Los mejores lugares de cangrejos en Loja: cangrejadas con cerveza, especias y albahaca, acompañadas de verde cocido y salsa de cebolla.',
        'descripcion_corta': 'Cangrejo rojo cocinado en olla grande con especias, hierbas y cerveza, servido entero con tabla y mazo para degustar en grupo.',
        'historia_tradicion': 'La experiencia comunitaria favorita de las noches y fines de semana lojanos.',
        'ingredientes_clave': ['Cangrejo rojo vivo', 'Cerveza rubia', 'Albahaca y culantro', 'Maduro y verde cocido', 'Salsa criolla'],
        'faqs': [
            {'q': '¿Dónde comer cangrejos en Loja?', 'a': 'En El Cangrejal del Betto, La Cueva del Cangrejo y marisquerías especializadas.'}
        ],
        'volumen_busqueda': 400,
        'regex': r'cangrejo|cangrejos|cangrejada'
    },

    # ── Carnes, Asados y Parrilladas ──
    {
        'slug': 'parrilladas-loja',
        'nombre': 'Parrilladas al Carbón en Loja',
        'titulo_h1': 'Parrilladas en Loja: Tablas Mixtas de Carnes al Carbón',
        'seccion': 'Parrilladas y Carnes',
        'meta_title': 'Parrilladas en Loja | Los Mejores Asaderos y Steakhouses',
        'meta_description': 'Dónde comer las mejores parrilladas en Loja: cortes de res, chuletas, pollo, chorizos y menestras a la brasa en tablas familiares.',
        'descripcion_corta': 'Surtido de cortes de carne de res, cerdo, pollo y embutidos asados a la brasa con carbón de leña, servidos sobre braseros de mesa.',
        'historia_tradicion': 'Loja cuenta con una amplia tradición asadora con locales emblemáticos frente al Terminal, en Punzara y en miradores occidentales.',
        'ingredientes_clave': ['Bife y lomo de res', 'Chuleta de cerdo', 'Chorizo parrillero', 'Papas asadas o fritas', 'Chimichurri de la casa'],
        'faqs': [
            {'q': '¿Cuánto cuesta una parrillada para dos personas en Loja?', 'a': 'Oscila entre $15.00 y $28.00 USD según los cortes incluidos.'},
            {'q': '¿Cuáles son los asaderos más famosos de Loja?', 'a': 'Parrilladas El Fogón, Morelia Parrilla Fusión, Carbonero Mirador y Banana Grill.'}
        ],
        'volumen_busqueda': 600,
        'regex': r'\bparrillada\b|\bparrilladas\b|\basado\b|\basados\b'
    },
    {
        'slug': 'cortes-premium-loja',
        'nombre': 'Bife, Picaña y Cortes Premium',
        'titulo_h1': 'Cortes de Carne Premium en Loja: Bife de Chorizo, Picaña y Rib Eye',
        'seccion': 'Parrilladas y Carnes',
        'meta_title': 'Cortes de Carne en Loja | Steakhouses de Bife, Picaña y Rib Eye',
        'meta_description': 'Los mejores steakhouses y cortes importados en Loja: Bife de chorizo, Tomahawk, Picaña y New York Steak en su punto exacto.',
        'descripcion_corta': 'Cortes madurados y seleccionados preparados a la parrilla abierta con sal en grano y mantequilla aromatizada.',
        'historia_tradicion': 'En los últimos años Loja ha elevado su nivel gastronómico con steakhouses y parrillas gourmet de estándar internacional.',
        'ingredientes_clave': ['Bife de chorizo angus', 'Picaña certificada', 'Rib eye / Tomahawk', 'Sal marina en grano', 'Chimichurri artesanal'],
        'faqs': [
            {'q': '¿En qué restaurantes pedir cortes finos en Loja?', 'a': 'En Morelia Parrilla, Parrilladas El Fogón, Origen Restaurant y Banana Grill.'}
        ],
        'volumen_busqueda': 500,
        'regex': r'bife|picanha|picaña|rib eye|t-bone|tomahawk|new york steak|vacio'
    },
    {
        'slug': 'lomo-fino-loja',
        'nombre': 'Lomo Fino y Lomo Saltado',
        'titulo_h1': 'Lomo Fino y Lomo Saltado en Loja: Jugoso y Tierno',
        'seccion': 'Parrilladas y Carnes',
        'meta_title': 'Lomo Fino en Loja | Medallones a la Parrilla y Lomo Saltado al Wok',
        'meta_description': 'Dónde comer lomo fino en Loja: medallones a la plancha con salsa de champiñones o clásico lomo saltado al wok con cebolla, tomate y papas.',
        'descripcion_corta': 'El corte más suave de res cocinado a la plancha con salsas gourmet o flambeado al wok con vegetales crocantes.',
        'historia_tradicion': 'Plato estelar tanto en restaurantes de manteles largos como en bistrós del centro de Loja.',
        'ingredientes_clave': ['Lomo fino de res', 'Champiñones frescos', 'Soya y vinagre (lomo saltado)', 'Papas fritas caseras', 'Arroz blanco'],
        'faqs': [
            {'q': '¿Qué precio tiene un lomo fino en Loja?', 'a': 'Entre $9.00 y $16.00 USD según la preparación.'}
        ],
        'volumen_busqueda': 400,
        'regex': r'lomo fino|lomo saltado|lomito saltado|filete de carne|medallon de lomo'
    },
    {
        'slug': 'costillas-bbq-loja',
        'nombre': 'Costillas BBQ y Ahumadas',
        'titulo_h1': 'Costillas BBQ en Loja: Tiernas, Glaseadas y al Horno',
        'seccion': 'Parrilladas y Carnes',
        'meta_title': 'Costillas BBQ en Loja | Dónde Comer Costillas Ahumadas y a la Brasa',
        'meta_description': 'Descubre las costillas BBQ más jugosas de Loja: costillares de cerdo cocidos a fuego lento con salsa barbacoa de la casa y papas rústicas.',
        'descripcion_corta': 'Costillares tiernos que se desprenden del hueso, bañados en salsa barbacoa ahumada dulce o picante.',
        'historia_tradicion': 'Uno de los platos más populares para cenas y reuniones con amigos en Loja (27 locales registrados).',
        'ingredientes_clave': ['Costillar de cerdo seleccionado', 'Salsa barbacoa casera', 'Papas rústicas o fritas', 'Ensalada de col (coleslaw)', 'Especias ahumadas'],
        'faqs': [
            {'q': '¿Cuánto cuesta un rack de costillas en Loja?', 'a': 'Media porción cuesta entre $7.00 y $10.00 USD, y el costillar entero entre $14.00 y $19.00 USD.'}
        ],
        'volumen_busqueda': 400,
        'regex': r'costilla|costillas|ribs'
    },
    {
        'slug': 'pollo-asado-loja',
        'nombre': 'Pollo Asado y a la Brasa',
        'titulo_h1': 'Pollo Asado en Loja: Dorado y Crocante con Papas y Menestra',
        'seccion': 'Parrilladas y Carnes',
        'meta_title': 'Pollo Asado en Loja | Las Mejores Pollerías y Pollos a la Brasa',
        'meta_description': 'Dónde pedir pollo asado en Loja: pollos enteros y combos familiares marinados con especias tradicionales, acompañados de papas fritas y salsas.',
        'descripcion_corta': 'Pollo tierno marinado en adobo casero y dorado al spiedo o al carbón, con piel crujiente y carne jugosa.',
        'historia_tradicion': 'La opción clásica para el almuerzo rápido y cenas familiares lojanas.',
        'ingredientes_clave': ['Pollo entero de granja', 'Adobo con ajo, comino y cerveza', 'Papas fritas crocantes', 'Menestra de fréjol', 'Ají pollero'],
        'faqs': [
            {'q': '¿Cuáles son las pollerías más conocidas de Loja?', 'a': 'Pollos Sandi, Faisán Asados de Casa, Pollos Ricky y El Fogón.'}
        ],
        'volumen_busqueda': 500,
        'regex': r'pollo asado|pollo a la brasa|pollo broaster|cuarto de pollo|medio pollo'
    },
    {
        'slug': 'pinchos-loja',
        'nombre': 'Pinchos y Brochetas al Carbón',
        'titulo_h1': 'Pinchos en Loja: De Carne, Pollo y Chorizo con Papa y Salsa',
        'seccion': 'Parrilladas y Carnes',
        'meta_title': 'Pinchos al Carbón en Loja | Dónde Comer Brochetas Tradicionales',
        'meta_description': 'Los mejores pinchos y brochetas al carbón en Loja: carne suave, pollo marinado y chorizo con papa cocida dorada y ají criollo.',
        'descripcion_corta': 'Brochetas asadas a la brasa en puestos callejeros y asaderos, un bocadillo nocturno indispensable.',
        'historia_tradicion': 'Símbolo del street food lojano en plazas, canchas y esquinas concurridas.',
        'ingredientes_clave': ['Carne de res o pollo', 'Chorizo parrillero', 'Papa cocida', 'Aliño de ajo y achiote', 'Mayonesa y ají casero'],
        'faqs': [
            {'q': '¿Cuánto cuesta un pincho en Loja?', 'a': 'Entre $1.50 y $3.00 USD según el tamaño.'}
        ],
        'volumen_busqueda': 300,
        'regex': r'pincho|pinchos|brocheta|brochetas|chuzo|chuzos'
    },

    # ── Secos, Caldos y Almuerzos Criollos ──
    {
        'slug': 'guatita-loja',
        'nombre': 'Guatita Criolla en Loja',
        'titulo_h1': 'Guatita en Loja: Con Salsa Espesa de Maní, Papas y Arroz Amarillo',
        'seccion': 'Secos y Almuerzos',
        'meta_title': 'Guatita en Loja | Dónde Comer la Mejor Guatita Tradicional',
        'meta_description': 'Dónde comer guatita en Loja Ecuador: mondongo tierno en salsa cremosa de maní con papas en cubos, arroz amarillo, aguacate y huevo.',
        'descripcion_corta': 'Panza de res limpiada y cocinada a la perfección en salsa espesa de pasta de maní, cebolla, ajo y papas amarillas.',
        'historia_tradicion': 'Uno de los platos más populares de los mercados y picanterías lojanas.',
        'ingredientes_clave': ['Mondongo o panza de res', 'Pasta de maní tostado', 'Papas picadas en cubos', 'Achiote y cebolla colorada', 'Arroz amarillo y aguacate'],
        'faqs': [
            {'q': '¿Con qué se acompaña la guatita?', 'a': 'Con arroz blanco o amarillo, rodajas de aguacate fresco y maduro frito.'}
        ],
        'volumen_busqueda': 300,
        'regex': r'\bguatita\b|\bguatitas\b|\bguata\b'
    },
    {
        'slug': 'seco-de-chivo-loja',
        'nombre': 'Seco de Chivo en Loja',
        'titulo_h1': 'Seco de Chivo en Loja: Estofado Lojano con Chicha y Cerveza',
        'seccion': 'Secos y Almuerzos',
        'meta_title': 'Seco de Chivo en Loja | Dónde Comer Auténtico Chivo a la Lojana',
        'meta_description': 'El mejor seco de chivo en Loja: carne tierna macerada con chicha de jora o cerveza y naranjilla, cocinada a fuego lento hasta deshacerse.',
        'descripcion_corta': 'Guiso tradicional de chivo tierno con notas agridulces de naranjilla y cerveza, de salsa espesa y aromática.',
        'historia_tradicion': 'Especialidad de la provincia de Loja gracias a la crianza caprina de valles secos como Zapotillo y Macará.',
        'ingredientes_clave': ['Carne de chivo seleccionada', 'Chicha de jora o cerveza', 'Jugo de naranjilla', 'Achiote, ajo y comino', 'Arroz amarillo y yuca'],
        'faqs': [
            {'q': '¿Dónde comer buen seco de chivo en Loja?', 'a': 'En picanterías tradicionales de Loja y en el camino hacia Catamayo.'}
        ],
        'volumen_busqueda': 250,
        'regex': r'seco de chivo'
    },
    {
        'slug': 'seco-de-pollo-loja',
        'nombre': 'Seco de Pollo y Gallina',
        'titulo_h1': 'Seco de Pollo en Loja: El Plato Casero por Excelencia',
        'seccion': 'Secos y Almuerzos',
        'meta_title': 'Seco de Pollo en Loja | Dónde Comer Almuerzos Ejecutivos con Seco',
        'meta_description': 'Dónde tomar un delicioso seco de pollo en Loja: presas tiernas de pollo en salsa licuada de pimiento, tomate y cilantro con arroz amarillo y maduro.',
        'descripcion_corta': 'Estofado aromático de presas de pollo cocinadas en refrito criollo con toque cítrico y abundante cilantro picado.',
        'historia_tradicion': 'El almuerzo de diario más vendido y solicitado en los restaurantes lojanos.',
        'ingredientes_clave': ['Presas de pollo de campo', 'Tomate, pimiento y cebolla colorada', 'Cerveza o jugo de fruta', 'Culantro fresco', 'Arroz y maduro frito'],
        'faqs': [
            {'q': '¿Cuánto cuesta un almuerzo con seco de pollo en Loja?', 'a': 'El menú del día con sopa y seco de pollo oscila entre $2.50 y $4.00 USD.'}
        ],
        'volumen_busqueda': 350,
        'regex': r'seco de pollo|seco de gallina'
    },
    {
        'slug': 'seco-de-carne-loja',
        'nombre': 'Seco de Chancho y Res',
        'titulo_h1': 'Seco de Cerdo y Costilla en Loja: Sabor Casero Tradicional',
        'seccion': 'Secos y Almuerzos',
        'meta_title': 'Seco de Cerdo y Carne en Loja | Dónde Probar Guisados Caseros',
        'meta_description': 'Platos de seco de cerdo, costilla o carne estofada en Loja con ensalada rusa, arroz caliente y maduro frito.',
        'descripcion_corta': 'Carne de cerdo o costilla cocinada lentamente hasta que la salsa espese con los jugos naturales del refrito.',
        'historia_tradicion': 'Muy popular en comedores populares y picanterías del centro de Loja.',
        'ingredientes_clave': ['Costilla o carne de cerdo', 'Refrito criollo', 'Cerveza o chicha', 'Arroz y ensalada rusa', 'Culantro'],
        'faqs': [
            {'q': '¿Con qué se sirve el seco de costilla?', 'a': 'Comúnmente con ensalada rusa (papa, zanahoria y mayonesa) y arroz blanco.'}
        ],
        'volumen_busqueda': 300,
        'regex': r'seco de chancho|seco de cerdo|seco de carne|seco de res|seco de costilla|guisado de carne'
    },
    {
        'slug': 'menestras-loja',
        'nombre': 'Menestras con Carne al Carbón',
        'titulo_h1': 'Menestras en Loja: Fréjol y Lenteja con Carnes a la Brasa',
        'seccion': 'Secos y Almuerzos',
        'meta_title': 'Menestras en Loja | Dónde Comer Menestra de Fréjol o Lenteja',
        'meta_description': 'Dónde comer menestras en Loja: fréjol canario o lenteja cocinada a fuego lento con carne asada, chuleta, arroz blanco y patacones.',
        'descripcion_corta': 'Guiso espeso de granos tiernos o secos con queso y refrito de achiote, servido con arroz y proteínas a las brasas.',
        'historia_tradicion': 'Cena favorita de los lojanos en cadenas y locales tradicionales como Frijol Dish y Menestras del Negro.',
        'ingredientes_clave': ['Fréjol canario, negro o lenteja', 'Carne de res o chuleta asada', 'Arroz blanco', 'Patacones de plátano verde', 'Queso rallado en la menestra'],
        'faqs': [
            {'q': '¿Cuáles son los locales más conocidos de menestras en Loja?', 'a': 'Frijol Dish (centro) y Menestras del Negro (Multiplaza).'}
        ],
        'volumen_busqueda': 400,
        'regex': r'\bmenestra\b|\bmenestras\b'
    },
    {
        'slug': 'churrasco-loja',
        'nombre': 'Churrasco Ecuatoriano',
        'titulo_h1': 'Churrasco en Loja: Carne Asada con Huevos Fritos y Papas',
        'seccion': 'Platos Fuertes',
        'meta_title': 'Churrasco en Loja | Dónde Comer el Tradicional Churrasco Completo',
        'meta_description': 'Los mejores churrascos en Loja: filete de carne jugosa con dos huevos fritos montados, papas fritas crocantes, arroz y ensalada criolla.',
        'descripcion_corta': 'Plato contundente con filete de res o pollo asado, coronado con huevos fritos de yema tierna, papas fritas y ensalada.',
        'historia_tradicion': 'El clásico de los restaurantes y cafeterías lojanas cuando se busca un plato completo y llenador.',
        'ingredientes_clave': ['Filete de lomo de res', 'Huevos de campo fritos', 'Papas fritas caseras', 'Arroz blanco', 'Tomate, lechuga y cebolla'],
        'faqs': [
            {'q': '¿Cuánto cuesta un churrasco en Loja?', 'a': 'Entre $5.00 y $9.00 USD según el restaurante.'}
        ],
        'volumen_busqueda': 300,
        'regex': r'\bchurrasco\b'
    },
    {
        'slug': 'banderas-loja',
        'nombre': 'Banderas y Platos Combinados',
        'titulo_h1': 'Banderas en Loja: Guatita, Encebollado y Ceviche en un Solo Plato',
        'seccion': 'Platos Fuertes',
        'meta_title': 'Banderas en Loja | Dónde Comer Platos Combinados de Mariscos y Criolla',
        'meta_description': 'Dónde comer la bandera completa en Loja: combinación generosa de encebollado, guatita, ceviche de camarón o concha y arroz amarillo.',
        'descripcion_corta': 'Plato emblemático que reúne tres o más especialidades criollas y marinas en un mismo plato para quienes lo quieren todo.',
        'historia_tradicion': 'Típico de las marisquerías y comedores de Loja para los fines de semana.',
        'ingredientes_clave': ['Porción de guatita', 'Porción de encebollado', 'Ceviche de camarón o concha', 'Arroz amarillo', 'Aguacate y chifle'],
        'faqs': [
            {'q': '¿Qué incluye una bandera ecuatoriana?', 'a': 'Tradicionalmente incluye guatita con maní, encebollado de albacora y ceviche de camarón o concha.'}
        ],
        'volumen_busqueda': 250,
        'regex': r'\bbandera\b|\bbanderas\b'
    },

    # ── Comida Rápida y Pizzerías ──
    {
        'slug': 'hamburguesas-artesanales-loja',
        'nombre': 'Hamburguesas Artesanales',
        'titulo_h1': 'Hamburguesas en Loja: Artesanales, al Carbón y Smash Burgers',
        'seccion': 'Comida Rápida',
        'meta_title': 'Hamburguesas en Loja | Las Mejores Hamburgueserías de la Ciudad',
        'meta_description': 'Ruta de las mejores hamburguesas en Loja: carne 100% de res al carbón, pan brioche artesanal, queso cheddar fundido y papas rústicas.',
        'descripcion_corta': 'Hamburguesas gourmet preparadas con cortes de carne seleccionados, queso fundido, tocineta crocante y salsas de la casa.',
        'historia_tradicion': 'Uno de los sectores gastronómicos con mayor dinamismo y creatividad en Loja (26 hamburgueserías registradas).',
        'ingredientes_clave': ['Carne de res molida artesanal', 'Pan brioche o de papa', 'Queso cheddar o mozzarella', 'Tocineta ahumada', 'Papas fritas con sal de especias'],
        'faqs': [
            {'q': '¿Dónde comer las mejores hamburguesas en Loja?', 'a': 'En CABA Burguer, Carbón Burger, Dumas, Morelia y locales frente a La Pileta.'},
            {'q': '¿Cuánto cuesta una hamburguesa en Loja?', 'a': 'Entre $4.00 y $8.50 USD en combos con papas y bebida.'}
        ],
        'volumen_busqueda': 1000,
        'regex': r'hamburguesa|burger|burguer'
    },
    {
        'slug': 'alitas-loja',
        'nombre': 'Alitas BBQ y Picantes',
        'titulo_h1': 'Alitas en Loja: BBQ, Miel Mostaza, Maracuyá y Picantes',
        'seccion': 'Comida Rápida',
        'meta_title': 'Alitas en Loja | Dónde Comer Alitas BBQ y con Salsas Picantes',
        'meta_description': 'Los mejores locales de alitas en Loja: porciones crocantes bañadas en salsa BBQ, búfalo, maracuyá picante o miel mostaza con papas y apio.',
        'descripcion_corta': 'Alitas de pollo fritas a la perfección, bañadas en una amplia variedad de salsas dulces, ahumadas y picantes.',
        'historia_tradicion': 'El piqueo favorito para compartir por las noches con cerveza artesanal en Loja (36 locales activos).',
        'ingredientes_clave': ['Alitas de pollo seleccionadas', 'Salsa BBQ ahumada', 'Salsa búfalo picante', 'Papas fritas', 'Aderezo ranch o queso azul'],
        'faqs': [
            {'q': '¿Dónde hay promociones de alitas en Loja?', 'a': 'Alas Bielas, Moraty Wings, Las Alitas del Chef y Banana Grill ofrecen promociones entre semana.'}
        ],
        'volumen_busqueda': 800,
        'regex': r'alitas|wings'
    },
    {
        'slug': 'pizza-artesanal-loja',
        'nombre': 'Pizzas Artesanales en Horno',
        'titulo_h1': 'Pizzas en Loja: Artesanales, al Horno de Leña y Masa Madre',
        'seccion': 'Comida Rápida',
        'meta_title': 'Pizzas en Loja | Las Mejores Pizzerías Artesanales y a Domicilio',
        'meta_description': 'Dónde pedir la mejor pizza en Loja: masa delgada y crocante horneada a la leña, salsa pomodoro italiana, abundante queso mozzarella y delivery.',
        'descripcion_corta': 'Pizzas elaboradas a mano con ingredientes de primera calidad, queso mozzarella fundido y orégano seco sobre base crocante.',
        'historia_tradicion': 'Loja tiene pizzerías legendarias con décadas de trayectoria como Roma Pizzería y nuevas opciones gourmet con masa madre.',
        'ingredientes_clave': ['Masa artesanal fermentada', 'Salsa de tomate casera', 'Queso mozzarella artesanal', 'Pepperoni, jamón o vegetales', 'Aceite de oliva y orégano'],
        'faqs': [
            {'q': '¿Cuáles son las pizzerías más reconocidas de Loja?', 'a': 'Roma Pizzería, Forno di Fango, Mondragone Pizzería, CurArte y Lojanos Pizzería.'},
            {'q': '¿Cuánto cuesta una pizza familiar en Loja?', 'a': 'Entre $12.00 y $20.00 USD según los ingredientes.'}
        ],
        'volumen_busqueda': 1500,
        'regex': r'pizza|pizzas'
    },
    {
        'slug': 'salchipapas-loja',
        'nombre': 'Salchipapas y Papas Cargadas',
        'titulo_h1': 'Salchipapas en Loja: Con Carne, Queso y Salsas Especiales',
        'seccion': 'Comida Rápida',
        'meta_title': 'Salchipapas en Loja | Dónde Comer Salchipapas y Papas del Hueco',
        'meta_description': 'Los mejores lugares de salchipapas en Loja: papas fritas doradas con salchicha especial, carne mechada, queso fundido y salsas al paso.',
        'descripcion_corta': 'Porciones abundantes de papas fritas con salchichas seleccionadas, trozos de carne asada y aderezos especiales.',
        'historia_tradicion': 'Ícono juvenil y universitario nocturno en Loja con marcas de culto como Las Papas del Hueco y Doozz-Inn.',
        'ingredientes_clave': ['Papas fritas crocantes', 'Salchicha especial o ahumada', 'Carne de res mechada', 'Queso derretido', 'Salsas tártara, golf y ají'],
        'faqs': [
            {'q': '¿Dónde comer las mejores salchipapas en Loja?', 'a': 'En Las Papas del Hueco (Sucre), Doozz-Inn (San Sebastián) y Papas XL (Punzara).'}
        ],
        'volumen_busqueda': 400,
        'regex': r'salchipapa|salchipapas|papas con carne|papas del hueco|papas cargadas|papas fritas'
    },
    {
        'slug': 'hot-dogs-loja',
        'nombre': 'Hot Dogs y Choripán',
        'titulo_h1': 'Hot Dogs y Choripán en Loja: Con Pan Suave y Salsas Caseras',
        'seccion': 'Comida Rápida',
        'meta_title': 'Hot Dogs en Loja | Dónde Comer Perros Calientes y Choripanes',
        'meta_description': 'Dónde comer hot dogs en Loja: salchicha americana, pan caliente, papas al hilo, queso rallado y aderezos caseros al paso.',
        'descripcion_corta': 'Perros calientes clásicos y gourmet con salchichas asadas o al vapor, salsas especiales y acompañamientos crocantes.',
        'historia_tradicion': 'Comida rápida tradicional nocturna lojana presente en carritos y locales céntricos.',
        'ingredientes_clave': ['Salchicha de calidad o chorizo', 'Pan para hot dog suave', 'Papas al hilo crocantes', 'Cebolla picada', 'Salsas caseras'],
        'faqs': [
            {'q': '¿Cuánto cuesta un hot dog en Loja?', 'a': 'Entre $1.00 y $3.00 USD según los agregados.'}
        ],
        'volumen_busqueda': 300,
        'regex': r'hot dog|hot-dog|perro caliente|choripan'
    },
    {
        'slug': 'sandwiches-loja',
        'nombre': 'Sándwiches y Sanduches Artesanales',
        'titulo_h1': 'Sándwiches en Loja: De Lomo, Pollo, Queso y Estilo Americano',
        'seccion': 'Comida Rápida',
        'meta_title': 'Sándwiches en Loja | Las Mejores Sanducherías y Baguettes',
        'meta_description': 'Dónde comer sándwiches en Loja: pan artesanal ciabatta o baguette relleno de lomo fino, pollo marinado, pernil horneado y quesos finos.',
        'descripcion_corta': 'Sándwiches gourmet con panes horneados diariamente y carnes jugosas a la plancha con vegetales frescos.',
        'historia_tradicion': 'Alternativa fresca para almuerzos ligeros y cenas en cafeterías de la ciudad.',
        'ingredientes_clave': ['Pan artesanal ciabatta o baguette', 'Lomo de res, pollo o pernil', 'Queso mozzarella o gouda', 'Lechuga y tomate fresco', 'Salsas gourmet'],
        'faqs': [
            {'q': '¿Dónde comer buenos sándwiches en Loja?', 'a': 'En Philadelphia 98, Rooti Sandwich, CurArte y cafeterías de San Sebastián.'}
        ],
        'volumen_busqueda': 300,
        'regex': r'sandwich|sandwiches|sanduche|sanduches'
    },
    {
        'slug': 'tacos-mexicanos-loja',
        'nombre': 'Tacos, Burritos y Quesadillas',
        'titulo_h1': 'Comida Mexicana en Loja: Tacos al Pastor, Burritos y Quesadillas',
        'seccion': 'Comida Rápida',
        'meta_title': 'Tacos en Loja | Los Mejores Restaurantes de Comida Mexicana',
        'meta_description': 'Dónde comer auténticos tacos en Loja: tortillas de maíz o harina con carne al pastor, birria, pollo, guacamole, frijoles refritos y pico de gallo.',
        'descripcion_corta': 'Platos de sabor mexicano con tortillas calientes, carnes sazonadas con especias, queso fundido y salsas picantes.',
        'historia_tradicion': 'Creciente pasión por los tacos y comida tex-mex en Loja con locales temáticos populares.',
        'ingredientes_clave': ['Tortillas de maíz y trigo', 'Carne al pastor, asada o birria', 'Queso mozzarella fundido', 'Guacamole fresco', 'Pico de gallo y jalapeños'],
        'faqs': [
            {'q': '¿Cuáles son los restaurantes mexicanos más visitados de Loja?', 'a': 'Papá Charro, Con Permisito Dijo Monchito, Micheladas Express y Nachos del Güero.'}
        ],
        'volumen_busqueda': 500,
        'regex': r'taco|tacos|burrito|burritos|quesadilla|quesadillas|nachos|fajitas'
    },

    # ── Cocina Internacional y Fusión ──
    {
        'slug': 'chifa-chaulafan-loja',
        'nombre': 'Chifa y Chaulafán en Loja',
        'titulo_h1': 'Chifa en Loja: Chaulafán Especial, Tallarines y Wantanes',
        'seccion': 'Cocina Internacional',
        'meta_title': 'Chifa en Loja | Los Mejores Restaurantes de Comida China y Chaulafán',
        'meta_description': 'Dónde pedir chifa en Loja: generosas porciones de chaulafán especial con pollo, cerdo y camarón, tallarines saltados y wantanes fritos con salsa agridulce.',
        'descripcion_corta': 'Arroz frito al wok a fuego intenso con carnes mixtas, cebollín y salsa de soya, con porciones sumamente rendidoras.',
        'historia_tradicion': 'Los chifas son un pilar clásico de los almuerzos y cenas en Loja desde hace décadas (Chifa Oriental, Amazonas, Bang Kok).',
        'ingredientes_clave': ['Arroz blanco frío de grano largo', 'Pollo, cerdo asado y camarón', 'Salsa de soya y sillao', 'Cebollín y huevo revuelto', 'Wantán crocante'],
        'faqs': [
            {'q': '¿Cuáles son los chifas más tradicionales de Loja?', 'a': 'Chifa Oriental (San Sebastián), Chifa Amazonas y Chifa Bang Kok.'},
            {'q': '¿Cuánto cuesta un chaulafán en Loja?', 'a': 'Entre $4.00 y $7.50 USD por platos muy abundantes.'}
        ],
        'volumen_busqueda': 800,
        'regex': r'chifa|chaulafan|chaufan|arroz chino|tallarin saltado|wantan|kam lu wantan'
    },
    {
        'slug': 'sushi-rolls-loja',
        'nombre': 'Sushi, Rolls y Makis',
        'titulo_h1': 'Sushi en Loja: Rolls Tropicales, Tempura y Makis',
        'seccion': 'Cocina Internacional',
        'meta_title': 'Sushi en Loja | Los Mejores Restaurantes Japoneses y Rolls',
        'meta_description': 'Dónde comer sushi en Loja: rolls acebichados, tempurizados, salmón fresco, atún y opciones vegetarianas con salsa teriyaki y soya.',
        'descripcion_corta': 'Rolls elaborados con arroz avinagrado, pescados frescos, mariscos y toques de frutas tropicales como mango y maracuyá.',
        'historia_tradicion': 'Propuesta moderna de alta demanda en locales como Maku Sushi y Mulatto Rooftop.',
        'ingredientes_clave': ['Arroz para sushi (shari)', 'Salmón o atún fresco', 'Queso crema y aguacate', 'Alga nori', 'Salsa de soya y teriyaki'],
        'faqs': [
            {'q': '¿Dónde comer sushi en Loja?', 'a': 'En Maku Sushi (Rocafuerte) y Mulatto Rooftop (centro).'}
        ],
        'volumen_busqueda': 450,
        'regex': r'sushi|roll|rolls|maki|makis|sashimi|poke'
    },
    {
        'slug': 'pastas-italianas-loja',
        'nombre': 'Pastas Italianas, Lasaña y Ravioles',
        'titulo_h1': 'Pastas Italianas en Loja: Lasañas, Tagliatelle y Fetuccinis',
        'seccion': 'Cocina Internacional',
        'meta_title': 'Pastas en Loja | Los Mejores Restaurantes Italianos y Trattorias',
        'meta_description': 'Dónde comer pasta fresca en Loja: lasaña de carne horneada, tagliatelle a la carbonara, al pesto o con frutos del mar en trattorias tradicionales.',
        'descripcion_corta': 'Pastas artesanales preparadas con sémola de trigo duro y salsas clásicas italianas de cocción lenta.',
        'historia_tradicion': 'Trattorias emblemáticas en Loja con cocina italiana auténtica como Roma Pizzería y CurArte.',
        'ingredientes_clave': ['Pasta fresca de trigo', 'Salsa pomodoro y carne de res', 'Queso parmesano y mozzarella', 'Pesto de albahaca con nueces', 'Crema y panceta'],
        'faqs': [
            {'q': '¿Dónde comer pasta italiana en Loja?', 'a': 'En Roma Pizzería, CurArte Loja, Forno di Fango y Mondragone.'}
        ],
        'volumen_busqueda': 500,
        'regex': r'pasta|pastas|spaghetti|tagliatelle|fetuccini|fettuccine|lasa|ravioles|gnocchis|carbonara|bolognesa|pesto'
    },
    {
        'slug': 'tablas-charcuteria-loja',
        'nombre': 'Tablas de Jamones y Quesos',
        'titulo_h1': 'Tablas de Quesos y Charcutería en Loja: Para Maridar con Vino',
        'seccion': 'Cocina Internacional',
        'meta_title': 'Tablas de Quesos en Loja | Charcutería Fina y Piqueos para Vinos',
        'meta_description': 'Dónde pedir tablas de charcutería en Loja: jamón serrano, prosciutto, salami, quesos maduros, frutos secos y panes artesanales.',
        'descripcion_corta': 'Presentaciones elegantes de fiambres curados y quesos selectos para compartir acompañados de una copa de vino.',
        'historia_tradicion': 'Opción gourmet muy demandada en los wine bars y restobares del centro histórico.',
        'ingredientes_clave': ['Jamón serrano y prosciutto', 'Quesos maduros y gouda', 'Frutos secos y uvas', 'Mermeladas artesanales', 'Panes tostados'],
        'faqs': [
            {'q': '¿Dónde disfrutar de tablas de quesos en Loja?', 'a': 'En CurArte Charcutería & Wine y restobares del centro.'}
        ],
        'volumen_busqueda': 300,
        'regex': r'tabla|tablas|charcuter|jamon serrano|prosciutto'
    },
    {
        'slug': 'waffles-crepes-loja',
        'nombre': 'Waffles, Crepes y Pancakes',
        'titulo_h1': 'Waffles y Crepes en Loja: Con Frutas, Chocolate y Helado',
        'seccion': 'Cafeterías y Bebidas',
        'meta_title': 'Waffles en Loja | Dónde Comer Crepes Dulces y Pancakes',
        'meta_description': 'Los mejores waffles y crepes en Loja: masa crujiente recién horneada con fresas, nutella, banano, crema chantilly y helado artesanal.',
        'descripcion_corta': 'Dulces preparados al momento con masas suaves y doradas acompañadas de toppings y frutas frescas.',
        'historia_tradicion': 'El preferido de los jóvenes y familias para la tarde en las cafeterías lojanas.',
        'ingredientes_clave': ['Masa de waffle o crepe', 'Nutella o chocolate derretido', 'Fresas y plátano fresco', 'Helado artesanal', 'Crema chantilly'],
        'faqs': [
            {'q': '¿Dónde comer waffles en Loja?', 'a': 'En cafeterías especializadas del centro histórico y San Sebastián.'}
        ],
        'volumen_busqueda': 350,
        'regex': r'waffle|waffles|crepe|crepes|pancake|pancakes'
    },
    {
        'slug': 'postres-tortas-loja',
        'nombre': 'Tortas, Cheesecakes y Pastelería',
        'titulo_h1': 'Postres y Tortas en Loja: Cheesecakes, Tres Leches y Brownies',
        'seccion': 'Cafeterías y Bebidas',
        'meta_title': 'Postres en Loja | Las Mejores Pastelerías, Tortas y Cheesecakes',
        'meta_description': 'Guía de postres y pastelerías en Loja: cheesecakes de maracuyá y frutos rojos, torta tres leches, pastel de chocolate y brownies artesanales.',
        'descripcion_corta': 'Repostería fina tradicional y moderna elaborada por maestros pasteleros de la ciudad de Loja.',
        'historia_tradicion': 'Loja tiene una célebre tradición pastelera ligada a sus conventos y familias dulceras tradicionales.',
        'ingredientes_clave': ['Queso crema para cheesecake', 'Bizcocho tres leches', 'Cacao ecuatoriano fino de aroma', 'Frutos rojos y maracuyá', 'Crema de leche fresca'],
        'faqs': [
            {'q': '¿Dónde merendar un buen postre en Loja?', 'a': 'En cafeterías y pastelerías de San Sebastián, El Sagrario y El Valle.'}
        ],
        'volumen_busqueda': 400,
        'regex': r'cheesecake|torta|pastel|pie de|brownie|tres leches|tiramisu'
    }
]

# 2. Insertar o Actualizar los 50 Platos en platos_catalogo
total_platos_insertados = 0
total_items_vinculados = 0

for p in PLATOS_METADATA:
    slug = p['slug']
    nombre = p['nombre']
    titulo_h1 = p['titulo_h1']
    seccion = p['seccion']
    meta_title = p['meta_title']
    meta_description = p['meta_description']
    descripcion_corta = p['descripcion_corta']
    historia = p['historia_tradicion']
    ingredientes_json = json.dumps(p['ingredientes_clave'], ensure_ascii=False)
    faqs_json = json.dumps(p['faqs'], ensure_ascii=False)
    volumen = p['volumen_busqueda']
    
    # Calcular rango de precios a partir de los items scrapeados
    pat = p['regex']
    matched_items = []
    for it in items:
        nom_i = str(it.get('nom') or '')
        desc_i = str(it.get('desc') or '')
        cat_i = str(it.get('cat') or '')
        txt = f'{nom_i} {desc_i} {cat_i}'.lower()
        if re.search(pat, txt):
            matched_items.append(it)
            
    precios_validos = [i['p_num'] for i in matched_items if i.get('p_num') is not None and isinstance(i['p_num'], (int, float))]
    if precios_validos:
        min_p = min(precios_validos)
        max_p = max(precios_validos)
        rango_precio = f'${min_p:.2f} - ${max_p:.2f} USD'
    else:
        rango_precio = '$3.00 - $8.00 USD'
        
    hero_img = f'https://mvps.b-cdn.net/quecomerenloja/platos/{slug}.webp'
    
    # Insertar plato
    sql_upsert_plato = """
    INSERT INTO platos_catalogo (
      slug, nombre, titulo_h1, seccion, meta_title, meta_description,
      descripcion_corta, historia_tradicion, ingredientes_clave, faqs,
      rango_precio_loja, hero_imagen_url, volumen_busqueda, activo
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 1)
    ON DUPLICATE KEY UPDATE
      nombre = VALUES(nombre),
      titulo_h1 = VALUES(titulo_h1),
      seccion = VALUES(seccion),
      meta_title = VALUES(meta_title),
      meta_description = VALUES(meta_description),
      descripcion_corta = VALUES(descripcion_corta),
      historia_tradicion = VALUES(historia_tradicion),
      ingredientes_clave = VALUES(ingredientes_clave),
      faqs = VALUES(faqs),
      rango_precio_loja = VALUES(rango_precio_loja),
      volumen_busqueda = VALUES(volumen_busqueda);
    """
    cursor.execute(sql_upsert_plato, (
        slug, nombre, titulo_h1, seccion, meta_title, meta_description,
        descripcion_corta, historia, ingredientes_json, faqs_json,
        rango_precio, hero_img, volumen
    ))
    
    # Obtener el ID del plato
    cursor.execute("SELECT id FROM platos_catalogo WHERE slug = %s", (slug,))
    plato_id = cursor.fetchone()[0]
    total_platos_insertados += 1
    
    # Limpiar items anteriores para este plato si existieran
    cursor.execute("DELETE FROM plato_restaurantes WHERE plato_id = %s", (plato_id,))
    
    # Insertar los items de restaurante correspondientes
    for it in matched_items:
        id_loc = it.get('id_local')
        rest_name = it.get('rest')
        item_nom = it.get('nom')
        item_desc = it.get('desc')
        p_txt = it.get('p_txt')
        p_num = it.get('p_num')
        cat_excel = it.get('cat')
        
        # Cruzar con rest_dict para direccion y parroquia
        r_info = rest_dict.get(id_loc, {})
        direccion = r_info.get('direccion') or ''
        parroquia = r_info.get('parroquia') or ''
        
        sql_insert_item = """
        INSERT INTO plato_restaurantes (
          plato_id, id_local_excel, nombre_restaurante, item_carta,
          descripcion_item, precio_textual, precio_numerico, moneda,
          categoria_excel, direccion, parroquia
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, 'USD', %s, %s, %s)
        """
        cursor.execute(sql_insert_item, (
            plato_id, id_loc, rest_name, item_nom,
            item_desc, str(p_txt) if p_txt else None,
            p_num if isinstance(p_num, (int, float)) else None,
            cat_excel, direccion, parroquia
        ))
        total_items_vinculados += 1

conn.commit()
print(f"Éxito: {total_platos_insertados} platos insertados en platos_catalogo.")
print(f"Éxito: {total_items_vinculados} platos/ítems de restaurantes vinculados en plato_restaurantes.")

# Verificación final
cursor.execute("SELECT seccion, count(*) FROM platos_catalogo GROUP BY seccion;")
for row in cursor.fetchall():
    print(f"  Sección [{row[0]}]: {row[1]} platos")

conn.close()
