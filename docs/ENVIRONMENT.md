# Environment variables

Copy `.env.example` to `.env.local` and fill in real values. All variables
are validated at boot by `src/lib/env.ts` — if one is missing or malformed,
the app refuses to start and tells you exactly which one.

## App

| Variable              | Required | Description                                                                                                                         |
| --------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_APP_URL` | Yes      | The public URL of your deployment. Used for metadata, the sitemap, and absolute links. Defaults to `http://localhost:3000` locally. |

## Database

| Variable       | Required | Description                                                                                         |
| -------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `DATABASE_URL` | Yes      | A standard PostgreSQL connection string. Works with local Postgres, Docker, Neon, Supabase, or RDS. |

## Clerk

Create a free application at [dashboard.clerk.com](https://dashboard.clerk.com).

| Variable                            | Required                  | Description                                     |
| ----------------------------------- | ------------------------- | ----------------------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes                       | From the Clerk dashboard's API Keys page.       |
| `CLERK_SECRET_KEY`                  | Yes                       | From the same page. Keep this server-side only. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`     | No                        | Defaults to `/sign-in`.                         |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL`     | No                        | Defaults to `/sign-up`.                         |
| `CLERK_WEBHOOK_SIGNING_SECRET`      | Only if using the webhook | See [`CLERK_SETUP.md`](./CLERK_SETUP.md).       |

## Sentry (optional)

Leave these blank to run without error tracking — the app works fine
without them, and `logger.ts` simply skips the Sentry calls.

| Variable                 | Required | Description                                                                                      |
| ------------------------ | -------- | ------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SENTRY_DSN` | No       | Your project's DSN. Also gates whether `next.config.ts` wraps the build with `withSentryConfig`. |
| `SENTRY_ORG`             | No       | Used for source map uploads at build time.                                                       |
| `SENTRY_PROJECT`         | No       | Used for source map uploads at build time.                                                       |
| `SENTRY_AUTH_TOKEN`      | No       | Required only if uploading source maps in CI.                                                    |

## Local seeding (optional)

| Variable             | Required | Description                                                                                                                                                           |
| -------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SEED_CLERK_USER_ID` | No       | Your own Clerk user id (visible in the Clerk dashboard under Users), so `npm run db:seed` attaches the demo organization to your account instead of a placeholder id. |

## CI

`SKIP_ENV_VALIDATION=true` is set in `.github/workflows/ci.yml` so type
checking and linting can run without real secrets. The build and test jobs
still use a real (containerized) Postgres instance.
