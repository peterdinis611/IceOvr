# IceOVR

**Your GitHub, rated for the rink.** 🏒

Turn any GitHub profile into an NHL Ultimate Team-style GitHub card — scored live, embeddable as a PNG.

Inspired by [GitFut](https://github.com/younesfdj/gitfut), rebuilt with hockey aesthetics (not affiliated with NHL / EA).

## Scout attributes

| Stat | Name | Scouted from |
|------|------|--------------|
| **SPD** | Skating | Commits in the last year |
| **SHO** | Shooting | Stars across owned repos |
| **HND** | Hands | Language diversity + push rhythm |
| **PAS** | Passing | Pull requests + followers |
| **DEF** | Defense | Reviews + issues |
| **STR** | Strength | Lifetime contributions + account age |

**OVR** caps near **88** unless a legacy gate (years + influence) unlocks the 90s.

### Positions
- **C** — playmaker (PAS)
- **LW / RW** — sniper / speedster (SHO / SPD)
- **D** — two-way blue line (DEF + PAS)
- **G** — standing wall easter egg (elite DEF + consistency)

### Tiers
Bronze → Silver → Gold → X-Factor → TOTY → Legend

## Stack
Next.js · TypeScript · Tailwind · GitHub API · `next/og` PNG cards

## Setup

```bash
cd iceovr
npm install
cp .env.example .env.local
# optional but recommended:
# GITHUB_TOKEN=ghp_...
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| URL | What |
|-----|------|
| `/` | Landing — GET DRAFTED |
| `/u/<username>` | Full scout report |
| `/<username>.png` | Live embeddable card image |
| `/api/card/<username>` | Same PNG (API) |

Tier, nation (from location) and top language come automatically from GitHub — no query overrides.

### Embed

```md
[![IceOVR card](https://YOUR_DOMAIN/USERNAME.png)](https://YOUR_DOMAIN/u/USERNAME)
```

## Env

| Variable | Required | Notes |
|----------|----------|-------|
| `GITHUB_TOKEN` | Recommended | Apollo GraphQL (higher limits + real contribution calendar). Without it, IceOVR uses public REST. |
| `NEXT_PUBLIC_SITE_URL` | For prod embeds | e.g. `https://iceovr.app` |

Without a token, IceOVR falls back to the public REST API (lower limits, estimated review counts).

## Caching

Scout data is cached for **1 hour** across layers:

1. **L1** — in-memory `TtlMap` (hot path in the same process)
2. **L2** — Next.js `unstable_cache` + fetch `revalidate` / tags (`scout:<user>`)
3. **L3** — Apollo `InMemoryCache` with TTL-aware `cache-first` → `network-only`
4. **CDN** — PNG responses send `s-maxage=3600, stale-while-revalidate=86400`

## Tests

```bash
npm test          # vitest run
npm run test:watch
```

Tests live in `__tests__/` (scoring, countries, languages, scout→card mapping, `PlayerCard`, Scout Lab dialog).
