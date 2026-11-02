import prisma from '../db.js';
import { HttpError } from '../utils/httpError.js';
import { formatPlan, PLAN_INCLUDE } from './plan.service.js';

const WORKOUT_INCLUDE = {
  planDay: { select: { id: true, name: true, planId: true } },
  sets: {
    orderBy: [{ exerciseId: 'asc' }, { setNumber: 'asc' }],
    include: { exercise: { select: { id: true, name: true } } },
  },
};

export function formatWorkout(w) {
  return {
    id: w.id,
    performedOn: w.performedOn.toISOString().slice(0, 10),
    status: w.status,
    clientNote: w.clientNote,
    trainerFeedback: w.trainerFeedback,
    reviewedAt: w.reviewedAt,
    createdAt: w.createdAt,
    planDay: w.planDay,
    sets: w.sets.map((s) => ({
      id: s.id,
      exercise: s.exercise,
      setNumber: s.setNumber,
      reps: s.reps,
      weightKg: Number(s.weightKg),
      isPersonalRecord: s.isPersonalRecord,
    })),
  };
}

// ---------- Plans seen by the client ----------

export async function getActivePlan(clientId) {
  const plan = await prisma.trainingPlan.findFirst({
    where: { clientId, status: 'Active' },
    include: PLAN_INCLUDE,
  });
  if (!plan) throw new HttpError(404, 'You do not have an active plan yet');
  return formatPlan(plan);
}

// The client's active and archived plans (drafts are not visible to the client)
export async function listClientPlans(clientId) {
  const plans = await prisma.trainingPlan.findMany({
    where: { clientId, status: { in: ['Active', 'Archived'] } },
    orderBy: { publishedAt: 'desc' },
    select: { id: true, title: true, status: true, publishedAt: true, archivedAt: true },
  });
  return plans;
}

export async function getClientPlan(clientId, planId) {
  const plan = await prisma.trainingPlan.findUnique({ where: { id: Number(planId) || 0 }, include: PLAN_INCLUDE });
  if (!plan || plan.clientId !== clientId || plan.status === 'Draft') throw new HttpError(404, 'Plan not found');
  return formatPlan(plan);
}

// ---------- Logging workouts (US-06) ----------

// Checks the logged workout and returns the training day and the sets in a clean form
async function validateWorkoutInput(clientId, input) {
  const planDayId = Number(input.planDayId);
  const planDay = await prisma.planDay.findUnique({
    where: { id: Number.isInteger(planDayId) ? planDayId : 0 },
    include: { plan: true, exercises: true },
  });
  if (!planDay || planDay.plan.clientId !== clientId || planDay.plan.status !== 'Active') {
    throw new HttpError(400, 'Choose a training day of your active plan');
  }

  const performedOn = input.performedOn ? new Date(`${input.performedOn}T00:00:00Z`) : new Date();
  if (Number.isNaN(performedOn.getTime())) throw new HttpError(400, 'The date is not valid');

  const sets = Array.isArray(input.sets) ? input.sets : [];
  if (sets.length === 0) throw new HttpError(400, 'Log at least one set');

  const dayExerciseIds = new Set(planDay.exercises.map((pe) => pe.exerciseId));
  const setCounter = {};
  const cleanSets = sets.map((s, i) => {
    const exerciseId = Number(s.exerciseId);
    const reps = Number(s.reps);
    const weightKg = s.weightKg === '' || s.weightKg === null || s.weightKg === undefined ? 0 : Number(s.weightKg);

    if (!dayExerciseIds.has(exerciseId)) throw new HttpError(400, `Set ${i + 1} is for an exercise that is not in this training day`);
    if (!Number.isInteger(reps) || reps < 1) throw new HttpError(400, `Repetitions in set ${i + 1} must be a whole number of at least 1`);
    if (!Number.isFinite(weightKg) || weightKg < 0) throw new HttpError(400, `Weight in set ${i + 1} must be 0 or more`);

    // Sets are numbered 1, 2, 3 … per exercise, in the order they were sent
    setCounter[exerciseId] = (setCounter[exerciseId] || 0) + 1;
    return { exerciseId, setNumber: setCounter[exerciseId], reps, weightKg };
  });

  const clientNote = (input.clientNote || '').trim() || null;
  return { planDay, performedOn, clientNote, sets: cleanSets };
}

async function getOwnWorkout(clientId, workoutId) {
  const workout = await prisma.workoutLog.findUnique({ where: { id: Number(workoutId) || 0 }, include: WORKOUT_INCLUDE });
  if (!workout || workout.clientId !== clientId) throw new HttpError(404, 'Workout not found');
  return workout;
}

export async function logWorkout(clientId, input) {
  const data = await validateWorkoutInput(clientId, input);
  const workout = await prisma.workoutLog.create({
    data: {
      clientId,
      planDayId: data.planDay.id,
      performedOn: data.performedOn,
      clientNote: data.clientNote,
      status: 'Logged',
      sets: { create: data.sets },
    },
    include: WORKOUT_INCLUDE,
  });
  return formatWorkout(workout);
}

// The client can correct a workout only while it is Logged (not yet reviewed)
export async function updateWorkout(clientId, workoutId, input) {
  const existing = await getOwnWorkout(clientId, workoutId);
  if (existing.status !== 'Logged') throw new HttpError(409, 'A reviewed workout can no longer be edited');
  const data = await validateWorkoutInput(clientId, { planDayId: existing.planDayId, ...input });

  const workout = await prisma.$transaction(async (tx) => {
    await tx.loggedSet.deleteMany({ where: { workoutLogId: existing.id } });
    return tx.workoutLog.update({
      where: { id: existing.id },
      data: {
        planDayId: data.planDay.id,
        performedOn: data.performedOn,
        clientNote: data.clientNote,
        sets: { create: data.sets },
      },
      include: WORKOUT_INCLUDE,
    });
  });
  return formatWorkout(workout);
}

export async function getWorkout(clientId, workoutId) {
  return formatWorkout(await getOwnWorkout(clientId, workoutId));
}

// The client's workout history, newest first
export async function listClientWorkouts(clientId) {
  const workouts = await prisma.workoutLog.findMany({
    where: { clientId },
    orderBy: [{ performedOn: 'desc' }, { createdAt: 'desc' }],
    include: WORKOUT_INCLUDE,
  });
  return workouts.map(formatWorkout);
}
