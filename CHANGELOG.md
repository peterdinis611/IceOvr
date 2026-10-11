# Changelog

All notable IceOVR updates are recorded here.

## Unreleased

### Added
- Season form PNG embed (`/<user>-form.png`) and README form badge in share pack.
- Hybrid live Draft Board: seed + recent scouts + shareable `?players=` lists.
- Nation and language Cups on the Draft Board (`?cup=country:SK` / `?cup=lang:Rust`).
- Org Franchise Draft (`/franchise`) — public members auto-lined into a roster for Lineup/PNG.
- Playoff Bracket (`/playoffs`) — 8-player single-elim with deterministic OVR winners.
- Call-up pack reveal when local scout history detects a tier jump / foil unlock.
- Team chemistry boost from shared-repo collaboration signals.
- Head-to-head Scout Compare with shareable URLs and six attribute duel rounds.
- Live Season form check, contribution streak, and next GitHub Cup milestone.
- IndexedDB scouting snapshots for per-profile local change tracking.
- k6 API stress test suite for card, team rating, and GitHub search endpoints.
- Loading boundaries and hockey puck spinner for player scouting and deferred report tabs.
- SEO routes and assets: `robots.txt`, `sitemap.xml`, `llms.txt`, JSON-LD, and Open Graph images.

### Improved
- Hockey-first visual system with rink boards, face-off markings, draft-board hierarchy, and arena panels.
- Player card avatar delivery, request-animation-frame tilt, and mobile heatmap readability.
- GitHub scout flow uses one GraphQL request instead of three separate calls.
- Team-rating and GitHub-search API responses now use cache headers; roster rating calls are debounced.
- Scouting Report and Activity content load on demand to keep the initial profile view lighter.

## 0.1.0

### Added
- GitHub-powered collector cards with overall rating, tiers, attributes, and PNG export.
- Player scouting reports, contribution heatmaps, GitHub Cups, team builder, share links, and API error states.
