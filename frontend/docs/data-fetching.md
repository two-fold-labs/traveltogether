# Data fetching

Read this when reading or changing server data, or adding a query key. Stack: TanStack Query v5.

## Where code goes

- API calls live in the feature's `api.ts`. Components never call `api.ts` directly.
- Each query or mutation gets its own hook file in `features/<name>/hooks/`.
- In components and hooks, get the client with `useQueryClient()`. Import the `queryClient` instance only from `app/`.

## Hook names

| Kind                     | Name it                    | Examples                                       |
| ------------------------ | -------------------------- | ---------------------------------------------- |
| Query (`useQuery`)       | Noun: the data returned    | `useSession`, `useTrips`, `useTrip(tripId)`    |
| Mutation (`useMutation`) | Verb: the action performed | `useCreateTrip`, `useJoinTrip`, `useLeaveTrip` |

- A list is the plural noun (`useTrips`), one item is the singular with its id (`useTrip(tripId)`).
- No HTTP verbs or `List` suffixes: not `useGetTrips`, `usePostTrip`, `useTripList`.

## Query keys

- Keys live in the feature's `queryKeys.ts`, one object per feature (`tripKeys`). Never write a key inline.
- Every key is a function built from an `all()` base, with `as const` on the returned tuple. Call it even without arguments (`tripKeys.list()`).

  ```ts
  const tripKeys = {
    all: () => ['trips'] as const,
    list: () => [...tripKeys.all(), 'list'] as const,
    detail: (tripId: string) => [...tripKeys.all(), 'detail', tripId] as const,
  };
  ```

- Order: feature noun, then kind (`list`, `detail`, `session`), then parameters. Name the kind by the data, not the API function (`list`, not `getTrips`).
- Include every value the query depends on (ids, filters, search text).
- Never use an empty key (`[]`).

## Errors and retries

- `request()` throws only `ApiError`, except for aborts, which are rethrown unchanged. Keep it that way: `ApiError` is registered as TanStack Query's `defaultError`.
- Queries retry network and 5xx errors up to 3 times, never 4xx (set globally). Override `retry` on a hook only with a reason, such as search-as-you-type or a screen with its own retry button.
- For queries whose key changes often, pass TanStack's `signal` from the `queryFn` through `api.ts` to `request()`.

## Mutations

- Invalidate in the mutation hook's `onSuccess` and return the promise. Navigation and toasts go in the call site's `onSuccess`.
- Invalidate the narrowest key that covers the change: create → `list()`; update or delete → `list()` and that item's `detail()`.
- Add `refetchType: 'all'` when the next screen shows the invalidated data.
