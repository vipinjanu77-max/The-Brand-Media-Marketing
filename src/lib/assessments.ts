/** Question banks for self-assessment tools. Each "fix" is shown when the answer is not "yes". */
export interface Q { q: string; fix: string }
export interface Section { name: string; questions: Q[] }

export const agencyCriteria: Section[] = [
  { name: 'Evidence', questions: [
    { q: 'Relevant experience: they have worked with businesses like yours (industry or funnel).', fix: 'Ask which comparable businesses they have served and what was different about them.' },
    { q: 'Case studies, documented with baseline, method and outcome.', fix: 'Ask them to walk you through one case study end to end.' },
    { q: 'Actual results: numbers you could verify (anonymised platform/CRM evidence).', fix: 'Request anonymised evidence; treat unverifiable screenshots with caution.' },
    { q: 'References: current clients you can call.', fix: 'Ask for two current client references and call them.' },
  ] },
  { name: 'People & strategy', questions: [
    { q: 'Team: you know who will work on your account day to day.', fix: 'Ask for named people, their experience and time allocation.' },
    { q: 'Strategy: targets start from your margins, close rates and payback.', fix: 'Ask how they would set your CPL/CAC target from your numbers.' },
    { q: 'Industry expertise: they understand your sales cycle and regulations.', fix: 'Ask what rules and platform policies affect marketing in your sector.' },
  ] },
  { name: 'Measurement', questions: [
    { q: 'Reporting: reports show leads, qualified leads, CAC and revenue, not only clicks.', fix: 'Ask for a sample report.' },
    { q: 'Tracking: they verify conversion tracking before scaling spend.', fix: 'Ask how they QA tracking against CRM records.' },
  ] },
  { name: 'Commercials & governance', questions: [
    { q: 'Account ownership: ad accounts, analytics and data are in your name.', fix: 'Insist that accounts are owned by your business.' },
    { q: 'Pricing: fee, media, production and tools are separated.', fix: 'Ask for a line-item breakdown of what is included and excluded.' },
    { q: 'Contract: fair notice period, clear exit and handover terms.', fix: 'Ask what happens to your assets and access if you part ways.' },
    { q: 'Communication, agreed cadence, attendees and escalation path.', fix: 'Agree the meeting and reporting rhythm in writing.' },
    { q: 'Data security: access controls and a data handling policy.', fix: 'Ask how they store credentials and protect your data.' },
  ] },
];

export const marketingAudit: Section[] = [
  { name: 'Strategy', questions: [
    { q: 'We know our gross margin, average order/deal value and lead-to-customer rate.', fix: 'Document unit economics, every target depends on them.' },
    { q: 'We have a written target CPL/CAC that we can afford.', fix: 'Calculate break-even CPL and CAC with the ROI calculator.' },
    { q: 'Our positioning explains clearly why customers should choose us.', fix: 'Run customer interviews and sharpen positioning before scaling ads.' },
  ] },
  { name: 'Tracking & data', questions: [
    { q: 'Conversion tracking is verified against real leads/sales.', fix: 'Audit GA4/GTM and platform conversions against CRM records.' },
    { q: 'Leads are captured in a CRM with their source.', fix: 'Route every enquiry into a CRM with UTM/source data.' },
    { q: 'Qualified-lead or sale data is sent back to ad platforms.', fix: 'Set up offline conversion imports / Conversions API.' },
  ] },
  { name: 'Funnel & conversion', questions: [
    { q: 'Paid traffic lands on pages built for that campaign.', fix: 'Build message-matched landing pages for major campaigns.' },
    { q: 'New leads are contacted within an hour.', fix: 'Add instant WhatsApp/email response and sales SLAs.' },
    { q: 'We run structured tests on pages, offers or creative.', fix: 'Start a test roadmap with pre-agreed success criteria.' },
  ] },
  { name: 'Channels', questions: [
    { q: 'Each channel has a clear job (capture demand, create demand, retain).', fix: 'Assign a role and KPI to every channel.' },
    { q: 'We rank organically for searches close to purchase.', fix: 'Prioritise commercial-intent SEO pages.' },
    { q: 'Creative is refreshed before performance fatigues.', fix: 'Set up a monthly creative production and testing cycle.' },
  ] },
  { name: 'Reporting', questions: [
    { q: 'Leadership sees one report from spend to revenue.', fix: 'Build a unified dashboard reconciled with CRM data.' },
    { q: 'We review performance monthly and change budgets based on it.', fix: 'Introduce a monthly business review with decisions logged.' },
  ] },
];

export const seoHealth: Section[] = [
  { name: 'Technical', questions: [
    { q: 'Site uses HTTPS everywhere, with no mixed content.', fix: 'Force HTTPS and fix mixed-content resources.' },
    { q: 'Important pages are indexed (Search Console, Pages report).', fix: 'Fix noindex, canonical and crawl issues on key pages.' },
    { q: 'An XML sitemap is submitted and robots.txt blocks nothing important.', fix: 'Submit a clean sitemap; review robots.txt.' },
    { q: 'Core Web Vitals pass on mobile.', fix: 'Optimise images, scripts and layout shifts.' },
    { q: 'No broken internal links or redirect chains.', fix: 'Crawl the site and fix 4xx and chained redirects.' },
  ] },
  { name: 'On-page', questions: [
    { q: 'Every page has a unique title and meta description.', fix: 'Write unique, intent-matched titles and descriptions.' },
    { q: 'Each page has one descriptive H1 and logical headings.', fix: 'Restructure headings to reflect content hierarchy.' },
    { q: 'Images have descriptive alt text.', fix: 'Add alt text that describes image content and purpose.' },
  ] },
  { name: 'Content', questions: [
    { q: 'Priority pages each target a clear search intent.', fix: 'Map one primary intent to each commercial page.' },
    { q: 'Content includes original insight, data or first-hand experience.', fix: 'Add expert commentary, examples and data others lack.' },
    { q: 'Pages show author and last-updated information.', fix: 'Add author bios and visible update dates.' },
    { q: 'Related pages are internally linked.', fix: 'Build topic clusters with contextual internal links.' },
  ] },
  { name: 'Authority & local', questions: [
    { q: 'Relevant sites link to us because of useful content.', fix: 'Create linkable research and tools; pursue digital PR.' },
    { q: 'Business name, address and phone are consistent everywhere.', fix: 'Audit profiles and directories for consistency.' },
    { q: 'Google Business Profile is complete and gets fresh reviews.', fix: 'Complete the profile and set up a compliant review request process.' },
  ] },
  { name: 'AI search readiness', questions: [
    { q: 'Key pages open with a direct answer to the main question.', fix: 'Add a 40-60 word direct answer at the top of key sections.' },
    { q: 'Organization, Article, FAQ and Breadcrumb schema are implemented where eligible.', fix: 'Implement valid structured data that matches visible content.' },
    { q: 'Statistics cite sources with dates.', fix: 'Add source, year and link to every statistic.' },
  ] },
];
