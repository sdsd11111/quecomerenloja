import type { Post } from "./types";

export const POSTS: Post[] = [
  {
    slug: "que-comer-en-loja-platos-que-debes-probar",
    title: "Qué comer en Loja: platos que debes probar",
    excerpt: "Repe, cecina, alverja con guineo, humitas y más: una guía rápida para tu primera visita.",
    date: "2026-10-01",
    readMinutes: 4,
    tag: "Guía",
    body: [
      { p: "Si es tu primera vez en Loja, la mejor forma de conocerla es por el paladar. Esta es una lista corta para empezar; en la Ruta Gastronómica iremos sumando fichas verificadas de cada plato." },
      { h: "Repe", p: "Sopa espesa de guineo verde, típica de la zona. Muchas huecas la ofrecen en el almuerzo; pregunta si hay repe blanco ese día." },
      { h: "Cecina", p: "Carne secada y asada, un acompañante clásico del almuerzo lojano. Suele servirse con arroz y ensalada." },
      { h: "Alverja con guineo", p: "Un plato casero y reconfortante que aparece según la hueca y el día. Por eso conviene mirar el menú del día antes de ir." },
      { h: "Humitas y tamales", p: "Perfectos para el desayuno o la tarde, sobre todo acompañados de un buen café." },
      { p: "¿Quieres saber dónde hay hoy? Usa el buscador por plato o escribe directo al restaurante por WhatsApp desde su ficha." },
    ],
  },
  {
    slug: "cafe-de-loja-guia-para-empezar",
    title: "Café de Loja: guía para empezar",
    excerpt: "Cómo recorrer las cafeterías de especialidad y qué preguntar para elegir tu taza.",
    date: "2026-10-03",
    readMinutes: 3,
    tag: "Café",
    body: [
      { p: "Loja tiene una cultura cafetera que vale la pena recorrer sin apuro. Estas ideas te ayudan a elegir y a disfrutar mejor cada taza." },
      { h: "Pregunta por el origen", p: "En una cafetería de especialidad es normal conversar sobre de dónde viene el grano y cómo se prepara." },
      { h: "Prueba distintos métodos", p: "Un mismo café cambia mucho entre filtrado y espresso. Compararlos es la mejor manera de afinar tu gusto." },
      { h: "Combínalo con algo local", p: "Una humita o un postre de la casa convierten la parada en una pequeña experiencia." },
      { p: "Estamos armando la Ruta del Café de Loja con cafeterías verificadas. Pronto la verás completa en la página temática." },
    ],
  },
  {
    slug: "como-funciona-el-menu-del-dia-por-whatsapp",
    title: "Cómo funciona el menú del día por WhatsApp",
    excerpt: "Para dueños de restaurantes: publica tu menú enviando una nota de voz, sin paneles ni formularios.",
    date: "2026-10-05",
    readMinutes: 3,
    tag: "Negocios",
    body: [
      { p: "Sabemos que en una cocina no hay tiempo para llenar formularios. Por eso el menú del día se publica con un audio." },
      { h: "1. Envía tu nota de voz", p: "Cuéntanos los platos y precios de hoy, como se lo dirías a un cliente." },
      { h: "2. Revisa la vista previa", p: "Te devolvemos por WhatsApp lo que entendimos, para que confirmes o corrijas." },
      { h: "3. Confirma y listo", p: "Con un clic tu menú queda publicado y disponible para las búsquedas por plato y para el Asesor IA." },
      { p: "Sin comisiones de delivery: el cliente te escribe directo. Revisa los planes en la página Para negocios." },
    ],
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);
