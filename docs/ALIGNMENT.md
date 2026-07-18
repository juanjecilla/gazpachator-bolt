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
- **Tests:** Vitest + Testing Library; coverage thresholds **80% lines/functions/statements, 75% branches** — enforced in CI via `test:coverage` in all three (Scaler since its PR #31)
- **E2E:** Playwright in all three (`e2e/`, chromium, run against the production build/basePath in CI)
- **CI shape:** `ci.yml` = install → type-check → lint → format:check → test:coverage [→ build] + `e2e` + bundle-size gate; `deploy.yml` = build → GitHub Pages (actions/deploy-pages@v4)
- **Bundle budgets:** `size-limit` raw JS in all three — bolt 200 KB (`dist/assets/index-*.js`), v0 990 KB (`out/_next/static/chunks/**/*.js`, Next framework + polyfills included), Scaler 340 KB (`dist/assets/index-*.js`)
- **CSP:** meta tag in all three. bolt: strict `'self'`-only. v0: production-only (`next dev` needs `'unsafe-eval'`), `script-src`/`style-src` add `'unsafe-inline'` (Next inline bootstrap + inline font style). Scaler: adds Google Fonts hosts + `'unsafe-inline'` style-src (Radix inline positioning).
- **Meta:** MIT LICENSE, package.json description/author/repository/homepage, CLAUDE.md, CHANGELOG.md, CONTRIBUTING.md, Conventional Commits, PR-based flow (no direct main commits), dependabot (npm + github-actions, weekly)
- **Security baseline:** `pnpm audit` clean in all three (overrides pinned where transitive: `zod-validation-error@^4` in bolt/Scaler, `lodash`/`postcss`/`tar` in v0)

## Feature parity matrix (historical snapshot: post-alignment, before ports)

> **2026-07-18:** all `static-ok` port and e2e backlogs were executed — every feature row below now ships in all three repos, **with one verified exception: v0 never got JSON export** (only Share + `.txt`; fixed by F1 in the features-v2 round below). A same-day tooling-parity pass (bolt #32, v0 #28, Scaler #31) closed the remaining tooling gaps: CI-enforced lint warnings + repo-wide prettier (bolt), size budget + CSP + contributor docs (v0), CI-enforced coverage + CSP + changelog (Scaler). Matrix kept as a record of the starting point. Post-pass extras that never reached parity: PNG recipe-image export (bolt only), copy-link + share-social (Scaler only), servings as an input control (nowhere — estimate labels only). Scaler has since moved to Vite 8 (dependabot #18).

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

## Features v2 (2026-07-18)

Second round, planned in each repo's `docs/handoff-features-v2.md` — **same F-IDs in all three docs**; the F1 JSON schema and F4 `?r=` encoding spec are spelled out identically in each (canonical ingredient ids `tomato, cucumber, greenPepper, garlic, oliveOil, salt, vinegar`; Scaler maps `jerezVinegar` ↔ `vinegar` at its codec boundary).

| ID  | Feature                                        | bolt          | v0              | Scaler |
| --- | ---------------------------------------------- | ------------- | --------------- | ------ |
| F1  | JSON export/import (shared schema)             | import        | export + import | import |
| F2  | Serving-size selector (250 ml/serving, pinned) | new           | new             | new    |
| F3  | PNG recipe-image export                        | i18n fix only | new (port)      | new    |
| F4  | Shareable recipe URLs (`?r=` base64url)        | new           | new             | new    |

Each doc also carries repo-specific B (i18n/a11y/hygiene) and C (test gap-fill) sections. All items `static-ok`. Suggested order: B → C → A, with Scaler's B1 prune first (bundle headroom for F3/F4).

Docs PRs: bolt [#34](https://github.com/juanjecilla/gazpachator-bolt/pull/34), v0 [#29](https://github.com/juanjecilla/gazpachator-v0/pull/29), Scaler [#32](https://github.com/juanjecilla/GazpachoScaler/pull/32).

## PRs from the alignment session (2026-07-17)

- GazpachoScaler [#9](https://github.com/juanjecilla/GazpachoScaler/pull/9) — dead server code removal + standards
- gazpachator-bolt [#11](https://github.com/juanjecilla/gazpachator-bolt/pull/11) — standards + vite 7 + hook-rule fixes
- gazpachator-v0 [#2](https://github.com/juanjecilla/gazpachator-v0/pull/2) — full tooling bootstrap + 2 functional bug fixes

## Cross-repo follow-ups (see per-repo `docs/handoff-improvements.md`)

Priority to `static-ok` items; `needs-backend` items are recorded but deferred.

1. ~~`static-ok` Feature ports per matrix above~~ done 2026-07-18 (except v0 JSON export → features-v2 F1)
2. ~~`static-ok` Playwright e2e for v0 + Scaler~~ done 2026-07-18
3. ~~`static-ok` Validate localStorage payloads on read~~ done 2026-07-18 (storage guards)
4. `static-ok` Prune unused dependencies — v0 done 2026-07-18; Scaler round 2 planned (features-v2 B1: 6 unused shadcn ui files + 4 radix deps, unused i18n keys, unused tailwind tokens)
5. ~~`static-ok` Dependabot/Renovate in all three~~ done 2026-07-18
6. `static-ok` v0: decide fate of the still-connected Vercel project (auto-deploys on push; GH Pages is now canonical)
7. `static-ok` Features v2 backlogs (`docs/handoff-features-v2.md` in each repo) — F1–F4 + i18n/a11y completion + test gap-fill
8. `chore-migration` Blocked dependabot majors, need manual migration: v0 #11/#17 (next/eslint-config-next 16 — native flat config vs FlatCompat), Scaler #19 (react 19 — +50 KB over budget), #23 (TS 6 — `baseUrl` error), #24 (tailwind 4 — PostCSS migration)
9. `needs-backend` Global "made it" counter (see Scaler `docs/future-supabase-migration.md`, bolt `docs/backend-alternatives/`)
10. `needs-backend` Shared community ratio presets
11. Considered & deferred: metric/imperial unit toggle — gram-native Spanish recipe; low value vs rounding drift + translation/bundle cost. Revisit only on user demand.

## Notes for future agents

- v0's remote branch `vercel/react-server-components-cve-*` predates the Next bump to 15.5.20; the advisory is addressed — branch can be deleted.
- GitHub Pages for v0 must be enabled with source = GitHub Actions before its `deploy.yml` first runs.
- This file is committed in gazpachator-bolt (the reference implementation) as the cross-repo overview; a working copy may also sit in the uncommitted parent folder. Per-repo docs remain the source of truth for their own backlogs.
