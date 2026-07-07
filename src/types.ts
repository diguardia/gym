export type Dia = 'A' | 'B' | 'C' | 'D';

export type TipoEjercicio = 'peso' | 'banda' | 'corporal';

export type Resultado = 'no_pude_terminar' | 'llegue_justo' | 'llegue_bien';

export interface Ejercicio {
  ejercicio: string;
  dia: Dia;
  grupo: string;
  tipo: TipoEjercicio;
  peso: number | '';
  incremento: number | '';
  repsObjetivo: number;
  series: number;
  ultimaFecha: string;
  ultimoResultado: Resultado | '';
}

export interface LogResponse {
  ejercicio: string;
  pesoAnterior: number;
  pesoNuevo: number;
  repsAnterior: number;
  repsNuevo: number;
  aviso: string | null;
  error?: string;
}
