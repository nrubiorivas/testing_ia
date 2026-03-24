import { useMemo, useState } from 'react';
import type { WorkoutInput } from '../types/forms';
import type { Workout, WorkoutFilters } from '../types/workout';
import { workoutRepository } from '../storage/workoutRepository';

const defaultFilters: WorkoutFilters = {
  query: '',
  muscleGroup: 'All'
};

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>(() => workoutRepository.list());
  const [filters, setFilters] = useState<WorkoutFilters>(defaultFilters);

  const refresh = () => setWorkouts(workoutRepository.list());

  const createWorkout = (input: WorkoutInput) => {
    workoutRepository.create(input);
    refresh();
  };

  const updateWorkout = (id: string, input: WorkoutInput) => {
    workoutRepository.update(id, input);
    refresh();
  };

  const removeWorkout = (id: string) => {
    workoutRepository.remove(id);
    refresh();
  };

  const filteredWorkouts = useMemo(() => {
    const query = filters.query.toLowerCase().trim();

    return workouts.filter((workout) => {
      const titleMatches = workout.title?.toLowerCase().includes(query) ?? false;
      const exerciseMatches = workout.exercises.some((exercise) =>
        exercise.name.toLowerCase().includes(query)
      );

      const queryMatches = query === '' || titleMatches || exerciseMatches;

      const muscleMatches =
        filters.muscleGroup === 'All' ||
        workout.exercises.some((exercise) => exercise.muscleGroup === filters.muscleGroup);

      return queryMatches && muscleMatches;
    });
  }, [workouts, filters]);

  return {
    workouts,
    filteredWorkouts,
    filters,
    setFilters,
    createWorkout,
    updateWorkout,
    removeWorkout,
    getWorkoutById: (id: string) => workouts.find((workout) => workout.id === id)
  };
};
