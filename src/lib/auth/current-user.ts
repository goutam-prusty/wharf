import 'server-only';

import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { getMembership, getOrganizationBySlug } from '@/lib/db/queries/organizations';
import type { Membership, Organization } from '@/lib/db/schema';
import { ForbiddenError, UnauthorizedError } from './errors';

export { ForbiddenError, UnauthorizedError };

/**
 * Requires an authenticated Clerk session. Redirects to sign-in when used in
 * a Server Component; throws when used in a Server Action or Route Handler
 * so the caller can convert it into a JSON error response.
 */
export async function requireUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new UnauthorizedError();
  }

  const user = await currentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  return user;
}

export async function requireUserOrRedirect() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return userId;
}

interface OrganizationContext {
  organization: Organization;
  membership: Membership;
}

/**
 * Resolves the organization identified by `slug` and verifies the current
 * user is a member of it. This is the single choke point every
 * organization-scoped page, Server Action, and Route Handler should pass
 * through — it guarantees tenant isolation is enforced consistently rather
 * than re-implemented ad hoc at each call site.
 */
export async function requireOrganizationAccess(
  slug: string,
): Promise<OrganizationContext> {
  const { userId } = await auth();

  if (!userId) {
    throw new UnauthorizedError();
  }

  const organization = await getOrganizationBySlug(slug);

  if (!organization) {
    throw new ForbiddenError('Organization not found.');
  }

  const membership = await getMembership(organization.id, userId);

  if (!membership) {
    throw new ForbiddenError('You are not a member of this organization.');
  }

  return { organization, membership };
}
