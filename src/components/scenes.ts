import { hashSeed, rnd } from './timeline';

/** Lightweight SVG "gameplay frame": horizon, perspective floor, isometric blocks. */
export const cube = (x: number, y: number, s: number) => {
  const w = s * 0.87, h = s * 0.5, p = (a: number[][]) => a.map((q) => q.map((n) => n.toFixed(1)).join(',')).join(' ');
  return `<polygon points="${p([[x, y - s], [x + w, y - h], [x, y], [x - w, y - h]])}" fill="currentColor" opacity=".95"/>
    <polygon points="${p([[x - w, y - h], [x, y], [x, y + s], [x - w, y + h]])}" fill="currentColor" opacity=".5"/>
    <polygon points="${p([[x, y], [x + w, y - h], [x + w, y + h], [x, y + s]])}" fill="currentColor" opacity=".28"/>`;
};

export const sceneSvg = (cubes: number[][]) => {
  const rows = Array.from({ length: 7 }, (_, i) => `<line x1="-20" x2="180" y1="${46 + (i + 1) ** 2 * 0.9}" y2="${46 + (i + 1) ** 2 * 0.9}" opacity="${0.32 - i * 0.03}"/>`).join('');
  const cols = Array.from({ length: 15 }, (_, i) => `<line x1="80" y1="46" x2="${-80 + i * 22}" y2="96" opacity=".2"/>`).join('');
  return `<svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <circle cx="80" cy="46" r="26" fill="currentColor" opacity=".13"/><circle cx="80" cy="46" r="11" fill="currentColor" opacity=".25"/>
    <g stroke="currentColor" stroke-width=".35">${rows}${cols}</g>
    <line x1="0" x2="160" y1="46" y2="46" stroke="currentColor" stroke-width=".5" opacity=".6"/>
    ${[...cubes].sort((a, b) => a[1] - b[1]).map(([x, y, s]) => cube(x, y, s)).join('')}</svg>`;
};

/** Deterministic block layouts for a seed so every project has its own frame. */
export const cubesFor = (seed: string, variant: number): number[][] => {
  const r = rnd(hashSeed(seed) + variant * 977);
  return Array.from({ length: 4 }, () => [24 + r() * 112, 44 + r() * 26, 6 + r() * 9]);
};

/** Three crossfading scene layers (scrub target for cards, players, before/after). */
export const sceneLayers = (seed: string, hue: number, on = 0) =>
  [0, 1, 2].map((i) => `<div class="scene${i === on ? ' on' : ''}" style="--h:${(hue + (i - 1) * 28 + 360) % 360}">${sceneSvg(cubesFor(seed, i))}</div>`).join('');
