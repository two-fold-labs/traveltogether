import * as z from 'zod';

import { env } from '#config/env.js';
import { GOOGLE_API_TIMEOUT_MS } from '#integrations/google/google.constants.js';
import type { LatLngLiteral } from '#types/location.types.js';

const GEOCODING_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const STATUS_OK = 'OK';
const STATUS_ZERO_RESULTS = 'ZERO_RESULTS';
// A Plus Code is a coordinate written as text (e.g. "69GG2222+22"). Google
// returns one for points with no real address, such as open sea.
const TYPE_PLUS_CODE = 'plus_code';
// Some real places have a Plus Code as the start of their address
// ("XJG4+7M3, Mahatma Gandhi Rd, ..."). Those results are not tagged
// plus_code, so the name must skip such a piece by its shape.
const PLUS_CODE_PART_PATTERN =
  /^[23456789CFGHJMPQRVWX]{2,8}\+[23456789CFGHJMPQRVWX]{2,3}$/;

const geocodeResponseSchema = z.object({
  status: z.string(),
  error_message: z.string().optional(),
  results: z
    .array(
      z.object({
        formatted_address: z.string(),
        types: z.array(z.string()).default([]),
      }),
    )
    .default([]),
});

export type ReverseGeocodeResult = {
  name: string;
  address: string;
};

class GoogleGeocodingClient {
  // Returns null when Google has no address for the point (e.g. open sea).
  async reverseGeocode(
    point: LatLngLiteral,
  ): Promise<ReverseGeocodeResult | null> {
    const url = new URL(GEOCODING_URL);

    url.searchParams.set('latlng', `${String(point.lat)},${String(point.lng)}`);
    url.searchParams.set('key', env.googleApiKey);

    const response = await fetch(url, {
      signal: AbortSignal.timeout(GOOGLE_API_TIMEOUT_MS),
    });

    // Never put the URL in an error message: it contains the API key.
    if (!response.ok) {
      throw new Error(
        `Google Geocoding failed with HTTP ${String(response.status)}`,
      );
    }

    const parsed = geocodeResponseSchema.safeParse(await response.json());

    // A plain Error, not the ZodError: that would reach the client as a 422.
    if (!parsed.success) {
      throw new Error('Google Geocoding returned an unexpected response shape');
    }

    const { status, error_message: errorMessage, results } = parsed.data;

    if (status === STATUS_ZERO_RESULTS) {
      return null;
    }

    if (status !== STATUS_OK) {
      throw new Error(
        `Google Geocoding returned ${status}${errorMessage ? `: ${errorMessage}` : ''}`,
      );
    }

    const result = results.find(({ types }) => !types.includes(TYPE_PLUS_CODE));

    if (!result) {
      return null;
    }

    const address = result.formatted_address;

    // The first part of an address is often only a house number or code
    // ("67/1", "786157"), so use the first part that has a letter in it and
    // is not a Plus Code.
    const name =
      address
        .split(',')
        .map((part) => part.trim())
        .find(
          (part) => /\p{L}/u.test(part) && !PLUS_CODE_PART_PATTERN.test(part),
        ) ?? address;

    return { name, address };
  }
}

const googleGeocodingClient = new GoogleGeocodingClient();

export { googleGeocodingClient };
