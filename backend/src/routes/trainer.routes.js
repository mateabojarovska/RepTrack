import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { listClientsWithAdherence } from '../services/adherence.service.js';

const router = Router();

router.use(requireAuth, requireRole('Trainer'));

// GET /api/trainer/clients – the trainer's clients with this week's plan adherence and last workout date
router.get('/clients', async (req, res) => {
  res.json(await listClientsWithAdherence(req.user.id));
});

export default router;
