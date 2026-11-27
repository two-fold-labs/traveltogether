import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import { Icon } from '@/components/ui/Icon';
import { formatDateTime } from '@/lib/formatDate';
import { joinTripPath } from '@/lib/routes';

import { type Trip } from '../types';

interface TripSummaryDialogProps {
  open: boolean;
  trip: Trip | null;
  onDone: () => void;
}

const inviteUrl = (tripId: string) =>
  `${window.location.origin}${joinTripPath(tripId)}`;

const copyText = async (value: string) => {
  await navigator.clipboard.writeText(value);
};

const TripSummaryDialog = ({ open, trip, onDone }: TripSummaryDialogProps) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  if (!trip) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await copyText(trip.tripId);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const handleShare = async () => {
    const url = inviteUrl(trip.tripId);

    try {
      await navigator.share({ title: trip.name, url });
      setShared(true);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      try {
        await copyText(url);
        setShared(true);
      } catch {
        setShared(false);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onDone}
      fullWidth
      maxWidth="sm"
      aria-labelledby="trip-summary-dialog-title"
    >
      <Stack className="overflow-hidden">
        <Stack
          spacing={1}
          className="bg-linear-to-r from-brand-600 to-brand-800 p-4 text-primary-foreground"
        >
          <Stack direction="row" className="items-center justify-between">
            <Typography variant="overline" color="inherit">
              Trip saved
            </Typography>
            <IconButton
              aria-label="Close"
              onClick={onDone}
              size="small"
              className="text-primary-foreground"
            >
              <Icon name="xmark" />
            </IconButton>
          </Stack>
          <Typography
            id="trip-summary-dialog-title"
            variant="h3"
            component="h2"
            color="inherit"
          >
            {trip.name}
          </Typography>
          <Typography variant="body2" className="text-brand-100">
            {formatDateTime(trip.arriveBy) || 'No arrival time'}
          </Typography>
        </Stack>

        <Stack spacing={3} className="p-4">
          <Typography>{trip.destination.name}</Typography>

          <Stack direction="row" spacing={2} className="items-center">
            <Stack spacing={0.5} className="min-w-0 flex-1">
              <Typography variant="overline" color="text.secondary">
                Trip ID
              </Typography>
              <Typography variant="h3" component="p" className="tracking-wide">
                {trip.tripId}
              </Typography>
            </Stack>
            <Button
              variant="subtle"
              startIcon={<Icon name={copied ? 'check' : 'copy'} />}
              onClick={() => void handleCopy()}
              className="shrink-0"
            >
              {copied ? 'Copied' : 'Copy ID'}
            </Button>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Share this ID, or send the join link so friends can open the invite.
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant="subtle"
              fullWidth
              className="h-12 rounded-2xl"
              startIcon={<Icon name={shared ? 'check' : 'shareNodes'} />}
              onClick={() => void handleShare()}
            >
              {shared ? 'Shared' : 'Share link'}
            </Button>
            <Button
              variant="contained"
              fullWidth
              className="h-12 rounded-2xl"
              onClick={onDone}
            >
              Done
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default TripSummaryDialog;
