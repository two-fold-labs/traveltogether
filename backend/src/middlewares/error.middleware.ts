import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

import { AppError, ValidationError } from '#errors/app-error.js';

const isMalformedJsonError = (err: unknown): boolean => {
  return (
    err instanceof SyntaxError &&
    'type' in err &&
    err.type === 'entity.parse.failed'
  );
};

// Normalizes anything thrown into an AppError so there is one response path
const toAppError = (err: unknown): AppError => {
  if (err instanceof AppError) {
    return err;
  }

  if (err instanceof ZodError) {
    return new ValidationError(
      err.issues.map((issue) => ({
        field: issue.path.map(String).join('.'),
        message: issue.message,
      })),
    );
  }

  if (isMalformedJsonError(err)) {
    return new ValidationError(
      [{ field: 'body', message: 'Must be valid JSON' }],
      'Malformed JSON body',
    );
  }

  // Unknown failure: the client gets the generic message, never the original
  return new AppError({ code: 'INTERNAL_ERROR' });
};

const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  // The response already started, so Express has to close the connection
  if (res.headersSent) {
    next(err);

    return;
  }

  const appError = toAppError(err);

  if (appError.statusCode >= 500) {
    console.error(err);
  }

  res.status(appError.statusCode).json({
    error: {
      code: appError.code,
      message: appError.message,
      ...(appError.details?.length ? { details: appError.details } : {}),
    },
  });
};

export { errorHandler };
