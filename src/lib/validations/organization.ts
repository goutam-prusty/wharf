import { z } from 'zod';

export const updateOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters.')
    .max(80, 'Name must be at most 80 characters.'),
});

export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;

export const inviteMemberSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  role: z.enum(['admin', 'member'], {
    errorMap: () => ({ message: 'Choose a role.' }),
  }),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;

export const changeMemberRoleSchema = z.object({
  membershipId: z.string().uuid(),
  role: z.enum(['owner', 'admin', 'member']),
});
