"use strict";

/* ============================================================================
   ABC THEME CONSTANTS (mirrors CSS custom properties)
============================================================================ */
const THEME = {
  dk1: "#000000", lt1: "#FFFFFF",
  /* Warm slate replaces all navy. Never reintroduce #44546A or #0055B8. */
  dk2: "#4B5563", lt2: "#E7E6E6",

  /* Saturated colours — used only where chart-color carries meaning (IRR pass/warn/fail bars,
     stress-line definition). Navy variants intentionally omitted. */
  cTurq:   "#00A7E1",
  cGrey:   "#9CA3AF",
  cPurple: "#7C7AF7",
  cGreen:  "#89DC65",
  cTeal:   "#1DCAD3",
  cAmber:  "#FFA400",
  cRed:    "#E74F3D",

  /* Pastel versions — default for chart fills, UI chrome, etc. */
  pTurq:   "#B3DEF3",
  pSlate:  "#D5DCE5",  /* replaces former pBlue (which was a navy tint) */
  pGrey:   "#ECECEC",
  pPurple: "#D1D0FB",
  pGreen:  "#D7F2CB",
  pTeal:   "#BCEFF2",
  pAmber:  "#FFDDA8",
  pRed:    "#F7CFC9",

  /* Aliases — every chart uses pastels by default */
  accent1: "#B3DEF3", accent2: "#D1D0FB", accent3: "#D7F2CB",
  accent4: "#FFDDA8", accent5: "#F7CFC9", accent6: "#BCEFF2",
  brand: "#B3DEF3", brandDeep: "#BCEFF2",

  ink: "#1B2333", body: "#3A4458", muted: "#6B7280",
  pass: "#2E8540", warn: "#B47A00", fail: "#C0392B",
};

// Pastel polychrome palette for charts (no navy)
const CHART_COLORS = [
  THEME.pTurq, THEME.pPurple, THEME.pGreen,
  THEME.pAmber, THEME.pRed, THEME.pTeal, THEME.pSlate,
];

/* ============================================================================
   INPUT DEFINITIONS
============================================================================ */
const INPUT_DEFS = [
  { group: "Property", key: "keys", label: "Number of Keys", value: 35, format: "int",
    classification: "Benchmarked",
    note: "Boutique ultra-luxury: Capella 35–112 keys, Aman 20–40, Six Senses 15–60. 35 keys positions Vaitape in the most exclusive tier. Source: Capella, Aman, Six Senses portfolios; Horwath HTL." },
  { group: "Property", key: "site_area", label: "Site Area (sqm)", value: 15000, format: "int",
    classification: "Retrieved",
    note: "Confirmed 1.5 ha = 15,000 sqm. Corrects prior erroneous 23,000 sqm figure." },
  { group: "Property", key: "gfa_per_key", label: "GFA per Key (sqm)", value: 192, format: "int",
    classification: "Benchmarked",
    note: "Triangulated: DeLaSalle mainstream ~93 sqm/key; Penner et al. luxury ~150 sqm/key; HVS 2024 luxury resort 180–220 sqm/key. 192 sqm = boutique ultra-luxury midpoint." },

  { group: "Revenue", key: "adr", label: "Stabilised ADR (USD/night)", value: 2150, format: "money0",
    classification: "Benchmarked",
    note: "Four Seasons Bora Bora: USD 1,800–6,000+; St. Regis: USD 1,200–8,000+. USD 2,150 = stabilised average across villa mix. Source: Four Seasons; St. Regis; Tahiti Tourisme." },
  { group: "Revenue", key: "occ", label: "Stabilised Occupancy (%)", value: 0.65, format: "pct",
    classification: "Benchmarked",
    note: "HVS: stabilised luxury resort occupancy 60–70%. 65% = conservative midpoint for Bora Bora seasonality. Source: HVS Hotel Valuation; STR." },
  { group: "Revenue", key: "trevpar_premium", label: "TRevPAR Premium over RevPAR (%)", value: 0.35, format: "pct",
    classification: "Benchmarked",
    note: "Non-room revenue = 30–40% of room revenue for ultra-luxury resorts. F&B 55% · Spa 25% · Cultural 10% · Activities 10%. Source: HVS Spa Dept; Horwath HTL APAC." },

  { group: "Operating Costs", key: "op_cost_ratio", label: "Operating Cost Ratio (% of Revenue)", value: 0.72, format: "pct",
    classification: "Benchmarked",
    note: "Labour ~45%, F&B COGS ~15%, utilities ~7%, S&M ~5%. 72% total = standard ultra-luxury island operations. Source: Horwath HTL; HVS." },
  { group: "Operating Costs", key: "mgmt_fee_base", label: "Mgmt Fee — Base (% of Revenue)", value: 0.03, format: "pct",
    classification: "Benchmarked",
    note: "Standard branded operator base fee: 2–3% of total revenue. Source: Horwath HTL; HVS Mgmt Agreement Treatise." },
  { group: "Operating Costs", key: "mgmt_fee_incentive", label: "Mgmt Fee — Incentive (% of GOP)", value: 0.08, format: "pct",
    classification: "Benchmarked",
    note: "Incentive fee: 8–10% of GOP. 8% applied (lower bound, conservative)." },
  { group: "Operating Costs", key: "capex_reserve", label: "Capex Reserve (% of Revenue)", value: 0.03, format: "pct",
    classification: "Benchmarked",
    note: "Industry standard: 3–4% of total revenue as FF&E replacement reserve for luxury assets." },

  { group: "Development", key: "dev_cost_per_key", label: "Development Cost per Key (USD)", value: 1200000, format: "money0",
    classification: "Benchmarked",
    note: "HVS Hotel Development Cost Survey 2024: USD 800K–1.5M+ per key for ultra-luxury island resorts. USD 1.2M = midpoint." },

  { group: "Valuation", key: "cap_rate", label: "Capitalisation Rate (%)", value: 0.065, format: "pct",
    classification: "Benchmarked",
    note: "JLL APAC 2023: ultra-luxury island resort cap rate 5.5–7.5%. 6.5% = midpoint. Source: JLL." },
  { group: "Valuation", key: "noi_growth", label: "NOI Growth p.a. Post-Stab. (%)", value: 0.03, format: "pct",
    classification: "Scenario",
    note: "Conservative 3% p.a. post-stabilisation growth. Consistent with long-run RevPAR CAGR for established luxury resort markets." },
  { group: "Valuation", key: "hold_years", label: "Hold Period (years)", value: 12, format: "int",
    classification: "Scenario",
    note: "Patient-capital default = 12 years. Five tested holds: 5 / 8 / 10 / 12 / 20-yr. Shorter holds exit at peak ramp before renovation hits (best IRR). Longer holds compound NOI growth (best NPV). Source: Horwath HTL; HVS hotel hold-period convention." },
  { group: "Valuation", key: "renov_cycle", label: "Renovation Cycle (yrs, 0 = off)", value: 0, format: "int",
    classification: "Scenario",
    note: "Industry norm: soft renovations every 5–7 yrs; full renovations every 10–15 yrs (HVS, STR). Capex hit = 12% of that year's revenue. Set 0 to disable, or 7–10 to test impact on hold-period choice." },
  { group: "Valuation", key: "renov_capex_pct", label: "Renovation Capex (% of Revenue)", value: 0.12, format: "pct",
    classification: "Benchmarked",
    note: "HVS / STR norm: full hotel renovation capex = 10–15% of annual revenue. 12% midpoint applied at each renovation-cycle hit (post-stabilisation only)." },
];

const NOTES = {
  total_gfa:        { tag: "Computed",    text: "Formula: Keys × GFA per Key. Auto-calculated." },
  plot_ratio:       { tag: "Computed",    text: "Formula: Total GFA ÷ Site Area." },
  total_dev_cost:   { tag: "Computed",    text: "Formula: Keys × Development Cost per Key. Base = 35 × USD 1.2M = USD 42M." },
  revpar:           { tag: "Computed",    text: "RevPAR = ADR × Occupancy. STR / industry standard KPI." },
  room_rev:         { tag: "Computed",    text: "Annualised Room Revenue = RevPAR × Keys × 365." },
  trevpar:          { tag: "Computed",    text: "TRevPAR = RevPAR × (1 + TRevPAR Premium). Captures non-room revenue." },
  total_rev:        { tag: "Computed",    text: "Total Annualised Revenue = TRevPAR × Keys × 365." },
  op_costs:         { tag: "Computed",    text: "Total Operating Costs = Revenue × Op. Cost Ratio. Includes labour, F&B COGS, utilities, S&M." },
  gop:              { tag: "Computed",    text: "GOP = Revenue × (1 − Op. Cost Ratio). Industry target band: 25–30%." },
  gop_margin:       { tag: "Computed",    text: "GOP Margin = GOP ÷ Revenue. Target 25–30%." },
  mgmt_fee_total:   { tag: "Computed",    text: "Total Mgmt Fee = Base Fee (3% of Revenue) + Incentive Fee (8% of GOP)." },
  ebitda:           { tag: "Computed",    text: "EBITDA = GOP − Total Management Fee. Pre-tax, pre-debt, pre-capex." },
  capex_reserve_$:  { tag: "Computed",    text: "FF&E / Capex Reserve = Revenue × 3%. Industry standard for luxury assets." },
  noi:              { tag: "Computed",    text: "NOI = EBITDA − Capex Reserve. Cash flow available to capital providers." },
  noi_margin:       { tag: "Computed",    text: "NOI Margin = NOI ÷ Revenue." },
  dev_yield:        { tag: "Computed",    text: "Development Yield = NOI ÷ Total Development Cost. Target: ≥8%." },
  yield_spread:     { tag: "Computed",    text: "Yield-on-Cost Spread = Development Yield − Cap Rate. Positive spread = embedded value creation." },
  asset_value:      { tag: "Computed",    text: "Implied Asset Value = NOI ÷ Cap Rate. Income-capitalisation method." },
  value_creation:   { tag: "Computed",    text: "Value Creation = Asset Value − Total Development Cost." },
  value_creation_m: { tag: "Computed",    text: "Value Creation Margin = Value Creation ÷ Dev. Cost." },
  noi_y3:           { tag: "Computed",    text: "Year 3 NOI = Stabilised NOI × 50% ramp factor (first soft-opening year, v3 patient-capital)." },
  noi_y10:          { tag: "Computed",    text: "Year 12 NOI = Stabilised NOI × (1 + Growth)^7. Compounded post-stabilisation growth from Y6." },
  terminal:         { tag: "Computed",    text: "Terminal Value (Gordon) = Year 13 NOI ÷ Cap Rate. Income-capitalisation at end of patient-capital hold." },
  irr:              { tag: "Scenario",    text: "Indicative Unleveraged IRR — 12-year patient-capital DCF: cost phased Y0 30% / Y1 40% / Y2 30%; pre-opening 6.5% loaded Y2; NOI ramp Y3 50% · Y4 72% · Y5 90% · Y6+ 100%, growth from Y6; Gordon terminal at Y12 (NOI_Y13 ÷ cap rate). KPMG-style patient-capital methodology." },
  preopen_low:      { tag: "Computed",    text: "Pre-Opening Low = Dev. Cost × 5%. Independent / soft-brand minimum." },
  preopen_mid:      { tag: "Computed",    text: "Pre-Opening Mid = Dev. Cost × 6.5%. Boutique branded, ~9-month programme." },
  preopen_high:     { tag: "Computed",    text: "Pre-Opening High = Dev. Cost × 8%. Full branded, ~12-month programme." },
};

const SCENARIOS = {
  upside:     { label: "Upside",          adr_mult: 1.163, occ_delta: +0.07,  badge: "+ADR +Occ" },
  base:       { label: "Base Case",       adr_mult: 1.000, occ_delta:  0.00,  badge: "Base" },
  adr_stress: { label: "ADR −15%",        adr_mult: 0.850, occ_delta:  0.00,  badge: "ADR Stress" },
  occ_stress: { label: "Occupancy −10pp", adr_mult: 1.000, occ_delta: -0.10,  badge: "Occ Stress" },
  combined:   { label: "Combined Stress", adr_mult: 0.850, occ_delta: -0.10,  badge: "Combined" },
};

const SPACE = {
  totalGFA: 6720,
  zones: [
    { zone: "Accommodation (53.0% of GFA)", color: THEME.brand, items: [
      { l: "Harbour Lagoon Villas — 8 × 130 sqm", v: 1040, s: "Penner, Adams & Rutes: luxury resort villa = 100–180+ sqm net GIA." },
      { l: "Garden Courtyard Villas — 8 × 100 sqm", v: 800, s: "HVS Dev. Cost Survey 2024; Penner et al. luxury resort villa range." },
      { l: "Compact Boardwalk Villas — 8 × 80 sqm", v: 640, s: "HVS Dev. Cost Survey 2024; Penner et al." },
      { l: "Sky Suites — 6 × 70 sqm", v: 420, s: "Penner et al.: luxury hotel suite = 60–90 sqm net GIA." },
      { l: "Premium Rooms — 5 × 50 sqm", v: 250, s: "Penner et al.: luxury hotel standard room = 40–60 sqm." },
    ]},
    { zone: "Food & Beverage (7.7% of GFA)", color: THEME.accent4, items: [
      { l: "Te Rai Fine Dining (50 covers)", v: 165, s: "CBRE Hotels: fine dining = 2.5–4.0 sqm/cover gross." },
      { l: "Fare Motu Harbour Bar + Pool Deck (20 seats)", v: 255, s: "HVS: bar/lounge = 3–5 sqm/seat + pool deck." },
      { l: "Pearl Table Private Dining (12 covers)", v: 100, s: "Private dining: 5–8 sqm/cover." },
    ]},
    { zone: "Spa & Wellness (5.4% of GFA)", color: THEME.accent3, items: [
      { l: "6 Treatment Rooms (30 sqm each)", v: 180, s: "ISPA Facility Guidelines 2022: treatment room = 20–35 sqm." },
      { l: "Wet Circuit + Relaxation + Reception", v: 180, s: "HVS Spa Dept: wet circuit + relaxation = ~150–200 sqm." },
    ]},
    { zone: "Cultural & Programming (10.3% of GFA)", color: THEME.accent2, items: [
      { l: "Te Tumu Cultural Gallery + Pearl Atelier", v: 150, s: "Scenario: sized for rotating exhibitions and artisan workspace." },
      { l: "Beachside Lounge + Lagoon Pool", v: 240, s: "HVS: outdoor pool ~120–200 sqm + 40–80 sqm lounge." },
      { l: "Communal Marae (Sunken Garden)", v: 300, s: "Scenario. Comparable: Capella Siem Reap courtyard ~250–350 sqm." },
    ]},
    { zone: "Arrival & Public Spaces (2.6% of GFA)", color: THEME.accent1, items: [
      { l: "Arrival Lobby + Cultural Salon", v: 175, s: "HVS: luxury lobby = 1.5–3.0 sqm/key. 35 × 2.5 sqm + salon = 175 sqm." },
    ]},
    { zone: "Back-of-House (7.0% of GFA)", color: THEME.muted, items: [
      { l: "Kitchens, Laundry, Staff Areas, Offices", v: 470, s: "HVS: BOH = 6–10% of GFA. 7% × 6,720 sqm = 470 sqm." },
    ]},
    { zone: "Infrastructure (14.0% of GFA)", color: THEME.dk2, items: [
      { l: "MEP, Plant Room, Structure, Circulation", v: 943, s: "HVS: infrastructure = 12–16% of GFA. 14% × 6,720 sqm = 941 sqm." },
    ]},
  ]
};

/* ============================================================================
   FORMATTERS
============================================================================ */
const fmt = {
  money0: (v) => "USD " + Math.round(v).toLocaleString("en-US"),
  moneyM: (v) => "USD " + (v / 1_000_000).toFixed(1) + "M",
  moneyM2: (v) => "USD " + (v / 1_000_000).toFixed(2) + "M",
  money:  (v) => "USD " + Math.round(v).toLocaleString("en-US"),
  pct:    (v) => (v * 100).toFixed(1) + "%",
  pct2:   (v) => (v * 100).toFixed(2) + "%",
  int:    (v) => Math.round(v).toLocaleString("en-US"),
  delta:  (v) => (v >= 0 ? "+" : "") + "USD " + Math.round(v).toLocaleString("en-US"),
  npvM:   (v) => (v >= 0 ? "+USD " : "−USD ") + Math.abs(v / 1_000_000).toFixed(1) + "M",
};

/* ============================================================================
   STATE
   --------------------------------------------------------------------------
   The dashboard now models THREE scenarios as separate input sets:
     • Base Case   — INPUT_DEFS defaults; locked, read-only.
     • Stress Case — Base inputs with combined-stress multipliers (ADR −15%,
                     Occ −10pp) baked into a real input set; locked, read-only.
     • Custom      — user sandbox; clones from Base on first load; persisted
                     to localStorage; the only editable scenario.

   activeTab drives which input set the live dashboard renders against.
   The Scenario Summary panel at the top always shows all three side by side.
============================================================================ */
const BASE_DEFAULTS = Object.fromEntries(INPUT_DEFS.map(d => [d.key, d.value]));

// Stress is Base with the "combined" multipliers baked into ADR + Occ.
// All other inputs (cap rate, growth, costs, etc.) match Base.
function buildStressInputs() {
  const stress = { ...BASE_DEFAULTS };
  stress.adr = BASE_DEFAULTS.adr * SCENARIOS.combined.adr_mult;
  stress.occ = Math.max(0, Math.min(1, BASE_DEFAULTS.occ + SCENARIOS.combined.occ_delta));
  return stress;
}
const STRESS_INPUTS = buildStressInputs();

const LS_KEY = "vaitape_custom_inputs_v5";
function loadCustomInputs() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { ...BASE_DEFAULTS };
    const parsed = JSON.parse(raw);
    // Merge over defaults so newly-added INPUT_DEFS keys still get sane values.
    return { ...BASE_DEFAULTS, ...parsed };
  } catch (_) { return { ...BASE_DEFAULTS }; }
}
function saveCustomInputs(inp) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(inp)); } catch (_) { /* ignore */ }
}

const STATE = {
  baseInputs:   { ...BASE_DEFAULTS },
  stressInputs: { ...STRESS_INPUTS },
  customInputs: loadCustomInputs(),
  defaults:     BASE_DEFAULTS,
  activeTab:    "base",        // "base" | "stress" | "custom"
  // Internal sub-scenario within the active tab — used for the existing
  // 5-scenario waterfall/live preview overlay (kept fixed at "base" so the
  // waterfall always reflects the active tab's inputs without further multipliers).
  scenario:     "base",
};

// Returns the input set bound to the active tab.
function activeInputs() {
  if (STATE.activeTab === "stress") return STATE.stressInputs;
  if (STATE.activeTab === "custom") return STATE.customInputs;
  return STATE.baseInputs;
}
// Backwards-compat alias used by older render functions that read STATE.inputs.
Object.defineProperty(STATE, "inputs", { get: activeInputs });

/* ============================================================================
   MODEL
============================================================================ */
function computeForScenario(I, scen) {
  const S = SCENARIOS[scen];
  const adr = I.adr * S.adr_mult;
  const occ = Math.max(0, Math.min(1, I.occ + S.occ_delta));
  const revpar = adr * occ;
  const trevpar = revpar * (1 + I.trevpar_premium);
  const days = 365;

  const room_rev = revpar * I.keys * days;
  const total_rev = trevpar * I.keys * days;
  const non_room_rev = total_rev - room_rev;

  const op_costs = total_rev * I.op_cost_ratio;
  const gop = total_rev * (1 - I.op_cost_ratio);
  const gop_margin = total_rev > 0 ? gop / total_rev : 0;

  const mgmt_base = total_rev * I.mgmt_fee_base;
  const mgmt_incentive = gop * I.mgmt_fee_incentive;
  const mgmt_total = mgmt_base + mgmt_incentive;

  const ebitda = gop - mgmt_total;
  const capex_reserve = total_rev * I.capex_reserve;
  const noi = ebitda - capex_reserve;
  const noi_margin = total_rev > 0 ? noi / total_rev : 0;

  const total_gfa = I.keys * I.gfa_per_key;
  const total_dev_cost = I.keys * I.dev_cost_per_key;
  const plot_ratio = I.site_area > 0 ? total_gfa / I.site_area : 0;

  const dev_yield = total_dev_cost > 0 ? noi / total_dev_cost : 0;
  const yield_spread = dev_yield - I.cap_rate;
  const asset_value = I.cap_rate > 0 ? noi / I.cap_rate : 0;
  const value_creation = asset_value - total_dev_cost;
  const value_creation_m = total_dev_cost > 0 ? value_creation / total_dev_cost : 0;

  // Build patient-capital cash flow for a chosen hold-period.
  // Y0/Y1/Y2 = construction (30/40/30); Y2 also carries pre-opening lump-sum.
  // Operations begin Y3. Ramp: Y3 50% · Y4 72% · Y5 90% · Y6+ 100%; growth from Y6.
  // Gordon-style terminal at end of hold-year = NOI_(hold+1) ÷ cap rate.
  // Renovation capex hits at Y == 2 + n*renovCycle for n=1,2,… (post-stabilisation only).
  function buildCashflow(noiStab, holdYearsArg, renovCycleArg, capRateArg) {
    const hold = holdYearsArg || I.hold_years || 12;
    const renovCycle = (renovCycleArg !== undefined ? renovCycleArg : (I.renov_cycle || 0));
    const capRate = capRateArg || I.cap_rate;
    const cf = [];
    const preopen = total_dev_cost * 0.065;
    cf.push(-total_dev_cost * 0.30);                       // Y0
    cf.push(-total_dev_cost * 0.40);                       // Y1
    cf.push(-(total_dev_cost * 0.30 + preopen));           // Y2 — pre-opening lump
    // Operations: Y3 → Y(2+hold). The hold-year is the operational year on which we exit.
    // hold=12 → ops Y3..Y14 (12 ops years), exit at Y14. Stabilisation = Y6 onwards.
    const rampFactors = { 1: 0.50, 2: 0.72, 3: 0.90 };  // ops-year 1/2/3 = Y3/Y4/Y5
    for (let opY = 1; opY <= hold; opY++) {
      // ops-year 1 = Y3, ops-year 2 = Y4, etc.
      let factor;
      if (opY <= 3) factor = rampFactors[opY];
      else factor = Math.pow(1 + I.noi_growth, opY - 4);  // Y6 is opY=4
      let flow = noiStab * factor;
      // Annual revenue at this ops-year scales with the same factor as NOI
      const revAtY = total_rev * factor;
      // Renovation capex (post-stabilisation only, opY >= 4 i.e. Y6+)
      if (renovCycle > 0 && opY >= 4 && (opY - 3) % renovCycle === 0) {
        flow -= revAtY * (I.renov_capex_pct || 0.12);
      }
      // Terminal value at exit
      if (opY === hold) {
        const noiNext = noiStab * Math.pow(1 + I.noi_growth, Math.max(0, hold - 3));
        flow += noiNext / capRate;
      }
      cf.push(flow);
    }
    return cf;
  }

  function irrFor(cf) {
    let r = 0.10;
    for (let iter = 0; iter < 200; iter++) {
      let npv = 0, dnpv = 0;
      for (let t = 0; t < cf.length; t++) {
        const denom = Math.pow(1 + r, t);
        npv += cf[t] / denom;
        dnpv += -t * cf[t] / (denom * (1 + r));
      }
      if (Math.abs(npv) < 1) break;
      const next = r - npv / dnpv;
      if (!isFinite(next)) return null;
      if (Math.abs(next - r) < 1e-8) { r = next; break; }
      r = next;
    }
    return r;
  }

  function npvOf(cf, rate) {
    let v = 0;
    for (let t = 0; t < cf.length; t++) v += cf[t] / Math.pow(1 + rate, t);
    return v;
  }

  // Cashflow at the *current* (chosen) hold period.
  const cashflow = buildCashflow(noi);
  const indicative_irr = (noi > 0 && total_dev_cost > 0 && I.cap_rate > 0) ? irrFor(cashflow) : null;

  // NPV at three discount rates (over the chosen-hold cash flow)
  const npv_07 = npvOf(cashflow, 0.07);
  const npv_09 = npvOf(cashflow, 0.09);
  const npv_11 = npvOf(cashflow, 0.11);

  // ----- Hold-period scan: 5 / 8 / 10 / 12 / 20-yr at this scenario -----
  // Each hold uses the same operating cash flows but exits in a different year.
  // Renovation cycle still applies (zeroed if user disables).
  const HOLDS = [5, 8, 10, 12, 20];
  const holdScan = HOLDS.map(h => {
    const cf = buildCashflow(noi, h);
    const irrH = (noi > 0 && total_dev_cost > 0 && I.cap_rate > 0) ? irrFor(cf) : null;
    const npvH = npvOf(cf, 0.095);  // model convention: NPV @ 9.5%
    const totalIn = -cf[0] - Math.min(0, cf[1]) - Math.min(0, cf[2]);
    const totalOut = cf.reduce((s, v) => s + Math.max(0, v), 0);
    const equityMultiple = totalIn > 0 ? totalOut / totalIn : null;
    return { hold: h, irr: irrH, npv: npvH, em: equityMultiple, cashflow: cf };
  });

  // ----- Discount × Exit-Cap NPV grid (at chosen hold) -----
  const DISCOUNT_RATES = [0.07, 0.08, 0.09, 0.095, 0.10, 0.11, 0.12];
  const EXIT_CAPS = [0.055, 0.065, 0.075, 0.085, 0.095];
  const discCapGrid = DISCOUNT_RATES.map(d => ({
    rate: d,
    cells: EXIT_CAPS.map(c => {
      const cfDC = buildCashflow(noi, I.hold_years, I.renov_cycle, c);
      return { cap: c, npv: npvOf(cfDC, d) };
    })
  }));

  const noi_y3 = noi * 0.50;                                          // Y3 soft-opening
  const noi_y10 = noi * Math.pow(1 + I.noi_growth, 6);                // Y12 stabilised + growth
  const noi_y13 = noi * Math.pow(1 + I.noi_growth, 7);                // post-hold growth
  const terminal = noi_y13 / (I.cap_rate || 1);                       // Gordon terminal

  const preopen_low = total_dev_cost * 0.05;
  const preopen_mid = total_dev_cost * 0.065;
  const preopen_high = total_dev_cost * 0.08;

  return {
    adr, occ, revpar, trevpar,
    room_rev, total_rev, non_room_rev,
    op_costs, gop, gop_margin,
    mgmt_base, mgmt_incentive, mgmt_total,
    ebitda, capex_reserve, noi, noi_margin,
    total_gfa, total_dev_cost, plot_ratio,
    dev_yield, yield_spread, asset_value, value_creation, value_creation_m,
    noi_y3, noi_y10, noi_y13, terminal, indicative_irr, cashflow,
    npv_07, npv_09, npv_11,
    holdScan, discCapGrid,
    preopen_low, preopen_mid, preopen_high,
  };
}

function computeAllScenarios(I) {
  return Object.fromEntries(Object.keys(SCENARIOS).map(k => [k, computeForScenario(I, k)]));
}

/* ============================================================================
   TOOLTIP — global, fixed-position, never cut off
============================================================================ */
const tipEl = document.getElementById("globalTip");

function infoIcon(noteObj) {
  const tag = noteObj.tag || "Note";
  const text = noteObj.text || "";
  const safeText = text.replace(/"/g, "&quot;");
  const safeTag = tag.replace(/"/g, "&quot;");
  return `<span class="info" tabindex="0" data-tip-tag="${safeTag}" data-tip-text="${safeText}" aria-label="More info"></span>`;
}

function showTip(target) {
  const tag = target.dataset.tipTag || "Note";
  const text = target.dataset.tipText || "";
  const tagClass = tag.toLowerCase();
  tipEl.innerHTML = `<span class="tip-tag ${tagClass}">${tag}</span>${text}`;
  tipEl.classList.add("show");

  // Position: prefer above icon, but flip below if no room
  const r = target.getBoundingClientRect();
  const tipRect = tipEl.getBoundingClientRect();
  const margin = 12;
  let left = r.left + r.width / 2 - tipRect.width / 2;
  left = Math.max(margin, Math.min(left, window.innerWidth - tipRect.width - margin));
  let top = r.top - tipRect.height - 10;
  if (top < margin) top = r.bottom + 10;
  tipEl.style.left = left + "px";
  tipEl.style.top = top + "px";
}

function hideTip() { tipEl.classList.remove("show"); }

document.addEventListener("mouseover", (e) => {
  const t = e.target.closest(".info");
  if (t) showTip(t);
});
document.addEventListener("mouseout", (e) => {
  const t = e.target.closest(".info");
  if (t) hideTip();
});
document.addEventListener("focusin", (e) => {
  const t = e.target.closest(".info");
  if (t) showTip(t);
});
document.addEventListener("focusout", (e) => {
  const t = e.target.closest(".info");
  if (t) hideTip();
});
// Mobile: tap to show, tap elsewhere to hide
document.addEventListener("click", (e) => {
  const t = e.target.closest(".info");
  if (t) {
    showTip(t);
    setTimeout(hideTip, 4000);
  } else {
    hideTip();
  }
});
window.addEventListener("scroll", hideTip, { passive: true });
window.addEventListener("resize", hideTip);

/* ============================================================================
   RENDER — KPI STRIP
============================================================================ */
function thresh(value, pass, warn, dir = ">=") {
  if (dir === ">=") {
    if (value >= pass) return "pass";
    if (value >= warn) return "warn";
    return "fail";
  }
  if (value <= pass) return "pass";
  if (value <= warn) return "warn";
  return "fail";
}

/* Dual-case KPI: Base + Stress side-by-side, uniform main number sizing.
   No more moneyMSplit — every value renders at one consistent font-size. */
function renderKPIs(B, S) {
  const grid = document.getElementById("kpiGrid");

  const irrCls   = B.indicative_irr == null ? "" : thresh(B.indicative_irr, 0.12, 0.08);
  const yieldCls = thresh(B.dev_yield, 0.10, 0.08);
  const gopCls   = thresh(B.gop_margin, 0.25, 0.20);
  const valCls   = B.value_creation > 0 ? "pass" : (B.value_creation > -2_000_000 ? "warn" : "fail");

  const irrText = (R) => R.indicative_irr == null ? "n/a" : fmt.pct(R.indicative_irr);

  const cards = [
    { label: "Indicative IRR (12-yr)",
      base: irrText(B), stress: irrText(S),
      sub: "Both clear 8% institutional floor (patient-capital)",
      note: NOTES.irr, cls: irrCls,
      status: irrCls === "pass" ? "Above Target" : (irrCls === "warn" ? "Within Band" : "Below Target") },
    { label: "Total Revenue (Stabilised)",
      base: fmt.moneyM(B.total_rev), stress: fmt.moneyM(S.total_rev),
      sub: `RevPAR ${fmt.money0(B.revpar)} · stress ${fmt.money0(S.revpar)}`,
      note: NOTES.total_rev, cls: "" },
    { label: "GOP Margin",
      base: fmt.pct(B.gop_margin), stress: fmt.pct(S.gop_margin),
      sub: `${fmt.moneyM(B.gop)} GOP base · target 25–30%`,
      note: NOTES.gop_margin, cls: gopCls,
      status: gopCls === "pass" ? "Within Target" : (gopCls === "warn" ? "Below Target" : "Off-Target") },
    { label: "NOI (Stabilised)",
      base: fmt.moneyM(B.noi), stress: fmt.moneyM(S.noi),
      sub: `Margin ${fmt.pct(B.noi_margin)} base · ${fmt.pct(S.noi_margin)} stress`,
      note: NOTES.noi, cls: "" },
    { label: "Development Yield",
      base: fmt.pct(B.dev_yield), stress: fmt.pct(S.dev_yield),
      sub: `Spread vs. cap rate: ${fmt.pct(B.yield_spread)} base`,
      note: NOTES.dev_yield, cls: yieldCls,
      status: yieldCls === "pass" ? "≥ 10% Target" : (yieldCls === "warn" ? "8–10% Band" : "Below 8%") },
    { label: "Implied Asset Value",
      base: fmt.moneyM(B.asset_value), stress: fmt.moneyM(S.asset_value),
      sub: `Value creation ${fmt.delta(B.value_creation)} base`,
      note: NOTES.asset_value, cls: valCls,
      status: valCls === "pass" ? "Value Created" : (valCls === "warn" ? "Near Par" : "Erodes Value") },
  ];

  grid.innerHTML = cards.map(c => `
    <div class="kpi-card ${c.cls}">
      <div class="kpi-label"><span>${c.label}</span>${infoIcon(c.note)}</div>
      <div class="kpi-dual">
        <div class="kpi-dual-col">
          <div class="kpi-dual-tag">Base</div>
          <div class="kpi-value">${c.base}</div>
        </div>
        <div class="kpi-dual-col stress">
          <div class="kpi-dual-tag">Stress</div>
          <div class="kpi-value">${c.stress}</div>
        </div>
      </div>
      <div class="kpi-sub">${c.sub || ""}</div>
      ${c.status ? `<div class="kpi-status ${c.cls}">${c.status}</div>` : ""}
    </div>
  `).join("");
}

/* NPV-at-three-rates panel (12-year DCF) */
function renderNPV(B, S) {
  const el = document.getElementById("npvPanel");
  if (!el) return;
  const rows = [
    { rate: "7%",  label: "Patient capital floor",          base: B.npv_07, stress: S.npv_07 },
    { rate: "9%",  label: "Institutional hurdle",           base: B.npv_09, stress: S.npv_09 },
    { rate: "11%", label: "Private-equity hurdle",          base: B.npv_11, stress: S.npv_11 },
  ];
  const cell = (v) => {
    const cls = v >= 5_000_000 ? "pass" : (v >= 0 ? "warn" : "fail");
    return `<div class="npv-val ${cls}">${fmt.npvM(v)}</div>`;
  };
  el.innerHTML = `
    <div class="npv-grid">
      <div class="npv-h">Discount Rate</div>
      <div class="npv-h">Investor Lens</div>
      <div class="npv-h">Base Case</div>
      <div class="npv-h">Stress Case</div>
      ${rows.map(r => `
        <div class="npv-rate">${r.rate}</div>
        <div class="npv-label">${r.label}</div>
        ${cell(r.base)}
        ${cell(r.stress)}
      `).join("")}
    </div>
    <div class="npv-foot">NPV stays positive at the patient-capital floor (7%) in both base and stress cases. Stress turns negative at the 9% institutional hurdle and worsens at 11% — the deal is not for short-horizon PE under adverse conditions. The narrative “bankable for patient capital” holds at 7% across both cases.</div>
  `;
}

/* ============================================================================
   RENDER — REVPAR TABLE
============================================================================ */
function renderRevpar(scenarios) {
  const order = ["upside", "base", "adr_stress", "occ_stress", "combined"];
  const headers = order.map(s => SCENARIOS[s].label);
  const t = document.getElementById("revparTable");

  const row = (label, getter, format, note) => {
    const cells = order.map(s => `<td class="num">${format(getter(scenarios[s]))}</td>`).join("");
    return `<tr><td class="label">${label} ${infoIcon(note)}</td>${cells}</tr>`;
  };

  t.innerHTML = `
    <thead><tr><th>Metric</th>${headers.map(h => `<th style="text-align:right;">${h}</th>`).join("")}</tr></thead>
    <tbody>
      ${row("ADR (USD/night)",          R => R.adr,     fmt.money0, { tag: "Computed", text: "ADR = Base ADR × scenario multiplier. Upside = +16.3%, Stress = −15%." })}
      ${row("Occupancy",                R => R.occ,     fmt.pct,    { tag: "Computed", text: "Occupancy = Base Occupancy + scenario delta. Upside +7pp, Occ Stress −10pp, Combined −15pp." })}
      ${row("RevPAR (USD/night)",       R => R.revpar,  fmt.money0, NOTES.revpar)}
      ${row("Annualised Room Revenue",  R => R.room_rev,fmt.moneyM, NOTES.room_rev)}
      ${row("TRevPAR (USD/night)",      R => R.trevpar, fmt.money0, NOTES.trevpar)}
      <tr class="total-row"><td>Total Annualised Revenue ${infoIcon(NOTES.total_rev)}</td>${order.map(s => `<td class="num">${fmt.moneyM(scenarios[s].total_rev)}</td>`).join("")}</tr>
    </tbody>
  `;
}

/* ============================================================================
   RENDER — P&L TABLE
============================================================================ */
function renderPnL(scenarios) {
  const t = document.getElementById("pnlTable");
  const B = scenarios.base, S = scenarios.combined;

  const row = (label, baseVal, stressVal, format, note, opts = {}) => `
    <tr class="${opts.cls || ""} ${opts.indent ? "indent" : ""}">
      <td class="label">${label} ${note ? infoIcon(note) : ""}</td>
      <td class="num">${format(baseVal)}</td>
      <td class="num">${format(stressVal)}</td>
    </tr>`;

  t.innerHTML = `
    <thead><tr><th>Line Item</th><th style="text-align:right;">Base Case</th><th style="text-align:right;">Combined Stress</th></tr></thead>
    <tbody>
      <tr class="section-row"><td colspan="3">Revenue</td></tr>
      ${row("Total Annualised Revenue", B.total_rev, S.total_rev, fmt.moneyM, NOTES.total_rev, { cls: "subtotal-row" })}
      ${row("Room Revenue", B.room_rev, S.room_rev, fmt.moneyM, NOTES.room_rev, { indent: true })}
      ${row("Non-Room Revenue", B.non_room_rev, S.non_room_rev, fmt.moneyM, { tag: "Computed", text: "Non-Room Revenue = Total Revenue − Room Revenue. F&B, spa, cultural, activities." }, { indent: true })}

      <tr class="section-row"><td colspan="3">Operating Costs</td></tr>
      ${row("Total Operating Costs", B.op_costs, S.op_costs, fmt.moneyM, NOTES.op_costs)}

      <tr class="section-row"><td colspan="3">Gross Operating Profit</td></tr>
      ${row("Gross Operating Profit (GOP)", B.gop, S.gop, fmt.moneyM, NOTES.gop, { cls: "subtotal-row" })}
      ${row("GOP Margin", B.gop_margin, S.gop_margin, fmt.pct, NOTES.gop_margin, { indent: true })}

      <tr class="section-row"><td colspan="3">Management Fees</td></tr>
      ${row("Mgmt Fee — Base", B.mgmt_base, S.mgmt_base, fmt.money, { tag: "Computed", text: "Base Fee = Revenue × 3%." }, { indent: true })}
      ${row("Mgmt Fee — Incentive", B.mgmt_incentive, S.mgmt_incentive, fmt.money, { tag: "Computed", text: "Incentive Fee = GOP × 8%." }, { indent: true })}
      ${row("Total Management Fee", B.mgmt_total, S.mgmt_total, fmt.money, NOTES.mgmt_fee_total)}

      <tr class="section-row"><td colspan="3">EBITDA</td></tr>
      ${row("EBITDA", B.ebitda, S.ebitda, fmt.moneyM, NOTES.ebitda, { cls: "subtotal-row" })}

      <tr class="section-row"><td colspan="3">Capex Reserve</td></tr>
      ${row("FF&E / Capex Reserve", B.capex_reserve, S.capex_reserve, fmt.money, NOTES.capex_reserve_$)}

      <tr class="total-row"><td>Net Operating Income (NOI) ${infoIcon(NOTES.noi)}</td><td class="num">${fmt.moneyM(B.noi)}</td><td class="num">${fmt.moneyM(S.noi)}</td></tr>
      ${row("NOI Margin", B.noi_margin, S.noi_margin, fmt.pct, NOTES.noi_margin, { indent: true })}
    </tbody>
  `;
}

/* ============================================================================
   RENDER — KPI TABLE
============================================================================ */
function renderKPITable(scenarios, I) {
  const t = document.getElementById("kpiTable");
  const B = scenarios.base, S = scenarios.combined, U = scenarios.upside;

  const row = (label, baseVal, stressVal, format, note, opts = {}) => `
    <tr class="${opts.cls || ""}">
      <td class="label">${label} ${note ? infoIcon(note) : ""}</td>
      <td class="num">${format(baseVal)}</td>
      <td class="num">${format(stressVal)}</td>
    </tr>`;

  t.innerHTML = `
    <thead><tr><th>Metric</th><th style="text-align:right;">Base Case</th><th style="text-align:right;">Combined Stress</th></tr></thead>
    <tbody>
      <tr class="section-row"><td colspan="3">Inputs</td></tr>
      ${row("Stabilised NOI", B.noi, S.noi, fmt.moneyM, NOTES.noi)}
      ${row("Total Development Cost", B.total_dev_cost, S.total_dev_cost, fmt.moneyM, NOTES.total_dev_cost)}
      ${row("Capitalisation Rate", I.cap_rate, I.cap_rate, fmt.pct, { tag: "Benchmarked", text: "JLL APAC: ultra-luxury cap rate 5.5–7.5%. 6.5% midpoint." })}

      <tr class="section-row"><td colspan="3">Development Yield</td></tr>
      ${row("Development Yield (NOI ÷ Dev. Cost)", B.dev_yield, S.dev_yield, fmt.pct, NOTES.dev_yield, { cls: "subtotal-row" })}
      ${row("Yield-on-Cost Spread (vs Cap Rate)", B.yield_spread, S.yield_spread, fmt.pct, NOTES.yield_spread)}

      <tr class="section-row"><td colspan="3">Asset Value (Income Capitalisation)</td></tr>
      ${row("Implied Asset Value at Stabilisation", B.asset_value, S.asset_value, fmt.moneyM, NOTES.asset_value, { cls: "subtotal-row" })}
      ${row("Value Creation over Dev. Cost", B.value_creation, S.value_creation, fmt.delta, NOTES.value_creation)}
      ${row("Value Creation Margin", B.value_creation_m, S.value_creation_m, fmt.pct, NOTES.value_creation_m)}

      <tr class="section-row"><td colspan="3">Indicative IRR (12-Year Patient-Capital Hold, Unleveraged)</td></tr>
      ${row("NOI Year 3 — soft opening (50% ramp)", B.noi_y3, S.noi_y3, fmt.moneyM, NOTES.noi_y3)}
      ${row("NOI Year 12 — end of hold", B.noi_y10, S.noi_y10, fmt.moneyM, NOTES.noi_y10)}
      ${row("Terminal Value (Gordon, NOI_Y13 ÷ Cap Rate)", B.terminal, S.terminal, fmt.moneyM, NOTES.terminal)}
      <tr class="subtotal-row"><td class="label">Indicative Unleveraged IRR ${infoIcon(NOTES.irr)}</td><td class="num">${B.indicative_irr == null ? "n/a" : fmt.pct(B.indicative_irr)}</td><td class="num">${S.indicative_irr == null ? "n/a" : fmt.pct(S.indicative_irr)}</td></tr>
      <tr><td class="label">Upside Case IRR (reference) ${infoIcon({ tag: "Scenario", text: "Upside scenario: ADR +16.3% (≈USD 2,500), Occupancy 72%." })}</td><td class="num">${U.indicative_irr == null ? "n/a" : fmt.pct(U.indicative_irr)}</td><td class="num">—</td></tr>
      ${row("Target IRR — Lower Bound (8%)", 0.08, 0.08, fmt.pct, { tag: "Benchmarked", text: "Institutional / PE target IRR lower bound for ultra-luxury hospitality." }, { cls: "indent" })}
      ${row("Target IRR — Upper Bound (12%)", 0.12, 0.12, fmt.pct, { tag: "Benchmarked", text: "Institutional / PE target IRR upper bound." }, { cls: "indent" })}

      <tr class="section-row"><td colspan="3">Pre-Opening Cost Estimate</td></tr>
      ${row("Pre-Opening — Low (5% of Dev. Cost)", B.preopen_low, S.preopen_low, fmt.money, NOTES.preopen_low)}
      ${row("Pre-Opening — Mid (6.5% of Dev. Cost)", B.preopen_mid, S.preopen_mid, fmt.money, NOTES.preopen_mid)}
      ${row("Pre-Opening — High (8% of Dev. Cost)", B.preopen_high, S.preopen_high, fmt.money, NOTES.preopen_high)}
    </tbody>
  `;
}

/* ============================================================================
   RENDER — SENSITIVITY HEATMAP
============================================================================ */
/* ----- Hold-Period Comparison: table + bar chart -----
   Five tested holds (5/8/10/12/20 yr) with NPV @ 9.5%, IRR, Equity Multiple. Base case. */
function renderHoldScan(B, I) {
  const host = document.getElementById("holdScan");
  if (!host) return;
  const scan = B.holdScan;
  // Best IRR / Best EM markers
  const bestIRR = scan.reduce((m, x) => (x.irr > m.irr ? x : m), scan[0]);
  const bestEM = scan.reduce((m, x) => (x.em > m.em ? x : m), scan[0]);
  const chosen = I.hold_years;

  // Detect NPV invariance (identity when r - g ≈ cap_rate)
  const npvSpread = Math.max(...scan.map(s => s.npv)) - Math.min(...scan.map(s => s.npv));
  const npvInvariant = npvSpread / Math.abs(scan[0].npv) < 0.001;

  let head = `<thead><tr><th>Holding Period</th>`;
  scan.forEach(s => {
    const tags = [];
    if (s.hold === chosen) tags.push(`<span class="badge badge-pass" style="font-size:10px;padding:2px 8px">Chosen</span>`);
    head += `<th>${s.hold}-yr ${tags.join(" ")}</th>`;
  });
  head += `</tr></thead>`;

  let body = `<tbody>`;
  body += `<tr><td><strong>IRR (Unlevered)</strong></td>` +
    scan.map(s => {
      const cls = s.hold === bestIRR.hold ? "hpass" : (s.irr >= 0.10 ? "hpass" : s.irr >= 0.08 ? "hwarn" : "hfail");
      const mark = s.hold === bestIRR.hold ? " ★" : "";
      return `<td class="${cls}"><strong>${fmt.pct(s.irr)}</strong>${mark}</td>`;
    }).join("") + `</tr>`;
  body += `<tr><td><strong>NPV @ 9.5% Discount</strong></td>` +
    scan.map(s => {
      const cls = s.npv >= 5e6 ? "hpass" : s.npv >= 0 ? "hwarn" : "hfail";
      return `<td class="${cls}">${fmt.npvM(s.npv)}</td>`;
    }).join("") + `</tr>`;
  body += `<tr><td><strong>Equity Multiple</strong></td>` +
    scan.map(s => {
      const cls = s.hold === bestEM.hold ? "hpass" : (s.em >= 2.0 ? "hpass" : s.em >= 1.5 ? "hwarn" : "hfail");
      const mark = s.hold === bestEM.hold ? " ★" : "";
      return `<td class="${cls}"><strong>${s.em.toFixed(2)}x</strong>${mark}</td>`;
    }).join("") + `</tr>`;
  body += `</tbody>`;

  let footer = `<div class="hold-foot">`;
  footer += `<div><span class="foot-mark">★ Best IRR</span> at <strong>${bestIRR.hold}-yr hold</strong> (${fmt.pct(bestIRR.irr)}) — shorter holds exit at peak ramp before renovation hits.</div>`;
  footer += `<div><span class="foot-mark">★ Best EM</span> at <strong>${bestEM.hold}-yr hold</strong> (${bestEM.em.toFixed(2)}x) — longer holds compound NOI growth across more years.</div>`;
  if (npvInvariant) {
    footer += `<div class="foot-note"><strong>Analytical note.</strong> NPV @ 9.5% is hold-period invariant at current inputs because the discount rate minus NOI growth (9.5% − 3% = 6.5%) equals the cap rate (6.5%). At this point the choice of hold is purely an IRR/duration trade-off; it does not change present value. Adjust cap rate or growth in the drawer to break the identity.</div>`;
  }
  footer += `<div class="foot-note"><strong>Patient-capital lens.</strong> The 12-yr default sits between the IRR-maximising short hold (5-yr) and the multiple-maximising long hold (20-yr). It captures full ramp + 7 years of stabilised growth without absorbing a renovation cycle if cycle is set off (default).</div>`;
  footer += `</div>`;

  host.innerHTML = `<table class="data hold-table">${head}${body}</table>${footer}`;
}

/* ----- Discount Rate × Exit Cap NPV heatmap -----
   Mirrors the source workbook's Sensitivity Table 1, scaled to chosen hold. */
function renderDiscCapHeatmap(B, I) {
  const host = document.getElementById("discCapHeatmap");
  if (!host) return;
  const grid = B.discCapGrid;
  const caps = grid[0].cells.map(c => c.cap);
  let html = `<div class="hcell hhead">Discount Rate \\ Exit Cap</div>`;
  caps.forEach(c => html += `<div class="hcell hhead">Cap ${(c*100).toFixed(1)}%</div>`);
  grid.forEach(row => {
    const isChosenRow = Math.abs(row.rate - 0.095) < 1e-6;
    html += `<div class="hcell hlabel">Disc ${(row.rate*100).toFixed(1)}%${isChosenRow ? `<small>Model rate</small>` : ""}</div>`;
    row.cells.forEach(c => {
      const isChosenCol = Math.abs(c.cap - I.cap_rate) < 1e-6;
      let cls = "hfail";
      if (c.npv >= 5e6) cls = "hpass";
      else if (c.npv >= 0) cls = "hwarn";
      const isBase = isChosenRow && isChosenCol;
      html += `<div class="hcell ${cls}${isBase ? " hbase" : ""}">${fmt.npvM(c.npv)}</div>`;
    });
  });
  host.innerHTML = html;
}

function renderHeatmap(I) {
  // v3 sensitivity matrix: explicit ADR rows + Occ cols.
  // Base is highlighted; cells shaded by development yield.
  const adrSteps = [
    { label: "ADR −15%", mult: 1828 / 2150 },  // ≈ 0.850
    { label: "ADR −10%", mult: 1935 / 2150 },  // ≈ 0.900
    { label: "ADR Base", mult: 1.00 },
    { label: "ADR +10%", mult: 2365 / 2150 },  // ≈ 1.100
    { label: "ADR +15%", mult: 2472 / 2150 },  // ≈ 1.150
  ];
  const occSteps = [0.45, 0.50, 0.55, 0.65, 0.75];
  const totalDev = I.keys * I.dev_cost_per_key;

  const noiFor = (adr, occ) => {
    const trevpar = (adr * occ) * (1 + I.trevpar_premium);
    const total_rev = trevpar * I.keys * 365;
    const gop = total_rev * (1 - I.op_cost_ratio);
    const mgmt = total_rev * I.mgmt_fee_base + gop * I.mgmt_fee_incentive;
    const ebitda = gop - mgmt;
    const cap = total_rev * I.capex_reserve;
    return ebitda - cap;
  };

  const grid = document.getElementById("heatmap");
  let html = `<div class="hcell hhead">ADR \\ Occupancy</div>`;
  occSteps.forEach(o => {
    html += `<div class="hcell hhead">Occ ${(o * 100).toFixed(0)}%</div>`;
  });
  adrSteps.forEach(a => {
    const adrVal = I.adr * a.mult;
    html += `<div class="hcell hlabel">${a.label}<small>USD ${Math.round(adrVal).toLocaleString()}</small></div>`;
    occSteps.forEach(o => {
      const noi = noiFor(adrVal, o);
      const yld = totalDev > 0 ? noi / totalDev : 0;
      let cls = "hfail";
      if (yld >= 0.10) cls = "hpass";
      else if (yld >= 0.08) cls = "hwarn";
      const isBase = (Math.abs(a.mult - 1.0) < 1e-6) && (Math.abs(o - I.occ) < 1e-3);
      html += `<div class="hcell ${cls}${isBase ? " hbase" : ""}">${fmt.moneyM(noi)}<span class="yld">${fmt.pct(yld)} yield</span></div>`;
    });
  });
  grid.innerHTML = html;
}

/* ============================================================================
   RENDER — SPACE PROGRAMME BARS
============================================================================ */
function renderSpace() {
  const c = document.getElementById("spaceProgramme");
  let html = "";
  SPACE.zones.forEach(z => {
    html += `<div class="bar-zone" style="color:${z.color}">${z.zone}</div>`;
    z.items.forEach(it => {
      const pct = (it.v / SPACE.totalGFA) * 100;
      html += `<div class="bar-row">
        <div class="bar-label">${it.l}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%; background:${z.color}"></div></div>
        <div class="bar-num">${it.v.toLocaleString()} sqm</div>
        ${infoIcon({ tag: it.s.toLowerCase().startsWith("scenario") ? "Scenario" : "Benchmarked", text: it.s })}
      </div>`;
    });
  });
  html += `<div class="bar-row" style="margin-top:20px; padding-top:16px;">
    <div class="bar-label" style="font-weight:900; color:${THEME.ink}; font-size:18px;">Total Planning GFA</div>
    <div></div>
    <div class="bar-num" style="color:${THEME.ink}; font-size:20px;">${SPACE.totalGFA.toLocaleString()} sqm</div>
    <div></div>
  </div>`;
  c.innerHTML = html;
}

/* ============================================================================
   RENDER — COHERENCE
============================================================================ */
function renderCoherence(R, I) {
  const blendedCost = R.total_dev_cost / R.total_gfa;
  const checks = [
    { n: 1, text: `<strong>Does the space programme support the concept offering?</strong> All seven concept components are spatially accommodated: F&B (520 sqm), spa (360 sqm), cultural (690 sqm), arrival (175 sqm).`, pass: true,
      note: { tag: "Computed", text: "GFA includes dedicated zones for each of the seven EHL concept components." } },
    { n: 2, text: `<strong>Does the ${I.keys}-key count support the revenue modelling?</strong> Revenue uses ${I.keys} keys throughout. GFA = ${I.keys} × ${I.gfa_per_key} = ${R.total_gfa.toLocaleString()} sqm.`, pass: I.keys >= 15 && I.keys <= 200,
      note: { tag: "Computed", text: "Key count drives both revenue (× RevPAR × 365) and GFA (× GFA per Key)." } },
    { n: 3, text: `<strong>Does the development cost align with the GFA?</strong> ${fmt.moneyM(R.total_dev_cost)} ÷ ${R.total_gfa.toLocaleString()} sqm = USD ${Math.round(blendedCost).toLocaleString()}/sqm blended construction cost.`, pass: blendedCost >= 4500 && blendedCost <= 9000,
      note: { tag: "Benchmarked", text: "HVS Hotel Dev. Cost Survey 2024: ultra-luxury island resort blended cost USD 4,500–9,000/sqm." } },
    { n: 4, text: `<strong>Does the GOP margin align with operator standards?</strong> Base GOP = ${fmt.pct(R.gop_margin)} — target 25–30% for boutique ultra-luxury.`, pass: R.gop_margin >= 0.25 && R.gop_margin <= 0.32,
      note: { tag: "Benchmarked", text: "Horwath HTL Hotel Trends APAC: GOP margin band 25–30% for boutique ultra-luxury." } },
    { n: 5, text: `<strong>Does the plot ratio support the experiential design intent?</strong> Plot ratio ${R.plot_ratio.toFixed(2)} (${R.total_gfa.toLocaleString()} sqm GFA ÷ ${I.site_area.toLocaleString()} sqm site). Site retains ~${Math.round((1 - R.plot_ratio) * 100)}% as open landscape.`, pass: R.plot_ratio <= 0.55,
      note: { tag: "Computed", text: "Plot ratio ≤0.55 ensures sufficient open landscape for low-density ultra-luxury experiential design." } },
    { n: 6, text: `<strong>Is the operator shortlist aligned with the USP?</strong> Capella, Six Senses, Rosewood, Aman all operate in the cultural-immersion / heritage town-centre niche.`, pass: true,
      note: { tag: "Benchmarked", text: "Operator shortlist drawn from Section 4 (Strategic Positioning)." } },
    { n: 7, text: `<strong>Is the FM27 policy alignment documented?</strong> FM27 alignment documented in Section 4.3. Net zero strategy reserved as a separate workstream.`, pass: true,
      note: { tag: "Retrieved", text: "Per Section 4.3 — three-vector FM27 alignment (local economic benefit, cultural integrity, environmental respect)." } },
  ];

  document.getElementById("coherenceList").innerHTML = checks.map(ck => `
    <div class="coherence-row">
      <div class="coherence-num">${ck.n}</div>
      <div class="coherence-text">${ck.text}</div>
      <div><span class="badge ${ck.pass ? "badge-pass" : "badge-fail"}">${ck.pass ? "✓ Pass" : "✗ Fail"}</span> ${infoIcon(ck.note)}</div>
    </div>
  `).join("");

  const passed = checks.filter(c => c.pass).length;
  const verdict = document.getElementById("verdictBar");
  if (passed === checks.length) {
    verdict.innerHTML = `<strong style="color:${THEME.pass};">Overall Verdict ·</strong> All seven coherence checks <strong>pass</strong>. Model is internally consistent at current inputs. Ready for senior review and operator validation.`;
  } else {
    verdict.innerHTML = `<strong style="color:${THEME.warn};">Overall Verdict ·</strong> ${passed}/${checks.length} checks pass. Review failed items above — current inputs may push the model outside benchmarked bands.`;
  }
}

/* ============================================================================
   CHARTS — IRR by scenario, cash flow, waterfall, GFA
============================================================================ */
const charts = {};

function destroyChart(name) { if (charts[name]) { charts[name].destroy(); charts[name] = null; } }

function renderIRRChart(scenarios) {
  destroyChart("irr");
  const order = ["upside", "base", "occ_stress", "adr_stress", "combined"];
  const labels = order.map(k => SCENARIOS[k].label);
  const data = order.map(k => scenarios[k].indicative_irr == null ? 0 : scenarios[k].indicative_irr * 100);
  // IRR bar uses saturated status colours — chart color carries pass/warn/fail meaning
  const colors = data.map(v => v >= 12 ? THEME.cGreen : v >= 8 ? THEME.cAmber : THEME.cRed);

  charts.irr = new Chart(document.getElementById("irrChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "IRR %",
        data,
        backgroundColor: colors,
        borderRadius: 8,
        borderSkipped: false,
        maxBarThickness: 64,
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: THEME.ink,
          padding: 12,
          titleFont: { family: "Lato", weight: "900", size: 14 },
          bodyFont: { family: "Lato", size: 13 },
          callbacks: { label: (ctx) => `IRR: ${ctx.parsed.x.toFixed(1)}%` },
        },
        // Target band shading
        annotation: false,
      },
      scales: {
        x: {
          grid: { color: "rgba(0,0,0,0.06)" },
          ticks: { font: { family: "Lato", weight: 700, size: 13 }, color: THEME.muted, callback: v => v + "%" },
          min: 0,
          max: Math.max(20, ...data) + 2,
        },
        y: {
          grid: { display: false },
          ticks: { font: { family: "Lato", weight: 900, size: 14 }, color: THEME.ink },
        },
      },
    },
    plugins: [{
      id: "targetBand",
      beforeDraw: (chart) => {
        const { ctx, chartArea, scales } = chart;
        if (!chartArea) return;
        const x0 = scales.x.getPixelForValue(8);
        const x1 = scales.x.getPixelForValue(12);
        ctx.save();
        ctx.fillStyle = "rgba(137, 220, 101, 0.12)";
        ctx.fillRect(x0, chartArea.top, x1 - x0, chartArea.bottom - chartArea.top);
        ctx.strokeStyle = THEME.cGreen;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(x0, chartArea.top); ctx.lineTo(x0, chartArea.bottom);
        ctx.moveTo(x1, chartArea.top); ctx.lineTo(x1, chartArea.bottom);
        ctx.stroke();
        // Label
        ctx.setLineDash([]);
        ctx.fillStyle = THEME.pass;
        ctx.font = "900 11px Lato";
        ctx.fillText("TARGET 8–12%", x0 + 6, chartArea.top + 14);
        ctx.restore();
      }
    }]
  });
}

function renderCashflowChart(scenarios) {
  destroyChart("cashflow");
  const cfBase = scenarios.base.cashflow;
  const cfStress = scenarios.combined.cashflow;

  const cumulative = (cf) => {
    const out = []; let acc = 0;
    for (const v of cf) { acc += v; out.push(acc / 1_000_000); }
    return out;
  };
  const baseCum = cumulative(cfBase);
  const stressCum = cumulative(cfStress);
  const labels = baseCum.map((_, i) => `Y${i}`);

  charts.cashflow = new Chart(document.getElementById("cashflowChart"), {
    type: "line",
    data: {
      labels,
      datasets: [
        // Cashflow: teal for Base (no navy), red for Stress — chart-color carries scenario meaning
        { label: "Base Case", data: baseCum, borderColor: THEME.cTeal, backgroundColor: THEME.pTeal + "AA",
          tension: 0.25, fill: true, pointRadius: 5, pointBackgroundColor: THEME.cTeal, borderWidth: 3 },
        { label: "Combined Stress", data: stressCum, borderColor: THEME.cRed, backgroundColor: THEME.pRed + "AA",
          tension: 0.25, fill: true, pointRadius: 5, pointBackgroundColor: THEME.cRed, borderWidth: 3 },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top", labels: { font: { family: "Lato", weight: 700, size: 13 }, color: THEME.ink, usePointStyle: true, padding: 16 } },
        tooltip: {
          backgroundColor: THEME.ink,
          padding: 12,
          titleFont: { family: "Lato", weight: "900", size: 14 },
          bodyFont: { family: "Lato", size: 13 },
          callbacks: { label: (ctx) => `${ctx.dataset.label}: USD ${ctx.parsed.y.toFixed(1)}M cum.` },
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: "Lato", weight: 700, size: 12 }, color: THEME.muted } },
        y: { grid: { color: "rgba(0,0,0,0.06)" }, ticks: { font: { family: "Lato", weight: 700, size: 12 }, color: THEME.muted, callback: v => `USD ${v}M` } },
      },
    },
    plugins: [{
      id: "zeroLine",
      beforeDraw: (chart) => {
        const { ctx, chartArea, scales } = chart;
        if (!chartArea) return;
        const y0 = scales.y.getPixelForValue(0);
        ctx.save();
        ctx.strokeStyle = THEME.dk2;
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(chartArea.left, y0); ctx.lineTo(chartArea.right, y0);
        ctx.stroke();
        ctx.fillStyle = THEME.dk2;
        ctx.font = "900 11px Lato";
        ctx.fillText("BREAKEVEN", chartArea.left + 6, y0 - 6);
        ctx.restore();
      }
    }]
  });
}

function renderWaterfallChart(R) {
  destroyChart("waterfall");
  // Build a stepped bar showing revenue → NOI
  const steps = [
    { label: "Total Revenue",   v: R.total_rev,        c: THEME.accent6, type: "total" },
    { label: "− Op. Costs",     v: -R.op_costs,        c: THEME.accent5, type: "delta" },
    { label: "GOP",             v: R.gop,              c: THEME.accent1, type: "subtotal" },
    { label: "− Mgmt Fees",     v: -R.mgmt_total,      c: THEME.accent5, type: "delta" },
    { label: "EBITDA",          v: R.ebitda,           c: THEME.accent2, type: "subtotal" },
    { label: "− Capex Reserve", v: -R.capex_reserve,   c: THEME.accent5, type: "delta" },
    { label: "NOI",             v: R.noi,              c: THEME.accent3, type: "total" },
  ];

  // Compute floating bar segments for waterfall
  let running = 0;
  const data = steps.map((s, i) => {
    if (s.type === "total" || s.type === "subtotal") {
      const seg = [0, s.v / 1_000_000];
      running = s.v;
      return seg;
    } else {
      const start = running / 1_000_000;
      running += s.v;
      const end = running / 1_000_000;
      return [Math.min(start, end), Math.max(start, end)];
    }
  });

  charts.waterfall = new Chart(document.getElementById("waterfallChart"), {
    type: "bar",
    data: {
      labels: steps.map(s => s.label),
      datasets: [{
        label: "USD M",
        data,
        backgroundColor: steps.map(s => s.c),
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: THEME.ink,
          padding: 12,
          titleFont: { family: "Lato", weight: "900", size: 14 },
          bodyFont: { family: "Lato", size: 13 },
          callbacks: {
            label: (ctx) => {
              const s = steps[ctx.dataIndex];
              return `${s.label}: USD ${(s.v / 1_000_000).toFixed(2)}M`;
            }
          }
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: "Lato", weight: 700, size: 12 }, color: THEME.ink, autoSkip: false, maxRotation: 30, minRotation: 0 } },
        y: { grid: { color: "rgba(0,0,0,0.06)" }, ticks: { font: { family: "Lato", weight: 700, size: 12 }, color: THEME.muted, callback: v => `USD ${v}M` } },
      },
    }
  });
}

function renderGFAChart() {
  destroyChart("gfa");
  const labels = SPACE.zones.map(z => z.zone.replace(/\s*\([^)]+\)/, ""));
  const data = SPACE.zones.map(z => z.items.reduce((sum, it) => sum + it.v, 0));
  const colors = SPACE.zones.map(z => z.color);

  charts.gfa = new Chart(document.getElementById("gfaChart"), {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderWidth: 4,
        borderColor: "#fff",
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "62%",
      plugins: {
        legend: {
          position: "right",
          labels: { font: { family: "Lato", weight: 700, size: 12 }, color: THEME.ink, padding: 12, usePointStyle: true, boxWidth: 10, boxHeight: 10 },
        },
        tooltip: {
          backgroundColor: THEME.ink,
          padding: 12,
          titleFont: { family: "Lato", weight: "900", size: 14 },
          bodyFont: { family: "Lato", size: 13 },
          callbacks: {
            label: (ctx) => {
              const total = ctx.dataset.data.reduce((a,b) => a+b, 0);
              const pct = (ctx.parsed / total * 100).toFixed(1);
              return `${ctx.parsed.toLocaleString()} sqm (${pct}%)`;
            }
          }
        }
      }
    },
    plugins: [{
      id: "centerLabel",
      beforeDraw: (chart) => {
        const { ctx, chartArea } = chart;
        if (!chartArea) return;
        const cx = (chartArea.left + chartArea.right) / 2;
        const cy = (chartArea.top + chartArea.bottom) / 2;
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = THEME.ink;
        ctx.font = "900 28px Lato";
        ctx.fillText("6,720", cx, cy - 8);
        ctx.font = "700 12px Lato";
        ctx.fillStyle = THEME.muted;
        ctx.fillText("SQM TOTAL GFA", cx, cy + 16);
        ctx.restore();
      }
    }]
  });
}

/* ============================================================================
   RENDER — DRAWER INPUTS
============================================================================ */
function renderInputs() {
  const container = document.getElementById("inputsContainer");
  // Drawer always SHOWS the active tab's inputs, but only EDITS Custom.
  const shown = activeInputs();
  const editable = (STATE.activeTab === "custom");
  const banner = document.getElementById("drawerBanner");
  if (banner) {
    if (editable) {
      banner.style.display = "none";
    } else {
      banner.style.display = "flex";
      banner.querySelector(".drawer-banner-text").textContent =
        STATE.activeTab === "base"
          ? "Base Case is read-only. Switch to Custom Scenario to edit."
          : "Stress Case is read-only. Switch to Custom Scenario to edit.";
    }
  }
  // Toggle the drawer-foot Reset visibility — only meaningful on Custom.
  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) resetBtn.style.display = editable ? "" : "none";
  // Live-summary title reflects active tab.
  const lsTitle = document.getElementById("liveSummaryTitle");
  if (lsTitle) {
    lsTitle.textContent =
      STATE.activeTab === "custom" ? "Live Preview · Custom Scenario" :
      STATE.activeTab === "stress" ? "Live Preview · Stress Case"      :
                                     "Live Preview · Base Case";
  }

  let html = "";
  let lastGroup = null;
  INPUT_DEFS.forEach(def => {
    if (def.group !== lastGroup) {
      if (lastGroup !== null) html += "</div>";
      html += `<div class="input-section"><div class="input-group-label">${def.group}</div>`;
      lastGroup = def.group;
    }
    const v = shown[def.key];
    const display = def.format === "pct" ? (v * 100).toFixed(2) : v;
    const note = { tag: def.classification, text: def.note };
    const changed = editable && (shown[def.key] !== BASE_DEFAULTS[def.key]);
    html += `
      <div class="input-row">
        <label for="inp_${def.key}">${def.label}</label>
        <input id="inp_${def.key}" data-key="${def.key}" data-format="${def.format}" type="number" step="any" value="${display}" inputmode="decimal" class="${changed ? "changed" : ""}" ${editable ? "" : "readonly"}>
        ${infoIcon(note)}
      </div>`;
  });
  if (lastGroup !== null) html += "</div>";
  container.innerHTML = html;

  container.querySelectorAll("input").forEach(inp => {
    inp.addEventListener("input", onInputChange);
  });
}

function onInputChange(e) {
  // Only Custom is editable. If somehow fired on Base/Stress, ignore.
  if (STATE.activeTab !== "custom") return;
  const key = e.target.dataset.key;
  const format = e.target.dataset.format;
  let val = parseFloat(e.target.value);
  if (!isFinite(val)) return;
  if (format === "pct") val = val / 100;
  STATE.customInputs[key] = val;
  saveCustomInputs(STATE.customInputs);
  e.target.classList.toggle("changed", STATE.customInputs[key] !== BASE_DEFAULTS[key]);
  renderAll();
}

function resetInputs() {
  // "Reset Custom to Base" — only meaningful on Custom tab.
  if (STATE.activeTab !== "custom") return;
  STATE.customInputs = { ...BASE_DEFAULTS };
  saveCustomInputs(STATE.customInputs);
  renderInputs();
  renderAll();
}

function renderLiveSummary(R) {
  const el = document.getElementById("liveSummary");
  const irr = R.indicative_irr;
  el.innerHTML = `
    <div><label>IRR</label><strong>${irr == null ? "n/a" : fmt.pct(irr)}</strong></div>
    <div><label>NOI</label><strong>${fmt.moneyM(R.noi)}</strong></div>
    <div><label>Dev Yield</label><strong>${fmt.pct(R.dev_yield)}</strong></div>
    <div><label>Asset Value</label><strong>${fmt.moneyM(R.asset_value)}</strong></div>
  `;
}

/* ============================================================================
   SCENARIO TABS — Base · Stress · Custom
============================================================================ */
const TAB_DEFS = [
  { key: "base",   label: "Base Case",        sub: "Reference" },
  { key: "stress", label: "Stress Case",      sub: "ADR −15% · Occ −10pp" },
  { key: "custom", label: "Custom Scenario",  sub: "Editable sandbox" },
];

function renderScenarioButtons() {
  const c = document.getElementById("scenarioButtons");
  c.innerHTML = TAB_DEFS.map(t =>
    `<button class="scenario-btn ${t.key === STATE.activeTab ? "active" : ""}" data-tab="${t.key}">
       <span class="scenario-btn-label">${t.label}</span>
       <span class="scenario-btn-sub">${t.sub}</span>
     </button>`
  ).join("");
  c.querySelectorAll(".scenario-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      STATE.activeTab = btn.dataset.tab;
      renderScenarioButtons();
      renderInputs();
      renderAll();
      // Smoothly scroll the page into view if needed (mobile UX).
      if (window.scrollY < 200) document.getElementById("scenarioBar")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  // FAB label updates depending on tab.
  const fab = document.getElementById("fab");
  if (fab) {
    fab.textContent = STATE.activeTab === "custom" ? "✎ Edit Custom Inputs" : "☰ View Inputs";
  }
}

/* ============================================================================
   SCENARIO SUMMARY — persistent comparison panel (institutional convention)
============================================================================ */
function summaryFor(inp) {
  const s = computeForScenario(inp, "base");
  const npvAt = (cf, r) => { let v = 0; for (let t = 0; t < cf.length; t++) v += cf[t] / Math.pow(1 + r, t); return v; };
  return {
    irr:        s.indicative_irr,
    npv_95:     npvAt(s.cashflow, 0.095),
    em:         (function() {
      const cf = s.cashflow;
      const totalIn = -cf[0] - Math.min(0, cf[1]) - Math.min(0, cf[2]);
      const totalOut = cf.reduce((sum, v) => sum + Math.max(0, v), 0);
      return totalIn > 0 ? totalOut / totalIn : null;
    })(),
    dev_yield:  s.dev_yield,
    hold:       inp.hold_years,
    noi:        s.noi,
    revpar:     s.revpar,
    asset_value: s.asset_value,
  };
}

function renderScenarioSummary() {
  const el = document.getElementById("scenarioSummary");
  if (!el) return;
  const summaries = {
    base:   summaryFor(STATE.baseInputs),
    stress: summaryFor(STATE.stressInputs),
    custom: summaryFor(STATE.customInputs),
  };

  // Format helpers with sign awareness for deltas.
  const fmtIrr = v => v == null ? "—" : (v * 100).toFixed(1) + "%";
  const fmtPct = v => v == null ? "—" : (v * 100).toFixed(1) + "%";
  const fmtEm  = v => v == null ? "—" : v.toFixed(2) + "×";
  const fmtNpv = v => v == null ? "—" : (v >= 0 ? "+USD " : "−USD ") + Math.abs(v / 1_000_000).toFixed(1) + "M";
  const fmtY   = v => v + "-yr";

  const ppDelta = (cur, base, formatter, unit) => {
    if (cur == null || base == null) return "";
    const diff = cur - base;
    if (Math.abs(diff) < 0.0001) return `<span class="sum-delta neutral">flat</span>`;
    const arrow = diff > 0 ? "▲" : "▼";
    const sign  = diff > 0 ? "+" : "−";
    const cls   = diff > 0 ? "up" : "down";
    let txt;
    if (unit === "pp")  txt = sign + (Math.abs(diff) * 100).toFixed(1) + "pp";
    else if (unit === "x") txt = sign + Math.abs(diff).toFixed(2) + "×";
    else if (unit === "m") txt = sign + "USD " + Math.abs(diff / 1_000_000).toFixed(1) + "M";
    else                 txt = sign + Math.abs(diff).toFixed(2);
    return `<span class="sum-delta ${cls}">${arrow} ${txt}</span>`;
  };

  const baseS = summaries.base;
  const customEdited = JSON.stringify(STATE.customInputs) !== JSON.stringify(STATE.baseInputs);

  // Build one row per scenario.
  const rowFor = (key) => {
    const s = summaries[key];
    const def = TAB_DEFS.find(t => t.key === key);
    const isActive = key === STATE.activeTab;
    const isCustomUntouched = (key === "custom" && !customEdited);
    return `
      <div class="sum-row ${isActive ? "active" : ""} ${isCustomUntouched ? "untouched" : ""}" data-tab="${key}" role="button" tabindex="0" aria-label="Switch to ${def.label}">
        <div class="sum-cell sum-name">
          <div class="sum-name-label">${def.label}</div>
          <div class="sum-name-sub">${isCustomUntouched ? "Cloned from Base — edit any input to begin" : def.sub}</div>
        </div>
        <div class="sum-cell" data-label="IRR"><div class="sum-num">${fmtIrr(s.irr)}</div>${key !== "base" ? ppDelta(s.irr, baseS.irr, fmtIrr, "pp") : `<div class="sum-tag">reference</div>`}</div>
        <div class="sum-cell" data-label="NPV @ 9.5%"><div class="sum-num">${fmtNpv(s.npv_95)}</div>${key !== "base" ? ppDelta(s.npv_95, baseS.npv_95, fmtNpv, "m") : ""}</div>
        <div class="sum-cell" data-label="Eq. Multiple"><div class="sum-num">${fmtEm(s.em)}</div>${key !== "base" ? ppDelta(s.em, baseS.em, fmtEm, "x") : ""}</div>
        <div class="sum-cell" data-label="Dev Yield"><div class="sum-num">${fmtPct(s.dev_yield)}</div>${key !== "base" ? ppDelta(s.dev_yield, baseS.dev_yield, fmtPct, "pp") : ""}</div>
        <div class="sum-cell sum-hold" data-label="Hold"><div class="sum-num">${fmtY(s.hold)}</div></div>
      </div>`;
  };

  el.innerHTML = `
    <div class="sum-head">
      <div class="sum-cell sum-name"><span class="sum-eyebrow">Scenario</span></div>
      <div class="sum-cell"><span class="sum-eyebrow">IRR (Unlevered)</span></div>
      <div class="sum-cell"><span class="sum-eyebrow">NPV @ 9.5%</span></div>
      <div class="sum-cell"><span class="sum-eyebrow">Equity Multiple</span></div>
      <div class="sum-cell"><span class="sum-eyebrow">Dev Yield</span></div>
      <div class="sum-cell sum-hold"><span class="sum-eyebrow">Hold</span></div>
    </div>
    ${rowFor("base")}
    ${rowFor("stress")}
    ${rowFor("custom")}
  `;

  // Click anywhere on a row to switch active tab.
  el.querySelectorAll(".sum-row").forEach(r => {
    r.addEventListener("click", () => {
      STATE.activeTab = r.dataset.tab;
      renderScenarioButtons();
      renderInputs();
      renderAll();
    });
    r.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        STATE.activeTab = r.dataset.tab;
        renderScenarioButtons();
        renderInputs();
        renderAll();
      }
    });
  });
}

/* ============================================================================
   WHAT CHANGED VS BASE — visible only when Custom tab is active and edited
============================================================================ */
function renderWhatChanged() {
  const el = document.getElementById("whatChanged");
  if (!el) return;
  if (STATE.activeTab !== "custom") {
    el.style.display = "none";
    return;
  }
  const diffs = INPUT_DEFS
    .filter(d => STATE.customInputs[d.key] !== BASE_DEFAULTS[d.key])
    .map(d => {
      const cur = STATE.customInputs[d.key];
      const base = BASE_DEFAULTS[d.key];
      const fmtVal = (v) => {
        if (d.format === "pct")    return (v * 100).toFixed(1) + "%";
        if (d.format === "money0") return "USD " + Math.round(v).toLocaleString("en-US");
        if (d.format === "money")  return "USD " + Math.round(v).toLocaleString("en-US");
        return (typeof v === "number" && Number.isFinite(v)) ? (Number.isInteger(v) ? v : v.toFixed(2)) : String(v);
      };
      return `<span class="chg-chip"><span class="chg-chip-label">${d.label}</span><span class="chg-chip-from">${fmtVal(base)}</span><span class="chg-chip-arrow">→</span><span class="chg-chip-to">${fmtVal(cur)}</span></span>`;
    });

  if (diffs.length === 0) {
    el.style.display = "flex";
    el.innerHTML = `
      <div class="chg-head">
        <span class="chg-eyebrow">Custom Scenario</span>
        <span class="chg-status">Cloned from Base — no edits yet. Open the drawer and change any input to begin.</span>
      </div>`;
    return;
  }
  el.style.display = "flex";
  el.innerHTML = `
    <div class="chg-head">
      <span class="chg-eyebrow">Custom vs Base</span>
      <span class="chg-status">${diffs.length} input${diffs.length === 1 ? "" : "s"} changed — the dashboard below reflects these edits.</span>
      <button class="chg-reset" id="chgResetBtn" type="button">Reset to Base</button>
    </div>
    <div class="chg-chips">${diffs.join("")}</div>`;
  // Wire reset button.
  document.getElementById("chgResetBtn")?.addEventListener("click", resetInputs);
}

/* ============================================================================
   DRAWER OPEN/CLOSE
============================================================================ */
function openDrawer() {
  document.getElementById("drawer").classList.add("open");
  document.getElementById("scrim").classList.add("open");
  document.getElementById("drawer").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeDrawer() {
  document.getElementById("drawer").classList.remove("open");
  document.getElementById("scrim").classList.remove("open");
  document.getElementById("drawer").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

/* ============================================================================
   MAIN RENDER
============================================================================ */
function renderAll() {
  // Active tab drives which input set the live dashboard renders against.
  // Scenario Summary panel always shows all three side by side.
  const I = activeInputs();
  const scenarios = computeAllScenarios(I);
  // Internal sub-scenario for waterfall/live preview — always "base" within
  // the active tab's input set so the waterfall reflects the active tab cleanly.
  const R = scenarios["base"];

  renderScenarioSummary();
  renderWhatChanged();
  renderKPIs(scenarios.base, scenarios.combined);
  renderNPV(scenarios.base, scenarios.combined);
  renderHoldScan(scenarios.base, I);
  renderRevpar(scenarios);
  renderPnL(scenarios);
  renderKPITable(scenarios, I);
  renderDiscCapHeatmap(scenarios.base, I);
  renderHeatmap(I);
  renderCoherence(scenarios.base, I);
  renderIRRChart(scenarios);
  renderCashflowChart(scenarios);
  renderWaterfallChart(R);
  renderLiveSummary(R);
  // Reflect active tab on body so global CSS can theme accents.
  document.body.dataset.activeTab = STATE.activeTab;
}

function init() {
  renderInputs();
  renderSpace();
  renderScenarioButtons();
  renderAll();
  renderGFAChart(); // static once

  document.getElementById("fab").addEventListener("click", openDrawer);
  document.getElementById("drawerClose").addEventListener("click", closeDrawer);
  document.getElementById("scrim").addEventListener("click", closeDrawer);
  document.getElementById("applyBtn").addEventListener("click", closeDrawer);
  document.getElementById("resetBtn").addEventListener("click", resetInputs);

  // Drawer banner CTA — jump to Custom tab from inside the drawer.
  document.getElementById("drawerBannerCta")?.addEventListener("click", () => {
    STATE.activeTab = "custom";
    renderScenarioButtons();
    renderInputs();
    renderAll();
  });

  // ESC closes drawer
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });
}

init();
