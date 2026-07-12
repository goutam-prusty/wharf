# Wharf

**The multi-tenant SaaS starter for teams that want to ship, not scaffold.**

Wharf is a production-oriented Next.js 15 starter kit: authentication,
organization-based multi-tenancy, role-based access control, a typed
database layer, and the operational tooling (error tracking, testing, CI)
that real SaaS products need — all wired together and documented, not left
as an exercise for the next engineer.

This is not a demo. Every piece — the permission matrix, the Clerk webhook
handler, the Server Actions, the Route Handlers — is implemented the way it
would be in a codebase meant to run in production.

---

## Why Wharf

Most "SaaS starters" give you a login page and call it done. Wharf instead
makes the decisions that are annoying to retrofit later:

- **Organizations are the tenant boundary, not an afterthought.** Every
  domain table (`projects`, `activity_logs`, …) carries an
  `organization_id` foreign key from day one, so there's no migration path
  from "single-user app" to "multi-tenant app" to design later.
- **Permissions are centralized.** A single matrix in
  `src/lib/auth/permissions.ts` maps roles to actions. Nothing in the app
  compares `role === 'admin'` inline.
- **Server Actions and Route Handlers share the same data-access layer**
  (`src/lib/db/queries`), so the dashboard UI and any future public API stay
  in sync without duplicating query logic.
- **The operational basics are already in place**: typed environment
  variables that fail fast on boot, structured logging that forwards to
  Sentry, a seed script, CI that runs on every push, and both unit
  (Vitest) and end-to-end (Playwright) tests.

## Tech stack

| Concern        | Choice                                                    |
| -------------- | --------------------------------------------------------- |
| Framework      | Next.js 15 (App Router, Server Actions, Route Handlers)   |
| Language       | TypeScript (strict mode)                                  |
| UI             | Tailwind CSS + Radix primitives (shadcn-style components) |
| Auth           | Clerk                                                     |
| Database       | PostgreSQL + Drizzle ORM                                  |
| Validation     | Zod, React Hook Form                                      |
| Error tracking | Sentry                                                    |
| Testing        | Vitest (unit), Playwright (e2e)                           |
| Tooling        | ESLint (flat config), Prettier, Husky + lint-staged       |

## Quickstart

```bash
git clone <your-fork-url> wharf
cd wharf
npm install
cp .env.example .env.local   # fill in the values — see docs/ENVIRONMENT.md
npm run db:migrate           # apply the schema to your database
npm run db:seed              # optional: seed a demo organization
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up, and you'll be
routed through onboarding to create your first organization.

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — how the pieces fit together and why
- [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md) — every environment variable, explained
- [`docs/DATABASE.md`](docs/DATABASE.md) — schema, migrations, seeding
- [`docs/CLERK_SETUP.md`](docs/CLERK_SETUP.md) — configuring authentication and the webhook
- [`docs/TESTING.md`](docs/TESTING.md) — running unit and e2e tests
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — shipping to Vercel
- [`docs/FOLDER_STRUCTURE.md`](docs/FOLDER_STRUCTURE.md) — what lives where
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — what's intentionally left out, and what's next

## Scripts

```bash
npm run dev             # start the dev server
npm run build            # production build
npm run lint              # ESLint
npm run typecheck        # tsc --noEmit
npm run format            # Prettier, write mode
npm run test               # Vitest, single run
npm run test:e2e         # Playwright
npm run db:generate     # generate a new migration from schema changes
npm run db:migrate       # apply migrations
npm run db:studio        # open Drizzle Studio
npm run db:seed           # seed a demo organization
npm run ci                  # everything CI runs, locally
```

## License

MIT — use this as the foundation for your own product.
