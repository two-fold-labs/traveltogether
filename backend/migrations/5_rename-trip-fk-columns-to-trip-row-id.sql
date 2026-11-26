-- Up Migration

ALTER TABLE trip_participants RENAME COLUMN trip_id TO trip_row_id;
ALTER TABLE trip_participants
  RENAME CONSTRAINT trip_participants_trip_id_fkey TO trip_participants_trip_row_id_fkey;

ALTER TABLE trip_stops RENAME COLUMN trip_id TO trip_row_id;
ALTER TABLE trip_stops
  RENAME CONSTRAINT trip_stops_trip_id_fkey TO trip_stops_trip_row_id_fkey;

-- Down Migration

ALTER TABLE trip_stops
  RENAME CONSTRAINT trip_stops_trip_row_id_fkey TO trip_stops_trip_id_fkey;
ALTER TABLE trip_stops RENAME COLUMN trip_row_id TO trip_id;

ALTER TABLE trip_participants
  RENAME CONSTRAINT trip_participants_trip_row_id_fkey TO trip_participants_trip_id_fkey;
ALTER TABLE trip_participants RENAME COLUMN trip_row_id TO trip_id;
