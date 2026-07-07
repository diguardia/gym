import { getApiToken, getApiUrl } from './config';
import type { Dia, Ejercicio, LogResponse, Resultado } from './types';

function cacheKey(dia: Dia) {
  return `gym_cache_${dia}`;
}

export async function fetchEjercicios(dia: Dia): Promise<Ejercicio[]> {
  const url = `${getApiUrl()}?action=exercises&dia=${dia}`;
  try {
    const res = await fetch(url);
    const data = (await res.json()) as Ejercicio[];
    localStorage.setItem(cacheKey(dia), JSON.stringify(data));
    return data;
  } catch (err) {
    const cached = localStorage.getItem(cacheKey(dia));
    if (cached) return JSON.parse(cached) as Ejercicio[];
    throw err;
  }
}

export async function logResultado(ejercicio: string, resultado: Resultado): Promise<LogResponse> {
  const res = await fetch(getApiUrl(), {
    method: 'POST',
    body: JSON.stringify({
      action: 'log',
      token: getApiToken(),
      ejercicio,
      resultado,
    }),
  });
  return (await res.json()) as LogResponse;
}
