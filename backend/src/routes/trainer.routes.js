import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import prisma from '../db.js';

const router = Router();

router.use(requireAuth, requireRole('Trainer'));

// GET /api/trainer/clients – the clients assigned to the logged-in trainer
router.get('/clients', async (req, res) => {
  const clients = await prisma.user.findMany({
    where: { trainerId: req.user.id, role: 'Client', isActive: true },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    select: { id: true, firstName: true, lastName: true, email: true },
  });
  res.json(clients);
});

export default router;
