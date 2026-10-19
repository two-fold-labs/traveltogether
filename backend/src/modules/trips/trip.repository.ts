import { getDb } from '#config/db.js';

import type {
  Trip,
  LocationRow,
  TripWithDestinationRow,
} from './trip.types.js';

interface InsertLocationParams {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface InsertTripParams {
  tripId: string;
  name: string;
  arriveBy: Date;
  createdBy: string;
  destinationLocationId: string;
}

const insertLocation = async ({
  name,
  address,
  lat,
  lng,
}: InsertLocationParams) => {
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
}: InsertTripParams) => {
  const db = getDb();

  const result = await db.query<Trip>(
    `INSERT INTO trips (
         trip_id, name, arrive_by, status, created_at,
         destination_location_id, created_by
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
    [tripId, name, arriveBy, destinationLocationId, createdBy],
  );

  const trip = result.rows[0];

  if (!trip) {
    throw new Error('Failed to insert trip.');
  }

  return trip;
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

  const trip: Trip = {
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

export { insertLocation, insertTrip, findTripWithDestinationByTripId };
