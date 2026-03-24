import type { MuscleGroup } from '../types/workout';
import { WorkoutCard } from '../components/WorkoutCard';
import { useWorkoutContext } from '../app/WorkoutContext';
import { EmptyState } from '../components/EmptyState';

const groups: Array<MuscleGroup | 'All'> = [
  'All',
  'Chest',
  'Back',
  'Legs',
  'Shoulders',
  'Arms',
  'Core',
  'Full Body',
  'Cardio',
  'Other'
];

export const WorkoutHistoryPage = () => {
  const { filteredWorkouts, filters, setFilters } = useWorkoutContext();

  return (
    <section className="stack">
      <h1>Workout History</h1>
      <section className="card form-grid">
        <label>
          Search
          <input
            type="search"
            placeholder="Find by title or exercise"
            value={filters.query}
            onChange={(event) => setFilters((prev) => ({ ...prev, query: event.target.value }))}
          />
        </label>

        <label>
          Muscle Group
          <select
            value={filters.muscleGroup}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, muscleGroup: event.target.value as MuscleGroup | 'All' }))
            }
          >
            {groups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </label>
      </section>

      {filteredWorkouts.length === 0 ? (
        <EmptyState title="No matching workouts" message="Try a different filter or create a workout." />
      ) : (
        filteredWorkouts.map((workout) => <WorkoutCard key={workout.id} workout={workout} />)
      )}
    </section>
  );
};
