'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BRANDS, YEARS, modelsOf } from '@/lib/pricing';

export default function QuickQuote() {
  const router = useRouter();
  const [brand, setBrand] = useState('Toyota');
  const [model, setModel] = useState(modelsOf('Toyota')[0]);
  const [year, setYear] = useState('2020');

  const submit = (e) => {
    e.preventDefault();
    const q = new URLSearchParams({ marca: brand, modelo: model, anio: year });
    router.push(`/vende?${q.toString()}`);
  };

  return (
    <form onSubmit={submit} aria-label="Cotización rápida" className="card" style={{ flex: '1 1 360px', minWidth: 0, padding: 28, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: 'var(--shadow-card)' }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 20, lineHeight: '28px', fontWeight: 800 }}>¿Cuánto vale tu auto?</h2>
        <p className="muted" style={{ margin: '4px 0 0', fontSize: 14 }}>Recibe dos ofertas sin compromiso.</p>
      </div>
      <label className="field">Marca
        <select className="input" value={brand} onChange={(e) => { setBrand(e.target.value); setModel(modelsOf(e.target.value)[0]); }}>
          {BRANDS.map((b) => <option key={b}>{b}</option>)}
        </select>
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
        <label className="field">Modelo
          <select className="input" value={model} onChange={(e) => setModel(e.target.value)}>
            {modelsOf(brand).map((m) => <option key={m}>{m}</option>)}
          </select>
        </label>
        <label className="field">Año
          <select className="input" value={year} onChange={(e) => setYear(e.target.value)}>
            {YEARS.map((y) => <option key={y}>{y}</option>)}
          </select>
        </label>
      </div>
      <button type="submit" className="btn btn-primary btn-block">Ver mis ofertas</button>
    </form>
  );
}
