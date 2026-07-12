export const APP_NAME = 'Wharf';
export const APP_DESCRIPTION =
  'The multi-tenant SaaS starter for teams that want to ship, not scaffold.';

export const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$0',
    cadence: 'forever',
    description: 'For solo builders validating an idea.',
    features: ['1 organization', 'Up to 3 members', 'Community support'],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$29',
    cadence: 'per month',
    description: 'For small teams shipping to real customers.',
    features: [
      'Unlimited organizations',
      'Up to 25 members',
      'Priority support',
      'Audit log',
    ],
    highlighted: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    price: 'Custom',
    cadence: 'billed annually',
    description: 'For companies with compliance and scale needs.',
    features: [
      'SSO / SAML',
      'Unlimited members',
      'Dedicated support engineer',
      'Custom data retention',
    ],
  },
] as const;

export const NAV_LINKS = [
  { href: '/#features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
] as const;
