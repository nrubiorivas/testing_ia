import { createId } from '../utils/id';
import type { WorkoutInput, ExerciseInput } from '../types/forms';
import type { Workout, Exercise } from '../types/workout';
import { parseWorkouts } from './validation';

const STORAGE_KEY = 'workout-journal.v1';

const normalizeExercise = (input: ExerciseInput): Exercise => ({
  id: input.id ?? createId(),
  name: input.name.trim(),
  muscleGroup: input.muscleGroup,
  sets: input.sets,
  reps: input.reps.trim(),
  weight: input.weight,
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

const read = (): Workout[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    return parseWorkouts(JSON.parse(raw));
  } catch {
    return [];
  }
};

const write = (workouts: Workout[]): void => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
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
