import { useQuery } from '@tanstack/react-query';

import { getTrips } from '../api';
import { tripKeys } from '../queryKeys';

const useTrips = () => {
  const queryResult = useQuery({
    queryKey: tripKeys.list(),
    queryFn: getTrips,
  });

  return queryResult;
};

export { useTrips };
