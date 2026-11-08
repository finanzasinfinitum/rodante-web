# Rodante — sitio web

Compra, venta y carwash por membresía. Hecho con Next.js 14.

## Qué incluye (paso 2)
- `/` Inicio con cotización rápida
- `/vende` Formulario de venta con dos ofertas y envío a WhatsApp
- `/catalogo` y `/carwash` en "Muy pronto" (pasos 3 y 4)

## Dónde cambiar datos
- `lib/config.js` → número de WhatsApp, dirección, correo
- `lib/pricing.js` → marcas, modelos, versiones y reglas de las ofertas (datos de prueba)

## Probar en una computadora (opcional)
```
npm install
npm run dev
```
Abrir http://localhost:3000
