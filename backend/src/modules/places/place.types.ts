// A location the client can send back as-is (e.g. as a trip's source location).
// `name` and `address` are display labels; calculations use `lat` and `lng`.
export type PublicPlaceLocation = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};
