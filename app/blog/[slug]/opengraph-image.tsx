/**
 * Dynamic OG Image Generator for Blog Articles
 * Route: /blog/[slug]/opengraph-image
 *
 * Generates a branded 1200×630 image per article using Next.js ImageResponse.
 * Falls back to composited layout if article image fails to load.
 *
 * Brand palette:
 *   Petróleo  #153E3E  (bg)
 *   Cítrico   #D0DB61  (accent)
 *   Porcelana #F5F6F1  (text)
 *   Niebla    #DCE4E0  (muted)
 */

import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/lib/blog';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OGImage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const SITE_NAME = 'Qué Comer en Loja';
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://quecomerenloja.com';

  // Clamp title to avoid overflow in image
  const title = post?.titulo
    ? post.titulo.length > 72
      ? post.titulo.slice(0, 69) + '…'
      : post.titulo
    : SITE_NAME;

  const categoria = post?.categoria || 'Gastronomía';
  const resumen = post?.resumen
    ? post.resumen.length > 110
      ? post.resumen.slice(0, 107) + '…'
      : post.resumen
    : 'Descubre la gastronomía auténtica de Loja, Ecuador.';

  // Try to load the article's imagen as background
  let articleImageData: string | null = null;
  if (post?.imagen && post.imagen.startsWith('http')) {
    try {
      const res = await fetch(post.imagen, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const mime = res.headers.get('content-type') || 'image/jpeg';
        articleImageData = `data:${mime};base64,${base64}`;
      }
    } catch {
      // Silently fall back to pattern-only background
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#153E3E',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background: article image with dark overlay, or pure petróleo */}
        {articleImageData && (
          <img
            src={articleImageData}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '1200px',
              height: '630px',
              objectFit: 'cover',
              opacity: 0.22,
            }}
            alt=""
          />
        )}

        {/* Gradient overlay — always rendered for legibility */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1200px',
            height: '630px',
            background:
              'linear-gradient(135deg, rgba(21,62,62,0.98) 0%, rgba(21,62,62,0.82) 55%, rgba(21,62,62,0.70) 100%)',
            display: 'flex',
          }}
        />

        {/* Cítrico accent stripe — left vertical bar */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '8px',
            height: '630px',
            backgroundColor: '#D0DB61',
            display: 'flex',
          }}
        />

        {/* Decorative circles — brand identity */}
        <div
          style={{
            position: 'absolute',
            right: '-80px',
            top: '-80px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            border: '2px solid rgba(208,219,97,0.18)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '-20px',
            top: '-20px',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            border: '2px solid rgba(208,219,97,0.12)',
            display: 'flex',
          }}
        />

        {/* Main content — left-padded after the accent stripe */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '8px',
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '52px 80px 48px 72px',
          }}
        >
          {/* Top: site name */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#D0DB61',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {SITE_NAME}
            </div>
            <div
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: '#D0DB61',
                display: 'flex',
                opacity: 0.6,
              }}
            />
            <div
              style={{
                fontSize: '14px',
                color: '#DCE4E0',
                opacity: 0.75,
                letterSpacing: '0.04em',
              }}
            >
              {SITE_URL.replace('https://', '')}
            </div>
          </div>

          {/* Center: categoria pill + big title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {/* Categoria pill */}
            <div
              style={{
                display: 'flex',
              }}
            >
              <div
                style={{
                  backgroundColor: '#D0DB61',
                  color: '#153E3E',
                  fontSize: '14px',
                  fontWeight: 800,
                  padding: '6px 18px',
                  borderRadius: '20px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                {categoria}
              </div>
            </div>

            {/* Article title — the hero */}
            <div
              style={{
                fontSize: title.length > 50 ? '44px' : '52px',
                fontWeight: 900,
                color: '#F5F6F1',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                maxWidth: '900px',
              }}
            >
              {title}
            </div>

            {/* Resumen excerpt */}
            <div
              style={{
                fontSize: '20px',
                fontWeight: 400,
                color: '#DCE4E0',
                lineHeight: 1.4,
                maxWidth: '820px',
                opacity: 0.85,
              }}
            >
              {resumen}
            </div>
          </div>

          {/* Bottom: reading time + fork icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '2px',
                backgroundColor: '#D0DB61',
                display: 'flex',
              }}
            />
            <div
              style={{
                fontSize: '15px',
                color: '#DCE4E0',
                fontWeight: 500,
                opacity: 0.8,
              }}
            >
              {post?.tiempo_lectura || 5} min de lectura
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
