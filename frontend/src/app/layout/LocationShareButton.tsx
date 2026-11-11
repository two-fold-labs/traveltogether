import Button, { type ButtonProps } from '@mui/material/Button';

import { Icon } from '@/components/ui/Icon';

const LocationShareButton = (props: ButtonProps) => (
  <Button
    variant="subtle"
    startIcon={<Icon name="locationCrosshairs" spinPulse />}
    {...props}
  >
    <span className="sm:hidden">Location</span>
    <span className="hidden sm:inline">Share location</span>
  </Button>
);

export default LocationShareButton;
