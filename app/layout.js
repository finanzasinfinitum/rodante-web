import '@fontsource-variable/manrope';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: { default: 'Rodante — Compra, venta y cuidado de tu auto', template: '%s · Rodante' },
  description: 'Cotiza tu auto en 2 minutos, compra seminuevos con precio claro y suscríbete a tu carwash por membresía. Lima, Perú.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Header />
        <main style={{ minHeight: '60vh' }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
