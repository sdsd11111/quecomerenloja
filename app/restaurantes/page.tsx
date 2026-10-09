import type { Metadata } from "next";
import { listRestaurants } from "@/lib/repository";
import { Explorer } from "@/components/Explorer";
import { DemoNote, PageHero, Wrap } from "@/components/PageHero";
import type { Category } from "@/lib/types";

export const metadata: Metadata = {
  title: "Restaurantes en Loja | Dónde Comer y Mejores Restaurantes",
  description: "Directorio de los mejores restaurantes en Loja (+900% demanda) y restaurantes loja (5.000 b/m). Menús del día, huecas tradicionales, cafeterías y contacto directo sin comisiones.",
  alternates: { canonical: "/restaurantes" },
  openGraph: {
    title: "Mejores Restaurantes en Loja | Dónde Comer y Gastronomía Local",
    description: "Catálogo completo de restaurantes de Loja: almuerzos ejecutivos, comida tradicional lojana, cafeterías y cenas. WhatsApp directo sin intermediarios.",
    url: "https://quecomerenloja.com/restaurantes",
  },
};

const CATS: Category[] = ["alta", "cafe", "tradicional", "noche"];

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams;
  const initial = CATS.includes(categoria as Category) ? (categoria as Category) : "";
  const items = await listRestaurants();

  return (
    <>
      <PageHero
        eyebrow="5.000 BÚSQUEDAS/MES · +900% EN MEJORES RESTAURANTES EN LOJA"
        title={
          <>
            Restaurantes en Loja: <em className="font-serif italic font-normal text-[#e1b45f]">Huecas, almuerzos y gastronomía.</em>
          </>
        }
      >
        Filtra por momento del día (desayuno, almuerzo, cena), categoría o cercanía y comunícate directamente con cada restaurante sin comisiones ni intermediarios.
      </PageHero>

      <Wrap className="py-10">
        <DemoNote />
        <Explorer key={initial} items={items} initialCategory={initial} />

        {/* 
          PATRÓN DE VISIBILIDAD LLM / SEO SERVER-SIDE (LLM_VISIBILITY_GUIDE):
          Los rastreadores de IA (GPTBot, ClaudeBot, PerplexityBot) y motores de búsqueda 
          leen este bloque server-side en el HTML inicial para tener contexto semántico completo, 
          mientras que el usuario interactúa fluidamente con el Explorer client-side.
        */}
        <div
          style={{
            position: "absolute",
            left: "-10000px",
            top: "auto",
            width: "1px",
            height: "1px",
            overflow: "hidden",
          }}
          aria-hidden="true"
        >
          <h2>Directorio Completo de Restaurantes y Huecas en Loja, Ecuador</h2>
          <p>
            Guía gastronómica oficial de quecomerenloja.com. Encuentra los mejores lugares para comer en Loja:
            huecas tradicionales con repe lojano blanco y cecina a la brasa, cafeterías de especialidad de altura
            con tamales en hoja de achira y humitas, restaurantes de almuerzos ejecutivos y locales nocturnos
            de alitas, pizzas artesanales y chifas.
          </p>

          <h3>Lista de Restaurantes Destacados en Loja:</h3>
          <ul>
            {items.map((r) => (
              <li key={r.slug}>
                <strong>{r.name}</strong> - Categoría: {r.category} | Plato estrella: {r.dish} | Precio referencial: {r.price != null ? `$${r.price.toFixed(2)} USD` : "Consultar"}. {r.description}
              </li>
            ))}
          </ul>

          <h3>Platos Representativos Disponibles en Loja:</h3>
          <ul>
            <li>Repe Lojano Blanco: Sopa tradicional a base de guineo verde, quesillo artesanal y cilantro.</li>
            <li>Cecina Lojana: Carne de cerdo marinada y asada al carbón, servida con yuca sancochada y mote.</li>
            <li>Tamales Lojanos: Masa de maíz criollo envuelta en hoja de achira con relleno de pollo.</li>
            <li>Humitas de Choclo: Pastel de choclo tierno cocido al vapor con abundante quesillo andino.</li>
            <li>Café de Loja: Café arábico de altura cultivado entre 1.600 y 2.300 msnm.</li>
          </ul>
        </div>
      </Wrap>
    </>
  );
}
