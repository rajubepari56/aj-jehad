import { startPage, notFound, setMeta } from './shell';
startPage((main) => { setMeta('Page not found — Mahadi Jehad Edits', undefined, true); main.innerHTML = notFound('Page', '/', 'Go to homepage'); });
