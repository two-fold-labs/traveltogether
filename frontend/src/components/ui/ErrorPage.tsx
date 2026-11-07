import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Icon } from '@/components/ui/Icon';

interface ErrorPageProps {
  title: string;
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

const ErrorPage = ({
  title,
  message,
  onRetry,
  isRetrying = false,
}: ErrorPageProps) => (
  <Stack
    role="alert"
    spacing={3}
    className="h-dvh w-full items-center justify-center bg-background px-4 text-center"
  >
    <Icon name="circleXmark" className="text-4xl text-danger" />
    <Stack spacing={1} className="max-w-md items-center">
      <Typography variant="h4" component="h1">
        {title}
      </Typography>
      <Typography color="text.secondary">{message}</Typography>
    </Stack>
    {onRetry && (
      <Button
        variant="contained"
        onClick={onRetry}
        disabled={isRetrying}
        startIcon={<Icon name="rotateRight" />}
      >
        {isRetrying ? 'Retrying…' : 'Try again'}
      </Button>
    )}
  </Stack>
);

export default ErrorPage;
