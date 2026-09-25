# Integrations

## CRM / automation webhook

`POST CRM_WEBHOOK_URL` (and `FOLLOWUP_WEBHOOK_URL` with `"event": "lead_created"`), `content-type: application/json`, header `x-tbm-signature: hex(HMAC_SHA256(CRM_WEBHOOK_SECRET, rawBody))`.

```json
{
  "receivedAt": "2026-09-25T11:00:34.073Z",
  "lead": { "goal": "generate-leads", "industry": "real-estate", "revenue": "gt-10cr", "spend": "gt-20l",
            "geography": "india", "website": "example.com", "name": "…", "company": "…", "email": "…",
            "phone": "…", "challenge": "…", "intent": "proposal", "whatsappConsent": true, "source": "utm_source|utm_medium|utm_campaign" },
  "scoring": { "score": 91, "tier": "enterprise-opportunity", "breakdown": { "revenue": 25, "budget": 25, "intent": 20, "industry": 8, "geography": 9, "website": 5, "maturity": 5 } },
  "nurture": { "tier": "enterprise-opportunity", "industry": "real-estate", "objective": "generate-leads", "budget": "gt-20l", "sequence": "sales-priority-24h" }
}
```

Recommended automation on receipt (HubSpot, Zoho, LeadSquared, Make, Zapier or n8n):

1. Create/update contact and deal; assign owner by `scoring.tier`.
2. Immediately send (email, plus WhatsApp template if `whatsappConsent`): thank-you, assessment summary of their answers, next step, meeting link, one relevant case study and one industry research page (`/industries/{industry}/`).
3. Enrol in `nurture.sequence`: `sales-priority-24h`, `consultative-nurture-14d` or `education-nurture-30d`, personalised by industry, objective and budget.

Resource downloads send `"event": "resource_download"` with the resource slug.

## Analytics events (dataLayer / GA4 via GTM)

| Event | When | Params |
|---|---|---|
| `cta_click` | Any tracked CTA | `cta`, `label`, `page_path` |
| `form_step` | Growth Audit step shown | `step`, `step_name` |
| `lead_submitted` | Successful lead (Meta: `Lead`) | `lead_tier`, `intent` |
| `booking_click` | Booking link clicked (Meta: `Schedule`) | |
| `tool_used` | First interaction with a tool | `tool` |
| `growth_system_stage` | Growth System tab | `stage` |
| `resource_download` | Download (Meta: `Lead`) | `resource` |
| `site_search` | Search | `search_term`, `results` |
| `exit_intent_shown` / `exit_intent_click` | Exit-intent modal | |

Mark `lead_submitted` as a key event in GA4 and import it to Google Ads. For qualified-lead optimisation, import CRM stages back as offline conversions.

## Search Console

Add the verification token in settings (`analytics.searchConsoleVerification`) and submit `/sitemap-index.xml`.

## Spam protection

Set `PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` to enable Cloudflare Turnstile. Honeypot, origin check and per-IP rate limiting are always on. With several server instances, move the in-memory rate limiter to a shared store.
