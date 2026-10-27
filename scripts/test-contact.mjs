/* eslint-disable no-console */
/**
 * End-to-end verification of /api/contact WITHOUT touching production.
 *
 *   npm run test:contact                      -> runs against a local mock n8n receiver (safe, default)
 *   npm run test:contact -- --live --email you@example.com
 *                                             -> sends ONE clearly-marked [TEST] lead through the real webhook
 *                                                (writes a test row to your sheet and emails you + the address given)
 */
import http from 'node:http';
import { build } from 'esbuild';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFileSync, existsSync } from 'node:fs';

const root = resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const live = args.includes('--live');
const emailArg = args[args.indexOf('--email') + 1];

// load .env.local for live mode only
const envFile = resolve(root, '.env.local');
if (live && existsSync(envFile)) for (const l of readFileSync(envFile, 'utf8').split('\n')) { const m = l.match(/^([A-Z0-9_]+)=(.*)$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2]; }

const out = resolve(root, 'node_modules/.cache/mje-api/test-contact.mjs');
await build({ entryPoints: [resolve(root, 'api/contact.ts')], outfile: out, bundle: true, platform: 'node', format: 'esm', packages: 'external', logLevel: 'silent' });
const { default: handler, __resetRateLimit } = await import(`${pathToFileURL(out).href}?t=${Date.now()}`);

// serve the real handler over HTTP (same shape Vercel provides)
const api = http.createServer((req, res) => {
  res.status = (c) => { res.statusCode = c; return res; };
  res.json = (b) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(b)); };
  handler(req, res).catch(() => { res.statusCode = 500; res.end('{}'); });
});
await new Promise((r) => api.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${api.address().port}/api/contact`;

const good = (over = {}) => ({
  name: 'Alex Carter', email: 'alex@creatoragency.com', channelOrBrand: 'youtube.com/@AlexGaming',
  service: 'Gaming Content Editing', budgetTier: '$750 – $1,500+', footageVolume: '5–12 videos', turnaround: 'Within a week',
  rawFootageLink: 'https://drive.google.com/drive/folders/xyz',
  projectScope: 'Looking for high-retention Bloxburg & Rivals gameplay cuts with fast pacing and kinetic subtitles.',
  consentGiven: true, company_website: '', elapsedMs: 9000, referrer: '', ...over,
});
const post = (body, { ip = '10.0.0.1', type = 'application/json' } = {}) =>
  fetch(base, { method: 'POST', headers: { 'Content-Type': type, 'X-Forwarded-For': ip, 'Accept-Language': 'en-US,en;q=0.9' }, body: typeof body === 'string' ? body : JSON.stringify(body) });

let n8nMode = 'ok', received = [];
const mock = http.createServer((req, res) => {
  let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => {
    received.push({ headers: req.headers, body: JSON.parse(b || '{}') });
    if (n8nMode === 'hang') return; // never respond
    res.statusCode = n8nMode === 'error' ? 500 : 200; res.setHeader('Content-Type', 'application/json'); res.end('{"ok":true}');
  });
});
await new Promise((r) => mock.listen(0, '127.0.0.1', r));

let pass = 0, fail = 0;
const check = (name, cond, extra = '') => { if (cond) pass++; else fail++; console.log(`${cond ? '  PASS' : '  FAIL'}  ${name}${cond ? '' : ` ${extra}`}`); };

if (live) {
  if (!process.env.N8N_WEBHOOK_URL) { console.error('N8N_WEBHOOK_URL is not set.'); process.exit(1); }
  if (!emailArg) { console.error('Live mode needs --email <address that will receive the auto-reply>.'); process.exit(1); }
  console.log(`LIVE test: sending one [TEST] lead through the real webhook. Auto-reply goes to ${emailArg}.`);
  const r = await post(good({ name: '[TEST] Pipeline check', email: emailArg, channelOrBrand: 'test.invalid', projectScope: '[TEST] End-to-end pipeline verification. Safe to delete this row.' }), { ip: '10.9.9.9' });
  console.log('API response:', r.status, await r.json());
  api.close(); mock.close(); process.exit(r.ok ? 0 : 1);
}

process.env.N8N_WEBHOOK_URL = `http://127.0.0.1:${mock.address().port}/webhook/test`;
process.env.N8N_WEBHOOK_SECRET = 'test-secret';
process.env.N8N_TIMEOUT_MS = '1500';
console.log('\nContact API verification (mock n8n receiver; production untouched)\n');

console.log('Happy path & payload shape');
{ received = []; const r = await post(good()); const j = await r.json();
  check('valid submission returns 200 { ok: true }', r.status === 200 && j.ok === true && typeof j.submissionId === 'string');
  const p = received[0]?.body;
  check('forwarded exactly once', received.length === 1);
  check('payload has submissionId (uuid v4)', /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(p?.submissionId ?? ''));
  check('payload timestamp is ISO-8601', !Number.isNaN(Date.parse(p?.timestamp)) && /Z$/.test(p?.timestamp ?? ''));
  check('client block matches scheme', ['name', 'email', 'channelOrBrand', 'service', 'budgetTier', 'rawFootageLink', 'projectScope', 'consentGiven'].every((k) => k in (p?.client ?? {})) && p.client.consentGiven === true);
  check('metadata block matches scheme', p?.metadata?.source === 'Website Inbound Lead' && p.metadata.locale === 'en-US' && p.metadata.referrer === 'direct');
  check('honeypot/internal fields are NOT forwarded', !('company_website' in p.client) && !('elapsedMs' in p.client));
  check('webhook secret header sent server-side', received[0]?.headers['x-webhook-secret'] === 'test-secret');
  check('response never leaks the webhook URL', !JSON.stringify(j).includes('127.0.0.1') && !JSON.stringify(j).includes('/webhook/'));
}
console.log('\nValidation & sanitisation');
{ received = [];
  let r = await post(good({ email: 'not-an-email' }), { ip: '10.0.0.2' }); let j = await r.json();
  check('invalid email -> 422 with field error', r.status === 422 && !!j.fieldErrors?.email);
  r = await post(good({ consentGiven: false }), { ip: '10.0.0.2' }); j = await r.json();
  check('missing consent -> 422', r.status === 422 && !!j.fieldErrors?.consentGiven);
  r = await post(good({ service: 'Hacking' }), { ip: '10.0.0.2' });
  check('unknown service rejected', r.status === 422);
  r = await post(good({ rawFootageLink: 'javascript:alert(1)' }), { ip: '10.0.0.2' });
  check('non-http footage link rejected', r.status === 422);
  r = await post(good({ name: '<script>alert(1)</script><b>Alex</b>' }), { ip: '10.0.0.3' });
  check('HTML stripped from text fields', r.status === 200 && !/[<>]/.test(received.at(-1)?.body.client.name ?? '<') && received.at(-1).body.client.name.includes('Alex'));
  r = await post('{not json', { ip: '10.0.0.2' });
  check('malformed JSON -> 400', r.status === 400);
  r = await post(good(), { ip: '10.0.0.9', type: 'text/plain' });
  check('wrong content-type -> 415', r.status === 415);
  r = await fetch(base, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '10.0.0.4' }, body: JSON.stringify(good({ projectScope: 'x'.repeat(30000) })) });
  check('oversized body rejected (413)', r.status === 413 || r.status === 422);
  r = await fetch(base, { method: 'GET' });
  check('GET -> 405', r.status === 405);
  r = await fetch(base, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://evil.example' }, body: JSON.stringify(good()) });
  check('foreign Origin -> 403', r.status === 403);
}
console.log('\nBot protection');
{ received = [];
  let r = await post(good({ company_website: 'http://spam.example' }), { ip: '10.0.1.1' }); let j = await r.json();
  check('honeypot filled -> silent 200', r.status === 200 && j.ok === true);
  r = await post(good({ elapsedMs: 300 }), { ip: '10.0.1.2' });
  check('instant submit (bot timing) -> silent 200', r.status === 200);
  check('neither bot submission reached n8n', received.length === 0);
}
console.log('\nRate limiting (5 per 15 min per IP)');
{ __resetRateLimit(); received = []; const codes = [];
  for (let i = 0; i < 6; i++) codes.push((await post(good(), { ip: '10.0.2.1' })).status);
  check(`first 5 allowed, 6th blocked -> ${codes.join(',')}`, codes.slice(0, 5).every((c) => c === 200) && codes[5] === 429);
  const r = await post(good(), { ip: '10.0.2.1' });
  check('429 includes Retry-After', Number(r.headers.get('retry-after')) > 0);
  const other = await post(good(), { ip: '10.0.2.2' });
  check('other IPs unaffected', other.status === 200);
}
console.log('\nResilience (fallback when n8n is unhealthy)');
{ __resetRateLimit();
  n8nMode = 'error'; let r = await post(good(), { ip: '10.0.3.1' }); let j = await r.json();
  check('n8n 500 -> 502 with friendly fallback + email', r.status === 502 && j.ok === false && /jehadmahadihassan@gmail\.com/.test(j.message));
  n8nMode = 'hang'; const t0 = Date.now(); r = await post(good(), { ip: '10.0.3.2' }); j = await r.json();
  check(`n8n hang -> 504 after timeout (${Date.now() - t0}ms)`, r.status === 504 && Date.now() - t0 < 3000 && /jehadmahadihassan@gmail\.com/.test(j.message));
  n8nMode = 'ok'; const saved = process.env.N8N_WEBHOOK_URL;
  process.env.N8N_WEBHOOK_URL = 'http://127.0.0.1:1/unreachable'; r = await post(good(), { ip: '10.0.3.3' }); j = await r.json();
  check('n8n unreachable -> 502 fallback', r.status === 502 && /jehadmahadihassan@gmail\.com/.test(j.message));
  delete process.env.N8N_WEBHOOK_URL; r = await post(good(), { ip: '10.0.3.4' });
  check('missing N8N_WEBHOOK_URL -> 503 fallback', r.status === 503);
  process.env.N8N_WEBHOOK_URL = saved;
}
console.log(`\n${pass} passed, ${fail} failed\n`);
api.closeAllConnections?.(); mock.closeAllConnections?.(); api.close(); mock.close();
process.exit(fail ? 1 : 0);
