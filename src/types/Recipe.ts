// Core interfaces and types for the Gazpacho recipe calculator
export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
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

export interface Translation {
  [key: string]: string;
}

export interface LanguageData {
  [key: string]: Translation;
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
