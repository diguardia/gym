import { DIA_LABELS } from '../dias';
import type { Dia, Ejercicio } from '../types';

interface Props {
  dia: Dia;
  ejercicios: Ejercicio[] | null;
  error: string | null;
  hechosHoy: Set<string>;
  onBack: () => void;
  onSelect: (ejercicio: Ejercicio) => void;
}

function targetLabel(e: Ejercicio): string {
  const reps = `${e.repsObjetivo} reps × ${e.series} series`;
  if (e.tipo === 'peso' && e.peso !== '') return `${e.peso} kg · ${reps}`;
  return reps;
}

export function ExerciseList({ dia, ejercicios, error, hechosHoy, onBack, onSelect }: Props) {
  const delDia = ejercicios?.filter((e) => e.dia === dia) ?? null;
  const ordenados = delDia
    ? [...delDia].sort((a, b) => {
        const aHecho = hechosHoy.has(a.ejercicio) ? 1 : 0;
        const bHecho = hechosHoy.has(b.ejercicio) ? 1 : 0;
        return aHecho - bHecho;
      })
    : null;

  return (
    <div className="screen">
      <div className="header-row">
        <button className="icon-button" onClick={onBack} aria-label="Volver">
          ←
        </button>
        <h1>{DIA_LABELS[dia]}</h1>
      </div>
      {error && <p className="error">{error}</p>}
      {!error && !ordenados && <p className="hint">Cargando...</p>}
      <div className="exercise-list">
        {ordenados?.map((e) => {
          const hecho = hechosHoy.has(e.ejercicio);
          return (
            <button
              key={e.ejercicio}
              className={`exercise-card${hecho ? ' exercise-card-done' : ''}`}
              onClick={() => onSelect(e)}
            >
              <span className="exercise-name">
                {hecho && '✓ '}
                {e.ejercicio}
              </span>
              <span className="exercise-target">
                {hecho ? 'Hecho hoy · ' : ''}
                {targetLabel(e)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
