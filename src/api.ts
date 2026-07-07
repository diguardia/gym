import { getApiToken, getApiUrl } from './config';
import type { Ejercicio, LogResponse, Resultado } from './types';

const CACHE_KEY = 'gym_cache_todos';

export async function fetchTodosEjercicios(): Promise<Ejercicio[]> {
  const url = `${getApiUrl()}?action=exercises`;
  try {
    const res = await fetch(url);
    const data = (await res.json()) as Ejercicio[];
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    return data;
  } catch (err) {
    const cached = localStorage.getItem(CACHE_KEY);
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
