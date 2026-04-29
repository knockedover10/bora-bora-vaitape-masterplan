import { useMemo, useState } from "react";
import {
  fixedScenarios,
  customSeeds,
  type ScenarioKey,
  type ScenarioRow,
} from "@/data/model";
import { computeScenario, computeCashflows, irr, npv } from "@/lib/calc";

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

const baseIrr = 0.132132781593379;
const stressIrr = 0.0796021588847064;
const baseNpv = { 7: 27_509_295.8689708, 9: 16_438_556.9944855, 11: 7_652_968.73807797 };
const stressNpv = { 7: 3_555_433.73914214, 9: -3_414_873.69596192, 11: -8_903_665.18398358 };

// Pre-computed for upside via spec convention: same DCF logic, NOI = upside.noi
const upsideRow = fixedScenarios[1]!;
const upsideCashflows = computeCashflows(upsideRow.noi!);
const upsideIrr = irr(upsideCashflows);

const baseCashflowsExact = [
  -12_600_000, -16_800_000, -15_330_000,
  2_381_241.47625, 3_428_987.7258, 4_286_234.65725,
  4_762_482.9525, 5_052_518.16430725, 5_204_093.70923647,
  5_360_216.52051356, 5_521_023.01612897, 5_686_653.70661284,
  98_672_190.5077429,
];
const stressCashflowsExact = [
  -12_600_000, -16_800_000, -15_330_000,
  1_556_965.580625, 2_242_030.4361, 2_802_538.045125,
  3_113_931.16125, 3_303_569.56897012, 3_402_676.65603923,
  3_504_756.95572041, 3_609_899.66439202, 3_718_196.65432378,
  64_516_432.2550627,
];

export function useScenarios() {
  const [activeKey, setActiveKey] = useState<ScenarioKey>("base");

  const [fixedActive, setFixedActive] = useState<Record<"base" | "upside" | "stress", boolean>>({
    base: true,
    upside: true,
    stress: true,
  });

  const [customs, setCustoms] = useState<Record<"customA" | "customB" | "customC", CustomEdit>>({
    customA: { ...customSeeds.customA, active: false },
    customB: { ...customSeeds.customB, active: false },
    customC: { ...customSeeds.customC, active: false },
  });

  const scenarios = useMemo<ScenarioBundle[]>(() => {
    const out: ScenarioBundle[] = [];

    // Base
    out.push({
      ...fixedScenarios[0]!,
      irr12yr: baseIrr,
      npv7: baseNpv[7],
      npv9: baseNpv[9],
      npv11: baseNpv[11],
      cashflows: baseCashflowsExact,
    });

    // Upside (no exact DCF in anchors — derive)
    out.push({
      ...upsideRow,
      irr12yr: upsideIrr,
      npv7: npv(0.07, upsideCashflows),
      npv9: npv(0.09, upsideCashflows),
      npv11: npv(0.11, upsideCashflows),
      cashflows: upsideCashflows,
    });

    // Stress
    out.push({
      ...fixedScenarios[2]!,
      irr12yr: stressIrr,
      npv7: stressNpv[7],
      npv9: stressNpv[9],
      npv11: stressNpv[11],
      cashflows: stressCashflowsExact,
    });

    // Customs
    (["customA", "customB", "customC"] as const).forEach((k, i) => {
      const c = customs[k];
      const computed = computeScenario({
        adrShift: c.adrShift,
        occupancy: c.occ,
        trevparUplift: c.trevpar,
      });
      const cf = computeCashflows(computed.noi);
      out.push({
        key: k,
        label: ["Custom A", "Custom B", "Custom C"][i] as string,
        fixed: false,
        defaultActive: false,
        adr: computed.adr,
        occ: computed.occupancy,
        trevpar_uplift: c.trevpar,
        revpar: computed.revpar,
        total_revenue: computed.totalRevenue,
        gop: computed.gop,
        gop_margin: computed.gopMargin,
        ebitda: computed.ebitda,
        noi: computed.noi,
        asset_value: computed.assetValue,
        dev_yield: computed.devYield,
        yield_spread: computed.yieldSpread,
        gate1: computed.assetValue > 42_000_000 ? "PASS" : "FAIL",
        gate3: computed.yieldSpread >= 0.01 ? "PASS" : "FAIL",
        irr12yr: irr(cf),
        npv7: npv(0.07, cf),
        npv9: npv(0.09, cf),
        npv11: npv(0.11, cf),
        cashflows: cf,
      });
    });

    return out;
  }, [customs]);

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
