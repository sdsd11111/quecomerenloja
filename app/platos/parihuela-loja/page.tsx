import type { Metadata } from "next";
import Link from "next/link";
import { Wrap, PageHero } from "@/components/PageHero";
import { listRestaurants } from "@/lib/repository";
import { RestaurantCard } from "@/components/RestaurantCard";

export const metadata: Metadata = {
  title: "Parihuela en Loja | Dónde Comer Sopa de Mariscos en Loja Ecuador",
  description:
    "Guía de la Parihuela en Loja: caldo de mariscos con camarón, calamar y mejillón, aromatizado con ají amarillo y limón. Los mejores locales donde pedirla en la ciudad.",
  alternates: { canonical: "/platos/parihuela-loja" },
  openGraph: {
    title: "Parihuela en Loja: Dónde Comer Sopa de Mariscos",
    description:
      "Descubre dónde comer parihuela en Loja: restaurantes con mariscos frescos, precios y horarios.",
    url: "https://quecomerenloja.com/platos/parihuela-loja",
  },
};

const FAQS = [
  {
    q: "¿Qué es la parihuela y por qué se consigue en Loja?",
    a: "La parihuela es un caldo peruano-ecuatoriano de mariscos (camarón, calamar, mejillón, concha) cocinados en un caldo concentrado con ají amarillo, culantro, limón y tomate. Aunque Loja no tiene costa, los restaurantes de mariscos traen producto fresco de Machala, Puerto Bolívar o Guayaquil en transporte refrigerado, y la parihuela se ha convertido en un plato muy solicitado en la ciudad.",
  },
  {
    q: "¿Cuánto cuesta la parihuela en Loja?",
    a: "El precio varía según el tamaño y el tipo de mariscos incluidos. Una porción individual oscila entre $6.00 y $10.00 USD. Las versiones con langostino entero o concha pueden costar hasta $14.00 USD. Los restaurantes marinos del sector de la Av. Orillas del Zamora ofrecen las mejores relaciones calidad-precio.",
  },
  {
    q: "¿En qué horario se sirve la parihuela en Loja?",
    a: "La mayoría de restaurantes de mariscos en Loja abren al mediodía (12:00 – 15:30) y en las noches (18:00 – 22:00). Para el almuerzo existe la opción del menú del día con sopa de mariscos. En las noches se puede pedir a la carta con mejores opciones.",
  },
  {
    q: "¿Es fresca la parihuela en Loja o es congelada?",
    a: "Varía por local. Los restaurantes más reconocidos reciben envíos de marisco refrigerado (no congelado) cada 2-3 días desde la costa ecuatoriana. Para saber si el producto del día es fresco, lo ideal es preguntar directamente o visitar en los días de mayor rotación (viernes y sábado), cuando el volumen de clientes garantiza mayor frescura.",
  },
];

export const dynamic = "force-dynamic";

export default async function ParihulaLoja() {
  const all = await listRestaurants();
  const places = all.filter(
    (r) =>
      r.keywords.toLowerCase().includes("marisco") ||
      r.keywords.toLowerCase().includes("parihuela") ||
      r.keywords.toLowerCase().includes("camarón") ||
      r.category === "alta"
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Recipe",
        name: "Parihuela de Mariscos en Loja",
        headline: "Sopa de mariscos peruano-ecuatoriana en Loja",
        description:
          "Caldo concentrado de camarón, calamar y mejillón aromatizado con ají amarillo, culantro y limón.",
        recipeCuisine: "Peruana / Ecuatoriana",
        recipeCategory: "Sopas / Mariscos",
        keywords: "parihuela loja, sopa mariscos loja, mariscos en loja, restaurantes mariscos loja",
        recipeIngredient: [
          "Camarones frescos con cáscara",
          "Calamar en anillas",
          "Mejillones o conchas negras",
          "Ají amarillo o ají rocoto",
          "Culantro (cilantro) fresco",
          "Tomate, cebolla y ajo",
          "Caldo de mariscos concentrado",
          "Limón y ají molido para servir",
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
        eyebrow="400 BÚSQUEDAS/MES · MARISCOS EN LOJA ECUADOR"
        title={
          <>
            Parihuela en Loja:{" "}
            <em className="font-serif italic font-normal text-[#e1b45f]">
              El caldo de mariscos que Loja adoptó como propio.
            </em>
          </>
        }
      >
        Caldo concentrado de camarón, calamar y mejillón, aromatizado con ají
        amarillo y limón fresco. La parihuela llegó de la costa y se quedó en los
        mejores restaurantes de Loja: descubre dónde comerla, cuánto cuesta y
        cuándo vas a encontrar el producto más fresco.
      </PageHero>

      {/* Breadcrumb */}
      <Wrap className="py-4 text-xs text-muted">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link href="/" className="hover:underline">Inicio</Link></li>
            <li>/</li>
            <li><Link href="/almuerzos-loja" className="hover:underline">Almuerzos en Loja</Link></li>
            <li>/</li>
            <li className="font-semibold text-ink">Parihuela en Loja</li>
          </ol>
        </nav>
      </Wrap>

      {/* Descripción + Ficha */}
      <section className="bg-paper py-10">
        <Wrap className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">
              COSTA EN LA SIERRA
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              La parihuela: el sabor del mar que llegó a Loja
            </h2>
            <p className="mt-4 text-sm text-muted leading-relaxed">
              Loja está a casi 200 km de la costa, pero el caldo de mariscos lleva
              décadas siendo parte de su escena gastronómica. La migración y el
              comercio trajeron las recetas costeñas y los restaurantes lojanos las
              adaptaron con los ingredientes de la Sierra Sur: ají andino, culantro
              local y limones de los valles de Malacatos.
            </p>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              La parihuela se distingue de un simple caldo de mariscos por la
              concentración de sabor: el caldo se prepara con cáscaras y cabezas
              de camarón sofritas con ají y tomate, luego se cuela y se añaden los
              mariscos frescos para cocinarlos apenas lo justo. El resultado es un
              caldo rojizo, aromático y profundo que se complementa con arroz
              blanco y patacones de plátano.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold">
              <span className="rounded-lg bg-[#fde8d8] px-3.5 py-2 text-[#8d3921]">🦐 Camarón y calamar frescos</span>
              <span className="rounded-lg bg-[#fdf5d5] px-3.5 py-2 text-[#7b6515]">🌶️ Ají amarillo rocoto</span>
              <span className="rounded-lg bg-[#e4edd8] px-3.5 py-2 text-[#3b5e27]">🍋 Limón lojano y culantro</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e8dfcf] bg-[#fdf9f0] p-6 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-ink">Ficha de la Parihuela</h3>
            <ul className="mt-4 space-y-3 text-xs">
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Tipo de plato:</span>
                <strong className="text-ink">Sopa / Caldo de mariscos</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Mariscos principales:</span>
                <strong className="text-ink">Camarón, calamar, mejillón</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Caldo base:</span>
                <strong className="text-ink">Bisque de cáscaras de camarón</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Acompañantes:</span>
                <strong className="text-ink">Arroz blanco y patacones</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Mejor momento:</span>
                <strong className="text-ink">Almuerzo y cena (viernes-sábado)</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Precio promedio:</span>
                <strong className="text-clay">$6.00 – $10.00 por porción</strong>
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
                RESTAURANTES DE MARISCOS
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
                Dónde Comer Parihuela en Loja
              </h2>
              <p className="mt-2 text-sm text-muted">
                Restaurantes en Loja que reciben marisco fresco y preparan parihuela bajo pedido.
              </p>
            </div>
            <Link href="/comida-rapida-loja" className="text-sm font-bold text-clay hover:underline">
              Ver opciones para la noche →
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
              GUÍA PRÁCTICA
            </span>
            <h2 className="text-center text-3xl font-bold tracking-tight text-ink">
              Preguntas Frecuentes sobre la Parihuela en Loja
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

      {/* CTA Hub & Spoke — almuerzo + cena */}
      <Wrap className="py-14 text-center">
        <div className="rounded-2xl bg-clay p-8 text-white md:p-12">
          <h3 className="font-serif text-2xl md:text-3xl font-bold">
            ¿Explorando la gastronomía de Loja?
          </h3>
          <p className="mx-auto mt-3 max-w-md text-xs md:text-sm text-[#f5dfd9]">
            La parihuela es solo uno de los sabores que Loja tiene para ti.
            Descubre los platos típicos lojanos y las mejores opciones para
            almorzar y cenar en la ciudad.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/almuerzos-loja"
              className="rounded-lg bg-white px-5 py-3 text-xs font-bold text-clay hover:bg-[#fff6f2] transition"
            >
              Guía de Almuerzos en Loja →
            </Link>
            <Link
              href="/comida-rapida-loja"
              className="rounded-lg border border-white/40 px-5 py-3 text-xs font-bold hover:bg-white/10 transition"
            >
              Dónde Cenar en Loja →
            </Link>
            <Link
              href="/platos/cuy-asado-loja"
              className="rounded-lg border border-white/40 px-5 py-3 text-xs font-bold hover:bg-white/10 transition"
            >
              Cuy Asado en Loja →
            </Link>
          </div>
        </div>
      </Wrap>
    </>
  );
}
