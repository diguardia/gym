import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { fetchTodosEjercicios } from './api';
import { DayPicker } from './components/DayPicker';
import { ExerciseList } from './components/ExerciseList';
import { ExerciseLogger } from './components/ExerciseLogger';
import { Settings } from './components/Settings';
import { isConfigured } from './config';
import { calcularEstado } from './progress';
import type { Dia, Ejercicio } from './types';

type Screen =
  | { name: 'settings' }
  | { name: 'dayPicker' }
  | { name: 'dayView'; dia: Dia }
  | { name: 'logger'; dia: Dia; ejercicio: Ejercicio };

function App() {
  const [screen, setScreen] = useState<Screen>(
    isConfigured() ? { name: 'dayPicker' } : { name: 'settings' }
  );
  const [refreshToken, setRefreshToken] = useState(0);
  const [todos, setTodos] = useState<Ejercicio[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTodos(null);
    setError(null);
    fetchTodosEjercicios()
      .then(setTodos)
      .catch(() => setError('No se pudo cargar. Revisá la configuración o tu conexión.'));
  }, [refreshToken]);

  const estado = useMemo(() => (todos ? calcularEstado(todos) : null), [todos]);

  if (screen.name === 'settings') {
    return (
      <Settings
        onSaved={() => {
          setScreen({ name: 'dayPicker' });
          setRefreshToken((t) => t + 1);
        }}
      />
    );
  }

  if (screen.name === 'dayPicker') {
    const pendientesSugerido = estado
      ? (todos?.filter((e) => e.dia === estado.diaSugerido).length ?? 0) - estado.hechosHoy.size
      : 0;
    const totalSugerido = estado ? todos?.filter((e) => e.dia === estado.diaSugerido).length ?? 0 : 0;
    return (
      <DayPicker
        sugerido={estado?.diaSugerido ?? null}
        pendientesSugerido={pendientesSugerido}
        totalSugerido={totalSugerido}
        onSelect={(dia) => setScreen({ name: 'dayView', dia })}
        onOpenSettings={() => setScreen({ name: 'settings' })}
      />
    );
  }

  if (screen.name === 'dayView') {
    const hechosHoy = estado?.diaSugerido === screen.dia ? estado.hechosHoy : new Set<string>();
    return (
      <ExerciseList
        dia={screen.dia}
        ejercicios={todos}
        error={error}
        hechosHoy={hechosHoy}
        onBack={() => setScreen({ name: 'dayPicker' })}
        onSelect={(ejercicio) => setScreen({ name: 'logger', dia: screen.dia, ejercicio })}
      />
    );
  }

  return (
    <ExerciseLogger
      ejercicio={screen.ejercicio}
      onBack={() => setScreen({ name: 'dayView', dia: screen.dia })}
      onLogged={() => {
        setRefreshToken((t) => t + 1);
        setScreen({ name: 'dayView', dia: screen.dia });
      }}
    />
  );
}

export default App;
