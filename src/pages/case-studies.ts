import { startPage, hero, ctaBand } from './shell';
import { $, $$ } from '../components/util';
import { projectCard, initCards } from '../components/card';
import { PROJECTS, CATEGORY_LABEL, type Category, type Project } from '../data/projects';
import { initMotion } from '../features/motion';

const cats: ('all' | Category)[] = ['all', 'gaming', 'shorts', 'motion', 'long', 'brand'];
const label = (c: string) => (c === 'all' ? 'All work' : CATEGORY_LABEL[c as Category]);
const count = (c: string) => PROJECTS.filter((p) => c === 'all' || p.category === c).length;

/** Alternating rhythm: widescreen feature, vertical trio, widescreen duo, repeat. */
function rhythm(list: Project[]): string {
  const wide = list.filter((p) => p.ratio === '16:9'), tall = list.filter((p) => p.ratio === '9:16');
  const out: string[] = []; let side = 0;
  while (wide.length || tall.length) {
    if (wide.length) { const p = wide.shift()!; out.push(`<div class="grid lg:grid-cols-12"><div class="${side++ % 2 ? 'lg:col-span-9 lg:col-start-4' : 'lg:col-span-9'}">${projectCard(p)}</div></div>`); }
    if (tall.length) { const t = tall.splice(0, 3); out.push(`<div class="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-auto lg:grid lg:max-w-5xl lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:px-0">${t.map((p, i) => projectCard(p, `w-[64vw] shrink-0 snap-center sm:w-[38vw] lg:w-auto ${i === 1 ? 'lg:mt-14' : ''}`)).join('')}</div>`); }
    if (wide.length) { const d = wide.splice(0, 2); out.push(`<div class="grid gap-x-8 gap-y-14 lg:grid-cols-2">${d.map((p, i) => projectCard(p, i ? 'lg:mt-20' : '')).join('')}</div>`); }
  }
  return out.join('') || '<p class="py-24 text-center text-ash">No projects in this category yet.</p>';
}

startPage((main) => {
  main.innerHTML = `
  ${hero({ kicker: 'Portfolio', title: 'Work that holds <em class="font-serif font-normal italic">attention</em>, frame after frame.', lead: 'Selected gaming edits, intros and short-form work. Open any piece to watch it in full and see how I approach this kind of edit.',
    extra: `<div class="mt-12 flex flex-wrap items-center justify-between gap-4" data-reveal><div id="filters" role="group" aria-label="Filter projects" class="flex flex-wrap gap-2">${cats.filter((c) => count(c) > 0).map((c) => `<button type="button" class="fchip" data-f="${c}" aria-pressed="false">${label(c)}<small>${count(c)}</small></button>`).join('')}</div><p id="count" class="label" aria-live="polite"></p></div>` })}
  <section class="pb-24 sm:pb-32" aria-label="Projects"><div class="shell"><div id="archive" class="space-y-16 sm:space-y-24"></div>
    ${PROJECTS.some((p) => p.sample) ? '<p class="label mt-16 text-center">Sample projects shown. Replace them in <span class="text-bone">src/data/projects.ts</span>.</p>' : ''}</div></section>
  ${ctaBand()}`;

  function show(cat: string, push = false): void {
    const list = PROJECTS.filter((p) => cat === 'all' || p.category === cat);
    const root = $('#archive')!;
    root.innerHTML = rhythm(list);
    initCards(root); initMotion(root);
    $$('[data-f]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.f === cat)));
    $('#count')!.textContent = `${list.length} project${list.length === 1 ? '' : 's'}`;
    if (push) { const u = new URL(location.href); if (cat === 'all') u.searchParams.delete('cat'); else u.searchParams.set('cat', cat); history.replaceState(null, '', u); }
  }
  $('#filters')!.addEventListener('click', (e) => { const b = (e.target as HTMLElement).closest<HTMLElement>('[data-f]'); if (b) show(b.dataset.f!, true); });
  const initial = new URLSearchParams(location.search).get('cat') ?? 'all';
  show((cats as string[]).includes(initial) ? initial : 'all');
});
