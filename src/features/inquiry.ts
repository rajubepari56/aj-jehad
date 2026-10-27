import { $ } from '../components/util';
import { mountContactForm } from '../components/contactForm';
import { SERVICE_OPTIONS } from '../../shared/contact';

/** Opens the inquiry form in a modal from any `[data-open-inquiry]` trigger (optional data-service id). */
export function initInquiryModal(): void {
  const dlg = $<HTMLDialogElement>('#inquiry-dialog');
  if (!dlg) return;
  const body = $('#inquiry-body', dlg)!;
  $('[data-close-inquiry]', dlg)!.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => { document.documentElement.style.overflow = ''; body.innerHTML = ''; });
  document.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-open-inquiry]');
    if (!t) return;
    e.preventDefault();
    const service = t.dataset.service;
    mountContactForm(body, { prefix: 'mf', service: SERVICE_OPTIONS.some((s) => s.id === service) ? service : undefined });
    dlg.showModal(); document.documentElement.style.overflow = 'hidden';
    $<HTMLElement>('input[name="name"]', dlg)?.focus();
  });
}
