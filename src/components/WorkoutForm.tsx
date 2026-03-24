import { useMemo, useState } from 'react';
import type { ExerciseInput, WorkoutInput } from '../types/forms';
import type { MuscleGroup, Workout } from '../types/workout';
import { createId } from '../utils/id';

const MUSCLE_GROUPS: MuscleGroup[] = [
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

interface WorkoutFormProps {
  initialWorkout?: Workout;
  onSubmit: (input: WorkoutInput) => void;
  submitLabel: string;
}

const createBlankExercise = (): ExerciseInput => ({
  id: createId(),
  name: '',
  muscleGroup: 'Other',
  sets: 3,
  reps: '10',
  weight: 0,
  notes: ''
});

export const WorkoutForm = ({ initialWorkout, onSubmit, submitLabel }: WorkoutFormProps) => {
  const [date, setDate] = useState(initialWorkout?.date ?? new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState(initialWorkout?.title ?? '');
  const [exercises, setExercises] = useState<ExerciseInput[]>(
    initialWorkout?.exercises.length ? initialWorkout.exercises : [createBlankExercise()]
  );
  const [error, setError] = useState('');

  const canSubmit = useMemo(
    () => date.length > 0 && exercises.length > 0 && exercises.every((exercise) => exercise.name.trim() !== ''),
    [date, exercises]
  );

  const updateExercise = <K extends keyof ExerciseInput>(
    id: string | undefined,
    field: K,
    value: ExerciseInput[K]
  ) => {
    setExercises((current) =>
      current.map((exercise) => (exercise.id === id ? { ...exercise, [field]: value } : exercise))
    );
  };

  const addExercise = () => setExercises((current) => [...current, createBlankExercise()]);

  const removeExercise = (id: string | undefined) => {
    setExercises((current) => current.filter((exercise) => exercise.id !== id));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!canSubmit) {
      setError('Please fill out the date and each exercise name before saving.');
      return;
    }

    setError('');
    onSubmit({
      date,
      title,
      exercises: exercises.map((exercise) => ({
        ...exercise,
        name: exercise.name.trim(),
        reps: exercise.reps.trim()
      }))
    });
  };

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <section className="card form-grid">
        <label>
          Date
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
        </label>

        <label>
          Workout title
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Push Day"
            maxLength={60}
          />
        </label>
      </section>

      <section className="stack">
        {exercises.map((exercise, index) => (
          <article key={exercise.id} className="card exercise-card">
            <div className="card-header">
              <h3>Exercise {index + 1}</h3>
              {exercises.length > 1 ? (
                <button type="button" className="text-button" onClick={() => removeExercise(exercise.id)}>
                  Remove
                </button>
              ) : null}
            </div>

            <div className="form-grid">
              <label>
                Exercise name
                <input
                  type="text"
                  value={exercise.name}
                  onChange={(event) => updateExercise(exercise.id, 'name', event.target.value)}
                  placeholder="Bench Press"
                  required
                />
              </label>

              <label>
                Muscle group
                <select
                  value={exercise.muscleGroup}
                  onChange={(event) =>
                    updateExercise(exercise.id, 'muscleGroup', event.target.value as MuscleGroup)
                  }
                >
                  {MUSCLE_GROUPS.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Sets
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={exercise.sets}
                  onChange={(event) => updateExercise(exercise.id, 'sets', Number(event.target.value))}
                  required
                />
              </label>

              <label>
                Reps
                <input
                  type="text"
                  value={exercise.reps}
                  onChange={(event) => updateExercise(exercise.id, 'reps', event.target.value)}
                  placeholder="8-10"
                  required
                />
              </label>

              <label>
                Weight (kg)
                <input
                  type="number"
                  min={0}
                  step="0.5"
                  value={exercise.weight}
                  onChange={(event) => updateExercise(exercise.id, 'weight', Number(event.target.value))}
                />
              </label>

              <label className="full-width">
                Notes
                <textarea
                  value={exercise.notes}
                  onChange={(event) => updateExercise(exercise.id, 'notes', event.target.value)}
                  rows={2}
                  placeholder="Felt strong today"
                />
              </label>
            </div>
          </article>
        ))}
      </section>

      <div className="row">
        <button type="button" className="button secondary" onClick={addExercise}>
          + Add exercise
        </button>
        <button type="submit" className="button" disabled={!canSubmit}>
          {submitLabel}
        </button>
      </div>

      {error ? <p className="error-text">{error}</p> : null}
    </form>
  );
};
