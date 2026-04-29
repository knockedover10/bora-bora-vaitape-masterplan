# Bora Bora Vaitape Ultra-Luxury Hotel Masterplan

**Site:** Vaitape city-centre, Bora Bora, French Polynesia
**Asset:** 35-key ultra-luxury hotel + integrated luxury hub (1.5 ha plot)
**Audience:** Patient capital — sovereign wealth funds, family offices, insurance long-hold
**Methodology:** HVS Income-Capitalisation framework (12-yr unleveraged DCF)
**Status:** v7 strategic report + merged feasibility model + interactive dashboard

This repository is the **single source of truth** for the Vaitape feasibility study. Every figure in the dashboard, deck, and report traces back to the merged Excel model in `docs/Vaitape_Hotel_Feasibility_Model_v7.xlsx`.

---

## Repository Structure

```
.
├── README.md                    ← you are here
├── docs/                         ← canonical project artifacts
│   ├── Vaitape_Hotel_Feasibility_Model_v7.xlsx     (merged model — single source of truth)
│   ├── Vaitape_Hotel_Strategic_Report_v7.docx       (Word report)
│   ├── Vaitape_Hotel_Strategic_Report_v7.pdf        (PDF report)
│   ├── Vaitape_Hotel_Strategic_Report_Slides_v7.pptx (investor deck)
│   ├── Vaitape_Dashboard_v7_Amendment_Recommendations.md
│   ├── Dashboard_Audit_Report.md
│   └── v3_v7_merge_diagnostic.md
└── dashboard/                    ← interactive dashboard (Vite + React)
    ├── README.md
    ├── package.json
    ├── ...
    └── dist/                     (built static output, deployable anywhere)
```

---

## Methodology Snapshot

| Pillar | Decision |
|---|---|
| Hold horizon | **12 years** unleveraged. Spans two FM27-equivalent planning cycles + two territorial election cycles. |
| Discount rates | 7% (patient capital), 9% (midpoint), 11% (institutional PE bound — shown to confirm this is *not* a PE deal) |
| Cap rate | 6.5% entry & terminal (JLL APAC ultra-luxury midpoint, conservative — assumes no compression) |
| TRevPAR uplift | **35% applied** (STR/HVS conservative). KPMG 65% **excluded** — Polynesia Consulting / Henry Terou connected-party flag in C.7 Independence. |
| Defisc (LODEOM) | **Upside lever, NOT in base case.** Effective USD $4.18M (cap binds). |
| Scenarios | 3 fixed (Base / Upside / Combined Stress) + 3 user-editable Custom slots in the model and dashboard. |

## Three Viability Gates (HVS Framework)

1. **Asset Value > Build Cost** — Income-cap value vs. $42M dev cost
2. **IRR within 8–12% patient-capital band** AND **NPV @ 7% > 0**
3. **Yield-on-Cost spread ≥ 100 bps** above cap rate (NOI/Cost − 6.5%)

## Headline Numbers (from merged v7 model)

| Metric | Base Case | Combined Stress |
|---|---:|---:|
| ADR (USD/night) | 2,150 | 1,827.5 |
| Occupancy | 65% | 50% |
| Stabilised NOI | $4,762,483 | $3,113,931 |
| Asset Value (income cap) | $73.27M | $47.91M |
| Development Yield | 11.34% | 7.41% |
| 12-yr Unleveraged IRR | 13.21% | 7.96% |
| NPV @ 7% (patient capital) | $27.5M | $3.6M |

## Critical Constraints (non-negotiable)

- **Defisc remains an upside lever, never base case.**
- **KPMG 65% TRevPAR is excluded** (Polynesia Consulting connected-party).
- **Sections 1–5 of the v7 strategic report must not be altered.**
- **Patient-capital framing throughout** — this is not a high-hurdle PE deal.

---

## Working with this Repository

### Read or browse

Open the docs in any Office app (Word, Excel, PowerPoint), or read the Markdown files directly on GitHub.

### Run the dashboard locally

```bash
cd dashboard
npm install
npm run dev
```

Then open `http://localhost:5173`.

### Deploy the dashboard publicly

The dashboard is a static web app — deploy the built output to any static host:

**Cloudflare Pages (recommended, free):**
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com) → "Create a project"
2. Connect this GitHub repository
3. Set framework preset to **Vite**
4. Set build command to `cd dashboard && npm install && npm run build`
5. Set output directory to `dashboard/dist`
6. Deploy. You'll get a `*.pages.dev` URL that auto-redeploys on every push to `main`.

**Vercel:**
1. Import the repo at [vercel.com/new](https://vercel.com/new)
2. Set root directory to `dashboard`
3. Framework: Vite. Deploy.

**Netlify:** same pattern as Cloudflare Pages.

### Update the dashboard data

The dashboard reads `dashboard/src/data/model.ts` which mirrors the merged Excel model. To update:

1. Edit the merged Excel in `docs/`
2. Regenerate `model.ts` by running the data-extract script in `dashboard/scripts/extract-model.ts` (or update `model.ts` by hand)
3. `cd dashboard && npm run build` and commit. The live site auto-updates on push.

---

## Continuity & Ownership

This repository is **owned by the user** (`@knockedover10`) and is independent of any AI tooling. The full project — code, data, and documentation — is portable to any host or developer. If you stop using Perplexity Pro or any other AI assistant, this repository remains fully operational and editable.

## License

All rights reserved. Confidential pre-investment material. Contact the repository owner before sharing externally.

---

*Last updated: 29 April 2026 · Merged v3+v7 model · 6-scenario engine*
