import { useState } from 'react';
import { logResultado } from '../api';
import type { Ejercicio, LogResponse, Resultado } from '../types';

interface Props {
  ejercicio: Ejercicio;
  onBack: () => void;
  onLogged: () => void;
}

const OPCIONES: { resultado: Resultado; label: string }[] = [
  { resultado: 'no_pude_terminar', label: 'No pude terminar' },
  { resultado: 'llegue_justo', label: 'Llegué justo' },
  { resultado: 'llegue_bien', label: 'Llegué bien' },
];

export function ExerciseLogger({ ejercicio, onBack, onLogged }: Props) {
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<LogResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleClick(resultadoElegido: Resultado) {
    setEnviando(true);
    setError(null);
    try {
      const res = await logResultado(ejercicio.ejercicio, resultadoElegido);
      if (res.error) {
        setError(res.error);
      } else {
        setResultado(res);
      }
    } catch {
      setError('No se pudo registrar. Revisá tu conexión e intentá de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  if (resultado) {
    const subioPeso = resultado.pesoNuevo !== resultado.pesoAnterior;
    const subioReps = resultado.repsNuevo !== resultado.repsAnterior && !subioPeso;
    return (
      <div className="screen">
        <h1>{ejercicio.ejercicio}</h1>
        <div className="result-card">
          {subioPeso && (
            <p>
              🎉 Subiste de <strong>{resultado.pesoAnterior} kg</strong> a{' '}
              <strong>{resultado.pesoNuevo} kg</strong>. Reps vuelven a {resultado.repsNuevo}.
            </p>
          )}
          {subioReps && (
            <p>
              💪 Subiste de <strong>{resultado.repsAnterior} reps</strong> a{' '}
              <strong>{resultado.repsNuevo} reps</strong>, mismo peso.
            </p>
          )}
          {!subioPeso && !subioReps && <p>Se repite el mismo objetivo la próxima vez.</p>}
          {resultado.aviso && <p className="hint">{resultado.aviso}</p>}
        </div>
        <button className="primary" onClick={onLogged}>
          Listo
        </button>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="header-row">
        <button className="icon-button" onClick={onBack} aria-label="Volver">
          ←
        </button>
        <h1>{ejercicio.ejercicio}</h1>
      </div>
      <p className="hint">
        Objetivo: {ejercicio.tipo === 'peso' && ejercicio.peso !== '' ? `${ejercicio.peso} kg · ` : ''}
        {ejercicio.repsObjetivo} reps × {ejercicio.series} series
      </p>
      <p>¿Cómo te fue?</p>
      {error && <p className="error">{error}</p>}
      <div className="result-options">
        {OPCIONES.map((op) => (
          <button
            key={op.resultado}
            className={`result-button result-${op.resultado}`}
            disabled={enviando}
            onClick={() => handleClick(op.resultado)}
          >
            {op.label}
          </button>
        ))}
      </div>
    </div>
  );
}
