import 'server-only';

/**
 * Sube una imagen en base64 a BunnyCDN Storage y retorna la URL pública
 */
export async function uploadBase64ToBunny(base64Data: string, aliadoSlug: string): Promise<string | null> {
  try {
    const storageZone = process.env.BUNNY_STORAGE_ZONE;
    const apiKey = process.env.BUNNY_STORAGE_API_KEY;
    const storageHost = process.env.BUNNY_STORAGE_HOST || 'storage.bunnycdn.com';
    const pullZone = process.env.BUNNY_PULLZONE_URL;

    if (!storageZone || !apiKey || !pullZone) {
      console.warn('[BunnyUpload] Variables de entorno de BunnyCDN incompletas');
      return null;
    }

    // Quitar prefijo data:...;base64, si viene
    const cleanBase64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    const cleanAliado = aliadoSlug.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
    const fileName = `promos/${cleanAliado}-${Date.now()}.jpg`;

    const uploadUrl = `https://${storageHost}/${storageZone}/${fileName}`;

    const res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        AccessKey: apiKey,
        'Content-Type': 'application/octet-stream',
      },
      body: buffer,
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[BunnyUpload] Error subiendo imagen a Bunny:', res.status, err);
      return null;
    }

    const cleanPullZone = pullZone.replace(/\/+$/, '');
    const publicUrl = `${cleanPullZone}/${fileName}`;
    console.log(`[BunnyUpload] Imagen subida exitosamente: ${publicUrl}`);
    return publicUrl;
  } catch (err) {
    console.error('[BunnyUpload] Excepción subiendo imagen:', err);
    return null;
  }
}

