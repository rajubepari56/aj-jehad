import { $, $$ } from '../components/util';
import { projectCard, initCards } from '../components/card';
import { PROJECTS, type Category } from '../data/projects';

const FILTERS: { id: string; label: string; match: (c: Category) => boolean }[] = [
  { id: 'all', label: 'All', match: () => true },
  { id: 'gaming', label: 'Gaming Highlights', match: (c) => c === 'gaming' },
  { id: 'shorts', label: 'Viral Shorts / Reels', match: (c) => c === 'shorts' },
  { id: 'motion', label: '3D Motion', match: (c) => c === 'motion' },
];
const SPANS = ['lg:col-span-7', 'lg:col-span-5 lg:mt-28', 'lg:col-span-4', 'lg:col-span-4 lg:mt-12', 'lg:col-span-4 lg:mt-24'];

export function initHomeWork(): void {
  const bar = $('#work-filters'), wide = $('#work-wide'), tall = $('#work-tall');
  if (!bar || !wide || !tall) return;
  bar.innerHTML = FILTERS.filter((f) => PROJECTS.some((p) => f.match(p.category))).map((f) => `<button type="button" class="fchip" data-f="${f.id}" aria-pressed="${f.id === 'all'}">${f.label}<small>${PROJECTS.filter((p) => f.match(p.category)).length}</small></button>`).join('');

  const show = (id: string) => {
    const f = FILTERS.find((x) => x.id === id)!;
    const list = PROJECTS.filter((p) => f.match(p.category));
    const w = list.filter((p) => p.ratio === '16:9').slice(0, 5), t = list.filter((p) => p.ratio === '9:16').slice(0, 5);
    wide.innerHTML = w.length ? `<div class="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-12">${w.map((p, i) => projectCard(p, `${SPANS[i]} ${i < 2 ? 'sm:col-span-2' : ''}`)).join('')}</div>` : '';
    tall.innerHTML = t.length ? `<p class="label mb-6 mt-20 flex items-center gap-3"><span>9:16 · Vertical short-form</span><span class="h-px flex-1 bg-white/10"></span></p>
      <div style="--n:${t.length}" class="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:max-w-[calc(var(--n)*20%)] lg:[grid-template-columns:repeat(var(--n),minmax(0,1fr))] lg:gap-6 lg:overflow-visible lg:px-0">
      ${t.map((p, i) => projectCard(p, `w-[64vw] shrink-0 snap-center sm:w-[38vw] lg:w-auto ${i % 2 ? 'lg:mt-16' : ''}`)).join('')}</div>` : '';
    initCards(wide); initCards(tall);
    $$('[data-reveal],[data-curtain]', $('#work-grid')!).forEach((el, i) => { el.style.setProperty('--d', `${Math.min(i, 7) * 60}ms`); requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-in'))); });
    $$('[data-f]', bar).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.f === id)));
    $('#work-count')!.textContent = `${list.length} project${list.length === 1 ? '' : 's'}`;
  };
  bar.addEventListener('click', (e) => { const b = (e.target as HTMLElement).closest<HTMLElement>('[data-f]'); if (b) show(b.dataset.f!); });
  show('all');
}
