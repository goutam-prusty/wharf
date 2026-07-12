import { NextResponse } from 'next/server';

import { requireOrganizationAccess } from '@/lib/auth/current-user';
import { assertPermission } from '@/lib/auth/permissions';
import { getProjectsForOrganization } from '@/lib/db/queries/projects';
import { db } from '@/lib/db';
import { activityLogs, projects } from '@/lib/db/schema';
import { createProjectSchema } from '@/lib/validations/project';
import { logger } from '@/lib/logger';

/**
 * REST-style endpoint for programmatic/API-key integrations.
 *
 * The dashboard UI uses the `createProject` Server Action directly (no
 * network round-trip through JSON), but external integrations — CLIs,
 * Zapier, CI pipelines — need a stable HTTP contract, which is what this
 * Route Handler provides for the same underlying operation.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('organization');

  if (!slug) {
    return NextResponse.json(
      { error: 'Missing "organization" query parameter' },
      { status: 400 },
    );
  }

  try {
    const { organization } = await requireOrganizationAccess(slug);
    const data = await getProjectsForOrganization(organization.id);
    return NextResponse.json({ data });
  } catch (error) {
    logger.exception(error, { route: 'GET /api/projects', slug });
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 403 });
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('organization');

  if (!slug) {
    return NextResponse.json(
      { error: 'Missing "organization" query parameter' },
      { status: 400 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = createProjectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
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

    await db.insert(activityLogs).values({
      organizationId: organization.id,
      actorUserId: membership.userId,
      action: 'project.created',
      metadata: JSON.stringify({ projectId: project?.id }),
    });

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error) {
    logger.exception(error, { route: 'POST /api/projects', slug });
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 403 });
  }
}
