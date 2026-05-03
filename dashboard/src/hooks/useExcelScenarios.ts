/**
 * useExcelScenarios — loads the Excel-exported scenarios.json from
 * /data/scenarios.json and exposes a typed view of all three Excel-driven
 * scenarios (Upside / Base / Stress).
 *
 * Source of truth: Hotel_DCF_Sensitivity_Model_v2.xlsx
 * Export script: /home/user/workspace/export_scenarios.py
 *
 * The three fixed scenarios in useScenarios.ts will overlay these values onto
 * their bundles so every KPI in the dashboard reacts when the user toggles
 * Upside ↔ Base ↔ Stress in the scenario bar.
 */

import { useEffect, useState } from "react";

export interface ExcelScenarioInputs {
  keys: number;
  stabilized_occupancy: number;
  stabilized_adr: number;
  stabilized_revpar: number;
  fnb_pct_rooms: number;
  other_pct_rooms: number;
  departmental_exp_pct: number;
  undistributed_opex_pct: number;
  tax_insurance_pct: number;
  mgmt_fee_pct: number;
  ffe_reserve_pct: number;
  adr_growth: number;
  opex_inflation: number;
  total_dev_cost: number;
  discount_rate: number;
  exit_cap_rate: number;
  renovation_cycle_yrs: number;
  renovation_capex_pct: number;
}

export interface ExcelHeadline {
  npv: number;
  irr: number;
  equity_multiple: number;
  dev_yield_y4: number;
  yield_spread: number;
  implied_asset_value: number;
  asset_value_surplus: number;
}

export interface ExcelStabilisedPnl {
  rooms_revenue: number;
  fnb_revenue: number;
  other_revenue: number;
  total_revenue: number;
  total_opex: number;
  gop: number;
  gop_margin: number;
  noi: number;
  noi_margin: number;
  fcf: number;
}

export interface ExcelHoldingPeriod {
  years: number;
  initial_investment: number;
  npv: number;
  irr: number;
  equity_multiple: number;
  irr_spread: number;
}

export interface ExcelCashFlowSeries {
  years: number[];
  occupancy: number[];
  adr: number[];
  revpar: number[];
  rooms_revenue: number[];
  fnb_revenue: number[];
  other_revenue: number[];
  total_revenue: number[];
  total_opex: number[];
  noi: number[];
  capex: number[];
  operating_fcf: number[];
}

export interface ExcelNpvAtRates {
  d_07: number;
  d_09: number;
  d_095: number;
  d_11: number;
}

export interface ExcelScenarioRow {
  inputs: ExcelScenarioInputs;
  headline: ExcelHeadline;
  stabilised_pnl: ExcelStabilisedPnl;
  holding_periods: Record<string, ExcelHoldingPeriod>;
  cash_flow_series: ExcelCashFlowSeries;
  total_cf_10yr: number[];
  npv_at_rates: ExcelNpvAtRates;
}

export interface ExcelScenariosFile {
  meta: {
    generated_at: string;
    source: string;
    scenarios: string[];
  };
  scenarios: {
    upside: ExcelScenarioRow;
    base: ExcelScenarioRow;
    stress: ExcelScenarioRow;
  };
}

const DATA_URL = `${import.meta.env.BASE_URL}data/scenarios.json`;

export function useExcelScenarios() {
  const [data, setData] = useState<ExcelScenariosFile | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(DATA_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to fetch scenarios.json: ${r.status}`);
        return r.json() as Promise<ExcelScenariosFile>;
      })
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e) => {
        if (!cancelled) setError(e);
        // eslint-disable-next-line no-console
        console.warn("[useExcelScenarios] failed to load — falling back to live calc", e);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, error, loaded: data !== null };
}

/**
 * Compute NPV for a given discount rate from a cashflow stream that begins at
 * Y0 (initial investment) and runs through Y(N).
 */
export function npvFromExcel(rate: number, fcf: number[], totalDevCost: number): number {
  // The Excel operating_fcf stream starts at Year 1; Year 0 outflow = -totalDevCost.
  const cf = [-totalDevCost, ...fcf];
  let v = 0;
  for (let t = 0; t < cf.length; t++) v += cf[t]! / Math.pow(1 + rate, t);
  return v;
}
