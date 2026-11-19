import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPromoBySlug } from '@/lib/promos-db';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const promo = await getPromoBySlug(slug);

  if (!promo) {
    return {
      title: 'Promoción no encontrada | Qué Comer en Loja',
    };
  }

  const cleanTitulo = promo.titulo || 'Promoción';
  const cleanAliado = promo.aliado_nombre || '';
  const tituloTieneAliado = cleanAliado && cleanTitulo.toLowerCase().includes(cleanAliado.toLowerCase());
  
  // Nota: Next.js en layout.tsx agrega el template "%s | Qué Comer en Loja"
  const title = tituloTieneAliado
    ? cleanTitulo
    : `${cleanTitulo} - ${cleanAliado}`;
  const description = promo.descripcion ? promo.descripcion.slice(0, 160) : 'Descubre las mejores promociones gastronómicas de Loja.';
  const ogImage = promo.imagen_url || 'https://mvps.b-cdn.net/quecomerenloja/home/hero-home.webp';

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Qué Comer en Loja`,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: cleanTitulo,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Qué Comer en Loja`,
      description,
      images: [ogImage],
    },
  };
}

export default async function PromoDetailPage({ params }: Props) {
  const { slug } = await params;
  const promo = await getPromoBySlug(slug);

  if (!promo) {
    notFound();
  }

  // Schema.org Event or SpecialOffer
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': promo.tipo === 'EVENTO' ? 'Event' : 'Offer',
    name: promo.titulo,
    description: promo.descripcion,
    image: promo.imagen_url || 'https://mvps.b-cdn.net/quecomerenloja/home/hero-home.webp',
    startDate: promo.fecha_inicio,
    endDate: promo.fecha_fin || undefined,
    price: promo.precio_promo || undefined,
    priceCurrency: 'USD',
    offeredBy: {
      '@type': 'Restaurant',
      name: promo.aliado_nombre,
    },
  };

  const whatsappLink = promo.whatsapp_url
    ? `https://wa.me/${promo.whatsapp_url.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Hola ${promo.aliado_nombre}, vi su promoción "${promo.titulo}" en Qué Comer en Loja y deseo más información / reservar.`
      )}`
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-[#FBFBFB] py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-muted">
            <Link href="/" className="hover:text-petroleo">Home</Link>
            <span>/</span>
            {promo.tipo === 'CENA_NAVIDENA' ? (
              <Link href="/cenas-navidenas-loja" className="hover:text-petroleo font-semibold text-emerald-800">
                🎄 Cenas Navideñas
              </Link>
            ) : (
              <Link href="/#home-search-trigger" className="hover:text-petroleo">
                Promociones
              </Link>
            )}
            <span>/</span>
            <span className="text-grafito font-medium line-clamp-1">{promo.titulo}</span>
          </nav>

          <article className="overflow-hidden rounded-3xl border border-niebla bg-white shadow-sm">
            {/* Banner Multimedia (Imagen y/o Video Embed de Redes) */}
            {promo.video_url ? (
              <div
                className={`w-full bg-black flex items-center justify-center overflow-hidden ${
                  promo.video_orientacion === 'VERTICAL'
                    ? 'aspect-[9/16] max-w-sm mx-auto my-4 rounded-2xl shadow-lg'
                    : 'aspect-video w-full'
                }`}
              >
                <iframe
                  src={promo.video_url}
                  title={promo.titulo}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            ) : promo.imagen_url ? (
              <div className="relative h-64 sm:h-96 w-full bg-porcelana">
                <Image
                  src={promo.imagen_url}
                  alt={promo.titulo}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover object-center"
                />
              </div>
            ) : null}

            {/* Cabecera y Contenido */}
            <div className="p-6 sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-100 border border-emerald-200 px-3 py-1 text-xs font-extrabold text-emerald-800">
                    📍 {promo.aliado_nombre}
                  </span>
                  {promo.tipo === 'CENA_NAVIDENA' ? (
                    <span className="rounded-full bg-red-700 text-white px-3.5 py-1 text-xs font-black shadow-xs tracking-wide">
                      🎄 CENA NAVIDEÑA
                    </span>
                  ) : (
                    <span className="rounded-full bg-petroleo text-white px-3 py-1 text-xs font-bold">
                      {promo.tipo === 'PROMO' ? '🍽️ MENÚ DEL DÍA' : promo.tipo}
                    </span>
                  )}
                </div>

                {promo.precio_promo && (
                  <div className="flex items-center gap-2">
                    {promo.precio_original && (
                      <span className="text-sm line-through text-muted">
                        {promo.precio_original}
                      </span>
                    )}
                    <span className="rounded-xl bg-citrico px-3.5 py-1 text-base font-extrabold text-petroleo shadow-xs">
                      {promo.precio_promo}
                    </span>
                  </div>
                )}
              </div>

              <h1 className="mt-4 font-serif text-3xl sm:text-4xl font-bold text-grafito leading-tight">
                {promo.titulo}
              </h1>

              {/* Ficha técnica de fecha y lugar */}
              <div className="mt-6 flex flex-wrap gap-4 rounded-2xl bg-porcelana p-4 text-xs font-semibold text-grafito border border-niebla">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">📅</span>
                  <span>
                    {(() => {
                      const parseECDate = (dateVal: string | Date) => {
                        if (typeof dateVal === 'string') {
                          // Si viene como "YYYY-MM-DD..." o formato ISO
                          const m = dateVal.match(/^(\d{4})-(\d{2})-(\d{2})/);
                          if (m) {
                            const [_, y, mo, d] = m;
                            // Creamos fecha fija al mediodía local para evitar cualquier salto horario
                            return new Date(Number(y), Number(mo) - 1, Number(d), 12, 0, 0);
                          }
                        }
                        return new Date(dateVal);
                      };

                      const dInicio = parseECDate(promo.fecha_inicio);
                      const fechaInicioEC = dInicio.toLocaleDateString('es-EC', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      });

                      const dFin = promo.fecha_fin ? parseECDate(promo.fecha_fin) : null;
                      const fechaFinEC = dFin
                        ? dFin.toLocaleDateString('es-EC', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : null;

                      if (!fechaFinEC || fechaInicioEC === fechaFinEC) {
                        return `Válido: ${fechaInicioEC}`;
                      }
                      return `Válido: ${fechaInicioEC} al ${fechaFinEC}`;
                    })()}
                  </span>
                </div>

                {promo.lugar && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">📌</span>
                    <span>{promo.lugar}</span>
                  </div>
                )}
              </div>

              {/* Descripción completa */}
              <div className="mt-8 prose prose-neutral max-w-none text-muted leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {promo.descripcion}
              </div>

              {/* CTA WhatsApp y Contacto */}
              <div className="mt-10 pt-6 border-t border-niebla flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link
                  href="/"
                  className="text-xs font-bold text-petroleo hover:underline"
                >
                  ← Volver a Qué Comer en Loja
                </Link>

                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-7 py-3.5 text-sm font-extrabold text-white shadow-md hover:brightness-105 transition"
                  >
                    <span>💬 Contactar a WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
