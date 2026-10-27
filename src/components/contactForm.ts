import { contactSchema, flattenErrors, SERVICE_OPTIONS, BUDGET_OPTIONS, VOLUME_OPTIONS, TURNAROUND_OPTIONS, SUPPORT_EMAIL, type FieldErrors } from '../../shared/contact';
import { $, $$, esc } from './util';
import { showSuccess } from './successDialog';

type Key = keyof FieldErrors;
const FIELDS: Key[] = ['name', 'email', 'channelOrBrand', 'service', 'budgetTier', 'footageVolume', 'turnaround', 'rawFootageLink', 'projectScope', 'consentGiven'];

const err = (id: string, k: string) => `<p class="field-error" id="${id}-${k}-err" data-err="${k}" hidden></p>`;

export interface FormOptions { prefix?: string; service?: string; budget?: string; onSuccess?: (id: string) => void }

export function mountContactForm(host: HTMLElement, opts: FormOptions = {}): void {
  const id = opts.prefix ?? 'cf';
  const startedAt = performance.now();
  const radio = (name: string, o: { id: string; label: string; hint: string }, checked: boolean) => `
    <label class="choice"><input type="radio" name="${name}" value="${esc(o.label)}" ${checked ? 'checked' : ''} aria-describedby="${id}-${name}-err" /><span class="choice-body"><b>${esc(o.label)}</b><small>${esc(o.hint)}</small></span></label>`;
  const preset = SERVICE_OPTIONS.find((s) => s.id === opts.service)?.label;
  const budgetPreset = BUDGET_OPTIONS.find((b) => b.id === opts.budget)?.label;

  host.innerHTML = `
  <form id="${id}-form" class="space-y-7" novalidate aria-labelledby="${id}-title">
    <div class="flex items-end justify-between gap-4"><h2 id="${id}-title" class="font-display text-2xl font-semibold tracking-tight text-white">Project inquiry</h2><span class="label">About 2 minutes</span></div>
    <div id="${id}-summary" class="form-alert" role="alert" tabindex="-1" hidden></div>

    <div class="grid gap-5 sm:grid-cols-2">
      <div><label class="flabel" for="${id}-name">Full name <i aria-hidden="true">*</i></label><input class="field" id="${id}-name" name="name" autocomplete="name" required aria-required="true" aria-describedby="${id}-name-err" maxlength="80" />${err(id, 'name')}</div>
      <div><label class="flabel" for="${id}-email">Email address <i aria-hidden="true">*</i></label><input class="field" id="${id}-email" type="email" name="email" autocomplete="email" inputmode="email" required aria-required="true" aria-describedby="${id}-email-err" maxlength="254" />${err(id, 'email')}</div>
    </div>
    <div><label class="flabel" for="${id}-channel">Creator / brand handle or channel link</label><input class="field" id="${id}-channel" name="channelOrBrand" placeholder="youtube.com/@yourchannel, @handle or company site" autocomplete="url" aria-describedby="${id}-channelOrBrand-err" maxlength="300" />${err(id, 'channelOrBrand')}</div>

    <fieldset class="space-y-3" aria-describedby="${id}-service-err"><legend class="flabel">Primary service needed <i aria-hidden="true">*</i></legend>
      <div class="grid gap-2.5 sm:grid-cols-2">${SERVICE_OPTIONS.map((o) => radio('service', o, o.label === preset)).join('')}</div>${err(id, 'service')}</fieldset>

    <fieldset class="space-y-3" aria-describedby="${id}-budgetTier-err"><legend class="flabel">Estimated project budget / retainer tier <i aria-hidden="true">*</i></legend>
      <div class="grid gap-2.5 sm:grid-cols-3">${BUDGET_OPTIONS.map((o) => radio('budgetTier', o, o.label === budgetPreset)).join('')}</div>${err(id, 'budgetTier')}</fieldset>

    <div class="grid gap-5 sm:grid-cols-2">
      <div><label class="flabel" for="${id}-volume">Estimated footage volume</label><select class="field" id="${id}-volume" name="footageVolume"><option value="">Select…</option>${VOLUME_OPTIONS.map((v) => `<option>${esc(v)}</option>`).join('')}</select></div>
      <div><label class="flabel" for="${id}-turnaround">Turnaround expectation</label><select class="field" id="${id}-turnaround" name="turnaround"><option value="">Select…</option>${TURNAROUND_OPTIONS.map((v) => `<option>${esc(v)}</option>`).join('')}</select></div>
    </div>
    <div><label class="flabel" for="${id}-footage">Raw footage or reference link <span class="text-ash">(optional)</span></label><input class="field" id="${id}-footage" name="rawFootageLink" type="url" inputmode="url" placeholder="https://drive.google.com/…" aria-describedby="${id}-rawFootageLink-err ${id}-footage-hint" maxlength="500" /><p class="mt-1.5 text-xs text-ash" id="${id}-footage-hint">Google Drive, Dropbox, Frame.io or a reference video URL. Set sharing to "anyone with the link".</p>${err(id, 'rawFootageLink')}</div>
    <div><label class="flabel" for="${id}-scope">Project scope &amp; vision <i aria-hidden="true">*</i></label><textarea class="field min-h-36 resize-y" id="${id}-scope" name="projectScope" rows="5" required aria-required="true" aria-describedby="${id}-projectScope-err" maxlength="3000" placeholder="Narrative angle, deadline, style references, platforms…"></textarea>${err(id, 'projectScope')}</div>

    <div class="hp" aria-hidden="true"><label>Company website<input type="text" name="company_website" tabindex="-1" autocomplete="off" /></label></div>

    <div><label class="consent"><input type="checkbox" name="consentGiven" aria-describedby="${id}-consentGiven-err" /><span>I agree to the <a href="/terms" target="_blank" rel="noopener" class="u-link text-white">Terms</a> and <a href="/privacy-policy" target="_blank" rel="noopener" class="u-link text-white">Privacy Policy</a>, and consent to being contacted about this project. <i aria-hidden="true" class="text-ember">*</i></span></label>${err(id, 'consentGiven')}</div>

    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <button type="submit" class="btn btn-primary submit-btn" data-mag-auto="0.2"><span class="submit-label">Send inquiry</span><span class="spinner" aria-hidden="true"></span><span class="submit-arrow" aria-hidden="true">→</span></button>
      <p class="text-xs text-ash">Prefer email? <a class="u-link text-white" href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></p>
    </div>
  </form>`;

  const form = $<HTMLFormElement>(`#${id}-form`, host)!;
  const summary = $(`#${id}-summary`, host)!;
  const btn = $<HTMLButtonElement>('.submit-btn', form)!;
  let submitting = false, attempted = false;

  const raw = () => {
    const f = new FormData(form);
    const s = (k: string) => String(f.get(k) ?? '');
    return {
      name: s('name'), email: s('email'), channelOrBrand: s('channelOrBrand'), service: s('service'), budgetTier: s('budgetTier'),
      footageVolume: s('footageVolume'), turnaround: s('turnaround'), rawFootageLink: s('rawFootageLink'), projectScope: s('projectScope'),
      consentGiven: f.get('consentGiven') === 'on', company_website: s('company_website'), elapsedMs: Math.round(performance.now() - startedAt), referrer: document.referrer,
    };
  };

  const show = (errors: FieldErrors) => {
    FIELDS.forEach((k) => {
      const p = $<HTMLElement>(`[data-err="${k}"]`, form);
      const msg = errors[k];
      if (p) { p.textContent = msg ?? ''; p.hidden = !msg; }
      const controls = $$<HTMLInputElement>(`[name="${k}"]`, form);
      controls.forEach((c) => { if (msg) c.setAttribute('aria-invalid', 'true'); else c.removeAttribute('aria-invalid'); });
    });
  };
  const validate = () => {
    const r = contactSchema.safeParse(raw());
    const errors = r.success ? {} : flattenErrors(r.error);
    show(errors);
    return { ok: r.success, errors };
  };

  const setSummary = (html: string, focus = false) => { summary.hidden = !html; summary.innerHTML = html; if (focus && html) summary.focus(); };
  const fallback = (msg: string) => `<strong>${esc(msg)}</strong> You can also email <a class="u-link" href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.`;
  const setBusy = (b: boolean) => { submitting = b; btn.disabled = b; btn.setAttribute('aria-busy', String(b)); form.classList.toggle('is-busy', b); };

  form.addEventListener('input', () => { if (attempted) validate(); });
  form.addEventListener('change', () => { if (attempted) validate(); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitting) return; // submission lock
    attempted = true; setSummary('');
    const { ok, errors } = validate();
    if (!ok) {
      const first = FIELDS.find((k) => errors[k]);
      const count = Object.keys(errors).length;
      setSummary(`<strong>${count} ${count === 1 ? 'field needs' : 'fields need'} your attention.</strong> ${first ? esc(errors[first] ?? '') : ''}`, false);
      ($(`[name="${first}"]`, form) as HTMLElement | null)?.focus();
      return;
    }
    setBusy(true);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    try {
      // Primary route first; plain-PHP hosts without URL rewriting expose the same endpoint as /api/contact.php
      let res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(raw()), signal: ctrl.signal });
      if (!(res.headers.get('content-type') ?? '').includes('json')) res = await fetch('/api/contact.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(raw()), signal: ctrl.signal });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; submissionId?: string; fieldErrors?: FieldErrors };
      if (res.ok && data.ok) {
        form.reset(); attempted = false; show({}); setSummary('');
        opts.onSuccess?.(data.submissionId ?? '');
        showSuccess(data.submissionId ?? '');
      } else if (res.status === 422 && data.fieldErrors) {
        show(data.fieldErrors); setSummary('<strong>Please check the highlighted fields.</strong>', true);
        ($(`[name="${FIELDS.find((k) => data.fieldErrors?.[k]) ?? 'name'}"]`, form) as HTMLElement | null)?.focus();
      } else setSummary(fallback(data.message ?? "Sorry, I couldn't send your inquiry right now."), true);
    } catch {
      setSummary(fallback('The request timed out or the connection dropped.'), true);
    } finally { clearTimeout(timer); setBusy(false); }
  });
}
