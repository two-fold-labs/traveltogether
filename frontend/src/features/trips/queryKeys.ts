const tripKeys = {
  searchPlaces: (searchText: string, lat: string, lng: string) => [
    'places',
    'search',
    searchText,
    lat,
    lng,
  ],
} as const;

export { tripKeys };
