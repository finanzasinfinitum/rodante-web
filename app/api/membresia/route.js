import { googleReady, scriptGet, scriptPost } from '@/lib/google';
import { computeCart } from '@/lib/carwash';

// POST: guarda el pedido del carwash en la hoja "Membresías"
export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return Response.json({ ok: false }, { status: 400 }); }
  const nombre = String(body.nombre || '').trim().slice(0, 80);
  const celular = String(body.celular || '').replace(/\D/g, '').slice(-9);
  const placa = String(body.placa || '').toUpperCase().slice(0, 8);
  if (!nombre || !/^9\d{8}$/.test(celular)) return Response.json({ ok: false, error: 'datos inválidos' }, { status: 400 });

  // El total se recalcula aquí para que no se pueda alterar desde el navegador
  const c = computeCart({ size: body.size, period: body.period, plan: body.plan, extras: body.extras || {} });
  if (c.count === 0) return Response.json({ ok: false, error: 'carrito vacío' }, { status: 400 });

  const row = {
    nombre, celular, placa,
    vehiculo: c.size.label,
    plan: c.plan ? c.plan.name : '',
    periodo: c.plan ? c.period.label : '',
    meses: c.plan ? c.period.months : '',
    total: c.total,
    detalle: c.lines.map((l) => `${l.name} x${l.qty}`).join(', '),
  };

  if (!googleReady) { console.log('Pedido (Google no conectado):', row); return Response.json({ ok: true, demo: true }); }
  try {
    await scriptPost('membership', row);
    return Response.json({ ok: true });
  } catch (e) {
    console.error('No se pudo guardar el pedido:', e.message);
    return Response.json({ ok: false }, { status: 502 });
  }
}

// GET ?placa=ABC123 : consulta el estado de una membresía (sin datos personales)
export async function GET(request) {
  const placa = new URL(request.url).searchParams.get('placa') || '';
  if (!googleReady) return Response.json({ found: false, demo: true });
  try {
    return Response.json(await scriptGet('placa', { placa }, 0));
  } catch {
    return Response.json({ found: false, error: true }, { status: 502 });
  }
}
