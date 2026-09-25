import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { validateLead, rateLimited, verifyTurnstile, deliverLead } from '../../lib/leadPipeline';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');
  const fail = (error: string, status = 400) =>
    wantsJson ? json({ error }, status) : new Response(null, { status: 303, headers: { location: `/contact/?error=${encodeURIComponent(error)}` } });

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || clientAddress || 'unknown';
  if (rateLimited(ip)) return fail('Too many submissions. Please try again in a few minutes.', 429);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail('Invalid submission.');
  }
  // Honeypot: bots fill hidden fields. Pretend success so they don't retry.
  if (String(form.get('company_website') ?? '').length > 0) return json({ ok: true, tier: 'low-intent', redirect: '/thank-you/' });

  if (!(await verifyTurnstile(form.get('cf-turnstile-response') as string | null, ip))) return fail('Spam check failed. Please try again.');

  const industries = (await getCollection('industries')).map((i) => i.id);
  const { lead, error } = validateLead(form, industries);
  if (!lead) return fail(error ?? 'Invalid submission.');

  try {
    const { tier } = await deliverLead(lead);
    const redirect = `/thank-you/?t=${encodeURIComponent(tier)}&i=${encodeURIComponent(lead.industry)}`;
    return wantsJson ? json({ ok: true, tier, redirect }) : new Response(null, { status: 303, headers: { location: redirect } });
  } catch {
    return fail('We could not save your details just now. Please try again or email us.', 502);
  }
};

export const ALL: APIRoute = () => json({ error: 'Method not allowed' }, 405);
