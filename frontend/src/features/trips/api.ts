import { request } from '@/lib/apiClient';

import type {
  CreateTripRequest,
  GetTripsResponse,
  JoinTripRequest,
  JoinTripResponse,
  PlaceSearchResponse,
  Trip,
  TripDestination,
  TripInviteResponse,
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

const getTripInvite = async (tripId: string, signal?: AbortSignal) => {
  const path = `/trips/${encodeURIComponent(tripId)}/invite`;

  return request<TripInviteResponse>(path, {
    method: 'GET',
    signal,
  });
};

// GET /places/:placeId returns PublicLocation (TripDestination), not Google PlaceDetails
const getPlaceDetails = async (placeId: string, signal?: AbortSignal) => {
  const path = `/places/${encodeURIComponent(placeId)}`;

  return request<TripDestination>(path, {
    method: 'GET',
    signal,
  });
};

const joinTrip = async (tripId: string, requestBody: JoinTripRequest) => {
  const path = `/trips/${encodeURIComponent(tripId)}/participants`;

  return request<JoinTripResponse>(path, {
    method: 'POST',
    body: requestBody,
  });
};

export {
  searchPlaces,
  createTrip,
  getTrips,
  getTripInvite,
  getPlaceDetails,
  joinTrip,
};
