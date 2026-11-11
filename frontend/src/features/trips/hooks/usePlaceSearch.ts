import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { searchPlaces } from '../api';
import { tripKeys } from '../queryKeys';
import type { PlaceSuggestion } from '../types';

const MIN_SEARCH_LENGTH = 3;
const NO_PLACES: PlaceSuggestion[] = [];

const usePlaceSearch = (searchText: string, lat: string, lng: string) => {
  const enabled = searchText.trim().length >= MIN_SEARCH_LENGTH;

  const { data, isFetching } = useQuery({
    queryKey: tripKeys.searchPlaces(searchText, lat, lng),
    queryFn: () => searchPlaces(searchText, lat, lng),
    enabled,
    placeholderData: keepPreviousData,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // keepPreviousData keeps the last results once the query is disabled,
  // so only expose them while a search is actually allowed
  return {
    places: enabled && data ? data : NO_PLACES,
    isFetching,
    isSearchEnabled: enabled,
  };
};

export { usePlaceSearch, MIN_SEARCH_LENGTH };
