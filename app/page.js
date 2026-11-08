import Link from 'next/link';
import QuickQuote from '@/components/QuickQuote';
import { CarPlaceholder, Swap, CarIcon, Drop } from '@/components/Icons';

const LINES = [
  { href: '/vende', kicker: 'Vende tu auto', title: 'Te compramos tu auto', desc: 'Cotiza en línea y elige: pago inmediato o un mejor precio esperando unos días.', cta: 'Cotizar ahora', Icon: Swap },
  { href: '/catalogo', kicker: 'Compra un auto', title: 'Seminuevos revisados', desc: 'Filtra por marca, precio, año o tipo. Fotos, video y precio claro en cada ficha.', cta: 'Ver catálogo', Icon: CarIcon },
  { href: '/carwash', kicker: 'Carwash', title: 'Membresía de lavado', desc: 'Planes de 1, 3 o 12 meses más los servicios extra que necesites, en un solo carrito.', cta: 'Ver planes', Icon: () => <Drop size={24} /> },
];

const STEPS = [
  { n: 1, title: 'Cuéntanos de tu auto', desc: 'Marca, modelo, año, versión y lo que quieras destacar. Toma 2 minutos.' },
  { n: 2, title: 'Elige tu oferta', desc: 'Compra inmediata con pago en 24 h, o mejor precio si puedes esperar.' },
  { n: 3, title: 'Coordina por WhatsApp', desc: 'Un asesor agenda la inspección y firmamos la transferencia.' },
];

// Datos de prueba — en el paso 3 vendrán del catálogo real
const CARS = [
  { name: 'Toyota RAV4 XLE', meta: '2021 · 42,000 km · Automática', price: 'US$ 27,900', bg: '#e3efef' },
  { name: 'Hyundai Tucson GLS', meta: '2020 · 58,000 km · Automática', price: 'US$ 21,500', bg: '#fdf1d8' },
  { name: 'Kia Rio EX', meta: '2022 · 31,000 km · Mecánica', price: 'US$ 13,800', bg: '#ecebe6' },
];

export default function Home() {
  return (
    <>
      <section className="container" style={{ padding: '64px 24px 48px', display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
        <div style={{ flex: '999 1 520px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <span className="chip chip-brand kicker" style={{ alignSelf: 'flex-start' }}>Compra · Venta · Carwash</span>
          <h1 className="h1">Compra, vende y cuida tu auto en un solo lugar.</h1>
          <p className="muted" style={{ margin: 0, fontSize: 18, lineHeight: '28px', maxWidth: 560 }}>
            Cotiza tu auto en 2 minutos y véndelo hoy. Encuentra tu próximo seminuevo con precio claro. Y mantenlo impecable con tu membresía de lavado.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/vende" className="btn btn-primary">Cotiza tu auto</Link>
            <Link href="/catalogo" className="btn btn-ghost">Ver catálogo</Link>
          </div>
        </div>
        <QuickQuote />
      </section>

      <section className="container" style={{ paddingBottom: 64 }}>
        <div className="grid-auto">
          {LINES.map(({ href, kicker, title, desc, cta, Icon }) => (
            <Link key={href} href={href} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 28, textDecoration: 'none', color: 'var(--ink)' }}>
              <span style={{ display: 'inline-flex', width: 48, height: 48, borderRadius: 10, background: 'var(--brand-soft)', color: 'var(--brand)', alignItems: 'center', justifyContent: 'center' }}><Icon /></span>
              <span className="kicker muted">{kicker}</span>
              <span style={{ fontSize: 22, lineHeight: '28px', fontWeight: 800 }}>{title}</span>
              <span className="muted" style={{ fontSize: 15, lineHeight: '22px' }}>{desc}</span>
              <span style={{ marginTop: 'auto', fontWeight: 700, color: 'var(--brand)', fontSize: 15 }}>{cta} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ background: 'var(--surface-raised)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container" style={{ padding: '64px 24px', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div>
            <h2 className="h2">Vender tu auto, en 3 pasos</h2>
            <p className="muted" style={{ margin: '8px 0 0', fontSize: 16 }}>Sin anuncios, sin visitas de desconocidos, sin regateo.</p>
          </div>
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {STEPS.map((s) => (
              <div key={s.n} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ display: 'inline-flex', width: 36, height: 36, borderRadius: 999, background: 'var(--ink)', color: '#fff', fontWeight: 800, alignItems: 'center', justifyContent: 'center' }}>{s.n}</span>
                <h3 style={{ margin: 0, fontSize: 18, lineHeight: '26px', fontWeight: 700 }}>{s.title}</h3>
                <p className="muted" style={{ margin: 0, fontSize: 15, lineHeight: '22px' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '64px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
          <h2 className="h2">Recién ingresados</h2>
          <Link href="/catalogo" style={{ fontWeight: 700, fontSize: 15 }}>Ver todo el catálogo →</Link>
        </div>
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {CARS.map((c) => (
            <Link key={c.name} href="/catalogo" className="card card-hover" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', textDecoration: 'none', color: 'var(--ink)' }}>
              <div style={{ position: 'relative', aspectRatio: '4 / 3', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CarPlaceholder />
                <span className="chip chip-accent" style={{ position: 'absolute', top: 12, left: 12 }}>Nuevo ingreso</span>
              </div>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>{c.name}</span>
                <span className="muted" style={{ fontSize: 14 }}>{c.meta}</span>
                <span className="tabular" style={{ fontSize: 28, lineHeight: '32px', fontWeight: 800, marginTop: 8 }}>{c.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 64 }}>
        <div style={{ background: 'var(--brand)', color: '#fff', borderRadius: 16, padding: 48, display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 420px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="kicker" style={{ color: 'var(--brand-soft)' }}>Carwash por membresía</span>
            <h2 className="h2">Tu auto limpio todo el mes, con un solo pago.</h2>
            <p style={{ margin: 0, fontSize: 16, lineHeight: '24px', color: 'var(--brand-soft)' }}>Planes de 1, 3 o 12 meses. Suma servicios extra y agenda desde tu celular.</p>
          </div>
          <Link href="/carwash" className="btn btn-accent">Ver planes de lavado</Link>
        </div>
      </section>
    </>
  );
}
