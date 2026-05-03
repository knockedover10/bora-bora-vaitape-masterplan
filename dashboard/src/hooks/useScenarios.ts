import { useMemo, useState } from "react";
import type { ScenarioKey, ScenarioRow } from "@/data/model";
import { computeScenario, computeCashflows, irr, npv } from "@/lib/calc";
import type { ModelInputs } from "@/hooks/useModelInputs";
import { useExcelScenarios, type ExcelScenarioRow } from "@/hooks/useExcelScenarios";

export interface CustomEdit {
  adrShift: number;
  occ: number;
  trevpar: number;
  active: boolean;
}

export interface ScenarioBundle extends ScenarioRow {
  irr12yr: number | null;
  npv7: number | null;
  npv9: number | null;
  npv11: number | null;
  cashflows: number[] | null;
  /** Set when this bundle was sourced from Excel scenarios.json (vs live calc). */
  fromExcel?: boolean;
  /** Optional raw Excel scenario data — exposed so tabs can drill into per-year P&L. */
  excel?: ExcelScenarioRow;
}

const customSeedsDefault = {
  customA: { adrShift: 0,    occ: 0.6, trevpar: 0.35 },
  customB: { adrShift: -0.05, occ: 0.6, trevpar: 0.30 },
  customC: { adrShift: 0.05,  occ: 0.7, trevpar: 0.40 },
};

/**
 * Build a scenario bundle from raw scenario shifts + global ModelInputs.
 * Used for the user-editable Scenario A/B/C slots — the fixed Base/Upside/Stress
 * trio is sourced from the Excel export (scenarios.json) when available.
 */
function buildBundle(
  key: ScenarioKey,
  label: string,
  defaultActive: boolean,
  fixed: boolean,
  shifts: { adrShift: number; occupancy: number; trevparUplift: number },
  m: ModelInputs
): ScenarioBundle {
  const c = computeScenario(
    { adrShift: shifts.adrShift, occupancy: shifts.occupancy, trevparUplift: shifts.trevparUplift },
    m
  );
  const cf = computeCashflows(c.noi, m);
  return {
    key, label, fixed, defaultActive,
    adr: c.adr,
    occ: c.occupancy,
    trevpar_uplift: shifts.trevparUplift,
    revpar: c.revpar,
    total_revenue: c.totalRevenue,
    gop: c.gop,
    gop_margin: c.gopMargin,
    ebitda: c.ebitda,
    noi: c.noi,
    asset_value: c.assetValue,
    dev_yield: c.devYield,
    yield_spread: c.yieldSpread,
    gate1: c.assetValue > m.totalDevCost ? "PASS" : "FAIL",
    gate3: c.yieldSpread >= 0.01 ? "PASS" : "FAIL",
    irr12yr: irr(cf),
    npv7: npv(0.07, cf),
    npv9: npv(0.09, cf),
    npv11: npv(0.11, cf),
    cashflows: cf,
    fromExcel: false,
  };
}

/**
 * Build a scenario bundle directly from Excel scenarios.json output.
 * This makes the dashboard fully reactive to the OPERATING SCENARIO SWITCHER
 * in Hotel_DCF_Sensitivity_Model_v2.xlsx.
 */
function buildBundleFromExcel(
  key: ScenarioKey,
  label: string,
  defaultActive: boolean,
  excel: ExcelScenarioRow,
  m: ModelInputs
): ScenarioBundle {
  const inp = excel.inputs;
  const pnl = excel.stabilised_pnl;
  const head = excel.headline;
  const npvs = excel.npv_at_rates;
  const cap = inp.exit_cap_rate;

  // Implied TRevPAR uplift = (FnB + Other revenue) / Rooms revenue
  const trevparUplift =
    (pnl.fnb_revenue + pnl.other_revenue) / pnl.rooms_revenue;

  const ebitda = pnl.gop * (1 - 0.08); // mgmt incentive 8% (anchors)
  // total dev cost from Excel (overrides the editable input for fixed scenarios)
  const devCost = inp.total_dev_cost;
  const assetValue = head.implied_asset_value;
  const devYield = head.dev_yield_y4;
  const yieldSpread = head.yield_spread;

  return {
    key,
    label,
    fixed: true,
    defaultActive,
    adr: inp.stabilized_adr,
    occ: inp.stabilized_occupancy,
    trevpar_uplift: trevparUplift,
    revpar: inp.stabilized_revpar,
    total_revenue: pnl.total_revenue,
    gop: pnl.gop,
    gop_margin: pnl.gop_margin,
    ebitda,
    noi: pnl.noi,
    asset_value: assetValue,
    dev_yield: devYield,
    yield_spread: yieldSpread,
    gate1: assetValue > devCost ? "PASS" : "FAIL",
    gate3: yieldSpread >= 0.01 ? "PASS" : "FAIL",
    irr12yr: head.irr,
    npv7: npvs.d_07,
    npv9: npvs.d_09,
    npv11: npvs.d_11,
    cashflows: excel.cash_flow_series.operating_fcf,
    fromExcel: true,
    excel,
    // ignore m, capRate vs inp.cap is already accounted for in Excel
    _cap: cap,
  } as ScenarioBundle;
}

export function useScenarios(m: ModelInputs) {
  const [activeKey, setActiveKey] = useState<ScenarioKey>("base");
  const { data: excelData } = useExcelScenarios();

  const [fixedActive, setFixedActive] = useState<Record<"base" | "upside" | "stress", boolean>>({
    base: true,
    upside: true,
    stress: true,
  });

  const [customs, setCustoms] = useState<Record<"customA" | "customB" | "customC", CustomEdit>>({
    customA: { ...customSeedsDefault.customA, active: false },
    customB: { ...customSeedsDefault.customB, active: false },
    customC: { ...customSeedsDefault.customC, active: false },
  });

  const scenarios = useMemo<ScenarioBundle[]>(() => {
    const out: ScenarioBundle[] = [];

    // Fixed trio — ordered Stress → Base → Upside (downside, expected, upside) so the
    // scenario bar reads as a risk spectrum. This order propagates everywhere that
    // consumes `scenarios` (chips, IRR bars, NPV table, P&L table, etc.).
    if (excelData) {
      out.push(buildBundleFromExcel("stress", "Stress", true, excelData.scenarios.stress, m));
      out.push(buildBundleFromExcel("base", "Base", true, excelData.scenarios.base, m));
      out.push(buildBundleFromExcel("upside", "Upside", true, excelData.scenarios.upside, m));
    } else {
      // Fallback live-calc trio (matches former behaviour while JSON loads)
      out.push(
        buildBundle("stress", "Stress", true, true, { adrShift: -0.15, occupancy: 0.5, trevparUplift: m.trevparUplift }, m)
      );
      out.push(
        buildBundle("base", "Base", true, true, { adrShift: 0, occupancy: m.occBase, trevparUplift: m.trevparUplift }, m)
      );
      const upsideOcc = Math.min(m.occBase + 0.07, 0.85);
      out.push(
        buildBundle("upside", "Upside", true, true, { adrShift: 0.15, occupancy: upsideOcc, trevparUplift: m.trevparUplift }, m)
      );
    }

    // User-editable Scenario A/B/C — always live-calc against current ModelInputs
    (["customA", "customB", "customC"] as const).forEach((k, i) => {
      const c = customs[k];
      out.push(
        buildBundle(
          k,
          ["Scenario A", "Scenario B", "Scenario C"][i] as string,
          false,
          false,
          { adrShift: c.adrShift, occupancy: c.occ, trevparUplift: c.trevpar },
          m
        )
      );
    });

    return out;
  }, [customs, m, excelData]);

  const activeScenarios = useMemo(() => {
    return scenarios.filter((s) => {
      if (s.key === "base") return fixedActive.base;
      if (s.key === "upside") return fixedActive.upside;
      if (s.key === "stress") return fixedActive.stress;
      return customs[s.key as "customA" | "customB" | "customC"].active;
    });
  }, [scenarios, fixedActive, customs]);

  const active = scenarios.find((s) => s.key === activeKey) ?? scenarios[0]!;

  function isActive(key: ScenarioKey) {
    if (key === "base") return fixedActive.base;
    if (key === "upside") return fixedActive.upside;
    if (key === "stress") return fixedActive.stress;
    return customs[key as "customA" | "customB" | "customC"].active;
  }

  function toggle(key: ScenarioKey) {
    if (key === "base" || key === "upside" || key === "stress") {
      setFixedActive((p) => ({ ...p, [key]: !p[key] }));
    } else {
      const k = key as "customA" | "customB" | "customC";
      setCustoms((p) => ({ ...p, [k]: { ...p[k], active: !p[k].active } }));
    }
  }

  function updateCustom(key: "customA" | "customB" | "customC", patch: Partial<CustomEdit>) {
    setCustoms((p) => ({ ...p, [key]: { ...p[key], ...patch } }));
  }

  return {
    scenarios,
    activeScenarios,
    active,
    activeKey,
    setActiveKey,
    toggle,
    isActive,
    customs,
    updateCustom,
    excelLoaded: excelData !== null,
  };
}
