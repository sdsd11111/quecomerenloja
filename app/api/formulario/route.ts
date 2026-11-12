import { NextResponse, after } from 'next/server';
import {
  MAX_ARCHIVO_MB,
  MAX_ARCHIVOS,
  TIPOS_ARCHIVO,
  esDocumentoValido,
  esEmailValido,
  esTelefonoValido,
  normalizarTelefonoEC,
  telefonoInternacional,
} from '@/lib/formulario';
import { cifrarTexto } from '@/lib/cifrado';
import { subirArchivoBunny } from '@/lib/bunny';
import { crearSolicitud, guardarOcrEnSolicitud } from '@/lib/solicitudes-db';
import { leerCartaDesdeImagen } from '@/lib/services/cartaOcr';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WHATSAPP = process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP || '593986962872';

// ── Límite simple por IP (10 envíos por hora) ───────────────────────────────
const Ventana = 60 * 60 * 1000;
const Maximo = 10;
const golpes = new Map<string, { n: number; reinicio: number }>();

function exceedsLimite(ip: string): boolean {
  const ahora = Date.now();
  const actual = golpes.get(ip);
  if (!actual || ahora > actual.reinicio) {
    golpes.set(ip, { n: 1, reinicio: ahora + Ventana });
    return false;
  }
  actual.n += 1;
  return actual.n > Maximo;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function texto(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === 'string' ? v.trim() : '';
}

function lista(fd: FormData, key: string): string[] {
  return texto(fd, key)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function numero(fd: FormData, key: string): number | null {
  const v = Number(texto(fd, key));
  return Number.isFinite(v) && v !== 0 ? v : null;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'local';
    if (exceedsLimite(ip)) {
      return NextResponse.json(
        { error: 'Demasiados envíos desde este dispositivo. Escríbenos por WhatsApp y lo hacemos de una.' },
        { status: 429 }
      );
    }

    const fd = await request.formData();

    // ── Validación de datos ────────────────────────────────────────────────
    const nombreComercial = texto(fd, 'nombreComercial');
    const ruc = texto(fd, 'ruc');
    const propietario = texto(fd, 'propietario');
    const telefono = texto(fd, 'telefono');
    const email = texto(fd, 'email');
    const direccion = texto(fd, 'direccion');
    const categoria = texto(fd, 'categoria') || 'tradicional';
    const horarios = texto(fd, 'horarios');
    const cartaTexto = texto(fd, 'cartaTexto');

    const faltantes: string[] = [];
    if (!nombreComercial) faltantes.push('nombre comercial');
    if (!ruc) faltantes.push('RUC o cédula');
    if (!telefono) faltantes.push('WhatsApp');
    if (!email) faltantes.push('correo');
    if (!direccion) faltantes.push('dirección');
    if (!horarios) faltantes.push('horarios');
    if (faltantes.length > 0) {
      return NextResponse.json(
        { error: `Falta completar: ${faltantes.join(', ')}.` },
        { status: 400 }
      );
    }
    if (!esDocumentoValido(ruc)) {
      return NextResponse.json({ error: 'El RUC o la cédula no parece válido (13 o 10 dígitos).' }, { status: 400 });
    }
    if (!esTelefonoValido(telefono)) {
      return NextResponse.json({ error: 'El número de WhatsApp no parece válido (9 dígitos, con 0 inicial).' }, { status: 400 });
    }
    if (!esEmailValido(email)) {
      return NextResponse.json({ error: 'El correo no parece válido.' }, { status: 400 });
    }

    // ── Archivos ───────────────────────────────────────────────────────────
    const archivos = [
      ...(fd.getAll('carta') as File[]).map((f) => ({ file: f, tipo: 'carta' })),
      ...(fd.getAll('fotos') as File[]).map((f) => ({ file: f, tipo: 'foto' })),
    ].filter((a) => a.file && a.file.size > 0);

    if (archivos.length > MAX_ARCHIVOS) {
      return NextResponse.json(
        { error: `Máximo ${MAX_ARCHIVOS} archivos por envío.` },
        { status: 400 }
      );
    }

    for (const { file } of archivos) {
      if (!TIPOS_ARCHIVO.includes(file.type)) {
        return NextResponse.json(
          { error: 'Formato no permitido. Usa JPG, PNG, WEBP o PDF.' },
          { status: 400 }
        );
      }
      if (file.size > MAX_ARCHIVO_MB * 1024 * 1024) {
        return NextResponse.json(
          { error: `Cada archivo puede pesar hasta ${MAX_ARCHIVO_MB} MB.` },
          { status: 400 }
        );
      }
    }

    // ── Subida a CDN + registro ────────────────────────────────────────────
    const slugBase = nombreComercial
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40);

    const guardados: {
      tipo: string;
      nombre: string;
      url: string;
      mime: string | null;
      tamano: number | null;
      bytes?: Buffer;
    }[] = [];

    for (const { file, tipo } of archivos) {
      const { url } = await subirArchivoBunny(file, 'altas', `${slugBase}-${tipo}`);
      guardados.push({
        tipo,
        nombre: file.name,
        url,
        mime: file.type,
        tamano: file.size,
        bytes: tipo === 'carta' ? Buffer.from(await file.arrayBuffer()) : undefined,
      });
    }

    const cuentaBancaria = texto(fd, 'cuentaBancaria');

    const { id, folio } = await crearSolicitud({
      nombreComercial,
      ruc,
      propietario,
      telefono: normalizarTelefonoEC(telefono),
      telefonoAlt: texto(fd, 'telefonoAlt') ? normalizarTelefonoEC(texto(fd, 'telefonoAlt')) : null,
      email,
      emailPersonal: texto(fd, 'emailPersonal') || null,
      direccion,
      referencias: texto(fd, 'referencias') || null,
      lat: numero(fd, 'lat'),
      lng: numero(fd, 'lng'),
      horarios,
      categorias: [categoria],
      momentos: lista(fd, 'momentos'),
      rangoPrecio: texto(fd, 'rangoPrecio') || null,
      servicios: [],
      metodosPago: lista(fd, 'metodosPago'),
      redesUrl: texto(fd, 'redesUrl') || null,
      cuentaBancaria: cuentaBancaria ? cifrarTexto(cuentaBancaria) : null,
      notas: texto(fd, 'notas') || null,
      cartaTexto: cartaTexto || null,
      archivos: guardados.map(({ bytes: _bytes, ...resto }) => resto),
    });

    // ── Lectura automática de la carta (en segundo plano) ──────────────────
    const imagen = guardados.find((a) => a.tipo === 'carta' && (a.mime || '').startsWith('image/'));
    if (imagen) {
      const tarea = async () => {
        try {
          // La lectura no puede dejar colgado el proceso: si tarda demasiado,
          // la revisión manual parte del texto que envíe el restaurante.
          const lectura = await Promise.race([
            leerCartaDesdeImagen(imagen.bytes!, nombreComercial),
            new Promise<null>((resolve) => setTimeout(() => resolve(null), 120000)),
          ]);
          if (lectura) {
            await guardarOcrEnSolicitud(id, lectura.texto || null, lectura.platos);
          }
        } catch (e: any) {
          console.warn('[formulario] OCR no disponible:', e?.message);
        }
      };
      try {
        after(tarea);
      } catch {
        void tarea();
      }
    }

    return NextResponse.json({
      ok: true,
      folio,
      mensaje: `Recibimos tu solicitud ${folio}. Publicamos tu ficha en un plazo de 48 horas.`,
      whatsapp: `https://wa.me/${WHATSAPP.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Hola, acabo de enviar el formulario de alta (${folio}) de ${nombreComercial}.`
      )}`,
    });
  } catch (err: any) {
    console.error('[formulario] Error:', err);
    const mensajeDB =
      err?.message?.includes('DATABASE_URL') || err?.message?.includes('GASTRONOMIA_DB_URL')
        ? 'El formulario está en mantenimiento. Escríbenos por WhatsApp y lo hacemos de una.'
        : 'No pudimos registrar tu solicitud. Escríbenos por WhatsApp y lo hacemos de una.';
    return NextResponse.json({ error: mensajeDB }, { status: 500 });
  }
}
