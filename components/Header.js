'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cart, Drop } from './Icons';
import { useCart } from '@/lib/cartStore';
import { computeCart } from '@/lib/carwash';

export default function Header() {
  const path = usePathname();
  const count = computeCart(useCart()).count;
  const is = (p) => path === p || path.startsWith(p + '/');
  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="logo">Rodante</Link>
        <nav className="nav" aria-label="Principal">
          <Link href="/vende" className={`nav-link ${is('/vende') ? 'active' : ''}`} aria-current={is('/vende') ? 'page' : undefined}>Vende tu auto</Link>
          <Link href="/catalogo" className={`nav-link ${is('/catalogo') ? 'active' : ''}`} aria-current={is('/catalogo') ? 'page' : undefined}>Compra un auto</Link>
          <span className="nav-divider" aria-hidden="true" />
          <Link href="/carwash" className={`nav-wash ${is('/carwash') ? 'active' : ''}`} aria-current={is('/carwash') ? 'page' : undefined}><Drop />Carwash</Link>
        </nav>
        <div className="header-actions">
          <Link href="/carwash#carrito" className="icon-btn" aria-label={`Carrito, ${count} productos`} style={{ position: 'relative' }}>
            <Cart />
            {count > 0 && <span style={{ position: 'absolute', top: -6, right: -6, minWidth: 20, height: 20, padding: '0 5px', borderRadius: 999, background: 'var(--accent)', color: 'var(--ink)', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{count}</span>}
          </Link>
          <Link href="/vende" className="btn btn-primary btn-sm hide-mobile">Cotiza tu auto</Link>
        </div>
      </div>
    </header>
  );
}
