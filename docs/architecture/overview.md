# Architecture Overview

## Component Hierarchy

```
App
├── ThemeLanguageSelector   — theme/language switcher (header)
├── IngredientInput ×7      — per-ingredient number input with keyboard shortcuts
├── ProportionEditor        — modal dialog for custom proportions
├── VolumeEstimator         — density-based volume display
├── RecipeHistoryPanel      — collapsible save/load/favorite panel
├── ExportShare             — copy text / download .txt / canvas image / Web Share
├── MadeItCounter           — localStorage-backed "I've made this" toggle
├── KofiButton              — donation link
└── PwaUpdatePrompt         — service worker update notification banner
```

## Service Layer

### RecipeCalculatorService (`src/services/RecipeCalculator.ts`)

Strategy pattern — swappable calculation algorithms:

```
RecipeCalculatorService
├── strategy: ICalculationStrategy
│   ├── DefaultCalculationStrategy  — Juanje's fixed ratios
│   └── CustomCalculationStrategy   — user-defined ratios from CustomProportions
├── calculateRecipe(tomatoAmount, customProportions?) → Recipe
├── updateIngredientAmount(ingredients, id, newAmount, props?) → Ingredient[]
└── estimateVolume(ingredients) → liters  [private, uses density table]
```

Default proportions per 1000g tomato:

| Ingredient | Amount |
|-----------|--------|
| Cucumber | 333.33g |
| Green Pepper | 166.67g |
| Garlic | 12g |
| Olive Oil | 15g |
| Salt | 6g |
| Vinegar | 18g |

### StorageService (`src/services/StorageService.ts`)

Singleton — sole interface to `localStorage`. No component touches `localStorage` directly.

Methods: `getMadeCount`, `incrementMadeCount`, `getUserMadeIt`, `setUserMadeIt`, `getTheme`, `setTheme`, `getLanguage`, `setLanguage`, `getSavedRecipes`, `saveRecipe`, `updateRecipe`, `deleteRecipe`, `getFavoriteIds`, `toggleFavorite`

## Hooks

| Hook | Responsibility |
|------|---------------|
| `useTheme` | Theme state, `<html>` class toggling, system preference detection |
| `useLanguage` | Language state, browser detection, `t(key)` translation function |
| `useRecipeHistory` | Saved recipes + favorites state, wraps StorageService CRUD |

## Data Flow

```
User changes ingredient amount
  → IngredientInput.onChange(id, newAmount)
    → App.handleIngredientChange(id, newAmount)
      → calculator.updateIngredientAmount(...)
        → strategy.calculate(newTomatoBase, props)
      → setRecipe(newRecipe) → re-render
```

```
User loads saved recipe
  → RecipeHistoryPanel.onLoad(savedRecipe)
    → App.handleLoadRecipe(savedRecipe)
      → setIsCustom, setCustomProportions
      → calculator.setStrategy(new Strategy)
      → calculator.calculateRecipe(tomatoAmount, props)
      → setRecipe(newRecipe)
```

## localStorage Schema

| Key | Type | Default | Added |
|-----|------|---------|-------|
| `gazpacho-made-count` | number (string) | `"0"` | v1.0 |
| `gazpacho-theme` | `light\|dark\|system` | null | v1.0 |
| `gazpacho-language` | `en\|es\|fr\|de` | null | v1.0 |
| `user-made-it` | `"true"` | null | v1.0 |
| `gazpacho-saved-recipes` | JSON `SavedRecipe[]` | `"[]"` | v1.0 |
| `gazpacho-favorite-ids` | JSON `string[]` | `"[]"` | v1.0 |
| `gazpacho-storage-version` | number (string) | `"1"` | v1.0 |
