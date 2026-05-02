# Changelog

All notable changes to Gazpachator are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning: [Semantic Versioning](https://semver.org/).

## [Unreleased]

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
