import { $, $$, reducedMotion } from '../components/util';

export function initNav(): void {
  const header = $('#site-header')!, bar = $('#progress')!, menu = $('#mobile-menu')!, toggle = $<HTMLButtonElement>('#menu-toggle')!;
  let lastY = scrollY, ticking = false;

  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY, max = document.documentElement.scrollHeight - innerHeight, dy = y - lastY;
      bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      header.dataset.scrolled = String(y > 24);
      // collapse on scroll-down, reveal on scroll-up (native scrolling is never touched)
      if (!reducedMotion() && menu.dataset.open !== 'true') {
        if (y < 120 || dy < -4) header.dataset.hidden = 'false';
        else if (dy > 6 && !header.matches(':focus-within')) header.dataset.hidden = 'true';
      }
      if (Math.abs(dy) > 4) lastY = y;
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  header.addEventListener('focusin', () => { header.dataset.hidden = 'false'; });
  onScroll();

  const setMenu = (open: boolean) => {
    menu.dataset.open = String(open); menu.inert = !open;
    toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    header.dataset.hidden = 'false';
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) $<HTMLAnchorElement>('a', menu)?.focus({ preventScroll: true });
  };
  toggle.addEventListener('click', () => setMenu(menu.dataset.open !== 'true'));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.dataset.open === 'true') { setMenu(false); toggle.focus(); } });
  matchMedia('(min-width: 1024px)').addEventListener('change', (m) => { if (m.matches) setMenu(false); });
}
