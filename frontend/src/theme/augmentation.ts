import '@mui/material/styles';
import type { brand } from './tokens';

declare module '@mui/material/styles' {
  interface Palette {
    brand: typeof brand;
  }
  interface PaletteOptions {
    brand?: typeof brand;
  }
  interface TypeBackground {
    muted: string; // chips, inputs, subtle buttons
  }
  interface TypographyVariants {
    badge: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    badge?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    badge: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    subtle: true;
  }
}

export {};
