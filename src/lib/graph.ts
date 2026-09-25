/**
 * Internal knowledge graph + linking engine.
 *
 * Every content node (service, industry, article, research, glossary term, comparison,
 * tool, case study) declares outbound links by slug. The engine combines:
 *   1. explicit outbound links
 *   2. inbound links (anything that points at this node)
 *   3. second-degree links through shared services/industries
 * and returns ranked recommendations per content type, e.g.
 *   Google Ads article → Google Ads service → real-estate case study → CPL calculator.
 */
import { getCollection } from 'astro:content';
import { tools } from './tools';

export type NodeType = 'service' | 'industry' | 'article' | 'research' | 'glossary' | 'compare' | 'tool' | 'caseStudy';

export interface GraphNode {
  type: NodeType;
  slug: string;
  title: string;
  href: string;
  summary: string;
  out: Partial<Record<NodeType, string[]>>;
}

const base: Record<NodeType, string> = {
  service: '/services/',
  industry: '/industries/',
  article: '/blog/',
  research: '/research/',
  glossary: '/glossary/',
  compare: '/compare/',
  tool: '/tools/',
  caseStudy: '/case-studies/',
};

export const hrefFor = (type: NodeType, slug: string) => `${base[type]}${slug}/`;
export const articleHref = (e: { id: string; data: { pillar?: boolean } }) => (e.data.pillar ? `/guides/${e.id}/` : `/blog/${e.id}/`);

type Links = { services?: string[]; industries?: string[]; tools?: string[]; glossary?: string[]; articles?: string[]; research?: string[]; compare?: string[] };
const outFrom = (d: Links): GraphNode['out'] => ({
  service: d.services ?? [],
  industry: d.industries ?? [],
  tool: d.tools ?? [],
  glossary: d.glossary ?? [],
  article: d.articles ?? [],
  research: d.research ?? [],
  compare: d.compare ?? [],
});

let cache: Promise<GraphNode[]> | null = null;

export function loadGraph(): Promise<GraphNode[]> {
  cache ??= (async () => {
    const [services, industries, blog, research, glossary, compare, cases] = await Promise.all([
      getCollection('services'),
      getCollection('industries'),
      getCollection('blog', (e) => !e.data.draft),
      getCollection('research', (e) => !e.data.draft),
      getCollection('glossary'),
      getCollection('compare'),
      getCollection('caseStudies', (e) => e.data.verified && !e.data.draft),
    ]);
    const nodes: GraphNode[] = [
      ...services.map((e) => ({ type: 'service' as const, slug: e.id, title: e.data.title, href: hrefFor('service', e.id), summary: e.data.summary, out: outFrom(e.data) })),
      ...industries.map((e) => ({ type: 'industry' as const, slug: e.id, title: e.data.title, href: hrefFor('industry', e.id), summary: e.data.summary, out: outFrom(e.data) })),
      ...blog.map((e) => ({ type: 'article' as const, slug: e.id, title: e.data.title, href: e.data.pillar ? `/guides/${e.id}/` : hrefFor('article', e.id), summary: e.data.description, out: outFrom(e.data) })),
      ...research.map((e) => ({ type: 'research' as const, slug: e.id, title: e.data.title, href: hrefFor('research', e.id), summary: e.data.description, out: outFrom(e.data) })),
      ...glossary.map((e) => ({ type: 'glossary' as const, slug: e.id, title: e.data.term, href: hrefFor('glossary', e.id), summary: e.data.definition, out: { ...outFrom(e.data), glossary: e.data.related } })),
      ...compare.map((e) => ({ type: 'compare' as const, slug: e.id, title: e.data.title, href: hrefFor('compare', e.id), summary: e.data.directAnswer, out: outFrom(e.data) })),
      ...tools.map((t) => ({ type: 'tool' as const, slug: t.slug, title: t.title, href: hrefFor('tool', t.slug), summary: t.description, out: { service: t.services, glossary: t.glossary } })),
      ...cases.map((e) => ({ type: 'caseStudy' as const, slug: e.id, title: e.data.title, href: hrefFor('caseStudy', e.id), summary: e.data.challenge, out: { service: e.data.services, industry: [slugify(e.data.industry)] } })),
    ];
    return nodes;
  })();
  return cache;
}

export const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/**
 * Related nodes for a given node, grouped by type and ranked by link strength.
 * Weights: explicit outbound 3, inbound 2, shared service/industry neighbour 1.
 */
export async function related(type: NodeType, slug: string, limitPerType = 4) {
  const nodes = await loadGraph();
  const key = (n: { type: NodeType; slug: string }) => `${n.type}:${n.slug}`;
  const self = nodes.find((n) => n.type === type && n.slug === slug);
  const scores = new Map<string, number>();
  const bump = (k: string, w: number) => scores.set(k, (scores.get(k) ?? 0) + w);

  if (self) {
    for (const [t, list] of Object.entries(self.out)) for (const s of list ?? []) bump(`${t}:${s}`, 3);
  }
  const selfServices = new Set(self?.out.service ?? []);
  const selfIndustries = new Set(self?.out.industry ?? []);
  if (type === 'service') selfServices.add(slug);
  if (type === 'industry') selfIndustries.add(slug);

  for (const n of nodes) {
    if (n.type === type && n.slug === slug) continue;
    if ((n.out[type] ?? []).includes(slug)) bump(key(n), 2);
    const sharedS = (n.out.service ?? []).filter((s) => selfServices.has(s)).length;
    const sharedI = (n.out.industry ?? []).filter((s) => selfIndustries.has(s)).length;
    if (sharedS + sharedI) bump(key(n), Math.min(2, (sharedS + sharedI) * 0.5));
  }

  const byKey = new Map(nodes.map((n) => [key(n), n]));
  const grouped: Partial<Record<NodeType, GraphNode[]>> = {};
  [...scores.entries()]
    .filter(([k]) => byKey.has(k) && k !== `${type}:${slug}`)
    .sort((a, b) => b[1] - a[1])
    .forEach(([k]) => {
      const n = byKey.get(k)!;
      const arr = (grouped[n.type] ??= []);
      if (arr.length < limitPerType) arr.push(n);
    });
  return grouped;
}

export const typeLabels: Record<NodeType, string> = {
  service: 'Services',
  industry: 'Industries',
  article: 'Guides & articles',
  research: 'Research',
  glossary: 'Glossary',
  compare: 'Comparisons',
  tool: 'Tools & calculators',
  caseStudy: 'Case studies',
};
