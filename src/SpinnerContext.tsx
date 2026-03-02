import React, { createContext, useContext, useMemo } from 'react';
import { SpinnerName } from './spinners';

export interface SpinnerConfig {
  defaultName: SpinnerName;
  defaultColor: string | undefined;
  defaultSize: string | number | undefined;
  defaultSpeed: number;
  /** When true (default), animations pause if the OS has prefers-reduced-motion: reduce */
  respectReducedMotion: boolean;
}

const defaults: SpinnerConfig = {
  defaultName: 'braille',
  defaultColor: undefined,
  defaultSize: undefined,
  defaultSpeed: 1,
  respectReducedMotion: true,
};

const SpinnerContext = createContext<SpinnerConfig>(defaults);

export interface SpinnerProviderProps {
  children: React.ReactNode;
  defaultName?: SpinnerName;
  defaultColor?: string;
  defaultSize?: string | number;
  defaultSpeed?: number;
  respectReducedMotion?: boolean;
}

export function SpinnerProvider({
  children,
  defaultName = defaults.defaultName,
  defaultColor = defaults.defaultColor,
  defaultSize = defaults.defaultSize,
  defaultSpeed = defaults.defaultSpeed,
  respectReducedMotion = defaults.respectReducedMotion,
}: SpinnerProviderProps) {
  const value = useMemo(
    () => ({ defaultName, defaultColor, defaultSize, defaultSpeed, respectReducedMotion }),
    [defaultName, defaultColor, defaultSize, defaultSpeed, respectReducedMotion],
  );
  return (
    <SpinnerContext.Provider value={value}>
      {children}
    </SpinnerContext.Provider>
  );
}

export function useSpinnerConfig(): SpinnerConfig {
  return useContext(SpinnerContext);
}
