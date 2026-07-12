'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Settings, ShieldCheck, Users } from 'lucide-react';

import { cn } from '@/lib/utils';
import { OrganizationSwitcher } from '@/components/layout/organization-switcher';
import type { OrganizationSummary } from '@/types';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/settings/organization', label: 'Organization', icon: ShieldCheck },
  { href: '/settings/members', label: 'Members', icon: Users },
  { href: '/settings/profile', label: 'Profile', icon: Settings },
] as const;

interface SidebarProps {
  organizations: OrganizationSummary[];
  activeSlug: string;
}

export function Sidebar({ organizations, activeSlug }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-card/40 px-3 py-4 md:flex">
      <OrganizationSwitcher organizations={organizations} activeSlug={activeSlug} />
      <nav className="mt-6 flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
                isActive && 'bg-accent text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
