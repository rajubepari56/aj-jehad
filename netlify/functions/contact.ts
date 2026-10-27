import { processContact, MAX_BODY_BYTES, type ContactRequest } from '../../shared/contactHandler.js';

/** Netlify Functions (v2) adapter for POST /api/contact. All logic lives in shared/contactHandler.ts. */
export const config = { path: '/api/contact' };

export default async (req: Request): Promise<Response> => {
  const headers: Record<string, string> = {};
  req.headers.forEach((v, k) => { headers[k.toLowerCase()] = v; });
  const ip = headers['x-nf-client-connection-ip'] ?? headers['x-forwarded-for']?.split(',')[0]?.trim() ?? 'unknown';
  let parsed: Pick<ContactRequest, 'body' | 'bodyError'> = { body: undefined };
  if (req.method === 'POST') {
    const text = await req.text();
    if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) parsed = { body: undefined, bodyError: 'too_large' };
    else { try { parsed = { body: JSON.parse(text || '{}') }; } catch { parsed = { body: undefined, bodyError: 'invalid' }; } }
  }
  const out = await processContact({ method: req.method, headers, ip, ...parsed });
  return new Response(JSON.stringify(out.body), { status: out.status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...out.headers } });
};
