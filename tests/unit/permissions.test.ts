import { describe, expect, it } from 'vitest';

import { assertPermission, can } from '@/lib/auth/permissions';
import { ForbiddenError } from '@/lib/auth/errors';

describe('can', () => {
  it('allows owners to delete the organization', () => {
    expect(can('owner', 'organization:delete')).toBe(true);
  });

  it('does not allow admins to delete the organization', () => {
    expect(can('admin', 'organization:delete')).toBe(false);
  });

  it('allows members to create projects', () => {
    expect(can('member', 'project:create')).toBe(true);
  });

  it('does not allow members to archive projects', () => {
    expect(can('member', 'project:archive')).toBe(false);
  });

  it('only allows owners to change member roles', () => {
    expect(can('owner', 'member:changeRole')).toBe(true);
    expect(can('admin', 'member:changeRole')).toBe(false);
    expect(can('member', 'member:changeRole')).toBe(false);
  });
});

describe('assertPermission', () => {
  it('does not throw when the role has permission', () => {
    expect(() => assertPermission('owner', 'billing:manage')).not.toThrow();
  });

  it('throws a ForbiddenError when the role lacks permission', () => {
    expect(() => assertPermission('member', 'billing:manage')).toThrow(ForbiddenError);
  });
});
