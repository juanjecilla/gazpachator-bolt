import { test, expect } from '@playwright/test';

test.describe('Ratio Presets', () => {
  test('save, persist, load, and delete a named preset; default is present and protected', async ({
    page,
  }) => {
    await page.goto('/');

    const dialogCucumber = () => page.getByRole('dialog').locator('input[type="number"]').first();
    const openPresetsPanel = () => page.getByRole('button', { name: /Ratio Presets/ }).click();

    // Adjust the custom proportions through the ProportionEditor.
    await page.getByRole('button', { name: 'Edit Recipe' }).click();
    await dialogCucumber().fill('500');
    await page.getByRole('button', { name: 'Save & Apply' }).click();

    // Open the Ratio Presets panel: the built-in default is present and cannot be deleted.
    await openPresetsPanel();
    await expect(page.getByText("Juanje's Original")).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete preset' })).toHaveCount(0);

    // Save the current proportions as a named preset "My Blend".
    await page.getByRole('button', { name: 'Save Preset' }).click();
    await page.getByPlaceholder('Preset name').fill('My Blend');
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page.getByText('My Blend')).toBeVisible();

    // Reload — the preset must survive (persisted via StorageService).
    await page.reload();
    await openPresetsPanel();
    await expect(page.getByText('My Blend')).toBeVisible();

    // After reload the live proportions reset to the default (not 500).
    await page.getByRole('button', { name: 'Edit Recipe' }).click();
    await expect(dialogCucumber()).not.toHaveValue('500');
    await page.getByRole('button', { name: 'Close' }).click();

    // Load "My Blend" (2nd load button; the built-in is first) — values restored.
    await page.getByRole('button', { name: 'Load preset' }).nth(1).click();
    await page.getByRole('button', { name: 'Edit Recipe' }).click();
    await expect(dialogCucumber()).toHaveValue('500');
    await page.getByRole('button', { name: 'Close' }).click();

    // Delete "My Blend" (confirm on the second click) — it is gone.
    await page.getByRole('button', { name: 'Delete preset' }).click();
    await page.getByRole('button', { name: 'Delete preset' }).click();
    await expect(page.getByText('My Blend')).toHaveCount(0);

    // The built-in default remains and is still protected.
    await expect(page.getByText("Juanje's Original")).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete preset' })).toHaveCount(0);
  });
});
