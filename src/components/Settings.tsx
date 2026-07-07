import { useState } from 'react';
import { getApiToken, getApiUrl, setApiToken, setApiUrl } from '../config';

interface Props {
  onSaved: () => void;
}

export function Settings({ onSaved }: Props) {
  const [url, setUrl] = useState(getApiUrl());
  const [token, setToken] = useState(getApiToken());

  function handleSave() {
    setApiUrl(url);
    setApiToken(token);
    onSaved();
  }

  return (
    <div className="screen">
      <h1>Configuración</h1>
      <p className="hint">
        Pegá acá la URL de tu Web App de Google Apps Script y el token secreto
        que definiste en <code>Code.gs</code>.
      </p>
      <label className="field">
        URL de la Web App
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://script.google.com/macros/s/.../exec"
        />
      </label>
      <label className="field">
        Token
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="cambiame"
        />
      </label>
      <button className="primary" onClick={handleSave} disabled={!url || !token}>
        Guardar
      </button>
    </div>
  );
}
