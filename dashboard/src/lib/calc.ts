/**
 * Vaitape calculation utilities.
 * - computeScenario: stabilised NOI/Asset Value/Dev Yield from scenario inputs
 * - computeCashflows: 12-yr ramped/phased cashflow series (length 13: Y0 → Y12)
 * - npv / irr: standard finance helpers (IRR via Newton-Raphson)
 */

import { inputs } from "@/data/model";

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

const KEYS = inputs.keys;
const DAYS = 365;
const ADR_BASE = inputs.adr_base;
const OPEX_RATIO = inputs.opex_ratio;
const MGMT_BASE = inputs.mgmt_base;
const MGMT_INCENTIVE = inputs.mgmt_incentive;
const FFE = inputs.ffe_reserve;
const CAP_RATE = inputs.cap_rate;
const TOTAL_DEV_COST = inputs.total_dev_cost;

export function computeScenario(s: ScenarioInputs): ScenarioComputed {
  const adr = ADR_BASE * (1 + s.adrShift);
  const revpar = adr * s.occupancy;
  const roomRevenue = KEYS * DAYS * revpar;
  const totalRevenue = roomRevenue * (1 + s.trevparUplift);
  const opex = totalRevenue * OPEX_RATIO;
  const gop = totalRevenue - opex;
  const mgmtBaseFee = totalRevenue * MGMT_BASE;
  const mgmtIncentiveFee = gop * MGMT_INCENTIVE;
  const ebitda = gop - mgmtBaseFee - mgmtIncentiveFee;
  const ffe = totalRevenue * FFE;
  const noi = ebitda - ffe;
  const assetValue = noi / CAP_RATE;
  const devYield = noi / TOTAL_DEV_COST;
  const yieldSpread = devYield - CAP_RATE;
  return {
    adr, occupancy: s.occupancy, revpar, roomRevenue, totalRevenue,
    opex, gop, gopMargin: gop / totalRevenue, mgmtBaseFee, mgmtIncentiveFee,
    ebitda, ffe, noi, assetValue, devYield, yieldSpread,
  };
}

/**
 * 12-yr unleveraged cashflow stream (length 13: index 0 = Y0).
 * Construction phasing: Y0 30%, Y1 40%, Y2 30% of total dev cost (negative outflows).
 * Operating ramp: Y3 50%, Y4 72%, Y5 90%, Y6+ 100% of stabilised NOI.
 * NOI growth 3% p.a. from Y6 onwards.
 * Terminal value at Y12: NOI_Y13 / 6.5% added to Y12 cashflow (Gordon exit).
 */
export function computeCashflows(stabilisedNOI: number): number[] {
  const phase = inputs.phase;
  const ramp = inputs.ramp;
  const totalCost = inputs.total_dev_cost;
  const growth = inputs.noi_growth;
  const cap = inputs.cap_rate;

  const cf: number[] = [];
  cf[0] = -totalCost * phase.y0;                       // Y0  -12.6M
  cf[1] = -totalCost * phase.y1;                       // Y1  -16.8M
  cf[2] = -(totalCost * phase.y2 + inputs.preopen_cost); // Y2  -15.33M (preopen lands here)

  cf[3] = stabilisedNOI * ramp.y3;
  cf[4] = stabilisedNOI * ramp.y4;
  cf[5] = stabilisedNOI * ramp.y5;
  cf[6] = stabilisedNOI * ramp.y6;
  // Y7-Y12 grow at 3% from Y6 baseline
  let prev = cf[6];
  for (let y = 7; y <= 12; y++) {
    prev = prev * (1 + growth);
    cf[y] = prev;
  }
  // Terminal value @ Y12: NOI_Y13 / cap, where NOI_Y13 = NOI_Y12 * 1.03
  const noiY13 = cf[12] * (1 + growth);
  const terminal = noiY13 / cap;
  cf[12] = cf[12] + terminal;
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

export function gateVerdict(scenario: ScenarioComputed | null): {
  gate1: "PASS" | "FAIL"; gate1Detail: string;
  gate3: "PASS" | "FAIL"; gate3Detail: string;
} {
  if (!scenario) {
    return {
      gate1: "FAIL", gate1Detail: "—",
      gate3: "FAIL", gate3Detail: "—",
    };
  }
  const gate1 = scenario.assetValue > TOTAL_DEV_COST ? "PASS" : "FAIL";
  const gate3 = scenario.yieldSpread >= 0.01 ? "PASS" : "FAIL";
  return {
    gate1,
    gate1Detail: `AV $${(scenario.assetValue / 1e6).toFixed(2)}M vs Cost $42.00M`,
    gate3,
    gate3Detail: `Spread ${(scenario.yieldSpread * 10000).toFixed(0)} bps (vs 100 bps target)`,
  };
}
