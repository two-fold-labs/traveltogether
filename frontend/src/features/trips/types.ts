import { type IconName } from '@/components/ui/Icon';

// TODO(TT-20): replace hand-written API types with ones generated from the OpenAPI spec

// Backend: PlaceSuggestion
export interface PlaceSuggestion {
  id: string;
  name: string;
  address: string;
  distanceMeters?: number;
}

// Backend: PlaceSearchResponse
export interface PlaceSearchResponse {
  places: PlaceSuggestion[];
}

export interface LocationOption {
  id: string;
  name: string;
  category: string;
  tag: string;
  icon: IconName;
  dist: string;
  drive: string;
}

export interface CreateTripValues {
  name: string;
  arriveBy: string;
  destination: PlaceSuggestion | null;
}

export type CreateTripErrors = Partial<Record<keyof CreateTripValues, string>>;

// Backend: CreateTripBody
export interface CreateTripRequest {
  name: string;
  arriveBy: string;
  destinationPlaceId: string;
}

// Backend: TripStatus
export type TripStatus = 'created' | 'started' | 'ended';

// Backend: PublicParticipant
interface TripParticipant {
  id: string;
  tripId: string;
  userId: string;
  isOwner: boolean;
  joinedAt: string;
}

// Backend: PublicLocation
// The name can be TripLocation based on future usecase.
export interface TripDestination {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

// Backend: PublicTrip
export interface Trip {
  tripId: string;
  name: string;
  arriveBy: string | null;
  status: TripStatus;
  createdAt: string;
  destination: TripDestination;
  participants: TripParticipant[];
}

// Backend: PublicTripInvite
export interface TripInvite {
  tripId: string;
  name: string;
  arriveBy: string | null;
  status: TripStatus;
  hostName: string;
  destination: TripDestination;
  alreadyJoined: boolean;
}

// Backend: unnamed, built in trip.controller.ts getTripInvite
export interface TripInviteResponse {
  trip: TripInvite;
}

// Backend: JoinTripBody
export interface JoinTripRequest {
  sourceLocation: TripDestination;
}

// Backend: unnamed, built in trip.controller.ts joinTrip
export interface JoinTripResponse {
  tripId: string;
}

// Backend: PublicTripList
export interface GetTripsResponse {
  trips: Trip[];
}

// The current user's planned route: from their start location to the
// destination. Not returned by the API yet. Raw values; formatting happens in
// the UI. null = not known yet.
export interface TripRouteSummary {
  distanceMeters: number | null;
  durationSeconds: number | null;
  stopCount: number | null; // stops on the way; the destination is not counted
}
