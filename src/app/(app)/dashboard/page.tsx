import type { Metadata } from 'next';
import { FolderKanban, Users, Activity } from 'lucide-react';

import { StatCard } from '@/components/dashboard/stat-card';
import { ProjectList } from '@/components/dashboard/project-list';
import {
  requireOrganizationAccess,
  requireUserOrRedirect,
} from '@/lib/auth/current-user';
import { getActiveOrganizationSlug } from '@/lib/auth/active-organization';
import { can } from '@/lib/auth/permissions';
import { getProjectsForOrganization } from '@/lib/db/queries/projects';
import { getMembersForOrganization } from '@/lib/db/queries/organizations';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const userId = await requireUserOrRedirect();
  const slug = await getActiveOrganizationSlug(userId);
  const { organization, membership } = await requireOrganizationAccess(slug);

  const [projects, members] = await Promise.all([
    getProjectsForOrganization(organization.id),
    getMembersForOrganization(organization.id),
  ]);

  const activeProjects = projects.filter((p) => p.status === 'active').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{organization.name}</h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening across your organization.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active projects" value={activeProjects} icon={FolderKanban} />
        <StatCard label="Team members" value={members.length} icon={Users} />
        <StatCard label="Your role" value={membership.role} icon={Activity} />
      </div>

      <ProjectList
        slug={slug}
        projects={projects}
        canCreate={can(membership.role, 'project:create')}
        canArchive={can(membership.role, 'project:archive')}
      />
    </div>
  );
}
