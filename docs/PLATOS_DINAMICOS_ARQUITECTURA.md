# Documentación Técnica: Arquitectura de Platos Dinámicos en Loja

## 1. Resumen Ejecutivo y Estado del Proyecto
Se implementó un sistema de **páginas dinámicas ultra-optimizadas para SEO local** para posicionar el portal en intenciones transaccionales e informativas clave en Loja, Ecuador (*"Dónde comer [plato] en Loja"*, *"Precios de [plato] en Loja"*, *"Quién vende [plato]"*).

La base de datos central de gastronomía (`GASTRONOMIA_DB_URL`: `quecomerlojadinamic-313931562a`) almacena el catálogo estructurado de **51 platos/intenciones maestras** y **1,178 platos reales vinculados de restaurantes locales** extraídos del scrapeo.

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
* `hero_imagen_url` (VARCHAR(500)): URL optimizada en CDN Bunny.
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

## 3. Catálogo de los 51 Platos / Intenciones Implementadas

### A. Tradicional Lojana y de la Sierra (11 Platos)
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

### B. Desayunos y Tradicional (4 Platos)
12. `bolones-loja`: Bolones de Verde (Queso, Chicharrón, Mixtos)
13. `tigrillo-loja`: Tigrillo Lojano con Queso y Huevo
14. `empanadas-loja`: Empanadas de Verde y Morocho
15. `cafe-especialidad-loja`: Café de Especialidad y Filtrados (V60, Chemex)

### C. Mariscos y Cocina Costeña (11 Platos)
16. `parihuela-loja`: Parihuela de Mariscos concentrada
17. `encebollado-loja`: Encebollado de Albacora y Mixtos
18. `ceviche-pescado-loja`: Ceviche de Pescado y Estilo Peruano
19. `ceviche-concha-loja`: Ceviche de Concha Negra de Manglar
20. `ceviche-camaron-loja`: Ceviche Clásico de Camarón
21. `ceviche-mixto-loja`: Ceviche Mixto y Maremoto
22. `arroz-marinero-loja`: Arroz Marinero Salteado con Mariscos
23. `cazuela-mariscos-loja`: Cazuela de Mariscos al Horno de Barro
24. `encocado-loja`: Encocados en Leche de Coco Natural
25. `camarones-apanados-loja`: Camarones Apanados y al Ajillo
26. `cangrejos-loja`: Cangrejos y Cangrejadas a la Olla

### D. Carnes, Asados y Parrilladas (6 Platos)
27. `parrilladas-loja`: Parrilladas al Carbón y Tablas Familiares
28. `cortes-premium-loja`: Bife de Chorizo, Picaña y Tomahawk
29. `lomo-fino-loja`: Lomo Fino y Lomo Saltado al Wok
30. `costillas-bbq-loja`: Costillas BBQ Glaseadas y Ahumadas
31. `pollo-asado-loja`: Pollo Asado y a la Brasa
32. `pinchos-loja`: Pinchos y Brochetas al Carbón

### E. Secos, Caldos y Almuerzos Criollos (7 Platos)
33. `guatita-loja`: Guatita Criolla con Maní y Arroz Amarillo
34. `seco-de-chivo-loja`: Seco de Chivo Estofado con Chicha y Cerveza
35. `seco-de-pollo-loja`: Seco de Pollo y Gallina Casero
36. `seco-de-carne-loja`: Seco de Chancho y Res
37. `menestras-loja`: Menestras de Fréjol o Lenteja con Asado
38. `churrasco-loja`: Churrasco Ecuatoriano con Huevos y Papas
39. `banderas-loja`: Banderas (Guatita, Encebollado y Ceviche)

### F. Comida Rápida, Piqueos e Internacional (8 Platos)
40. `hamburguesas-artesanales-loja`: Hamburguesas al Carbón y Smash Burgers
41. `alitas-loja`: Alitas BBQ, Miel Mostaza y Picantes
42. `pizza-artesanal-loja`: Pizzas Artesanales al Horno de Leña
43. `salchipapas-loja`: Salchipapas y Papas Cargadas con Carne
44. `hot-dogs-loja`: Hot Dogs y Choripán con Salsas Caseras
45. `sandwiches-loja`: Sándwiches y Baguettes Artesanales
46. `tacos-mexicanos-loja`: Tacos al Pastor, Burritos y Quesadillas
47. `chifa-chaulafan-loja`: Chaulafán Especial, Tallarines y Wantanes

### G. Cocina Fusión, Pastas y Dulces (4 Platos)
48. `sushi-rolls-loja`: Sushi Rolls, Makis y Acebichados
49. `pastas-italianas-loja`: Lasaña, Tagliatelle al Pesto y Carbonara
50. `tablas-charcuteria-loja`: Tablas de Jamón Serrano y Quesos Maduros
51. `waffles-crepes-loja`: Waffles, Crepes Dulces y Pancakes

---

## 4. Rutas y Componentes de Next.js Desarrollados

1. **Ruta Dinámica `/app/platos/[slug]/page.tsx`**:
   * Pre-renderizado en build time con `generateStaticParams()` (51 páginas estáticas instantáneas).
   * ISR con `revalidate = 86400` (revalidación cada 24 horas).
   * Generación de metadatos SEO dinámicos y OpenGraph para cada plato (`generateMetadata`).
   * Schema JSON-LD con `@type: "Recipe"`, `@type: "FAQPage"` y `@type: "ItemList"` con los restaurantes locales.
   * Grilla interactiva con los platos e ítems de cartas reales scrapeados en Loja (precios, dirección, parroquia).
   * Bloque de monetización de aliados comerciales (`PlazasDisponiblesPlato`).
   * Mapa de ubicación (`MapaLeafletLoja`).

2. **Página Hub Principal `/app/platos/page.tsx`**:
   * Listado organizado por secciones culinarias de los 51 platos.
   * Enlaces directos hacia cada landing individual.
   * Resumen de volumen de búsqueda y rango de precio estimado.

3. **Capa de Datos `lib/platos-db.ts`**:
   * Conexión directa contra `GASTRONOMIA_DB_URL` (`quecomerlojadinamic-313931562a`).
   * Funciones: `getAllPlatosSlugs()`, `getAllPlatos()`, `getPlatoBySlug(slug)`, `getRestaurantesByPlato(platoId)`.

4. **Sitemap Dinámico `app/sitemap.ts`**:
   * Detecta automáticamente todos los slugs de `platos_catalogo` e inyecta las URLs canónicas con prioridad 0.88 y frecuencia semanal.

---

## 5. Scripts de Mantenimiento y Automatización

* `scripts/seed_50_platos_fast.py`: Script para regenerar o sincronizar en batch los 51 platos y sus relaciones en la base de datos MySQL.
* `scripts/platos_data.py`: Diccionario maestro de metadata, historia, ingredientes y FAQs de cada plato.
* `scripts/init_platos_db.py`: Script DDL para creación de tablas e índices en MySQL.
