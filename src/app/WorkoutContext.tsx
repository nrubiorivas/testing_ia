import { createContext, useContext } from 'react';
import { useWorkouts } from './useWorkouts';

type WorkoutContextValue = ReturnType<typeof useWorkouts>;

const WorkoutContext = createContext<WorkoutContextValue | null>(null);

interface WorkoutProviderProps {
  children: React.ReactNode;
}

export const WorkoutProvider = ({ children }: WorkoutProviderProps) => {
  const value = useWorkouts();
  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>;
};

export const useWorkoutContext = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkoutContext must be used within WorkoutProvider');
  }
  return context;
};
