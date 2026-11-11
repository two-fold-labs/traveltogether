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

export type TripParticipantRow = {
  id: string;
  // TODO(TT-14): rename trip_participants.trip_id to trip_row_id
  trip_id: string;
  user_id: string;
  is_owner: boolean;
  joined_at: Date;
  source_location_id: string;
};

export type PublicParticipant = {
  id: string;
  tripId: string;
  userId: string;
  isOwner: boolean;
  joinedAt: Date;
};

export type PublicLocation = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

export type PublicTrip = {
  tripId: string;
  name: string;
  arriveBy: Date | null;
  status: TripStatus;
  createdAt: Date;
  destination: PublicLocation;
  participants: PublicParticipant[];
};

export type PublicTripList = {
  trips: PublicTrip[];
};
