import type { protos } from '@googlemaps/places';

import type { PlaceDetails, PlaceSearchResponse } from '#types/place.types.js';

type IAutocompletePlacesResponse =
  protos.google.maps.places.v1.IAutocompletePlacesResponse;

type IPlace = protos.google.maps.places.v1.IPlace;

export function mapAutocompleteResponse(
  response: IAutocompletePlacesResponse,
): PlaceSearchResponse {
  const places: PlaceSearchResponse['places'] = [];

  for (const suggestion of response.suggestions ?? []) {
    const prediction = suggestion.placePrediction;

    if (!prediction) {
      continue;
    }

    const placeId = prediction.placeId;
    const name = prediction.structuredFormat?.mainText?.text;

    if (typeof placeId !== 'string' || typeof name !== 'string') {
      continue;
    }

    const place: PlaceSearchResponse['places'][number] = {
      id: placeId,
      name,
      address: prediction.structuredFormat?.secondaryText?.text ?? '',
    };

    if (typeof prediction.distanceMeters === 'number') {
      place.distanceMeters = prediction.distanceMeters;
    }

    places.push(place);
  }

  return { places };
}

export function mapPlaceDetails(place: IPlace): PlaceDetails | null {
  const id = place.id;
  const name = place.displayName?.text;
  const address = place.formattedAddress;
  const location = place.location;

  if (!id || !name || !address || !location) {
    return null;
  }

  const lat = location.latitude;
  const lng = location.longitude;

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return null;
  }

  return { id, name, address, lat, lng };
}
