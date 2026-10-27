import { z } from 'zod';

/** Single source of truth for the inquiry form: used by the browser (UX) and the API (security). */
export const SERVICE_OPTIONS = [
  { id: 'gaming', label: 'Gaming Content Editing', hint: 'Roblox, Minecraft, Storyline Pacing' },
  { id: 'shorts', label: 'Viral Short-Form Growth', hint: 'Shorts, Reels, TikTok' },
  { id: 'motion', label: '2D / 3D Motion Graphics & Intro Packaging', hint: 'Intros, stingers, 3D scenes' },
  { id: 'longform', label: 'Long-Form YouTube Production & Sound Design', hint: 'Pacing, multi-cam, audio' },
  { id: 'retainer', label: 'Full-Time Dedicated Monthly Retainer', hint: 'End-to-end post-production' },
] as const;

export const BUDGET_OPTIONS = [
  { id: 'trial', label: '< $300', hint: 'Single project / trial edit' },
  { id: 'batch', label: '$300 – $750', hint: 'Multi-video batch' },
  { id: 'scale', label: '$750 – $1,500+', hint: 'Monthly content scaling / high-end production' },
] as const;

export const VOLUME_OPTIONS = ['One video', '2–4 videos', '5–12 videos', '12+ videos per month', 'Not sure yet'] as const;
export const TURNAROUND_OPTIONS = ['Rush (under 48h)', 'Within a week', '1–2 weeks', 'Flexible / ongoing'] as const;

const serviceLabels = SERVICE_OPTIONS.map((s) => s.label) as [string, ...string[]];
const budgetLabels = BUDGET_OPTIONS.map((b) => b.label) as [string, ...string[]];

/** Strip control chars and HTML tags, collapse whitespace. Output is plain text only. */
export const clean = (s: string, { multiline = false } = {}) => {
  // eslint-disable-next-line no-control-regex
  const noCtl = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E]/g, '');
  const noTags = noCtl.replace(/<[^>]*>/g, '');
  return (multiline ? noTags.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n') : noTags.replace(/\s+/g, ' ')).trim();
};

const text = (min: number, max: number, label: string, multiline = false) =>
  z.string({ required_error: `${label} is required` }).transform((v) => clean(v, { multiline }))
    .pipe(z.string().min(1, `${label} is required`).min(min, `${label} is too short`).max(max, `${label} is too long`));

const optionalText = (max: number, label: string) =>
  z.string().optional().default('').transform((v) => clean(v)).pipe(z.string().max(max, `${label} is too long`));

/** URL or @handle or bare domain; stored as plain text, never rendered as HTML. */
const linkish = (label: string) =>
  optionalText(300, label).refine((v) => v === '' || /^(https?:\/\/)?[\w@.-]+(\.[a-z]{2,})?([/?#][^\s]*)?$/i.test(v) || /^@[\w.]{2,40}$/.test(v), `Enter a valid link or @handle for ${label.toLowerCase()}`);

const footageLink = optionalText(500, 'Footage link').refine((v) => v === '' || /^https?:\/\/[^\s]+\.[^\s]+$/i.test(v), 'Enter a full link starting with https://');

export const contactSchema = z.object({
  name: text(2, 80, 'Full name'),
  email: z.string({ required_error: 'Email is required' }).trim().toLowerCase().max(254, 'Email is too long').email('Enter a valid email address'),
  channelOrBrand: linkish('Channel or brand'),
  service: z.enum(serviceLabels, { errorMap: () => ({ message: 'Choose the service you need' }) }),
  budgetTier: z.enum(budgetLabels, { errorMap: () => ({ message: 'Choose a budget range' }) }),
  footageVolume: z.enum(VOLUME_OPTIONS).optional().or(z.literal('')).default(''),
  turnaround: z.enum(TURNAROUND_OPTIONS).optional().or(z.literal('')).default(''),
  rawFootageLink: footageLink,
  projectScope: text(20, 3000, 'Project scope', true),
  consentGiven: z.literal(true, { errorMap: () => ({ message: 'Please accept the terms to continue' }) }),
  /** Honeypot: real people never see or fill this. */
  company_website: z.string().optional().default(''),
  /** Milliseconds between form render and submit (bots submit instantly). */
  elapsedMs: z.number().int().nonnegative().optional().default(0),
  referrer: optionalText(300, 'Referrer'),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type FieldErrors = Partial<Record<keyof ContactInput, string>>;

export const flattenErrors = (err: z.ZodError): FieldErrors => {
  const out: FieldErrors = {};
  for (const issue of err.issues) {
    const k = issue.path[0] as keyof ContactInput | undefined;
    if (k && !out[k]) out[k] = issue.message;
  }
  return out;
};

export interface LeadPayload {
  submissionId: string;
  timestamp: string;
  client: {
    name: string; email: string; channelOrBrand: string; service: string; budgetTier: string;
    footageVolume: string; turnaround: string; rawFootageLink: string; projectScope: string; consentGiven: true;
  };
  metadata: { source: string; locale: string; referrer: string };
}

export const SUPPORT_EMAIL = 'jehadmahadihassan@gmail.com';
