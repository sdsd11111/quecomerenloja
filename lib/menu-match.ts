/**
 * Emparejamiento entre los platos que devuelve el OCR de una carta y los platos
 * que ya existen en el catálogo del sitio (`/platos/<slug>`).
 *
 * El catálogo del proyecto es temático (por ejemplo "Café de Especialidad y
 * Filtrados" o "Horchata Lojana y Jugos Naturales"), no un plato por bebida:
 * por eso además de comparar nombres se comparan palabras clave.
 */

export interface PlatoCatalogoResumen {
  slug: string;
  nombre: string;
}

export interface CoincidenciaPlato extends PlatoCatalogoResumen {
  puntos: number;
}

const norm = (texto: string) =>
  (texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

/** Quita plurales simples para que "filtrados" y "filtrado" coincidan. */
const singular = (t: string) => {
  if (t.length > 6 && t.endsWith('es')) return t.slice(0, -2);
  if (t.length > 4 && t.endsWith('s')) return t.slice(0, -1);
  return t;
};

const tokens = (texto: string) =>
  norm(texto)
    .split(/[^a-z0-9]+/)
    .map(singular)
    .filter((t) => t.length > 3);

/**
 * Palabras que llevan a una página temática del catálogo. Sirve para los
 * platos que no tienen una página propia (bebidas, cafés, jugos…).
 */
const PALABRAS_CLAVE: Record<string, string[]> = {
  'cafe-especialidad-loja': [
    'cafe', 'capuchino', 'cappuccino', 'mocachino', 'mokaccino', 'latte', 'espresso',
    'filtrado', 'americano', 'expreso', 'macchiato', 'chocolate', 'cacao', 'mocca',
    'aromatica', 'infusion', 'te', 'matcha', 'descafeinado', 'grano', 'prensa',
  ],
  'horchata-jugos-naturales-loja': [
    'horchata', 'jugo', 'limonada', 'limon', 'naranja', 'mora', 'fresa', 'fruta',
    'batido', 'smoothie', 'te helado', 'ice tea', 'agua', 'granadilla', 'maracuya',
    'sandia', 'pina', 'papaya', 'guayaba', 'coco', 'chicha',
  ],
  'postres-tortas-loja': [
    'torta', 'cheesecake', 'postre', 'pastel', 'brownie', 'helado', 'flan', 'tres leches',
    'tiramisu', 'cupcake', 'dona', 'galleta',
  ],
  'waffles-crepes-loja': ['waffle', 'crepe', 'pancake', 'hotcake', 'oblea'],
  'hamburguesas-artesanales-loja': ['hamburguesa', 'burger', 'cheeseburger', 'smash'],
  'alitas-loja': ['alita', 'wing', 'wings', 'bbq'],
  'pizza-artesanal-loja': ['pizza', 'calzone', 'focaccia'],
  'salchipapas-loja': ['salchipapa', 'papipapa', 'papa cargada', 'papas fritas'],
  'hot-dogs-loja': ['hot dog', 'choripan', 'salchicha'],
  'sandwiches-loja': ['sandwich', 'sanduche', 'baguette', 'subway'],
  'tacos-mexicanos-loja': ['taco', 'burrito', 'quesadilla', 'nachos', 'tex mex'],
  'chifa-chaulafan-loja': ['chifa', 'chaulafan', 'chaufa', 'tallarin', 'wantan'],
  'sushi-rolls-loja': ['sushi', 'roll', 'maki', 'sashimi', 'tempura'],
  'pastas-italianas-loja': ['pasta', 'lasana', 'raviol', 'spaghetti', 'fetuccini', 'carbonara'],
  'parrilladas-loja': ['parrillada', 'asado', 'carbon', 'brasa', 'chuleta'],
  'cortes-premium-loja': ['bife', 'picana', 'lomo', 'filete', 'entrana', 'ribeye'],
  'lomo-fino-loja': ['lomo fino', 'lomo saltado'],
  'costillas-bbq-loja': ['costilla', 'ribs'],
  'pollo-asado-loja': ['pollo asado', 'pollo brasa', 'pollo broaster'],
  'pinchos-loja': ['pincho', 'brocheta', 'anticucho'],
  'ceviche-pescado-loja': ['ceviche', 'cebiche'],
  'ceviche-camaron-loja': ['ceviche de camaron', 'camaron'],
  'ceviche-concha-loja': ['concha', 'conchas negras'],
  'parihuela-loja': ['parihuela', 'sopa de marisco'],
  'encebollado-loja': ['encebollado'],
  'arroz-marinero-loja': ['arroz marinero', 'arroz con marisco'],
  'cazuela-mariscos-loja': ['cazuela'],
  'encocado-loja': ['encocado'],
  'camarones-apanados-loja': ['camaron apanado', 'camarones al ajillo'],
  'cangrejos-loja': ['cangrejo', 'cangrejada'],
  'trucha-pescados-frescos-loja': ['trucha', 'pescado fresco', 'corvina'],
  'repe-lojano': ['repe', 'sopa de repe'],
  'cecina-lojana': ['cecina'],
  'tamales-lojanos': ['tamal', 'tamales'],
  'humitas-loja': ['humita'],
  'quimbolitos-loja': ['quimbolito'],
  'bolones-loja': ['bolon', 'tigrillo', 'verde'],
  'empanadas-loja': ['empanada', 'morocho'],
  'cuy-asado-loja': ['cuy', 'cuy asado', 'medio cuy'],
  'gallina-cuyada-loja': ['gallina cuyada'],
  'arveja-con-guineo-loja': ['arveja', 'guineo'],
  'sango-loja': ['sango'],
  'locro-loja': ['locro', 'sopa'],
  'chicharron-loja': ['chicharron', 'piqueo'],
  'guatita-loja': ['guatita'],
  'seco-de-chivo-loja': ['seco de chivo', 'chivo'],
  'seco-de-pollo-loja': ['seco de pollo', 'seco de gallina'],
  'seco-de-carne-loja': ['seco de chancho', 'seco de res', 'seco de carne'],
  'menestras-loja': ['menestra', 'frijol', 'lenteja', 'garbanzo'],
  'churrasco-loja': ['churrasco'],
  'banderas-loja': ['bandera', 'plato combinado'],
  'fritada-lojana': ['fritada', 'mote'],
  'almuerzos-ejecutivos-loja': ['almuerzo ejecutivo', 'menu del dia', 'almuerzo'],
  'desayunos-continentales-loja': ['desayuno', 'omelette', 'huevo'],
  'ensaladas-gourmet-loja': ['ensalada', 'bowl'],
  'comida-vegetariana-vegana-loja': ['vegetariano', 'vegano', 'vegan'],
  'tablas-charcuteria-loja': ['tabla', 'jamon', 'queso', 'charcuteria'],
  'cocteleria-cerveza-artesanal-loja': ['coctel', 'cerveza', 'artesanal', 'michelada', 'mojito'],
  'caldos-sopas-criollas-loja': ['caldo', 'sopa criolla', 'aguado'],
};

export function buscarPlatoEnCatalogo(
  nombre: string,
  catalogo: PlatoCatalogoResumen[]
): CoincidenciaPlato | null {
  const nombreNorm = norm(nombre);
  if (!nombreNorm || catalogo.length === 0) return null;

  const mios = tokens(nombre);

  // 1) El nombre del plato del catálogo está contenido en el de la carta
  for (const plato of catalogo) {
    const suyo = norm(plato.nombre);
    if (suyo.length >= 4 && (nombreNorm === suyo || nombreNorm.includes(suyo))) {
      return { ...plato, puntos: 100 };
    }
  }

  // 2) Palabras clave del catálogo temático
  let mejor: CoincidenciaPlato | null = null;
  for (const plato of catalogo) {
    const claves = PALABRAS_CLAVE[plato.slug];
    if (!claves) continue;
    let puntos = 0;
    for (const clave of claves) {
      const c = norm(clave);
      if (c.includes(' ')) {
        if (nombreNorm.includes(c)) puntos += 2;
      } else if (mios.includes(singular(c))) {
        puntos += 1;
      }
    }
    if (puntos > 0 && (!mejor || puntos > mejor.puntos)) {
      mejor = { ...plato, puntos };
    }
  }
  if (mejor) return mejor;

  // 3) Dos o más palabras significativas en común con el nombre del plato
  for (const plato of catalogo) {
    const suyos = tokens(plato.nombre);
    const puntos = mios.filter((t) => suyos.includes(t)).length;
    if (puntos >= 2 && (!mejor || puntos > mejor.puntos)) {
      mejor = { ...plato, puntos };
    }
  }

  return mejor;
}
