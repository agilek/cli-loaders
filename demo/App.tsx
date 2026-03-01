import React, { useState, useEffect, useCallback } from 'react';
import {
  Spinner,
  SpinnerInline,
  SpinnerOverlay,
  SpinnerButton,
  SpinnerBadge,
  SpinnerText,
  SpinnerTrail,
  SpinnerProvider,
  useSpinner,
  spinnerNames,
} from '../src/index';
import type { SpinnerName } from '../src/index';

// ─── Spinner groups ────────────────────────────────────────────────────────────

const GROUPS: { label: string; names: SpinnerName[] }[] = [
  { label: 'Single glyph', names: ['braille', 'orbit', 'breathe'] },
  { label: 'Wave / flow', names: ['braillewave', 'dna', 'waverows', 'helix'] },
  { label: 'Fill / sweep', names: ['fillsweep', 'diagswipe', 'scanline', 'cascade'] },
  { label: 'Grid patterns', names: ['scan', 'rain', 'pulse', 'snake', 'sparkle', 'columns', 'checkerboard'] },
];

// ─── Colour presets ────────────────────────────────────────────────────────────

const PRESETS = [
  { color: '#00ff99', label: 'Mint' },
  { color: '#7c3aed', label: 'Violet' },
  { color: '#f59e0b', label: 'Amber' },
  { color: '#ef4444', label: 'Red' },
  { color: '#38bdf8', label: 'Sky' },
];

// ─── Utility ──────────────────────────────────────────────────────────────────

function hex8(color: string, alpha: string): string {
  return color.startsWith('#') && color.length === 7 ? `${color}${alpha}` : color;
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [code]);

  return (
    <div style={{ position: 'relative' }}>
      <pre style={{
        margin: 0,
        padding: '1rem 3rem 1rem 1rem',
        background: '#0d0d12',
        border: '1px solid #1e1e2a',
        borderRadius: 8,
        fontSize: '0.78rem',
        color: '#aaa',
        overflowX: 'auto',
        whiteSpace: 'pre',
      }}>
        {code}
      </pre>
      <button
        onClick={copy}
        style={{
          position: 'absolute', top: 8, right: 8,
          padding: '0.2rem 0.5rem',
          background: '#1e1e2a',
          border: '1px solid #333',
          borderRadius: 5,
          color: copied ? '#00ff99' : '#888',
          fontSize: '0.7rem',
          cursor: 'pointer',
        }}
      >
        {copied ? '✓ copied' : 'copy'}
      </button>
    </div>
  );
}

// ─── Spinner card ─────────────────────────────────────────────────────────────

function SpinnerCard({
  name, color, size, speed, paused, dark,
}: {
  name: SpinnerName; color: string; size: string; speed: number; paused: boolean; dark: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const snippet = `<Spinner name="${name}" color="${color}" size="${size}" />`;

  function copy() {
    navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div style={{
      background: dark ? '#14141a' : '#f4f4f8',
      border: `1px solid ${dark ? '#222' : '#e0e0e8'}`,
      borderRadius: 10,
      padding: '1.25rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.75rem',
    }}>
      <Spinner name={name} color={color} size={size} speed={speed} paused={paused} />
      <span style={{ fontSize: '0.68rem', color: dark ? '#555' : '#999', fontFamily: 'monospace' }}>
        {name}
      </span>
      <button
        onClick={copy}
        style={{
          padding: '0.15rem 0.5rem',
          background: 'transparent',
          border: `1px solid ${dark ? '#333' : '#ddd'}`,
          borderRadius: 5,
          color: copied ? color : (dark ? '#555' : '#bbb'),
          fontSize: '0.65rem',
          cursor: 'pointer',
        }}
      >
        {copied ? '✓ copied' : 'copy JSX'}
      </button>
    </div>
  );
}

// ─── Custom hook demo ─────────────────────────────────────────────────────────

function HookDemo({ color, speed }: { color: string; speed: number }) {
  const frame = useSpinner('helix', speed);
  return (
    <span style={{
      fontFamily: 'monospace',
      fontSize: '3rem',
      color,
      lineHeight: 1,
      userSelect: 'none',
    }}>
      {frame}
    </span>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [color, setColor] = useState('#00ff99');
  const [speed, setSpeed] = useState(1);
  const [size, setSize] = useState('1.5rem');
  const [paused, setPaused] = useState(false);
  const [dark, setDark] = useState(true);

  const [loadingCard, setLoadingCard] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Fake async action for SpinnerButton demo
  function triggerLoad() {
    setLoadingCard(true);
    setTimeout(() => setLoadingCard(false), 2200);
  }

  const bg = dark ? '#0a0a0f' : '#f9f9fb';
  const fg = dark ? '#e8e8e8' : '#111';
  const muted = dark ? '#555' : '#aaa';
  const cardBg = dark ? '#14141a' : '#f0f0f5';
  const cardBorder = dark ? '#222' : '#e0e0e8';

  return (
    <SpinnerProvider defaultColor={color} defaultSpeed={speed}>
      <div style={{ minHeight: '100vh', background: bg, color: fg, fontFamily: 'system-ui, sans-serif', padding: '3rem 2rem' }}>

        {/* Header */}
        <header style={{ maxWidth: 900, margin: '0 auto 3rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
            <SpinnerTrail name="helix" color={color} size="1.8rem" speed={speed} paused={paused} trailLength={4} />
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
              cli-loaders
            </h1>
            <SpinnerTrail name="helix" color={color} size="1.8rem" speed={speed} paused={paused} trailLength={4} minOpacity={1} />
          </div>
          <p style={{ margin: 0, color: muted, fontSize: '1rem' }}>
            Braille unicode spinners as React decorator components
          </p>

          {/* Reduced motion banner */}
          {reducedMotion && (
            <div style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#f59e0b22',
              border: '1px solid #f59e0b44',
              borderRadius: 8,
              color: '#f59e0b',
              fontSize: '0.8rem',
            }}>
              ⚠ prefers-reduced-motion is <strong>active</strong> — animations are paused.
              Spinners show frame 0 only.
            </div>
          )}
        </header>

        {/* Controls */}
        <section style={{ maxWidth: 900, margin: '0 auto 3rem', background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 12, padding: '1.5rem' }}>
          <h2 style={{ margin: '0 0 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: muted }}>Controls</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-end' }}>

            {/* Colour */}
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', color: muted, marginBottom: '0.5rem' }}>Color</label>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                {PRESETS.map(p => (
                  <button
                    key={p.color}
                    onClick={() => setColor(p.color)}
                    title={p.label}
                    style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: p.color,
                      border: color === p.color ? '2px solid #fff' : '2px solid transparent',
                      cursor: 'pointer', padding: 0,
                    }}
                  />
                ))}
                <input
                  type="color" value={color}
                  onChange={e => setColor(e.target.value)}
                  style={{ width: 28, height: 28, borderRadius: 4, border: 'none', cursor: 'pointer', background: 'none' }}
                />
              </div>
            </div>

            {/* Speed */}
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', color: muted, marginBottom: '0.5rem' }}>Speed — {speed}×</label>
              <input type="range" min="0.25" max="4" step="0.25" value={speed}
                onChange={e => setSpeed(Number(e.target.value))} style={{ width: 120 }} />
            </div>

            {/* Size */}
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', color: muted, marginBottom: '0.5rem' }}>Size</label>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                {(['1rem', '1.5rem', '2rem', '3rem'] as const).map(s => (
                  <button key={s} onClick={() => setSize(s)} style={{
                    padding: '0.2rem 0.55rem', borderRadius: 6,
                    border: `1px solid ${size === s ? color : cardBorder}`,
                    background: size === s ? hex8(color, '22') : 'transparent',
                    color: size === s ? color : muted,
                    fontSize: '0.7rem', cursor: 'pointer',
                  }}>{s}</button>
                ))}
              </div>
            </div>

            {/* Pause */}
            <button onClick={() => setPaused(p => !p)} style={{
              padding: '0.35rem 0.85rem', borderRadius: 8,
              border: `1px solid ${cardBorder}`, background: paused ? cardBg : 'transparent',
              color: fg, fontSize: '0.78rem', cursor: 'pointer',
            }}>
              {paused ? '▶ Resume' : '⏸ Pause'}
            </button>

            {/* Dark / light */}
            <button onClick={() => setDark(d => !d)} style={{
              padding: '0.35rem 0.85rem', borderRadius: 8,
              border: `1px solid ${cardBorder}`, background: 'transparent',
              color: fg, fontSize: '0.78rem', cursor: 'pointer',
            }}>
              {dark ? '☀ Light' : '☾ Dark'}
            </button>
          </div>
        </section>

        {/* Spinner grid — grouped */}
        {GROUPS.map(group => (
          <section key={group.label} style={{ maxWidth: 900, margin: '0 auto 2.5rem' }}>
            <h2 style={{ margin: '0 0 1rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: muted }}>
              {group.label}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
              {group.names.map(name => (
                <SpinnerCard key={name} name={name} color={color} size={size} speed={speed} paused={paused} dark={dark} />
              ))}
            </div>
          </section>
        ))}

        {/* Components */}
        <section style={{ maxWidth: 900, margin: '0 auto 3rem' }}>
          <h2 style={{ margin: '0 0 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: muted }}>
            Components
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>

            {/* SpinnerInline */}
            <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 10, padding: '1.25rem' }}>
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.7rem', color: muted, fontFamily: 'monospace' }}>SpinnerInline</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
                <SpinnerInline name="braille" color={color} speed={speed} paused={paused}>Fetching data…</SpinnerInline>
                <SpinnerInline name="orbit" color={color} speed={speed} paused={paused}>Uploading file</SpinnerInline>
                <SpinnerInline name="snake" color={color} speed={speed} paused={paused}>Processing</SpinnerInline>
              </div>
            </div>

            {/* SpinnerText */}
            <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 10, padding: '1.25rem' }}>
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.7rem', color: muted, fontFamily: 'monospace' }}>SpinnerText</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
                <SpinnerText name="braillewave" text="Streaming" color={color} speed={speed} paused={paused} />
                <SpinnerText name="dna" text="Building" color={color} speed={speed} paused={paused} bookend />
                <SpinnerText name="cascade" text="Deploying" color={color} speed={speed} paused={paused} bookend />
              </div>
            </div>

            {/* SpinnerBadge */}
            <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 10, padding: '1.25rem' }}>
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.7rem', color: muted, fontFamily: 'monospace' }}>SpinnerBadge</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <SpinnerBadge name="orbit" label="Live" color="#ef4444" speed={speed} paused={paused} />
                <SpinnerBadge name="pulse" label="Syncing" color="#38bdf8" speed={speed} paused={paused} />
                <SpinnerBadge name="breathe" label="Building" color="#f59e0b" speed={speed} paused={paused} />
                <SpinnerBadge name="braille" label="Active" color={color} speed={speed} paused={paused} />
              </div>
            </div>

            {/* SpinnerTrail */}
            <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 10, padding: '1.25rem' }}>
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.7rem', color: muted, fontFamily: 'monospace' }}>SpinnerTrail</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <SpinnerTrail name="braillewave" color={color} size="2rem" speed={speed} paused={paused} trailLength={5} />
                <SpinnerTrail name="helix" color={color} size="1.5rem" speed={speed} paused={paused} trailLength={4} />
                <SpinnerTrail name="waverows" color={color} size="1.25rem" speed={speed} paused={paused} trailLength={3} />
              </div>
            </div>

            {/* SpinnerOverlay */}
            <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 10, padding: '1.25rem' }}>
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.7rem', color: muted, fontFamily: 'monospace' }}>SpinnerOverlay</p>
              <SpinnerOverlay
                name="pulse" color={color} size="2rem" speed={speed}
                active={loadingCard}
                backdrop={dark ? 'rgba(10,10,15,0.75)' : 'rgba(249,249,251,0.8)'}
                style={{ width: '100%' }}
              >
                <div style={{
                  height: 90, borderRadius: 8, background: dark ? '#1e1e28' : '#e8e8f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: muted, fontSize: '0.8rem',
                }}>
                  Content behind overlay
                </div>
              </SpinnerOverlay>
            </div>

            {/* SpinnerButton */}
            <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 10, padding: '1.25rem' }}>
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.7rem', color: muted, fontFamily: 'monospace' }}>SpinnerButton</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <SpinnerButton
                  loading={loadingCard}
                  onClick={triggerLoad}
                  spinnerProps={{ name: 'orbit', color }}
                  style={{
                    padding: '0.5rem 1rem', borderRadius: 8,
                    background: hex8(color, '22'), border: `1px solid ${hex8(color, '55')}`,
                    color, fontSize: '0.85rem',
                  }}
                >
                  {loadingCard ? 'Saving…' : 'Save changes'}
                </SpinnerButton>
                <SpinnerButton
                  loading={loadingCard}
                  spinnerPosition="right"
                  spinnerProps={{ name: 'cascade', color }}
                  style={{
                    padding: '0.5rem 1rem', borderRadius: 8,
                    background: 'transparent', border: `1px solid ${cardBorder}`,
                    color: fg, fontSize: '0.85rem',
                  }}
                >
                  {loadingCard ? 'Deploying…' : 'Deploy'}
                </SpinnerButton>
              </div>
            </div>
          </div>
        </section>

        {/* useSpinner hook demo */}
        <section style={{ maxWidth: 900, margin: '0 auto 3rem' }}>
          <h2 style={{ margin: '0 0 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: muted }}>
            useSpinner hook — custom rendering
          </h2>
          <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 12, padding: '1.5rem', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <HookDemo color={color} speed={speed} />
            <CodeBlock code={`// Drive any element with the raw frame string
const frame = useSpinner('helix', 1.5);

<h1 style={{ fontFamily: 'monospace', color: '#00ff99' }}>
  {frame}
</h1>`} />
          </div>
        </section>

        {/* SpinnerProvider */}
        <section style={{ maxWidth: 900, margin: '0 auto 3rem' }}>
          <h2 style={{ margin: '0 0 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: muted }}>
            SpinnerProvider — global defaults
          </h2>
          <CodeBlock code={`// Wrap your app (or a subtree) to set global defaults.
// Every Spinner inside inherits these unless overridden.
<SpinnerProvider
  defaultName="orbit"
  defaultColor="#7c3aed"
  defaultSpeed={1.2}
  respectReducedMotion={true}
>
  <App />
</SpinnerProvider>

// Inside: no props needed — picks up context defaults
<Spinner />
<SpinnerBadge label="Live" />`} />
        </section>

        {/* Quick-start */}
        <section style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ margin: '0 0 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: muted }}>
            Quick start
          </h2>
          <CodeBlock code={`npm install cli-loaders

import {
  Spinner,          // base animated glyph
  SpinnerInline,    // glyph + text row
  SpinnerText,      // text with bookend decorators
  SpinnerBadge,     // tinted status pill
  SpinnerTrail,     // ghost-frame opacity trail
  SpinnerButton,    // button with loading state
  SpinnerOverlay,   // overlay any content while loading
  SpinnerProvider,  // global defaults via context
  useSpinner,       // raw frame string for custom rendering
} from 'cli-loaders';

// Minimal
<Spinner name="braille" />

// With global defaults
<SpinnerProvider defaultColor="#7c3aed" defaultSpeed={1.5}>
  <Spinner name="helix" />
  <SpinnerBadge label="Live" />
</SpinnerProvider>`} />
        </section>

      </div>
    </SpinnerProvider>
  );
}
