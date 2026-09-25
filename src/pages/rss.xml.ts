import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../lib/site';
import { articleHref } from '../lib/graph';

const esc = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!);

export const GET: APIRoute = async ({ site: siteUrl }) => {
  const origin = (siteUrl?.origin ?? '').replace(/\/$/, '');
  const blog = await getCollection('blog', (e) => !e.data.draft);
  const research = await getCollection('research', (e) => !e.data.draft);
  const items = [
    ...blog.map((e) => ({ t: e.data.title, u: articleHref(e), d: e.data.description, p: e.data.published })),
    ...research.map((e) => ({ t: e.data.title, u: `/research/${e.id}/`, d: e.data.description, p: e.data.published })),
  ].sort((a, b) => +b.p - +a.p);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${esc(site.name)} — Insights</title><link>${origin}/insights/</link><description>${esc(site.description)}</description><language>en-in</language>
${items.map((i) => `<item><title>${esc(i.t)}</title><link>${origin}${i.u}</link><guid>${origin}${i.u}</guid><description>${esc(i.d)}</description><pubDate>${i.p.toUTCString()}</pubDate></item>`).join('\n')}
</channel></rss>`;
  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
};
