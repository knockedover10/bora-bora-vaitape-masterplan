# Vaitape Dashboard — v7 Amendment Recommendations

**Live URL:** [vaitape-hotel-dashboard.pplx.app](https://vaitape-hotel-dashboard.pplx.app/)
**Reference artifacts:** `Vaitape_Hotel_Strategic_Report_v7.docx`, `Vaitape_Hotel_Feasibility_Model_v7.xlsx`, `Vaitape_Hotel_Strategic-Report_Slides__v7.pptx`
**Audit date:** 29 April 2026
**Verdict:** Dashboard requires amendment. Bones are sound; numbers, framing and information density need re-tiering.

---

## 1. Headline assessment

The dashboard does most of what an institutional feasibility tool should do — three-scenario switcher, full P&L, dual sensitivity grids, an inputs drawer for live editing, an internal coherence audit. It is more capable than the JLL and HVS investor portals you would benchmark against. **The intent — letting the user run scenarios live — is correct and must be preserved.**

What it gets wrong is signal-to-noise. Right now the dashboard treats every number as equally important, leaves the user to scroll through 15 stacked sections to find the verdict, and silently uses an old calibration. Top-tier consultancy dashboards (JLL Hotel Investment Outlook, HVS feasibility decks, CBRE Investor Insight) lead with 3 hero KPIs above the fold, push every secondary build-up to a tab or appendix, and ruthlessly hide what the IC member doesn't need to see in the first 30 seconds.

Three issues need fixing before this can sit alongside the v7 doc and deck:

1. **Numbers are out of date.** The dashboard is still on the pre-v7 calibration. Base IRR shows 12.5–12.6% (v7 says 13.2%), Stress IRR shows 8.9% (v7 says 9.1%), Base NOI rounds to $4.8M instead of the v7-exact $4,762,483, and the entire Defisc upside lever ($4.18M) is missing.
2. **Information overload on the front page.** Fifteen sections in a single scroll. The deck and the report both lead with the verdict, then the build-up. The dashboard should mirror that.
3. **Hold horizon includes 20-yr, which contradicts the report.** v7 explicitly retains the 12-year unleveraged DCF. The 20-yr column should go (per your direction).

---

## 2. Number reconciliation — must fix before anything else

| Metric | Dashboard now | v7 truth | Action |
|---|---|---|---|
| Base IRR | 12.5–12.6% | **13.21%** | Recalibrate — 0.6–0.7pp gap |
| Stress IRR | 8.9% | **9.10%** | Recalibrate — 0.2pp gap |
| Base NOI | "$4.8M" | **$4,762,483** | Display $4.76M, not $4.8M |
| Stress NOI | "$3.4M" | **$3,425,324** | Display $3.43M |
| Base NPV @ 7% | $27.6M ✓ | $27.5M | Match |
| Stress NPV @ 7% | $8.2M ✓ | $8.1M | Match |
| Base NPV @ 9% | "$15.3M" | **$16.4M** | Recalibrate (~$1.1M gap) |
| Stress NPV @ 9% | "−$0.5M" | **+$0.34M** | Sign flip — currently FAIL, should be marginal PASS |
| Base Asset Value | $73.3M ✓ | $73.27M | Match |
| Stress Asset Value | $52.7M ✓ | $52.70M | Match |
| Dev Yield Base / Stress | 11.3% / 8.2% ✓ | 11.34% / 8.16% | Match |
| Defisc effective | **MISSING** | $4.18M (cap binds) | **Add C.8 panel** |
| Stress Yield Spread | "1.7%" | **+1.7% (165 bps)** vs v7 says +170 bps | Match |
| Hero IRR text vs table | 12.6% vs 12.5% | n/a | Internal inconsistency to fix anyway |

The IRR/NPV gap is the most consequential: at 9% discount the dashboard says Stress NPV is **negative** (–$0.5M). The v7 model says it is **positive** ($0.34M, marginal). That single sign flip changes the verdict on Gate 2 and contradicts the deck. Whoever built the dashboard either used a slightly different ramp curve, terminal-value formula, or cost-phasing assumption. Recalibrate against the v7 Excel `6.3.3b DCF` sheet directly.

Also: change the "V3 PATIENT-CAPITAL" tag in the sub-header to **"V7 PATIENT-CAPITAL"**, and update the deck slides too — every footer still cites "Vaitape Hotel Feasibility Model v3."

---

## 3. Information architecture — what to surface, what to hide

I benchmarked against how [HVS feasibility studies](https://www.hvs.com/services/hospitality-feasibility-studies), JLL Hotel Investor Sentiment outputs, and consultancy IC dashboards (per [Hyperbots](https://www.hyperbots.com/glossary/assumption-sensitivity-tornado-chart) and [Deckary](https://deckary.com/blog/tornado-chart-powerpoint) on sensitivity-presentation conventions) typically structure the read. The pattern is consistent:

> **Front page = Verdict in 3 KPIs + the 3 viability gates. Everything else lives behind a tab.**

You currently have 15 sections in one scroll. I'd collapse them into **6 tabs** mirroring the v7 report sections, with one always-visible scenario-switcher header on top of every tab.

### Recommended tab structure

| Tab | Maps to v7 Report | What it contains | Why it earns the front-row seat |
|---|---|---|---|
| **1. Verdict** *(default)* | §6.2 Headline Verdict | 3 hero KPI tiles (IRR, Asset Value, Yield Spread) · 3 Viability Gates with PASS/FAIL · 1-line viability statement · scenario tabs at top | The IC question is "is this investable, yes/no?" Answer that in 5 seconds. |
| **2. Build-up** | §6.3.1 + 6.3.2 | Demand → Revenue → P&L → NOI waterfall · Inputs drawer trigger | Mirrors the deck's "How the Numbers Are Built" slide. |
| **3. Returns & DCF** | §6.3.3 | 12-yr cash-flow line chart · IRR bar by scenario · NPV table at 7/9/11% | The institutional underwriting page. |
| **4. Sensitivities** | §6.4 + §C.9 | ADR×Occ NOI grid · CapRate×OpCost asset-value grid · **NEW: tornado chart of top 7 drivers** | Tornado chart is the missing piece — see §4 below. |
| **5. Upside & Caveats** | §C.7 + §C.8 + §6.5 | Defisc $4.18M panel · KPMG independence note · excluded levers ledger | Makes the conservatism visible. Currently buried/missing. |
| **6. Appendix** | §6.3 Inputs + Space + Sources | Full inputs table · Space programme · References · Coherence audit | The "show your work" page nobody opens unless asked. |

### Information that should move to Appendix (your overload instinct is right)

These are currently on the front page and don't belong there:

- **Hold-Period Sensitivity table** (the 5/8/10/12/20-yr matrix) — interesting but secondary. Move to Appendix or to a collapsible "advanced view" inside the Returns tab.
- **Space Programme zone-by-zone table** — 18 rows of GFA detail. Belongs in Appendix.
- **Coherence audit (7-point)** — useful for the analyst, not the IC. Appendix.
- **Pre-opening cost band (Low/Mid/High)** — three rows for one assumption. Collapse into a single row showing the applied 6.5% with a tooltip footnote.

### Information that should be added to the front page

- **Three-Gate verdict panel** (Gate 1 Asset > Cost · Gate 2 IRR + NPV · Gate 3 Yield Spread ≥ 100 bps) — currently implicit in the KPIs but not framed as gates. The deck's slide 6.2 does this well; mirror it.
- **Defisc upside flag** as a single tile on the Verdict tab: "Upside lever held in reserve: +$4.18M effective tax credit, lifts Base Dev Yield from 11.3% → 12.6%." One sentence, links to the full C.8 page.

---

## 4. The missing chart — sensitivity tornado

You have two excellent 5×5 sensitivity grids. What you don't have is the chart top consultancies always lead the sensitivity discussion with: a **tornado chart** ranking the top 7–12 drivers by NPV impact ([Hyperbots best-practice guide](https://www.hyperbots.com/glossary/assumption-sensitivity-tornado-chart), [Deckary anatomy guide](https://deckary.com/blog/tornado-chart-powerpoint)).

A tornado chart answers the one question the IC asks immediately after seeing the verdict: *"Which assumption keeps you up at night?"*

For Vaitape, the tornado chart should rank these inputs by their NPV swing across a credible ±range:

| Variable | Suggested test range | Why it matters |
|---|---|---|
| ADR | $1,828 to $2,472 (−15% / +15%) | Largest single revenue lever |
| Occupancy | 50% to 75% | Demand-side resilience |
| Operating Cost Ratio | 67% to 78% | Operator-quality lever |
| Cap Rate (exit) | 5.5% to 7.5% | Capital-markets risk |
| TRevPAR uplift | 25% to 50% | Non-room mix dependency |
| Construction Cost / key | $1.0M to $1.4M | Build-cost overrun risk |
| NOI growth p.a. | 2% to 4% | Terminal-value driver |

Sorted top-to-bottom by absolute NPV swing, this single chart will tell the IC where to focus diligence in 5 seconds. The 5×5 grids stay — they show the full surface — but the tornado leads.

---

## 5. The 20-year hold — confirmed: drop it

Per your direction, the dashboard should retain the 12-year logic and remove the 20-year column. Three reasons this is correct:

1. **Methodological consistency:** v7 report and Excel both lock the 12-yr unleveraged DCF as the primary frame. The 20-yr column on the dashboard contradicts that.
2. **Industry convention:** [HVS](https://www.hvs.com/article/5456-How-to-Test-Hotel-Feasibility) explicitly recommends 5–10 year projection periods for feasibility ("most consultants use a five- to 10-year projection period"). 12-year is already long. 20-year strays into private-asset-fund territory and lets compounding NOI growth do too much work.
3. **The 5.25× equity-multiple bait:** The 20-yr column shows a 5.25× equity multiple, which is structurally misleading — it makes the deal look like a high-octane PE return when it isn't. Patient-capital framing is the whole point of v7. The 20-yr number undermines it.

**Action:** Delete the 20-yr column from the Hold-Period Sensitivity table. Keep 5/8/10/12. If you want one ultra-long-hold reference for SWF audiences, add a single line in the appendix: *"At a 15-year hold the equity multiple compounds to ~3.95×; the report and dashboard standardise on 12-yr per HVS feasibility convention."* Do not let it sit on the front page.

Also worth fixing: the cumulative cash-flow chart currently extends to **Y14**. Cap the x-axis at Y12 (or Y13 if you need to show the post-exit terminal-value distribution). Anything beyond Y12 contradicts the chosen hold.

---

## 6. Inputs drawer — keep, but tier it

The slide-in inputs panel is the right pattern — preserves scenario-modelling capability without cluttering the front page. Two refinements:

- **Group inputs by analytical layer**, not category. The deck and v7 doc are organised Demand → Revenue → NOI → Value. The inputs drawer should mirror that:
  1. Demand drivers (ADR, Occ, TRevPAR uplift)
  2. P&L drivers (OpEx ratio, mgmt fees, FF&E)
  3. Capital structure (build cost/key, pre-opening %)
  4. Valuation (cap rate, NOI growth, hold)
  5. Upside levers (toggle Defisc on/off — currently has no toggle)
- **Add a "Reset to v7 base" button** in the drawer header. Right now if a user fiddles with Custom Scenario they can lose calibration with no recovery.
- **Add a Defisc on/off toggle.** Currently no way to model Defisc effect at all. When ON, it should reduce the development-cost denominator by $4.18M and recompute Dev Yield + IRR. This is exactly the "upside lever held in reserve" the deck talks about — it should be a single click on the dashboard.

---

## 7. Visual & framing tightening

- **Sub-header tag:** Change "V3 PATIENT-CAPITAL" → "V7 PATIENT-CAPITAL" everywhere it appears (header, footers, source attributions in tooltips).
- **Hero text vs interactive table:** Hero says "Base IRR 12.6%", the table below says 12.5%. Pick one and synchronise. After recalibration both should read **13.2%**.
- **NPV @ 9.5%:** The summary table uses 9.5% as its discount rate. The report and Excel use 7%/9%/11% as the three reference points. Either align to 9% (institutional midpoint) or show all three — don't introduce a fourth rate.
- **Status-badge taxonomy:** The dashboard uses "Above Target", "Within Target", "≥ 10% Target". The v7 report frames it as PASS/FAIL on three named gates. Switch to PASS/FAIL on Gate 1 / Gate 2 / Gate 3. It's tighter and matches the deck.
- **GOP Margin shown identical for Base and Stress (both 28.0%):** Mathematically correct (cost ratio is constant) but visually it looks like a copy-paste bug. Add a small footnote: *"Margin is constant by design — opex scales with revenue."*

---

## 8. Slide-deck side-notes

The deck is solid — uses v7 numbers (NOI $4.76M, IRR 13.2%, NPV @ 7% $27.6M, 480 bps spread) and the v7 narrative (HVS framework, KPMG 65% excluded, patient-capital archetype). Two small hygiene fixes:

- **Every slide footer cites "Vaitape Hotel Feasibility Model v3"** — should read v7.
- **Slide 1 (cover):** says "Section 6". Consider also versioning it ("Section 6 · v7 · April 2026") for the boss/investor audience that will see this without the doc.
- **Slide 3 (Headline Verdict) and Slide 8 (Analytical Conclusions):** consistent with v7. No content change needed.

---

## 9. Suggested execution order

If you only do three things, do these in order — each one delivers a defensible artifact on its own:

1. **Recalibrate to v7 numbers** (IRR 13.2% / 9.1%, NOI $4.76M / $3.43M, NPV @ 9% sign flip, fix v3→v7 tags). Half a day. Without this the dashboard contradicts your own report.
2. **Add the Defisc panel + tornado chart, drop the 20-yr column.** One day. These three changes alone close the gap to consultancy-grade output.
3. **Tab restructure (Verdict → Build-up → Returns → Sensitivities → Upside & Caveats → Appendix).** Two days. This is the architectural fix; the 15-section scroll-page is the single biggest reason the dashboard doesn't yet match the polish of the deck.

Items 4–7 (input drawer tiering, status-badge re-taxonomy, visual hygiene) can be batched into a polish pass once the architecture is right.

---

## 10. What's already excellent and should not be touched

For balance — these elements work and shouldn't be disturbed in the rebuild:

- **Three-tab scenario switcher (Base / Stress / Custom)** — exactly the right pattern for a live model.
- **RICS Red Book independence panel** — KPMG 65% exclusion is well-framed and credible.
- **The dual sensitivity grids themselves** — values are mostly clean; just need the v7 recalibration applied.
- **The inputs drawer concept** — slide-in pattern preserves analytical depth without front-page clutter.
- **The internal coherence audit** — keep it, just move it to the Appendix.

The dashboard is closer to ready than its 15-section sprawl suggests. The fixes above are surgical, not structural — you keep the scenario engine, you keep the inputs drawer, you keep the calculation logic. You re-tier what's visible, you recalibrate to v7, you add the missing Defisc lever, and you drop the 20-yr horizon. That's enough to put it next to the deck and the doc as a coherent v7 trio.
