/**
 * Catálogo centralizado de platos lojanos.
 * Cada plato sabe a qué "hubs de momento" pertenece.
 * Los hubs (desayunos-en-loja, almuerzos-loja, comida-rapida-loja)
 * leen este archivo para mostrar sus spokes con un enlace canónico /platos/[slug].
 */

export type MomentoHub = "desayuno" | "almuerzo" | "cena";

export interface PlatoCard {
  slug: string;
  nombre: string;
  tagline: string;
  desc: string;
  emoji: string;
  imagen: string;
  momentos: MomentoHub[];
  volumenBusqueda?: string; // e.g. "5.000/mes"
  precioPromedio?: string;
}

export const PLATOS: PlatoCard[] = [
  {
    slug: "repe-lojano",
    nombre: "Repe Lojano",
    tagline: "La sopa estrella de Loja",
    desc: "Sopa cremosa de guineo verde, quesillo artesanal y cilantro. El plato más icónico de la gastronomía lojana.",
    emoji: "🥣",
    imagen: "https://mvps.b-cdn.net/quecomerenloja/home/repe-lojano.webp",
    momentos: ["almuerzo"],
    volumenBusqueda: "5.000/mes",
    precioPromedio: "$2.50 – $4.00",
  },
  {
    slug: "cecina-lojana",
    nombre: "Cecina Lojana",
    tagline: "Asado tradicional a la brasa",
    desc: "Fino filete de cerdo marinado y asado al carbón con yuca tierna, mote y curtido de cebolla. La dupla perfecta con el repe.",
    emoji: "🔥",
    imagen: "https://mvps.b-cdn.net/quecomerenloja/home/cecina-lojana.webp",
    momentos: ["almuerzo"],
    volumenBusqueda: "500/mes",
    precioPromedio: "$4.50 – $7.50",
  },
  {
    slug: "tamales-lojanos",
    nombre: "Tamales Lojanos",
    tagline: "El desayuno insigne de Loja",
    desc: "Masa de maíz criollo cocinada en hoja de achira con pollo y condumio tradicional. El clásico mañanero con café.",
    emoji: "🌽",
    imagen: "https://mvps.b-cdn.net/quecomerenloja/desayunos/tamal-lojano-cafe.webp",
    momentos: ["desayuno"],
    volumenBusqueda: "1.000/mes",
    precioPromedio: "$1.25 – $2.00",
  },
  {
    slug: "arveja-con-guineo",
    nombre: "Arveja con Guineo",
    tagline: "Sopa lojana del mediodía",
    desc: "Caldo sustancioso de arveja tierna con rodajas de guineo verde cocinado, acompañado de quesillo y un toque de cilantro.",
    emoji: "🫛",
    imagen: "https://mvps.b-cdn.net/quecomerenloja/home/arveja-guineo.webp",
    momentos: ["almuerzo"],
    volumenBusqueda: "300/mes",
    precioPromedio: "$2.00 – $3.50",
  },
  {
    slug: "humitas-loja",
    nombre: "Humitas de Loja",
    tagline: "Maíz tierno con quesillo derretido",
    desc: "Elaboradas con choclo fresco molido y abundante quesillo artesanal lojano derretido, cocinadas en sus propias pancas al vapor.",
    emoji: "🫔",
    imagen: "https://mvps.b-cdn.net/quecomerenloja/desayunos/humita-quesillo.webp",
    momentos: ["desayuno"],
    volumenBusqueda: "200/mes",
    precioPromedio: "$1.00 – $1.75",
  },
  {
    slug: "bolones-en-loja",
    nombre: "Bolones en Loja",
    tagline: "Verde crocante con quesillo o chicharrón",
    desc: "El desayuno ecuatoriano preferido de las mañanas: masa de plátano verde majada y frita, rellena de quesillo derretido o chicharrón, con café pasado.",
    emoji: "🍌",
    imagen: "https://mvps.b-cdn.net/quecomerenloja/desayunos/bolon-quesillo.webp",
    momentos: ["desayuno"],
    volumenBusqueda: "300/mes",
    precioPromedio: "$1.75 – $3.50",
  },
  {
    slug: "quimbolitos-loja",
    nombre: "Quimbolitos Lojanos",
    tagline: "Bizcocho esponjoso en hoja de achira",
    desc: "Suave masa dulce de harina de maíz y trigo con pasas y un toque de licor, cocinada al vapor en hoja de achira. Tradición de media mañana y café.",
    emoji: "🧁",
    imagen: "https://mvps.b-cdn.net/quecomerenloja/home/tamales-humitas.webp",
    momentos: ["desayuno"],
    volumenBusqueda: "200/mes",
    precioPromedio: "$1.00 – $1.75",
  },
  {
    slug: "cuy-asado-loja",
    nombre: "Cuy Asado en Loja",
    tagline: "Delicadeza andina para turistas",
    desc: "Cuy entero asado lentamente al horno de leña o al carbón, servido con papas con cuy, salsa de maní y encurtidos andinos.",
    emoji: "🍖",
    imagen: "https://mvps.b-cdn.net/quecomerenloja/almuerzos/segundo-fuerte.webp",
    momentos: ["almuerzo", "cena"],
    volumenBusqueda: "800/mes",
    precioPromedio: "$8.00 – $14.00",
  },
  {
    slug: "parihuela-loja",
    nombre: "Parihuela en Loja",
    tagline: "Sopa de mariscos al estilo lojano",
    desc: "Caldo concentrado de mariscos frescos (camarón, calamar, mejillón) aromatizado con ají amarillo, cilantro y limón. Especial para noches.",
    emoji: "🦐",
    imagen: "https://mvps.b-cdn.net/quecomerenloja/almuerzos/parihuela-mariscos.webp",
    momentos: ["almuerzo", "cena"],
    volumenBusqueda: "400/mes",
    precioPromedio: "$6.00 – $10.00",
  },
  {
    slug: "pizza-loja",
    nombre: "Pizza en Loja",
    tagline: "Las mejores pizzerías y sabores en Loja",
    desc: "Las pizzerías de Loja ofrecen desde la clásica napolitana hasta la pizza artesanal con ingredientes locales. El favorito de las noches lojanas.",
    emoji: "🍕",
    imagen: "https://mvps.b-cdn.net/quecomerenloja/cenas/pizza-lena.webp",
    momentos: ["cena"],
    volumenBusqueda: "500/mes",
    precioPromedio: "$6.00 – $15.00",
  },
  {
    slug: "alitas-loja",
    nombre: "Alitas en Loja",
    tagline: "Alitas BBQ y picantes para la noche",
    desc: "Las mejores alitas de pollo BBQ, picantes y de búfalo en los locales nocturnos de Loja. El snack rey de las noches de jueves a domingo.",
    emoji: "🍗",
    imagen: "https://mvps.b-cdn.net/quecomerenloja/cenas/alitas-artesanales.webp",
    momentos: ["cena"],
    volumenBusqueda: "500/mes",
    precioPromedio: "$5.00 – $12.00",
  },
  {
    slug: "hamburguesas-loja",
    nombre: "Hamburguesas en Loja",
    tagline: "Smash burgers y clásicas artesanales",
    desc: "Desde la clásica con papas fritas hasta las smash burgers artesanales con ingredientes locales. Los mejores lugares para comer hamburguesas en Loja.",
    emoji: "🍔",
    imagen: "https://mvps.b-cdn.net/quecomerenloja/cenas/smash-burgers.webp",
    momentos: ["cena"],
    volumenBusqueda: "500/mes",
    precioPromedio: "$4.50 – $10.00",
  },
  {
    slug: "chifa-loja",
    nombre: "Chifa en Loja",
    tagline: "Cocina chino-ecuatoriana en Loja",
    desc: "Los chifas de Loja fusionan la tradición culinaria china con ingredientes locales: arroz chaufa, sopa wantán, lomo saltado y tallarines. Ideales para cenar en familia.",
    emoji: "🥢",
    imagen: "https://mvps.b-cdn.net/quecomerenloja/cenas/chifa-chaulafan.webp",
    momentos: ["almuerzo", "cena"],
    volumenBusqueda: "500/mes",
    precioPromedio: "$4.00 – $9.00",
  },
  {
    slug: "seco-de-pollo-loja",
    nombre: "Seco de Pollo Lojano",
    tagline: "El segundo más popular del menú del día",
    desc: "Jugoso pollo estofado en salsa de tomate, cebolla y especias lojanas, acompañado de arroz blanco, menestra de lenteja y aguacate. El plato fuerte estrella de todos los almuerzos en Loja.",
    emoji: "🍗",
    imagen: "https://mvps.b-cdn.net/quecomerenloja/almuerzos/segundo-fuerte.webp",
    momentos: ["almuerzo"],
    volumenBusqueda: "300/mes",
    precioPromedio: "$3.00 – $5.00",
  },
];

/** Devuelve los platos que pertenecen a un hub de momento */
export function getPlatosByMomento(momento: MomentoHub): PlatoCard[] {
  return PLATOS.filter((p) => p.momentos.includes(momento));
}

/** Devuelve un plato por su slug */
export function getPlatoBySlug(slug: string): PlatoCard | undefined {
  return PLATOS.find((p) => p.slug === slug);
}
