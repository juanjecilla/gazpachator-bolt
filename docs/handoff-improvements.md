# Handoff: improvements backlog — gazpachator-bolt

From the 2026-07-17 cross-repo deep analysis (quality / security / scalability). Tags: `static-ok` = doable on GitHub Pages with no backend (prioritize these); `needs-backend` = requires server/services.

## static-ok (prioritized)

1. **Refactor the strategy-change recalculation effect** — `src/App.tsx` has a documented `react-hooks/set-state-in-effect` disable: recalculation on `isCustom`/`customProportions` change should move into the event handlers that change them (keep current tomato amount as input). Removes the last hook-rule suppression.
2. **Validate localStorage payloads** — `StorageService.getSavedRecipes/getFavoriteIds` cast `JSON.parse` results without shape checks; corrupt or hand-edited data can inject wrong shapes into state. Add lightweight schema validation (zod is not currently a dep here — a hand-rolled guard is fine) and fall back to defaults + console.warn.
3. **Typed translation keys** — `t(key: string)` accepts any string; typos fail silently to the key name. Derive a union type from the `en` table so unknown keys fail type-check.
4. **Dependabot/Renovate** — no automated dependency updates; add `.github/dependabot.yml` (npm ecosystem works for pnpm) weekly.
5. **CSP meta tag** — static host, no headers control; add a `<meta http-equiv="Content-Security-Policy">` allowing only self + ko-fi link target (link needs no CSP entry; scripts/styles self only). Verify PWA/service worker still functions.
6. **Bundle check in CI** — `dist/assets/index-*.js` is ~186 KB raw. Add a size budget step (e.g. `size-limit`) to catch regressions.
7. **e2e breadth** — only 4 Playwright specs (one skipped). Cover: language switch persists, history save/favorite/delete, custom proportions flow, PWA update prompt (mockable).

## needs-backend (recorded, deferred)

- Global "made it" counter shared across visitors — see `docs/backend-alternatives/` (Supabase/Firebase writeups already exist in this repo).
- Community-shared ratio presets.
- Privacy-friendly analytics (e.g. self-hosted Plausible).

## Suggested skills

- `/tdd` for the storage validation work
- `/security-review` after the CSP change
