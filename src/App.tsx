import { useState } from 'react';
import './App.css';
import { DayPicker } from './components/DayPicker';
import { ExerciseList } from './components/ExerciseList';
import { ExerciseLogger } from './components/ExerciseLogger';
import { Settings } from './components/Settings';
import { isConfigured } from './config';
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

  if (screen.name === 'settings') {
    return <Settings onSaved={() => setScreen({ name: 'dayPicker' })} />;
  }

  if (screen.name === 'dayPicker') {
    return (
      <DayPicker
        onSelect={(dia) => setScreen({ name: 'dayView', dia })}
        onOpenSettings={() => setScreen({ name: 'settings' })}
      />
    );
  }

  if (screen.name === 'dayView') {
    return (
      <ExerciseList
        dia={screen.dia}
        refreshToken={refreshToken}
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
