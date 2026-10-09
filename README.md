# The Brand Media Marketing (TBM) — website & marketing intelligence platform

A production-ready, SEO/AEO-first website for TBM built with **Astro 7** (static pages + a small Node server for form APIs), a **git-based CMS** (Decap) over typed content collections, and almost no client-side JavaScript.

> **Credibility rule:** nothing on this site invents clients, logos, testimonials, awards, certifications, results or statistics.
>
> **Preview vs production:** with `PUBLIC_SHOW_PLACEHOLDERS=true` (e.g. `PUBLIC_SHOW_PLACEHOLDERS=true npm run dev`) missing information shows as yellow `[ADMIN …]` placeholders. Production builds hide them and render honest public fallbacks (e.g. "Published case studies appear here as clients approve them"), so the site can launch before every item is filled. Run a preview build + `npm run audit:content` to count what remains.

## Quick start

```bash
npm install
npm run dev          # http://localhost:4321
npm test             # calculator + lead-scoring unit tests
npm run build        # type-check + build (dist/)
npm run audit:content   # after a build: links, headings, alt text, JSON-LD, content cross-refs
npm start            # run the built server (node dist/server/entry.mjs)
```

Environment variables: see `.env.example`. **`SITE_URL` must be set at build time** — it drives canonicals, the sitemap, schema and the trusted-host list for form posts.

## Deploy

**Docker (recommended):**
```bash
docker build --build-arg SITE_URL=https://www.yourdomain.com -t tbm-site .
docker run -d -p 4321:4321 --env-file .env -v $(pwd)/data:/app/data tbm-site
```
Put it behind HTTPS (see `deploy/nginx.conf` for a reverse proxy with security and caching headers). Any Node 22 host works (Render, Railway, Fly.io, a VPS): `npm ci && npm run build && npm start`.

Without a CRM webhook, leads are saved to `data/leads/leads.jsonl` so none are lost — mount `data/` as a volume.

## Visual system

- `src/components/art/Artwork.astro` — generated, deterministic cover artwork (one motif per service/industry/topic in `src/lib/motifs.ts`). New CMS entries get artwork automatically; zero image weight.
- `src/components/home/HeroVisual.astro` — homepage hero composite.
- `src/components/infographics/` — system map, growth-loop ring, investment split, onboarding Gantt.
- Real photography (team, office, work) can be uploaded in the CMS (`photo` fields, case-study `evidence`, article `featuredImage`) and replaces artwork where provided.

## Pricing

The rate card (`src/content/pricing/*.yaml`) holds TBM's indicative prices (INR, excl. GST), benchmarked in September 2026 against published Indian agency price guides — see `/research/digital-marketing-agency-pricing-india-2026/`. **Owners should review and adjust these before launch**; they are editable in the CMS.

## Architecture

| Area | Where |
|---|---|
| Content model (CMS schema) | `src/content.config.ts` |
| Content (editable in CMS) | `src/content/**` (YAML + Markdown) |
| Global settings (contact, booking URL, analytics IDs, verified logos) | `src/data/settings.json` |
| CMS admin | `public/admin/` → `/admin/` (see `docs/CMS.md`) |
| Design system | `src/styles/global.css` (tokens, components) |
| Layouts | `src/layouts/Base.astro` (SEO/OG/schema/analytics), `Article.astro` |
| SEO metadata + auto suggestions | `src/lib/seo.ts` |
| Structured data | `src/lib/schema.ts` |
| Internal linking engine / knowledge graph | `src/lib/graph.ts` + `RelatedContent.astro` |
| Calculators (pure, tested) | `src/lib/calculators.ts`, `tests/` |
| Lead scoring + delivery | `src/lib/leadScore.ts`, `src/lib/leadPipeline.ts`, `src/pages/api/lead.ts` |
| Tools UI | `src/components/tools/*` |

### URL hierarchy

`/services/{slug}/` · `/industries/{slug}/` · `/case-studies/{slug}/` · `/results/` · `/research/{slug}/` · `/research/market-data/` · `/research/dashboards/` · `/statistics/` · `/guides/{slug}/` · `/blog/{slug}/` · `/glossary/{slug}/` · `/compare/{slug}/` · `/tools/{slug}/` · `/resources/{slug}/` · `/pricing/` · `/process/` · `/about/` · `/team/{slug}/` · `/markets/{slug}/` · `/locations/{slug}/` · `/legal/{slug}/`

Legacy aliases are 301-redirected in `astro.config.mjs`.

## Content rules enforced in code

- **Case studies** render when `draft: false`. The Results Library is generated from published case studies.
- **Testimonials** render only when `verified` and `consentOnFile` are true.
- **Statistics** require source, URL, year, reference period and geography; each shows a *fact / third-party estimate / forecast* badge and a *pending / editor-verified* badge.
- **Research** must be labelled `Industry Research`, `TBM Analysis` or `TBM Original Dataset`. Charts carry source, year, geography, method and forecast hatching.
- **TBM Market Data** is separated from third-party data and shows sample size, date range, methodology, limitations and a data-confidence indicator.
- **Pricing** comes from the CMS; empty prices render as `[PRICE — ADMIN TO SET IN CMS]`.
- **Location/market pages** exist only for entries with `published: true`.

## Lead flow

1. `/contact/` — 8-step progressive form (goal → industry → revenue → spend → geography → website → contact → challenge). `?intent=growth-audit|strategy-call|proposal` and UTM parameters are captured.
2. `POST /api/lead/` — origin check, honeypot, rate limit, optional Cloudflare Turnstile, server-side validation.
3. Lead score (`low-intent`, `medium-intent`, `high-intent`, `enterprise-opportunity`) from revenue, budget, intent, industry, geography, website and maturity.
4. Delivered as signed JSON (`x-tbm-signature`, HMAC-SHA256) to `CRM_WEBHOOK_URL` and `FOLLOWUP_WEBHOOK_URL`; optional JSONL fallback via `LEAD_STORE_PATH`.
5. "Your Growth Assessment is being prepared…" → `/thank-you/` → redirect to the booking URL from settings.

Follow-up automation (email/WhatsApp) is expected in your CRM/automation tool, keyed on `nurture.sequence`, `lead.industry`, `lead.goal` and `lead.spend`. See `docs/INTEGRATIONS.md`.

## Analytics

Consent-first: Google Consent Mode v2 defaults to denied; GTM/GA4/Google Ads/Meta Pixel load only after opt-in and only if IDs are set in settings. Events: see `docs/INTEGRATIONS.md`.

## Docs

- `docs/CMS.md` — editing content, roles, adding case studies/research/statistics
- `docs/INTEGRATIONS.md` — CRM webhook payload, analytics events, Search Console
- `docs/LAUNCH-CHECKLIST.md` — what must be filled/verified before going live
