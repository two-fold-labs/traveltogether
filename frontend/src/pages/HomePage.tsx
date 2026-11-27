import Stack from '@mui/material/Stack';
import { useOutletContext } from 'react-router';

import { useCurrentUser } from '@/features/auth';
import {
  type JoinTripOutletContext,
  TripHero,
  TripsOverview,
} from '@/features/trips';

const HomePage = () => {
  const currentUser = useCurrentUser();
  const { onJoinTrip } = useOutletContext<JoinTripOutletContext>();

  return (
    <main className="mx-auto min-h-0 w-full max-w-4xl flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-6">
      <Stack spacing={6}>
        <TripHero onJoinTrip={onJoinTrip} />
        <TripsOverview currentUserId={currentUser.id} />
      </Stack>
    </main>
  );
};

export default HomePage;
