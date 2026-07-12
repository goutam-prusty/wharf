import { expect, test } from '@playwright/test';

test.describe('Marketing site', () => {
  test('renders the hero and primary call to action', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /SaaS foundation/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /start building/i })).toBeVisible();
  });

  test('navigates to the pricing page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Pricing', exact: true }).click();

    await expect(page).toHaveURL(/\/pricing/);
    await expect(
      page.getByRole('heading', { name: /pricing that scales/i }),
    ).toBeVisible();
  });

  test('unauthenticated users are redirected away from the dashboard', async ({
    page,
  }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/sign-in/);
  });
});
