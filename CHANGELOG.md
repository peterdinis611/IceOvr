# Changelog

All notable IceOVR updates are recorded here.

## Unreleased

### Added
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
