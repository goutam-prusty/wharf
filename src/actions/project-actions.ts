'use server';

import { revalidatePath } from 'next/cache';
import { and, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { activityLogs, projects } from '@/lib/db/schema';
import { requireOrganizationAccess } from '@/lib/auth/current-user';
import { assertPermission } from '@/lib/auth/permissions';
import { logger } from '@/lib/logger';
import {
  createProjectSchema,
  updateProjectStatusSchema,
} from '@/lib/validations/project';
import type { ActionResult } from '@/types';

export async function createProject(
  slug: string,
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const parsed = createProjectSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description') ?? '',
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message };
  }

  try {
    const { organization, membership } = await requireOrganizationAccess(slug);
    assertPermission(membership.role, 'project:create');

    const [project] = await db
      .insert(projects)
      .values({
        organizationId: organization.id,
        name: parsed.data.name,
        description: parsed.data.description || null,
        createdByUserId: membership.userId,
      })
      .returning();

    if (!project) {
      throw new Error('Failed to create project.');
    }

    await db.insert(activityLogs).values({
      organizationId: organization.id,
      actorUserId: membership.userId,
      action: 'project.created',
      metadata: JSON.stringify({ projectId: project.id, name: project.name }),
    });

    revalidatePath('/dashboard');
    return { success: true, message: 'Project created.', data: { id: project.id } };
  } catch (error) {
    logger.exception(error, { action: 'createProject', slug });
    const message = error instanceof Error ? error.message : 'Could not create project.';
    return { success: false, message };
  }
}

export async function updateProjectStatus(
  slug: string,
  input: unknown,
): Promise<ActionResult> {
  const parsed = updateProjectStatusSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: 'Invalid request.' };
  }

  try {
    const { organization, membership } = await requireOrganizationAccess(slug);
    assertPermission(membership.role, 'project:archive');

    await db
      .update(projects)
      .set({ status: parsed.data.status })
      .where(
        and(
          eq(projects.id, parsed.data.projectId),
          eq(projects.organizationId, organization.id),
        ),
      );

    revalidatePath('/dashboard');
    return { success: true, message: 'Project updated.' };
  } catch (error) {
    logger.exception(error, { action: 'updateProjectStatus', slug });
    const message = error instanceof Error ? error.message : 'Update failed.';
    return { success: false, message };
  }
}
