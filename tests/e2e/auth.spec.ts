import { expect, test } from '@playwright/test';

test.describe('Auth pages', () => {
  test('sign-in page renders Clerk widget', async ({ page }) => {
    await page.goto('/sign-in');
    await expect(page.locator('form, [data-clerk-loaded]').first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test('sign-up page renders Clerk widget', async ({ page }) => {
    await page.goto('/sign-up');
    await expect(page.locator('form, [data-clerk-loaded]').first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test('protected settings routes redirect anonymous users', async ({ page }) => {
    await page.goto('/settings/profile');
    await expect(page).toHaveURL(/sign-in/);
  });
});
