import type { Metadata } from "next";
import Link from "next/link";
import { Wrap, PageHero } from "@/components/PageHero";
import { listRestaurants } from "@/lib/repository";
import { RestaurantCard } from "@/components/RestaurantCard";

export const metadata: Metadata = {
  title: "Humitas de Loja | Dónde Comer Humitas Tradicionales en Loja Ecuador",
  description:
    "Las humitas lojanas son un desayuno clásico de choclo tierno con quesillo artesanal derretido, cocidas al vapor en sus pancas. Guía de dónde comerlas en el centro histórico de Loja.",
  alternates: { canonical: "/platos/humitas-loja" },
  openGraph: {
    title: "Humitas de Loja: Dónde Comer el Clásico Desayuno de Choclo",
    description:
      "Choclo tierno molido con quesillo lojano derretido, cocidas en sus pancas. Descubre las mejores humitas en el centro de Loja.",
    url: "https://quecomerenloja.com/platos/humitas-loja",
  },
};

const FAQS = [
  {
    q: "¿Qué son las humitas lojanas?",
    a: "Las humitas son una preparación andina elaborada con choclo (maíz tierno) fresco molido en piedra o licuadora, mezclado con quesillo fresco, mantequilla y una pizca de sal o azúcar según el gusto. La masa se envuelve en las propias pancas del choclo y se cocina al vapor hasta que queda suave y ligeramente firme. En Loja se sirven calientes en el desayuno.",
  },
  {
    q: "¿Cuál es la diferencia entre humita y tamal en Loja?",
    a: "La humita se hace con choclo (maíz tierno fresco), tiene una textura húmeda y suave y es de sabor neutro con quesillo. El tamal lojano se hace con masa de maíz seco (mote) remojado y molido, tiene relleno de carne de pollo o cerdo con condumio, y se envuelve en hoja de achira. Ambos se cocinan al vapor y se consumen en el desayuno.",
  },
  {
    q: "¿A qué hora se consiguen humitas en Loja?",
    a: "Las humitas son un producto mañanero. Los puestos y panaderías tradicionales las tienen listas desde las 07:00 AM. Para las 10:00 AM suelen ya agotarse en los puestos del mercado y la calle. Lo mejor es ir temprano al Mercado Centro Comercial o los locales de la Calle Lourdes.",
  },
  {
    q: "¿Cuánto cuesta una humita en Loja?",
    a: "Una humita individual cuesta entre $0.75 y $1.25 USD. Generalmente se venden por pares o junto a una taza de café de altura para hacer el desayuno completo por $2.00 a $2.50 USD.",
  },
];

export const dynamic = "force-dynamic";

export default async function HumitasLojaPage() {
  const all = await listRestaurants();
  const places = all.filter(
    (r) =>
      r.keywords.toLowerCase().includes("humita") ||
      r.keywords.toLowerCase().includes("tamal") ||
      r.category === "cafe"
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Recipe",
        name: "Humitas Lojanas Tradicionales",
        headline: "Clásico desayuno lojano de choclo con quesillo",
        description:
          "Choclo tierno molido mezclado con quesillo artesanal y cocinado al vapor en pancas de choclo.",
        recipeCuisine: "Lojana / Ecuatoriana / Andina",
        recipeCategory: "Desayunos tradicionales",
        keywords: "humitas loja, humitas ecuatorianas, desayuno loja, choclo con quesillo",
        recipeIngredient: [
          "Choclo tierno desgranado (2 mazorcas grandes)",
          "Quesillo lojano fresco desmenuzado",
          "Mantequilla sin sal",
          "Sal al gusto",
          "Pancas de choclo para envolver",
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
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
        eyebrow="DESAYUNO TRADICIONAL · CHOCLO Y QUESILLO LOJANO"
        title={
          <>
            Humitas de Loja:{" "}
            <em className="font-serif italic font-normal text-[#e1b45f]">
              El sabor del maíz tierno cada mañana.
            </em>
          </>
        }
      >
        Choclo fresco molido con abundante quesillo artesanal lojano derretido,
        cocinado al vapor en sus propias pancas. La humita es el desayuno del
        campo lojano que llega todos los días al centro histórico.
      </PageHero>

      {/* Breadcrumb */}
      <Wrap className="py-4 text-xs text-muted">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link href="/" className="hover:underline">Inicio</Link></li>
            <li>/</li>
            <li><Link href="/desayunos-en-loja" className="hover:underline">Desayunos en Loja</Link></li>
            <li>/</li>
            <li className="font-semibold text-ink">Humitas de Loja</li>
          </ol>
        </nav>
      </Wrap>

      {/* Descripción + Ficha */}
      <section className="bg-paper py-10">
        <Wrap className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">
              DEL CAMPO A LA CIUDAD
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              La humita: maíz tierno y quesillo, el desayuno más puro de Loja
            </h2>
            <p className="mt-4 text-sm text-muted leading-relaxed">
              En los valles subtropicales que rodean Loja —Malacatos, Vilcabamba,
              Quinara— el choclo crece con una dulzura especial gracias al microclima
              andino. Las humitas que llegan al centro de la ciudad cada madrugada
              se preparan en las madrugadas del campo con recetas que no han cambiado
              en generaciones.
            </p>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              El secreto está en moler el choclo fresco (no seco) en piedra o
              en molino artesanal, añadir el quesillo sin pasteurizar de las
              haciendas lojanas y cocinarlas al vapor envueltas en sus propias
              pancas verdes. El vapor genera ese ambiente húmedo perfecto que
              mantiene la textura esponjosa característica. Son el acompañante
              ideal del{" "}
              <strong>
                <Link href="/cafe-de-loja" className="text-clay underline font-semibold">
                  café de altura lojano
                </Link>
              </strong>
              .
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold">
              <span className="rounded-lg bg-[#fdf5d5] px-3.5 py-2 text-[#7b6515]">🌽 Choclo tierno fresco</span>
              <span className="rounded-lg bg-[#f0ebd9] px-3.5 py-2 text-[#684b35]">🧀 Quesillo artesanal derretido</span>
              <span className="rounded-lg bg-[#e4edd8] px-3.5 py-2 text-[#3b5e27]">♨️ Cocción al vapor</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e8dfcf] bg-[#fdf9f0] p-6 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-ink">Ficha de la Humita</h3>
            <ul className="mt-4 space-y-3 text-xs">
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Base principal:</span>
                <strong className="text-ink">Choclo tierno (maíz fresco)</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Relleno clásico:</span>
                <strong className="text-ink">Quesillo artesanal lojano</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Método de cocción:</span>
                <strong className="text-ink">Vapor en pancas de choclo</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Sabor:</span>
                <strong className="text-ink">Neutro-salado con lácteo</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Momento ideal:</span>
                <strong className="text-ink">Desayuno (07:00 – 10:00)</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Precio unitario:</span>
                <strong className="text-clay">$0.75 – $1.25 c/u</strong>
              </li>
            </ul>
          </div>
        </Wrap>
      </section>

      {/* Dónde comer */}
      <section className="bg-[#f5eddc] py-14">
        <Wrap>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">
                PUESTOS Y CAFETERÍAS
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
                Dónde Encontrar Humitas en Loja
              </h2>
              <p className="mt-2 text-sm text-muted">
                Puestos del mercado y cafeterías que las tienen frescas cada mañana.
              </p>
            </div>
            <Link href="/desayunos-en-loja" className="text-sm font-bold text-clay hover:underline">
              Ver guía de desayunos →
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {places.map((r) => (
              <RestaurantCard key={r.slug} r={r} />
            ))}
          </div>
        </Wrap>
      </section>

      {/* FAQs */}
      <section className="bg-paper py-16 border-t border-line">
        <Wrap>
          <div className="mx-auto max-w-3xl">
            <span className="block text-center text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">
              DUDAS FRECUENTES
            </span>
            <h2 className="text-center text-3xl font-bold tracking-tight text-ink">
              Preguntas sobre las Humitas de Loja
            </h2>
            <div className="mt-10 space-y-4">
              {FAQS.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-[#e5dcce] bg-white p-5 shadow-sm transition open:shadow-md"
                >
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

      {/* CTA Hub & Spoke */}
      <Wrap className="py-14 text-center">
        <div className="rounded-2xl bg-clay p-8 text-white md:p-12">
          <h3 className="font-serif text-2xl md:text-3xl font-bold">
            ¿Desayunando en Loja? Hay más opciones.
          </h3>
          <p className="mx-auto mt-3 max-w-md text-xs md:text-sm text-[#f5dfd9]">
            Completa tu mañana lojana con tamales en hoja de achira, café de altura
            y las mejores cafeterías del centro histórico.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/desayunos-en-loja"
              className="rounded-lg bg-white px-5 py-3 text-xs font-bold text-clay hover:bg-[#fff6f2] transition"
            >
              Ruta de Desayunos en Loja →
            </Link>
            <Link
              href="/platos/tamales-lojanos"
              className="rounded-lg border border-white/40 px-5 py-3 text-xs font-bold hover:bg-white/10 transition"
            >
              Ver Tamales Lojanos →
            </Link>
          </div>
        </div>
      </Wrap>
    </>
  );
}
