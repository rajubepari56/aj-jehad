/* eslint-disable no-console */
// Verifies the bundled Netlify function (Request/Response API) against a local mock n8n receiver. Production untouched.
import http from 'node:http';
import { build } from 'esbuild';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'node_modules/.cache/mje-api/netlify-contact.mjs');
await build({ entryPoints: [resolve(root, 'netlify/functions/contact.ts')], outfile: out, bundle: true, platform: 'node', format: 'esm', target: 'node20', logLevel: 'silent' });
const { default: fn, config } = await import(`${pathToFileURL(out).href}?t=${Date.now()}`);
let received = [];
const mock = http.createServer((req, res) => { let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => { received.push(JSON.parse(b)); res.setHeader('Content-Type', 'application/json'); res.end('{"ok":true}'); }); });
await new Promise((r) => mock.listen(0, '127.0.0.1', r));
process.env.N8N_WEBHOOK_URL = `http://127.0.0.1:${mock.address().port}/hook`;
const good = { name: 'Alex Carter', email: 'alex@creatoragency.com', channelOrBrand: 'youtube.com/@AlexGaming', service: 'Gaming Content Editing', budgetTier: '$750 – $1,500+', projectScope: 'Looking for high-retention gameplay cuts with fast pacing and kinetic subtitles.', consentGiven: true, company_website: '', elapsedMs: 9000 };
const call = (body, init = {}) => fn(new Request('https://site.test/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-nf-client-connection-ip': init.ip ?? '9.9.9.1' }, body: JSON.stringify(body), ...init.req }));
let pass = 0, fail = 0; const check = (n, c) => { if (c) pass++; else fail++; console.log(`  ${c ? 'PASS' : 'FAIL'}  ${n}`); };
check('config.path is /api/contact', config.path === '/api/contact');
let r = await call(good); let j = await r.json();
check('valid -> 200 ok + submissionId', r.status === 200 && j.ok && j.submissionId);
check('payload forwarded in agreed scheme', received[0]?.client?.email === 'alex@creatoragency.com' && received[0].metadata.source === 'Website Inbound Lead');
r = await call({ ...good, email: 'nope' }, { ip: '9.9.9.2' }); check('invalid email -> 422', r.status === 422);
received = []; r = await call({ ...good, company_website: 'spam' }, { ip: '9.9.9.3' }); check('honeypot -> silent 200, not forwarded', r.status === 200 && received.length === 0);
r = await fn(new Request('https://site.test/api/contact')); check('GET -> 405', r.status === 405);
let last; for (let i = 0; i < 6; i++) last = (await call(good, { ip: '9.9.9.4' })).status; check('6th request from one IP -> 429', last === 429);
delete process.env.N8N_WEBHOOK_URL; r = await call(good, { ip: '9.9.9.5' }); j = await r.json(); check('no webhook configured -> 503 with email fallback', r.status === 503 && /jehadmahadihassan@gmail\.com/.test(j.message));
console.log(`\n${pass} passed, ${fail} failed`); mock.close(); process.exit(fail ? 1 : 0);
