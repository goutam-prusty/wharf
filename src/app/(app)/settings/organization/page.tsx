import type { Metadata } from 'next';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { OrganizationForm } from '@/components/forms/organization-form';
import {
  requireUserOrRedirect,
  requireOrganizationAccess,
} from '@/lib/auth/current-user';
import { getActiveOrganizationSlug } from '@/lib/auth/active-organization';
import { can } from '@/lib/auth/permissions';

export const metadata: Metadata = {
  title: 'Organization',
};

export default async function OrganizationSettingsPage() {
  const userId = await requireUserOrRedirect();
  const slug = await getActiveOrganizationSlug(userId);
  const { organization, membership } = await requireOrganizationAccess(slug);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization details</CardTitle>
        <CardDescription>
          These details are visible to everyone in {organization.name}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OrganizationForm
          slug={slug}
          currentName={organization.name}
          disabled={!can(membership.role, 'organization:update')}
        />
      </CardContent>
    </Card>
  );
}
