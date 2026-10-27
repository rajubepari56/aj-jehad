import { startPage, hero, ctaBand, setMeta, notFound, lastSegment } from './shell';
import { serviceBySlug, SERVICES, serviceUrl } from '../data/services';
import { PROJECTS } from '../data/projects';
import { TOOLS } from '../data/projects';
import { projectCard, initCards } from '../components/card';
import { faqHtml } from '../components/faq';
import { initFaq } from '../features/faq';
import { esc } from '../components/util';

startPage((main) => {
  const s = serviceBySlug(lastSegment());
  if (!s) { setMeta('Service not found — Mahadi Jehad Edits', undefined, true); main.innerHTML = notFound('Service', '/services', 'All services'); return; }
  setMeta(`${s.title} — Mahadi Jehad Edits`, s.summary);
  const related = PROJECTS.filter((p) => p.category === s.category).slice(0, 3);
  const others = SERVICES.filter((x) => x.slug !== s.slug).slice(0, 3);
  main.innerHTML = `
  ${hero({ kicker: `<a href="/services" class="u-link">Services</a> / ${esc(s.kicker)}`, title: esc(s.headline), lead: esc(s.intro), tall: true,
    extra: `<div class="mt-10 flex flex-col gap-3 sm:flex-row" data-reveal><a href="/contact?service=${s.formId}" class="btn btn-primary" data-mag-auto="0.28"><span>Start this project</span><span aria-hidden="true">→</span></a><a href="/case-studies?cat=${s.category}" class="btn btn-ghost"><span>See related work</span></a></div>
    <ul class="mt-10 flex flex-wrap gap-2" aria-label="Software used" data-reveal>${s.tools.map((t) => `<li class="badge-tool"><b>${TOOLS[t].abbr}</b>${TOOLS[t].name}</li>`).join('')}</ul>` })}
  <section class="section section-tight" aria-labelledby="inc-h"><div class="shell grid gap-12 lg:grid-cols-12">
    <div class="lg:col-span-5"><p class="label mb-5" data-reveal>What's included</p><h2 id="inc-h" class="h2" data-split>Deliverables built around <em>retention</em>.</h2>
      <p class="label mt-8 flex items-center gap-2 normal-case tracking-normal" data-reveal><i class="h-1.5 w-1.5 rotate-45 bg-ember"></i><span class="text-white/80">Focus: ${esc(s.focus)}</span></p></div>
    <ul class="grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:col-span-7">${s.deliverables.map((d, i) => `<li class="check-li" data-reveal style="--d:${i * 50}ms">${esc(d)}</li>`).join('')}</ul>
  </div></section>
  <section class="section section-tight bg-char/50" aria-labelledby="how-h"><div class="shell">
    <div class="mb-12 max-w-3xl"><p class="label mb-5" data-reveal>Approach</p><h2 id="how-h" class="h2" data-split>How I work on it.</h2></div>
    <ol class="grid gap-4 md:grid-cols-3">${s.approach.map((a, i) => `<li class="glass rounded-xl p-7" data-reveal style="--d:${i * 80}ms"><span class="label text-ember">0${i + 1}</span><h3 class="mt-10 font-display text-xl font-semibold tracking-tight text-white">${esc(a.title)}</h3><p class="mt-3 text-[15px] leading-relaxed text-ash">${esc(a.body)}</p></li>`).join('')}</ol>
    <div class="mt-12 grid gap-6 border-t border-white/10 pt-10 lg:grid-cols-12"><p class="label lg:col-span-3" data-reveal>Ideal for</p><ul class="grid gap-3 sm:grid-cols-3 lg:col-span-9">${s.idealFor.map((x) => `<li class="check-li" data-reveal>${esc(x)}</li>`).join('')}</ul></div>
  </div></section>
  ${related.length ? `<section class="section section-tight" aria-labelledby="rel-h"><div class="shell"><div class="mb-12 flex items-end justify-between gap-6"><div><p class="label mb-5" data-reveal>Related work</p><h2 id="rel-h" class="h2" data-split>Proof in the <em>edit</em>.</h2></div><a href="/case-studies?cat=${s.category}" class="u-link label hidden sm:inline-block">All related projects →</a></div>
    <div class="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">${related.map((p) => projectCard(p)).join('')}</div></div></section>` : ''}
  <section class="section section-tight bg-char/50" aria-labelledby="sfaq-h"><div class="shell grid gap-12 lg:grid-cols-12">
    <div class="lg:col-span-4"><p class="label mb-5" data-reveal>FAQ</p><h2 id="sfaq-h" class="h2" data-split>Good to <em>know</em>.</h2></div>
    <div class="lg:col-span-8">${faqHtml(s.faqs, 'sf')}</div></div></section>
  <nav class="border-t border-white/10 py-10" aria-label="More services"><div class="shell grid gap-4 sm:grid-cols-3">${others.map((o) => `<a href="${serviceUrl(o)}" class="group block rounded-xl border border-white/10 p-6 transition-[border-color] duration-200 ease-micro hover:border-white/30"><span class="label">More services</span><span class="mt-3 block font-display text-xl font-semibold tracking-tight text-white">${esc(o.title)}</span></a>`).join('')}</div></nav>
  ${ctaBand(`Ready for ${esc(s.title.toLowerCase())}?`)}`;
  initCards(main); initFaq();
});
