# Contributing to Gazpachator

## Worktree Workflow (Required)

Every change — feature, fix, doc, ci — **must** use a git worktree on a dedicated branch. Direct commits to `main` are not allowed.

```bash
# 1. Create worktree from latest main
git fetch origin main && git reset --hard origin/main
git worktree add ../gazpachator-<slug> <type>/<slug>

# 2. Work inside the worktree
cd ../gazpachator-<slug>
npm install
npm run dev

# 3. Commit, push, open PR
git push -u origin <type>/<slug>
gh pr create --title "<type>(scope): description" ...

# 4. After merge, clean up
cd ../gazpachator-bolt
git worktree remove ../gazpachator-<slug>
```

## Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feat/<slug>` | `feat/nutrition-info` |
| Bug fix | `fix/<slug>` | `fix/dark-mode-flash` |
| Documentation | `docs/<slug>` | `docs/api-reference` |
| CI/infra | `ci/<slug>` | `ci/playwright-upgrade` |
| Chore | `chore/<slug>` | `chore/dep-update` |

## PR Title Format

```
<type>(<scope>): <short description>
```

Examples:
- `feat(recipe-history): add import/export as JSON`
- `fix(storage): handle JSON parse error gracefully`
- `docs(readme): add Lighthouse badge`

## Before Opening a PR

Run the full quality gate locally:

```bash
npm run lint
npm run type-check
npm run format:check
npm run test:coverage
```

All must pass. Coverage thresholds: **80% lines/functions/statements, 75% branches** (services + hooks).

## Code Rules

- No component calls `localStorage` directly — all storage goes through `StorageService`
- All new UI strings must be added to all 4 languages in `src/data/translations.ts`
- `import type` for type-only imports (`@typescript-eslint/consistent-type-imports`)
- No `console.log` — use `console.error` / `console.warn` only

## Testing

- Unit tests co-located with source: `src/services/*.test.ts`, `src/hooks/*.test.ts`
- E2E tests in `e2e/`
- New feature → unit tests required
- UI change → E2E test required

## Commit Messages

Follow Conventional Commits. Keep subject ≤ 72 chars. Add body only when the "why" isn't obvious.

## CHANGELOG

Update `CHANGELOG.md` under `[Unreleased]` for every PR.
