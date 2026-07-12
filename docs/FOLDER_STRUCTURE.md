# Folder structure

```
src/
├── actions/                  Server Actions — mutations invoked directly from forms/UI
│   ├── organization-actions.ts
│   ├── project-actions.ts
│   ├── profile-actions.ts
│   └── onboarding-actions.ts
│
├── app/                       Next.js App Router
│   ├── (marketing)/           Public marketing site (landing, pricing)
│   ├── (auth)/                 Clerk sign-in / sign-up
│   ├── (app)/                  Authenticated app shell (dashboard, settings, projects)
│   ├── onboarding/             First-organization creation flow
│   ├── api/                    Route Handlers (REST endpoints, webhooks, health check)
│   ├── layout.tsx              Root layout (Clerk provider, theme, fonts)
│   ├── global-error.tsx        Top-level error boundary (reports to Sentry)
│   ├── not-found.tsx
│   ├── sitemap.ts
│   └── robots.ts
│
├── components/
│   ├── ui/                     Radix-based primitives (button, card, dialog, ...)
│   ├── layout/                 App shell chrome (sidebar, navbar, org switcher, theme toggle)
│   ├── dashboard/               Dashboard-specific composed components
│   ├── forms/                    Settings forms (profile, organization, members)
│   └── marketing/                Landing page sections
│
├── hooks/                     Client-side hooks (use-toast)
│
├── lib/
│   ├── auth/                    Auth/authorization: current user, permission matrix, errors
│   ├── db/                       Drizzle client, schema, migration/seed scripts, queries/
│   ├── validations/            Zod schemas shared between forms and Server Actions
│   ├── env.ts                   Typed, validated environment variables
│   ├── logger.ts                Structured logging facade (forwards to Sentry)
│   ├── constants.ts             App-wide constants (plans, nav links)
│   └── utils.ts                 cn(), slugify(), formatDate(), etc.
│
├── types/                     Shared TypeScript types not tied to the DB schema
│
└── middleware.ts               Clerk route protection

tests/
├── unit/                       Vitest — pure logic (permissions, utils)
└── e2e/                          Playwright — real-browser flows

drizzle/                       Generated SQL migrations + snapshot metadata
docs/                          This documentation set
.github/workflows/            CI pipeline
```

## Why route groups?

`(marketing)`, `(auth)`, and `(app)` are Next.js route groups — they don't
affect the URL, only which `layout.tsx` wraps a given page. This lets the
marketing site, the auth pages, and the authenticated app shell each have
completely different chrome (navbar vs. centered auth card vs.
sidebar-and-topbar) without any of them leaking into the others.

## Why separate `actions/` from `app/api/`?

Server Actions are the primary way the dashboard UI mutates data — they're
called directly from forms with no serialization step. Route Handlers exist
specifically for consumers that need an HTTP contract (external
integrations, webhooks). Both call into the same `lib/db/queries` and
`lib/validations` layers, so the actual business logic is never duplicated
between them — see `docs/ARCHITECTURE.md` for the full reasoning.
