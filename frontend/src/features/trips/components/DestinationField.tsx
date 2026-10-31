import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import { Icon } from '@/components/ui/Icon';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

import { MIN_SEARCH_LENGTH, usePlaceSearch } from '../hooks/usePlaceSearch';
import type { PlaceSuggestion } from '../types';
import PlaceCaption from './PlaceCaption';

interface DestinationFieldProps {
  id: string;
  value: PlaceSuggestion | null;
  onChange: (value: PlaceSuggestion | null) => void;
  error?: string;
}

const DestinationField = ({
  id,
  value,
  onChange,
  error,
}: DestinationFieldProps) => {
  const [inputValue, setInputValue] = useState(value?.name ?? '');
  const debouncedInputValue = useDebouncedValue(inputValue, 300);
  const optionSelected = value?.name === debouncedInputValue;

  // Todo: Remove hardcode latitude and longitude
  const { places, isFetching, isSearchEnabled } = usePlaceSearch(
    optionSelected ? '' : debouncedInputValue,
    '26.852208',
    '80.862040',
  );

  return (
    <Stack spacing={3}>
      <Autocomplete
        id={id}
        options={places}
        value={value}
        onChange={(_, next) => onChange(next)}
        inputValue={inputValue}
        onInputChange={(_, next) => setInputValue(next)}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, selected) => option.id === selected.id}
        filterOptions={(options) => options}
        loading={isFetching}
        loadingText="Loading..."
        noOptionsText={
          isSearchEnabled
            ? 'No matching locations'
            : `Type at least ${MIN_SEARCH_LENGTH} characters`
        }
        forcePopupIcon={false}
        clearIcon={<Icon name="circleXmark" />}
        renderOption={({ key, ...props }, option) => (
          <li key={key} {...props}>
            <Stack
              direction="row"
              spacing={3}
              className="w-full items-center justify-between"
            >
              <Stack
                direction="row"
                spacing={3}
                className="min-w-0 items-center"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xs text-brand-600">
                  <Icon name="house" /> {/* Todo: Hardcoded icon */}
                </span>
                <span className="min-w-0">
                  <Typography variant="body2" className="truncate font-bold">
                    {option.name}
                  </Typography>
                  <PlaceCaption place={option} />
                </span>
              </Stack>
              {/* <Chip label={option.tag} size="small" /> */}
            </Stack>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search city, airport, landmark..."
            error={!!error}
            helperText={error}
            slotProps={{
              ...params.slotProps,
              input: {
                ...params.slotProps.input,
                startAdornment: (
                  <InputAdornment position="start" className="text-brand-600">
                    <Icon name="locationDot" />
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
      />

      {value && (
        <Stack
          direction="row"
          spacing={3}
          className="items-center justify-between rounded-2xl border border-success/30 bg-success/10 p-3"
        >
          <Stack direction="row" spacing={3} className="min-w-0 items-center">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-success/20 text-success">
              <Icon name="flagCheckered" />
            </span>
            <span className="min-w-0">
              <Typography variant="body2" className="truncate font-bold">
                {value.name}
              </Typography>
              <PlaceCaption place={value} />
            </span>
          </Stack>
          <Chip label="Selected" size="small" color="success" />
        </Stack>
      )}
    </Stack>
  );
};

export default DestinationField;
