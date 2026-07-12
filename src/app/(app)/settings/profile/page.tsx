import type { Metadata } from 'next';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ProfileForm } from '@/components/forms/profile-form';
import { requireUser } from '@/lib/auth/current-user';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function ProfileSettingsPage() {
  const user = await requireUser();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your profile</CardTitle>
        <CardDescription>
          This information is managed by Clerk and shown to your team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileForm
          defaultValues={{
            firstName: user.firstName ?? '',
            lastName: user.lastName ?? '',
          }}
        />
      </CardContent>
    </Card>
  );
}
