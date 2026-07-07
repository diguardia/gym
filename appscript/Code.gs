/**
 * Backend de la app de gimnasio. Se pega en Extensions > Apps Script
 * de la planilla, y se despliega como Web App (Implementar > Nueva implementación
 * > Aplicación web > Ejecutar como: Yo > Quién tiene acceso: Cualquier usuario).
 * La URL que te da ese despliegue es la que va en la app (variable VITE_SHEETS_API_URL).
 */

var SHEET_EXERCISES = 'Ejercicios';
var SHEET_LOG = 'Registro';
var REP_LEVELS = [6, 8, 10, 12];

// Cambiá esto por cualquier string secreto propio. La app debe mandar el mismo valor.
var TOKEN = 'cambiame';

var COLS = {
  ejercicio: 0,
  dia: 1,
  grupo: 2,
  tipo: 3, // 'peso' | 'banda' | 'corporal'
  peso: 4,
  incremento: 5,
  repsObjetivo: 6,
  series: 7,
  ultimaFecha: 8,
  ultimoResultado: 9
};

function doGet(e) {
  var action = e.parameter.action;
  if (action === 'exercises') {
    return respond(getExercises(e.parameter.dia));
  }
  return respond({ error: 'acción desconocida' });
}

function doPost(e) {
  var body = JSON.parse(e.postData.contents);
  if (body.token !== TOKEN) {
    return respond({ error: 'token inválido' });
  }
  if (body.action === 'log') {
    return respond(logResultado(body.ejercicio, body.resultado));
  }
  return respond({ error: 'acción desconocida' });
}

function getExercises(dia) {
  var sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_EXERCISES);
  var values = sheet.getDataRange().getValues();
  var out = [];
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    if (!row[COLS.ejercicio]) continue;
    if (dia && row[COLS.dia] !== dia) continue;
    out.push(rowToObj(row));
  }
  return out;
}

function rowToObj(row) {
  return {
    ejercicio: row[COLS.ejercicio],
    dia: row[COLS.dia],
    grupo: row[COLS.grupo],
    tipo: row[COLS.tipo],
    peso: row[COLS.peso],
    incremento: row[COLS.incremento],
    repsObjetivo: row[COLS.repsObjetivo],
    series: row[COLS.series],
    ultimaFecha: row[COLS.ultimaFecha],
    ultimoResultado: row[COLS.ultimoResultado]
  };
}

function defaultIncrement(peso) {
  if (peso < 10) return 1;
  if (peso < 20) return 2;
  if (peso < 40) return 2.5;
  return 5;
}

function roundHalf(n) {
  return Math.round(n * 2) / 2;
}

function logResultado(nombreEjercicio, resultado) {
  var sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_EXERCISES);
  var values = sheet.getDataRange().getValues();
  var rowIndex = -1;
  for (var i = 1; i < values.length; i++) {
    if (values[i][COLS.ejercicio] === nombreEjercicio) {
      rowIndex = i;
      break;
    }
  }
  if (rowIndex === -1) {
    return { error: 'ejercicio no encontrado: ' + nombreEjercicio };
  }

  var row = values[rowIndex];
  var tipo = row[COLS.tipo];
  var pesoActual = Number(row[COLS.peso]) || 0;
  var incrementoOverride = row[COLS.incremento] ? Number(row[COLS.incremento]) : null;
  var repsActual = Number(row[COLS.repsObjetivo]) || REP_LEVELS[0];
  var repIdx = REP_LEVELS.indexOf(repsActual);
  if (repIdx === -1) repIdx = 0;
  var series = row[COLS.series];

  var nuevoPeso = pesoActual;
  var nuevoRepIdx = repIdx;
  var aviso = null;

  if (resultado === 'llegue_bien') {
    if (repIdx === REP_LEVELS.length - 1) {
      if (tipo === 'peso') {
        var step = incrementoOverride || defaultIncrement(pesoActual);
        nuevoPeso = roundHalf(pesoActual + step);
        nuevoRepIdx = 0;
      } else {
        aviso = 'Llegaste al máximo de repeticiones. Considerá aumentar la dificultad manualmente (banda, tiempo, etc.).';
      }
    } else {
      nuevoRepIdx = repIdx + 1;
    }
  }
  // 'llegue_justo' y 'no_pude_terminar' repiten el mismo objetivo (sin cambios).

  var nuevasReps = REP_LEVELS[nuevoRepIdx];
  var hoy = new Date();

  sheet.getRange(rowIndex + 1, COLS.peso + 1).setValue(nuevoPeso);
  sheet.getRange(rowIndex + 1, COLS.repsObjetivo + 1).setValue(nuevasReps);
  sheet.getRange(rowIndex + 1, COLS.ultimaFecha + 1).setValue(hoy);
  sheet.getRange(rowIndex + 1, COLS.ultimoResultado + 1).setValue(resultado);

  var logSheet = SpreadsheetApp.getActive().getSheetByName(SHEET_LOG);
  logSheet.appendRow([
    hoy,
    row[COLS.dia],
    nombreEjercicio,
    pesoActual,
    repsActual,
    series,
    resultado,
    nuevoPeso,
    nuevasReps
  ]);

  return {
    ejercicio: nombreEjercicio,
    pesoAnterior: pesoActual,
    pesoNuevo: nuevoPeso,
    repsAnterior: repsActual,
    repsNuevo: nuevasReps,
    aviso: aviso
  };
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Ejecutar UNA SOLA VEZ manualmente desde el editor de Apps Script
 * (menú de funciones > inicializarPlanilla > Ejecutar) para crear
 * las hojas "Ejercicios" y "Registro" con los datos de tu rutina actual.
 */
function inicializarPlanilla() {
  var ss = SpreadsheetApp.getActive();

  var ejercicios = ss.getSheetByName(SHEET_EXERCISES) || ss.insertSheet(SHEET_EXERCISES);
  ejercicios.clear();
  ejercicios.appendRow(['Ejercicio', 'Dia', 'Grupo', 'Tipo', 'Peso', 'Incremento', 'RepsObjetivo', 'Series', 'UltimaFecha', 'UltimoResultado']);
  var data = [
    ['Dominadas con banda', 'A', 'Espalda', 'banda', '', '', 6, 3, '', ''],
    ['Tirón al pecho', 'A', 'Espalda', 'peso', 55, '', 6, 3, '', ''],
    ['Remo', 'A', 'Espalda', 'peso', 50, '', 6, 3, '', ''],
    ['Pull over mancuerna', 'A', 'Espalda', 'peso', 25, '', 6, 3, '', ''],
    ['Tríceps soga', 'A', 'Tríceps', 'peso', 45, '', 6, 3, '', ''],
    ['Press banca', 'B', 'Pecho', 'peso', 37, '', 6, 3, '', ''],
    ['Press inclinado mancuernas', 'B', 'Pecho', 'peso', 12, '', 6, 3, '', ''],
    ['Mariposa', 'B', 'Pecho', 'peso', 32.5, '', 6, 3, '', ''],
    ['Press hombros mancuernas', 'C', 'Hombros', 'peso', 12, '', 6, 3, '', ''],
    ['Vuelos laterales', 'C', 'Hombros', 'peso', 10, '', 6, 3, '', ''],
    ['Bíceps barra', 'C', 'Bíceps', 'peso', 20, '', 6, 3, '', ''],
    ['Scott unilateral', 'C', 'Bíceps', 'peso', 10, '', 6, 3, '', ''],
    ['Plancha', 'C', 'Core', 'corporal', '', '', 6, 3, '', ''],
    ['Abdominales', 'C', 'Core', 'corporal', '', '', 6, 3, '', ''],
    ['Prensa', 'D', 'Piernas', 'peso', 140, '', 6, 3, '', ''],
    ['Extensión piernas', 'D', 'Piernas', 'peso', 40, '', 6, 3, '', ''],
    ['Curl femoral', 'D', 'Piernas', 'peso', 35, '', 6, 3, '', ''],
    ['Peso muerto rumano', 'D', 'Piernas', 'peso', 30, '', 6, 3, '', '']
  ];
  ejercicios.getRange(2, 1, data.length, data[0].length).setValues(data);

  var registro = ss.getSheetByName(SHEET_LOG) || ss.insertSheet(SHEET_LOG);
  registro.clear();
  registro.appendRow(['Fecha', 'Dia', 'Ejercicio', 'PesoUsado', 'RepsObjetivo', 'Series', 'Resultado', 'PesoSiguiente', 'RepsSiguiente']);
}
