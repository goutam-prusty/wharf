import type { Role } from '@/lib/db/schema';
import { ForbiddenError } from './errors';

export type { Role };

/**
 * A small, explicit permission matrix rather than scattered `role === 'x'`
 * checks throughout the codebase. Adding a new permission means adding one
 * line here and one call site — not hunting down every place a role was
 * compared inline.
 */
const PERMISSIONS = {
  'project:create': ['owner', 'admin', 'member'],
  'project:archive': ['owner', 'admin'],
  'project:delete': ['owner', 'admin'],
  'member:invite': ['owner', 'admin'],
  'member:remove': ['owner', 'admin'],
  'member:changeRole': ['owner'],
  'organization:update': ['owner', 'admin'],
  'organization:delete': ['owner'],
  'billing:manage': ['owner'],
} as const satisfies Record<string, readonly Role[]>;

export type Permission = keyof typeof PERMISSIONS;

export function can(role: Role, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly Role[]).includes(role);
}

export function assertPermission(role: Role, permission: Permission): void {
  if (!can(role, permission)) {
    throw new ForbiddenError(`Your role (${role}) does not permit "${permission}".`);
  }
}
