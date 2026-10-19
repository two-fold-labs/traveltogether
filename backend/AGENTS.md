# AGENTS.md — Backend

Stack: Node · Express 5 · TypeScript (strict, `nodenext`) · PostgreSQL via `pg` (raw SQL, no ORM) · `node-pg-migrate` · `zod` v4 · `jsonwebtoken` + `cookie-parser`.

Commands (from `backend/`): `npm run dev` · `npm run typecheck` · `npm run lint` · `npm run lint:fix` · `npm run format` · `npm run build` · `npm run migrate -- up|down`

## Always follow

1. **Layers:** `routes → controller → service → repository`. HTTP stays in controllers, business rules in services, SQL in repositories. Services never touch `req`/`res`.
2. **Validate every external input with zod** (body, params, query, cookies, token payloads) before using it. No `as` casts or `any` on `req.*`.
3. **Never expose secrets or raw DB rows** in responses or logs. Map rows to API types in the service.
4. **SQL is parameterized.** Never build queries from user input.
5. **Constants:** name any literal that is reused or whose meaning isn't obvious where it's used. Module-specific in `<module>.constants.ts`, shared in `src/constants/`. Keep one source of truth per fact and derive related values instead of repeating them. Declare object constants `as const` so literal types aren't widened.
6. **Imports:** `#alias/…` for cross-folder, relative within a module, always with the `.js` extension. Aliases are defined in `package.json` `imports` (`source` → `src/` for dev and typecheck, `default` → `dist/` for production); a new alias needs both entries.
7. **Env vars** go through `src/config/env.ts` and `.env.example` only; never read `process.env` elsewhere.
8. **HTTP:** follow standard method and status-code semantics.
9. **Errors:** throw `AppError` subclasses from `#errors/app-error.js` for expected (operational) failures; a plain `Error` for "can't happen" invariants. The central `errorHandler` builds the response. Never hand-build error JSON in new controller code. See [docs/conventions.md](docs/conventions.md#error-handling).
10. **Where these docs are silent, follow standard practice** for the stack and state the assumption in your summary. **Stop and ask** before: adding a dependency, changing the schema or migrations, making a security/auth trade-off, deviating from a documented rule, or when a doc contradicts the code (don't silently follow either).
11. **Keep guidance current.** If your change makes this file or a doc wrong, update it in the same change. Read [docs/maintaining-docs.md](docs/maintaining-docs.md) before editing any guidance `.md`.

**Before finishing:** run `npm run lint:fix`, then `npm run typecheck` and `npm run lint`. `eslint.config.js` and `tsconfig.json` are the source of truth for style and strictness. Fix violations; don't work around them with `any`, `!` or lint-disable comments.

## Read the matching doc before starting

| When you are…                                                       | Read                                                 |
| ------------------------------------------------------------------- | ---------------------------------------------------- |
| Creating a module/file, deciding what goes where, or defining types | [docs/architecture.md](docs/architecture.md)         |
| Writing controller/service code, naming, zod usage                  | [docs/conventions.md](docs/conventions.md)           |
| Writing SQL, a repository, a migration, or a row type               | [docs/database.md](docs/database.md)                 |
| Touching login, guests, JWT, cookies, or the current user           | [docs/auth.md](docs/auth.md)                         |
| Editing `AGENTS.md` or anything in `docs/`                          | [docs/maintaining-docs.md](docs/maintaining-docs.md) |

Reference implementation for structure: `src/modules/auth/`. `src/modules/trips/` and `src/modules/places/` predate these rules (manual validation, relative imports, `models/` folder); don't copy their patterns.
