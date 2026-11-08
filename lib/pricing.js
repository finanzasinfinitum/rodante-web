// Catálogo de marcas/modelos y fórmula de ofertas.
// IMPORTANTE: valores de prueba. Reemplazar por tu tabla real de precios.
// Formato: Modelo: [valor de referencia en US$ de un auto del año actual, [versiones]]
export const CAR_DATA = {
  Toyota: { Yaris: [19000, ['XLI', 'XLS', 'GLI']], Corolla: [26000, ['XEI', 'SEG']], RAV4: [36000, ['LE', 'XLE', 'Limited']], Hilux: [42000, ['SR', 'SRV', 'GR-S']] },
  Hyundai: { Accent: [15500, ['GL', 'GLS']], Creta: [22000, ['GL', 'GLS', 'Limited']], Tucson: [31000, ['GL', 'GLS', 'Limited']] },
  Kia: { Picanto: [12000, ['LX', 'EX']], Rio: [16500, ['LX', 'EX']], Sportage: [30000, ['LX', 'EX', 'GT-Line']] },
  Nissan: { Versa: [17500, ['Sense', 'Advance', 'Exclusive']], 'X-Trail': [35000, ['Sense', 'Advance', 'Exclusive']], Frontier: [38000, ['S', 'SE', 'LE']] },
  Chevrolet: { Onix: [16000, ['LS', 'LT', 'Premier']], Tracker: [24000, ['LS', 'LT', 'Premier']] },
  Suzuki: { Swift: [15000, ['GL', 'GLX']], Vitara: [25000, ['GL', 'GLX']] },
  Mazda: { 'Mazda 3': [25000, ['Prime', 'Core', 'Grand Touring']], 'CX-5': [34000, ['Core', 'Grand Touring']] },
};

export const BRANDS = Object.keys(CAR_DATA);
export const CURRENT_YEAR = 2026;
export const YEARS = Array.from({ length: 15 }, (_, i) => String(CURRENT_YEAR - i));

// Reglas de negocio (ajustables)
export const RULES = {
  depreciationPerYear: 0.11, // 11% por año
  kmPerYearExpected: 15000,
  versionStep: 0.05, // cada versión superior suma 5%
  immediateFactor: 0.86, // compra inmediata = 86% del valor estimado
  waitFactor: 0.96, // venta con espera = 96%
  waitDays: 30,
};

export function modelsOf(brand) {
  return Object.keys(CAR_DATA[brand] || {});
}

export function versionsOf(brand, model) {
  return (CAR_DATA[brand]?.[model] || [0, []])[1];
}

export function estimateOffers({ brand, model, year, version, km }) {
  const entry = CAR_DATA[brand]?.[model];
  if (!entry) return null;
  const [base, versions] = entry;
  const age = Math.max(0, CURRENT_YEAR - Number(year));
  const kms = Number(km) || 0;
  const kmFactor = Math.min(1.05, Math.max(0.8, 1 - (kms - RULES.kmPerYearExpected * age) / 300000));
  const vIdx = Math.max(0, versions.indexOf(version));
  const value = base * Math.pow(1 - RULES.depreciationPerYear, age) * kmFactor * (1 + vIdx * RULES.versionStep);
  const round = (n) => Math.round(n / 100) * 100;
  return { immediate: round(value * RULES.immediateFactor), wait: round(value * RULES.waitFactor) };
}

export function usd(n) {
  return 'US$ ' + n.toLocaleString('en-US');
}
