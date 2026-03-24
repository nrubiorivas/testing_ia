import { useRef, useState } from 'react';
import { workoutRepository } from '../storage/workoutRepository';

interface DataSyncCardProps {
  onImported: () => void;
}

export const DataSyncCard = ({ onImported }: DataSyncCardProps) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const exportData = () => {
    const blob = new Blob([workoutRepository.exportData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);

    a.href = url;
    a.download = `workout-journal-backup-${date}.json`;
    a.click();

    URL.revokeObjectURL(url);
    setError('');
    setMessage('Backup exportado. Importalo en el otro navegador para ver los mismos datos.');
  };

  const onPickFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const raw = await file.text();
      const result = workoutRepository.importData(raw);
      onImported();
      setError('');
      setMessage(`Importación completa: ${result.imported} entrenamientos cargados.`);
    } catch {
      setMessage('');
      setError('No se pudo importar el archivo. Verifica que sea un JSON válido.');
    } finally {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <article className="card stack">
      <h3>Sincronizar entre navegadores</h3>
      <p className="muted">
        Esta app guarda en el navegador local. Para ver los mismos ejercicios en otro navegador,
        exporta un backup aquí e impórtalo allá.
      </p>

      <div className="row">
        <button type="button" className="button secondary" onClick={exportData}>
          Exportar backup
        </button>

        <label className="button" htmlFor="import-data-file">
          Importar backup
        </label>
        <input
          id="import-data-file"
          ref={inputRef}
          type="file"
          accept="application/json"
          className="hidden-input"
          onChange={onPickFile}
        />
      </div>

      {message ? <p>{message}</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
    </article>
  );
};
