import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

const InviteLoading = () => (
  <Stack className="flex-1 items-center justify-center">
    <CircularProgress aria-label="Loading invite" />
  </Stack>
);

export default InviteLoading;
