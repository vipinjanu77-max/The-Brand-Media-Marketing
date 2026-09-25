/** Mega-menu structure. Labels are editorial; hrefs follow the SEO URL hierarchy. */
export interface NavLink { label: string; href: string; desc?: string }
export interface NavGroup { heading: string; links: NavLink[] }
export interface NavItem { label: string; href: string; groups: NavGroup[]; feature?: { eyebrow: string; title: string; body: string; href: string; cta: string } }

export const nav: NavItem[] = [
  {
    label: 'Services',
    href: '/services/',
    groups: [
      {
        heading: 'Acquisition',
        links: [
          { label: 'Performance Marketing', href: '/services/performance-marketing/', desc: 'Full-funnel paid growth' },
          { label: 'Google Ads', href: '/services/google-ads/', desc: 'Search, PMax, YouTube' },
          { label: 'Meta Ads', href: '/services/meta-ads/', desc: 'Facebook & Instagram' },
          { label: 'LinkedIn Ads', href: '/services/linkedin-ads/', desc: 'B2B demand & ABM' },
          { label: 'WhatsApp Marketing', href: '/services/whatsapp-marketing/', desc: 'Conversational conversion' },
        ],
      },
      {
        heading: 'Search & Content',
        links: [
          { label: 'SEO', href: '/services/seo/', desc: 'Technical, content, local' },
          { label: 'AEO & AI Search', href: '/services/aeo/', desc: 'Visibility in AI answers' },
          { label: 'Content Marketing', href: '/services/content-marketing/', desc: 'Authority that compounds' },
          { label: 'Social Media', href: '/services/social-media/', desc: 'Strategy to community' },
          { label: 'Reputation Management', href: '/services/reputation-management/', desc: 'Reviews & trust signals' },
        ],
      },
      {
        heading: 'Brand & Creative',
        links: [
          { label: 'Branding', href: '/services/branding/', desc: 'Positioning & identity' },
          { label: 'Creative', href: '/services/creative/', desc: 'Ads that earn attention' },
          { label: 'Video Marketing', href: '/services/video-marketing/', desc: 'Story to performance' },
        ],
      },
      {
        heading: 'Conversion & Data',
        links: [
          { label: 'Website Development', href: '/services/website-development/', desc: 'Fast, conversion-led sites' },
          { label: 'Landing Pages', href: '/services/landing-pages/', desc: 'Built to convert' },
          { label: 'CRM & Automation', href: '/services/crm-automation/', desc: 'Lead to revenue' },
          { label: 'Analytics & Measurement', href: '/services/analytics/', desc: 'GA4, GTM, attribution' },
        ],
      },
    ],
    feature: {
      eyebrow: 'Our method',
      title: 'The TBM Growth System',
      body: 'Seven stages from diagnosis to scale — the operating model behind every engagement.',
      href: '/process/',
      cta: 'See the system',
    },
  },
  {
    label: 'Industries',
    href: '/industries/',
    groups: [
      {
        heading: 'High-consideration',
        links: [
          { label: 'Real Estate', href: '/industries/real-estate/' },
          { label: 'Education', href: '/industries/education/' },
          { label: 'Healthcare', href: '/industries/healthcare/' },
          { label: 'Finance', href: '/industries/finance/' },
          { label: 'Automotive', href: '/industries/automotive/' },
        ],
      },
      {
        heading: 'Commerce',
        links: [
          { label: 'D2C', href: '/industries/d2c/' },
          { label: 'E-commerce', href: '/industries/ecommerce/' },
          { label: 'Retail', href: '/industries/retail/' },
          { label: 'Fashion', href: '/industries/fashion/' },
          { label: 'Beauty', href: '/industries/beauty/' },
          { label: 'Jewellery', href: '/industries/jewellery/' },
        ],
      },
      {
        heading: 'B2B',
        links: [
          { label: 'B2B', href: '/industries/b2b/' },
          { label: 'SaaS', href: '/industries/saas/' },
          { label: 'Manufacturing', href: '/industries/manufacturing/' },
          { label: 'Professional Services', href: '/industries/professional-services/' },
        ],
      },
      {
        heading: 'Experience & Local',
        links: [
          { label: 'Hospitality', href: '/industries/hospitality/' },
          { label: 'Travel', href: '/industries/travel/' },
          { label: 'Food & Beverage', href: '/industries/food-beverage/' },
          { label: 'Local Businesses', href: '/industries/local-businesses/' },
        ],
      },
    ],
  },
  {
    label: 'Work',
    href: '/case-studies/',
    groups: [
      {
        heading: 'Evidence',
        links: [
          { label: 'Case Studies', href: '/case-studies/', desc: 'Verified client work' },
          { label: 'Results Library', href: '/results/', desc: 'Filter by industry & platform' },
          { label: 'Client Stories', href: '/client-stories/', desc: 'In their words' },
          { label: 'Reporting Demo', href: '/reporting-demo/', desc: 'See how we report' },
        ],
      },
    ],
  },
  {
    label: 'Insights',
    href: '/insights/',
    groups: [
      {
        heading: 'Marketing Intelligence',
        links: [
          { label: 'Marketing Research', href: '/research/', desc: 'Sourced, dated, reviewed' },
          { label: 'Marketing Statistics', href: '/statistics/', desc: 'Every number cited' },
          { label: 'TBM Market Data', href: '/research/market-data/', desc: 'Our own datasets' },
          { label: 'Market Dashboards', href: '/research/dashboards/', desc: 'Charts with sources' },
        ],
      },
      {
        heading: 'Learn',
        links: [
          { label: 'Digital Marketing Guides', href: '/guides/', desc: 'Pillar guides' },
          { label: 'Blog', href: '/blog/' },
          { label: 'Comparisons', href: '/compare/' },
          { label: 'Marketing Glossary', href: '/glossary/' },
          { label: 'FAQs', href: '/faqs/' },
        ],
      },
    ],
  },
  {
    label: 'Resources',
    href: '/resources/',
    groups: [
      {
        heading: 'Calculators',
        links: [
          { label: 'Marketing ROI Calculator', href: '/tools/marketing-roi-calculator/' },
          { label: 'Cost Calculator', href: '/tools/digital-marketing-cost-calculator/' },
          { label: 'CAC Calculator', href: '/tools/cac-calculator/' },
          { label: 'ROAS Calculator', href: '/tools/roas-calculator/' },
          { label: 'CPL Calculator', href: '/tools/cpl-calculator/' },
        ],
      },
      {
        heading: 'Planning & Audits',
        links: [
          { label: 'Media Planner', href: '/tools/media-planner/' },
          { label: 'Marketing Audit', href: '/tools/marketing-audit/' },
          { label: 'SEO Health Checker', href: '/tools/seo-health-checker/' },
          { label: 'Agency Evaluation', href: '/tools/agency-evaluation-checklist/' },
          { label: 'Downloadable Guides', href: '/resources/' },
        ],
      },
    ],
  },
  {
    label: 'Company',
    href: '/about/',
    groups: [
      {
        heading: 'TBM',
        links: [
          { label: 'About', href: '/about/' },
          { label: 'Team', href: '/team/' },
          { label: 'Process', href: '/process/' },
          { label: 'Pricing', href: '/pricing/' },
          { label: 'Contract Transparency', href: '/contract-transparency/' },
          { label: 'Careers', href: '/careers/' },
          { label: 'Contact', href: '/contact/' },
        ],
      },
    ],
  },
];

export const footerNav: NavGroup[] = [
  {
    heading: 'Services',
    links: [
      { label: 'Performance Marketing', href: '/services/performance-marketing/' },
      { label: 'Google Ads', href: '/services/google-ads/' },
      { label: 'Meta Ads', href: '/services/meta-ads/' },
      { label: 'SEO', href: '/services/seo/' },
      { label: 'AEO & AI Search', href: '/services/aeo/' },
      { label: 'CRM & Automation', href: '/services/crm-automation/' },
      { label: 'All services', href: '/services/' },
    ],
  },
  {
    heading: 'Intelligence',
    links: [
      { label: 'Marketing Research', href: '/research/' },
      { label: 'Statistics Database', href: '/statistics/' },
      { label: 'TBM Market Data', href: '/research/market-data/' },
      { label: 'What is Digital Marketing?', href: '/guides/what-is-digital-marketing/' },
      { label: 'Digital Marketing Cost in India', href: '/guides/digital-marketing-cost-india/' },
      { label: 'Glossary', href: '/glossary/' },
    ],
  },
  {
    heading: 'Tools',
    links: [
      { label: 'ROI Calculator', href: '/tools/marketing-roi-calculator/' },
      { label: 'Cost Calculator', href: '/tools/digital-marketing-cost-calculator/' },
      { label: 'Agency Evaluation', href: '/tools/agency-evaluation-checklist/' },
      { label: 'Reporting Demo', href: '/reporting-demo/' },
      { label: 'All tools', href: '/tools/' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about/' },
      { label: 'Team', href: '/team/' },
      { label: 'Process & onboarding', href: '/process/' },
      { label: 'Pricing & rate card', href: '/pricing/' },
      { label: 'Contract transparency', href: '/contract-transparency/' },
      { label: 'Digital Marketing Agency India', href: '/digital-marketing-agency-india/' },
      { label: 'Contact', href: '/contact/' },
    ],
  },
];

export const legalNav: NavLink[] = [
  { label: 'Privacy', href: '/legal/privacy-policy/' },
  { label: 'Terms', href: '/legal/terms-of-service/' },
  { label: 'Cookies', href: '/legal/cookie-policy/' },
  { label: 'Disclaimer', href: '/legal/disclaimer/' },
  { label: 'Results disclaimer', href: '/legal/marketing-results-disclaimer/' },
  { label: 'Research methodology', href: '/legal/research-methodology/' },
  { label: 'Data handling', href: '/legal/data-handling-policy/' },
  { label: 'Editorial standards', href: '/editorial-standards/' },
];
