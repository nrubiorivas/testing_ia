const FILE_NAME = 'workout-journal-sync.json';

interface GistFile {
  filename: string;
  content?: string;
}

interface GistResponse {
  files: Record<string, GistFile>;
}

const headers = (token: string) => ({
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${token}`,
  'X-GitHub-Api-Version': '2022-11-28'
});

export const pullFromGist = async (gistId: string, token: string): Promise<string> => {
  const response = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: headers(token)
  });

  if (!response.ok) {
    throw new Error('No se pudo leer el Gist. Revisa token y gistId.');
  }

  const payload = (await response.json()) as GistResponse;
  const file = payload.files[FILE_NAME] ?? Object.values(payload.files)[0];

  if (!file?.content) {
    throw new Error('El Gist no contiene datos de workouts.');
  }

  return file.content;
};

export const pushToGist = async (gistId: string, token: string, content: string): Promise<void> => {
  const response = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      ...headers(token),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      files: {
        [FILE_NAME]: {
          content
        }
      }
    })
  });

  if (!response.ok) {
    throw new Error('No se pudo guardar en el Gist. Revisa permisos del token.');
  }
};
