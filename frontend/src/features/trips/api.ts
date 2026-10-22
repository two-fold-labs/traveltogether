import { request } from '@/lib/apiClient';

import type { PlaceSearchResponse } from './types';

const searchPlaces = async (searchText: string, lat: string, lng: string) => {
  const params = new URLSearchParams({ q: searchText, lat, lng });
  const path = `/places/search?${params.toString()}`;

  const response = await request<PlaceSearchResponse>(path, {
    method: 'GET',
  });

  return response.places;
};

export { searchPlaces };
