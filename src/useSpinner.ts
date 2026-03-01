import { useState, useEffect } from 'react';
import { spinners, SpinnerName } from './spinners';

function getReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useSpinner(
  name: SpinnerName,
  speed: number = 1,
  paused: boolean = false,
  ignoreReducedMotion: boolean = false,
): string {
  const def = spinners[name];
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    // SSR guard
    if (typeof window === 'undefined') return;
    // Respect prefers-reduced-motion
    if (!ignoreReducedMotion && getReducedMotion()) return;
    if (paused) return;

    setFrame(0);
    const ms = def.interval / Math.max(speed, 0.01);
    const id = setInterval(() => {
      setFrame(prev => (prev + 1) % def.frames.length);
    }, ms);
    return () => clearInterval(id);
  }, [name, speed, paused, ignoreReducedMotion, def.interval, def.frames.length]);

  return def.frames[frame] ?? def.frames[0];
}

/** Returns a sliding window of the last `length` frames for trail effects. */
export function useSpinnerFrames(
  name: SpinnerName,
  length: number = 3,
  speed: number = 1,
  paused: boolean = false,
  ignoreReducedMotion: boolean = false,
): string[] {
  const def = spinners[name];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!ignoreReducedMotion && getReducedMotion()) return;
    if (paused) return;

    setIndex(0);
    const ms = def.interval / Math.max(speed, 0.01);
    const id = setInterval(() => {
      setIndex(prev => (prev + 1) % def.frames.length);
    }, ms);
    return () => clearInterval(id);
  }, [name, speed, paused, ignoreReducedMotion, def.interval, def.frames.length]);

  // Build a window of `length` frames ending at the current index
  return Array.from({ length }, (_, i) => {
    const fi = (index - (length - 1 - i) + def.frames.length * length) % def.frames.length;
    return def.frames[fi];
  });
}
