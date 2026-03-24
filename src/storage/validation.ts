import { z } from 'zod';
import type { Workout } from '../types/workout';

const exerciseSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  muscleGroup: z.enum([
    'Chest',
    'Back',
    'Legs',
    'Shoulders',
    'Arms',
    'Core',
    'Full Body',
    'Cardio',
    'Other'
  ]),
  sets: z.number().int().positive(),
  reps: z.string().min(1),
  weight: z.number().min(0),
  notes: z.string().optional()
});

const workoutSchema = z.object({
  id: z.string(),
  date: z.string(),
  title: z.string().optional(),
  exercises: z.array(exerciseSchema).min(1),
  createdAt: z.string(),
  updatedAt: z.string()
});

const storageEnvelopeSchema = z.object({
  version: z.literal(2),
  updatedAt: z.string(),
  workouts: z.array(z.unknown())
});

export interface StorageEnvelope {
  version: 2;
  updatedAt: string;
  workouts: Workout[];
}

export const parseWorkouts = (payload: unknown): Workout[] => {
  if (!Array.isArray(payload)) {
    return [];
  }

  const valid: Workout[] = [];

  for (const maybeWorkout of payload) {
    const parsed = workoutSchema.safeParse(maybeWorkout);
    if (parsed.success) {
      valid.push(parsed.data);
    }
  }

  return valid;
};

export const parseEnvelope = (payload: unknown): StorageEnvelope | null => {
  const parsed = storageEnvelopeSchema.safeParse(payload);
  if (!parsed.success) {
    return null;
  }

  return {
    version: 2,
    updatedAt: parsed.data.updatedAt,
    workouts: parseWorkouts(parsed.data.workouts)
  };
};
