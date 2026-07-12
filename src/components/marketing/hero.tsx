import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="container flex flex-col items-center gap-6 py-24 text-center">
      <div className="rounded-full border bg-muted px-4 py-1 text-sm text-muted-foreground">
        Now with organization-scoped role-based access control
      </div>
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
        The SaaS foundation, without the scaffolding tax.
      </h1>
      <p className="max-w-xl text-lg text-muted-foreground">
        Wharf gives you authentication, multi-tenant organizations, role-based
        permissions, and a billing-ready data model on day one — so your team can spend
        its time on the product, not the plumbing.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" asChild>
          <Link href="/sign-up">
            Start building <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/pricing">View pricing</Link>
        </Button>
      </div>
    </section>
  );
}
