# Roadmap

## Intentionally out of scope

These are left out on purpose, with a note on why and how to add them, so
the starter stays a starter rather than an opinionated framework:

- **Billing.** The data model separates organizations from billing
  concerns specifically so a provider (Stripe, Paddle, Lemon Squeezy) can
  be layered in without a rewrite. A natural next step: a `subscriptions`
  table keyed on `organization_id`, a Stripe Checkout session created from
  a Server Action, and a webhook handler parallel to the existing Clerk one.
- **Internationalization.** Adding `next-intl` or similar is straightforward
  but changes the App Router folder structure (a `[locale]` segment above
  everything else), which is a decision best made per-project rather than
  imposed by the starter.
- **Email sending.** Transactional email (invitations, digest emails) is
  provider-specific (Resend, Postmark, SES). The `member:invite` permission
  already exists in the matrix; wiring it to an actual invite flow with
  email delivery is the natural next step once you've picked a provider.
- **File uploads / storage.** Not needed until your product has a concrete
  use case for it (avatars, attachments) — adding S3/R2/UploadThing later
  is additive, not a redesign.

## Suggested next steps for a real product

1. Replace the `projects` table and its UI with your actual core domain
   entity — the CRUD pattern (schema → queries → validations → Server
   Action → Route Handler → component) is meant to be copied.
2. Add billing once you have a pricing model to implement, using the
   `PLANS` constant in `src/lib/constants.ts` as your starting point.
3. Extend `docs/TESTING.md`'s e2e suite with authenticated flows once
   you've set up Clerk testing tokens.
4. Add rate limiting to `src/app/api/*/route.ts` handlers if you expose
   them publicly (Upstash's Redis-based rate limiter is a common,
   serverless-friendly choice).
