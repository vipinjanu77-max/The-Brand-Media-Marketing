/**
 * JSON-LD builders. Only emit what is true: no ratings, reviews or credentials unless
 * they exist in verified CMS data. Empty admin fields are omitted rather than invented.
 */
import { site, has, sameAs } from './site';

export const ORG_ID = (origin: string) => `${origin}/#organization`;
export const SITE_ID = (origin: string) => `${origin}/#website`;

const clean = <T extends Record<string, unknown>>(o: T): T =>
  Object.fromEntries(
    Object.entries(o).filter(([, v]) => v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)),
  ) as T;

export function organization(origin: string) {
  const a = site.address;
  const hasAddress = has(a.street) && has(a.city);
  return clean({
    '@type': hasAddress ? ['Organization', 'ProfessionalService'] : 'Organization',
    '@id': ORG_ID(origin),
    name: site.name,
    alternateName: site.shortName,
    legalName: has(site.legalName) ? site.legalName : undefined,
    url: `${origin}/`,
    logo: `${origin}/images/tbm-logo.png`,
    description: site.description,
    slogan: site.tagline,
    foundingDate: has(site.foundingYear) ? site.foundingYear : undefined,
    founder: has(site.founder) ? { '@type': 'Person', name: site.founder } : undefined,
    email: has(site.email) ? site.email : undefined,
    telephone: has(site.phone) ? site.phone : undefined,
    areaServed: site.areaServed.map((n) => ({ '@type': 'Country', name: n })),
    address: hasAddress
      ? clean({
          '@type': 'PostalAddress',
          streetAddress: a.street,
          addressLocality: a.city,
          addressRegion: a.region,
          postalCode: a.postalCode,
          addressCountry: a.country,
        })
      : undefined,
    sameAs: sameAs(),
    knowsAbout: [
      'Digital marketing',
      'Performance marketing',
      'Search engine optimization',
      'Answer engine optimization',
      'Google Ads',
      'Meta Ads',
      'Marketing analytics',
      'Conversion rate optimization',
      'Marketing automation',
    ],
  });
}

export function website(origin: string) {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID(origin),
    url: `${origin}/`,
    name: site.name,
    publisher: { '@id': ORG_ID(origin) },
    inLanguage: 'en-IN',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${origin}/search/?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function webPage(url: string, name: string, description: string, origin: string, type = 'WebPage') {
  return { '@type': type, '@id': `${url}#webpage`, url, name, description, isPartOf: { '@id': SITE_ID(origin) }, inLanguage: 'en-IN' };
}

export function breadcrumbs(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
  };
}

export function faqPage(faqs: { q: string; a: string }[]) {
  if (!faqs.length) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function service(opts: { name: string; description: string; url: string; origin: string; serviceType: string }) {
  return {
    '@type': 'Service',
    '@id': `${opts.url}#service`,
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url: opts.url,
    provider: { '@id': ORG_ID(opts.origin) },
    areaServed: site.areaServed.map((n) => ({ '@type': 'Country', name: n })),
  };
}

export function article(opts: {
  type?: 'Article' | 'BlogPosting' | 'Report';
  headline: string;
  description: string;
  url: string;
  origin: string;
  published: Date;
  updated: Date;
  author?: { name: string; url: string; type: 'person' | 'organization' };
  reviewer?: { name: string; url: string };
  image?: string;
  keywords?: string[];
  citations?: string[];
}) {
  return clean({
    '@type': opts.type ?? 'Article',
    '@id': `${opts.url}#article`,
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    mainEntityOfPage: opts.url,
    datePublished: opts.published.toISOString(),
    dateModified: opts.updated.toISOString(),
    author: opts.author
      ? { '@type': opts.author.type === 'organization' ? 'Organization' : 'Person', name: opts.author.name, url: opts.author.url }
      : { '@id': ORG_ID(opts.origin) },
    reviewedBy: opts.reviewer ? { '@type': 'Person', name: opts.reviewer.name, url: opts.reviewer.url } : undefined,
    publisher: { '@id': ORG_ID(opts.origin) },
    image: opts.image,
    keywords: opts.keywords?.join(', '),
    citation: opts.citations,
    inLanguage: 'en-IN',
  });
}

export function person(opts: { name: string; role: string; url: string; origin: string; image?: string; sameAs?: string[]; knowsAbout?: string[] }) {
  return clean({
    '@type': 'Person',
    '@id': `${opts.url}#person`,
    name: opts.name,
    jobTitle: opts.role,
    url: opts.url,
    image: opts.image,
    worksFor: { '@id': ORG_ID(opts.origin) },
    sameAs: opts.sameAs,
    knowsAbout: opts.knowsAbout,
  });
}

export function definedTerm(opts: { term: string; definition: string; url: string; origin: string }) {
  return {
    '@type': 'DefinedTerm',
    '@id': `${opts.url}#term`,
    name: opts.term,
    description: opts.definition,
    url: opts.url,
    inDefinedTermSet: { '@type': 'DefinedTermSet', name: 'TBM Marketing Glossary', url: `${opts.origin}/glossary/` },
  };
}

export function dataset(opts: { name: string; description: string; url: string; origin: string; temporal?: string; spatial?: string; creator?: string }) {
  return clean({
    '@type': 'Dataset',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    temporalCoverage: opts.temporal,
    spatialCoverage: opts.spatial,
    creator: opts.creator ? { '@type': 'Organization', name: opts.creator } : { '@id': ORG_ID(opts.origin) },
    isAccessibleForFree: true,
  });
}

export function graph(...nodes: (Record<string, unknown> | null | undefined)[]) {
  return { '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) };
}
