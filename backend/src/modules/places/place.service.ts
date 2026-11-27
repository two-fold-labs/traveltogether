import {
  LOCATION_ADDRESS_MAX_LENGTH,
  LOCATION_NAME_MAX_LENGTH,
} from '#constants/location.constants.js';
import { NotFoundError } from '#errors/app-error.js';
import { googleGeocodingClient } from '#integrations/google/geocoding/google-geocoding.client.js';
import { googlePlacesClient } from '#integrations/google/places/google-places.client.js';
import type { LatLngLiteral } from '#types/location.types.js';
import type { PublicLocation } from '#types/public-location.js';

import { CURRENT_LOCATION_NAME } from './place.constants.js';

// Google's labels have no length limit, but the client posts these locations
// back as a trip's source location, which `joinTripSchema` caps at the same
// lengths (the `locations` column sizes). Clamp here so a successful lookup
// can never be rejected on join.
const clampLabel = (value: string, maxLength: number) =>
  value.trim().slice(0, maxLength).trimEnd();

const getSearchPlaceSuggestions = (
  searchText: string,
  origin: LatLngLiteral,
) => {
  return googlePlacesClient.getAutocompleteSuggestions(searchText, origin);
};

const getPlaceLocation = async (placeId: string): Promise<PublicLocation> => {
  const placeDetails = await googlePlacesClient.getPlaceDetails(placeId);

  if (!placeDetails) {
    throw new NotFoundError('Place not found.');
  }

  return {
    name: clampLabel(placeDetails.name, LOCATION_NAME_MAX_LENGTH),
    address: clampLabel(placeDetails.address, LOCATION_ADDRESS_MAX_LENGTH),
    lat: placeDetails.lat,
    lng: placeDetails.lng,
  };
};

// Google only supplies the label. The coordinates stay exactly as received, so
// a GPS point is never snapped to the nearest place.
const reversePlaceLocation = async (
  point: LatLngLiteral,
): Promise<PublicLocation> => {
  const result = await googleGeocodingClient.reverseGeocode(point);

  return {
    name: clampLabel(
      result?.name ?? CURRENT_LOCATION_NAME,
      LOCATION_NAME_MAX_LENGTH,
    ),
    address: clampLabel(result?.address ?? '', LOCATION_ADDRESS_MAX_LENGTH),
    lat: point.lat,
    lng: point.lng,
  };
};

export { getSearchPlaceSuggestions, getPlaceLocation, reversePlaceLocation };
