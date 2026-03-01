import React, { useState } from 'react';
import { Spinner, SpinnerOverlay, SpinnerInline, spinnerNames } from '../src/index';
import type { SpinnerName } from '../src/index';

const PRESETS: { color: string; label: string }[] = [
  { color: '#00ff99', label: 'Mint' },
  { color: '#7c3aed', label: 'Violet' },
  { color: '#f59e0b', label: 'Amber' },
  { color: '#ef4444', label: 'Red' },
  { color: '#38bdf8', label: 'Sky' },
  { color: '#f0f0f0', label: 'White' },
];

export default function App() {
  const [color, setColor] = useState('#00ff99');
  const [speed, setSpeed] = useState(1);
  const [size, setSize] = useState('1.5rem');
  const [paused, setPaused] = useState(false);
  const [customColor, setCustomColor] = useState('#00ff99');

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      color: '#e8e8e8',
      fontFamily: 'system-ui, sans-serif',
      padding: '3rem 2rem',
    }}>
      {/* Header */}
      <header style={{ maxWidth: 900, margin: '0 auto 3rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <Spinner name="helix" color={color} size="2rem" speed={speed} paused={paused} />
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
            cli-loaders
          </h1>
          <Spinner name="helix" color={color} size="2rem" speed={speed} paused={paused} />
        </div>
        <p style={{ margin: 0, color: '#888', fontSize: '1rem' }}>
          Braille unicode spinners as React decorators
        </p>
      </header>

      {/* Controls */}
      <section style={{
        maxWidth: 900,
        margin: '0 auto 3rem',
        background: '#14141a',
        border: '1px solid #222',
        borderRadius: 12,
        padding: '1.5rem',
      }}>
        <h2 style={{ margin: '0 0 1.25rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555' }}>
          Controls
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-end' }}>

          {/* Color presets */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>Color</label>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              {PRESETS.map(p => (
                <button
                  key={p.color}
                  onClick={() => { setColor(p.color); setCustomColor(p.color); }}
                  title={p.label}
                  style={{
                    width: 24, height: 24,
                    borderRadius: '50%',
                    background: p.color,
                    border: color === p.color ? '2px solid #fff' : '2px solid transparent',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                />
              ))}
              <input
                type="color"
                value={customColor}
                onChange={e => { setCustomColor(e.target.value); setColor(e.target.value); }}
                style={{ width: 28, height: 28, borderRadius: 4, border: 'none', cursor: 'pointer', background: 'none' }}
              />
            </div>
          </div>

          {/* Speed */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>
              Speed — {speed}x
            </label>
            <input
              type="range" min="0.25" max="4" step="0.25"
              value={speed}
              onChange={e => setSpeed(Number(e.target.value))}
              style={{ width: 140 }}
            />
          </div>

          {/* Size */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>Size</label>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {['1rem', '1.5rem', '2rem', '3rem'].map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: 6,
                    border: '1px solid',
                    borderColor: size === s ? color : '#333',
                    background: size === s ? color + '22' : 'transparent',
                    color: size === s ? color : '#888',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Pause */}
          <button
            onClick={() => setPaused(p => !p)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: 8,
              border: '1px solid #333',
              background: paused ? '#333' : 'transparent',
              color: '#ccc',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            {paused ? '▶ Resume' : '⏸ Pause'}
          </button>
        </div>
      </section>

      {/* Spinner grid */}
      <section style={{ maxWidth: 900, margin: '0 auto 3rem' }}>
        <h2 style={{ margin: '0 0 1.25rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555' }}>
          All Spinners — {spinnerNames.length} animations
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1rem',
        }}>
          {spinnerNames.map((name: SpinnerName) => (
            <div
              key={name}
              style={{
                background: '#14141a',
                border: '1px solid #222',
                borderRadius: 10,
                padding: '1.25rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <Spinner
                name={name}
                color={color}
                size={size}
                speed={speed}
                paused={paused}
              />
              <span style={{ fontSize: '0.7rem', color: '#555', fontFamily: 'monospace' }}>
                {name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Usage examples */}
      <section style={{ maxWidth: 900, margin: '0 auto 3rem' }}>
        <h2 style={{ margin: '0 0 1.25rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555' }}>
          Usage as decorators
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>

          {/* Inline with text */}
          <div style={{ background: '#14141a', border: '1px solid #222', borderRadius: 10, padding: '1.5rem', flex: '1 1 260px' }}>
            <p style={{ margin: '0 0 1rem', fontSize: '0.75rem', color: '#555' }}>SpinnerInline</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <SpinnerInline name="braille" color={color} speed={speed} paused={paused}>
                Loading data...
              </SpinnerInline>
              <SpinnerInline name="orbit" color={color} speed={speed} paused={paused}>
                Fetching assets
              </SpinnerInline>
              <SpinnerInline name="snake" color={color} speed={speed} paused={paused}>
                Processing
              </SpinnerInline>
            </div>
          </div>

          {/* Overlay on a card */}
          <div style={{ background: '#14141a', border: '1px solid #222', borderRadius: 10, padding: '1.5rem', flex: '1 1 260px' }}>
            <p style={{ margin: '0 0 1rem', fontSize: '0.75rem', color: '#555' }}>SpinnerOverlay</p>
            <SpinnerOverlay
              name="pulse"
              color={color}
              speed={speed}
              paused={paused}
              size="2rem"
              active={!paused}
              backdrop="rgba(10,10,15,0.7)"
            >
              <div style={{
                width: '100%',
                height: 100,
                borderRadius: 8,
                background: '#1e1e28',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#444',
                fontSize: '0.8rem',
              }}>
                Content behind overlay
              </div>
            </SpinnerOverlay>
          </div>

          {/* Button with spinner */}
          <div style={{ background: '#14141a', border: '1px solid #222', borderRadius: 10, padding: '1.5rem', flex: '1 1 260px' }}>
            <p style={{ margin: '0 0 1rem', fontSize: '0.75rem', color: '#555' }}>In a button</p>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.6rem 1.2rem',
              background: color + '22',
              border: `1px solid ${color}55`,
              borderRadius: 8,
              color,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}>
              <Spinner name="cascade" color={color} size="1rem" speed={speed} paused={paused} />
              Uploading...
            </button>
          </div>
        </div>
      </section>

      {/* Code snippet */}
      <section style={{ maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 1.25rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555' }}>
          Quick start
        </h2>
        <pre style={{
          background: '#14141a',
          border: '1px solid #222',
          borderRadius: 10,
          padding: '1.5rem',
          fontSize: '0.8rem',
          color: '#aaa',
          overflowX: 'auto',
          margin: 0,
        }}>{`import { Spinner, SpinnerInline, SpinnerOverlay } from 'cli-loaders';

// Simple spinner
<Spinner name="braille" color="#00ff99" size="1.5rem" />

// Inline with text
<SpinnerInline name="orbit" color="#7c3aed">
  Loading...
</SpinnerInline>

// Overlay on content
<SpinnerOverlay name="pulse" active={isLoading}>
  <YourContent />
</SpinnerOverlay>

// Hook for custom rendering
const frame = useSpinner('helix', /* speed */ 1.5);
<span style={{ fontFamily: 'monospace' }}>{frame}</span>`}</pre>
      </section>
    </div>
  );
}
