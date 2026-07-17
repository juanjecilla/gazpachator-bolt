import type { Recipe } from '../types/Recipe';
import { estimateServings } from './RecipeCalculator';

// Keep in sync with package.json's "name"/"version" — there's no
// resolveJsonModule wired up in tsconfig, so it's not imported directly.
export const EXPORT_APP_NAME = 'Gazpachator';
export const EXPORT_APP_VERSION = '1.0.0';

// A single scaled ingredient in the exported payload. `id` and `unit` are
// stable, language-independent keys (e.g. 'tomato', 'g') — never the
// translated display strings — so the JSON is safe to parse/consume
// regardless of which of the 4 languages the app was showing at export time.
export interface RecipeExportIngredient {
  id: string;
  amount: number;
  unit: string;
  proportion: number;
}

export interface RecipeExportPayload {
  app: {
    name: string;
    version: string;
  };
  generatedAt: string; // ISO 8601 timestamp
  volume: {
    liters: number;
    servings: number;
  };
  ingredients: RecipeExportIngredient[];
}

// Pure builder: turns the current (already-scaled) Recipe into the
// structured export payload. Takes `now` as a parameter (defaulting to the
// real clock) so tests can assert on a fixed timestamp.
export function buildRecipeExport(recipe: Recipe, now: Date = new Date()): RecipeExportPayload {
  return {
    app: {
      name: EXPORT_APP_NAME,
      version: EXPORT_APP_VERSION,
    },
    generatedAt: now.toISOString(),
    volume: {
      liters: recipe.totalVolume,
      servings: estimateServings(recipe.totalVolume),
    },
    ingredients: recipe.ingredients.map((ingredient) => ({
      id: ingredient.id,
      amount: ingredient.amount,
      unit: ingredient.unit,
      proportion: ingredient.proportion,
    })),
  };
}
