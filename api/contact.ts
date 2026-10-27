import type { VercelRequest, VercelResponse } from '@vercel/node';
import { processContact, MAX_BODY_BYTES, __resetRateLimit, type ContactRequest } from '../shared/contactHandler.js';

/** Vercel adapter for POST /api/contact. All logic lives in shared/contactHandler.ts. */
export { __resetRateLimit };

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

async function readBody(req: VercelRequest): Promise<Pick<ContactRequest, 'body' | 'bodyError'>> {
  if (req.body !== undefined && typeof req.body === 'object' && req.body !== null) return { body: req.body };
  const chunks: Buffer[] = []; let size = 0;
  for await (const c of req) {
    size += (c as Buffer).length;
    if (size > MAX_BODY_BYTES) return { body: undefined, bodyError: 'too_large' };
    chunks.push(c as Buffer);
  }
  try { return { body: JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}') }; } catch { return { body: undefined, bodyError: 'invalid' }; }
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const headers: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(req.headers)) headers[k.toLowerCase()] = first(v);
  const ip = first(req.headers['x-forwarded-for'])?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const body = req.method === 'POST' ? await readBody(req) : { body: undefined };
  const out = await processContact({ method: req.method ?? 'GET', headers, ip, ...body });
  for (const [k, v] of Object.entries(out.headers)) res.setHeader(k, v);
  res.status(out.status).json(out.body);
}
