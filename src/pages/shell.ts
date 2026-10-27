import { boot, ready } from '../boot';
import { esc } from '../components/util';
import { ctaBand } from '../components/cta';
import { loadVideoManifest } from '../data/videoManifest';

export { ctaBand };

/** Page bootstrap with an error boundary: a failed render shows a friendly recovery panel, never a blank page. */
export function startPage(render: (main: HTMLElement) => void | Promise<void>): void {
  boot();
  const main = document.getElementById('main')!;
  void (async () => {
    try { await loadVideoManifest(); await render(main); }
    catch (e) {
      console.error('[page] render failed', e);
      main.innerHTML = `<section class="pb-32 pt-44"><div class="shell"><p class="label mb-5">Something went wrong</p><h1 class="h1-case font-display font-semibold text-white">This page failed to load.</h1><p class="mt-6 max-w-lg text-ash">Please refresh, or head back to the homepage.</p><div class="mt-10 flex gap-3"><button class="btn btn-primary" onclick="location.reload()"><span>Reload</span></button><a href="/" class="btn btn-ghost"><span>Home</span></a></div></div></section>`;
    }
    void ready();
  })();
}

/** Keep title/description correct on client-side renders (dynamic routes, dev server). */
export function setMeta(title: string, description?: string, noindex = false): void {
  document.title = title;
  const set = (sel: string, attr: string, v: string) => document.head.querySelector(sel)?.setAttribute(attr, v);
  if (description) { set('meta[name="description"]', 'content', description); set('meta[property="og:description"]', 'content', description); }
  set('meta[property="og:title"]', 'content', title);
  if (noindex) set('meta[name="robots"]', 'content', 'noindex, follow');
}

export const hero = (o: { kicker: string; title: string; lead?: string; extra?: string; tall?: boolean }) => `
<header class="relative overflow-hidden ${o.tall ? 'pb-16' : 'pb-12'} pt-36 sm:pt-44">
  <div class="microgrid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_70%_at_30%_20%,#000,transparent_75%)]" aria-hidden="true"></div>
  <div class="pointer-events-none absolute -right-32 -top-20 h-[30rem] w-[30rem] rounded-full bg-ember/10 blur-[140px]" aria-hidden="true"></div>
  <div class="shell relative">
    <p class="label mb-7" data-reveal>${o.kicker}</p>
    <h1 class="h1-case max-w-5xl font-display font-semibold text-white" data-split>${o.title}</h1>
    ${o.lead ? `<p class="mt-8 max-w-2xl text-[17px] leading-relaxed text-bone/75 sm:text-lg" data-reveal>${o.lead}</p>` : ''}
    ${o.extra ?? ''}
  </div>
</header>`;

export const notFound = (what: string, backHref: string, backLabel: string) => `
<section class="pb-32 pt-44"><div class="shell"><p class="label mb-5">404 · ${esc(what)} not found</p>
<h1 class="h1-case font-display font-semibold text-white">I couldn't find that <em class="font-serif font-normal italic">${esc(what.toLowerCase())}</em>.</h1>
<p class="mt-6 max-w-lg text-ash">The link may be outdated or mistyped.</p>
<div class="mt-10 flex flex-col gap-3 sm:flex-row"><a href="${backHref}" class="btn btn-primary"><span>${esc(backLabel)}</span></a><a href="/" class="btn btn-ghost"><span>Back to home</span></a></div></div></section>`;

export const SERVICE_PARAM = () => new URLSearchParams(location.search).get('service') ?? undefined;
export const BUDGET_PARAM = () => new URLSearchParams(location.search).get('budget') ?? undefined;
export const lastSegment = () => decodeURIComponent(location.pathname.replace(/\/+$/, '').split('/').pop() ?? '');
