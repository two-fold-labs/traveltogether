import { useQuery } from '@tanstack/react-query';

import { getTrips } from '../api';
import { tripKeys } from '../queryKeys';

const useTrips = () => {
  const queryResult = useQuery({
    queryKey: tripKeys.list(),
    queryFn: getTrips,
    // TripsOverview shows its own retry button, so fail fast instead of auto-retrying.
    retry: false,
  });

  return queryResult;
};

export { useTrips };
