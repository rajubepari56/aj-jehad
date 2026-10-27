export const $ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector<T>(sel);
export const $$ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

const pad = (n: number, l = 2) => String(Math.floor(n)).padStart(l, '0');

/** Seconds -> HH:MM:SS:FF timecode (24 fps). */
export function timecode(sec: number, fps = 24): string {
  const s = Math.max(0, sec);
  const whole = Math.floor(s);
  return `${pad(whole / 3600)}:${pad((whole % 3600) / 60)}:${pad(whole % 60)}:${pad((s - whole) * fps)}`;
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/** True when motion is reduced (OS setting, or the visitor's Animations toggle). Set before first paint by an inline head script. */
export const reducedMotion = () => document.documentElement.classList.contains('rm');

/** Escape text for safe interpolation into template strings. */
export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
