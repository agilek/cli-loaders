import React from 'react';
import { Spinner, spinnerNames } from '../src/index';

export default function SpinnerGrid() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      color: '#e8e8e8',
      fontFamily: 'monospace',
      padding: '2rem',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
        gap: '0.75rem',
      }}>
        {spinnerNames.map(name => (
          <div
            key={name}
            style={{
              background: '#14141a',
              border: '1px solid #1e1e28',
              borderRadius: 10,
              padding: '1.25rem 0.75rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <Spinner name={name} color="#00ff99" size="2rem" />
            <span style={{ fontSize: '0.65rem', color: '#555', letterSpacing: '0.02em' }}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
