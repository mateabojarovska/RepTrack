import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import prisma from '../db.js';

const router = Router();

// GET /api/exercises – the active exercises of the catalogue, for building plans
router.get('/', requireAuth, async (req, res) => {
  const exercises = await prisma.exercise.findMany({
    where: { isActive: true },
    orderBy: [{ muscleGroup: 'asc' }, { name: 'asc' }],
    select: { id: true, name: true, muscleGroup: true, description: true },
  });
  res.json(exercises);
});

export default router;
