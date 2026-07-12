# Deployment (Vercel)

## 1. Provision a database

Any managed Postgres works. [Neon](https://neon.tech) and
[Supabase](https://supabase.com) both have generous free tiers and pair
well with serverless deployments. Copy the connection string — you'll need
it in step 3.

## 2. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

## 3. Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
2. Vercel will detect the Next.js framework automatically (`vercel.json` in
   this repo pins `framework: "nextjs"` explicitly, so this isn't
   guesswork).
3. Add environment variables under **Settings → Environment Variables**,
   matching `.env.example`:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_APP_URL` (your production URL, e.g. `https://wharf.yourdomain.com`)
   - `CLERK_WEBHOOK_SIGNING_SECRET` (see `docs/CLERK_SETUP.md`)
   - `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` (optional)
4. Deploy.

## 4. Run migrations against production

Migrations are not run automatically on deploy — that's deliberate, since
auto-running schema changes on every deploy is how you accidentally run a
destructive migration against production data. Run them explicitly:

```bash
DATABASE_URL="<production-connection-string>" npm run db:migrate
```

Do this once after the first deploy, and again after each `npm run
db:generate` produces a new migration file that you've reviewed and
committed.

## 5. Point Clerk at your production domain

In the Clerk dashboard, add your production domain under **Domains**, and
update the webhook endpoint (Clerk dashboard → Webhooks) to point at
`https://<your-domain>/api/webhooks/clerk`.

## 6. Verify

- `https://<your-domain>/api/health` should return `{"status":"ok",...}`.
- Sign up through the real production auth flow and confirm onboarding
  creates an organization correctly.

## Preview deployments

Vercel's preview deployments will each get their own URL but share whatever
`DATABASE_URL` you configure at the project level unless you override it
per-environment (**Settings → Environment Variables → scope to
Preview**). For a starter project, pointing previews at the same database
as production is usually fine; for anything handling real user data, give
previews a separate database.
