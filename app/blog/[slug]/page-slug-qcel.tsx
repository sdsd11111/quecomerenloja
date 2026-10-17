import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getPublishedPosts } from '@/lib/blog';
import { renderContent } from '@/lib/markdown';
import { ArticleMedia } from '@/components/ArticleMedia';

const SITE_NAME = 'Qué Comer en Loja';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://quecomerenloja.com';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: `Artículo no encontrado | ${SITE_NAME}`,
    };
  }

  const title = `${post.titulo || post.title} | ${SITE_NAME}`;
  const description = post.resumen || post.excerpt;
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.imagen;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: post.fecha_publicacion || post.date,
      authors: [post.autor || 'Qué Comer en Loja'],
      images: [
        {
          url: image,
          alt: post.imagen_alt || post.titulo,
        },
      ],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-[#FAF3E0] text-[#1A1208] min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
        <nav className="flex items-center gap-2 text-sm text-[#746653] mb-8">
          <Link href="/" className="hover:text-[#153E3E] transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#153E3E] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-[#1A1208] font-medium truncate max-w-xs">{post.titulo || post.title}</span>
        </nav>

        <article className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-12 border border-[#E5DCCB] shadow-[0_4px_24px_-4px_rgba(21,62,62,0.08)] overflow-hidden">
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-[#153E3E] text-[#D0DB61] text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm border border-[#D0DB61]/20">
                {post.categoria || post.tag || 'Gastronomía'}
              </span>
              <span className="text-xs text-[#746653]">
                {post.fecha_publicacion || post.date} • {post.tiempo_lectura || post.readMinutes || 3} min de lectura
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-[#1A1208] font-['Playfair_Display',serif] tracking-tight leading-tight mb-6">
              {post.titulo || post.title}
            </h1>

            <p className="text-lg text-[#746653] leading-relaxed border-l-4 border-[#153E3E] pl-4 bg-[#153E3E]/5 py-3 rounded-r-2xl">
              {post.resumen || post.excerpt}
            </p>
          </header>

          <ArticleMedia
            image={post.imagen}
            imageAlt={post.imagen_alt || post.titulo}
            videoUrl={post.video_url || undefined}
            title={post.titulo || post.title || ''}
          />

          <div
            className="prose prose-lg max-w-none text-[#1A1208] mt-8 prose-headings:font-['Playfair_Display',serif] prose-headings:text-[#153E3E] prose-a:text-[#153E3E] prose-img:rounded-2xl leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderContent(post.contenido).trim() }}
          />

          {post.etiquetas && post.etiquetas.length > 0 && (
            <div className="mt-12 pt-6 border-t border-[#E5DCCB]">
              <h3 className="text-xs uppercase tracking-wider text-[#746653] font-bold mb-3">
                Temas gastronómicos:
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.etiquetas.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-[#FAF3E0] text-[#153E3E] border border-[#E5DCCB] text-xs font-medium px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
