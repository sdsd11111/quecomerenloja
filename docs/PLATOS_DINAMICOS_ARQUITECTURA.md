# Documentación Técnica: Arquitectura de Platos Dinámicos en Loja

## 1. Resumen Ejecutivo y Estado del Proyecto
Se implementó un sistema de **páginas dinámicas ultra-optimizadas para SEO local** para posicionar el portal en intenciones transaccionales e informativas clave en Loja, Ecuador (*"Dónde comer [plato] en Loja"*, *"Precios de [plato] en Loja"*, *"Quién vende [plato]"*).

La base de datos central de gastronomía (`GASTRONOMIA_DB_URL`: `quecomerlojadinamic-313931562a`) almacena el catálogo estructurado de **62 platos/intenciones maestras** y **1,768 platos reales vinculados de restaurantes locales** extraídos del scrapeo e investigación del cantón Loja.

---

## 2. Esquema Relacional de Base de Datos (MySQL)

### Tabla `platos_catalogo`
Almacena la metadata editorial, SEO y de posicionamiento por cada plato:
* `id` (INT, PK, AUTO_INCREMENT)
* `slug` (VARCHAR(100), UNIQUE): Ejemplo `repe-lojano`, `parihuela-loja`, `cecina-lojana`.
* `nombre` (VARCHAR(150)): Nombre comercial legible (ej. *Repe Lojano*, *Parihuela de Mariscos*).
* `titulo_h1` (VARCHAR(255)): Título principal enriquecido para CTR local.
* `seccion` (VARCHAR(100)): Categoría macro (*Tradicional Lojana*, *Mariscos y Costeña*, *Parrilladas y Carnes*, *Comida Rápida*, etc.).
* `meta_title` (VARCHAR(255)): Title tag optimizado para Google.
* `meta_description` (TEXT): Meta descripción con intención local y palabras clave.
* `descripcion_corta` (TEXT): Definición del plato y características culinarias.
* `historia_tradicion` (TEXT): Reseña cultural, orígenes en Loja y tradición.
* `ingredientes_clave` (JSON): Lista de ingredientes principales para Schema Recipe.
* `faqs` (JSON): Preguntas y respuestas frecuentes para Rich Snippet FAQPage.
* `rango_precio_loja` (VARCHAR(100)): Precios observados reales (ej. *$6.00 - $14.00 USD*).
* `hero_imagen_url` (VARCHAR(500)): URL optimizada en CDN Bunny (`https://mvps.b-cdn.net/quecomerenloja/platos/[slug].webp`).
* `volumen_busqueda` (INT): Volumen mensual estimado según Google Keyword Planner.
* `activo` (TINYINT(1)): Flag de visibilidad pública.

### Tabla `plato_restaurantes`
Relaciona cada plato con las opciones reales de las cartas de los restaurantes de Loja:
* `id` (INT, PK, AUTO_INCREMENT)
* `plato_id` (INT, FK -> `platos_catalogo.id` ON DELETE CASCADE)
* `id_local_excel` (VARCHAR(50)): Código del local en MINTUR / Scrapeo (ej. `LOJ-URB-153`).
* `nombre_restaurante` (VARCHAR(150)): Nombre del restaurante en Loja.
* `item_carta` (VARCHAR(255)): Nombre exacto del plato en el menú del local.
* `descripcion_item` (TEXT): Descripción textual o ingredientes dados por el local.
* `precio_textual` (VARCHAR(50)): Formato original de carta (ej. *$8.00*).
* `precio_numerico` (DECIMAL(10,2)): Valor normalizado en USD.
* `moneda` (VARCHAR(10)): `USD`.
* `categoria_excel` (VARCHAR(100)): Sección del menú donde fue hallado.
* `direccion` (VARCHAR(255)): Dirección física observada en Loja.
* `parroquia` (VARCHAR(100)): Parroquia urbana (*El Sagrario*, *San Sebastián*, *El Valle*, *Sucre*, etc.).
* `es_aliado_destacado` (TINYINT(1)): Si es cliente comercial prioritario.
* `aliado_id` (INT, NULL): Vínculo con la tabla `aliados`.

---

## 3. Catálogo Completo de los 62 Platos / Intenciones Implementadas

### A. Tradicional Lojana y de la Sierra (12 Platos)
1. `repe-lojano`: Repe Lojano (Sopa de guineo verde y quesillo)
2. `cecina-lojana`: Cecina Lojana (Carne de cerdo ahumada al carbón)
3. `tamales-lojanos`: Tamales Lojanos en Hoja de Achira
4. `humitas-loja`: Humitas Lojanas de Choclo Tierno
5. `quimbolitos-loja`: Quimbolitos Lojanos al Vapor
6. `cuy-asado-loja`: Cuy Asado en Loja y El Valle
7. `gallina-cuyada-loja`: Gallina Cuyada estilo tradicional
8. `arveja-con-guineo-loja`: Sopa de Arveja con Guineo
9. `sango-loja`: Sango de Maíz con Quesillo o Mariscos
10. `locro-loja`: Locros y Sopas Andinas de Papa
11. `chicharron-loja`: Chicharrones y Piqueos de Cerdo con Mote
12. `fritada-lojana`: Fritada Lojana con Mote, Yuca y Ají de Pepa

### B. Desayunos y Tradicional (5 Platos)
13. `bolones-loja`: Bolones de Verde (Queso, Chicharrón, Mixtos)
14. `tigrillo-loja`: Tigrillo Lojano con Queso y Huevo
15. `empanadas-loja`: Empanadas de Verde y Morocho
16. `cafe-especialidad-loja`: Café de Especialidad y Filtrados (V60, Chemex)
17. `desayunos-continentales-loja`: Desayunos Continentales, Omelettes y Huevos al Gusto

### C. Mariscos y Cocina Costeña (11 Platos)
18. `parihuela-loja`: Parihuela de Mariscos concentrada
19. `encebollado-loja`: Encebollado de Albacora y Mixtos
20. `ceviche-pescado-loja`: Ceviche de Pescado y Estilo Peruano
21. `ceviche-concha-loja`: Ceviche de Concha Negra de Manglar
22. `ceviche-camaron-loja`: Ceviche Clásico de Camarón
23. `ceviche-mixto-loja`: Ceviche Mixto y Maremoto
24. `arroz-marinero-loja`: Arroz Marinero Salteado con Mariscos
25. `cazuela-mariscos-loja`: Cazuela de Mariscos al Horno de Barro
26. `encocado-loja`: Encocados en Leche de Coco Natural
27. `camarones-apanados-loja`: Camarones Apanados y al Ajillo
28. `cangrejos-loja`: Cangrejos y Cangrejadas a la Olla

### D. Carnes, Asados y Parrilladas (7 Platos)
29. `parrilladas-loja`: Parrilladas al Carbón y Tablas Familiares
30. `cortes-premium-loja`: Bife de Chorizo, Picaña y Tomahawk
31. `lomo-fino-loja`: Lomo Fino y Lomo Saltado al Wok
32. `costillas-bbq-loja`: Costillas BBQ Glaseadas y Ahumadas
33. `pollo-asado-loja`: Pollo Asado y a la Brasa
34. `pinchos-loja`: Pinchos y Brochetas al Carbón
35. `carnes-cerdo-chuletas-loja`: Chuletas de Cerdo, Panceta y Cortes Criollos

### E. Secos, Caldos y Almuerzos Criollos (9 Platos)
36. `guatita-loja`: Guatita Criolla con Maní y Arroz Amarillo
37. `seco-de-chivo-loja`: Seco de Chivo Estofado con Chicha y Cerveza
38. `seco-de-pollo-loja`: Seco de Pollo y Gallina Casero
39. `seco-de-carne-loja`: Seco de Chancho y Res
40. `menestras-loja`: Menestras de Fréjol o Lenteja con Asado
41. `churrasco-loja`: Churrasco Ecuatoriano con Huevos y Papas
42. `banderas-loja`: Banderas (Guatita, Encebollado y Ceviche)
43. `caldos-sopas-criollas-loja`: Caldos de Gallina Criolla y Sopas Reconstituyentes
44. `almuerzos-ejecutivos-loja`: Almuerzos Ejecutivos y Menú Diario Completo

### F. Comida Rápida, Piqueos e Internacional (9 Platos)
45. `hamburguesas-artesanales-loja`: Hamburguesas al Carbón y Smash Burgers
46. `alitas-loja`: Alitas BBQ, Miel Mostaza y Picantes
47. `pizza-artesanal-loja`: Pizzas Artesanales al Horno de Leña
48. `salchipapas-loja`: Salchipapas y Papas Cargadas con Carne
49. `hot-dogs-loja`: Hot Dogs y Choripán con Salsas Caseras
50. `sandwiches-loja`: Sándwiches y Baguettes Artesanales
51. `tacos-mexicanos-loja`: Tacos al Pastor, Burritos y Quesadillas
52. `chifa-chaulafan-loja`: Chaulafán Especial, Tallarines y Wantanes
53. `nachos-piqueos-texmex-loja`: Nachos con Queso, Guacamole y Totopos

### G. Pescados de Río, Saludable, Fusión y Bebidas (9 Platos)
54. `trucha-pescados-frescos-loja`: Trucha de Río Frita y al Ajillo de Vilcabamba
55. `ensaladas-gourmet-loja`: Ensaladas Gourmet, Bowls Saludables y Ensalada César
56. `comida-vegetariana-vegana-loja`: Opciones Vegetarianas, Veganas y Plant-Based
57. `horchata-jugos-naturales-loja`: Horchata Lojana de 28 Hierbas y Jugos Naturales
58. `cocteleria-cerveza-artesanal-loja`: Cerveza Artesanal Lojana y Cócteles de Autor
59. `sushi-rolls-loja`: Sushi Rolls, Makis y Acebichados
60. `pastas-italianas-loja`: Lasaña, Tagliatelle al Pesto y Carbonara
61. `tablas-charcuteria-loja`: Tablas de Jamón Serrano y Quesos Maduros
62. `waffles-crepes-loja`: Waffles, Crepes Dulces y Pancakes
*(Nota: Repostería y pasteles caseros se cubren transversalmente en cafeterías y en el clúster de postres)*

---

## 4. Conexión de Datos y APIs (`lib/platos-db.ts` y `/api/search/catalog`)

1. **`lib/platos-db.ts`**:
   - Conexión vía pool de MySQL (`GASTRONOMIA_DB_URL`).
   - `getAllPlatosSlugs()`: Devuelve los 62 slugs para pre-renderizar estáticamente con `generateStaticParams()`.
   - `getAllPlatos()`: Retorna los 62 platos estructurados con JSON parseado.
   - `getPlatoBySlug(slug)`: Consulta optimizada con índice por `slug`.
   - `getRestaurantesByPlato(platoId)`: Trae las opciones de cartas reales ordenando primero aliados comerciales destacados.

2. **`/api/search/catalog`**:
   - Endpoint centralizado que alimenta tanto el Buscador de Home como el Buscador Popup Flotante.
   - Devuelve los 62 platos, todos los aliados de la tabla `aliados` y los momentos clave.

---

## 5. Integración con el Chatbot de IA

Dado que toda la información reside en MySQL de forma estructurada:
- El chatbot puede ejecutar consultas como:
  ```sql
  SELECT p.nombre, pr.nombre_restaurante, pr.item_carta, pr.precio_numerico, pr.direccion
  FROM platos_catalogo p
  JOIN plato_restaurantes pr ON p.id = pr.plato_id
  WHERE p.slug = 'parihuela-loja' AND pr.precio_numerico IS NOT NULL
  ORDER BY pr.es_aliado_destacado DESC, pr.precio_numerico ASC;
  ```
- Esto permite al bot responder con extrema precisión al turista:
  * *"La Parihuela en Loja tiene precios entre $6.00 y $12.00 USD. Puedes encontrarla en [Nombre de Aliado] en [Dirección]."*
