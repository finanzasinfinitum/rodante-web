import { CarPlaceholder } from './Icons';
import { carName, youtubeId, photoUrl } from '@/lib/carUtils';
import { usd } from '@/lib/pricing';

const TINTS = ['#e3efef', '#fdf1d8', '#ecebe6'];

export function CarThumb({ car, index = 0 }) {
  const cover = car.photos?.[0] ? photoUrl(car.photos[0], 800) : null;
  const reserved = car.status === 'reservado';
  return (
    <div style={{ position: 'relative', aspectRatio: '4 / 3', background: TINTS[index % 3], display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {cover ? <img src={cover} alt={carName(car)} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <CarPlaceholder />}
      {reserved
        ? <span className="chip" style={{ position: 'absolute', top: 12, left: 12, background: 'var(--ink)', color: '#fff' }}>Reservado</span>
        : car.badge && <span className="chip chip-accent" style={{ position: 'absolute', top: 12, left: 12 }}>{car.badge}</span>}
      <div style={{ position: 'absolute', right: 12, bottom: 12, display: 'flex', gap: 6 }}>
        {car.photos?.length > 0 && <span className="chip" style={{ background: 'rgba(18,24,33,.82)', color: '#fff' }}>{car.photos.length} fotos</span>}
        {youtubeId(car.video_url) && <span className="chip" style={{ background: 'rgba(18,24,33,.82)', color: '#fff' }}>▶ Video</span>}
      </div>
    </div>
  );
}

export function carMeta(c) {
  return `${c.year} · ${Number(c.km).toLocaleString('en-US')} km · ${c.transmission}`;
}

export default function CarCardBody({ car }) {
  return (
    <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
      <h3 style={{ margin: 0, fontSize: 17, lineHeight: '24px', fontWeight: 700 }}>{carName(car)}</h3>
      <span className="muted" style={{ fontSize: 14 }}>{carMeta(car)}</span>
      <span className="tabular" style={{ fontSize: 26, lineHeight: '32px', fontWeight: 800, marginTop: 8 }}>{usd(car.price)}</span>
    </div>
  );
}

export function Specs({ car }) {
  const rows = [['Año', car.year], ['Kilometraje', `${Number(car.km).toLocaleString('en-US')} km`], ['Transmisión', car.transmission], ['Combustible', car.fuel], ...(car.color ? [['Color', car.color]] : []), ['Tipo', car.body_type]];
  return (
    <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px 16px', fontSize: 14 }}>
      {rows.map(([k, v]) => <div key={k}><dt className="muted" style={{ fontWeight: 600 }}>{k}</dt><dd style={{ margin: '2px 0 0', fontWeight: 700 }}>{v}</dd></div>)}
    </dl>
  );
}
