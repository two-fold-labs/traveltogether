import { QueryClient } from '@tanstack/react-query';

import { ApiError } from '@/lib/apiError';

// Safe only because lib/apiClient turns every failure into an ApiError;
// keep that contract when changing the client
declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError;
  }
}

const MAX_QUERY_RETRIES = 3;
const CLIENT_ERROR_MIN_STATUS = 400;
const CLIENT_ERROR_MAX_STATUS = 499;

const isClientError = (error: unknown) =>
  error instanceof ApiError &&
  error.status >= CLIENT_ERROR_MIN_STATUS &&
  error.status <= CLIENT_ERROR_MAX_STATUS;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // A 4xx fails the same way every time, so retrying only delays the error
      retry: (failureCount, error) =>
        !isClientError(error) && failureCount < MAX_QUERY_RETRIES,
    },
  },
});

export { queryClient };
