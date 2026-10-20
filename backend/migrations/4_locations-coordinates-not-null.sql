-- Up Migration

-- Assumes the locations table is empty (SET NOT NULL fails otherwise).
ALTER TABLE locations
  ALTER COLUMN latitude SET NOT NULL,
  ALTER COLUMN longitude SET NOT NULL;

-- Down Migration

ALTER TABLE locations
  ALTER COLUMN longitude DROP NOT NULL,
  ALTER COLUMN latitude DROP NOT NULL;
