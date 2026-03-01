import { spinners as rawSpinners } from 'unicode-animations';

export type SpinnerName =
  | 'braille'
  | 'braillewave'
  | 'dna'
  | 'scan'
  | 'rain'
  | 'scanline'
  | 'pulse'
  | 'snake'
  | 'sparkle'
  | 'cascade'
  | 'columns'
  | 'orbit'
  | 'breathe'
  | 'waverows'
  | 'checkerboard'
  | 'helix'
  | 'fillsweep'
  | 'diagswipe';

export interface SpinnerDef {
  frames: readonly string[];
  interval: number;
}

export const spinners: Record<SpinnerName, SpinnerDef> = rawSpinners;

export const spinnerNames = Object.keys(spinners) as SpinnerName[];
