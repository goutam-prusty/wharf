import Link from 'next/link';
import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { PLANS } from '@/lib/constants';

export function PricingTable() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {PLANS.map((plan) => (
        <Card
          key={plan.id}
          className={cn(
            'flex flex-col',
            'highlighted' in plan && plan.highlighted && 'border-harbor-600 shadow-lg',
          )}
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {plan.name}
              {'highlighted' in plan && plan.highlighted && (
                <span className="rounded-full bg-harbor-600 px-2 py-0.5 text-xs font-medium text-white">
                  Popular
                </span>
              )}
            </CardTitle>
            <CardDescription>{plan.description}</CardDescription>
            <div className="pt-4">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="ml-1 text-sm text-muted-foreground">{plan.cadence}</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-harbor-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              asChild
              className="w-full"
              variant={'highlighted' in plan && plan.highlighted ? 'default' : 'outline'}
            >
              <Link href="/sign-up">Get started</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
