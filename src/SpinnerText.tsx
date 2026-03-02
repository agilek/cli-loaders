import React from 'react';
import { Spinner, BaseSpinnerProps } from './Spinner';

export interface SpinnerTextProps extends BaseSpinnerProps {
  /** The text to decorate */
  text: string;
  /** Gap between spinner and text */
  gap?: string | number;
}

export function SpinnerText({ text, gap = '0.4em', ...spinnerProps }: SpinnerTextProps) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap }}>
      <Spinner {...spinnerProps} />
      <span>{text}</span>
    </span>
  );
}

// Explicit bookend variant — spinner on both sides of the text.
// Prefer this over SpinnerText with a boolean prop.
export function SpinnerTextBookend({ text, gap = '0.4em', ...spinnerProps }: SpinnerTextProps) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap }}>
      <Spinner {...spinnerProps} />
      <span>{text}</span>
      <Spinner {...spinnerProps} />
    </span>
  );
}
