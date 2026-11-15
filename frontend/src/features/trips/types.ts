import { type IconName } from '@/components/ui/Icon';

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
interface TripDestination {
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

// Backend: PublicTripList
export interface GetTripsResponse {
  trips: Trip[];
}

// What a trip card needs. Map each API trip to this shape before rendering,
// so the card does not depend on the full API response.
// The current user's planned route: from their start location to the
// destination. Raw values; formatting happens in the UI. null = not known yet.
export interface TripRouteSummary {
  distanceMeters: number | null;
  durationSeconds: number | null;
  stopCount: number | null; // stops on the way; the destination is not counted
}

export interface TripCardData {
  tripId: string;
  name: string;
  destinationName: string;
  arriveBy: string | null;
  status: TripStatus;
  isOwner: boolean;
  route?: TripRouteSummary; // not returned by the API yet
}
