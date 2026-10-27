/* eslint-disable no-console */
// Verifies hosting/hostinger/api/contact.php with PHP's built-in server and a local mock n8n. Production untouched.
import http from 'node:http';
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, copyFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
let received = [], mode = 'ok';
const mock = http.createServer((req, res) => { let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => { received.push({ h: req.headers, b: JSON.parse(b || '{}') }); if (mode === 'hang') return; res.statusCode = mode === 'error' ? 500 : 200; res.end('{"ok":true}'); }); });
await new Promise((r) => mock.listen(0, '127.0.0.1', r));

const dir = mkdtempSync(join(tmpdir(), 'mje-php-')); mkdirSync(join(dir, 'api'));
copyFileSync(join(root, 'hosting/hostinger/api/contact.php'), join(dir, 'api/contact.php'));
const cfg = (url) => writeFileSync(join(dir, 'api/config.php'), `<?php return ['n8n_webhook_url' => '${url}', 'n8n_webhook_secret' => 'test-secret', 'timeout_seconds' => 1];`);
cfg(`http://127.0.0.1:${mock.address().port}/hook`);
const port = 9100 + Math.floor(Math.random() * 500);
const php = spawn('php', ['-S', `127.0.0.1:${port}`, '-t', dir], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 900));
const base = `http://127.0.0.1:${port}/api/contact.php`;
const run = String(Date.now()).slice(-6);
const ipn = (n) => `10.${run.slice(0, 3)}.${run.slice(3)}.${n}`;

const good = (o = {}) => ({ name: 'Alex Carter', email: 'alex@creatoragency.com', channelOrBrand: 'youtube.com/@AlexGaming', service: 'Gaming Content Editing', budgetTier: '$750 – $1,500+', footageVolume: '5–12 videos', turnaround: 'Within a week', rawFootageLink: 'https://drive.google.com/drive/folders/xyz', projectScope: 'Looking for high-retention Bloxburg & Rivals gameplay cuts with fast pacing and kinetic subtitles.', consentGiven: true, company_website: '', elapsedMs: 9000, referrer: '', ...o });
const post = (body, { ip = ipn(1), type = 'application/json', headers = {} } = {}) => fetch(base, { method: 'POST', headers: { 'Content-Type': type, 'X-Forwarded-For': ip, 'Accept-Language': 'en-US,en;q=0.9', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });
let pass = 0, fail = 0; const check = (n, c) => { if (c) pass++; else fail++; console.log(`  ${c ? 'PASS' : 'FAIL'}  ${n}`); };

console.log('\nHostinger PHP endpoint verification (mock n8n; production untouched)\n');
let r = await post(good()); let j = await r.json(); const p = received[0]?.b;
check('valid -> 200 { ok, submissionId }', r.status === 200 && j.ok === true && typeof j.submissionId === 'string');
check('payload matches agreed scheme', !!p && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(p.submissionId) && /Z$/.test(p.timestamp) && p.client.consentGiven === true && p.client.email === 'alex@creatoragency.com' && p.client.service === 'Gaming Content Editing' && p.metadata.source === 'Website Inbound Lead' && p.metadata.locale === 'en-US' && p.metadata.referrer === 'direct');
check('internal fields not forwarded', !('company_website' in p.client) && !('elapsedMs' in p.client));
check('secret header sent server-side', received[0].h['x-webhook-secret'] === 'test-secret');
check('response never leaks webhook URL', !JSON.stringify(j).includes('127.0.0.1'));
r = await post(good({ email: 'nope' }), { ip: ipn(2) }); check('invalid email -> 422 + field error', r.status === 422 && !!(await r.json()).fieldErrors?.email);
r = await post(good({ consentGiven: false }), { ip: ipn(2) }); check('no consent -> 422', r.status === 422);
r = await post(good({ service: 'Hacking' }), { ip: ipn(2) }); check('unknown service -> 422', r.status === 422);
r = await post(good({ rawFootageLink: 'javascript:alert(1)' }), { ip: ipn(2) }); check('non-http footage link -> 422', r.status === 422);
received = []; r = await post(good({ name: '<script>alert(1)</script><b>Alex</b>' }), { ip: ipn(3) });
check('HTML stripped from text', r.status === 200 && !/[<>]/.test(received[0].b.client.name) && received[0].b.client.name.includes('Alex'));
r = await post('{bad json', { ip: ipn(4) }); check('malformed JSON -> 400', r.status === 400);
r = await post(good(), { ip: ipn(5), type: 'text/plain' }); check('wrong content-type -> 415', r.status === 415);
r = await fetch(base); check('GET -> 405', r.status === 405);
r = await post(good(), { ip: ipn(6), headers: { Origin: 'https://evil.example' } }); check('foreign Origin -> 403', r.status === 403);
received = [];
r = await post(good({ company_website: 'spam' }), { ip: ipn(7) }); check('honeypot -> silent 200', r.status === 200 && (await r.json()).ok === true);
r = await post(good({ elapsedMs: 300 }), { ip: ipn(8) }); check('instant submit -> silent 200', r.status === 200);
check('bot submissions not forwarded', received.length === 0);
const codes = []; for (let i = 0; i < 6; i++) codes.push((await post(good(), { ip: ipn(9) })).status);
check(`rate limit: ${codes.join(',')}`, codes.slice(0, 5).every((c) => c === 200) && codes[5] === 429);
r = await post(good(), { ip: ipn(9) }); check('429 has Retry-After', Number(r.headers.get('retry-after')) > 0);
r = await post(good(), { ip: ipn(10) }); check('other IPs unaffected', r.status === 200);
mode = 'error'; r = await post(good(), { ip: ipn(11) }); j = await r.json(); check('n8n 500 -> 502 + email fallback', r.status === 502 && /jehadmahadihassan@gmail\.com/.test(j.message));
mode = 'hang'; const t0 = Date.now(); r = await post(good(), { ip: ipn(12) }); j = await r.json(); check(`n8n hang -> 504 (${Date.now() - t0}ms) + fallback`, r.status === 504 && Date.now() - t0 < 4000 && /jehadmahadihassan@gmail\.com/.test(j.message));
mode = 'ok'; cfg('http://127.0.0.1:1/x'); r = await post(good(), { ip: ipn(13) }); check('n8n unreachable -> 502 fallback', r.status === 502);
cfg(''); r = await post(good(), { ip: ipn(14) }); check('no webhook configured -> 503 fallback', r.status === 503);
console.log(`\n${pass} passed, ${fail} failed\n`);
php.kill(); mock.closeAllConnections?.(); mock.close(); process.exit(fail ? 1 : 0);
