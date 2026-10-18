import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { type FormEvent, useState } from 'react';
import { Link } from 'react-router';

import FormField from '@/components/ui/FormField';
import { Icon, type IconName } from '@/components/ui/Icon';
import PresetChips from '@/components/ui/PresetChips';
import { ROUTES } from '@/lib/routes';

import { getArrivalPresets } from '../arrivalPresets';
import { type CreateTripValues } from '../types';
import DestinationField from './DestinationField';

interface CreateTripFormProps {
  onSubmit: (values: CreateTripValues) => void;
}

type Errors = Partial<Record<keyof CreateTripValues, string>>;

const emptyValues: CreateTripValues = {
  tripName: '',
  arriveBy: '',
  destination: null,
};

const validate = ({ tripName, arriveBy, destination }: CreateTripValues) => {
  const errors: Errors = {};

  if (!tripName.trim()) {
    errors.tripName = 'Enter a trip name';
  }

  if (!arriveBy) {
    errors.arriveBy = 'Pick an arrival date and time';
  } else if (new Date(arriveBy).getTime() <= Date.now()) {
    errors.arriveBy = 'Arrival must be in the future';
  }

  if (!destination) {
    errors.destination = 'Select a final destination';
  }

  return errors;
};

const iconAdornment = (name: IconName) => ({
  startAdornment: (
    <InputAdornment position="start" className="text-muted-foreground">
      <Icon name={name} />
    </InputAdornment>
  ),
});

const CreateTripForm = ({ onSubmit }: CreateTripFormProps) => {
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState<Errors>({});
  const [resetCount, setResetCount] = useState(0);

  const setField = <K extends keyof CreateTripValues>(
    field: K,
    value: CreateTripValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const reset = () => {
    setValues(emptyValues);
    setErrors({});
    setResetCount((n) => n + 1);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(values);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      onSubmit(values);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex min-h-0 flex-1 flex-col"
    >
      <Stack
        direction="row"
        className="shrink-0 items-end justify-between border-b border-border pb-3"
      >
        <Stack spacing={1} className="items-start">
          <Button
            variant="text"
            size="small"
            startIcon={<Icon name="arrowLeft" />}
            className="-ml-2 text-primary"
            component={Link}
            to={ROUTES.HOME}
          >
            Home
          </Button>
          <Typography variant="h1" component="h1">
            Plan New Journey
          </Typography>
        </Stack>
        <Button
          variant="subtle"
          startIcon={<Icon name="rotateRight" />}
          onClick={reset}
          className="border border-border bg-card"
        >
          Reset
        </Button>
      </Stack>

      <div className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1 py-6">
        <Stack spacing={6}>
          <Stack spacing={2}>
            <FormField label="1. Trip Name" htmlFor="trip-name" required>
              <TextField
                id="trip-name"
                placeholder="e.g., Summer Coast Road Trip"
                value={values.tripName}
                onChange={(e) => setField('tripName', e.target.value)}
                error={!!errors.tripName}
                helperText={errors.tripName}
                slotProps={{ input: iconAdornment('penNib') }}
                fullWidth
              />
            </FormField>
          </Stack>

          <Stack spacing={2}>
            <FormField
              label="2. Target Arrival Date & Time"
              htmlFor="arrive-by"
              required
            >
              <TextField
                id="arrive-by"
                type="datetime-local"
                value={values.arriveBy}
                onChange={(e) => setField('arriveBy', e.target.value)}
                error={!!errors.arriveBy}
                helperText={errors.arriveBy}
                slotProps={{ input: iconAdornment('clock') }}
                fullWidth
              />
            </FormField>
            <PresetChips
              title="Fast Presets:"
              options={getArrivalPresets()}
              onSelect={(v) => setField('arriveBy', v)}
            />
          </Stack>

          <FormField
            label="3. Final Destination"
            htmlFor="destination"
            required
          >
            <DestinationField
              key={resetCount}
              id="destination"
              value={values.destination}
              onChange={(v) => setField('destination', v)}
              error={errors.destination}
            />
          </FormField>
        </Stack>
      </div>

      <div className="shrink-0 border-t border-border py-4">
        <Button
          type="submit"
          variant="contained"
          startIcon={<Icon name="paperPlane" />}
          fullWidth
          className="h-12 rounded-2xl"
        >
          Save & Create Trip
        </Button>
      </div>
    </form>
  );
};

export default CreateTripForm;
