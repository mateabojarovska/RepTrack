import prisma from '../db.js';

const DAY_MS = 24 * 60 * 60 * 1000;

// Today's date (server's local calendar day) as a UTC midnight date, like WorkoutLog.performedOn
function today() {
  return new Date(`${new Date().toLocaleDateString('en-CA')}T00:00:00Z`);
}

// The week (Monday–Sunday) that contains the given date
export function weekRange(date = today()) {
  const dayOfWeek = (date.getUTCDay() + 6) % 7; // Monday = 0 … Sunday = 6
  const start = new Date(date.getTime() - dayOfWeek * DAY_MS);
  const end = new Date(start.getTime() + 6 * DAY_MS);
  return { start, end };
}

const toDateString = (d) => d.toISOString().slice(0, 10);

// US-08: logged workouts in the week ÷ training days of the active plan, as a whole percentage, at most 100
export function adherencePercent(logged, planned) {
  if (!planned) return null;
  return Math.min(100, Math.round((logged / planned) * 100));
}

// Weekly plan adherence of one client; calculated on request, never stored (ADR 0007)
export async function getAdherence(clientId, date) {
  const { start, end } = weekRange(date);

  const activePlan = await prisma.trainingPlan.findFirst({
    where: { clientId, status: 'Active' },
    select: { id: true, title: true, _count: { select: { days: true } } },
  });
  const logged = await prisma.workoutLog.count({
    where: { clientId, performedOn: { gte: start, lte: end } },
  });
  const planned = activePlan ? activePlan._count.days : 0;

  return {
    weekStart: toDateString(start),
    weekEnd: toDateString(end),
    logged,
    planned,
    percent: activePlan ? adherencePercent(logged, planned) : null,
    activePlan: activePlan ? { id: activePlan.id, title: activePlan.title } : null,
  };
}

// The trainer's clients with this week's adherence and the date of their last workout
export async function listClientsWithAdherence(trainerId) {
  const clients = await prisma.user.findMany({
    where: { trainerId, role: 'Client', isActive: true },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    select: { id: true, firstName: true, lastName: true, email: true },
  });

  return Promise.all(
    clients.map(async (client) => {
      const last = await prisma.workoutLog.findFirst({
        where: { clientId: client.id },
        orderBy: { performedOn: 'desc' },
        select: { performedOn: true },
      });
      return {
        ...client,
        adherence: await getAdherence(client.id),
        lastWorkoutOn: last ? toDateString(last.performedOn) : null,
      };
    }),
  );
}
