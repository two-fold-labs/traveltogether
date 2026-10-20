interface PlaceSuggestion {
  id: string;
  name: string;
  address: string;
  distanceMeters?: number;
}

export interface PlaceSearchResponse {
  places: PlaceSuggestion[];
}

export interface PlaceDetails {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}
