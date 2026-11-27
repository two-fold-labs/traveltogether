const tripKeys = {
  all: () => ['trips'] as const,
  list: () => [...tripKeys.all(), 'list'] as const,
  invite: (tripId: string) => [...tripKeys.all(), 'invite', tripId] as const,
  searchPlaces: (searchText: string, lat: string, lng: string) =>
    [...tripKeys.all(), 'places', 'search', searchText, lat, lng] as const,
};

export { tripKeys };
