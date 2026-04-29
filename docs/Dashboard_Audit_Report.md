# Vaitape Ultra-Luxury Hotel: Feasibility Dashboard — Full Audit Report
**Audit Date:** 29 April 2026  
**Dashboard URL:** https://vaitape-hotel-dashboard.pplx.app/  
**Dashboard Version Header:** "BORA BORA NET-ZERO LUXURY MASTERPLAN · SECTION 6 · V3 PATIENT-CAPITAL"

---

## 1. OVERALL NAVIGATION STRUCTURE

The dashboard is a **single long-scroll page** (no top/side navigation bar). Navigation is provided by:

- **Scenario Selector Tabs** (near top, always visible): 3 tabs
  1. **Base Case** — Reference (default active)
  2. **Stress Case** — ADR −15% · Occ −10pp
  3. **Custom Scenario** — Editable sandbox
- **"☰ VIEW INPUTS" floating button** (bottom-right, sticky) — opens a slide-in "Model Inputs" panel
- Commentary note: "Click a tab to switch the live dashboard. The summary table below always shows all three."

The dashboard has **no top navigation, no sidebar**. All sections are stacked vertically in one page.

---

## 2. HERO / HEADER SECTION

**Section purpose:** Title banner with project identity and headline KPI teaser.

**Content:**
- Title: "Vaitape Ultra-Luxury Hotel: Feasibility Dashboard"
- Sub-heading: "BORA BORA NET-ZERO LUXURY MASTERPLAN · SECTION 6 · V3 PATIENT-CAPITAL"
- Headline summary text: *"Bankable with stress headroom for patient capital. Base IRR **12.6%** · Stress IRR **8.9%** at 12-yr hold — both clear the 8% institutional floor. The 12-yr hold is one of five tested (5 / 8 / 10 / 12 / 20-yr); shorter holds peak IRR at **15%** on a peak-ramp exit, longer holds compound to a **5.3×** equity multiple over twenty years."*
- Metadata badges: **35 Keys** | **USD 42M Dev Cost** | **1.5 ha Site** | **5 Holds Tested (5/8/10/12/20-yr)** | **April 2026 Pre-Concept Stage**

### ⚠️ V7 Mismatch — Hero Section
| Figure | Dashboard Shows | v7 Target | Match? |
|---|---|---|---|
| Base IRR (hero text) | **12.6%** | 13.2% | ❌ MISMATCH |
| Stress IRR (hero text) | **8.9%** | 9.1% | ❌ MISMATCH |
| Peak IRR (shorter hold) | **15%** | not specified | — |
| Equity multiple (20-yr) | **5.3×** | not specified | — |
| Dev Cost | **USD 42M** | $42M ✓ | ✅ |
| Keys | **35** | 35 ✓ | ✅ |

---

## 3. SCENARIO SELECTOR (TABS)

**Three tabs, always visible at top of interactive zone:**

| Tab | Label | Subtitle |
|---|---|---|
| 1 | Base Case | Reference |
| 2 | Stress Case | ADR −15% · Occ −10pp |
| 3 | Custom Scenario | Editable sandbox |

**Behaviour:** Selecting a tab updates the live dashboard panels. The summary table always shows all three simultaneously. Custom Scenario "inherits Base on first load, persists across sessions, and feeds the dashboard below when selected."

---

## 4. SCENARIO SUMMARY — "Three Scenarios at a Glance"

**Section purpose:** Comparative summary table for all three scenarios.

**Columns:** SCENARIO | IRR (UNLEVERED) | NPV @ 9.5% | EQUITY MULTIPLE | DEV YIELD | HOLD

### Full Table

| Scenario | IRR (Unlevered) | NPV @ 9.5% | Equity Multiple | Dev Yield | Hold |
|---|---|---|---|---|---|
| Base Case (Reference) | **12.5%** | **+USD 12.7M** | **3.44×** | **11.3%** | **12-yr** |
| Stress Case (ADR −15% · Occ −10pp) | **8.9%** ▼−3.7pp | **−USD 2.3M** ▼−USD 15.0M | **2.48×** ▼−0.97× | **8.2%** ▼−3.2pp | **12-yr** |
| Custom Scenario (Cloned from Base) | **12.5%** flat | **+USD 12.7M** flat | **3.44×** flat | **11.3%** flat | **12-yr** |

### ⚠️ V7 Mismatches — Scenario Summary
| Figure | Dashboard Shows | v7 Target | Match? |
|---|---|---|---|
| Base IRR (summary table) | **12.5%** | 13.2% | ❌ MISMATCH |
| Stress IRR | **8.9%** | 9.1% | ❌ MISMATCH |
| Base Dev Yield | **11.3%** | 11.3% ✓ | ✅ |
| Stress Dev Yield | **8.2%** | 8.2% ✓ | ✅ |

---

## 5. HEADLINE METRICS — "The Numbers That Matter"

**Section purpose:** Six KPI cards, each with Base and Stress values and a status badge.

| Metric | Base Value | Stress Value | Notes / Status Badge |
|---|---|---|---|
| Indicative IRR (12-yr) | **12.5%** | **8.9%** | "Both clear 8% institutional floor (patient-capital)" — **Above Target** |
| Total Revenue (Stabilised) | **USD 24.1M** | **USD 17.3M** | "RevPAR USD 1,398 · stress USD 1,005" |
| GOP Margin | **28.0%** | **28.0%** | "USD 6.7M GOP base · target 25–30%" — **Within Target** |
| NOI (Stabilised) | **USD 4.8M** | **USD 3.4M** | "Margin 19.8% base · 19.8% stress" |
| Development Yield | **11.3%** | **8.2%** | "Spread vs. cap rate: 4.8% base" — **≥ 10% Target** |
| Implied Asset Value | **USD 73.3M** | **USD 52.7M** | "Value creation +USD 31,268,969 base" — **Value Created** |

### ⚠️ V7 Mismatches — Headline Metrics
| Figure | Dashboard Shows | v7 Target | Match? |
|---|---|---|---|
| Base IRR | **12.5%** | 13.2% | ❌ MISMATCH |
| Stress IRR | **8.9%** | 9.1% | ❌ MISMATCH |
| Base NOI | **USD 4.8M** (≈$4,800,000) | $4,762,483 | ❌ MISMATCH (rounded up, ~+$37K) |
| Stress NOI | **USD 3.4M** | $3,425,324 | ⚠️ ROUNDED (could be $3.4M or $3.425M — displayed as $3.4M) |
| Base Asset Value | **USD 73.3M** | $73.3M ✓ | ✅ |
| Stress Asset Value | **USD 52.7M** | $52.7M ✓ | ✅ |
| Base Dev Yield | **11.3%** | 11.3% ✓ | ✅ |
| Stress Dev Yield | **8.2%** | 8.2% ✓ | ✅ |

---

## 6. INDEPENDENCE · RICS RED BOOK PANEL

**Section purpose:** Methodological note on TRevPAR premium sourcing.

**Content:**
- Section title: "TRevPAR Premium: 35% Conservative, KPMG-Adjacent Sources Excluded"
- Text: *"The base TRevPAR premium of **35%** is anchored to **STR Global** and **HVS** independent benchmark data. KPMG's **65%** figure — produced through Polynesia Consulting in collaboration with Henry Terou — is excluded from the headline IRR engine to avoid **circular validation**: the same advisor cannot both originate and verify a feasibility input. RICS Red Book independence rules require this firewall. The KPMG figure is preserved as a sensitivity reference, not a base assumption."*

### ⚠️ V7 Check
| Figure | Dashboard Shows | v7 Target | Match? |
|---|---|---|---|
| TRevPAR uplift (base) | **35%** | 35% ✓ | ✅ |
| KPMG figure (excluded) | **65%** | 65% ✓ (reference only) | ✅ |

This section correctly distinguishes base (35%) from excluded KPMG (65%).

---

## 7. RETURNS ANALYSIS — "IRR, Cumulative Cash Flow & NPV at Three Discount Rates"

**Section purpose:** Visual returns analysis across all five scenarios.

### Chart 1: "Indicative IRR by Scenario" (Horizontal Bar Chart)
- **Type:** Horizontal bar chart
- **X-axis:** IRR % (0% to ~22%), with **target band shaded 8–12%** (Horwath HTL APAC)
- **Y-axis (rows, top to bottom):** Upside | Base Case | Occupancy −10pp | ADR −15% | Combined Stress
- **Encoding:** Bar length = IRR value; green bars = within/above target; orange = below
- **Approximate values visible:**
  - Upside: ~21%
  - Base Case: ~12.5%
  - Occupancy −10pp: ~10–11%
  - ADR −15%: ~10–11%
  - Combined Stress: ~8.9%

### Chart 2: "Cumulative Cash Flow (Years 0–12)" (Line Chart)
- **Type:** Line chart with two series
- **X-axis:** Years Y0–Y14 (horizon extends to Y14 for terminal value visibility)
- **Y-axis:** USD (−USD 60M to +USD 120M)
- **Series:** Base Case (teal) | Combined Stress (red/salmon)
- **Key markers:** Construction outflows Y0–Y2 (30/40/30%); ramp Y3 50% · Y4 72% · Y5 90% · Y6+ 100%; Gordon terminal at Y12
- **"BREAKEVEN" dashed line** shown

### NPV Table: "NPV at Three Discount Rates — Patient-Capital DCF"
- **Commentary:** "NPV stays positive at the patient-capital floor (7%) in both base and stress cases. Stress turns negative at 9% institutional hurdle and worsens at 11%"

| Discount Rate | Investor Lens | Base Case NPV | Stress Case NPV |
|---|---|---|---|
| 7% | Patient capital floor | **+USD 27.6M** | **+USD 8.2M** |
| 9% | Institutional hurdle | **+USD 15.3M** | **−USD 0.5M** |
| 11% | Private-equity hurdle | **+USD 5.9M** | **−USD 7.1M** |

---

## 8. HOLD-PERIOD SENSITIVITY — "Five Tested Holds: 5 / 8 / 10 / 12 / 20-Year"

**Section purpose:** Compare returns across 5 different exit horizons.

**Commentary:** "Same operating cash flows, different exit years. Shorter holds maximise IRR by exiting at peak ramp before any renovation hits; longer holds maximise the equity multiple by compounding NOI growth across more years. The 12-yr patient-capital default sits between these two ends. Toggle Renovation Cycle in the drawer (off / 7 / 8 / 9 / 10) to test capex timing."

### Hold-Period Sensitivity Table

| Metric | 5-yr | 8-yr | 10-yr | 12-yr (CHOSEN) | 20-yr |
|---|---|---|---|---|---|
| IRR (Unlevered) | **15.0% ★** | **13.5%** | **12.9%** | **12.5%** | **11.8%** |
| NPV @ 9.5% Discount | +USD 12.7M | +USD 12.7M | +USD 12.7M | +USD 12.7M | +USD 12.7M |
| Equity Multiple | **2.18×** | **2.69×** | **3.06×** | **3.44×** | **5.25× ★** |

**Analytical notes:**
- ★ Best IRR at 5-yr hold (15.0%) — shorter holds exit at peak ramp before renovation hits
- ★ Best EM at 20-yr hold (5.25×) — longer holds compound NOI growth
- NPV @ 9.5% is hold-period invariant at current inputs (discount rate minus NOI growth ≈ constant)

### ⚠️ V7 Mismatch
| Figure | Dashboard Shows | v7 Target | Match? |
|---|---|---|---|
| Base IRR at 12-yr | **12.5%** | 13.2% | ❌ MISMATCH |
| Peak IRR (5-yr hold) | **15.0%** | not specified | — |

---

## 9. REVENUE & OPERATIONS

### "Revenue Waterfall & Gross Floor Area Allocation"
- Two sub-charts side by side
- **Left:** Revenue → NOI Waterfall (Base Case) — waterfall chart from Total Annualised Revenue down to NOI
- **Right:** GFA Allocation by Zone — 6,720 sqm total programme across seven zones (pie or bar chart)

### "RevPAR & TRevPAR Across Scenarios" (Revenue Projections Table)

**Columns:** 5 scenarios side by side (Upside, Base, Occ −10pp, ADR −15%, Combined Stress)

**Rows:**
- ADR (USD/night)
- Occupancy (%)
- RevPAR (USD/night)
- Annualised Room Revenue
- TRevPAR (USD/night)
- Total Annualised Revenue

**Values visible from P&L section:**
- Stress Total Annualised Revenue: **USD 17.3M**
- Base (shown in P&L): contextually **USD 24.1M** (from headline metrics; P&L shows Stress tab context = USD 17.3M)

---

## 10. OPERATING P&L — "Stabilised P&L: Base vs. Combined Stress"

**Section purpose:** Full P&L from revenue to NOI.

### P&L Table (values captured when Stress Case tab active)

| Line Item | Base Case | Combined Stress |
|---|---|---|
| Total Annualised Revenue | USD 17.3M | USD 12.1M |
| Room Revenue | USD 12.8M | USD 8.9M |
| Non-Room Revenue | USD 4.5M | USD 3.1M |
| Total Operating Costs | USD 12.5M | USD 8.7M |
| Gross Operating Profit (GOP) | USD 4.9M | USD 3.4M |
| GOP Margin | 28.0% | 28.0% |
| Mgmt Fee — Base | USD 520,039 | USD 361,884 |

*(Note: The P&L table appeared to show the Stress scenario perspective — "Base Case" column here = the active scenario context. Values match Stress case revenue numbers shown elsewhere when Stress tab is selected.)*

**NOI row** was in the scroll-past section; from headline metrics: **Base NOI = USD 4.8M**, **Stress NOI = USD 3.4M**. From Investment KPIs table: **Stabilised NOI Base = USD 4.8M**, **Stabilised NOI Stress = USD 3.4M**.

---

## 11. FEASIBILITY KPIs — "Investment Metrics: Yield, Asset Value, IRR"

**Section purpose:** Investment yield, value creation, IRR, pre-opening costs.

### Table (Base Case | Combined Stress)

| Metric | Base Case | Combined Stress |
|---|---|---|
| Stabilised NOI | **USD 4.8M** | **USD 3.4M** |
| Total Development Cost | **USD 42.0M** | **USD 42.0M** |
| Capitalisation Rate | **6.5%** | **6.5%** |
| Development Yield (NOI ÷ Dev. Cost) | **11.3%** | **8.2%** |
| Yield-on-Cost Spread (vs Cap Rate) | **4.8%** | **1.7%** |
| Implied Asset Value at Stabilisation | **USD 73.3M** | **USD 52.7M** |
| Value Creation over Dev. Cost | **+USD 31,268,969** | **+USD 10,697,297** |
| Value Creation Margin | **74.4%** | **25.5%** |
| NOI Year 3 — soft opening (50% ramp) | **USD 2.4M** | **USD 1.7M** |
| Pre-Opening — Low (5%) | USD 2,100,000 | USD 2,100,000 |
| Pre-Opening — Mid (6.5%) | USD 2,730,000 | USD 2,730,000 |
| Pre-Opening — High (8%) | **USD 3,360,000** | **USD 3,360,000** |

*(NOI Year 12 and Terminal Value rows not fully captured but visible in section)*

### ⚠️ V7 Checks — Feasibility KPIs
| Figure | Dashboard Shows | v7 Target | Match? |
|---|---|---|---|
| Base NOI | **USD 4.8M** (≈$4,800,000) | $4,762,483 | ❌ MISMATCH (~$37K higher than v7) |
| Stress NOI | **USD 3.4M** | $3,425,324 | ⚠️ Close but rounded |
| Cap Rate | **6.5%** | 6.5% ✓ | ✅ |
| Base Asset Value | **USD 73.3M** | $73.3M ✓ | ✅ |
| Stress Asset Value | **USD 52.7M** | $52.7M ✓ | ✅ |
| Base Dev Yield | **11.3%** | 11.3% ✓ | ✅ |
| Stress Dev Yield | **8.2%** | 8.2% ✓ | ✅ |
| Dev Cost | **USD 42.0M** | $42M ✓ | ✅ |

---

## 12. SENSITIVITY ANALYSIS — "Two-Way Sensitivity: Operating & Capital-Markets Risk"

**Section purpose:** Dual sensitivity grids for operational and capital-markets risk.

### Left Grid: "NOI Sensitivity — ADR × Occupancy"
- **Axes:** ADR rows (5 levels) × Occupancy columns (5 levels)
- **Shading:** Green ≥ 10% yield, amber 8–10%, red below 8%
- **ADR rows:** ADR −15% (USD 1,828) | ADR −10% (USD 1,935) | ADR Base (USD 2,150) | ADR +10% (USD 2,365) | ADR +15% (USD 2,472)
- **Occupancy columns:** OCC 45% | OCC 50% | OCC 55% | OCC 65% | OCC 75%

Full grid values:
| ADR \ OCC | 45% | 50% | 55% | 65% | 75% |
|---|---|---|---|---|---|
| ADR −15% (1,828) | USD 2.8M / 6.7% | USD 3.1M / 7.4% | USD 3.4M / 8.2% | USD 4.0M / 9.6% | USD 4.7M / 11.1% |
| ADR −10% (1,935) | USD 3.0M / 7.1% | USD 3.3M / 7.9% | USD 3.6M / 8.6% | USD 4.3M / 10.2% | USD 4.9M / 11.8% |
| ADR Base (2,150) | USD 3.3M / 7.9% | USD 3.7M / 8.7% | USD 4.0M / 9.6% | USD 4.8M / 11.3% | **USD 5.5M / 13.1% (BASE)** |
| ADR +10% (2,365) | USD 3.6M / 8.6% | USD 4.0M / 9.6% | USD 4.4M / 10.6% | USD 5.2M / 12.5% | USD 6.0M / 14.4% |
| ADR +15% (2,472) | USD 3.8M / 9.0% | USD 4.2M / 10.0% | USD 4.6M / 11.0% | USD 5.5M / 13.0% | USD 6.3M / 15.0% |

**⚠️ NOTE:** The BASE cell in the NOI sensitivity grid shows **USD 4.8M / 11.3% yield at ADR Base / OCC 65%** which is the true base case. However, there is an inconsistency: the grid shows the base at OCC 65%, and at OCC 75% with ADR Base the NOI is **USD 5.5M / 13.1%**. The "BASE" highlight appears at the ADR Base / OCC 65% cell = USD 4.8M. The v7 target of $4,762,483 doesn't perfectly match USD 4.8M (rounds to same but not exact).

### Right Grid: "NPV Sensitivity — Discount Rate × Exit Cap"
- **Axes:** 7 discount rates × 5 exit cap rates
- **Shading:** Green ≥ USD 5M, amber 0–5M, red negative

| Disc Rate \ Exit Cap | 5.5% | 6.5% | 7.5% | 8.5% | 9.5% |
|---|---|---|---|---|---|
| 7.0% | +USD 34.4M | +USD 27.6M | +USD 22.7M | +USD 18.9M | +USD 15.9M |
| 8.0% | +USD 27.0M | +USD 21.1M | +USD 16.8M | +USD 13.4M | +USD 10.8M |
| 9.0% | +USD 20.5M | +USD 15.3M | +USD 11.5M | +USD 8.6M | +USD 6.3M |
| **9.5% (Model)** | +USD 17.6M | **+USD 12.7M (BASE)** | +USD 9.2M | +USD 6.4M | +USD 4.3M |
| 10.0% | +USD 14.9M | +USD 10.3M | +USD 6.9M | +USD 4.4M | +USD 2.3M |
| 11.0% | +USD 9.9M | +USD 5.9M | +USD 2.9M | +USD 0.6M | −USD 1.2M |
| 12.0% | +USD 5.5M | +USD 1.9M | −USD 0.7M | −USD 2.7M | −USD 4.2M |

---

## 13. SPACE PROGRAMME — "Gross Floor Area Allocation"

**Section purpose:** Detailed GFA by zone and use.

| Zone | Area |
|---|---|
| **ACCOMMODATION (53.0% of GFA)** | |
| Harbour Lagoon Villas — 8 × 130 sqm | 1,040 sqm |
| Garden Courtyard Villas — 8 × 100 sqm | 800 sqm |
| Compact Boardwalk Villas — 8 × 80 sqm | 640 sqm |
| Sky Suites — 6 × 70 sqm | 420 sqm |
| Premium Rooms — 5 × 50 sqm | 250 sqm |
| **F&B (7.7% of GFA)** | |
| Te Rai Fine Dining (50 covers) | 165 sqm |
| Fare Motu Harbour Bar + Pool Deck (20 seats) | 255 sqm |
| Pearl Table Private Dining (12 covers) | 100 sqm |
| **SPA & WELLNESS (5.4% of GFA)** | |
| 6 Treatment Rooms (30 sqm each) | 180 sqm |
| Wet Circuit + Relaxation + Reception | 180 sqm |
| **CULTURAL & PROGRAMMING (10.3% of GFA)** | |
| Te Tumu Cultural Gallery + Pearl Atelier | 150 sqm |
| Beachside Lounge + Lagoon Pool | 240 sqm |
| Communal Marae (Sunken Garden) | 300 sqm |
| **ARRIVAL & PUBLIC SPACES (2.6%)** | |
| Arrival Lobby + Cultural Salon | 175 sqm |
| **BACK-OF-HOUSE (7.0%)** | |
| Kitchens, Laundry, Staff Areas, Offices | 470 sqm |
| **INFRASTRUCTURE (14.0%)** | |
| MEP, Plant Room, Structure, Circulation | 943 sqm |
| **TOTAL** | **6,720 sqm** |

---

## 14. INTERNAL COHERENCE — "Seven-Point Coherence Audit"

**Section purpose:** Automated internal consistency check.

All 7 checks pass:

| # | Check | Result |
|---|---|---|
| 1 | Space programme supports concept offering | ✅ Pass |
| 2 | 35-key count supports revenue modelling (GFA = 35 × 192 = 6,720 sqm) | ✅ Pass |
| 3 | Development cost aligns with GFA (USD 42.0M ÷ 6,720 sqm = USD 6,250/sqm) | ✅ Pass |
| 4 | GOP margin aligns with operator standards (28.0%, target 25–30%) | ✅ Pass |
| 5 | Plot ratio supports experiential design (0.45, ~55% open landscape) | ✅ Pass |
| 6 | Operator shortlist aligned with USP (Capella, Six Senses, Rosewood, Aman) | ✅ Pass |
| 7 | FM27 policy alignment documented (Section 4.3) | ✅ Pass |

**Overall Verdict:** "All seven coherence checks pass. Model is internally consistent at current inputs. Ready for senior review and operator validation."

---

## 15. MODEL INPUTS PANEL

**Accessed via:** "☰ VIEW INPUTS" floating button. Opens as a right-side drawer. Note: Base Case is read-only — must "Switch to Custom" to edit.

**Input Categories and Values (Base Case):**

### PROPERTY
| Input | Value |
|---|---|
| Number of Keys | **35** |
| Site Area (sqm) | **15,000** |
| GFA per Key (sqm) | **192** |

### REVENUE
| Input | Value |
|---|---|
| Stabilised ADR (USD/night) | **2,150** |
| Stabilised Occupancy (%) | **65.00** |
| TRevPAR Premium over RevPAR (%) | **35.00** |

### OPERATING COSTS
| Input | Value |
|---|---|
| Operating Cost Ratio (% of Revenue) | **72.00** |
| Mgmt Fee — Base (% of Revenue) | **3.00** |
| Mgmt Fee — Incentive (% of GOP) | **8.00** |
| Capex Reserve (% of Revenue) | **3.00** |

### DEVELOPMENT
| Input | Value |
|---|---|
| Development Cost per Key (USD) | **1,200,000** |

### VALUATION
| Input | Value |
|---|---|
| Capitalisation Rate (%) | **6.50** |
| NOI Growth p.a. Post-Stab. (%) | **3.00** |
| Hold Period (years) | **12** |
| Renovation Cycle (yrs, 0 = off) | **0** |
| Renovation Capex (% of Revenue) | **12.00** |

**Live Preview (Base Case):**
- IRR: **12.5%**
- NOI: **USD 4.8M**
- Dev Yield: **11.3%**
- Asset Value: **USD 73.3M**

### ⚠️ V7 Checks — Inputs Panel
| Input | Dashboard Value | v7 Target | Match? |
|---|---|---|---|
| Development Cost per Key | **$1,200,000** | $1.2M ✓ | ✅ |
| Keys | **35** | 35 ✓ | ✅ |
| Total Build Cost (35 × $1.2M) | **$42M** | $42M ✓ | ✅ |
| Cap Rate | **6.50%** | 6.5% ✓ | ✅ |
| TRevPAR Premium | **35.00%** | 35% ✓ | ✅ |
| Occupancy | **65%** | — | — |
| ADR | **$2,150** | — | — |

---

## 16. ABSENT / NOT FOUND IN DASHBOARD

The following v7 figures were checked but **NOT FOUND** in any section:

| V7 Figure | Status |
|---|---|
| Defisc effective **$4.18M** | ❌ NOT PRESENT anywhere in dashboard |
| Base NOI exact **$4,762,483** | ❌ Shown as rounded "$4.8M" — does not match |
| Base IRR **13.2%** | ❌ Dashboard shows 12.5–12.6% throughout |
| Stress IRR **9.1%** | ❌ Dashboard shows 8.9% throughout |

---

## 17. COMPREHENSIVE V7 NUMBER AUDIT

### Summary: Numbers That DO Match v7
✅ Base Asset Value: **USD 73.3M**  
✅ Stress Asset Value: **USD 52.7M**  
✅ Base Dev Yield: **11.3%**  
✅ Stress Dev Yield: **8.2%**  
✅ Cap Rate: **6.5%**  
✅ Build Cost: **$42M** (35 keys × $1.2M)  
✅ TRevPAR uplift: **35%** (NOT 65%; 65% is correctly excluded as KPMG reference)  

### Summary: Numbers That DO NOT Match v7
❌ **Base IRR: dashboard 12.5–12.6% vs. v7 13.2%** — gap of ~0.6–0.7pp  
❌ **Stress IRR: dashboard 8.9% vs. v7 9.1%** — gap of 0.2pp  
❌ **Base NOI: dashboard ~$4.8M vs. v7 $4,762,483** — slight rounding discrepancy (~$37K)  
❌ **Stress NOI: dashboard ~$3.4M vs. v7 $3,425,324** — rounded down, ~-$25K  
❌ **Defisc effective $4.18M: not present anywhere in the dashboard**  

---

## 18. DCF / PROJECTION TIME HORIZON

- **Primary hold period:** **12 years** (default)
- **Tested holds:** 5 / 8 / 10 / **12** / 20 years
- **Charts show:** Years Y0–Y14 (to capture terminal value at Y12 exit + 2 additional years shown)
- **Terminal value method:** Gordon Growth Model — NOI_Y13 ÷ Cap Rate
- **Construction phase:** Y0–Y2 (30/40/30% phasing)
- **Ramp:** Y3 50% · Y4 72% · Y5 90% · Y6+ 100%

**The dashboard is primarily a 12-year DCF, tested across 5/8/10/12/20-year scenarios. It is NOT a 10, 15, or 20-year primary model — 12-year is the default.**

---

## 19. POTENTIAL PRE-V7 / STALE FIGURES

The following elements appear potentially inconsistent with v7 targets:

1. **Hero text states "Base IRR 12.6%"** while the interactive table shows 12.5% — minor discrepancy within the same dashboard (hero text may be from an earlier calculation or slightly different rounding)
2. **Base NOI displayed as USD 4.8M** — v7 specifies $4,762,483 which rounds to $4.76M, not $4.8M. The "$4.8M" rounding suggests the underlying model may be using a slightly different input or the rounding threshold differs.
3. **IRR values (12.5–12.6% vs. v7 13.2%)** — the gap is substantial (~0.6pp). This is the most significant mismatch and suggests the dashboard model has not been updated to the v7 IRR calculations.
4. **Stress IRR (8.9% vs. v7 9.1%)** — 0.2pp gap. Smaller but still inconsistent.
5. **No Defisc section** — the "Défiscalisation effective $4.18M" figure referenced in v7 does not appear anywhere in the dashboard.

---

## 20. SCREENSHOT FILE LOCATIONS (Workspace)

Screenshots were captured during the audit. Key sections documented:

- Hero/header section
- Scenario tabs + summary table  
- Headline metrics (6 KPI cards)
- Returns analysis charts (IRR bar chart, cumulative cash flow line chart)
- Hold-period sensitivity table
- P&L table (Operating P&L)
- Investment KPIs table (Feasibility KPIs)
- Sensitivity analysis dual grids
- Coherence audit (7-point)
- Model Inputs panel (all input groups)

---

*End of Audit Report*
