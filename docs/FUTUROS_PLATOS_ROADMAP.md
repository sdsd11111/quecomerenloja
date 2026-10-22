# Matriz Maestra de Expansión Gastronómica de Loja (62 Platos en Producción)

Este documento consolida el **inventario completo de los 2,279 ítems y platos investigados y scrapeados** en restaurantes de Loja, documentando la migración total hacia la base de datos MySQL (`GASTRONOMIA_DB`) y la justificación del residuo comercial no indexable.

---

## 1. Resumen Estadístico del Inventario Total

* **Total de ítems en bruto scrapeados:** 2,279 registros (2,152 con nombre e información descriptiva).
* **Fase 1 y Fase 2 (100% Activas en MySQL):** **62 Clústeres de Platos Principales** con **1,768 platos reales de cartas vinculados** en 94 restaurantes locales de Loja.
* **Cobertura Gastronómica Útil de Loja:** **82.1%** de toda la oferta gastronómica real identificada en cartas de restaurantes de la ciudad.
* **Residuo Comercial No Indexable:** **384 registros** (marcas industriales de bebidas embotelladas, guarniciones menores y promociones efímeras).

---

## 2. Catálogo Oficial en Base de Datos (62 Platos / 1,768 Ítems en DB)

Todos estos 62 platos cuentan con:
1. Registro en la tabla `platos_catalogo` de MySQL (`GASTRONOMIA_DB_URL`).
2. Relaciones vinculadas en la tabla `plato_restaurantes` con precios, nombre de carta, dirección y parroquia.
3. Página dinámica en `/app/platos/[slug]`.
4. Schema.org completo (`@type: "Recipe"`, `@type: "FAQPage"`, `@type: "ItemList"`).
5. Entrada dinámica en `sitemap.xml` y disponibilidad en el Buscador Universal y Buscador Popup Flotante.

### Listado Completo por Categorías:

#### A. Tradicional Lojana y de la Sierra (12)
1. `repe-lojano` (Repe Lojano - Guineo verde y quesillo)
2. `cecina-lojana` (Cecina Lojana - Cerdo asado a la brasa)
3. `tamales-lojanos` (Tamales Lojanos en Hoja de Achira)
4. `humitas-loja` (Humitas Lojanas de Choclo Tierno)
5. `quimbolitos-loja` (Quimbolitos Lojanos al Vapor)
6. `cuy-asado-loja` (Cuy Asado tradicional de El Valle)
7. `gallina-cuyada-loja` (Gallina Cuyada a la leña)
8. `arveja-con-guineo-loja` (Sopa de Arveja con Guineo)
9. `sango-loja` (Sango Lojano de Maíz y Quesillo)
10. `locro-loja` (Locros y Sopas Andinas de Papa)
11. `chicharron-loja` (Chicharrones y Piqueos de Cerdo con Mote)
12. `fritada-lojana` (Fritada Lojana con Mote, Yuca y Ají de Pepa)

#### B. Desayunos y Tradicional (5)
13. `bolones-loja` (Bolones de Verde: Queso, Chicharrón, Mixtos)
14. `tigrillo-loja` (Tigrillo Lojano con Quesillo y Huevo)
15. `empanadas-loja` (Empanadas de Verde y Morocho)
16. `cafe-especialidad-loja` (Café de Especialidad, V60, Chemex y Espresso)
17. `desayunos-continentales-loja` (Desayunos Continentales, Omelettes y Huevos)

#### C. Mariscos y Cocina Costeña (11)
18. `parihuela-loja` (Parihuela de Mariscos Concentrada)
19. `encebollado-loja` (Encebollado de Albacora y Mixtos)
20. `ceviche-pescado-loja` (Ceviche de Pescado y Estilo Peruano)
21. `ceviche-concha-loja` (Ceviche de Concha Negra de Manglar)
22. `ceviche-camaron-loja` (Ceviche de Camarón Ecuatoriano)
23. `ceviche-mixto-loja` (Ceviche Mixto y Maremoto)
24. `arroz-marinero-loja` (Arroz Marinero Salteado al Wok)
25. `cazuela-mariscos-loja` (Cazuela de Mariscos al Horno de Barro)
26. `encocado-loja` (Encocados en Leche de Coco Natural)
27. `camarones-apanados-loja` (Camarones Apanados y al Ajillo)
28. `cangrejos-loja` (Cangrejos y Cangrejadas Criollas)

#### D. Carnes, Asados y Parrilladas (7)
29. `parrilladas-loja` (Parrilladas al Carbón y Tablas Familiares)
30. `cortes-premium-loja` (Bife de Chorizo, Picaña y Tomahawk)
31. `lomo-fino-loja` (Lomo Fino y Lomo Saltado al Wok)
32. `costillas-bbq-loja` (Costillas BBQ Glaseadas y Ahumadas)
33. `pollo-asado-loja` (Pollo Asado y a la Brasa)
34. `pinchos-loja` (Pinchos y Brochetas al Carbón)
35. `carnes-cerdo-chuletas-loja` (Chuletas de Cerdo, Panceta y Cortes Criollos)

#### E. Secos, Caldos y Almuerzos Criollos (9)
36. `guatita-loja` (Guatita Criolla con Maní y Arroz Amarillo)
37. `seco-de-chivo-loja` (Seco de Chivo Estofado con Chicha y Cerveza)
38. `seco-de-pollo-loja` (Seco de Pollo y Gallina Casero)
39. `seco-de-carne-loja` (Seco de Chancho y Res)
40. `menestras-loja` (Menestras de Fréjol o Lenteja con Asado)
41. `churrasco-loja` (Churrasco Ecuatoriano con Huevos y Papas)
42. `banderas-loja` (Banderas con Guatita, Encebollado y Ceviche)
43. `caldos-sopas-criollas-loja` (Caldos de Gallina Criolla y Sopas Reconstituyentes)
44. `almuerzos-ejecutivos-loja` (Almuerzos Ejecutivos y Menú Diario Completo)

#### F. Comida Rápida, Piqueos e Internacional (9)
45. `hamburguesas-artesanales-loja` (Hamburguesas al Carbón y Smash Burgers)
46. `alitas-loja` (Alitas BBQ, Miel Mostaza y Picantes)
47. `pizza-artesanal-loja` (Pizzas Artesanales al Horno de Leña)
48. `salchipapas-loja` (Salchipapas y Papas Cargadas con Carne)
49. `hot-dogs-loja` (Hot Dogs y Choripán con Salsas Caseras)
50. `sandwiches-loja` (Sándwiches y Baguettes Artesanales)
51. `tacos-mexicanos-loja` (Tacos al Pastor, Burritos y Quesadillas)
52. `chifa-chaulafan-loja` (Chaulafán Especial, Tallarines y Wantanes)
53. `nachos-piqueos-texmex-loja` (Nachos con Queso, Guacamole y Totopos)

#### G. Pescados de Río, Saludable, Fusión y Bebidas (9)
54. `trucha-pescados-frescos-loja` (Trucha de Río Frita y al Ajillo de Vilcabamba)
55. `ensaladas-gourmet-loja` (Ensaladas Gourmet, Bowls Saludables y Ensalada César)
56. `comida-vegetariana-vegana-loja` (Opciones Vegetarianas, Veganas y Plant-Based)
57. `horchata-jugos-naturales-loja` (Horchata Lojana de 28 Hierbas y Jugos Naturales)
58. `cocteleria-cerveza-artesanal-loja` (Cerveza Artesanal Lojana y Cócteles de Autor)
59. `sushi-rolls-loja` (Sushi Rolls, Makis y Acebichados)
60. `pastas-italianas-loja` (Lasaña, Tagliatelle al Pesto y Carbonara)
61. `tablas-charcuteria-loja` (Tablas de Jamón Serrano y Quesos Maduros)
62. `waffles-crepes-loja` (Waffles, Crepes Dulces y Pancakes)

---

## 3. Auditoría de los 384 Ítems Residuales No Indexables

Los 384 ítems que no tienen URL propia corresponden a:
1. **Bebidas y Licores Comerciales:** *Pilsener*, *Club Verde*, *Whisky Red Label*, *Coca-Cola 300ml*, *Agua Dasani*.
2. **Guarniciones y Adicionales:** *Porción de arroz*, *Huevo frito extra*, *Porción de mote*, *Tarrina de ají*.
3. **Platos Efímeros o Festivos:** *Menú navideño especial*, *Plato del chef temporal*.

Mantenerlos fuera de URLs independientes protege el portal contra penalizaciones de Google por *Thin Content*.
