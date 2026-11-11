import { type IconName } from '@/components/ui/Icon';

export interface PlaceSuggestion {
  id: string;
  name: string;
  address: string;
  distanceMeters?: number;
}

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

export interface CreateTripRequest {
  name: string;
  arriveBy: string;
  destinationPlaceId: string;
}

export type TripStatus = 'created' | 'started' | 'ended';

interface TripParticipant {
  id: string;
  tripId: string;
  userId: string;
  isOwner: boolean;
  joinedAt: string;
}

// The name can be TripLocation based on future usecase.
interface TripDestination {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface CreateTripResponse {
  tripId: string;
  name: string;
  arriveBy: string | null;
  status: TripStatus;
  createdAt: string;
  destination: TripDestination;
  participants: TripParticipant[];
}

// What a trip card needs. Map each API trip to this shape before rendering,
// so the card does not depend on the full API response.
export interface TripCardData {
  tripId: string;
  name: string;
  destinationName: string;
  arriveBy: string | null;
  status: TripStatus;
  isOwner: boolean;
}
