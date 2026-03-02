import { spinners as rawSpinners, gridToBraille, makeGrid } from 'unicode-animations';

export type SpinnerName =
  | 'braille'
  | 'braillewave'
  | 'dna'
  | 'scan'
  | 'rain'
  | 'scanline'
  | 'line'
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

function genLine() {
  const W = 8, H = 4;
  const positions = [-1, 0, 1, 2, 3, 4, 3, 2, 1, 0];
  return positions.map(pos => {
    const g = makeGrid(H, W);
    for (let r = 0; r < H; r++)
      for (let c = 0; c < W; c++)
        if (r === pos && c % 2 === 0) g[r][c] = true;
    return gridToBraille(g);
  });
}

function genScanLine() {
  const W = 6, H = 4, frames: string[] = [];
  // fill: add one row at a time, top → bottom
  for (let row = 0; row < H; row++) {
    const g = makeGrid(H, W);
    for (let r = 0; r <= row; r++)
      for (let c = 0; c < W; c++) g[r][c] = true;
    frames.push(gridToBraille(g));
  }
  // unfill: remove one row at a time, top → bottom
  for (let row = 0; row < H; row++) {
    const g = makeGrid(H, W);
    for (let r = row + 1; r < H; r++)
      for (let c = 0; c < W; c++) g[r][c] = true;
    frames.push(gridToBraille(g));
  }
  return frames;
}

export const spinners = Object.fromEntries(
  Object.entries(rawSpinners).flatMap(([key, val]) =>
    key === 'scanline'
      ? [['scanline', { frames: genScanLine(), interval: 120 }], ['line', { frames: genLine(), interval: 70 }]]
      : [[key, val]]
  )
) as Record<SpinnerName, SpinnerDef>;

export const spinnerNames = Object.keys(spinners) as SpinnerName[];
