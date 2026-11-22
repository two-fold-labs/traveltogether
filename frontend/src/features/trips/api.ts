import { request } from '@/lib/apiClient';

import type {
  CreateTripRequest,
  GetTripsResponse,
  PlaceSearchResponse,
  Trip,
} from './types';

const searchPlaces = async (
  searchText: string,
  lat: string,
  lng: string,
  signal?: AbortSignal,
) => {
  const params = new URLSearchParams({ q: searchText, lat, lng });
  const path = `/places/search?${params.toString()}`;

  return request<PlaceSearchResponse>(path, {
    method: 'GET',
    signal,
  });
};

const createTrip = async (requestBody: CreateTripRequest) => {
  return request<Trip>('/trips', {
    method: 'POST',
    body: requestBody,
  });
};

const getTrips = async () => {
  return request<GetTripsResponse>('/trips', {
    method: 'GET',
  });
};

export { searchPlaces, createTrip, getTrips };
