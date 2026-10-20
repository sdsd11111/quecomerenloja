/**
 * Utilidad para extraer coordenadas Latitud y Longitud desde enlaces o texto de Google Maps
 * Soporta:
 * 1. URLs completas: https://www.google.com/maps/place/.../@-3.99615,-79.20455,17z/...
 * 2. URLs de búsqueda: https://maps.google.com/?q=-3.99615,-79.20455
 * 3. Enlaces embebidos iframe: src="...pb=!1m18!1m12!1d...!2d-79.20455!3d-3.99615!..."
 * 4. Texto directo copiado: "-3.99615, -79.20455"
 */

export interface GpsCoords {
  lat: number;
  lng: number;
}

export function extractGpsFromGoogleMaps(input: string): GpsCoords | null {
  if (!input || typeof input !== 'string') return null;
  const str = input.trim();

  // Caso 1: Coordenadas directas en texto, ej: "-3.99615, -79.20455" o "-3.99615,-79.20455"
  const directMatch = str.match(/^(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)$/);
  if (directMatch) {
    const lat = parseFloat(directMatch[1]);
    const lng = parseFloat(directMatch[2]);
    if (isValidCoords(lat, lng)) return { lat, lng };
  }

  // Caso 2: URL de Google Maps con @lat,lng, ej: /@-3.996153,-79.204551,17z
  const atMatch = str.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (isValidCoords(lat, lng)) return { lat, lng };
  }

  // Caso 3: Parámetro q=lat,lng o ll=lat,lng o query=lat,lng
  const qMatch = str.match(/[?&](?:q|ll|query)=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (qMatch) {
    const lat = parseFloat(qMatch[1]);
    const lng = parseFloat(qMatch[2]);
    if (isValidCoords(lat, lng)) return { lat, lng };
  }

  // Caso 4: Iframe embebido de Google Maps con !3dLAT!2dLNG
  const iframeMatch = str.match(/!3d(-?\d+\.\d+)!2d(-?\d+\.\d+)/);
  if (iframeMatch) {
    const lat = parseFloat(iframeMatch[1]);
    const lng = parseFloat(iframeMatch[2]);
    if (isValidCoords(lat, lng)) return { lat, lng };
  }

  // Caso 5: Formato invertido !2dLNG!3dLAT
  const iframeMatch2 = str.match(/!2d(-?\d+\.\d+).*?!3d(-?\d+\.\d+)/);
  if (iframeMatch2) {
    const lng = parseFloat(iframeMatch2[1]);
    const lat = parseFloat(iframeMatch2[2]);
    if (isValidCoords(lat, lng)) return { lat, lng };
  }

  return null;
}

function isValidCoords(lat: number, lng: number): boolean {
  return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}
