'use client';
import { useState } from 'react';
import Link from 'next/link';
import { waLink } from '@/lib/config';

const COLORS = {
  Activa: ['#e3f1e5', '#2f6b3a'],
  'Por vencer': ['#fde4cc', '#8a3d00'],
  Pendiente: ['#fdf1d8', '#7a5300'],
  Vencida: ['#fbe1df', '#b42318'],
};

export default function PlacaLookup() {
  const [placa, setPlaca] = useState('');
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState(null);

  const buscar = async (e) => {
    e.preventDefault();
    if (placa.replace(/[^A-Z0-9]/g, '').length < 5) { setRes({ invalid: true }); return; }
    setBusy(true); setRes(null);
    try {
      const r = await fetch(`/api/membresia?placa=${encodeURIComponent(placa)}`);
      setRes(await r.json());
    } catch { setRes({ error: true }); }
    setBusy(false);
  };

  const [bg, fg] = COLORS[res?.estado] || ['#eef0f2', '#5b6470'];

  return (
    <>
      <form onSubmit={buscar} className="card" style={{ padding: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <label className="field" style={{ flex: '1 1 220px' }}>Placa
          <input className="input" value={placa} onChange={(e) => setPlaca(e.target.value.toUpperCase().slice(0, 7))} placeholder="ABC-123" style={{ fontWeight: 800, fontSize: 20, letterSpacing: '0.08em' }} />
        </label>
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Buscando…' : 'Consultar'}</button>
      </form>

      {res?.invalid && <p className="error-text" style={{ margin: 0 }}>Escribe una placa válida, ej. ABC-123.</p>}
      {res?.error && <p className="error-text" style={{ margin: 0 }}>No pudimos consultar en este momento. Intenta de nuevo en unos minutos.</p>}

      {res && !res.invalid && !res.error && (res.found ? (
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ alignSelf: 'flex-start', background: bg, color: fg, fontWeight: 800, fontSize: 14, padding: '6px 12px', borderRadius: 999 }}>{res.estado}</span>
          <span style={{ fontSize: 24, fontWeight: 800 }}>Plan {res.plan}</span>
          <span className="muted" style={{ fontSize: 15 }}>{res.periodo}{res.vence ? ` · Vigente hasta el ${res.vence}` : ''}</span>
          {res.estado === 'Pendiente' && <span style={{ fontSize: 15 }}>Recibimos tu pedido. Se activa cuando confirmemos tu pago.</span>}
          {(res.estado === 'Vencida' || res.estado === 'Por vencer') && <Link href="/carwash" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Renovar membresía</Link>}
        </div>
      ) : (
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>No encontramos una membresía para esa placa</span>
          <span className="muted" style={{ fontSize: 15 }}>Revisa que esté bien escrita, o elige un plan.</span>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/carwash" className="btn btn-primary btn-sm">Ver planes</Link>
            <a href={waLink(`Hola Rodante, quiero consultar la membresía de la placa ${placa}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">Escribir por WhatsApp</a>
          </div>
        </div>
      ))}
    </>
  );
}
