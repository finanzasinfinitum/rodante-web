# Rodante — sitio web

Compra, venta y carwash por membresía. Next.js 14 + Google (Hoja, Formulario y Drive).

## Páginas
- `/` Inicio · `/vende` Vende tu auto (ofertas + WhatsApp)
- `/catalogo` Catálogo · `/catalogo/[id]` Ficha de cada auto
- `/carwash` Planes + carrito (pedido a WhatsApp y a la hoja "Membresías")
- `/carwash/consulta` Consulta de membresía por placa

## Administración (todo en Google, cuenta del cliente)
- Formulario "Rodante · Agregar auto" → publica autos con fotos
- Hoja "Rodante" → pestañas Catálogo (editar/ocultar autos) y Membresías (marcar ¿Pagó?)
- Carpeta de Drive "Fotos Rodante"
- Código de conexión: `google/Codigo.gs` (se pega en Extensiones → Apps Script de la hoja)

## Variables en Vercel (Settings → Environments → Production)
- `GOOGLE_SCRIPT_URL` → URL de la aplicación web de Apps Script (termina en /exec)
- `GOOGLE_SCRIPT_TOKEN` → clave secreta que aparece en la pestaña Config de la hoja
Sin ellas, el catálogo muestra autos de muestra.

## Dónde cambiar datos
- `lib/config.js` → WhatsApp, dirección, correo
- `lib/pricing.js` → reglas de las ofertas de compra
- `lib/carwash.js` → planes, servicios y precios del carwash
