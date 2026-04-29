import {
  ComposedChart, Line, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend, ReferenceLine,
} from "recharts";
import { fmtCurrency } from "@/lib/utils";
import type { ScenarioBundle } from "@/hooks/useScenarios";
import type { ModelInputs } from "@/hooks/useModelInputs";
import { useChartColors } from "@/hooks/useChartColors";

interface Props {
  base: ScenarioBundle;
  stress: ScenarioBundle;
  inputs: ModelInputs;
}

/**
 * Live-recomputed DCF line chart using the cashflows on each scenario bundle.
 * Splits terminal value at exit year so the operating-cashflow line isn't
 * crushed by the terminal spike.
 */
export function DcfLineChart({ base, stress, inputs: m }: Props) {
  const c = useChartColors();
  const baseCf = base.cashflows ?? [];
  const stressCf = stress.cashflows ?? [];
  const exit = m.holdYears;

  const reverseNoi = (cfExit: number) =>
    cfExit / (1 + (1 + m.noiGrowth) / m.capRate);

  const baseNoiExit = exit >= 3 ? reverseNoi(baseCf[exit] ?? 0) : 0;
  const stressNoiExit = exit >= 3 ? reverseNoi(stressCf[exit] ?? 0) : 0;
  const baseTerminal = (baseCf[exit] ?? 0) - baseNoiExit;
  const stressTerminal = (stressCf[exit] ?? 0) - stressNoiExit;

  const length = Math.max(baseCf.length, stressCf.length);
  const data = Array.from({ length }, (_, i) => ({
    year: `Y${i}`,
    base: i === exit ? baseNoiExit : baseCf[i] ?? 0,
    stress: i === exit ? stressNoiExit : stressCf[i] ?? 0,
    baseTerminal: i === exit ? baseTerminal : 0,
    stressTerminal: i === exit ? stressTerminal : 0,
  }));

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
            formatter={(v: number, key) => [
              fmtCurrency(v, { compact: true }),
              key === "base" ? "Base" : key === "stress" ? "Combined Stress" : (key as string),
            ]}
          />
          <Legend
            verticalAlign="top"
            height={32}
            iconType="circle"
            wrapperStyle={{ fontSize: 12, color: c["--foreground"] }}
            formatter={(v) => {
              if (v === "base") return "Base — Operating Cash Flow";
              if (v === "stress") return "Combined Stress — Operating Cash Flow";
              if (v === "baseTerminal") return "Base — Terminal Value";
              if (v === "stressTerminal") return "Combined Stress — Terminal Value";
              return v as string;
            }}
          />
          <Bar
            dataKey="baseTerminal"
            name="baseTerminal"
            fill={c["--accent"]}
            fillOpacity={0.45}
            barSize={18}
            stackId="t"
          />
          <Bar
            dataKey="stressTerminal"
            name="stressTerminal"
            fill={c["--negative"]}
            fillOpacity={0.45}
            barSize={18}
            stackId="t2"
          />
          <Line
            type="monotone"
            dataKey="base"
            stroke={c["--accent"]}
            strokeWidth={2.5}
            dot={{ r: 3, stroke: c["--accent"], fill: c["--surface-raised"] }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="stress"
            stroke={c["--negative"]}
            strokeWidth={2.5}
            strokeDasharray="5 4"
            dot={{ r: 3, stroke: c["--negative"], fill: c["--surface-raised"] }}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
