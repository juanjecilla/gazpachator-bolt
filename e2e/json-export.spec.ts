import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';

test.describe('JSON Export', () => {
  test('clicking the JSON export button downloads a file with the scaled recipe', async ({
    page,
  }) => {
    await page.goto('/');

    // Change the tomato amount so we can assert the exported amounts reflect
    // the scaled recipe, not just whatever the default happened to be.
    const tomatoInput = page.locator('#tomato');
    await tomatoInput.fill('2000');
    await tomatoInput.blur();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByTestId('export-json-button').click(),
    ]);

    expect(download.suggestedFilename()).toBe('juanje-gazpacho-recipe.json');

    const path = await download.path();
    expect(path).not.toBeNull();
    const content = readFileSync(path as string, 'utf-8');
    const payload = JSON.parse(content);

    expect(payload.app).toEqual({ name: 'Gazpachator', version: expect.any(String) });
    expect(typeof payload.generatedAt).toBe('string');
    expect(payload.volume.liters).toBeGreaterThan(0);
    expect(payload.volume.servings).toBeGreaterThan(0);

    expect(Array.isArray(payload.ingredients)).toBe(true);
    const tomato = payload.ingredients.find((i: { id: string }) => i.id === 'tomato');
    expect(tomato).toBeTruthy();
    expect(tomato.amount).toBe(2000);
    expect(typeof tomato.unit).toBe('string');
    expect(typeof tomato.proportion).toBe('number');

    // Scaled ingredients present and language-independent (raw ids, not
    // translated display names like "Tomate"/"Tomato").
    const ids = payload.ingredients.map((i: { id: string }) => i.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        'tomato',
        'cucumber',
        'greenPepper',
        'garlic',
        'oliveOil',
        'salt',
        'vinegar',
      ])
    );
  });
});
