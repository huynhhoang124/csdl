import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { sequelize } from './db.js';
import './models/index.js';
import { authRouter } from './routes/auth.routes.js';
import { studentRouter } from './routes/student.routes.js';
import { teacherRouter } from './routes/teacher.routes.js';
import { devRouter } from './routes/dev.routes.js';
import { errorHandler } from './middlewares/error.js';

const app = express();
const PORT = Number(process.env.PORT ?? 4000);
const CORS_ORIGIN = (process.env.CORS_ORIGIN ?? 'http://localhost:5173').split(',');

app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/api/health', async (_req, res) => {
  let db: 'up' | 'down' = 'down';
  try {
    await sequelize.authenticate();
    db = 'up';
  } catch { /* ignore */ }
  res.json({ status: 'ok', service: 'qldh-backend', db, ts: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/students', studentRouter);
app.use('/api/teachers', teacherRouter);
app.use('/api/dev', devRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[qldh-backend] listening on http://localhost:${PORT}`);
});
