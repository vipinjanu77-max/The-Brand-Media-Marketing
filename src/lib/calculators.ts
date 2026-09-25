/**
 * Pure calculation functions behind TBM's interactive tools.
 * Kept framework-free so they run in the browser and are unit-tested in /tests.
 * All outputs are estimates from user-supplied assumptions — never guarantees.
 */

const safeDiv = (a: number, b: number): number | null => (b > 0 && Number.isFinite(a) ? a / b : null);
const pct = (n: number) => n / 100;

export interface RoiInput {
  monthlyRevenue: number;
  aov: number;
  grossMarginPct: number;
  currentLeads: number;
  leadToCustomerPct: number;
  adSpend: number;
  currentCpl: number;
  targetRevenue: number;
  conversionImprovementPct: number;
}

export interface RoiOutput {
  improvedConversionPct: number;
  requiredCustomers: number | null;
  requiredLeads: number | null;
  estimatedCpl: number | null;
  estimatedCac: number | null;
  requiredBudget: number | null;
  revenuePotentialAtCurrentSpend: number | null;
  projectedRoas: number | null;
  breakEvenRoas: number | null;
  grossProfitPerRupeeSpent: number | null;
  profitable: boolean | null;
}

export function roi(i: RoiInput): RoiOutput {
  const conv = pct(i.leadToCustomerPct) * (1 + pct(i.conversionImprovementPct));
  const cpl = i.currentCpl > 0 ? i.currentCpl : safeDiv(i.adSpend, i.currentLeads);
  const requiredCustomers = safeDiv(i.targetRevenue, i.aov);
  const requiredLeads = requiredCustomers !== null ? safeDiv(requiredCustomers, conv) : null;
  const requiredBudget = requiredLeads !== null && cpl !== null ? requiredLeads * cpl : null;
  const estimatedCac = cpl !== null ? safeDiv(cpl, conv) : null;
  const leadsAtCurrentSpend = cpl !== null ? safeDiv(i.adSpend, cpl) : null;
  const revenuePotential = leadsAtCurrentSpend !== null ? leadsAtCurrentSpend * conv * i.aov : null;
  const projectedRoas = requiredBudget !== null ? safeDiv(i.targetRevenue, requiredBudget) : null;
  const breakEvenRoas = safeDiv(1, pct(i.grossMarginPct));
  const gpPerRupee = projectedRoas !== null ? projectedRoas * pct(i.grossMarginPct) : null;
  return {
    improvedConversionPct: conv * 100,
    requiredCustomers,
    requiredLeads,
    estimatedCpl: cpl,
    estimatedCac,
    requiredBudget,
    revenuePotentialAtCurrentSpend: revenuePotential,
    projectedRoas,
    breakEvenRoas,
    grossProfitPerRupeeSpent: gpPerRupee,
    profitable: projectedRoas !== null && breakEvenRoas !== null ? projectedRoas > breakEvenRoas : null,
  };
}

export function roas(revenue: number, spend: number, grossMarginPct: number) {
  const r = safeDiv(revenue, spend);
  const be = safeDiv(1, pct(grossMarginPct));
  const grossProfit = revenue * pct(grossMarginPct);
  return {
    roas: r,
    breakEvenRoas: be,
    contribution: grossProfit - spend,
    status: r === null || be === null ? null : r >= be ? ('profitable' as const) : ('below-break-even' as const),
  };
}

export function cpl(input: {
  spend: number;
  leads: number;
  qualifiedPct: number;
  closeRatePct: number;
  dealValue: number;
  grossMarginPct: number;
}) {
  const c = safeDiv(input.spend, input.leads);
  const qualified = input.leads * pct(input.qualifiedPct);
  const customers = qualified * pct(input.closeRatePct);
  return {
    cpl: c,
    qualifiedLeads: qualified,
    costPerQualifiedLead: safeDiv(input.spend, qualified),
    customers,
    costPerCustomer: safeDiv(input.spend, customers),
    /** CPL at which lead cost equals the gross profit each lead is expected to produce. */
    maxBreakEvenCpl: input.dealValue * pct(input.grossMarginPct) * pct(input.qualifiedPct) * pct(input.closeRatePct),
  };
}

export function cac(input: {
  marketingCost: number;
  salesCost: number;
  newCustomers: number;
  monthlyRevenuePerCustomer: number;
  grossMarginPct: number;
  avgLifetimeMonths: number;
}) {
  const blended = safeDiv(input.marketingCost + input.salesCost, input.newCustomers);
  const marketingOnly = safeDiv(input.marketingCost, input.newCustomers);
  const monthlyGp = input.monthlyRevenuePerCustomer * pct(input.grossMarginPct);
  const ltv = monthlyGp * input.avgLifetimeMonths;
  return {
    blendedCac: blended,
    marketingCac: marketingOnly,
    ltv,
    ltvToCac: blended !== null ? safeDiv(ltv, blended) : null,
    paybackMonths: blended !== null ? safeDiv(blended, monthlyGp) : null,
  };
}

export interface ChannelPlan {
  name: string;
  sharePct: number;
  cpm: number;
  ctrPct: number;
  cvrPct: number;
}

export function mediaPlan(budget: number, channels: ChannelPlan[], leadToCustomerPct: number) {
  const rows = channels.map((c) => {
    const spend = budget * pct(c.sharePct);
    const impressions = c.cpm > 0 ? (spend / c.cpm) * 1000 : 0;
    const clicks = impressions * pct(c.ctrPct);
    const leads = clicks * pct(c.cvrPct);
    return {
      ...c,
      spend,
      impressions,
      clicks,
      cpc: safeDiv(spend, clicks),
      leads,
      cpl: safeDiv(spend, leads),
      customers: leads * pct(leadToCustomerPct),
    };
  });
  const totals = rows.reduce(
    (t, r) => ({
      spend: t.spend + r.spend,
      impressions: t.impressions + r.impressions,
      clicks: t.clicks + r.clicks,
      leads: t.leads + r.leads,
      customers: t.customers + r.customers,
    }),
    { spend: 0, impressions: 0, clicks: 0, leads: 0, customers: 0 },
  );
  const allocated = channels.reduce((s, c) => s + c.sharePct, 0);
  return { rows, totals, allocatedPct: allocated, blendedCpl: safeDiv(totals.spend, totals.leads) };
}

/* ------------------------------------------------------------------------
   Cost calculator — TBM planning heuristic.
   These are transparent planning assumptions, NOT market averages. They are
   shown to the user on the page and should be reviewed by TBM strategists.
   ------------------------------------------------------------------------ */
export const costAssumptions = {
  /** Share of monthly revenue typically allocated to marketing, by growth ambition (low, high). */
  ambition: {
    maintain: [0.03, 0.06],
    grow: [0.06, 0.1],
    scale: [0.1, 0.16],
    aggressive: [0.16, 0.25],
  } as Record<string, [number, number]>,
  /** Relative competition multiplier by market. */
  competition: { low: 0.85, medium: 1, high: 1.2 } as Record<string, number>,
  geography: { local: 0.8, regional: 0.9, national: 1, international: 1.25 } as Record<string, number>,
  /** Share of total budget by component, depending on how paid-media heavy the channel mix is. */
  splitPaidHeavy: { media: 0.62, agency: 0.18, creative: 0.1, technology: 0.04, contingency: 0.06 },
  splitOrganicHeavy: { media: 0.2, agency: 0.45, creative: 0.2, technology: 0.07, contingency: 0.08 },
};

export const PAID_CHANNELS = ['google-ads', 'meta-ads', 'linkedin-ads', 'youtube-ads', 'programmatic'];

export function costEstimate(input: {
  monthlyRevenue: number;
  ambition: keyof typeof costAssumptions.ambition | string;
  competition: string;
  geography: string;
  channels: string[];
}) {
  const [lo, hi] = costAssumptions.ambition[input.ambition] ?? costAssumptions.ambition.grow;
  const k = (costAssumptions.competition[input.competition] ?? 1) * (costAssumptions.geography[input.geography] ?? 1);
  const totalLow = input.monthlyRevenue * lo * k;
  const totalHigh = input.monthlyRevenue * hi * k;
  const paidShare = input.channels.length
    ? input.channels.filter((c) => PAID_CHANNELS.includes(c)).length / input.channels.length
    : 0.5;
  const mix = (key: keyof typeof costAssumptions.splitPaidHeavy) =>
    costAssumptions.splitPaidHeavy[key] * paidShare + costAssumptions.splitOrganicHeavy[key] * (1 - paidShare);
  const parts = (['media', 'agency', 'creative', 'technology', 'contingency'] as const).map((key) => ({
    key,
    share: mix(key),
    low: totalLow * mix(key),
    high: totalHigh * mix(key),
  }));
  return { totalLow, totalHigh, paidShare, parts };
}

/** Format rupees in Indian digit grouping, compacting lakhs/crores for readability. */
export function inr(n: number | null | undefined, compact = true): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  if (compact && abs >= 1e7) return `₹${(n / 1e7).toFixed(2).replace(/\.?0+$/, '')} Cr`;
  if (compact && abs >= 1e5) return `₹${(n / 1e5).toFixed(2).replace(/\.?0+$/, '')} L`;
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

export function num(n: number | null | undefined, digits = 0): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—';
  return n.toLocaleString('en-IN', { maximumFractionDigits: digits, minimumFractionDigits: 0 });
}
