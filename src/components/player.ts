import { clamp, esc, reducedMotion } from './util';
import { sceneLayers } from './scenes';

export interface PlayerOpts {
  title: string; ratio: '16:9' | '9:16'; hue: number; seed: string; duration: number;
  src?: string; poster?: string;
  /** Start playing as soon as the player is mounted (YouTube/Vimeo/MP4/HLS). Google Drive embeds can only be pre-loaded: Drive itself blocks autoplay. */
  autoplay?: boolean;
  /** Start muted (required by browsers for autoplay without a click). */
  muted?: boolean;
}
interface Media { duration: number; time: number; paused: boolean; muted: boolean; play(): void; pause(): void; seek(t: number): void; mute(b: boolean): void }

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const CAPS = [['NO', 'WAY'], ['WATCH', 'THIS'], ['WAIT', 'FOR IT']];
const ic = {
  play: '<svg viewBox="0 0 24 24" class="ml-0.5 h-4 w-4" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>',
  vol: '<svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 9.5h3l4-3.5v12l-4-3.5H4zM15 9a4 4 0 0 1 0 6M17.5 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
  mute: '<svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 9.5h3l4-3.5v12l-4-3.5H4zM16 9.5l5 5m0-5-5 5"/></svg>',
  fs: '<svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
};

function embedUrl(src: string, mute = false): string | null {
  const yt = src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0&modestbranding=1&playsinline=1${mute ? '&mute=1' : ''}`;
  const vm = src.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1${mute ? '&muted=1' : ''}`;
  const dr = src.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  return dr ? `https://drive.google.com/file/d/${dr[1]}/preview` : null;
}

/** Clock-driven stand-in used until a real video is connected. Honest: labelled as a video slot. */
function mockMedia(duration: number): Media {
  let t = 0, playing = false, last = 0, muted = false;
  const m: Media = {
    duration, get time() { if (playing) { const n = performance.now(); t = Math.min(duration, t + (n - last) / 1000); last = n; if (t >= duration) { playing = false; } } return t; },
    get paused() { return !playing; }, get muted() { return muted; },
    play() { if (t >= duration) t = 0; playing = true; last = performance.now(); }, pause() { t = m.time; playing = false; },
    seek(v) { t = clamp(v, 0, duration); last = performance.now(); }, mute(b) { muted = b; },
  };
  return m;
}

async function videoMedia(v: HTMLVideoElement, src: string): Promise<Media> {
  if (/\.m3u8($|\?)/.test(src) && !v.canPlayType('application/vnd.apple.mpegurl')) {
    const { default: Hls } = await import('hls.js'); // adaptive streaming, loaded only when needed
    if (Hls.isSupported()) { const h = new Hls({ capLevelToPlayerSize: true }); h.loadSource(src); h.attachMedia(v); }
  } else v.src = src;
  return {
    get duration() { return v.duration || 0; }, get time() { return v.currentTime; }, get paused() { return v.paused; }, get muted() { return v.muted; },
    play() { void v.play(); }, pause() { v.pause(); }, seek(t) { v.currentTime = t; }, mute(b) { v.muted = b; },
  };
}

export interface PlayerHandle { destroy: () => void; seek: (t: number, play?: boolean) => void }

export function mountPlayer(host: HTMLElement, o: PlayerOpts): PlayerHandle {
  const embed = o.src ? embedUrl(o.src, o.muted) : null;
  const isVideo = !!o.src && !embed;
  host.innerHTML = `
  <div class="cine group/c relative h-full w-full overflow-hidden bg-black" tabindex="0" role="group" aria-label="Video player: ${esc(o.title)}. Space to play or pause, arrow keys to seek, M to mute, F for fullscreen.">
    <div class="cine-media absolute inset-0">${isVideo ? `<video class="h-full w-full object-cover" playsinline ${o.muted ? 'muted' : ''} preload="${o.autoplay ? 'auto' : 'metadata'}"></video>` : embed ? '' : `<div class="monitor ${o.autoplay ? '' : ''}" style="position:absolute;inset:0">${sceneLayers(o.seed, o.hue)}</div>`}</div>
    ${embed ? '' : '<div class="cine-cap cap" aria-hidden="true"></div>'}
    ${!o.src ? '<span class="label absolute left-3 top-3 z-[4] rounded-full border border-dashed border-white/25 bg-black/40 px-3 py-1.5 text-white/80 backdrop-blur">Video slot · connect a source</span>' : ''}
    <button type="button" class="cine-big absolute left-1/2 top-1/2 z-[4] grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur transition-[opacity,transform] duration-200 ease-micro hover:scale-105 hover:border-ember hover:bg-ember hover:text-obs" aria-label="Play video">${ic.play}</button>
    ${embed ? '' : `<div class="cine-bar absolute inset-x-0 bottom-0 z-[5] flex items-center gap-3 bg-gradient-to-t from-black/85 to-transparent px-3 pb-3 pt-10 text-white transition-opacity duration-200 ease-micro sm:px-4">
      <button type="button" class="c-play grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/20 hover:border-ember hover:text-ember" aria-label="Play">${ic.play}</button>
      <span class="c-time w-[5.5rem] shrink-0 font-mono text-[11px] tabular-nums text-white/80">0:00 / ${fmt(o.duration)}</span>
      <div class="c-track relative h-6 flex-1 cursor-pointer touch-none select-none" role="slider" tabindex="0" aria-label="Seek" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
        <span class="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-white/20"></span>
        <span class="c-fill absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 origin-left scale-x-0 bg-ember"></span>
        <span class="c-thumb absolute left-0 top-1/2 -mt-[6px] h-3 w-px bg-white"><i class="absolute -left-[4px] -top-[3px] h-[9px] w-[9px] rotate-45 bg-white"></i></span>
      </div>
      <button type="button" class="c-mute grid h-9 w-9 shrink-0 place-items-center rounded-full hover:text-ember" aria-label="Mute">${ic.vol}</button>
      <button type="button" class="c-fs grid h-9 w-9 shrink-0 place-items-center rounded-full hover:text-ember" aria-label="Fullscreen">${ic.fs}</button>
    </div>`}
  </div>`;
  const root = host.querySelector<HTMLElement>('.cine')!;
  const big = root.querySelector<HTMLButtonElement>('.cine-big')!;

  if (embed) { // lite embed: nothing but a poster until the viewer asks for playback
    const layers = document.createElement('div'); layers.className = 'monitor'; layers.style.cssText = 'position:absolute;inset:0';
    layers.innerHTML = sceneLayers(o.seed, o.hue) + (o.poster ? `<img src="${esc(o.poster)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" class="absolute inset-0 z-[2] h-full w-full object-cover" onerror="this.remove()" />` : '');
    root.querySelector('.cine-media')!.appendChild(layers);
    const load = () => { root.querySelector('.cine-media')!.innerHTML = `<iframe class="h-full w-full" src="${embed}" title="${esc(o.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`; big.remove(); };
    big.addEventListener('click', load);
    if (o.autoplay) load(); // the player is already on screen: load it now instead of waiting for a click
    return { destroy: () => { host.innerHTML = ''; }, seek: () => undefined };
  }

  const q = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const playBtn = q('.c-play'), time = q('.c-time'), track = q('.c-track'), fill = q('.c-fill'), thumb = q('.c-thumb'), muteBtn = q('.c-mute'), cap = q('.cine-cap');
  const layers = Array.from(root.querySelectorAll<HTMLElement>('.scene'));
  let media: Media | null = null, raf = 0, scene = -1, idleHide = 0, dragging = false;
  const ready = (async () => {
    media = isVideo ? await videoMedia(root.querySelector('video')!, o.src!) : mockMedia(o.duration);
    return media;
  })();

  const paint = () => {
    if (!media) return;
    const dur = media.duration || o.duration, t = media.time, p = clamp(t / dur);
    fill.style.transform = `scaleX(${p})`;
    thumb.style.transform = `translate3d(${(p * track.clientWidth).toFixed(1)}px,0,0)`;
    time.textContent = `${fmt(t)} / ${fmt(dur)}`;
    track.setAttribute('aria-valuenow', String(Math.round(p * 100)));
    if (!isVideo) {
      const s = Math.min(2, Math.floor(p * 3));
      if (s !== scene) {
        scene = s; layers.forEach((l, i) => l.classList.toggle('on', i === s));
        cap.innerHTML = CAPS[s].map((w, k) => `<span style="--k:${k}">${w}</span>`).join(' ');
      }
    }
    if (media.paused) { sync(); raf = 0; } else raf = requestAnimationFrame(paint);
  };
  const sync = () => {
    const paused = !media || media.paused;
    playBtn.innerHTML = paused ? ic.play : ic.pause; playBtn.setAttribute('aria-label', paused ? 'Play' : 'Pause');
    big.style.opacity = paused ? '1' : '0'; big.style.pointerEvents = paused ? 'auto' : 'none'; big.style.transform = paused ? '' : 'translate(-50%,-50%) scale(.9)';
    big.setAttribute('aria-label', paused ? 'Play video' : 'Pause video');
    muteBtn.innerHTML = media?.muted ? ic.mute : ic.vol; muteBtn.setAttribute('aria-label', media?.muted ? 'Unmute' : 'Mute');
    root.classList.toggle('is-paused', paused);
    root.querySelector('.monitor')?.classList.toggle('playing', !paused);
  };
  const toggle = async () => { const m = await ready; if (m.paused) { m.play(); } else m.pause(); sync(); if (!raf) raf = requestAnimationFrame(paint); wake(); };
  const seekTo = (e: PointerEvent) => { if (!media) return; const r = track.getBoundingClientRect(); media.seek(clamp((e.clientX - r.left) / r.width) * (media.duration || o.duration)); paint(); };
  const wake = () => { root.classList.remove('idle'); clearTimeout(idleHide); idleHide = window.setTimeout(() => { if (media && !media.paused && !dragging) root.classList.add('idle'); }, 2200); };

  big.addEventListener('click', toggle); playBtn.addEventListener('click', toggle);
  muteBtn.addEventListener('click', async () => { const m = await ready; m.mute(!m.muted); sync(); });
  q('.c-fs').addEventListener('click', () => (document.fullscreenElement ? document.exitFullscreen() : root.requestFullscreen?.()));
  track.addEventListener('pointerdown', async (e) => { await ready; dragging = true; track.setPointerCapture(e.pointerId); seekTo(e); });
  track.addEventListener('pointermove', (e) => { if (dragging) seekTo(e); });
  track.addEventListener('pointerup', () => { dragging = false; });
  track.addEventListener('keydown', (e) => { if (!media) return; if (e.key === 'ArrowRight') { media.seek(media.time + 5); paint(); } if (e.key === 'ArrowLeft') { media.seek(media.time - 5); paint(); } });
  root.addEventListener('pointermove', wake);
  root.addEventListener('keydown', (e) => {
    if (e.target !== root) return;
    if (e.key === ' ' || e.key === 'k') { e.preventDefault(); void toggle(); }
    else if (e.key === 'm') muteBtn.click(); else if (e.key === 'f') q('.c-fs').click();
    else if (e.key === 'ArrowRight' && media) { media.seek(media.time + 5); paint(); } else if (e.key === 'ArrowLeft' && media) { media.seek(media.time - 5); paint(); }
  });
  let resume = false;
  void ready.then((m) => {
    if (o.muted) m.mute(true);
    paint(); sync();
    if (o.autoplay && !reducedMotion()) void toggle();
  });
  // autoplaying players pause when scrolled away and resume when visible again
  const vis = o.autoplay && 'IntersectionObserver' in window ? new IntersectionObserver(([en]) => {
    if (!media) return;
    if (!en.isIntersecting && !media.paused) { media.pause(); resume = true; sync(); }
    else if (en.isIntersecting && resume) { resume = false; media.play(); sync(); if (!raf) raf = requestAnimationFrame(paint); }
  }, { threshold: 0.25 }) : null;
  vis?.observe(root);
  sync();
  const seek = (t: number, play = true) => { void ready.then((m) => { m.seek(t); if (play && m.paused) m.play(); paint(); sync(); if (!m.paused && !raf) raf = requestAnimationFrame(paint); }); };
  return { destroy: () => { vis?.disconnect(); cancelAnimationFrame(raf); clearTimeout(idleHide); media?.pause(); host.innerHTML = ''; }, seek };
}
