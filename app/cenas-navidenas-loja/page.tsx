import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Wrap } from "@/components/PageHero";
import { getCenasNavidenas, type PromoAliado } from "@/lib/promos-db";
import { getAliadosByMomento } from "@/lib/aliados-db";

export const metadata: Metadata = {
  title: "Cenas Navideñas en Loja 2026 | Restaurantes, Pavos y Menús Empresariales",
  description:
    "Guía oficial de cenas navideñas en Loja: paquetes corporativos, cenas de fin de año, pavo y lechón para llevar, y menús festivos en los mejores restaurantes de Loja.",
  alternates: { canonical: "/cenas-navidenas-loja" },
  openGraph: {
    title: "Cenas Navideñas en Loja 2026 | Restaurantes y Menús de Fin de Año",
    description:
      "Reserva tu cena navideña en Loja: paquetes para empresas, familias, pavo horneado y servicio a domicilio sin intermediarios.",
    url: "https://www.quecomerenloja.com/cenas-navidenas-loja",
    images: [{ url: "/christmas_feast_loja_ecuador.webp", width: 1200, height: 630, alt: "Cenas Navideñas Loja Ecuador" }],
  },
};

export const dynamic = "force-dynamic";

const WA_AFILIACION_CENAS =
  "https://wa.me/593986962872?text=Hola%2C%20tengo%20un%20restaurante%20o%20servicio%20de%20cenas%20navide%C3%B1as%20en%20Loja%20y%20deseo%20publicar%20mi%20men%C3%BA%20en%20Qu%C3%A9%20Comer%20en%20Loja";

const FAQS_CENAS = [
  {
    q: "¿Con cuánta anticipación se debe reservar una cena navideña en Loja?",
    a: "Para eventos corporativos o cenas familiares grandes (más de 10 personas), los restaurantes y salones de Loja recomiendan reservar con al menos 7 a 15 días de anticipación debido a la alta demanda de diciembre. Para cenas de Nochebuena (pavo horneado para llevar), los pedidos se receptan hasta el 20 de diciembre.",
  },
];

export default async function CenasNavidenasPage() {
  const cenas: PromoAliado[] = await getCenasNavidenas(50);
  const aliados = await getAliadosByMomento("cena");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Temporada de Cenas Navideñas y Fin de Año en Loja",
    description: "Cartelera y catálogo gastronómico de cenas navideñas, paquetes corporativos y pavos horneados en Loja.",
    startDate: "2026-11-15T18:00:00-05:00",
    endDate: "2026-12-31T23:59:59-05:00",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "Restaurantes de Loja",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Loja",
        addressRegion: "Loja",
        addressCountry: "EC",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Qué Comer en Loja",
      url: "https://www.quecomerenloja.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-[#FDFBF7] text-[#1E293B]">
        {/* HERO ESTACIONAL */}
        <section className="relative overflow-hidden bg-[#0F2D2A] text-white min-h-[460px] sm:min-h-[520px] flex items-center justify-center px-4 sm:px-6">
          {/* Imagen de fondo con overlay sutil al 20% */}
          <div className="absolute inset-0">
            <Image
              src="/christmas_feast_loja_ecuador.webp"
              alt="Cenas Navideñas en Loja Ecuador"
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
            {/* Overlay negro sutil al 20% */}
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <Wrap>
            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4 sm:space-y-6 pt-12 pb-16">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-black/50 text-[#F5E6CC] border border-white/20 backdrop-blur-md shadow-sm">
                🎄 Edición Especial Diciembre 2026
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-serif leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]">
                Cenas Navideñas & Fin de Año en Loja
              </h1>
              <p className="text-sm sm:text-lg text-white font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                Descubre los mejores menús corporativos, banquetes familiares y opciones de pavo y pierna para llevar en Loja. Reserva directo con el restaurante sin comisiones.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto sm:max-w-none">
                <a
                  href="#ofertas"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#C5A880] text-[#0F2D2A] font-bold text-sm hover:bg-[#D4BC96] transition-all shadow-xl shadow-black/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Ver Menús Disponibles 🍽️
                </a>
                <a
                  href={WA_AFILIACION_CENAS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-black/60 hover:bg-black/75 text-white font-semibold text-sm border border-white/40 backdrop-blur-md transition-all shadow-xl shadow-black/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Publicar Cena de mi Restaurante 📲
                </a>
              </div>
            </div>
          </Wrap>
        </section>

        {/* CATÁLOGO DE CENAS EN VIVO */}
        <section id="ofertas" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-[#8C7355] uppercase tracking-widest">
                Catálogo Activo en Loja
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#0F2D2A] mt-1">
                Menús y Paquetes Navideños Confirmados
              </h2>
            </div>
            <p className="text-sm text-slate-500 max-w-md">
              Actualizado en tiempo real por los mismos restaurantes y huecas de Loja a través de nuestro bot oficial de WhatsApp.
            </p>
          </div>

          {cenas.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EBE3D5] text-center max-w-2xl mx-auto shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF6F0] flex items-center justify-center mx-auto text-3xl">
                🎄
              </div>
              <h3 className="text-xl font-bold text-[#0F2D2A]">
                Cenas Navideñas en Preparación
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Los restaurantes y catering de Loja están habilitando sus paquetes de diciembre (cenas corporativas, pavos y piernas al horno). A medida que confirmen por nuestro bot de WhatsApp, se mostrarán aquí con sus precios y menús completos.
              </p>
              <div className="pt-2">
                <a
                  href={WA_AFILIACION_CENAS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F2D2A] text-white font-semibold text-sm hover:bg-[#1A4D46] transition-colors"
                >
                  Publicar cena de mi restaurante por WhatsApp 📲
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {cenas.map((cena) => (
                <article
                  key={cena.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#EFE8DC] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {cena.imagen_url ? (
                      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                        <Image
                          src={cena.imagen_url}
                          alt={cena.titulo}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="h-28 bg-gradient-to-r from-[#0F2D2A] to-[#1A4D46] p-4 flex items-center justify-between text-white">
                        <span className="text-2xl">🎄</span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20">
                          Loja Tradición
                        </span>
                      </div>
                    )}

                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-[#8C7355] uppercase tracking-wide truncate">
                          {cena.aliado_nombre}
                        </span>
                        {cena.precio_promo && (
                          <span className="text-sm font-black text-[#0F2D2A] bg-[#FAF5EE] px-2.5 py-1 rounded-lg border border-[#E9DFD0]">
                            {cena.precio_promo}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-lg text-[#0F2D2A] leading-snug line-clamp-2">
                        {cena.titulo}
                      </h3>

                      <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {cena.descripcion}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    {cena.whatsapp_url ? (
                      <a
                        href={cena.whatsapp_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-bold text-sm transition-colors border border-[#25D366]/30"
                      >
                        Cotizar o Reservar por WhatsApp 💬
                      </a>
                    ) : (
                      <Link
                        href={`/promos/${cena.slug}`}
                        className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
                      >
                        Ver detalles completos →
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* RESTAURANTES RECOMENDADOS PARA EVENTOS */}
        <section className="bg-[#F5EFE6] py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold text-[#8C7355] uppercase tracking-widest">
                Espacios & Gastronomía
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#0F2D2A]">
                Salones y Restaurantes para Cenas en Loja
              </h2>
              <p className="text-sm text-slate-600">
                Locales aliados con capacidad para agasajos navideños, cenas íntimas y almuerzos corporativos de fin de año.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {aliados.slice(0, 4).map((aliado) => (
                <div
                  key={aliado.id}
                  className="bg-white rounded-2xl p-5 border border-[#E9DFD0] shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <h3 className="font-bold text-[#0F2D2A] text-base">
                      {aliado.nombre}
                    </h3>
                    <p className="text-xs text-slate-500">
                      📍 {aliado.ubicacion || "Loja Centro"}
                    </p>
                  </div>
                  <div className="pt-4">
                    {aliado.telefono ? (
                      <a
                        href={`https://wa.me/${aliado.telefono.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(aliado.nombre)}%2C%20vi%20su%20restaurante%20en%20Qu%C3%A9%20Comer%20en%20Loja%20y%20deseo%20consultar%20por%20cenas%20navide%C3%B1as`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-[#8C7355] hover:text-[#0F2D2A] transition-colors"
                      >
                        Contactar por WhatsApp →
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">Loja, Ecuador</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQS SEO */}
        <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif text-[#0F2D2A] text-center">
              Preguntas Frecuentes sobre Cenas de Navidad en Loja
            </h2>
            <div className="space-y-4 pt-4">
              {FAQS_CENAS.map((faq, idx) => (
                <details
                  key={idx}
                  className="bg-white rounded-2xl p-5 border border-[#EFE8DC] shadow-sm group [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between font-bold text-sm sm:text-base text-[#0F2D2A] cursor-pointer">
                    <span>{faq.q}</span>
                    <span className="transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="bg-[#0F2D2A] text-white py-14 px-4 sm:px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black font-serif">
              ¿Ofreces cenas o pavos para Navidad en Loja?
            </h2>
            <p className="text-sm text-slate-300">
              Conéctate a nuestro bot oficial de WhatsApp. Envía tu afiche o menú navideño y saldrá publicado en nuestra plataforma en 1 minuto.
            </p>
            <div className="pt-2">
              <a
                href={WA_AFILIACION_CENAS}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-7 py-3 rounded-xl bg-[#C5A880] text-[#0F2D2A] font-bold text-sm hover:bg-[#D4BC96] transition-all shadow-md"
              >
                Conectar mi restaurante al Bot 🎄
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
