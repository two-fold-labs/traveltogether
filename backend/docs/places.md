# Places and Google lookups

Read this when adding a Places endpoint, calling Google, or turning a search or GPS point into a location.

## Endpoints

All sit under `requireAuth` (`/api/places`). Guests are real users, so a guest session is enough.

| Method | Path                       | Input                                      | Success                                                |
| ------ | -------------------------- | ------------------------------------------ | ------------------------------------------------------ |
| `GET`  | `/places/search`           | query `q`, `lat`, `lng`                    | `{ places: [{ id, name, address, distanceMeters? }] }` |
| `GET`  | `/places/details/:placeId` | path `placeId` (`[A-Za-z0-9_-]+`, max 255) | `{ name, address, lat, lng }`                          |
| `GET`  | `/places/reverse`          | query `lat`, `lng`                         | `{ name, address, lat, lng }`                          |

These lookups **save nothing**. A `locations` row is written only when a trip is created or joined.

`PublicPlaceLocation` (`place.types.ts`) is the shared success shape for details and reverse. `name` and `address` are display labels; calculations use `lat` / `lng` ([database.md](database.md)).

## Timeouts

Every Google call uses `GOOGLE_API_TIMEOUT_MS` in `src/integrations/google/google.constants.ts`. The Places SDK default is 60s with no retries on `GetPlace` / `AutocompletePlaces`; plain `fetch` has no short limit. The constant is 10s so a stalled Google response cannot hang a request, and so the first call after startup (DNS + TLS, often ~3s) still fits.

Apply it in the client constructor (Places SDK `timeout_millis` per method) or `AbortSignal.timeout` (`fetch`). Do not add a second timeout next to a call.

## Place details

`getPlaceDetails` wraps the existing Places SDK call. Google **throws** for an unknown id; it does not return empty.

Map to `null` (the service then throws `NotFoundError`, `404`) only when:

- gRPC `NOT_FOUND` (5), or
- gRPC `INVALID_ARGUMENT` (3) **and** the message contains `Place ID`.

Google reports a well-formed but unknown id as `INVALID_ARGUMENT` (`The provided Place ID: … is not valid.`), not `NOT_FOUND`. Matching the message keeps an unrelated invalid argument from looking like a missing place. Any other Google error is rethrown and becomes the generic `500`.

`createTrip` uses the same `getPlaceDetails`, so a bad `destinationPlaceId` is now a `422` (`ValidationError`) instead of a `500`.

## Reverse geocode

Uses the Geocoding REST API (`integrations/google/geocoding/`), not the Places SDK. The Geocoding API must be enabled on `GOOGLE_API_KEY`.

Rules:

- Return the **received** `lat` / `lng` unchanged. Google supplies only the label. Never snap a GPS point to a place.
- Skip results whose `types` include `plus_code`. Google defines that type as an encoded lat/lng (Plus Code). Empirically, every point still gets a Plus Code result (so `ZERO_RESULTS` almost never happens); skipping it is what produces the "no address" path. If a real address were tagged by mistake, we would skip it and take the next result, or fall back — the request still succeeds.
- If nothing remains, return `null`. The service responds `200` with `name: "Current location"` and `address: ""`, still with the received coordinates. A failed lookup must not block joining.
- `name` is the first comma-separated piece of `formatted_address` that contains a letter and is not itself a Plus Code (so not `67/1`, `786157`, or `XJG4+7M3`). `address` is the full `formatted_address`, unchanged.

Do not put the request URL in an error message: it contains the API key. A Zod parse of Google's body that fails must throw a plain `Error`, not the `ZodError` (that would become a `422` to the client).

## Provider failures

Outages and unexpected Google errors are not caught. They become the generic `500` and are logged, same as `createTrip` and Postgres. There is no `UPSTREAM_ERROR` / `502` code yet.

Invalid client input is `422`. An unknown `placeId` is `404`.
