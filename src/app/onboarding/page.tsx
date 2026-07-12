import type { Metadata } from 'next';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { requireUserOrRedirect } from '@/lib/auth/current-user';
import { getOrganizationsForUser } from '@/lib/db/queries/organizations';
import { createOrganization } from '@/actions/onboarding-actions';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Create your organization',
};

export default async function OnboardingPage() {
  const userId = await requireUserOrRedirect();
  const existing = await getOrganizationsForUser(userId);

  if (existing.length > 0 && existing[0]) {
    redirect(`/dashboard?org=${existing[0].organization.slug}`);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create your organization</CardTitle>
        <CardDescription>
          Organizations are how Wharf groups your projects, teammates, and billing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={async (formData: FormData) => {
            'use server';
            await createOrganization(formData);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Organization name</Label>
            <Input id="name" name="name" placeholder="Acme Inc." required autoFocus />
          </div>
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
