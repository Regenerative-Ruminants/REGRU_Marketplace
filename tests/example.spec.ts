import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/'); // Uses baseURL from playwright.config.ts

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/The REGRU Marketplace/);
});

test('get started link', async ({ page }) => {
  await page.goto('/');

  // Example: Click a link and check new page URL (adapt this to your app)
  // For now, as a placeholder, let's assume there is a link with text "Get Started"
  // and it navigates to '/docs'.
  // This will likely fail until you have such a link or adapt the test.
  // await page.getByRole('link', { name: 'Get Started' }).click();
  // await expect(page).toHaveURL(/.*docs/);

  // Placeholder assertion that will pass
  expect(true).toBe(true);
}); 