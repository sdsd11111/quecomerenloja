import type { Metadata } from "next";
import Link from "next/link";
import { Wrap, PageHero } from "@/components/PageHero";
import { listByCategory } from "@/lib/repository";
import { RestaurantCard } from "@/components/RestaurantCard";

export const metadata: Metadata = {
  title: "Comida Rápida en Loja | Alitas, Pizzas y Hamburguesas",
  description: "Guía de comida rápida en Loja: alitas crocantes (+900% en tendencia), pizzerías artesanales al horno de leña, hamburguesas smash y piqueos nocturnos.",
  alternates: {
    canonical: "/comida-rapida-loja",
  },
  openGraph: {
    title: "Comida Rápida en Loja: Alitas, Pizzas y Hamburguesas",
    description: "Encuentra dónde comer alitas en Loja (+900% crecimiento), pizzas y hamburguesas. Contacto directo y entrega sin comisiones.",
    url: "https://quecomerenloja.com/comida-rapida-loja",
  },
};

const FAST_FOOD_TOPICS = [
  "🍗 Alitas Loja (+900% tendencia · $0.58 CPC)",
  "🍕 Pizzas en Loja (500 b/m · $0.54 CPC)",
  "🍔 Hamburguesas Loja (500 b/m · $0.71 CPC)",
  "🍟 Piqueos y comida nocturna",
  "🥢 Chifas tradicionales (CPC $0.94)",
];

const FAST_FOOD_FAQS = [
  {
    q: "¿Por qué las alitas son tan populares hoy en Loja?",
    a: "Las búsquedas de 'alitas loja' han crecido más de un +900% según datos de Google, impulsadas por locales locales que ofrecen promociones de alitas con salsas artesanales (maracuyá, BBQ picante, miel y mostaza, búfalo) ideales para salidas juveniles y cenas de amigos.",
  },
  {
    q: "¿Dónde encontrar las mejores pizzas en Loja?",
    a: "Loja cuenta con excelentes pizzerías artesanales que hornean a la leña, especialmente en los sectores de San Sebastián, El Valle y avenidas principales. La masa madre y los quesos andinos de la provincia le dan un toque crujiente único.",
  },
  {
    q: "¿Qué tipo de hamburguesas se comen en Loja?",
    a: "La tendencia se divide entre las tradicionales hamburguesas callejeras con huevo frito y abundante salsa, y la nueva ola de smash burgers artesanales con carne de res local de primera calidad y pan brioche.",
  },
];

export const dynamic = "force-dynamic";

export default async function ComidaRapidaPage() {
  const nightPlaces = await listByCategory("noche");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": "Comida Rápida en Loja: Alitas, Pizzas y Hamburguesas",
        "description": "Directorio y guía de alitas, pizzerías y hamburgueserías en Loja, Ecuador.",
        "url": "https://quecomerenloja.com/comida-rapida-loja",
      },
      {
        "@type": "FAQPage",
        "mainEntity": FAST_FOOD_FAQS.map((f) => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="+900% EN ALITAS · 1.500 BÚSQUEDAS/MES COMBINADAS"
        title={
          <>
            Comida Rápida en Loja: <em className="font-serif italic font-normal text-[#e1b45f]">Alitas, Pizzas y Hamburguesas.</em>
          </>
        }
      >
        La guía para las noches y fines de semana en Loja. Descubre las mejores alitas con salsas caseras, pizzas crocantes al horno y hamburguesas artesanales sin intermediarios.
      </PageHero>

      {/* Breadcrumb SEO */}
      <Wrap className="py-4 text-xs text-muted">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:underline">Inicio</Link></li>
            <li>/</li>
            <li><Link href="/restaurantes" className="hover:underline">Dónde Comer</Link></li>
            <li>/</li>
            <li className="font-semibold text-ink">Comida Rápida en Loja</li>
          </ol>
        </nav>
      </Wrap>

      <Wrap className="py-10">
        <div className="mb-8 flex flex-wrap gap-2">
          {FAST_FOOD_TOPICS.map((t) => (
            <span key={t} className="rounded-full border border-[#e2d5c3] bg-white px-4 py-1.5 text-xs font-medium text-[#6d604d] shadow-sm">
              {t}
            </span>
          ))}
        </div>

        {/* Bloque de Tendencias Reales */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-[#e5dcd0] bg-white p-6 shadow-sm">
            <span className="text-3xl">🍗</span>
            <div className="mt-2 flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-ink">Alitas Loja</h3>
              <span className="rounded-full bg-[#fcedeb] px-2 py-0.5 text-[10px] font-bold text-[#b52a1d]">+900% YoY</span>
            </div>
            <p className="mt-3 text-xs text-muted leading-relaxed">
              La comida nocturna con mayor crecimiento del año en Loja. Variedad de salsas, combos para grupos y promociones universitarias.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5dcd0] bg-white p-6 shadow-sm">
            <span className="text-3xl">🍕</span>
            <div className="mt-2 flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-ink">Pizzas en Loja</h3>
              <span className="rounded-full bg-[#faeed8] px-2 py-0.5 text-[10px] font-bold text-[#7d501b]">500 b/m</span>
            </div>
            <p className="mt-3 text-xs text-muted leading-relaxed">
              Pizzerías al horno de leña, masas maduradas lentamente e ingredientes de la campiña lojana.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5dcd0] bg-white p-6 shadow-sm">
            <span className="text-3xl">🍔</span>
            <div className="mt-2 flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-ink">Hamburguesas</h3>
              <span className="rounded-full bg-[#eef3e9] px-2 py-0.5 text-[10px] font-bold text-[#355621]">500 b/m</span>
            </div>
            <p className="mt-3 text-xs text-muted leading-relaxed">
              Desde las clásicas burgers tradicionales de plaza hasta propuestas smash con queso fundido y papas rústicas.
            </p>
          </div>
        </div>

        {/* Directorio de locales de noche y comida rápida */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">LOCALES NOCTURNOS</span>
            <h2 className="text-3xl font-bold tracking-tight text-ink">
              Dónde Comer Comida Rápida y Piqueos en Loja
            </h2>
          </div>
          <Link href="/restaurantes" className="text-xs font-bold text-clay hover:underline">
            Ver todos los restaurantes →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {nightPlaces.map((r) => <RestaurantCard key={r.slug} r={r} />)}
        </div>

        {/* FAQs */}
        <div className="mt-16 border-t border-line pt-12">
          <div className="mx-auto max-w-3xl">
            <span className="block text-center text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">PREGUNTAS FRECUENTES</span>
            <h2 className="text-center text-3xl font-bold tracking-tight text-ink">
              Preguntas sobre Comida Rápida en Loja
            </h2>
            <div className="mt-8 space-y-4">
              {FAST_FOOD_FAQS.map((f) => (
                <details key={f.q} className="group rounded-xl border border-[#e5dcce] bg-white p-5 shadow-sm transition open:shadow-md">
                  <summary className="flex cursor-pointer items-center justify-between font-serif text-base font-semibold text-ink">
                    <span>{f.q}</span>
                    <span className="ml-4 text-clay transition-transform group-open:rotate-180">▾</span>
                  </summary>
                  <p className="mt-3 text-xs leading-relaxed text-muted border-t border-[#f2ede4] pt-3">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </Wrap>
    </>
  );
}
