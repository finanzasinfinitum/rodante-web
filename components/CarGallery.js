'use client';
import { useState } from 'react';
import { CarPlaceholder } from './Icons';
import { youtubeId, photoUrl } from '@/lib/carUtils';

// Galería: video (si hay) + fotos con miniaturas
export default function CarGallery({ car }) {
  const vid = youtubeId(car.video_url);
  const items = [...(vid ? [{ type: 'video', id: vid }] : []), ...(car.photos || []).map((src) => ({ type: 'photo', src }))];
  const [i, setI] = useState(0);
  const cur = items[i];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ position: 'relative', aspectRatio: '16 / 9', borderRadius: 10, overflow: 'hidden', background: cur?.type === 'video' ? '#121821' : 'var(--brand-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {!cur && <CarPlaceholder label="Fotos próximamente" />}
        {cur?.type === 'photo' && <img src={photoUrl(cur.src, 1600)} alt={`Foto ${i + 1} del auto`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        {cur?.type === 'video' && (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${cur.id}?rel=0`}
            title="Video del auto"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: '100%', height: '100%', border: 0 }}
          />
        )}
      </div>
      {items.length > 1 && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
          {items.map((it, k) => (
            <button key={k} type="button" onClick={() => setI(k)} aria-label={it.type === 'video' ? 'Ver video' : `Ver foto ${k + 1}`} aria-pressed={k === i}
              style={{ flex: 'none', width: 88, aspectRatio: '4 / 3', borderRadius: 6, overflow: 'hidden', padding: 0, cursor: 'pointer', border: `2px solid ${k === i ? 'var(--brand)' : 'transparent'}`, background: '#121821', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {it.type === 'photo'
                ? <img src={photoUrl(it.src, 300)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="#fff" /></svg>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
