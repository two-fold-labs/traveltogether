export const PLACE_SEARCH_MAX_LENGTH = 200;

export const PLACE_ID_MAX_LENGTH = 255;
// Place IDs are URL-safe base64 text. The id is placed into a Google resource
// path (`places/<id>`), so this also rejects `/` and other path characters.
export const PLACE_ID_PATTERN = /^[A-Za-z0-9_-]+$/;

// Label for coordinates that Google cannot turn into an address.
export const CURRENT_LOCATION_NAME = 'Current location';
