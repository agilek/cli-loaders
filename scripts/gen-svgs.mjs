#!/usr/bin/env node
/**
 * Generates one animated SVG tile per spinner → assets/spinners/<name>.svg
 * Run after building: npm run build && npm run gen:svgs
 */

import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distPath = resolve(__dirname, '../dist/cli-loaders.js');

let spinners, spinnerNames;
try {
  ({ spinners, spinnerNames } = await import(distPath));
} catch {
  console.error('❌  dist not found — run `npm run build` first');
  process.exit(1);
}

const OUT = resolve(__dirname, '../assets/spinners');
mkdirSync(OUT, { recursive: true });

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

for (const name of spinnerNames) {
  const { frames, interval } = spinners[name];
  const N = frames.length;
  const D = N * interval; // total cycle ms

  // SVG dimensions
  const maxLen = Math.max(...frames.map(f => [...f].length)); // unicode-safe
  const fontSize = 22;
  const W = Math.max(96, maxLen * 14 + 32);
  const H = 84;
  const cx = (W / 2).toFixed(1);

  // Keyframe: visible for 1/N of the cycle, then hidden
  // Two keyframes very close together = hard cut (no interpolation artifact)
  const pctOn  = (100 / N - 0.001).toFixed(3);
  const pctOff = (100 / N).toFixed(3);

  const css = [
    `@keyframes s{0%,${pctOn}%{opacity:1}${pctOff}%,100%{opacity:0}}`,
    ...frames.map((_, i) =>
      `.f${i}{animation:s ${D}ms linear infinite;animation-delay:${-(i * interval)}ms}`
    ),
  ].join('');

  const frameEls = frames
    .map((f, i) =>
      `<text x="${cx}" y="40" text-anchor="middle" dominant-baseline="middle" ` +
      `class="f${i}" font-size="${fontSize}" fill="#00ff99" ` +
      `font-family="'Courier New',monospace">${escapeXml(f)}</text>`
    )
    .join('\n');

  const svg =
`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
<style>${css}</style>
<rect width="${W}" height="${H}" fill="#14141a" rx="10"/>
${frameEls}
<text x="${cx}" y="${H - 12}" text-anchor="middle" font-size="9" fill="#444"
  font-family="'Courier New',monospace">${name}</text>
</svg>`;

  writeFileSync(`${OUT}/${name}.svg`, svg, 'utf8');
  console.log(`  ✓  ${name.padEnd(14)} ${N} frames × ${interval}ms = ${D}ms`);
}

console.log(`\n→ ${spinnerNames.length} SVGs written to assets/spinners/`);
