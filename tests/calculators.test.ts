import { describe, it, expect } from 'vitest';
import { roi, roas, cpl, cac, mediaPlan, costEstimate, inr } from '../src/lib/calculators';
import { scoreLead, isPlausibleUrl } from '../src/lib/leadScore';

describe('roi', () => {
  const base = {
    monthlyRevenue: 2_000_000,
    aov: 50_000,
    grossMarginPct: 40,
    currentLeads: 200,
    leadToCustomerPct: 5,
    adSpend: 200_000,
    currentCpl: 0,
    targetRevenue: 1_000_000,
    conversionImprovementPct: 0,
  };
  it('derives CPL from spend/leads when CPL is not given', () => {
    const r = roi(base);
    expect(r.estimatedCpl).toBe(1000);
    expect(r.requiredCustomers).toBe(20);
    expect(r.requiredLeads).toBeCloseTo(400);
    expect(r.requiredBudget).toBeCloseTo(400_000);
    expect(r.estimatedCac).toBeCloseTo(20_000);
    expect(r.breakEvenRoas).toBeCloseTo(2.5);
    expect(r.projectedRoas).toBeCloseTo(2.5);
  });
  it('conversion improvement lowers required leads', () => {
    const r = roi({ ...base, conversionImprovementPct: 25 });
    expect(r.requiredLeads).toBeCloseTo(320);
  });
  it('returns nulls instead of Infinity on zero inputs', () => {
    const r = roi({ ...base, aov: 0, currentLeads: 0, grossMarginPct: 0 });
    expect(r.requiredCustomers).toBeNull();
    expect(r.breakEvenRoas).toBeNull();
  });
});

describe('unit calculators', () => {
  it('roas and break-even', () => {
    const r = roas(300_000, 100_000, 50);
    expect(r.roas).toBe(3);
    expect(r.breakEvenRoas).toBe(2);
    expect(r.status).toBe('profitable');
  });
  it('cpl', () => {
    const r = cpl({ spend: 100_000, leads: 100, qualifiedPct: 50, closeRatePct: 10, dealValue: 200_000, grossMarginPct: 30 });
    expect(r.cpl).toBe(1000);
    expect(r.costPerQualifiedLead).toBe(2000);
    expect(r.costPerCustomer).toBe(20_000);
    expect(r.maxBreakEvenCpl).toBeCloseTo(3000);
  });
  it('cac + ltv', () => {
    const r = cac({ marketingCost: 80_000, salesCost: 20_000, newCustomers: 10, monthlyRevenuePerCustomer: 5000, grossMarginPct: 60, avgLifetimeMonths: 12 });
    expect(r.blendedCac).toBe(10_000);
    expect(r.ltv).toBe(36_000);
    expect(r.ltvToCac).toBeCloseTo(3.6);
    expect(r.paybackMonths).toBeCloseTo(3.333, 2);
  });
  it('media plan totals', () => {
    const p = mediaPlan(100_000, [{ name: 'A', sharePct: 100, cpm: 100, ctrPct: 1, cvrPct: 10 }], 10);
    expect(p.totals.impressions).toBe(1_000_000);
    expect(p.totals.clicks).toBe(10_000);
    expect(p.totals.leads).toBe(1000);
    expect(p.blendedCpl).toBe(100);
  });
  it('cost estimate splits sum to total', () => {
    const e = costEstimate({ monthlyRevenue: 1e7, ambition: 'grow', competition: 'medium', geography: 'national', channels: ['google-ads', 'seo'] });
    const sumLow = e.parts.reduce((s, p) => s + p.low, 0);
    expect(sumLow).toBeCloseTo(e.totalLow);
    expect(e.totalLow).toBeCloseTo(600_000);
  });
  it('inr formatting', () => {
    expect(inr(150_000)).toBe('₹1.5 L');
    expect(inr(25_000_000)).toBe('₹2.5 Cr');
    expect(inr(null)).toBe('-');
  });
});

describe('lead scoring', () => {
  it('classifies an enterprise opportunity', () => {
    const r = scoreLead({ goal: 'generate-leads', industry: 'real-estate', revenue: 'gt-10cr', spend: 'gt-20l', geography: 'india', website: 'example.com', company: 'Acme', challenge: 'We get volume but lead quality from Meta has collapsed in the last quarter.', intent: 'proposal' });
    expect(r.tier).toBe('enterprise-opportunity');
  });
  it('classifies a low-intent lead', () => {
    const r = scoreLead({ goal: 'other', industry: 'other', revenue: 'pre-revenue', spend: 'none', geography: 'city' });
    expect(r.tier).toBe('low-intent');
  });
  it('validates urls', () => {
    expect(isPlausibleUrl('tbm.in')).toBe(true);
    expect(isPlausibleUrl('not a url')).toBe(false);
  });
});
