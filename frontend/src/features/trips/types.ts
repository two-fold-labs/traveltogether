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
  tripName: string;
  arriveBy: string;
  destination: PlaceSuggestion | null;
}
