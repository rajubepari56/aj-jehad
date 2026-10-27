import { ruler, trackRow, type TrackDef } from './timeline';
import { sceneLayers } from './scenes';

const arrow = '<svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';

interface Card { id: string; cls: string; n: string; title: string; body: string; focus: string; tags: string[]; formId: string; cat: string; preview: string; layout: 'row' | 'col' | 'split' }

const SLUG: Record<string, string> = { gaming: 'gaming-edits', shorts: 'viral-shorts', motion: '3d-motion-graphics', long: 'youtube-pacing', sound: 'sound-design', pack: 'channel-packaging' };
const cta = (c: Card) => `<div class="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
  <a href="/contact?service=${c.formId}" class="bento-cta group/cta inline-flex items-center gap-2 font-display text-[15px] font-semibold tracking-tight text-white">
    <span class="u-link">Start this project<span class="sr-only"> for ${c.title}</span></span><span class="grid h-8 w-8 place-items-center rounded-full border border-white/20 transition-[transform,background-color,color,border-color] duration-200 ease-micro group-hover/cta:-rotate-45 group-hover/cta:border-ember group-hover/cta:bg-ember group-hover/cta:text-obs">${arrow}</span></a>
  <a href="/services/${SLUG[c.id]}" class="u-link label !text-ash hover:!text-white">Service details</a><a href="/case-studies?cat=${c.cat}" class="u-link label !text-ash hover:!text-white">Related work</a></div>`;

const tags = (t: string[]) => `<ul class="mt-4 flex flex-wrap gap-1.5">${t.map((x) => `<li class="label rounded-full border border-white/10 px-2.5 py-1 text-[10px]">${x}</li>`).join('')}</ul>`;

const GP_TRACKS: TrackDef[] = [
  { id: 'V1', kind: 'video', clips: [[0, 8, 'GAMEPLAY'], [8.4, 14, 'FACECAM'], [14.4, 24, 'STORY']] },
  { id: 'FX', kind: 'motion', clips: [[2, 6, 'PUNCH-IN'], [10, 13, 'ZOOM'], [17, 22, 'CAPTIONS']] },
  { id: 'A1', kind: 'sfx', clips: [[1, 5, 'SFX'], [7, 12, 'IMPACT'], [15, 21, 'RISER']] },
];

const previews: Record<string, () => string> = {
  gaming: () => `<div class="gp" data-gaming>
    <div class="monitor relative aspect-video overflow-hidden rounded-md border border-white/10 bg-black">${sceneLayers('gaming-card', 12)}<p class="cap" aria-hidden="true"><span style="--k:0">NO</span> <span style="--k:1">WAY</span></p>
      <span class="label absolute left-3 top-3 z-[4] flex items-center gap-1.5 text-white/80"><i class="rec-dot h-1.5 w-1.5 rounded-full bg-ember"></i>Hover to scrub</span><span data-tc class="label absolute bottom-2.5 right-3 z-[4] text-ember">00:00:00:00</span></div>
    <div class="gp-tl relative mt-3 cursor-ew-resize touch-pan-y rounded-md bg-black/30 p-2"><div class="relative ml-9 h-5 border-b border-white/10">${ruler(24, 6)}</div>
      <div class="mt-2 space-y-1.5">${GP_TRACKS.map((t, i) => trackRow(t, i, 24)).join('')}</div>
      <div class="gp-lane pointer-events-none absolute inset-y-2 left-11 right-2 overflow-hidden"><div class="gp-ph absolute inset-0 border-r border-ember shadow-[8px_0_14px_-6px_rgb(255_59_31/0.7)]"></div></div></div></div>`,
  shorts: () => `<div class="phone relative mx-auto aspect-[9/16] w-[66%] max-w-[250px] overflow-hidden rounded-[1.5rem] border border-white/20 bg-black shadow-2xl">
    <div class="monitor playing absolute inset-0">${sceneLayers('shorts-card', 300).split('</div>')[0]}</div></div>
    <span class="hook-bar absolute left-3 right-3 top-3 z-[4] h-[3px] origin-left bg-ember"></span>
    <span class="label absolute left-4 top-6 z-[4] text-[9px] text-white/80">Hook · 0–1s</span>
    <div class="ks absolute inset-x-0 top-[44%] z-[4] text-center font-display text-[1.7rem] font-extrabold uppercase leading-none tracking-tight text-white" aria-hidden="true">${['THIS', 'CHANGES', 'EVERYTHING', 'WAIT…'].map((w, i) => `<span style="--i:${i}">${w}</span>`).join('')}</div>
    <div class="absolute bottom-3 left-3 right-3 z-[4] space-y-1"><i class="block h-1.5 w-3/4 rounded-full bg-white/70"></i><i class="block h-1.5 w-1/2 rounded-full bg-white/30"></i></div></div>`,
  motion: () => `<div class="wf relative mx-auto grid h-[8.5rem] w-[8.5rem] place-items-center" aria-hidden="true"><div class="wf-cube"><i class="f f1"></i><i class="f f2"></i><i class="f f3"></i><i class="f f4"></i><i class="f f5"></i><i class="f f6"></i></div>
    <svg viewBox="0 0 160 160" class="absolute inset-0 h-full w-full"><ellipse cx="80" cy="96" rx="70" ry="22" fill="none" stroke="rgb(92 225 255 / .35)" stroke-dasharray="3 5"/><circle cx="150" cy="96" r="3" fill="#5ce1ff"/></svg>
    <span class="label absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] text-scope">CAM_01 · orbit</span></div>`,
  long: () => `<div class="lf relative" aria-hidden="true"><svg viewBox="0 0 300 84" class="w-full" fill="none"><path d="M0 70H300M0 42H300" stroke="rgb(255 255 255 / .06)"/>
    <path d="M0 8C30 10 40 30 70 34S110 30 140 40 190 38 220 44 270 40 300 46" stroke="#5ce1ff" stroke-width="1.6"/>
    <g fill="#ff3b1f"><path d="M70 28l5 6-5 6-5-6z"/><path d="M140 34l5 6-5 6-5-6z"/><path d="M220 38l5 6-5 6-5-6z"/></g></svg>
    <span class="lf-cover absolute inset-0 origin-right bg-[#121216]"></span>
    <div class="mt-3 grid grid-cols-3 gap-1.5">${['CAM A', 'CAM B', 'CAM C'].map((c, i) => `<div class="relative h-4 overflow-hidden rounded-[2px] border border-white/10 bg-white/[0.04]"><span class="label absolute left-1.5 top-1/2 -translate-y-1/2 text-[8px]">${c}</span><i class="absolute inset-y-0 w-px bg-ember" style="left:${30 + i * 5}%"></i></div>`).join('')}</div></div>`,
  sound: () => `<div class="eq flex h-24 items-end justify-between gap-[3px]" aria-hidden="true">${Array.from({ length: 34 }, (_, i) => `<i style="--t:${(0.5 + ((i * 37) % 10) / 14).toFixed(2)}s;--o:${(-((i * 13) % 10) / 10).toFixed(2)}s;height:${28 + Math.round(Math.abs(Math.sin(i / 2.6)) * 72)}%"></i>`).join('')}</div>
    <div class="mt-4 flex flex-wrap gap-1.5" aria-hidden="true">${['Foley', 'SFX layers', 'Ducking', 'VO master'].map((t) => `<span class="label rounded-full border border-white/10 px-2.5 py-1 text-[9px]">${t}</span>`).join('')}</div>`,
  pack: () => `<div class="pk monitor playing relative aspect-video overflow-hidden rounded-md border border-white/10 bg-black" aria-hidden="true">${sceneLayers('pack-card', 175).split('</div>')[0]}</div>
    <div class="pk-cam absolute right-3 top-3 z-[4] h-12 w-16 rounded border border-white/40 bg-black/40"></div>
    <div class="pk-l3 absolute bottom-3 left-0 z-[4] flex items-center gap-2 bg-black/70 py-1.5 pl-3 pr-4 backdrop-blur"><i class="h-5 w-0.5 bg-ember"></i><span><b class="block font-display text-[11px] leading-tight text-white">CREATOR NAME</b><span class="label text-[8px]">Live now</span></span></div>
    <div class="pk-alert absolute left-3 top-3 z-[4] rounded-full border border-white/20 bg-black/60 px-2.5 py-1 label text-[9px] text-white">New follower</div></div>`,
};

const CARDS: Card[] = [
  { id: 'gaming', cls: 'md:col-span-2 lg:col-span-8 lg:row-span-3', n: '01', title: 'High-Retention Gaming Edits', body: 'Roblox, Minecraft and story-driven series cut with fast pacing, sound-led narrative and dynamic punch-ins that keep every beat earning the next.', focus: 'Hook-first openings and first-30-second retention', tags: ['Roblox', 'Minecraft', 'Fast pacing', 'Punch-ins', 'Sound-driven'], formId: 'gaming', cat: 'gaming', preview: 'gaming', layout: 'split' },
  { id: 'shorts', cls: 'md:row-span-2 lg:col-span-4 lg:row-span-5', n: '02', title: 'Viral Short-Form Content', body: 'Vertical-first TikTok, Shorts and Reels with kinetic subtitles and a retention hook inside the first second.', focus: 'Swipe-away rate and replays', tags: ['TikTok', 'Shorts', 'Reels', 'Kinetic subtitles'], formId: 'shorts', cat: 'shorts', preview: 'shorts', layout: 'col' },
  { id: 'motion', cls: 'lg:col-span-4 lg:row-span-2', n: '03', title: '2D / 3D Motion Graphics', body: 'Blender camera sweeps, kinetic typography and 3D product staging.', focus: 'Brand recall', tags: ['Blender', 'After Effects'], formId: 'motion', cat: 'motion', preview: 'motion', layout: 'row' },
  { id: 'long', cls: 'lg:col-span-4 lg:row-span-2', n: '04', title: 'Long-Form YouTube', body: 'Pacing architecture, narrative hooks and multi-cam sync with a retention-first flow.', focus: 'Average view duration', tags: ['Pacing', 'Multi-cam', 'Narrative'], formId: 'longform', cat: 'long', preview: 'long', layout: 'col' },
  { id: 'sound', cls: 'lg:col-span-4 lg:row-span-3', n: '05', title: 'Sound Design & Audio', body: 'Custom foley, punchy SFX layering, rhythmic music ducking and voice mastering.', focus: 'Perceived production value', tags: [], formId: 'longform', cat: 'gaming', preview: 'sound', layout: 'col' },
  { id: 'pack', cls: 'lg:col-span-4 lg:row-span-3', n: '06', title: 'Channel Packaging & Brand Assets', body: 'Stream overlays, intros and stingers, lower-thirds and click-worthy thumbnails.', focus: 'Consistent channel identity', tags: [], formId: 'motion', cat: 'motion', preview: 'pack', layout: 'col' },
];

function render(c: Card): string {
  const head = `<span class="label text-ember">${c.n}${c.id === 'gaming' ? ' · Featured' : ''}</span>
    <h3 class="mt-3 font-display ${c.id === 'gaming' ? 'text-[clamp(1.75rem,3vw,2.6rem)]' : 'text-xl sm:text-2xl'} font-semibold leading-[1.05] tracking-[-0.03em] text-white">${c.title}</h3>
    <p class="mt-3 max-w-md text-[15px] leading-relaxed text-ash">${c.body}</p>`;
  const focus = `<p class="label mt-4 flex items-center gap-2 normal-case tracking-normal"><i class="h-1.5 w-1.5 rotate-45 bg-ember"></i><span class="text-white/80">Focus: ${c.focus}</span></p>`;
  const body = c.layout === 'split'
    ? `<div class="flex h-full flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-stretch"><div class="flex flex-1 flex-col">${head}${tags(c.tags)}${focus}<div class="mt-auto pt-2">${cta(c)}</div></div><div class="flex flex-col justify-center lg:w-[55%]">${previews[c.preview]()}</div></div>`
    : c.layout === 'row'
      ? `<div class="flex h-full flex-col gap-4 p-6 lg:flex-row lg:items-center">${`<div class="flex flex-1 flex-col">${head}${focus}<div class="mt-auto pt-1">${cta(c)}</div></div>`}<div class="relative shrink-0 self-center lg:w-40">${previews[c.preview]()}</div></div>`
      : c.id === 'shorts'
        ? `<div class="flex h-full flex-col p-6 sm:p-8"><div class="relative flex flex-1 items-center justify-center pb-6 pt-2">${previews.shorts()}<div class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#121216] to-transparent"></div></div>${head}${tags(c.tags)}${focus}${cta(c)}</div>`
        : `<div class="flex h-full flex-col p-6 ${c.id === 'long' ? '' : 'sm:p-7'}"><div class="relative mb-5 ${c.id === 'pack' ? 'relative' : ''}">${previews[c.preview]()}</div>${head}${c.id === 'long' || c.id === 'sound' || c.id === 'pack' ? focus : ''}<div class="mt-auto">${cta(c)}</div></div>`;
  return `<article class="bento group relative min-h-[22rem] overflow-hidden rounded-2xl border border-white/10 bg-[#121216] ${c.cls}" data-bento="${c.id}" data-reveal>
    <i class="spot-el" aria-hidden="true"></i><div class="microgrid pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,#000,transparent_70%)]" aria-hidden="true"></div><span class="bento-edge" aria-hidden="true"></span>
    <div class="relative z-[1] h-full">${body}</div></article>`;
}

const ctaCard = `<article class="bento group relative overflow-hidden rounded-2xl border border-dashed border-white/15 bg-[#121216] md:col-span-2 lg:col-span-4 lg:row-span-3" data-bento="cta" data-reveal>
  <i class="spot-el" aria-hidden="true"></i><div class="relative z-[1] flex h-full min-h-[18rem] flex-col justify-between p-6 sm:p-8"><span class="label text-ember">Custom scope</span>
  <div><h3 class="font-display text-[clamp(1.6rem,2.6vw,2.3rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-white">Not sure which fits? Let's map it on a call.</h3>
  <p class="mt-3 max-w-xs text-[15px] leading-relaxed text-ash">Most channels need a mix. Tell me where retention drops and I'll scope the right edit, sound and motion package.</p></div>
  <a href="/contact" class="btn btn-primary self-start" data-mag-auto="0.25"><span>Book a discovery call</span><span aria-hidden="true">→</span></a></div></article>`;

export const bentoHtml = () => CARDS.map(render).join('') + ctaCard;
