# Testing

Wharf ships with two layers of automated tests, both run in CI on every
push and pull request.

## Unit tests (Vitest)

```bash
npm run test          # single run
npm run test:watch    # watch mode
npm run test:coverage # with coverage report
```

Unit tests live in `tests/unit/` and currently cover:

- `utils.test.ts` — pure formatting/slug helpers (`src/lib/utils.ts`)
- `permissions.test.ts` — the full role/permission matrix
  (`src/lib/auth/permissions.ts`), including that `assertPermission` throws
  `ForbiddenError` for disallowed combinations

These deliberately test pure logic rather than mounting React components
end-to-end — component behavior (rendering, user interaction) is covered
instead by the Playwright suite, which exercises real pages in a real
browser and catches integration issues unit tests can't.

When you add a new permission or a new pure utility function, add a test
alongside it in `tests/unit/`.

## End-to-end tests (Playwright)

```bash
npx playwright install --with-deps   # first time only
npm run test:e2e                      # headless
npm run test:e2e:ui                   # interactive UI mode
```

`playwright.config.ts` boots the app itself (`npm run build && npm run
start`) against `http://localhost:3000` before running tests, so you don't
need a separate terminal running the dev server. Tests live in
`tests/e2e/` and currently cover:

- `marketing.spec.ts` — the landing page renders, pricing navigation works,
  and unauthenticated users hitting `/dashboard` are redirected to sign-in
- `auth.spec.ts` — the Clerk sign-in/sign-up widgets render, and protected
  settings routes redirect anonymous users

Because these tests run against a real Clerk instance, they intentionally
avoid asserting on anything past the sign-in/sign-up screen — testing
authenticated flows requires either Clerk's testing tokens or a dedicated
test user, which is environment-specific. If you wire up Clerk's
[testing tokens](https://clerk.com/docs/testing/overview), extend
`tests/e2e/` with authenticated-flow coverage (creating a project,
inviting a member, changing a role).

## Running everything CI runs, locally

```bash
npm run ci
```

This runs `typecheck`, `lint`, `format:check`, and `test` in sequence — the
same checks `.github/workflows/ci.yml` runs on every push, minus the
Postgres-backed migration step and the Playwright job (which need a running
database and browsers respectively).
