import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router';

import { ROUTES } from '@/lib/routes';

interface InviteAlreadyJoinedProps {
  tripName: string;
}

const InviteAlreadyJoined = ({ tripName }: InviteAlreadyJoinedProps) => (
  <Stack spacing={8} className="p-5">
    <Stack spacing={2}>
      <Typography variant="overline" color="text.secondary">
        Trip Sync
      </Typography>
      <Typography variant="h2" component="h1">
        You&apos;re already on this trip
      </Typography>
      <Typography color="text.secondary">
        {tripName} is already on your list.
      </Typography>
    </Stack>
    <Button
      variant="contained"
      fullWidth
      className="h-12 rounded-2xl"
      component={Link}
      to={ROUTES.HOME}
    >
      Back home
    </Button>
  </Stack>
);

export default InviteAlreadyJoined;
