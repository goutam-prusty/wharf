import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required.').max(50),
  lastName: z.string().min(1, 'Last name is required.').max(50),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
