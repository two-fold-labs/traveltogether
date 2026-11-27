import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Icon } from '@/components/ui/Icon';
import { joinTripPath } from '@/lib/routes';

import { parseJoinInput } from '../parseJoinInput';

interface JoinTripDialogProps {
  open: boolean;
  onClose: () => void;
}

const JoinTripDialog = ({ open, onClose }: JoinTripDialogProps) => {
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | undefined>();

  const handleClose = () => {
    setValue('');
    setError(undefined);
    onClose();
  };

  const handleContinue = () => {
    const tripId = parseJoinInput(value);

    if (!tripId) {
      setError('Enter a trip code or paste an invite link');

      return;
    }

    handleClose();
    void navigate(joinTripPath(tripId));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="join-trip-dialog-title"
    >
      <Stack spacing={4} className="p-5">
        <Stack direction="row" spacing={2} className="items-start">
          <Stack
            className="size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600"
            aria-hidden="true"
          >
            <Icon name="rightToBracket" />
          </Stack>
          <Stack spacing={0.5} className="min-w-0 flex-1">
            <Typography id="join-trip-dialog-title" variant="h3" component="h2">
              Join existing trip
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter an invite code or paste a join link. Continue does not add
              you yet.
            </Typography>
          </Stack>
          <IconButton aria-label="Close" onClick={handleClose} size="small">
            <Icon name="xmark" />
          </IconButton>
        </Stack>

        <TextField
          fullWidth
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setError(undefined);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              handleContinue();
            }
          }}
          label="Trip code"
          placeholder="TT-XXXXXXXX"
          error={Boolean(error)}
          helperText={error}
          slotProps={{
            htmlInput: {
              autoCapitalize: 'characters',
              autoCorrect: 'off',
              spellCheck: false,
            },
          }}
        />

        <Stack direction="row" spacing={2}>
          <Button
            variant="subtle"
            fullWidth
            className="h-12 rounded-2xl"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            fullWidth
            className="h-12 rounded-2xl"
            onClick={handleContinue}
          >
            Continue
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default JoinTripDialog;
