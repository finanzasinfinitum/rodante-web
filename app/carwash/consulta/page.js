import Link from 'next/link';
import PlacaLookup from '@/components/PlacaLookup';

export const metadata = { title: 'Consulta tu membresía', description: 'Revisa si tu membresía de carwash está activa y hasta cuándo, con tu placa.' };

export default function ConsultaPage() {
  return (
    <div className="container" style={{ padding: '48px 24px 64px', maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Link href="/carwash" style={{ fontWeight: 700, fontSize: 15 }}>← Volver al carwash</Link>
      <div>
        <h1 className="h2">Consulta tu membresía</h1>
        <p className="muted" style={{ margin: '8px 0 0', fontSize: 16, lineHeight: '24px' }}>Escribe la placa de tu vehículo para ver tu plan, su estado y hasta cuándo está vigente.</p>
      </div>
      <PlacaLookup />
    </div>
  );
}
