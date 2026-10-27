import { startPage, hero, ctaBand } from './shell';
import { SERVICES, serviceUrl } from '../data/services';
import { esc } from '../components/util';

startPage((main) => {
  main.innerHTML = `
  ${hero({ kicker: 'Capabilities', title: 'Full-stack post-production for <em class="font-serif font-normal italic">attention</em>.', lead: 'Seven disciplines, one standard of pacing. Pick a single service or let me run your whole pipeline.' })}
  <section class="pb-24 sm:pb-32" aria-label="Services"><div class="shell">
    <ul class="grid gap-4 md:grid-cols-2">${SERVICES.map((s, i) => `
      <li data-reveal><a href="${serviceUrl(s)}" class="bento group relative block h-full overflow-hidden rounded-2xl border border-white/10 bg-[#121216] p-7 sm:p-9">
        <span class="microgrid pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,#000,transparent_70%)]" aria-hidden="true"></span>
        <span class="relative flex h-full flex-col">
          <span class="label text-ember">${String(i + 1).padStart(2, '0')} · ${esc(s.kicker)}</span>
          <span class="mt-4 block font-display text-2xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-3xl">${esc(s.title)}</span>
          <span class="mt-3 block max-w-md text-[15px] leading-relaxed text-ash">${esc(s.summary)}</span>
          <span class="label mt-5 flex items-center gap-2 normal-case tracking-normal"><i class="h-1.5 w-1.5 rotate-45 bg-ember"></i><span class="text-white/80">Focus: ${esc(s.focus)}</span></span>
          <span class="mt-8 inline-flex items-center gap-2 font-display text-[15px] font-semibold text-white"><span class="u-link">Explore service</span><span class="grid h-8 w-8 place-items-center rounded-full border border-white/20 transition-[transform,background-color,color] duration-200 ease-micro group-hover:-rotate-45 group-hover:border-ember group-hover:bg-ember group-hover:text-obs" aria-hidden="true">→</span></span>
        </span></a></li>`).join('')}</ul>
  </div></section>
  <section class="section section-tight bg-char/50" aria-labelledby="fmt-h"><div class="shell grid gap-12 lg:grid-cols-12">
    <div class="lg:col-span-5"><p class="label mb-5" data-reveal>Formats</p><h2 id="fmt-h" class="h2" data-split>Every ratio. Every <em>platform</em>.</h2></div>
    <ul class="grid gap-4 sm:grid-cols-3 lg:col-span-7">${[['16:9', 'YouTube long-form, gaming, commercials'], ['9:16', 'TikTok, Reels and Shorts'], ['1:1 · 4:5', 'Feed ads and social promos']].map(([r, d]) => `<li class="glass rounded-xl p-6" data-reveal><p class="font-display text-3xl font-semibold tracking-tight text-white">${r}</p><p class="mt-3 text-sm leading-relaxed text-ash">${d}</p></li>`).join('')}</ul>
  </div></section>
  ${ctaBand('Not sure where to start?')}`;
});
