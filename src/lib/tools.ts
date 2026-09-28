/** Registry of interactive tools. Tools are code, so they live here rather than in the CMS. */
export interface ToolDef {
  slug: string;
  title: string;
  short: string;
  description: string;
  question: string;
  stage: 'research' | 'comparison' | 'commercial';
  services: string[];
  glossary: string[];
}

export const tools: ToolDef[] = [
  {
    slug: 'marketing-roi-calculator',
    title: 'Marketing ROI Calculator',
    short: 'ROI Calculator',
    description: 'Work backwards from a revenue target to the leads, CPL, CAC, budget and break-even ROAS required to hit it.',
    question: 'How much do I need to spend on marketing to reach my revenue target?',
    stage: 'commercial',
    services: ['performance-marketing', 'analytics'],
    glossary: ['roas', 'cac', 'cpl', 'break-even-roas'],
  },
  {
    slug: 'digital-marketing-cost-calculator',
    title: 'Digital Marketing Cost Calculator',
    short: 'Cost Calculator',
    description: 'Estimate a sensible monthly investment range split into media, agency, creative, technology and contingency.',
    question: 'How much should my business budget for digital marketing?',
    stage: 'commercial',
    services: ['performance-marketing', 'seo', 'social-media'],
    glossary: ['media-spend', 'cac'],
  },
  {
    slug: 'agency-evaluation-checklist',
    title: 'Agency Evaluation Checklist',
    short: 'Agency Evaluation',
    description: 'Score any agency (including TBM) against 14 evidence-based criteria and download your evaluation report.',
    question: 'How do I choose a digital marketing agency?',
    stage: 'comparison',
    services: ['performance-marketing'],
    glossary: ['kpi'],
  },
  {
    slug: 'marketing-audit',
    title: 'Marketing Self-Audit',
    short: 'Marketing Audit',
    description: 'A 5-minute structured audit of your strategy, tracking, funnel and channels, with a prioritised score.',
    question: 'Where is my marketing leaking value?',
    stage: 'research',
    services: ['analytics', 'crm-automation', 'performance-marketing'],
    glossary: ['cro', 'mql', 'sql'],
  },
  {
    slug: 'media-planner',
    title: 'Media Planner',
    short: 'Media Planner',
    description: 'Split a monthly media budget across channels and see the implied clicks, leads and customers under your own assumptions.',
    question: 'How should I split my ad budget across channels?',
    stage: 'research',
    services: ['performance-marketing', 'google-ads', 'meta-ads'],
    glossary: ['cpc', 'cpm', 'ctr', 'cpl'],
  },
  {
    slug: 'cac-calculator',
    title: 'CAC Calculator',
    short: 'CAC Calculator',
    description: 'Calculate blended and paid customer acquisition cost, and compare it with customer lifetime value.',
    question: 'What is my customer acquisition cost?',
    stage: 'research',
    services: ['analytics', 'performance-marketing'],
    glossary: ['cac', 'ltv'],
  },
  {
    slug: 'roas-calculator',
    title: 'ROAS Calculator',
    short: 'ROAS Calculator',
    description: 'Calculate ROAS and the break-even ROAS your margins require, so you know whether a campaign is profitable.',
    question: 'What is a good ROAS for my business?',
    stage: 'research',
    services: ['performance-marketing', 'meta-ads', 'google-ads'],
    glossary: ['roas', 'break-even-roas'],
  },
  {
    slug: 'cpl-calculator',
    title: 'CPL Calculator',
    short: 'CPL Calculator',
    description: 'Calculate cost per lead and cost per qualified lead, and the maximum CPL your close rate and deal value can support.',
    question: 'What is a good CPL?',
    stage: 'research',
    services: ['performance-marketing', 'google-ads', 'meta-ads'],
    glossary: ['cpl', 'mql', 'sql'],
  },
  {
    slug: 'seo-health-checker',
    title: 'SEO Health Checker',
    short: 'SEO Health Check',
    description: 'A structured SEO self-assessment across technical, on-page, content, authority and AI-search readiness.',
    question: 'Is my website healthy for SEO and AI search?',
    stage: 'research',
    services: ['seo', 'aeo'],
    glossary: ['seo', 'aeo', 'core-web-vitals'],
  },
];

export const toolBySlug = (slug: string) => tools.find((t) => t.slug === slug);
