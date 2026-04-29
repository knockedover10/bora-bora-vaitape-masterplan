# Vaitape Feasibility Dashboard

A fully static, client-side React + Vite + TypeScript dashboard presenting the patient-capital feasibility case for the Bora Bora Vaitape ultra-luxury hotel project. Built for sovereign / family-office / insurance long-hold audiences — not high-hurdle PE.

**Frame:** v7 · 12-yr unleveraged HVS DCF · RICS Red Book independent · Patient-Capital frame.

---

## What's inside

- **6 tabs** — Verdict · Build-up · Returns · Sensitivities · Upside & Caveats · Appendix
- **6-scenario engine** — 3 fixed (Base / Upside / Stress) + 3 user-editable Custom slots, computed live in-browser
- **Dark mode toggle** — in-memory only (no localStorage / cookies)
- **Defisc visually flagged as upside lever**, never priced into base case
- **KPMG 65% TRevPAR explicitly excluded** — surfaced in C.7 Independence panel only
- **12-year hold horizon** — never 20-year
- **46 cited sources** grouped in the Appendix tab

### Headline numbers (verifiable in-app)
- Total dev cost: **$42,000,000** (incl. $2,729,830 pre-opening)
- Base NOI Y6 stabilized: **$4,762,483** · Stress: **$3,113,931**
- Base unleveraged IRR: **13.21%** · Stress: **7.96%** · Spread: **+484 bps**
- Asset Value Y12 — Base: **$73.27M** · Stress: **$47.91M**
- Defisc upside (Loi Pons-Girardin, *separate* from base): **$4.18M**

---

## Tech stack

- Vite 6 + React 18 + TypeScript
- Tailwind CSS v3 (HSL token system, light/dark)
- shadcn-style primitives (`Card`, `Button`, `Badge`, `Sheet`, `Switch`, `Slider`)
- Recharts (Tornado, Sensitivity grid, DCF composed chart, IRR bars)
- lucide-react icons
- Inter (Google Fonts) with tabular-numeric features

No backend, no router, no API, no localStorage. Pure React state.

---

## Prerequisites

- Node.js 18.x or 20.x
- npm 9+ (or pnpm / yarn — examples below use npm)

---

## Local development

```bash
# Install dependencies
npm install

# Start dev server (Vite, default port 5173)
npm run dev

# Type-check + production build to ./dist
npm run build

# Preview the production build locally
npm run preview
```

The dev server reloads on save. The build output is fully static — `dist/` contains `index.html` plus hashed JS/CSS bundles, deployable to any static host.

---

## Project structure

```
dashboard/
├── _data_anchors.json          # Source of truth — anchor numbers from feasibility study
├── _qa_screens/                # 24 Playwright QA screenshots (light/dark × 1280/375 × 6 tabs)
├── public/favicon.svg          # Lagoon-ring favicon
├── src/
│   ├── data/model.ts           # Typed anchor data (inputs, scenarios, DCF, sensitivities, sources)
│   ├── lib/
│   │   ├── calc.ts             # DCF, IRR (Newton-Raphson + bisection), gate verdicts
│   │   └── utils.ts            # Formatters (currency, percent, bps), cn helper
│   ├── hooks/
│   │   ├── useScenarios.ts     # 6-scenario state machine + active-flag logic
│   │   └── useTheme.ts         # Dark mode toggle (in-memory)
│   ├── components/
│   │   ├── ui/                 # shadcn-style primitives (Card, Button, Badge, Sheet, Switch, Slider)
│   │   ├── tabs/               # One file per tab (TabVerdict, TabBuildUp, TabReturns, ...)
│   │   ├── Header.tsx          # Inline SVG lagoon-ring logo + theme toggle
│   │   ├── ScenarioBar.tsx     # 6-scenario chip row + active toggles
│   │   ├── ScenarioEditor.tsx  # Right-side drawer for Custom scenario inputs
│   │   ├── KpiTile.tsx, GateTile.tsx
│   │   ├── TornadoChart.tsx, SensitivityGrid.tsx, DcfLineChart.tsx, IrrBarChart.tsx
│   │   ├── DefiscPanel.tsx, RicsPanel.tsx, SourcesList.tsx
│   ├── App.tsx                 # Sticky tab bar (mobile <select>, desktop pills)
│   ├── main.tsx
│   └── index.css               # Design tokens (HSL), Tailwind layers, font features
├── index.html
├── package.json
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json + tsconfig.app.json + tsconfig.node.json
└── vite.config.ts
```

---

## Updating the data

All numbers flow from `_data_anchors.json` into typed constants in `src/data/model.ts`. To change an input:

1. Edit `_data_anchors.json` (source of truth) and `src/data/model.ts` (typed mirror).
2. Re-run `npm run build` and visually verify in `npm run preview`.
3. Headline numbers appear in the Verdict KPI tiles, Sensitivity grids, DCF chart, and Appendix.

The IRR / NPV / asset-value calculations in `src/lib/calc.ts` are unit-stable — Newton-Raphson with a bisection fallback for ill-conditioned cashflows.

---

## Deployment

The `dist/` folder produced by `npm run build` is a static bundle. Any of the following work without modification.

### Cloudflare Pages

1. Push the repository to GitHub (parent agent will handle the push to `knockedover10/bora-bora-vaitape-masterplan`).
2. In the Cloudflare dashboard → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Pick the repo. Set:
   - **Framework preset:** Vite
   - **Root directory:** `dashboard` (if this folder is nested inside the masterplan repo; otherwise leave blank)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Deploy. Cloudflare auto-rebuilds on every push to the configured branch.

### Vercel

```bash
# From the dashboard/ directory
npx vercel deploy --prod
```

Or connect the GitHub repo via the Vercel dashboard. Framework preset is auto-detected as Vite. No environment variables required.

### Netlify

Drag-and-drop:
1. Run `npm run build` locally.
2. Drag the `dist/` folder onto https://app.netlify.com/drop.

CLI:
```bash
npx netlify deploy --prod --dir=dist
```

Or connect via the Netlify dashboard with build command `npm run build` and publish directory `dist`.

### Generic static hosts (S3, GCS, Caddy, nginx)

Upload the contents of `dist/` to any static-file server. Set the default document to `index.html`. No SPA routing rewrites are needed — the dashboard uses tab state, not URL routing.

---

## QA & screenshots

`_qa_screens/` contains 24 Playwright screenshots covering every tab × theme × viewport (1280px desktop, 375px mobile). Naming pattern: `{tabId}_{theme}_{width}.png`.

Verified visually:
- All headline numbers render as anchor values
- Dark mode applies across charts, tables, KPI tiles
- Mobile (375px) collapses the tab bar to a `<select>` dropdown
- Sensitivity grid color cells (green / gold / red) reflect IRR thresholds
- Tornado chart sorted by absolute magnitude
- 46 sources grouped by category in the Appendix

---

## Constraints honored

- ✅ Pure static client-side React; no backend, no router, no API
- ✅ No `localStorage`, `sessionStorage`, or cookies — React state only
- ✅ 12-year hold horizon throughout (5/8/10/12 sensitivity table — never 20-yr)
- ✅ Defisc flagged as UPSIDE LEVER, separated from base case
- ✅ KPMG 65% TRevPAR excluded with C.7 / connected-party rationale
- ✅ Sovereign / family-office audience framing in footer
- ✅ All anchor numbers traceable to `_data_anchors.json`

---

## License & attribution

Internal feasibility artifact. Source data anchored in the v7 HVS DCF and RICS Red Book independent valuation. See the Appendix tab for the full 46-source bibliography with URLs.
