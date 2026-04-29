import { ArrowRight, Sparkles, Check, X, AlertTriangle } from "lucide-react";
import { KpiTile } from "@/components/KpiTile";
import { GateTile } from "@/components/GateTile";
import { fmtCurrency, fmtPercent, fmtBps, cn } from "@/lib/utils";
import { inputs } from "@/data/model";
import type { ScenarioBundle } from "@/hooks/useScenarios";

interface Props {
  active: ScenarioBundle;
  onJumpToUpside: () => void;
}

export function TabVerdict({ active, onJumpToUpside }: Props) {
  const noi = active.noi ?? 0;
  const irr = active.irr12yr ?? 0;
  const spread = active.yield_spread ?? 0;
  const av = active.asset_value ?? 0;

  // Gate verdicts
  const gate1: "PASS" | "FAIL" = av > inputs.total_dev_cost ? "PASS" : "FAIL";
  // Above ceiling still passes (it's just "better than patient-capital band"); below floor fails.
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
          label="Stabilised NOI"
          tone="accent"
          value={fmtCurrency(noi)}
          sub={`${active.label} · stabilised year-7 onwards`}
        />
        <KpiTile
          label="12-yr Unleveraged IRR"
          tone={irr >= 0.12 ? "accent" : irr >= 0.08 ? "success" : "warning"}
          value={fmtPercent(irr, 2)}
          sub={`Patient-capital band 8–12% · NPV @ 7% ${fmtCurrency(active.npv7 ?? 0, { compact: true })}`}
        />
        <KpiTile
          label="Yield-on-Cost Spread"
          tone={spread >= 0.01 ? "success" : spread >= 0 ? "warning" : "danger"}
          value={fmtBps(spread)}
          sub={`Dev Yield ${fmtPercent(active.dev_yield ?? 0, 2)} vs 6.5% cap`}
        />
      </div>

      {/* Gate tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <GateTile
          gateNumber={1}
          title="Asset Value > Build Cost"
          rule="AV ≥ $42.0M dev cost (income-cap)"
          verdict={gate1}
          detail={`AV ${fmtCurrency(av, { compact: true })} vs Cost $42.00M`}
        />
        <GateTile
          gateNumber={2}
          title="Patient-capital IRR & NPV"
          rule="IRR 8–12% with NPV @ 7% > 0"
          verdict={gate2}
          detail={`IRR ${fmtPercent(irr, 2)} · NPV @ 7% ${fmtCurrency(active.npv7 ?? 0, { compact: true })}`}
        />
        <GateTile
          gateNumber={3}
          title="Yield-on-Cost spread ≥ 100 bps"
          rule="(Dev Yield − 6.5%) ≥ 100 bps"
          verdict={gate3}
          detail={`${fmtBps(spread)} above cap rate`}
        />
      </div>

      {/* Verdict statement */}
      <div className="card-base border-l-4 border-l-[hsl(var(--accent))] p-6">
        <div className="label-caps mb-2 text-[hsl(var(--accent))]">Verdict</div>
        <p className="text-[15px] leading-relaxed sm:text-[16px]">
          Asset clears all three viability gates in <strong>Base Case</strong> and remains
          positive-NPV at 7% in <strong>Stress</strong>. Defisc treated as upside, not base.
          Patient-capital frame holds: 12-yr IRR 13.21% Base · 7.96% Stress sit in or near the
          8–12% endowment / sovereign / family-office band.
        </p>
      </div>

      {/* Patient-capital snapshot */}
      <PatientCapitalSnapshot active={active} />

      {/* Defisc upside flag */}
      <button
        onClick={onJumpToUpside}
        className={cn(
          "card-base group flex w-full items-center gap-4 rounded-lg border-l-4 border-l-[hsl(var(--accent))] p-5 text-left",
          "transition-colors hover:bg-[hsl(var(--accent))/6%] focus-ring"
        )}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--accent))/12%] text-[hsl(var(--accent))]">
          <Sparkles size={18} />
        </div>
        <div className="flex-1">
          <div className="label-caps text-[hsl(var(--accent))]">Upside lever held in reserve</div>
          <div className="mt-1 text-[14px] sm:text-[15px]">
            Defisc tax credit <strong className="num">$4.18M</strong> lifts Base Dev Yield
            <span className="num"> 11.34% → 12.62%</span>. Not in base case — see Tab 5.
          </div>
        </div>
        <ArrowRight size={18} className="shrink-0 text-[hsl(var(--accent))] transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}

function PatientCapitalSnapshot({ active }: { active: ScenarioBundle }) {
  const rows = [
    {
      label: "TRevPAR uplift (applied)",
      value: fmtPercent(active.trevpar_uplift ?? 0, 0),
      target: "35% applied · KPMG 65% excluded",
      pass: active.trevpar_uplift === 0.35,
    },
    {
      label: "RevPAR",
      value: fmtCurrency(active.revpar ?? 0),
      target: "≥ $1,200 (ultra-luxury floor)",
      pass: (active.revpar ?? 0) >= 1200,
    },
    {
      label: "Total Revenue",
      value: fmtCurrency(active.total_revenue ?? 0, { compact: true }),
      target: "≥ $20M (covers OpEx + return)",
      pass: (active.total_revenue ?? 0) >= 20_000_000,
    },
    {
      label: "GOP Margin",
      value: fmtPercent(active.gop_margin ?? 0, 1),
      target: "25–30% (HVS ultra-luxury norm)",
      pass: (active.gop_margin ?? 0) >= 0.25,
    },
    {
      label: "Stabilised NOI",
      value: fmtCurrency(active.noi ?? 0, { compact: true }),
      target: "≥ $4.0M (yield floor)",
      pass: (active.noi ?? 0) >= 4_000_000,
      marginal: (active.noi ?? 0) >= 3_000_000 && (active.noi ?? 0) < 4_000_000,
    },
    {
      label: "Dev Yield",
      value: fmtPercent(active.dev_yield ?? 0, 2),
      target: "≥ 8% patient-capital floor",
      pass: (active.dev_yield ?? 0) >= 0.08,
    },
    {
      label: "12-yr IRR",
      value: fmtPercent(active.irr12yr ?? 0, 2),
      target: "8–12% patient-capital band",
      pass: (active.irr12yr ?? 0) >= 0.08,
    },
    {
      label: "NPV @ 7% (patient)",
      value: fmtCurrency(active.npv7 ?? 0, { compact: true }),
      target: "> 0",
      pass: (active.npv7 ?? 0) > 0,
    },
    {
      label: "NPV @ 9% (mid)",
      value: fmtCurrency(active.npv9 ?? 0, { compact: true }),
      target: "> 0 preferred",
      pass: (active.npv9 ?? 0) > 0,
      marginal: (active.npv9 ?? 0) <= 0,
    },
    {
      label: "Asset Value",
      value: fmtCurrency(active.asset_value ?? 0, { compact: true }),
      target: "> $42M build cost",
      pass: (active.asset_value ?? 0) > 42_000_000,
    },
    {
      label: "Defisc (held in reserve)",
      value: fmtCurrency(inputs.defisc_effective, { compact: true }),
      target: "Upside lever — not in base",
      pass: true,
    },
    {
      label: "Pre-opening reserve",
      value: fmtCurrency(inputs.preopen_cost, { compact: true }),
      target: "6.5% of dev cost",
      pass: true,
    },
  ];

  return (
    <div className="card-base p-5">
      <h3 className="mb-4 text-[16px] font-semibold tracking-tight">
        Patient-capital snapshot — {active.label}
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
