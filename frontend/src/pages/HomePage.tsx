import Stack from '@mui/material/Stack';

import {
  LiveTripCard,
  mockLiveTrip,
  mockUpcomingTrips,
  TripHero,
  UpcomingTrips,
} from '@/features/trips';

const HomePage = () => (
  <main className="mx-auto min-h-0 w-full max-w-4xl flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-6">
    <Stack spacing={6}>
      <TripHero onJoinTrip={() => undefined} />
      {/* TODO: replace mock data with GET /trips (live = status 'started') */}
      {mockLiveTrip && (
        <LiveTripCard trip={mockLiveTrip} onOpen={() => undefined} />
      )}
      <UpcomingTrips
        trips={mockUpcomingTrips}
        onViewTrip={() => undefined}
        onEditTrip={() => undefined}
        onSeeAll={() => undefined}
      />
    </Stack>
  </main>
);

export default HomePage;
