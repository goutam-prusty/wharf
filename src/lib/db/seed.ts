import { config } from 'dotenv';

config({ path: '.env.local' });

/**
 * Seeds a demo organization with a handful of projects so a fresh clone
 * has something to look at immediately after `npm run db:seed`.
 *
 * This intentionally uses a placeholder Clerk user id. Replace it with your
 * own Clerk user id (found in the Clerk dashboard) to see the seeded
 * organization show up when you sign in locally.
 */
async function main() {
  const { default: postgres } = await import('postgres');
  const { drizzle } = await import('drizzle-orm/postgres-js');
  const { env } = await import('@/lib/env');
  const { memberships, organizations, projects } = await import('./schema');

  const client = postgres(env.DATABASE_URL, { max: 1 });
  const db = drizzle(client);

  const demoUserId = process.env.SEED_CLERK_USER_ID ?? 'user_placeholder';

  const [organization] = await db
    .insert(organizations)
    .values({
      name: 'Acme Harbor',
      slug: 'acme-harbor',
      clerkOrgId: 'org_placeholder',
    })
    .returning();

  if (!organization) {
    throw new Error('Failed to seed organization');
  }

  await db.insert(memberships).values({
    organizationId: organization.id,
    userId: demoUserId,
    role: 'owner',
  });

  await db.insert(projects).values([
    {
      organizationId: organization.id,
      name: 'Marketing Site Relaunch',
      description: 'Redesign the public marketing site ahead of the v2 launch.',
      createdByUserId: demoUserId,
    },
    {
      organizationId: organization.id,
      name: 'Billing Migration',
      description: 'Move usage-based billing onto the new metering pipeline.',
      createdByUserId: demoUserId,
    },
    {
      organizationId: organization.id,
      name: 'Mobile Beta',
      description: 'Ship the closed beta of the companion mobile app.',
      status: 'archived',
      createdByUserId: demoUserId,
    },
  ]);

  console.log(`Seeded organization "${organization.name}" (${organization.id}).`);
  await client.end();
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
