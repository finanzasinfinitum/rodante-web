import { googleReady, scriptGet } from './google';

// Autos de muestra: se usan solo mientras la Hoja de Google no esté conectada.
export const DEMO_CARS = [
  { id: 'demo-1', brand: 'Toyota', model: 'RAV4', version: 'XLE', year: 2021, km: 42000, price: 27900, body_type: 'SUV', transmission: 'Automática', fuel: 'Gasolina', badge: 'Nuevo ingreso', photos: [], video_url: '', status: 'disponible', description: 'Auto de muestra.' },
  { id: 'demo-2', brand: 'Hyundai', model: 'Tucson', version: 'GLS', year: 2020, km: 58000, price: 21500, body_type: 'SUV', transmission: 'Automática', fuel: 'Gasolina', badge: '', photos: [], video_url: '', status: 'disponible', description: 'Auto de muestra.' },
  { id: 'demo-3', brand: 'Kia', model: 'Rio', version: 'EX', year: 2022, km: 31000, price: 13800, body_type: 'Hatchback', transmission: 'Mecánica', fuel: 'Gasolina', badge: 'Precio rebajado', photos: [], video_url: '', status: 'disponible', description: 'Auto de muestra.' },
  { id: 'demo-4', brand: 'Toyota', model: 'Corolla', version: 'XEI', year: 2019, km: 76000, price: 16900, body_type: 'Sedán', transmission: 'Automática', fuel: 'Gasolina', badge: '', photos: [], video_url: '', status: 'reservado', description: 'Auto de muestra.' },
  { id: 'demo-5', brand: 'Nissan', model: 'Frontier', version: 'LE 4x4', year: 2021, km: 64000, price: 31500, body_type: 'Pickup', transmission: 'Mecánica', fuel: 'Diésel', badge: 'Nuevo ingreso', photos: [], video_url: '', status: 'disponible', description: 'Auto de muestra.' },
  { id: 'demo-6', brand: 'Mazda', model: 'CX-5', version: 'Grand Touring', year: 2022, km: 35000, price: 29900, body_type: 'SUV', transmission: 'Automática', fuel: 'Gasolina', badge: '', photos: [], video_url: '', status: 'disponible', description: 'Auto de muestra.' },
];

async function allCars() {
  if (!googleReady) return DEMO_CARS;
  try {
    const { cars } = await scriptGet('catalog', {}, 300); // se actualiza cada 5 minutos
    return cars || [];
  } catch (e) {
    console.error('Catálogo no disponible:', e.message);
    return [];
  }
}

// Lista pública: visibles y no vendidos
export async function getCars() {
  return (await allCars()).filter((c) => c.status !== 'vendido');
}

export async function getCar(id) {
  return (await allCars()).find((c) => c.id === id) || null;
}

export { BODY_TYPES, carName, interestMessage, photoUrl, youtubeId } from './carUtils';
