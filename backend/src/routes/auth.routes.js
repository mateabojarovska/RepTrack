import { Router } from 'express';
import { login, getUser } from '../services/auth.service.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/login – body { email, password }; returns { token, user }
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  res.json(await login(email, password));
});

// GET /api/auth/me – the logged-in user; used by the frontend after a page reload
router.get('/me', requireAuth, async (req, res) => {
  res.json(await getUser(req.user.id));
});

export default router;
