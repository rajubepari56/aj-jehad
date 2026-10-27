import { randomUUID } from 'node:crypto';
import { contactSchema, flattenErrors, SUPPORT_EMAIL, type LeadPayload } from './contact.js';

/**
 * Host-independent core of POST /api/contact. Vercel (api/contact.ts) and Netlify
 * (netlify/functions/contact.ts) are thin adapters around this. The n8n webhook URL is read from
 * the N8N_WEBHOOK_URL environment variable here, on the server, and never leaves it.
 */
export interface ContactRequest {
  method: string;
  headers: Record<string, string | undefined>; // lower-case keys
  ip: string;
  /** Parsed JSON body, or undefined when it could not be read. */
  body: unknown;
  bodyError?: 'too_large' | 'invalid';
}
export interface ContactResponse { status: number; headers: Record<string, string>; body: Record<string, unknown> }

export const MAX_BODY_BYTES = 16 * 1024;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MAX_TIMEOUT_MS = 8000; // hard cap: 8 seconds
const MIN_HUMAN_MS = 1500;
const webhookTimeout = () => Math.min(Number(process.env.N8N_TIMEOUT_MS) || MAX_TIMEOUT_MS, MAX_TIMEOUT_MS);

// In-memory limiter: per server instance. For hard global limits swap for Upstash/Redis/KV.
const hits = new Map<string, number[]>();
export const __resetRateLimit = () => hits.clear();

function rateLimit(ip: string, now = Date.now()): { limited: boolean; retryAfter: number } {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) { hits.set(ip, recent); return { limited: true, retryAfter: Math.ceil((WINDOW_MS - (now - recent[0])) / 1000) }; }
  recent.push(now); hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  return { limited: false, retryAfter: 0 };
}

const fallbackMessage = `Sorry, I couldn't send your inquiry right now. Please email ${SUPPORT_EMAIL} directly and I'll reply within 24 hours.`;

function originAllowed(h: Record<string, string | undefined>): boolean {
  const origin = h.origin;
  if (!origin) return true;
  const allowed = (process.env.ALLOWED_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const host = h['x-forwarded-host'] ?? h.host;
  try {
    const o = new URL(origin);
    return o.host === host || allowed.includes(o.origin) || o.hostname === 'localhost' || o.hostname === '127.0.0.1';
  } catch { return false; }
}

async function forward(payload: LeadPayload): Promise<'ok' | 'timeout' | 'unreachable' | 'rejected' | 'unconfigured'> {
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) return 'unconfigured';
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), webhookTimeout());
  try {
    const res = await fetch(url, {
      method: 'POST', signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json', ...(process.env.N8N_WEBHOOK_SECRET ? { 'X-Webhook-Secret': process.env.N8N_WEBHOOK_SECRET } : {}) },
      body: JSON.stringify(payload),
    });
    return res.ok ? 'ok' : 'rejected';
  } catch (e) {
    return (e as { name?: string }).name === 'AbortError' ? 'timeout' : 'unreachable';
  } finally { clearTimeout(timer); }
}

export async function processContact(req: ContactRequest): Promise<ContactResponse> {
  const headers: Record<string, string> = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
  const reply = (status: number, body: Record<string, unknown>, extra: Record<string, string> = {}): ContactResponse => ({ status, headers: { ...headers, ...extra }, body });

  if (req.method !== 'POST') return reply(405, { ok: false, code: 'method_not_allowed', message: 'Method not allowed.' }, { Allow: 'POST' });
  if (!originAllowed(req.headers)) return reply(403, { ok: false, code: 'forbidden', message: 'Request not allowed.' });

  const rl = rateLimit(req.ip);
  if (rl.limited) return reply(429, { ok: false, code: 'rate_limited', message: `Too many submissions. Please try again in ${Math.ceil(rl.retryAfter / 60)} minutes, or email ${SUPPORT_EMAIL}.` }, { 'Retry-After': String(rl.retryAfter) });

  if (!/^application\/json/i.test(req.headers['content-type'] ?? '')) return reply(415, { ok: false, code: 'bad_request', message: 'Unsupported content type.' });
  if (req.bodyError === 'too_large') return reply(413, { ok: false, code: 'bad_request', message: 'Message is too large.' });
  if (req.bodyError === 'invalid' || req.body === undefined) return reply(400, { ok: false, code: 'bad_request', message: 'Invalid request.' });

  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) return reply(422, { ok: false, code: 'validation', message: 'Please check the highlighted fields.', fieldErrors: flattenErrors(parsed.error) });
  const d = parsed.data;

  // Bots: honeypot filled, or submitted faster than a human can type. Pretend success; forward nothing.
  if (d.company_website.trim() !== '' || (d.elapsedMs > 0 && d.elapsedMs < MIN_HUMAN_MS)) return reply(200, { ok: true, submissionId: randomUUID() });

  const payload: LeadPayload = {
    submissionId: randomUUID(),
    timestamp: new Date().toISOString(),
    client: {
      name: d.name, email: d.email, channelOrBrand: d.channelOrBrand, service: d.service, budgetTier: d.budgetTier,
      footageVolume: d.footageVolume, turnaround: d.turnaround, rawFootageLink: d.rawFootageLink, projectScope: d.projectScope, consentGiven: true,
    },
    metadata: {
      source: 'Website Inbound Lead',
      locale: (req.headers['accept-language'] ?? 'en-US').split(',')[0].slice(0, 16) || 'en-US',
      referrer: d.referrer || (req.headers.referer ?? '').slice(0, 300) || 'direct',
    },
  };

  const result = await forward(payload);
  if (result === 'ok') return reply(200, { ok: true, submissionId: payload.submissionId });
  console.error(`[contact] webhook ${result} (submission ${payload.submissionId})`); // never logs the URL or the lead's details
  return reply(result === 'timeout' ? 504 : result === 'unconfigured' ? 503 : 502, { ok: false, code: `upstream_${result}`, message: fallbackMessage });
}
