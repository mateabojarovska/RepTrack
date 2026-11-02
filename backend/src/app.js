import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import exerciseRoutes from './routes/exercise.routes.js';
import trainerRoutes from './routes/trainer.routes.js';
import planRoutes from './routes/plan.routes.js';
import meRoutes from './routes/me.routes.js';
import workoutRoutes from './routes/workout.routes.js';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/trainer', trainerRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/me', meRoutes);
app.use('/api/workouts', workoutRoutes);

// Unknown API address
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Errors thrown in routes and services end up here
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ message: status === 500 ? 'Internal server error' : err.message });
});

export default app;
