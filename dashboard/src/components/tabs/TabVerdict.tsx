import { ArrowRight, Sparkles, Check, X, AlertTriangle, Info } from "lucide-react";
import { KpiVerdictTile } from "@/components/KpiVerdictTile";
import { ScenarioBadge } from "@/components/ScenarioBadge";
import { DeltaChip } from "@/components/DeltaChip";
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

  // Active-scenario verdicts — mirror the three Primary KPIs above so the
  // operator sees the same metrics here, plus the cushion vs threshold.
  const activeDevY = active.dev_yield ?? 0;
  const activeSpread = active.yield_spread ?? 0;
  const activeIrr = active.irr12yr ?? 0;
  const activeNpv7 = active.npv7 ?? 0;

  const kpi1Verdict: "PASS" | "FAIL" | "MARGINAL" =
    activeDevY >= m.capRate ? "PASS" : activeDevY >= m.capRate * 0.9 ? "MARGINAL" : "FAIL";
  const kpi2Verdict: "PASS" | "FAIL" | "MARGINAL" =
    activeIrr >= 0.08 && activeIrr <= 0.12 ? "PASS"
    : activeIrr >= 0.08 ? "PASS"   // higher than ceiling = still pass on the floor test
    : activeIrr >= 0.06 ? "MARGINAL"
    : "FAIL";
  const kpi3Verdict: "PASS" | "FAIL" | "MARGINAL" =
    activeNpv7 > 0 ? "PASS" : activeNpv7 > -5_000_000 ? "MARGINAL" : "FAIL";

  const irrFloorBps = (activeIrr - 0.08) * 10000;
  const npv11Active = active.npv11 ?? 0;
  const avActive = active.asset_value ?? 0;

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

      {/* Supporting bands — Active-scenario reframings of the three KPIs above ----- */}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[18px] font-semibold tracking-tight">
          KPI Cushion — {active.label} Scenario
        </h3>
        <ScenarioBadge
          activeKey={active.key}
          activeLabel={active.label}
          caption="Reflects current scenario"
        />
      </div>
      <p className="-mt-3 text-[13px] text-[hsl(var(--muted-foreground))]">
        Each tile below restates the matching Primary KPI for the {active.label} scenario, then quantifies how much it clears
        (or misses) the underwriting threshold. Use this to gauge headroom rather than just pass/fail.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiVerdictTile
          kpiNumber={1}
          title="Development Yield"
          rule={`Threshold: ≥ ${fmtPercent(m.capRate, 2)} Cap Rate`}
          verdict={kpi1Verdict}
          activeValue={fmtPercent(activeDevY, 2)}
          cushion={`${fmtBps(activeSpread)} above ${fmtPercent(m.capRate, 2)} cap-rate floor (asset value ${fmtCurrency(avActive, { compact: true })} vs ${fmtCurrency(m.totalDevCost, { compact: true })} build cost)`}
        />
        <KpiVerdictTile
          kpiNumber={2}
          title="Unleveraged IRR"
          rule="Threshold: ≥ 8% Patient-Capital Floor"
          verdict={kpi2Verdict}
          activeValue={fmtPercent(activeIrr, 2)}
          cushion={`${irrFloorBps >= 0 ? "+" : "−"}${Math.abs(irrFloorBps).toFixed(0)}bps vs 8% floor (12-year unleveraged DCF)`}
        />
        <KpiVerdictTile
          kpiNumber={3}
          title="NPV @ 7% (Patient)"
          rule="Threshold: > $0 At Patient-Capital Rate"
          verdict={kpi3Verdict}
          activeValue={fmtCurrency(activeNpv7, { compact: true, signed: true })}
          cushion={`${activeNpv7 > 0 ? "+" : "−"}${fmtCurrency(Math.abs(activeNpv7), { compact: true })} of value above the patient-capital break-even line`}
        />
      </div>

      {/* Capital-archetype calibration — explained inline (Image 2 fix) ----------- */}
      <div className="card-base p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <div className="label-caps text-[hsl(var(--muted-foreground))]">
              Capital-Archetype Calibration — Private-Equity Stress Test
            </div>
            <div className="mt-1 text-[15px] font-semibold tracking-tight">
              Would a private-equity (PE) buyer pay for this asset at their 11% hurdle?
            </div>
          </div>
          <ScenarioBadge
            activeKey={active.key}
            activeLabel={active.label}
            caption={`NPV @ 11% ${fmtCurrency(npv11Active, { compact: true, signed: true })}`}
          />
        </div>
        <p className="mt-2 text-[12.5px] text-[hsl(var(--muted-foreground))] leading-relaxed">
          <Info size={12} className="mr-1 inline-block align-[-1px] text-[hsl(var(--accent))]" />
          Why this matters: 7% NPV (the patient-capital floor) is the appropriate hurdle for the family-office /
          sovereign capital archetypes that fit a Bora Bora ultra-luxury asset. The 11% column tells the
          counterfactual: at a typical mid-market PE hurdle, only the {active.label} scenario passing/failing
          this test signals whether the deal can survive a hot-money exit.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3 text-[13px]">
          <ArchetypeCell
            label={`${active.label} (Active)`}
            value={fmtCurrency(npv11Active, { compact: true, signed: true })}
            verdict={npv11Active > 0 ? "PASS" : "FAIL"}
            tone="accent"
          />
          <ArchetypeCell
            label="Base Reference"
            value={fmtCurrency(npv11Base, { compact: true, signed: true })}
            verdict={npv11Base > 0 ? "PASS" : "FAIL"}
          />
          <ArchetypeCell
            label="Stress Reference"
            value={fmtCurrency(npv11Stress, { compact: true, signed: true })}
            verdict={npv11Stress > 0 ? "PASS" : "FAIL"}
          />
        </div>
      </div>

      {/* Asset value surplus — explained inline (Image 2 fix) -------------------- */}
      <div className="card-base p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <div className="label-caps text-[hsl(var(--muted-foreground))]">
              Asset-Value Surplus — Income-Capitalisation Sanity Check
            </div>
            <div className="mt-1 text-[15px] font-semibold tracking-tight">
              Is the development creating value the day it stabilises?
            </div>
          </div>
          <ScenarioBadge
            activeKey={active.key}
            activeLabel={active.label}
            caption={`Surplus ${fmtCurrency(avActive - m.totalDevCost, { compact: true })}`}
          />
        </div>
        <p className="mt-2 text-[12.5px] text-[hsl(var(--muted-foreground))] leading-relaxed">
          <Info size={12} className="mr-1 inline-block align-[-1px] text-[hsl(var(--accent))]" />
          Why this matters: this is the cross-check on KPI 1 (Development Yield). Capitalising stabilised NOI at
          the {fmtPercent(m.capRate, 2)} exit cap rate gives the implied open-market asset value. Subtracting build cost
          shows the immediate value-creation surplus (or deficit) on Day 1 of stabilisation — independent of the
          full 12-year DCF.
        </p>
        <dl className="mt-3 grid gap-3 text-[13px] sm:grid-cols-3">
          <div className="rounded-md border border-[hsl(var(--border))] p-3">
            <dt className="text-[hsl(var(--muted-foreground))]">Implied Asset Value ({active.label})</dt>
            <dd className="num mt-1 text-[18px] font-semibold">{fmtCurrency(avActive, { compact: true })}</dd>
            <dd className="mt-0.5 text-[11.5px] text-[hsl(var(--muted-foreground))]">
              NOI {fmtCurrency(active.noi ?? 0, { compact: true })} ÷ Cap Rate {fmtPercent(m.capRate, 2)}
            </dd>
          </div>
          <div className="rounded-md border border-[hsl(var(--border))] p-3">
            <dt className="text-[hsl(var(--muted-foreground))]">Total Development Cost</dt>
            <dd className="num mt-1 text-[18px] font-semibold">{fmtCurrency(m.totalDevCost, { compact: true })}</dd>
            <dd className="mt-0.5 text-[11.5px] text-[hsl(var(--muted-foreground))]">{m.keys} keys × {fmtCurrency(m.totalDevCost / m.keys, { compact: true })} per key</dd>
          </div>
          <div className={cn("rounded-md border p-3", avActive - m.totalDevCost >= 0 ? "border-[hsl(var(--success))/40%] bg-[hsl(var(--success))/8%]" : "border-[hsl(var(--danger))/40%] bg-[hsl(var(--danger))/8%]")}>
            <dt className={cn("font-semibold", avActive - m.totalDevCost >= 0 ? "text-[hsl(var(--success))]" : "text-[hsl(var(--danger))]")}>
              Value-Creation Surplus
            </dt>
            <dd className="num mt-1 text-[18px] font-semibold">
              {fmtCurrency(avActive - m.totalDevCost, { compact: true, signed: true })}
            </dd>
            <dd className="mt-0.5 inline-flex items-center gap-1 text-[11.5px]">
              <DeltaChip
                value={avActive - m.totalDevCost}
                base={avBase - m.totalDevCost}
                format="currency"
              />
              <span className="text-[hsl(var(--muted-foreground))]">vs Base surplus</span>
            </dd>
          </div>
        </dl>
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
   ArchetypeCell — Cell for the capital-archetype calibration band
   ============================================================================ */
function ArchetypeCell({
  label,
  value,
  verdict,
  tone,
}: {
  label: string;
  value: string;
  verdict: "PASS" | "FAIL";
  tone?: "accent";
}) {
  const passing = verdict === "PASS";
  return (
    <div
      className={cn(
        "rounded-md border p-3",
        tone === "accent"
          ? "border-[hsl(var(--accent))/40%] bg-[hsl(var(--accent-soft))]"
          : "border-[hsl(var(--border))]"
      )}
    >
      <div className={cn("text-[12px] uppercase tracking-wide font-medium", tone === "accent" ? "text-[hsl(var(--accent))]" : "text-[hsl(var(--muted-foreground))]")}>
        {label}
      </div>
      <div className="num mt-1 inline-flex items-baseline gap-2 text-[18px] font-semibold">
        <span>{value}</span>
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide",
            passing
              ? "bg-[hsl(var(--success))/15%] text-[hsl(var(--success))]"
              : "bg-[hsl(var(--danger))/15%] text-[hsl(var(--danger))]"
          )}
        >
          {verdict}
        </span>
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
