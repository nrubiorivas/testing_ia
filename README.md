# Workout Journal (GitHub Pages Static Prototype)

A frontend-first workout tracking app designed for low-friction daily logging and review.

## Why this stack

- **Vite + React + TypeScript**: fast local dev, simple deployment, maintainable structure.
- **HashRouter**: avoids GitHub Pages 404 routing issues without server rewrites.
- **localStorage repository layer**: simple now, replaceable later with real backend.

## Architecture (frontend-first)

- **Presentation layer**: reusable components + route pages.
- **State layer**: `WorkoutContext` + `useWorkouts` hook.
- **Data layer**: `workoutRepository` abstraction hiding storage details.
- **Validation layer**: zod parsing to protect against malformed localStorage payloads.

### Data flow

`Form -> useWorkouts actions -> workoutRepository -> localStorage -> UI refresh`

## Persistence Strategy

Current: `localStorage` (`workout-journal.v1` key)

Why:
- Perfect for static hosting and zero backend setup
- Instant reads/writes
- Easy MVP iteration

Future migration path:
- Keep repository interface (`list/getById/create/update/remove`)
- Swap storage implementation to IndexedDB, SQLite API, Supabase, etc.
- Leave UI mostly unchanged

## Data model

```ts
Workout {
  id: string;
  date: string; // YYYY-MM-DD
  title?: string;
  exercises: Exercise[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

Exercise {
  id: string;
  name: string;
  muscleGroup: 'Chest' | 'Back' | ...;
  sets: number;
  reps: string;   // e.g. "8-10"
  weight: number; // kg
  notes?: string;
}
```

## Screens

1. **Dashboard**
   - Metrics cards (this month / all-time)
   - Recent sessions
   - CTA to log new workout
2. **New Workout**
   - Workout metadata + dynamic exercise form
3. **Workout History**
   - Search + muscle group filter + cards
4. **Workout Detail / Edit**
   - Full edit form + delete action
5. **Exercise History**
   - Aggregated usage count + latest weight/date

## Reusable components

- `Layout` (header + nav)
- `WorkoutCard`
- `WorkoutForm`
- `EmptyState`

## Folder structure

```txt
src/
  app/
    App.tsx
    WorkoutContext.tsx
    useWorkouts.ts
  components/
    EmptyState.tsx
    Layout.tsx
    WorkoutCard.tsx
    WorkoutForm.tsx
  pages/
    DashboardPage.tsx
    NewWorkoutPage.tsx
    WorkoutHistoryPage.tsx
    WorkoutDetailPage.tsx
    ExerciseHistoryPage.tsx
  storage/
    workoutRepository.ts
    validation.ts
  types/
    forms.ts
    workout.ts
  utils/
    id.ts
  styles/
    global.css
```

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to GitHub Pages

### Option A (recommended): GitHub Actions

1. Push this repo to GitHub.
2. In GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Add workflow:

```yml
name: Deploy to Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### Option B: `gh-pages` CLI

```bash
npm run deploy
```

## Why this is a best fit for GitHub Pages

- Fully static output
- No backend dependency
- Works offline-ish for logged data on same browser profile
- Simple repository and deployment pipeline

## Limitations of this architecture

- Data is tied to one browser/device profile
- No account sync or multi-user support
- localStorage size limits
- No secure server-side backup

## Migration options later

- **IndexedDB**: bigger local storage + better structured browser persistence.
- **Supabase**: add auth + cloud Postgres + real-time sync.
- **SQLite backend**: simple API service with SQLite for self-hosted setup.

Migration strategy:
1. Keep `Workout` and `Exercise` domain types.
2. Add new repository implementation (`supabaseRepository`, `indexedDbRepository`, etc.).
3. Switch provider wiring from localStorage repo to new adapter.
4. Add import/export migration utility for existing local data.
