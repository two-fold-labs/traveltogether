# Auth

Read this when touching login, guests, JWT, cookies, or anything that needs "who is the current user".

## Model

- A guest is a **real `users` row** with `is_anonymous = true`, no email, no password.
- Planned: upgrading to a permanent user = adding email + password hash to the **same row**, so the UUID never changes and trips stay attached.
- No auth library. Hand-rolled with `jsonwebtoken` and `cookie-parser`.

## Session

- Identity travels in an **httpOnly cookie** holding a JWT. Cookie name, algorithm and lifetime: `src/modules/auth/auth.constants.ts`. The signing secret comes from `src/config/env.ts`.
- JWT payload is `{ userId }`, validated with `jwtPayloadSchema`. The algorithm is pinned on both sign and verify.
- Cookie `maxAge` and token expiry derive from the same constant.
- `secure` only in production. `sameSite: 'strict'` works while the frontend and API are the same site; a different-site deployment needs a different setting plus CORS.
- The token is **never** put in a JSON body.

## `POST /auth/guest`

- Valid session cookie and the user still exists: `200`, no new cookie.
- No cookie, a malformed cookie, a bad/expired token, or a deleted user: create a guest, set the cookie, `201`.
- Response body: `{ user: PublicUser }`.

Implementation: `src/modules/auth/`.

## Rules for any future auth code

- Presence of a cookie is not authentication. Always verify the token, validate the payload with zod, then check the user still exists.
- A failed verification (expired, tampered, malformed) means "no valid session".
- **Planned, not built yet:** a `requireAuth` middleware in `src/middlewares/` that reuses the service's token verification and attaches the user id to the request. Don't re-implement verification in controllers.
- **Planned:** password hashing with a per-password salt and timing-safe comparison, never `===`. Never log or return hashes.
- A frontend on another origin needs CORS with `credentials: true` and an explicit origin (never `*`), and `credentials: 'include'` on `fetch`.
