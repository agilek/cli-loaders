import React, { CSSProperties } from 'react';
import { useSpinnerFrames } from './useSpinner';
import { BaseSpinnerProps } from './Spinner';
import { useSpinnerConfig } from './SpinnerContext';

export interface SpinnerTrailProps extends BaseSpinnerProps {
  /** Number of ghost frames to render (including the current frame) */
  trailLength?: number;
  /** Opacity of the oldest ghost frame (newest is always 1.0) */
  minOpacity?: number;
  /** Reverse the opacity gradient — 1.0 on the left fading out to the right */
  reverse?: boolean;
}

export function SpinnerTrail({
  name,
  color,
  size,
  speed,
  paused,
  ignoreReducedMotion,
  trailLength = 4,
  minOpacity = 0.1,
  reverse = false,
  className,
  style,
  label = 'Loading',
}: SpinnerTrailProps) {
  const ctx = useSpinnerConfig();
  const resolvedName = name ?? ctx.defaultName;
  const resolvedColor = color ?? ctx.defaultColor ?? 'currentColor';
  const resolvedSize = size ?? ctx.defaultSize;
  const resolvedSpeed = speed ?? ctx.defaultSpeed;
  const resolvedIgnore = ignoreReducedMotion ?? !ctx.respectReducedMotion;

  const frames = useSpinnerFrames(
    resolvedName,
    trailLength,
    resolvedSpeed,
    paused ?? false,
    resolvedIgnore,
  );

  const baseStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: 'monospace',
    whiteSpace: 'pre',
    color: resolvedColor,
    fontSize: resolvedSize,
    userSelect: 'none',
    lineHeight: 1,
    ...style,
  };

  return (
    <span aria-label={label} role="status" className={className} style={baseStyle}>
      {frames.map((frame, i) => {
        const t = i / (trailLength - 1);
        const opacity = reverse
          ? 1 - (1 - minOpacity) * t
          : minOpacity + (1 - minOpacity) * t;
        return (
          <span key={i} aria-hidden="true" style={{ opacity }}>
            {frame}
          </span>
        );
      })}
    </span>
  );
}
