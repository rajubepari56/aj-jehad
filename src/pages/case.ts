import { startPage, ctaBand, setMeta, notFound, lastSegment } from './shell';
import { esc } from '../components/util';
import { mountPlayer } from '../components/player';
import { beforeAfterHtml, initBeforeAfter } from '../components/ba';
import { architectureHtml } from '../components/arch';
import { sceneLayers } from '../components/scenes';
import { PROJECTS, TOOLS, CATEGORY_LABEL, bySlug, caseUrl, driveId, posterUrl, type Project } from '../data/projects';


function hostHtml(pr: Project, i: number): string {
  const tall = pr.ratio === '9:16';
  return `<div class="case-player curtain relative overflow-hidden rounded-[3px] border border-white/10 bg-black ${tall ? 'aspect-[9/16]' : 'aspect-video'}" data-curtain data-i="${i}">
    <div class="monitor absolute inset-0">${sceneLayers(pr.slug + i, pr.hue)}</div></div>`;
}
const metricCard = (m: Project['metrics'][number], i: number) => `
  <li class="glass relative flex flex-col justify-between rounded-xl p-6 sm:p-7" data-reveal style="--d:${i * 70}ms">
    <div class="flex items-start justify-between gap-3"><span class="label">${esc(m.label)}</span>
      <span class="label rounded-full border ${m.status === 'verified' ? 'border-ember/60 text-ember' : 'border-dashed border-white/25'} px-2.5 py-1 text-[9px]">${m.status === 'verified' ? 'Verified' : 'Pending verification'}</span></div>
    <p class="mt-10 font-display text-[clamp(2.6rem,5vw,4.2rem)] font-semibold leading-none tracking-[-0.04em] ${m.value ? 'text-white' : 'text-white/25'}">${m.value ? esc(m.value) : '—'}</p>
    <p class="mt-4 text-sm text-ash">${esc(m.note)}</p></li>`;

startPage((main) => {
const p = bySlug(lastSegment());
if (!p) { setMeta('Case study not found — Mahadi Jehad Edits', undefined, true); main.innerHTML = notFound('Case study', '/case-studies', 'All case studies'); return; }
{
  setMeta(`${p.title} — ${p.detailed ? "Case Study" : "Work Sample"} · Mahadi Jehad Edits`, p.summary);
  const idx = PROJECTS.indexOf(p), next = PROJECTS[(idx + 1) % PROJECTS.length], prev = PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length];
  const tall = p.ratio === '9:16';
  main.innerHTML = `
  <article>
  <header class="relative overflow-hidden pb-14 pt-36 sm:pt-44">
    <div class="microgrid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_70%_at_30%_20%,#000,transparent_75%)]" aria-hidden="true"></div>
    <div class="shell relative">
      <a href="/case-studies" class="u-link label mb-8 inline-block !text-ash hover:!text-white">← All case studies</a>
      <p class="label mb-6 flex flex-wrap items-center gap-3" data-reveal><span class="text-ember">${CATEGORY_LABEL[p.category]}</span><span class="h-px w-8 bg-white/20"></span><span>${esc(p.niche)}</span>${p.sample ? '<span class="rounded-full border border-dashed border-white/25 px-2.5 py-1 text-[9px]">Sample project</span>' : ''}</p>
      <h1 class="h1-case max-w-5xl font-display font-semibold text-white" data-split>${esc(p.title)}</h1>
      <p class="mt-8 max-w-2xl text-[17px] leading-relaxed text-bone/75 sm:text-lg" data-reveal>${esc(p.summary)}</p>
      <dl class="mt-12 grid gap-x-10 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
        <div><dt class="label">Platform</dt><dd class="mt-2 font-display font-semibold text-white">${p.platform}</dd></div>
        <div class="lg:col-span-2"><dt class="label">Client profile</dt><dd class="mt-2 max-w-md text-[15px] leading-relaxed text-bone/80"><span class="font-display font-semibold text-white">${esc(p.client.name)}</span><br>${esc(p.client.profile)}</dd></div>
        <div><dt class="label">Format · Year</dt><dd class="mt-2 font-display font-semibold text-white">${p.ratio} · ${p.year}</dd></div>
      </dl>
      <ul class="mt-8 flex flex-wrap gap-2" aria-label="Software used" data-reveal>${p.tools.map((t) => `<li class="badge-tool"><b>${TOOLS[t].abbr}</b>${TOOLS[t].name}</li>`).join('')}</ul>
    </div>
  </header>

  <section class="pb-16 sm:pb-24" aria-label="Video showcase"><div class="shell">
    ${tall && p.detailed
      ? `<div class="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-auto lg:grid lg:max-w-4xl lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0">${[0, 1, 2].map((i) => `<div class="w-[64vw] shrink-0 snap-center sm:w-[38vw] lg:w-auto">${hostHtml(p, i)}<p class="label mt-3">Clip ${String(i + 1).padStart(2, '0')}</p></div>`).join('')}</div>`
      : tall ? `<div class="mx-auto w-[min(22rem,80vw)]">${hostHtml(p, 0)}</div>` : hostHtml(p, 0)}
  ${p.video.src ? `<p class="mt-5 flex flex-wrap gap-x-6 gap-y-2"><a class="label u-link !text-white" href="${driveId(p.video.src) ? `https://drive.google.com/file/d/${driveId(p.video.src)}/view` : p.video.src}" target="_blank" rel="noopener noreferrer">Open this video in a new tab ↗</a><span class="label">Tip: use the full-screen button inside the player</span></p>` : ''}
  </div></section>

  ${p.detailed ? `  <section class="section section-tight" aria-labelledby="ch-h"><div class="shell grid gap-12 lg:grid-cols-12">
    <div class="lg:col-span-5"><p class="label mb-5" data-reveal>( 01 ) The challenge</p><h2 id="ch-h" class="h2" data-split>What was holding it <em>back</em>.</h2></div>
    <div class="lg:col-span-7"><p class="text-[clamp(1.2rem,2vw,1.6rem)] font-medium leading-snug tracking-tight text-white/90" data-reveal>${esc(p.challenge.summary)}</p>
      <ul class="mt-10 divide-y divide-white/10 border-y border-white/10">${p.challenge.symptoms.map((s, i) => `<li class="flex items-start gap-4 py-5" data-reveal style="--d:${i * 70}ms"><i class="mt-2 h-2 w-2 shrink-0 rotate-45 bg-ember"></i><span class="text-[15px] leading-relaxed text-bone/80">${esc(s)}</span></li>`).join('')}</ul></div>
  </div></section>` : ''}

  <section class="section section-tight bg-char/50" aria-labelledby="sol-h"><div class="shell grid gap-12 lg:grid-cols-12">
    <div class="lg:col-span-5"><div class="lg:sticky lg:top-32"><p class="label mb-5" data-reveal>${p.detailed ? '( 02 ) The editorial solution' : '( 01 ) How I edit this kind of video'}</p><h2 id="sol-h" class="h2" data-split>Engineered for the <em>first five seconds</em> and every second after.</h2>
      <div class="glass mt-10 rounded-xl p-5" data-reveal><span class="label">Narrative pacing curve · illustrative</span>
        <svg viewBox="0 0 300 90" class="mt-3 w-full" fill="none" aria-hidden="true"><path d="M0 76H300M0 46H300M0 16H300" stroke="rgb(255 255 255 / .06)"/><path d="M0 14C28 14 40 38 70 40S110 30 140 44 190 36 220 50 270 42 300 54" stroke="#5ce1ff" stroke-width="1.6"/><g fill="#ff3b1f"><path d="M70 34l5 6-5 6-5-6z"/><path d="M140 38l5 6-5 6-5-6z"/><path d="M220 44l5 6-5 6-5-6z"/></g></svg>
        <p class="mt-2 text-xs text-ash">Diamonds mark pattern interrupts placed to lift attention before it drops.</p></div></div></div>
    <ol class="lg:col-span-7">${p.solution.map((s, i) => `<li class="grid gap-3 border-t border-white/10 py-8 last:border-b sm:grid-cols-[7rem_1fr]" data-reveal style="--d:${i * 40}ms"><span class="label pt-1 text-ember">${String(i + 1).padStart(2, '0')} · ${esc(s.step)}</span><div><h3 class="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">${esc(s.title)}</h3><p class="mt-3 max-w-lg text-[15px] leading-relaxed text-ash">${esc(s.body)}</p></div></li>`).join('')}</ol>
  </div></section>

  ${p.detailed ? `  <section class="section section-tight" aria-labelledby="bd-h"><div class="shell">
    <div class="mb-12 max-w-3xl"><p class="label mb-5" data-reveal>( 03 ) Interactive breakdown</p><h2 id="bd-h" class="h2" data-split>From raw footage to <em>final cut</em>.</h2></div>
    <div class="grid gap-10"><div data-reveal>${beforeAfterHtml(p.slug, p.hue)}<p class="label mt-3">Drag the handle, or focus it and use the arrow keys. Illustrative frames until real footage is connected.</p></div>
    ${architectureHtml(p)}</div>
  </div></section>

  <section class="section section-tight bg-char/50" aria-labelledby="mt-h"><div class="shell">
    <div class="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p class="label mb-5" data-reveal>( 04 ) Key performance metrics</p><h2 id="mt-h" class="h2" data-split>Results that <em>hold up</em>.</h2></div>
      <p class="max-w-xs text-sm text-ash" data-reveal>Only verified numbers are displayed. Pending slots show where analytics screenshots or figures will go.</p></div>
    <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">${p.metrics.map(metricCard).join('')}</ul>
  </div></section>` : ''}

  <section class="section section-tight" aria-labelledby="tk-h"><div class="shell">
    <div class="mb-10"><p class="label mb-5" data-reveal>${p.detailed ? '( 05 )' : '( 02 )'} Creative toolkit</p><h2 id="tk-h" class="h2" data-split>Built with.</h2></div>
    <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">${p.tools.map((t, i) => `<li class="glass flex items-center gap-5 rounded-xl p-5" data-reveal style="--d:${i * 60}ms"><span class="grid h-14 w-14 shrink-0 place-items-center rounded-lg border border-white/15 bg-obs font-display text-xl font-bold text-white">${TOOLS[t].abbr}</span><span><span class="block font-display font-semibold text-white">${TOOLS[t].name}</span><span class="text-sm text-ash">${TOOLS[t].role}</span></span></li>`).join('')}</ul>
  </div></section>
  ${ctaBand('Your project is next')}
  <nav class="border-t border-white/10 py-10" aria-label="More projects"><div class="shell grid gap-6 sm:grid-cols-2">
    ${[[prev, '← Previous'], [next, 'Next →']].map(([q, l]) => `<a href="${caseUrl(q as Project)}" class="group block rounded-xl border border-white/10 p-6 transition-[border-color,transform] duration-200 ease-micro hover:border-white/30"><span class="label">${l}</span><span class="mt-3 block font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">${esc((q as Project).title)}</span></a>`).join('')}
  </div></nav></article>`;

  // lazy-mount heavy players only when they approach the viewport
  const hosts = Array.from(document.querySelectorAll<HTMLElement>('.case-player'));
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return; io.unobserve(en.target);
    const h = en.target as HTMLElement, i = Number(h.dataset.i);
    mountPlayer(h, { title: p.title + (tall ? ` · clip ${i + 1}` : ''), ratio: p.ratio, hue: p.hue + i * 18, seed: p.slug + i, duration: Math.min(p.duration, 90), src: i === 0 ? p.video.src : undefined, poster: i === 0 ? posterUrl(p) : undefined, autoplay: true, muted: true });
    h.removeAttribute('data-curtain-wait');
  }), { rootMargin: '200px' });
  hosts.forEach((h) => io.observe(h));
  const ba = document.querySelector<HTMLElement>('[data-ba]'); if (ba) initBeforeAfter(ba);
}
});
