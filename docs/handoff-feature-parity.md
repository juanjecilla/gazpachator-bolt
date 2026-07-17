# Handoff: feature parity ports into gazpachator-bolt

Goal: bring features that exist in the sibling repos (gazpachator-v0, GazpachoScaler) into this repo. **Keep this repo's design/visual language — port behavior, not markup.** Cross-repo context: `../ALIGNMENT.md` in the parent folder (uncommitted) or the parity matrix below.

## Constraints

- Follow CLAUDE.md: worktree + PR flow, Conventional Commits, all storage via `StorageService`, all 4 languages updated together, unit tests before PR, e2e for UI changes, coverage thresholds 80/75/80/80.
- No visual redesign; reuse existing components/patterns (`src/components/`, strategy pattern in `src/services/RecipeCalculator.ts`).

## Ports (in suggested order)

### 1. Named ratio presets (from gazpachator-v0)

Source: `gazpachator-v0/components/custom-ratio-modal.tsx`, reducer cases `SET_CUSTOM_RATIO`/`LOAD_RATIO` in `gazpachator-v0/contexts/gazpacho-context.tsx`.
Behavior: save the current proportions under a user-chosen name; list, load, and delete presets; a built-in default preset cannot be deleted. Persist via `StorageService` (new key, add to CLAUDE.md key registry, bump storage version if schema demands).
Note: bolt already has `ProportionEditor` (percent-based custom proportions) — presets should capture/restore that editor's state rather than duplicate it.

### 2. Servings estimate (from gazpachator-v0)

Source: `gazpachator-v0/components/stats-panel.tsx` — `Math.ceil(totalVolume * 4)` servings next to the volume.
Bolt has `VolumeEstimator.tsx`; add the servings line there. Translate in 4 languages.

### 3. Print recipe (from GazpachoScaler)

Source: `GazpachoScaler/client/src/components/actions-panel.tsx` (print handler) + print CSS in `GazpachoScaler/client/index.html` / stylesheet.
Behavior: print button produces a clean, ink-friendly recipe sheet (hide chrome, show scaled ingredients + volume). Add to `ExportShare.tsx` actions.

### 4. JSON export (from GazpachoScaler)

Source: same actions-panel. Bolt exports text; add a structured JSON download (recipe + proportions + language-independent ingredient ids). Remember `URL.revokeObjectURL` after download.

## Verification

Per port: unit tests (new logic), e2e happy path (`e2e/`), `pnpm lint && pnpm type-check && pnpm format:check && pnpm test:coverage && pnpm build && pnpm test:e2e`.

## Suggested skills

- `/tdd` for the preset store logic
- `/code-review` before opening each PR
