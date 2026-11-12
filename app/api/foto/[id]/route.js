// Sirve una foto de Google Drive (carpeta pública del cliente), redimensionada y en caché.
export async function GET(request, { params }) {
  const id = params.id;
  if (!/^[A-Za-z0-9_-]{20,100}$/.test(id)) return new Response('No encontrado', { status: 404 });
  const wParam = parseInt(new URL(request.url).searchParams.get('w') || '1600', 10);
  const w = Math.min(2000, Math.max(200, Number.isFinite(wParam) ? wParam : 1600));

  const sources = [
    `https://lh3.googleusercontent.com/d/${id}=w${w}`,
    `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`,
  ];
  for (const src of sources) {
    try {
      const res = await fetch(src, { cache: 'no-store' });
      const type = res.headers.get('content-type') || '';
      if (res.ok && type.startsWith('image/')) {
        return new Response(res.body, {
          headers: { 'Content-Type': type, 'Cache-Control': 'public, max-age=86400, s-maxage=31536000, immutable' },
        });
      }
    } catch {}
  }
  return new Response('No encontrado', { status: 404 });
}
