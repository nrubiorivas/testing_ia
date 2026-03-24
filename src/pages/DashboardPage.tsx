import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { WorkoutCard } from '../components/WorkoutCard';
import { useWorkoutContext } from '../app/WorkoutContext';
import { DataSyncCard } from '../components/DataSyncCard';

export const DashboardPage = () => {
  const { workouts, reloadFromStorage } = useWorkoutContext();

  const recent = workouts.slice(0, 3);
  const monthlyCount = workouts.filter((workout) => {
    const now = new Date();
    const workoutDate = new Date(workout.date);
    return workoutDate.getMonth() === now.getMonth() && workoutDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <section className="stack">
      <article className="card hero">
        <h1>Welcome back 👋</h1>
        <p>Log today&apos;s session in under a minute.</p>
        <div className="row">
          <Link to="/workouts/new" className="button">
            New Workout
          </Link>
          <Link to="/workouts" className="button secondary">
            View History
          </Link>
        </div>
      </article>

      <section className="metrics-grid">
        <article className="card">
          <h3>This month</h3>
          <p className="metric">{monthlyCount}</p>
          <small>sessions completed</small>
        </article>
        <article className="card">
          <h3>Total workouts</h3>
          <p className="metric">{workouts.length}</p>
          <small>all time</small>
        </article>
      </section>

      <DataSyncCard onImported={reloadFromStorage} />

      <section className="stack">
        <h2>Recent sessions</h2>
        {recent.length === 0 ? (
          <EmptyState
            title="No workouts yet"
            message="Start by logging your first workout session."
            actionHref="/workouts/new"
            actionLabel="Create workout"
          />
        ) : (
          recent.map((workout) => <WorkoutCard key={workout.id} workout={workout} />)
        )}
      </section>
    </section>
  );
};
