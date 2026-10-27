# Mahadi Jehad Edits: freelance video editor site

Fast, accessible, multi-page portfolio and lead-capture site for a solo video editor and motion designer.
Vite + TypeScript + Tailwind, no framework runtime, with a Vercel serverless function (`/api/contact`) that forwards inquiries to n8n.

## Routes

| Route | Source |
|---|---|
| `/` | `index.html` + `src/pages/home.ts` |
| `/services`, `/services/[slug]` | `services.html`, `service.html` · data: `src/data/services.ts` |
| `/showreel` | `showreel.html` · data: `src/data/showreel.ts` |
| `/case-studies`, `/case-studies/[slug]` | `case-studies.html`, `case.html` · data: `src/data/projects.ts` |
| `/process`, `/about`, `/pricing` | `src/pages/*.ts` · data: `src/data/content.ts`, `src/data/pricing.ts` |
| `/contact` | `contact.html` + `src/components/contactForm.ts` |
| `/privacy-policy`, `/terms` | `src/pages/legal.ts` · copy in `src/data/content.ts` |
| `/api/contact` | `api/contact.ts` (server) · schema in `shared/contact.ts` |

Clean URLs: `site.config.ts` is the route table. The Vite plugin (`plugins/routes.ts`) serves them in dev/preview, injects SEO meta,
and at build time pre-renders one HTML file per service and case study (so Discord/Twitter/Google see real titles and OG images),
plus `sitemap.xml` and `robots.txt`. Unknown slugs fall back to a friendly 404 UI with `noindex`.

## Run it

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:5173  (includes /api/contact)
npm run check                # eslint + typecheck + production build
npm run preview              # serve the production build locally
npm run test:contact         # 29 API checks against a mock n8n receiver (safe)
npm run og                   # regenerate social preview images in public/og (needs Chromium)
```

> `.env.local` contains your real webhook. Submitting the form locally sends a **real** lead to n8n.
> For safe testing use `npm run test:contact` (mock) or point `N8N_WEBHOOK_URL` at the n8n *test* URL.

## Editing content (no layout code needed)

- **Projects / case studies:** `src/data/projects.ts`. Add a video (`video.src` YouTube/Vimeo/MP4/HLS), a short muted loop (`video.preview`), real copy and metrics. Set a metric's `status` to `'verified'` and add `value` to show it; set `sample: false` to remove the "Sample" tag.
- **Services, pricing, turnaround, process, about, legal:** the files listed above.
- **Showreel:** `src/data/showreel.ts` (`src`, chapters).
- **Contact email, socials, booking link:** `src/config.ts`. Empty social links show as "coming soon".
- After adding projects or services, run `npm run og` to generate their preview cards.

## Environment variables

| Name | Where | Purpose |
|---|---|---|
| `N8N_WEBHOOK_URL` | server only | n8n production webhook. Never exposed to the browser |
| `N8N_WEBHOOK_SECRET` | server only, optional | sent as `X-Webhook-Secret`; verify it in n8n |
| `ALLOWED_ORIGINS` | server only, optional | extra origins allowed to POST |
| `SITE_URL` | build time | canonical URL for sitemap, canonical links and OG tags |

## Deploy to Vercel: checklist

1. Push the repo, import it in Vercel (framework preset: **Vite**; `vercel.json` already sets output `dist`, clean URLs and rewrites).
2. Add environment variables (Production + Preview): `N8N_WEBHOOK_URL`, `SITE_URL` (your final `https://…`), optionally `N8N_WEBHOOK_SECRET`.
3. Import and **activate** the n8n workflow (`docs/n8n-lead-workflow.json`, guide in `docs/n8n-workflow.md`); set the Google Sheet ID and credentials.
4. Deploy, then submit one test inquiry on the live site and confirm: row in "Client Inquiries", alert email, client auto-reply.
5. Add your domain, then check `https://your-domain/sitemap.xml` and share a case-study link in Discord/X to preview the card.
6. Fill the placeholders: social links, real videos, testimonials, verified metrics, hardware specs (About), and have the Terms/Privacy text reviewed for your jurisdiction.
7. Optional: submit the sitemap in Google Search Console; add privacy-friendly analytics and update the Privacy Policy.

### Rate limiting note
`/api/contact` limits 5 submissions per IP per 15 minutes in memory (per serverless instance). That stops casual abuse; for a hard global limit swap in Upstash Redis or Vercel KV.

## Motion & cursor
- **Animations** use only `transform`/`opacity` and always run by default, whatever the device's motion setting. A visitor can switch them off with the footer **Animations: On/Off** toggle (saved on their device as `mje-motion`); that mode keeps gentle fades only.
- **Cursor** (`src/features/cursor.ts`, `src/cursor.css`): a dot + ring that changes by location: PLAY on video, VIEW on work cards, SCRUB on timelines, DRAG on the before/after slider, BOOK on contact buttons, OPEN/CLOSE on FAQs, MAIL / ↗ on external links, and the normal text cursor in form fields. Add `data-cursor="LABEL"` to any element for a custom label, or edit the `RULES` list. It only appears on devices with a mouse.

## Quality gates
`npm run check` runs strict ESLint (no `any`, no unused imports/vars), both TypeScript projects, and the production build.
Animations use only `transform`/`opacity`, honour `prefers-reduced-motion`, and media wrappers reserve their aspect ratio so layout shift is 0.
