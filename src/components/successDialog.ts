import { CONFIG } from '../config';

/** Accessible success modal (native <dialog>: focus trap, Esc to close, restores focus). */
export function showSuccess(submissionId: string): void {
  let d = document.getElementById('success-dialog') as HTMLDialogElement | null;
  if (!d) {
    d = document.createElement('dialog');
    d.id = 'success-dialog'; d.setAttribute('aria-labelledby', 'success-title'); d.setAttribute('aria-describedby', 'success-desc');
    d.className = 'm-auto w-[min(34rem,92vw)] bg-transparent p-0 text-bone';
    d.innerHTML = `<div class="glass relative overflow-hidden rounded-2xl p-8 text-center sm:p-10">
      <div class="success-check mx-auto grid h-16 w-16 place-items-center rounded-full border border-ember/50 bg-ember/10 text-ember" aria-hidden="true"><svg viewBox="0 0 24 24" class="h-8 w-8" fill="none" stroke="currentColor" stroke-width="2"><path class="check-path" d="m5 12.5 4.5 4.5L19 7.5"/></svg></div>
      <h2 id="success-title" tabindex="-1" class="mt-6 font-display text-3xl font-semibold tracking-tight text-white">Inquiry received!</h2>
      <p id="success-desc" class="mt-3 text-[15px] leading-relaxed text-bone/80">I'll review your footage and channel and reply ${CONFIG.responseTime}. A confirmation email is on its way.</p>
      <p class="label mt-6" id="success-ref"></p>
      <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><button type="button" class="btn btn-primary" data-close-success><span>Done</span></button><a href="/case-studies" class="btn btn-ghost"><span>Browse case studies</span></a></div>
    </div>`;
    document.body.appendChild(d);
    d.addEventListener('click', (e) => { if (e.target === d) d?.close(); });
    d.querySelector('[data-close-success]')!.addEventListener('click', () => d?.close());
  }
  d.querySelector('#success-ref')!.textContent = submissionId ? `Reference · ${submissionId.slice(0, 8).toUpperCase()}` : '';
  (document.getElementById('inquiry-dialog') as HTMLDialogElement | null)?.close();
  if (!d.open) d.showModal();
  d.querySelector<HTMLElement>('#success-title')?.focus();
}
