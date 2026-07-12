import Link from 'next/link';

const TABS = [
  { href: '/settings/profile', label: 'Profile' },
  { href: '/settings/organization', label: 'Organization' },
  { href: '/settings/members', label: 'Members' },
] as const;

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile, organization, and team.
        </p>
      </div>
      <div className="flex gap-4 border-b">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className="border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-muted-foreground hover:border-foreground/30 hover:text-foreground"
          >
            {tab.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
