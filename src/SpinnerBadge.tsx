import React, { CSSProperties } from 'react';
import { Spinner } from './Spinner';
import { BaseSpinnerProps } from './Spinner';

export interface SpinnerBadgeProps extends BaseSpinnerProps {
  /** Badge text */
  label: string;
  /** Padding inside the badge */
  padding?: string;
  /** Border radius */
  borderRadius?: string | number;
  /** Gap between glyph and label */
  gap?: string | number;
}

export function SpinnerBadge({
  label,
  color = 'currentColor',
  size = '0.8em',
  padding = '0.2em 0.55em',
  borderRadius = '999px',
  gap = '0.35em',
  style,
  className,
  ...spinnerProps
}: SpinnerBadgeProps) {
  const badgeStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap,
    padding,
    borderRadius,
    // Derive a subtle background tint from the color
    background: color !== 'currentColor' ? `${color}22` : 'rgba(128,128,128,0.12)',
    border: `1px solid ${color !== 'currentColor' ? `${color}44` : 'rgba(128,128,128,0.25)'}`,
    color,
    fontSize: '0.8em',
    fontFamily: 'system-ui, sans-serif',
    lineHeight: 1.4,
    userSelect: 'none',
    ...style,
  };

  return (
    <span className={className} style={badgeStyle}>
      <Spinner {...spinnerProps} color={color} size={size} label={label} />
      <span>{label}</span>
    </span>
  );
}
