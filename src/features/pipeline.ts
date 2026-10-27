import { $, $$, clamp } from '../components/util';

/**
 * Scroll-linked pipeline. A playhead sweeps the track as the section scrolls through the
 * viewport and each step lights up like an active keyframe. Scroll itself is never intercepted.
 */
export function initPipeline(): void {
  const wrap = $('#pipe'); if (!wrap) return;
  const fill = $('#pipe-fill')!, head = $('#pipe-head')!, steps = $$('[data-step]', wrap);
  let visible = false, raf = 0;
  const update = () => {
    raf = 0;
    const r = wrap.getBoundingClientRect(), vh = innerHeight, horiz = matchMedia('(min-width: 1024px)').matches;
    const p = clamp((vh * 0.78 - r.top) / Math.max(r.height + (horiz ? vh * 0.25 : 0), vh * 0.45));
    fill.style.transform = horiz ? `scaleX(${p})` : `scaleY(${p})`;
    const len = horiz ? wrap.clientWidth : wrap.clientHeight;
    head.style.transform = horiz ? `translate3d(${p * len}px,0,0)` : `translate3d(0,${p * len}px,0)`;
    steps.forEach((s, i) => s.classList.toggle('is-in', p >= i / steps.length + 0.02));
  };
  const queue = () => { if (visible && !raf) raf = requestAnimationFrame(update); };
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; queue(); }, { rootMargin: '30% 0px' }).observe(wrap);
  addEventListener('scroll', queue, { passive: true }); addEventListener('resize', queue);
  update();
}
