import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell, LabelList,
} from "recharts";
import { fmtCurrency, fmtNumber, fmtPercent } from "@/lib/utils";
import type { ScenarioBundle } from "@/hooks/useScenarios";
import type { ModelInputs } from "@/hooks/useModelInputs";
import { useChartColors } from "@/hooks/useChartColors";
import { SafeBarRect } from "@/components/SafeBarRect";
import { inputs as anchors } from "@/data/model";

interface Props {
  active: ScenarioBundle;
  scenarios: ScenarioBundle[];
  inputs: ModelInputs;
  isModified: boolean;
}

function ModDot({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span
      title="Recalculated From Your Inputs"
      aria-label="Recalculated From Your Inputs"
      className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[hsl(var(--warning))] align-middle"
    />
  );
}

export function TabBuildUp({ active, scenarios, inputs: m, isModified }: Props) {
  const c = useChartColors();
  const totalRev = active.total_revenue ?? 0;
  const opex = totalRev * m.opexRatio;
  const gop = active.gop ?? 0;
  const ebitda = active.ebitda ?? 0;
  const ffe = totalRev * m.ffeReserve;
  const noi = active.noi ?? 0;

  // Build-up step chart data (across the cascade)
  const cascade = [
    { name: "Total Revenue", value: totalRev, color: c["--accent"] },
    { name: "− Operating Expenses", value: -opex, color: c["--negative"] },
    { name: "Gross Operating Profit", value: gop, color: c["--accent"] },
    { name: "− Management Fees", value: -(gop - ebitda), color: c["--negative"] },
    { name: "Earnings Before Interest, Tax, Depreciation And Amortisation", value: ebitda, color: c["--accent"] },
    { name: "− FF&E Reserve", value: -ffe, color: c["--negative"] },
    { name: "Net Operating Income", value: noi, color: c["--accent"] },
  ];

  // Get the three fixed scenarios from live-computed list (Base, Upside, Stress)
  const baseS = scenarios.find((s) => s.key === "base")!;
  const upsideS = scenarios.find((s) => s.key === "upside")!;
  const stressS = scenarios.find((s) => s.key === "stress")!;
  const fixedTrio = [baseS, upsideS, stressS];

  // Waterfall data — Base case decomposition into 6 horizontal bars
  const baseTotalRev = baseS.total_revenue ?? 0;
  const baseGop = baseS.gop ?? 0;
  const baseEbitda = baseS.ebitda ?? 0;
  const baseNoi = baseS.noi ?? 0;
  const baseOpEx = baseTotalRev * m.opexRatio;
  const baseFeesAndFfe = baseGop - baseEbitda + baseTotalRev * m.ffeReserve;

  const waterfall = [
    { name: "Total Revenue", value: baseTotalRev, color: c["--accent"], flow: "in" as const },
    { name: "Operating Expenses (Leakage)", value: baseOpEx, color: c["--negative"], flow: "out" as const },
    { name: "Gross Operating Profit (GOP)", value: baseGop, color: c["--accent"], flow: "in" as const },
    { name: "Management Fees + FF&E Reserve (Leakage)", value: baseFeesAndFfe, color: c["--negative"], flow: "out" as const },
    { name: "Earnings Before Interest, Tax, Depreciation And Amortisation (EBITDA)", value: baseEbitda, color: c["--accent"], flow: "in" as const },
    { name: "Net Operating Income (NOI)", value: baseNoi, color: c["--accent"], flow: "in" as const },
  ];

  const costPerKey = m.totalDevCost / m.keys;

  return (
    <div className="flex flex-col gap-6">
      {/* Top context strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <ContextTile
          label="Programme"
          value={`${fmtNumber(m.keys)} Keys`}
          sub={`Cost Per Key ${fmtCurrency(costPerKey, { compact: true })} (Derived)`}
        />
        <ContextTile
          label="Average Daily Rate (ADR) · Occupancy"
          value={
            <>
              {`${fmtCurrency(active.adr ?? 0)} · ${fmtPercent(active.occ ?? 0, 0)}`}
              <ModDot show={isModified} />
            </>
          }
          sub={`Revenue Per Available Room (RevPAR) ${fmtCurrency(active.revpar ?? 0)}`}
        />
        <ContextTile
          label="Total Revenue Per Available Room (TRevPAR) Uplift"
          value={
            <>
              {fmtPercent(active.trevpar_uplift ?? 0, 0)}
              <ModDot show={isModified} />
            </>
          }
          sub="Independent Benchmarks"
        />
      </div>

      {/* Cascade column chart card */}
      <div className="card-base p-5">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-[16px] font-semibold tracking-tight">
            Revenue → Profit And Loss (P&amp;L) → Net Operating Income (NOI) Build-Up · {active.label}
          </h3>
          <span className="text-[12px] text-[hsl(var(--muted-foreground))] num">
            Total Revenue {fmtCurrency(totalRev, { compact: true })} → NOI{" "}
            {fmtCurrency(noi, { compact: true })}
          </span>
        </div>
        <div className="h-[340px] w-full">
          <ResponsiveContainer>
            <BarChart data={cascade} margin={{ top: 12, right: 24, left: 12, bottom: 8 }}>
              <CartesianGrid stroke={c["--border"]} strokeDasharray="2 4" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: c["--muted-foreground"], fontSize: 10 }}
                stroke={c["--border"]}
                interval={0}
                height={50}
                tickFormatter={(v: string) =>
                  v.length > 22 ? v.slice(0, 22) + "…" : v
                }
              />
              <YAxis
                tickFormatter={(v) => `${v < 0 ? "-" : ""}$${Math.abs(v / 1e6).toFixed(0)}M`}
                tick={{ fill: c["--muted-foreground"], fontSize: 11 }}
                stroke={c["--border"]}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  background: c["--surface-raised"],
                  border: `1px solid ${c["--border"]}`,
                  fontSize: 12,
                  borderRadius: 8,
                }}
                formatter={(v: number) => fmtCurrency(v, { compact: true })}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={false} shape={(p: any) => <SafeBarRect {...p} />}>
                {cascade.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Side-by-side P&L table — equal-width scenario columns */}
      <div className="card-base p-5">
        <h3 className="mb-3 text-[16px] font-semibold tracking-tight">
          Profit And Loss (P&amp;L) — Base · Upside · Combined Stress
        </h3>
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full table-fixed min-w-[640px] text-[13px] num">
            <colgroup>
              <col className="w-2/5" />
              <col className="w-1/5" />
              <col className="w-1/5" />
              <col className="w-1/5" />
            </colgroup>
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2 label-caps">Line Item</th>
                {fixedTrio.map((s) => (
                  <th key={s.key} className="px-3 py-2 label-caps text-right">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <Row
                label="Average Daily Rate (ADR)"
                values={fixedTrio.map((s) => fmtCurrency(s.adr ?? 0))}
              />
              <Row
                label="Occupancy"
                values={fixedTrio.map((s) => fmtPercent(s.occ ?? 0, 0))}
              />
              <Row
                label="Revenue Per Available Room (RevPAR)"
                values={fixedTrio.map((s) => fmtCurrency(s.revpar ?? 0))}
              />
              <Row
                label="Total Revenue"
                values={fixedTrio.map((s) =>
                  fmtCurrency(s.total_revenue ?? 0, { compact: true })
                )}
                bold
              />
              <Row
                label={`Operating Expenses (${fmtPercent(m.opexRatio, 0)})`}
                values={fixedTrio.map((s) =>
                  fmtCurrency(-(s.total_revenue ?? 0) * m.opexRatio, { compact: true })
                )}
                muted
              />
              <Row
                label="Gross Operating Profit (GOP)"
                values={fixedTrio.map((s) => fmtCurrency(s.gop ?? 0, { compact: true }))}
                bold
              />
              <Row
                label="GOP Margin"
                values={fixedTrio.map((s) => fmtPercent(s.gop_margin ?? 0, 1))}
                muted
              />
              <Row
                label="Earnings Before Interest, Tax, Depreciation And Amortisation (EBITDA)"
                values={fixedTrio.map((s) => fmtCurrency(s.ebitda ?? 0, { compact: true }))}
                bold
              />
              <Row
                label="Net Operating Income (NOI)"
                values={fixedTrio.map((s) => fmtCurrency(s.noi ?? 0))}
                emphasised
              />
              <Row
                label={`Asset Value (NOI ÷ ${fmtPercent(m.capRate, 2)})`}
                values={fixedTrio.map((s) =>
                  fmtCurrency(s.asset_value ?? 0, { compact: true })
                )}
              />
              <Row
                label="Development Yield"
                values={fixedTrio.map((s) => fmtPercent(s.dev_yield ?? 0, 2))}
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* NOI Waterfall — Base Case */}
      <div className="card-base p-5">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-[16px] font-semibold tracking-tight">
            Net Operating Income (NOI) Waterfall — Base Case
          </h3>
          <span className="text-[12px] text-[hsl(var(--muted-foreground))] num">
            Where The Money Goes — Revenue To NOI
          </span>
        </div>
        <div className="h-[360px] w-full">
          <ResponsiveContainer>
            <BarChart
              data={waterfall}
              layout="vertical"
              margin={{ top: 8, right: 80, left: 8, bottom: 8 }}
              barCategoryGap={8}
            >
              <CartesianGrid stroke={c["--border"]} strokeDasharray="2 4" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(v) => `$${(v / 1e6).toFixed(0)}M`}
                tick={{ fill: c["--muted-foreground"], fontSize: 11 }}
                stroke={c["--border"]}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={240}
                tick={{ fill: c["--foreground"], fontSize: 11 }}
                stroke={c["--border"]}
                tickFormatter={(v: string) => (v.length > 38 ? v.slice(0, 38) + "…" : v)}
              />
              <Tooltip
                contentStyle={{
                  background: c["--surface-raised"],
                  border: `1px solid ${c["--border"]}`,
                  fontSize: 12,
                  borderRadius: 8,
                }}
                formatter={(v: number) => fmtCurrency(v, { compact: true })}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} isAnimationActive={false} shape={(p: any) => <SafeBarRect {...p} />}>
                {waterfall.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
                <LabelList
                  dataKey="value"
                  position="right"
                  formatter={(v: number) => fmtCurrency(v, { compact: true })}
                  style={{ fill: c["--foreground"], fontSize: 11, fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11.5px] text-[hsl(var(--muted-foreground))]">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[hsl(var(--accent))]" />
            Revenue / Profit Stages
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[hsl(var(--negative))]" />
            Leakage Categories
          </span>
          <span className="num">
            Pre-Opening Reserve {fmtCurrency(m.totalDevCost * anchors.preopen_pct, { compact: true })} held separately.
          </span>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  values,
  bold,
  muted,
  emphasised,
}: {
  label: string;
  values: string[];
  bold?: boolean;
  muted?: boolean;
  emphasised?: boolean;
}) {
  return (
    <tr className="border-t border-[hsl(var(--border))]">
      <td
        className={`px-3 py-2 ${
          emphasised
            ? "font-semibold text-[hsl(var(--accent))]"
            : bold
            ? "font-semibold"
            : muted
            ? "text-[hsl(var(--muted-foreground))]"
            : ""
        }`}
      >
        {label}
      </td>
      {values.map((v, i) => (
        <td
          key={i}
          className={`px-3 py-2 text-right ${
            emphasised
              ? "font-semibold text-[hsl(var(--accent))]"
              : bold
              ? "font-semibold"
              : muted
              ? "text-[hsl(var(--muted-foreground))]"
              : ""
          }`}
        >
          {v}
        </td>
      ))}
    </tr>
  );
}

function ContextTile({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub: string;
}) {
  return (
    <div className="card-base p-4">
      <div className="label-caps">{label}</div>
      <div className="num mt-1 text-[18px] font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-[12px] text-[hsl(var(--muted-foreground))]">{sub}</div>
    </div>
  );
}
