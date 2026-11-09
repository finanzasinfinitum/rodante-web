'use client';
import { useSyncExternalStore } from 'react';

// Carrito del carwash guardado en el navegador del cliente
const KEY = 'rodante-cart-v1';
const INITIAL = { size: 'auto', period: 'm3', plan: '', extras: {}, placa: '', nombre: '' };
let state = INITIAL;
let loaded = false;
const listeners = new Set();

function load() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  try { const raw = window.localStorage.getItem(KEY); if (raw) state = { ...INITIAL, ...JSON.parse(raw) }; } catch {}
}

export function setCart(patch) {
  load();
  state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
  try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  listeners.forEach((l) => l());
}

export function setExtraQty(id, qty) {
  setCart((s) => { const extras = { ...s.extras }; if (qty <= 0) delete extras[id]; else extras[id] = qty; return { extras }; });
}

export function clearCart() {
  setCart({ plan: '', extras: {} });
}

function subscribe(l) { listeners.add(l); return () => listeners.delete(l); }
function getSnapshot() { load(); return state; }
function getServerSnapshot() { return INITIAL; }

export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
