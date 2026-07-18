# Gazpachator — cross-repo alignment

Three sibling repos implement the same product (gazpacho recipe scaling calculator) on different stacks. Designs intentionally differ per platform — **never align visuals**, only functionality, tooling, and practices.

| Repo                                                                | Stack                                                          | Live                                            |
| ------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------- |
| [gazpachator-bolt](https://github.com/juanjecilla/gazpachator-bolt) | Vite 7 + React 18 + TS + Tailwind 3                            | https://juanjecilla.github.io/gazpachator-bolt/ |
| [gazpachator-v0](https://github.com/juanjecilla/gazpachator-v0)     | Next.js 15 (static export) + React 19 + Tailwind 4 + shadcn/ui | https://juanjecilla.github.io/gazpachator-v0/   |
| [GazpachoScaler](https://github.com/juanjecilla/GazpachoScaler)     | Vite 7 + React 18 + TS + Tailwind 3 + shadcn/ui                | https://juanjecilla.github.io/GazpachoScaler/   |

## Shared standards (as of 2026-07-17 alignment)

- **Package manager:** pnpm 10 (`packageManager` field pinned; `pnpm/action-setup@v4` in CI)
- **Node:** 22 (`.nvmrc`, `engines.node >=22`, CI `node-version: 22`)
- **Toolchain:** Vite 7 / Vitest 4 / jsdom 29 (bolt + Scaler); Next 15.5 + Vitest 4 (v0)
- **Lint/format:** ESLint 9 flat config, `--max-warnings 0`; Prettier with tailwindcss plugin
- **Hooks:** Husky + lint-staged pre-commit (eslint --fix + prettier on staged files)
- **Tests:** Vitest + Testing Library; coverage thresholds **80% lines/functions/statements, 75% branches**
- **E2E:** Playwright (bolt has it; v0 + Scaler tracked in their `docs/handoff-e2e.md`)
- **CI shape:** `ci.yml` = install → type-check → lint → format:check → test(:coverage) [→ build]; `deploy.yml` = build → GitHub Pages (actions/deploy-pages@v4)
- **Meta:** MIT LICENSE, package.json description/author/repository/homepage, CLAUDE.md, Conventional Commits, PR-based flow (no direct main commits)
- **Security baseline:** `pnpm audit` clean in all three (overrides pinned where transitive: `zod-validation-error@^4` in bolt/Scaler, `lodash`/`postcss`/`tar` in v0)

## Feature parity matrix (historical snapshot: post-alignment, before ports)

> **2026-07-18:** all `static-ok` port and e2e backlogs were executed — every feature row below now ships in all three repos. Kept as a record of the starting point.

| Feature                                   | bolt           | v0         | Scaler                |
| ----------------------------------------- | -------------- | ---------- | --------------------- |
| Proportional scaling from any ingredient  | ✅             | ✅         | ✅                    |
| Custom proportions editor (percent-based) | ✅             | —          | partial (custom mode) |
| Named ratio presets (save/load/delete)    | —              | ✅         | —                     |
| Recipe history + favorites                | ✅             | —          | —                     |
| Volume estimation                         | ✅             | ✅         | ✅                    |
| Servings estimate                         | —              | ✅         | —                     |
| "Made it" counter                         | ✅             | ✅         | ✅                    |
| Export text / share API                   | ✅             | ✅         | ✅ (JSON)             |
| Print recipe + print CSS                  | —              | —          | ✅                    |
| PWA (offline, install, update prompt)     | ✅             | —          | —                     |
| OG meta + emoji favicon                   | ✅ (SEO phase) | —          | ✅                    |
| Theme light/dark (+system in bolt)        | ✅             | ✅         | ✅                    |
| i18n en/es/fr/de                          | ✅             | ✅         | ✅                    |
| Unit tests                                | ✅ 45          | ✅ 30      | ✅ 41                 |
| Playwright e2e                            | ✅             | ⏳ handoff | ⏳ handoff            |

Port plans live in each repo's `docs/handoff-feature-parity.md`. Union target: every row ✅ in all three (visuals per-platform).

## PRs from the alignment session (2026-07-17)

- GazpachoScaler [#9](https://github.com/juanjecilla/GazpachoScaler/pull/9) — dead server code removal + standards
- gazpachator-bolt [#11](https://github.com/juanjecilla/gazpachator-bolt/pull/11) — standards + vite 7 + hook-rule fixes
- gazpachator-v0 [#2](https://github.com/juanjecilla/gazpachator-v0/pull/2) — full tooling bootstrap + 2 functional bug fixes

## Cross-repo follow-ups (see per-repo `docs/handoff-improvements.md`)

Priority to `static-ok` items; `needs-backend` items are recorded but deferred.

1. `static-ok` Feature ports per matrix above
2. `static-ok` Playwright e2e for v0 + Scaler
3. `static-ok` Validate localStorage payloads on read (all repos parse JSON unvalidated; corrupt data can break state)
4. `static-ok` Prune unused dependencies (v0 and Scaler carry large unused Radix/shadcn/chart dep sets; Scaler main bundle 328 KB raw)
5. `static-ok` Dependabot/Renovate in all three
6. `static-ok` v0: decide fate of the still-connected Vercel project (auto-deploys on push; GH Pages is now canonical)
7. `needs-backend` Global "made it" counter (see Scaler `docs/future-supabase-migration.md`, bolt `docs/backend-alternatives/`)
8. `needs-backend` Shared community ratio presets

## Notes for future agents

- v0's remote branch `vercel/react-server-components-cve-*` predates the Next bump to 15.5.20; the advisory is addressed — branch can be deleted.
- GitHub Pages for v0 must be enabled with source = GitHub Actions before its `deploy.yml` first runs.
- This file is committed in gazpachator-bolt (the reference implementation) as the cross-repo overview; a working copy may also sit in the uncommitted parent folder. Per-repo docs remain the source of truth for their own backlogs.
