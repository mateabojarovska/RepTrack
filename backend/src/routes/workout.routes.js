import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { logWorkout, updateWorkout, getWorkout } from '../services/workout.service.js';

const router = Router();

// POST /api/workouts – the client logs a workout for a day of their active plan
// body: { planDayId, performedOn: "2026-11-03", clientNote, sets: [{ exerciseId, reps, weightKg }] }
router.post('/', requireAuth, requireRole('Client'), async (req, res) => {
  res.status(201).json(await logWorkout(req.user.id, req.body || {}));
});

// GET /api/workouts/:id – one of the client's own workouts
router.get('/:id', requireAuth, requireRole('Client'), async (req, res) => {
  res.json(await getWorkout(req.user.id, req.params.id));
});

// PUT /api/workouts/:id – the client corrects a workout that is not reviewed yet
router.put('/:id', requireAuth, requireRole('Client'), async (req, res) => {
  res.json(await updateWorkout(req.user.id, req.params.id, req.body || {}));
});

export default router;
