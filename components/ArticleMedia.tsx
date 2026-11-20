'use client';

import { useState } from 'react';
import { getVideoEmbedHtml } from '@/lib/markdown';

interface ArticleMediaProps {
  image?: string;
  imageAlt?: string;
  videoUrl?: string;
  title: string;
}

/**
 * Componente que muestra imagen y/o video de un artículo.
 * - Si solo hay imagen: muestra la imagen
 * - Si solo hay video: muestra el video
 * - Si hay ambos: muestra tabs para alternar entre imagen y video
 */
export function ArticleMedia({ image, imageAlt, videoUrl, title }: ArticleMediaProps) {
  const hasImage = Boolean(image);
  const hasVideo = Boolean(videoUrl);
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');

  if (!hasImage && !hasVideo) return null;

  // Solo video, sin imagen
  if (!hasImage && hasVideo) {
    return (
      <div className="mb-10">
        <div
          dangerouslySetInnerHTML={{ __html: getVideoEmbedHtml(videoUrl!) }}
          suppressHydrationWarning
        />
      </div>
    );
  }

  // Solo imagen, sin video
  if (hasImage && !hasVideo) {
    return (
      <div className="mb-10 rounded-2xl sm:rounded-3xl overflow-hidden border border-[#DCE4E0] shadow-[0_4px_24px_-4px_rgba(21,62,62,0.08)] bg-[#DCE4E0]/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image!}
          alt={imageAlt || title}
          className="w-full h-auto max-h-[440px] sm:max-h-[480px] object-cover"
        />
      </div>
    );
  }

  // Ambos: imagen + video con tabs
  return (
    <div className="mb-10">
      {/* Tabs */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setActiveTab('image')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition border ${
            activeTab === 'image'
              ? 'bg-[#153E3E] text-[#D0DB61] border-[#153E3E] shadow-sm'
              : 'bg-white text-[#1F2928] border-[#DCE4E0] hover:border-[#153E3E]'
          }`}
        >
          📷 Foto del Plato
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition border ${
            activeTab === 'video'
              ? 'bg-[#153E3E] text-[#D0DB61] border-[#153E3E] shadow-sm'
              : 'bg-white text-[#1F2928] border-[#DCE4E0] hover:border-[#153E3E]'
          }`}
        >
          🎥 Ver Video
        </button>
      </div>

      {activeTab === 'image' ? (
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-[#DCE4E0] shadow-[0_4px_24px_-4px_rgba(21,62,62,0.08)] bg-[#DCE4E0]/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image!}
            alt={imageAlt || title}
            className="w-full h-auto max-h-[440px] sm:max-h-[480px] object-cover"
          />
        </div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: getVideoEmbedHtml(videoUrl!) }} suppressHydrationWarning />
      )}
    </div>
  );
}
