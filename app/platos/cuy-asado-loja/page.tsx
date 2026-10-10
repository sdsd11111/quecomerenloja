import type { Metadata } from "next";
import Link from "next/link";
import { Wrap, PageHero } from "@/components/PageHero";
import { listRestaurants } from "@/lib/repository";
import { RestaurantCard } from "@/components/RestaurantCard";

export const metadata: Metadata = {
  title: "Cuy Asado en Loja | Dónde Comer Cuy y Cuánto Cuesta en Loja",
  description:
    "Guía completa del cuy asado en Loja: dónde comerlo, cuánto cuesta, cómo se prepara y cuál es el mejor sector para probar esta delicadeza andina en la Sierra Sur del Ecuador.",
  alternates: { canonical: "/platos/cuy-asado-loja" },
  openGraph: {
    title: "Cuy Asado en Loja | Guía Completa de la Delicadeza Andina",
    description:
      "Dónde comer cuy en Loja: restaurantes, precios ($8 – $14), preparación tradicional al horno y las zonas gastronómicas donde encontrarlo.",
    url: "https://quecomerenloja.com/platos/cuy-asado-loja",
  },
};

const FAQS = [
  {
    q: "¿Dónde comer cuy en Loja?",
    a: "Los mejores locales para comer cuy en Loja se concentran en el sector de El Valle, la vía a Catamayo y los restaurantes tradicionales del centro histórico. Algunos locales también lo preparan bajo pedido (se recomienda llamar con 1-2 horas de anticipación en días de semana, ya que la cocción al horno toma tiempo).",
  },
  {
    q: "¿Cuánto cuesta un plato de cuy en Loja?",
    a: "El cuy asado completo oscila entre $8.00 y $14.00 USD por porción individual, incluyendo las guarniciones tradicionales (papa con cuy en salsa de maní, mote, encurtidos andinos). En algunos restaurantes se vende medio cuy o por porciones desde $5.00.",
  },
  {
    q: "¿Cómo se prepara el cuy asado en Loja?",
    a: "El método más tradicional en la Sierra Sur ecuatoriana es el asado al palo sobre brasas o en horno de leña. El cuy se adobe previamente con ajo, comino, sal y ají, se ensarta en una caña y se gira lentamente sobre el fuego durante 45-60 minutos. Resulta en una piel dorada y crocante con carne jugosa y de sabor intenso.",
  },
  {
    q: "¿Es difícil encontrar cuy en Loja todos los días?",
    a: "No es tan difícil si se va a los restaurantes especializados del sector El Valle o los asaderos de la vía a Catamayo. En el centro histórico, algunos locales tradicionales lo preparan bajo pedido o los fines de semana. Se recomienda confirmar disponibilidad por WhatsApp antes de ir.",
  },
];

export const dynamic = "force-dynamic";

export default async function CuyAsadoLoja() {
  const all = await listRestaurants();
  const places = all.filter(
    (r) =>
      r.keywords.toLowerCase().includes("cuy") ||
      r.category === "tradicional" ||
      r.category === "alta"
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Recipe",
        name: "Cuy Asado Lojano Tradicional",
        headline: "La delicadeza andina más buscada por turistas en Loja",
        description:
          "Cuy asado al palo o al horno de leña, adobado con especias andinas, servido con papas en salsa de maní y mote.",
        recipeCuisine: "Lojana / Ecuatoriana / Andina",
        recipeCategory: "Platos típicos / Carnes",
        keywords: "cuy en loja, cuy asado loja, dónde comer cuy loja, comida típica loja",
        recipeIngredient: [
          "Cuy entero limpio",
          "Ajo machacado y sal en grano",
          "Comino y ají andino",
          "Papas con salsa de maní para acompañar",
          "Mote cocido",
          "Encurtidos de cebolla y ají",
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
        eyebrow="800 BÚSQUEDAS/MES · DELICADEZA ANDINA DE LOJA"
        title={
          <>
            Cuy Asado en Loja:{" "}
            <em className="font-serif italic font-normal text-[#e1b45f]">
              La experiencia gastronómica que los turistas buscan.
            </em>
          </>
        }
      >
        Asado lentamente al palo sobre brasas o en horno de leña, con piel dorada
        y crocante. El cuy en Loja es una experiencia gastronómica andina que los
        visitantes buscan activamente: descubre dónde comerlo, su precio real y la
        mejor zona de la ciudad para encontrarlo.
      </PageHero>

      {/* Breadcrumb */}
      <Wrap className="py-4 text-xs text-muted">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link href="/" className="hover:underline">Inicio</Link></li>
            <li>/</li>
            <li><Link href="/almuerzos-loja" className="hover:underline">Almuerzos en Loja</Link></li>
            <li>/</li>
            <li className="font-semibold text-ink">Cuy Asado en Loja</li>
          </ol>
        </nav>
      </Wrap>

      {/* Descripción + Ficha */}
      <section className="bg-paper py-10">
        <Wrap className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">
              CULTURA GASTRONÓMICA ANDINA
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              El cuy: patrimonio gastronómico vivo de los Andes
            </h2>
            <p className="mt-4 text-sm text-muted leading-relaxed">
              El cuy (Cavia porcellus) es el animal doméstico más antiguo de los
              Andes, criado por las culturas precolombinas durante más de 5.000 años
              como fuente de proteína de alta calidad. En Loja, la tradición del cuy
              asado se mantiene viva en los restaurantes del sector El Valle y los
              asaderos de la vía a Catamayo.
            </p>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              Para turistas nacionales e internacionales que visitan Loja, el cuy
              es frecuentemente la primera experiencia gastronómica andina auténtica.
              La carne es magra, de sabor intenso y textura similar a la del conejo.
              La piel dorada y crocante —el mejor bocado según los locales— se logra
              con el fuego lento y la paciencia del asador tradicional.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold">
              <span className="rounded-lg bg-[#faeed8] px-3.5 py-2 text-[#7d501b]">🔥 Asado al palo o leña</span>
              <span className="rounded-lg bg-[#f0ebd9] px-3.5 py-2 text-[#684b35]">🥔 Papa con salsa de maní</span>
              <span className="rounded-lg bg-[#e4edd8] px-3.5 py-2 text-[#3b5e27]">🌶️ Encurtidos andinos</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e8dfcf] bg-[#fdf9f0] p-6 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-ink">Ficha del Cuy Asado</h3>
            <ul className="mt-4 space-y-3 text-xs">
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Método de cocción:</span>
                <strong className="text-ink">Al palo / Horno de leña</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Adobo tradicional:</span>
                <strong className="text-ink">Ajo, comino y ají andino</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Guarnición estrella:</span>
                <strong className="text-ink">Papa en salsa de maní tostado</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Zonas recomendadas:</span>
                <strong className="text-ink">El Valle, Vía Catamayo, Centro</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Disponibilidad:</span>
                <strong className="text-ink">Fines de semana / Bajo pedido</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Precio promedio:</span>
                <strong className="text-clay">$8.00 – $14.00 por plato</strong>
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
                RESTAURANTES Y ASADEROS
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
                Dónde Comer Cuy en Loja
              </h2>
              <p className="mt-2 text-sm text-muted">
                Locales que preparan cuy auténtico al fuego con receta tradicional.
              </p>
            </div>
            <Link href="/almuerzos-loja" className="text-sm font-bold text-clay hover:underline">
              Ver guía de almuerzos en Loja →
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
              GUÍA DEL VISITANTE
            </span>
            <h2 className="text-center text-3xl font-bold tracking-tight text-ink">
              Preguntas Frecuentes sobre el Cuy en Loja
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

      {/* CTA Hub & Spoke doble — almuerzo y cena */}
      <Wrap className="py-14 text-center">
        <div className="rounded-2xl bg-[#39502f] p-8 text-white md:p-12">
          <h3 className="font-serif text-2xl md:text-3xl font-bold">
            Loja tiene mucho más para ofrecer
          </h3>
          <p className="mx-auto mt-3 max-w-md text-xs md:text-sm text-[#e0ebda]">
            El cuy es solo el comienzo. Descubre la cecina a la brasa, el repe lojano
            y las opciones de comida nocturna en la ciudad.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/almuerzos-loja"
              className="rounded-lg bg-white px-5 py-3 text-xs font-bold text-[#39502f] hover:bg-[#f3f7f1] transition"
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
              href="/platos/cecina-lojana"
              className="rounded-lg border border-white/40 px-5 py-3 text-xs font-bold hover:bg-white/10 transition"
            >
              Ver Cecina Lojana →
            </Link>
          </div>
        </div>
      </Wrap>
    </>
  );
}
