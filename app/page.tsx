import Link from "next/link";
import { CATEGORIES } from "@/lib/site";
import { POPULAR_DISHES } from "@/lib/data";
import { listRestaurants } from "@/lib/repository";
import { RestaurantCard } from "@/components/RestaurantCard";
import { OpenChatButton } from "@/components/OpenChatButton";
import { DemoNote, Wrap } from "@/components/PageHero";
import { POSTS } from "@/lib/blog";

export const dynamic = "force-dynamic";

const TRADITIONAL_DISHES = [
  {
    name: "Repe Lojano",
    badge: "5.000 búsquedas/mes",
    highlight: "El plato rey de Loja",
    desc: "Sopa cremosa tradicional a base de guineo verde, quesillo lojano fresco y cilantro.",
    href: "/platos/repe-lojano",
    emoji: "🥣",
  },
  {
    name: "Cecina Lojana",
    badge: "500 búsquedas/mes",
    highlight: "Asado tradicional",
    desc: "Finos filetes de carne de cerdo marinados y secados al sol, asados a la brasa con yuca y mote.",
    href: "/platos/cecina-lojana",
    emoji: "🥩",
  },
  {
    name: "Tamales y Humitas",
    badge: "+900% crecimiento",
    highlight: "Sabor mañanero y café",
    desc: "Masa de maíz criollo envuelta en hoja de achira, rellena de pollo o queso con café lojano.",
    href: "/platos/tamales-lojanos",
    emoji: "🌽",
  },
  {
    name: "Arveja con Guineo",
    badge: "Tradición andina",
    highlight: "Cuchara lojana",
    desc: "Guiso espeso tradicional elaborado con arveja seca, guineo verde picado y quesillo artesanal.",
    href: "/buscar?q=arveja",
    emoji: "🍲",
  },
];

const FAQS = [
  {
    q: "¿Qué plato típico no me puedo perder al visitar Loja?",
    a: "El Repe Lojano es el estandarte gastronómico indiscutible (con más de 5.000 búsquedas mensuales). También son imperdibles la cecina lojana a la brasa, los tamales con café de especialidad y la arveja con guineo.",
  },
  {
    q: "¿Dónde encontrar los mejores desayunos y cafeterías en Loja?",
    a: "El centro histórico de Loja y la calle Lourdes albergan excelentes cafeterías de café de especialidad de altura, donde puedes disfrutar de tamales tradicionales recién salidos de la olla, humitas y quimbolitos desde las 7:00 AM.",
  },
  {
    q: "¿Qué opciones de cena y comida rápida son populares en Loja?",
    a: "Para la noche, Loja cuenta con una vibrante oferta de alitas (+900% de tendencia), pizzas artesanales al horno de leña, hamburguesas smash y los tradicionales chifas locales con gran sabor y porciones generosas.",
  },
  {
    q: "¿Cuánto cuesta comer en un restaurante de Loja?",
    a: "Los menús del día y almuerzos ejecutivos en huecas tradicionales oscilan entre $3.00 y $5.00 USD. Para cenas a la carta en restaurantes o cocina de autor, el rango promedio está entre $8.00 y $18.00 USD por persona.",
  },
];

export default async function Home() {
  const featured = (await listRestaurants()).slice(0, 3);

  // Schema.org estructurado para Google (WebSite + ItemList + FAQPage)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://quecomerenloja.com/#website",
        "url": "https://quecomerenloja.com",
        "name": "Qué Comer en Loja",
        "description": "Guía definitiva de restaurantes, huecas tradicionales y gastronomía típica de Loja, Ecuador.",
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
      {/* Marcado Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO SECTION */}
      <section className="andean relative overflow-hidden py-16 text-cream md:py-24">
        <Wrap className="relative grid items-center gap-8 md:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#a17651]/30 px-3.5 py-1.5 text-[11px] font-semibold tracking-wider text-[#e6d7bc]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#deb15e]" /> LOJA, ECUADOR · GUÍA GASTRONÓMICA
            </div>
            <h1 className="max-w-[650px] text-[clamp(40px,5vw,68px)] font-bold tracking-[-2px] leading-[1.08]">
              Dónde comer en Loja: <em className="font-serif font-normal italic text-[#e1b45f]">Restaurantes, Huecas y Platos Típicos.</em>
            </h1>
            <p className="mt-6 max-w-[490px] text-sm leading-[1.85] text-[#dac8b1]">
              La guía local definitiva para descubrir los mejores restaurantes de Loja, el auténtico <strong>repe lojano</strong>, la cecina a la brasa, cafeterías de altura, alitas y chifas sin intermediarios.
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link href="/restaurantes" className="rounded-lg bg-cream px-5 py-3.5 text-[13px] font-bold text-clay transition hover:-translate-y-0.5 shadow-md">
                Explorar mejores restaurantes →
              </Link>
              <Link href="/menu-del-dia" className="rounded-lg border border-[#b99871]/40 px-5 py-3.5 text-[13px] font-bold hover:bg-[#ffffff10] transition">
                Ver menús del día de hoy →
              </Link>
            </div>
            <p className="mt-8 text-[11px] text-[#cdbca7]">🍲 Repe lojano · 🥩 Cecina · ☕ Cafeterías · 🍗 Alitas · 🥢 Chifas</p>
          </div>

          <div className="relative mx-auto grid h-[380px] w-full max-w-[460px] place-items-center md:h-[460px]" aria-hidden>
            <div className="absolute h-[380px] w-[380px] rounded-full border border-[#c7955d]/20 md:h-[450px] md:w-[450px]" />
            <div
              className="relative h-[290px] w-[290px] rotate-[-12deg] rounded-full shadow-[18px_26px_55px_#140a0977,inset_0_0_20px_#fff5d0] md:h-[345px] md:w-[345px]"
              style={{ background: "repeating-radial-gradient(circle,#f3e5c9 0 5px,#ddc9a4 6px 7px,#f1e3c8 8px 17px)" }}
            >
              <div className="absolute inset-9 rounded-full border-2 border-[#d5bc8c] bg-[#f2dfb9]" />
              <div className="absolute left-[14%] top-[19%] h-[36%] w-[36%] rotate-[23deg] rounded-full" style={{ background: "repeating-linear-gradient(24deg,#e9d09d 0 2px,#fff0c6 3px 6px,#e2c894 7px 8px)" }} />
              <div className="absolute right-[12%] top-[31%] h-[43%] w-[38%] rotate-[-24deg] rounded-[35%_45%_28%_40%]" style={{ background: "repeating-linear-gradient(35deg,transparent 0 14px,#45241899 15px 19px,transparent 20px 27px),radial-gradient(ellipse at 35% 30%,#c18047,#914223 65%,#51281d)" }} />
              <div className="absolute bottom-[16%] left-[20%] h-[24%] w-[30%] rounded-full" style={{ background: "radial-gradient(circle at 25% 45%,#c75a31 0 13px,transparent 14px),radial-gradient(circle at 70% 70%,#c74e27 0 15px,transparent 16px),repeating-conic-gradient(from 25deg,#527a3a 0 17deg,#79944c 18deg 33deg,#3e622e 34deg 50deg)" }} />
            </div>
            <div className="absolute bottom-10 left-0 rotate-[-5deg] rounded-xl bg-[#fff7e9] p-4 text-[11px] text-ink shadow-xl">
              <small className="text-muted">REPE LOJANO & CECINA</small>
              <strong className="block font-serif text-xl">5.000 búsquedas/mes</strong>
              <small className="text-muted">La comida más deseada de Loja.</small>
            </div>
            <div className="absolute right-0 top-10 rotate-[5deg] rounded-xl bg-[#dbad59] p-4 text-[11px] text-[#3b2810] shadow-xl">
              <small>GUÍA GASTRONÓMICA LOCAL</small>
              <strong className="block font-serif text-base">Sin intermediarios · 100% Loja</strong>
            </div>
            <span className="absolute bottom-0 right-5 text-[9px] text-[#d4b897]">Sabor auténtico lojano</span>
          </div>
        </Wrap>
      </section>

      {/* 2. BUSCADOR INTELIGENTE CON TAGS BASADOS EN DEMANDA REAL */}
      <Wrap className="relative z-[4] -mt-12">
        <form action="/buscar" role="search" className="flex items-center gap-3.5 rounded-2xl border border-[#e7ddc9] bg-paper px-7 py-5 shadow-[0_14px_40px_#37200b0c]">
          <span aria-hidden className="text-2xl text-clay">⌕</span>
          <label htmlFor="home-q" className="sr-only">Busca un platillo, restaurante o categoría gastronómica</label>
          <input
            id="home-q"
            name="q"
            type="search"
            placeholder="¿Qué quieres comer en Loja? (ej: repe lojano, cecina, chifa, cafeterías, alitas, pizzas...)"
            className="min-w-0 flex-1 bg-transparent py-3 text-[13px] outline-none placeholder:text-[#8a7b69]"
          />
          <button type="submit" className="rounded-lg bg-clay px-6 py-3 text-[13px] font-bold text-white transition hover:bg-[#722d20]">
            Buscar →
          </button>
        </form>
        <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
          <span className="text-[11px] font-medium text-muted">Búsquedas populares:</span>
          {POPULAR_DISHES.map((d) => (
            <Link
              key={d}
              href={`/buscar?q=${encodeURIComponent(d)}`}
              className="rounded-full border border-[#e9dfce] bg-white/70 px-3.5 py-1.5 text-[11px] text-[#6d604d] transition hover:bg-clay hover:text-white"
            >
              {d}
            </Link>
          ))}
        </div>
      </Wrap>

      {/* 3. CATEGORÍAS PRINCIPALES DE BÚSQUEDA */}
      <Wrap className="pb-16 pt-14">
        <div className="mb-6 flex items-center justify-between gap-5">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[2.5px] text-clay">CATEGORÍAS DE DEMANDA</span>
            <h2 className="text-[28px] font-bold tracking-tight">¿Qué se te antoja comer hoy en Loja?</h2>
          </div>
          <p className="hidden text-[12px] text-muted md:block">Huecas tradicionales, cafeterías de altura, comida rápida y chifas.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              href={c.href}
              className={`${c.bg} group relative min-h-[160px] overflow-hidden rounded-[13px] p-5 text-[#fff4e2] transition hover:-translate-y-1 hover:shadow-lg md:min-h-[175px] md:p-6`}
            >
              <div className="flex items-center justify-between">
                <span aria-hidden className="block text-3xl">{c.icon}</span>
                {c.badge && (
                  <span className="rounded-full bg-black/20 px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase text-white/90 backdrop-blur-sm">
                    {c.badge}
                  </span>
                )}
              </div>
              <span className="mt-4 block font-serif text-xl font-semibold">{c.name}</span>
              <span className="mt-1 block text-[10px] opacity-80">{c.sub}</span>
              <span aria-hidden className="absolute bottom-4 right-4 text-lg transition-transform group-hover:translate-x-1">↗</span>
            </Link>
          ))}
        </div>
      </Wrap>

      {/* 4. BLOQUE TRADICIONAL: PLATOS TÍPICOS DE LOJA */}
      <section className="bg-[#fbf7f0] border-y border-[#ede3d1] py-16">
        <Wrap>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-green">TRADICIÓN & SAZÓN LOJANA</span>
              <h2 className="text-[clamp(28px,3.5vw,44px)] font-bold tracking-tight text-ink">
                Los Platos Típicos de Loja que Debes Probar
              </h2>
              <p className="mt-3 max-w-[620px] text-sm text-muted">
                La gastronomía de Loja es única en Ecuador. Desde el emblemático <strong>repe lojano</strong> hasta la cecina ahumada a la leña y los tamales con café de altura.
              </p>
            </div>
            <Link href="/restaurantes?categoria=tradicional" className="text-sm font-bold text-clay hover:underline">
              Ver huecas tradicionales →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRADITIONAL_DISHES.map((dish) => (
              <Link
                key={dish.name}
                href={dish.href}
                className="group flex flex-col justify-between rounded-2xl border border-[#e8ddca] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-clay hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{dish.emoji}</span>
                    <span className="rounded-full bg-[#f4ece1] px-2.5 py-0.5 text-[10px] font-bold text-[#7a4837]">
                      {dish.badge}
                    </span>
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-bold text-ink group-hover:text-clay transition">
                    {dish.name}
                  </h3>
                  <small className="block font-semibold text-[11px] text-green mt-0.5">{dish.highlight}</small>
                  <p className="mt-2.5 text-xs text-muted leading-relaxed">{dish.desc}</p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1 text-[11px] font-bold text-clay group-hover:underline">
                  Buscar dónde comerlo →
                </span>
              </Link>
            ))}
          </div>
        </Wrap>
      </section>

      {/* 5. RESTAURANTES DESTACADOS Y MENÚS DEL DÍA */}
      <section className="bg-[#f5eddc] py-16">
        <Wrap>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-[650px]">
              <span className="mb-2 block text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">MEJORES RESTAURANTES EN LOJA</span>
              <h2 className="text-[clamp(28px,3.5vw,44px)] font-bold tracking-tight text-ink">
                Lugares Recomendados para Comer en Loja
              </h2>
              <p className="mt-3 text-sm text-muted">
                Revisa los restaurantes y huecas disponibles hoy con menú completo, precios y contacto directo sin comisiones.
              </p>
            </div>
            <Link href="/restaurantes" className="text-sm font-bold text-clay hover:underline">
              Explorar todos los restaurantes →
            </Link>
          </div>
          <DemoNote />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((r) => <RestaurantCard key={r.slug} r={r} />)}
          </div>
        </Wrap>
      </section>

      {/* 6. GUÍAS Y BLOG GASTRONÓMICO */}
      <section className="border-t border-line bg-paper py-16">
        <Wrap>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">GUÍAS LOCALES</span>
              <h2 className="text-[28px] font-bold tracking-tight">Artículos y Recomendaciones Gastronómicas</h2>
            </div>
            <Link href="/blog" className="text-sm font-bold text-clay hover:underline">Ver todo el blog →</Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {POSTS.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="rounded-2xl border border-[#e7decc] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
                <span className="text-[10px] font-bold uppercase tracking-widest text-clay">{p.tag}</span>
                <h3 className="mt-2 font-serif text-xl font-bold">{p.title}</h3>
                <p className="mt-2 text-xs text-muted leading-relaxed">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </Wrap>
      </section>

      {/* 7. PREGUNTAS FRECUENTES (SEO FAQ SCHEMA PARA FEATURED SNIPPETS) */}
      <section className="border-t border-line bg-[#f8f3e9] py-16">
        <Wrap>
          <div className="mx-auto max-w-[760px]">
            <div className="text-center">
              <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-clay">PREGUNTAS FRECUENTES</span>
              <h2 className="text-[28px] font-bold tracking-tight text-ink">Preguntas Frecuentes sobre Comer en Loja</h2>
              <p className="mt-2 text-xs text-muted">Todo lo que necesitas saber antes de tu próxima comida o viaje a la ciudad.</p>
            </div>
            <div className="mt-10 space-y-4">
              {FAQS.map((faq) => (
                <details key={faq.q} className="group rounded-xl border border-[#e5dcce] bg-white p-5 shadow-sm transition open:shadow-md">
                  <summary className="flex cursor-pointer items-center justify-between font-serif text-base font-semibold text-ink">
                    <span>{faq.q}</span>
                    <span className="ml-4 text-clay transition-transform group-open:rotate-180">▾</span>
                  </summary>
                  <p className="mt-3 text-xs leading-relaxed text-muted border-t border-[#f2ede4] pt-3">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </Wrap>
      </section>

      {/* 8. ASESOR GASTRONÓMICO IA */}
      <Wrap className="py-16">
        <div className="grid items-center gap-8 rounded-[22px] border border-[#d6ddc7] bg-[#e8ecdd] p-7 md:grid-cols-[1fr_1.2fr] md:gap-16 md:p-14">
          <div className="max-w-[380px] rotate-[-3deg] rounded-2xl border border-[#dfe1d2] bg-paper p-6 shadow-lg md:order-none">
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-green font-serif text-[22px] italic text-white">g</span>
              <div>Tu guía gastronómico personal<small className="block text-[9px] font-normal text-green">Asesor GuIAloja · Loja</small></div>
            </div>
            <div className="ml-6 mt-5 rounded-xl bg-green p-3.5 text-xs text-white">¿Dónde probar el mejor repe lojano? 🥣</div>
            <div className="mt-3 rounded-xl bg-[#f0f1e7] p-3.5 text-xs text-[#526247]">El repe blanco con quesillo es la joya de Loja. En el centro histórico y mercados tradicionales encuentras las recetas más auténticas.</div>
          </div>
          <div>
            <span className="mb-3 block text-[10px] font-extrabold uppercase tracking-[2.8px] text-green">ASISTENTE VIRTUAL</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">¿No sabes qué comer hoy? <em>Te ayudamos.</em></h2>
            <p className="my-5 text-[13px] text-muted leading-relaxed">
              Consulta a nuestro Asesor IA para recomendaciones según tu antojo (repe, cecina, chifa, café de especialidad o alitas) y tu ubicación en Loja.
            </p>
            <OpenChatButton className="rounded-lg bg-green px-5 py-3.5 text-[13px] font-bold text-white shadow hover:bg-[#344b2c] transition">
              Preguntarle al asesor ↗
            </OpenChatButton>
          </div>
        </div>
      </Wrap>
    </>
  );
}
