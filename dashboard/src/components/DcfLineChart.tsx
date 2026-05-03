import {
  ComposedChart, Line, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend, ReferenceLine,
} from "recharts";
import { fmtCurrency } from "@/lib/utils";
import type { ScenarioBundle } from "@/hooks/useScenarios";
import type { ModelInputs } from "@/hooks/useModelInputs";
import { useChartColors } from "@/hooks/useChartColors";

interface Props {
  /** Active scenario — drives the foreground line + terminal bar. */
  active: ScenarioBundle;
  /** Base scenario — drawn as a faint reference line so deltas are visible. */
  base: ScenarioBundle;
  inputs: ModelInputs;
}

/**
 * Live-recomputed DCF line chart using the cashflows on each scenario bundle.
 *
 * Foreground series = the ACTIVE scenario the user picked from the scenario bar.
 * Background series = Base, drawn faint, as a reference benchmark so the viewer
 * can see how Upside / Stress deviates from the Base path year-by-year.
 *
 * Splits terminal value at exit year so the operating-cashflow line isn't
 * crushed by the terminal spike.
 */
export function DcfLineChart({ active, base, inputs: m }: Props) {
  const c = useChartColors();
  const activeCf = active.cashflows ?? [];
  const baseCf = base.cashflows ?? [];
  const exit = m.holdYears;

  const reverseNoi = (cfExit: number) =>
    cfExit / (1 + (1 + m.noiGrowth) / m.capRate);

  const activeNoiExit = exit >= 3 ? reverseNoi(activeCf[exit] ?? 0) : 0;
  const baseNoiExit = exit >= 3 ? reverseNoi(baseCf[exit] ?? 0) : 0;
  const activeTerminal = (activeCf[exit] ?? 0) - activeNoiExit;
  const baseTerminal = (baseCf[exit] ?? 0) - baseNoiExit;

  const length = Math.max(activeCf.length, baseCf.length);
  const data = Array.from({ length }, (_, i) => ({
    year: `Y${i}`,
    active: i === exit ? activeNoiExit : activeCf[i] ?? 0,
    base: i === exit ? baseNoiExit : baseCf[i] ?? 0,
    activeTerminal: i === exit ? activeTerminal : 0,
    baseTerminal: i === exit ? baseTerminal : 0,
  }));

  const isActiveBase = active.key === "base";
  const activeColor =
    active.key === "stress" ? c["--negative"]
    : active.key === "upside" ? c["--positive"]
    : c["--accent"];

  return (
    <div className="h-[340px] w-full">
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 12, right: 24, left: 12, bottom: 8 }}>
          <CartesianGrid stroke={c["--border"]} strokeDasharray="2 4" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fill: c["--muted-foreground"], fontSize: 11 }}
            stroke={c["--border"]}
          />
          <YAxis
            tickFormatter={(v) => `${v < 0 ? "-" : ""}$${Math.abs(v / 1e6).toFixed(0)}M`}
            tick={{ fill: c["--muted-foreground"], fontSize: 11 }}
            stroke={c["--border"]}
            width={60}
          />
          <ReferenceLine y={0} stroke={c["--border"]} />
          <Tooltip
            contentStyle={{
              background: c["--surface-raised"],
              border: `1px solid ${c["--border"]}`,
              fontSize: 12,
              borderRadius: 8,
            }}
            formatter={(v: number, key) => {
              const labelMap: Record<string, string> = {
                active: `${active.label} — Operating Cash Flow`,
                base: `Base — Operating Cash Flow (Reference)`,
                activeTerminal: `${active.label} — Terminal Value`,
                baseTerminal: `Base — Terminal Value (Reference)`,
              };
              return [fmtCurrency(v, { compact: true }), labelMap[key as string] ?? (key as string)];
            }}
          />
          <Legend
            verticalAlign="top"
            height={32}
            iconType="circle"
            wrapperStyle={{ fontSize: 12, color: c["--foreground"] }}
            formatter={(v) => {
              if (v === "active") return `${active.label} — Operating Cash Flow`;
              if (v === "base") return "Base — Reference";
              if (v === "activeTerminal") return `${active.label} — Terminal Value`;
              if (v === "baseTerminal") return "Base — Terminal (Reference)";
              return v as string;
            }}
          />
          {/* Base reference bar — only shown when the active scenario is NOT base */}
          {!isActiveBase && (
            <Bar
              dataKey="baseTerminal"
              name="baseTerminal"
              fill={c["--muted-foreground"]}
              fillOpacity={0.25}
              barSize={14}
              stackId="t-base"
            />
          )}
          <Bar
            dataKey="activeTerminal"
            name="activeTerminal"
            fill={activeColor}
            fillOpacity={0.5}
            barSize={18}
            stackId="t-active"
          />
          {/* Base reference line — only shown when the active scenario is NOT base */}
          {!isActiveBase && (
            <Line
              type="monotone"
              dataKey="base"
              stroke={c["--muted-foreground"]}
              strokeWidth={1.75}
              strokeDasharray="3 3"
              strokeOpacity={0.7}
              dot={false}
              activeDot={{ r: 3 }}
            />
          )}
          <Line
            type="monotone"
            dataKey="active"
            stroke={activeColor}
            strokeWidth={2.75}
            dot={{ r: 3.5, stroke: activeColor, fill: c["--surface-raised"] }}
            activeDot={{ r: 5.5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
