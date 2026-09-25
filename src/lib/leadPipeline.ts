/**
 * Server-side lead handling: validation, spam checks, scoring and delivery.
 * Secrets are read from server environment variables only (never PUBLIC_*).
 */
import { createHmac } from 'node:crypto';
import { appendFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { GOALS, REVENUE_BANDS, SPEND_BANDS, GEOGRAPHIES, scoreLead, nurtureTrack, type LeadInput } from './leadScore';

const env = (k: string): string | undefined => (import.meta.env?.[k] as string | undefined) ?? process.env[k];

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,255}\.[a-z]{2,}$/i;
const PHONE = /^[0-9+()\- ]{7,20}$/;
const values = (l: readonly { value: string }[]) => l.map((x) => x.value);

export interface CleanLead extends LeadInput {
  name: string;
  email: string;
  phone: string;
  whatsappConsent: boolean;
  source: string;
}

const str = (f: FormData, k: string, max: number) => String(f.get(k) ?? '').trim().slice(0, max);

export function validateLead(f: FormData, industries: string[]): { lead?: CleanLead; error?: string } {
  const lead: CleanLead = {
    goal: str(f, 'goal', 40),
    industry: str(f, 'industry', 60),
    revenue: str(f, 'revenue', 30),
    spend: str(f, 'spend', 30),
    geography: str(f, 'geography', 30),
    website: str(f, 'website', 200),
    name: str(f, 'name', 100),
    company: str(f, 'company', 120),
    email: str(f, 'email', 160).toLowerCase(),
    phone: str(f, 'phone', 20),
    challenge: str(f, 'challenge', 1500),
    intent: str(f, 'intent', 30),
    whatsappConsent: f.get('whatsappConsent') === 'yes',
    source: str(f, 'source', 200),
  };
  if (!values(GOALS).includes(lead.goal)) return { error: 'Please choose what you want to achieve.' };
  if (![...industries, 'other'].includes(lead.industry)) return { error: 'Please choose your industry.' };
  if (!values(REVENUE_BANDS).includes(lead.revenue)) return { error: 'Please choose a revenue range.' };
  if (!values(SPEND_BANDS).includes(lead.spend)) return { error: 'Please choose a marketing spend range.' };
  if (!values(GEOGRAPHIES).includes(lead.geography)) return { error: 'Please choose your target geography.' };
  if (lead.name.length < 2) return { error: 'Please enter your name.' };
  if (lead.company!.length < 1) return { error: 'Please enter your company.' };
  if (!EMAIL.test(lead.email)) return { error: 'Please enter a valid email address.' };
  if (!PHONE.test(lead.phone)) return { error: 'Please enter a valid phone number.' };
  if (!lead.challenge || lead.challenge.length < 5) return { error: 'Please tell us your primary challenge.' };
  if (f.get('privacy') !== 'yes') return { error: 'Please accept the privacy notice to continue.' };
  if (!/^[a-z-]{0,30}$/.test(lead.intent ?? '')) lead.intent = 'growth-audit';
  return { lead };
}

/* Simple in-memory rate limit (per process). Use a shared store (e.g. Redis) when running multiple instances. */
const hits = new Map<string, number[]>();
export function rateLimited(key: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) hits.clear();
  return list.length > limit;
}

export async function verifyTurnstile(token: string | null, ip: string): Promise<boolean> {
  const secret = env('TURNSTILE_SECRET_KEY');
  if (!secret) return true; // not configured
  if (!token) return false;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return !!data.success;
  } catch {
    return false;
  }
}

async function postJson(url: string, body: unknown, secret?: string) {
  const payload = JSON.stringify(body);
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (secret) headers['x-tbm-signature'] = createHmac('sha256', secret).update(payload).digest('hex');
  const res = await fetch(url, { method: 'POST', headers, body: payload, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`Webhook ${res.status}`);
}

export async function deliverLead(lead: CleanLead) {
  const { score, tier, breakdown } = scoreLead(lead);
  const record = {
    receivedAt: new Date().toISOString(),
    lead,
    scoring: { score, tier, breakdown },
    nurture: nurtureTrack(lead, tier),
  };
  const tasks: Promise<unknown>[] = [];
  const crm = env('CRM_WEBHOOK_URL');
  const follow = env('FOLLOWUP_WEBHOOK_URL');
  const store = env('LEAD_STORE_PATH');
  if (crm) tasks.push(postJson(crm, record, env('CRM_WEBHOOK_SECRET')));
  // Follow-up automation sends: thank-you, assessment summary, next step, meeting link,
  // relevant case study and industry research — chosen by nurture.sequence / industry / objective.
  if (follow) tasks.push(postJson(follow, { ...record, event: 'lead_created' }, env('CRM_WEBHOOK_SECRET')));
  if (store) tasks.push(mkdir(dirname(store), { recursive: true }).then(() => appendFile(store, JSON.stringify(record) + '\n', { mode: 0o600 })));
  const results = await Promise.allSettled(tasks);
  const failed = results.filter((r) => r.status === 'rejected');
  if (tasks.length === 0 || failed.length === tasks.length) {
    // Never lose a lead silently: surface it in server logs (without secrets) for recovery.
    console.error('[lead] no delivery target succeeded', { tier, email: lead.email, errors: failed.map((f) => String((f as PromiseRejectedResult).reason)) });
    if (tasks.length > 0) throw new Error('delivery_failed');
  }
  return { tier, score };
}
