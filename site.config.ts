import { SERVICES } from './src/data/services';
import { PROJECTS } from './src/data/projects';

/** Route table: the single source for clean URLs, SEO meta, sitemap and dev/preview routing. */
export interface RouteDef { path: string; file: string; title: string; description: string; image?: string; noindex?: boolean; priority?: number }
export interface DynamicDef { prefix: string; file: string; items: { slug: string; title: string; description: string; image?: string }[]; priority: number }

export const SITE_NAME = 'Mahadi Jehad Edits';
const D = 'High-retention video editing, gaming edits, viral short-form and 3D motion design for creators and brands.';

export const STATIC_ROUTES: RouteDef[] = [
  { path: '/', file: 'index.html', title: `${SITE_NAME} — High-Retention Video Editing & Motion Design`, description: `${D} Retention-first post-production that scales channels and brands.`, priority: 1 },
  { path: '/services', file: 'services.html', title: `Services — ${SITE_NAME}`, description: 'Gaming edits, viral short-form, 2D/3D motion graphics, long-form YouTube pacing, sound design and monthly retainers.', priority: 0.9 },
  { path: '/showreel', file: 'showreel.html', title: `Showreel — ${SITE_NAME}`, description: 'Watch the showreel in theater view: gaming, short-form, 3D motion and long-form storytelling.', priority: 0.8 },
  { path: '/case-studies', file: 'case-studies.html', title: `Case Studies & Portfolio — ${SITE_NAME}`, description: 'Selected gaming edits, channel intros and short-form work, with full video playback.', priority: 0.9 },
  { path: '/process', file: 'process.html', title: `Production Process — ${SITE_NAME}`, description: 'My four-stage pipeline: ingest and script, rough cut, VFX and audio, master delivery.', priority: 0.7 },
  { path: '/about', file: 'about.html', title: `About — ${SITE_NAME}`, description: 'About me: editing philosophy, software arsenal and how I work.', priority: 0.6 },
  { path: '/pricing', file: 'pricing.html', title: `Pricing & Packages — ${SITE_NAME}`, description: 'Transparent budget bands, monthly retainers, typical turnaround times and custom quotes.', priority: 0.8 },
  { path: '/contact', file: 'contact.html', title: `Contact & Book a Project — ${SITE_NAME}`, description: 'Tell me about your channel or brand. Get a reply within 24 hours.', priority: 0.9 },
  { path: '/privacy-policy', file: 'privacy-policy.html', title: `Privacy Policy — ${SITE_NAME}`, description: 'How I collect, use and protect information submitted through this website.', priority: 0.2 },
  { path: '/terms', file: 'terms.html', title: `Terms of Service — ${SITE_NAME}`, description: 'Usage rights, revision policy, raw footage handover and copyright clearance terms.', priority: 0.2 },
];

export const DYNAMIC_ROUTES: DynamicDef[] = [
  { prefix: '/services/', file: 'service.html', priority: 0.8,
    items: SERVICES.map((s) => ({ slug: s.slug, title: `${s.title} — ${SITE_NAME}`, description: s.summary, image: `/og/service-${s.slug}.png` })) },
  { prefix: '/case-studies/', file: 'case.html', priority: 0.7,
    items: PROJECTS.map((p) => ({ slug: p.slug, title: `${p.title} — ${p.detailed ? "Case Study" : "Work Sample"} · ${SITE_NAME}`, description: p.summary, image: `/og/case-${p.slug}.png` })) },
];

export const DEFAULT_OG = '/og/default.png';
export const TEMPLATE_FILES = DYNAMIC_ROUTES.map((d) => d.file);
