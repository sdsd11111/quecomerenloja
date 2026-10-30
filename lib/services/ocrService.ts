import 'server-only';

/**
 * Extrae texto de una imagen (afiche publicitario / menú diario) usando OCR Space
 */
export async function extraerTextoDeImagen(imageBase64OrUrl: string): Promise<string> {
  try {
    const formData = new URLSearchParams();
    const apiKey = process.env.OCR_SPACE_API_KEY || 'helloworld';

    if (imageBase64OrUrl.startsWith('http://') || imageBase64OrUrl.startsWith('https://')) {
      formData.append('url', imageBase64OrUrl);
    } else {
      const base64Data = imageBase64OrUrl.startsWith('data:')
        ? imageBase64OrUrl
        : `data:image/jpeg;base64,${imageBase64OrUrl}`;
      formData.append('base64Image', base64Data);
    }

    formData.append('apikey', apiKey);
    formData.append('language', 'spa');
    formData.append('isOverlayRequired', 'false');
    formData.append('detectOrientation', 'true');
    formData.append('scale', 'true');

    const res = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!res.ok) {
      console.warn(`[OCR] Error en petición HTTP: status ${res.status}`);
      return '';
    }

    const data = await res.json();
    if (data.IsErroredOnProcessing || !data.ParsedResults || data.ParsedResults.length === 0) {
      console.warn('[OCR] No se pudo procesar la imagen:', data.ErrorMessage || 'Sin resultados');
      return '';
    }

    const textoExtraido = data.ParsedResults.map((r: any) => r.ParsedText || '').join('\n').trim();
    console.log(`[OCR] Texto extraído con éxito (${textoExtraido.length} caracteres)`);
    return textoExtraido;
  } catch (error) {
    console.error('[OCR] Excepción procesando imagen:', error);
    return '';
  }
}

