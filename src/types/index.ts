import type { Organization, Project, Role } from '@/lib/db/schema';

export interface OrganizationSummary extends Organization {
  role: Role;
}

export interface ActionResult<T = undefined> {
  success: boolean;
  message?: string;
  data?: T;
}

export type ProjectListItem = Pick<
  Project,
  'id' | 'name' | 'description' | 'status' | 'createdAt'
>;
