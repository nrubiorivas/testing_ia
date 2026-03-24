import { Link, useNavigate, useParams } from 'react-router-dom';
import { WorkoutForm } from '../components/WorkoutForm';
import { useWorkoutContext } from '../app/WorkoutContext';

export const WorkoutDetailPage = () => {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const { getWorkoutById, updateWorkout, removeWorkout } = useWorkoutContext();

  const workout = workoutId ? getWorkoutById(workoutId) : undefined;

  if (!workoutId || !workout) {
    return (
      <section className="stack">
        <h1>Workout not found</h1>
        <Link className="button" to="/workouts">
          Back to history
        </Link>
      </section>
    );
  }

  return (
    <section className="stack">
      <div className="row">
        <h1>Edit Workout</h1>
        <button
          className="button danger"
          onClick={() => {
            removeWorkout(workout.id);
            navigate('/workouts');
          }}
        >
          Delete
        </button>
      </div>

      <WorkoutForm
        initialWorkout={workout}
        submitLabel="Save changes"
        onSubmit={(input) => {
          updateWorkout(workout.id, input);
          navigate('/workouts');
        }}
      />
    </section>
  );
};
