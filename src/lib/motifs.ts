/**
 * Line-art motifs (drawn on a 100×100 grid, stroke only) used by <Artwork />.
 * Keep each motif simple and geometric so it reads at small sizes.
 */
export const motifs: Record<string, string> = {
  // Industries
  building: `<path d="M20 88V30l22-12v70M42 88V40h36v48M30 38v6M30 52v6M30 66v6M52 50h6M66 50h6M52 62h6M66 62h6M52 74h6M66 74h6M12 88h76"/>`,
  bag: `<path d="M24 36h52l-4 52H28z"/><path d="M38 36v-6a12 12 0 0 1 24 0v6"/><path d="M38 50a12 12 0 0 0 24 0"/>`,
  network: `<circle cx="50" cy="50" r="8"/><circle cx="20" cy="24" r="6"/><circle cx="80" cy="24" r="6"/><circle cx="20" cy="78" r="6"/><circle cx="80" cy="78" r="6"/><path d="M25 28l19 16M75 28 56 44M25 74l19-17M75 74 56 57M26 24h48M20 30v42M80 30v42"/>`,
  app: `<rect x="14" y="20" width="72" height="56" rx="6"/><path d="M14 32h72M22 26h4M30 26h4"/><path d="M26 64l12-14 10 8 14-18 12 10"/><path d="M40 84h20"/>`,
  cap: `<path d="M8 40 50 22l42 18-42 18z"/><path d="M26 48v18c0 6 11 12 24 12s24-6 24-12V48"/><path d="M88 42v24"/>`,
  pulse: `<path d="M8 54h18l8-20 12 40 10-30 6 10h30"/><rect x="36" y="10" width="28" height="12" rx="3" opacity=".5"/><path d="M50 10v12M44 16h12"/>`,
  key: `<circle cx="34" cy="50" r="16"/><circle cx="34" cy="50" r="5"/><path d="M50 50h40M78 50v12M88 50v8"/>`,
  car: `<path d="M12 62v-10l10-4 10-14h36l12 14 10 4v10z"/><circle cx="28" cy="64" r="8"/><circle cx="72" cy="64" r="8"/><path d="M36 48h28"/>`,
  coin: `<ellipse cx="42" cy="34" rx="24" ry="8"/><path d="M18 34v12c0 4 11 8 24 8s24-4 24-8V34"/><path d="M18 46v12c0 4 11 8 24 8"/><path d="M60 62l10-10 8 6 12-16"/><path d="M84 42h6v6"/>`,
  factory: `<path d="M10 86V50l20 12V50l20 12V50l20 12V24h14v62z"/><path d="M10 86h80M22 74h8M40 74h8M58 74h8"/>`,
  briefcase: `<rect x="14" y="32" width="72" height="50" rx="6"/><path d="M38 32v-8h24v8M14 52h72M44 52v8h12v-8"/>`,
  pin: `<path d="M50 88S24 60 24 40a26 26 0 0 1 52 0c0 20-26 48-26 48z"/><circle cx="50" cy="40" r="9"/>`,
  plane: `<path d="M12 56 88 22 64 84 50 60z"/><path d="M50 60 88 22"/>`,
  sparkle: `<path d="M50 12c3 20 8 25 28 28-20 3-25 8-28 28-3-20-8-25-28-28 20-3 25-8 28-28z"/><path d="M78 64c1 8 3 10 11 11-8 1-10 3-11 11-1-8-3-10-11-11 8-1 10-3 11-11z"/>`,
  hanger: `<path d="M50 34a8 8 0 1 1 8-8"/><path d="M50 34v6L12 68c-3 2-2 6 2 6h72c4 0 5-4 2-6L50 40"/>`,
  gem: `<path d="M26 22h48l16 20-40 44-40-44z"/><path d="M10 42h80M38 22l-6 20 18 44 18-44-6-20"/>`,
  cup: `<path d="M18 36h52v22a22 22 0 0 1-22 22h-8a22 22 0 0 1-22-22z"/><path d="M70 42h6a10 10 0 0 1 0 20h-6"/><path d="M32 14c-4 6 4 8 0 14M46 14c-4 6 4 8 0 14"/>`,
  // Services
  target: `<circle cx="50" cy="50" r="36"/><circle cx="50" cy="50" r="22"/><circle cx="50" cy="50" r="8"/><path d="M50 50 86 14M72 14h14v14"/>`,
  search: `<circle cx="42" cy="42" r="26"/><path d="M61 61l25 25"/><path d="M30 46l8-10 8 6 10-12"/>`,
  heart: `<path d="M50 84S12 62 12 36a18 18 0 0 1 38-6 18 18 0 0 1 38 6c0 26-38 48-38 48z"/>`,
  profile: `<rect x="14" y="18" width="72" height="64" rx="8"/><circle cx="36" cy="42" r="10"/><path d="M22 70c2-10 26-10 28 0M58 38h18M58 50h18M58 62h12"/>`,
  answer: `<path d="M14 22h72v44H44L28 80V66H14z"/><path d="M26 36h48M26 48h32"/><path d="M76 8c1 6 3 8 9 9-6 1-8 3-9 9-1-6-3-8-9-9 6-1 8-3 9-9z"/>`,
  document: `<path d="M24 10h36l18 18v62H24z"/><path d="M60 10v18h18M34 44h32M34 56h32M34 68h20"/>`,
  share: `<circle cx="26" cy="50" r="10"/><circle cx="74" cy="24" r="10"/><circle cx="74" cy="76" r="10"/><path d="M35 45l30-16M35 55l30 16"/>`,
  star: `<path d="M50 12l11 24 26 3-19 18 5 26-23-13-23 13 5-26-19-18 26-3z"/>`,
  pen: `<path d="M50 10 72 46 50 88 28 46z"/><circle cx="50" cy="50" r="6"/><path d="M50 10v34"/>`,
  frame: `<rect x="12" y="18" width="76" height="64" rx="6"/><circle cx="34" cy="38" r="7"/><path d="M12 70l24-20 16 12 14-14 22 18"/>`,
  play: `<rect x="10" y="20" width="80" height="60" rx="10"/><path d="M42 36v28l24-14z"/>`,
  browser: `<rect x="10" y="16" width="80" height="68" rx="6"/><path d="M10 30h80M18 23h4M26 23h4"/><rect x="20" y="40" width="28" height="34" rx="3"/><path d="M58 42h22M58 52h22M58 62h14"/>`,
  layout: `<rect x="14" y="10" width="72" height="80" rx="6"/><path d="M24 22h52M24 32h34"/><rect x="24" y="44" width="52" height="18" rx="3"/><rect x="34" y="70" width="32" height="10" rx="5"/>`,
  chat: `<path d="M50 12a36 36 0 0 0-31 54l-5 20 20-5a36 36 0 1 0 16-69z"/><path d="M36 38c0 12 14 26 26 26l6-6-8-6-4 4c-4-2-10-8-12-12l4-4-6-8z"/>`,
  flow: `<rect x="8" y="16" width="26" height="18" rx="4"/><rect x="66" y="16" width="26" height="18" rx="4"/><rect x="37" y="66" width="26" height="18" rx="4"/><path d="M34 25h32M21 34v14h29v18M79 34v14H50"/>`,
  chart: `<path d="M12 86h76M12 86V14"/><rect x="22" y="56" width="10" height="24" rx="2"/><rect x="40" y="40" width="10" height="40" rx="2"/><rect x="58" y="48" width="10" height="32" rx="2"/><rect x="76" y="26" width="10" height="54" rx="2"/>`,
  compass: `<circle cx="50" cy="50" r="38"/><path d="M62 38 56 56 38 62 44 44z"/>`,
  book: `<path d="M50 24c-10-8-26-8-38-4v60c12-4 28-4 38 4 10-8 26-8 38-4V20c-12-4-28-4-38 4z"/><path d="M50 24v60"/>`,
};

/** Slug → motif mapping for services, industries and content types. */
export const motifFor: Record<string, string> = {
  'real-estate': 'building', d2c: 'bag', ecommerce: 'bag', b2b: 'network', saas: 'app', education: 'cap',
  healthcare: 'pulse', hospitality: 'key', automotive: 'car', finance: 'coin', retail: 'bag',
  manufacturing: 'factory', 'professional-services': 'briefcase', 'local-businesses': 'pin', travel: 'plane',
  beauty: 'sparkle', fashion: 'hanger', jewellery: 'gem', 'food-beverage': 'cup',
  'performance-marketing': 'target', 'google-ads': 'search', 'meta-ads': 'heart', 'linkedin-ads': 'profile',
  seo: 'search', aeo: 'answer', 'content-marketing': 'document', 'social-media': 'share',
  'reputation-management': 'star', branding: 'pen', creative: 'frame', 'video-marketing': 'play',
  'website-development': 'browser', 'landing-pages': 'layout', 'whatsapp-marketing': 'chat',
  'crm-automation': 'flow', analytics: 'chart',
  research: 'chart', guide: 'book', article: 'document', compare: 'compass', tool: 'target', glossary: 'book',
};

/** Deterministic PRNG so the same slug always produces the same artwork. */
export function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Motif for editorial content by topic cluster. */
export const clusterMotif: Record<string, string> = {
  'digital-marketing': 'network', seo: 'search', aeo: 'answer', 'paid-advertising': 'chart',
  'agency-selection': 'compass', industry: 'building', analytics: 'chart',
};

export const toolMotif: Record<string, string> = {
  'marketing-roi-calculator': 'target', 'digital-marketing-cost-calculator': 'coin', 'agency-evaluation-checklist': 'compass',
  'marketing-audit': 'search', 'media-planner': 'chart', 'cac-calculator': 'coin', 'roas-calculator': 'chart',
  'cpl-calculator': 'target', 'seo-health-checker': 'search',
};
