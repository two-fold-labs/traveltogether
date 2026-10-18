import { ApiError, toApiError } from './apiError';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const NO_CONTENT_STATUS = 204;
const INVALID_RESPONSE_CODE = 'INVALID_RESPONSE';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
}

// Error bodies may be empty or non-JSON (e.g. a proxy 502), so never trust them
const parseBody = async (res: Response): Promise<unknown> => {
  const text = await res.text();

  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
};

const request = async <T>(
  path: string,
  { method = 'GET', body, signal }: RequestOptions = {},
): Promise<T> => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    signal,
    headers:
      body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (res.status === NO_CONTENT_STATUS) {
    return undefined as T;
  }

  const data = await parseBody(res);

  if (!res.ok) {
    throw toApiError(res.status, res.statusText, data);
  }

  // A 2xx that isn't JSON means we hit the wrong server (e.g. Vite's
  // index.html fallback when the proxy is missing), not a real success
  if (data === undefined) {
    throw new ApiError({
      status: res.status,
      code: INVALID_RESPONSE_CODE,
      message: 'Expected a JSON response',
    });
  }

  // Caller picks T; the server contract is trusted, not validated here
  return data as T;
};

export { request };
