import { $, $$, clamp, reducedMotion, timecode } from '../components/util';
import { ruler, trackRow, rnd, type TrackDef } from '../components/timeline';
import { sceneSvg } from '../components/scenes';
import { SHOWREEL } from '../data/showreel';

const LEN = 30; // mock sequence length in seconds
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ───────────── timeline mock ───────────── */
const TRACKS: TrackDef[] = [
  { id: 'V2', kind: 'motion', clips: [[3, 10, 'KINETIC_TYPE'], [13, 19, 'LOGO_ANIM'], [22, 28, 'CAPTIONS']] },
  { id: 'V1', kind: 'video', clips: [[0, 8.6, 'GAMEPLAY_A'], [8.8, 16.4, 'FACECAM'], [16.6, 30, 'STORY_B']] },
  { id: 'A1', kind: 'sfx', clips: [[1, 5, 'SFX'], [7, 12, 'IMPACTS'], [15, 21, 'RISER'], [23, 29, 'SFX']] },
  { id: 'A2', kind: 'music', clips: [[0, 30, 'MUSIC_BED']] },
];

function buildTimeline(): void {
  $('#tl-ruler')!.innerHTML = ruler(LEN);
  $('#tl-tracks')!.innerHTML = TRACKS.map((t, ti) => trackRow(t, ti, LEN)).join('');
  $('#meter')!.innerHTML = Array.from({ length: 28 }, (_, i) => {
    const r = rnd(i + 11);
    return `<i style="--t:${(0.45 + r() * 0.7).toFixed(2)}s;--o:${(-r()).toFixed(2)}s;height:${30 + Math.round(Math.abs(Math.sin(i / 3)) * 70)}%"></i>`;
  }).join('');
}

/* ───────────── monitor scenes ───────────── */
const SCENES = [
  { h: 12, cap: ['NO', 'WAY'], cubes: [[52, 50, 11], [98, 56, 15], [126, 44, 8], [76, 66, 7]] },
  { h: 195, cap: ['WATCH', 'THIS'], cubes: [[36, 56, 9], [82, 48, 13], [118, 60, 12], [140, 46, 7]] },
  { h: 275, cap: ['WAIT', 'FOR IT'], cubes: [[60, 58, 14], [104, 48, 10], [30, 46, 8], [132, 62, 9]] },
];

/* ───────────── intro: split text + load choreography ───────────── */
function splitTitle(): void {
  const title = $('#hero-title')!;
  let word = 0;
  $$('.w', title).forEach((w) => {
    // keep inline children (<em>) intact: split the text nodes inside them
    const walk = (node: Node, count: { n: number }) => {
      Array.from(node.childNodes).forEach((c) => {
        if (c.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          [...(c.textContent ?? '')].forEach((ch) => {
            const s = document.createElement('span');
            s.className = 'ch'; s.textContent = ch;
            s.style.setProperty('--d', String(180 + word * 95 + count.n++ * 24));
            frag.appendChild(s);
          });
          c.replaceWith(frag);
        } else walk(c, count);
      });
    };
    walk(w, { n: 0 });
    word++;
  });
  title.classList.add('is-split');
}

async function intro(): Promise<void> {
  splitTitle();
}

/* ───────────── 2.5D parallax + cursor light ───────────── */
function initParallax(root: HTMLElement): void {
  if (!matchMedia('(pointer: fine)').matches || reducedMotion()) return;
  const layers = $$('[data-depth]', root).map((el) => ({ el, d: Number(el.dataset.depth) }));
  const tilt = $('.tilt', root)!;
  const spot = $('#spot', root)!;
  let tx = 0, ty = 0, cx = 0, cy = 0, sx = 0, sy = 0, raf = 0;

  const frame = () => {
    cx = lerp(cx, tx, 0.075); cy = lerp(cy, ty, 0.075);
    layers.forEach(({ el, d }) => { el.style.transform = `translate3d(${(cx * d * -26).toFixed(2)}px, ${(cy * d * -20).toFixed(2)}px, 0)`; });
    tilt.style.transform = `rotateY(${(cx * 6).toFixed(2)}deg) rotateX(${(cy * -5).toFixed(2)}deg)`;
    spot.style.transform = `translate3d(${sx}px, ${sy}px, 0)`;
    raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.0008 ? requestAnimationFrame(frame) : 0;
  };
  root.addEventListener('pointermove', (e) => {
    const r = root.getBoundingClientRect();
    tx = (e.clientX - r.left) / r.width - 0.5; ty = (e.clientY - r.top) / r.height - 0.5;
    sx = e.clientX - r.left; sy = e.clientY - r.top;
    spot.classList.add('on');
    if (!raf) raf = requestAnimationFrame(frame);
  });
  root.addEventListener('pointerleave', () => { tx = 0; ty = 0; spot.classList.remove('on'); if (!raf) raf = requestAnimationFrame(frame); });
}

/* ───────────── monitor + timeline playback ───────────── */
function initPlayer(): void {
  const panel = $('#hero-visual')!;
  const lane = $('#tl-lane')!;
  const head = $('#tl-head')!;
  const tc = $('#tl-tc')!;
  const mon = $('#mon')!;
  const scrub = $('#tl-scrub')!;
  const toggle = $<HTMLButtonElement>('#tl-toggle')!;
  const label = $('#mon-scene')!;
  const state = $('#mon-state')!;
  const cap = $('#cap')!;
  const touchOnly = matchMedia('(hover: none)').matches;
  const still = reducedMotion();

  buildTimeline();
  const layers = SCENES.map((s) => {
    const el = document.createElement('div');
    el.className = 'scene'; el.style.setProperty('--h', String(s.h)); el.innerHTML = sceneSvg(s.cubes);
    $('#scenes')!.appendChild(el);
    return el;
  });

  // If the showreel is an MP4/WebM hosted on this site (see videos/videos.json), the monitor plays it: muted, looping, only while visible.
  if (/\.(mp4|webm)(\?|$)/i.test(SHOWREEL.src)) {
    const v = document.createElement('video');
    Object.assign(v, { muted: true, loop: true, playsInline: true, autoplay: true, preload: 'auto', src: SHOWREEL.src });
    v.className = 'absolute inset-0 z-[1] h-full w-full object-cover';
    v.addEventListener('error', () => v.remove());
    $('#scenes')!.appendChild(v); cap.hidden = true;
    new IntersectionObserver(([en]) => { if (en.isIntersecting) void v.play().catch(() => undefined); else v.pause(); }, { threshold: 0.25 }).observe(v);
  }

  // A YouTube showreel plays inside the monitor: muted, looping, started once the page is idle and only while visible.
  const yt = SHOWREEL.src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)?.[1];
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  if (yt && !saveData) {
    const mount = () => {
      const f = document.createElement('iframe');
      f.src = `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&mute=1&controls=0&loop=1&playlist=${yt}&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&fs=0&enablejsapi=1`;
      f.title = 'Showreel preview (muted)'; f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1; f.allow = 'autoplay; encrypted-media'; f.referrerPolicy = 'strict-origin-when-cross-origin';
      f.className = 'pointer-events-none absolute inset-0 z-[1] h-full w-full border-0';
      f.style.transform = 'scale(1.2)'; // crops YouTube's title bar out of frame
      $('#scenes')!.appendChild(f); cap.hidden = true;
      const cmd = (func: string) => f.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*');
      new IntersectionObserver(([en]) => cmd(en.isIntersecting ? 'playVideo' : 'pauseVideo'), { threshold: 0.25 }).observe(f);
    };
    const start = () => { const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void }).requestIdleCallback; if (idle) idle(mount, { timeout: 2500 }); else setTimeout(mount, 1500); };
    if (document.readyState === 'complete') start(); else addEventListener('load', start, { once: true });
  }

  let p = 0.04, paused = still, hovering = false, dragging = false, visible = true, scene = -1, last = performance.now();
  const active = () => !paused && visible && !document.hidden;
  const full = () => hovering || touchOnly || dragging;

  const setScene = (i: number) => {
    if (i === scene) return;
    scene = i;
    layers.forEach((l, k) => l.classList.toggle('on', k === i));
    label.textContent = `SCENE ${String(i + 1).padStart(2, '0')}`;
    cap.innerHTML = SCENES[i].cap.map((w, k) => `<span style="--k:${k}">${w}</span>`).join(' ');
  };
  const paint = () => {
    head.style.transform = `translate3d(${(p * lane.clientWidth).toFixed(1)}px, 0, 0)`;
    tc.textContent = timecode(p * LEN);
    scrub.setAttribute('aria-valuenow', String(Math.round(p * 100)));
    setScene(Math.min(2, Math.floor(p * 3)));
  };
  const sync = () => {
    const live = full() && active();
    mon.classList.toggle('playing', live);
    panel.classList.toggle('playing-ui', live);
    state.textContent = live ? '▶ Playing' : 'Hover to play';
    toggle.setAttribute('aria-pressed', String(!paused));
    toggle.setAttribute('aria-label', paused ? 'Play preview' : 'Pause preview');
    toggle.innerHTML = paused
      ? '<svg viewBox="0 0 24 24" class="ml-0.5 h-3.5 w-3.5" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>'
      : '<svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="currentColor"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>';
  };
  const tick = (now: number) => {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (active() && !dragging) { p = (p + dt / (full() ? 13 : 42)) % 1; paint(); }
    requestAnimationFrame(tick);
  };

  const seek = (e: PointerEvent) => { const r = lane.getBoundingClientRect(); p = clamp((e.clientX - r.left) / r.width); paint(); };
  scrub.addEventListener('pointerdown', (e) => { dragging = true; scrub.setPointerCapture(e.pointerId); seek(e); sync(); });
  scrub.addEventListener('pointermove', (e) => { if (dragging) seek(e); });
  const end = () => { dragging = false; sync(); };
  scrub.addEventListener('pointerup', end);
  scrub.addEventListener('pointercancel', end);
  scrub.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { p = clamp(p + 0.02); paint(); } else if (e.key === 'ArrowLeft') { p = clamp(p - 0.02); paint(); }
  });
  mon.addEventListener('pointerenter', () => { hovering = true; sync(); });
  mon.addEventListener('pointerleave', () => { hovering = false; sync(); });
  mon.addEventListener('focus', () => { hovering = true; sync(); });
  mon.addEventListener('blur', () => { hovering = false; sync(); });
  toggle.addEventListener('click', () => { paused = !paused; sync(); });
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; sync(); }).observe(panel);
  document.addEventListener('visibilitychange', sync);
  addEventListener('resize', paint);

  paint(); sync();
  if (!still) requestAnimationFrame(tick);
}

export function initHero(): void {
  const root = $('#hero')!;
  initPlayer();
  initParallax(root);
  void intro();
}
