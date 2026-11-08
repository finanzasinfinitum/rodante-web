import { supabase, supabaseReady } from './supabase';
import { usd } from './pricing';

// Autos de muestra: se usan solo mientras Supabase no esté configurado.
export const DEMO_CARS = [
  { id: 'demo-1', brand: 'Toyota', model: 'RAV4', version: 'XLE', year: 2021, km: 42000, price: 27900, body_type: 'SUV', transmission: 'Automática', fuel: 'Gasolina', badge: 'Nuevo ingreso', photos: [], video_url: null, status: 'disponible', description: 'Auto de muestra.' },
  { id: 'demo-2', brand: 'Hyundai', model: 'Tucson', version: 'GLS', year: 2020, km: 58000, price: 21500, body_type: 'SUV', transmission: 'Automática', fuel: 'Gasolina', badge: null, photos: [], video_url: null, status: 'disponible', description: 'Auto de muestra.' },
  { id: 'demo-3', brand: 'Kia', model: 'Rio', version: 'EX', year: 2022, km: 31000, price: 13800, body_type: 'Hatchback', transmission: 'Mecánica', fuel: 'Gasolina', badge: 'Precio rebajado', photos: [], video_url: null, status: 'disponible', description: 'Auto de muestra.' },
  { id: 'demo-4', brand: 'Toyota', model: 'Corolla', version: 'XEI', year: 2019, km: 76000, price: 16900, body_type: 'Sedán', transmission: 'Automática', fuel: 'Gasolina', badge: null, photos: [], video_url: null, status: 'reservado', description: 'Auto de muestra.' },
  { id: 'demo-5', brand: 'Nissan', model: 'Frontier', version: 'LE 4x4', year: 2021, km: 64000, price: 31500, body_type: 'Pickup', transmission: 'Mecánica', fuel: 'Diésel', badge: 'Nuevo ingreso', photos: [], video_url: null, status: 'disponible', description: 'Auto de muestra.' },
  { id: 'demo-6', brand: 'Mazda', model: 'CX-5', version: 'Grand Touring', year: 2022, km: 35000, price: 29900, body_type: 'SUV', transmission: 'Automática', fuel: 'Gasolina', badge: null, photos: [], video_url: null, status: 'disponible', description: 'Auto de muestra.' },
];

export const BODY_TYPES = ['SUV', 'Sedán', 'Hatchback', 'Pickup'];
export const TRANSMISSIONS = ['Automática', 'Mecánica'];
export const FUELS = ['Gasolina', 'Diésel', 'Híbrido', 'Eléctrico', 'GLP', 'GNV'];
export const STATUSES = ['disponible', 'reservado', 'vendido'];

export function carName(c) {
  return [c.brand, c.model, c.version].filter(Boolean).join(' ');
}

export function interestMessage(car) {
  return `Hola Rodante, me interesa el ${carName(car)} ${car.year} (${usd(car.price)}) que vi en la web.`;
}

export function youtubeId(url) {
  if (!url) return null;
  const m = String(url).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

// Lista pública: publicados y no vendidos, más recientes primero
export async function getCars() {
  if (!supabaseReady) return DEMO_CARS;
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('published', true)
    .neq('status', 'vendido')
    .order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data;
}

export async function getCar(id) {
  if (!supabaseReady) return DEMO_CARS.find((c) => c.id === id) || null;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data, error } = await supabase.from('cars').select('*').eq('id', id).eq('published', true).maybeSingle();
  if (error) { console.error(error); return null; }
  return data;
}
