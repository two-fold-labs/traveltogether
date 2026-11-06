import Button, { type ButtonProps } from '@mui/material/Button';

import { Icon } from '@/components/ui/Icon';

const JoinTripButton = (props: ButtonProps) => (
  <Button
    variant="subtle"
    startIcon={<Icon name="rightToBracket" />}
    aria-label="Join trip"
    {...props}
  >
    <span className="hidden sm:inline">Join Trip</span>
  </Button>
);

export default JoinTripButton;
