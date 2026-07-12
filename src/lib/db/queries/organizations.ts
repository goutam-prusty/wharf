import { and, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { memberships, organizations } from '@/lib/db/schema';

export async function getOrganizationsForUser(userId: string) {
  const rows = await db
    .select({
      organization: organizations,
      role: memberships.role,
    })
    .from(memberships)
    .innerJoin(organizations, eq(memberships.organizationId, organizations.id))
    .where(eq(memberships.userId, userId));

  return rows;
}

export async function getOrganizationBySlug(slug: string) {
  const [organization] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.slug, slug))
    .limit(1);

  return organization ?? null;
}

export async function getMembership(organizationId: string, userId: string) {
  const [membership] = await db
    .select()
    .from(memberships)
    .where(
      and(eq(memberships.organizationId, organizationId), eq(memberships.userId, userId)),
    )
    .limit(1);

  return membership ?? null;
}

export async function getMembersForOrganization(organizationId: string) {
  return db
    .select()
    .from(memberships)
    .where(eq(memberships.organizationId, organizationId));
}
