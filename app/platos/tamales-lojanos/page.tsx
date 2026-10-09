import type { Metadata } from "next";
import Link from "next/link";
import { Wrap, PageHero } from "@/components/PageHero";
import { listRestaurants } from "@/lib/repository";
import { RestaurantCard } from "@/components/RestaurantCard";

export const metadata: Metadata = {
  title: "Tamales y Humitas en Loja | La Casa del Tamal Lojano y Cafeterías",
  description: "Descubre los mejores tamales lojanos y humitas tradicionales. Masa de maíz criollo envuelta en achira, rellenos de pollo o queso, acompañados de café de altura.",
  alternates: {
    canonical: "/platos/tamales-lojanos",
  },
  openGraph: {
    title: "Tamales Lojanos y Humitas: Desayunos y Tradición de Loja",
    description: "Guía de tamales lojanos y la famosa casa de la humita y el tamal en Loja (+900% crecimiento). Dónde desayunar con café lojano.",
    url: "https://quecomerenloja.com/platos/tamales-lojanos",
  },
};

const TAMAL_FAQS = [
  {
    q: "¿Qué hace especial al tamal lojano frente a otros tamales de Ecuador?",
    a: "El tamal lojano se elabora con maíz criollo seco remojado y molido finamente, cocido con manteca y caldo de pollo para lograr una masa sumamente suave y esponjosa. Va envuelto exclusivamente en hoja de achira (que le confiere su aroma andino inconfundible) y lleva un generoso condumio de pollo o cerdo con huevo duro y pimiento.",
  },
  {
    q: "¿Cuál es la diferencia entre un tamal y una humita?",
    a: "El tamal lojano se hace con masa cocida de maíz seco y lleva relleno de carne (generalmente pollo sazonado), envuelto en hoja de achira. La humita se elabora con choclo tierno (maíz fresco dulce) molido con abundante quesillo y mantequilla, y se envuelve en las hojas tiernas de la propia mazorca de choclo.",
  },
  {
    q: "¿A qué hora se acostumbra comer tamales en Loja?",
    a: "Son el alimento rey del desayuno lojano (desde las 6:30 AM) y también de las meriendas de la tarde (el tradicional 'café de las 5'). Siempre se acompañan de una taza humeante de café filtrado lojano de especialidad.",
  },
  {
    q: "¿Dónde encontrar tamales y humitas en Loja?",
    a: "En locales emblemáticos dedicados exclusivamente a esta tradición (como la famosa Casa de la Humita y el Tamal Lojano, Tamalería Lojana, El Palacio del Tamal) y en las acogedoras cafeterías de la tradicional Calle Lourdes y el centro histórico.",
  },
];

export const dynamic = "force-dynamic";

export default async function TamalesLojanosPage() {
  const all = await listRestaurants();
  const tamalPlaces = all.filter(
    (r) =>
      r.dish.toLowerCase().includes("tamal") ||
      r.dish.toLowerCase().includes("humita") ||
      r.keywords.toLowerCase().includes("humita") ||
      r.keywords.toLowerCase().includes("tamal") ||
      r.category === "cafe"
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Recipe",
        "name": "Tamal Lojano Tradicional en Hoja de Achira",
        "headline": "El bocado mañanero por excelencia de Loja",
        "description": "Tamal andino suave a base de masa de maíz sazonada, relleno de pollo y envuelto en hoja de achira.",
        "recipeCuisine": "Lojana / Ecuatoriana",
        "recipeCategory": "Desayunos / Tradición",
        "keywords": "tamales lojanos, humitas loja, casa del tamal lojano, desayuno lojano",
        "recipeIngredient": [
          "Harina o masa de maíz criollo cocida",
          "Caldo de pollo concentrado",
          "Condumio de pollo desmechado con achiote y cebolla",
          "Huevo duro en rodajas",
          "Hojas de achira frescas lavadas",
          "Café de Loja para servir",
        ],
      },
      {
        "@type": "FAQPage",
        "mainEntity": TAMAL_FAQS.map((f) => ({
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
        eyebrow="+900% CRECIMIENTO · DESAYUNOS & MERIENDAS DE LOJA"
        title={
          <>
            Tamales Lojanos & Humitas: <em className="font-serif italic font-normal text-[#e1b45f]">El aroma inconfundible de la achira.</em>
          </>
        }
      >
        La tradición mañanera más buscada en Loja. Conoce las huecas más populares, la historia de la hoja de achira y dónde pedir un tamal caliente con café de altura.
      </PageHero>

      {/* Breadcrumb SEO */}
      <Wrap className="py-4 text-xs text-muted">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:underline">Inicio</Link></li>
            <li>/</li>
            <li><Link href="/restaurantes" className="hover:underline">Dónde Comer</Link></li>
            <li>/</li>
            <li className="font-semibold text-ink">Tamales y Humitas</li>
          </ol>
        </nav>
      </Wrap>

      {/* Origen y Ficha */}
      <section className="bg-paper py-10">
        <Wrap className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">EXPLOSIÓN DE DEMANDA (+900%)</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              La Casa de la Humita y el Tamal Lojano
            </h2>
            <p className="mt-4 text-sm text-muted leading-relaxed">
              Las búsquedas sobre <em>"la casa de la humita y el tamal lojano"</em> y <em>"tamales lojanos"</em> han crecido más de un <strong>+900%</strong> en Google este año. Y no es coincidencia: tanto lojanos como viajeros consideran el desayuno con tamal caliente y café de filtro un ritual sagrado de hospitalidad andina.
            </p>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              La cocción lenta al vapor dentro de las hojas de achira transmite notas herbales únicas a la masa que ningún molde moderno puede igualar. Es la compañía ideal para una mañana fresca en la centinela del sur.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold">
              <span className="rounded-lg bg-[#faeed8] px-3.5 py-2 text-[#7d501b]">🍃 Envuelto en hoja de achira</span>
              <span className="rounded-lg bg-[#f0ebd9] px-3.5 py-2 text-[#684b35]">☕ Maridaje con café de especialidad</span>
              <span className="rounded-lg bg-[#e4edd8] px-3.5 py-2 text-[#3b5e27]">🧀 Humitas con queso criollo</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e8dfcf] bg-[#fdf9f0] p-6 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-ink">Ficha de Tamales y Humitas</h3>
            <ul className="mt-4 space-y-3 text-xs">
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">El Tamal:</span>
                <strong className="text-ink">Maíz seco, pollo, hoja de achira</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">La Humita:</span>
                <strong className="text-ink">Choclo tierno dulce, queso, hoja de maíz</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Horario típico:</span>
                <strong className="text-ink">Desayuno (7-10 AM) / Tarde (4-7 PM)</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Acompañamiento:</span>
                <strong className="text-ink">Café de Loja pasado</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Puntos clave:</span>
                <strong className="text-ink">Calle Lourdes, San Sebastián, Centro</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Precio estimado:</span>
                <strong className="text-clay">$1.25 – $2.00 por unidad</strong>
              </li>
            </ul>
          </div>
        </Wrap>
      </section>

      {/* Dónde comer tamales y humitas */}
      <section className="bg-[#f5eddc] py-14">
        <Wrap>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">CAFETERÍAS & HUECAS</span>
              <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
                Dónde Comer Tamales y Humitas Hoy
              </h2>
              <p className="mt-2 text-sm text-muted">
                Cafeterías y locales tradicionales en Loja con tamales frescos y humitas recién salidas de la vaporera.
              </p>
            </div>
            <Link href="/cafe-de-loja" className="text-sm font-bold text-clay hover:underline">
              Ver cafeterías y desayunos →
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tamalPlaces.map((r) => (
              <RestaurantCard key={r.slug} r={r} />
            ))}
          </div>
        </Wrap>
      </section>

      {/* FAQs Tamales */}
      <section className="bg-paper py-16 border-t border-line">
        <Wrap>
          <div className="mx-auto max-w-3xl">
            <span className="block text-center text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">PREGUNTAS FRECUENTES</span>
            <h2 className="text-center text-3xl font-bold tracking-tight text-ink">
              Preguntas Frecuentes sobre Tamales y Humitas
            </h2>
            <div className="mt-10 space-y-4">
              {TAMAL_FAQS.map((f) => (
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
        </Wrap>
      </section>

      {/* CTA Café */}
      <Wrap className="py-14 text-center">
        <div className="rounded-2xl bg-[#8c5123] p-8 text-white md:p-12">
          <h3 className="font-serif text-2xl md:text-3xl font-bold">¿Buscas el mejor café para acompañar tu tamal?</h3>
          <p className="mx-auto mt-3 max-w-md text-xs md:text-sm text-[#f9ebd9]">
            Visita nuestra guía de cafeterías de especialidad y café de altura premiado internacionalmente en Loja.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/cafe-de-loja" className="rounded-lg bg-white px-5 py-3 text-xs font-bold text-[#8c5123] hover:bg-[#fff7f0] transition">
              Guía de Cafeterías en Loja →
            </Link>
          </div>
        </div>
      </Wrap>
    </>
  );
}
