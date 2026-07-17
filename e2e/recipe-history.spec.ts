import { test, expect } from '@playwright/test';

test.describe('Recipe history', () => {
  test('save a recipe, favorite it, and delete it — all persisting across reload', async ({
    page,
  }) => {
    await page.goto('/');

    const openPanel = () => page.getByTestId('history-toggle').click();
    const item = page.getByTestId('history-recipe-item');

    // Save the current recipe under a name.
    await openPanel();
    await page.getByTestId('history-open-save-form').click();
    await page.getByTestId('history-name-input').fill('Batch One');
    await page.getByTestId('history-save-button').click();

    // It appears in the panel.
    await expect(item).toHaveCount(1);
    await expect(item).toContainText('Batch One');
    // Not yet favorited — no Favorites group heading.
    await expect(page.getByText('Favorites', { exact: true })).toHaveCount(0);

    // Favorite it — the recipe moves under the Favorites group.
    await page.getByTestId('history-favorite-button').click();
    await expect(page.getByText('Favorites', { exact: true })).toBeVisible();

    // Reload — both the saved recipe and its favorite state survive.
    await page.reload();
    await openPanel();
    await expect(page.getByTestId('history-recipe-item')).toHaveCount(1);
    await expect(page.getByTestId('history-recipe-item')).toContainText('Batch One');
    await expect(page.getByText('Favorites', { exact: true })).toBeVisible();

    // Delete it — the delete button confirms on the second click.
    await page.getByTestId('history-delete-button').click();
    await page.getByTestId('history-delete-button').click();
    await expect(page.getByTestId('history-recipe-item')).toHaveCount(0);

    // Reload — the deletion persisted; nothing comes back.
    await page.reload();
    await openPanel();
    await expect(page.getByTestId('history-recipe-item')).toHaveCount(0);
    await expect(page.getByText(/No saved recipes yet/)).toBeVisible();
  });
});
