-- Up Migration

ALTER TABLE users
  ADD COLUMN email VARCHAR(255),
  ADD COLUMN password_hash TEXT,
  ADD COLUMN is_anonymous BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- A permanent user must have both credentials; a guest may have neither.
ALTER TABLE users
  ADD CONSTRAINT users_anonymous_or_has_credentials_check
  CHECK (is_anonymous OR (email IS NOT NULL AND password_hash IS NOT NULL));

-- Case-insensitive uniqueness: A@x.com and a@x.com are the same email.
-- Guests have NULL email; Postgres allows many NULLs in a unique index.
CREATE UNIQUE INDEX users_email_lower_unique ON users (LOWER(email));

-- Down Migration

DROP INDEX users_email_lower_unique;

ALTER TABLE users DROP CONSTRAINT users_anonymous_or_has_credentials_check;

ALTER TABLE users
  DROP COLUMN created_at,
  DROP COLUMN is_anonymous,
  DROP COLUMN password_hash,
  DROP COLUMN email;
