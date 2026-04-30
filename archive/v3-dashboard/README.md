# v3 Dashboard — Archived Build

This is the **compiled bundle** of the original Vaitape Bora Bora feasibility dashboard,
fetched from `https://vaitape-hotel-dashboard.pplx.app/` on 30 Apr 2026 before that
hosting URL is unpublished.

## Contents

- `index.html` — single-page dashboard (1821 lines, inline CSS, ABC corporate theme)
- `dashboard.js` — application JavaScript (unminified, ~75 KB)

External dependencies (loaded from CDNs, kept as-is):
- Google Fonts: Lato 300/400/700/900
- Chart.js 4.4.1 via jsDelivr

## Why archive?

The pplx.app hosting URL will be unpublished by the user. The active dashboard
has been rebuilt from scratch as v7.1 and lives in `/dashboard/` with full
React/TypeScript source, deployed to GitHub Pages.

This archive preserves the v3 build so the older work isn't lost.

## How to view locally

```bash
cd archive/v3-dashboard
python3 -m http.server 8000
# then open http://localhost:8000
```

Or simply double-click `index.html` (the relative `dashboard.js` reference will
resolve via `file://`).

## NOT the original source

This is the **served bundle**, not the original development source. The
TypeScript/React source files (if any) used to produce this build are not
preserved here — only the runnable artefact.
