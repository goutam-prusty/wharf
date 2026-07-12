import Link from 'next/link';

import { Logo } from '@/components/layout/logo';
import { APP_DESCRIPTION } from '@/lib/constants';

export function MarketingFooter() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col gap-8 py-12 md:flex-row md:justify-between">
        <div className="max-w-sm space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground">{APP_DESCRIPTION}</p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm font-semibold">Product</p>
            <Link
              href="/#features"
              className="block text-sm text-muted-foreground hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="block text-sm text-muted-foreground hover:text-foreground"
            >
              Pricing
            </Link>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold">Company</p>
            <Link
              href="/#faq"
              className="block text-sm text-muted-foreground hover:text-foreground"
            >
              FAQ
            </Link>
            <a
              href="https://github.com"
              className="block text-sm text-muted-foreground hover:text-foreground"
            >
              GitHub
            </a>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold">Legal</p>
            <span className="block text-sm text-muted-foreground">Privacy</span>
            <span className="block text-sm text-muted-foreground">Terms</span>
          </div>
        </div>
      </div>
      <div className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Wharf, Inc. All rights reserved.
      </div>
    </footer>
  );
}
