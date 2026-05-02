# Architecture Overview

> Full content added in Phase 7 (docs/overhaul). Stub.

## Component Hierarchy

- `App` — orchestrates all state, layout
  - `ThemeLanguageSelector` — theme/language switcher
  - `IngredientInput` — per-ingredient input row
  - `ProportionEditor` — modal for custom proportions
  - `VolumeEstimator` — density-based volume display
  - `ExportShare` — export/share actions
  - `MadeItCounter` — global made-it counter
  - `KofiButton` — donation link

## Service Layer

- `RecipeCalculatorService` — Strategy pattern (Default vs Custom strategies)
- `StorageService` — Singleton, sole access to `localStorage`

## Hooks

- `useTheme` — theme state + `<html>` class toggling
- `useLanguage` — language state + translation function `t(key)`
