import { QueryClient } from '@tanstack/react-query';

import { ApiError, NO_RESPONSE_STATUS } from '@/lib/apiError';

// Safe only because lib/apiClient turns every failure into an ApiError;
// keep that contract when changing the client
declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError;
  }
}

const MAX_QUERY_RETRIES = 3;
const SERVER_ERROR_MIN_STATUS = 500;
const SERVER_ERROR_MAX_STATUS = 599;

// Only a network failure or a 5xx can succeed on a retry. Anything else (a 4xx,
// or a 2xx with a non-JSON body) fails the same way every time.
const isRetryableError = (error: unknown) =>
  error instanceof ApiError &&
  (error.status === NO_RESPONSE_STATUS ||
    (error.status >= SERVER_ERROR_MIN_STATUS &&
      error.status <= SERVER_ERROR_MAX_STATUS));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) =>
        isRetryableError(error) && failureCount < MAX_QUERY_RETRIES,
    },
  },
});

export { queryClient };
