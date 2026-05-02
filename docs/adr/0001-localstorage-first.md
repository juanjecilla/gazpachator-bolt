# ADR 0001 — localStorage-First Storage

## Status

Accepted

## Context

Gazpachator is a fully static, client-side app with no backend infrastructure. The "Made It" counter and user preferences (theme, language, saved recipes) need persistence across page loads.

## Decision

Use `localStorage` for all persistence in v1.0. All access is centralised through `StorageService` singleton — no component touches `localStorage` directly.

## Rationale

- Zero infrastructure cost and complexity for v1
- Fully offline-capable from day one
- Sufficient for single-user preferences (theme, language, saved recipes)
- The counter is per-browser, which is acceptable for a personal project

## Consequences

- "Made It" count is not globally shared across users
- Saved recipes are not synced across devices
- Migration path to a real backend is documented in `docs/backend-alternatives/`

## Alternatives

See `docs/backend-alternatives/` for Firebase, Supabase, and serverless options.
