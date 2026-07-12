import type { Metadata } from 'next';

import { PricingTable } from '@/components/marketing/pricing-table';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing that scales with your team.',
};

export default function PricingPage() {
  return (
    <section className="container py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Pricing that scales with you
        </h1>
        <p className="mt-4 text-muted-foreground">
          Start for free. Upgrade when your team and your customers need more.
        </p>
      </div>
      <div className="mt-16">
        <PricingTable />
      </div>
    </section>
  );
}
