import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const AUTH_COOKIE_NAME = 'admin_session_token';
const AUTH_SECRET_VALUE = 'authenticated_mi_sitio_admin_2026';

async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME);
  return token?.value === AUTH_SECRET_VALUE;
}

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No se subió ningún archivo' }, { status: 400 });
    }

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Formato no permitido. Usa JPG, PNG, WEBP o AVIF' }, { status: 400 });
    }

    // Validar tamaño máx (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'La imagen excede el límite de 5MB' }, { status: 400 });
    }

    const storageZone = process.env.BUNNY_STORAGE_ZONE;
    const apiKey = process.env.BUNNY_STORAGE_API_KEY;
    const storageHost = process.env.BUNNY_STORAGE_HOST || 'storage.bunnycdn.com';
    const pullZone = process.env.BUNNY_PULLZONE_URL;

    if (!storageZone || !apiKey || !pullZone) {
      return NextResponse.json({ error: 'BunnyCDN no está configurado en las variables de entorno' }, { status: 500 });
    }

    // Sanitizar nombre de archivo
    const extension = file.name.split('.').pop()?.toLowerCase() || 'webp';
    const rawName = file.name.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
    const fileName = `aliados/${rawName}-${Date.now()}.${extension}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    // Subir a Bunny Storage API: PUT https://storage.bunnycdn.com/{storageZone}/{path}
    const uploadUrl = `https://${storageHost}/${storageZone}/${fileName}`;

    const bunnyRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        AccessKey: apiKey,
        'Content-Type': file.type,
      },
      body: buffer,
    });

    if (!bunnyRes.ok) {
      const errText = await bunnyRes.text();
      console.error('Error subiendo a BunnyCDN:', errText);
      return NextResponse.json({ error: `Error en BunnyCDN (${bunnyRes.status}): ${errText}` }, { status: 502 });
    }

    const publicUrl = `${pullZone.replace(/\/$/, '')}/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
    });
  } catch (err: any) {
    console.error('Error procesando subida de imagen:', err);
    return NextResponse.json({ error: err.message || 'Error al procesar la imagen' }, { status: 500 });
  }
}
