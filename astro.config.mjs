// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// SITE_URL must be set in production so canonicals, sitemap and schema use the live domain.
const site = process.env.SITE_URL || 'https://www.thebrandmediamarketing.com';

// Hosts the server trusts in Host / X-Forwarded-Host headers. Without this, Astro treats every
// request as http://localhost and the origin check rejects same-origin form posts (403).
// ALLOWED_HOSTS lets you add e.g. a staging domain or localhost:4321 for local testing.
const allowedDomains = [site, ...(process.env.ALLOWED_HOSTS ?? '').split(',')]
  .map((h) => h.trim())
  .filter(Boolean)
  .map((h) => {
    const u = new URL(h.includes('://') ? h : `https://${h}`);
    return { hostname: u.hostname, protocol: u.protocol.replace(':', ''), ...(u.port ? { port: u.port } : {}) };
  });

export default defineConfig({
  site,
  trailingSlash: 'always',
  // Pages are pre-rendered (fast, CDN-cacheable). Only API routes opt out with `prerender = false`.
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        !/\/(thank-you|admin|search|api)\//.test(page) && !page.includes('/404'),
      changefreq: 'weekly',
    }),
  ],
  // Plain punctuation: no automatic curly quotes, long dashes or ellipsis characters in Markdown.
  markdown: { smartypants: false },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  // Inline CSS (≈30 KB) to remove the render-blocking stylesheet request on first visit.
  build: { inlineStylesheets: 'always' },
  image: { responsiveStyles: true },
  security: { checkOrigin: true, allowedDomains },
  redirects: {
    // 301s — keep legacy / alias URLs pointing to canonical pages.
    '/contact-us': '/contact/',
    '/services/ppc': '/services/google-ads/',
    '/services/search-engine-optimization': '/services/seo/',
    '/tools/roi-calculator': '/tools/marketing-roi-calculator/',
    '/pricing/rate-card': '/pricing/',
    '/compare/meta-ads-vs-google-ads': '/compare/google-ads-vs-meta-ads/',
    '/rate-card': '/pricing/',
  },
});
