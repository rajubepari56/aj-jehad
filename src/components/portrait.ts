import { CONFIG } from '../config';
import { driveId } from '../data/projects';

/**
 * The portrait is looked up in this order, and the first one that loads wins:
 *   1. CONFIG.portraitDriveLink (Google Drive share link)
 *   2. /images/mahadi.jpg, .jpeg, .png, .webp  (any one of these dropped into the images folder)
 * If none exist the neutral "MJ" placeholder stays, so nothing breaks.
 */
export function portraitCandidates(): string[] {
  const id = driveId(CONFIG.portraitDriveLink);
  return [...(id ? [`https://drive.google.com/thumbnail?id=${id}&sz=w1200`] : []), '/images/mahadi.jpg', '/images/mahadi.jpeg', '/images/mahadi.png', '/images/mahadi.webp'];
}

export const portraitImg = (alt: string, className = '') =>
  `<img data-portrait src="${portraitCandidates()[0]}" width="1086" height="1448" loading="lazy" decoding="async" referrerpolicy="no-referrer" alt="${alt}" class="${className}" />`;

/** Cycle `img[data-portrait]` through the candidates on error; remove the image if none load. */
export function initPortraits(root: ParentNode = document): void {
  const list = portraitCandidates();
  root.querySelectorAll<HTMLImageElement>('img[data-portrait]').forEach((img) => {
    let i = 0;
    if (img.getAttribute('src') !== list[0]) img.src = list[0];
    img.addEventListener('error', () => { i += 1; if (i < list.length) img.src = list[i]; else img.remove(); });
  });
}
