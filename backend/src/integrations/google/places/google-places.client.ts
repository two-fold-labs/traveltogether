import { PlacesClient } from '@googlemaps/places';

import { env } from '#config/env.js';
import type { LatLngLiteral } from '#types/location.types.js';
import type { PlaceDetails, PlaceSearchResponse } from '#types/place.types.js';

import {
  mapAutocompleteResponse,
  mapPlaceDetails,
} from './google-places.mapper.js';

class GooglePlacesClient {
  private readonly placesClient: PlacesClient;

  constructor() {
    this.placesClient = new PlacesClient({
      apiKey: env.googleApiKey,
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
  }
}

const googlePlacesClient = new GooglePlacesClient();

export { googlePlacesClient };
