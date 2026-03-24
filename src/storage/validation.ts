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
  exercises: z.array(exerciseSchema),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const workoutListSchema = z.array(workoutSchema);

export const parseWorkouts = (payload: unknown): Workout[] => {
  const parsed = workoutListSchema.safeParse(payload);

  if (!parsed.success) {
    return [];
  }

  return parsed.data;
};
