import { $ } from '../components/util';
import { mountPlayer, type PlayerOpts, type PlayerHandle } from '../components/player';
import { bySlug, caseUrl, posterUrl, type Project } from '../data/projects';
import { SHOWREEL } from '../data/showreel';

const dialog = () => $<HTMLDialogElement>('#player')!;
let handle: PlayerHandle | null = null;

export interface PlayerPayload { title: string; meta: string; ratio: '16:9' | '9:16'; hue: number; seed: string; duration: number; src?: string; poster?: string; caseHref?: string }

export function openPlayer(p: PlayerPayload): void {
  const d = dialog(), stage = $('#player-stage', d)!;
  const tall = p.ratio === '9:16';
  stage.className = `mx-auto overflow-hidden rounded-[3px] border border-white/10 bg-black ${tall ? 'aspect-[9/16] h-[min(76svh,740px)]' : 'aspect-video w-full'}`;
  handle?.destroy();
  const o: PlayerOpts = { title: p.title, ratio: p.ratio, hue: p.hue, seed: p.seed, duration: p.duration, src: p.src, poster: p.poster, autoplay: true, muted: false };
  handle = mountPlayer(stage, o);
  $('#player-title', d)!.textContent = p.title;
  $('#player-meta', d)!.textContent = `${p.meta} · ${p.ratio}`;
  const link = $<HTMLAnchorElement>('#player-case', d)!;
  link.classList.toggle('hidden', !p.caseHref); link.classList.toggle('sm:inline-flex', !!p.caseHref);
  if (p.caseHref) link.href = p.caseHref;
  d.showModal();
  document.documentElement.style.overflow = 'hidden';
  $<HTMLElement>('.cine', stage)?.focus();
}

export const openProject = (p: Project) => openPlayer({ title: p.title, meta: p.niche, ratio: p.ratio, hue: p.hue, seed: p.slug, duration: Math.min(p.duration, 90), src: p.video.src, poster: posterUrl(p), caseHref: caseUrl(p) });
export const openReel = () => openPlayer({ title: SHOWREEL.title, meta: 'Showreel · 60 sec', ratio: '16:9', hue: 12, seed: 'showreel', duration: SHOWREEL.duration, src: SHOWREEL.src || undefined, poster: SHOWREEL.poster || undefined });

export function initModal(): void {
  const d = dialog();
  const close = () => d.close();
  $('[data-close-player]', d)!.addEventListener('click', close);
  d.addEventListener('click', (e) => { if (e.target === d) close(); });
  d.addEventListener('close', () => { handle?.destroy(); handle = null; document.documentElement.style.overflow = ''; });
  // delegated triggers: reel buttons and quick-view buttons work on every page
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('[data-open-reel]')) { openReel(); return; }
    const q = t.closest<HTMLElement>('[data-quick]');
    if (q) { const p = bySlug(q.dataset.quick!); if (p) openProject(p); }
  });
}
