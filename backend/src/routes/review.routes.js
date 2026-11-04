import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { listWorkoutsToReview, getWorkoutForReview, reviewWorkout } from '../services/review.service.js';

// Workout review for trainers (US-09)
const router = Router();

router.use(requireAuth, requireRole('Trainer'));

// GET /api/reviews – Logged workouts of the trainer's own clients
router.get('/', async (req, res) => {
  res.json(await listWorkoutsToReview(req.user.id));
});

// GET /api/reviews/:id – one workout with planned and performed values, the client's note and adherence
router.get('/:id', async (req, res) => {
  res.json(await getWorkoutForReview(req.user.id, req.params.id));
});

// POST /api/reviews/:id – body { feedback }; marks the workout as Reviewed
router.post('/:id', async (req, res) => {
  res.json(await reviewWorkout(req.user.id, req.params.id, req.body?.feedback));
});

export default router;
