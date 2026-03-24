import { createId } from '../utils/id';
import type { WorkoutInput, ExerciseInput } from '../types/forms';
import type { Workout, Exercise } from '../types/workout';
import { parseEnvelope, parseWorkouts } from './validation';

const STORAGE_KEY = 'workout-journal.v2';
const LEGACY_STORAGE_KEY = 'workout-journal.v1';

const normalizeExercise = (input: ExerciseInput): Exercise => ({
  id: input.id ?? createId(),
  name: input.name.trim(),
  muscleGroup: input.muscleGroup,
  sets: Math.max(1, Math.trunc(input.sets)),
  reps: input.reps.trim(),
  weight: Number.isFinite(input.weight) && input.weight > 0 ? input.weight : 0,
  notes: input.notes?.trim() || undefined
});

const normalizeWorkout = (input: WorkoutInput, existingId?: string, createdAt?: string): Workout => {
  const now = new Date().toISOString();

  return {
    id: existingId ?? createId(),
    date: input.date,
    title: input.title?.trim() || undefined,
    exercises: input.exercises.map(normalizeExercise),
    createdAt: createdAt ?? now,
    updatedAt: now
  };
};

const safeStorageGet = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeStorageSet = (key: string, value: string): void => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // no-op: browser privacy mode can block storage access
  }
};

const read = (): Workout[] => {
  try {
    const raw = safeStorageGet(STORAGE_KEY);
    if (raw) {
      const envelope = parseEnvelope(JSON.parse(raw));
      if (envelope) {
        return envelope.workouts;
      }

      // if a v2 key exists but has legacy array payload, salvage it.
      const legacyPayload = parseWorkouts(JSON.parse(raw));
      if (legacyPayload.length > 0) {
        return legacyPayload;
      }
    }

    const legacyRaw = safeStorageGet(LEGACY_STORAGE_KEY);
    if (!legacyRaw) {
      return [];
    }

    return parseWorkouts(JSON.parse(legacyRaw));
  } catch {
    return [];
  }
};

const write = (workouts: Workout[]): void => {
  const payload = {
    version: 2,
    updatedAt: new Date().toISOString(),
    workouts
  };

  safeStorageSet(STORAGE_KEY, JSON.stringify(payload));
};

export const workoutRepository = {
  list(): Workout[] {
    return read().sort((a, b) => (a.date < b.date ? 1 : -1));
  },

  getById(id: string): Workout | undefined {
    return read().find((workout) => workout.id === id);
  },

  create(input: WorkoutInput): Workout {
    const workouts = read();
    const workout = normalizeWorkout(input);
    workouts.push(workout);
    write(workouts);
    return workout;
  },

  update(id: string, input: WorkoutInput): Workout | null {
    const workouts = read();
    const idx = workouts.findIndex((workout) => workout.id === id);

    if (idx === -1) {
      return null;
    }

    const current = workouts[idx];
    const updated = normalizeWorkout(input, current.id, current.createdAt);
    workouts[idx] = updated;
    write(workouts);

    return updated;
  },

  remove(id: string): void {
    write(read().filter((workout) => workout.id !== id));
  }
};
