-- Qué Comer en Loja · Esquema MySQL 8 / MariaDB 10.6+
-- Uso: mysql -u root -p quecomerenloja < db/schema.sql

CREATE DATABASE IF NOT EXISTS quecomerenloja
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quecomerenloja;

CREATE TABLE IF NOT EXISTS categorias_gastronomicas (
  id      TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug    VARCHAR(40)  NOT NULL,
  nombre  VARCHAR(80)  NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categoria_slug (slug)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS aliados_gastronomia (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug              VARCHAR(120) NOT NULL,
  nombre            VARCHAR(160) NOT NULL,
  categoria_id      TINYINT UNSIGNED NOT NULL,
  zona              VARCHAR(80)  NOT NULL DEFAULT 'Loja',
  descripcion       TEXT NULL,
  direccion         VARCHAR(255) NULL,
  horarios          VARCHAR(255) NULL,
  rango_precio      ENUM('$','$$','$$$') NULL,
  telefono_whatsapp VARCHAR(15)  NULL COMMENT 'Solo dígitos, sin +',
  lat               DECIMAL(9,6) NULL,
  lng               DECIMAL(9,6) NULL,
  imagen_url        VARCHAR(500) NULL,
  plan              ENUM('verificada','premium') NOT NULL DEFAULT 'verificada',
  destacado         TINYINT(1)   NOT NULL DEFAULT 0,
  activo            TINYINT(1)   NOT NULL DEFAULT 1,
  creado_en         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_aliado_slug (slug),
  KEY idx_aliado_categoria (categoria_id, activo),
  CONSTRAINT fk_aliado_categoria FOREIGN KEY (categoria_id) REFERENCES categorias_gastronomicas (id)
) ENGINE=InnoDB;

-- Menú del día: una fila por aliado y fecha. verificado_en lo fija el flujo de audio WhatsApp
-- al confirmar el dueño; NULL = nunca verificado (la web no lo presenta como "verificado hoy").
CREATE TABLE IF NOT EXISTS menus_dia (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  aliado_id      INT UNSIGNED NOT NULL,
  fecha          DATE NOT NULL,
  momento        ENUM('desayuno','almuerzo','cena') NOT NULL DEFAULT 'almuerzo',
  titulo_plato   VARCHAR(160) NOT NULL,
  descripcion    VARCHAR(500) NOT NULL,
  precio         DECIMAL(6,2) NULL,
  palabras_clave VARCHAR(500) NOT NULL DEFAULT '',
  fuente         ENUM('whatsapp_audio','manual') NOT NULL DEFAULT 'manual',
  verificado_en  DATETIME NULL,
  PRIMARY KEY (id),
  KEY idx_menu_aliado_fecha (aliado_id, fecha),
  FULLTEXT KEY ft_menu (titulo_plato, descripcion, palabras_clave),
  CONSTRAINT fk_menu_aliado FOREIGN KEY (aliado_id) REFERENCES aliados_gastronomia (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS platos_menu (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  aliado_id        INT UNSIGNED NOT NULL,
  nombre           VARCHAR(160) NOT NULL,
  descripcion      VARCHAR(500) NULL,
  precio           DECIMAL(6,2) NULL,
  categoria_plato  VARCHAR(60)  NULL,
  imagen_webp_url  VARCHAR(500) NULL,
  disponible       TINYINT(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  KEY idx_plato_aliado (aliado_id, disponible),
  CONSTRAINT fk_plato_aliado FOREIGN KEY (aliado_id) REFERENCES aliados_gastronomia (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Persistencia del Asesor IA (opcional; el asesor propio puede usar su propio almacenamiento).
CREATE TABLE IF NOT EXISTS chat_sessions (
  id          CHAR(36) NOT NULL,
  creado_en   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lat         DECIMAL(9,6) NULL,
  lng         DECIMAL(9,6) NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS chat_messages (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  session_id  CHAR(36) NOT NULL,
  rol         ENUM('user','assistant') NOT NULL,
  contenido   TEXT NOT NULL,
  creado_en   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_msg_session (session_id, id),
  CONSTRAINT fk_msg_session FOREIGN KEY (session_id) REFERENCES chat_sessions (id) ON DELETE CASCADE
) ENGINE=InnoDB;
