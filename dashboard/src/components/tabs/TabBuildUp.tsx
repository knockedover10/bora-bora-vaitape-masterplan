import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell,
} from "recharts";
import { fmtCurrency, fmtPercent } from "@/lib/utils";
import { fixedScenarios, inputs } from "@/data/model";
import type { ScenarioBundle } from "@/hooks/useScenarios";

interface Props {
  active: ScenarioBundle;
}

export function TabBuildUp({ active }: Props) {
  const totalRev = active.total_revenue ?? 0;
  const opex = totalRev * inputs.opex_ratio;
  const gop = active.gop ?? 0;
  const mgmtBase = totalRev * inputs.mgmt_base;
  const mgmtIncentive = gop * inputs.mgmt_incentive;
  const ebitda = active.ebitda ?? 0;
  const ffe = totalRev * inputs.ffe_reserve;
  const noi = active.noi ?? 0;

  // Waterfall data — additive bars
  const waterfall = [
    { name: "Total Revenue", value: totalRev, color: "hsl(var(--accent))" },
    { name: "− OpEx (72%)", value: -opex, color: "hsl(var(--warning))" },
    { name: "GOP", value: gop, color: "hsl(var(--success))" },
    { name: "− Mgmt Base", value: -mgmtBase, color: "hsl(var(--warning))" },
    { name: "− Mgmt Inc.", value: -mgmtIncentive, color: "hsl(var(--warning))" },
    { name: "EBITDA", value: ebitda, color: "hsl(var(--success))" },
    { name: "− FF&E", value: -ffe, color: "hsl(var(--warning))" },
    { name: "NOI", value: noi, color: "hsl(var(--accent))" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Top context strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <ContextTile label="Keys" value="35" sub="120 sqm avg per villa" />
        <ContextTile
          label="ADR · Occupancy"
          value={`${fmtCurrency(active.adr ?? 0)} · ${fmtPercent(active.occ ?? 0, 0)}`}
          sub={`RevPAR ${fmtCurrency(active.revpar ?? 0)}`}
        />
        <ContextTile
          label="TRevPAR uplift"
          value={fmtPercent(active.trevpar_uplift ?? 0, 0)}
          sub="Independent benchmarks (KPMG 65% excluded)"
        />
      </div>

      {/* Waterfall card */}
      <div className="card-base p-5">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-[16px] font-semibold tracking-tight">
            Revenue → P&amp;L → NOI build-up · {active.label}
          </h3>
          <span className="text-[12px] text-[hsl(var(--muted-foreground))] num">
            Total Rev {fmtCurrency(totalRev, { compact: true })} → NOI{" "}
            {fmtCurrency(noi, { compact: true })}
          </span>
        </div>
        <div className="h-[340px] w-full">
          <ResponsiveContainer>
            <BarChart data={waterfall} margin={{ top: 12, right: 24, left: 12, bottom: 8 }}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                stroke="hsl(var(--border))"
                interval={0}
              />
              <YAxis
                tickFormatter={(v) =>
                  `${v < 0 ? "-" : ""}$${Math.abs(v / 1e6).toFixed(0)}M`
                }
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                stroke="hsl(var(--border))"
                width={60}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--surface-raised))",
                  border: "1px solid hsl(var(--border))",
                  fontSize: 12,
                  borderRadius: 8,
                }}
                formatter={(v: number) => fmtCurrency(v, { compact: true })}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {waterfall.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Side-by-side P&L table */}
      <div className="card-base p-5">
        <h3 className="mb-3 text-[16px] font-semibold tracking-tight">
          P&amp;L — Base · Upside · Stress
        </h3>
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full min-w-[600px] text-[13px] num">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2 label-caps">Line item</th>
                {fixedScenarios.map((s) => (
                  <th key={s.key} className="px-3 py-2 label-caps text-right">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <Row
                label="ADR"
                values={fixedScenarios.map((s) => fmtCurrency(s.adr ?? 0))}
              />
              <Row
                label="Occupancy"
                values={fixedScenarios.map((s) => fmtPercent(s.occ ?? 0, 0))}
              />
              <Row
                label="RevPAR"
                values={fixedScenarios.map((s) => fmtCurrency(s.revpar ?? 0))}
              />
              <Row
                label="Total Revenue"
                values={fixedScenarios.map((s) => fmtCurrency(s.total_revenue ?? 0, { compact: true }))}
                bold
              />
              <Row
                label="OpEx (72%)"
                values={fixedScenarios.map((s) =>
                  fmtCurrency(-(s.total_revenue ?? 0) * 0.72, { compact: true })
                )}
                muted
              />
              <Row
                label="GOP"
                values={fixedScenarios.map((s) => fmtCurrency(s.gop ?? 0, { compact: true }))}
                bold
              />
              <Row
                label="GOP Margin"
                values={fixedScenarios.map((s) => fmtPercent(s.gop_margin ?? 0, 1))}
                muted
              />
              <Row
                label="EBITDA"
                values={fixedScenarios.map((s) => fmtCurrency(s.ebitda ?? 0, { compact: true }))}
                bold
              />
              <Row
                label="NOI"
                values={fixedScenarios.map((s) => fmtCurrency(s.noi ?? 0))}
                emphasised
              />
              <Row
                label="Asset Value (NOI ÷ 6.5%)"
                values={fixedScenarios.map((s) => fmtCurrency(s.asset_value ?? 0, { compact: true }))}
              />
              <Row
                label="Dev Yield"
                values={fixedScenarios.map((s) => fmtPercent(s.dev_yield ?? 0, 2))}
              />
            </tbody>
          </table>
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

function ContextTile({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="card-base p-4">
      <div className="label-caps">{label}</div>
      <div className="num mt-1 text-[18px] font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-[12px] text-[hsl(var(--muted-foreground))]">{sub}</div>
    </div>
  );
}
