import Link from 'next/link';
import { notFound } from 'next/navigation';
import CarGallery from '@/components/CarGallery';
import { Specs } from '@/components/CarCard';
import { Check } from '@/components/Icons';
import { getCar, carName, interestMessage } from '@/lib/cars';
import { usd } from '@/lib/pricing';
import { waLink } from '@/lib/config';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const car = await getCar(params.id);
  if (!car) return { title: 'Auto no encontrado' };
  const title = `${carName(car)} ${car.year} · ${usd(car.price)}`;
  return { title, description: `${carName(car)} ${car.year}, ${Number(car.km).toLocaleString('en-US')} km, ${car.transmission}. Precio: ${usd(car.price)}.`, openGraph: { title, images: car.photos?.[0] ? [car.photos[0]] : [] } };
}

export default async function CarPage({ params }) {
  const car = await getCar(params.id);
  if (!car) notFound();
  const sold = car.status === 'vendido';
  return (
    <div className="container" style={{ padding: '32px 24px 64px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Link href="/catalogo" style={{ fontWeight: 700, fontSize: 15 }}>← Volver al catálogo</Link>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
        <div className="card" style={{ flex: '999 1 560px', minWidth: 0, padding: 16 }}><CarGallery car={car} /></div>
        <aside className="card" style={{ flex: '1 1 340px', minWidth: 0, padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {car.status !== 'disponible' && <span className="chip" style={{ alignSelf: 'flex-start', background: 'var(--ink)', color: '#fff', textTransform: 'capitalize' }}>{car.status}</span>}
          <h1 style={{ margin: 0, fontSize: 28, lineHeight: '34px', fontWeight: 800 }}>{carName(car)} {car.year}</h1>
          <span className="tabular" style={{ fontSize: 40, lineHeight: '44px', fontWeight: 800 }}>{usd(car.price)}</span>
          <Specs car={car} />
          <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center', color: 'var(--success)', fontSize: 14, fontWeight: 700 }}><Check size={18} />Inspección aprobada</span>
          {!sold && (
            <a className="btn btn-primary btn-block" href={waLink(interestMessage(car))} target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a>
          )}
          <a className="btn btn-ghost btn-block" href={waLink(`Hola Rodante, quiero agendar una prueba de manejo del ${carName(car)} ${car.year}.`)} target="_blank" rel="noopener noreferrer">Agendar prueba de manejo</a>
        </aside>
      </div>
      {car.description && (
        <section className="card" style={{ padding: 28 }}>
          <h2 className="h3" style={{ fontSize: 20 }}>Descripción</h2>
          <p style={{ margin: '12px 0 0', fontSize: 16, lineHeight: '26px', whiteSpace: 'pre-line' }}>{car.description}</p>
        </section>
      )}
    </div>
  );
}
