import Link from "next/link";
import Image from "next/image";
import { Wrap } from "@/components/PageHero";
import { BuscadorHome } from "@/components/BuscadorHome";
import { AliadosMarquee } from "@/components/AliadosMarquee";
import { EventosGastronomicosSection } from "@/components/EventosGastronomicosSection";
import { getAliadosActivos } from "@/lib/aliados-db";

export const dynamic = "force-dynamic";

// 1. PLATO CLÚSTER CON IMÁGENES GASTRONÓMICAS DE FONDO
const TRADITIONAL_DISHES = [
  {
    name: "Repe Lojano",
    badge: "Plato Insignia",
    highlight: "Sopa insignia de Loja",
    desc: "Cremosa sopa tradicional de guineo verde, quesillo artesanal y cilantro.",
    href: "/platos/repe-lojano",
    image: "https://mvps.b-cdn.net/quecomerenloja/home/repe-lojano.webp",
  },
  {
    name: "Cecina Lojana",
    badge: "A la Brasa",
    highlight: "Asado a la brasa",
    desc: "Finos filetes de cerdo aliñados y ahumados con yuca caliente y mote.",
    href: "/platos/cecina-lojana",
    image: "https://mvps.b-cdn.net/quecomerenloja/home/cecina-lojana.webp",
  },
  {
    name: "Tamales y Humitas",
    badge: "Desayuno Típico",
    highlight: "Desayuno y lonche",
    desc: "Maíz criollo envuelto en achira con pollo y café de especialidad.",
    href: "/platos/tamales-lojanos",
    image: "https://mvps.b-cdn.net/quecomerenloja/home/tamales-humitas.webp",
  },
  {
    name: "Arveja con Guineo",
    badge: "Tradición Andina",
    highlight: "Cuchara lojana",
    desc: "Guiso espeso de arveja seca, guineo verde y quesillo desmenuzado.",
    href: "/buscar?q=arveja",
    image: "https://mvps.b-cdn.net/quecomerenloja/home/arveja-guineo.webp",
  },
];

// 2. MOMENTOS DE CONSUMO — Rutas de demanda
const CONSUMPTION_MOMENTS = [
  {
    title: "Café de Especialidad & Desayunos",
    badge: "Mañanas en Loja",
    tagline: "Despierta con aroma lojano",
    desc: "Cafeterías en el centro histórico, tamales mañaneros al vapor, humitas, quimbolitos y café filtrado de altura.",
    href: "/desayunos-en-loja",
    cta: "Explorar cafeterías y desayunos →",
    image: "https://mvps.b-cdn.net/quecomerenloja/home/ruta-desayunos.webp",
    hasParallax: true,
  },
  {
    title: "Almuerzo Ejecutivo & Menú del Día",
    badge: "Almuerzos",
    tagline: "Comer rico, rápido y fresco",
    desc: "Menús ejecutivos y platos del día con sopa tradicional, segundo y jugo fresco entre $3.00 y $5.00 USD.",
    href: "/almuerzos-loja",
    cta: "Ver almuerzos y menú del día →",
    image: "https://mvps.b-cdn.net/quecomerenloja/home/ruta-almuerzos.webp",
    hasParallax: false,
  },
  {
    title: "Alitas, Pizzas, Burgers & Noche",
    badge: "Cenas & Noche",
    tagline: "Sabor nocturno y planes con amigos",
    desc: "Alitas crujientes con salsas artesanales, pizzas a la leña, smash burgers y chifas nocturnos.",
    href: "/comida-rapida-loja",
    cta: "Ver comida rápida y noche →",
    image: "https://mvps.b-cdn.net/quecomerenloja/home/ruta-cenas.webp",
    hasParallax: false,
  },
];

// 3. ESPACIOS DISPONIBLES DE SOCIOS (Monetización B2B)
const COMMERCIAL_SLOTS = [
  {
    id: "slot-1",
    category: "Cafetería & Desayunos",
    title: "Cupo Oficial: Cafetería de Especialidad",
    desc: "Espacio reservado para cafetería de autor o desayunos tradicionales en Loja. Conexión directa a WhatsApp sin intermediarios.",
    status: "Disponible para Socio",
    highlight: "Prioridad en café y desayunos",
    badgeColor: "bg-citrico/30 text-petroleo",
  },
  {
    id: "slot-2",
    category: "Hueca Tradicional & Repe",
    title: "Cupo Oficial: Tradición Lojana",
    desc: "Espacio para restaurante representativo de repe lojano y cecina asada ante miles de turistas que buscan qué comer.",
    status: "Disponible para Socio",
    highlight: "Referente en gastronomía tradicional",
    badgeColor: "bg-citrico/30 text-petroleo",
  },
  {
    id: "slot-3",
    category: "Restaurante Gourmet & Cenas",
    title: "Cupo Oficial: Gastronomía & Noche",
    desc: "Espacio reservado para cocina de autor, carnes o pastas que buscan atraer visitantes de negocios y comensales selectos.",
    status: "Disponible para Socio",
    highlight: "Recomendación destacada en cenas de Loja",
    badgeColor: "bg-citrico/30 text-petroleo",
  },
  {
    id: "slot-4",
    category: "Alitas, Pizzas & Burgers",
    title: "Cupo Oficial: Comida Rápida & Delivery",
    desc: "Espacio reservado para el local de alitas o pizzas más buscado por jóvenes y turistas en Loja.",
    status: "Disponible para Socio",
    highlight: "Alta preferencia en horario nocturno",
    badgeColor: "bg-citrico/30 text-petroleo",
  },
  {
    id: "slot-5",
    category: "Chifas & Cocina Fusión",
    title: "Cupo Oficial: Chifa & Platos Tradicionales",
    desc: "Presencia prioritaria para chifa o cocina fusión con alta preferencia en la ciudad.",
    status: "Disponible para Socio",
    highlight: "Alta concurrencia en almuerzos y cenas familiares",
    badgeColor: "bg-citrico/30 text-petroleo",
  },
];

// FAQ Schema estructurado para Google y LLMs
const FAQS = [
  {
    q: "¿Qué plato típico no me puedo perder al visitar Loja?",
    a: "El Repe Lojano es el estandarte gastronómico indiscutible y sopa insignia de Loja. También son imperdibles la cecina lojana a la brasa, los tamales con café de especialidad y la arveja con guineo.",
  },
  {
    q: "¿Dónde encontrar los mejores desayunos y cafeterías en Loja?",
    a: "El centro histórico de Loja y la calle Lourdes albergan excelentes cafeterías de café de especialidad de altura, donde puedes disfrutar de tamales tradicionales recién salidos de la olla, humitas y quimbolitos desde las 7:00 AM.",
  },
  {
    q: "¿Cuánto cuesta comer en Loja?",
    a: "Los menús del día en huecas tradicionales oscilan entre $3.00 y $5.00 USD. Para desayunos tradicionales con café de altura entre $2.50 y $4.50 USD. Cenas a la carta promedian entre $8.00 y $18.00 USD.",
  },
  {
    q: "¿Cómo puede un restaurante figurar como Socio Verificado en la guía?",
    a: "Los establecimientos gastronómicos pueden postular en la sección Para Negocios para acceder a una membresía anual verificada con enlace directo a WhatsApp y recomendación preferente ante turistas.",
  },
];

export default async function Home() {
  const aliadosReales = await getAliadosActivos();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://quecomerenloja.com/#website",
        "url": "https://quecomerenloja.com",
        "name": "Qué Comer en Loja",
        "description": "Plataforma de posicionamiento gastronómico local: platos típicos, cafeterías, huecas y restaurantes verificados en Loja, Ecuador.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://quecomerenloja.com/buscar?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "FAQPage",
        "mainEntity": FAQS.map((faq) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a,
          },
        })),
      },
    ],
  };

  return (
    <>
      {/* Schema.org JSON-LD para Google y LLMs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ════════════════════════════════════════════════════════════════
          SECCIÓN 1: HERO FULLSCREEN 100% (Móvil y Ordenador)
          Con imagen cinematográfica de restaurante lojano y overlay oscuro
          ════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[100svh] w-full flex flex-col justify-center overflow-hidden py-20 text-cream">
        {/* Imagen de fondo real en alta resolución */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://mvps.b-cdn.net/quecomerenloja/home/hero-home.webp"
            alt="Ambiente gastronómico y restaurantes en Loja Ecuador"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <Wrap className="relative z-10 my-auto py-12">
          <div className="max-w-[820px]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-citrico/30 bg-black/30 backdrop-blur-md px-4 py-1.5 text-[11px] font-semibold tracking-wider text-citrico">
              <span className="h-2 w-2 rounded-full bg-citrico animate-pulse" /> LOJA, ECUADOR · GUÍA GASTRONÓMICA OFICIAL
            </div>

            <h1 className="text-[clamp(42px,5.5vw,76px)] font-bold tracking-[-2.5px] leading-[1.05] text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              Dónde comer en Loja: <em className="font-serif font-normal italic text-citrico drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Platos Típicos, Cafeterías y Restaurantes.</em>
            </h1>

            <p className="mt-6 max-w-[620px] text-base md:text-lg leading-[1.8] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-medium">
              La plataforma de descubrimiento gastronómico de Loja. Encuentra el auténtico <strong>repe lojano</strong>, la cecina a la brasa, los mejores cafés de altura y negocios gastronómicos verificados sin intermediarios.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/restaurantes"
                className="rounded-xl bg-citrico px-7 py-4 text-sm font-extrabold text-petroleo transition hover:brightness-110 hover:-translate-y-0.5 shadow-xl shadow-citrico/10"
              >
                Explorar gastronomía local →
              </Link>
              <Link
                href="/para-negocios"
                className="rounded-xl border border-white/30 bg-white/10 backdrop-blur-md px-7 py-4 text-sm font-bold text-white hover:bg-white/20 transition hover:-translate-y-0.5"
              >
                ¿Tienes un restaurante? Súmate aquí →
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-niebla/80 border-t border-white/15 pt-6">
              <div className="flex items-center gap-2">
                <span className="text-citrico font-bold text-sm">✓ 100%</span>
                <span>sabores auténticos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-citrico font-bold text-sm">✓ 0%</span>
                <span>comisiones a locales</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-citrico font-bold text-sm">✓ Directo</span>
                <span>contacto a WhatsApp</span>
              </div>
            </div>
          </div>
        </Wrap>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          CONECTOR FLOTANTE: BUSCADOR INTELIGENTE (-mt-12)
          Conectado directamente a las páginas de contenido y platos del sitio
          ════════════════════════════════════════════════════════════════ */}
      <Wrap className="relative z-20 -mt-12">
        <BuscadorHome />
      </Wrap>

      {/* ════════════════════════════════════════════════════════════════
          SECCIÓN 2: LOS 4 GRANDES DE LOJA (Platos Típicos Identitarios)
          Con imágenes culinarias reales de fondo en cada card
          ════════════════════════════════════════════════════════════════ */}
      <section className="py-24">
        <Wrap>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo">IDENTIDAD CULINARIA</span>
              <h2 className="text-[clamp(28px,3.5vw,44px)] font-bold tracking-tight text-grafito">
                Los 4 Platos Típicos que Definen a Loja
              </h2>
              <p className="mt-3 max-w-[620px] text-sm text-muted">
                La gastronomía de Loja destaca por su autenticidad. Explora los cuatro platos identitarios con mayor demanda turística.
              </p>
            </div>
            <Link href="/buscar?q=tradicional" className="text-sm font-bold text-petroleo hover:underline">
              Explorar recetas y tradición →
            </Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRADITIONAL_DISHES.map((dish) => (
              <Link
                key={dish.name}
                href={dish.href}
                className="group relative min-h-[380px] flex flex-col justify-end overflow-hidden rounded-2xl p-6 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
              >
                {/* Imagen de fondo real */}
                <Image
                  src={dish.image}
                  alt={`Plato típico lojano: ${dish.name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradiente oscuro profundo para legibilidad perfecta */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10 transition-opacity group-hover:via-black/60" />

                <div className="relative z-10">
                  <div className="inline-flex rounded-full bg-citrico px-3 py-1 text-[10px] font-black uppercase tracking-wider text-petroleo mb-3">
                    {dish.badge}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white transition group-hover:text-citrico">
                    {dish.name}
                  </h3>
                  <small className="block font-semibold text-[11px] text-citrico/90 mt-1">{dish.highlight}</small>
                  <p className="mt-2.5 text-xs text-niebla/90 leading-relaxed line-clamp-3">{dish.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-extrabold text-white group-hover:underline">
                    Ver dónde probarlo en Loja →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECCIÓN 3: MOMENTOS DE CONSUMO (Rutas de Demanda Real)
          Con imagen de fondo del Hero en efecto PARALLAX limpia (sin overlay pesado)
          ════════════════════════════════════════════════════════════════ */}
      <section className="parallax-bg relative overflow-hidden py-28 text-white border-y border-niebla/20">
        <Wrap className="relative z-10">
          <div className="mb-14 text-center max-w-[720px] mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-citrico/30 bg-black/40 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-[2.8px] text-citrico mb-3 backdrop-blur-sm">
              RUTAS GASTRONÓMICAS
            </div>
            <h2 className="text-[clamp(30px,4vw,48px)] font-bold tracking-tight text-white drop-shadow">
              ¿En Qué Momento del Día Estás?
            </h2>
            <div className="mt-4 inline-block rounded-2xl border border-white/20 bg-black/50 px-6 py-3.5 backdrop-blur-md shadow-xl">
              <p className="text-sm md:text-base text-white font-medium leading-relaxed drop-shadow-sm">
                Desde el primer café de altura de la mañana hasta el almuerzo ejecutivo y las cenas nocturnas. Conoce el ritmo gastronómico de Loja.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {CONSUMPTION_MOMENTS.map((moment) => (
              <div
                key={moment.title}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/20 bg-black/40 p-7 backdrop-blur-md shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-citrico hover:bg-black/60"
              >
                <div>
                  {/* Foto miniatura o preview dentro de la card */}
                  <div className="relative mb-6 h-48 w-full overflow-hidden rounded-xl border border-white/10 shadow-inner">
                    <Image
                      src={moment.image}
                      alt={moment.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 rounded-full bg-citrico px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-petroleo">
                      {moment.badge}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-white group-hover:text-citrico transition">
                    {moment.title}
                  </h3>
                  <small className="block font-semibold text-[11px] text-citrico/90 mt-1">{moment.tagline}</small>
                  <p className="mt-3 text-xs leading-relaxed text-niebla/80">{moment.desc}</p>
                </div>

                <div className="mt-7 border-t border-white/10 pt-4">
                  <Link
                    href={moment.href}
                    className="inline-flex items-center text-xs font-bold text-white group-hover:text-citrico transition gap-1 underline underline-offset-4"
                  >
                    {moment.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECCIÓN 3.5: FERIAS Y EVENTOS GASTRONÓMICOS EN LOJA (AGENDA CULTURAL EN VIVO)
          Slider infinito en tiempo real conectado a agendaculturalloja.com
          ════════════════════════════════════════════════════════════════ */}
      <EventosGastronomicosSection />

      {/* ════════════════════════════════════════════════════════════════
          SECCIÓN 4: SELECCIÓN VERIFICADA & CUPOS DE SOCIOS (Monetización)
          Cards en movimiento continuo infinito (Marquee)
          ════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-niebla bg-porcelana py-24 overflow-hidden">
        <Wrap>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-10">
            <div className="max-w-[650px]">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-citrico/30 px-3 py-1 text-[10px] font-extrabold tracking-wider text-petroleo mb-3">
                ★ SELECCIÓN OFICIAL GUIA LOJA
              </div>
              <h2 className="text-[clamp(28px,3.5vw,42px)] font-bold tracking-tight text-grafito">
                Socios Gastronómicos Verificados
              </h2>
              <p className="mt-3 text-sm text-muted">
                Espacios exclusivos para restaurantes y cafeterías recomendadas. Conexión directa al WhatsApp del local, sin intermediarios ni comisiones.
              </p>
            </div>
            <Link
              href="/para-negocios"
              className="inline-flex items-center justify-center rounded-xl bg-petroleo px-6 py-3.5 text-xs font-bold text-white transition hover:bg-[#0E2E2E] shadow-md"
            >
              Postular mi restaurante aquí →
            </Link>
          </div>
        </Wrap>

        {/* CINTA EN MOVIMIENTO CONTINUO (CARRUSEL MARQUEE INFINITO) */}
        <AliadosMarquee
          items={[
            ...aliadosReales,
            ...COMMERCIAL_SLOTS.slice(0, 2),
            ...(aliadosReales.length < 3 ? COMMERCIAL_SLOTS.slice(2, 4) : []),
          ]}
        />

        {/* Banner B2B de Conversión */}
        <Wrap className="mt-12">
          <div className="rounded-2xl bg-petroleo p-8 text-white md:flex md:items-center md:justify-between md:p-10 shadow-xl">
            <div className="max-w-[580px]">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-citrico">PLANES DE MEMBRESÍA LOCAL</span>
              <h3 className="mt-2 text-2xl font-bold font-serif">¿Administras un restaurante, hueca o cafetería en Loja?</h3>
              <p className="mt-2 text-xs text-niebla/80 leading-relaxed">
                Conectamos diariamente a miles de turistas y lojanos que buscan dónde comer. Asegura tu presencia verificada con reserva directa a tu WhatsApp por solo $40 o $60/mes.
              </p>
            </div>
            <div className="mt-6 flex flex-shrink-0 gap-3 md:mt-0">
              <Link
                href="/para-negocios"
                className="rounded-xl bg-citrico px-6 py-3.5 text-xs font-bold text-petroleo transition hover:brightness-110 shadow-md"
              >
                Ver planes y beneficios →
              </Link>
            </div>
          </div>
        </Wrap>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          PREGUNTAS FRECUENTES (SEO FAQ SCHEMA PARA GOOGLE Y LLMs)
          Diseño limpio acordeón optimizado para no recargar visualmente
          ════════════════════════════════════════════════════════════════ */}
      <section className="border-t border-niebla bg-white py-16">
        <Wrap>
          <div className="mx-auto max-w-[760px]">
            <details className="group rounded-2xl border border-niebla bg-porcelana/30 p-6 transition open:bg-white open:shadow-md">
              <summary className="flex cursor-pointer items-center justify-between font-serif text-lg font-bold text-grafito">
                <div className="flex items-center gap-3">
                  <span className="text-petroleo font-sans text-xs font-extrabold tracking-widest uppercase">FAQ</span>
                  <span>Preguntas Frecuentes sobre Dónde Comer en Loja</span>
                </div>
                <span className="text-petroleo transition-transform group-open:rotate-180 text-xl font-bold">▾</span>
              </summary>

              <div className="mt-6 space-y-4 border-t border-niebla/50 pt-4">
                {FAQS.map((faq) => (
                  <div key={faq.q} className="rounded-xl border border-niebla/40 bg-white p-4">
                    <h4 className="font-serif text-sm font-bold text-grafito">{faq.q}</h4>
                    <p className="mt-2 text-xs leading-relaxed text-muted">{faq.a}</p>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </Wrap>
      </section>
    </>
  );
}
