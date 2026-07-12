# Architecture overview

## Tenancy model

Wharf is built around **organizations**, not users, as the unit of tenancy.

```
organizations ──< memberships >── (Clerk user id)
      │
      └──< projects
      └──< activity_logs
```

A `membership` row links a Clerk user id to an organization with a `role`
(`owner | admin | member`). Every domain resource — currently `projects`,
plus an `activity_logs` audit trail — references `organization_id` directly.
There is deliberately no path from a resource to a user except through an
organization. This means:

- A single query shape (`WHERE organization_id = :id`) enforces tenant
  isolation everywhere. There's no separate "is this the user's own
  resource" check to get right in fifteen different places.
- Billing, seats, and plan limits can all be attached to `organizations`
  later without re-modeling anything.

Clerk is the source of truth for _identity_ (who is this person, what's
their email, are they authenticated right now). Wharf's own database is the
source of truth for _authorization within the product_ (which organizations
do they belong to, what can they do there). The Clerk webhook handler
(`src/app/api/webhooks/clerk/route.ts`) keeps membership removal in sync
when it happens on Clerk's side.

## Authorization

`src/lib/auth/permissions.ts` defines one matrix:

```ts
const PERMISSIONS = {
  'project:create': ['owner', 'admin', 'member'],
  'project:archive': ['owner', 'admin'],
  'member:changeRole': ['owner'],
  // ...
} as const;
```

Every Server Action and Route Handler that mutates data calls
`assertPermission(role, 'some:permission')` before doing anything. Every
piece of UI that conditionally renders a control (e.g., an "Archive" button)
calls the non-throwing `can(role, permission)` instead. Adding a new
permission is a one-line addition to the matrix and a call at the point of
use — never a scattered `if (role === 'admin' || role === 'owner')`.

`src/lib/auth/current-user.ts` provides the two functions almost everything
else builds on:

- `requireUserOrRedirect()` — for Server Components; redirects to sign-in.
- `requireOrganizationAccess(slug)` — resolves the organization by slug,
  confirms the current user is a member, and returns both. This is the
  single choke point every organization-scoped page or action passes
  through.

## Data flow: Server Actions vs. Route Handlers

Wharf uses **both**, deliberately, for different audiences:

- **Server Actions** (`src/actions/*.ts`) back the dashboard UI directly.
  Forms call them with no JSON serialization, no client-side fetch
  boilerplate, and they integrate with React's `useTransition` for pending
  states.
- **Route Handlers** (`src/app/api/*/route.ts`) exist for anything that
  needs a stable HTTP contract: a future CLI, a Zapier integration, a
  webhook consumer. `POST /api/projects` and the `createProject` Server
  Action perform the same operation through the same validation
  (`src/lib/validations/project.ts`) and the same permission check — they
  are two entry points to one operation, not two implementations of it.

## Environment variables

`src/lib/env.ts` uses `@t3-oss/env-nextjs` to validate every environment
variable the app depends on, both server- and client-side, against a Zod
schema, at process start. Misconfiguration fails immediately and legibly
instead of surfacing as an undefined value three files deep into a request.

## Error handling and observability

`src/lib/logger.ts` is a small structured-logging facade. In development it
prints readable console output; `warn` and `error` calls are also forwarded
to Sentry as breadcrumbs, and `logger.exception()` reports the actual
exception object. This means the same call sites work locally without a
Sentry DSN configured, and start reporting automatically the moment one is
added to the environment.

## UI layer

Components under `src/components/ui` follow the shadcn/ui pattern: they're
plain Radix-based primitives styled with Tailwind and `class-variance-authority`,
copied into the repo rather than pulled from an opaque package, so they can
be freely modified. `src/components/layout`, `src/components/dashboard`,
`src/components/forms`, and `src/components/marketing` compose those
primitives into the actual product surfaces.

## What's intentionally not included

See [`ROADMAP.md`](./ROADMAP.md) for a list of things left out on purpose —
billing integration, i18n, and a few others — along with why, and what the
recommended next step is for each.
