'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cart, Drop } from './Icons';

export default function Header() {
  const path = usePathname();
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
          <Link href="/carwash" className="icon-btn" aria-label="Carrito"><Cart /></Link>
          <Link href="/vende" className="btn btn-primary btn-sm hide-mobile">Cotiza tu auto</Link>
        </div>
      </div>
    </header>
  );
}
