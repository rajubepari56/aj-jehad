import { startPage, hero, SERVICE_PARAM, BUDGET_PARAM } from './shell';
import { mountContactForm } from '../components/contactForm';
import { CONFIG } from '../config';

startPage((main) => {
  const steps = [['01', 'I review', `I look at your channel, footage and goals ${CONFIG.responseTime}.`], ['02', 'You get a plan', 'A short written plan with scope, timeline and a clear quote.'], ['03', 'I start', 'Trial edit or full project, with a review point at every stage.']];
  main.innerHTML = `
  ${hero({ kicker: 'Contact', title: 'Tell me about your <em class="font-serif font-normal italic">next</em> video.', lead: `Share your channel and what you need. I reply ${CONFIG.responseTime} with a plan.` })}
  <section class="pb-24 sm:pb-32" aria-label="Inquiry"><div class="shell grid gap-12 lg:grid-cols-12">
    <aside class="lg:col-span-4" aria-label="Contact details"><div class="lg:sticky lg:top-28 space-y-10">
      <div data-reveal><p class="label mb-3">Email</p><a class="u-link break-all font-display text-xl font-semibold tracking-tight text-white" href="mailto:${CONFIG.contactEmail}">${CONFIG.contactEmail}</a><p class="mt-2 text-sm text-ash">Replies ${CONFIG.responseTime}.</p></div>
      <ol class="space-y-6" aria-label="What happens next">${steps.map(([n, t, d]) => `<li class="flex gap-4" data-reveal><span class="label pt-1 text-ember">${n}</span><span><span class="block font-display font-semibold text-white">${t}</span><span class="mt-1 block text-sm leading-relaxed text-ash">${d}</span></span></li>`).join('')}</ol>
      ${CONFIG.bookingUrl ? `<a href="${CONFIG.bookingUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost"><span>Book a call instead</span></a>` : ''}
    </div></aside>
    <div class="glass rounded-2xl p-6 sm:p-10 lg:col-span-8" id="form-host" data-reveal></div>
  </div></section>`;
  mountContactForm(main.querySelector<HTMLElement>('#form-host')!, { prefix: 'pf', service: SERVICE_PARAM(), budget: BUDGET_PARAM() });
});
