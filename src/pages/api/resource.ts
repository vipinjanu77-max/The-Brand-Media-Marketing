import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import { rateLimited } from '../../lib/leadPipeline';
import { createHmac } from 'node:crypto';

export const prerender = false;
const env = (k: string) => (import.meta.env?.[k] as string | undefined) ?? process.env[k];
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || clientAddress || 'unknown';
  if (rateLimited(`res:${ip}`, 15)) return json({ error: 'Too many requests. Please try again later.' }, 429);
  const f = await request.formData().catch(() => null);
  if (!f) return json({ error: 'Invalid submission.' }, 400);
  if (String(f.get('company_website') ?? '')) return json({ ok: true });
  const name = String(f.get('name') ?? '').trim().slice(0, 100);
  const email = String(f.get('email') ?? '').trim().toLowerCase().slice(0, 160);
  const company = String(f.get('company') ?? '').trim().slice(0, 120);
  const slug = String(f.get('resource') ?? '').slice(0, 80);
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email) || f.get('privacy') !== 'yes') return json({ error: 'Please enter your name, a valid email and accept the privacy policy.' }, 400);
  const resource = await getEntry('resources', slug);
  if (!resource || !resource.data.file) return json({ error: 'Unknown resource.' }, 404);

  const url = env('CRM_WEBHOOK_URL');
  if (url) {
    const payload = JSON.stringify({ event: 'resource_download', receivedAt: new Date().toISOString(), lead: { name, email, company }, resource: slug, nurture: { sequence: 'education-nurture-30d' } });
    const secret = env('CRM_WEBHOOK_SECRET');
    await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', ...(secret ? { 'x-tbm-signature': createHmac('sha256', secret).update(payload).digest('hex') } : {}) }, body: payload, signal: AbortSignal.timeout(8000) }).catch((e) => console.error('[resource] webhook failed', String(e)));
  }
  return json({ ok: true, file: resource.data.file });
};
