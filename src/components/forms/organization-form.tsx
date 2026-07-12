'use client';

import { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updateOrganizationName } from '@/actions/organization-actions';

interface OrganizationFormProps {
  slug: string;
  currentName: string;
  disabled: boolean;
}

export function OrganizationForm({ slug, currentName, disabled }: OrganizationFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateOrganizationName(slug, formData);
      toast({
        title: result.success ? 'Organization updated' : 'Update failed',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
    });
  }

  return (
    <form action={handleSubmit} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Organization name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={currentName}
          disabled={disabled}
          required
        />
        {disabled && (
          <p className="text-xs text-muted-foreground">
            Only owners and admins can rename the organization.
          </p>
        )}
      </div>
      <Button type="submit" disabled={disabled || isPending}>
        {isPending ? 'Saving...' : 'Save changes'}
      </Button>
    </form>
  );
}
