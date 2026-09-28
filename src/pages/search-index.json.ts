import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { tools } from '../lib/tools';
import { articleHref } from '../lib/graph';

/** Static search index, generated at build time. Small enough for client-side search at this scale. */
export const GET: APIRoute = async () => {
  const [services, industries, blog, research, glossary, compare, stats, resources] = await Promise.all([
    getCollection('services'), getCollection('industries'), getCollection('blog', (e) => !e.data.draft),
    getCollection('research', (e) => !e.data.draft), getCollection('glossary'), getCollection('compare'),
    getCollection('statistics'), getCollection('resources'),
  ]);
  const items = [
    ...services.map((e) => ({ t: e.data.title, u: `/services/${e.id}/`, d: e.data.summary, k: 'Service', x: e.data.subServices.map((s) => s.name).join(' ') })),
    ...industries.map((e) => ({ t: e.data.title, u: `/industries/${e.id}/`, d: e.data.summary, k: 'Industry', x: '' })),
    ...blog.map((e) => ({ t: e.data.title, u: articleHref(e), d: e.data.description, k: e.data.pillar ? 'Guide' : 'Article', x: e.data.keywords.join(' ') })),
    ...research.map((e) => ({ t: e.data.title, u: `/research/${e.id}/`, d: e.data.description, k: 'Research', x: e.data.category })),
    ...glossary.map((e) => ({ t: e.data.term, u: `/glossary/${e.id}/`, d: e.data.definition, k: 'Glossary', x: e.data.abbreviation ?? '' })),
    ...compare.map((e) => ({ t: e.data.title, u: `/compare/${e.id}/`, d: e.data.directAnswer, k: 'Comparison', x: '' })),
    ...tools.map((t) => ({ t: t.title, u: `/tools/${t.slug}/`, d: t.description, k: 'Tool', x: t.question })),
    ...stats.map((s) => ({ t: `${s.data.value}${s.data.unit ? ' ' + s.data.unit : ''}: ${s.data.statement}`, u: `/statistics/#stat-${s.id}`, d: `${s.data.source}, ${s.data.referencePeriod}`, k: 'Statistic', x: s.data.geography })),
    ...resources.map((r) => ({ t: r.data.title, u: `/resources/${r.id}/`, d: r.data.description, k: 'Resource', x: r.data.format })),
    { t: 'Pricing & rate card', u: '/pricing/', d: 'Transparent rate card and pricing philosophy.', k: 'Page', x: 'cost price fees' },
    { t: 'Process & onboarding', u: '/process/', d: 'What happens after you hire TBM.', k: 'Page', x: 'onboarding' },
    { t: 'Reporting demo', u: '/reporting-demo/', d: 'Interactive demo dashboard with sample data.', k: 'Page', x: 'report dashboard' },
  ];
  return new Response(JSON.stringify(items), { headers: { 'content-type': 'application/json' } });
};
