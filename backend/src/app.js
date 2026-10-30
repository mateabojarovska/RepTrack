import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes.js';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/health', healthRoutes);

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
