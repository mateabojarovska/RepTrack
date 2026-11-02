import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { createPlan, updatePlan, publishPlan, getPlan, listPlans } from '../services/plan.service.js';

const router = Router();

// All plan endpoints are for trainers only
router.use(requireAuth, requireRole('Trainer'));

// GET /api/plans?clientId=4 – the trainer's plans, optionally for one client
router.get('/', async (req, res) => {
  res.json(await listPlans(req.user.id, req.query.clientId));
});

// GET /api/plans/:id – one plan with its days and exercises
router.get('/:id', async (req, res) => {
  res.json(await getPlan(req.user.id, req.params.id));
});

// POST /api/plans – create a draft plan
// body: { clientId, title, goal, days: [{ name, exercises: [{ exerciseId, targetSets, targetReps, targetWeightKg, note }] }] }
router.post('/', async (req, res) => {
  res.status(201).json(await createPlan(req.user.id, req.body || {}));
});

// PUT /api/plans/:id – replace the content of a draft plan (same body without clientId)
router.put('/:id', async (req, res) => {
  res.json(await updatePlan(req.user.id, req.params.id, req.body || {}));
});

// POST /api/plans/:id/publish – make the draft the client's active plan and archive the previous one
router.post('/:id/publish', async (req, res) => {
  res.json(await publishPlan(req.user.id, req.params.id));
});

export default router;
