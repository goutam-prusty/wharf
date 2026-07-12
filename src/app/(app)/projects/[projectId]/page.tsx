import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  requireUserOrRedirect,
  requireOrganizationAccess,
} from '@/lib/auth/current-user';
import { getActiveOrganizationSlug } from '@/lib/auth/active-organization';
import { getProjectById } from '@/lib/db/queries/projects';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Project',
};

interface ProjectPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  const userId = await requireUserOrRedirect();
  const slug = await getActiveOrganizationSlug(userId);
  const { organization } = await requireOrganizationAccess(slug);

  const project = await getProjectById(organization.id, projectId);

  if (!project) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>{project.name}</CardTitle>
          <Badge variant={project.status === 'active' ? 'success' : 'secondary'}>
            {project.status}
          </Badge>
        </div>
        <CardDescription>
          Created {formatDate(project.createdAt)} · Last updated{' '}
          {formatDate(project.updatedAt)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {project.description ?? 'No description provided for this project yet.'}
        </p>
      </CardContent>
    </Card>
  );
}
