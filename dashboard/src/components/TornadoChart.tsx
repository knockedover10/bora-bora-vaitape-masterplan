import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Cell, Tooltip, LabelList,
} from "recharts";
import { fmtCurrency } from "@/lib/utils";
import { useChartColors } from "@/hooks/useChartColors";
import { SafeBarRect } from "@/components/SafeBarRect";
import type { ScenarioBundle } from "@/hooks/useScenarios";

/**
 * Top-7 NPV @ 7% drivers — tornado chart, recentred on the ACTIVE scenario.
 *
 * Magnitudes were derived analytically from the v7 Excel scenario sweep —
 * they describe how much NPV moves when each driver swings across its
 * stress-to-upside range. We treat the magnitudes as scenario-invariant
 * (sweep ranges are normalised) but recentre the visual zero-line on the
 * currently-active scenario's NPV @ 7%, so the chart re-anchors when the
 * user switches Base / Upside / Stress.
 */

interface Driver {
  label: string;
  low: number;        // NPV impact USD at low end (relative)
  high: number;       // NPV impact USD at high end (relative)
  range: string;
}

const drivers: Driver[] = [
  { label: "Average Daily Rate (±15%)",       low: -10_400_000, high: 10_400_000, range: "$1,828 ↔ $2,472" },
  { label: "Occupancy",                       low: -9_900_000,  high: 6_400_000,  range: "50% ↔ 75%" },
  { label: "Operating Cost Ratio",            low: -7_300_000,  high: 8_100_000,  range: "78% ↔ 67%" },
  { label: "Capitalisation Rate (Exit)",      low: -8_900_000,  high: 6_100_000,  range: "7.5% ↔ 5.5%" },
  { label: "TRevPAR Uplift",                  low: -4_100_000,  high: 5_200_000,  range: "25% ↔ 50%" },
  { label: "Construction Cost / Key",         low: -8_400_000,  high: 8_400_000,  range: "$1.4M ↔ $1.0M" },
  { label: "NOI Growth p.a.",                 low: -3_700_000,  high: 4_100_000,  range: "2% ↔ 4%" },
];

interface Props {
  /** The active scenario whose NPV @ 7% becomes the zero line. */
  active: ScenarioBundle;
}

export function TornadoChart({ active }: Props) {
  const c = useChartColors();
  const center = active.npv7 ?? 0;

  const data = useMemo(
    () =>
      [...drivers]
        .map((d) => ({ ...d, magnitude: Math.abs(d.high) + Math.abs(d.low) }))
        .sort((a, b) => b.magnitude - a.magnitude),
    []
  );

  const maxAbs = Math.max(
    ...data.map((d) => Math.max(Math.abs(d.low), Math.abs(d.high)))
  );

  return (
    <div className="h-[360px] sm:h-[420px] w-full">
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          stackOffset="sign"
          margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
          barCategoryGap={10}
        >
          <XAxis
            type="number"
            domain={[-maxAbs * 1.05, maxAbs * 1.05]}
            tickFormatter={(v) => {
              const absMM = (Math.abs(center + v) / 1e6).toFixed(0);
              return `${center + v < 0 ? "-" : ""}$${absMM}M`;
            }}
            tick={{ fill: c["--muted-foreground"], fontSize: 11 }}
            stroke={c["--border"]}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={170}
            tick={{ fill: c["--foreground"], fontSize: 12 }}
            stroke={c["--border"]}
          />
          <ReferenceLine
            x={0}
            stroke={c["--accent"]}
            strokeWidth={2}
            label={{
              value: `${active.label} NPV @ 7% = ${fmtCurrency(center, { compact: true })}`,
              position: "top",
              fill: c["--accent"],
              fontSize: 11,
              fontWeight: 600,
            }}
          />
          <Tooltip
            contentStyle={{
              background: c["--surface-raised"],
              border: `1px solid ${c["--border"]}`,
              fontSize: 12,
              borderRadius: 8,
            }}
            formatter={(v: number, _key, item: any) => {
              const sign = v >= 0 ? "+" : "−";
              const movedTo = center + v;
              return [
                `${sign}${fmtCurrency(Math.abs(v), { compact: true })} → ${fmtCurrency(movedTo, { compact: true })}`,
                item?.payload?.range ?? "",
              ];
            }}
            labelStyle={{ color: c["--foreground"], fontWeight: 600 }}
          />
          <Bar dataKey="low" stackId="x" name="Downside" isAnimationActive={false} shape={(props: any) => <SafeBarRect {...props} />}>
            {data.map((_, i) => (
              <Cell key={`l-${i}`} fill={c["--negative"]} />
            ))}
            <LabelList
              dataKey="low"
              position="left"
              formatter={(v: number) => `${(v / 1e6).toFixed(1)}M`}
              style={{ fill: c["--negative"], fontSize: 10.5, fontWeight: 600 }}
            />
          </Bar>
          <Bar dataKey="high" stackId="x" name="Upside" isAnimationActive={false} shape={(props: any) => <SafeBarRect {...props} />}>
            {data.map((_, i) => (
              <Cell key={`h-${i}`} fill={c["--positive"]} />
            ))}
            <LabelList
              dataKey="high"
              position="right"
              formatter={(v: number) => `+${(v / 1e6).toFixed(1)}M`}
              style={{ fill: c["--positive"], fontSize: 10.5, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TornadoLegend() {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-4 text-[12px] text-[hsl(var(--muted-foreground))]">
      <span className="inline-flex items-center gap-2">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[hsl(var(--positive))]" />
        Upside Net Present Value (NPV) Movement vs Active Scenario
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[hsl(var(--negative))]" />
        Downside Net Present Value (NPV) Movement vs Active Scenario
      </span>
      <span>Magnitudes derived from v7 scenario sweep ranges; centre line = active scenario NPV @ 7%.</span>
    </div>
  );
}
