# Backend Alternatives for Made It Counter

The "Made It" counter currently uses `localStorage` (per-browser only). This directory documents three approaches for a real global counter shared across all users.

> Full comparison and migration checklists added in Phase 8. Stub.

## Options

| Option | File | Cost | Complexity |
|--------|------|------|------------|
| Firebase Firestore | [firebase.md](./firebase.md) | Free tier | Low |
| Supabase Postgres | [supabase.md](./supabase.md) | Free tier | Low |
| Serverless (CF Worker / GH Actions) | [serverless.md](./serverless.md) | Free | Medium |
