import { $$ } from '../components/util';

export function initFaq(): void {
  $$('.faq-item').forEach((item) => {
    const btn = item.querySelector<HTMLButtonElement>('button')!;
    btn.addEventListener('click', () => {
      const open = item.dataset.open !== 'true';
      $$('.faq-item').forEach((o) => { o.dataset.open = 'false'; o.querySelector('button')!.setAttribute('aria-expanded', 'false'); });
      item.dataset.open = String(open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });
}
