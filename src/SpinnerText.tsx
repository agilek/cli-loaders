import React from 'react';
import { Spinner } from './Spinner';
import { BaseSpinnerProps } from './Spinner';

export interface SpinnerTextProps extends BaseSpinnerProps {
  /** The text to decorate */
  text: string;
  /** Place a spinner on both ends (mirror) */
  bookend?: boolean;
  /** Gap between spinners and text */
  gap?: string | number;
}

export function SpinnerText({
  text,
  bookend = false,
  gap = '0.4em',
  ...spinnerProps
}: SpinnerTextProps) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap }}>
      <Spinner {...spinnerProps} />
      <span>{text}</span>
      {bookend && <Spinner {...spinnerProps} />}
    </span>
  );
}
