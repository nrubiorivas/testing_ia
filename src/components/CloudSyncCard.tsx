import { useEffect, useMemo, useState } from 'react';
import { workoutRepository } from '../storage/workoutRepository';
import { pullFromGist, pushToGist } from '../sync/githubGistSync';

const SETTINGS_KEY = 'workout-journal.sync-settings.v1';

interface SyncSettings {
  gistId: string;
  token: string;
}

const readSettings = (): SyncSettings => {
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      return { gistId: '', token: '' };
    }

    const parsed = JSON.parse(raw) as Partial<SyncSettings>;
    return {
      gistId: parsed.gistId ?? '',
      token: parsed.token ?? ''
    };
  } catch {
    return { gistId: '', token: '' };
  }
};

interface CloudSyncCardProps {
  onSynced: () => void;
}

export const CloudSyncCard = ({ onSynced }: CloudSyncCardProps) => {
  const [settings, setSettings] = useState<SyncSettings>(() => readSettings());
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<'push' | 'pull' | null>(null);

  const canSync = useMemo(
    () => settings.gistId.trim().length > 0 && settings.token.trim().length > 0,
    [settings]
  );

  useEffect(() => {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const handlePush = async () => {
    if (!canSync) {
      return;
    }

    try {
      setLoading('push');
      await pushToGist(settings.gistId.trim(), settings.token.trim(), workoutRepository.exportData());
      setError('');
      setMessage('Sync completado: workouts enviados al Gist.');
    } catch (err) {
      setMessage('');
      setError(err instanceof Error ? err.message : 'Error de sync al enviar.');
    } finally {
      setLoading(null);
    }
  };

  const handlePull = async () => {
    if (!canSync) {
      return;
    }

    try {
      setLoading('pull');
      const raw = await pullFromGist(settings.gistId.trim(), settings.token.trim());
      const result = workoutRepository.importData(raw);
      onSynced();
      setError('');
      setMessage(`Sync completado: ${result.imported} workouts descargados.`);
    } catch (err) {
      setMessage('');
      setError(err instanceof Error ? err.message : 'Error de sync al descargar.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <article className="card stack">
      <h3>Sync entre navegadores (GitHub Gist)</h3>
      <p className="muted">
        Si querés ver todos los workouts en distintos navegadores, usá el mismo Gist + token en ambos.
      </p>

      <div className="form-grid">
        <label>
          Gist ID
          <input
            type="text"
            value={settings.gistId}
            onChange={(event) => setSettings((prev) => ({ ...prev, gistId: event.target.value }))}
            placeholder="aa11bb22cc33..."
          />
        </label>

        <label>
          GitHub token (scope: gist)
          <input
            type="password"
            value={settings.token}
            onChange={(event) => setSettings((prev) => ({ ...prev, token: event.target.value }))}
            placeholder="ghp_..."
          />
        </label>
      </div>

      <div className="row">
        <button type="button" className="button secondary" onClick={handlePush} disabled={!canSync || !!loading}>
          {loading === 'push' ? 'Enviando...' : 'Subir workouts'}
        </button>
        <button type="button" className="button" onClick={handlePull} disabled={!canSync || !!loading}>
          {loading === 'pull' ? 'Descargando...' : 'Descargar workouts'}
        </button>
      </div>

      {message ? <p>{message}</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
    </article>
  );
};
