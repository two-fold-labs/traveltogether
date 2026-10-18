import { useQuery } from '@tanstack/react-query';

import { guestLogin } from '../api';
import { authKeys } from '../queryKeys';

const useSession = () => {
  const queryResult = useQuery({
    queryKey: authKeys.session,
    queryFn: ({ signal }) => guestLogin(signal),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return queryResult;
};

export { useSession };
