# Git Worktree Development Workflow

All Gazpachator development uses git worktrees. Each feature, fix, or doc change lives in its own worktree on a dedicated branch. This enables parallel development and keeps `main` clean.

## Full Lifecycle

### 1. Create worktree

```bash
# From the main checkout directory
git worktree add ../gazpachator-<slug> <type>/<slug>

# Example: starting the PWA feature
git worktree add ../gazpachator-pwa feat/pwa
```

This creates a sibling directory `../gazpachator-pwa` checked out to the new branch `feat/pwa`.

### 2. Work in the worktree

```bash
cd ../gazpachator-pwa
npm install   # if needed (node_modules not shared)
npm run dev   # start dev server
```

All edits happen inside the worktree directory. The main checkout is unaffected.

### 3. Commit

```bash
git add <files>
git commit -m "feat(pwa): add vite-plugin-pwa with workbox config"
```

### 4. Push and open PR

```bash
git push -u origin feat/pwa
gh pr create --title "feat(pwa): add PWA support with offline caching" \
  --body "..."
```

### 5. After merge, clean up

```bash
# Back in main checkout
git worktree remove ../gazpachator-pwa
git branch -d feat/pwa
git fetch origin --prune  # removes remote tracking ref
```

## Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feat/<slug>` | `feat/recipe-history` |
| Bug fix | `fix/<slug>` | `fix/theme-toggle` |
| Documentation | `docs/<slug>` | `docs/overhaul` |
| CI/CD | `ci/<slug>` | `ci/github-pages` |
| Chore | `chore/<slug>` | `chore/foundation` |

## PR Title Format

```
<type>(<scope>): <short description>
```

Examples:
- `feat(recipe-history): add save/load recipe variants`
- `fix(storage): move user-made-it to StorageService`
- `ci(deploy): add GitHub Pages deployment workflow`
- `docs(readme): rewrite with full feature documentation`

## Notes

- `node_modules` is NOT shared between worktrees — run `npm install` in each
- Each worktree has its own `.env.local` if needed
- Worktrees share the same `.git` directory — branches, remotes, and history are shared
- Max recommended concurrent worktrees: 3 (to avoid confusion)
