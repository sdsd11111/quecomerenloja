import 'server-only';
import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { getGastroPool, createAliado, updateAliado } from '@/lib/aliados-db';
import { createPromo } from '@/lib/promos-db';
import type { PlatoBorrador, Solicitud } from '@/lib/formulario';
import { slugify } from '@/lib/formulario';

export interface ResultadoPublicacion {
  aliadoId: number | null;
  platosPublicados: number;
  enlacesCreados: number;
  avisos: string[];
}

/**
 * Publica una solicitud aprobada usando el esquema real del proyecto:
 *
 *  1. `aliados`                 → la ficha del restaurante (createAliado).
 *  2. `platos_catalogo`         → cada plato se registra en el catálogo de platos.
 *  3. `plato_restaurantes`      → vínculo plato ↔ restaurante (búsquedas por plato).
 *  4. `promociones_aliados`     → la carta se publica como menú del día (mismo
 *                                 flujo que usa el bot de WhatsApp).
 *
 * Cada paso es independiente: si algo falla, se sigue con el resto y se deja
 * constancia en `avisos` para revisarlo en el panel.
 */

function tokens(texto: string): string[] {
  return (texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 3);
}

export async function catalogoActivo(): Promise<{ id: number; slug: string; nombre: string; seccion: string }[]> {
  const pool = getGastroPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id, slug, nombre, seccion FROM platos_catalogo WHERE activo = 1'
  );
  return rows.map((r) => ({
    id: Number(r.id),
    slug: String(r.slug),
    nombre: String(r.nombre),
    seccion: String(r.seccion || ''),
  }));
}

export async function asegurarPlatoCatalogo(
  plato: PlatoBorrador,
  catalogo: { id: number; slug: string; nombre: string; seccion: string }[]
): Promise<number | null> {
  const pool = getGastroPool();
  const mios = tokens(plato.nombre);

  // 1) ¿Coincide con un plato del catálogo?
  let mejor: { id: number; puntos: number } | null = null;
  for (const c of catalogo) {
    const suyos = tokens(c.nombre);
    const puntos = mios.filter((t) => suyos.includes(t)).length;
    if (puntos >= 2 && (!mejor || puntos > mejor.puntos)) mejor = { id: c.id, puntos };
  }
  if (mejor) return mejor.id;

  // 2) Crear el plato en el catálogo
  let slug = slugify(plato.nombre) || `plato-${Date.now()}`;
  const [existente] = await pool.query<RowDataPacket[]>(
    'SELECT id FROM platos_catalogo WHERE slug = ? LIMIT 1',
    [slug]
  );
  if (existente && existente.length > 0) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  }

  const seccion = (plato.momento || 'almuerzo').toString();
  const descripcionCorta =
    (plato.descripcion || '').trim() ||
    `${plato.nombre} en Loja. Precio orientativo${
      plato.precio ? `: $${plato.precio.toFixed(2)}` : ''
    }. Pide por WhatsApp directamente al restaurante.`;

  const valores = [
    slug,
    plato.nombre.slice(0, 150),
    `${plato.nombre} en Loja`.slice(0, 255),
    seccion.slice(0, 100),
    `${plato.nombre} en Loja | Dónde comer`.slice(0, 255),
    `${plato.nombre}: precio, dónde comerlo en Loja y cómo pedirlo por WhatsApp.`.slice(0, 500),
    descripcionCorta.slice(0, 1000),
    null,
    (plato.palabrasClave || plato.nombre).slice(0, 2000) || null,
    null,
    0,
  ];

  const consulta = `
    INSERT INTO platos_catalogo
      (slug, nombre, titulo_h1, seccion, meta_title, meta_description, descripcion_corta,
       historia_tradicion, ingredientes_clave, rango_precio_loja, volumen_busqueda, activo, createdAt, updatedAt)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,1,NOW(),NOW())`;

  let ins: ResultSetHeader;
  try {
    [ins] = await pool.query<ResultSetHeader>(consulta, valores);
  } catch (e: any) {
    // El índice FULLTEXT de ingredientes_clave necesita espacio extra en el
    // servidor: si falla, reintentamos sin ese campo (el plato se publica igual).
    const sinPalabras = [...valores];
    sinPalabras[8] = null;
    [ins] = await pool.query<ResultSetHeader>(consulta, sinPalabras);
    console.warn('[publicar-solicitud] Plato sin palabras clave:', e?.message);
  }
  catalogo.push({ id: ins.insertId, slug, nombre: plato.nombre, seccion });
  return ins.insertId;
}

/**
 * Crea el aliado en la tabla `aliados` en estado INACTIVO en el momento en que
 * llega la solicitud: así el restaurante ya aparece en /admin (pestaña
 * Aliados) y se puede editar ahí mismo. Queda pendiente de publicar
 * (activo = 0) hasta que alguien lo revise y apruebe.
 */
export async function crearAliadoPendiente(
  solicitud: Solicitud,
  opciones: { imagenUrl?: string | null } = {}
): Promise<number | null> {
  const descripcion =
    solicitud.notas ||
    `${solicitud.nombreComercial}, en ${solicitud.direccion}. ${
      solicitud.horarios ? `Horario: ${solicitud.horarios}.` : ''
    } Menú y datos actualizados por Qué Comer en Loja.`;

  const mapaUrl = solicitud.mapaUrl || construirMapaUrl(solicitud);

  try {
    return await createAliado({
      nombre: solicitud.nombreComercial,
      tipo: 'GASTRONOMIA',
      descripcion,
      ubicacion: solicitud.direccion,
      telefono: solicitud.telefono,
      rangoPrecio: solicitud.rangoPrecio,
      mapaUrl,
      websiteUrl: solicitud.redesUrl,
      ubicacionLat: solicitud.lat,
      ubicacionLng: solicitud.lng,
      imagenUrl: opciones.imagenUrl || null,
      servicios: solicitud.momentos.join(', ') || null,
      destacado: false,
      activo: false,
      estrellas: null,
      momentos: (solicitud.momentos || []) as any,
      platos: [],
    });
  } catch (e: any) {
    console.warn('[publicar-solicitud] No se pudo crear el aliado pendiente:', e?.message);
    return null;
  }
}

function construirMapaUrl(solicitud: Solicitud): string {
  if (solicitud.lat && solicitud.lng) {
    return `https://www.google.com/maps/search/?api=1&query=${solicitud.lat},${solicitud.lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${solicitud.direccion}, Loja`
  )}`;
}

export async function publicarSolicitud(
  solicitud: Solicitud,
  platos: PlatoBorrador[],
  opciones: { imagenUrl?: string | null } = {}
): Promise<ResultadoPublicacion> {
  const pool = getGastroPool();
  const avisos: string[] = [];
  let aliadoId: number | null = solicitud.aliadoId ?? null;
  let platosPublicados = 0;
  let enlacesCreados = 0;

  const slugAliado = slugify(solicitud.nombreComercial) || `aliado-${solicitud.id}`;
  const descripcion =
    solicitud.notas ||
    `${solicitud.nombreComercial}, en ${solicitud.direccion}. ${
      solicitud.horarios ? `Horario: ${solicitud.horarios}.` : ''
    } Menú y datos actualizados por Qué Comer en Loja.`;

  const mapaUrl = solicitud.mapaUrl || construirMapaUrl(solicitud);
  const whatsappUrl = `https://wa.me/${solicitud.telefono.replace(/\D/g, '')}`;

  // ── 1. Ficha: si ya existe (creada al enviar el formulario), se activa ──
  try {
    const datosAliado = {
      nombre: solicitud.nombreComercial,
      tipo: 'GASTRONOMIA',
      descripcion,
      ubicacion: solicitud.direccion,
      telefono: solicitud.telefono,
      rangoPrecio: solicitud.rangoPrecio,
      mapaUrl,
      websiteUrl: solicitud.redesUrl,
      ubicacionLat: solicitud.lat,
      ubicacionLng: solicitud.lng,
      imagenUrl: opciones.imagenUrl || null,
      servicios: solicitud.momentos.join(', ') || null,
      destacado: true,
      activo: true,
      estrellas: null,
      momentos: (solicitud.momentos || []) as any,
      platos: platos.map((p) => slugify(p.nombre)).filter(Boolean),
    };

    if (aliadoId) {
      await updateAliado(aliadoId, datosAliado as any);
    } else {
      aliadoId = await createAliado(datosAliado);
    }
  } catch (e: any) {
    avisos.push(`No se pudo publicar la ficha: ${e?.message}.`);
  }

  // ── 2 y 3. Platos del catálogo + vínculo con el restaurante ─────────────
  if (aliadoId && platos.length > 0) {
    try {
      const catalogo = await catalogoActivo();
      for (const plato of platos) {
        const platoId = await asegurarPlatoCatalogo(plato, catalogo);
        if (!platoId) continue;

        const [existente] = await pool.query<RowDataPacket[]>(
          'SELECT id FROM plato_restaurantes WHERE aliado_id = ? AND item_carta = ? LIMIT 1',
          [aliadoId, plato.nombre]
        );
        if (existente && existente.length > 0) continue;

        await pool.query(
          `INSERT INTO plato_restaurantes
            (plato_id, nombre_restaurante, item_carta, descripcion_item, precio_textual,
             precio_numerico, moneda, categoria_excel, direccion, es_aliado_destacado, aliado_id, createdAt)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,NOW())`,
          [
            platoId,
            solicitud.nombreComercial,
            plato.nombre.slice(0, 255),
            (plato.descripcion || '').slice(0, 1000) || null,
            plato.precio ? `$${plato.precio.toFixed(2)}` : null,
            plato.precio ?? null,
            'USD',
            (solicitud.categorias[0] || 'tradicional').slice(0, 100),
            solicitud.direccion,
            1,
            aliadoId,
          ]
        );
        platosPublicados += 1;
        enlacesCreados += 1;
      }
    } catch (e: any) {
      avisos.push(`Platos cargados parcialmente (${platosPublicados}/${platos.length}): ${e?.message}.`);
    }
  }

  // ── 4. Carta publicada como menú (mismo flujo que el bot de WhatsApp) ───
  if (aliadoId) {
    try {
      const hoy = new Date();
      const fin = new Date(hoy);
      fin.setDate(fin.getDate() + 30);
      const lista = platos
        .slice(0, 15)
        .map((p) => `• ${p.nombre}${p.precio ? ` — $${p.precio.toFixed(2)}` : ''}`)
        .join('\n');

      await createPromo({
        aliado_slug: slugAliado,
        aliado_nombre: solicitud.nombreComercial,
        titulo: `Menú de ${solicitud.nombreComercial}`.slice(0, 200),
        tipo: 'PROMO',
        descripcion: (lista || descripcion).slice(0, 3000),
        imagen_url: opciones.imagenUrl || null,
        precio_original: null,
        precio_promo: null,
        fecha_inicio: hoy.toISOString().slice(0, 10),
        fecha_fin: fin.toISOString().slice(0, 10),
        lugar: solicitud.direccion,
        whatsapp_url: whatsappUrl,
        color_marca: '#153E3E',
      });
    } catch (e: any) {
      avisos.push(`La carta se guardó, pero no se pudo publicar como menú del día: ${e?.message}.`);
    }
  }

  return { aliadoId, platosPublicados, enlacesCreados, avisos };
}

/**
 * Vincula los platos de una carta a la ficha del restaurante sin publicar la
 * solicitud completa: asegura el plato en `platos_catalogo` (o lo reutiliza si
 * ya existe) y crea el enlace en `plato_restaurantes`, que es lo que hace que
 * el restaurante aparezca en la página `/platos/<slug>`.
 *
 * Se usa desde el editor de aliados del panel: así el mismo OCR que lee la
 * carta alimenta el catálogo de platos que ya tiene el proyecto.
 */
export async function vincularPlatosAliado(opciones: {
  aliadoId: number;
  nombreComercial: string;
  direccion: string;
  categoria?: string | null;
  platos: (PlatoBorrador & { slugCatalogo?: string | null })[];
}): Promise<{
  enlacesCreados: number;
  platosEnlazados: { slug: string; nombre: string; platoId: number }[];
}> {
  const pool = getGastroPool();
  const catalogo = await catalogoActivo();
  const enlazados: { slug: string; nombre: string; platoId: number }[] = [];
  let enlacesCreados = 0;

  for (const plato of opciones.platos) {
    // Si el panel ya eligió una página del catálogo, se respeta esa elección.
    const elegido = plato.slugCatalogo
      ? catalogo.find((c) => c.slug === plato.slugCatalogo)
      : undefined;

    const platoId = elegido ? elegido.id : await asegurarPlatoCatalogo(plato, catalogo);
    if (!platoId) continue;

    const entry = elegido || catalogo.find((c) => c.id === platoId);
    if (entry) enlazados.push({ slug: entry.slug, nombre: entry.nombre, platoId });

    const [existente] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM plato_restaurantes WHERE aliado_id = ? AND item_carta = ? LIMIT 1',
      [opciones.aliadoId, plato.nombre]
    );
    if (existente && existente.length > 0) continue;

    await pool.query(
      `INSERT INTO plato_restaurantes
        (plato_id, nombre_restaurante, item_carta, descripcion_item, precio_textual,
         precio_numerico, moneda, categoria_excel, direccion, es_aliado_destacado, aliado_id, createdAt)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,NOW())`,
      [
        platoId,
        opciones.nombreComercial,
        plato.nombre.slice(0, 255),
        (plato.descripcion || '').slice(0, 1000) || null,
        plato.precio ? `$${plato.precio.toFixed(2)}` : null,
        plato.precio ?? null,
        'USD',
        (opciones.categoria || 'tradicional').slice(0, 100),
        opciones.direccion,
        1,
        opciones.aliadoId,
      ]
    );
    enlacesCreados += 1;
  }

  return { enlacesCreados, platosEnlazados: enlazados };
}
