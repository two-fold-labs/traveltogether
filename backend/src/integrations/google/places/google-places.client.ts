import { PlacesClient } from '@googlemaps/places';

import { env } from '#config/env.js';
import { GOOGLE_API_TIMEOUT_MS } from '#integrations/google/google.constants.js';
import type { LatLngLiteral } from '#types/location.types.js';
import type { PlaceDetails, PlaceSearchResponse } from '#types/place.types.js';

import {
  mapAutocompleteResponse,
  mapPlaceDetails,
} from './google-places.mapper.js';

const PLACES_SERVICE = 'google.maps.places.v1.Places';
// Every method of the SDK, so one that is added to our code later is also
// covered. The SDK default is 60s per call, which is too long to hang on.
const PLACES_METHODS = [
  'SearchNearby',
  'SearchText',
  'GetPhotoMedia',
  'GetPlace',
  'AutocompletePlaces',
] as const;

// gRPC status codes Google uses for a place id that doesn't exist.
const GRPC_INVALID_ARGUMENT = 3;
const GRPC_NOT_FOUND = 5;
// For an unknown id Google answers INVALID_ARGUMENT, not NOT_FOUND:
// "The provided Place ID: <id> is not valid." Matching the message keeps an
// unrelated invalid argument from being reported as a missing place.
const INVALID_PLACE_ID_MESSAGE = 'Place ID';

const isUnknownPlaceError = (error: unknown): boolean => {
  if (!(error instanceof Error) || !('code' in error)) {
    return false;
  }

  if (error.code === GRPC_NOT_FOUND) {
    return true;
  }

  return (
    error.code === GRPC_INVALID_ARGUMENT &&
    error.message.includes(INVALID_PLACE_ID_MESSAGE)
  );
};

class GooglePlacesClient {
  private readonly placesClient: PlacesClient;

  constructor() {
    this.placesClient = new PlacesClient({
      apiKey: env.googleApiKey,
      clientConfig: {
        interfaces: {
          [PLACES_SERVICE]: {
            methods: Object.fromEntries(
              PLACES_METHODS.map((method) => [
                method,
                { timeout_millis: GOOGLE_API_TIMEOUT_MS },
              ]),
            ),
          },
        },
      },
    });
  }

  async getAutocompleteSuggestions(
    searchText: string,
    origin: LatLngLiteral,
  ): Promise<PlaceSearchResponse> {
    //TODO: Make origin optional

    const [response] = await this.placesClient.autocompletePlaces({
      input: searchText,
      origin: {
        latitude: origin.lat,
        longitude: origin.lng,
      },
      regionCode: 'IN',
    });

    return mapAutocompleteResponse(response);
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    try {
      const [place] = await this.placesClient.getPlace(
        { name: `places/${placeId}` },
        {
          otherArgs: {
            headers: {
              'X-Goog-FieldMask': 'id,displayName,formattedAddress,location',
            },
          },
        },
      );

      return mapPlaceDetails(place);
    } catch (error) {
      // Google throws (it does not return empty) for an id it doesn't know.
      if (isUnknownPlaceError(error)) {
        return null;
      }

      throw error;
    }
  }
}

const googlePlacesClient = new GooglePlacesClient();

export { googlePlacesClient };
