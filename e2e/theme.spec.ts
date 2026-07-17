import { test, expect } from '@playwright/test';

test.describe('Theme toggle', () => {
  test('selecting dark then light toggles the html class and persists across reload', async ({
    page,
  }) => {
    await page.goto('/');
    const html = page.locator('html');

    // Switch to the dark theme — Tailwind's class-based dark mode adds `dark`.
    await page.getByTestId('theme-dark').click();
    await expect(html).toHaveClass(/dark/);
    await expect(page.getByTestId('theme-dark')).toHaveAttribute('aria-pressed', 'true');

    // Reload — the dark choice survives (persisted via StorageService).
    await page.reload();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(page.getByTestId('theme-dark')).toHaveAttribute('aria-pressed', 'true');

    // Switch back to light and confirm that choice also persists.
    await page.getByTestId('theme-light').click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);

    await page.reload();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    await expect(page.getByTestId('theme-light')).toHaveAttribute('aria-pressed', 'true');
  });
});
