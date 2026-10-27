import { startPage, hero } from './shell';
import { PRIVACY, TERMS, LEGAL_UPDATED } from '../data/content';
import { CONFIG } from '../config';
import { esc } from '../components/util';

startPage((main) => {
  const privacy = location.pathname.replace(/\/+$/, '').endsWith('privacy-policy');
  const doc = privacy ? PRIVACY : TERMS;
  main.innerHTML = `
  ${hero({ kicker: `Last updated ${LEGAL_UPDATED}`, title: privacy ? 'Privacy <em class="font-serif font-normal italic">policy</em>.' : 'Terms of <em class="font-serif font-normal italic">service</em>.', lead: privacy ? 'How I handle the information you share with me.' : 'Usage rights, revisions, raw footage handover and copyright clearance.' })}
  <section class="pb-24 sm:pb-32"><div class="shell"><article class="prose-doc">${doc.map((s) => `<h2 data-reveal>${esc(s.h)}</h2>${s.p.map((p) => `<p data-reveal>${esc(p)}</p>`).join('')}`).join('')}
    <p class="mt-10">Questions? Email <a class="u-link text-white" href="mailto:${CONFIG.contactEmail}">${CONFIG.contactEmail}</a>.</p></article></div></section>`;
});
