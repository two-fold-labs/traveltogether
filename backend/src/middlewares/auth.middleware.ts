import type { RequestHandler, Response } from 'express';

import { UnauthorizedError } from '#errors/app-error.js';
import { cookieSchema } from '#modules/auth/auth.schema.js';
import { verifyTokenAndGetUser } from '#modules/auth/auth.service.js';

const requireAuth: RequestHandler = async (req, res, next) => {
  const result = cookieSchema.safeParse(req.cookies);
  const token = result.success ? result.data.authToken : null;

  if (!token) {
    throw new UnauthorizedError('Invalid session');
  }

  const user = await verifyTokenAndGetUser(token);

  if (!user) {
    throw new UnauthorizedError('Invalid session');
  }

  res.locals.userId = user.id;
  next();
};

const getUserId = (res: Response) => {
  const userId = res.locals.userId;

  if (!userId) {
    // A plain Error, not an AppError: requireAuth already rejects bad sessions
    // with a 401, so a missing id here is a bug (route without the middleware)
    // and must reach the client as a generic 500, never this message
    throw new Error('requireAuth did not run for this route');
  }

  return userId;
};

export { requireAuth, getUserId };
