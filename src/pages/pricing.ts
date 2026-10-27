import { startPage, hero, ctaBand } from './shell';
import { PACKAGES, TURNAROUND, PRICING_FAQ } from '../data/pricing';
import { faqHtml } from '../components/faq';
import { initFaq } from '../features/faq';
import { BUDGET_OPTIONS } from '../../shared/contact';
import { esc } from '../components/util';

startPage((main) => {
  const budgetId = (label: string) => BUDGET_OPTIONS.find((b) => b.label === label)?.id ?? '';
  main.innerHTML = `
  ${hero({ kicker: 'Pricing & packages', title: 'Clear budgets. <em class="font-serif font-normal italic">Scoped</em> to your channel.', lead: 'Three budget bands that match the inquiry form, plus custom quotes for larger or unusual projects. Every project gets a written quote before work starts.' })}
  <section class="pb-24" aria-label="Packages"><div class="shell">
    <ul class="grid gap-5 lg:grid-cols-3">${PACKAGES.map((p, i) => `
      <li class="price-card ${p.featured ? 'featured' : ''}" data-reveal style="--d:${i * 80}ms">
        ${p.featured ? '<span class="label absolute right-5 top-5 rounded-full border border-ember/60 px-2.5 py-1 text-[9px] text-ember">Most popular</span>' : ''}
        <span class="label">${esc(p.name)}</span><p class="mt-6 font-display text-[2.6rem] font-semibold leading-none tracking-[-0.04em] text-white">${esc(p.range)}</p>
        <p class="mt-3 text-[15px] text-ash">${esc(p.tagline)}</p><p class="label mt-2 normal-case tracking-normal">Best for: ${esc(p.for)}</p>
        <ul class="mt-8 space-y-3">${p.features.map((f) => `<li class="check-li">${esc(f)}</li>`).join('')}</ul>
        <a href="/contact?service=${p.formId}&budget=${budgetId(p.budget)}" class="btn ${p.featured ? 'btn-primary' : 'btn-ghost'} mt-10 self-start"><span>${esc(p.cta)}</span><span aria-hidden="true">→</span></a></li>`).join('')}</ul>
    <div class="mt-5 flex flex-col items-start justify-between gap-6 rounded-2xl border border-dashed border-white/20 p-7 sm:flex-row sm:items-center" data-reveal><div><p class="font-display text-2xl font-semibold tracking-tight text-white">Custom quote</p><p class="mt-2 max-w-xl text-[15px] text-ash">Large channels, multi-channel networks or something unusual. Tell me what you need and I'll scope it.</p></div><a href="/contact" class="btn btn-primary shrink-0"><span>Request a custom quote</span></a></div>
  </div></section>
  <section class="section section-tight bg-char/50" aria-labelledby="ta-h"><div class="shell grid gap-12 lg:grid-cols-12">
    <div class="lg:col-span-4"><p class="label mb-5" data-reveal>Turnaround</p><h2 id="ta-h" class="h2 !text-[clamp(2rem,3.6vw,3.4rem)]" data-split>Typical <em>timelines</em>.</h2><p class="mt-5 max-w-xs text-sm text-ash" data-reveal>Typical windows for planning. A firm delivery date is agreed in writing before kickoff.</p></div>
    <div class="lg:col-span-8" data-reveal><table class="w-full border-collapse text-left"><caption class="sr-only">Typical turnaround by format</caption><thead><tr class="label border-b border-white/15"><th scope="col" class="py-3 pr-4 font-normal">Format</th><th scope="col" class="py-3 pr-4 font-normal">Typical</th><th scope="col" class="hidden py-3 font-normal sm:table-cell">Note</th></tr></thead>
      <tbody>${TURNAROUND.map((t) => `<tr class="border-b border-white/10"><th scope="row" class="py-4 pr-4 font-display font-medium text-white">${esc(t.format)}</th><td class="py-4 pr-4 font-mono text-sm text-ember">${esc(t.typical)}</td><td class="hidden py-4 text-sm text-ash sm:table-cell">${esc(t.note)}</td></tr>`).join('')}</tbody></table></div>
  </div></section>
  <section class="section section-tight" aria-labelledby="pf-h"><div class="shell grid gap-12 lg:grid-cols-12">
    <div class="lg:col-span-4"><p class="label mb-5" data-reveal>FAQ</p><h2 id="pf-h" class="h2" data-split>Pricing <em>questions</em>.</h2></div>
    <div class="lg:col-span-8">${faqHtml(PRICING_FAQ, 'pf')}</div></div></section>
  ${ctaBand('Get your quote')}`;
  initFaq();
});
