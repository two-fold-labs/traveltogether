# Conventions

Read this when writing controller/service code, naming things, or using zod.

## Naming

- Files: `<entity>.<layer>.ts` (`auth.service.ts`), see [architecture.md](architecture.md). Constants: `<entity>.constants.ts`.
- Controller handlers are named for the user-facing action (`guestLogin`, `createTrip`). Services are named for the business operation (`resolveGuestSession`, `createTrip`).
- Zod schemas: `camelCase` + `Schema` suffix (`cookieSchema`).
- Types (where each lives: [architecture.md](architecture.md#types-where-each-lives)). Each suffix means one thing; don't reuse it for another layer:

  | Type             | Name                                                          |
  | ---------------- | ------------------------------------------------------------- |
  | Row              | `<Entity>Row` (`TripRow`, `LocationRow`)                      |
  | Repository input | `Insert<Entity>Input`, `Update<Entity>Input`                  |
  | Request          | `<Action><Entity><Source>`: `CreateTripBody`, `GetTripParams` |
  | Public           | `Public<Entity>` (`PublicUser`, `PublicTrip`)                 |

  `Body` / `Params` / `Query` name where the client sent it (`req.body`, `req.params`, `req.query`). `User` in `auth.types.ts` predates this and keeps its name until that file is touched; new types follow the table.

- Repository functions are named for the SQL operation and the table, with the lookup key when it isn't obvious: `insertTrip`, `findUserById`, `findTripWithDestinationByTripId`. Use `insert` for writes, not `create`; `create` is for service operations.
- Constants: `UPPER_SNAKE_CASE`, flat and descriptive (`AUTH_COOKIE_NAME`), not a grab-bag object. Use an `as const` object only for a real set of alternatives.

## Controller shape

```ts
const handler: RequestHandler = async (req, res, next) => {
  try {
    const input = someSchema.parse(req.body);
    const result = await someService.doThing(input);

    res.status(201).json({ thing: result });
  } catch (error) {
    next(error);
  }
};
```

Real example: `src/modules/auth/auth.controller.ts`. `try/catch → next(error)` is the existing pattern. Express 5 also forwards rejected promises from async handlers, so the `try/catch` is optional, but not yet decided; follow the surrounding code.

- Never `return res.json(...)`; send, then `return;` only where an early exit is needed. Never send twice (return after an early response).
- Decide per endpoint whether invalid input is an error or a fall-through (e.g. a bad cookie on a guest endpoint just means "no session").
- A create-or-reuse endpoint returns `201` when it creates and `200` when it reuses.

## Validation

- Use `safeParse` where invalid input is an expected value you handle (e.g. an optional cookie). Use `parse` where invalid input should fail the request: the `ZodError` reaches `errorHandler`, which responds `422`.
- Zod v4: top-level formats (`z.uuid()`, `z.email()`), not `z.string().uuid()`.

## Error handling

Errors live in `src/errors/`; `src/middlewares/error-handler.ts` turns them into responses (`{ error: { code, message, details? } }`).

- **Throw, don't respond.** Throw and let `errorHandler` respond (an `AppError` subclass for operational errors, see below). Don't hand-build error JSON in new code.
- **Add a new error** as a code in `error.constants.ts` (it fixes the status and default message); don't pass a status separately.
- **Security-sensitive endpoints** (login, tokens): don't let a `ZodError` through, since its issues become the response `details`. Throw an error without `details`.
- **Legacy:** `trips/` and `places/` still hand-build `400` responses; migrate them when touched.

### Two kinds of error

|             | Operational error                                                                           | Invariant violation (a bug)                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Meaning     | An expected failure the client can act on: not found, unauthorized, invalid input, conflict | A condition the code assumes is always true, but isn't: an `INSERT ... RETURNING` that returns no row, an impossible `switch` case |
| Throw       | An `AppError` subclass with a code in `error.constants.ts`                                  | A plain `Error` with a descriptive message                                                                                         |
| Client sees | The error's code and message                                                                | Only the generic `INTERNAL_ERROR` (`errorHandler` hides the original)                                                              |
| Server log  | Not logged                                                                                  | Logged by `errorHandler` (every 5xx)                                                                                               |

If a user can trigger it through normal use, it is operational. Never throw an `AppError` for an invariant: its message is sent to the client.

Where each layer handles them:

- **Repository:** a lookup that finds nothing returns `undefined`. An insert that returns no row is an invariant, so throw a plain `Error` there (once, next to the query) and return a non-optional type. No business rules.
- **Service:** decides what a missing or conflicting row means and throws the `AppError` (e.g. not found, conflict). Never touches `req`/`res`.
- **Controller:** `try/catch → next(error)`. Does not build error responses.
- **`errorHandler`:** the only place that builds error responses and logs. It maps a `ZodError` or malformed JSON to a `422` validation error, and anything else that isn't an `AppError` to the generic `500`.

Example: `createGuestUser` in `src/modules/auth/auth.repository.ts` throws on a missing row; `findUserById` returns `undefined` because "no such user" is a normal outcome the service handles.
