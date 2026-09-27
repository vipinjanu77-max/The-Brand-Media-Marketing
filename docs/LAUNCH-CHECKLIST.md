# Launch checklist

Production builds hide placeholders automatically, so the site *can* launch as-is. For a list of what is still missing, build with `PUBLIC_SHOW_PLACEHOLDERS=true npm run build:fast && npm run audit:content`.

## Must supply (currently placeholders)
- [ ] Settings: legal name, email, phone, WhatsApp, address (real office only), booking URL, social profiles, analytics IDs
- [ ] Founder and team profiles (photo, role, expertise, verifiable experience, LinkedIn); assign reviewers to articles
- [ ] Review the indicative rate-card prices (pre-filled from Sept 2026 market research) and adjust to TBM's actual pricing
- [ ] Verified case studies with client approval; testimonials with consent; verified client logos with permission
- [ ] About page: founder story, locations, credentials (only with evidence)
- [ ] Careers roles
- [ ] Legal pages reviewed by counsel (then tick `reviewedByCounsel`); contract principles reviewed
- [ ] Editors verify each statistic against its primary source → `editor-verified`
- [ ] In-production resources (strategy template, marketing plan, budget spreadsheet)

## Configure
- [ ] `SITE_URL` at build; `ALLOWED_HOSTS` for any extra domains
- [ ] CRM + follow-up webhooks and secret; test a submission end to end
- [ ] Decap OAuth provider; branch protection on `main`
- [ ] Turnstile keys
- [ ] HTTPS, CDN caching for `/_astro/*` (immutable) and HTML (short TTL)
- [ ] GA4 key events, Google Ads conversion import, Meta Pixel + CAPI (server-side via CRM/automation)
- [ ] Search Console verification + sitemap submission

## Verify
- [ ] Lighthouse ≥ 90 on mobile for home, a service page, a guide and a tool
- [ ] Keyboard-only walkthrough of menu, form and tools
- [ ] Rich Results Test on a service, guide (FAQ) and research page
- [ ] Entity consistency: name, description, founder, services, locations identical across site, LinkedIn, Google Business Profile, directories
