import { WHY, PIPELINE, STACK, TESTIMONIALS, FAQ, PLATFORMS } from '../data';


export function renderWhy(): void {
  document.getElementById('why-grid')!.innerHTML = WHY.map((w, i) => `
  <article class="glass microgrid group relative overflow-hidden rounded-xl p-7 sm:p-9 ${i % 2 ? 'lg:translate-y-14' : ''}" data-reveal style="--d:${i * 90}ms">
    <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-ember/0 blur-3xl transition-colors duration-700 group-hover:bg-ember/20"></div>
    <span class="label text-ember">${w.n}</span>
    <h3 class="mt-16 font-display text-2xl font-semibold tracking-tight text-white sm:text-[1.75rem]">${w.title}</h3>
    <p class="mt-3 max-w-sm text-[15px] leading-relaxed text-ash">${w.body}</p>
  </article>`).join('');
}

export function renderPipeline(): void {
  document.getElementById('pipe-steps')!.innerHTML = PIPELINE.map((p) => `
  <li class="step relative pl-10 lg:pl-0 lg:pt-14" data-step>
    <span class="node absolute left-0 top-1.5 h-3.5 w-3.5 rotate-45 border lg:left-0 lg:top-0"></span>
    <div class="step-body"><span class="label text-ash">${p.tc} · ${p.n}</span>
    <h3 class="mt-3 font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">${p.title}</h3>
    <p class="mt-3 max-w-xs text-[15px] leading-relaxed text-ash">${p.body}</p></div>
  </li>`).join('');
}

export function renderStack(): void {
  document.getElementById('stack-grid')!.innerHTML = STACK.map((s, i) => `
  <li class="glass group flex items-center gap-5 rounded-xl p-5 transition-colors duration-500 hover:border-white/25 sm:p-6 lg:flex-col lg:items-start lg:gap-14" data-reveal style="--d:${i * 70}ms">
    <span class="grid h-14 w-14 shrink-0 place-items-center rounded-lg border border-white/15 bg-obs font-display text-xl font-bold tracking-tight text-white transition-all duration-500 group-hover:border-ember group-hover:text-ember">${s.abbr}</span>
    <div><h3 class="font-display text-lg font-semibold tracking-tight text-white">${s.name}</h3><p class="mt-1 text-sm text-ash">${s.role}</p></div>
  </li>`).join('');
}

export function renderTestimonials(): void {
  document.getElementById('quotes')!.innerHTML = TESTIMONIALS.map((t, i) => `
  <figure class="glass relative flex flex-col justify-between rounded-xl p-7 sm:p-9 ${i === 0 ? 'lg:col-span-7 lg:row-span-2 lg:p-12' : 'lg:col-span-5'}" data-reveal style="--d:${i * 100}ms">
    <div>
      <div class="flex items-center justify-between">
        <span class="font-serif text-6xl leading-none text-ember" aria-hidden="true">“</span>
        <span class="label rounded-full border border-dashed border-white/20 px-3 py-1.5">Placeholder</span>
      </div>
      <blockquote class="mt-4 font-display ${i === 0 ? 'text-[clamp(1.4rem,2.4vw,2.2rem)]' : 'text-lg sm:text-xl'} font-medium leading-snug tracking-tight text-white/90">${t.quote}</blockquote>
    </div>
    <figcaption class="mt-10 flex items-center gap-4">
      <span class="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-graph font-mono text-xs text-ash">${t.name.slice(0, 2).toUpperCase()}</span>
      <span><span class="block font-display font-semibold text-white">${t.name}</span><span class="label">${t.role}</span></span>
    </figcaption>
  </figure>`).join('');
}

export function renderFaq(): void {
  document.getElementById('faq-list')!.innerHTML = FAQ.map((f, i) => `
  <div class="faq-item border-t border-white/10 last:border-b" data-open="false" data-reveal>
    <h3><button type="button" class="flex w-full items-center justify-between gap-6 py-6 text-left font-display text-lg font-medium tracking-tight text-white sm:py-7 sm:text-2xl" aria-expanded="false" aria-controls="faq-${i}" id="faq-btn-${i}">
      <span>${f.q}</span><span class="faq-plus shrink-0 font-mono text-2xl font-light" aria-hidden="true">+</span></button></h3>
    <div class="faq-panel" id="faq-${i}" role="region" aria-labelledby="faq-btn-${i}"><div class="overflow-hidden"><p class="max-w-2xl pb-7 text-[15px] leading-relaxed text-ash sm:text-base">${f.a}</p></div></div>
  </div>`).join('');
}

export function renderMarquee(): void {
  const items = PLATFORMS.map((p) => `<li class="flex shrink-0 items-center gap-14 font-display text-2xl font-semibold tracking-tight text-white/45 transition-colors hover:text-white sm:text-3xl">${p}<i class="h-1.5 w-1.5 rotate-45 bg-ember/70"></i></li>`).join('');
  document.getElementById('marquee')!.innerHTML = `<ul class="marquee-track flex w-max gap-14" aria-label="Platforms I edit for">${items}${items}</ul>`;
}

