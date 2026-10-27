import { esc } from './util';

export const faqHtml = (items: { q: string; a: string }[], prefix = 'faq') => items.map((f, i) => `
  <div class="faq-item border-t border-white/10 last:border-b" data-open="false" data-reveal>
    <h3><button type="button" class="flex w-full items-center justify-between gap-6 py-6 text-left font-display text-lg font-medium tracking-tight text-white sm:py-7 sm:text-2xl" aria-expanded="false" aria-controls="${prefix}-${i}" id="${prefix}-btn-${i}">
      <span>${esc(f.q)}</span><span class="faq-plus shrink-0 font-mono text-2xl font-light" aria-hidden="true">+</span></button></h3>
    <div class="faq-panel" id="${prefix}-${i}" role="region" aria-labelledby="${prefix}-btn-${i}"><div class="overflow-hidden"><p class="max-w-2xl pb-7 text-[15px] leading-relaxed text-ash sm:text-base">${esc(f.a)}</p></div></div>
  </div>`).join('');
