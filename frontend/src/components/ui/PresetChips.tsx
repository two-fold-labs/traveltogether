import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface PresetOption {
  label: string;
  value: string;
}

interface PresetChipsProps {
  title: string;
  options: PresetOption[];
  onSelect: (value: string) => void;
}

const PresetChips = ({ title, options, onSelect }: PresetChipsProps) => (
  <Stack spacing={1}>
    <Typography variant="badge" color="text.disabled">
      {title}
    </Typography>
    <Stack direction="row" useFlexGap spacing={1.5} className="flex-wrap">
      {options.map(({ label, value }) => (
        <Chip
          key={label}
          label={label}
          size="small"
          onClick={() => onSelect(value)}
        />
      ))}
    </Stack>
  </Stack>
);

export default PresetChips;
