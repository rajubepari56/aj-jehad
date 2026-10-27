import { hashSeed, rnd, ruler, trackRow, type TrackDef } from './timeline';
import type { Project } from '../data/projects';

const LEN = 60;
/** Editing-architecture snapshot: representative track structure, generated per project. */
export function architectureHtml(p: Project): string {
  const r = rnd(hashSeed(p.slug));
  const span = (n: number, min: number, max: number, name: string): [number, number, string][] => {
    const out: [number, number, string][] = []; let t = r() * 2;
    for (let i = 0; i < n && t < LEN - 3; i++) { const l = min + r() * (max - min); out.push([t, Math.min(LEN, t + l), name]); t += l + 0.4 + r() * 3; }
    return out;
  };
  const cuts: [number, number, string][] = []; let t = 0, i = 1;
  while (t < LEN - 2) { const l = 1.5 + r() * 5; cuts.push([t, Math.min(LEN, t + l - 0.15), `CUT_${String(i++).padStart(2, '0')}`]); t += l; }
  const tracks: TrackDef[] = [
    { id: 'V3', kind: 'motion', clips: span(4, 5, 10, 'KINETIC_TYPE') },
    { id: 'V2', kind: 'fx', clips: span(5, 3, 8, 'FX / PUNCH-IN') },
    { id: 'V1', kind: 'video', clips: cuts },
    { id: 'A1', kind: 'dialog', clips: [[0, LEN, 'DIALOGUE / VO']] },
    { id: 'A2', kind: 'sfx', clips: span(7, 2, 5, 'SFX LAYER') },
    { id: 'A3', kind: 'sfx', clips: span(5, 3, 7, 'FOLEY') },
    { id: 'A4', kind: 'music', clips: [[0, LEN, 'MUSIC BED · DUCKED']] },
  ];
  return `
  <div class="arch glass overflow-hidden rounded-xl p-3 sm:p-5" data-arch>
    <div class="mb-3 flex flex-wrap items-center justify-between gap-2 px-1"><span class="label">Edit architecture · ${p.sample ? 'illustrative' : 'project'}</span><span class="label">${cuts.length} cuts · 7 tracks</span></div>
    <div class="rounded-md bg-black/30 p-2">
      <div class="relative ml-9 h-6 border-b border-white/10">${ruler(LEN, 10)}</div>
      <div class="mt-2 space-y-1.5">${tracks.map((tr, ti) => trackRow(tr, ti, LEN, true)).join('')}</div>
    </div>
    <ul class="mt-4 grid gap-x-6 gap-y-2 px-1 sm:grid-cols-2 lg:grid-cols-4" aria-label="Legend">
      ${[['Pacing cuts', 'V1 · rhythm set by the curve'], ['Motion & type', 'V3 · kinetic layers'], ['Sound staging', 'A2–A3 · SFX & foley'], ['Ducking', 'A4 · music breathes under VO']].map(([a, b]) => `<li><span class="font-display text-sm font-semibold text-white">${a}</span><span class="label block pt-0.5 normal-case tracking-normal">${b}</span></li>`).join('')}
    </ul>
  </div>`;
}
