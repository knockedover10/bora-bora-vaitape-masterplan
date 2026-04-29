/**
 * Vaitape calculation utilities (v7.1).
 * - All scenario / cashflow / verdict math is parameterised on a `ModelInputs`
 *   object so it can react live to the editable-inputs drawer.
 * - Phasing, ramp, mgmt-fee constants and pre-opening reserve assumption stay
 *   read from the static anchors in `data/model.ts`.
 */

import { inputs as anchors } from "@/data/model";
import type { ModelInputs } from "@/hooks/useModelInputs";

export interface ScenarioInputs {
  /** ADR shift relative to ADR_BASE — e.g. -0.15 for −15% */
  adrShift: number;
  /** Absolute occupancy, e.g. 0.65 */
  occupancy: number;
  /** TRevPAR uplift, e.g. 0.35 */
  trevparUplift: number;
}

export interface ScenarioComputed {
  adr: number;
  occupancy: number;
  revpar: number;
  roomRevenue: number;
  totalRevenue: number;
  opex: number;
  gop: number;
  gopMargin: number;
  mgmtBaseFee: number;
  mgmtIncentiveFee: number;
  ebitda: number;
  ffe: number;
  noi: number;
  assetValue: number;
  devYield: number;
  yieldSpread: number;
}

const DAYS = 365;
// Mgmt fees stay hard-coded — not in the editable-inputs list per spec.
const MGMT_BASE = anchors.mgmt_base;
const MGMT_INCENTIVE = anchors.mgmt_incentive;

export function computeScenario(s: ScenarioInputs, m: ModelInputs): ScenarioComputed {
  const adr = m.adrBase * (1 + s.adrShift);
  const revpar = adr * s.occupancy;
  const roomRevenue = m.keys * DAYS * revpar;
  const totalRevenue = roomRevenue * (1 + s.trevparUplift);
  const opex = totalRevenue * m.opexRatio;
  const gop = totalRevenue - opex;
  const mgmtBaseFee = totalRevenue * MGMT_BASE;
  const mgmtIncentiveFee = gop * MGMT_INCENTIVE;
  const ebitda = gop - mgmtBaseFee - mgmtIncentiveFee;
  const ffe = totalRevenue * m.ffeReserve;
  const noi = ebitda - ffe;
  const assetValue = noi / m.capRate;
  const devYield = noi / m.totalDevCost;
  const yieldSpread = devYield - m.capRate;
  return {
    adr, occupancy: s.occupancy, revpar, roomRevenue, totalRevenue,
    opex, gop, gopMargin: gop / totalRevenue, mgmtBaseFee, mgmtIncentiveFee,
    ebitda, ffe, noi, assetValue, devYield, yieldSpread,
  };
}

/**
 * Unleveraged cashflow stream over the full hold horizon.
 * Length = 3 (construction Y0/Y1/Y2) + holdYears (operating Y3..Y(2+holdYears))
 * For the default holdYears=12, this returns 15 entries (Y0..Y14) — but the
 * historical anchors used a 12-yr hold meaning indices 0..12 (13 entries).
 *
 * To keep the anchor-exact baseline numbers, we treat `m.holdYears` as the
 * number of operating years from Y3 inclusive through to and including the
 * exit year. Default 12 → indices 0..14 with terminal value at Y14? That
 * breaks the existing $98.67M Y12 figure.
 *
 * Reconciling: the merged Excel uses a 12-yr hold meaning Y0..Y12 (3 yr build
 * + 10 yr operating? actually 9 operating + Y12 exit). To preserve the
 * authoritative anchors at default holdYears=12, treat holdYears as the index
 * of the exit year (inclusive). So default 12 → array length 13 (Y0..Y12).
 */
export function computeCashflows(stabilisedNOI: number, m: ModelInputs): number[] {
  const phase = anchors.phase;
  const ramp = anchors.ramp;
  const totalCost = m.totalDevCost;
  const growth = m.noiGrowth;
  const cap = m.capRate;
  const exitYear = m.holdYears; // inclusive index, Y0..Y(exitYear)

  const cf: number[] = [];
  cf[0] = -totalCost * phase.y0;
  cf[1] = -totalCost * phase.y1;
  // Pre-opening cost scales with totalDevCost using the anchor pre-open percentage.
  const preopen = totalCost * anchors.preopen_pct;
  cf[2] = -(totalCost * phase.y2 + preopen);

  // Operating years: Y3..Y(exitYear)
  if (exitYear >= 3) cf[3] = stabilisedNOI * ramp.y3;
  if (exitYear >= 4) cf[4] = stabilisedNOI * ramp.y4;
  if (exitYear >= 5) cf[5] = stabilisedNOI * ramp.y5;
  if (exitYear >= 6) cf[6] = stabilisedNOI * ramp.y6;
  let prev = cf[Math.min(6, exitYear)] ?? 0;
  for (let y = 7; y <= exitYear; y++) {
    prev = prev * (1 + growth);
    cf[y] = prev;
  }

  // Terminal value at exit year (Gordon exit at terminal cap = current capRate)
  if (exitYear >= 3) {
    const noiNext = (cf[exitYear] ?? 0) * (1 + growth);
    const terminal = noiNext / cap;
    cf[exitYear] = (cf[exitYear] ?? 0) + terminal;
  }
  return cf;
}

export function npv(rate: number, cashflows: number[]): number {
  let v = 0;
  for (let t = 0; t < cashflows.length; t++) {
    v += cashflows[t] / Math.pow(1 + rate, t);
  }
  return v;
}

/**
 * Newton-Raphson IRR. Returns annualised IRR or NaN if not convergent.
 */
export function irr(cashflows: number[], guess = 0.1): number {
  const MAX_ITER = 200;
  const EPS = 1e-9;
  let r = guess;
  for (let i = 0; i < MAX_ITER; i++) {
    let f = 0;
    let fp = 0;
    for (let t = 0; t < cashflows.length; t++) {
      const denom = Math.pow(1 + r, t);
      f += cashflows[t] / denom;
      if (t > 0) fp += -t * cashflows[t] / Math.pow(1 + r, t + 1);
    }
    if (Math.abs(f) < EPS) return r;
    if (fp === 0) break;
    const next = r - f / fp;
    if (!isFinite(next)) break;
    if (Math.abs(next - r) < EPS) return next;
    r = next;
  }
  // Fallback: bisection between -0.99 and 1.0
  let lo = -0.99;
  let hi = 1.0;
  let fLo = npv(lo, cashflows);
  let fHi = npv(hi, cashflows);
  if (fLo * fHi > 0) return NaN;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fm = npv(mid, cashflows);
    if (Math.abs(fm) < EPS) return mid;
    if (fLo * fm < 0) {
      hi = mid;
      fHi = fm;
    } else {
      lo = mid;
      fLo = fm;
    }
  }
  return (lo + hi) / 2;
}

export function gateVerdict(scenario: ScenarioComputed | null, m: ModelInputs): {
  gate1: "PASS" | "FAIL"; gate1Detail: string;
  gate3: "PASS" | "FAIL"; gate3Detail: string;
} {
  if (!scenario) {
    return {
      gate1: "FAIL", gate1Detail: "—",
      gate3: "FAIL", gate3Detail: "—",
    };
  }
  const gate1 = scenario.assetValue > m.totalDevCost ? "PASS" : "FAIL";
  const gate3 = scenario.yieldSpread >= 0.01 ? "PASS" : "FAIL";
  return {
    gate1,
    gate1Detail: `Asset Value $${(scenario.assetValue / 1e6).toFixed(2)}M vs Cost $${(m.totalDevCost / 1e6).toFixed(2)}M`,
    gate3,
    gate3Detail: `Spread ${(scenario.yieldSpread * 10000).toFixed(0)} basis points (vs 100 basis points target)`,
  };
}
