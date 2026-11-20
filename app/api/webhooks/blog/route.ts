import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getDbPool, initDb, conReintento } from '@/lib/db';

/**
 * WEBHOOK B2B / BRIDGE PARA PUBLICACIÓN DE ARTÍCULOS EN EL BLOG
 * 
 * Permite que agencias de posicionamiento SEO, automatizaciones (Make, n8n)
 * o redactores externos envíen y actualicen artículos directamente a la base de datos.
 * 
 * Seguridad:
 * - Header requerido: x-blog-key: <BLOG_WEBHOOK_KEY>
 * - Compara contra process.env.BLOG_WEBHOOK_KEY
 * 
 * Estrategia de Ingestión: UPSERT
 * - Si el slug no existe -> Realiza INSERT y retorna HTTP 201 Created.
 * - Si el slug ya existe -> Realiza UPDATE con fecha_modificacion = NOW() y retorna HTTP 200 OK.
 * - Invalida automáticamente la caché ISR de Next.js en /blog y /blog/[slug].
 */

interface WebhookArticleInput {
  titulo: string;
  slug: string;
  resumen: string;
  contenido: string;
  imagen: string;
  imagen_alt?: string;
  video_url?: string | null;
  categoria?: string;
  etiquetas?: string[] | string;
  canton_slug?: string | null;
  autor?: string;
  publicado?: boolean | number | string;
  tiempo_lectura?: number | string;
}

function cleanSlugString(slug: string): string {
  return slug
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    // 1. Verificación de Autenticación
    const authKey = request.headers.get('x-blog-key') || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const configuredKey = process.env.BLOG_WEBHOOK_KEY;

    if (!configuredKey) {
      console.error('[blog-webhook] Error: BLOG_WEBHOOK_KEY no está configurada en el servidor');
      return NextResponse.json(
        { error: 'Servicio no configurado para recepción de webhooks' },
        { status: 503 }
      );
    }

    if (!authKey || authKey !== configuredKey) {
      return NextResponse.json(
        { error: 'No autorizado. Header x-blog-key inválido o ausente.' },
        { status: 401 }
      );
    }

    // 2. Parseo y Validación de Payload
    let payload: WebhookArticleInput;
    try {
      payload = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Cuerpo de solicitud inválido. Debe ser un JSON válido.' },
        { status: 400 }
      );
    }

    const {
      titulo,
      slug,
      resumen,
      contenido,
      imagen,
      imagen_alt,
      video_url,
      categoria,
      etiquetas,
      canton_slug,
      autor,
      publicado = true,
      tiempo_lectura,
    } = payload;

    const validationErrors: string[] = [];
    if (!titulo || typeof titulo !== 'string' || titulo.trim().length < 5) {
      validationErrors.push("El campo 'titulo' es obligatorio y debe tener al menos 5 caracteres.");
    }
    if (!slug || typeof slug !== 'string' || slug.trim().length < 3) {
      validationErrors.push("El campo 'slug' es obligatorio y debe tener al menos 3 caracteres.");
    }
    if (!resumen || typeof resumen !== 'string' || resumen.trim().length < 15) {
      validationErrors.push("El campo 'resumen' es obligatorio y debe tener al menos 15 caracteres (meta description SEO).");
    }
    if (!contenido || typeof contenido !== 'string' || contenido.trim().length < 50) {
      validationErrors.push("El campo 'contenido' es obligatorio y debe tener al menos 50 caracteres.");
    }
    if (!imagen || typeof imagen !== 'string' || (!imagen.startsWith('http') && !imagen.startsWith('/'))) {
      validationErrors.push("El campo 'imagen' es obligatorio y debe ser una URL válida (ej: https://... o ruta absoluta).");
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: 'Error de validación de contrato',
          detalles: validationErrors,
        },
        { status: 422 }
      );
    }

    const cleanSlug = cleanSlugString(slug);
    const altText = (imagen_alt && imagen_alt.trim()) || titulo.trim();
    const isPublicado = publicado === true || publicado === 1 || publicado === 'true' ? 1 : 0;
    const authorName = (autor && autor.trim()) || 'Equipo Qué Comer en Loja';
    const categoryName = (categoria && categoria.trim()) || 'Gastronomía';
    const readTime = Math.max(1, Number(tiempo_lectura) || Math.ceil(contenido.split(/\s+/).length / 200) || 5);
    
    // Normalizar etiquetas a formato JSON string
    let tagsJson: string;
    if (Array.isArray(etiquetas)) {
      tagsJson = JSON.stringify(etiquetas.map(t => String(t).trim()).filter(Boolean));
    } else if (typeof etiquetas === 'string') {
      tagsJson = JSON.stringify(etiquetas.split(',').map(t => t.trim()).filter(Boolean));
    } else {
      tagsJson = JSON.stringify([]);
    }

    // 3. Conexión e Ingestión a Base de Datos
    const db = getDbPool();
    await initDb();

    // Comprobar existencia para decidir INSERT o UPDATE
    const [existingRows]: any = await conReintento(() =>
      db.query('SELECT id, slug, titulo FROM blog_posts WHERE slug = ? LIMIT 1', [cleanSlug])
    );

    let isUpdate = false;
    let postId: number;

    if (existingRows && existingRows.length > 0) {
      // UPDATE
      isUpdate = true;
      postId = existingRows[0].id;

      const updateQuery = `
        UPDATE blog_posts SET
          titulo = ?,
          resumen = ?,
          contenido = ?,
          imagen = ?,
          imagen_alt = ?,
          video_url = ?,
          categoria = ?,
          etiquetas = ?,
          canton_slug = ?,
          autor = ?,
          publicado = ?,
          tiempo_lectura = ?,
          fecha_modificacion = NOW()
        WHERE id = ?
      `;

      await conReintento(() =>
        db.query(updateQuery, [
          titulo.trim(),
          resumen.trim(),
          contenido.trim(),
          imagen.trim(),
          altText,
          video_url || null,
          categoryName,
          tagsJson,
          canton_slug || 'loja',
          authorName,
          isPublicado,
          readTime,
          postId,
        ])
      );
    } else {
      // INSERT
      const insertQuery = `
        INSERT INTO blog_posts 
        (slug, titulo, resumen, contenido, imagen, imagen_alt, video_url, categoria, etiquetas, canton_slug, autor, publicado, tiempo_lectura, fecha_publicacion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;

      const [insertResult]: any = await conReintento(() =>
        db.query(insertQuery, [
          cleanSlug,
          titulo.trim(),
          resumen.trim(),
          contenido.trim(),
          imagen.trim(),
          altText,
          video_url || null,
          categoryName,
          tagsJson,
          canton_slug || 'loja',
          authorName,
          isPublicado,
          readTime,
        ])
      );

      postId = insertResult.insertId;
    }

    // 4. Revalidación de Caché Next.js (On-demand ISR)
    try {
      revalidatePath('/blog');
      revalidatePath(`/blog/${cleanSlug}`);
    } catch (revalErr: any) {
      console.warn('[blog-webhook] Revalidación de caché advertencia:', revalErr.message);
    }

    const durationMs = Date.now() - startTime;

    return NextResponse.json(
      {
        success: true,
        action: isUpdate ? 'updated' : 'created',
        id: postId,
        slug: cleanSlug,
        url: `https://quecomerenloja.com/blog/${cleanSlug}`,
        execution_time_ms: durationMs,
        seo_preview: {
          title: `${titulo.trim()} | Blog Qué Comer en Loja`,
          description: resumen.trim(),
          image: imagen.trim(),
          tags: JSON.parse(tagsJson),
        },
      },
      { status: isUpdate ? 200 : 201 }
    );
  } catch (err: any) {
    console.error('[blog-webhook] Error en procesamiento de post:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor al procesar el artículo',
        detalles: err.message,
      },
      { status: 500 }
    );
  }
}
