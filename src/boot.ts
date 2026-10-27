import '@fontsource-variable/inter';
import '@fontsource-variable/inter-tight';
import '@fontsource-variable/jetbrains-mono';
import '@fontsource/instrument-serif/400-italic.css';
import './styles.css';
import './hero.css';
import './bento.css';
import './work.css';
import './pages.css';
import './rm.css';
import './cursor.css';

import { mountChrome } from './components/layout';
import { initNav } from './features/nav';
import { initModal } from './features/modal';
import { initInquiryModal } from './features/inquiry';
import { initMagnetic } from './features/magnetic';
import { initMotion } from './features/motion';
import { initMotionPref } from './features/motionPref';
import { initCursor } from './features/cursor';

/** Shared by every page: chrome, nav, modal, magnetic CTAs and the scroll-reveal system. */
export function boot(): void {
  mountChrome();
  initNav(); initModal(); initInquiryModal(); initMotionPref(); initCursor();
}
/** Wait for the faces the layout depends on so late font swaps can never shift content (CLS = 0). */
const fontsLoaded = () => Promise.race([
  Promise.all(['600 1em "Inter Tight Variable"', '400 1em "Inter Variable"', '400 1em "JetBrains Mono Variable"', 'italic 400 1em "Instrument Serif"'].map((f) => document.fonts?.load(f).catch(() => []))),
  new Promise((r) => setTimeout(r, 1200)),
]);

export async function ready(): Promise<void> {
  await fontsLoaded();
  document.documentElement.classList.add('fonts-ready');
  initMagnetic(); initMotion();
  requestAnimationFrame(() => document.documentElement.classList.add('is-loaded'));
}
