import { type TripStatus } from './trip.constants.js';

export type TripRow = {
  id: string;
  trip_id: string;
  name: string;
  arrive_by: Date | null;
  status: TripStatus;
  created_at: Date;
  started_at: Date | null;
  ended_at: Date | null;
  destination_location_id: string;
  created_by: string;
};

export type LocationRow = {
  id: string;
  name: string;
  address: string | null;
  latitude: string;
  longitude: string;
};

export type TripWithDestinationRow = TripRow & {
  location_id: string;
  location_name: string;
  location_address: string | null;
  location_latitude: string;
  location_longitude: string;
};
