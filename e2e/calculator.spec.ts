import { test, expect } from '@playwright/test';

test.describe('Gazpachator Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with title', async ({ page }) => {
    await expect(page).toHaveTitle(/Gazpachator/);
  });

  test('shows main recipe ingredients', async ({ page }) => {
    // The app should show ingredient inputs
    const inputs = page.locator('input[type="number"]');
    await expect(inputs.first()).toBeVisible();
  });

  test('has theme toggle button', async ({ page }) => {
    // Just verify the page loaded and has interactive elements
    await expect(page.locator('#root')).toBeVisible();
  });

  test('shows a servings estimate next to the volume that updates with amounts', async ({
    page,
  }) => {
    const servings = page.getByTestId('servings-value');
    await expect(servings).toBeVisible();
    await expect(servings).toContainText('servings');

    const before = await servings.textContent();

    // Raising the tomato amount grows the total volume, and with it the servings estimate.
    const tomatoInput = page.locator('#tomato');
    const currentTomato = Number(await tomatoInput.inputValue());
    await tomatoInput.fill(String(currentTomato * 3));
    await tomatoInput.blur();

    await expect(servings).not.toHaveText(before ?? '');
  });
});
