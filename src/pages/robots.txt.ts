import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const origin = (site?.origin ?? '').replace(/\/$/, '');
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /admin/',
    'Disallow: /thank-you/',
    'Disallow: /search/',
    '',
    `Sitemap: ${origin}/sitemap-index.xml`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
