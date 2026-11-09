import CarwashClient from '@/components/CarwashClient';

export const metadata = {
  title: 'Carwash por membresía',
  description: 'Planes de lavado de 1, 3 o 12 meses para auto, SUV o camioneta, más servicios extra como encerado, tapiz y tratamiento cerámico.',
};

export default function CarwashPage() {
  return (
    <div className="container" style={{ padding: '40px 24px 64px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      <CarwashClient />
    </div>
  );
}
