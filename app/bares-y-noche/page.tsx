import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Wrap } from "@/components/PageHero";
import { PlazasDisponiblesPlato } from "@/components/PlatoTemplateSections";
import { MapaLeafletLoja } from "@/components/MapaLeafletLoja";

export const metadata: Metadata = {
  title: "Bares en Loja | Vida Nocturna, Picadas y Tragos — Guía 2026",
  description:
    "Guía completa de bares en Loja Ecuador: vida nocturna, cantinas, bares de tragos, picadas nocturnas y los mejores lugares para salir de noche en Loja 2026.",
  alternates: { canonical: "/bares-y-noche" },
  openGraph: {
    title: "Bares en Loja y Vida Nocturna 2026 | Qué Comer en Loja",
    description:
      "Descubre los mejores bares de Loja, picadas nocturnas, tragos artesanales y la vida nocturna de la Centinela del Sur. Guía verificada con contacto directo.",
    url: "https://quecomerenloja.com/bares-y-noche",
    images: [
      {
        url: "/bares-loja-noche.jpg",
        width: 1200,
        height: 630,
        alt: "Bares y vida nocturna en Loja Ecuador",
      },
    ],
  },
};

const BARES_FAQS = [
  {
    q: "¿Cuáles son los mejores bares en Loja?",
    a: "Loja cuenta con una escena nocturna activa especialmente en el centro histórico y la zona universitaria. Los bares más concurridos ofrecen cocteles artesanales, música en vivo (boleros, jazz, rock) y picadas. La zona de la Calle Lourdes y aledaños es el epicentro de la vida nocturna cultural de la ciudad.",
  },
  {
    q: "¿A qué hora empieza la vida nocturna en Loja?",
    a: "Los bares de Loja comienzan a animarse desde las 8 PM. El pico de actividad es entre las 9 PM y 1 AM los fines de semana (viernes y sábado). Algunos bares culturales abren desde las 6 PM para el 'after office' con picadas y cocteles.",
  },
  {
    q: "¿Qué tragos son típicos en los bares de Loja?",
    a: "Además de los cocteles internacionales, en Loja es popular el trago con puntas (aguardiente de caña lojano), el canelazo caliente para las noches frías de la sierra, el cóctel de mora con puntas y el vino de uvilla. Las cervezas artesanales locales también están en auge.",
  },
  {
    q: "¿Hay bares con música en vivo en Loja?",
    a: "Sí, varios bares de Loja tienen música en vivo los fines de semana: jazz, boleros, trova, rock en español y música nacional. Algunos cafés culturales también organizan noches de micrófono abierto y conciertos íntimos durante la semana.",
  },
  {
    q: "¿Qué picadas se sirven en los bares de Loja?",
    a: "Las picadas más comunes en bares lojanos incluyen: alitas BBQ, papas fritas con ají, chifles con guacamole, empanadas de morocho, mini-cecinitas y tablas de embutidos artesanales. Muchos bares combinan la experiencia gastronómica con el entretenimiento nocturno.",
  },
];

const ZONAS_NOCHE = [
  {
    zona: "Centro Histórico",
    desc: "La zona más animada con bares culturales, cafés nocturnos y musica en vivo. Alrededor del Parque Central y Calle Bolivar.",
    icono: "🏛️",
    image: "https://mvps.b-cdn.net/quecomerenloja/bares-noche/centro-historico.webp",
    destacado: ["Bares culturales", "Música en vivo", "Cocteles artesanales"],
  },
  {
    zona: "Zona Universitaria",
    desc: "Picadas y bares con precios accesibles cerca de la UTPL y la Universidad Nacional de Loja. Alta concurrencia estudiantil.",
    icono: "🎓",
    image: "https://mvps.b-cdn.net/quecomerenloja/bares-noche/zona-universitaria.webp",
    destacado: ["Precios accesibles", "Ambiente joven", "Karaoke & DJ"],
  },
  {
    zona: "Av. Universitaria / Gran Colombia",
    desc: "Bares y lounges modernos con buena coctelería y ambiente más tranquilo. Ideal para grupos y reuniones de trabajo.",
    icono: "🍸",
    image: "https://mvps.b-cdn.net/quecomerenloja/bares-noche/av-universitaria.webp",
    destacado: ["Cocteles premium", "Ambiente lounge", "Picadas gourmet"],
  },
];

export default function BaresYNochePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://quecomerenloja.com/bares-y-noche",
        name: "Bares en Loja y Vida Nocturna 2026",
        description:
          "Guía de bares, picadas nocturnas y vida nocturna de Loja Ecuador.",
        url: "https://quecomerenloja.com/bares-y-noche",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Inicio",
              item: "https://quecomerenloja.com",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Bares y Noche en Loja",
              item: "https://quecomerenloja.com/bares-y-noche",
            },
          ],
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: BARES_FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
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

      {/* ── 1. HERO ── */}
      <section className="relative min-h-[70vh] flex flex-col justify-end overflow-hidden pb-10 pt-20 bg-[#0d1117]">
        {/* Imagen de fondo real en alta resolución */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://mvps.b-cdn.net/quecomerenloja/bares-noche/hero-bares.webp"
            alt="Bares y vida nocturna en Loja Ecuador"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/60 to-black/40" />
        </div>

        <Wrap className="relative z-10 w-full">
          <div className="max-w-[700px] rounded-3xl bg-white/10 p-6 md:p-8 backdrop-blur-md shadow-2xl border border-white/20">
            <span className="inline-block rounded-full bg-[#e1b45f]/30 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#e1b45f] mb-2.5">
              VIDA NOCTURNA · BARES EN LOJA
            </span>

            <h1 className="text-[clamp(30px,4vw,50px)] font-bold tracking-tight text-white leading-[1.1]">
              Bares y Noche en Loja:{" "}
              <em className="font-serif italic font-normal text-[#e1b45f]">
                La ciudad que nunca duerme del todo.
              </em>
            </h1>

            <p className="mt-3 text-xs md:text-sm text-white/70 leading-relaxed">
              Descubre los mejores bares, picadas nocturnas, tragos artesanales
              y la vibra única de la vida nocturna de Loja — la Centinela del
              Sur que también sabe celebrar.
            </p>

            <div className="mt-5 flex items-center gap-3 flex-wrap">
              <Link
                href="/comida-rapida-loja"
                className="rounded-xl bg-[#e1b45f] px-4 py-2.5 text-xs font-bold text-[#0d1117] hover:brightness-110 transition shadow-sm"
              >
                🍔 Comida Rápida en Loja
              </Link>
              <Link
                href="/restaurantes"
                className="rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition"
              >
                Restaurantes →
              </Link>
            </div>
          </div>
        </Wrap>
      </section>

      {/* Breadcrumb SEO */}
      <div className="border-b border-niebla bg-white">
        <Wrap className="py-3 text-xs text-muted">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 flex-wrap">
              <li>
                <Link href="/" className="hover:underline">
                  Inicio
                </Link>
              </li>
              <li>/</li>
              <li className="font-semibold text-petroleo">
                Bares y Vida Nocturna en Loja
              </li>
            </ol>
          </nav>
        </Wrap>
      </div>

      {/* ── 2. ZONAS DE VIDA NOCTURNA ── */}
      <section className="bg-porcelana py-16 border-b border-niebla">
        <Wrap>
          <div className="text-center mb-10">
            <span className="inline-block rounded-full bg-citrico/30 px-3 py-1 text-[10px] font-extrabold tracking-wider text-petroleo uppercase mb-3">
              ZONAS VERIFICADAS
            </span>
            <p className="text-xs md:text-sm text-muted max-w-2xl mx-auto">
              Loja tiene varias zonas con vida nocturna activa. Cada una con su
              propio estilo, precios y público. Aquí las 3 principales:
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {ZONAS_NOCHE.map((zona) => (
              <div
                key={zona.zona}
                className="group overflow-hidden rounded-3xl border border-niebla bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-porcelana">
                    <Image
                      src={zona.image}
                      alt={zona.zona}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-4 text-2xl drop-shadow-md">
                      {zona.icono}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-grafito text-lg group-hover:text-petroleo transition-colors">
                      {zona.zona}
                    </h3>
                    <p className="mt-2 text-xs text-muted leading-relaxed">
                      {zona.desc}
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-0">
                  <div className="flex flex-wrap gap-2">
                    {zona.destacado.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-niebla px-2.5 py-1 text-[10px] font-semibold text-petroleo bg-porcelana"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── 3. DATOS SEO: QUÉ ENCONTRAR EN LA NOCHE LOJANA ── */}
      <section className="bg-white py-16 border-b border-niebla">
        <Wrap className="grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[2.8px] text-petroleo">
              EXPERIENCIA NOCTURNA
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-grafito md:text-4xl">
              La Noche Lojana: Entre Tradición y Modernidad
            </h2>
            <p className="mt-4 text-xs md:text-sm text-muted leading-relaxed">
              Loja sorprende a los visitantes con una vida nocturna auténtica
              que mezcla lo tradicional con lo moderno. Desde cantinas de toda
              la vida donde se sirve puntas con limón, hasta bares de cocteles
              craft con música en vivo de jazz y trova.
            </p>
            <p className="mt-3 text-xs md:text-sm text-muted leading-relaxed">
              La temperatura fresca de la sierra (13–18°C en la noche) invita a
              los canelazos calientes y a las picadas reconfortantes. Una noche
              en Loja siempre termina con buenas conversaciones.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold">
              <span className="rounded-xl border border-niebla bg-porcelana px-3.5 py-2 text-petroleo shadow-2xs">
                🥃 Tragos artesanales
              </span>
              <span className="rounded-xl border border-niebla bg-porcelana px-3.5 py-2 text-petroleo shadow-2xs">
                🎵 Música en vivo
              </span>
              <span className="rounded-xl border border-niebla bg-porcelana px-3.5 py-2 text-petroleo shadow-2xs">
                🍗 Picadas nocturnas
              </span>
              <span className="rounded-xl border border-niebla bg-porcelana px-3.5 py-2 text-petroleo shadow-2xs">
                ☕ Canelazo caliente
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-niebla bg-white shadow-sm">
            <div className="relative h-64 w-full">
              <Image
                src="https://mvps.b-cdn.net/quecomerenloja/bares-noche/canelazo-puntas.webp"
                alt="Canelazo caliente con puntas lojano"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-center"
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-petroleo/90 px-3 py-1 text-[10px] font-bold text-white shadow backdrop-blur-xs">
                ☕ Canelazo con Puntas Artesanal
              </span>
            </div>
            <div className="p-6">
              <span className="text-[10px] font-extrabold tracking-widest text-muted uppercase">
                DATOS DE LA NOCHE LOJANA
              </span>
              <h3 className="font-serif text-xl font-bold text-grafito mt-1">
                Qué esperar
              </h3>
            <ul className="mt-5 space-y-3.5 text-xs">
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Horario pico:</span>
                <strong className="text-petroleo font-bold">
                  Vie–Sáb 9 PM – 1 AM
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Temperatura nocturna:</span>
                <strong className="text-grafito font-semibold">
                  13 – 18°C (abrigo recomendado)
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Trago típico:</span>
                <strong className="text-grafito font-semibold">
                  Canelazo / Puntas con limón
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Picada estrella:</span>
                <strong className="text-grafito font-semibold">
                  Alitas BBQ, cecinitas, chifles
                </strong>
              </li>
              <li className="flex justify-between border-b border-niebla/60 pb-2.5">
                <span className="text-muted">Precio copa/trago:</span>
                <strong className="text-petroleo font-bold">$2 – $6</strong>
              </li>
              <li className="flex justify-between">
                <span className="text-muted">Música típica:</span>
                <strong className="text-grafito font-semibold">
                  Rock, boleros, cumbia, trova
                </strong>
              </li>
            </ul>
            </div>
          </div>
        </Wrap>
      </section>

      {/* ── 4. PLAZAS DISPONIBLES PARA BARES ALIADOS ── */}
      <PlazasDisponiblesPlato
        nombrePlato="Bares y Vida Nocturna en Loja"
        horarioRecomendado="08:00 PM – 02:00 AM (viernes y sábados)"
      />

      {/* ── 5. MAPA INTERACTIVO ── */}
      <MapaLeafletLoja nombrePlato="Bares y Vida Nocturna" />

      {/* ── 6. FAQ SEO ── */}
      <section className="bg-white py-16 border-t border-niebla">
        <Wrap>
          <div className="mx-auto max-w-[760px]">
            <details className="group rounded-2xl border border-niebla bg-porcelana/30 p-6 transition open:bg-white open:shadow-md">
              <summary className="flex cursor-pointer items-center justify-between font-serif text-lg font-bold text-grafito">
                <div className="flex items-center gap-3">
                  <span className="text-petroleo font-sans text-xs font-extrabold tracking-widest uppercase">
                    FAQ
                  </span>
                  <span>Preguntas Frecuentes sobre Bares en Loja</span>
                </div>
                <span className="text-petroleo transition-transform group-open:rotate-180 text-xl font-bold">
                  ▾
                </span>
              </summary>

              <div className="mt-6 space-y-4 border-t border-niebla/50 pt-4">
                {BARES_FAQS.map((faq) => (
                  <div
                    key={faq.q}
                    className="rounded-xl border border-niebla/40 bg-white p-4"
                  >
                    <h4 className="font-serif text-sm font-bold text-grafito">
                      {faq.q}
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-muted">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </Wrap>
      </section>

      {/* ── 7. CTA: COMIDA RÁPIDA ── */}
      <section className="py-12 bg-[#0d1117] border-t border-white/10">
        <Wrap>
          <div className="rounded-3xl bg-gradient-to-r from-[#1a1040] to-[#0d1117] p-8 text-white md:flex md:items-center md:justify-between md:p-10 shadow-xl border border-white/10">
            <div className="max-w-[580px]">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#e1b45f]">
                ¿HAMBRE DESPUÉS DE LOS TRAGOS?
              </span>
              <h3 className="mt-2 text-2xl font-bold font-serif">
                La mejor comida rápida en Loja para la noche
              </h3>
              <p className="mt-2 text-xs text-white/60 leading-relaxed">
                Alitas, hamburguesas, pizza y más opciones disponibles hasta
                altas horas. Consulta nuestra guía de comida nocturna en Loja.
              </p>
            </div>
            <div className="mt-6 flex flex-shrink-0 gap-3 md:mt-0">
              <Link
                href="/comida-rapida-loja"
                className="rounded-xl bg-[#e1b45f] px-6 py-3.5 text-xs font-bold text-[#0d1117] transition hover:brightness-110 shadow-md"
              >
                Comida Rápida en Loja →
              </Link>
            </div>
          </div>
        </Wrap>
      </section>
    </>
  );
}
