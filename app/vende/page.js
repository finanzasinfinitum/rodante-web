import SellForm from '@/components/SellForm';

export const metadata = {
  title: 'Vende tu auto',
  description: 'Cotiza tu auto en 2 minutos y recibe dos ofertas: compra inmediata con pago en 24 h o mejor precio con espera.',
};

export default function VendePage({ searchParams }) {
  return (
    <div className="container" style={{ padding: '48px 24px 64px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h1 className="h2">Vende tu auto</h1>
        <p className="muted" style={{ margin: '12px 0 0', fontSize: 16, lineHeight: '24px', maxWidth: 640 }}>
          Completa los datos y te mostramos al instante dos ofertas: una para venderlo hoy y otra con mejor precio si puedes esperar.
        </p>
      </div>
      <SellForm initial={searchParams || {}} />
    </div>
  );
}
