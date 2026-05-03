import { ArrowRight, Sparkles, Check, X, AlertTriangle } from "lucide-react";
import { GateTile } from "@/components/GateTile";
import { fmtCurrency, fmtPercent, fmtBps, cn } from "@/lib/utils";
import { inputs as anchors } from "@/data/model";
import type { ScenarioBundle } from "@/hooks/useScenarios";
import type { ModelInputs } from "@/hooks/useModelInputs";

interface Props {
  active: ScenarioBundle;
  scenarios: ScenarioBundle[];
  inputs: ModelInputs;
  isModified: boolean;
  onJumpToAppendix: () => void;
}

/** Small amber dot rendered next to KPI values when inputs are modified. */
function ModDot({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span
      title="Recalculated From Your Inputs"
      aria-label="Recalculated From Your Inputs"
      className="ml-1.5 inline-block h-2 w-2 rounded-full bg-[hsl(var(--warning))] align-middle"
    />
  );
}

/**
 * Headline Verdict — figures-only mirror of slide 3 of the v7.1 deck.
 * No narrative prose; numbers carry the story. Live values from the model.
 */
export function TabVerdict({ active, scenarios, inputs: m, isModified, onJumpToAppendix }: Props) {
  const base = scenarios.find((s) => s.key === "base") ?? active;
  const stress = scenarios.find((s) => s.key === "stress") ?? active;

  // Pull metric values from Base and Stress bundles
  const devYBase = base.dev_yield ?? 0;
  const devYStress = stress.dev_yield ?? 0;
  const spreadBase = base.yield_spread ?? 0;
  const spreadStress = stress.yield_spread ?? 0;

  const irrBase = base.irr12yr ?? 0;
  const irrStress = stress.irr12yr ?? 0;

  const npv7Base = base.npv7 ?? 0;
  const npv7Stress = stress.npv7 ?? 0;
  const npv11Base = base.npv11 ?? 0;
  const npv11Stress = stress.npv11 ?? 0;

  const avBase = base.asset_value ?? 0;
  const avStress = stress.asset_value ?? 0;

  // Hurdle tests
  const yieldBasePass = devYBase >= m.capRate;
  const yieldStressPass = devYStress >= m.capRate;
  const irrBasePass = irrBase >= 0.08;
  const irrStressPass = irrStress >= 0.08;
  const npvBasePass = npv7Base > 0;
  const npvStressPass = npv7Stress > 0;

  // Active-scenario gate verdicts (kept beneath primary KPIs for the operator view)
  const gate1: "PASS" | "FAIL" = (active.asset_value ?? 0) > m.totalDevCost ? "PASS" : "FAIL";
  const gate2: "PASS" | "FAIL" | "MARGINAL" =
    (active.irr12yr ?? 0) >= 0.08 && (active.npv7 ?? 0) > 0
      ? "PASS"
      : (active.npv7 ?? 0) > 0
      ? "MARGINAL"
      : "FAIL";
  const gate3: "PASS" | "FAIL" | "MARGINAL" =
    (active.yield_spread ?? 0) >= 0.01 ? "PASS" : (active.yield_spread ?? 0) >= 0 ? "MARGINAL" : "FAIL";

  return (
    <div className="flex flex-col gap-6">
      {/* Hero banner ------------------------------------------------------- */}
      <figure className="relative overflow-hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))]">
        <div className="aspect-[21/9] w-full">
          <img
            src={`${import.meta.env.BASE_URL}img/hero.jpg`}
            alt="Proposed luxury overwater resort, Vaitape, Bora Bora — golden hour aerial concept"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
        <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5 sm:p-7">
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/75 sm:text-[11px]">
            Vaitape, Bora Bora &middot; Concept Render
          </span>
          <h1 className="font-display text-[22px] font-medium leading-tight tracking-tight text-white sm:text-[28px] lg:text-[32px]">
            Luxury Overwater Resort &mdash; Investment Verdict
          </h1>
        </figcaption>
      </figure>

      {/* Headline ---------------------------------------------------------- */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[20px] font-semibold tracking-tight sm:text-[22px]">Headline Verdict</h2>
        <ModDot show={isModified} />
      </div>

      {/* Primary KPI tiles — Base + Stress stacked ------------------------ */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <PrimaryKpiTile
          number="01"
          title="Development Yield"
          hurdle={`Hurdle: ≥ ${fmtPercent(m.capRate, 2)} Cap Rate`}
          baseValue={fmtPercent(devYBase, 2)}
          baseSub={`Base ${fmtBps(spreadBase)}`}
          basePass={yieldBasePass}
          stressValue={fmtPercent(devYStress, 2)}
          stressSub={`Stress Case ${fmtBps(spreadStress)}`}
          stressPass={yieldStressPass}
          isModified={isModified}
        />
        <PrimaryKpiTile
          number="02"
          title="Unleveraged Internal Rate Of Return (IRR)"
          hurdle="Hurdle: 8–12% Patient-Capital Band"
          baseValue={fmtPercent(irrBase, 1)}
          baseSub="Base"
          basePass={irrBasePass}
          stressValue={fmtPercent(irrStress, 1)}
          stressSub="Stress Case"
          stressPass={irrStressPass}
          isModified={isModified}
        />
        <PrimaryKpiTile
          number="03"
          title="Net Present Value (NPV)"
          hurdle="Hurdle: Positive At Patient-Capital Rate"
          baseValue={fmtCurrency(npv7Base, { compact: true, signed: true })}
          baseSub="Base @ 7% Hurdle"
          basePass={npvBasePass}
          stressValue={fmtCurrency(npv7Stress, { compact: true, signed: true })}
          stressSub="Stress Case @ 7% Hurdle"
          stressPass={npvStressPass}
          isModified={isModified}
        />
      </div>

      {/* Supporting bands ------------------------------------------------- */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Capital-Archetype Calibration (NPV @ 11% PE hurdle) */}
        <div className="card-base p-5">
          <div className="label-caps mb-3 text-[hsl(var(--muted-foreground))]">
            Capital-Archetype Calibration (Net Present Value @ 11% Private-Equity Hurdle)
          </div>
          <div className="grid grid-cols-2 gap-3 text-[13px]">
            <div>
              <div className="text-[hsl(var(--muted-foreground))]">Base</div>
              <div className="num text-[15px] font-semibold">
                {fmtCurrency(npv11Base, { compact: true, signed: true })}{" "}
                <span
                  className={cn(
                    "ml-1 text-[12px] font-semibold",
                    npv11Base > 0 ? "text-[hsl(var(--success))]" : "text-[hsl(var(--danger))]"
                  )}
                >
                  {npv11Base > 0 ? "PASS" : "FAIL"}
                </span>
              </div>
            </div>
            <div>
              <div className="text-[hsl(var(--muted-foreground))]">Stress Case</div>
              <div className="num text-[15px] font-semibold">
                {fmtCurrency(npv11Stress, { compact: true, signed: true })}{" "}
                <span
                  className={cn(
                    "ml-1 text-[12px] font-semibold",
                    npv11Stress > 0 ? "text-[hsl(var(--success))]" : "text-[hsl(var(--warning))]"
                  )}
                >
                  {npv11Stress > 0 ? "PASS" : "FAIL"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Value Surplus — KPI 1 reference */}
        <div className="card-base p-5">
          <div className="label-caps mb-3 text-[hsl(var(--muted-foreground))]">
            Asset Value Surplus (Key Performance Indicator 1 Reference)
          </div>
          <dl className="space-y-1.5 text-[13px]">
            <div className="flex items-baseline justify-between">
              <dt className="text-[hsl(var(--muted-foreground))]">Implied Asset Value</dt>
              <dd className="num font-semibold">
                {fmtCurrency(avBase, { compact: true })} Base /{" "}
                {fmtCurrency(avStress, { compact: true })} Stress
              </dd>
            </div>
            <div className="flex items-baseline justify-between">
              <dt className="text-[hsl(var(--muted-foreground))]">vs Total Development Cost</dt>
              <dd className="num font-semibold">{fmtCurrency(m.totalDevCost, { compact: true })}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-[hsl(var(--border))] pt-2">
              <dt className="text-[hsl(var(--muted-foreground))]">Value-Creation Surplus</dt>
              <dd className="num font-semibold text-[hsl(var(--accent))]">
                {fmtCurrency(avBase - m.totalDevCost, { compact: true })} Base /{" "}
                {fmtCurrency(avStress - m.totalDevCost, { compact: true })} Stress
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Active-scenario viewer gates ------------------------------------ */}
      <div>
        <div className="label-caps mb-3 text-[hsl(var(--muted-foreground))]">
          Active Scenario View — {active.label}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <GateTile
            gateNumber={1}
            title="Asset Value > Build Cost"
            rule={`Asset Value ≥ ${fmtCurrency(m.totalDevCost, { compact: true })} Development Cost (Income-Capitalisation)`}
            verdict={gate1}
            detail={`Asset Value ${fmtCurrency(active.asset_value ?? 0, { compact: true })} vs Cost ${fmtCurrency(m.totalDevCost, { compact: true })}`}
          />
          <GateTile
            gateNumber={2}
            title="Patient-Capital IRR & NPV"
            rule="IRR 8–12% With NPV @ 7% > 0"
            verdict={gate2}
            detail={`IRR ${fmtPercent(active.irr12yr ?? 0, 2)} · NPV @ 7% ${fmtCurrency(active.npv7 ?? 0, { compact: true })}`}
          />
          <GateTile
            gateNumber={3}
            title="Yield-On-Cost Spread ≥ 100 basis points (bps)"
            rule={`(Development Yield − ${fmtPercent(m.capRate, 2)}) ≥ 100 basis points`}
            verdict={gate3}
            detail={`${fmtBps(active.yield_spread ?? 0)} Above Cap Rate`}
          />
        </div>
      </div>

      {/* Patient-capital snapshot table */}
      <PatientCapitalSnapshot active={active} m={m} />

      {/* Defisc — figures only, links to Appendix */}
      <button
        onClick={onJumpToAppendix}
        className={cn(
          "card-base group flex w-full items-center gap-4 rounded-lg border-l-4 border-l-[hsl(var(--accent))] p-5 text-left",
          "transition-colors hover:bg-[hsl(var(--accent-soft))] focus-ring"
        )}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--accent-soft))] text-[hsl(var(--accent))]">
          <Sparkles size={18} />
        </div>
        <div className="flex-1">
          <div className="label-caps text-[hsl(var(--accent))]">
            Defisc Tax Credit — Held In Reserve
          </div>
          <div className="mt-1 grid grid-cols-3 gap-3 text-[13px] sm:text-[14px]">
            <div>
              <div className="text-[hsl(var(--muted-foreground))]">Effective Credit</div>
              <div className="num font-semibold">
                {fmtCurrency(anchors.defisc_effective, { compact: true })}
              </div>
            </div>
            <div>
              <div className="text-[hsl(var(--muted-foreground))]">Base Development Yield</div>
              <div className="num font-semibold">{fmtPercent(devYBase, 2)}</div>
            </div>
            <div>
              <div className="text-[hsl(var(--muted-foreground))]">With Defisc</div>
              <div className="num font-semibold">
                {fmtPercent(
                  (base.noi ?? 0) / Math.max(m.totalDevCost - anchors.defisc_effective, 1),
                  2
                )}
              </div>
            </div>
          </div>
        </div>
        <ArrowRight
          size={18}
          className="shrink-0 text-[hsl(var(--accent))] transition-transform group-hover:translate-x-1"
        />
      </button>
    </div>
  );
}

/* ============================================================================
   Primary KPI Tile — Base + Stress stacked layout (mirrors slide 3)
   ============================================================================ */
interface PrimaryKpiTileProps {
  number: string;
  title: string;
  hurdle: string;
  baseValue: string;
  baseSub: string;
  basePass: boolean;
  stressValue: string;
  stressSub: string;
  stressPass: boolean;
  isModified: boolean;
}

function PrimaryKpiTile({
  number,
  title,
  hurdle,
  baseValue,
  baseSub,
  basePass,
  stressValue,
  stressSub,
  stressPass,
  isModified,
}: PrimaryKpiTileProps) {
  const bothPass = basePass && stressPass;
  return (
    <div className="card-base flex flex-col overflow-hidden p-0">
      <div className="border-b border-[hsl(var(--border))] p-4 pb-3">
        <div className="label-caps text-[hsl(var(--muted-foreground))]">Primary KPI {number}</div>
        <div className="mt-0.5 text-[15px] font-semibold leading-tight">{title}</div>
        <div className="mt-1 text-[12px] italic text-[hsl(var(--muted-foreground))]">{hurdle}</div>
      </div>

      <div className="flex-1 space-y-3 p-4">
        <div>
          <div className="num text-[26px] font-bold leading-none tracking-tight sm:text-[28px]">
            {baseValue}
            <ModDot show={isModified} />
          </div>
          <div className="mt-1 text-[12px] text-[hsl(var(--muted-foreground))]">{baseSub}</div>
        </div>
        <div className="border-t border-[hsl(var(--border))] pt-3">
          <div className="num text-[24px] font-bold leading-none tracking-tight sm:text-[26px]">
            {stressValue}
            <ModDot show={isModified} />
          </div>
          <div className="mt-1 text-[12px] text-[hsl(var(--muted-foreground))]">{stressSub}</div>
        </div>
      </div>

      <div
        className={cn(
          "flex items-center justify-center gap-2 px-4 py-2.5 text-[12px] font-semibold tracking-wide",
          bothPass
            ? "bg-[hsl(var(--accent))]"
            : basePass || stressPass
            ? "bg-[hsl(var(--warning))]"
            : "bg-[hsl(var(--danger))]"
        )}
        style={{ color: "hsl(0 0% 100%)" }}
      >
        <span>{basePass ? "PASS" : "FAIL"}</span>
        <span className="opacity-70">/</span>
        <span>{stressPass ? "PASS" : "FAIL"}</span>
      </div>
    </div>
  );
}

/* ============================================================================
   Patient-Capital Snapshot
   ============================================================================ */
function PatientCapitalSnapshot({ active, m }: { active: ScenarioBundle; m: ModelInputs }) {
  const rows = [
    {
      label: "Total Revenue Per Available Room (TRevPAR) Uplift (Applied)",
      value: fmtPercent(active.trevpar_uplift ?? 0, 0),
      target: "35% Applied · KPMG 65% Excluded",
      pass: (active.trevpar_uplift ?? 0) >= 0.3,
    },
    {
      label: "Revenue Per Available Room (RevPAR)",
      value: fmtCurrency(active.revpar ?? 0),
      target: "≥ $1,200 (Ultra-Luxury Floor)",
      pass: (active.revpar ?? 0) >= 1200,
    },
    {
      label: "Total Revenue",
      value: fmtCurrency(active.total_revenue ?? 0, { compact: true }),
      target: "≥ $20M (Covers Operating Expenses + Return)",
      pass: (active.total_revenue ?? 0) >= 20_000_000,
    },
    {
      label: "Gross Operating Profit (GOP) Margin",
      value: fmtPercent(active.gop_margin ?? 0, 1),
      target: "25–30% (HVS Ultra-Luxury Norm)",
      pass: (active.gop_margin ?? 0) >= 0.25,
    },
    {
      label: "Stabilised Net Operating Income (NOI)",
      value: fmtCurrency(active.noi ?? 0, { compact: true }),
      target: "≥ $4.0M (Yield Floor)",
      pass: (active.noi ?? 0) >= 4_000_000,
      marginal: (active.noi ?? 0) >= 3_000_000 && (active.noi ?? 0) < 4_000_000,
    },
    {
      label: "Development Yield",
      value: fmtPercent(active.dev_yield ?? 0, 2),
      target: "≥ 8% Patient-Capital Floor",
      pass: (active.dev_yield ?? 0) >= 0.08,
    },
    {
      label: `${m.holdYears}-Year Internal Rate Of Return (IRR)`,
      value: fmtPercent(active.irr12yr ?? 0, 2),
      target: "8–12% Patient-Capital Band",
      pass: (active.irr12yr ?? 0) >= 0.08,
    },
    {
      label: "Net Present Value (NPV) @ 7% (Patient)",
      value: fmtCurrency(active.npv7 ?? 0, { compact: true }),
      target: "> 0",
      pass: (active.npv7 ?? 0) > 0,
    },
    {
      label: "Net Present Value (NPV) @ 9% (Mid)",
      value: fmtCurrency(active.npv9 ?? 0, { compact: true }),
      target: "> 0 Preferred",
      pass: (active.npv9 ?? 0) > 0,
      marginal: (active.npv9 ?? 0) <= 0,
    },
    {
      label: "Asset Value",
      value: fmtCurrency(active.asset_value ?? 0, { compact: true }),
      target: `> ${fmtCurrency(m.totalDevCost, { compact: true })} Build Cost`,
      pass: (active.asset_value ?? 0) > m.totalDevCost,
    },
    {
      label: "Defisc (Held In Reserve)",
      value: fmtCurrency(anchors.defisc_effective, { compact: true }),
      target: "Upside Lever — Not In Base",
      pass: true,
    },
    {
      label: "Pre-Opening Reserve",
      value: fmtCurrency(m.totalDevCost * anchors.preopen_pct, { compact: true }),
      target: "6.5% Of Development Cost",
      pass: true,
    },
  ];

  return (
    <div className="card-base p-5">
      <h3 className="mb-4 text-[16px] font-semibold tracking-tight">
        Patient-Capital Snapshot — {active.label}
      </h3>
      <div className="-mx-2 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-[13px] num">
          <thead>
            <tr>
              <th className="px-3 py-2 label-caps font-medium">Metric</th>
              <th className="px-3 py-2 label-caps font-medium text-right">Value</th>
              <th className="px-3 py-2 label-caps font-medium">Target / Floor</th>
              <th className="px-3 py-2 label-caps font-medium text-right">Verdict</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const verdict = r.pass ? "PASS" : r.marginal ? "MARGINAL" : "FAIL";
              const tone =
                verdict === "PASS"
                  ? "text-[hsl(var(--success))]"
                  : verdict === "MARGINAL"
                  ? "text-[hsl(var(--warning))]"
                  : "text-[hsl(var(--danger))]";
              const Icon = verdict === "PASS" ? Check : verdict === "MARGINAL" ? AlertTriangle : X;
              return (
                <tr key={r.label} className="border-t border-[hsl(var(--border))]">
                  <td className="px-3 py-2.5 font-medium">{r.label}</td>
                  <td className="px-3 py-2.5 text-right font-semibold">{r.value}</td>
                  <td className="px-3 py-2.5 text-[hsl(var(--muted-foreground))]">{r.target}</td>
                  <td className={cn("px-3 py-2.5 text-right font-semibold", tone)}>
                    <span className="inline-flex items-center justify-end gap-1.5">
                      <Icon size={13} strokeWidth={2.5} />
                      {verdict}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
