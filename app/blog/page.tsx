import { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedPosts } from '@/lib/blog';

const SITE_NAME = 'Qué Comer en Loja';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://quecomerenloja.com';
const BLOG_TITLE = `Guías Gastronómicas y Artículos | ${SITE_NAME}`;
const BLOG_DESCRIPTION = 'Rutas de café, huecas tradicionales, secretos del repe y la cecina, y lo mejor de la cocina lojana.';

export const metadata: Metadata = {
  title: BLOG_TITLE,
  description: BLOG_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    url: `${SITE_URL}/blog`,
    type: 'website',
  },
};

export const revalidate = 60;

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="bg-[#FAF3E0] text-[#1A1208] min-h-screen pb-20">
      {/* Hero del Blog con paleta gastronómica oficial: Petróleo Profundo (#153E3E), Acento Cítrico (#D0DB61) */}
      <section className="relative overflow-hidden bg-[#153E3E] text-white py-20 px-4 sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_45%,#1f5252_0,transparent_55%)] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-sm font-semibold text-[#D0DB61] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#D0DB61] animate-pulse" />
            La Ruta Gastronómica de Loja
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 font-['Playfair_Display',serif] text-[#FAF3E0]">
            Historias, Sabores y <span className="text-[#D0DB61] italic">Tradición Lojana</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-[#DCE4E0] font-normal leading-relaxed">
            Descubre las mejores huecas, la preparación del repe y la cecina, cafeterías de altura y los secretos culinarios de Loja.
          </p>
        </div>
      </section>

      {/* Grid de Artículos */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id || post.slug}
              className="bg-[#FFFDF8] rounded-3xl overflow-hidden border border-[#E5DCCB] shadow-[0_4px_20px_-4px_rgba(21,62,62,0.08)] hover:shadow-[0_12px_36px_-8px_rgba(21,62,62,0.18)] transition-all duration-300 flex flex-col group hover:-translate-y-1"
            >
              <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-[#E5DCCB]">
                <img
                  src={post.imagen}
                  alt={post.imagen_alt || post.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-4 left-4 bg-[#153E3E] text-[#D0DB61] text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-[#D0DB61]/30">
                  {post.categoria || post.tag || 'Gastronomía'}
                </span>
              </Link>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 text-xs text-[#746653] mb-3">
                  <span>{post.fecha_publicacion || post.date}</span>
                  <span>•</span>
                  <span>{post.tiempo_lectura || post.readMinutes || 3} min de lectura</span>
                </div>

                <h2 className="text-xl font-bold text-[#1A1208] group-hover:text-[#153E3E] font-['Playfair_Display',serif] transition-colors leading-snug mb-3">
                  <Link href={`/blog/${post.slug}`}>
                    {post.titulo || post.title}
                  </Link>
                </h2>

                <p className="text-sm text-[#746653] line-clamp-3 mb-6 flex-1 leading-relaxed">
                  {post.resumen || post.excerpt}
                </p>

                <div className="pt-4 border-t border-[#E5DCCB] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#153E3E]">
                    Por {post.autor || 'Qué Comer en Loja'}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-bold text-[#153E3E] group-hover:text-[#88602E] flex items-center gap-1 transition-colors"
                  >
                    Ver artículo →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
