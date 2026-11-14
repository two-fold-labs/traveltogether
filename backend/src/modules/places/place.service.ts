import { NotFoundError } from '#errors/app-error.js';
import { googleGeocodingClient } from '#integrations/google/geocoding/google-geocoding.client.js';
import { googlePlacesClient } from '#integrations/google/places/google-places.client.js';
import type { LatLngLiteral } from '#types/location.types.js';

import { CURRENT_LOCATION_NAME } from './place.constants.js';
import type { PublicPlaceLocation } from './place.types.js';

const getSearchPlaceSuggestions = (
  searchText: string,
  origin: LatLngLiteral,
) => {
  return googlePlacesClient.getAutocompleteSuggestions(searchText, origin);
};

const getPlaceLocation = async (
  placeId: string,
): Promise<PublicPlaceLocation> => {
  const placeDetails = await googlePlacesClient.getPlaceDetails(placeId);

  if (!placeDetails) {
    throw new NotFoundError('Place not found.');
  }

  return {
    name: placeDetails.name,
    address: placeDetails.address,
    lat: placeDetails.lat,
    lng: placeDetails.lng,
  };
};

// Google only supplies the label. The coordinates stay exactly as received, so
// a GPS point is never snapped to the nearest place.
const reversePlaceLocation = async (
  point: LatLngLiteral,
): Promise<PublicPlaceLocation> => {
  const result = await googleGeocodingClient.reverseGeocode(point);

  return {
    name: result?.name ?? CURRENT_LOCATION_NAME,
    address: result?.address ?? '',
    lat: point.lat,
    lng: point.lng,
  };
};

export { getSearchPlaceSuggestions, getPlaceLocation, reversePlaceLocation };
