import urllib.parse
import pymysql

url = 'mysql://quecomerlojadinamic-313931562a:%7BbS_c5HrdlrW@mysql.us.stackcp.com:46630/quecomerlojadinamic-313931562a'
parsed = urllib.parse.urlparse(url)
conn = pymysql.connect(
    host=parsed.hostname,
    port=parsed.port,
    user=parsed.username,
    password=urllib.parse.unquote(parsed.password),
    database=parsed.path[1:],
    connect_timeout=15
)
cursor = conn.cursor()

sql_platos = """
CREATE TABLE IF NOT EXISTS platos_catalogo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  nombre VARCHAR(150) NOT NULL,
  titulo_h1 VARCHAR(255) NOT NULL,
  seccion VARCHAR(100) NOT NULL,
  meta_title VARCHAR(255) NOT NULL,
  meta_description TEXT NOT NULL,
  descripcion_corta TEXT NOT NULL,
  historia_tradicion TEXT,
  ingredientes_clave JSON,
  faqs JSON,
  rango_precio_loja VARCHAR(100),
  hero_imagen_url VARCHAR(500),
  volumen_busqueda INT DEFAULT 500,
  activo TINYINT(1) DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_plato_slug (slug),
  INDEX idx_plato_seccion (seccion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
"""
cursor.execute(sql_platos)

sql_plato_rest = """
CREATE TABLE IF NOT EXISTS plato_restaurantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  plato_id INT NOT NULL,
  id_local_excel VARCHAR(50),
  nombre_restaurante VARCHAR(150) NOT NULL,
  item_carta VARCHAR(255) NOT NULL,
  descripcion_item TEXT,
  precio_textual VARCHAR(50),
  precio_numerico DECIMAL(10,2),
  moneda VARCHAR(10) DEFAULT 'USD',
  categoria_excel VARCHAR(100),
  direccion VARCHAR(255),
  parroquia VARCHAR(100),
  es_aliado_destacado TINYINT(1) DEFAULT 0,
  aliado_id INT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_plato_id (plato_id),
  INDEX idx_local_excel (id_local_excel),
  CONSTRAINT fk_plato_catalogo FOREIGN KEY (plato_id) REFERENCES platos_catalogo (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
"""
cursor.execute(sql_plato_rest)

conn.commit()
cursor.execute("SHOW TABLES;")
print("Tablas en la BD:", cursor.fetchall())
conn.close()
