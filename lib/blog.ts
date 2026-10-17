import { BlogPost } from '@/types/blog';
import { getDbPool, initDb } from './db';

// ─────────────────────────────────────────────────────────────────────────────
// PERSONALIZA ESTOS FALLBACKS CON ARTÍCULOS REALES DE TU SITIO
// Se muestran si MySQL no responde (en local o si hay error de conexión)
// ─────────────────────────────────────────────────────────────────────────────
export const FALLBACK_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: 'bienvenido-al-blog',
    titulo: 'Bienvenido al Blog de Mi Sitio',
    resumen: 'Este es el primer artículo de ejemplo. Puedes editarlo o eliminarlo desde el panel de administración en /admin.',
    contenido: `
      <h2>¡Tu blog está listo!</h2>
      <p>Este artículo de ejemplo aparece cuando la base de datos no está conectada todavía.</p>
      <p>Ve a <strong>/admin</strong> para iniciar sesión y crear tus propios artículos.</p>
      <h2>¿Cómo funciona?</h2>
      <ul>
        <li>Los artículos se guardan en tu base de datos MySQL.</li>
        <li>Puedes subir imágenes directamente o poner una URL.</li>
        <li>El contenido soporta Markdown y embeds de YouTube/Vimeo.</li>
      </ul>
    `,
    imagen: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop',
    imagen_alt: 'Laptop con blog abierto',
    categoria: 'Blog',
    etiquetas: ['Inicio', 'Bienvenida'],
    autor: 'Mi Sitio',
    fecha_publicacion: '2026-10-01',
    publicado: true,
    tiempo_lectura: 2,
  },
];

// Helper para parsear etiquetas desde JSON o string
function parseEtiquetas(etiquetas: any): string[] {
  if (Array.isArray(etiquetas)) return etiquetas;
  if (typeof etiquetas === 'string') {
    try {
      const parsed = JSON.parse(etiquetas);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return etiquetas.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  return [];
}

// Obtener todos los posts publicados (para la vista pública)
export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const db = getDbPool();
    const [rows]: any = await Promise.race([
      db.query('SELECT * FROM blog_posts WHERE publicado = 1 ORDER BY fecha_publicacion DESC'),
      new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3000))
    ]);

    if (rows && rows.length > 0) {
      return rows.map((r: any) => ({
        ...r,
        publicado: Boolean(r.publicado),
        etiquetas: parseEtiquetas(r.etiquetas),
        fecha_publicacion: r.fecha_publicacion ? new Date(r.fecha_publicacion).toISOString().split('T')[0] : '',
      }));
    }
  } catch (err) {
    console.warn('MySQL fallback activo (getPublishedPosts):', (err as Error).message);
  }
  return FALLBACK_POSTS;
}

// Obtener todos los posts (para el /admin, incluye borradores)
export async function getAllPostsAdmin(): Promise<BlogPost[]> {
  try {
    const db = getDbPool();
    await initDb();
    const [rows]: any = await Promise.race([
      db.query('SELECT * FROM blog_posts ORDER BY fecha_publicacion DESC'),
      new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3500))
    ]);

    if (rows) {
      return rows.map((r: any) => ({
        ...r,
        publicado: Boolean(r.publicado),
        etiquetas: parseEtiquetas(r.etiquetas),
        fecha_publicacion: r.fecha_publicacion ? new Date(r.fecha_publicacion).toISOString().split('T')[0] : '',
      }));
    }
  } catch (err) {
    console.warn('MySQL fallback admin (getAllPostsAdmin):', (err as Error).message);
  }
  return FALLBACK_POSTS;
}

// Obtener un solo post por su slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const db = getDbPool();
    const [rows]: any = await Promise.race([
      db.query('SELECT * FROM blog_posts WHERE slug = ? LIMIT 1', [slug]),
      new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3000))
    ]);

    if (rows && rows.length > 0) {
      const r = rows[0];
      return {
        ...r,
        publicado: Boolean(r.publicado),
        etiquetas: parseEtiquetas(r.etiquetas),
        fecha_publicacion: r.fecha_publicacion ? new Date(r.fecha_publicacion).toISOString().split('T')[0] : '',
      };
    }
  } catch (err) {
    console.warn('MySQL fallback activo (getPostBySlug):', (err as Error).message);
  }

  // Fallback
  const found = FALLBACK_POSTS.find(p => p.slug === slug);
  return found || null;
}

// Alias for sitemap and backwards compatibility
export const POSTS = FALLBACK_POSTS;
