'use client';
import { useEffect, useState, useCallback } from 'react';
import { supabase, supabaseReady } from '@/lib/supabase';
import { BODY_TYPES, TRANSMISSIONS, FUELS, STATUSES, carName } from '@/lib/cars';
import { BRANDS } from '@/lib/pricing';
import { usd } from '@/lib/pricing';

const EMPTY = { brand: 'Toyota', model: '', version: '', year: 2020, km: 0, price: 0, body_type: 'SUV', transmission: 'Automática', fuel: 'Gasolina', color: '', description: '', photos: [], video_url: '', badge: '', status: 'disponible', published: true };

// Reduce la foto a máx. 1600px y JPEG para que cargue rápido
async function shrink(file) {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height);
    return await new Promise((res) => canvas.toBlob((b) => res(b || file), 'image/jpeg', 0.82));
  } catch {
    return file;
  }
}

export default function AdminApp() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!supabaseReady) { setReady(true); return; }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const wrap = (children) => <div className="container" style={{ padding: '40px 24px 64px', display: 'flex', flexDirection: 'column', gap: 24 }}>{children}</div>;

  if (!supabaseReady) return wrap(
    <div className="card" style={{ padding: 32, maxWidth: 640 }}>
      <h1 className="h3">Panel de administración</h1>
      <p className="muted">Falta conectar la base de datos (Supabase). Agrega las variables <code>NEXT_PUBLIC_SUPABASE_URL</code> y <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> en Vercel y vuelve a publicar.</p>
    </div>
  );
  if (!ready) return wrap(<p className="muted">Cargando…</p>);
  if (!session) return wrap(<Login />);
  return wrap(<Dashboard email={session.user.email} />);
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError('Correo o contraseña incorrectos.');
    setBusy(false);
  };
  return (
    <form onSubmit={submit} className="card" style={{ padding: 32, maxWidth: 420, width: '100%', margin: '40px auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <h1 className="h3">Ingresar al panel</h1>
      <label className="field">Correo<input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
      <label className="field">Contraseña<input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></label>
      {error && <span className="error-text">{error}</span>}
      <button className="btn btn-primary" disabled={busy}>{busy ? 'Ingresando…' : 'Ingresar'}</button>
    </form>
  );
}

function Dashboard({ email }) {
  const [cars, setCars] = useState([]);
  const [editing, setEditing] = useState(null); // objeto auto o null
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false });
    if (error) setMsg('Error al cargar: ' + error.message); else setCars(data);
  }, []);
  useEffect(() => { load(); }, [load]);

  const quickStatus = async (car, status) => {
    const { error } = await supabase.from('cars').update({ status }).eq('id', car.id);
    if (error) setMsg('No se pudo actualizar: ' + error.message); else load();
  };
  const remove = async (car) => {
    if (!window.confirm(`¿Eliminar ${carName(car)} ${car.year}? Esta acción no se puede deshacer.`)) return;
    const { error } = await supabase.from('cars').delete().eq('id', car.id);
    if (error) setMsg('No se pudo eliminar: ' + error.message); else load();
  };

  if (editing) return <CarForm car={editing} onDone={(m) => { setEditing(null); setMsg(m || ''); load(); }} />;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 className="h2">Autos en catálogo</h1>
          <p className="muted" style={{ margin: '6px 0 0' }}>Sesión: {email} · <button type="button" onClick={() => supabase.auth.signOut()} style={{ border: 0, background: 'none', color: 'var(--brand)', fontWeight: 700, cursor: 'pointer', padding: 0 }}>Cerrar sesión</button></p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setEditing({ ...EMPTY })}>+ Agregar auto</button>
      </div>
      {msg && <div role="status" className="card" style={{ padding: 16, fontWeight: 600 }}>{msg}</div>}
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 720 }}>
          <thead><tr className="muted" style={{ textAlign: 'left' }}>
            {['Auto', 'Precio', 'Estado', 'Visible', ''].map((h) => <th key={h} style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', fontWeight: 700 }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {cars.map((c) => (
              <tr key={c.id}>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 72, height: 54, borderRadius: 6, background: 'var(--brand-soft)', overflow: 'hidden', flex: 'none' }}>{c.photos?.[0] && <img src={c.photos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}</div>
                    <div><div style={{ fontWeight: 700 }}>{carName(c)} {c.year}</div><div className="muted">{Number(c.km).toLocaleString('en-US')} km · {c.photos?.length || 0} fotos</div></div>
                  </div>
                </td>
                <td className="tabular" style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)', fontWeight: 700 }}>{usd(c.price)}</td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>
                  <select className="input" style={{ height: 40, width: 140 }} value={c.status} onChange={(e) => quickStatus(c, e.target.value)} aria-label="Estado">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>{c.published ? 'Sí' : 'Oculto'}</td>
                <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)', whiteSpace: 'nowrap' }}>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(c)}>Editar</button>{' '}
                  <button type="button" className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => remove(c)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {cars.length === 0 && <tr><td colSpan={5} className="muted" style={{ padding: 24, textAlign: 'center' }}>Aún no hay autos. Agrega el primero.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="muted" style={{ margin: 0, fontSize: 13 }}>Los cambios aparecen en la web en máximo 1 minuto. Los autos “vendidos” se ocultan del catálogo.</p>
    </>
  );
}

function CarForm({ car, onDone }) {
  const [f, setF] = useState({ ...EMPTY, ...car, color: car.color || '', description: car.description || '', video_url: car.video_url || '', badge: car.badge || '', version: car.version || '' });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState('');
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const upload = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    setUploading(files.length); setError('');
    const urls = [];
    for (const file of files) {
      const blob = await shrink(file);
      const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.jpg`;
      const { error } = await supabase.storage.from('autos').upload(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000' });
      if (error) { setError('No se pudo subir una foto: ' + error.message); continue; }
      urls.push(supabase.storage.from('autos').getPublicUrl(path).data.publicUrl);
      setUploading((n) => n - 1);
    }
    setUploading(0);
    setF((p) => ({ ...p, photos: [...p.photos, ...urls] }));
  };
  const movePhoto = (i, d) => setF((p) => { const a = [...p.photos]; const j = i + d; if (j < 0 || j >= a.length) return p; [a[i], a[j]] = [a[j], a[i]]; return { ...p, photos: a }; });
  const delPhoto = (i) => setF((p) => ({ ...p, photos: p.photos.filter((_, k) => k !== i) }));

  const save = async (e) => {
    e.preventDefault(); setBusy(true); setError('');
    const row = {
      brand: f.brand.trim(), model: f.model.trim(), version: f.version.trim() || null, year: Number(f.year), km: Number(f.km), price: Number(f.price),
      body_type: f.body_type, transmission: f.transmission, fuel: f.fuel, color: f.color.trim() || null, description: f.description.trim() || null,
      photos: f.photos, video_url: f.video_url.trim() || null, badge: f.badge.trim() || null, status: f.status, published: f.published,
    };
    const q = car.id ? supabase.from('cars').update(row).eq('id', car.id) : supabase.from('cars').insert(row);
    const { error } = await q;
    setBusy(false);
    if (error) setError('No se pudo guardar: ' + error.message);
    else onDone(car.id ? 'Cambios guardados.' : 'Auto agregado al catálogo.');
  };

  const g2 = { display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' };
  return (
    <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h1 className="h2">{car.id ? 'Editar auto' : 'Agregar auto'}</h1>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => onDone('')}>Cancelar</button>
      </div>

      <section className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Datos del auto</h2>
        <div style={g2}>
          <label className="field">Marca<input className="input" list="brands" required value={f.brand} onChange={set('brand')} /></label>
          <datalist id="brands">{BRANDS.map((b) => <option key={b} value={b} />)}</datalist>
          <label className="field">Modelo<input className="input" required value={f.model} onChange={set('model')} placeholder="Ej. RAV4" /></label>
          <label className="field">Versión<input className="input" value={f.version} onChange={set('version')} placeholder="Ej. XLE" /></label>
          <label className="field">Año<input className="input" type="number" required min="1990" max="2030" value={f.year} onChange={set('year')} /></label>
          <label className="field">Kilometraje<input className="input" type="number" required min="0" value={f.km} onChange={set('km')} /></label>
          <label className="field">Precio (US$)<input className="input" type="number" required min="1" value={f.price} onChange={set('price')} /></label>
          <label className="field">Tipo<select className="input" value={f.body_type} onChange={set('body_type')}>{BODY_TYPES.map((x) => <option key={x}>{x}</option>)}</select></label>
          <label className="field">Transmisión<select className="input" value={f.transmission} onChange={set('transmission')}>{TRANSMISSIONS.map((x) => <option key={x}>{x}</option>)}</select></label>
          <label className="field">Combustible<select className="input" value={f.fuel} onChange={set('fuel')}>{FUELS.map((x) => <option key={x}>{x}</option>)}</select></label>
          <label className="field">Color<input className="input" value={f.color} onChange={set('color')} placeholder="Ej. Blanco perla" /></label>
          <label className="field">Etiqueta<input className="input" list="badges" value={f.badge} onChange={set('badge')} placeholder="Opcional" /></label>
          <datalist id="badges"><option value="Nuevo ingreso" /><option value="Precio rebajado" /><option value="Único dueño" /></datalist>
          <label className="field">Estado<select className="input" value={f.status} onChange={set('status')}>{STATUSES.map((x) => <option key={x}>{x}</option>)}</select></label>
        </div>
        <label className="field">Descripción<textarea className="input" rows={5} value={f.description} onChange={set('description')} placeholder="Mantenimientos, equipamiento, estado, detalles…" /></label>
        <label style={{ display: 'flex', gap: 10, alignItems: 'center', fontWeight: 700, fontSize: 14 }}><input type="checkbox" checked={f.published} onChange={set('published')} style={{ width: 20, height: 20 }} />Visible en la web</label>
      </section>

      <section className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Fotos y video</h2>
        <p className="muted" style={{ margin: 0, fontSize: 14 }}>La primera foto es la portada. Usa las flechas para ordenar.</p>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
          {f.photos.map((src, i) => (
            <div key={src} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: `2px solid ${i === 0 ? 'var(--brand)' : 'var(--line)'}` }}>
              <img src={src} alt={`Foto ${i + 1}`} style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover' }} />
              {i === 0 && <span className="chip chip-brand" style={{ position: 'absolute', top: 6, left: 6 }}>Portada</span>}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 6, background: '#fff' }}>
                <span style={{ display: 'flex', gap: 4 }}>
                  <button type="button" className="icon-btn" style={{ width: 36, height: 36 }} aria-label="Mover a la izquierda" onClick={() => movePhoto(i, -1)}>‹</button>
                  <button type="button" className="icon-btn" style={{ width: 36, height: 36 }} aria-label="Mover a la derecha" onClick={() => movePhoto(i, 1)}>›</button>
                </span>
                <button type="button" className="icon-btn" style={{ width: 36, height: 36, color: 'var(--danger)' }} aria-label="Quitar foto" onClick={() => delPhoto(i)}>✕</button>
              </div>
            </div>
          ))}
          <label style={{ border: '2px dashed var(--line)', borderRadius: 10, minHeight: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', fontWeight: 700, color: 'var(--brand)', textAlign: 'center', padding: 12 }}>
            {uploading ? `Subiendo ${uploading}…` : '+ Subir fotos'}
            <span className="muted" style={{ fontWeight: 500, fontSize: 12 }}>Puedes elegir varias</span>
            <input type="file" accept="image/*" multiple onChange={upload} style={{ display: 'none' }} />
          </label>
        </div>
        <label className="field">Link del video (YouTube)<input className="input" value={f.video_url} onChange={set('video_url')} placeholder="https://youtu.be/…" />
          <span className="help">Sube el video a YouTube como “No listado” y pega el link aquí.</span>
        </label>
      </section>

      {error && <span className="error-text">{error}</span>}
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-primary" disabled={busy || uploading > 0}>{busy ? 'Guardando…' : 'Guardar'}</button>
        <button type="button" className="btn btn-ghost" onClick={() => onDone('')}>Cancelar</button>
      </div>
    </form>
  );
}
