import { reducedMotion } from '../components/util';

type Look = { state: 'default' | 'link' | 'label' | 'big' | 'text' | 'native'; label?: string };

/** Ordered rules: first match wins. Add `data-cursor="LABEL"` to any element to give it its own cursor label. */
const RULES: { sel: string; look: (el: Element) => Look }[] = [
  { sel: 'iframe', look: () => ({ state: 'native' }) },
  { sel: 'input:not([type=checkbox]):not([type=radio]):not([type=range]), textarea, [contenteditable=true]', look: () => ({ state: 'text' }) },
  { sel: '[data-cursor]', look: (el) => ({ state: 'label', label: (el as HTMLElement).dataset.cursor }) },
  { sel: '[data-ba]', look: () => ({ state: 'label', label: 'DRAG' }) },
  { sel: '#tl-scrub, .gp-tl, .c-track', look: () => ({ state: 'label', label: 'SCRUB' }) },
  { sel: '.cine-big, .c-play, #mon, [data-open-reel], .btn-reel, [data-quick]', look: () => ({ state: 'label', label: 'PLAY' }) },
  { sel: '.pframe, .pcard > a', look: () => ({ state: 'label', label: 'VIEW' }) },
  { sel: '.faq-item button', look: (el) => ({ state: 'label', label: el.getAttribute('aria-expanded') === 'true' ? 'CLOSE' : 'OPEN' }) },
  { sel: '.chapter', look: () => ({ state: 'label', label: 'JUMP' }) },
  { sel: 'a[href="/contact"], a[href^="/contact?"], [data-open-inquiry], .btn-hero', look: () => ({ state: 'label', label: 'BOOK' }) },
  { sel: 'a[href^="mailto:"]', look: () => ({ state: 'label', label: 'MAIL' }) },
  { sel: 'a[target="_blank"]', look: () => ({ state: 'label', label: '↗' }) },
  { sel: '.bento-cta, .bento a', look: () => ({ state: 'label', label: 'OPEN' }) },
  { sel: 'a, button, select, summary, label.choice, .consent, [role=button], [role=slider], .fchip', look: () => ({ state: 'link' }) },
  { sel: '.bento', look: () => ({ state: 'label', label: 'EXPLORE' }) },
  { sel: '.hero-title, .h1-case, .h2', look: () => ({ state: 'big' }) },
];

export function resolveLook(target: Element | null): Look {
  if (!target) return { state: 'default' };
  for (const r of RULES) { const el = target.closest(r.sel); if (el) return r.look(el); }
  return { state: 'default' };
}

/** Contextual custom cursor (fine pointers only). Moves with transform only; native cursor stays for text fields and embeds. */
export function initCursor(): void {
  if (!matchMedia('(pointer: fine)').matches) return;
  const root = document.createElement('div');
  root.className = 'cursor'; root.setAttribute('aria-hidden', 'true'); root.dataset.state = 'default';
  root.innerHTML = '<i class="cur-dot"></i><span class="cur-ring"><span class="cur-disc"></span><span class="cur-label"></span></span>';
  const dot = root.querySelector<HTMLElement>('.cur-dot')!, ring = root.querySelector<HTMLElement>('.cur-ring')!, label = root.querySelector<HTMLElement>('.cur-label')!;
  const popover = 'showPopover' in root;
  if (popover) root.setAttribute('popover', 'manual');
  document.body.appendChild(root);
  if (popover) root.showPopover();
  document.documentElement.classList.add('has-cursor');

  let x = -200, y = -200, rx = x, ry = y, raf = 0, shown = false;
  const follow = () => !reducedMotion();
  const frame = () => {
    const k = follow() ? 0.22 : 1;
    rx += (x - rx) * k; ry += (y - ry) * k;
    dot.style.transform = `translate3d(${x}px,${y}px,0)`;
    ring.style.transform = `translate3d(${rx.toFixed(1)}px,${ry.toFixed(1)}px,0)`;
    raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.15 ? requestAnimationFrame(frame) : 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
  const show = (on: boolean) => { shown = on; root.classList.toggle('on', on); };

  const apply = (look: Look) => {
    root.dataset.state = look.state;
    label.textContent = look.label ?? '';
  };

  addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    x = e.clientX; y = e.clientY;
    if (!shown) { rx = x; ry = y; show(true); }
    kick();
  }, { passive: true });
  document.addEventListener('pointerover', (e) => apply(resolveLook(e.target as Element)), { passive: true });
  document.addEventListener('pointerdown', () => { root.dataset.press = '1'; });
  document.addEventListener('pointerup', () => { delete root.dataset.press; });
  document.documentElement.addEventListener('mouseleave', () => show(false));
  document.documentElement.addEventListener('mouseenter', () => show(true));
  // keep the label in sync when a hovered control changes (e.g. FAQ open/close)
  document.addEventListener('click', (e) => setTimeout(() => apply(resolveLook(e.target as Element)), 0));

  // the cursor lives in the browser's top layer; re-raise it above any dialog that opens
  if (popover) new MutationObserver(() => { if (root.matches(':popover-open')) { root.hidePopover(); root.showPopover(); } })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['open'], subtree: true });
}
