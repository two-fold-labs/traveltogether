import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

interface LoaderProps {
  label?: string;
}

const Loader = ({ label = 'Loading' }: LoaderProps) => (
  <Stack className="h-dvh w-full items-center justify-center bg-background">
    <CircularProgress aria-label={label} />
  </Stack>
);

export default Loader;
