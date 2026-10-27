import { $ } from '../components/util';

const KEY = 'mje-motion';
const write = (v: 'on' | 'off') => { try { localStorage.setItem(KEY, v); } catch { /* storage blocked: preference lasts this visit only */ } };

/** Animations always run by default. The footer toggle lets a visitor switch them off (saved on their device). */
export function initMotionPref(): void {
  const btn = $<HTMLButtonElement>('#motion-toggle');
  if (!btn) return;
  const off = document.documentElement.classList.contains('rm');
  btn.textContent = `Animations: ${off ? 'Off' : 'On'}`;
  btn.setAttribute('aria-pressed', String(!off));
  btn.addEventListener('click', () => { write(off ? 'on' : 'off'); location.reload(); });
}
