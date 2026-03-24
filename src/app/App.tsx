import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { DashboardPage } from '../pages/DashboardPage';
import { NewWorkoutPage } from '../pages/NewWorkoutPage';
import { WorkoutHistoryPage } from '../pages/WorkoutHistoryPage';
import { WorkoutDetailPage } from '../pages/WorkoutDetailPage';
import { ExerciseHistoryPage } from '../pages/ExerciseHistoryPage';

export const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/workouts/new" element={<NewWorkoutPage />} />
          <Route path="/workouts" element={<WorkoutHistoryPage />} />
          <Route path="/workouts/:workoutId" element={<WorkoutDetailPage />} />
          <Route path="/exercise-history" element={<ExerciseHistoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};
