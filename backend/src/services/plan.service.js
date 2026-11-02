import prisma from '../db.js';
import { HttpError } from '../utils/httpError.js';

// Days and exercises are always loaded in their order
export const PLAN_INCLUDE = {
  client: { select: { id: true, firstName: true, lastName: true } },
  days: {
    orderBy: { orderIndex: 'asc' },
    include: {
      exercises: {
        orderBy: { orderIndex: 'asc' },
        include: { exercise: { select: { id: true, name: true, muscleGroup: true } } },
      },
    },
  },
};

// Prisma returns decimals as objects; the frontend gets plain numbers
export function formatPlan(plan) {
  return {
    id: plan.id,
    title: plan.title,
    goal: plan.goal,
    status: plan.status,
    publishedAt: plan.publishedAt,
    archivedAt: plan.archivedAt,
    createdAt: plan.createdAt,
    client: plan.client,
    days: plan.days.map((day) => ({
      id: day.id,
      name: day.name,
      orderIndex: day.orderIndex,
      exercises: day.exercises.map((pe) => ({
        id: pe.id,
        exercise: pe.exercise,
        orderIndex: pe.orderIndex,
        targetSets: pe.targetSets,
        targetReps: pe.targetReps,
        targetWeightKg: pe.targetWeightKg === null ? null : Number(pe.targetWeightKg),
        note: pe.note,
      })),
    })),
  };
}

const isPositiveInt = (value) => Number.isInteger(value) && value > 0;

// Checks the plan content sent by the trainer (US-04) and returns it in a clean form
async function validatePlanInput(input) {
  const title = (input.title || '').trim();
  const goal = (input.goal || '').trim() || null;
  const days = Array.isArray(input.days) ? input.days : [];

  if (!title) throw new HttpError(400, 'The plan needs a title');
  if (days.length === 0) throw new HttpError(400, 'The plan needs at least one training day');

  const cleanDays = days.map((day, d) => {
    const name = (day.name || '').trim();
    const exercises = Array.isArray(day.exercises) ? day.exercises : [];
    if (!name) throw new HttpError(400, `Training day ${d + 1} needs a name`);
    if (exercises.length === 0) throw new HttpError(400, `Training day "${name}" needs at least one exercise`);

    return {
      name,
      exercises: exercises.map((ex, e) => {
        const where = `exercise ${e + 1} of "${name}"`;
        const targetSets = Number(ex.targetSets);
        const targetReps = Number(ex.targetReps);
        const hasWeight = ex.targetWeightKg !== null && ex.targetWeightKg !== undefined && ex.targetWeightKg !== '';
        const targetWeightKg = hasWeight ? Number(ex.targetWeightKg) : null;

        if (!Number.isInteger(Number(ex.exerciseId))) throw new HttpError(400, `Choose an exercise for ${where}`);
        if (!isPositiveInt(targetSets)) throw new HttpError(400, `Target sets of ${where} must be a whole number greater than 0`);
        if (!isPositiveInt(targetReps)) throw new HttpError(400, `Target reps of ${where} must be a whole number greater than 0`);
        if (hasWeight && (!Number.isFinite(targetWeightKg) || targetWeightKg < 0)) {
          throw new HttpError(400, `Target weight of ${where} must be 0 or more`);
        }

        return {
          exerciseId: Number(ex.exerciseId),
          targetSets,
          targetReps,
          targetWeightKg,
          note: (ex.note || '').trim() || null,
        };
      }),
    };
  });

  // Every exercise must exist in the catalogue and be active
  const ids = [...new Set(cleanDays.flatMap((day) => day.exercises.map((ex) => ex.exerciseId)))];
  const found = await prisma.exercise.count({ where: { id: { in: ids }, isActive: true } });
  if (found !== ids.length) throw new HttpError(400, 'One of the exercises does not exist or is not active');

  return { title, goal, days: cleanDays };
}

// Prisma "create" data for the days and their exercises
function daysCreateData(days) {
  return {
    create: days.map((day, d) => ({
      name: day.name,
      orderIndex: d,
      exercises: { create: day.exercises.map((ex, e) => ({ ...ex, orderIndex: e })) },
    })),
  };
}

async function assertOwnClient(trainerId, clientId) {
  const client = await prisma.user.findUnique({ where: { id: Number(clientId) || 0 } });
  if (!client || client.role !== 'Client' || client.trainerId !== trainerId) {
    throw new HttpError(403, 'You can create plans only for your own clients');
  }
  return client;
}

// A plan of this trainer, or an error
async function getOwnPlan(trainerId, planId) {
  const plan = await prisma.trainingPlan.findUnique({ where: { id: Number(planId) || 0 }, include: PLAN_INCLUDE });
  if (!plan) throw new HttpError(404, 'Plan not found');
  if (plan.trainerId !== trainerId) throw new HttpError(403, 'This is not your plan');
  return plan;
}

export async function createPlan(trainerId, input) {
  const client = await assertOwnClient(trainerId, input.clientId);
  const data = await validatePlanInput(input);

  const plan = await prisma.trainingPlan.create({
    data: {
      clientId: client.id,
      trainerId,
      title: data.title,
      goal: data.goal,
      status: 'Draft',
      days: daysCreateData(data.days),
    },
    include: PLAN_INCLUDE,
  });
  return formatPlan(plan);
}

export async function updatePlan(trainerId, planId, input) {
  const existing = await getOwnPlan(trainerId, planId);
  if (existing.status !== 'Draft') throw new HttpError(409, 'Only a draft plan can be edited');
  const data = await validatePlanInput(input);

  // The days are replaced as a whole: delete the old ones and create the new ones
  const plan = await prisma.$transaction(async (tx) => {
    await tx.planDay.deleteMany({ where: { planId: existing.id } });
    return tx.trainingPlan.update({
      where: { id: existing.id },
      data: { title: data.title, goal: data.goal, days: daysCreateData(data.days) },
      include: PLAN_INCLUDE,
    });
  });
  return formatPlan(plan);
}

// US-05: the draft becomes the client's active plan, and the previous active plan is archived
// in the same transaction, so a client never has two active plans
export async function publishPlan(trainerId, planId) {
  const existing = await getOwnPlan(trainerId, planId);
  if (existing.status !== 'Draft') throw new HttpError(409, 'Only a draft plan can be published');

  const now = new Date();
  const plan = await prisma.$transaction(async (tx) => {
    await tx.trainingPlan.updateMany({
      where: { clientId: existing.clientId, status: 'Active' },
      data: { status: 'Archived', archivedAt: now },
    });
    return tx.trainingPlan.update({
      where: { id: existing.id },
      data: { status: 'Active', publishedAt: now },
      include: PLAN_INCLUDE,
    });
  });
  return formatPlan(plan);
}

export async function getPlan(trainerId, planId) {
  return formatPlan(await getOwnPlan(trainerId, planId));
}

export async function listPlans(trainerId, clientId) {
  const plans = await prisma.trainingPlan.findMany({
    where: { trainerId, ...(clientId ? { clientId: Number(clientId) } : {}) },
    orderBy: { createdAt: 'desc' },
    include: { client: { select: { id: true, firstName: true, lastName: true } } },
  });
  return plans.map((p) => ({
    id: p.id,
    title: p.title,
    status: p.status,
    client: p.client,
    createdAt: p.createdAt,
    publishedAt: p.publishedAt,
  }));
}
