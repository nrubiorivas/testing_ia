import type { MuscleGroup } from './workout';

export interface ExerciseInput {
  id?: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: number;
  reps: string;
  weight: number;
  notes?: string;
}

export interface WorkoutInput {
  date: string;
  title?: string;
  exercises: ExerciseInput[];
}
