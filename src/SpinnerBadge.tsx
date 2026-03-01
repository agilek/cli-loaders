import React, { CSSProperties } from 'react';
import { Spinner } from './Spinner';
import { BaseSpinnerProps } from './Spinner';

export interface SpinnerBadgeProps extends BaseSpinnerProps {
  /** Badge text */
  label: string;
  /** Vertical padding */
  paddingY?: string;
  /** Left/right base padding — right side gets extra space for optical balance */
  paddingX?: string;
  /**
   * How much of the spinner size to add to the right padding for optical balance.
   * 0 = symmetric, 1 = full spinner size added. Default 0.5.
   */
  balanceRatio?: number;
  /** Border radius */
  borderRadius?: string | number;
  /** Gap between glyph and label */
  gap?: string | number;
}

export function SpinnerBadge({
  label,
  color = 'currentColor',
  size = '1em',
  paddingY = '0.4em',
  paddingX = '0.8em',
  borderRadius = '999px',
  gap = '0.35em',
  balanceRatio = 0.3,
  style,
  className,
  ...spinnerProps
}: SpinnerBadgeProps) {
  const paddingRight = typeof size === 'number'
    ? `calc(${paddingX} + ${size * balanceRatio}px)`
    : `calc(${paddingX} + ${size} * ${balanceRatio})`;

  const badgeStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'baseline',
    gap,
    padding: `${paddingY} ${paddingRight} ${paddingY} ${paddingX}`,
    borderRadius,
    background: color !== 'currentColor' ? `${color}22` : 'rgba(128,128,128,0.12)',
    border: `1px solid ${color !== 'currentColor' ? `${color}44` : 'rgba(128,128,128,0.25)'}`,
    color,
    fontSize: '0.8em',
    fontFamily: 'system-ui, sans-serif',
    lineHeight: 1,
    userSelect: 'none',
    ...style,
  };

  return (
    <span className={className} style={badgeStyle}>
      <Spinner {...spinnerProps} color={color} size={size} label={label} style={{ transform: 'translateY(-1px)' }} />
      <span>{label}</span>
    </span>
  );
}
