'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import CarGallery from './CarGallery';
import CarCardBody, { CarThumb, Specs } from './CarCard';
import { BODY_TYPES, carName, interestMessage } from '@/lib/cars';
import { usd } from '@/lib/pricing';
import { waLink } from '@/lib/config';

const SORTS = {
  new: () => 0,
  low: (a, b) => a.price - b.price,
  high: (a, b) => b.price - a.price,
  km: (a, b) => a.km - b.km,
};

export default function CatalogClient({ cars }) {
  const [type, setType] = useState('Todos');
  const [brand, setBrand] = useState('Todas');
  const [maxPrice, setMaxPrice] = useState('0');
  const [minYear, setMinYear] = useState('0');
  const [trans, setTrans] = useState('Todas');
  const [sort, setSort] = useState('new');
  const [sel, setSel] = useState(null);

  const brands = useMemo(() => ['Todas', ...Array.from(new Set(cars.map((c) => c.brand))).sort()], [cars]);
  const list = useMemo(() => cars
    .filter((c) => (type === 'Todos' || c.body_type === type) && (brand === 'Todas' || c.brand === brand)
      && (maxPrice === '0' || c.price <= Number(maxPrice)) && c.year >= Number(minYear) && (trans === 'Todas' || c.transmission === trans))
    .slice().sort(SORTS[sort]), [cars, type, brand, maxPrice, minYear, trans, sort]);

  const reset = () => { setType('Todos'); setBrand('Todas'); setMaxPrice('0'); setMinYear('0'); setTrans('Todas'); };
  const idx = sel ? list.findIndex((c) => c.id === sel.id) : -1;
  const go = (d) => { if (list.length) setSel(list[(idx + d + list.length) % list.length]); };

  useEffect(() => {
    if (!sel) return;
    const onKey = (e) => { if (e.key === 'Escape') setSel(null); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [sel]);

  const pill = (on) => ({ height: 44, padding: '0 18px', borderRadius: 999, border: `1px solid ${on ? 'var(--brand)' : 'var(--line)'}`, background: on ? 'var(--brand-soft)' : '#fff', color: on ? 'var(--brand)' : 'var(--ink)', fontWeight: 700, fontSize: 14, cursor: 'pointer' });

  return (
    <>
      <div role="group" aria-label="Tipo de auto" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['Todos', ...BODY_TYPES].map((t) => <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)} style={pill(type === t)}>{t}</button>)}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
        <aside aria-label="Filtros" className="card" style={{ flex: '1 1 260px', minWidth: 0, padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Filtros</h2>
            <button type="button" onClick={reset} style={{ border: 0, background: 'none', padding: '8px 0', fontWeight: 700, fontSize: 14, color: 'var(--brand)', cursor: 'pointer' }}>Limpiar</button>
          </div>
          <label className="field">Marca
            <select className="input" value={brand} onChange={(e) => setBrand(e.target.value)}>{brands.map((b) => <option key={b}>{b}</option>)}</select>
          </label>
          <label className="field">Precio máximo
            <select className="input" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
              <option value="0">Sin límite</option><option value="15000">Hasta US$ 15,000</option><option value="20000">Hasta US$ 20,000</option><option value="25000">Hasta US$ 25,000</option><option value="35000">Hasta US$ 35,000</option>
            </select>
          </label>
          <label className="field">Año desde
            <select className="input" value={minYear} onChange={(e) => setMinYear(e.target.value)}>
              <option value="0">Cualquiera</option><option>2018</option><option>2020</option><option>2022</option>
            </select>
          </label>
          <label className="field">Transmisión
            <select className="input" value={trans} onChange={(e) => setTrans(e.target.value)}>
              <option>Todas</option><option>Automática</option><option>Mecánica</option>
            </select>
          </label>
        </aside>

        <section aria-label="Resultados" style={{ flex: '999 1 600px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span role="status" style={{ fontSize: 15, fontWeight: 700 }}>{list.length} {list.length === 1 ? 'auto disponible' : 'autos disponibles'}</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600 }} className="muted">Ordenar por
              <select className="input" style={{ width: 'auto', height: 44 }} value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="new">Más recientes</option><option value="low">Menor precio</option><option value="high">Mayor precio</option><option value="km">Menor kilometraje</option>
              </select>
            </label>
          </div>

          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {list.map((c, k) => (
              <article key={c.id} className="card card-hover" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <button type="button" onClick={() => setSel(c)} aria-label={`Ver ${carName(c)}`} style={{ padding: 0, border: 0, background: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', flex: 1, color: 'inherit' }}>
                  <CarThumb car={c} index={k} />
                  <CarCardBody car={c} />
                </button>
                <div style={{ padding: '0 20px 20px' }}>
                  <button type="button" onClick={() => setSel(c)} className="btn btn-ghost btn-sm btn-block" style={{ color: 'var(--brand)' }}>Ver fotos y video</button>
                </div>
              </article>
            ))}
          </div>

          {list.length === 0 && (
            <div className="card" style={{ borderStyle: 'dashed', padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 18 }}>No encontramos autos con esos filtros</h3>
              <p className="muted" style={{ margin: 0 }}>Prueba ampliando el precio o el año, o escríbenos y te avisamos cuando llegue uno.</p>
              <button type="button" onClick={reset} className="btn btn-primary btn-sm">Limpiar filtros</button>
            </div>
          )}
        </section>
      </div>

      {sel && (
        <div role="dialog" aria-modal="true" aria-label={`Detalle de ${carName(sel)}`} onClick={(e) => { if (e.target === e.currentTarget) setSel(null); }}
          style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(18,24,33,.6)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '40px 16px', overflowY: 'auto' }}>
          <article style={{ width: '100%', maxWidth: 1040, margin: 'auto 0', background: '#fff', borderRadius: 16, overflow: 'hidden', display: 'flex', flexWrap: 'wrap', boxShadow: '0 24px 64px rgba(18,24,33,.3)' }}>
            <div style={{ flex: '1 1 440px', minWidth: 0, padding: 16 }}><CarGallery key={sel.id} car={sel} /></div>
            <div style={{ flex: '1 1 320px', minWidth: 0, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                <h2 style={{ margin: 0, fontSize: 24, lineHeight: '32px', fontWeight: 800 }}>{carName(sel)}</h2>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flex: 'none' }}>
                  <button type="button" className="icon-btn" aria-label="Auto anterior" onClick={() => go(-1)}>‹</button>
                  <span className="muted" style={{ fontSize: 13, fontWeight: 700, minWidth: 40, textAlign: 'center' }}>{idx + 1} de {list.length}</span>
                  <button type="button" className="icon-btn" aria-label="Auto siguiente" onClick={() => go(1)}>›</button>
                  <button type="button" className="icon-btn" aria-label="Cerrar" onClick={() => setSel(null)}>✕</button>
                </div>
              </div>
              <span className="tabular" style={{ fontSize: 36, lineHeight: '40px', fontWeight: 800 }}>{usd(sel.price)}</span>
              <Specs car={sel} />
              {sel.description && <p className="muted" style={{ margin: 0, fontSize: 15, lineHeight: '22px', whiteSpace: 'pre-line' }}>{sel.description}</p>}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 'auto' }}>
                <a className="btn btn-primary" style={{ flex: '1 1 auto', whiteSpace: 'nowrap' }} href={waLink(interestMessage(sel) + ' ' + (typeof window !== 'undefined' ? `${window.location.origin}/catalogo/${sel.id}` : ''))} target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a>
                <Link className="btn btn-ghost" style={{ flex: '1 1 auto', whiteSpace: 'nowrap' }} href={`/catalogo/${sel.id}`}>Ver ficha completa</Link>
              </div>
            </div>
          </article>
        </div>
      )}
    </>
  );
}
