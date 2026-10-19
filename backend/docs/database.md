# Database

Read this when writing SQL, a repository, a migration, or a row type.

## Setup

- PostgreSQL via `pg` `Pool` (`src/config/db.ts`), imported as `import db from '#config/db.js'`.
- Development requires a **local** Postgres; production a remote one (enforced in `src/config/env.ts`).
- Migrations: `node-pg-migrate`, plain SQL files in `migrations/`, numbered (`4_add-x.sql`), each with an up section and a `-- Down Migration` section.
- Applied migrations are append-only. Never edit one that has been run elsewhere; add a new one.

## Repository rules

- One function per query; it takes plain args and returns rows (or `undefined`). No business rules.
- Never interpolate user input into SQL text. A fixed, hard-coded column list shared between queries is fine.
- `RETURNING` only on `INSERT/UPDATE/DELETE`. `SELECT` already returns its columns.
- Type the result: `db.query<Row>(text, values)`. The type is a promise you must keep: it must match the columns the query selects. If a query selects fewer columns, use `Pick<Row, …>`.
- `result.rows[0]` is `T | undefined`. Lookups return it as is; for inserts, handle the missing row explicitly (no `!`).
- Prefer naming columns over `SELECT *` when a table holds secrets (`password_hash`).

## Row types

Hand-written, in `<entity>.types.ts`, mirroring the table **exactly**:

| Postgres             | TS (via `pg`)                                          |
| -------------------- | ------------------------------------------------------ |
| `uuid`               | `string`                                               |
| `varchar/text`       | `string`                                               |
| `boolean`            | `boolean`                                              |
| `integer`            | `number`                                               |
| `bigint`, `count(*)` | `string` (pg returns int8 as a string)                 |
| `numeric`            | `string` (pg returns numerics as strings)              |
| `timestamptz`        | `Date`                                                 |
| `jsonb`              | parsed value; treat as `unknown` and validate with zod |
| nullable column      | `T \| null` (pg returns `null`, never `undefined`)     |

Include generated columns (`id`, `created_at`). For inserts, take a small argument object/params instead of the full row type.

Update the row type in the same change as the migration.

## Business rules encoded in the schema

- A permanent user must have both email and password hash; a guest has neither (CHECK on `users`). Upgrading a guest means filling both on the same row.
- Email uniqueness is case-insensitive.

Everything else about table shape: read `migrations/`.
