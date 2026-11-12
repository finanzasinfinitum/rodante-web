// Utilidades de autos (sirven en navegador y servidor)
import { usd } from './pricing';

export const BODY_TYPES = ['SUV', 'Sedán', 'Hatchback', 'Pickup'];

export function carName(c) {
  return [c.brand, c.model, c.version].filter(Boolean).join(' ');
}

export function interestMessage(car) {
  return `Hola Rodante, me interesa el ${carName(car)} ${car.year} (${usd(car.price)}) que vi en la web.`;
}

// Las fotos viven en Google Drive; la web las sirve optimizadas desde /api/foto
export function photoUrl(id, w = 1600) {
  return `/api/foto/${id}?w=${w}`;
}

export function youtubeId(url) {
  if (!url) return null;
  const m = String(url).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}
