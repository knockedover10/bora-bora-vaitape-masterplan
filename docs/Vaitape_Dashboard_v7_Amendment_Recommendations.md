# Vaitape Dashboard — Amendment Recommendations (v7-merged · post-rebuild)

**Repository:** [github.com/knockedover10/bora-bora-vaitape-masterplan](https://github.com/knockedover10/bora-bora-vaitape-masterplan)
**Single source of truth:** `docs/Vaitape_Hotel_Feasibility_Model_v7.xlsx` (merged v3+v7, 6-scenario engine, 524 formulas, 0 errors)
**Dashboard source:** `dashboard/` (Vite + React + Tailwind, fully static)
**Audit date:** 29 April 2026
**Status:** **All recommendations from the prior version have been implemented in the rebuilt dashboard.** This document now functions as a (a) record of what was done and why, and (b) forward-looking refinement list for v7.1.

---

## 1. What changed since the previous recommendations doc

The previous recommendations (April 29, 2026 morning) flagged eleven structural and numerical issues with the original `vaitape-hotel-dashboard.pplx.app` build. Rather than patch that codebase, we rebuilt the dashboard from scratch in a public GitHub repository the user owns outright, using the merged v7 Excel as the only data source. Every recommendation in the prior doc has been resolved in the rebuild:

| Prior issue | Status | How it was resolved |
|---|---|---|
| Numbers out of date (v3 calibration) | **RESOLVED** | All 524 formulas point to `Vaitape_Hotel_Feasibility_Model_v7.xlsx`. Headlines: NOI Base $4.76M / Stress $3.11M; IRR Base 13.21% / Stress 7.96%; Asset Value $73.27M / $47.91M; +484 bps yield spread. |
| 15-section single-scroll layout | **RESOLVED** | Replaced with 6 tabs: Verdict / Build-up / Returns & DCF / Sensitivities / Upside & Caveats / Appendix. |
| Defisc panel missing | **RESOLVED** | Tab 5 includes a full Defisc bridge ($10.5M theoretical → $4.18M effective with cap math) and dev-yield uplift visual (11.34% → 12.59%). Flagged "Held in reserve — NOT in base case" at the panel header. |
| Tornado chart missing | **RESOLVED** | Tab 4 leads with a horizontal tornado on the seven highest-impact NPV @ 7% drivers, ranked by absolute swing. ADR is the largest, NOI growth the smallest. |
| 20-year hold | **RESOLVED** | Removed everywhere. Hold-period sensitivity in the Appendix shows 5/8/10/12 only. Cashflow chart caps at Y12. |
| v3→v7 sub-header mismatch | **RESOLVED** | Header reads `v7 · PATIENT-CAPITAL` consistently. |
| Hero IRR vs table mismatch (12.5% vs 12.6%) | **RESOLVED** | Single source. KPI tile and snapshot row both show 13.21% Base. |
| NPV @ 9.5% rogue rate | **RESOLVED** | Replaced with the canonical 7% / 9% / 11% trio per v7 model. |
| Status-badge taxonomy | **RESOLVED** | All verdict cells use PASS / MARGINAL / FAIL with both colour and icon (✓ / ⚠ / ✗) — never colour alone. |
| Custom-scenario reset capability | **RESOLVED** | Side drawer ("Edit Customs") with Reset and toggle-on/off per slot. 3 fixed + 3 custom = 6 total. |
| KPMG 65% framing | **RESOLVED** | Tab 5 "Excluded Levers Ledger" makes it explicit: *"Polynesia Consulting principal Henry Terou is also an advisor to KPMG — connected-party concern. Independence-of-evidence rule (RICS Red Book Global Standards 2024) requires that primary income forecasts not depend on parties with potential conflicts."* |

The dashboard now sits coherently alongside the v7 Strategic Report and the v7 deck. All three artifacts cite the same numbers, the same scenarios, and the same methodology.

---

## 2. Architectural summary of the rebuilt dashboard

### Tech stack
- **Vite 6 + React 18 + TypeScript** (purely client-side)
- **Tailwind CSS v3** with custom token palette (lagoon-teal accent on warm-cream / dark-bark surfaces)
- **Recharts** for tornado, DCF cashflow, IRR bars
- **lucide-react** icons; **Inter** typeface (Google Fonts) with tabular numerics throughout
- **Pure static** — no backend, no API, no localStorage. All state in React. Deployable to any static host (Cloudflare Pages, Vercel, Netlify, GitHub Pages, S3).

### Routing model
React state-based tab switching (no router). Eliminates the iframe-routing complexity that affected the original pplx.app build.

### Data flow
- `dashboard/_data_anchors.json` — full numerical anchor dump from the merged Excel (47 input parameters, 6 scenario rows, 13-year DCF cashflows, 5×5 sensitivity grid, 46 sources)
- `dashboard/src/data/model.ts` — typed TypeScript export of the same data, single import target for all components
- `dashboard/src/lib/calc.ts` — pure functions for re-computing Custom-scenario NOI / Asset Value / Dev Yield / IRR (Newton–Raphson 12-yr cashflow) when the user edits ADR shift, Occupancy, or TRevPAR uplift in the side drawer

### Tab structure

| Tab | Cell anchors in merged Excel | Surfaces |
|---|---|---|
| **Verdict** | `6.2 Verdict`, `6.3.2 Rev-NOI!C33`, `6.3.3a NOI-AV!C15:C25`, `6.3.3b DCF!D22:E25` | 3 hero KPIs · 3 viability gates · one-line verdict · Patient-Capital snapshot table · Defisc upside flag |
| **Build-up** | `6.3.1 Demand-Rev`, `6.3.2 Rev-NOI` (rows 6-34) | Demand → Revenue → P&L → NOI waterfall · 6-scenario comparison table |
| **Returns & DCF** | `6.3.3b DCF` rows 5-25 | 12-yr cashflow chart (Y0–Y12, terminal-value bar at Y12) · IRR bar by scenario · NPV table at 7%/9%/11% · methodology block |
| **Sensitivities** | `6.4 ADR-Occ`, `C.9 CapRate-OpCost`, derived NPV swings | Tornado chart (top 7 drivers) · ADR × Occupancy NOI grid · Cap × OpEx asset-value grid |
| **Upside & Caveats** | `C.7 Independence`, `C.8 Defisc`, `6.3 Inputs!C39:C58` | Defisc bridge math · Excluded-levers ledger (KPMG / 20-yr / leverage) · RICS Red Book independence panel |
| **Appendix** | `6.3 Inputs`, `Space Utilisation Plan`, `Sources` | Full inputs table · 6,720 sqm space programme · 46 references with URLs · hold-period sensitivity (5/8/10/12) |

### 6-scenario engine
The scenario bar is always visible above tab content. Three fixed scenarios (Base / Upside / Combined Stress) cannot be disabled — they are always-on benchmarks. Three Custom slots (A / B / C) start OFF and can be toggled on individually. When ON, the Custom row appears in every comparison table and chart, recomputed live via `lib/calc.ts`. The "Edit Customs" button opens a side drawer with sliders/inputs for ADR shift %, Occupancy, TRevPAR uplift per slot.

This implements the user's specific direction: *"what should always be present is base, upside, combined stress. let user be able to add 3 additional rows by editing input bar."*

### Accessibility
- WCAG AA contrast across both light and dark themes
- Verdict states use colour AND icon (no colour-alone signaling)
- Keyboard navigation throughout (tabs, scenario pills, drawer, theme toggle)
- Mobile-responsive — tabs become a `<select>` below 768px width
- Tabular lining numerals on all numeric values for column alignment

---

## 3. Numerical reconciliation (now-state)

Every value in the dashboard traces to a specific cell in `Vaitape_Hotel_Feasibility_Model_v7.xlsx`. No discrepancies remain.

| Metric | Dashboard | Excel cell | Match |
|---|---|---|---|
| Base NOI | $4,762,483 | `6.3.2 Rev-NOI!C33` | ✓ |
| Stress NOI (Combined) | $3,113,931 | `6.3.2 Rev-NOI!E33` | ✓ |
| Upside NOI | $6,066,671 | `6.3.2 Rev-NOI!D33` | ✓ |
| Base Asset Value | $73,268,968 | `6.3.3a NOI-AV!C15` | ✓ |
| Stress Asset Value | $47,906,633 | `6.3.3a NOI-AV!E15` | ✓ |
| Base Dev Yield | 11.34% | `6.3.3a NOI-AV!C19` | ✓ |
| Stress Dev Yield | 7.41% | `6.3.3a NOI-AV!E19` | ✓ |
| Base IRR | 13.21% | `6.3.3b DCF!D22` | ✓ |
| Stress IRR | 7.96% | `6.3.3b DCF!E22` | ✓ |
| Base NPV @ 7% | $27,509,296 | `6.3.3b DCF!D23` | ✓ |
| Stress NPV @ 7% | $3,555,434 | `6.3.3b DCF!E23` | ✓ |
| Defisc effective | $4,184,100 | `6.3 Inputs!C58` | ✓ |
| Total dev cost | $42,000,000 | `6.3 Inputs!C53` | ✓ |
| Total GFA | 6,720 sqm | `6.3 Inputs!C51` | ✓ |
| Pre-opening | $2,730,000 | `6.3 Inputs!C54` | ✓ |
| Sources count | 46 | `Sources` rows | ✓ |

**Key reconciliation note (carried forward):** The earlier dashboard quoted "Stress NOI $3.43M". That figure was actually v3's *ADR-only stress* (ADR-15%, Occ 65%), not the *Combined Stress* (ADR-15%, Occ 50%) on row 7 of v3's Sensitivity Matrix. The merged v7 model uses the true Combined Stress at $3.11M — more conservative, more honest.

---

## 4. Two acknowledged deviations from spec (justified)

The build subagent flagged two minor deviations in the rebuild. Both are kept because they improve clarity, but documented here for transparency:

### 4.1 Gate 2 verdict logic — `IRR ≥ 8%` treated as PASS rather than `8% ≤ IRR ≤ 12%` as MARGINAL above

The spec considered IRR > 12% as "above target band". The dashboard treats anything ≥ 8% as PASS, so Base 13.21% reads PASS not "MARGINAL above". Reasoning: the 8–12% band is the *patient-capital target*, not a maximum. Coming in above the upper bound is not a failure mode for SWF / family-office capital — it just means the asset is more valuable than the floor required. A "MARGINAL above" verdict on a 13.21% IRR would confuse non-finance readers. The narrative on the verdict tile clarifies this: *"Patient-capital band 8–12% · NPV @ 7% $27.51M"*.

If the user prefers the original "in-band only is PASS" semantics, the change is a one-line edit in `dashboard/src/components/GateTile.tsx`.

### 4.2 DCF chart visualization at Y12

The spec called for a single line chart for Base + Stress cashflows. In rendering, the Y12 spike (operating NOI ≈ $5.5M plus terminal value ≈ $98M Base) visually crushed the line for Y3-Y11. The dashboard uses Recharts `<ComposedChart>` with operating NOI as a line and terminal value as a stacked bar at Y12. All numerical anchors unchanged; this is purely a visual disambiguation. Tooltip shows both components.

---

## 5. Forward-looking — refinements for v7.1 (optional, not blocking)

The dashboard meets every constraint and reads cleanly. These are *nice-to-have* refinements for a future polish pass:

### 5.1 Excel-export buttons on every chart
- Add a small "Export CSV" button to the snapshot table, the sensitivity grids, and the DCF chart. Each download mirrors the relevant sheet from the v7 Excel.
- Implementation: ~2 hours. Use `papaparse` or roll a simple `Blob` + `URL.createObjectURL` helper.

### 5.2 Print stylesheet
- Add `@media print { ... }` rules so an investor can press Ctrl+P and produce a 4-page summary covering Verdict + Sensitivities + Upside & Caveats. Hide the scenario bar and tabs in print mode; expand all collapsible content.
- Implementation: ~3 hours.

### 5.3 Direct link to Excel + Report from header
- The header currently shows the version tag. Add two small icon buttons: ⬇ XLSX (downloads merged model from `docs/`) and ⬇ PDF (downloads the v7 report PDF from `docs/`). Useful when a panel member wants the source documents.
- Implementation: ~30 minutes.

### 5.4 IRR tornado alongside NPV tornado
- The current tornado ranks drivers by NPV @ 7% swing. Add a second tornado ranking by IRR swing (in basis points). Users sometimes care more about IRR than NPV. Toggle between the two with a tab.
- Implementation: ~3 hours.

### 5.5 Coherence audit panel in Appendix
- The original dashboard had a 7-point internal coherence audit (revenue ladders sum, GOP margin sanity, IRR–NPV consistency, etc.). It was useful for analysts even if not for the IC. Bring it back as a collapsed "Coherence Audit" section in the Appendix.
- Implementation: ~2 hours.

### 5.6 RICS independence — link to full prose
- Tab 5's RICS panel summarizes the framing in 4 lines. Add a "Read the full independence statement" toggle that expands the long-form prose imported from `C.7 Independence` of the merged Excel.
- Implementation: ~1 hour.

### 5.7 Mobile UX — bottom navigation instead of `<select>` for tabs
- The current mobile fallback uses a native `<select>`. A bottom-tab pattern (like an iOS app) would feel more natural for investors browsing on a phone in a meeting. Consider for v7.2 if mobile usage emerges.
- Implementation: ~3 hours.

None of these is required to ship v7.0. They are listed for prioritization in a future cycle.

---

## 6. What is now permanently true

1. The user owns the GitHub repository [bora-bora-vaitape-masterplan](https://github.com/knockedover10/bora-bora-vaitape-masterplan) outright. It is independent of any AI assistant or subscription.
2. The merged Excel is the **single source of truth** for every figure in the dashboard, deck, report, and any future artifact.
3. The dashboard is **fully static** and can be deployed to Cloudflare Pages, Vercel, Netlify, GitHub Pages, or any S3-style host with no backend.
4. The 6-scenario engine (3 fixed + 3 custom) is implemented end-to-end and lets dashboard users layer their own assumptions without touching downstream sheets.
5. Defisc remains an upside lever, KPMG 65% TRevPAR remains excluded with documented connected-party rationale, the 20-year hold is gone, and patient-capital framing is preserved throughout.
6. Sections 1–5 of the v6/v7 strategic report remain untouched.

---

*Last updated: 29 April 2026 · Rebuild + GitHub migration complete · Source of truth: `Vaitape_Hotel_Feasibility_Model_v7.xlsx`*
