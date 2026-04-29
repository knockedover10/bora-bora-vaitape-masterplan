import { useMemo, useState } from "react";
import type { ScenarioKey, ScenarioRow } from "@/data/model";
import { computeScenario, computeCashflows, irr, npv } from "@/lib/calc";
import type { ModelInputs } from "@/hooks/useModelInputs";

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
}

const customSeedsDefault = {
  customA: { adrShift: 0,    occ: 0.6, trevpar: 0.35 },
  customB: { adrShift: -0.05, occ: 0.6, trevpar: 0.30 },
  customC: { adrShift: 0.05,  occ: 0.7, trevpar: 0.40 },
};

/**
 * Build a scenario bundle from raw scenario shifts + global ModelInputs.
 * Used for both the fixed Base/Upside/Stress trio (now computed live) and the
 * three user-editable Scenario A/B/C slots.
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
  };
}

export function useScenarios(m: ModelInputs) {
  const [activeKey, setActiveKey] = useState<ScenarioKey>("base");

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

    // Base — uses current ModelInputs occupancy + trevpar uplift, ADR shift = 0
    out.push(
      buildBundle(
        "base",
        "Base Case",
        true,
        true,
        { adrShift: 0, occupancy: m.occBase, trevparUplift: m.trevparUplift },
        m
      )
    );

    // Upside — base + 7pp occ, +15% ADR, same TRevPAR (capped at 0.85)
    const upsideOcc = Math.min(m.occBase + 0.07, 0.85);
    out.push(
      buildBundle(
        "upside",
        "Upside",
        true,
        true,
        { adrShift: 0.15, occupancy: upsideOcc, trevparUplift: m.trevparUplift },
        m
      )
    );

    // Combined Stress — ADR -15%, occupancy floored at 50%, same TRevPAR
    out.push(
      buildBundle(
        "stress",
        "Combined Stress",
        true,
        true,
        { adrShift: -0.15, occupancy: 0.5, trevparUplift: m.trevparUplift },
        m
      )
    );

    // User-editable Scenario A/B/C
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
  }, [customs, m]);

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
  };
}
