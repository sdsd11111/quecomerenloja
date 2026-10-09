import type { Metadata } from "next";
import Link from "next/link";
import { Wrap, PageHero } from "@/components/PageHero";
import { listRestaurants } from "@/lib/repository";
import { RestaurantCard } from "@/components/RestaurantCard";

export const metadata: Metadata = {
  title: "Cecina Lojana | Dónde Comer la Auténtica Cecina a la Brasa en Loja",
  description: "Guía completa de la Cecina Lojana: corte tradicional de cerdo, marinado al sol, asado al carbón con yuca y mote. Los mejores restaurantes y asaderos en Loja.",
  alternates: {
    canonical: "/platos/cecina-lojana",
  },
  openGraph: {
    title: "Cecina Lojana: El Asado Tradicional de Loja",
    description: "Conoce el secreto de la cecina lojana asada a la brasa con yuca, mote y curtido de cebolla. Restaurantes recomendados en Loja.",
    url: "https://quecomerenloja.com/platos/cecina-lojana",
  },
};

const CECINA_FAQS = [
  {
    q: "¿Qué es la cecina lojana y cómo se prepara?",
    a: "La cecina lojana es un plato típico preparado con finos filetes de lomo de cerdo (cortados con precisión de bistec muy delgado), marinados con ajo, comino, sal y especias andinas, oreteados al aire o al sol de la mañana y finalmente asados rápidamente al carbón o a la leña.",
  },
  {
    q: "¿Con qué guarniciones se sirve la cecina en Loja?",
    a: "El plato tradicional se sirve acompañado de generosas porciones de yuca cocida tierna, mote recién cocido, curtido de cebolla colorada con tomate y cilantro, y una porción de ají lojano molido con queso o pepa de zambo.",
  },
  {
    q: "¿Cuál es el mejor momento para comer cecina lojana?",
    a: "Es el plato fuerte por excelencia para el almuerzo y los fines de semana. Frecuentemente se pide después de una entrada de repe blanco lojano para una experiencia culinaria 100% auténtica.",
  },
  {
    q: "¿Dónde comer la mejor cecina lojana?",
    a: "El sector del Valle de Catamayo y los asaderos tradicionales de la vía a Vilcabamba y el centro de Loja son mundialmente famosos por sus asados de cecina jugosa y dorada al fuego de leña.",
  },
];

export const dynamic = "force-dynamic";

export default async function CecinaLojanaPage() {
  const all = await listRestaurants();
  const cecinaPlaces = all.filter(
    (r) =>
      r.dish.toLowerCase().includes("cecina") ||
      r.keywords.toLowerCase().includes("cecina") ||
      r.category === "tradicional"
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Recipe",
        "name": "Cecina Lojana Tradicional a la Brasa",
        "headline": "El asado insignia de Loja y Catamayo",
        "description": "Carne de cerdo finamente fileteada, marinada y asada al carbón acompañada de yuca, mote y ají.",
        "recipeCuisine": "Lojana / Ecuatoriana",
        "recipeCategory": "Platos fuertes / Asados",
        "keywords": "cecina lojana, cecina asada, comida tipica loja, asados en loja",
        "recipeIngredient": [
          "Filetes delgados de pierna o lomo de cerdo",
          "Ajo machacado, comino y sal en grano",
          "Yuca cocida suave",
          "Mote cocido caliente",
          "Curtido de cebolla colorada y tomate",
          "Ají de pepa lojano",
        ],
      },
      {
        "@type": "FAQPage",
        "mainEntity": CECINA_FAQS.map((f) => ({
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
        eyebrow="500 BÚSQUEDAS/MES · ASADO TRADICIONAL LOJANO"
        title={
          <>
            Cecina Lojana: <em className="font-serif italic font-normal text-[#e1b45f]">El sabor de la brasa y la leña.</em>
          </>
        }
      >
        Delgados filetes de cerdo asados al carbón con yuca tierna y mote caliente. Conoce su tradición y los mejores lugares para saborearla en Loja y sus alrededores.
      </PageHero>

      {/* Breadcrumb SEO */}
      <Wrap className="py-4 text-xs text-muted">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:underline">Inicio</Link></li>
            <li>/</li>
            <li><Link href="/restaurantes" className="hover:underline">Dónde Comer</Link></li>
            <li>/</li>
            <li className="font-semibold text-ink">Cecina Lojana</li>
          </ol>
        </nav>
      </Wrap>

      {/* Origen y Ficha */}
      <section className="bg-paper py-10">
        <Wrap className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">TRADICIÓN GASTRONÓMICA</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              El secreto de una auténtica Cecina Lojana
            </h2>
            <p className="mt-4 text-sm text-muted leading-relaxed">
              La cecina lojana no es carne seca ni deshidratada dura: es un arte de corte milimétrico en sábana donde la carne de cerdo absorbe el aliño casero antes de recibir el golpe de calor directo sobre las brasas de carbón vegetal.
            </p>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              En cada bocado se siente el toque ahumado característico, que equilibra a la perfección con la suavidad de la yuca lojana recién sancochada y la frescura del curtido de cebolla colorada. Para la experiencia completa, un plato de <strong><Link href="/platos/repe-lojano" className="text-clay underline font-semibold">repe lojano</Link></strong> de entrada es la combinación obligatoria.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold">
              <span className="rounded-lg bg-[#faeed8] px-3.5 py-2 text-[#7d501b]">🔥 Asado rápido al carbón</span>
              <span className="rounded-lg bg-[#f0ebd9] px-3.5 py-2 text-[#684b35]">🥔 Yuca tierna y mote caliente</span>
              <span className="rounded-lg bg-[#e4edd8] px-3.5 py-2 text-[#3b5e27]">🧅 Curtido de cebolla criolla</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#e8dfcf] bg-[#fdf9f0] p-6 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-ink">Ficha de la Cecina</h3>
            <ul className="mt-4 space-y-3 text-xs">
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Corte de carne:</span>
                <strong className="text-ink">Lomo o pierna de cerdo en sábana</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Cocción:</span>
                <strong className="text-ink">Parrilla a la brasa / carbón</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Guarnición reina:</span>
                <strong className="text-ink">Yuca sancochada y mote</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Salsa acompañante:</span>
                <strong className="text-ink">Ají de pepa lojano</strong>
              </li>
              <li className="flex justify-between border-b border-[#f1e6d4] pb-2">
                <span className="text-muted">Zonas famosas:</span>
                <strong className="text-ink">Catamayo, El Valle, Loja Centro</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Precio estimado:</span>
                <strong className="text-clay">$4.50 – $7.50 el plato completo</strong>
              </li>
            </ul>
          </div>
        </Wrap>
      </section>

      {/* Dónde comer Cecina */}
      <section className="bg-[#f5eddc] py-14">
        <Wrap>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">DÓNDE COMER EN LOJA</span>
              <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
                Restaurantes y Asaderos de Cecina
              </h2>
              <p className="mt-2 text-sm text-muted">
                Locales recomendados para probar cecina jugosa y recién salida de la parrilla.
              </p>
            </div>
            <Link href="/restaurantes" className="text-sm font-bold text-clay hover:underline">
              Explorar todos los asaderos →
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cecinaPlaces.map((r) => (
              <RestaurantCard key={r.slug} r={r} />
            ))}
          </div>
        </Wrap>
      </section>

      {/* FAQs Cecina */}
      <section className="bg-paper py-16 border-t border-line">
        <Wrap>
          <div className="mx-auto max-w-3xl">
            <span className="block text-center text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">DUDAS COMUNES</span>
            <h2 className="text-center text-3xl font-bold tracking-tight text-ink">
              Preguntas Frecuentes sobre la Cecina Lojana
            </h2>
            <div className="mt-10 space-y-4">
              {CECINA_FAQS.map((f) => (
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

      {/* Interlinking con Repe */}
      <Wrap className="py-14 text-center">
        <div className="rounded-2xl bg-[#39502f] p-8 text-white md:p-12">
          <h3 className="font-serif text-2xl md:text-3xl font-bold">¿Quieres la dupla gastronómica perfecta?</h3>
          <p className="mx-auto mt-3 max-w-md text-xs md:text-sm text-[#e0ebda]">
            En Loja, la cecina siempre va precedida de un delicioso y cremoso Repe Lojano caliente.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/platos/repe-lojano" className="rounded-lg bg-white px-5 py-3 text-xs font-bold text-[#39502f] hover:bg-[#f3f7f1] transition">
              Ver la guía del Repe Lojano (5K b/m) →
            </Link>
          </div>
        </div>
      </Wrap>
    </>
  );
}
