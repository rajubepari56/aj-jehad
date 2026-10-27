import { startPage, hero, ctaBand } from './shell';
import { PRINCIPLES, ARSENAL, HARDWARE } from '../data/content';
import { CONFIG } from '../config';
import { esc } from '../components/util';
import { portraitImg, initPortraits } from '../components/portrait';

startPage((main) => {
  main.innerHTML = `
  ${hero({ kicker: 'About me', title: 'A freelance editor obsessed with <em class="font-serif font-normal italic">attention</em>.', lead: `I'm ${CONFIG.lead}, a freelance video editor and motion designer. I cut gaming content, short-form growth engines, long-form stories and 3D motion for creators and brands, always with one goal: keep people watching.` })}
  <section class="section section-tight" aria-labelledby="phil-h"><div class="shell">
    <div class="mb-12 max-w-3xl"><p class="label mb-5" data-reveal>Editing philosophy</p><h2 id="phil-h" class="h2" data-split>How I think about the <em>edit</em>.</h2></div>
    <ul class="grid gap-4 sm:grid-cols-2">${PRINCIPLES.map((p, i) => `<li class="glass rounded-xl p-7" data-reveal style="--d:${i * 70}ms"><span class="label text-ember">0${i + 1}</span><h3 class="mt-8 font-display text-2xl font-semibold tracking-tight text-white">${esc(p.title)}</h3><p class="mt-3 text-[15px] leading-relaxed text-ash">${esc(p.body)}</p></li>`).join('')}</ul>
  </div></section>
  <section class="section section-tight bg-char/50" aria-labelledby="lead-h"><div class="shell grid gap-12 lg:grid-cols-12">
    <div class="lg:col-span-5"><figure class="portrait" data-reveal>
      <div class="poster absolute inset-0" style="--h:12" aria-hidden="true"><span class="absolute bottom-12 left-6 z-[3] font-display text-4xl font-semibold tracking-tight text-white">MJ</span></div>
      ${portraitImg(`Portrait of ${esc(CONFIG.lead)}, freelance video editor and motion designer`)}
      <figcaption class="label absolute bottom-5 left-6 z-[3]">${esc(CONFIG.lead)} · Your editor</figcaption></figure></div>
    <div class="lg:col-span-7"><p class="label mb-5" data-reveal>Meet your editor</p><h2 id="lead-h" class="h2" data-split>${esc(CONFIG.lead)}</h2>
      <p class="mt-8 max-w-xl text-[17px] leading-relaxed text-bone/80" data-reveal>Hi, I'm ${esc(CONFIG.lead)}. I work directly with creators and brands on gaming edits, short-form growth, motion design and long-form storytelling. You work with me, not a team: one point of contact, honest scoping and an edit shaped around your audience.</p>
      <ul class="mt-8 flex flex-wrap gap-2" data-reveal><li class="label rounded-full border border-white/10 px-3 py-1.5">Gaming edits</li><li class="label rounded-full border border-white/10 px-3 py-1.5">Short-form</li><li class="label rounded-full border border-white/10 px-3 py-1.5">Motion design</li><li class="label rounded-full border border-white/10 px-3 py-1.5">Sound design</li></ul>
      <p class="mt-8 flex flex-wrap gap-6 text-[15px]" data-reveal><a class="u-link text-white" href="mailto:${CONFIG.contactEmail}">${CONFIG.contactEmail}</a>${CONFIG.social.linkedin ? `<a class="u-link text-white" href="${CONFIG.social.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn<span class="sr-only"> (opens in a new tab)</span></a>` : ''}${CONFIG.social.x ? `<a class="u-link text-white" href="${CONFIG.social.x}" target="_blank" rel="noopener noreferrer">X / Twitter<span class="sr-only"> (opens in a new tab)</span></a>` : ''}</p>
    </div>
  </div></section>
  <section class="section section-tight" aria-labelledby="arsenal-h"><div class="shell">
    <div class="mb-12 max-w-3xl"><p class="label mb-5" data-reveal>Arsenal</p><h2 id="arsenal-h" class="h2" data-split>Software and <em>hardware</em>.</h2></div>
    <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">${ARSENAL.map((a, i) => `<li class="glass rounded-xl p-5" data-reveal style="--d:${i * 60}ms"><span class="grid h-12 w-12 place-items-center rounded-lg border border-white/15 bg-obs font-display text-lg font-bold text-white">${a.name.slice(0, 2)}</span><h3 class="mt-8 font-display font-semibold tracking-tight text-white">${esc(a.name)}</h3><p class="mt-1.5 text-sm text-ash">${esc(a.role)}</p></li>`).join('')}</ul>
    <ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">${HARDWARE.map((h, i) => `<li class="rounded-xl border border-white/10 p-5" data-reveal style="--d:${i * 60}ms"><h3 class="font-display font-semibold tracking-tight text-white">${esc(h.name)}</h3><p class="mt-2 text-sm leading-relaxed text-ash">${esc(h.detail)}</p></li>`).join('')}</ul>
  </div></section>
  ${ctaBand("Let's work together")}`;
  initPortraits(main);
});
