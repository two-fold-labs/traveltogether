# Join a trip

Read this when working on invite preview, join-by-code, or the source location a joiner picks.

Parent story: **TT-10**. Backend subtask: **TT-11**. Frontend: **TT-12** (not started).

Jira and Confluence stay unchanged until this MR is merged. The contract below is what those tickets and wiki pages must match after merge. Do not treat TT-10's original API sketch as current.

## Status

Shipped on this branch:

- `GET /places/details/:placeId` and `GET /places/reverse` ([places.md](places.md))
- `GET /places/search` validates with zod (`422`, standard error envelope)

Not shipped yet (still this backend task):

- `GET /trips/join/:tripId` (invite preview)
- `POST /trips/join/:tripId` (insert `trip_participants`)

Already true in `main` (TT-10 / TT-11 text is stale):

- `createTrip` inserts the host into `trip_participants` (`isOwner: true`)
- `GET /trips` already includes trips the user participates in
- Unique `trip_id` retry already exists in `createTrip`

## Locked product rules

1. **Look up, then join.** The client resolves a source location through the places endpoints, then POSTs a uniform body. The join request does not call Google. Both "search a place" and "use my location" become the same four fields.
2. **Coordinates are the data.** `locations.name` and `locations.address` are display labels. Any distance, route, or "are these the same point?" logic uses `latitude` / `longitude` ([database.md](database.md)).
3. **Keep the GPS point.** Reverse geocode never overwrites the received coordinates. Google is only asked for a name and address.
4. **Join is opt-in.** Opening a link or typing a code must not add the user. Preview first; Join is the write.
5. **Idempotent join.** A second join for the same user does not insert a second `trip_participants` row (`UNIQUE (trip_id, user_id)`). Return `200` when already in, `201` when created.
6. **Unknown code is not found.** Preview and join use public `trips.trip_id`. Missing code → `404`. Do not leak whether the trip exists to non-members on `GET /trips/:tripId`; the invite preview is the one read that does not require membership.

## Source location

```ts
// POST /trips/join/:tripId  body (planned)
{
  sourceLocation: {
    name: string; // trimmed, 1..255
    address: string; // trimmed, may be ''
    lat: number; // -90..90
    lng: number; // -180..180
  }
}
```

How the client fills it:

| User action               | Client calls                                              | Then posts                          |
| ------------------------- | --------------------------------------------------------- | ----------------------------------- |
| Search, pick a suggestion | `GET /places/details/:placeId`                            | that `{ name, address, lat, lng }`  |
| Use my location           | browser geolocation, then `GET /places/reverse?lat=&lng=` | that object (coordinates unchanged) |

The join POST trusts those four fields after zod bounds. A client can change the name between lookup and join. Accepted: today a source label is shown only to its owner, and names never feed calculations. Close this before group views show another user's source label (signed lookup token, or re-fetch by `placeId` on join).

## Invite preview (planned)

`GET /trips/join/:tripId` (guest session enough; membership not required) → `200`

```json
{
  "trip": {
    "tripId": "string",
    "name": "string",
    "arriveBy": "ISO string | null",
    "hostName": "string",
    "destination": {
      "name": "string",
      "address": "string",
      "lat": 0,
      "lng": 0
    },
    "alreadyJoined": false
  }
}
```

Host name comes from the owner `trip_participants` row joined to `users.name`. No participant list, emails, or personal stops.

## After this MR merges

Update in one pass so the tickets and wiki do not churn with each commit:

**Jira**

- **TT-10 / TT-11:** replace the API sketch with the lookup endpoints plus the uniform `sourceLocation` body. Close the `source_location_id` open question (a real `locations` row from that body). Strike the three items already true on `main` (host participant row, list includes joined trips, trip-id retry).
- **TT-12:** the invite page must call details / reverse before Join; it posts `sourceLocation`, not a `placeId`.
- **Follow-up (create only with confirmation):** close the join-body trust gap before other people see a joiner's source label.

**Confluence (TTP)** — do not edit until merge:

- **create** Decision · Join a trip (the six locked rules above; Later: trust gap, `UPSTREAM_ERROR` / `502`)
- **create** API · Place details (`GET /places/details/:placeId`)
- **create** API · Reverse geocode (`GET /places/reverse`)
- **update** API · Search places (zod `422`, no hand-built `400`)
- **create** API · Invite preview and Join trip — only once those routes exist
- **update** Database design · `locations.name` / `address` are labels
- **update** Backend architecture · `integrations/google/geocoding`, shared `GOOGLE_API_TIMEOUT_MS`
- **update** Backend conventions · `places/` follows the same rules as `auth/` / `trips/`
- **update** Overview · keep join under "Not built yet" until TT-12 ships
