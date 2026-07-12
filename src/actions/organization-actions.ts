'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { memberships, organizations } from '@/lib/db/schema';
import { requireOrganizationAccess, requireUser } from '@/lib/auth/current-user';
import { assertPermission } from '@/lib/auth/permissions';
import { logger } from '@/lib/logger';
import {
  changeMemberRoleSchema,
  updateOrganizationSchema,
} from '@/lib/validations/organization';
import { ACTIVE_ORG_COOKIE } from '@/lib/auth/active-organization';
import { getOrganizationsForUser } from '@/lib/db/queries/organizations';
import type { ActionResult } from '@/types';

export async function setActiveOrganization(slug: string): Promise<void> {
  const user = await requireUser();
  const memberships_ = await getOrganizationsForUser(user.id);
  const isMember = memberships_.some((m) => m.organization.slug === slug);

  if (!isMember) {
    throw new Error('You are not a member of that organization.');
  }

  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_ORG_COOKIE, slug, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });

  redirect('/dashboard');
}

export async function updateOrganizationName(
  slug: string,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = updateOrganizationSchema.safeParse({
    name: formData.get('name'),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message };
  }

  try {
    const { organization, membership } = await requireOrganizationAccess(slug);
    assertPermission(membership.role, 'organization:update');

    await db
      .update(organizations)
      .set({ name: parsed.data.name })
      .where(eq(organizations.id, organization.id));

    revalidatePath(`/settings/organization`);
    return { success: true, message: 'Organization updated.' };
  } catch (error) {
    logger.exception(error, { action: 'updateOrganizationName', slug });
    const message = error instanceof Error ? error.message : 'Update failed.';
    return { success: false, message };
  }
}

export async function changeMemberRole(
  slug: string,
  input: unknown,
): Promise<ActionResult> {
  const parsed = changeMemberRoleSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: 'Invalid request.' };
  }

  try {
    const { membership: actingMembership } = await requireOrganizationAccess(slug);
    assertPermission(actingMembership.role, 'member:changeRole');

    await db
      .update(memberships)
      .set({ role: parsed.data.role })
      .where(eq(memberships.id, parsed.data.membershipId));

    revalidatePath('/settings/members');
    return { success: true, message: 'Role updated.' };
  } catch (error) {
    logger.exception(error, { action: 'changeMemberRole', slug });
    const message = error instanceof Error ? error.message : 'Update failed.';
    return { success: false, message };
  }
}

export async function removeMember(
  slug: string,
  membershipId: string,
): Promise<ActionResult> {
  try {
    const { membership: actingMembership } = await requireOrganizationAccess(slug);
    assertPermission(actingMembership.role, 'member:remove');

    if (actingMembership.id === membershipId) {
      return { success: false, message: 'You cannot remove yourself.' };
    }

    await db.delete(memberships).where(eq(memberships.id, membershipId));

    revalidatePath('/settings/members');
    return { success: true, message: 'Member removed.' };
  } catch (error) {
    logger.exception(error, { action: 'removeMember', slug });
    const message = error instanceof Error ? error.message : 'Removal failed.';
    return { success: false, message };
  }
}
