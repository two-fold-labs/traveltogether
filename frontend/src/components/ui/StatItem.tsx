import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface StatItemProps {
  label: string;
  value: string;
  className?: string;
}

// A small label above a value, e.g. "DISTANCE / 92 km"
const StatItem = ({ label, value, className }: StatItemProps) => (
  <Stack spacing={0.5} className={className}>
    <Typography variant="badge" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="caption" color="text.primary">
      {value}
    </Typography>
  </Stack>
);

export default StatItem;
