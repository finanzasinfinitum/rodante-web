import Link from 'next/link';
import { SITE, waLink } from '@/lib/config';

export default function Footer() {
  const col = { display: 'flex', flexDirection: 'column', gap: 10 };
  const lnk = { color: '#b9c0c8', textDecoration: 'none' };
  return (
    <footer style={{ background: 'var(--ink)', color: '#fff' }}>
      <div className="container" style={{ padding: '48px 24px', display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'space-between' }}>
        <div style={{ ...col, gap: 8, maxWidth: 320 }}>
          <span style={{ fontWeight: 800, fontSize: 24, letterSpacing: '-0.03em' }}>{SITE.name}</span>
          <span style={{ fontSize: 14, lineHeight: '20px', color: '#b9c0c8' }}>{SITE.tagline} {SITE.city}.</span>
        </div>
        <nav aria-label="Pie de página" style={{ display: 'flex', gap: 48, flexWrap: 'wrap', fontSize: 14 }}>
          <div style={col}>
            <span style={{ fontWeight: 700 }}>Servicios</span>
            <Link href="/vende" style={lnk}>Vende tu auto</Link>
            <Link href="/catalogo" style={lnk}>Catálogo</Link>
            <Link href="/carwash" style={lnk}>Carwash</Link>
          </div>
          <div style={col}>
            <span style={{ fontWeight: 700 }}>Contacto</span>
            <a href={waLink('Hola Rodante, tengo una consulta.')} style={lnk} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <span style={{ color: '#b9c0c8' }}>{SITE.address}</span>
            <span style={{ color: '#b9c0c8' }}>{SITE.email}</span>
          </div>
          <div style={col}>
            <span style={{ fontWeight: 700 }}>Legal</span>
            <span style={{ color: '#b9c0c8' }}>Libro de Reclamaciones</span>
            <span style={{ color: '#b9c0c8' }}>Política de privacidad</span>
            <span style={{ color: '#b9c0c8' }}>Términos y condiciones</span>
          </div>
        </nav>
      </div>
    </footer>
  );
}
