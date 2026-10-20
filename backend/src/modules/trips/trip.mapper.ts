import type { LocationRow, TripRow } from './trip.types.js';

export function mapTrip(trip: TripRow, location: LocationRow) {
  return {
    tripId: trip.trip_id,
    name: trip.name,
    arriveBy: trip.arrive_by,
    status: trip.status,
    createdAt: trip.created_at,
    destination: {
      name: location.name,
      address: location.address ?? '',
      lat: location.latitude,
      lng: location.longitude,
    },
  };
}
