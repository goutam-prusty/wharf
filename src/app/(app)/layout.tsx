import { Sidebar } from '@/components/layout/sidebar';
import { AppNavbar } from '@/components/layout/app-navbar';
import { requireUserOrRedirect } from '@/lib/auth/current-user';
import { getActiveOrganizationSlug } from '@/lib/auth/active-organization';
import { getOrganizationsForUser } from '@/lib/db/queries/organizations';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const userId = await requireUserOrRedirect();
  const activeSlug = await getActiveOrganizationSlug(userId);
  const memberships = await getOrganizationsForUser(userId);

  const organizations = memberships.map((m) => ({ ...m.organization, role: m.role }));

  return (
    <div className="flex min-h-screen">
      <Sidebar organizations={organizations} activeSlug={activeSlug} />
      <div className="flex flex-1 flex-col">
        <AppNavbar />
        <main className="flex-1 bg-muted/20 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
