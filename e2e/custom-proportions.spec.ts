import { test, expect } from '@playwright/test';

test.describe('Custom proportions flow', () => {
  test('toggle custom mode, edit a proportion so amounts recalc, then reset', async ({ page }) => {
    await page.goto('/');

    const cucumber = page.locator('#cucumber');
    // Default proportion: 333.33 g cucumber per 1000 g tomato → shown rounded.
    await expect(cucumber).toHaveValue('333');

    // Enter custom mode via the toggle.
    await page.getByTestId('use-custom-toggle').check();
    await expect(page.getByTestId('use-custom-toggle')).toBeChecked();

    // Adjust the cucumber proportion in the ProportionEditor dialog to 500 g/kg.
    await page.getByTestId('edit-recipe-button').click();
    await page.getByTestId('proportion-input-cucumber').fill('500');
    await page.getByTestId('save-proportions-button').click();

    // The main recipe recalculates: 1000 g tomato × 500/1000 = 500 g cucumber.
    await expect(cucumber).toHaveValue('500');

    // Reset returns the proportions (and amounts) to the default.
    await page.getByTestId('reset-proportions-button').click();
    await expect(cucumber).toHaveValue('333');
  });
});
