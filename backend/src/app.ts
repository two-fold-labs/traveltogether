import cookieParser from 'cookie-parser';
import express from 'express';

import { NotFoundError } from '#errors/app-error.js';
import { errorHandler } from '#middlewares/error-handler.js';

import apiRouter from './routes.js';

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use('/api', apiRouter);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
  });
});

app.use((req, _res, next) => {
  next(new NotFoundError(`Route ${req.path} not found`));
});

app.use(errorHandler);

export default app;
