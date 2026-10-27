import { boot, ready } from '../boot';
import { renderWhy, renderPipeline, renderStack, renderTestimonials, renderFaq, renderMarquee } from '../components/render';
import { initHero } from '../features/hero';
import { initBento } from '../features/bento';
import { initHomeWork } from '../features/homeWork';
import { initFaq } from '../features/faq';
import { initPipeline } from '../features/pipeline';
import { initPortraits } from '../components/portrait';
import { loadVideoManifest } from '../data/videoManifest';

boot();
await loadVideoManifest();
renderMarquee(); renderWhy(); renderPipeline(); renderStack(); renderTestimonials(); renderFaq();
initBento(); initHomeWork(); initHero(); initFaq(); initPipeline(); initPortraits();
void ready();
