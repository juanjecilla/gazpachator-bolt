# Gazpachator

Spanish Gazpacho recipe calculator. Vite 5 + React 18 + TypeScript + Tailwind 3.
Live: https://juanjecilla.github.io/gazpachator-bolt/

---

## Worktree Workflow (MANDATORY)

Every change — feature, fix, doc, ci — MUST use a worktree on a feature branch.
**Direct commits to `main` are forbidden.**

```bash
# 1. Create worktree
git worktree add ../gazpachator-<slug> <type>/<slug>

# 2. Work entirely inside ../gazpachator-<slug>

# 3. Push and open PR to main
git push -u origin <type>/<slug>
gh pr create --title "<type>(scope): description" ...

# 4. After merge, clean up
git worktree remove ../gazpachator-<slug>
git branch -d <type>/<slug>
```

**Worktree dir convention:** `../gazpachator-<slug>` (sibling to main checkout)
**Branch types:** `feat/` `fix/` `docs/` `ci/` `chore/`

---

## Phase → Branch Map

| Phase | Branch |
|-------|--------|
| 0 Foundation | `chore/foundation` |
| 1 Code Quality | `chore/code-quality` |
| 2 Testing | `feat/testing` |
| 3 CI/CD | `ci/github-pages` |
| 4 SEO/A11y | `feat/seo-a11y` |
| 5 PWA | `feat/pwa` |
| 6 Recipe History | `feat/recipe-history` |
| 7 Docs | `docs/overhaul` |
| 8 Backend Docs | `docs/backend-alternatives` |

---

## npm Scripts

| Script | Purpose |
|--------|---------|
| `dev` | Vite dev server |
| `build` | Production build |
| `preview` | Preview dist |
| `lint` | ESLint check |
| `lint:fix` | ESLint autofix |
| `format` | Prettier write |
| `format:check` | Prettier check (CI) |
| `type-check` | `tsc --noEmit` |
| `test` | Vitest run (unit) |
| `test:watch` | Vitest watch mode |
| `test:coverage` | Vitest + v8 coverage |
| `test:e2e` | Playwright end-to-end |
| `test:e2e:ui` | Playwright UI mode |

---

## Architecture

- **Strategy pattern**: `RecipeCalculatorService` swaps `DefaultCalculationStrategy` ↔ `CustomCalculationStrategy`
- **Singleton**: `StorageService.getInstance()` — the **only** class allowed to touch `localStorage`
- **Translations**: all UI strings keyed via `t('key')` from `useLanguage` hook; all 4 languages must be updated together
- **Theme**: class-based dark mode — `useTheme` toggles `dark` class on `<html>`
- **Path alias**: `@/` resolves to `src/`

---

## localStorage Key Registry

| Key | Type | Default | Added in |
|-----|------|---------|----------|
| `gazpacho-made-count` | number (string) | `"0"` | Phase 0 |
| `gazpacho-theme` | `light\|dark\|system` | null | Phase 0 |
| `gazpacho-language` | `en\|es\|fr\|de` | null | Phase 0 |
| `user-made-it` | `"true"` | null | Phase 0 |
| `gazpacho-saved-recipes` | JSON `SavedRecipe[]` | `"[]"` | Phase 6 |
| `gazpacho-favorite-ids` | JSON `string[]` | `"[]"` | Phase 6 |
| `gazpacho-storage-version` | number (string) | `"1"` | Phase 6 |

**Rule:** No component calls `localStorage` directly. All storage goes through `StorageService`.

---

## Testing Philosophy

- Unit tests: `src/**/*.test.ts` co-located alongside source files
- E2E tests: `e2e/` directory, Playwright
- Coverage thresholds: 80% lines/functions/statements, 75% branches
- New feature → unit tests required before PR
- UI change → E2E test required before PR

---

## PR Checklist

- [ ] `npm run lint` passes
- [ ] `npm run type-check` passes
- [ ] `npm run format:check` passes
- [ ] `npm run test:coverage` passes (all thresholds met)
- [ ] No direct `localStorage` calls outside `StorageService`
- [ ] New UI strings added in all 4 languages (`en`, `es`, `fr`, `de`)
- [ ] `CHANGELOG.md` updated under `[Unreleased]`
