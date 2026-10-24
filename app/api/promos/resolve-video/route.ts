import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL requerida' }, { status: 400 });
    }

    const cleanUrl = url.trim();

    // 1. Detección directa de YouTube
    const ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:watch\?.*?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
    const isYtShort = cleanUrl.includes('/shorts/');
    if (ytMatch && ytMatch[1]) {
      const videoId = ytMatch[1];
      return NextResponse.json({
        success: true,
        platform: 'youtube',
        originalUrl: cleanUrl,
        resolvedUrl: `https://www.youtube.com/watch?v=${videoId}`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`,
        suggestedOrientation: isYtShort ? 'VERTICAL' : 'HORIZONTAL',
      });
    }

    // 2. Detección directa de TikTok
    const tiktokMatch = cleanUrl.match(/tiktok\.com\/(?:@[^/]+\/video\/|v\/|t\/)(\d+|[a-zA-Z0-9_-]+)/i);
    if (cleanUrl.includes('tiktok.com')) {
      // Si es enlace corto tipo vm.tiktok.com o vt.tiktok.com, resolver redirect
      let finalUrl = cleanUrl;
      if (cleanUrl.includes('vm.tiktok.com') || cleanUrl.includes('vt.tiktok.com')) {
        try {
          const res = await fetch(cleanUrl, {
            redirect: 'manual',
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
          });
          const loc = res.headers.get('location');
          if (loc) finalUrl = loc;
        } catch {}
      }

      const matchId = finalUrl.match(/video\/(\d+)/);
      const videoId = matchId ? matchId[1] : null;

      return NextResponse.json({
        success: true,
        platform: 'tiktok',
        originalUrl: cleanUrl,
        resolvedUrl: finalUrl,
        embedUrl: videoId ? `https://www.tiktok.com/embed/v2/${videoId}` : finalUrl,
        suggestedOrientation: 'VERTICAL',
      });
    }

    // 3. Detección de Instagram (Reels o share)
    if (cleanUrl.includes('instagram.com')) {
      let finalUrl = cleanUrl;
      // Resolver redirects si es share
      if (cleanUrl.includes('/share/')) {
        try {
          const res = await fetch(cleanUrl, {
            redirect: 'manual',
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
          });
          const loc = res.headers.get('location');
          if (loc) finalUrl = loc;
        } catch {}
      }

      // Extraer post id de /reel/CODE o /p/CODE
      const igMatch = finalUrl.match(/instagram\.com\/(?:reel|reels|p)\/([a-zA-Z0-9_-]+)/i);
      const code = igMatch ? igMatch[1] : null;

      return NextResponse.json({
        success: true,
        platform: 'instagram',
        originalUrl: cleanUrl,
        resolvedUrl: finalUrl,
        embedUrl: code ? `https://www.instagram.com/reel/${code}/embed/` : finalUrl,
        suggestedOrientation: 'VERTICAL',
      });
    }

    // 4. Detección de Facebook (Reels, share/v/ o video estándar)
    if (cleanUrl.includes('facebook.com') || cleanUrl.includes('fb.watch')) {
      let finalUrl = cleanUrl;
      // Resolver redirect si es share/v/... o fb.watch
      if (cleanUrl.includes('/share/') || cleanUrl.includes('fb.watch')) {
        try {
          const res = await fetch(cleanUrl, {
            redirect: 'manual',
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
          });
          const loc = res.headers.get('location');
          if (loc) finalUrl = loc;
        } catch {}
      }

      // Si es un reel tipo facebook.com/reel/ID
      const isReel = finalUrl.includes('/reel/') || cleanUrl.includes('/reel/');

      return NextResponse.json({
        success: true,
        platform: 'facebook',
        originalUrl: cleanUrl,
        resolvedUrl: finalUrl,
        embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(finalUrl)}&show_text=0`,
        suggestedOrientation: isReel ? 'VERTICAL' : 'HORIZONTAL',
      });
    }

    // 5. Video directo MP4/WebM
    if (cleanUrl.match(/\.(mp4|webm)($|\?)/i)) {
      return NextResponse.json({
        success: true,
        platform: 'direct',
        originalUrl: cleanUrl,
        resolvedUrl: cleanUrl,
        embedUrl: cleanUrl,
        suggestedOrientation: 'HORIZONTAL',
      });
    }

    return NextResponse.json({
      success: true,
      platform: 'generic',
      originalUrl: cleanUrl,
      resolvedUrl: cleanUrl,
      embedUrl: cleanUrl,
      suggestedOrientation: 'VERTICAL',
    });
  } catch (err: any) {
    console.error('Error al resolver video URL:', err);
    return NextResponse.json({ error: err.message || 'Error al procesar URL' }, { status: 500 });
  }
}
