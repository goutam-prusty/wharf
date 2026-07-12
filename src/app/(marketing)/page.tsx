import { Features } from '@/components/marketing/features';
import { Hero } from '@/components/marketing/hero';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <section id="faq" className="container py-24">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-3xl font-bold tracking-tight">
            Frequently asked questions
          </h2>
          <div className="mt-10 space-y-6">
            <div>
              <h3 className="font-semibold">Is this ready for production?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Yes. Wharf ships with authentication, database migrations, role-based
                access control, error tracking, and a test suite already wired together —
                the parts that are tedious to get right, not just a demo UI.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Can I bring my own billing provider?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                The data model already separates organizations from billing concerns, so
                wiring in Stripe, Paddle, or another provider is additive rather than a
                rewrite.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">What database do I need?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Any standard PostgreSQL instance — local, Docker, Neon, Supabase, or RDS
                all work out of the box with the included Drizzle configuration.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
