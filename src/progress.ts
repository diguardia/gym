import { ORDEN_DIAS } from './dias';
import type { Dia, Ejercicio } from './types';

export interface Estado {
  diaSugerido: Dia;
  hechosHoy: Set<string>;
}

function soloFecha(iso: string): string {
  return iso.slice(0, 10);
}

export function calcularEstado(todos: Ejercicio[]): Estado {
  let maxIso = '';
  for (const e of todos) {
    if (e.ultimaFecha && e.ultimaFecha > maxIso) maxIso = e.ultimaFecha;
  }
  if (!maxIso) {
    return { diaSugerido: 'A', hechosHoy: new Set() };
  }

  const fecha = soloFecha(maxIso);
  const diaEnCurso = todos.find((e) => e.ultimaFecha === maxIso)!.dia;
  const delDia = todos.filter((e) => e.dia === diaEnCurso);
  const hechos = delDia.filter((e) => e.ultimaFecha && soloFecha(e.ultimaFecha) === fecha);

  if (hechos.length === delDia.length) {
    const idx = ORDEN_DIAS.indexOf(diaEnCurso);
    const siguiente = ORDEN_DIAS[(idx + 1) % ORDEN_DIAS.length];
    return { diaSugerido: siguiente, hechosHoy: new Set() };
  }

  return {
    diaSugerido: diaEnCurso,
    hechosHoy: new Set(hechos.map((e) => e.ejercicio)),
  };
}
