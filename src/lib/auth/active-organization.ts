import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getOrganizationsForUser } from '@/lib/db/queries/organizations';

export const ACTIVE_ORG_COOKIE = 'wharf_active_org';

/**
 * Resolves which organization the current request should operate against.
 *
 * Precedence: an explicit, still-valid cookie value, then the user's first
 * organization by membership creation order. If the user belongs to no
 * organization at all, they're sent to onboarding rather than hitting a
 * confusing empty dashboard.
 */
export async function getActiveOrganizationSlug(userId: string): Promise<string> {
  const memberships = await getOrganizationsForUser(userId);

  if (memberships.length === 0) {
    redirect('/onboarding');
  }

  const cookieStore = await cookies();
  const cookieSlug = cookieStore.get(ACTIVE_ORG_COOKIE)?.value;

  const match = memberships.find((m) => m.organization.slug === cookieSlug);
  const firstMembership = memberships[0];

  if (match) {
    return match.organization.slug;
  }

  if (!firstMembership) {
    redirect('/onboarding');
  }

  return firstMembership.organization.slug;
}
