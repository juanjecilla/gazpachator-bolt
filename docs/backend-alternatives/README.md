# Backend Alternatives for Global Counter

The "Made It" counter and saved recipes use `localStorage` in v1.0 (per-browser only).
This directory documents three approaches to make them truly global.

## Comparison

| Option | File | Cost | Real-time | Complexity | PRs needed |
|--------|------|------|-----------|------------|------------|
| Firebase Firestore | [firebase.md](./firebase.md) | Free tier | Yes | Low | ~3 |
| Supabase Postgres | [supabase.md](./supabase.md) | Free tier | Yes | Low | ~3 |
| Cloudflare Worker | [serverless.md](./serverless.md) | Free | Yes | Medium | ~2 |
| GitHub Actions JSON | [serverless.md](./serverless.md) | Free | No | Low | ~1 |

## Recommendation

**Supabase** is the easiest migration path:
- Postgres gives relational integrity (foreign keys, unique constraints)
- Row Level Security means no custom auth middleware
- Anonymous auth requires zero user signup
- `@supabase/supabase-js` TypeScript types are excellent
- Free tier covers Gazpachator indefinitely

**Firebase** is equally valid if you prefer Google's ecosystem.

**Cloudflare Worker** is best if you want zero database dependency and only need a counter (not per-user saved recipes).

## See Also

- [ADR 0001 — Why localStorage for v1](../adr/0001-localstorage-first.md)
