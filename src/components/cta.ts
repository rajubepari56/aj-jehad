export const ctaBand = (kicker = 'Ready when you are') => `
<section class="section relative overflow-hidden border-t border-white/10" aria-labelledby="cta-h">
  <div class="microgrid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_20%_30%,#000,transparent_75%)]" aria-hidden="true"></div>
  <div class="shell relative flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
    <div><p class="label mb-5">${kicker}</p><h2 id="cta-h" class="h2 max-w-3xl" data-split>Want high-retention visuals like <em>this</em>? Book your project.</h2></div>
    <a href="/contact" class="btn btn-primary shrink-0" data-mag-auto="0.28"><span>Book Your Project</span><span aria-hidden="true">→</span></a>
  </div>
</section>`;
