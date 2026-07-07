import { DIA_LABELS, ORDEN_DIAS } from '../dias';
import type { Dia } from '../types';

interface Props {
  onSelect: (dia: Dia) => void;
  onOpenSettings: () => void;
  sugerido: Dia | null;
  pendientesSugerido: number;
  totalSugerido: number;
}

export function DayPicker({ onSelect, onOpenSettings, sugerido, pendientesSugerido, totalSugerido }: Props) {
  return (
    <div className="screen">
      <div className="header-row">
        <h1>Rutina</h1>
        <button className="icon-button" onClick={onOpenSettings} aria-label="Configuración">
          ⚙
        </button>
      </div>
      {sugerido && (
        <button className="suggestion-banner" onClick={() => onSelect(sugerido)}>
          Te toca: <strong>{DIA_LABELS[sugerido]}</strong>
          {pendientesSugerido < totalSugerido &&
            ` · ${pendientesSugerido} de ${totalSugerido} pendientes`}
        </button>
      )}
      <div className="day-list">
        {ORDEN_DIAS.map((dia) => (
          <button
            key={dia}
            className={`day-button${dia === sugerido ? ' day-button-suggested' : ''}`}
            onClick={() => onSelect(dia)}
          >
            {DIA_LABELS[dia]}
          </button>
        ))}
      </div>
    </div>
  );
}
