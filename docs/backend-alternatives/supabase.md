# Supabase Implementation

Replace `localStorage` with Supabase Postgres + Row Level Security + anonymous sessions.

## Architecture

```
Supabase project
├── made_it_events table    — one row per click, COUNT(*) for total
├── saved_recipes table     — per-user recipe variants
└── Auth (anonymous)        — session identity via supabase-js
```

## SQL Schema

```sql
create table made_it_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  created_at timestamptz default now()
);
alter table made_it_events
  add constraint made_it_events_user_id_key unique (user_id);

create table saved_recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  tomato_amount numeric not null,
  is_custom boolean not null default false,
  proportions jsonb not null,
  notes text,
  created_at timestamptz default now()
);

create table favorite_recipe_ids (
  user_id uuid not null,
  recipe_id uuid not null references saved_recipes(id) on delete cascade,
  primary key (user_id, recipe_id)
);
```

## Row Level Security

```sql
alter table made_it_events enable row level security;
alter table saved_recipes enable row level security;
alter table favorite_recipe_ids enable row level security;

create policy "read all" on made_it_events for select using (true);
create policy "insert own" on made_it_events for insert
  with check (auth.uid() = user_id);
create policy "own rows" on saved_recipes
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own favorites" on favorite_recipe_ids
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

## SDK Install

```bash
npm install @supabase/supabase-js@^2
```

## Supabase Client

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const ensureSession = async () => {
  const { data } = await supabase.auth.getSession();
  if (!data.session) await supabase.auth.signInAnonymously();
};
```

## SupabaseStorageService Skeleton

```typescript
export class SupabaseStorageService {
  async getMadeCount(): Promise<number> {
    const { count } = await supabase
      .from('made_it_events')
      .select('*', { count: 'exact', head: true });
    return count ?? 0;
  }

  async incrementMadeCount(): Promise<void> {
    await ensureSession();
    const uid = (await supabase.auth.getUser()).data.user?.id;
    await supabase.from('made_it_events').upsert({ user_id: uid });
  }

  async getSavedRecipes(): Promise<SavedRecipe[]> {
    await ensureSession();
    const { data } = await supabase
      .from('saved_recipes')
      .select('*')
      .order('created_at', { ascending: false });
    return (data ?? []).map(/* map snake_case → camelCase */);
  }
}
```

## Migration Checklist

1. Create Supabase project (free tier) at supabase.com
2. Run SQL schema above in SQL editor
3. Enable RLS and apply policies
4. `npm install @supabase/supabase-js@^2`
5. Create `src/lib/supabase.ts`
6. Implement `SupabaseStorageService` with same public interface as `StorageService`
7. Add `VITE_USE_SUPABASE=true` feature flag
8. Add `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` to GitHub Actions secrets

## Estimated Implementation Effort

~1 day. Free tier covers Gazpachator indefinitely (500 MB DB, 2 GB bandwidth/month).
