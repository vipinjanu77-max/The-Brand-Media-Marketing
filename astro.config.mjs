// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// SITE_URL must be set in production so canonicals, sitemap and schema use the live domain.
const site = process.env.SITE_URL || 'https://www.thebrandmediamarketing.com';

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
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  build: { inlineStylesheets: 'auto' },
  image: { responsiveStyles: true },
  security: { checkOrigin: true },
  redirects: {
    // 301s — keep legacy / alias URLs pointing to canonical pages.
    '/contact-us': '/contact/',
    '/services/ppc': '/services/google-ads/',
    '/services/search-engine-optimization': '/services/seo/',
    '/tools/roi-calculator': '/tools/marketing-roi-calculator/',
    '/pricing/rate-card': '/pricing/',
  },
});
