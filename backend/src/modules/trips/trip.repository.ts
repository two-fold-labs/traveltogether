import { getDb } from '#config/db.js';

import { TRIP_LIST_LIMIT } from './trip.constants.js';
import type {
  TripRow,
  LocationRow,
  TripWithDestinationRow,
  TripParticipantRow,
} from './trip.types.js';

interface InsertLocationInput {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface InsertTripInput {
  tripId: string;
  name: string;
  arriveBy: Date;
  createdBy: string;
  destinationLocationId: string;
}

interface InsertTripParticipantInput {
  tripRowId: string;
  userId: string;
  isOwner: boolean;
  sourceLocationId: string;
}

const insertLocation = async ({
  name,
  address,
  lat,
  lng,
}: InsertLocationInput) => {
  const db = getDb();

  const result = await db.query<LocationRow>(
    `INSERT INTO locations (name, address, latitude, longitude)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, address, latitude, longitude`,
    [name, address, lat, lng],
  );

  const location = result.rows[0];

  if (!location) {
    throw new Error('Failed to insert location');
  }

  return location;
};

const insertTrip = async ({
  tripId,
  name,
  arriveBy,
  createdBy,
  destinationLocationId,
}: InsertTripInput) => {
  const db = getDb();

  const result = await db.query<TripRow>(
    `INSERT INTO trips (
        trip_id, name, arrive_by,
        destination_location_id, created_by)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (trip_id) DO NOTHING
      RETURNING id, trip_id, name, arrive_by, status, created_at, started_at, ended_at, destination_location_id, created_by`,
    [tripId, name, arriveBy, destinationLocationId, createdBy],
  );

  // undefined means trip_id already exists; the caller retries with a new ID.
  return result.rows[0];
};

const insertTripParticipant = async ({
  tripRowId,
  userId,
  isOwner,
  sourceLocationId,
}: InsertTripParticipantInput) => {
  const db = getDb();
  const text = `INSERT INTO trip_participants (
                  trip_id, user_id, is_owner, source_location_id)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (trip_id, user_id) DO NOTHING
                RETURNING id, trip_id, user_id, is_owner, joined_at, source_location_id`;
  const values = [tripRowId, userId, isOwner, sourceLocationId];

  const result = await db.query<TripParticipantRow>(text, values);

  // undefined means this user is already on the trip.
  return result.rows[0];
};

const toTripWithLocation = (row: TripWithDestinationRow) => {
  const trip: TripRow = {
    id: row.id,
    trip_id: row.trip_id,
    name: row.name,
    arrive_by: row.arrive_by,
    status: row.status,
    created_at: row.created_at,
    started_at: row.started_at,
    ended_at: row.ended_at,
    destination_location_id: row.destination_location_id,
    created_by: row.created_by,
  };

  const location: LocationRow = {
    id: row.location_id,
    name: row.location_name,
    address: row.location_address,
    latitude: row.location_latitude,
    longitude: row.location_longitude,
  };

  return { trip, location };
};

const findTripWithDestinationByTripId = async (tripId: string) => {
  const db = getDb();

  const result = await db.query<TripWithDestinationRow>(
    `SELECT
       t.id, t.trip_id, t.name, t.arrive_by, t.status, t.created_at,
       t.started_at, t.ended_at, t.destination_location_id, t.created_by,
       l.id AS location_id,
       l.name AS location_name,
       l.address AS location_address,
       l.latitude AS location_latitude,
       l.longitude AS location_longitude
     FROM trips t
     INNER JOIN locations l ON l.id = t.destination_location_id
     WHERE t.trip_id = $1`,
    [tripId],
  );

  const row = result.rows[0];

  if (!row) {
    return undefined;
  }

  return toTripWithLocation(row);
};

type TripInviteRow = TripWithDestinationRow & {
  host_name: string | null;
};

const findTripInviteByTripId = async (tripId: string) => {
  const db = getDb();

  const result = await db.query<TripInviteRow>(
    `SELECT
       t.id, t.trip_id, t.name, t.arrive_by, t.status, t.created_at,
       t.started_at, t.ended_at, t.destination_location_id, t.created_by,
       l.id AS location_id,
       l.name AS location_name,
       l.address AS location_address,
       l.latitude AS location_latitude,
       l.longitude AS location_longitude,
       u.name AS host_name
     FROM trips t
     INNER JOIN locations l ON l.id = t.destination_location_id
     LEFT JOIN LATERAL (
       SELECT user_id
       FROM trip_participants
       WHERE trip_id = t.id AND is_owner = true
       ORDER BY joined_at, id
       LIMIT 1
     ) owner ON true
     LEFT JOIN users u ON u.id = owner.user_id
     WHERE t.trip_id = $1`,
    [tripId],
  );

  const row = result.rows[0];

  if (!row) {
    return undefined;
  }

  return { ...toTripWithLocation(row), hostName: row.host_name ?? '' };
};

const findTripParticipantByTripRowIdAndUserId = async (
  tripRowId: string,
  userId: string,
) => {
  const db = getDb();
  const result = await db.query<TripParticipantRow>(
    `SELECT
       id, trip_id, user_id, is_owner, joined_at, source_location_id
     FROM trip_participants
     WHERE trip_id = $1 AND user_id = $2`,
    [tripRowId, userId],
  );

  return result.rows[0];
};

const findTripParticipantsByTripRowId = async (tripRowId: string) => {
  const db = getDb();
  const text = `SELECT
                  id, trip_id, user_id, is_owner, joined_at, source_location_id
                  FROM trip_participants
                  WHERE trip_id = $1
                  ORDER BY joined_at, id ASC`;
  const values = [tripRowId];
  const result = await db.query<TripParticipantRow>(text, values);

  return result.rows;
};

const findTripParticipantsByTripRowIds = async (tripRowIds: string[]) => {
  const db = getDb();
  const text = `SELECT
                  id, trip_id, user_id, is_owner, joined_at, source_location_id
                  FROM trip_participants
                  WHERE trip_id = ANY($1::uuid[])
                  ORDER BY joined_at, id ASC`;
  const values = [tripRowIds];
  const result = await db.query<TripParticipantRow>(text, values);

  return result.rows;
};

// Trips the user participates in, not only the ones they created.
const findTripsWithDestinationByUserId = async (userId: string) => {
  const db = getDb();

  const text = `SELECT
                  t.id, t.trip_id, t.name, t.arrive_by, t.status, t.created_at, t.started_at, t.ended_at,
                  t.created_by, t.destination_location_id, l.id AS location_id, l.name AS location_name,
                  l.address AS location_address, l.latitude AS location_latitude, l.longitude AS location_longitude
                FROM trips t
                INNER JOIN locations l ON l.id = t.destination_location_id
                WHERE EXISTS (
                  SELECT 1 FROM trip_participants tp
                  WHERE tp.trip_id = t.id AND tp.user_id = $1
                )
                ORDER BY t.created_at DESC, t.id
                LIMIT $2`;
  const values = [userId, TRIP_LIST_LIMIT];

  const result = await db.query<TripWithDestinationRow>(text, values);

  return result.rows.map(toTripWithLocation);
};

export {
  insertLocation,
  insertTrip,
  insertTripParticipant,
  findTripWithDestinationByTripId,
  findTripInviteByTripId,
  findTripParticipantByTripRowIdAndUserId,
  findTripParticipantsByTripRowId,
  findTripParticipantsByTripRowIds,
  findTripsWithDestinationByUserId,
};
