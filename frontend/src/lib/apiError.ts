const FALLBACK_ERROR_CODE = 'UNKNOWN_ERROR';

interface ApiErrorDetail {
  field: string;
  message: string;
}

interface ApiErrorOptions {
  status: number;
  // Mirrors the backend ErrorCode (e.g. 'NOT_FOUND'); kept a string so a new
  // backend code doesn't need a frontend change to be carried through
  code: string;
  message: string;
  details?: ApiErrorDetail[] | undefined;
}

class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: ApiErrorDetail[] | undefined;

  constructor({ status, code, message, details }: ApiErrorOptions) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const isErrorDetail = (value: unknown): value is ApiErrorDetail => {
  return (
    isRecord(value) &&
    typeof value.field === 'string' &&
    typeof value.message === 'string'
  );
};

// Backend shape: { error: { code, message, details? } }
const toApiError = (
  status: number,
  statusText: string,
  body: unknown,
): ApiError => {
  if (
    isRecord(body) &&
    isRecord(body.error) &&
    typeof body.error.code === 'string' &&
    typeof body.error.message === 'string'
  ) {
    const { code, message, details } = body.error;

    return new ApiError({
      status,
      code,
      message,
      details: Array.isArray(details)
        ? details.filter(isErrorDetail)
        : undefined,
    });
  }

  return new ApiError({
    status,
    code: FALLBACK_ERROR_CODE,
    message: statusText || 'Request failed',
  });
};

// Validation details keyed by backend field name; {} for any other error
const getFieldErrors = (error: unknown): Record<string, string | undefined> => {
  if (!(error instanceof ApiError) || !error.details) {
    return {};
  }

  return Object.fromEntries(
    error.details.map(({ field, message }) => [field, message]),
  );
};

export { ApiError, getFieldErrors, toApiError };
export type { ApiErrorDetail };
