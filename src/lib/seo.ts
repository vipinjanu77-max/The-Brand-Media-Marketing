/**
 * SEO metadata system: every page passes a title/description; CMS `seo` fields override.
 * Suggestions are generated automatically (title length-trimmed + brand suffix, description
 * trimmed at a sentence/word boundary) but any manual override wins.
 */
import { site } from './site';

export interface SeoOverrides {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
}

export function suggestTitle(title: string): string {
  const suffix = ` | ${site.shortName}`;
  if (title.includes(site.name) || title.includes(site.shortName)) return title;
  return title.length + suffix.length <= 62 ? `${title}${suffix}` : title;
}

export function suggestDescription(text: string, max = 158): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const sentence = cut.lastIndexOf('. ');
  if (sentence > 90) return cut.slice(0, sentence + 1);
  return `${cut.slice(0, cut.lastIndexOf(' '))}...`;
}

export function resolveSeo(base: { title: string; description: string }, o: SeoOverrides = {}) {
  const title = o.title ?? suggestTitle(base.title);
  const description = o.description ?? suggestDescription(base.description);
  return {
    title,
    description,
    ogTitle: o.ogTitle ?? o.title ?? base.title,
    ogDescription: o.ogDescription ?? description,
    ogImage: o.ogImage ?? '/images/og-default.png',
    canonical: o.canonical,
    noindex: o.noindex ?? false,
  };
}
