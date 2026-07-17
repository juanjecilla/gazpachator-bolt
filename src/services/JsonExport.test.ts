import { describe, it, expect } from 'vitest';
import { buildRecipeExport, EXPORT_APP_NAME, EXPORT_APP_VERSION } from './JsonExport';
import type { Recipe } from '../types/Recipe';

const recipe: Recipe = {
  ingredients: [
    { id: 'tomato', name: 'tomato', amount: 1000, unit: 'g', proportion: 1 },
    { id: 'cucumber', name: 'cucumber', amount: 333.33, unit: 'g', proportion: 0.33333 },
    { id: 'greenPepper', name: 'greenPepper', amount: 166.67, unit: 'g', proportion: 0.16667 },
    { id: 'garlic', name: 'garlic', amount: 12, unit: 'g', proportion: 0.012 },
    { id: 'oliveOil', name: 'oliveOil', amount: 15, unit: 'g', proportion: 0.015 },
    { id: 'salt', name: 'salt', amount: 6, unit: 'g', proportion: 0.006 },
    { id: 'vinegar', name: 'vinegar', amount: 18, unit: 'g', proportion: 0.018 },
  ],
  totalVolume: 1.47,
};

describe('buildRecipeExport', () => {
  it('produces the expected payload shape', () => {
    const now = new Date('2026-07-17T12:00:00.000Z');
    const payload = buildRecipeExport(recipe, now);

    expect(payload).toEqual({
      app: { name: EXPORT_APP_NAME, version: EXPORT_APP_VERSION },
      generatedAt: '2026-07-17T12:00:00.000Z',
      volume: { liters: 1.47, servings: 6 },
      ingredients: [
        { id: 'tomato', amount: 1000, unit: 'g', proportion: 1 },
        { id: 'cucumber', amount: 333.33, unit: 'g', proportion: 0.33333 },
        { id: 'greenPepper', amount: 166.67, unit: 'g', proportion: 0.16667 },
        { id: 'garlic', amount: 12, unit: 'g', proportion: 0.012 },
        { id: 'oliveOil', amount: 15, unit: 'g', proportion: 0.015 },
        { id: 'salt', amount: 6, unit: 'g', proportion: 0.006 },
        { id: 'vinegar', amount: 18, unit: 'g', proportion: 0.018 },
      ],
    });
  });

  it('uses the real clock when no timestamp is provided', () => {
    const before = Date.now();
    const payload = buildRecipeExport(recipe);
    const after = Date.now();

    const generatedAtMs = new Date(payload.generatedAt).getTime();
    expect(generatedAtMs).toBeGreaterThanOrEqual(before);
    expect(generatedAtMs).toBeLessThanOrEqual(after);
  });

  it('computes servings from the estimateServings rule of thumb', () => {
    const payload = buildRecipeExport({ ...recipe, totalVolume: 2 });
    expect(payload.volume.servings).toBe(8);
  });

  it('keeps ingredient ids and units as stable, language-independent keys', () => {
    // Same Ingredient data as it would be regardless of which of the 4
    // languages the UI happens to be showing — buildRecipeExport never calls
    // a translation function, so ids/units come through unchanged.
    const ids = buildRecipeExport(recipe).ingredients.map((i) => i.id);
    expect(ids).toEqual([
      'tomato',
      'cucumber',
      'greenPepper',
      'garlic',
      'oliveOil',
      'salt',
      'vinegar',
    ]);

    const units = buildRecipeExport(recipe).ingredients.map((i) => i.unit);
    expect(units.every((unit) => unit === 'g')).toBe(true);
  });

  it('produces identical ingredient ids across repeated calls (language-independence proxy)', () => {
    // buildRecipeExport takes no language/locale input at all, so calling it
    // any number of times with the same Recipe must yield the exact same ids
    // — there is no code path where a translation could leak in.
    const first = buildRecipeExport(recipe).ingredients.map((i) => i.id);
    const second = buildRecipeExport(recipe).ingredients.map((i) => i.id);
    expect(first).toEqual(second);
  });
});
