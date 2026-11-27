import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router';

import { ROUTES } from '@/lib/routes';

interface InviteUnavailableProps {
  code: string;
}

const InviteUnavailable = ({ code }: InviteUnavailableProps) => {
  const codeLabel = code || 'that code';

  return (
    <Stack spacing={8} className="p-5">
      <Stack spacing={2}>
        <Typography variant="overline" color="text.secondary">
          Trip Sync
        </Typography>
        <Typography variant="h2" component="h1">
          This invite isn&apos;t available
        </Typography>
        <Typography color="text.secondary">
          We couldn&apos;t find a trip for {codeLabel}. Ask your friend to share
          the link again.
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
};

export default InviteUnavailable;
