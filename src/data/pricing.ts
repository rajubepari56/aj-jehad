/**
 * Pricing & turnaround. Budget tiers mirror the inquiry form. Turnaround windows are typical
 * defaults for scoping and are confirmed per project: edit them here to match your real capacity.
 */
export interface Package { id: string; name: string; range: string; tagline: string; for: string; features: string[]; featured?: boolean; cta: string; formId: string; budget: string }
export const PACKAGES: Package[] = [
  { id: 'trial', name: 'Trial Edit', range: 'Under $300', tagline: 'Single project, low risk.', for: 'New collaborations and one-off videos', cta: 'Start a trial', formId: 'gaming', budget: '< $300',
    features: ['One video or a small set of shorts', 'Style and pacing match from your references', 'Revision rounds defined in the proposal', 'Clear delivery date before kickoff'] },
  { id: 'batch', name: 'Content Batch', range: '$300 – $750', tagline: 'Multi-video batches with consistent style.', for: 'Creators publishing regularly', cta: 'Plan a batch', formId: 'shorts', budget: '$300 – $750', featured: true,
    features: ['Several videos delivered as a batch', 'Shared style guide across the batch', 'Short-form repurposing options', 'Priority review window'] },
  { id: 'scale', name: 'Monthly Scaling', range: '$750 – $1,500+', tagline: 'Retainer-level content scaling and high-end production.', for: 'Channels and brands scaling output', cta: 'Discuss a retainer', formId: 'retainer', budget: '$750 – $1,500+',
    features: ['Dedicated monthly capacity', 'Long-form, short-form, motion and sound', 'Weekly review rhythm', 'Plan reviewed and adjusted each month'] },
];
export const TURNAROUND: { format: string; typical: string; note: string }[] = [
  { format: 'Short-form clips (Shorts, Reels, TikTok)', typical: '24–72 hours', note: 'Per clip or batch, depending on volume' },
  { format: 'Gaming long-form edit', typical: '3–7 days', note: 'Depends on raw footage length' },
  { format: 'Documentary / narrative long-form', typical: '5–10 days', note: 'Scoped with structure and sound pass' },
  { format: 'Motion graphics & intro packages', typical: '1–2 weeks', note: 'Longer for 3D scenes' },
  { format: 'Monthly retainer', typical: 'Weekly cadence', note: 'Agreed in your plan' },
];
export const PRICING_FAQ = [
  { q: 'Are these fixed prices?', a: 'They are budget bands that match the inquiry form. Every project is scoped individually, and you receive a clear written quote before work starts.' },
  { q: 'What affects the quote?', a: 'Footage volume, video length, motion and sound complexity, revision needs and turnaround.' },
  { q: 'Do you offer a trial?', a: 'Yes. A trial edit is the lowest-risk way to see how I work.' },
  { q: 'How do payments work?', a: 'Payment terms are set in each proposal. For ongoing work, retainers are billed monthly.' },
];
