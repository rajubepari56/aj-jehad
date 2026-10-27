import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, basename, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { build as esbuild } from 'esbuild';
import { loadEnv, type Plugin, type ResolvedConfig } from 'vite';
import { STATIC_ROUTES, DYNAMIC_ROUTES, TEMPLATE_FILES, DEFAULT_OG, SITE_NAME, type RouteDef } from '../site.config';

type Next = (err?: unknown) => void;
const MARK_A = '<!--meta:start-->', MARK_B = '<!--meta:end-->';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function metaBlock(o: { title: string; description: string; url: string; image: string; noindex?: boolean; jsonLd?: object }): string {
  const t = esc(o.title), d = esc(o.description);
  return [MARK_A,
    `<title>${t}</title>`, `<meta name="description" content="${d}" />`, `<link rel="canonical" href="${o.url}" />`,
    o.noindex ? '<meta name="robots" content="noindex, follow" />' : '<meta name="robots" content="index, follow, max-image-preview:large" />',
    `<meta property="og:site_name" content="${SITE_NAME}" />`, `<meta property="og:type" content="website" />`, `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`, `<meta property="og:url" content="${o.url}" />`, `<meta property="og:image" content="${o.image}" />`,
    '<meta property="og:image:width" content="1200" />', '<meta property="og:image:height" content="630" />',
    `<meta name="twitter:card" content="summary_large_image" />`, `<meta name="twitter:title" content="${t}" />`, `<meta name="twitter:description" content="${d}" />`, `<meta name="twitter:image" content="${o.image}" />`,
    o.jsonLd ? `<script type="application/ld+json">${JSON.stringify(o.jsonLd).replace(/</g, '\\u003c')}</script>` : '',
    MARK_B].filter(Boolean).join('\n    ');
}

/** Resolve a clean URL to the HTML file that serves it (static page or dynamic template). */
export function resolveRoute(pathname: string): { file: string; dynamic: boolean } | null {
  const p = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const s = STATIC_ROUTES.find((r) => r.path === p);
  if (s) return { file: s.file, dynamic: false };
  for (const d of DYNAMIC_ROUTES) if (p.startsWith(d.prefix) && p.length > d.prefix.length && !p.slice(d.prefix.length).includes('/')) return { file: d.file, dynamic: true };
  return null;
}

export function routesPlugin(): Plugin {
  let cfg: ResolvedConfig;
  let siteUrl = 'https://www.example.com';

  async function loadHandler() {
    const out = join(cfg.root, 'node_modules/.cache/mje-api/contact.mjs');
    await esbuild({ entryPoints: [join(cfg.root, 'api/contact.ts')], outfile: out, bundle: true, platform: 'node', format: 'esm', packages: 'external', logLevel: 'silent' });
    const mod = await import(`${pathToFileURL(out).href}?t=${statSync(out).mtimeMs}`);
    return mod.default as (req: unknown, res: unknown) => Promise<void>;
  }

  async function apiMiddleware(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      const handler = await loadHandler();
      const r = res as ServerResponse & { status: (c: number) => typeof r; json: (b: unknown) => void };
      r.status = (c) => { r.statusCode = c; return r; };
      r.json = (b) => { r.setHeader('Content-Type', 'application/json; charset=utf-8'); r.end(JSON.stringify(b)); };
      await handler(req, r);
    } catch (e) {
      console.error('[api/contact] handler crashed:', (e as Error).message);
      res.statusCode = 500; res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: false, code: 'server_error', message: 'Something went wrong. Please try again later.' }));
    }
  }

  const middleware = (req: IncomingMessage, res: ServerResponse, next: Next) => {
    const url = new URL(req.url ?? '/', 'http://x');
    if (url.pathname === '/api/contact') { void apiMiddleware(req, res); return; }
    if ((req.method === 'GET' || req.method === 'HEAD') && !/\.[a-z0-9]+$/i.test(url.pathname)) {
      const hit = resolveRoute(url.pathname);
      if (hit) req.url = `/${hit.file}${url.search}`;
    }
    next();
  };

  return {
    name: 'mje-routes',
    configResolved(c) {
      cfg = c;
      const env = loadEnv(c.mode, c.root, '');
      for (const [k, v] of Object.entries(env)) if (process.env[k] === undefined) process.env[k] = v;
      siteUrl = (process.env.SITE_URL ?? siteUrl).replace(/\/+$/, '');
    },
    configureServer(server) { server.middlewares.use(middleware); },
    configurePreviewServer(server) {
      // serve pre-rendered per-slug pages (real meta tags) before the dynamic-template fallback, as the host does
      server.middlewares.use((req, _res, next) => {
        const url = new URL(req.url ?? '/', 'http://x');
        const dir = url.pathname.replace(/\/+$/, '');
        if (dir && existsSync(resolve(cfg.root, cfg.build.outDir, `.${dir}`, 'index.html'))) req.url = `${dir}/index.html${url.search}`;
        next();
      });
      server.middlewares.use(middleware);
      // mirror the host: unknown pages get the branded 404 with a real 404 status
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://x');
        const f = resolve(cfg.root, cfg.build.outDir, '404.html');
        if ((req.method === 'GET' || req.method === 'HEAD') && !/\.[a-z0-9]+$/i.test(url.pathname) && !existsSync(resolve(cfg.root, cfg.build.outDir, `.${url.pathname}`, 'index.html')) && !resolveRoute(url.pathname) && existsSync(f)) {
          res.statusCode = 404; res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(readFileSync(f)); return;
        }
        next();
      });
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const file = basename(ctx.filename ?? ctx.path ?? '');
        const route: RouteDef | undefined = STATIC_ROUTES.find((r) => r.file === file);
        const generic = { title: SITE_NAME, description: 'Retention-first video editing and motion design.', url: `${siteUrl}/`, image: `${siteUrl}${DEFAULT_OG}`, noindex: true };
        const block = route
          ? metaBlock({ title: route.title, description: route.description, url: `${siteUrl}${route.path}`, image: `${siteUrl}${route.image ?? DEFAULT_OG}`, noindex: route.noindex,
              jsonLd: route.path === '/' ? { '@context': 'https://schema.org', '@graph': [{ '@type': 'Organization', name: SITE_NAME, url: siteUrl, email: 'jehadmahadihassan@gmail.com' }, { '@type': 'WebSite', name: SITE_NAME, url: siteUrl }] } : undefined })
          : metaBlock(generic);
        return html.replace('<!--meta-->', block);
      },
    },
    async closeBundle() {
      if (cfg.command !== 'build') return;
      const dist = resolve(cfg.root, cfg.build.outDir);
      const write = (p: string, s: string) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, s); };
      // preload critical fonts (hero typography) so the headline never waits on a late font request
      const assets = existsSync(join(dist, 'assets')) ? readdirSync(join(dist, 'assets')) : [];
      const pick = (re: RegExp) => assets.find((f) => re.test(f));
      const fonts = [pick(/^inter-tight-latin-wght-normal-.*\.woff2$/), pick(/^inter-latin-wght-normal-.*\.woff2$/), pick(/^instrument-serif-latin-400-italic-.*\.woff2$/), pick(/^jetbrains-mono-latin-wght-normal-.*\.woff2$/)].filter(Boolean) as string[];
      const preload = fonts.map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`).join('\n    ');
      const withFonts = (html: string) => html.replace('</head>', `    ${preload}\n  </head>`);

      const sitemap: { loc: string; priority: number }[] = [];
      for (const r of STATIC_ROUTES) {
        const src = join(dist, r.file); if (!existsSync(src)) continue;
        const html = withFonts(readFileSync(src, 'utf8'));
        write(src, html);
        if (r.path !== '/') write(join(dist, r.path, 'index.html'), html);
        if (!r.noindex) sitemap.push({ loc: `${siteUrl}${r.path === '/' ? '/' : r.path}`, priority: r.priority ?? 0.5 });
      }
      for (const d of DYNAMIC_ROUTES) {
        const src = join(dist, d.file); if (!existsSync(src)) continue;
        const tpl = withFonts(readFileSync(src, 'utf8')); write(src, tpl);
        for (const it of d.items) {
          const url = `${siteUrl}${d.prefix}${it.slug}`;
          const block = metaBlock({ title: it.title, description: it.description, url, image: `${siteUrl}${it.image ?? DEFAULT_OG}`,
            jsonLd: { '@context': 'https://schema.org', '@type': d.prefix.includes('case') ? 'CreativeWork' : 'Service', name: it.title.split(' — ')[0], description: it.description, url, provider: { '@type': 'Organization', name: SITE_NAME } } });
          const re = new RegExp(`${MARK_A}[\\s\\S]*?${MARK_B}`);
          write(join(dist, d.prefix, it.slug, 'index.html'), tpl.replace(re, () => block));
          sitemap.push({ loc: url, priority: d.priority });
        }
      }
      write(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map((u) => `  <url><loc>${u.loc}</loc><priority>${u.priority}</priority></url>`).join('\n')}\n</urlset>\n`);
      write(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${siteUrl}/sitemap.xml\n`);
      if (siteUrl.includes('example.com')) console.warn('\n[mje-routes] SITE_URL is not set: canonical/OG/sitemap URLs use https://www.example.com. Set SITE_URL before deploying.\n');
      void TEMPLATE_FILES;
    },
  };
}
