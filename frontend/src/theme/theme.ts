import { createTheme } from '@mui/material';

import './augmentation';
import {
  amber,
  brand,
  breakpoints,
  emerald,
  fontFamily,
  fontSize,
  fontWeight,
  rose,
  slate,
} from './tokens';

let theme = createTheme({
  // makes MUI emit --mui-* variables and toggle the `.dark` class on <html>
  cssVariables: { colorSchemeSelector: 'class' },

  colorSchemes: {
    light: {
      palette: {
        brand,
        primary: {
          main: brand[600],
          light: brand[500],
          dark: brand[700],
          contrastText: '#fff',
        },
        secondary: { main: slate[600] },
        success: { main: emerald[700] },
        error: { main: rose[600] },
        warning: { main: amber[600] },
        grey: slate,
        background: { default: '#fff', paper: slate[50], muted: slate[100] },
        text: {
          primary: slate[900],
          secondary: slate[600],
          disabled: slate[400],
        },
        divider: slate[200],
        action: { hover: slate[200] },
      },
    },

    dark: {
      palette: {
        brand,
        primary: {
          main: brand[400],
          light: brand[300],
          dark: brand[500],
          contrastText: '#fff',
        },
        secondary: { main: slate[300] },
        success: { main: emerald[400] },
        error: { main: rose[400] },
        warning: { main: amber[500] },
        grey: slate,
        background: {
          default: slate[900],
          paper: slate[800],
          muted: slate[800],
        },
        text: { primary: '#fff', secondary: slate[300], disabled: slate[500] },
        divider: slate[700],
        action: { hover: slate[700] },
      },
    },
  },

  typography: {
    fontFamily,
    fontSize: 14,
    h1: {
      fontSize: fontSize['2xl'],
      fontWeight: fontWeight.extrabold,
      lineHeight: 1.25,
    },
    h2: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.extrabold,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.bold,
      lineHeight: 1.35,
    },
    subtitle1: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.extrabold,
      letterSpacing: '-0.025em',
      lineHeight: 1.25,
    },
    body2: { fontSize: fontSize.xs, lineHeight: 1.5 },
    caption: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold },
    overline: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.semibold,
      letterSpacing: '0.05em',
      lineHeight: 1.33,
    },
    // small uppercase pill text (status / role badges)
    badge: {
      fontSize: fontSize['2xs'],
      fontWeight: fontWeight.bold,
      letterSpacing: '0.05em',
      lineHeight: 1.4,
      textTransform: 'uppercase',
    },
    button: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.bold,
      textTransform: 'none',
    },
  },

  spacing: 4, // sx={{ p: 3 }} = 12px = Tailwind's p-3
  shape: { borderRadius: 12 }, // rounded-xl
  breakpoints: { values: breakpoints },

  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: ({ theme }) => ({
          height: theme.spacing(8), // 32px
          padding: theme.spacing(0, 3),
          gap: theme.spacing(1.5),
          minWidth: 0,
          transition: 'transform 150ms, background-color 150ms',
          '&:active': { transform: 'scale(0.95)' },
        }),
        startIcon: ({ theme }) => ({
          margin: 0, // spacing comes from `gap` on root
          '& > *:nth-of-type(1)': { fontSize: fontSize.xs }, // beats MUI's 20px default
          color: theme.vars.palette.brand[500],
        }),
        endIcon: {
          margin: 0,
          '& > *:nth-of-type(1)': { fontSize: fontSize.xs },
        },
      },
      variants: [
        // contained + primary = brand gradient (every Create-style button gets it)
        {
          props: { variant: 'contained', color: 'primary' },
          style: ({ theme }) => ({
            backgroundImage: `linear-gradient(to right, ${theme.vars.palette.brand[600]}, ${theme.vars.palette.brand[500]})`,
            boxShadow: `0 4px 6px -1px color-mix(in srgb, ${theme.vars.palette.brand[500]} 20%, transparent)`,
            '& .MuiButton-startIcon': { color: '#fff' },
            '&:hover': {
              backgroundImage: `linear-gradient(to right, ${theme.vars.palette.brand[700]}, ${theme.vars.palette.brand[600]})`,
            },
          }),
        },
        // neutral filled button (Join Trip, Location)
        {
          props: { variant: 'subtle' },
          style: ({ theme }) => ({
            backgroundColor: theme.vars.palette.background.muted,
            color: theme.vars.palette.text.secondary,
            '&:hover': { backgroundColor: theme.vars.palette.action.hover },
          }),
        },
      ],
    },

    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          width: theme.spacing(8),
          height: theme.spacing(8),
          fontSize: fontSize.xs,
          backgroundColor: theme.vars.palette.background.muted,
          color: theme.vars.palette.text.secondary,
          '&:hover': { backgroundColor: theme.vars.palette.action.hover },
        }),
      },
    },

    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'transparent', position: 'sticky' },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: 'none',
          backgroundColor: `color-mix(in srgb, ${theme.vars.palette.background.default} 85%, transparent)`,
          color: theme.vars.palette.text.primary,
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${theme.vars.palette.divider}`,
        }),
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.vars.palette.background.paper,
          borderRadius: theme.spacing(4),
          fontSize: fontSize.sm,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.vars.palette.brand[300],
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.vars.palette.primary.main,
            borderWidth: 1,
          },
          '&.Mui-focused': {
            boxShadow: `0 0 0 3px color-mix(in srgb, ${theme.vars.palette.primary.main} 25%, transparent)`,
          },
        }),
        input: ({ theme }) => ({ padding: theme.spacing(3, 3.5) }),
        notchedOutline: ({ theme }) => ({
          borderColor: theme.vars.palette.divider,
          transition: 'border-color 150ms',
        }),
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({ borderRadius: theme.spacing(6) }),
      },
    },
  },
});

// Second pass: for options that read the built theme (theme.breakpoints,
// theme.spacing(), etc.) where MUI gives no ({ theme }) callback, such as
// typography variants. Component styleOverrides/variants get the theme
// through their callback, so they stay in the first pass.
theme = createTheme(theme, {
  typography: {
    h4: {
      fontSize: fontSize['2xl'],
      fontWeight: fontWeight.bold,
      lineHeight: 1.2,
      [theme.breakpoints.up('sm')]: { fontSize: '1.75rem' },
      [theme.breakpoints.up('md')]: { fontSize: '2rem' },
    },
    body1: {
      fontSize: fontSize.base,
      lineHeight: 1.5,
      [theme.breakpoints.up('md')]: { fontSize: '1.0625rem' },
    },
  },
});

export default theme;
