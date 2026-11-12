/**
 * RODANTE · Conexión entre Google (Hoja + Formulario + Drive) y la web
 * -------------------------------------------------------------------
 * Cómo instalar (una sola vez):
 *  1. Crea una Hoja de cálculo de Google nueva llamada "Rodante".
 *  2. Menú Extensiones → Apps Script. Borra lo que haya y pega TODO este archivo.
 *  3. Guarda (ícono de disquete), elige la función "configurar" arriba y dale ▶ Ejecutar.
 *     Acepta los permisos que pide Google (es tu propia cuenta).
 *  4. Sigue la guía: agregar la pregunta "Fotos" al formulario e implementar como aplicación web.
 */

const HOJA_CATALOGO = 'Catálogo';
const HOJA_MEMBRESIAS = 'Membresías';
const HOJA_CONFIG = 'Config';

const CAT_COLS = ['ID', 'Fecha', 'Marca', 'Modelo', 'Versión', 'Año', 'Kilometraje', 'Precio (US$)', 'Tipo', 'Transmisión', 'Combustible', 'Color', 'Descripción', 'Video (YouTube)', 'Etiqueta', 'Estado', 'Visible', 'Carpeta de fotos'];
const MEM_COLS = ['Fecha', 'Nombre', 'Celular', 'Placa', 'Vehículo', 'Plan', 'Período', 'Meses', 'Total (S/)', 'Detalle', '¿Pagó?', 'Inicio', 'Vence', 'Estado'];

const TIPOS = ['SUV', 'Sedán', 'Hatchback', 'Pickup'];
const TRANSMISIONES = ['Automática', 'Mecánica'];
const COMBUSTIBLES = ['Gasolina', 'Diésel', 'Híbrido', 'Eléctrico', 'GLP', 'GNV'];
const ESTADOS = ['Disponible', 'Reservado', 'Vendido'];

// Columnas (1 = A)
function col_(cols, name) { return cols.indexOf(name) + 1; }

/* ============================ CONFIGURAR ============================ */

function configurar() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const props = PropertiesService.getScriptProperties();

  // 1) Hojas
  const cat = hoja_(ss, HOJA_CATALOGO, CAT_COLS);
  const mem = hoja_(ss, HOJA_MEMBRESIAS, MEM_COLS);
  const cfg = ss.getSheetByName(HOJA_CONFIG) || ss.insertSheet(HOJA_CONFIG);
  const sobra = ss.getSheetByName('Hoja 1') || ss.getSheetByName('Sheet1');
  if (sobra && ss.getSheets().length > 3) ss.deleteSheet(sobra);

  // Catálogo: listas desplegables y casillas
  const filas = 2000;
  const lista = (v) => SpreadsheetApp.newDataValidation().requireValueInList(v, true).setAllowInvalid(false).build();
  cat.getRange(2, col_(CAT_COLS, 'Tipo'), filas).setDataValidation(lista(TIPOS));
  cat.getRange(2, col_(CAT_COLS, 'Transmisión'), filas).setDataValidation(lista(TRANSMISIONES));
  cat.getRange(2, col_(CAT_COLS, 'Combustible'), filas).setDataValidation(lista(COMBUSTIBLES));
  cat.getRange(2, col_(CAT_COLS, 'Estado'), filas).setDataValidation(lista(ESTADOS));
  cat.getRange(2, col_(CAT_COLS, 'Visible'), filas).setDataValidation(SpreadsheetApp.newDataValidation().requireCheckbox().build());
  cat.getRange(2, col_(CAT_COLS, 'Precio (US$)'), filas).setNumberFormat('#,##0');
  cat.getRange(2, col_(CAT_COLS, 'Kilometraje'), filas).setNumberFormat('#,##0');
  cat.getRange(2, col_(CAT_COLS, 'Fecha'), filas).setNumberFormat('dd/mm/yyyy');

  // Membresías: formatos y colores de estado
  mem.getRange(2, col_(MEM_COLS, 'Fecha'), filas).setNumberFormat('dd/mm/yyyy hh:mm');
  mem.getRange(2, col_(MEM_COLS, 'Inicio'), filas, 2).setNumberFormat('dd/mm/yyyy');
  mem.getRange(2, col_(MEM_COLS, 'Total (S/)'), filas).setNumberFormat('#,##0');
  const est = mem.getRange(2, col_(MEM_COLS, 'Estado'), filas);
  const regla = (txt, fondo, letra) => SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(txt).setBackground(fondo).setFontColor(letra).setRanges([est]).build();
  mem.setConditionalFormatRules([
    regla('Activa', '#e3f1e5', '#2f6b3a'),
    regla('Pendiente', '#fdf1d8', '#7a5300'),
    regla('Por vencer', '#fde4cc', '#8a3d00'),
    regla('Vencida', '#fbe1df', '#b42318'),
    regla('Solo servicios', '#eef0f2', '#5b6470'),
  ]);

  // 2) Carpeta de fotos (pública con enlace, para que la web pueda mostrarlas)
  let carpeta = null;
  try { carpeta = DriveApp.getFolderById(props.getProperty('CARPETA_ID')); } catch (e) { carpeta = null; }
  if (!carpeta) {
    carpeta = DriveApp.createFolder('Fotos Rodante');
    props.setProperty('CARPETA_ID', carpeta.getId());
  }
  carpeta.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  // 3) Formulario "Agregar auto"
  let form = null;
  try { form = FormApp.openById(props.getProperty('FORM_ID')); } catch (e) { form = null; }
  if (!form) {
    form = FormApp.create('Rodante · Agregar auto');
    form.setDescription('Completa los datos del auto y sube sus fotos. Aparecerá en la web en unos minutos.');
    const texto = (t, req, ayuda) => { const i = form.addTextItem().setTitle(t).setRequired(req); if (ayuda) i.setHelpText(ayuda); return i; };
    const numero = (t, min, max, ayuda) => texto(t, true, ayuda).setValidation(FormApp.createTextValidation().requireNumberBetween(min, max).setHelpText('Escribe solo números').build());
    texto('Marca', true);
    texto('Modelo', true);
    texto('Versión', false, 'Ej. XLE, GLS, Full');
    numero('Año', 1990, 2035);
    numero('Kilometraje', 0, 1000000, 'Solo números, sin puntos ni comas');
    numero('Precio (US$)', 1, 1000000, 'Solo números, sin puntos ni comas');
    form.addMultipleChoiceItem().setTitle('Tipo').setChoiceValues(TIPOS).setRequired(true);
    form.addMultipleChoiceItem().setTitle('Transmisión').setChoiceValues(TRANSMISIONES).setRequired(true);
    form.addMultipleChoiceItem().setTitle('Combustible').setChoiceValues(COMBUSTIBLES).setRequired(true);
    texto('Color', false);
    form.addParagraphTextItem().setTitle('Descripción').setHelpText('Mantenimientos, equipamiento, estado, detalles…');
    texto('Video (YouTube)', false, 'Sube el video a YouTube como "No listado" y pega el link');
    texto('Etiqueta', false, 'Opcional. Ej. Nuevo ingreso, Precio rebajado');
    props.setProperty('FORM_ID', form.getId());
  }

  // 4) Activador: cuando se envía el formulario
  ScriptApp.getProjectTriggers().forEach((t) => { if (t.getHandlerFunction() === 'alEnviarFormulario') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('alEnviarFormulario').forForm(form).onFormSubmit().create();

  // 5) Clave secreta para la web
  let token = props.getProperty('TOKEN');
  if (!token) { token = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '').slice(0, 8); props.setProperty('TOKEN', token); }

  // 6) Hoja Config con los enlaces importantes
  cfg.clear();
  cfg.getRange(1, 1, 6, 2).setValues([
    ['Qué', 'Enlace / valor'],
    ['Formulario para agregar autos (compártelo en tu celular)', form.getPublishedUrl()],
    ['Editar el formulario', form.getEditUrl()],
    ['Carpeta de fotos', carpeta.getUrl()],
    ['Clave secreta (solo para Vercel, no la compartas)', token],
    ['Configurado el', new Date()],
  ]);
  cfg.getRange('A1:B1').setFontWeight('bold');
  cfg.setColumnWidth(1, 380); cfg.setColumnWidth(2, 520);

  Logger.log('Listo. Revisa la hoja "Config". Falta: 1) agregar la pregunta "Fotos" al formulario, 2) Implementar → Nueva implementación → Aplicación web.');
}

function hoja_(ss, nombre, cols) {
  const sh = ss.getSheetByName(nombre) || ss.insertSheet(nombre);
  sh.getRange(1, 1, 1, cols.length).setValues([cols]).setFontWeight('bold').setBackground('#0d5c63').setFontColor('#ffffff');
  sh.setFrozenRows(1);
  return sh;
}

/* ===================== FORMULARIO → CATÁLOGO ===================== */

function alEnviarFormulario(e) {
  const props = PropertiesService.getScriptProperties();
  const respuestas = e.response.getItemResponses();
  const dato = (titulo) => {
    const r = respuestas.find((x) => x.getItem().getTitle().trim().toLowerCase() === titulo.toLowerCase());
    return r ? r.getResponse() : '';
  };
  const num = (v) => Number(String(v).replace(/[^\d.]/g, '')) || 0;

  const id = 'A' + Date.now().toString(36).toUpperCase();
  const marca = String(dato('Marca')).trim();
  const modelo = String(dato('Modelo')).trim();
  const anio = num(dato('Año'));

  // Carpeta del auto con sus fotos numeradas (01, 02…) para mantener el orden
  const raiz = DriveApp.getFolderById(props.getProperty('CARPETA_ID'));
  const carpeta = raiz.createFolder(`${id} · ${marca} ${modelo} ${anio}`);
  const fotos = dato('Fotos');
  (Array.isArray(fotos) ? fotos : []).forEach((fid, i) => {
    try {
      const f = DriveApp.getFileById(fid);
      f.setName(String(i + 1).padStart(2, '0') + ' · ' + f.getName());
      f.moveTo(carpeta);
      f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (err) { console.error('Foto no movida', fid, err); }
  });

  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_CATALOGO);
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    hoja.appendRow([
      id, new Date(), seguro_(marca), seguro_(modelo), seguro_(dato('Versión')), anio, num(dato('Kilometraje')), num(dato('Precio (US$)')),
      dato('Tipo'), dato('Transmisión'), dato('Combustible'), seguro_(dato('Color')), seguro_(dato('Descripción')),
      seguro_(dato('Video (YouTube)')), seguro_(dato('Etiqueta')), 'Disponible', true, carpeta.getUrl(),
    ]);
  } finally { lock.releaseLock(); }
}

/* ========================= MEMBRESÍAS ========================= */

// Al marcar "¿Pagó?" se pone la fecha de inicio automáticamente
function onEdit(e) {
  const sh = e.range.getSheet();
  if (sh.getName() !== HOJA_MEMBRESIAS || e.range.getRow() < 2 || e.range.getColumn() !== col_(MEM_COLS, '¿Pagó?')) return;
  const inicio = sh.getRange(e.range.getRow(), col_(MEM_COLS, 'Inicio'));
  if (e.value === 'TRUE' && !inicio.getValue()) inicio.setValue(new Date());
  if (e.value === 'FALSE') inicio.clearContent();
}

function agregarMembresia_(p) {
  const nombre = String(p.nombre || '').trim().slice(0, 80);
  const celular = String(p.celular || '').replace(/\D/g, '').slice(-9);
  if (!nombre || !/^9\d{8}$/.test(celular)) return { ok: false, error: 'datos inválidos' };

  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_MEMBRESIAS);
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    hoja.appendRow([
      new Date(), seguro_(nombre), "'" + celular, seguro_(String(p.placa || '').toUpperCase().slice(0, 8)), seguro_(p.vehiculo),
      seguro_(p.plan), seguro_(p.periodo), Number(p.meses) || '', Number(p.total) || 0, seguro_(String(p.detalle || '').slice(0, 500)),
      false, '', '', '',
    ]);
    const r = hoja.getLastRow();
    const col = (n) => String.fromCharCode(64 + col_(MEM_COLS, n));
    hoja.getRange(r, col_(MEM_COLS, '¿Pagó?')).insertCheckboxes();
    hoja.getRange(r, col_(MEM_COLS, 'Vence')).setFormula(`=IF(${col('Inicio')}${r}="","",EDATE(${col('Inicio')}${r},${col('Meses')}${r}))`);
    hoja.getRange(r, col_(MEM_COLS, 'Estado')).setFormula(
      `=IF(${col('Plan')}${r}="","Solo servicios",IF(${col('¿Pagó?')}${r}<>TRUE,"Pendiente",IF(TODAY()>${col('Vence')}${r},"Vencida",IF(${col('Vence')}${r}-TODAY()<=7,"Por vencer","Activa"))))`
    );
  } finally { lock.releaseLock(); }
  return { ok: true };
}

// Consulta pública por placa: solo devuelve plan, vencimiento y estado (sin datos personales)
function consultarPlaca_(placa) {
  const norm = (s) => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const buscada = norm(placa);
  if (buscada.length < 5) return { found: false };
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_MEMBRESIAS);
  const filas = hoja.getDataRange().getDisplayValues();
  for (let i = filas.length - 1; i >= 1; i--) {
    const f = filas[i];
    if (norm(f[col_(MEM_COLS, 'Placa') - 1]) === buscada && f[col_(MEM_COLS, 'Plan') - 1]) {
      return { found: true, plan: f[col_(MEM_COLS, 'Plan') - 1], periodo: f[col_(MEM_COLS, 'Período') - 1], vence: f[col_(MEM_COLS, 'Vence') - 1], estado: f[col_(MEM_COLS, 'Estado') - 1] };
    }
  }
  return { found: false };
}

/* ========================= CATÁLOGO → WEB ========================= */

function catalogo_() {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_CATALOGO);
  const filas = hoja.getDataRange().getValues();
  const v = (f, n) => f[col_(CAT_COLS, n) - 1];
  const autos = [];
  for (let i = 1; i < filas.length; i++) {
    const f = filas[i];
    if (!v(f, 'ID') || v(f, 'Visible') !== true) continue;
    autos.push({
      id: String(v(f, 'ID')),
      created_at: v(f, 'Fecha') instanceof Date ? v(f, 'Fecha').toISOString() : '',
      brand: String(v(f, 'Marca')), model: String(v(f, 'Modelo')), version: String(v(f, 'Versión') || ''),
      year: Number(v(f, 'Año')) || 0, km: Number(v(f, 'Kilometraje')) || 0, price: Number(v(f, 'Precio (US$)')) || 0,
      body_type: String(v(f, 'Tipo') || 'SUV'), transmission: String(v(f, 'Transmisión') || 'Automática'), fuel: String(v(f, 'Combustible') || 'Gasolina'),
      color: String(v(f, 'Color') || ''), description: String(v(f, 'Descripción') || ''), video_url: String(v(f, 'Video (YouTube)') || ''),
      badge: String(v(f, 'Etiqueta') || ''), status: String(v(f, 'Estado') || 'Disponible').toLowerCase(),
      photos: fotosDe_(String(v(f, 'Carpeta de fotos') || '')),
    });
  }
  return autos.reverse(); // más recientes primero
}

function fotosDe_(enlace) {
  const m = enlace.match(/folders\/([A-Za-z0-9_-]+)/) || enlace.match(/^([A-Za-z0-9_-]{20,})$/);
  if (!m) return [];
  try {
    const it = DriveApp.getFolderById(m[1]).getFiles();
    const lista = [];
    while (it.hasNext()) {
      const f = it.next();
      if (String(f.getMimeType()).indexOf('image/') === 0) lista.push({ id: f.getId(), nombre: f.getName() });
    }
    lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { numeric: true }));
    return lista.map((x) => x.id);
  } catch (e) { return []; }
}

/* ========================= API WEB ========================= */

function doGet(e) { return responder_(e.parameter || {}); }

function doPost(e) {
  let cuerpo = {};
  try { cuerpo = JSON.parse(e.postData.contents); } catch (err) { cuerpo = {}; }
  return responder_(Object.assign({}, e.parameter || {}, cuerpo));
}

function responder_(p) {
  const token = PropertiesService.getScriptProperties().getProperty('TOKEN');
  if (!token || p.token !== token) return json_({ error: 'no autorizado' });
  try {
    if (p.action === 'catalog') return json_({ cars: catalogo_() });
    if (p.action === 'membership') return json_(agregarMembresia_(p));
    if (p.action === 'placa') return json_(consultarPlaca_(p.placa));
    return json_({ error: 'acción desconocida' });
  } catch (err) {
    return json_({ error: String(err) });
  }
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// Evita que un texto empiece con = + - @ y se ejecute como fórmula
function seguro_(v) {
  const s = String(v == null ? '' : v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
