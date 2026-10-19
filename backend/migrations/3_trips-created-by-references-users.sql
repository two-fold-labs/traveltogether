-- Up Migration

-- Assumes no existing trips hold non-UUID values in created_by
-- (the cast fails otherwise).
ALTER TABLE trips
  ALTER COLUMN created_by TYPE UUID USING created_by::uuid;

ALTER TABLE trips
  ADD CONSTRAINT trips_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES users(id);

-- Down Migration

ALTER TABLE trips DROP CONSTRAINT trips_created_by_fkey;

ALTER TABLE trips
  ALTER COLUMN created_by TYPE VARCHAR USING created_by::text;
