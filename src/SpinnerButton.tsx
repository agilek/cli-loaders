import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { Spinner, BaseSpinnerProps } from './Spinner';

export interface SpinnerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Show the spinner and disable interaction */
  loading?: boolean;
  /** Which side the spinner appears on */
  spinnerPosition?: 'left' | 'right';
  /** Gap between spinner and button label */
  spinnerGap?: string | number;
  /** Props forwarded to the inner Spinner */
  spinnerProps?: Omit<BaseSpinnerProps, 'size'>;
}

export const SpinnerButton = forwardRef<HTMLButtonElement, SpinnerButtonProps>(
  function SpinnerButton(
    {
      loading = false,
      spinnerPosition = 'left',
      spinnerGap = '0.45em',
      spinnerProps,
      children,
      disabled,
      style,
      ...rest
    },
    ref,
  ) {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        aria-disabled={isDisabled}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: spinnerGap,
          flexDirection: spinnerPosition === 'right' ? 'row-reverse' : 'row',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled && !loading ? 0.5 : 1,
          ...style,
        }}
        {...rest}
      >
        {loading && (
          <Spinner
            name="braille"
            label="Loading"
            {...spinnerProps}
            size="1em"
            style={{ lineHeight: 'inherit', ...spinnerProps?.style }}
          />
        )}
        <span>{children}</span>
      </button>
    );
  },
);
