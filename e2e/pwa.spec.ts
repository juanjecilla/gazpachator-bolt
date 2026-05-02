import { test, expect } from '@playwright/test';

test.describe('PWA', () => {
  test.skip('manifest is served', async ({ page }) => {
    // Activated in Phase 5
    await page.goto('/');
    const response = await page.request.get('/manifest.webmanifest');
    expect(response.status()).toBe(200);
  });
});
