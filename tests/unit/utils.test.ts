import { describe, expect, it } from 'vitest';

import { formatDate, initials, slugify } from '@/lib/utils';

describe('slugify', () => {
  it('lowercases and hyphenates a name', () => {
    expect(slugify('Acme Harbor Inc.')).toBe('acme-harbor-inc');
  });

  it('trims stray leading and trailing hyphens', () => {
    expect(slugify('  --Wharf App--  ')).toBe('wharf-app');
  });

  it('collapses repeated separators', () => {
    expect(slugify('Foo   Bar!!Baz')).toBe('foo-bar-baz');
  });
});

describe('initials', () => {
  it('returns the first letter of up to two words', () => {
    expect(initials('Ada Lovelace')).toBe('AL');
  });

  it('handles a single word', () => {
    expect(initials('Wharf')).toBe('W');
  });

  it('ignores extra whitespace between words', () => {
    expect(initials('  Grace   Hopper  ')).toBe('GH');
  });
});

describe('formatDate', () => {
  it('formats an ISO string into a readable date', () => {
    expect(formatDate('2026-01-15T00:00:00.000Z')).toMatch(/Jan 1[45], 2026/);
  });

  it('accepts a Date instance directly', () => {
    const date = new Date(Date.UTC(2025, 11, 25));
    expect(formatDate(date)).toContain('2025');
  });
});
