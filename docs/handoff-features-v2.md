# Handoff: features v2 backlog — gazpachator-bolt

Goal: second feature round after the 2026-07-18 parity pass — shared new features (F1–F4, same IDs in every sibling repo), i18n/a11y completion, and test gap-fill. **Static-ok only** (GitHub Pages, no backend). Keep this repo's design language — port behavior, never visuals. Cross-repo context: `docs/ALIGNMENT.md` (committed here) and each sibling's `docs/handoff-features-v2.md`.

Suggested execution order: **B → C1–C2 → A (F1→F4) → remaining C**. Hygiene and i18n first so new features land fully translated on a clean base. One worktree + PR per numbered item.

## Constraints

- Follow CLAUDE.md: worktree + PR flow (`../gazpachator-<slug>`), Conventional Commits, all storage via `StorageService` (update the localStorage key registry for any new key; bump storage version if schema demands), all 4 languages (`en`, `es`, `fr`, `de`) updated together with typed keys, unit tests before PR, e2e for UI changes, coverage 80/75/80/80, `CHANGELOG.md` under `[Unreleased]`.
- CSP meta in `index.html` is strict `'self'`-only — new features must not require external hosts or inline script.
- `size-limit` budget: 200 KB raw on `dist/assets/index-*.js` (CI gate). No new runtime deps without checking the budget.
- No visual redesign; reuse `src/components/` patterns and the strategy pattern in `src/services/RecipeCalculator.ts`.

## A. Shared features (parity targets — IDs F1–F4 match the sibling repos' features-v2 docs)

### F1. Recipe JSON import — `static-ok`

Source: this repo already exports JSON (`src/services/JsonExport.ts`, `src/components/ExportShare.tsx`); import is the missing half. Validation guards live in `src/services/StorageService.ts` (`isSavedRecipe` etc. — same hand-rolled-guard style).
Behavior: "Import recipe" file input (`accept="application/json"`) in the export/share area → parse → validate against the shared schema below → load amounts (and custom proportions if present) into the calculator. Invalid file → translated inline error, no state change.

Shared JSON schema (identical in all three repos — an export from any sibling must import here):

```json
{
  "app": "gazpachator",
  "version": 1,
  "amounts": { "<ingredientId>": 1000 },
  "proportions": { "<ingredientId>": 25 }
}
```

- `amounts` values are grams (finite numbers > 0); `proportions` values are percent-of-tomato and the field is optional/nullable.
- Canonical ingredient ids: `tomato`, `cucumber`, `greenPepper`, `garlic`, `oliveOil`, `salt`, `vinegar`. (GazpachoScaler uses `jerezVinegar` internally and maps it to/from `vinegar` at its codec boundary — exports must always contain canonical ids.)
- Unknown `app`/`version` or unknown ids → reject gracefully. No free-text fields are required for import.

Tests: unit round-trip (export → import restores identical state) + malformed-input table; e2e export-then-import flow.

### F2. Serving-size selector — `static-ok`

Source: inverse of the existing estimate in `src/components/VolumeEstimator.tsx` / `estimateServings` in `src/services/RecipeCalculator.ts` (`Math.ceil(liters * 4)` ⇒ 250 ml per serving).
Behavior: numeric input "servings" (integer, min 1) → target volume = N × 0.25 L → derive the tomato base from the volume model → run the normal proportional recalculation. Pin **250 ml/serving as a named exported constant** in `RecipeCalculator.ts` and use it in both directions (estimate and selector) so the round trip is stable; note that `Math.ceil` display rounding means selector → estimate may display N but never N−1. All labels in 4 languages.
Tests: unit for the inverse function (round-trip property: setServings(n) ⇒ estimateServings ≥ n) ; e2e set-servings → all ingredient amounts change proportionally.

### F3. Recipe image (PNG) export — i18n fix only — `static-ok`

This repo is the source of truth (canvas rendering in `src/components/ExportShare.tsx`, drawing starts ~L116). The port work happens in v0 and Scaler. Here, only fix the hardcoded strings on the canvas and buttons — covered by B1 below; no functional change.

### F4. Shareable recipe URLs (`?r=`) — `static-ok`

Origin: GazpachoScaler roadmap (`docs/features.md`); new to all three repos.
Encoding spec (identical in all three repos):

- URL param `r` = base64url of `JSON.stringify({ "v": 1, "a": { "<ingredientId>": grams }, "p": { "<ingredientId>": percent } | null })`.
- Numbers and canonical ingredient ids only (same id list and Scaler mapping rule as F1) — **no free text** (no preset/recipe names), so there is no XSS surface. Typical length 60–120 chars.

Behavior:

- On app load, if `?r=` is present and decodes + validates → load that recipe, **winning over persisted localStorage state**, then `history.replaceState` to strip the param (avoid re-applying on reload).
- Build share URLs from `location.origin + location.pathname` — never hardcode the GitHub Pages base path (`/gazpachator-bolt/`).
- Add "Copy link" to `ExportShare.tsx`; Web Share shares the encoded URL.
- Validate every decoded number (finite, > 0) and every id; unknown `v` or any invalid field → ignore the param entirely and fall back to normal startup.

Tests: unit codec round-trip + malformed-input table (truncated base64, wrong types, unknown ids, negative numbers); e2e open URL with `?r=` → exact amounts rendered → param stripped.

## B. Repo-specific quick wins & hygiene

### B1. i18n completion — `static-ok`

Hardcoded English strings bypassing `t()` (violates the CLAUDE.md all-strings-keyed rule). Add typed keys × 4 languages for:

- `src/App.tsx` — "Actions" heading (~L233); footer "Traditional Spanish Gazpacho Recipe Calculator" / "Preserving culinary heritage through technology" (~L249–250).
- `src/components/ExportShare.tsx` — "Share Image" (~L230), "Copy"/"Copied!" (~L268), canvas-drawn "Traditional Spanish Recipe" (~L116).
- `src/components/PwaUpdatePrompt.tsx` — "New version available", "Reload", `aria-label="Dismiss update notification"`.

### B2. Dedupe default-proportions constant — `static-ok`

`src/App.tsx` duplicates the default proportions object literally (initial state ~L41–48 and `handleResetProportions` ~L121–128). Extract a single exported constant (natural home: `src/services/RecipeCalculator.ts`) and use it in both places.

## C. Test gap-fill

### C1. e2e: export & share paths — `static-ok`

Only JSON export has e2e coverage. Add specs for: copy-recipe-text, `.txt` download, "Share Image"/PNG download (Playwright `download` event), and Web Share (mock `navigator.share`).

### C2. e2e: Made It counter + history depth — `static-ok`

- Made It: increment → button state → persists across reload.
- Recipe history: the notes field round-trip and load-saved-recipe-back-into-calculator (save/favorite/delete are already covered in `e2e/recipe-history.spec.ts`).

## D. Recorded, deferred (do not implement in this round)

- `needs-backend` — global "Made It" counter, community-shared ratio presets, privacy-friendly analytics. See `docs/backend-alternatives/` (Supabase recommended).
- Considered & rejected for v2: metric/imperial unit toggle — gram-native Spanish recipe, low value vs rounding drift + translation and bundle cost. Revisit only on user demand.

## Verification

Per item: `pnpm lint && pnpm type-check && pnpm format:check && pnpm test:coverage && pnpm build && pnpm test:e2e`; size-limit stays under 200 KB (CI `bundle-size` job). CHANGELOG updated. For F1/F4: manually verify a URL/JSON produced here loads in the sibling repos (canonical ids).

## Suggested skills

- `/tdd` for F1 schema validation, F2 inverse function, F4 codec
- `/code-review` before opening each PR
- `/security-review` for F4 (URL input handling)
