import { request } from '@/lib/apiClient';

import type {
  CreateTripRequest,
  CreateTripResponse,
  PlaceSearchResponse,
} from './types';

const searchPlaces = async (searchText: string, lat: string, lng: string) => {
  const params = new URLSearchParams({ q: searchText, lat, lng });
  const path = `/places/search?${params.toString()}`;

  const response = await request<PlaceSearchResponse>(path, {
    method: 'GET',
  });

  return response.places;
};

const createTrip = async (requestBody: CreateTripRequest) => {
  const response = await request<CreateTripResponse>('/trips', {
    method: 'POST',
    body: requestBody,
  });

  return response;
};

export { searchPlaces, createTrip };
