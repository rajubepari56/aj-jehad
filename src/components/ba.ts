import { clamp, esc, reducedMotion } from './util';
import { sceneSvg, cubesFor } from './scenes';

/**
 * Raw vs Final slider. Transform-only: the "after" layer sits in a clip that translates with the
 * divider while its content counter-translates, so nothing reflows and nothing jitters.
 */
export function beforeAfterHtml(seed: string, hue: number): string {
  const cubes = cubesFor(seed, 1);
  return `
  <div class="ba relative aspect-video w-full select-none overflow-hidden rounded-md border border-white/10 bg-black touch-pan-y" data-ba>
    <div class="absolute inset-0 grayscale-[0.9] brightness-[0.72] contrast-[0.9]" style="--h:${hue};color:hsl(${hue} 10% 60%)">
      <div class="scene on" style="--h:${hue}">${sceneSvg(cubes)}</div>
      <div class="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0,transparent_3px,rgb(0_0_0/.14)_3px,rgb(0_0_0/.14)_4px)]"></div>
    </div>
    <span class="label absolute left-3 top-3 z-[3] rounded bg-black/55 px-2.5 py-1.5 text-white/80 backdrop-blur">Raw footage</span>
    <div class="ba-clip absolute inset-0 overflow-hidden will-change-transform">
      <div class="ba-after absolute inset-0 will-change-transform">
        <div class="monitor playing absolute inset-0"><div class="scene on" style="--h:${hue}">${sceneSvg(cubes)}</div></div>
        <p class="cap" aria-hidden="true"><span style="--k:0">NO</span> <span style="--k:1">WAY</span></p>
        <span class="label absolute right-3 top-3 z-[3] rounded bg-ember px-2.5 py-1.5 text-obs">Final edit</span>
      </div>
    </div>
    <div class="ba-line pointer-events-none absolute inset-y-0 left-0 z-[4] w-px bg-white will-change-transform"></div>
    <button type="button" class="ba-handle absolute left-0 top-1/2 z-[5] -ml-5 -mt-5 grid h-10 w-10 cursor-ew-resize place-items-center rounded-full border border-white/40 bg-black/60 text-white backdrop-blur will-change-transform transition-colors duration-200 ease-micro hover:border-ember hover:bg-ember hover:text-obs" role="slider" aria-label="Reveal final edit. Use left and right arrow keys." aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-valuetext="${esc('50% final edit')}">
      <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 6-6 6 6 6m6-12 6 6-6 6"/></svg>
    </button>
  </div>`;
}

export function initBeforeAfter(root: HTMLElement): void {
  const clip = root.querySelector<HTMLElement>('.ba-clip')!, after = root.querySelector<HTMLElement>('.ba-after')!;
  const line = root.querySelector<HTMLElement>('.ba-line')!, handle = root.querySelector<HTMLElement>('.ba-handle')!;
  let p = 0.5, dragging = false, w = root.clientWidth;
  const paint = () => {
    const x = p * w;
    clip.style.transform = `translate3d(${x}px,0,0)`; after.style.transform = `translate3d(${-x}px,0,0)`;
    line.style.transform = handle.style.transform = `translate3d(${x}px,0,0)`;
    handle.setAttribute('aria-valuenow', String(Math.round((1 - p) * 100)));
    handle.setAttribute('aria-valuetext', `${Math.round((1 - p) * 100)}% final edit`);
  };
  const setFrom = (e: PointerEvent) => { const r = root.getBoundingClientRect(); p = clamp((e.clientX - r.left) / r.width, 0.02, 0.98); paint(); };
  root.addEventListener('pointerdown', (e) => { dragging = true; root.setPointerCapture(e.pointerId); setFrom(e); });
  root.addEventListener('pointermove', (e) => { if (dragging) setFrom(e); });
  const end = () => { dragging = false; };
  root.addEventListener('pointerup', end); root.addEventListener('pointercancel', end);
  handle.addEventListener('keydown', (e) => {
    const d = e.key === 'ArrowLeft' ? -0.04 : e.key === 'ArrowRight' ? 0.04 : 0;
    if (d) { e.preventDefault(); p = clamp(p + d, 0.02, 0.98); paint(); }
  });
  new ResizeObserver(() => { w = root.clientWidth; paint(); }).observe(root);

  // one-time intro sweep when it scrolls into view
  new IntersectionObserver(([en], io) => {
    if (!en.isIntersecting) return; io.disconnect();
    if (reducedMotion()) return;
    const t0 = performance.now(), from = 0.9, to = 0.5;
    const run = (t: number) => { const k = clamp((t - t0) / 900); if (dragging) return; p = from + (to - from) * (1 - Math.pow(1 - k, 4)); paint(); if (k < 1) requestAnimationFrame(run); };
    requestAnimationFrame(run);
  }, { threshold: 0.5 }).observe(root);
  paint();
}
