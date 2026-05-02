# Serverless Implementation

Two zero-cost options for a global counter without a managed database.

---

## Option A — Cloudflare Worker + KV

Worker exposes `GET /count` + `POST /increment`. KV stores counter + per-IP lock. Latency < 50 ms globally.

```typescript
// worker.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = {
      'Access-Control-Allow-Origin': 'https://juanjecilla.github.io',
      'Content-Type': 'application/json',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });

    const url = new URL(request.url);
    if (url.pathname === '/count') {
      const count = (await env.COUNTER.get('made_it_count')) ?? '0';
      return Response.json({ count: parseInt(count) }, { headers: cors });
    }
    if (request.method === 'POST' && url.pathname === '/increment') {
      const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
      if (await env.COUNTER.get(`lock:${ip}`)) {
        return Response.json({ error: 'already counted' }, { status: 429, headers: cors });
      }
      await env.COUNTER.put(`lock:${ip}`, '1');
      const current = parseInt((await env.COUNTER.get('made_it_count')) ?? '0');
      await env.COUNTER.put('made_it_count', String(current + 1));
      return Response.json({ count: current + 1 }, { headers: cors });
    }
    return new Response('Not found', { status: 404 });
  },
};
interface Env { COUNTER: KVNamespace; }
```

Deploy: `wrangler kv:namespace create COUNTER && wrangler deploy`

---

## Option B — GitHub Actions + `data/counter.json`

Counter lives in a JSON file committed to the repo. Workflow increments it via `workflow_dispatch`. No external service needed. Not real-time — suitable for low-traffic vanity counters.

```yaml
# .github/workflows/increment-counter.yml
name: Increment Made-It Counter
on:
  workflow_dispatch:
    inputs:
      increment: { description: 'Amount', default: '1' }
jobs:
  increment:
    runs-on: ubuntu-latest
    permissions: { contents: write }
    steps:
      - uses: actions/checkout@v4
      - run: |
          COUNT=$(jq '.count' data/counter.json)
          echo "{\"count\": $((COUNT + ${{ github.event.inputs.increment }}))}" > data/counter.json
      - run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add data/counter.json && git commit -m "chore: increment counter" && git push
```

---

## Comparison

| | Cloudflare Worker | GitHub Actions |
|--|--|--|
| Real-time | Yes | No |
| Cost | Free (100k req/day) | Free |
| Setup | Medium | Low |
| Rate limiting | IP-based KV lock | N/A |

## Migration Checklist (Cloudflare Worker)

1. Create Cloudflare account, create KV namespace
2. Deploy worker with `wrangler deploy`
3. Add `VITE_COUNTER_API_URL` env var pointing to worker URL
4. Replace `StorageService.getMadeCount/incrementMadeCount` with `fetch(API + '/count')` / `fetch(API + '/increment', { method: 'POST' })`
5. Add env var to GitHub Actions secrets

## Estimated Implementation Effort

- Cloudflare Worker: ~4 hours
- GitHub Actions: ~1 hour
