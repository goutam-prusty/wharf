import type { Metadata } from 'next';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MembersTable } from '@/components/forms/members-table';
import {
  requireUserOrRedirect,
  requireOrganizationAccess,
} from '@/lib/auth/current-user';
import { getActiveOrganizationSlug } from '@/lib/auth/active-organization';
import { can } from '@/lib/auth/permissions';
import { getMembersForOrganization } from '@/lib/db/queries/organizations';

export const metadata: Metadata = {
  title: 'Members',
};

export default async function MembersSettingsPage() {
  const userId = await requireUserOrRedirect();
  const slug = await getActiveOrganizationSlug(userId);
  const { organization, membership } = await requireOrganizationAccess(slug);
  const members = await getMembersForOrganization(organization.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team members</CardTitle>
        <CardDescription>
          Manage who has access to {organization.name} and what they can do.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MembersTable
          slug={slug}
          members={members}
          currentMembershipId={membership.id}
          canManage={
            can(membership.role, 'member:changeRole') ||
            can(membership.role, 'member:remove')
          }
        />
      </CardContent>
    </Card>
  );
}
