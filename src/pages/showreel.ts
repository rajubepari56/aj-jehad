import { startPage, hero, ctaBand } from './shell';
import { SHOWREEL } from '../data/showreel';
import { mountPlayer } from '../components/player';
import { esc } from '../components/util';

startPage((main) => {
  main.innerHTML = `
  ${hero({ kicker: 'Showreel', title: 'Sixty seconds of <em class="font-serif font-normal italic">pace</em>.', lead: 'The reel in theater view. Jump between chapters, or dim the room and watch it full-frame.', tall: true })}
  <section class="pb-20 sm:pb-28" aria-label="Showreel theater"><div class="shell">
    <div class="theater-dim" aria-hidden="true"></div>
    <div class="theater-stage">
      <div class="flex items-center justify-between pb-4"><p class="label">${esc(SHOWREEL.title)} · 16:9</p>
        <button type="button" id="theater-btn" class="btn btn-ghost !px-4 !py-2 !text-[13px]" aria-pressed="false"><span>Theater mode</span></button></div>
      <div id="reel-host" class="curtain relative aspect-video w-full overflow-hidden rounded-[3px] border border-white/10 bg-black" data-curtain></div>
    </div>
    <ol class="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5" aria-label="Chapters">${SHOWREEL.chapters.map((c, i) => `
      <li><button type="button" class="chapter w-full rounded-xl border border-white/10 p-4 text-left" data-start="${c.start}" aria-current="${i === 0}">
        <span class="label">${String(i + 1).padStart(2, '0')} · ${esc(c.category)}</span><span class="mt-2 block font-display font-semibold tracking-tight text-white">${esc(c.title)}</span>
        <span class="label mt-2 block">${Math.floor(c.start / 60)}:${String(c.start % 60).padStart(2, '0')}</span></button></li>`).join('')}</ol>
  </div></section>
  ${ctaBand('Liked the reel?')}`;

  const host = main.querySelector<HTMLElement>('#reel-host')!;
  const first = SHOWREEL.chapters[0];
  const player = mountPlayer(host, { title: SHOWREEL.title, ratio: '16:9', hue: first.hue, seed: 'showreel', duration: SHOWREEL.duration, src: SHOWREEL.src || undefined, poster: SHOWREEL.poster || undefined, autoplay: true, muted: true });
  const chapters = Array.from(main.querySelectorAll<HTMLButtonElement>('.chapter'));
  chapters.forEach((b) => b.addEventListener('click', () => {
    chapters.forEach((x) => x.setAttribute('aria-current', String(x === b)));
    player.seek(Number(b.dataset.start));
  }));
  const btn = main.querySelector<HTMLButtonElement>('#theater-btn')!;
  const set = (on: boolean) => { document.documentElement.classList.toggle('theater-on', on); btn.setAttribute('aria-pressed', String(on)); btn.firstElementChild!.textContent = on ? 'Exit theater' : 'Theater mode'; };
  btn.addEventListener('click', () => set(!document.documentElement.classList.contains('theater-on')));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
});
