import { Router } from 'express';

const router = Router();

// GET /api/health – quick check that the API is running
router.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

export default router;
