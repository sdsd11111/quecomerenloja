import type { Metadata } from "next";
import Link from "next/link";
import { listByCategory } from "@/lib/repository";
import { RestaurantCard } from "@/components/RestaurantCard";
import { DemoNote, PageHero, Wrap } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Cafeterías en Loja y Desayunos | Café de Especialidad y Tertulia",
  description: "Guía de cafeterías en Loja y lugares para desayunar (+900% demanda): café de altura premiado, tamales lojanos, humitas, quimbolitos y brunch en el centro histórico.",
  alternates: { canonical: "/cafe-de-loja" },
  openGraph: {
    title: "Cafeterías en Loja y Dónde Desayunar: Café de Especialidad",
    description: "Encuentra las mejores cafeterías de Loja: café de altura, tamales, humitas y desayunos típicos sin intermediarios.",
    url: "https://quecomerenloja.com/cafe-de-loja",
  },
};

const TOPICS = [
  "☕ Cafeterías en Loja (500 b/m)",
  "🍳 Desayunos en Loja (+900%)",
  "🌽 Tamales y Humitas (+900%)",
  "🌱 Café de especialidad de altura",
  "📍 Calle Lourdes y Centro Histórico",
  "💻 Cafés con Wi-Fi para trabajar",
];

const CAFE_FAQS = [
  {
    q: "¿Por qué el café de Loja es tan reconocido a nivel mundial?",
    a: "Loja cuenta con microclimas andinos únicos y alturas que van de los 1.600 a 2.300 msnm en valles como Puyango, Chanchape, Malacatos y Vilcabamba. Esto permite cosechar cafés arábicos de especialidad con notas florales, cítricas y achocolatadas que ganan premios internacionales de Taza de Excelencia.",
  },
  {
    q: "¿Dónde están las mejores cafeterías en el centro de Loja?",
    a: "La emblemática Calle Lourdes es el epicentro de la cultura cafetera colonial de Loja, con pintorescas fachadas patrimoniales. También en los alrededores de la Plaza Central, la Puerta de la Ciudad y el barrio San Sebastián se concentran las mejores barras de café filtrado.",
  },
  {
    q: "¿Qué pedir de desayuno típico lojano en una cafetería?",
    a: "El desayuno insigne incluye café lojano de especialidad recién pasado (prensa francesa, V60 o gota a gota tradicional), acompañado de un tamal lojano caliente en hoja de achira, una humita con abundante quesillo y huevos al gusto.",
  },
];

export const dynamic = "force-dynamic";

export default async function Page() {
  const cafes = await listByCategory("cafe");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": "Cafeterías en Loja y Dónde Desayunar",
        "description": "Ruta y directorio de cafeterías de especialidad y desayunos en Loja, Ecuador.",
        "url": "https://quecomerenloja.com/cafe-de-loja",
      },
      {
        "@type": "FAQPage",
        "mainEntity": CAFE_FAQS.map((f) => ({
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
        eyebrow="500 BÚSQUEDAS/MES · +900% EN DESAYUNOS EN LOJA"
        title={
          <>
            Cafeterías en Loja: <em className="font-serif italic font-normal text-[#e1b45f]">Aroma andino, desayunos y tertulia.</em>
          </>
        }
      >
        La ruta definitiva del café lojano: cafeterías de especialidad de altura, los tradicionales desayunos con tamales en hoja de achira, repostería artesanal y rincones tranquilos en el centro colonial.
      </PageHero>

      {/* Breadcrumb SEO */}
      <Wrap className="py-4 text-xs text-muted">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:underline">Inicio</Link></li>
            <li>/</li>
            <li><Link href="/restaurantes" className="hover:underline">Dónde Comer</Link></li>
            <li>/</li>
            <li className="font-semibold text-ink">Cafeterías y Desayunos</li>
          </ol>
        </nav>
      </Wrap>

      <Wrap className="py-10">
        <div className="mb-8 flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <span key={t} className="rounded-full border border-[#e2d5c3] bg-white px-4 py-1.5 text-xs font-medium text-[#6d604d] shadow-sm">
              {t}
            </span>
          ))}
        </div>

        {/* Bloque explicativo de demanda real */}
        <div className="mb-12 grid gap-8 rounded-2xl border border-[#e8ded0] bg-[#fbf7f1] p-6 md:grid-cols-2 md:p-8">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">CULTURA CAFETALERA</span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink">
              El rito matutino y vespertino del lojano
            </h2>
            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              En Loja, sentarse a tomar un café no es una parada rápida: es un ritual social. Con más de <strong>500 búsquedas mensuales de cafeterías</strong> y un crecimiento del <strong>+900% en búsquedas de desayunos</strong>, los locales de café se han convertido en centros de reunión, teletrabajo y sobremesa.
            </p>
          </div>
          <div className="flex flex-col justify-center rounded-xl bg-white p-6 shadow-sm border border-[#eee2d4]">
            <h3 className="font-serif text-lg font-bold text-ink">¿Qué acompaña a una buena taza?</h3>
            <p className="mt-2 text-xs text-muted">
              Pide un <strong><Link href="/platos/tamales-lojanos" className="text-clay underline font-bold">tamal lojano tradicional (+900% demanda)</Link></strong> o una humita caliente recién salida de la olla con quesillo lojano derretido.
            </p>
            <div className="mt-4">
              <Link href="/platos/tamales-lojanos" className="inline-flex text-xs font-bold text-clay hover:underline">
                Conoce la historia del tamal lojano →
              </Link>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">CAFETERÍAS RECOMENDADAS</span>
            <h2 className="text-3xl font-bold tracking-tight text-ink">
              Dónde Desayunar y Tomar Café en Loja
            </h2>
          </div>
          <Link href="/restaurantes" className="text-xs font-bold text-clay hover:underline">
            Ver todos los locales gastronómicos →
          </Link>
        </div>

        <DemoNote />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cafes.map((r) => <RestaurantCard key={r.slug} r={r} />)}
        </div>

        {/* FAQs */}
        <div className="mt-16 border-t border-line pt-12">
          <div className="mx-auto max-w-3xl">
            <span className="block text-center text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">DUDAS COMUNES</span>
            <h2 className="text-center text-3xl font-bold tracking-tight text-ink">
              Preguntas Frecuentes sobre Cafés y Desayunos en Loja
            </h2>
            <div className="mt-8 space-y-4">
              {CAFE_FAQS.map((f) => (
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

        <p className="mt-14 text-center text-xs text-muted">
          ¿Quieres aprender más sobre el café lojano? Revisa nuestro artículo:{" "}
          <Link href="/blog/cafe-de-loja-guia-para-empezar" className="font-semibold text-clay underline">
            Guía para empezar con el Café de Loja
          </Link>.
        </p>
      </Wrap>
    </>
  );
}
