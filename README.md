# Rodante — sitio web

Compra, venta y carwash por membresía. Next.js 14 + Supabase.

## Páginas
- `/` Inicio · `/vende` Vende tu auto (ofertas + WhatsApp)
- `/catalogo` Catálogo con filtros · `/catalogo/[id]` Ficha de cada auto
- `/admin` Panel para agregar/editar autos (requiere Supabase)
- `/carwash` Muy pronto

## Dónde cambiar datos
- `lib/config.js` → WhatsApp, dirección, correo
- `lib/pricing.js` → marcas, modelos y reglas de las ofertas
- `supabase/schema.sql` → base de datos (correr una vez en Supabase)

## Variables (en Vercel → Settings → Environment Variables)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
Sin ellas, el catálogo muestra autos de muestra.
