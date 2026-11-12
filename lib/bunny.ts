import 'server-only';

/**
 * Subida de archivos a BunnyCDN (mismo patrón que app/api/promos/upload).
 * En producción el CDN sirve las imágenes con WebP; aquí guardamos la original
 * y el panel de administración ya sirve WebP cuando se resuben.
 */
export async function subirArchivoBunny(
  archivo: File,
  carpeta: string,
  nombreBase: string
): Promise<{ url: string; fileName: string }> {
  const storageZone = process.env.BUNNY_STORAGE_ZONE;
  const apiKey = process.env.BUNNY_STORAGE_API_KEY;
  const storageHost = process.env.BUNNY_STORAGE_HOST || 'storage.bunnycdn.com';
  const pullZone = process.env.BUNNY_PULLZONE_URL;

  if (!storageZone || !apiKey || !pullZone) {
    throw new Error('BunnyCDN no está configurado (BUNNY_STORAGE_ZONE / BUNNY_STORAGE_API_KEY / BUNNY_PULLZONE_URL)');
  }

  const extension = (archivo.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const base = nombreBase.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 40);
  const fileName = `${carpeta}/${base}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${extension}`;

  const buffer = Buffer.from(await archivo.arrayBuffer());
  const uploadUrl = `https://${storageHost}/${storageZone}/${fileName}`;

  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      AccessKey: apiKey,
      'Content-Type': archivo.type || 'application/octet-stream',
    },
    body: buffer,
  });

  if (!res.ok) {
    const detalle = await res.text().catch(() => '');
    throw new Error(`BunnyCDN respondió ${res.status}: ${detalle.slice(0, 200)}`);
  }

  const publicUrl = `${pullZone.replace(/\/+$/, '')}/${fileName}`;
  return { url: publicUrl, fileName };
}
