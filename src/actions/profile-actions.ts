'use server';

import { revalidatePath } from 'next/cache';
import { clerkClient } from '@clerk/nextjs/server';

import { requireUser } from '@/lib/auth/current-user';
import { logger } from '@/lib/logger';
import { updateProfileSchema } from '@/lib/validations/profile';
import type { ActionResult } from '@/types';

export async function updateProfile(formData: FormData): Promise<ActionResult> {
  const parsed = updateProfileSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message };
  }

  try {
    const user = await requireUser();
    const client = await clerkClient();

    await client.users.updateUser(user.id, {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
    });

    revalidatePath('/settings/profile');
    return { success: true, message: 'Profile updated.' };
  } catch (error) {
    logger.exception(error, { action: 'updateProfile' });
    const message = error instanceof Error ? error.message : 'Update failed.';
    return { success: false, message };
  }
}
