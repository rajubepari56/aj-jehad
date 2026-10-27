import { $, $$, clamp, reducedMotion } from '../components/util';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Magnetic pull for primary CTAs. `[data-magnetic]` wrappers (with a `[data-mag-inner]` child)
 * and `[data-mag-auto]` elements (auto-wrapped) both work. Transform-only, fine pointers only.
 */
export function initMagnetic(root: ParentNode = document): void {
  if (!matchMedia('(pointer: fine)').matches || reducedMotion()) return;
  $$('[data-mag-auto]', root).forEach((el) => {
    const wrap = document.createElement('span');
    wrap.className = 'mag'; wrap.dataset.magnetic = el.dataset.magAuto || '0.28';
    el.dataset.magInner = '';
    el.replaceWith(wrap); wrap.appendChild(el);
    el.removeAttribute('data-mag-auto');
  });
  $$('[data-magnetic]', root).forEach((wrap) => {
    if (wrap.dataset.magReady) return;
    wrap.dataset.magReady = '1';
    const k = Number(wrap.dataset.magnetic);
    const inner = $('[data-mag-inner]', wrap);
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const step = () => {
      x = lerp(x, tx, 0.18); y = lerp(y, ty, 0.18);
      wrap.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      if (inner) inner.style.transform = `translate3d(${(x * 0.35).toFixed(2)}px, ${(y * 0.35).toFixed(2)}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.05 ? requestAnimationFrame(step) : 0;
    };
    addEventListener('pointermove', (e) => {
      const r = wrap.getBoundingClientRect();
      if (r.bottom < -100 || r.top > innerHeight + 100) return;
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      const near = Math.hypot(dx, dy) < Math.max(r.width, 90) * 0.85;
      const ntx = near ? clamp(dx * k, -14, 14) : 0, nty = near ? clamp(dy * k, -10, 10) : 0;
      if (ntx === tx && nty === ty && !raf) return;
      tx = ntx; ty = nty;
      if (!raf) raf = requestAnimationFrame(step);
    }, { passive: true });
  });
}
