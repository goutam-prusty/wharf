'use server';

import { redirect } from 'next/navigation';

import { db } from '@/lib/db';
import { memberships, organizations } from '@/lib/db/schema';
import { requireUser } from '@/lib/auth/current-user';
import { logger } from '@/lib/logger';
import { slugify } from '@/lib/utils';
import { updateOrganizationSchema } from '@/lib/validations/organization';
import type { ActionResult } from '@/types';

export async function createOrganization(formData: FormData): Promise<ActionResult> {
  const parsed = updateOrganizationSchema.safeParse({ name: formData.get('name') });

  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message };
  }

  let slug = '';

  try {
    const user = await requireUser();
    const baseSlug = slugify(parsed.data.name) || 'workspace';
    slug = `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`;

    const [organization] = await db
      .insert(organizations)
      .values({
        name: parsed.data.name,
        slug,
        clerkOrgId: `local_${user.id}_${Date.now()}`,
      })
      .returning();

    if (!organization) {
      throw new Error('Failed to create organization.');
    }

    await db.insert(memberships).values({
      organizationId: organization.id,
      userId: user.id,
      role: 'owner',
    });
  } catch (error) {
    logger.exception(error, { action: 'createOrganization' });
    const message =
      error instanceof Error ? error.message : 'Could not create organization.';
    return { success: false, message };
  }

  redirect(`/dashboard?org=${slug}`);
}
