// Carwash: planes, servicios y precios. (Precios de prueba — ajusta aquí)

export const SIZES = [
  { id: 'auto', label: 'Auto', factor: 1 },
  { id: 'suv', label: 'SUV', factor: 1.2 },
  { id: 'camioneta', label: 'Camioneta', factor: 1.35 },
];

export const PERIODS = [
  { id: 'm1', label: 'Mensual', months: 1, discount: 0 },
  { id: 'm3', label: '3 meses', months: 3, discount: 10 },
  { id: 'm12', label: '12 meses', months: 12, discount: 20 },
];

export const PLANS = [
  { id: 'esencial', name: 'Esencial', price: 79, tag: '', features: ['4 lavados exteriores al mes', 'Secado a mano y brillo de llantas', 'Agenda desde tu celular'] },
  { id: 'plus', name: 'Plus', price: 139, tag: 'Recomendado', features: ['4 lavados completos al mes', 'Aspirado y limpieza de tablero', 'Aromatizado incluido'] },
  { id: 'ilimitado', name: 'Ilimitado', price: 229, tag: '', features: ['Lavado completo todos los días', '1 encerado al mes incluido', 'Atención preferente sin cola'] },
];

export const CATEGORIES = ['Exterior', 'Interior', 'Protección'];

export const SERVICES = [
  { id: 'encerado', cat: 'Exterior', name: 'Encerado', price: 45, desc: 'Cera protectora que da brillo y repele el agua y el polvo.' },
  { id: 'motor', cat: 'Exterior', name: 'Lavado de motor', price: 35, desc: 'Desengrasado y limpieza del compartimiento del motor.' },
  { id: 'chasis', cat: 'Exterior', name: 'Lavado de chasis', price: 30, desc: 'Retira barro y residuos de la parte baja del auto.' },
  { id: 'faros', cat: 'Exterior', name: 'Pulido de faros', price: 60, desc: 'Devuelve la transparencia a faros opacos o amarillentos.' },
  { id: 'tapiz', cat: 'Interior', name: 'Limpieza de tapiz', price: 120, desc: 'Lavado profundo de asientos, alfombras y techo.' },
  { id: 'cueros', cat: 'Interior', name: 'Hidratación de cueros', price: 70, desc: 'Limpia y nutre asientos de cuero para evitar grietas.' },
  { id: 'ozono', cat: 'Interior', name: 'Desinfección con ozono', price: 40, desc: 'Elimina olores, bacterias y hongos del habitáculo.' },
  { id: 'descontaminado', cat: 'Protección', name: 'Descontaminado de pintura', price: 90, desc: 'Arcilla y químicos para retirar partículas adheridas.' },
  { id: 'ceramico', cat: 'Protección', name: 'Tratamiento cerámico', price: 350, desc: 'Capa de protección de larga duración para la pintura.' },
];

export const soles = (n) => 'S/ ' + Math.round(n).toLocaleString('en-US');

const find = (list, id) => list.find((x) => x.id === id) || list[0];

// Calcula todo el carrito a partir del estado guardado
export function computeCart(state) {
  const size = find(SIZES, state.size);
  const period = find(PERIODS, state.period);
  const px = (n) => Math.round(n * size.factor);
  const pm = (n) => Math.round(px(n) * (100 - period.discount) / 100);
  const plan = state.plan ? PLANS.find((p) => p.id === state.plan) : null;
  const monthly = plan ? pm(plan.price) : 0;
  const planTotal = monthly * period.months;
  const lines = SERVICES.filter((s) => state.extras?.[s.id] > 0).map((s) => ({ ...s, qty: state.extras[s.id], unit: px(s.price), total: px(s.price) * state.extras[s.id] }));
  const extrasTotal = lines.reduce((a, l) => a + l.total, 0);
  const count = (plan ? 1 : 0) + lines.reduce((a, l) => a + l.qty, 0);
  return { size, period, plan, monthly, planTotal, lines, extrasTotal, total: planTotal + extrasTotal, count, px, pm };
}
