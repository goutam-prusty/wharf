'use client';

import { useTransition } from 'react';
import { UserMinus } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { changeMemberRole, removeMember } from '@/actions/organization-actions';
import { initials } from '@/lib/utils';
import type { Membership, Role } from '@/lib/db/schema';

interface MembersTableProps {
  slug: string;
  members: Membership[];
  currentMembershipId: string;
  canManage: boolean;
}

const ROLES: Role[] = ['owner', 'admin', 'member'];

export function MembersTable({
  slug,
  members,
  currentMembershipId,
  canManage,
}: MembersTableProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  function handleRoleChange(membershipId: string, role: Role) {
    startTransition(async () => {
      const result = await changeMemberRole(slug, { membershipId, role });
      toast({
        title: result.success ? 'Role updated' : 'Could not update role',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
    });
  }

  function handleRemove(membershipId: string) {
    startTransition(async () => {
      const result = await removeMember(slug, membershipId);
      toast({
        title: result.success ? 'Member removed' : 'Could not remove member',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
    });
  }

  return (
    <ul className="divide-y rounded-md border">
      {members.map((member) => (
        <li key={member.id} className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{initials(member.userId.slice(-2))}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{member.userId}</p>
              <Badge variant="outline" className="mt-1 capitalize">
                {member.role}
              </Badge>
            </div>
          </div>
          {canManage && member.id !== currentMembershipId && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isPending}>
                  Manage
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {ROLES.map((role) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => handleRoleChange(member.id, role)}
                  >
                    Make {role}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => handleRemove(member.id)}
                >
                  <UserMinus className="mr-2 h-4 w-4" /> Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </li>
      ))}
    </ul>
  );
}
