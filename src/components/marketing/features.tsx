import { KeyRound, Layers, Lock, Users, Webhook, Zap } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const FEATURES = [
  {
    icon: KeyRound,
    title: 'Auth that just works',
    description:
      'Clerk-backed sign-in, sign-up, and session management with zero boilerplate.',
  },
  {
    icon: Layers,
    title: 'True multi-tenancy',
    description:
      'Every resource is scoped to an organization from the schema up, not bolted on later.',
  },
  {
    icon: Lock,
    title: 'Role-based access control',
    description:
      'A single permission matrix governs owners, admins, and members across the app.',
  },
  {
    icon: Users,
    title: 'Team management',
    description:
      'Invite teammates, assign roles, and manage membership from a dedicated settings area.',
  },
  {
    icon: Webhook,
    title: 'Webhook-ready',
    description:
      'A verified Clerk webhook handler keeps your database in sync with auth events.',
  },
  {
    icon: Zap,
    title: 'Production tooling',
    description:
      'Sentry, typed environment variables, Vitest, and Playwright are wired in from the start.',
  },
] as const;

export function Features() {
  return (
    <section id="features" className="container py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Everything a real SaaS product needs
        </h2>
        <p className="mt-4 text-muted-foreground">
          Skip the weeks of setup. Wharf ships with the architecture decisions already
          made — and documented.
        </p>
      </div>
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <feature.icon className="h-6 w-6 text-harbor-600" />
              <CardTitle className="mt-2">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </div>
    </section>
  );
}
