# Gazpachator 🍅

**Juanje's Spanish Gazpacho Calculator** — scale ingredients for any batch size, save custom recipes, and share with friends.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://juanjecilla.github.io/gazpachator-bolt/)
[![CI](https://github.com/juanjecilla/gazpachator-bolt/actions/workflows/ci.yml/badge.svg)](https://github.com/juanjecilla/gazpachator-bolt/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

---

## Features

- **Recipe Calculator** — scale all 7 ingredients relative to tomato weight
- **Custom Proportions** — adjust ratios and save your own variant
- **Recipe History** — save, load, and star favourite recipe variants
- **Volume Estimator** — density-based total volume calculation
- **Export & Share** — copy text, download `.txt`, generate recipe image, Web Share API
- **4 Languages** — English, Español, Français, Deutsch (auto-detected)
- **Dark / Light / System** theme
- **PWA** — installable, works fully offline after first load
- **Made It Counter** — track who has made the recipe

## Live Demo

**[juanjecilla.github.io/gazpachator-bolt](https://juanjecilla.github.io/gazpachator-bolt/)**

## Quick Start

```bash
git clone git@github.com:juanjecilla/gazpachator-bolt.git
cd gazpachator-bolt
npm install
npm run dev        # http://localhost:5173
```

## Available Scripts

| Script                  | Purpose                       |
| ----------------------- | ----------------------------- |
| `npm run dev`           | Start Vite dev server         |
| `npm run build`         | Production build              |
| `npm run preview`       | Preview production build      |
| `npm run lint`          | ESLint check                  |
| `npm run lint:fix`      | ESLint autofix                |
| `npm run format`        | Prettier write                |
| `npm run format:check`  | Prettier check (used in CI)   |
| `npm run type-check`    | TypeScript check with no emit |
| `npm run test`          | Vitest unit tests             |
| `npm run test:watch`    | Vitest watch mode             |
| `npm run test:coverage` | Vitest + v8 coverage report   |
| `npm run test:e2e`      | Playwright end-to-end tests   |
| `npm run test:e2e:ui`   | Playwright UI mode            |

## Tech Stack

|               |                                        |
| ------------- | -------------------------------------- |
| **Framework** | React 18 + TypeScript 5.5              |
| **Build**     | Vite 5                                 |
| **Styling**   | Tailwind CSS 3 (class-based dark mode) |
| **Icons**     | Lucide React                           |
| **PWA**       | vite-plugin-pwa + Workbox              |
| **Testing**   | Vitest + Testing Library + Playwright  |
| **CI/CD**     | GitHub Actions → GitHub Pages          |

## Architecture

See [`docs/architecture/overview.md`](docs/architecture/overview.md) for component hierarchy, service layer, and data flow.

Key patterns:

- **Strategy Pattern** — `RecipeCalculatorService` swaps `DefaultCalculationStrategy` ↔ `CustomCalculationStrategy`
- **Singleton** — `StorageService` is the sole interface to `localStorage`
- **Custom Hooks** — `useTheme`, `useLanguage`, `useRecipeHistory`

## Development Workflow

All changes use **git worktrees** — one worktree per feature branch. See [`CLAUDE.md`](CLAUDE.md) and [`docs/development/worktree-workflow.md`](docs/development/worktree-workflow.md) for the full workflow.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Backend Alternatives

The "Made It" counter and saved recipes currently use `localStorage`. For a real global backend, see [`docs/backend-alternatives/`](docs/backend-alternatives/) for Firebase, Supabase, and serverless options.

## License

[MIT](LICENSE) © Juanje Cilla
