import { PLATOS, PlatoCard } from './platos-data';

export interface PlatoExtraido {
  nombre: string;
  precio?: string;
  categoriaSugerida?: string;
  momentoSugerido?: 'desayuno' | 'almuerzo' | 'cena';
  coincidencia?: PlatoCard;
  tienePagina: boolean;
  slugSugerido?: string;
}

export interface NormalizacionResultado {
  platos: PlatoExtraido[];
  slugsAsociados: string[];
  momentosDetectados: ('desayuno' | 'almuerzo' | 'cena')[];
  platosSinPagina: PlatoExtraido[];
  resumenTexto: string;
}

// Diccionario de equivalencias y sinónimos para Loja
const SINONIMOS_PLATOS: Record<string, string> = {
  'repe': 'repe-lojano',
  'repe blanco': 'repe-lojano',
  'repe con quesillo': 'repe-lojano',
  'sopa de repe': 'repe-lojano',
  'cecina': 'cecina-lojana',
  'cecina asada': 'cecina-lojana',
  'cecina con yuca': 'cecina-lojana',
  'tamal': 'tamales-lojanos',
  'tamales': 'tamales-lojanos',
  'tamal de pollo': 'tamales-lojanos',
  'tamal lojano': 'tamales-lojanos',
  'arveja': 'arveja-con-guineo',
  'arveja con guineo': 'arveja-con-guineo',
  'arvejitas': 'arveja-con-guineo',
  'humita': 'humitas-loja',
  'humitas': 'humitas-loja',
  'humitas con cafe': 'humitas-loja',
  'bolon': 'bolones-en-loja',
  'bolones': 'bolones-en-loja',
  'bolon de verde': 'bolones-en-loja',
  'bolon de quesillo': 'bolones-en-loja',
  'bolon mixto': 'bolones-en-loja',
  'tigrillo': 'bolones-en-loja',
  'quimbolito': 'quimbolitos-loja',
  'quimbolitos': 'quimbolitos-loja',
  'cuy': 'cuy-asado-loja',
  'cuy asado': 'cuy-asado-loja',
  'medio cuy': 'cuy-asado-loja',
  'parihuela': 'parihuela-loja',
  'sopa de mariscos': 'parihuela-loja',
  'pizza': 'pizza-loja',
  'pizzas': 'pizza-loja',
  'pizza artesanal': 'pizza-loja',
  'pizza a la leña': 'pizza-loja',
  'alita': 'alitas-loja',
  'alitas': 'alitas-loja',
  'alitas bbq': 'alitas-loja',
  'alitas picantes': 'alitas-loja',
  'wings': 'alitas-loja',
  'burger': 'hamburguesas-loja',
  'burgers': 'hamburguesas-loja',
  'hamburguesa': 'hamburguesas-loja',
  'hamburguesas': 'hamburguesas-loja',
  'smash burger': 'hamburguesas-loja',
  'chifa': 'chifa-loja',
  'chaulafan': 'chifa-loja',
  'arroz chaufa': 'chifa-loja',
  'tallarin saltado': 'chifa-loja',
  'seco de pollo': 'seco-de-pollo-loja',
  'seco de gallina': 'seco-de-pollo-loja',
  'pollo al jugo': 'seco-de-pollo-loja',
};

const STOPWORDS_CABECERAS = [
  'restaurante',
  'cafeteria',
  'menu',
  'carta',
  'especialidades',
  'lista de precios',
  'horario',
  'direccion',
  'telefono',
  'whatsapp',
  'pedidos',
  'domicilio',
  'abierto',
  'bienvenidos',
];

function normalizarTexto(txt: string): string {
  return txt
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function generarSlug(nombre: string): string {
  return normalizarTexto(nombre)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function esLineaIgnorable(linea: string): boolean {
  const l = normalizarTexto(linea);
  if (l.length < 3) return true;
  // Si la línea contiene sólo títulos genéricos del negocio
  for (const sw of STOPWORDS_CABECERAS) {
    if (l === sw || l.startsWith(`${sw} `) || l.endsWith(` ${sw}`) || l.includes(`menu del dia`)) {
      if (l.includes('tamal') || l.includes('repe') || l.includes('cecina') || l.includes('chivo') || l.includes('trucha')) {
        return false;
      }
      return true;
    }
  }
  return false;
}

function inferirMomento(nombreNorm: string, categoria?: string): 'desayuno' | 'almuerzo' | 'cena' {
  const cat = (categoria || '').toLowerCase();
  if (cat.includes('desayun') || cat.includes('manana') || cat.includes('cafe')) return 'desayuno';
  if (cat.includes('almuerz') || cat.includes('menu diario') || cat.includes('segundo') || cat.includes('sopa')) return 'almuerzo';
  if (cat.includes('cena') || cat.includes('noche') || cat.includes('rapida') || cat.includes('piqueo')) return 'cena';

  if (
    nombreNorm.includes('tamal') ||
    nombreNorm.includes('humita') ||
    nombreNorm.includes('bolon') ||
    nombreNorm.includes('quimbolito') ||
    nombreNorm.includes('tigrillo') ||
    nombreNorm.includes('cafe') ||
    nombreNorm.includes('desayuno')
  ) {
    return 'desayuno';
  }

  if (
    nombreNorm.includes('pizza') ||
    nombreNorm.includes('alita') ||
    nombreNorm.includes('burger') ||
    nombreNorm.includes('hamburguesa') ||
    nombreNorm.includes('hot dog') ||
    nombreNorm.includes('piqueo') ||
    nombreNorm.includes('coctel')
  ) {
    return 'cena';
  }

  return 'almuerzo';
}

function buscarCoincidenciaPlato(nombreNorm: string): PlatoCard | undefined {
  // 1. Coincidencia directa por sinónimo
  for (const [sinonimo, slug] of Object.entries(SINONIMOS_PLATOS)) {
    if (nombreNorm.includes(sinonimo)) {
      const p = PLATOS.find((item) => item.slug === slug);
      if (p) return p;
    }
  }

  // 2. Coincidencia por nombre o slug en PLATOS
  for (const plato of PLATOS) {
    const platoNorm = normalizarTexto(plato.nombre);
    if (nombreNorm.includes(platoNorm) || platoNorm.includes(nombreNorm)) {
      return plato;
    }
  }

  return undefined;
}

/**
 * Normaliza cualquier texto plano de carta/menú extraído con IA u OCR
 */
export function normalizarMenuTexto(rawText: string): NormalizacionResultado {
  if (!rawText || !rawText.trim()) {
    return {
      platos: [],
      slugsAsociados: [],
      momentosDetectados: [],
      platosSinPagina: [],
      resumenTexto: '',
    };
  }

  // Si el usuario pegó un JSON directo:
  let lineas: string[] = [];
  try {
    const posibleJson = JSON.parse(rawText);
    if (Array.isArray(posibleJson)) {
      lineas = posibleJson.map((item) => {
        if (typeof item === 'string') return item;
        if (item && item.nombre) {
          return `${item.nombre} ${item.precio ? `$${item.precio}` : ''} ${item.categoria ? `(${item.categoria})` : ''}`;
        }
        return JSON.stringify(item);
      });
    } else if (typeof posibleJson === 'object' && posibleJson !== null) {
      const keys = Object.keys(posibleJson);
      for (const k of keys) {
        const val = posibleJson[k];
        if (Array.isArray(val)) {
          val.forEach((sub) => lineas.push(`${sub} (${k})`));
        } else {
          lineas.push(`${k}: ${val}`);
        }
      }
    }
  } catch {
    // Si no es JSON, separar por saltos de línea y viñetas
    lineas = rawText
      .split(/\r?\n|•|\*|;|\|/)
      .map((l) => l.trim())
      .filter((l) => l.length > 2);
  }

  const platosExtraidos: PlatoExtraido[] = [];
  const slugsSet = new Set<string>();
  const momentosSet = new Set<'desayuno' | 'almuerzo' | 'cena'>();
  let categoriaActual = '';

  for (const linea of lineas) {
    // Detectar si la línea es un encabezado de sección / categoría
    const lineaUpper = linea.toUpperCase();
    if (
      lineaUpper.endsWith(':') ||
      lineaUpper.includes('DESAYUNO') ||
      lineaUpper.includes('ALMUERZO') ||
      lineaUpper.includes('CENA') ||
      lineaUpper.includes('ENTRADA') ||
      lineaUpper.includes('SOPAS') ||
      lineaUpper.includes('PLATOS FUERTES') ||
      lineaUpper.includes('BEBIDAS')
    ) {
      categoriaActual = linea.replace(/[:\-]/g, '').trim();
      continue;
    }

    if (esLineaIgnorable(linea)) {
      continue;
    }

    // Extraer precio si existe (ej: $4.50, 4.50$, $5, etc.)
    const precioMatch = linea.match(/(\$\s*\d+([.,]\d{1,2})?|\d+([.,]\d{1,2})?\s*\$)/);
    const precio = precioMatch ? precioMatch[0].replace(/\s+/g, '') : undefined;

    // Limpiar el nombre quitando precio y caracteres extraños
    let nombreLimpio = linea
      .replace(/(\$\s*\d+([.,]\d{1,2})?|\d+([.,]\d{1,2})?\s*\$)/g, '')
      .replace(/^[-–—0-9.)\s]+/, '')
      .replace(/\(.*\)/, '')
      .trim();

    if (nombreLimpio.length < 3) continue;

    const nombreNorm = normalizarTexto(nombreLimpio);
    const coincidencia = buscarCoincidenciaPlato(nombreNorm);
    const momento = coincidencia && coincidencia.momentos[0]
      ? coincidencia.momentos[0]
      : inferirMomento(nombreNorm, categoriaActual);

    momentosSet.add(momento);

    if (coincidencia) {
      slugsSet.add(coincidencia.slug);
      platosExtraidos.push({
        nombre: nombreLimpio,
        precio,
        categoriaSugerida: categoriaActual || undefined,
        momentoSugerido: momento,
        coincidencia,
        tienePagina: true,
        slugSugerido: coincidencia.slug,
      });
    } else {
      const slugSugerido = generarSlug(nombreLimpio);
      platosExtraidos.push({
        nombre: nombreLimpio,
        precio,
        categoriaSugerida: categoriaActual || undefined,
        momentoSugerido: momento,
        tienePagina: false,
        slugSugerido,
      });
    }
  }

  const platosSinPagina = platosExtraidos.filter((p) => !p.tienePagina);

  return {
    platos: platosExtraidos,
    slugsAsociados: Array.from(slugsSet),
    momentosDetectados: Array.from(momentosSet),
    platosSinPagina,
    resumenTexto: `${platosExtraidos.length} platos válidos (${slugsSet.size} vinculados a páginas existentes, ${platosSinPagina.length} nuevas oportunidades SEO).`,
  };
}
