import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { memberships, organizations } from '@/lib/db/schema';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';

/**
 * Verifies and processes Clerk webhook events.
 *
 * Wharf treats Clerk organizations as the source of truth for identity and
 * membership, mirroring the relevant subset into our own tables so that
 * application data (projects, activity logs, etc.) can carry ordinary
 * foreign keys instead of reaching out to Clerk's API on every read.
 *
 * Configure this endpoint in the Clerk dashboard under Webhooks, pointing to
 * `${NEXT_PUBLIC_APP_URL}/api/webhooks/clerk`, subscribed to at least
 * `organization.created`, `organizationMembership.created`, and
 * `organizationMembership.deleted`.
 */
export async function POST(request: Request) {
  if (!env.CLERK_WEBHOOK_SIGNING_SECRET) {
    logger.error(
      'Clerk webhook received but CLERK_WEBHOOK_SIGNING_SECRET is not configured.',
    );
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const headerList = await headers();
  const svixId = headerList.get('svix-id');
  const svixTimestamp = headerList.get('svix-timestamp');
  const svixSignature = headerList.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
  }

  const payload = await request.text();
  const webhook = new Webhook(env.CLERK_WEBHOOK_SIGNING_SECRET);

  let event: { type: string; data: Record<string, unknown> };

  try {
    event = webhook.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as { type: string; data: Record<string, unknown> };
  } catch (error) {
    logger.exception(error, { context: 'clerk-webhook-verify' });
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'organizationMembership.deleted': {
        const data = event.data as {
          organization?: { id?: string };
          public_user_data?: { user_id?: string };
        };
        const clerkOrgId = data.organization?.id;
        const userId = data.public_user_data?.user_id;

        if (clerkOrgId && userId) {
          const [organization] = await db
            .select()
            .from(organizations)
            .where(eq(organizations.clerkOrgId, clerkOrgId))
            .limit(1);

          if (organization) {
            await db
              .delete(memberships)
              .where(eq(memberships.organizationId, organization.id));
          }
        }
        break;
      }
      default:
        logger.debug('Unhandled Clerk webhook event', { type: event.type });
    }
  } catch (error) {
    logger.exception(error, { context: 'clerk-webhook-handle', type: event.type });
    return NextResponse.json({ error: 'Webhook handling failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
