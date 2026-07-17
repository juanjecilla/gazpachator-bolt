import { test, expect } from '@playwright/test';

test.describe('Print Recipe', () => {
  test('clicking the print button opens the print dialog', async ({ page }) => {
    // Real browsers block window.print() in automated contexts (and it would
    // hang the test waiting on a native dialog), so stub it before any page
    // script runs and record whether it was invoked.
    await page.addInitScript(() => {
      (window as unknown as { __printCalled: boolean }).__printCalled = false;
      window.print = () => {
        (window as unknown as { __printCalled: boolean }).__printCalled = true;
      };
    });

    await page.goto('/');

    await page.getByTestId('print-recipe-button').click();

    const printCalled = await page.evaluate(
      () => (window as unknown as { __printCalled: boolean }).__printCalled
    );
    expect(printCalled).toBe(true);
  });
});
