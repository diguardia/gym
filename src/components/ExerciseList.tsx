import { useEffect, useState } from 'react';
import { fetchEjercicios } from '../api';
import type { Dia, Ejercicio } from '../types';

interface Props {
  dia: Dia;
  onBack: () => void;
  onSelect: (ejercicio: Ejercicio) => void;
  refreshToken: number;
}

function targetLabel(e: Ejercicio): string {
  const reps = `${e.repsObjetivo} reps × ${e.series} series`;
  if (e.tipo === 'peso' && e.peso !== '') return `${e.peso} kg · ${reps}`;
  return reps;
}

export function ExerciseList({ dia, onBack, onSelect, refreshToken }: Props) {
  const [ejercicios, setEjercicios] = useState<Ejercicio[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEjercicios(null);
    setError(null);
    fetchEjercicios(dia)
      .then(setEjercicios)
      .catch(() => setError('No se pudo cargar. Revisá la configuración o tu conexión.'));
  }, [dia, refreshToken]);

  return (
    <div className="screen">
      <div className="header-row">
        <button className="icon-button" onClick={onBack} aria-label="Volver">
          ←
        </button>
        <h1>Día {dia}</h1>
      </div>
      {error && <p className="error">{error}</p>}
      {!error && !ejercicios && <p className="hint">Cargando...</p>}
      <div className="exercise-list">
        {ejercicios?.map((e) => (
          <button key={e.ejercicio} className="exercise-card" onClick={() => onSelect(e)}>
            <span className="exercise-name">{e.ejercicio}</span>
            <span className="exercise-target">{targetLabel(e)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
