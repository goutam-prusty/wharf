'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { ChevronsUpDown, Plus } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { initials } from '@/lib/utils';
import { setActiveOrganization } from '@/actions/organization-actions';
import type { OrganizationSummary } from '@/types';

interface OrganizationSwitcherProps {
  organizations: OrganizationSummary[];
  activeSlug: string;
}

export function OrganizationSwitcher({
  organizations,
  activeSlug,
}: OrganizationSwitcherProps) {
  const [, startTransition] = useTransition();
  const active = organizations.find((org) => org.slug === activeSlug) ?? organizations[0];

  if (!active) {
    return null;
  }

  function handleSelect(slug: string) {
    if (slug === activeSlug) return;
    startTransition(() => {
      void setActiveOrganization(slug);
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2 rounded-md border px-2 py-2 text-left text-sm hover:bg-accent">
        <Avatar className="h-7 w-7">
          <AvatarFallback>{initials(active.name)}</AvatarFallback>
        </Avatar>
        <span className="flex-1 truncate font-medium">{active.name}</span>
        <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Your organizations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.map((org) => (
          <DropdownMenuItem key={org.id} onClick={() => handleSelect(org.slug)}>
            <Avatar className="mr-2 h-6 w-6">
              <AvatarFallback>{initials(org.name)}</AvatarFallback>
            </Avatar>
            <span className="flex-1 truncate">{org.name}</span>
            <span className="text-xs capitalize text-muted-foreground">{org.role}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/onboarding" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> New organization
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
