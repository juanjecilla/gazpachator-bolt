import type { TranslationKey } from '../data/translations';

// Core interfaces and types for the Gazpacho recipe calculator
export interface Ingredient {
  id: string;
  name: TranslationKey; // translation key for the ingredient's display name
  amount: number;
  unit: TranslationKey; // translation key for the unit (e.g. 'g')
  proportion: number; // Relative to tomato (base ingredient)
}

export interface Recipe {
  ingredients: Ingredient[];
  totalVolume: number; // in liters
}

export interface CustomProportions {
  cucumber: number; // in grams per kg of tomato
  greenPepper: number; // in grams per kg of tomato
  garlic: number; // in grams per kg of tomato
  oliveOil: number; // in grams per kg of tomato
  salt: number; // in grams per kg of tomato
  vinegar: number; // in grams per kg of tomato
}

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'es' | 'fr' | 'de';

export interface SavedRecipe {
  id: string;
  name: string;
  createdAt: string;
  tomatoAmount: number;
  isCustom: boolean;
  proportions: CustomProportions;
  notes?: string;
}

export type FavoriteId = string;

// A named snapshot of the ProportionEditor's custom proportions. The built-in
// default preset (`isBuiltIn`) is synthesized at runtime, never persisted, and
// cannot be deleted. User presets are persisted via StorageService.
export interface RatioPreset {
  id: string;
  name: string;
  proportions: CustomProportions;
  isBuiltIn: boolean;
}
