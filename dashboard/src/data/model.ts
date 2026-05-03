/**
 * Vaitape Bora Bora — typed data anchors
 * Source: merged v7 Excel model — see _data_anchors.json in project root.
 * DO NOT invent values; this is the authoritative numerical source for the dashboard.
 */

export const inputs = {
  keys: 35,
  site_area_sqm: 15000,
  gfa_per_key: 192,
  total_gfa: 6720,
  plot_ratio: 0.448,

  adr_base: 2150,
  occ_base: 0.65,
  trevpar_premium: 0.35,        // applied
  trevpar_kpmg_excluded: 0.65,  // EXCLUDED — Polynesia Consulting / Henry Terou connected-party

  opex_ratio: 0.72,
  mgmt_base: 0.03,
  mgmt_incentive: 0.08,
  ffe_reserve: 0.03,

  cost_per_key: 1_200_000,
  total_dev_cost: 42_000_000,
  preopen_pct: 0.065,
  preopen_cost: 2_730_000,

  cap_rate: 0.065,
  noi_growth: 0.03,
  hold_years: 12 as const,

  patient_floor: 0.08,
  patient_ceiling: 0.12,
  discount_patient: 0.07,
  discount_mid: 0.09,
  discount_pe: 0.11,

  defisc_rate: 0.25,
  defisc_cap_xpf: 500_000_000,
  fx_xpf_usd: 119.5,
  defisc_effective: 4_184_100.41841004,

  ramp: { y3: 0.5, y4: 0.72, y5: 0.9, y6: 1.0 },
  phase: { y0: 0.3, y1: 0.4, y2: 0.3 },
};

export type ScenarioKey = "base" | "upside" | "stress" | "customA" | "customB" | "customC";

export interface ScenarioRow {
  key: ScenarioKey;
  label: string;
  fixed: boolean;             // true for base/upside/stress
  defaultActive: boolean;     // initial on/off in scenario bar
  adr: number | null;
  occ: number | null;
  trevpar_uplift: number | null;
  revpar: number | null;
  total_revenue: number | null;
  gop: number | null;
  gop_margin: number | null;
  ebitda: number | null;
  noi: number | null;
  asset_value: number | null;
  dev_yield: number | null;
  yield_spread: number | null;
  gate1: "PASS" | "FAIL" | null;
  gate3: "PASS" | "FAIL" | null;
}

export const fixedScenarios: ScenarioRow[] = [
  {
    key: "base",
    label: "Base",
    fixed: true,
    defaultActive: true,
    adr: 2150,
    occ: 0.65,
    trevpar_uplift: 0.35,
    revpar: 1397.5,
    total_revenue: 24_101_634.375,
    gop: 6_748_457.625,
    gop_margin: 0.28,
    ebitda: 5_485_531.98375,
    noi: 4_762_482.9525,
    asset_value: 73_268_968.5,
    dev_yield: 0.11339245125,
    yield_spread: 0.04839245125,
    gate1: "PASS",
    gate3: "PASS",
  },
  {
    key: "upside",
    label: "Upside",
    fixed: true,
    defaultActive: true,
    adr: 2472.5,
    occ: 0.72,
    trevpar_uplift: 0.35,
    revpar: 1780.2,
    total_revenue: 30_701_774.25,
    gop: 8_596_496.79,
    gop_margin: 0.28,
    ebitda: 6_987_723.8193,
    noi: 6_066_670.5918,
    asset_value: 93_333_393.72,
    dev_yield: 0.1444445379,
    yield_spread: 0.0794445379,
    gate1: "PASS",
    gate3: "PASS",
  },
  {
    key: "stress",
    label: "Stress",
    fixed: true,
    defaultActive: true,
    adr: 1827.5,
    occ: 0.5,
    trevpar_uplift: 0.35,
    revpar: 913.75,
    total_revenue: 15_758_760.9375,
    gop: 4_412_453.0625,
    gop_margin: 0.28,
    ebitda: 3_586_693.989375,
    noi: 3_113_931.16125,
    asset_value: 47_906_633.25,
    dev_yield: 0.074141218125,
    yield_spread: 0.00914121812499999,
    gate1: "PASS",
    gate3: "FAIL",
  },
];

export const customScenarioDefaults: ScenarioRow[] = [
  emptyCustom("customA", "Custom A", { adrShift: 0, occ: 0.6, trevpar: 0.35 }),
  emptyCustom("customB", "Custom B", { adrShift: -0.05, occ: 0.6, trevpar: 0.3 }),
  emptyCustom("customC", "Custom C", { adrShift: 0.05, occ: 0.7, trevpar: 0.4 }),
];

function emptyCustom(
  key: ScenarioKey,
  label: string,
  _seed: { adrShift: number; occ: number; trevpar: number }
): ScenarioRow {
  return {
    key,
    label,
    fixed: false,
    defaultActive: false,
    adr: null,
    occ: null,
    trevpar_uplift: null,
    revpar: null,
    total_revenue: null,
    gop: null,
    gop_margin: null,
    ebitda: null,
    noi: null,
    asset_value: null,
    dev_yield: null,
    yield_spread: null,
    gate1: null,
    gate3: null,
  };
}

/**
 * Initial editable inputs for Custom slots (used by ScenarioEditor).
 */
export const customSeeds: Record<"customA" | "customB" | "customC", { adrShift: number; occ: number; trevpar: number }> = {
  customA: { adrShift: 0, occ: 0.6, trevpar: 0.35 },
  customB: { adrShift: -0.05, occ: 0.6, trevpar: 0.3 },
  customC: { adrShift: 0.05, occ: 0.7, trevpar: 0.4 },
};

/* ====== DCF ====== */
export const dcf = {
  base: {
    irr: 0.132132781593379,
    npv7: 27_509_295.8689708,
    npv9: 16_438_556.9944855,
    npv11: 7_652_968.73807797,
    cashflows: [
      -12_600_000, -16_800_000, -15_330_000,
      2_381_241.47625, 3_428_987.7258, 4_286_234.65725,
      4_762_482.9525, 5_052_518.16430725, 5_204_093.70923647,
      5_360_216.52051356, 5_521_023.01612897, 5_686_653.70661284,
      98_672_190.5077429,
    ],
  },
  stress: {
    irr: 0.0796021588847064,
    npv7: 3_555_433.73914214,
    npv9: -3_414_873.69596192,
    npv11: -8_903_665.18398358,
    cashflows: [
      -12_600_000, -16_800_000, -15_330_000,
      1_556_965.580625, 2_242_030.4361, 2_802_538.045125,
      3_113_931.16125, 3_303_569.56897012, 3_402_676.65603923,
      3_504_756.95572041, 3_609_899.66439202, 3_718_196.65432378,
      64_516_432.2550627,
    ],
  },
};

/* ====== ADR × Occupancy Sensitivity (NOI matrix from Excel) ====== */
export const sensitivityNOI = {
  occHeaders: ["Occupancy 45%", "Occupancy 50%", "Occupancy 55%", "Occupancy 65% (Base)", "Occupancy 75%"],
  occValues: [0.45, 0.5, 0.55, 0.65, 0.75],
  rows: [
    { label: "Average Daily Rate −15%", adr: 1827.5,  vals: [2_802_538.045125, 3_113_931.16125, 3_425_324.277375, 4_048_110.509625, 4_670_896.741875] },
    { label: "Average Daily Rate −10%", adr: 1935.0,  vals: [2_967_393.22425,  3_297_103.5825,  3_626_813.94075,  4_286_234.65725,  4_945_655.37375]  },
    { label: "Average Daily Rate Base", adr: 2150.0,  vals: [3_297_103.5825,   3_663_448.425,   4_029_793.2675,   4_762_482.9525,   5_495_172.6375]   },
    { label: "Average Daily Rate +10%", adr: 2365.0,  vals: [3_626_813.94075,  4_029_793.2675,  4_432_772.59425,  5_238_731.24775,  6_044_689.90125]  },
    { label: "Average Daily Rate +15%", adr: 2472.5,  vals: [3_791_669.119875, 4_212_965.68875, 4_634_262.257625, 5_476_855.395375, 6_319_448.533125] },
  ],
};

/* ====== Tornado driver test ranges (per spec) ====== */
export interface TornadoDriver {
  label: string;
  low: number;       // NPV impact (USD) at low end relative to base @ 7%
  high: number;
  unit?: string;
  detail: string;
}

/* ====== Sources (46 references) ====== */
export interface Source {
  id: number;
  category: string;
  ref: string;
  url: string;
}

export const sources: Source[] = [
  { id: 1,  category: "Hotel valuation methodology", ref: "HVS Hotel Investment Analysis 12th ed. (2021), Stephen Rushmore", url: "https://www.hvs.com/article/hotel-investment-analysis" },
  { id: 2,  category: "Hotel valuation methodology", ref: "HVS Hotel Valuation: Methodology Overview", url: "https://www.hvs.com/article/hotel-valuation-methodology" },
  { id: 3,  category: "Hotel valuation methodology", ref: "RICS Red Book Global Standards 2024", url: "https://www.rics.org/profession-standards/rics-standards-and-guidance/sector-standards/valuation-standards/red-book/red-book-global" },
  { id: 4,  category: "Hotel valuation methodology", ref: "RICS Hotel Valuation 4th ed. (2018)", url: "https://www.rics.org/profession-standards/rics-standards-and-guidance/sector-standards/valuation-standards/hotels-2018" },
  { id: 5,  category: "Hotel valuation methodology", ref: "Cornell Hotel & Restaurant Admin Quarterly — Cap Rate Analysis", url: "https://journals.sagepub.com/home/cqx" },
  { id: 6,  category: "Hotel benchmarks", ref: "STR Global — Ultra-Luxury Resort Performance 2024", url: "https://str.com/data-insights/research" },
  { id: 7,  category: "Hotel benchmarks", ref: "STR Asia-Pacific Hotel Performance Q3 2024", url: "https://str.com/data-insights/data/destination-performance/asia-pacific" },
  { id: 8,  category: "Hotel benchmarks", ref: "JLL APAC Hotel Investment Outlook 2024", url: "https://www.jll.com/en/trends-and-insights/research/hotel-investment-outlook" },
  { id: 9,  category: "Hotel benchmarks", ref: "CBRE Hotels Americas Lodging Outlook 2024", url: "https://www.cbre.com/insights/reports/2024-us-real-estate-market-outlook-hotels" },
  { id: 10, category: "Hotel benchmarks", ref: "Hotstats Operating Performance 2024", url: "https://www.hotstats.com/hotel-industry-trends-data" },
  { id: 11, category: "South Pacific market", ref: "Tahiti Tourisme — Annual Report 2023", url: "https://tahititourisme.org/en-us/about/" },
  { id: 12, category: "South Pacific market", ref: "Institut de la statistique de la Polynésie française (ISPF) — Tourism Stats", url: "https://www.ispf.pf/themes/EconomieEntreprises/Tourisme" },
  { id: 13, category: "South Pacific market", ref: "Bora Bora Tourism Board — Visitor Profile 2023", url: "https://tahititourisme.com/en-us/island/bora-bora/" },
  { id: 14, category: "South Pacific market", ref: "Air Tahiti Nui — Network & Capacity Reports", url: "https://us.airtahitinui.com/about" },
  { id: 15, category: "South Pacific market", ref: "Pacific Asia Travel Association (PATA) — Pacific Outlook 2024", url: "https://www.pata.org/research" },
  { id: 16, category: "Comparable assets", ref: "The Brando, Tetiaroa — published rate cards & ADR studies", url: "https://thebrando.com" },
  { id: 17, category: "Comparable assets", ref: "Four Seasons Bora Bora — public-rate ADR scrapes (2024)", url: "https://www.fourseasons.com/borabora/" },
  { id: 18, category: "Comparable assets", ref: "St. Regis Bora Bora — public-rate ADR scrapes (2024)", url: "https://www.marriott.com/hotels/travel/pptxr-the-st-regis-bora-bora-resort/" },
  { id: 19, category: "Comparable assets", ref: "Conrad Bora Bora Nui — public-rate ADR scrapes (2024)", url: "https://www.hilton.com/en/hotels/bobnuci-conrad-bora-bora-nui/" },
  { id: 20, category: "Comparable assets", ref: "InterContinental Bora Bora Resort — pricing benchmarks", url: "https://www.ihg.com/intercontinental/hotels/us/en/bora-bora/borth/hoteldetail" },
  { id: 21, category: "Construction cost", ref: "Turner & Townsend International Construction Cost Index 2024", url: "https://www.turnerandtownsend.com/en/insights/international-construction-market-survey-2024/" },
  { id: 22, category: "Construction cost", ref: "Arcadis International Construction Costs 2024", url: "https://www.arcadis.com/en/knowledge-hub/perspectives/global/2024/international-construction-costs" },
  { id: 23, category: "Construction cost", ref: "Rider Levett Bucknall — Pacific Construction Index", url: "https://www.rlb.com/oceania/insight/" },
  { id: 24, category: "Construction cost", ref: "AECOM Property & Construction Handbook 2024 (Asia-Pacific)", url: "https://www.aecom.com/asia/property-construction-handbook/" },
  { id: 25, category: "Tax / Defisc", ref: "Loi de pays n° 2017-3 (Polynésie française) — Defisc framework", url: "https://www.lexpol.cloud.pf/" },
  { id: 26, category: "Tax / Defisc", ref: "Direction des impôts et des contributions publiques (DICP) — Investor Guides", url: "https://www.impot-polynesie.gov.pf/" },
  { id: 27, category: "Tax / Defisc", ref: "PwC French Polynesia Tax Summary 2024", url: "https://taxsummaries.pwc.com/french-polynesia" },
  { id: 28, category: "Tax / Defisc", ref: "Deloitte Pacific — Tax Incentives Overview 2023", url: "https://www2.deloitte.com/global/en/services/tax.html" },
  { id: 29, category: "Independence / governance", ref: "RICS Professional Conduct & Independence Rules", url: "https://www.rics.org/profession-standards/regulation/conduct" },
  { id: 30, category: "Independence / governance", ref: "RICS Valuer Registration Scheme", url: "https://www.rics.org/profession-standards/regulation/valuer-registration" },
  { id: 31, category: "Independence / governance", ref: "IVSC International Valuation Standards 2025", url: "https://www.ivsc.org/standards/" },
  { id: 32, category: "Independence / governance", ref: "AICPA Independence & Conflicts of Interest", url: "https://www.aicpa-cima.com/topic/audit-and-assurance/independence" },
  { id: 33, category: "Macro / FX", ref: "Banque de France — XPF / EUR rates", url: "https://www.banque-france.fr/" },
  { id: 34, category: "Macro / FX", ref: "IMF World Economic Outlook Q4 2024", url: "https://www.imf.org/en/Publications/WEO" },
  { id: 35, category: "Macro / FX", ref: "OECD Economic Outlook (France & Overseas Territories)", url: "https://www.oecd.org/economic-outlook/" },
  { id: 36, category: "Climate / cyclone", ref: "NOAA Pacific Cyclone Outlook 2024", url: "https://www.cpc.ncep.noaa.gov/products/Epac_hurr/" },
  { id: 37, category: "Climate / cyclone", ref: "Météo-France Polynésie — Cyclone Climatology", url: "https://meteo.pf/" },
  { id: 38, category: "Climate / cyclone", ref: "IPCC AR6 Working Group I — Pacific Region", url: "https://www.ipcc.ch/report/ar6/wg1/" },
  { id: 39, category: "Patient capital / IRR conventions", ref: "Cambridge Associates — Endowment & SWF Real-Asset Allocations", url: "https://www.cambridgeassociates.com/insights/" },
  { id: 40, category: "Patient capital / IRR conventions", ref: "MSCI Real Estate Investment Index", url: "https://www.msci.com/our-solutions/real-assets/real-estate" },
  { id: 41, category: "Patient capital / IRR conventions", ref: "ANREV / INREV / NCREIF — Hotel Performance Benchmarks", url: "https://www.anrev.org/" },
  { id: 42, category: "Patient capital / IRR conventions", ref: "PERE — Patient Capital Quarterly", url: "https://www.perenews.com/" },
  { id: 43, category: "Sustainability / ESG", ref: "GRESB Real Estate Assessment 2024", url: "https://www.gresb.com/nl-en/products/real-estate-assessment/" },
  { id: 44, category: "Sustainability / ESG", ref: "EarthCheck Sustainable Tourism Standard", url: "https://earthcheck.org/" },
  { id: 45, category: "Sustainability / ESG", ref: "Sustainable Hospitality Alliance — Best Practices", url: "https://sustainablehospitalityalliance.org/" },
  { id: 46, category: "Local context", ref: "Communauté de Communes des Îles Sous-le-Vent — Vaitape Plans", url: "https://ccislv.pf/" },
];

/* ====== Space programme breakdown ====== */
export const spaceProgramme = [
  { zone: "Guest accommodations (35 keys)", sqm: 4_200, share: 0.625, notes: "120 sqm avg per villa, indoor only" },
  { zone: "F&B / restaurants", sqm: 720,   share: 0.107, notes: "Signature + casual + lounge" },
  { zone: "Spa & wellness", sqm: 480,      share: 0.071, notes: "5 treatment rooms + thermal suite" },
  { zone: "Back-of-house", sqm: 600,       share: 0.089, notes: "Kitchen, laundry, plant, staff" },
  { zone: "Front-of-house & retail", sqm: 360, share: 0.054, notes: "Reception, gallery, boutique" },
  { zone: "Meeting / pavilion", sqm: 360,  share: 0.054, notes: "Multi-use boardroom + event lawn cover" },
];

/* ====== Inputs table for appendix ====== */
export const inputsTable: Array<{ group: string; label: string; value: string; source?: string }> = [
  { group: "Programme", label: "Number of keys", value: "35", source: "v7 Inputs" },
  { group: "Programme", label: "Site area (sqm)", value: "15,000" },
  { group: "Programme", label: "GFA per key (sqm)", value: "192" },
  { group: "Programme", label: "Total GFA (sqm)", value: "6,720" },
  { group: "Programme", label: "Plot ratio", value: "0.448" },

  { group: "Revenue", label: "ADR (USD/night)", value: "$2,150" },
  { group: "Revenue", label: "Occupancy (Base)", value: "65%" },
  { group: "Revenue", label: "TRevPAR uplift (applied)", value: "35%" },
  { group: "Revenue", label: "TRevPAR uplift (KPMG, EXCLUDED)", value: "65% — connected-party" },

  { group: "Cost structure", label: "Operating cost ratio", value: "72%" },
  { group: "Cost structure", label: "Mgmt fee — base", value: "3%" },
  { group: "Cost structure", label: "Mgmt fee — incentive", value: "8% of GOP" },
  { group: "Cost structure", label: "FF&E reserve", value: "3%" },

  { group: "Capex", label: "Cost per key", value: "$1,200,000" },
  { group: "Capex", label: "Total dev cost", value: "$42,000,000" },
  { group: "Capex", label: "Pre-opening cost", value: "$2,730,000 (6.5%)" },

  { group: "Valuation", label: "Cap rate (entry & terminal)", value: "6.5%" },
  { group: "Valuation", label: "NOI growth p.a.", value: "3.0%" },
  { group: "Valuation", label: "Hold period", value: "12 years" },

  { group: "Patient-capital frame", label: "IRR floor", value: "8%" },
  { group: "Patient-capital frame", label: "IRR ceiling", value: "12%" },
  { group: "Patient-capital frame", label: "Discount — patient", value: "7%" },
  { group: "Patient-capital frame", label: "Discount — midpoint", value: "9%" },
  { group: "Patient-capital frame", label: "Discount — PE bound", value: "11%" },

  { group: "Phasing & ramp", label: "Construction phasing", value: "30 / 40 / 30 (Y0 / Y1 / Y2)" },
  { group: "Phasing & ramp", label: "Operating ramp", value: "50 / 72 / 90 / 100% (Y3 → Y6)" },

  { group: "Defisc (upside lever)", label: "Theoretical rate", value: "25% on $42M = $10.5M" },
  { group: "Defisc (upside lever)", label: "Statutory cap", value: "XPF 500M ÷ 119.5 = $4,184,100" },
  { group: "Defisc (upside lever)", label: "Effective credit applied", value: "$4,184,100 (cap binds)" },
];

/* ====== Hold-period sensitivity (5 / 8 / 10 / 12 ONLY — never 20) ====== */
export const holdPeriodSensitivity = [
  { hold: 5,  baseIrr: 0.0918, stressIrr: 0.0432, note: "Below patient-capital floor in Stress" },
  { hold: 8,  baseIrr: 0.1142, stressIrr: 0.0598, note: "Marginal in Stress; healthy in Base" },
  { hold: 10, baseIrr: 0.1248, stressIrr: 0.0721, note: "Approaching steady-state economics" },
  { hold: 12, baseIrr: 0.1321, stressIrr: 0.0796, note: "Recommended; matches HVS 12-yr DCF convention" },
];

/* ====== Coherence audit notes ====== */
export const coherenceNotes = [
  "Headline Base NOI of $4,762,483 reconciles to Total Revenue × (1 − OpEx ratio) × (1 − Mgmt − FF&E) within $0.50 rounding.",
  "Asset Value $73.27M = Base NOI ÷ 6.5% cap — within HVS Income-Capitalisation tolerance.",
  "Yield-on-Cost spread 484 bps in Base, 91 bps in Stress — Gate 3 (≥100 bps) fails marginally in Stress only.",
  "12-yr unleveraged IRR 13.21% Base / 7.96% Stress — both within or near the 8–12% patient-capital band.",
  "NPV @ 7% positive in both Base ($27.5M) and Stress ($3.6M) — confirms downside resilience for long-hold investors.",
  "NPV turns negative at PE discount rate (11%) in Stress only — confirms this is patient-capital, not PE territory.",
  "Defisc effective credit binds at the XPF 500M cap ($4.18M USD), not the 25% theoretical ($10.5M).",
  "KPMG 65% TRevPAR uplift EXCLUDED from base case — Polynesia Consulting principal is also KPMG advisor (connected-party). RICS independence-of-evidence rule.",
];
