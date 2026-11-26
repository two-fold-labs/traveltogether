export const slate = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
  950: '#020617',
} as const;

export const brand = {
  50: '#eef2ff',
  100: '#e0e7ff',
  200: '#c7d2fe',
  300: '#a5b4fc',
  400: '#818cf8',
  500: '#6366f1',
  600: '#4f46e5',
  700: '#4338ca',
  800: '#3730a3',
  900: '#312e81',
  950: '#1e1b4b',
} as const;

export const emerald = {
  400: '#34d399',
  600: '#059669',
  700: '#047857',
} as const;
export const rose = { 400: '#fb7185', 600: '#e11d48', 700: '#be123c' } as const;
export const amber = { 500: '#f59e0b', 600: '#d97706' } as const;

/** Same rem values as Tailwind's default text-xs ... text-2xl */
export const fontSize = {
  '2xs': '0.625rem',
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
} as const;

export const fontWeight = {
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;
export const fontFamily =
  '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif';

/** Same widths as Tailwind's sm / md / lg / xl, so MUI and Tailwind agree */
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;
