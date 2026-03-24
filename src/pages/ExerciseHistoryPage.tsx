import { useMemo } from 'react';
import { useWorkoutContext } from '../app/WorkoutContext';

export const ExerciseHistoryPage = () => {
  const { workouts } = useWorkoutContext();

  const history = useMemo(() => {
    const map = new Map<string, { name: string; count: number; lastWeight: number; lastDate: string }>();

    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        const key = exercise.name.toLowerCase();
        const current = map.get(key);

        if (!current) {
          map.set(key, {
            name: exercise.name,
            count: 1,
            lastWeight: exercise.weight,
            lastDate: workout.date
          });
          return;
        }

        const shouldReplace = current.lastDate < workout.date;
        map.set(key, {
          ...current,
          count: current.count + 1,
          lastWeight: shouldReplace ? exercise.weight : current.lastWeight,
          lastDate: shouldReplace ? workout.date : current.lastDate
        });
      });
    });

    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [workouts]);

  return (
    <section className="stack">
      <h1>Exercise History</h1>
      <p className="muted">Track how often you performed each movement and your latest logged weight.</p>

      {history.length === 0 ? (
        <article className="card">
          <p>No exercise history yet. Add workouts to unlock this view.</p>
        </article>
      ) : (
        history.map((item) => (
          <article className="card" key={item.name}>
            <div className="card-header">
              <h3>{item.name}</h3>
              <span>{item.count} sessions</span>
            </div>
            <p>Last weight: {item.lastWeight} kg</p>
            <small>Last performed: {new Date(item.lastDate).toLocaleDateString()}</small>
          </article>
        ))
      )}
    </section>
  );
};
