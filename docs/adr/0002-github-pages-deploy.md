# ADR 0002 — GitHub Pages Deployment

## Status

Accepted

## Context

Gazpachator needs a public hosting target. It is a fully static SPA — no server-side rendering required.

## Decision

Deploy to GitHub Pages using the official `actions/deploy-pages` GitHub Actions workflow.

**Phase 1 URL:** `https://juanjecilla.github.io/gazpachator-bolt/`
**Phase 2 URL:** Custom domain (CNAME, configured in repo settings)

## Configuration Notes

- Vite `base` must be set to `/gazpachator-bolt/` when building for GitHub Pages
- Use `process.env.GITHUB_ACTIONS` to conditionally set base path
- Repo Settings > Pages > Source must be **"GitHub Actions"** (not the legacy branch method)
- Custom domain: add domain to `public/CNAME`, configure DNS CNAME/A records, enable HTTPS in repo settings
- With a custom domain active, set `base: '/'` in Vite config (the CNAME means the site serves from root)

## Workflow Files

- `.github/workflows/ci.yml` — runs on every PR: lint, type-check, format, test, E2E
- `.github/workflows/deploy.yml` — runs on push to `main`: build + deploy to Pages
