export const ERROR_CODES = {
  NOT_FOUND: {
    statusCode: 404,
    message: 'Resource Not Found',
  },
  VALIDATION_ERROR: {
    statusCode: 422,
    message: 'Validation Failed',
  },
  INTERNAL_ERROR: {
    statusCode: 500,
    message: 'Internal Server Error',
  },
  UNAUTHORIZED: {
    statusCode: 401,
    message: 'Unauthorized',
  },
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;
