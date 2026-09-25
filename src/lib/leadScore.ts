/**
 * Lead scoring for the Growth Audit form.
 * Runs server-side in /api/lead. Weights are deliberately simple and explainable so the
 * sales team can audit why a lead was routed where it was. Tune weights here.
 */

export const REVENUE_BANDS = [
  { value: 'pre-revenue', label: 'Pre-revenue', points: 2 },
  { value: 'lt-10l', label: 'Under ₹10 lakh / month', points: 6 },
  { value: '10l-50l', label: '₹10–50 lakh / month', points: 12 },
  { value: '50l-2cr', label: '₹50 lakh – ₹2 crore / month', points: 18 },
  { value: '2cr-10cr', label: '₹2–10 crore / month', points: 22 },
  { value: 'gt-10cr', label: 'Over ₹10 crore / month', points: 25 },
  { value: 'undisclosed', label: 'Prefer not to say', points: 8 },
] as const;

export const SPEND_BANDS = [
  { value: 'none', label: 'Not spending yet', points: 2 },
  { value: 'lt-1l', label: 'Under ₹1 lakh / month', points: 6 },
  { value: '1l-5l', label: '₹1–5 lakh / month', points: 13 },
  { value: '5l-20l', label: '₹5–20 lakh / month', points: 19 },
  { value: 'gt-20l', label: 'Over ₹20 lakh / month', points: 25 },
  { value: 'undisclosed', label: 'Prefer not to say', points: 7 },
] as const;

export const GOALS = [
  { value: 'generate-leads', label: 'Generate leads', points: 15 },
  { value: 'increase-sales', label: 'Increase sales', points: 15 },
  { value: 'improve-seo', label: 'Improve SEO / AI search visibility', points: 11 },
  { value: 'build-brand', label: 'Build brand', points: 10 },
  { value: 'launch-product', label: 'Launch a product', points: 13 },
  { value: 'enter-market', label: 'Enter a new market', points: 14 },
  { value: 'improve-ecommerce', label: 'Improve e-commerce performance', points: 14 },
  { value: 'other', label: 'Something else', points: 6 },
] as const;

export const GEOGRAPHIES = [
  { value: 'city', label: 'One city / local area', points: 5 },
  { value: 'state', label: 'State / region', points: 6 },
  { value: 'india', label: 'All of India', points: 9 },
  { value: 'international', label: 'International markets', points: 10 },
  { value: 'india-international', label: 'India + international', points: 10 },
] as const;

/** Industries where TBM's process has the most direct fit (editable). */
const PRIORITY_INDUSTRIES = new Set(['real-estate', 'd2c', 'ecommerce', 'b2b', 'saas', 'education', 'healthcare', 'finance']);

export interface LeadInput {
  goal: string;
  industry: string;
  revenue: string;
  spend: string;
  geography: string;
  website?: string;
  company?: string;
  challenge?: string;
  intent?: string; // growth-audit | strategy-call | proposal
}

export type LeadTier = 'low-intent' | 'medium-intent' | 'high-intent' | 'enterprise-opportunity';

const pts = (list: readonly { value: string; points: number }[], v: string) =>
  list.find((x) => x.value === v)?.points ?? 0;

export function scoreLead(i: LeadInput) {
  const breakdown = {
    revenue: pts(REVENUE_BANDS, i.revenue),
    budget: pts(SPEND_BANDS, i.spend),
    intent:
      pts(GOALS, i.goal) +
      (i.intent === 'proposal' ? 5 : i.intent === 'strategy-call' ? 4 : 0),
    industry: PRIORITY_INDUSTRIES.has(i.industry) ? 8 : 5,
    geography: pts(GEOGRAPHIES, i.geography),
    website: isPlausibleUrl(i.website) ? 5 : 0,
    maturity:
      (i.company && i.company.trim().length > 1 ? 2 : 0) +
      (i.challenge && i.challenge.trim().length >= 40 ? 3 : i.challenge && i.challenge.trim().length > 0 ? 1 : 0),
  };
  const score = Math.min(100, Object.values(breakdown).reduce((a, b) => a + b, 0));
  const enterprise =
    (i.revenue === 'gt-10cr' || i.revenue === '2cr-10cr') && (i.spend === 'gt-20l' || i.spend === '5l-20l');
  const tier: LeadTier =
    enterprise && score >= 70
      ? 'enterprise-opportunity'
      : score >= 60
        ? 'high-intent'
        : score >= 38
          ? 'medium-intent'
          : 'low-intent';
  return { score, tier, breakdown };
}

export function isPlausibleUrl(v?: string): boolean {
  if (!v) return false;
  try {
    const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
    return /\.[a-z]{2,}$/i.test(u.hostname);
  } catch {
    return false;
  }
}

/** Nurture track the follow-up automation should use. */
export function nurtureTrack(i: LeadInput, tier: LeadTier) {
  return {
    tier,
    industry: i.industry,
    objective: i.goal,
    budget: i.spend,
    sequence:
      tier === 'enterprise-opportunity' || tier === 'high-intent'
        ? 'sales-priority-24h'
        : tier === 'medium-intent'
          ? 'consultative-nurture-14d'
          : 'education-nurture-30d',
  };
}
