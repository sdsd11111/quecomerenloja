import 'server-only';
import { type RowDataPacket } from 'mysql2/promise';
import { getGastroPool } from './aliados-db';

export interface PlatoFaq {
  q: string;
  a: string;
}

export interface PlatoCatalogo {
  id: number;
  slug: string;
  nombre: string;
  titulo_h1: string;
  seccion: string;
  meta_title: string;
  meta_description: string;
  descripcion_corta: string;
  historia_tradicion: string | null;
  ingredientes_clave: string[];
  faqs: PlatoFaq[];
  rango_precio_loja: string | null;
  hero_imagen_url: string | null;
  volumen_busqueda: number;
  activo: boolean;
}

export interface PlatoRestauranteItem {
  id: number;
  plato_id: number;
  id_local_excel: string | null;
  nombre_restaurante: string;
  item_carta: string;
  descripcion_item: string | null;
  precio_textual: string | null;
  precio_numerico: number | null;
  moneda: string;
  categoria_excel: string | null;
  direccion: string | null;
  parroquia: string | null;
  es_aliado_destacado: boolean;
  aliado_id: number | null;
}

function parsePlatoRow(r: RowDataPacket | any): PlatoCatalogo {
  let ingredientes: string[] = [];
  try {
    ingredientes = typeof r.ingredientes_clave === 'string'
      ? JSON.parse(r.ingredientes_clave)
      : (Array.isArray(r.ingredientes_clave) ? r.ingredientes_clave : []);
  } catch {
    ingredientes = [];
  }

  let faqs: PlatoFaq[] = [];
  try {
    faqs = typeof r.faqs === 'string'
      ? JSON.parse(r.faqs)
      : (Array.isArray(r.faqs) ? r.faqs : []);
  } catch {
    faqs = [];
  }

  return {
    id: r.id,
    slug: r.slug,
    nombre: r.nombre,
    titulo_h1: r.titulo_h1,
    seccion: r.seccion,
    meta_title: r.meta_title,
    meta_description: r.meta_description,
    descripcion_corta: r.descripcion_corta,
    historia_tradicion: r.historia_tradicion,
    ingredientes_clave: ingredientes,
    faqs,
    rango_precio_loja: r.rango_precio_loja,
    hero_imagen_url: r.hero_imagen_url,
    volumen_busqueda: r.volumen_busqueda ?? 500,
    activo: Boolean(r.activo),
  };
}

/**
 * Obtener todos los slugs de platos activos para generateStaticParams
 */
export async function getAllPlatosSlugs(): Promise<string[]> {
  try {
    const pool = getGastroPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT slug FROM platos_catalogo WHERE activo = 1 ORDER BY volumen_busqueda DESC'
    );
    return rows.map((r) => r.slug);
  } catch (error) {
    console.error('Error al obtener slugs de platos:', error);
    return [];
  }
}

/**
 * Obtener todos los platos del catálogo
 */
export async function getAllPlatos(): Promise<PlatoCatalogo[]> {
  try {
    const pool = getGastroPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM platos_catalogo WHERE activo = 1 ORDER BY seccion ASC, volumen_busqueda DESC'
    );
    return rows.map(parsePlatoRow);
  } catch (error) {
    console.error('Error al obtener platos:', error);
    return [];
  }
}

/**
 * Obtener plato individual por slug
 */
export async function getPlatoBySlug(slug: string): Promise<PlatoCatalogo | null> {
  try {
    const pool = getGastroPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM platos_catalogo WHERE slug = ? AND activo = 1 LIMIT 1',
      [slug]
    );
    if (!rows || rows.length === 0) return null;
    return parsePlatoRow(rows[0]);
  } catch (error) {
    console.error(`Error al obtener plato ${slug}:`, error);
    return null;
  }
}

/**
 * Obtener restaurantes e ítems que sirven un plato específico
 */
export async function getRestaurantesByPlato(platoId: number): Promise<PlatoRestauranteItem[]> {
  try {
    const pool = getGastroPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM plato_restaurantes 
       WHERE plato_id = ? 
       ORDER BY es_aliado_destacado DESC, precio_numerico ASC, id ASC`,
      [platoId]
    );

    return rows.map((r) => ({
      id: r.id,
      plato_id: r.plato_id,
      id_local_excel: r.id_local_excel,
      nombre_restaurante: r.nombre_restaurante,
      item_carta: r.item_carta,
      descripcion_item: r.descripcion_item,
      precio_textual: r.precio_textual,
      precio_numerico: r.precio_numerico ? Number(r.precio_numerico) : null,
      moneda: r.moneda || 'USD',
      categoria_excel: r.categoria_excel,
      direccion: r.direccion,
      parroquia: r.parroquia,
      es_aliado_destacado: Boolean(r.es_aliado_destacado),
      aliado_id: r.aliado_id ? Number(r.aliado_id) : null,
    }));
  } catch (error) {
    console.error(`Error al obtener restaurantes para platoId ${platoId}:`, error);
    return [];
  }
}

/**
 * Obtener múltiples platos por lista de slugs preservando el orden
 */
export async function getPlatosBySlugs(slugs: string[]): Promise<PlatoCatalogo[]> {
  try {
    if (!slugs || slugs.length === 0) return [];
    const pool = getGastroPool();
    const placeholders = slugs.map(() => '?').join(',');
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM platos_catalogo 
       WHERE slug IN (${placeholders}) AND activo = 1 
       ORDER BY FIELD(slug, ${placeholders})`,
      [...slugs, ...slugs]
    );
    return rows.map(parsePlatoRow);
  } catch (error) {
    console.error('Error al obtener platos por slugs:', error);
    return [];
  }
}

const MOMENTO_SLUGS: Record<string, string[]> = {
  desayuno: [
    'tamales-lojanos',
    'humitas-loja',
    'bolones-en-loja',
    'quimbolitos-loja',
    'cafe-loja',
    'tigrillo-lojano',
  ],
  almuerzo: [
    'repe-lojano',
    'cecina-lojana',
    'arveja-con-guineo-loja',
    'seco-de-pollo-loja',
    'cuy-asado-loja',
    'gallina-cuyada-loja',
  ],
  cena: [
    'alitas-loja',
    'pizza-loja',
    'hamburguesas-loja',
    'chifa-loja',
    'salchipapas-loja',
    'parrilladas-loja',
  ],
};

/**
 * Obtener los platos más destacados de un momento del día desde MySQL
 */
export async function getPlatosByMomentoDB(momento: 'desayuno' | 'almuerzo' | 'cena', limit = 6): Promise<PlatoCatalogo[]> {
  try {
    const slugs = MOMENTO_SLUGS[momento] || [];
    if (slugs.length > 0) {
      const platos = await getPlatosBySlugs(slugs);
      if (platos.length >= 4) return platos.slice(0, limit);
    }

    // Fallback: traer todos y filtrar por palabras clave
    const all = await getAllPlatos();
    if (momento === 'desayuno') {
      return all.filter(p => /desayuno|tamal|humita|bolon|quimbolito|cafe/i.test(p.nombre + ' ' + p.seccion)).slice(0, limit);
    } else if (momento === 'almuerzo') {
      return all.filter(p => /repe|cecina|arveja|seco|almuerzo|sopa|caldo|cuy/i.test(p.nombre + ' ' + p.seccion)).slice(0, limit);
    } else {
      return all.filter(p => /alita|pizza|burger|hamburguesa|chifa|rapida|noche|taco|salchipapa/i.test(p.nombre + ' ' + p.seccion)).slice(0, limit);
    }
  } catch (error) {
    console.error(`Error al obtener platos para momento ${momento}:`, error);
    return [];
  }
}
