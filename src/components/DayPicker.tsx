import type { Dia } from '../types';

const DIAS: { dia: Dia; label: string }[] = [
  { dia: 'A', label: 'Día A · Espalda y Tríceps' },
  { dia: 'B', label: 'Día B · Pecho' },
  { dia: 'C', label: 'Día C · Hombros, Bíceps y Core' },
  { dia: 'D', label: 'Día D · Piernas' },
];

interface Props {
  onSelect: (dia: Dia) => void;
  onOpenSettings: () => void;
}

export function DayPicker({ onSelect, onOpenSettings }: Props) {
  return (
    <div className="screen">
      <div className="header-row">
        <h1>Rutina</h1>
        <button className="icon-button" onClick={onOpenSettings} aria-label="Configuración">
          ⚙
        </button>
      </div>
      <div className="day-list">
        {DIAS.map(({ dia, label }) => (
          <button key={dia} className="day-button" onClick={() => onSelect(dia)}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
