# CMS guide

TBM uses **Decap CMS** at `/admin/`. Content is stored as YAML/Markdown in the repository, so every change is versioned and reviewable.

## Access and roles

- Login uses the GitHub backend. Configure an OAuth provider and set `backend.base_url` in `public/admin/config.yml`.
- **Role-based access** comes from repository permissions: *write* access can draft; merging to `main` (publishing) can be restricted with branch protection and required reviews.
- `publish_mode: editorial_workflow` means every edit goes Draft → In review → Ready → Published (a pull request).

## Collections

| Collection | Notes |
|---|---|
| Site settings | Contact details, booking URL, social profiles (keep entity info identical everywhere), analytics IDs, exit-intent offer, verified client logos |
| Services / Industries | All sections of each page, FAQs, cross-links |
| Case studies | Turn off **Draft** to publish |
| Research | Choose the correct label. Put TBM interpretation under a clearly labelled "TBM analysis" heading |
| Statistics database | One list. Every entry needs source, URL, period, geography, type. Switch verification to `editor-verified` after checking the primary source |
| Blog & guides | Fill *direct answer* (AEO), *search intent*, *originality*, author and reviewer. Keep `draft` on until reviewed |
| Glossary / Comparisons | Short definition first, then nuance |
| Team & authors | Real people only. Placeholder profiles are `noindex` |
| Testimonials | Verbatim quotes, with written consent |
| Pricing | Leave a price blank to show a placeholder; never hard-code prices in templates |
| TBM market data | Publish figures only when minimum group sizes are met |
| Markets & locations | Set `published` only for markets TBM genuinely serves, with unique research |

## SEO fields

Every page gets automatic title/description/OG suggestions. Use the optional **SEO overrides** block to set title, description, OG title/description, social image, canonical or noindex manually.

## Adding a case study

1. Case studies → New. Fill every field; attach screenshots with alt text and captions.
2. Leave `draft` on while you work on it.
3. Turn off `draft` and publish.
4. The case study appears on `/case-studies/`, the Results Library, related service and industry pages, and in the internal linking engine automatically.
