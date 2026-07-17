import { test, expect } from '@playwright/test';

// NOTE on the "manifest is served" check that used to live here (skipped):
// the Playwright suite runs against `vite dev`, and vite-plugin-pwa only emits
// the web manifest / service worker for a *built* app (devOptions.enabled is
// off). So a manifest-fetch assertion cannot pass against the dev server
// without changing the whole suite to run against `vite preview`. The
// higher-value, mockable coverage is the update prompt itself, exercised below
// via the component's testability seam (see PwaUpdatePrompt.tsx). The SW build
// wiring is already validated separately by `pnpm build`.

test.describe('PWA update prompt', () => {
  test('is hidden until an update is available, then Reload triggers the update action', async ({
    page,
  }) => {
    // Install an observable stand-in for the real reload/update-SW action
    // (which vite dev never wires up) before any page script runs.
    await page.addInitScript(() => {
      const w = window as Window & { __pwaReloadCalls?: number; __pwaReloadForTest?: () => void };
      w.__pwaReloadCalls = 0;
      w.__pwaReloadForTest = () => {
        w.__pwaReloadCalls = (w.__pwaReloadCalls ?? 0) + 1;
      };
    });

    await page.goto('/');

    const prompt = page.getByTestId('pwa-update-prompt');
    // No update pending on load — the prompt is not rendered.
    await expect(prompt).toHaveCount(0);

    // Simulate the service worker signalling a waiting update.
    await page.evaluate(() => window.dispatchEvent(new Event('pwa:need-refresh')));

    await expect(prompt).toBeVisible();
    await expect(prompt).toContainText('New version available');

    // Clicking Reload invokes the update action exactly once.
    await page.getByTestId('pwa-reload-button').click();
    const calls = await page.evaluate(
      () => (window as Window & { __pwaReloadCalls?: number }).__pwaReloadCalls
    );
    expect(calls).toBe(1);
  });

  test('dismissing the prompt hides it', async ({ page }) => {
    await page.goto('/');

    const prompt = page.getByTestId('pwa-update-prompt');
    await page.evaluate(() => window.dispatchEvent(new Event('pwa:need-refresh')));
    await expect(prompt).toBeVisible();

    await page.getByTestId('pwa-dismiss-button').click();
    await expect(prompt).toHaveCount(0);
  });
});
