import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { searchPlaces } from '../api';
import { tripKeys } from '../queryKeys';
import type { PlaceSuggestion } from '../types';

const MIN_SEARCH_LENGTH = 3;
// Places barely change, so reuse results for repeat searches in one session
const PLACE_SEARCH_STALE_TIME_MS = 5 * 60 * 1000;
const NO_PLACES: PlaceSuggestion[] = [];

const usePlaceSearch = (searchText: string, lat: string, lng: string) => {
  const enabled = searchText.trim().length >= MIN_SEARCH_LENGTH;

  const { data, isFetching } = useQuery({
    queryKey: tripKeys.searchPlaces(searchText, lat, lng),
    queryFn: ({ signal }) => searchPlaces(searchText, lat, lng, signal),
    enabled,
    placeholderData: keepPreviousData,
    retry: false,
    staleTime: PLACE_SEARCH_STALE_TIME_MS,
  });

  // keepPreviousData keeps the last results once the query is disabled,
  // so only expose them while a search is actually allowed
  return {
    places: enabled && data ? data.places : NO_PLACES,
    isFetching,
    isSearchEnabled: enabled,
  };
};

export { usePlaceSearch, MIN_SEARCH_LENGTH };
