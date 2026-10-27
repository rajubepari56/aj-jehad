import { CONFIG } from '../config';
import { SERVICES, serviceUrl } from '../data/services';

const links: [string, string][] = [['Work', '/case-studies'], ['Services', '/services'], ['Process', '/process'], ['Pricing', '/pricing'], ['About', '/about']];
const isActive = (href: string, path: string) => (href === '/' ? path === '/' : path === href || path.startsWith(href + '/'));

const header = (path: string) => `
<a href="#main" class="sr-only z-[100] rounded bg-white px-4 py-2 text-obs focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
<header id="site-header" data-scrolled="false" data-hidden="false" class="site-header nav-fade fixed inset-x-0 top-0 z-50">
  <div id="progress" class="absolute left-0 top-0 h-[2px] w-full origin-left scale-x-0 bg-ember"></div>
  <div class="shell">
    <nav aria-label="Primary" class="nav-bar mt-3 flex items-center justify-between rounded-full border border-transparent px-4 py-2.5 sm:px-5">
      <a href="/" class="flex items-center gap-3">
        <span class="grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-obs"><svg viewBox="0 0 24 24" class="h-4 w-4 text-ember" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span>
        <span class="font-display text-[15px] font-semibold leading-none tracking-tight text-white">Mahadi Jehad<span class="block pt-1 font-mono text-[9px] font-normal uppercase tracking-[0.2em] text-ash">Edits · Motion</span></span>
      </a>
      <ul class="hidden items-center gap-7 lg:flex">${links.map(([l, h]) => `<li><a href="${h}" class="nav-link u-link" ${isActive(h, path) ? 'aria-current="page"' : ''}>${l}</a></li>`).join('')}</ul>
      <div class="flex items-center gap-2">
        <a href="/contact" class="btn btn-primary hidden !px-5 !py-2.5 !text-[13px] sm:inline-flex" data-mag-auto="0.25" ${isActive('/contact', path) ? 'aria-current="page"' : ''}><span>Book an Edit</span></a>
        <button id="menu-toggle" type="button" class="menu-toggle grid h-10 w-10 place-items-center rounded-full border border-white/15 lg:hidden" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">
          <span class="relative block h-3 w-4"><i class="absolute left-0 top-0 h-px w-4 bg-white transition-transform duration-200 ease-micro"></i><i class="absolute bottom-0 left-0 h-px w-4 bg-white transition-transform duration-200 ease-micro"></i></span>
        </button>
      </div>
    </nav>
  </div>
</header>
<div id="mobile-menu" data-open="false" inert class="mobile-menu fixed inset-0 z-40 flex flex-col justify-end overflow-y-auto bg-obs/95 px-6 pb-10 pt-28 backdrop-blur-xl lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
  <ul class="space-y-0.5">${[...links, ['Showreel', '/showreel']].map(([l, h], i) => `<li class="mm-line" style="--i:${i}"><a href="${h}" class="block py-1.5 font-display text-[2.6rem] font-semibold leading-tight tracking-tighter text-white" ${isActive(h, path) ? 'aria-current="page"' : ''}><span class="mm-in">${l}</span></a></li>`).join('')}</ul>
  <a href="/contact" class="btn btn-primary mm-line mt-8 w-full" style="--i:6"><span>Book an Edit</span></a>
</div>`;

const social = ([['X / Twitter', CONFIG.social.x], ['YouTube', CONFIG.social.youtube], ['Discord', CONFIG.social.discord], ['Upwork', CONFIG.social.upwork], ['Fiverr', CONFIG.social.fiverr], ['LinkedIn', CONFIG.social.linkedin]] as [string, string][])
  .map(([n, u]) => u
    ? `<li><a href="${u}" target="_blank" rel="noopener noreferrer" class="u-link inline-flex items-center gap-2 py-1 text-[15px] text-bone">${n}<span aria-hidden="true">↗</span><span class="sr-only">(opens in a new tab)</span></a></li>`
    : `<li><span class="inline-flex items-center gap-2 py-1 text-[15px] text-ash">${n}<span class="label text-[9px]">coming soon</span></span></li>`).join('');

const footer = () => `
<footer class="relative overflow-hidden border-t border-white/10 pt-20" aria-label="Site footer">
  <div class="shell grid gap-14 lg:grid-cols-12">
    <div class="lg:col-span-4"><p class="font-display text-2xl font-semibold leading-tight tracking-tight text-white">High-retention visual storytelling<br />that scales channels &amp; brands.</p>
      <a href="mailto:${CONFIG.contactEmail}" class="u-link mt-6 inline-block font-mono text-sm text-bone">${CONFIG.contactEmail}</a>
      <p class="mt-2 text-sm text-ash">Replies ${CONFIG.responseTime}.</p></div>
    <nav aria-label="Footer" class="lg:col-span-2 lg:col-start-6"><p class="label mb-4">Explore</p><ul class="space-y-1 text-[15px] text-bone">
      ${[['Case studies', '/case-studies'], ['Showreel', '/showreel'], ['Process', '/process'], ['Pricing', '/pricing'], ['About', '/about'], ['Contact', '/contact']].map(([n, h]) => `<li><a class="u-link py-1" href="${h}">${n}</a></li>`).join('')}</ul></nav>
    <nav aria-label="Services" class="lg:col-span-2"><p class="label mb-4">Services</p><ul class="space-y-1 text-[15px] text-bone">${SERVICES.slice(0, 5).map((s) => `<li><a class="u-link py-1" href="${serviceUrl(s)}">${s.title.replace('High-Retention ', '').replace('Viral ', '').replace(' Content', '')}</a></li>`).join('')}</ul></nav>
    <div class="lg:col-span-2"><p class="label mb-4">Connect</p><ul class="space-y-1">${social}</ul></div>
    <nav aria-label="Legal" class="lg:col-span-1"><p class="label mb-4">Legal</p><ul class="space-y-1 text-[15px] text-bone"><li><a class="u-link py-1" href="/privacy-policy">Privacy</a></li><li><a class="u-link py-1" href="/terms">Terms</a></li></ul></nav>
  </div>
  <p class="pointer-events-none mt-16 select-none text-center font-display font-bold leading-[0.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.14)] text-[clamp(6rem,26vw,24rem)]" aria-hidden="true">MJE</p>
  <div class="shell relative -mt-6 flex flex-col justify-between gap-2 border-t border-white/10 py-6 sm:flex-row"><p class="label">© ${new Date().getFullYear()} ${CONFIG.brand}. All rights reserved.</p><p class="label flex flex-wrap items-center gap-x-5 gap-y-2"><button type="button" id="motion-toggle" class="u-link" aria-pressed="true">Animations: On</button><span>Edited with intent.</span></p></div>
</footer>`;

const dialogs = () => `
<dialog id="player" aria-labelledby="player-title" class="m-auto w-[min(1100px,94vw)] bg-transparent p-0 text-bone">
  <div class="glass rounded-2xl p-3 sm:p-5">
    <div class="mb-4 flex items-center justify-between gap-4 px-1">
      <div><h2 id="player-title" class="font-display text-lg font-semibold tracking-tight text-white"></h2><p id="player-meta" class="label mt-1"></p></div>
      <div class="flex items-center gap-2"><a id="player-case" href="#" class="btn btn-ghost hidden !px-4 !py-2 !text-[13px] sm:inline-flex">Read case study</a>
      <button type="button" data-close-player class="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition-colors duration-200 ease-micro hover:border-ember hover:text-ember" aria-label="Close player"><svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div>
    </div>
    <div id="player-stage" class="mx-auto"></div>
  </div>
</dialog>
<dialog id="inquiry-dialog" aria-label="Project inquiry" class="m-auto max-h-[92svh] w-[min(52rem,94vw)] bg-transparent p-0 text-bone">
  <div class="glass relative max-h-[92svh] overflow-y-auto rounded-2xl p-5 sm:p-9">
    <button type="button" data-close-inquiry class="sticky top-0 float-right z-10 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-obs text-white hover:border-ember hover:text-ember" aria-label="Close inquiry form"><svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
    <div id="inquiry-body"></div>
  </div>
</dialog>`;

/** Shared site chrome so every route has identical header, footer and dialogs. */
export function mountChrome(): void {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  document.body.insertAdjacentHTML('afterbegin', header(path));
  document.body.insertAdjacentHTML('afterbegin', '<div class="grain" aria-hidden="true"></div>');
  document.body.insertAdjacentHTML('beforeend', footer() + dialogs());
}
