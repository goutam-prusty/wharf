# Clerk setup

## 1. Create an application

Sign up at [dashboard.clerk.com](https://dashboard.clerk.com) and create a
new application. Copy the publishable and secret keys into `.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## 2. Sign-in / sign-up routes

Wharf already implements the Clerk catch-all routes at:

- `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`
- `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`

No further configuration is required unless you want to customize the
Clerk `<SignIn />` / `<SignUp />` appearance — see the `appearance` prop
already passed in each file as a starting point.

## 3. Route protection

`src/middleware.ts` uses `clerkMiddleware` with a `createRouteMatcher` allow-list
of public routes (marketing pages, auth pages, the health check, and the
webhook endpoint). Everything else requires a signed-in session. If you add
new public pages, add them to the `isPublicRoute` matcher — the default is
"protected," not "public," so nothing is accidentally exposed.

## 4. Webhook (optional but recommended)

Wharf mirrors Clerk organization-membership removal into its own database
via a webhook, so a user removed from an organization on Clerk's side loses
access immediately rather than on their next Clerk session refresh.

1. In the Clerk dashboard, go to **Webhooks → Add Endpoint**.
2. Set the URL to `https://<your-domain>/api/webhooks/clerk`.
3. Subscribe to at least `organizationMembership.deleted`. Add
   `organization.created` and `organizationMembership.created` too if you
   plan to extend the handler to sync those events as well.
4. Copy the **Signing Secret** into `.env.local` / your deployment's
   environment variables as `CLERK_WEBHOOK_SIGNING_SECRET`.

The handler lives at `src/app/api/webhooks/clerk/route.ts` and verifies the
`svix` signature before processing anything — requests that fail
verification are rejected with a 400, never silently accepted.

## 5. Local testing of the webhook

Clerk can't reach `localhost` directly. Use the Clerk CLI or a tunnel
(e.g., `ngrok http 3000`) and point the webhook endpoint at the tunnel URL
while developing locally.
