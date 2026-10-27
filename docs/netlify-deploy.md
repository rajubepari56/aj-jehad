# Deploying to Netlify

## Add your photo (About page + home page)
1. Unzip `mje-netlify-drop.zip`. Open the **images** folder inside it.
2. Copy your portrait into that folder and name it **mahadi.jpg** (`.jpeg`, `.png` or `.webp` also work).
3. Upload the whole folder to Netlify (Deploy manually → drag the folder), not the zip.
   Alternative: put your photo in Google Drive (share as "Anyone with the link: Viewer"), send the link to the developer, or paste it into `portraitDriveLink` in `src/config.ts`.

## Option A: drag and drop (fastest, ~2 minutes)
1. Go to **app.netlify.com → Add new site → Deploy manually** and drop `mje-netlify-drop.zip` (or the unzipped folder).
2. Open **Site configuration → Environment variables** and add `N8N_WEBHOOK_URL` (your n8n production webhook URL). Optional: `N8N_WEBHOOK_SECRET`.
3. **Re-deploy** (drop the zip again) so the function picks the variable up.
4. Open **Functions** in the Netlify dashboard and check that `contact` is listed.
   - Listed: submit a real test inquiry on `/contact` and confirm the sheet row + both emails.
   - Not listed: Netlify did not deploy the function from the manual upload. The site still works and the form shows the "email me directly" fallback. Use Option B to enable the form.

## Option B: Git or CLI (recommended, deploys the function reliably)
- **Git:** push the source (`mje-source.zip`) to GitHub, then **Add new site → Import from Git**. Netlify reads `netlify.toml` (build `npm run build`, publish `dist`, functions `netlify/functions`).
- **CLI:** `npm i -g netlify-cli && npm install && netlify deploy --build --prod`
- Set environment variables: `N8N_WEBHOOK_URL`, `SITE_URL` (your final `https://…` address), optional `N8N_WEBHOOK_SECRET`.

## SITE_URL
Canonical links, Open Graph tags and the sitemap need your real address. The drop zip was built with the placeholder `https://your-site.netlify.app`. Tell the developer your final domain and the zip is rebuilt, or deploy with Option B and set `SITE_URL`.

## After deploy
1. Visit `/`, `/services/gaming-edits`, `/case-studies/blox-fruits-video-edit`, `/contact`, and a bad URL (should show the 404 page).
2. Submit one real inquiry; check Google Sheet row, alert email, client auto-reply.
3. Paste a case-study link into Discord or X to see the preview card.
