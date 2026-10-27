import { $, $$, clamp, reducedMotion, timecode } from '../components/util';
import { bentoHtml } from '../components/bento';

export function initBento(): void {
  const grid = $('#bento-grid');
  if (!grid) return;
  grid.innerHTML = bentoHtml();
  const fine = matchMedia('(pointer: fine)').matches;

  // spotlight follow: one soft light per card, moved with transform only
  if (fine && !reducedMotion()) $$('.bento', grid).forEach((card) => {
    const spot = $('.spot-el', card)!;
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      spot.style.transform = `translate3d(${e.clientX - r.left}px, ${e.clientY - r.top}px, 0)`;
    });
  });

  // run ambient motion only while a card is on screen
  const live = new IntersectionObserver((entries) => entries.forEach((en) => en.target.classList.toggle('live', en.isIntersecting)), { rootMargin: '80px' });
  $$('.bento', grid).forEach((c) => live.observe(c));

  // gaming card: playhead follows the pointer, scenes follow the playhead
  const gp = $('[data-gaming]', grid);
  if (gp) {
    const tl = $('.gp-tl', gp)!, lane = $('.gp-lane', gp)!, ph = $('.gp-ph', gp)!, tc = $('[data-tc]', gp)!;
    const layers = $$('.scene', gp);
    const set = (p: number) => {
      ph.style.transform = `translate3d(${((p - 1) * lane.clientWidth).toFixed(1)}px,0,0)`;
      tc.textContent = timecode(p * 24);
      const s = Math.min(2, Math.floor(p * 3)); layers.forEach((l, i) => l.classList.toggle('on', i === s));
    };
    tl.addEventListener('pointerenter', () => gp.classList.add('is-scrubbing'));
    tl.addEventListener('pointermove', (e) => { const r = lane.getBoundingClientRect(); set(clamp((e.clientX - r.left) / r.width)); });
    tl.addEventListener('pointerleave', () => { gp.classList.remove('is-scrubbing'); ph.style.transform = ''; layers.forEach((l) => l.classList.remove('on')); });
    // keyboard: arrows scrub when the timeline is focused
    tl.tabIndex = 0; tl.setAttribute('role', 'slider'); tl.setAttribute('aria-label', 'Scrub preview timeline'); tl.setAttribute('aria-valuemin', '0'); tl.setAttribute('aria-valuemax', '100'); tl.setAttribute('aria-valuenow', '0');
    let kp = 0.1;
    tl.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return; e.preventDefault();
      gp.classList.add('is-scrubbing'); kp = clamp(kp + (e.key === 'ArrowRight' ? 0.06 : -0.06)); set(kp); tl.setAttribute('aria-valuenow', String(Math.round(kp * 100)));
    });
    tl.addEventListener('blur', () => { gp.classList.remove('is-scrubbing'); ph.style.transform = ''; });
  }
}
