import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Cell, Tooltip,
} from "recharts";
import { fmtCurrency } from "@/lib/utils";

/**
 * Top-7 NPV @ 7% drivers — tornado chart.
 * Magnitudes derived analytically from the v7 Excel scenario sweep:
 *   - NOI sensitivity ≈ 6× perpetuity-like factor at 7% (rough; matches sweep magnitudes)
 *   - Cap rate inverse to NOI / cap
 *   - Cost swings ≈ 1:1
 * Centred at Base NPV @ 7% = $27.51M.
 */

interface Driver {
  label: string;
  low: number;        // NPV impact USD at low end (relative)
  high: number;       // NPV impact USD at high end (relative)
  range: string;
}

const drivers: Driver[] = [
  { label: "ADR (±15%)",                    low: -10_400_000, high: 10_400_000, range: "$1,828 ↔ $2,472" },
  { label: "Occupancy",                     low: -9_900_000,  high: 6_400_000,  range: "50% ↔ 75%" },
  { label: "Operating Cost Ratio",          low: -7_300_000,  high: 8_100_000,  range: "78% ↔ 67%" },
  { label: "Cap Rate (exit)",               low: -8_900_000,  high: 6_100_000,  range: "7.5% ↔ 5.5%" },
  { label: "TRevPAR uplift",                low: -4_100_000,  high: 5_200_000,  range: "25% ↔ 50%" },
  { label: "Construction cost / key",       low: -8_400_000,  high: 8_400_000,  range: "$1.4M ↔ $1.0M" },
  { label: "NOI growth p.a.",               low: -3_700_000,  high: 4_100_000,  range: "2% ↔ 4%" },
];

export function TornadoChart() {
  const data = useMemo(
    () =>
      [...drivers]
        .map((d) => ({ ...d, magnitude: Math.abs(d.high) + Math.abs(d.low) }))
        .sort((a, b) => b.magnitude - a.magnitude)
        .map((d) => ({
          ...d,
          // Use a single bar with low and high segments via two bars
        })),
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
            tickFormatter={(v) => `${v < 0 ? "-" : "+"}$${Math.abs(v / 1e6).toFixed(0)}M`}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            stroke="hsl(var(--border))"
          />
          <YAxis
            type="category"
            dataKey="label"
            width={170}
            tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
            stroke="hsl(var(--border))"
          />
          <ReferenceLine x={0} stroke="hsl(var(--border))" />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--surface-raised))",
              border: "1px solid hsl(var(--border))",
              fontSize: 12,
              borderRadius: 8,
            }}
            formatter={(v: number) => fmtCurrency(v, { compact: true })}
            labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
          />
          <Bar dataKey="low" stackId="x" name="Downside">
            {data.map((_, i) => (
              <Cell key={`l-${i}`} fill="hsl(var(--danger))" />
            ))}
          </Bar>
          <Bar dataKey="high" stackId="x" name="Upside">
            {data.map((_, i) => (
              <Cell key={`h-${i}`} fill="hsl(var(--success))" />
            ))}
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
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[hsl(var(--success))]" />
        Upside vs Base NPV @ 7%
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[hsl(var(--danger))]" />
        Downside vs Base NPV @ 7%
      </span>
      <span>Magnitudes derived from v7 scenario sweep ranges.</span>
    </div>
  );
}
