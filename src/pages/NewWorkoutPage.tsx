import { useNavigate } from 'react-router-dom';
import { WorkoutForm } from '../components/WorkoutForm';
import { useWorkoutContext } from '../app/WorkoutContext';

export const NewWorkoutPage = () => {
  const { createWorkout } = useWorkoutContext();
  const navigate = useNavigate();

  return (
    <section className="stack">
      <h1>New Workout</h1>
      <WorkoutForm
        submitLabel="Save workout"
        onSubmit={(input) => {
          createWorkout(input);
          navigate('/workouts');
        }}
      />
    </section>
  );
};
