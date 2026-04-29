# v3 → v7 Merge Diagnostic — Findings & Decisions Needed

## TL;DR

**The good news:** all the *core financial numbers* (NOI $4.76M / $3.43M, IRR 13.2% / 9.1%, NPV at 7/9/11%, asset value $73.3M / $52.7M, dev yield 11.3% / 8.2%, Defisc $4.18M) are **identical** in v3 and v7. There are zero numerical contradictions on the headline metrics — v7 was deliberately calibrated to v3.

**The bad news:** the two workbooks have very different *content envelopes*:

- **v3** is rich in **prose, sources, classification flags, and rationale** (e.g. Assumptions sheet has 44 rows × 12 cols of explanation per input; Sources sheet has a long-form independence note plus 18 source rows with full URLs)
- **v7** is rich in **structure, sensitivity matrices, and viability gates** (Verdict tab with 3-Gate logic; new C.9 Cap-Rate × OpCost matrix; cleaner section-by-section build-up mirroring the report)

Each contains material the other excludes. Merging them gives you the single source of truth.

---

## Sheet-by-sheet mapping

| v3 Sheet | v7 Sheet | Overlap? | Recommendation |
|---|---|---|---|
| Overview | Cover + 6.2 Verdict | **Heavy overlap** but v3 has a richer narrative table; v7 has the 3-Gate test | **Merge:** keep v7 Cover + Verdict structure, port v3's "Key Metrics Snapshot" 13-row table into Verdict as a "snapshot" panel |
| Assumptions | 6.3 Inputs | **Heavy overlap** — same 25+ inputs | **Merge:** use v7 layout (cleaner, includes ramp + discount-rate inputs) but fold in v3's longer prose where v3's is more detailed |
| RevPAR & Revenue | 6.3.1 Demand-Rev | **Partial** — v3 shows 5 scenarios (Upside/Base/ADR-stress/Occ-stress/Combined); v7 shows only Base + Combined Stress | **Decision needed — see Contradiction #1 below** |
| P&L Model | 6.3.2 Rev-NOI | Direct overlap — same numbers | **Use v7** (formula-driven from Inputs); port v3's source-citation column into v7 |
| Feasibility KPIs | 6.3.3a NOI-AV + 6.3.3b DCF + C.8 Defisc | v3 packs everything into one sheet; v7 splits into three | **Use v7** split — it mirrors the report; port v3's Pre-Opening Cost Low/Mid/High band into a footnote on 6.3.3b DCF |
| NPV & IRR | 6.3.3b DCF | Direct overlap — same cash flows, same IRR/NPV | **Use v7** (formula-driven); port v3's prose methodology lines (Y0=30% etc.) into v7 |
| Sensitivity Matrix | 6.4 ADR-Occ | Direct overlap — same 5×5 grid, same values | **Use v7** (formula-driven); port v3's GREEN/GOLD/RED legend + minimum-investable cell narrative |
| — | C.9 CapRate-OpCost | **v7 only** — does not exist in v3 | **Keep — v7 only** |
| — | C.7 Independence | **v7 only** as a dedicated sheet (v3 has it embedded inside Sources) | **Keep — v7 dedicated sheet**, but fold in v3's longer prose statement |
| Space Programme | Space Programme | **Major contradiction — see Contradiction #2 below** | **Decision needed** |
| Sources | Sources | **Both rich, different formats** — see Contradiction #3 | **Decision needed** |

---

## Contradictions to resolve

### Contradiction #1 — RevPAR scenarios: 5 (v3) vs 2 (v7)

**v3 shows 5 scenarios** in the RevPAR & Revenue tab:
- Upside (ADR $2,472, Occ 72%)
- Base (ADR $2,150, Occ 65%)
- ADR Stress only (–15% ADR, Base Occ)
- Occ Stress only (Base ADR, Occ 55%)
- Combined Stress (–15% ADR, Occ 50%)

**v7 shows only 2 scenarios** in 6.3.1 Demand-Rev: Base and Combined Stress.

**Note:** v7's 6.4 ADR-Occ matrix already covers the full 5×5 surface, which arguably *replaces* the 5-scenario column view. But v3's view shows the analyst what the single-axis stresses look like in isolation (occ stress alone vs ADR stress alone), which the matrix doesn't surface as cleanly.

**My recommendation:** keep v7's 2-column primary view (matches the report), but add a small "Scenario Comparison" panel below row 17 of 6.3.1 Demand-Rev showing the 5 v3 scenarios as a reference table. Best of both.

→ **Question for you:** Keep all 5 scenarios as a reference panel, OR drop the single-axis stresses (ADR-only / Occ-only) and only keep Upside + Base + Combined Stress (3 scenarios)?

---

### Contradiction #2 — Space Programme

**v3 Space Programme** (45 rows): zone-by-zone breakdown — Accommodation 3,150 sqm (5 villa types), F&B 520 sqm (3 outlets), Spa 360 sqm, Cultural 690 sqm, Arrival 175 sqm, BOH 470 sqm, Infrastructure 943 sqm. **Totals correctly to 6,720 sqm.** Every zone has a benchmark source (Penner / HVS / CBRE / ISPA / Capella).

**v7 Space Programme** (19 rows): high-level component lumps — but the **subtotal formulas are broken** (`=C7*D7` in row 8 references row 7 which is empty, so subtotals show 0). There is no totalling row. Fundamentally non-functional.

**My strong recommendation:** **discard v7's broken Space Programme entirely; use v3's detailed, sourced, working version.** Already structured exactly the way a feasibility-grade space programme should look.

→ **Question for you:** OK to discard v7 Space Programme and use v3's? Or do you want me to keep v7's high-level lumps and add v3's zone detail beneath?

---

### Contradiction #3 — Sources sheet

**v3 Sources** (18 numbered rows + long independence-note prose at top): grouped by Category column (Consultancy / Data Provider / Academic / Industry Standard / Market Data / Legal). Includes the full RICS Red Book independence statement as a multi-paragraph prose block.

**v7 Sources** (39 numbered rows): more references (39 vs 18), tighter format, mirrors the docx report's Master References. Loses the long-form independence statement (it's now in C.7 Independence as a separate sheet).

**Overlapping references:** ~14 sources appear in both (HVS Dev Cost Survey 2024, JLL APAC, Horwath, STR, KPMG, Penner, EHL, ISPA, CBRE, Four Seasons, St. Regis, Banque de Polynésie, Légifrance Art. 199 undecies B, Bora Bora Municipality).

**v3-only sources** (~4): HVS Hotel Valuation & Market Study (Luxury Resort), HVS Management Agreement Trends, Cornell/deRoos Hotel Programming, DeLaSalle Hotel Space Allocations. (HVS Mgmt Agreement *is* in v7 — row 10. The other 3 are v3-only.)

**v7-only sources** (~25): RICS Red Book, JLL APAC 2024, Horwath APAC 2024, Maslow 1943, Yeoman & McMahon-Beattie 2013, Hu & Trivedi 2020, GlobalData Polynesia Tourism, ISPF Tourisme, Allied Market Research Cultural Tourism, Capella, Aman, Six Senses, One&Only, AHLA, Surbana Jurong, ResearchGate/SSRN, etc.

**My recommendation:** **use v7 Sources as the structural base** (it's broader and cleaner) → **add the 3 v3-only sources** that aren't already there → **port v3's long-form independence note** into the C.7 Independence sheet as additional prose. Net result: a single Sources sheet with ~42 references and a richer independence sheet.

→ **Question for you:** Approved? Or do you want the v3 grouping-by-category preserved (with a Category column added to the merged Sources sheet)?

---

### Contradiction #4 — Hold Period (10 vs 12)

**v3 Inputs** says "Hold Period (years) = 10" but the **DCF schedule actually runs 12 years** (Y0–Y12 with terminal value at Y12). This is an internal v3 inconsistency — the input cell says 10 but the model runs 12.

**v7 Inputs** also says "Hold Period (years) = 10" and the DCF runs 12 years.

→ Same inconsistency carried across. The IRR/NPV are correct (12-yr unleveraged DCF as labelled in the sheet titles); only the input cell value is misleading.

**My recommendation:** Change the Inputs cell to **12 years** so it matches the actual model. Or rename the input "Stabilised Hold Reference (years)" and add a separate "DCF Period" cell at 12. Easier: just change to 12.

→ **Question for you:** Change to 12, or leave at 10 and add a clarifying note?

---

### Contradiction #5 — minor numeric labels

| Item | v3 says | v7 says | Reality |
|---|---|---|---|
| Stress NPV @ 9% | "+USD 396,491" / "$0.4M" | "+$0.34M" | **Same number** ($340–397K marginal positive). Use the recalc'd Excel value. No real contradiction. |
| Stress yield spread | "+1.7% (165 bps)" | "+170 bps" | **Same number rounded differently**. Use precise computed value. |
| Defisc effective | "$4,184,100" | "$4,184,100" | Identical. |

All resolved by using formula-driven recalc.

---

## Proposed merged workbook structure

```
Vaitape_Hotel_Feasibility_Model_v7_MERGED.xlsx
├── Cover                            (v7 base + v3 nav table)
├── 6.2 Verdict                      (v7 + v3 13-row Key Metrics Snapshot panel)
├── 6.3 Inputs                       (v7 base + v3 longer prose where richer)
├── 6.3.1 Demand-Rev                 (v7 base + 5-scenario reference panel)
├── 6.3.2 Rev-NOI                    (v7 base + v3 source-cite column)
├── 6.3.3a NOI-AV                    (v7 unchanged)
├── 6.3.3b DCF                       (v7 base + v3 prose methodology rows)
├── 6.4 ADR-Occ                      (v7 base + v3 GREEN/GOLD/RED legend)
├── C.7 Independence                 (v7 base + v3 long-form RICS independence statement)
├── C.8 Defisc                       (v7 unchanged)
├── C.9 CapRate-OpCost               (v7 unchanged — v7 only)
├── Space Programme                  (v3's detailed version replacing v7's broken one)
└── Sources                          (v7 base + 3 v3-only refs, optionally with Category column)
```

13 sheets — same count as v7 today.

---

## What I'm asking before I build

1. **Q1 (Scenario count in 6.3.1 Demand-Rev):** Keep all 5 v3 scenarios as a reference panel, or simplify to 3 (Upside / Base / Combined Stress)?
2. **Q2 (Space Programme):** OK to fully replace v7's broken one with v3's detailed version?
3. **Q3 (Sources):** Use v7 base + add 3 v3-only refs (my recommendation), or preserve v3's Category grouping in the merged sheet?
4. **Q4 (Hold Period):** Change Inputs cell from 10 → 12 years to match the actual DCF, or add a clarifying note?

I have working answers as my recommendations above. Confirm or override and I'll build.
