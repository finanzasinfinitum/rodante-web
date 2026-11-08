import CatalogClient from '@/components/CatalogClient';
import { getCars } from '@/lib/cars';

export const metadata = {
  title: 'Compra un auto',
  description: 'Autos seminuevos inspeccionados con fotos, video y precio final. Filtra por marca, tipo, precio y año.',
};

export const revalidate = 60; // el catálogo se actualiza cada minuto

export default async function CatalogoPage() {
  const cars = await getCars();
  return (
    <div className="container" style={{ padding: '40px 24px 64px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 className="h2">Autos seminuevos</h1>
        <p className="muted" style={{ margin: '8px 0 0', fontSize: 16 }}>Todos inspeccionados, con fotos reales, video y precio final.</p>
      </div>
      <CatalogClient cars={cars} />
    </div>
  );
}
