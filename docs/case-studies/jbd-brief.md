# JBD case study: publishing brief

Companion to `src/content/case-studies/jbd-jhunjhunu-cafe.mdx`.
Status: **ILLUSTRATIVE DRAFT. Do not publish until every row in section 5 is verified.**

---

## 1. SEO and AEO pack

| Field | Value |
|---|---|
| URL slug | `/case-studies/jbd-jhunjhunu-cafe/` |
| SEO title (61 chars) | Cafe Marketing Case Study: How JBD Became a Local Brand in Jhunjhunu \| TBM |
| Meta description (≈190 chars, trim to 155 if needed) | How TBM used branding, Instagram, Meta Ads, Google Business Profile, combo offers and WhatsApp retention to help JBD, a Jhunjhunu cafe, build local recall and repeat customers on a small budget. |
| Open Graph title | Turning a Local Cafe Into a Local Brand: the JBD Case Study |
| Open Graph description | Branding, local ads, profitable combos and WhatsApp retention: how a Jhunjhunu cafe built a repeatable customer acquisition system. |
| OG image | 1200x630: JBD storefront or interior photo, headline "Local cafe to local brand", and two before/after numbers |
| Primary keyword | cafe marketing case study |
| Secondary keywords | restaurant marketing case study; digital marketing case study India; local business marketing case study; cafe marketing ideas India; Jhunjhunu digital marketing; digital marketing agency Jhunjhunu; Google Business Profile for cafe; Instagram marketing for cafe; TBM case study |

Keyword volumes for "Jhunjhunu digital marketing" terms are **UNKNOWN** (likely very low). They are included for local relevance and brand entity, not traffic. Verify in Google Keyword Planner or Search Console before prioritising.

**AEO summary** (place it near the top of the page as a direct answer; it is also good for AI answer engines):

> JBD (Jhunjhunu Brewery & Dairy) is a pure-vegetarian cafe in Jhunjhunu, Rajasthan. Over six months, TBM repositioned it around "Crafting Memories with Traditional Taste" and combined a consistent visual identity, local Instagram content, 3 to 5 km Meta radius ads, Google Business Profile optimisation, margin-safe combo offers and WhatsApp retention into one local acquisition system. Ad spend stayed under ₹25,000 a month. [Verified headline result: ADMIN TO ADD.]

**FAQ schema questions** (already answered in the page body; mark up as `FAQPage` JSON-LD):

1. How much should a cafe in a small town spend on digital marketing?
2. Are discounts or combos better for cafe marketing?
3. Does Google Business Profile matter for a cafe?
4. How long does local cafe marketing take to show results?
5. Can social media alone grow a cafe?

**Other schema:** `Article` (author TBM Editorial, reviewer the founder) with `about` set to an `Organization` for JBD (CafeOrCoffeeShop, address Jhunjhunu) and `BreadcrumbList`. Do not add `Review` or `AggregateRating` markup for the testimonial. Google does not allow self-serving reviews.

**Internal links:** /services/social-media/, /services/meta-ads/, /services/branding/, /services/whatsapp-marketing/, /industries/food-beverage/, /industries/local-businesses/, /tools/cac-calculator/, /blog/what-is-a-good-cpl/.

---

## 2. Design direction

**Feel:** premium agency portfolio, closer to a well-designed annual report than a blog post. Large numbers, short text blocks, lots of white space, real photography.

| Section | Treatment |
|---|---|
| Hero | Full-bleed JBD interior or storefront photo with a dark overlay. Headline "Turning a Local Cafe Into a Local Brand." Below it, a row of 4 large stat tiles: visits, revenue, repeat rate, cost per new customer, each showing before in small grey text and after in large text |
| Client facts strip | Client · Industry · Location · Services · Timeline · Budget range |
| The client | Two columns: short copy on the left, cafe photo and menu highlights on the right |
| Challenge | Three-column table (wrong / why / cost to business). On mobile, collapse to cards |
| Strategy | Diagram of the five pillars feeding into "Growth system". Each pillar is a card with an icon and 2 to 3 lines |
| Offer economics | Small bar chart: contribution per order, discount vs combo (₹22 vs ₹76). The single most persuasive visual for business owners |
| Execution | Horizontal timeline (Month 1, 2, 3, 4 to 6) using the site's existing `OnboardingGantt` component style |
| Dashboard | Full results table plus 2 charts: monthly visits over 9 months (3 before, 6 during) and repeat-rate line. Show a seasonality note directly on the chart |
| Content performance | Reel thumbnails with view counts overlaid, plus a "what we learned" list |
| Business impact | 8 icon rows, then a highlighted "system" callout |
| Beyond posting | Seven connected blocks in a row (Branding + Content + ... + Economics), with economics visually emphasised |
| Creative showcase | Masonry gallery (see section 3) |
| Quote | Large serif pull quote with owner photo |
| Final result | Dark full-width band with the closing line in large type, then the CTA "Get a growth audit for your business" |

Use the existing site components where possible: `StatCard`, `BarChart`, `OnboardingGantt`, `CTABand`. Keep the page's own JS at zero.

---

## 3. Creative showcase: shot list and captions

Each image becomes an `evidence` entry: `{ image, alt, caption }`. Get written permission for every customer who appears in a photo.

| # | Asset | Caption |
|---|---|---|
| 1 | Before/after brand board (old posts vs new identity) | From one-off posts to one recognisable brand: a single palette, type system and photo style across every touchpoint. |
| 2 | Instagram grid, before vs after (9 tiles each) | The grid before and after: product snapshots replaced by a mix of moments, place and menu. |
| 3 | Top Reel screenshot with view count | Our best-performing Reel: a Jhunjhunu evening, not a menu item. [VIEWS: verified] |
| 4 | 2 to 3 more Reel screenshots | Reels built for discovery: local, human and fast. |
| 5 | Coffee + Snack Combo ad creative | The campaign that won: a specific combo, a specific time slot, one tap to WhatsApp. |
| 6 | Student combo and weekend group creatives | Offers designed around margin: each combo fills a slow slot or lifts the average bill. |
| 7 | Redesigned menu | A menu that sells: combos up front, traditional favourites highlighted, prices easy to scan. |
| 8 | Cafe interior photography (empty and busy) | The space is the product: photography that sells an evening, not just a dish. |
| 9 | Food photography set | Consistent light and styling so every dish looks like JBD. |
| 10 | Google Business Profile screenshot (photos, posts, reviews) | Found first on "cafe near me": complete profile, fresh photos, every review answered. |
| 11 | GBP Performance graph (Insights) | Profile actions over six months. [Verified screenshot from GBP] |
| 12 | Festival campaign creative (e.g. Diwali) | Showing up when the whole town is celebrating. |
| 13 | WhatsApp broadcast example (customer numbers blurred) | Turning walk-ins into a list JBD owns. |

---

## 4. Number logic (why these illustrative figures hang together)

- Average bill: ₹1,10,000 / 700 = ₹157 before; ₹2,15,000 / 1,300 = ₹165 after. This is consistent with combos raising the bill. The brief's suggested 1,450 visits would give ₹148, contradicting the combo story, so 1,300 is used.
- Paid new customers: ₹10,000 / ₹165 ≈ 61 a month before; ₹18,000 / ₹92 ≈ 196 a month after.
- Ad spend as share of revenue after: ₹18,000 / ₹2,15,000 ≈ 8.4%.
- Incremental contribution (ASSUMPTION: 65% contribution margin after food and packaging): ₹1,05,000 × 0.65 ≈ ₹68,000 a month. Net of the ₹8,000 extra ad spend that leaves about ₹60,000 before TBM's fee. **TBM's fee is UNKNOWN here; add it to show net payback once known.**
- Combo table: menu prices and food costs (₹150 / ₹129 / ₹53) are ASSUMPTIONS. Replace them with JBD's actual menu and recipe costing.

---

## 5. Verification checklist (required before publishing)

| Claim | Source to verify against | Status |
|---|---|---|
| Monthly visits 700 to 1,300 | POS bill count, 3-month averages | ☐ |
| Revenue ₹1.1L to ₹2.15L | POS / accounts, same months | ☐ |
| Average bill ₹157 to ₹165 | POS (revenue / bills) | ☐ |
| Repeat rate 18% to 31% | POS customer phone numbers, or WhatsApp list matched to bills; define the method | ☐ |
| Enquiries 120 to 390 | WhatsApp Business labels + call log + DMs | ☐ |
| GBP actions 310 to 745 | GBP Performance export | ☐ |
| Followers 1,800 to 6,500 | Instagram Insights (screenshot with dates) | ☐ |
| Reach 22,000 to 145,000 | Instagram Insights, monthly accounts reached | ☐ |
| Ad spend ₹10k to ₹18k | Meta Ads Manager billing | ☐ |
| CAC ₹165 to ₹92 | Ad spend / new customers from offer codes + click-to-WhatsApp | ☐ |
| CTR 1.8% to 3.1% | Meta Ads Manager (state link CTR vs all CTR) | ☐ |
| Cost per WhatsApp enquiry ₹78 | Meta Ads Manager, messaging conversations started | ☐ |
| Reel views 42K / 31K / 6 to 12K | Instagram Insights | ☐ |
| Timeline dates | Engagement start date | ☐ |
| Combo prices and costs | JBD menu and recipe costing | ☐ |
| Testimonial | Real quote, written consent, owner's name | ☐ |
| Photos | Usage permission, customer consent for identifiable people | ☐ |
| Client approval | Signed approval of the final page | ☐ |

Once every row is ticked: replace the figures, delete the "Illustrative figures" notice and testimonial label, set `verified: true`, `clientApprovalOnFile: true`, `draft: false`, `seo.noindex: false`, and move the testimonial into frontmatter (`testimonial: { quote, person, role }`).

**Disclosure:** if TBM's founder has an ownership or family interest in JBD, say so on the page (e.g. "JBD is a founder-affiliated business"). A related-party case study presented as an arm's-length client damages trust if it is discovered later.
