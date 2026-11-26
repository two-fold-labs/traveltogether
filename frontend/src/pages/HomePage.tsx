import Stack from '@mui/material/Stack';

import { useCurrentUser } from '@/features/auth';
import { TripHero, TripsOverview } from '@/features/trips';

const HomePage = () => {
  const currentUser = useCurrentUser();

  return (
    <main className="mx-auto min-h-0 w-full max-w-4xl flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-6">
      <Stack spacing={6}>
        <TripHero onJoinTrip={() => undefined} />
        <TripsOverview currentUserId={currentUser.id} />
      </Stack>
    </main>
  );
};

export default HomePage;
