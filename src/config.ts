/** Site-level settings. Public values only: secrets live in server env vars (see .env.example). */
export const CONFIG = {
  brand: 'Mahadi Jehad Edits',
  short: 'MJE',
  lead: 'MD Mahadi Hasan Jehad',
  tagline: 'High-Retention Visual Storytelling That Scales Channels & Brands.',
  contactEmail: 'jehadmahadihassan@gmail.com',
  responseTime: 'within 24 hours',
  /** Optional: paste a Google Drive share link to your photo (file shared as "Anyone with the link: Viewer"). Leave empty to use /images/mahadi.jpg instead. */
  portraitDriveLink: '',
  /** Cal.com / Calendly link. When empty, "book a call" routes to /contact. */
  bookingUrl: '',
  social: {
    x: 'https://x.com/ACEISBACK12',
    linkedin: 'https://www.linkedin.com/in/md-mahadi-hasan-jehad-jehad-facebook-ads-spalist',
    youtube: '',
    discord: '',
    upwork: '',
    fiverr: '',
  },
} as const;
