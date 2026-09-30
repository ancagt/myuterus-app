import express, { type ErrorRequestHandler } from 'express';
import conditionsRouter from './routes/conditions.js';
import symptomsRouter from './routes/symptoms.js';

const app = express();
const PORT = process.env.PORT || 4001;

app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/conditions', conditionsRouter);
app.use('/api/symptoms', symptomsRouter);

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const handleError: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};
app.use(handleError);

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});