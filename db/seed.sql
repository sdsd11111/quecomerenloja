-- Datos de EJEMPLO para desarrollo. No son negocios reales ni están verificados.
USE quecomerenloja;

INSERT IGNORE INTO categorias_gastronomicas (slug, nombre) VALUES
  ('alta', 'Alta Cocina'),
  ('cafe', 'Café de Loja'),
  ('tradicional', 'Comida Tradicional'),
  ('noche', 'Bares y Noche');

INSERT IGNORE INTO aliados_gastronomia (slug, nombre, categoria_id, zona, descripcion) VALUES
  ('el-arenal', 'Restaurante El Arenal (ejemplo)', (SELECT id FROM categorias_gastronomicas WHERE slug='tradicional'), 'Loja', 'Ejemplo de hueca de comida tradicional lojana con almuerzo completo.'),
  ('cafe-colonial-loja', 'Café Colonial Loja (ejemplo)', (SELECT id FROM categorias_gastronomicas WHERE slug='cafe'), 'Loja', 'Ejemplo de cafetería de especialidad con café de origen lojano.'),
  ('la-hueca-de-don-pepe', 'La Hueca de Don Pepe (ejemplo)', (SELECT id FROM categorias_gastronomicas WHERE slug='tradicional'), 'Loja', 'Ejemplo de hueca con churrasco, menestra y maduro.'),
  ('mesa-andina-ejemplo', 'Mesa Andina (ejemplo)', (SELECT id FROM categorias_gastronomicas WHERE slug='alta'), 'Loja', 'Ficha de ejemplo para la categoría Alta Cocina.'),
  ('bar-la-plaza-ejemplo', 'Bar La Plaza (ejemplo)', (SELECT id FROM categorias_gastronomicas WHERE slug='noche'), 'Loja', 'Ficha de ejemplo para la categoría Bares y Noche.');

INSERT INTO menus_dia (aliado_id, fecha, momento, titulo_plato, descripcion, precio, palabras_clave)
SELECT a.id, CURDATE(), m.momento, m.titulo, m.descr, m.precio, m.kw
FROM aliados_gastronomia a
JOIN (
  SELECT 'el-arenal' slug, 'almuerzo' momento, 'Repe & cecina' titulo, 'Almuerzo completo: Repe blanco + Cecina + Arroz + Jugo' descr, 3.50 precio, 'repe blanco cecina arroz jugo comida tradicional almuerzo' kw
  UNION ALL SELECT 'cafe-colonial-loja','desayuno','Humita & café de origen','Desayuno especial: Humita + Café de Loja en grano',4.00,'humita humitas cafe de loja desayuno cafeteria especialidad'
  UNION ALL SELECT 'la-hueca-de-don-pepe','almuerzo','Churrasco lojano','Churrasco lojano + Menestra + Maduro',5.00,'churrasco lojano menestra maduro comida tradicional hueca almuerzo'
  UNION ALL SELECT 'mesa-andina-ejemplo','cena','Cena de autor','Menú degustación de tres tiempos con ingredientes locales',18.00,'alta cocina cena degustacion autor restaurante'
  UNION ALL SELECT 'bar-la-plaza-ejemplo','cena','Picada & música','Picada para compartir + bebida de la casa',9.00,'bar noche picada musica bebida vida nocturna cena'
) m ON m.slug = a.slug
WHERE NOT EXISTS (SELECT 1 FROM menus_dia x WHERE x.aliado_id = a.id);

INSERT INTO platos_menu (aliado_id, nombre)
SELECT a.id, p.nombre FROM aliados_gastronomia a
JOIN (
  SELECT 'el-arenal' slug, 'Repe blanco' nombre UNION ALL SELECT 'el-arenal','Cecina lojana' UNION ALL SELECT 'el-arenal','Jugo natural'
  UNION ALL SELECT 'cafe-colonial-loja','Café de Loja' UNION ALL SELECT 'cafe-colonial-loja','Humitas' UNION ALL SELECT 'cafe-colonial-loja','Postres'
  UNION ALL SELECT 'la-hueca-de-don-pepe','Churrasco' UNION ALL SELECT 'la-hueca-de-don-pepe','Menestra' UNION ALL SELECT 'la-hueca-de-don-pepe','Maduro'
  UNION ALL SELECT 'mesa-andina-ejemplo','Menú degustación' UNION ALL SELECT 'bar-la-plaza-ejemplo','Picadas'
) p ON p.slug = a.slug
WHERE NOT EXISTS (SELECT 1 FROM platos_menu x WHERE x.aliado_id = a.id);
