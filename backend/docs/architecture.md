# Architecture: what goes where

Read this when creating a module or file, or when unsure which layer some code belongs to.

## Layout

```
src/
├── app.ts               # middleware setup + route mounting
├── server.ts            # listen only
├── config/              # env.ts, db.ts
├── constants/           # constants shared by 2+ modules
├── errors/              # AppError + subclasses, error codes, error types
├── integrations/        # third-party API clients + mappers (google/places)
├── middlewares/         # shared Express middlewares (errorHandler)
├── shared/utils/        # pure helpers used by 2+ modules
├── types/               # types shared by 2+ modules
└── modules/<resource>/
    ├── <entity>.routes.ts
    ├── <entity>.controller.ts
    ├── <entity>.service.ts
    ├── <entity>.repository.ts
    ├── <entity>.schema.ts      # zod: inputs (body, cookies, query, params, JWT payload)
    ├── <entity>.types.ts       # row type + public type
    └── <entity>.constants.ts
```

Naming: the folder is the plural resource name (`trips/`, `places/`); the file prefix is the singular noun (`trip.controller.ts`). Where they are the same word (`auth/auth.service.ts`), use it for both.

Create a file only when it has content. A small module may skip `schema`, `types` or `constants`; never create empty placeholders or pass-through layers.

Legacy, don't add to these: `src/models/` (row types now live in `<entity>.types.ts`) and the module-specific files in `src/types/` (`location.types.ts`, `place.types.ts`).

## Layers

Ask: "what would change if Express or Postgres were swapped out?" That code belongs in the layer that owns it.

| Layer      | Owns                                                                                                     | Never contains          |
| ---------- | -------------------------------------------------------------------------------------------------------- | ----------------------- |
| routes     | method + path → controller, middleware                                                                   | logic                   |
| controller | `req` parsing (zod), calling one service fn, status code, cookies, JSON                                  | business decisions, SQL |
| service    | rules ("reuse a valid session, else create one"), orchestration, token sign/verify, row → public mapping | `req`, `res`, SQL       |
| repository | SQL, typed rows                                                                                          | rules, HTTP, tokens     |

A controller does four things: **parse input → call service → set status/cookies → send JSON**. An `if` about the _domain_ in a controller belongs in the service.

## Types: where each lives

| Type                  | What                                                             | Where                                            |
| --------------------- | ---------------------------------------------------------------- | ------------------------------------------------ |
| Row (`User`)          | one table row, every column, snake_case, nullable as `T \| null` | `<entity>.types.ts`                              |
| Narrowed row          | a query returning fewer columns                                  | `Pick<Row, …>` inline, derived from the row type |
| Public (`PublicUser`) | what the API exposes, camelCase, no secrets                      | `<entity>.types.ts`                              |
| Input                 | request shape                                                    | `z.infer` of the schema in `<entity>.schema.ts`  |

Mapping row → public happens **once, in the service** (`toPublicUser`). Controllers only ever see public types. Details on row types: [database.md](database.md).

When a second module needs a type or constant, move it to `src/types/` or `src/constants/`. Not before.

## Adding a new endpoint: order of work

1. Write the contract in a sentence: method, path, input, success output, failure cases.
2. If it needs new tables or columns: migration and row type first ([database.md](database.md)).
3. Schema for the input.
4. Repository function(s).
5. Service function with the rules.
6. Controller + route, mount in `app.ts`.
7. Call it (curl / REST client) before moving on.

## `app.ts` order matters

`cookieParser()` and `express.json()` before any routes. After all routes: the 404 handler (passes a `NotFoundError` to `next`), then `errorHandler` last.
