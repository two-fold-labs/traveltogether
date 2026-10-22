import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { searchPlaces } from '../api';
import { tripKeys } from '../queryKeys';

const usePlaceSearch = (searchText: string, lat: string, lng: string) => {
  const queryResult = useQuery({
    queryKey: tripKeys.searchPlaces(searchText, lat, lng),
    queryFn: () => searchPlaces(searchText, lat, lng),
    enabled: !!searchText,
    placeholderData: keepPreviousData,
    retry: false,
    staleTime: 5,
  });

  return queryResult;
};

export { usePlaceSearch };
