/**
 * TBM content model.
 *
 * Every collection here is editable from the CMS (/admin/) without changing code.
 * Cross-links between entries use plain slugs (e.g. services: ['google-ads']) so the
 * internal-linking engine in src/lib/graph.ts can build the knowledge graph.
 *
 * Credibility rules are enforced in the schema where possible:
 *  - case studies render when `draft: false`; testimonials only when `verified: true`
 *  - statistics require a source, source URL, year and geography
 *  - research must declare a label that distinguishes TBM data from third-party data
 */
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders';
import yaml from 'js-yaml';

const seo = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    ogImage: z.string().optional(),
    canonical: z.url().optional(),
    noindex: z.boolean().default(false),
  })
  .default({ noindex: false });

const faq = z.object({ q: z.string(), a: z.string() });
const slugs = z.array(z.string()).default([]);

const links = {
  services: slugs,
  industries: slugs,
  tools: slugs,
  glossary: slugs,
  articles: slugs,
  research: slugs,
  compare: slugs,
};

const services = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    navLabel: z.string(),
    group: z.enum(['performance', 'search', 'social', 'creative', 'web', 'crm', 'analytics']),
    order: z.number().default(100),
    summary: z.string(),
    definition: z.string(),
    whoNeedsIt: z.array(z.string()),
    whyItMatters: z.string(),
    whatWeDo: z.array(z.object({ title: z.string(), body: z.string() })),
    subServices: z.array(z.object({ name: z.string(), description: z.string() })).default([]),
    process: z.array(z.object({ step: z.string(), detail: z.string() })),
    deliverables: z.array(z.string()),
    kpis: z.array(z.object({ name: z.string(), why: z.string() })),
    timeline: z.array(z.object({ period: z.string(), detail: z.string() })),
    mistakes: z.array(z.string()),
    faqs: z.array(faq).default([]),
    ...links,
    updated: z.coerce.date(),
    seo,
  }),
});

const industries = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/industries' }),
  schema: z.object({
    title: z.string(),
    order: z.number().default(100),
    featured: z.boolean().default(false),
    summary: z.string(),
    overview: z.string(),
    journey: z.array(z.object({ stage: z.string(), detail: z.string() })),
    funnel: z.array(z.object({ stage: z.string(), metric: z.string() })),
    challenges: z.array(z.string()),
    channels: z.array(z.object({ channel: z.string(), role: z.string() })),
    kpis: z.array(z.string()),
    strategy: z.array(z.object({ title: z.string(), body: z.string() })),
    faqs: z.array(faq).default([]),
    statTags: slugs,
    ...links,
    updated: z.coerce.date(),
    seo,
  }),
});

const glossary = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/glossary' }),
  schema: z.object({
    term: z.string(),
    abbreviation: z.string().optional(),
    definition: z.string(),
    explanation: z.string(),
    formula: z.string().optional(),
    example: z.string().optional(),
    ...links,
    related: slugs,
    updated: z.coerce.date(),
    seo,
  }),
});

const compare = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/compare' }),
  schema: z.object({
    title: z.string(),
    a: z.string(),
    b: z.string(),
    directAnswer: z.string(),
    rows: z.array(z.object({ criterion: z.string(), a: z.string(), b: z.string() })),
    chooseA: z.array(z.string()),
    chooseB: z.array(z.string()),
    together: z.string(),
    faqs: z.array(faq).default([]),
    ...links,
    updated: z.coerce.date(),
    seo,
  }),
});

const statistics = defineCollection({
  loader: file('./src/content/statistics/statistics.yaml', {
    // The CMS stores statistics under a top-level `statistics:` list.
    parser: (text) => (yaml.load(text) as { statistics: Record<string, unknown>[] }).statistics,
  }),
  schema: z.object({
    statement: z.string(),
    value: z.string(),
    unit: z.string().optional(),
    category: z.enum([
      'internet-mobile',
      'social-media',
      'advertising',
      'search-ai',
      'ecommerce',
      'video',
      'email-whatsapp',
      'seo',
    ]),
    kind: z.enum(['fact', 'third-party-estimate', 'forecast']),
    source: z.string(),
    publication: z.string(),
    sourceUrl: z.url(),
    year: z.number(),
    referencePeriod: z.string(),
    geography: z.string(),
    sampleSize: z.string().optional(),
    methodology: z.string().optional(),
    context: z.string(),
    accessedOn: z.coerce.date(),
    verification: z.enum(['pending-review', 'editor-verified']).default('pending-review'),
    tags: slugs,
  }),
});

const chart = z.object({
  title: z.string(),
  type: z.enum(['bar', 'line', 'column']),
  unit: z.string().default(''),
  source: z.string(),
  sourceUrl: z.url().optional(),
  year: z.string(),
  geography: z.string(),
  methodology: z.string(),
  kind: z.enum(['fact', 'third-party-estimate', 'forecast', 'tbm-dataset']),
  data: z.array(z.object({ label: z.string(), value: z.number(), forecast: z.boolean().default(false) })),
});

const research = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    label: z.enum(['Industry Research', 'TBM Analysis', 'TBM Original Dataset']),
    researchQuestion: z.string(),
    methodology: z.string(),
    dataSources: z.array(z.string()),
    geography: z.string(),
    sampleSize: z.string().default('Not applicable: secondary research'),
    findings: z.array(z.string()),
    limitations: z.array(z.string()),
    charts: z.array(chart).default([]),
    statTags: slugs,
    faqs: z.array(faq).default([]),
    author: z.string(),
    reviewer: z.string().optional(),
    published: z.coerce.date(),
    updated: z.coerce.date(),
    draft: z.boolean().default(false),
    ...links,
    seo,
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    directAnswer: z.string(),
    author: z.string(),
    reviewer: z.string().optional(),
    category: z.string(),
    cluster: z.enum(['digital-marketing', 'seo', 'paid-advertising', 'agency-selection', 'industry', 'aeo', 'analytics']),
    pillar: z.boolean().default(false),
    keywords: z.array(z.string()).default([]),
    searchIntent: z.enum(['informational', 'commercial', 'transactional', 'navigational']),
    originality: z.string(),
    featuredImage: z.string().optional(),
    featuredImageAlt: z.string().optional(),
    sources: z
      .array(z.object({ title: z.string(), publisher: z.string(), year: z.string(), url: z.url() }))
      .default([]),
    faqs: z.array(faq).default([]),
    published: z.coerce.date(),
    updated: z.coerce.date(),
    draft: z.boolean().default(false),
    ...links,
    seo,
  }),
});

const metric = z.object({ label: z.string(), before: z.string(), after: z.string(), change: z.string().optional() });

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    clientNamePublic: z.boolean().default(true),
    industry: z.string(),
    location: z.string(),
    country: z.string(),
    services: slugs,
    platforms: z.array(z.string()).default([]),
    objective: z.string(),
    challenge: z.string(),
    startingPoint: z.string(),
    budgetRange: z.enum(['< ₹1L/mo', '₹1-5L/mo', '₹5-20L/mo', '₹20L+/mo', 'Undisclosed']),
    timeline: z.string(),
    metrics: z.array(metric).default([]),
    businessImpact: z.string(),
    learnings: z.array(z.string()).default([]),
    testimonial: z.object({ quote: z.string(), person: z.string(), role: z.string() }).optional(),
    evidence: z.array(z.object({ image: z.string(), alt: z.string(), caption: z.string() })).default([]),
    author: z.string(),
    date: z.coerce.date(),
    /** Turn off to publish. */
    draft: z.boolean().default(true),
    seo,
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    type: z.enum(['person', 'organization']).default('person'),
    placeholder: z.boolean().default(false),
    order: z.number().default(100),
    photo: z.string().optional(),
    photoAlt: z.string().optional(),
    bio: z.string(),
    expertise: z.array(z.string()).default([]),
    experience: z.string().optional(),
    linkedin: z.string().optional(),
    projects: z.array(z.string()).default([]),
    seo,
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/testimonials' }),
  schema: z.object({
    quote: z.string(),
    person: z.string(),
    role: z.string(),
    company: z.string(),
    caseStudy: z.string().optional(),
    verified: z.boolean().default(false),
    consentOnFile: z.boolean().default(false),
  }),
});

const money = z.number().nullable().default(null);

const pricing = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/pricing' }),
  schema: z.object({
    title: z.string(),
    order: z.number().default(100),
    intro: z.string(),
    service: z.string().optional(),
    tiers: z.array(
      z.object({
        name: z.string(),
        priceFrom: money,
        priceTo: money,
        unit: z.string(),
        bestFor: z.string(),
        includes: z.array(z.string()),
        excludes: z.array(z.string()).default([]),
      }),
    ),
    notes: z.array(z.string()).default([]),
  }),
});

const faqs = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/faqs' }),
  schema: z.object({ topic: z.string(), order: z.number().default(100), items: z.array(faq) }),
});

const resources = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    format: z.string(),
    file: z.string().optional(),
    gated: z.boolean().default(true),
    status: z.enum(['available', 'in-production']),
    order: z.number().default(100),
    tools: slugs,
    services: slugs,
  }),
});

const datasets = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/datasets' }),
  schema: z.object({
    title: z.string(),
    label: z.enum(['TBM Original Dataset', 'Third-Party Market Data']),
    status: z.enum(['collecting', 'published']),
    description: z.string(),
    sampleSize: z.string(),
    dateRange: z.string(),
    methodology: z.string(),
    limitations: z.array(z.string()),
    confidence: z.enum(['low', 'moderate', 'high']),
    breakdowns: z.array(z.string()).default([]),
    metrics: z
      .array(z.object({ metric: z.string(), segment: z.string(), value: z.string(), n: z.number() }))
      .default([]),
  }),
});

const locations = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/locations' }),
  schema: z.object({
    name: z.string(),
    kind: z.enum(['city', 'country']),
    /** Only publish when TBM genuinely serves this market and the page has unique research. */
    published: z.boolean().default(false),
    summary: z.string(),
    marketContext: z.array(z.string()).default([]),
    industries: slugs,
    services: slugs,
    office: z.string().optional(),
    seo,
  }),
});

const legal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    updated: z.coerce.date(),
    reviewedByCounsel: z.boolean().default(false),
  }),
});

export const collections = {
  services,
  industries,
  glossary,
  compare,
  statistics,
  research,
  blog,
  caseStudies,
  team,
  testimonials,
  pricing,
  faqs,
  resources,
  datasets,
  locations,
  legal,
};
