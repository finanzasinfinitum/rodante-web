'use client';
import { useMemo, useRef, useState } from 'react';
import { BRANDS, YEARS, RULES, modelsOf, versionsOf, estimateOffers, usd } from '@/lib/pricing';
import { waLink } from '@/lib/config';
import { Bolt, Check, Clock, Chat } from './Icons';

const DOCS = ['Tarjeta de propiedad', 'DNI del titular (o poder notarial)', 'SOAT y revisión técnica vigentes', 'Duplicado de llaves y manual, si los tienes'];

export default function SellForm({ initial = {} }) {
  const startBrand = BRANDS.includes(initial.marca) ? initial.marca : 'Toyota';
  const startModel = modelsOf(startBrand).includes(initial.modelo) ? initial.modelo : modelsOf(startBrand)[0];
  const startYear = YEARS.includes(initial.anio) ? initial.anio : '2020';

  const [brand, setBrand] = useState(startBrand);
  const [model, setModel] = useState(startModel);
  const [year, setYear] = useState(startYear);
  const [version, setVersion] = useState('');
  const [km, setKm] = useState('60000');
  const [trans, setTrans] = useState('Automática');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [versionError, setVersionError] = useState(false);
  const [choice, setChoice] = useState('');
  const offersRef = useRef(null);

  const offers = useMemo(() => estimateOffers({ brand, model, year, version, km }), [brand, model, year, version, km]);
  const carName = `${brand} ${model} ${version} ${year}`.replace(/\s+/g, ' ');
  const stage = choice ? 3 : submitted ? 2 : 1;

  const reset = () => { setSubmitted(false); setChoice(''); };

  const submit = (e) => {
    e.preventDefault();
    if (!version) { setVersionError(true); return; }
    setSubmitted(true);
    setChoice('');
    setTimeout(() => offersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const choose = (c) => {
    setChoice(c);
    const label = c === 'imm' ? `compra inmediata por ${usd(offers.immediate)}` : `venta con espera por ${usd(offers.wait)}`;
    const msg = `Hola Rodante, quiero vender mi ${carName}, ${Number(km).toLocaleString('en-US')} km, ${trans.toLowerCase()}. Elegí ${label}.${notes ? ' Detalles: ' + notes : ''}`;
    window.open(waLink(msg), '_blank', 'noopener');
  };

  const steps = ['Tu auto', 'Ofertas', 'Coordinar por WhatsApp'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <ol aria-label="Progreso" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {steps.map((l, i) => {
          const on = i + 1 <= stage;
          return (
            <li key={l} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px 8px 8px', borderRadius: 999, background: on ? 'var(--brand-soft)' : '#fff', color: on ? 'var(--brand-strong)' : 'var(--ink-muted)', fontSize: 14, fontWeight: 700 }}>
              <span style={{ display: 'inline-flex', width: 24, height: 24, borderRadius: 999, alignItems: 'center', justifyContent: 'center', background: on ? 'var(--brand)' : 'var(--line)', color: on ? '#fff' : 'var(--ink-muted)', fontSize: 12 }}>{i + 1}</span>{l}
            </li>
          );
        })}
      </ol>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
        <form onSubmit={submit} aria-label="Datos del auto" className="card" style={{ flex: '999 1 560px', minWidth: 0, padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <h2 className="h3">Datos de tu auto</h2>
          <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <label className="field">Marca
              <select className="input" value={brand} onChange={(e) => { const b = e.target.value; setBrand(b); setModel(modelsOf(b)[0]); setVersion(''); reset(); }}>
                {BRANDS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </label>
            <label className="field">Modelo
              <select className="input" value={model} onChange={(e) => { setModel(e.target.value); setVersion(''); reset(); }}>
                {modelsOf(brand).map((m) => <option key={m}>{m}</option>)}
              </select>
            </label>
            <label className="field">Año
              <select className="input" value={year} onChange={(e) => { setYear(e.target.value); reset(); }}>
                {YEARS.map((y) => <option key={y}>{y}</option>)}
              </select>
            </label>
            <label className="field">Versión
              <select className={`input ${versionError ? 'error' : ''}`} value={version} aria-invalid={versionError} onChange={(e) => { setVersion(e.target.value); setVersionError(false); reset(); }}>
                <option value="">Selecciona</option>
                {versionsOf(brand, model).map((v) => <option key={v}>{v}</option>)}
              </select>
              {versionError && <span className="error-text">Elige la versión para calcular tu oferta.</span>}
            </label>
            <label className="field">Kilometraje
              <input className="input" type="number" inputMode="numeric" min="0" value={km} onChange={(e) => { setKm(e.target.value); reset(); }} placeholder="Ej. 60000" />
            </label>
            <label className="field">Transmisión
              <select className="input" value={trans} onChange={(e) => setTrans(e.target.value)}>
                <option>Automática</option><option>Mecánica</option>
              </select>
            </label>
          </div>
          <label className="field">Cuéntanos más de tu auto
            <textarea className="input" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ej. Único dueño, mantenimientos en concesionario, llantas nuevas, un rayón en la puerta trasera…" />
            <span className="help">Mientras más detalles, más precisa será la oferta.</span>
          </label>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <button type="submit" className="btn btn-primary">Ver mis ofertas</button>
            <span className="muted" style={{ fontSize: 14 }}>Sin compromiso. No pedimos tus datos para cotizar.</span>
          </div>
        </form>

        <aside style={{ flex: '1 1 300px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 style={{ margin: 0, fontSize: 18, lineHeight: '26px', fontWeight: 700 }}>Para la inspección ten a la mano</h2>
            {DOCS.map((d) => <div key={d} className="check-row"><Check /><span>{d}</span></div>)}
          </div>
          <div style={{ background: 'var(--brand-soft)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 8, color: 'var(--brand-strong)' }}>
            <h2 style={{ margin: 0, fontSize: 18, lineHeight: '26px', fontWeight: 700 }}>¿Prefieres hablar con alguien?</h2>
            <p style={{ margin: 0, fontSize: 15, lineHeight: '22px' }}>Escríbenos por WhatsApp y un asesor te cotiza en minutos.</p>
            <a href={waLink('Hola Rodante, quiero cotizar mi auto.')} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, fontSize: 15 }}>Abrir WhatsApp →</a>
          </div>
        </aside>
      </div>

      {submitted && offers && (
        <section ref={offersRef} aria-label="Tus ofertas" style={{ display: 'flex', flexDirection: 'column', gap: 20, scrollMarginTop: 96 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 28, lineHeight: '34px', fontWeight: 800, letterSpacing: '-0.02em' }}>Tus ofertas para el {carName}</h2>
            <p className="muted" style={{ margin: '6px 0 0', fontSize: 15 }}>Ofertas referenciales. El precio final se confirma en la inspección.</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'stretch' }}>
            <div style={{ flex: '3 1 420px', minWidth: 0, background: '#fff', border: '2px solid var(--brand)', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ background: 'var(--brand)', color: '#fff', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span className="chip chip-accent kicker" style={{ alignSelf: 'flex-start' }}>Recomendado · Pago en 24 h</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Bolt /><span style={{ fontSize: 22, fontWeight: 800 }}>Compra inmediata</span></div>
                <span style={{ fontSize: 15, color: 'var(--brand-soft)', fontWeight: 600 }}>Te compramos tu auto hoy, a precio fijo</span>
                <span className="tabular" style={{ fontSize: 52, lineHeight: '56px', fontWeight: 800, letterSpacing: '-0.03em' }}>{usd(offers.immediate)}</span>
              </div>
              <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                {['Pago en 24 horas después de la inspección', 'Nos encargamos de la transferencia y trámites', 'Precio fijo: sin publicar ni esperar compradores'].map((b) => <div key={b} className="check-row"><Check /><span>{b}</span></div>)}
                <button type="button" onClick={() => choose('imm')} className="btn btn-accent" style={{ marginTop: 'auto', height: 56, fontSize: 17 }}>Quiero vender ya</button>
              </div>
            </div>
            <div style={{ flex: '2 1 300px', minWidth: 0, background: '#fff', border: `1px solid ${choice === 'wait' ? 'var(--brand)' : 'var(--line)'}`, borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '28px 28px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="muted" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Clock /><span style={{ fontSize: 16, fontWeight: 700 }}>¿Puedes esperar?</span></div>
                <span style={{ fontSize: 18, fontWeight: 800 }}>Venta con espera</span>
                <span className="muted" style={{ fontSize: 14, fontWeight: 600 }}>Pago en hasta {RULES.waitDays} días</span>
                <span className="tabular" style={{ fontSize: 30, lineHeight: '36px', fontWeight: 800 }}>{usd(offers.wait)}</span>
              </div>
              <div style={{ padding: '16px 28px 24px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                {['Exhibimos y publicamos tu auto en nuestro catálogo', `Te pagamos apenas se vende, en un máximo de ${RULES.waitDays} días`, `Si no se vende en ${RULES.waitDays} días, te lo compramos al precio inmediato`].map((b) => <div key={b} className="check-row"><Check /><span>{b}</span></div>)}
                <button type="button" onClick={() => choose('wait')} className="btn btn-ghost" style={{ marginTop: 'auto', height: 48, fontSize: 15 }}>Prefiero esperar</button>
              </div>
            </div>
          </div>

          {choice && (
            <div role="status" className="card" style={{ padding: '24px 28px', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', width: 44, height: 44, borderRadius: 999, background: 'var(--success)', color: '#fff', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Check color="#fff" size={22} /></span>
              <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>Listo, elegiste {choice === 'imm' ? `compra inmediata por ${usd(offers.immediate)}` : `venta con espera por ${usd(offers.wait)}`}</span>
                <span className="muted" style={{ fontSize: 15, lineHeight: '22px' }}>Abrimos WhatsApp con los datos de tu auto. Si no se abrió, usa el botón.</span>
              </div>
              <button type="button" onClick={() => choose(choice)} className="btn btn-primary"><Chat />Abrir WhatsApp</button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
