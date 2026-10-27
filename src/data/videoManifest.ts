import { PROJECTS } from './projects';
import { SHOWREEL } from './showreel';

interface Entry { src?: string; preview?: string; poster?: string }
interface Manifest { showreel?: Entry; projects?: Record<string, Entry> }

let loading: Promise<void> | null = null;

/**
 * Optional runtime overrides from /videos/videos.json: lets the owner point projects at MP4 files hosted on the
 * site (which can autoplay) without rebuilding. Missing or empty entries keep the Google Drive links.
 */
export function loadVideoManifest(): Promise<void> {
  loading ??= (async () => {
    try {
      const res = await fetch('/videos/videos.json', { cache: 'no-cache' });
      if (!res.ok || !(res.headers.get('content-type') ?? '').includes('json')) return;
      const m = (await res.json()) as Manifest;
      if (m.showreel?.src) SHOWREEL.src = m.showreel.src;
      if (m.showreel?.poster) SHOWREEL.poster = m.showreel.poster;
      for (const p of PROJECTS) {
        const e = m.projects?.[p.slug];
        if (!e) continue;
        if (e.src) p.video.src = e.src;
        if (e.preview) p.video.preview = e.preview;
        if (e.poster) p.video.poster = e.poster;
      }
    } catch { /* no manifest or invalid JSON: keep defaults */ }
  })();
  return loading;
}
