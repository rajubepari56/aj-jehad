// Generates 1200x630 Open Graph cards into public/og/ (run: npm run og). Needs Playwright + Chromium locally.
/* eslint-disable no-console */
/* global document */
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const require = createRequire(import.meta.url);
const outFile = resolve(root, 'node_modules/.cache/og-data.mjs');
await build({ entryPoints: [resolve(root, 'site.config.ts')], outfile: outFile, bundle: true, format: 'esm', platform: 'node', logLevel: 'silent' });
const { DYNAMIC_ROUTES, SITE_NAME } = await import(pathToFileURL(outFile).href);
await build({ entryPoints: [resolve(root, 'src/data/projects.ts')], outfile: resolve(root, 'node_modules/.cache/og-projects.mjs'), bundle: true, format: 'esm', platform: 'node', logLevel: 'silent' });
const { PROJECTS } = await import(pathToFileURL(resolve(root, 'node_modules/.cache/og-projects.mjs')).href);
const hueOf = Object.fromEntries(PROJECTS.map((p) => [p.slug, p.hue]));

let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const exe = process.env.CHROMIUM_PATH || undefined;
const font = (p, w) => `@font-face{font-family:'T';src:url('${pathToFileURL(resolve(root, p))}');font-weight:${w}}`;
const css = font('node_modules/@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2', '100 900');

const card = (title, kicker, hue) => `<!doctype html><meta charset="utf-8"><style>${css}
*{box-sizing:border-box;margin:0}body{width:1200px;height:630px;background:#0a0a0c;color:#fff;font-family:T,Inter,sans-serif;position:relative;overflow:hidden}
.g{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:48px 48px;-webkit-mask-image:radial-gradient(ellipse 80% 80% at 70% 30%,#000,transparent 75%)}
.l{position:absolute;right:-180px;top:-200px;width:760px;height:760px;border-radius:50%;background:radial-gradient(closest-side,hsla(${hue},80%,50%,.38),transparent 70%)}
.k{position:absolute;left:72px;top:72px;font:500 20px/1 ui-monospace,monospace;letter-spacing:.16em;text-transform:uppercase;color:#a3a3ad;display:flex;gap:14px;align-items:center}
.k i{width:12px;height:12px;border-radius:50%;background:#ff3b1f}
h1{position:absolute;left:72px;bottom:150px;width:960px;font-size:84px;line-height:.98;letter-spacing:-.045em;font-weight:650}
.f{position:absolute;left:72px;bottom:64px;font:500 22px/1 ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:#d4d4dc}
.p{position:absolute;right:72px;bottom:64px;width:64px;height:64px;border-radius:14px;border:1px solid rgba(255,255,255,.2);display:grid;place-items:center}
.p:after{content:'';border-left:20px solid #ff3b1f;border-top:12px solid transparent;border-bottom:12px solid transparent;margin-left:5px}
</style><div class="g"></div><div class="l"></div><div class="k"><i></i>${kicker}</div><h1>${title}</h1><div class="f">${SITE_NAME}</div><div class="p"></div>`;

const jobs = [['default', 'High-Retention Visuals That Hook, Engage &amp; Scale.', 'Video editing &amp; motion design', 12]];
for (const d of DYNAMIC_ROUTES) for (const it of d.items) {
  const isCase = d.prefix.includes('case');
  jobs.push([`${isCase ? 'case' : 'service'}-${it.slug}`, it.title.split(' — ')[0].replace(/&/g, '&amp;'), isCase ? 'Portfolio' : 'Service', hueOf[it.slug] ?? 12]);
}
mkdirSync(resolve(root, 'public/og'), { recursive: true });
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const [name, title, kicker, hue] of jobs) {
  await page.setContent(card(title, kicker, hue)); await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: resolve(root, `public/og/${name}.png`) });
}
await browser.close();
console.log(`Generated ${jobs.length} OG images in public/og/`);
