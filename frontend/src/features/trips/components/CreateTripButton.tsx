import Button from '@mui/material/Button';
import { Link } from 'react-router';

import { Icon } from '@/components/ui/Icon';
import { ROUTES } from '@/lib/routes';

const CreateTripButton = () => (
  <Button
    variant="contained"
    startIcon={<Icon name="plus" />}
    component={Link}
    to={ROUTES.CREATE_TRIP}
  >
    Create Trip
  </Button>
);

export default CreateTripButton;
