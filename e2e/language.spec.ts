import { test, expect } from '@playwright/test';

test.describe('Language switch', () => {
  test('switching language updates the UI text and persists across reload', async ({ page }) => {
    await page.goto('/');

    const heading = page.getByRole('heading', { level: 1 });
    // Default (browser locale under Playwright is English).
    await expect(heading).toHaveText("Juanje's Gazpacho Recipe");

    // Switch to Spanish — the UI re-renders with translated strings.
    await page.getByTestId('language-select').selectOption('es');
    await expect(heading).toHaveText('Receta de Gazpacho de Juanje');
    // html[lang] is kept in sync with the selection.
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');

    // Reload — the language choice survives (persisted via StorageService).
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Receta de Gazpacho de Juanje'
    );
    await expect(page.getByTestId('language-select')).toHaveValue('es');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });
});
