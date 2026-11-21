import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getPublishedPosts } from '@/lib/blog';
import { renderContent } from '@/lib/markdown';
import { ArticleMedia } from '@/components/ArticleMedia';

const SITE_NAME = 'Qué Comer en Loja';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://quecomerenloja.com';
const LOCALE = 'es_EC';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: `Artículo No Encontrado | ${SITE_NAME}`,
    };
  }

  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const metaTitle = `${post.titulo} | ${SITE_NAME}`;
  // Auto-generated OG image route — takes priority over external imagen URL
  // when the redactor sends an image, the opengraph-image.tsx composites it
  // as branded background. If no imagen, the branded card is shown alone.
  const ogImageUrl = `${SITE_URL}/blog/${post.slug}/opengraph-image`;

  return {
    metadataBase: new URL(SITE_URL),
    title: metaTitle,
    description: post.resumen,
    keywords: [
      post.categoria,
      ...(post.etiquetas || []),
      'gastronomía lojana',
      'donde comer en loja',
      SITE_NAME,
    ],
    authors: [{ name: post.autor || SITE_NAME }],
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: metaTitle,
      description: post.resumen,
      url: postUrl,
      siteName: SITE_NAME,
      locale: LOCALE,
      type: 'article',
      publishedTime: post.fecha_publicacion,
      modifiedTime: post.fecha_modificacion || post.fecha_publicacion,
      authors: [post.autor || SITE_NAME],
      tags: post.etiquetas,
      // article:section maps to categoria for Facebook/LinkedIn article indexing
      section: post.categoria,
      images: [
        {
          url: ogImageUrl,
          alt: post.imagen_alt || post.titulo,
          width: 1200,
          height: 630,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: post.resumen,
      images: [ogImageUrl],
    },
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getPublishedPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  // Schema.org BlogPosting estructurado oficial
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
    headline: post.titulo,
    description: post.resumen,
    image: post.imagen ? [post.imagen] : undefined,
    datePublished: post.fecha_publicacion,
    dateModified: post.fecha_modificacion || post.fecha_publicacion,
    author: {
      '@type': 'Organization',
      name: post.autor || SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo-oficial.png`,
      },
    },
    articleSection: post.categoria,
    keywords: post.etiquetas?.join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Contenedor Principal: Paleta Oficial Porcelana (#F5F6F1) */}
      <div className="min-h-screen bg-[#F5F6F1] text-[#1F2928] pt-24 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Gastronómico */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#5C7270] mb-8 font-medium">
            <Link href="/" className="hover:text-[#153E3E] transition-colors">
              Inicio
            </Link>
            <span className="text-[#DCE4E0]">/</span>
            <Link href="/blog" className="hover:text-[#153E3E] transition-colors">
              Blog
            </Link>
            <span className="text-[#DCE4E0]">/</span>
            <span className="text-[#153E3E] font-semibold truncate max-w-[200px] sm:max-w-sm">
              {post.titulo}
            </span>
          </nav>

          {/* Tarjeta Editorial Central */}
          <article className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-12 border border-[#DCE4E0] shadow-[0_8px_32px_-8px_rgba(21,62,62,0.06)] overflow-hidden">
            {/* Header del post */}
            <header className="mb-10">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="bg-[#153E3E] text-[#D0DB61] text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm border border-[#D0DB61]/25 tracking-wide">
                  {post.categoria || 'Gastronomía'}
                </span>
                <span className="text-xs text-[#5C7270]">
                  📅 {post.fecha_publicacion ? String(post.fecha_publicacion).split('T')[0] : ''}
                </span>
                <span className="text-xs text-[#DCE4E0]">•</span>
                <span className="text-xs text-[#5C7270]">
                  ⏱️ {post.tiempo_lectura || 5} min de lectura
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#153E3E] tracking-tight leading-[1.15] mb-6 font-['League_Spartan',sans-serif]">
                {post.titulo}
              </h1>

              {/* Lead Paragraph con Borde de Acento Cítrico */}
              <div className="text-base sm:text-lg text-[#2D3A39] leading-relaxed border-l-4 border-[#153E3E] pl-4 sm:pl-5 bg-[#153E3E]/5 py-3.5 rounded-r-2xl">
                <p className="font-normal italic">
                  {post.resumen}
                </p>
              </div>
            </header>

            {/* Multimedia de Cabecera (Imagen / Video Tabs) */}
            <ArticleMedia
              image={post.imagen}
              imageAlt={post.imagen_alt || post.titulo}
              videoUrl={post.video_url || undefined}
              title={post.titulo}
            />

            {/* Contenido Editorial con Tipografía y Espaciado Armónico */}
            <div
              className="blog-prose"
              dangerouslySetInnerHTML={{ __html: renderContent(post.contenido).trim() }}
              suppressHydrationWarning
            />

            {/* Etiquetas del Post */}
            {post.etiquetas && post.etiquetas.length > 0 && (
              <div className="mt-14 pt-8 border-t border-[#DCE4E0]">
                <h3 className="text-xs uppercase tracking-wider text-[#5C7270] font-bold mb-3.5">
                  Rutas y conceptos clave:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.etiquetas.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-[#F5F6F1] border border-[#DCE4E0] text-[#153E3E] font-medium px-3.5 py-1.5 rounded-lg hover:border-[#153E3E] transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Caja de Autor y Compromiso Local */}
            <div className="mt-10 bg-[#F5F6F1] border border-[#DCE4E0] rounded-2xl p-5 sm:p-6 flex items-center gap-4">
              <div className="size-12 rounded-xl bg-[#153E3E] text-[#D0DB61] font-bold flex items-center justify-center shrink-0 text-xl shadow-sm">
                🍴
              </div>
              <div>
                <div className="text-sm font-bold text-[#153E3E]">
                  {post.autor || 'Equipo Editorial Qué Comer en Loja'}
                </div>
                <div className="text-xs text-[#5C7270] mt-0.5">
                  Promovemos la gastronomía auténtica, huecas centenarias y el café de altura de la provincia de Loja.
                </div>
              </div>
            </div>
          </article>

          {/* Artículos Recomendados */}
          {relatedPosts.length > 0 && (
            <section className="mt-16 pt-10 border-t border-[#DCE4E0]">
              <h2 className="text-2xl font-bold text-[#153E3E] mb-6 font-['League_Spartan',sans-serif]">
                Continúa Descubriendo Sabores
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rel) => (
                  <Link
                    key={rel.id || rel.slug}
                    href={`/blog/${rel.slug}`}
                    className="bg-white border border-[#DCE4E0] rounded-2xl p-4 hover:border-[#153E3E] hover:shadow-[0_8px_24px_-8px_rgba(21,62,62,0.12)] transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[11px] text-[#153E3E] font-bold bg-[#DCE4E0]/40 px-2.5 py-1 rounded-full inline-block">
                        {rel.categoria || 'Gastronomía'}
                      </span>
                      <h4 className="text-sm font-bold text-[#1F2928] group-hover:text-[#153E3E] transition-colors mt-3 line-clamp-2 leading-snug">
                        {rel.titulo}
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-[#153E3E] mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Leer artículo →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Enlace de Retorno */}
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#153E3E] hover:text-[#0E2E2E] bg-white border border-[#DCE4E0] hover:border-[#153E3E] px-6 py-2.5 rounded-full shadow-sm transition-all"
            >
              ← Volver a todos los artículos gastronómicos
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
