import settings from '../data/settings.json';

export type Settings = typeof settings;
export const site = settings;

/** True when an admin-supplied value exists (not empty and not an "[ADMIN ...]" placeholder). */
export const has = (v: unknown): v is string =>
  typeof v === 'string' && v.trim().length > 0 && !v.trim().startsWith('[');

export const contactHref = (): string => '/contact/';
export const auditHref = '/contact/?intent=growth-audit';
export const strategyCallHref = '/contact/?intent=strategy-call';
export const proposalHref = '/contact/?intent=proposal';

/** Booking link is CMS-controlled. Falls back to the contact form so no CTA is ever dead. */
export const bookingHref = (): string => (has(site.bookingUrl) ? site.bookingUrl : strategyCallHref);

export const sameAs = (): string[] => Object.values(site.social).filter(has);

/**
 * Preview mode shows yellow [ADMIN ...] placeholders so editors can see what is missing.
 * Production builds (default) hide them and render honest public fallbacks instead.
 * Enable with PUBLIC_SHOW_PLACEHOLDERS=true (e.g. on a staging deploy); always on in `npm run dev`.
 */
export const preview: boolean = import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_PLACEHOLDERS === 'true';
