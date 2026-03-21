import React, { CSSProperties, forwardRef } from 'react';
import { useSpinner } from './useSpinner';
import { SpinnerName, DotShape, brailleToGrid } from './spinners';
import { useSpinnerConfig } from './SpinnerContext';

// Visually-hidden helper for accessible status labels
const srOnly: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: 0,
};

// ─── Base props shared by all components ─────────────────────────────────────

export interface BaseSpinnerProps {
  name?: SpinnerName;
  color?: string;
  /** Font size for the braille glyphs, e.g. "1.5rem", 24 */
  size?: string | number;
  /** Playback speed multiplier: 1 = normal, 2 = 2× faster */
  speed?: number;
  paused?: boolean;
  /** Override prefers-reduced-motion and always animate */
  ignoreReducedMotion?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Accessible label announced by screen readers */
  label?: string;
  /** Shape of individual dots: 'circle', 'square', or 'diamond'. When set, renders as SVG instead of text. */
  shape?: DotShape;
}

// ─── SVG Shape Rendering ──────────────────────────────────────────────────────

const DOT_SPACING = 10;
const DOT_RADIUS = 3.5;

function renderShape(shape: DotShape, cx: number, cy: number, r: number) {
  const key = `${cx}-${cy}`;
  if (shape === 'square') {
    return <rect key={key} x={cx - r} y={cy - r} width={r * 2} height={r * 2} />;
  }
  if (shape === 'diamond') {
    return (
      <polygon
        key={key}
        points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`}
      />
    );
  }
  return <circle key={key} cx={cx} cy={cy} r={r} />;
}

interface SpinnerShapeSVGProps {
  frame: string;
  shape: DotShape;
  color: string | undefined;
  size: string | number | undefined;
}

function SpinnerShapeSVG({ frame, shape, color, size }: SpinnerShapeSVGProps) {
  const grid = brailleToGrid(frame);
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const vw = cols * DOT_SPACING;
  const vh = rows * DOT_SPACING;

  return (
    <svg
      aria-hidden="true"
      width={size ?? '1em'}
      height={size ?? '1em'}
      viewBox={`0 0 ${vw} ${vh}`}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
      fill={color ?? 'currentColor'}
    >
      {grid.flatMap((row, r) =>
        row.map((active, c) =>
          active
            ? renderShape(shape, c * DOT_SPACING + DOT_SPACING / 2, r * DOT_SPACING + DOT_SPACING / 2, DOT_RADIUS)
            : null
        )
      )}
    </svg>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

export type SpinnerProps = BaseSpinnerProps & Omit<React.HTMLAttributes<HTMLSpanElement>, keyof BaseSpinnerProps>;

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { name, color, size, speed, paused, ignoreReducedMotion, className, style, label, shape, ...rest },
  ref,
) {
  const ctx = useSpinnerConfig();
  const resolvedName = name ?? ctx.defaultName;
  const resolvedColor = color ?? ctx.defaultColor;
  const resolvedSize = size ?? ctx.defaultSize;
  const resolvedSpeed = speed ?? ctx.defaultSpeed;
  const resolvedIgnore = ignoreReducedMotion ?? !ctx.respectReducedMotion;
  const resolvedShape = shape ?? ctx.defaultShape;

  const frame = useSpinner(resolvedName, resolvedSpeed, paused ?? false, resolvedIgnore);
  const resolvedLabel = label ?? 'Loading';

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: 'inline-flex', alignItems: 'baseline', lineHeight: 1, position: 'relative', ...style }}
      {...rest}
    >
      {/* Glyph — hidden from AT, it's just visual noise */}
      {resolvedShape ? (
        <SpinnerShapeSVG frame={frame} shape={resolvedShape} color={resolvedColor} size={resolvedSize} />
      ) : (
        <span
          aria-hidden="true"
          style={{
            fontFamily: 'monospace',
            lineHeight: 1,
            userSelect: 'none',
            whiteSpace: 'pre',
            color: resolvedColor ?? 'currentColor',
            fontSize: resolvedSize,
          }}
        >
          {frame}
        </span>
      )}
      {/* Screen-reader-only status label */}
      <span role="status" aria-live="polite" style={srOnly}>
        {resolvedLabel}
      </span>
    </span>
  );
});

// ─── SpinnerOverlay ───────────────────────────────────────────────────────────

export interface SpinnerOverlayProps extends BaseSpinnerProps {
  children?: React.ReactNode;
  /** Overlay backdrop color, e.g. "rgba(0,0,0,0.4)" */
  backdrop?: string;
  /** Show the overlay */
  active?: boolean;
  /** Style applied to the outer wrapper div */
  containerStyle?: CSSProperties;
  /** Class applied to the outer wrapper div */
  containerClassName?: string;
}

export function SpinnerOverlay({
  children,
  active = true,
  backdrop = 'rgba(0, 0, 0, 0.35)',
  size = '2rem',
  label = 'Loading',
  containerStyle,
  containerClassName,
  ...spinnerProps
}: SpinnerOverlayProps) {
  return (
    <div
      className={containerClassName}
      style={{ position: 'relative', display: 'block', ...containerStyle }}
      aria-busy={active}
    >
      {/* inert prevents keyboard/AT access to content behind the overlay */}
      <div inert={active || undefined}>{children}</div>
      {active && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: backdrop,
            borderRadius: 'inherit',
            transition: 'opacity 0.15s ease',
          }}
        >
          <Spinner {...spinnerProps} size={size} label={label} />
        </div>
      )}
    </div>
  );
}

// ─── SpinnerInline ────────────────────────────────────────────────────────────

export interface SpinnerInlineProps extends BaseSpinnerProps {
  children?: React.ReactNode;
  gap?: string | number;
}

export function SpinnerInline({ children, gap = '0.4em', ...spinnerProps }: SpinnerInlineProps) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap }}>
      <Spinner {...spinnerProps} />
      {children ? <span>{children}</span> : null}
    </span>
  );
}
