import { Link } from 'react-router-dom';
import type { Workout } from '../types/workout';

interface WorkoutCardProps {
  workout: Workout;
}

export const WorkoutCard = ({ workout }: WorkoutCardProps) => {
  const totalVolume = workout.exercises.reduce(
    (sum, exercise) => sum + exercise.sets * exercise.weight,
    0
  );

  return (
    <article className="card">
      <div className="card-header">
        <h3>{workout.title || 'Untitled session'}</h3>
        <span>{new Date(workout.date).toLocaleDateString()}</span>
      </div>
      <p>{workout.exercises.length} exercises</p>
      <p>Volume: {Math.round(totalVolume)} kg</p>
      <Link to={`/workouts/${workout.id}`} className="button secondary">
        View details
      </Link>
    </article>
  );
};
