# Changelog

All notable changes to Gazpachator are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning: [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- **Structured JSON export** (ported from `GazpachoScaler`) — a new "Export JSON" button in `ExportShare` downloads `juanje-gazpacho-recipe.json`, a machine-readable snapshot of the current recipe: scaled per-ingredient amounts and proportions keyed by stable, language-independent ingredient ids (`tomato`, `cucumber`, …, never the translated display name), plus metadata (`app.name`/`app.version`, an ISO `generatedAt` timestamp, and `volume.liters`/`volume.servings`). Payload built by a new pure `buildRecipeExport` in `src/services/JsonExport.ts` (reuses `estimateServings`), downloaded via the same `Blob` + `URL.createObjectURL`/`revokeObjectURL` pattern already used for the `.txt` export. UI string added in all 4 languages. Unit tests cover the payload shape and confirm ingredient ids/units stay stable and language-independent; a component test stubs `document.createElement`/`URL.createObjectURL` to assert the click triggers a `.json` download and revokes the object URL; `e2e/json-export.spec.ts` scales the recipe, downloads the file, parses it, and asserts the scaled amounts and ids are present.
- **Print recipe** (ported from `GazpachoScaler`) — a "Print Recipe" button in `ExportShare` triggers `window.print()`; the printed sheet hides app chrome (background pattern, header's theme/language controls, all action buttons, the recipe-history/ratio-presets/Ko-fi panels, the Made It counter, the custom-proportions editor, and the footer) via Tailwind `print:hidden` utilities on each component's root, and shows the scaled ingredient amounts alongside the estimated volume and servings. A small `@media print` block in `index.css` flattens the layout to a single column and strips decorative shadows/blur/backgrounds for an ink-friendly result; ingredient `<input>`s are neutralized to plain text in print (no border/background, spinner arrows hidden). `useTheme` now drops the `dark` class for the duration of printing (`beforeprint`/`afterprint` listeners) so a dark-mode session still prints light/ink-friendly instead of a dark background with pale text — restores the resolved theme afterward, and covers the browser's native Ctrl+P / File > Print too, not just the in-app button. UI string added in all 4 languages. Unit tests cover the print-button handler and the theme print/restore cycle; `e2e/print.spec.ts` stubs `window.print` via an init script and asserts it's invoked on click. Verified visually via a headless print-media screenshot (light, dark-before-print, and the real `beforeprint`/`afterprint` cycle).
- **Servings estimate** (ported from `gazpachator-v0`) — `VolumeEstimator` now shows an approximate serving count (`≈ N servings`) next to the total volume, using the same `Math.ceil(totalVolumeLiters * 4)` rule of thumb as `gazpachator-v0`'s `stats-panel`. New pure `estimateServings` export in `RecipeCalculator.ts` with unit tests (including the fractional round-up edge case). UI strings added in all 4 languages; e2e coverage in `calculator.spec.ts` asserts the servings line renders and updates when ingredient amounts change.
- **Named ratio presets** (ported from `gazpachator-v0`) — save the current custom proportions under a chosen name, then list, load, and delete presets from a new collapsible `RatioPresetsPanel`. Loading a preset restores the `ProportionEditor` state (applies the proportions and switches to custom mode). A built-in "Juanje's Original" default preset is always present and cannot be deleted. Persisted via `StorageService` under the new `gazpacho-ratio-presets` key (JSON `RatioPreset[]`, default `"[]"`, validated with a shape guard that falls back to `[]` + `console.warn` on corrupt data). New `useRatioPresets` hook composes the synthesized built-in with the persisted user presets. UI strings added in all 4 languages. Unit tests for the store logic (`StorageService`, `useRatioPresets`) and an `e2e/ratio-presets.spec.ts` happy path (save → reload → load → restore → delete; default protected).
- `.github/dependabot.yml` — weekly automated dependency updates for the `npm` (pnpm-compatible) and `github-actions` ecosystems
- Bundle size budget in CI: `size-limit` (`@size-limit/file`) checks the raw size of `dist/assets/index-*.js` against a 200 KB limit (current build ~186.6 KB); run locally with `pnpm size`, enforced by a new `bundle-size` job in `.github/workflows/ci.yml`

### Changed

- Move strategy/proportion recalculation out of a `useEffect` and into the event handlers that change `isCustom`/`customProportions`, removing the last `react-hooks/set-state-in-effect` (and `exhaustive-deps`) eslint suppression in `App.tsx`
- Type translation keys: `t()` now accepts a `TranslationKey` union derived from the English table, so unknown keys fail `type-check`; `Ingredient.name`/`unit` are typed as translation keys

### Security

- Validate `localStorage` payloads in `StorageService.getSavedRecipes`/`getFavoriteIds` with hand-rolled shape guards; corrupt or wrong-shaped data now falls back to defaults with a `console.warn` instead of injecting bad shapes into state
- Add a strict `Content-Security-Policy` meta tag in `index.html` (static host, no server headers available): `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; manifest-src 'self'; worker-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`. `img-src` needed `data:` for the inline SVG background pattern in `App.tsx` (all other resources loaded self-only); verified the PWA service worker, Workbox precache/manifest, and canvas-based recipe image export still work under the policy. The Ko-fi button opens via `window.open` (a navigation, not a fetch/resource load) so it needs no CSP allowance.

### Fixed

- Allow manual runs of the GitHub Pages deploy workflow via `workflow_dispatch` (Pages was not enabled when earlier deploys ran, and push-only triggers left no way to retry)

## [1.0.0] — 2026-05-02

### Added

- **Recipe Calculator** — scale all 7 Gazpacho ingredients relative to tomato weight using Strategy pattern
- **Custom Proportions Editor** — modal UI to override per-ingredient ratios
- **Recipe History & Favorites** — save/load/star custom recipe variants in localStorage
- **Volume Estimator** — density-based total volume calculation in liters
- **Export & Share** — copy text, download `.txt`, canvas-rendered recipe image, Web Share API
- **4 Languages** — English, Español, Français, Deutsch with browser auto-detection
- **Theme Switcher** — light / dark / system preference with class-based Tailwind dark mode
- **Made It Counter** — per-browser count with localStorage persistence
- **PWA** — installable via `vite-plugin-pwa`, full offline support via Workbox service worker
- **SEO** — meta description, Open Graph, Twitter Card, canonical link, robots.txt, sitemap.xml
- **Accessibility** — ARIA dialog, aria-pressed, aria-label, role=group, lang attribute sync
- **CI/CD** — GitHub Actions: quality gate (lint + type-check + format + tests) on PR, auto-deploy to GitHub Pages on merge to main
- **Testing** — Vitest unit tests (25), Playwright E2E smoke tests, v8 coverage with thresholds
- **Ko-fi** donation button

### Infrastructure

- Vite 5 + React 18 + TypeScript 5.5 + Tailwind CSS 3.4
- Prettier with `prettier-plugin-tailwindcss` (class sorting)
- ESLint with strict TypeScript rules
- `@/` path alias
- Git worktree workflow enforced via CLAUDE.md
- `StorageService` singleton as sole localStorage interface
- Architecture Decision Records in `docs/adr/`

[Unreleased]: https://github.com/juanjecilla/gazpachator-bolt/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/juanjecilla/gazpachator-bolt/releases/tag/v1.0.0
