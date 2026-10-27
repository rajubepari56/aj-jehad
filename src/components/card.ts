import { $$, clamp, esc, reducedMotion, timecode } from './util';
import { sceneLayers } from './scenes';
import { CATEGORY_LABEL, caseUrl, driveId, posterUrl, type Project } from '../data/projects';

const CELLS = 12;
const PLAYING = new Set<HTMLVideoElement>();
const arrow = '<svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';

/** Editorial project card. Reserved aspect ratio means zero layout shift; media mounts lazily. */
export function projectCard(p: Project, cls = '', meta = true): string {
  const tall = p.ratio === '9:16';
  return `
  <article class="pcard group ${tall ? 'pcard-tall' : ''} ${cls}" data-reveal data-project="${p.slug}" data-dur="${p.duration}">
    <a href="${caseUrl(p)}" class="block">
      <div class="pframe curtain relative overflow-hidden rounded-[3px] bg-char ${tall ? 'aspect-[9/16]' : 'aspect-video'}" data-curtain style="--h:${p.hue}">
        <div class="pmedia absolute inset-0 monitor" data-preview="${esc(p.video.preview ?? '')}">${sceneLayers(p.slug, p.hue)}${posterUrl(p) ? `<img src="${esc(posterUrl(p)!)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" class="poster-img absolute inset-0 z-[2] h-full w-full object-cover opacity-0 transition-opacity duration-300" onload="this.style.opacity=1" onerror="this.remove()" />` : ''}</div>
        <i class="lb top-0 !z-[3]"></i><i class="lb bottom-0 !z-[3]"></i>
        <span aria-hidden="true" class="label absolute left-3 top-3 z-[4] flex items-center gap-1.5 text-white/75"><i class="rec-dot h-1.5 w-1.5 rounded-full bg-ember"></i>${p.ratio}</span>
        <span aria-hidden="true" class="label absolute right-3 top-3 z-[4] rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[10px] text-white/70 backdrop-blur">${p.platform}</span>
        <span class="play-ring"><svg viewBox="0 0 24 24" class="ml-0.5 h-5 w-5 text-white transition-colors" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg></span>
        <div class="film absolute inset-x-3 bottom-8 z-[4] flex gap-[3px]" aria-hidden="true">${Array.from({ length: CELLS }, () => '<i></i>').join('')}</div>
        <span aria-hidden="true" class="label absolute bottom-3 left-3 z-[4] text-white/80" data-tc>00:00:00:00</span>
        <span class="scrub"><i></i><b></b></span>
        <span class="pedge" aria-hidden="true"></span>
      </div>
      ${meta ? `<div class="mt-4 flex items-start justify-between gap-4">
        <div><h3 class="font-display text-lg font-semibold leading-tight tracking-tight text-white sm:text-xl">${esc(p.title)}</h3>
        <p class="label mt-1.5"><span class="sr-only">Case study. </span>${esc(p.niche)}${p.sample ? ' · Sample' : ''}</p></div>
        <span class="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/15 text-ash transition-[transform,border-color,color] duration-200 ease-micro group-hover:border-ember group-hover:text-ember group-hover:-rotate-45">${arrow}</span>
      </div>` : ''}
    </a>
    <button type="button" data-quick="${p.slug}" class="qbtn label z-10 rounded-full border border-white/20 bg-black/55 px-3 py-1.5 text-white backdrop-blur hover:border-ember hover:text-ember" aria-label="Quick view ${esc(p.title)}">▶ Quick view</button>
    ${meta ? `<div class="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
      <button type="button" data-quick="${p.slug}" class="label u-link !text-white">▶ Watch now<span class="sr-only"> : ${esc(p.title)}</span></button>
      ${p.video.src ? `<a href="${esc(driveId(p.video.src) ? `https://drive.google.com/file/d/${driveId(p.video.src)}/view` : p.video.src)}" target="_blank" rel="noopener noreferrer" class="label u-link !text-ash hover:!text-white">Open video ↗<span class="sr-only"> : ${esc(p.title)} (opens in a new tab)</span></a>` : ''}
    </div>` : ''}
  </article>`;
}

export const filterLabel = (c: string) => (c === 'all' ? 'All' : CATEGORY_LABEL[c as keyof typeof CATEGORY_LABEL]);

/** Hover physics: filmstrip scrub, lazy preview loops, subtle tilt on 9:16. All transform/opacity. */
export function initCards(root: ParentNode = document): void {
  const fine = matchMedia('(pointer: fine)').matches, still = reducedMotion();
  $$('.pcard', root).forEach((card) => {
    if (card.dataset.ready) return; card.dataset.ready = '1';
    const frame = card.querySelector<HTMLElement>('.pframe')!, tc = card.querySelector<HTMLElement>('[data-tc]')!;
    const dur = Number(card.dataset.dur), layers = Array.from(card.querySelectorAll<HTMLElement>('.scene')), cells = Array.from(card.querySelectorAll<HTMLElement>('.film i'));
    const media = card.querySelector<HTMLElement>('.pmedia')!;
    let scene = 0, cell = -1, video: HTMLVideoElement | null = null;

    // Autoplay: while a card is on screen its muted loop plays (max 3 at once to save bandwidth); off-screen it pauses.
    const mountPreview = () => {
      const src = media.dataset.preview; if (!src || video) return;
      video = document.createElement('video');
      Object.assign(video, { muted: true, loop: true, playsInline: true, autoplay: true, preload: 'metadata', src });
      video.className = 'absolute inset-0 z-[2] h-full w-full object-cover opacity-0 transition-opacity duration-300';
      video.addEventListener('error', () => { video?.remove(); video = null; media.dataset.preview = ''; });
      media.appendChild(video);
    };
    const playVideo = () => {
      if (!video) return;
      for (const v of [...PLAYING]) if (PLAYING.size >= 3 && v !== video) { v.pause(); PLAYING.delete(v); }
      void video.play().then(() => { video!.style.opacity = '1'; PLAYING.add(video!); }).catch(() => undefined);
    };
    const setP = (p: number) => {
      frame.style.setProperty('--p', p.toFixed(4)); tc.textContent = timecode(p * dur);
      const s = Math.min(2, Math.floor(p * 3)); if (s !== scene) { scene = s; layers.forEach((l, i) => l.classList.toggle('on', i === s)); }
      const c = Math.min(CELLS - 1, Math.floor(p * CELLS)); if (c !== cell) { cells[cell]?.classList.remove('on'); cells[c].classList.add('on'); cell = c; }
    };
    frame.addEventListener('pointerenter', (e) => { if (e.pointerType === 'touch') return; media.classList.add('playing'); });
    frame.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const r = frame.getBoundingClientRect(); setP(clamp((e.clientX - r.left) / r.width));
    });
    frame.addEventListener('pointerleave', () => { media.classList.remove('playing'); setP(0); });
    card.addEventListener('focusin', () => { media.classList.add('playing'); });
    card.addEventListener('focusout', () => media.classList.remove('playing'));
    new IntersectionObserver(([en]) => { // every device: play what is visible, pause what is not
      media.classList.toggle('playing', en.isIntersecting);
      if (en.isIntersecting) { mountPreview(); playVideo(); } else if (video) { video.pause(); PLAYING.delete(video); }
    }, { threshold: 0.5 }).observe(frame);
    setP(0);

    if (fine && !still && card.classList.contains('pcard-tall')) { // 2.5D tilt
      let rx = 0, ry = 0, tx = 0, ty = 0, raf = 0;
      const step = () => { rx += (tx - rx) * 0.16; ry += (ty - ry) * 0.16; frame.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`; raf = Math.abs(tx - rx) + Math.abs(ty - ry) > 0.02 ? requestAnimationFrame(step) : 0; };
      frame.addEventListener('pointermove', (e) => { const r = frame.getBoundingClientRect(); ty = ((e.clientX - r.left) / r.width - 0.5) * 7; tx = -((e.clientY - r.top) / r.height - 0.5) * 7; if (!raf) raf = requestAnimationFrame(step); });
      frame.addEventListener('pointerleave', () => { tx = ty = 0; if (!raf) raf = requestAnimationFrame(step); });
    }
  });
}
