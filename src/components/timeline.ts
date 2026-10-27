import { timecode } from './util';

export const rnd = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
export const hashSeed = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 2147483647, 7) || 1;

export type Kind = 'motion' | 'video' | 'sfx' | 'music' | 'fx' | 'dialog';
export const KIND: Record<Kind, string> = {
  motion: 'border-scope/50 bg-scope/15 text-scope',
  fx: 'border-white/25 bg-white/[0.09] text-white/80',
  video: 'border-white/20 bg-white/[0.07] text-white/70',
  dialog: 'border-white/15 bg-white/[0.05] text-white/60',
  sfx: 'border-ember/40 bg-ember/10 text-ember',
  music: 'border-white/10 bg-white/[0.03] text-white/40',
};

export const wave = (seed: number) => {
  const r = rnd(seed);
  let d = 'M0 12';
  for (let x = 0; x <= 200; x += 2) d += ` L${x} ${12 - (r() * 0.8 + 0.1) * 10 * Math.abs(Math.sin(x / 9 + seed))}`;
  for (let x = 200; x >= 0; x -= 2) d += ` L${x} ${12 + (r() * 0.8 + 0.1) * 10 * Math.abs(Math.sin(x / 9 + seed))}`;
  return `<svg viewBox="0 0 200 24" preserveAspectRatio="none" class="absolute inset-0 h-full w-full" aria-hidden="true"><path d="${d}Z" fill="currentColor" opacity=".55"/></svg>`;
};

export const ruler = (len: number, step = 5) =>
  Array.from({ length: Math.floor(len / step) + 1 }, (_, i) =>
    `<span class="absolute top-0 flex h-full -translate-x-px flex-col justify-between border-l border-white/15 pl-1.5 pt-1 font-mono text-[9px] text-ash" style="left:${((i * step) / len) * 100}%">${timecode(i * step).slice(3, 8)}</span>`).join('');

export interface TrackDef { id: string; kind: Kind; clips: [number, number, string][] }
export const trackRow = (t: TrackDef, ti: number, len: number, seq = false) => `
  <div class="flex items-stretch gap-2">
    <span class="grid w-7 shrink-0 place-items-center rounded-sm bg-white/[0.04] font-mono text-[9px] text-ash">${t.id}</span>
    <div class="relative h-6 flex-1 sm:h-7">
      ${t.clips.map(([a, b, name], ci) => `<div class="tl-clip absolute top-0 h-full overflow-hidden rounded-[3px] border ${KIND[t.kind]}" style="left:${(a / len) * 100}%;width:${((b - a) / len) * 100}%;--i:${seq ? ti * 3 + ci : 0}">
        ${t.kind === 'sfx' || t.kind === 'music' || t.kind === 'dialog' ? wave(ti * 10 + ci + 3) : ''}
        <span class="absolute left-1.5 top-1/2 -translate-y-1/2 truncate font-mono text-[8px] tracking-wider">${name}</span>
        ${t.kind === 'motion' ? '<i class="absolute right-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rotate-45 bg-scope"></i>' : ''}
      </div>`).join('')}
    </div>
  </div>`;
