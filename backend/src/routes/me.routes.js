import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { getActivePlan, listClientPlans, getClientPlan, listClientWorkouts } from '../services/workout.service.js';
import { getAdherence } from '../services/adherence.service.js';

// Endpoints for the logged-in client: their own plans and workouts
const router = Router();

router.use(requireAuth, requireRole('Client'));

// GET /api/me/active-plan – the client's active plan with days and exercises
router.get('/active-plan', async (req, res) => {
  res.json(await getActivePlan(req.user.id));
});

// GET /api/me/plans – the client's active and archived plans
router.get('/plans', async (req, res) => {
  res.json(await listClientPlans(req.user.id));
});

// GET /api/me/plans/:id – one of the client's active or archived plans
router.get('/plans/:id', async (req, res) => {
  res.json(await getClientPlan(req.user.id, req.params.id));
});

// GET /api/me/workouts – the client's workout history, newest first
router.get('/workouts', async (req, res) => {
  res.json(await listClientWorkouts(req.user.id));
});

// GET /api/me/adherence – the client's plan adherence for the current week
router.get('/adherence', async (req, res) => {
  res.json(await getAdherence(req.user.id));
});

export default router;
