const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection(
    'mysql://quecomerlojadinamic-313931562a:%7BbS_c5HrdlrW@mysql.us.stackcp.com:46630/quecomerlojadinamic-313931562a'
  );

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS promociones_aliados (
      id INT AUTO_INCREMENT PRIMARY KEY,
      aliado_slug VARCHAR(150) NOT NULL,
      aliado_nombre VARCHAR(200) NOT NULL,
      titulo VARCHAR(255) NOT NULL,
      slug VARCHAR(300) NOT NULL UNIQUE,
      tipo ENUM('PROMO','EVENTO','NOVEDAD','OFERTA') NOT NULL DEFAULT 'PROMO',
      descripcion TEXT NOT NULL,
      imagen_url VARCHAR(500) NULL,
      precio_original VARCHAR(100) NULL,
      precio_promo VARCHAR(100) NULL,
      fecha_inicio DATETIME NOT NULL,
      fecha_fin DATETIME NULL,
      lugar VARCHAR(255) NULL,
      estado ENUM('PENDIENTE','ACTIVO','VENCIDO','CANCELADO') NOT NULL DEFAULT 'ACTIVO',
      destacado TINYINT(1) NOT NULL DEFAULT 0,
      whatsapp_url VARCHAR(500) NULL,
      color_marca VARCHAR(20) DEFAULT '#153E3E',
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_estado_fecha (estado, fecha_inicio),
      INDEX idx_aliado (aliado_slug),
      INDEX idx_tipo (tipo),
      INDEX idx_fecha_fin (fecha_fin)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  console.log('OK - Tabla promociones_aliados creada/verificada');
  await conn.end();
}

run().catch(e => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
