import { startPage, hero, ctaBand } from './shell';
import { STAGES } from '../data/content';
import { initPipeline } from '../features/pipeline';
import { esc } from '../components/util';

const list = (items: string[]) => `<ul class="mt-4 space-y-2.5">${items.map((i) => `<li class="check-li">${esc(i)}</li>`).join('')}</ul>`;

startPage((main) => {
  main.innerHTML = `
  ${hero({ kicker: 'Production pipeline', title: 'From raw footage to <em class="font-serif font-normal italic">master</em>, in four passes.', lead: 'A predictable workflow with a review point at every stage, so there are no surprises and nothing gets lost between rough cut and delivery.' })}
  <section class="pb-20" aria-label="Pipeline overview"><div class="shell">
    <div id="pipe" class="relative">
      <span class="pipe-line" aria-hidden="true"><i id="pipe-fill" class="pipe-fill"></i></span><span id="pipe-head" class="pipe-head" aria-hidden="true"><i></i></span>
      <ol class="grid gap-12 lg:grid-cols-4 lg:gap-8">${STAGES.map((s) => `
        <li class="step relative pl-10 lg:pl-0 lg:pt-14" data-step><span class="node absolute left-0 top-1.5 h-3.5 w-3.5 rotate-45 border lg:left-0 lg:top-0"></span>
          <div class="step-body"><span class="label">${s.tc} · ${s.n}</span><h2 class="mt-3 font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">${esc(s.title)}</h2><p class="mt-3 max-w-xs text-[15px] leading-relaxed text-ash">${esc(s.summary)}</p></div></li>`).join('')}</ol>
    </div>
  </div></section>
  ${STAGES.map((s, i) => `
  <section class="section section-tight ${i % 2 ? '' : 'bg-char/50'}" aria-labelledby="st-${s.slug}"><div class="shell grid gap-10 lg:grid-cols-12">
    <div class="lg:col-span-4"><p class="label mb-4 text-ember" data-reveal>Stage ${s.n}</p><h2 id="st-${s.slug}" class="h2 !text-[clamp(2rem,3.6vw,3.4rem)]" data-split>${esc(s.title)}</h2><p class="mt-5 max-w-sm text-[15px] leading-relaxed text-ash" data-reveal>${esc(s.summary)}</p></div>
    <div class="grid gap-4 sm:grid-cols-3 lg:col-span-8">${[['You give', s.youGive], ['I do', s.iDo], ['You get', s.youGet]].map(([h, l], k) => `<div class="glass rounded-xl p-6" data-reveal style="--d:${k * 70}ms"><p class="label">${h}</p>${list(l as string[])}</div>`).join('')}</div>
  </div></section>`).join('')}
  <section class="section section-tight" aria-labelledby="rev-h"><div class="shell grid gap-10 lg:grid-cols-12">
    <div class="lg:col-span-5"><p class="label mb-5" data-reveal>Revisions &amp; handover</p><h2 id="rev-h" class="h2" data-split>Clear rules, <em>no surprises</em>.</h2></div>
    <div class="lg:col-span-7"><p class="text-[17px] leading-relaxed text-bone/80" data-reveal>Revision rounds are defined in your proposal and handled through timestamped comments. Final files are delivered in the formats you need, and project files can be included by arrangement. Full details are in my <a class="u-link text-white" href="/terms">Terms</a>.</p></div>
  </div></section>
  ${ctaBand('Start the pipeline')}`;
  initPipeline();
});
