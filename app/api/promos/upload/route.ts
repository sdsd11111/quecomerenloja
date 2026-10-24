import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const aliadoSlug = (formData.get('aliado') as string) || 'aliado';

    if (!file) {
      return NextResponse.json({ error: 'No se subió ningún archivo' }, { status: 400 });
    }

    // Validar formato
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Formato no permitido. Usa JPG, PNG, WEBP o AVIF' }, { status: 400 });
    }

    // Validar tamaño máx (6MB)
    if (file.size > 6 * 1024 * 1024) {
      return NextResponse.json({ error: 'La imagen excede el límite de 6MB' }, { status: 400 });
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
    const cleanAliado = aliadoSlug.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
    const fileName = `promos/${cleanAliado}-${Date.now()}.${extension}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    // Subir a Bunny Storage API: PUT https://storage.bunnycdn.com/{storageZone}/{path}
    const uploadUrl = `https://${storageHost}/${storageZone}/${fileName}`;

    const bunnyRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        AccessKey: apiKey,
        'Content-Type': 'application/octet-stream',
      },
      body: buffer,
    });

    if (!bunnyRes.ok) {
      const errText = await bunnyRes.text();
      console.error('Error subiendo a BunnyCDN para promo:', bunnyRes.status, errText);
      return NextResponse.json({ error: `Error BunnyCDN: ${bunnyRes.statusText}` }, { status: 502 });
    }

    // Formatear URL CDN pública
    const cleanPullZone = pullZone.replace(/\/+$/, '');
    const publicUrl = `${cleanPullZone}/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
    });
  } catch (err: any) {
    console.error('Error en upload promo:', err);
    return NextResponse.json({ error: err.message || 'Error al procesar subida' }, { status: 500 });
  }
}
