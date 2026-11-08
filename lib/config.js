// Datos del negocio. Cambia aquí y se actualiza en toda la web.
export const SITE = {
  name: 'Rodante',
  tagline: 'Compra, venta y cuidado de tu auto, en un solo lugar.',
  // Número de WhatsApp con código de país, sin + ni espacios. (Dato de prueba)
  whatsapp: '51900000000',
  address: '[Dirección del local]',
  email: '[correo@rodante.pe]',
  city: 'Lima, Perú',
};

export function waLink(text) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}
