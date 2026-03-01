import React, { CSSProperties } from 'react';
import { useSpinner } from './useSpinner';
import { SpinnerName } from './spinners';

export interface SpinnerProps {
  /** Which animation to use */
  name: SpinnerName;
  /** CSS color value — defaults to currentColor */
  color?: string;
  /** Font size for the braille glyphs, e.g. "1rem", "24px" */
  size?: string | number;
  /** Playback speed multiplier: 1 = normal, 2 = double speed */
  speed?: number;
  /** Pause the animation */
  paused?: boolean;
  /** Extra class names */
  className?: string;
  /** Inline style overrides */
  style?: CSSProperties;
  /** Accessible label — rendered as aria-label */
  label?: string;
}

export function Spinner({
  name,
  color,
  size,
  speed = 1,
  paused = false,
  className,
  style,
  label = 'Loading',
}: SpinnerProps) {
  const frame = useSpinner(name, speed, paused);

  const baseStyle: CSSProperties = {
    display: 'inline-block',
    fontFamily: 'monospace',
    lineHeight: 1,
    userSelect: 'none',
    whiteSpace: 'pre',
    color: color ?? 'currentColor',
    fontSize: size,
    ...style,
  };

  return (
    <span
      role="status"
      aria-label={label}
      aria-live="off"
      className={className}
      style={baseStyle}
    >
      {frame}
    </span>
  );
}

// ─── Overlay decorator ────────────────────────────────────────────────────────

export interface SpinnerOverlayProps extends SpinnerProps {
  children?: React.ReactNode;
  /** Overlay backdrop color, e.g. "rgba(0,0,0,0.4)" */
  backdrop?: string;
  /** Show the overlay */
  active?: boolean;
}

export function SpinnerOverlay({
  children,
  active = true,
  backdrop = 'rgba(0, 0, 0, 0.35)',
  size = '2rem',
  ...spinnerProps
}: SpinnerOverlayProps) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {children}
      {active && (
        <div
          aria-hidden={!active}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: backdrop,
            borderRadius: 'inherit',
          }}
        >
          <Spinner {...spinnerProps} size={size} />
        </div>
      )}
    </div>
  );
}

// ─── Inline decorator (spinner + text) ───────────────────────────────────────

export interface SpinnerInlineProps extends SpinnerProps {
  children?: React.ReactNode;
  /** Gap between spinner and label text */
  gap?: string | number;
}

export function SpinnerInline({
  children,
  gap = '0.4em',
  ...spinnerProps
}: SpinnerInlineProps) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap }}>
      <Spinner {...spinnerProps} />
      {children && <span>{children}</span>}
    </span>
  );
}
