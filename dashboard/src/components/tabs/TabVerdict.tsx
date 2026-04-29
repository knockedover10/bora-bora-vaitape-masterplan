import { ArrowRight, Sparkles, Check, X, AlertTriangle } from "lucide-react";
import { KpiTile } from "@/components/KpiTile";
import { GateTile } from "@/components/GateTile";
import { fmtCurrency, fmtPercent, fmtBps, cn } from "@/lib/utils";
import { inputs as anchors } from "@/data/model";
import type { ScenarioBundle } from "@/hooks/useScenarios";
import type { ModelInputs } from "@/hooks/useModelInputs";

interface Props {
  active: ScenarioBundle;
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

export function TabVerdict({ active, inputs: m, isModified, onJumpToAppendix }: Props) {
  const noi = active.noi ?? 0;
  const irr = active.irr12yr ?? 0;
  const spread = active.yield_spread ?? 0;
  const av = active.asset_value ?? 0;

  // Gate verdicts
  const gate1: "PASS" | "FAIL" = av > m.totalDevCost ? "PASS" : "FAIL";
  const gate2: "PASS" | "FAIL" | "MARGINAL" =
    irr >= 0.08 && (active.npv7 ?? 0) > 0
      ? "PASS"
      : (active.npv7 ?? 0) > 0
      ? "MARGINAL"
      : "FAIL";
  const gate3: "PASS" | "FAIL" | "MARGINAL" =
    spread >= 0.01 ? "PASS" : spread >= 0 ? "MARGINAL" : "FAIL";

  return (
    <div className="flex flex-col gap-6">
      {/* Hero KPI tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiTile
          label="Stabilised Net Operating Income (NOI)"
          tone="accent"
          value={
            <>
              {fmtCurrency(noi)}
              <ModDot show={isModified} />
            </>
          }
          sub={`${active.label} · Stabilised Year-7 Onwards`}
        />
        <KpiTile
          label={`${m.holdYears}-Year Unleveraged Internal Rate Of Return (IRR)`}
          tone={irr >= 0.12 ? "accent" : irr >= 0.08 ? "success" : "warning"}
          value={
            <>
              {fmtPercent(irr, 2)}
              <ModDot show={isModified} />
            </>
          }
          sub={`Patient-Capital Band 8–12% · Net Present Value (NPV) @ 7% ${fmtCurrency(active.npv7 ?? 0, { compact: true })}`}
        />
        <KpiTile
          label="Yield-On-Cost Spread"
          tone={spread >= 0.01 ? "success" : spread >= 0 ? "warning" : "danger"}
          value={
            <>
              {fmtBps(spread)}
              <ModDot show={isModified} />
            </>
          }
          sub={`Development Yield ${fmtPercent(active.dev_yield ?? 0, 2)} vs ${fmtPercent(m.capRate, 2)} Cap Rate`}
        />
      </div>

      {/* Gate tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <GateTile
          gateNumber={1}
          title="Asset Value > Build Cost"
          rule={`Asset Value ≥ ${fmtCurrency(m.totalDevCost, { compact: true })} Development Cost (Income-Capitalisation)`}
          verdict={gate1}
          detail={`Asset Value ${fmtCurrency(av, { compact: true })} vs Cost ${fmtCurrency(m.totalDevCost, { compact: true })}`}
        />
        <GateTile
          gateNumber={2}
          title="Patient-Capital IRR & NPV"
          rule="IRR 8–12% With NPV @ 7% > 0"
          verdict={gate2}
          detail={`IRR ${fmtPercent(irr, 2)} · NPV @ 7% ${fmtCurrency(active.npv7 ?? 0, { compact: true })}`}
        />
        <GateTile
          gateNumber={3}
          title="Yield-On-Cost Spread ≥ 100 basis points (bps)"
          rule={`(Development Yield − ${fmtPercent(m.capRate, 2)}) ≥ 100 basis points`}
          verdict={gate3}
          detail={`${fmtBps(spread)} Above Cap Rate`}
        />
      </div>

      {/* Verdict statement */}
      <div className="card-base border-l-4 border-l-[hsl(var(--accent))] p-6">
        <div className="label-caps mb-2 text-[hsl(var(--accent))]">Verdict</div>
        <p className="text-[15px] leading-relaxed sm:text-[16px]">
          Asset clears all three viability gates in <strong>Base Case</strong> and remains
          positive-NPV at 7% in <strong>Combined Stress</strong>. Defisc treated as upside, not base.
          Patient-capital frame holds: 12-Year IRR 13.21% Base · 7.96% Stress sit in or near the
          8–12% endowment / sovereign / family-office band.
        </p>
      </div>

      {/* Patient-capital snapshot */}
      <PatientCapitalSnapshot active={active} m={m} />

      {/* Defisc upside flag — links to Appendix */}
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
          <div className="label-caps text-[hsl(var(--accent))]">Upside Lever Held In Reserve</div>
          <div className="mt-1 text-[14px] sm:text-[15px]">
            Defisc Tax Credit <strong className="num">$4.18M</strong> Lifts Base Development Yield
            <span className="num"> 11.34% → 12.62%</span>. Not In Base Case — See Appendix.
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
