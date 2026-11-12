// Conexión con Google Apps Script (Hoja "Rodante" del cliente). Solo se usa en el servidor.
const SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
const TOKEN = process.env.GOOGLE_SCRIPT_TOKEN;

export const googleReady = Boolean(SCRIPT_URL && TOKEN);

export async function scriptGet(action, params = {}, revalidate = 300) {
  const u = new URL(SCRIPT_URL);
  u.searchParams.set('action', action);
  u.searchParams.set('token', TOKEN);
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, String(v)));
  const res = await fetch(u, revalidate ? { next: { revalidate } } : { cache: 'no-store' });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

export async function scriptPost(action, body) {
  const res = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ ...body, action, token: TOKEN }),
    cache: 'no-store',
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}
