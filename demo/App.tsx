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
  { label: 'Fill / sweep', names: ['fillsweep', 'diagswipe', 'scanline', 'line', 'cascade'] },
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
  const [containerHovered, setContainerHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [code]);

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setContainerHovered(true)}
      onMouseLeave={() => setContainerHovered(false)}
    >
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
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        style={{
          position: 'absolute', top: 8, right: 8,
          background: btnHovered && !copied ? '#2a2a3a' : '#1e1e2a',
          border: `1px solid ${btnHovered && !copied ? '#444' : '#2e2e3e'}`,
          borderRadius: 5,
          color: copied ? '#00ff99' : btnHovered ? '#ccc' : '#888',
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 26, height: 26, padding: 0,
          opacity: containerHovered || copied ? 1 : 0,
          pointerEvents: containerHovered || copied ? 'auto' : 'none',
          transition: 'background 0.15s, border-color 0.15s, color 0.15s, opacity 0.15s',
        }}
      >
        {copied
          ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        }
      </button>
    </div>
  );
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ code, color, muted, visible = true, style: extraStyle }: { code: string; color: string; muted: string; visible?: boolean; style?: React.CSSProperties }) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={() => navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Copy code"
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 26, height: 26, borderRadius: 5, padding: 0,
        border: `1px solid ${hovered && !copied ? 'rgba(128,128,128,0.3)' : 'rgba(128,128,128,0.12)'}`,
        background: hovered && !copied ? 'rgba(128,128,128,0.08)' : 'transparent',
        color: copied ? color : hovered ? 'currentColor' : muted,
        cursor: 'pointer', flexShrink: 0,
        opacity: visible || copied ? 1 : 0,
        pointerEvents: visible || copied ? 'auto' : 'none',
        transition: 'background 0.15s, border-color 0.15s, color 0.15s, opacity 0.15s',
        ...extraStyle,
      }}
    >
      {copied
        ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      }
    </button>
  );
}

// ─── Card header with copy button ─────────────────────────────────────────────

function CardHeader({ label, code, color, muted, containerHovered = true }: { label: string; code: string; color: string; muted: string; containerHovered?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
      <span style={{ fontSize: '0.7rem', color: muted, fontFamily: 'monospace' }}>{label}</span>
      <CopyButton code={code} color={color} muted={muted} visible={containerHovered} style={{ marginTop: -5, marginRight: -5 }} />
    </div>
  );
}

// ─── Spinner card ─────────────────────────────────────────────────────────────

function SpinnerCard({
  name, color, size, speed, paused, dark, muted,
}: {
  name: SpinnerName; color: string; size: string; speed: number; paused: boolean; dark: boolean; muted: string;
}) {
  const [hovered, setHovered] = useState(false);
  const snippet = `<Spinner name="${name}" color="${color}" size="${size}" />`;

  return (
    <div
      style={{
        position: 'relative',
        background: dark ? '#14141a' : '#f4f4f8',
        border: `1px solid ${dark ? '#222' : '#e0e0e8'}`,
        borderRadius: 10,
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '7.5rem',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', right: '1.25rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.7rem', color: muted, fontFamily: 'monospace' }}>{name}</span>
        <CopyButton code={snippet} color={color} muted={muted} visible={hovered} style={{ marginTop: -5, marginRight: -5 }} />
      </div>
      <Spinner name={name} color={color} size={size} speed={speed} paused={paused} style={{ marginTop: 8 }} />
    </div>
  );
}

// ─── Hover-aware card wrapper ──────────────────────────────────────────────────

function HoverCard({ style, children }: { style?: React.CSSProperties; children: (hovered: boolean) => React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={style} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {children(hovered)}
    </div>
  );
}

// ─── Custom hook demo ─────────────────────────────────────────────────────────

function HookDemo({ name, color, speed }: { name: SpinnerName; color: string; speed: number }) {
  const frame = useSpinner(name, speed);
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
  const [spinner, setSpinner] = useState<SpinnerName>('braille');
  const [color, setColor] = useState('#00ff99');
  const [speed, setSpeed] = useState(1);
  const [size, setSize] = useState('1.5rem');
  const [paused, setPaused] = useState(false);
  const [dark, setDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const [loadingOverlay, setLoadingOverlay] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDeploy, setLoadingDeploy] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  function triggerSave() {
    setLoadingSave(true);
    setTimeout(() => setLoadingSave(false), 2000);
  }

  function triggerDeploy() {
    setLoadingDeploy(true);
    setTimeout(() => setLoadingDeploy(false), 3000);
  }

  const bg = dark ? '#0a0a0f' : '#f9f9fb';
  const fg = dark ? '#e8e8e8' : '#111';
  const muted = dark ? '#555' : '#aaa';
  const cardBg = dark ? '#14141a' : '#f0f0f5';
  const cardBorder = dark ? '#222' : '#e0e0e8';

  return (
    <SpinnerProvider defaultColor={color} defaultSpeed={speed}>
      <div style={{ minHeight: '100vh', background: bg, color: fg, fontFamily: 'system-ui, sans-serif', padding: '3rem 2rem' }}>

        {/* Theme toggle — fixed top-right, demo-only */}
        <button
          onClick={() => setDark(d => !d)}
          title="Toggle demo theme"
          style={{
            position: 'fixed', top: '1rem', right: '1rem', zIndex: 100,
            padding: '0.35rem 0.7rem', borderRadius: 8,
            border: `1px solid ${cardBorder}`, background: cardBg,
            color: muted, fontSize: '0.78rem', cursor: 'pointer',
          }}
        >
          {dark ? '☀' : '☾'}
        </button>

        {/* Header */}
        <header style={{ maxWidth: 900, margin: '0 auto 3rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
            <SpinnerTrail name={spinner} color={color} size="1.8rem" speed={speed} paused={paused} trailLength={4} />
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
              cli-loaders
            </h1>
            <SpinnerTrail name={spinner} color={color} size="1.8rem" speed={speed} paused={paused} trailLength={4} reverse />
          </div>
          <p style={{ margin: '0 0 0.75rem', color: muted, fontSize: '1rem' }}>
            Braille unicode spinners as React decorator components
          </p>
          <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
            <button onClick={() => setPaused(p => !p)} style={{
              padding: '0.3rem 0.9rem', borderRadius: 8,
              border: `1px solid ${cardBorder}`, background: 'transparent',
              color: muted, fontSize: '0.78rem', cursor: 'pointer',
            }}>
              {paused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <a
              href="https://github.com/agilek/cli-loaders"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4em',
                padding: '0.3rem 0.9rem', borderRadius: 8,
                border: `1px solid ${cardBorder}`, background: 'transparent',
                color: muted, fontSize: '0.78rem', textDecoration: 'none',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
              GitHub
            </a>
          </div>

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
                <label style={{
                  position: 'relative',
                  display: 'inline-flex', alignItems: 'center', gap: '0.4em',
                  padding: '0.2rem 0.55rem', borderRadius: 6,
                  border: `1px solid ${!PRESETS.some(p => p.color === color) ? color : cardBorder}`,
                  background: !PRESETS.some(p => p.color === color) ? hex8(color, '22') : 'transparent',
                  color: !PRESETS.some(p => p.color === color) ? color : muted,
                  fontSize: '0.7rem', cursor: 'pointer',
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  Custom
                  <input
                    type="color" value={color}
                    onChange={e => setColor(e.target.value)}
                    style={{ position: 'absolute', inset: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer', border: 'none', padding: 0 }}
                  />
                </label>
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

          </div>

          {/* Spinner picker */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: `1px solid ${cardBorder}` }}>
            <label style={{ display: 'block', fontSize: '0.72rem', color: muted, marginBottom: '0.6rem' }}>Spinner</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {spinnerNames.map(n => {
                const active = spinner === n;
                return (
                  <button
                    key={n}
                    onClick={() => setSpinner(n)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.35em',
                      padding: '0.2rem 0.55rem', borderRadius: 6,
                      border: `1px solid ${active ? color : cardBorder}`,
                      background: active ? hex8(color, '18') : 'transparent',
                      color: active ? color : muted,
                      fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'monospace',
                    }}
                  >
                    <Spinner name={n} color={active ? color : muted} size="0.85em" speed={speed} paused={paused} />
                    {n}
                  </button>
                );
              })}
            </div>
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
                <SpinnerCard key={name} name={name} color={color} size={size} speed={speed} paused={paused} dark={dark} muted={muted} />
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
            <HoverCard style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 10, padding: '1.25rem' }}>
              {(hovered) => (<>
                <CardHeader label="SpinnerInline" color={color} muted={muted} containerHovered={hovered} code={`<SpinnerInline name="${spinner}" color="${color}">\n  Fetching data…\n</SpinnerInline>`} />
                <div style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '3rem' }}>
                  <SpinnerInline name={spinner} color={color} speed={speed} paused={paused}>Fetching data…</SpinnerInline>
                </div>
              </>)}
            </HoverCard>

            {/* SpinnerText */}
            <HoverCard style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 10, padding: '1.25rem' }}>
              {(hovered) => (<>
                <CardHeader label="SpinnerText" color={color} muted={muted} containerHovered={hovered} code={`<SpinnerText name="${spinner}" color="${color}" text="Deploying" bookend />`} />
                <div style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '3rem' }}>
                  <SpinnerText name={spinner} text="Deploying" color={color} speed={speed} paused={paused} bookend />
                </div>
              </>)}
            </HoverCard>

            {/* SpinnerBadge */}
            <HoverCard style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 10, padding: '1.25rem' }}>
              {(hovered) => (<>
                <CardHeader label="SpinnerBadge" color={color} muted={muted} containerHovered={hovered} code={`<SpinnerBadge name="${spinner}" label="Live" color="#ef4444" />`} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', justifyContent: 'center', minHeight: '3rem' }}>
                  <SpinnerBadge name={spinner} label="Live" color="#ef4444" speed={speed} paused={paused} />
                  <SpinnerBadge name={spinner} label="Syncing" color="#38bdf8" speed={speed} paused={paused} />
                  <SpinnerBadge name={spinner} label="Building" color="#f59e0b" speed={speed} paused={paused} />
                  <SpinnerBadge name={spinner} label="Active" color={color} speed={speed} paused={paused} />
                </div>
              </>)}
            </HoverCard>

            {/* SpinnerTrail */}
            <HoverCard style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 10, padding: '1.25rem', overflow: 'hidden' }}>
              {(hovered) => (<>
                <CardHeader label="SpinnerTrail" color={color} muted={muted} containerHovered={hovered} code={`<SpinnerTrail name="${spinner}" color="${color}" size="${size}" trailLength={6} />`} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <SpinnerTrail name={spinner} color={color} size="2rem" speed={speed} paused={paused} trailLength={6} />
                  <SpinnerTrail name={spinner} color={color} size="1.5rem" speed={speed} paused={paused} trailLength={5} />
                  <SpinnerTrail name={spinner} color={color} size="1.25rem" speed={speed} paused={paused} trailLength={4} />
                </div>
              </>)}
            </HoverCard>

            {/* SpinnerOverlay */}
            <HoverCard style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 10, padding: '1.25rem' }}>
              {(hovered) => (<>
                <CardHeader label="SpinnerOverlay" color={color} muted={muted} containerHovered={hovered} code={`<SpinnerOverlay name="${spinner}" color="${color}" active={isLoading}>\n  <YourContent />\n</SpinnerOverlay>`} />
                <SpinnerOverlay
                  name={spinner} color={color} size="2rem" speed={speed}
                  active={loadingOverlay}
                  backdrop={dark ? 'rgba(10,10,15,0.8)' : 'rgba(249,249,251,0.88)'}
                >
                  <div style={{ borderRadius: 8, background: dark ? '#1e1e28' : '#e8e8f0', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {['Dashboard', 'Analytics', 'Reports'].map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: muted }}>
                        <span>{item}</span>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{Math.floor(Math.random() * 900 + 100)}</span>
                      </div>
                    ))}
                  </div>
                </SpinnerOverlay>
                <button
                  onClick={() => { setLoadingOverlay(true); setTimeout(() => setLoadingOverlay(false), 2000); }}
                  disabled={loadingOverlay}
                  style={{
                    marginTop: '0.75rem', width: '100%', padding: '0.4rem',
                    borderRadius: 6, border: `1px solid ${cardBorder}`,
                    background: 'transparent', color: loadingOverlay ? muted : fg,
                    fontSize: '0.78rem', cursor: loadingOverlay ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loadingOverlay ? 'Loading…' : 'Trigger overlay'}
                </button>
              </>)}
            </HoverCard>

            {/* SpinnerButton */}
            <HoverCard style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 10, padding: '1.25rem' }}>
              {(hovered) => (<>
                <CardHeader label="SpinnerButton" color={color} muted={muted} containerHovered={hovered} code={`<SpinnerButton\n  loading={isLoading}\n  onClick={handleClick}\n  spinnerProps={{ name: "${spinner}", color: "${color}" }}\n>\n  Save changes\n</SpinnerButton>`} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <SpinnerButton
                    loading={loadingSave}
                    onClick={triggerSave}
                    spinnerProps={{ name: spinner, color }}
                    style={{
                      padding: '0.5rem 1rem', borderRadius: 8,
                      background: hex8(color, '22'), border: `1px solid ${hex8(color, '55')}`,
                      color, fontSize: '0.85rem', justifyContent: 'center',
                    }}
                  >
                    {loadingSave ? 'Saving…' : 'Save changes'}
                  </SpinnerButton>
                  <SpinnerButton
                    loading={loadingDeploy}
                    onClick={triggerDeploy}
                    spinnerProps={{ name: spinner, color }}
                    style={{
                      padding: '0.5rem 1rem', borderRadius: 8,
                      background: 'transparent', border: `1px solid ${cardBorder}`,
                      color: fg, fontSize: '0.85rem', justifyContent: 'center',
                    }}
                  >
                    {loadingDeploy ? 'Deploying…' : 'Deploy'}
                  </SpinnerButton>
                </div>
              </>)}
            </HoverCard>
          </div>
        </section>

        {/* useSpinner hook demo */}
        <section style={{ maxWidth: 900, margin: '0 auto 3rem' }}>
          <h2 style={{ margin: '0 0 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: muted }}>
            useSpinner hook — custom rendering
          </h2>
          <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 12, padding: '1.5rem', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <HookDemo name={spinner} color={color} speed={speed} />
            <div style={{ flex: 1, minWidth: 0 }}>
            <CodeBlock code={`// Drive any element with the raw frame string
const frame = useSpinner('helix', 1.5);

<h1 style={{ fontFamily: 'monospace', color: '#00ff99' }}>
  {frame}
</h1>`} />
            </div>
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
