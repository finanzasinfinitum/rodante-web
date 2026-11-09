'use client';
import { useState } from 'react';
import { useCart, setCart, setExtraQty, clearCart } from '@/lib/cartStore';
import { SIZES, PERIODS, PLANS, CATEGORIES, SERVICES, computeCart, soles } from '@/lib/carwash';
import { waLink } from '@/lib/config';
import { Check, Chat } from './Icons';

const PLACA_RE = /^[A-Z0-9]{3}-?[A-Z0-9]{3}$/;

// Arma el mensaje de WhatsApp con el pedido. Cuando haya pasarela, aquí se cambia por el checkout.
function orderMessage(c, cart) {
  const rows = [];
  if (c.plan) rows.push(`• Plan ${c.plan.name} · ${c.period.label} (${c.size.label}): ${soles(c.planTotal)}${c.period.months > 1 ? ` (${soles(c.monthly)}/mes)` : ''}`);
  c.lines.forEach((l) => rows.push(`• ${l.name} x${l.qty}: ${soles(l.total)}`));
  return [
    'Hola Rodante, quiero contratar:',
    ...rows,
    `Total: ${soles(c.total)}`,
    `Vehículo: ${c.size.label}${cart.placa ? ` · Placa ${cart.placa}` : ''}`,
    `Nombre: ${cart.nombre}`,
  ].join('\n');
}

export default function CarwashClient() {
  const cart = useCart();
  const c = computeCart(cart);
  const [cat, setCat] = useState('Todos');
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const segBtn = (on) => ({ height: 40, padding: '0 14px', border: 0, borderRadius: 8, background: on ? 'var(--brand)' : 'transparent', color: on ? '#fff' : 'var(--ink)', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 });
  const pill = (on) => ({ height: 40, padding: '0 14px', borderRadius: 999, border: `1px solid ${on ? 'var(--brand)' : 'var(--line)'}`, background: on ? 'var(--brand-soft)' : '#fff', color: on ? 'var(--brand)' : 'var(--ink)', fontWeight: 700, fontSize: 13, cursor: 'pointer' });

  const confirm = () => {
    const e = {};
    if (!cart.nombre.trim()) e.nombre = 'Escribe tu nombre.';
    if (c.plan && !PLACA_RE.test(cart.placa)) e.placa = 'Escribe una placa válida, ej. ABC-123.';
    setErrors(e);
    if (Object.keys(e).length) return;
    window.open(waLink(orderMessage(c, cart)), '_blank', 'noopener');
    setSent(true);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ maxWidth: 640 }}>
          <h1 className="h2">Carwash por membresía</h1>
          <p className="muted" style={{ margin: '8px 0 0', fontSize: 16, lineHeight: '24px' }}>Elige tu plan y suma los servicios extra que necesites. Todo queda en tu carrito.</p>
        </div>
        <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
          <legend style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Tipo de vehículo</legend>
          <div style={{ display: 'flex', gap: 4, background: '#fff', border: '1px solid var(--line)', padding: 4, borderRadius: 12 }}>
            {SIZES.map((s) => <button key={s.id} type="button" aria-pressed={cart.size === s.id} onClick={() => setCart({ size: s.id })} style={segBtn(cart.size === s.id)}>{s.label}</button>)}
          </div>
        </fieldset>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ flex: '999 1 620px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 40 }}>
          <section aria-label="Planes" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <h2 className="h3">1. Elige tu plan</h2>
              <div role="group" aria-label="Duración del plan" style={{ display: 'flex', gap: 4, background: '#fff', border: '1px solid var(--line)', padding: 4, borderRadius: 12, flexWrap: 'wrap' }}>
                {PERIODS.map((p) => (
                  <button key={p.id} type="button" aria-pressed={cart.period === p.id} onClick={() => setCart({ period: p.id })} style={segBtn(cart.period === p.id)}>
                    {p.label}{p.discount > 0 && <span className="chip-accent" style={{ fontSize: 11, fontWeight: 800, padding: '2px 6px', borderRadius: 6 }}>−{p.discount}%</span>}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              {PLANS.map((p) => {
                const on = cart.plan === p.id;
                return (
                  <div key={p.id} style={{ background: '#fff', border: `2px solid ${on ? 'var(--brand)' : 'var(--line)'}`, borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 26 }}>
                      <span style={{ fontSize: 18, fontWeight: 800 }}>{p.name}</span>
                      {p.tag && <span className="chip chip-accent">{p.tag}</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
                      <span className="tabular" style={{ fontSize: 32, lineHeight: '36px', fontWeight: 800 }}>{soles(c.pm(p.price))}</span>
                      <span className="muted" style={{ fontSize: 14, fontWeight: 600 }}>/mes</span>
                      {c.period.discount > 0 && <s className="muted" style={{ fontSize: 14, fontWeight: 600 }}>{soles(c.px(p.price))}</s>}
                    </div>
                    <span className="muted" style={{ fontSize: 13, fontWeight: 600, marginTop: -8 }}>{c.period.months > 1 ? `${soles(c.pm(p.price) * c.period.months)} en total por ${c.period.label}` : 'Pago mes a mes'}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {p.features.map((f) => <div key={f} className="check-row" style={{ fontSize: 14, lineHeight: '20px' }}><Check size={18} /><span>{f}</span></div>)}
                    </div>
                    <button type="button" aria-pressed={on} onClick={() => setCart({ plan: on ? '' : p.id })} className={`btn ${on ? 'btn-primary' : 'btn-ghost'}`} style={{ marginTop: 'auto', height: 48, fontSize: 15, ...(on ? {} : { color: 'var(--brand)', borderColor: 'var(--brand)' }) }}>{on ? 'Plan elegido' : 'Elegir plan'}</button>
                  </div>
                );
              })}
            </div>
          </section>

          <section aria-label="Servicios extra" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <h2 className="h3">2. Agrega servicios extra</h2>
              <div role="group" aria-label="Categoría" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Todos', ...CATEGORIES].map((k) => <button key={k} type="button" aria-pressed={cat === k} onClick={() => setCat(k)} style={pill(cat === k)}>{k}</button>)}
              </div>
            </div>
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
              {SERVICES.filter((s) => cat === 'Todos' || s.cat === cat).map((s) => {
                const q = cart.extras[s.id] || 0;
                return (
                  <div key={s.id} className="card card-hover" style={{ borderColor: q ? 'var(--brand)' : 'var(--line)', padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{s.name}</div>
                      <div className="kicker muted" style={{ marginTop: 2 }}>{s.cat}</div>
                    </div>
                    <p className="muted" style={{ margin: 0, fontSize: 14, lineHeight: '20px' }}>{s.desc}</p>
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6 }}>
                      <span className="tabular" style={{ fontSize: 20, fontWeight: 800 }}>{soles(c.px(s.price))}</span>
                      {q > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--brand)', borderRadius: 10, overflow: 'hidden' }}>
                          <button type="button" aria-label={`Quitar un ${s.name}`} onClick={() => setExtraQty(s.id, q - 1)} style={{ width: 44, height: 40, border: 0, background: 'var(--brand-soft)', color: 'var(--brand)', fontWeight: 800, fontSize: 18, cursor: 'pointer' }}>−</button>
                          <span style={{ minWidth: 32, textAlign: 'center', fontWeight: 800, color: 'var(--brand)' }}>{q}</span>
                          <button type="button" aria-label={`Agregar un ${s.name}`} onClick={() => setExtraQty(s.id, q + 1)} style={{ width: 44, height: 40, border: 0, background: 'var(--brand-soft)', color: 'var(--brand)', fontWeight: 800, fontSize: 18, cursor: 'pointer' }}>+</button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => setExtraQty(s.id, 1)} className="btn btn-ghost btn-sm" style={{ height: 40, color: 'var(--brand)', borderColor: 'var(--brand)' }}>Agregar</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <aside id="carrito" aria-label="Tu carrito" className="card" style={{ flex: '1 1 320px', minWidth: 0, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: 'var(--shadow-card)', scrollMarginTop: 96 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Tu carrito</h2>
            <span className="muted" style={{ fontSize: 14, fontWeight: 600 }}>Precios para {c.size.label}</span>
          </div>

          {c.count === 0 && <p className="muted" style={{ margin: 0, padding: '24px 0', textAlign: 'center', fontSize: 15 }}>Tu carrito está vacío. Elige un plan o agrega un servicio.</p>}

          {c.plan && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: 16, borderBottom: '1px solid var(--line)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>Plan {c.plan.name}</div>
                <div className="muted" style={{ fontSize: 13 }}>{c.period.months > 1 ? `${c.period.label} · ${soles(c.monthly)}/mes` : 'Mensual'}</div>
              </div>
              <span className="tabular" style={{ fontSize: 15, fontWeight: 700 }}>{soles(c.planTotal)}</span>
              <button type="button" aria-label="Quitar plan" onClick={() => setCart({ plan: '' })} style={{ width: 32, height: 32, border: 0, background: 'none', cursor: 'pointer', color: 'var(--ink-muted)' }}>✕</button>
            </div>
          )}

          {c.lines.map((l) => (
            <div key={l.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{l.name}</div>
                <div className="muted" style={{ fontSize: 13 }}>{l.qty} × {soles(l.unit)}</div>
              </div>
              <span className="tabular" style={{ fontSize: 15, fontWeight: 700 }}>{soles(l.total)}</span>
              <button type="button" aria-label={`Quitar ${l.name}`} onClick={() => setExtraQty(l.id, 0)} style={{ width: 32, height: 32, border: 0, background: 'none', cursor: 'pointer', color: 'var(--ink-muted)' }}>✕</button>
            </div>
          ))}

          {c.count > 0 && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 16, borderTop: '1px solid var(--line)', fontSize: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="muted">Membresía ({c.period.label.toLowerCase()})</span><span className="tabular" style={{ fontWeight: 700 }}>{soles(c.planTotal)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="muted">Servicios extra</span><span className="tabular" style={{ fontWeight: 700 }}>{soles(c.extrasTotal)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 8 }}><span style={{ fontSize: 16, fontWeight: 800 }}>Total</span><span className="tabular" style={{ fontSize: 28, lineHeight: '32px', fontWeight: 800 }}>{soles(c.total)}</span></div>
              </div>

              <label className="field">Tu nombre
                <input className={`input ${errors.nombre ? 'error' : ''}`} value={cart.nombre} onChange={(e) => setCart({ nombre: e.target.value })} autoComplete="name" placeholder="Ej. Carla Pérez" />
                {errors.nombre && <span className="error-text">{errors.nombre}</span>}
              </label>
              {c.plan && (
                <label className="field">Placa del vehículo
                  <input className={`input ${errors.placa ? 'error' : ''}`} value={cart.placa} onChange={(e) => setCart({ placa: e.target.value.toUpperCase().slice(0, 7) })} placeholder="Ej. ABC-123" style={{ fontWeight: 800, fontSize: 18, letterSpacing: '0.08em' }} />
                  {errors.placa ? <span className="error-text">{errors.placa}</span> : <span className="help">La membresía queda asociada a esta placa.</span>}
                </label>
              )}

              <button type="button" onClick={confirm} className="btn btn-primary btn-block"><Chat />Confirmar por WhatsApp</button>
              <span className="muted" style={{ fontSize: 13, lineHeight: '18px', textAlign: 'center' }}>Te respondemos para coordinar el pago (Yape, Plin o transferencia) y agendar tu primer lavado.</span>

              {sent && (
                <div role="status" style={{ background: 'var(--brand-soft)', color: 'var(--brand-strong)', borderRadius: 10, padding: 14, fontSize: 14, lineHeight: '20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <strong>Listo, abrimos WhatsApp con tu pedido.</strong>
                  <span>Si no se abrió, toca de nuevo el botón. ¿Ya lo enviaste?</span>
                  <button type="button" onClick={() => { clearCart(); setSent(false); }} style={{ alignSelf: 'flex-start', border: 0, background: 'none', padding: 0, color: 'var(--brand)', fontWeight: 700, cursor: 'pointer' }}>Vaciar carrito</button>
                </div>
              )}
            </>
          )}
        </aside>
      </div>
    </>
  );
}
