import prisma from '../db.js';
import { HttpError } from '../utils/httpError.js';
import { formatWorkout } from './workout.service.js';
import { getAdherence } from './adherence.service.js';

const CLIENT_SELECT = { select: { id: true, firstName: true, lastName: true, trainerId: true } };

// Logged workouts of the trainer's own clients, waiting for review (US-09)
export async function listWorkoutsToReview(trainerId) {
  const workouts = await prisma.workoutLog.findMany({
    where: { status: 'Logged', client: { trainerId } },
    orderBy: [{ performedOn: 'asc' }, { createdAt: 'asc' }],
    include: { client: CLIENT_SELECT, planDay: { select: { id: true, name: true } } },
  });
  return workouts.map((w) => ({
    id: w.id,
    performedOn: w.performedOn.toISOString().slice(0, 10),
    client: { id: w.client.id, firstName: w.client.firstName, lastName: w.client.lastName },
    planDay: w.planDay,
  }));
}

// A workout of one of the trainer's own clients, or an error
async function getClientWorkout(trainerId, workoutId) {
  const workout = await prisma.workoutLog.findUnique({
    where: { id: Number(workoutId) || 0 },
    include: {
      client: CLIENT_SELECT,
      planDay: {
        select: {
          id: true,
          name: true,
          planId: true,
          exercises: { orderBy: { orderIndex: 'asc' }, include: { exercise: { select: { id: true, name: true } } } },
        },
      },
      sets: { orderBy: [{ exerciseId: 'asc' }, { setNumber: 'asc' }], include: { exercise: { select: { id: true, name: true } } } },
    },
  });
  if (!workout) throw new HttpError(404, 'Workout not found');
  if (workout.client.trainerId !== trainerId) throw new HttpError(403, 'This is not a workout of your client');
  return workout;
}

// Planned and performed values side by side, one row per set (as in wireframe 3)
function compareRows(workout) {
  const rows = [];
  for (const pe of workout.planDay.exercises) {
    const done = workout.sets.filter((s) => s.exerciseId === pe.exerciseId);
    const count = Math.max(pe.targetSets, done.length);
    for (let i = 0; i < count; i += 1) {
      const set = done[i];
      rows.push({
        exercise: pe.exercise,
        setNumber: i + 1,
        planned:
          i < pe.targetSets
            ? { reps: pe.targetReps, weightKg: pe.targetWeightKg === null ? null : Number(pe.targetWeightKg) }
            : null,
        done: set ? { reps: set.reps, weightKg: Number(set.weightKg), isPersonalRecord: set.isPersonalRecord } : null,
      });
    }
  }
  return rows;
}

export async function getWorkoutForReview(trainerId, workoutId) {
  const workout = await getClientWorkout(trainerId, workoutId);
  return {
    ...formatWorkout(workout),
    client: { id: workout.client.id, firstName: workout.client.firstName, lastName: workout.client.lastName },
    rows: compareRows(workout),
    adherence: await getAdherence(workout.client.id, workout.performedOn),
  };
}

// US-09: the trainer writes feedback and marks the workout as reviewed.
// Only the feedback, status and review time change; the client's sets are never touched.
export async function reviewWorkout(trainerId, workoutId, feedback) {
  const workout = await getClientWorkout(trainerId, workoutId);
  if (workout.status !== 'Logged') throw new HttpError(409, 'This workout has already been reviewed');

  const text = (feedback || '').trim();
  if (!text) throw new HttpError(400, 'Write feedback before marking the workout as reviewed');

  await prisma.workoutLog.update({
    where: { id: workout.id },
    data: { status: 'Reviewed', trainerFeedback: text, reviewedAt: new Date() },
  });
  return getWorkoutForReview(trainerId, workout.id);
}
