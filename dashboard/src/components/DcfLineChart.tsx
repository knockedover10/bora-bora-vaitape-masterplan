import {
  ComposedChart, Line, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend, ReferenceLine,
} from "recharts";
import { dcf, inputs } from "@/data/model";
import { fmtCurrency } from "@/lib/utils";

export function DcfLineChart() {
  // Separate terminal value from operating cashflow at Y12 so the line
  // doesn't get crushed by the terminal-value spike.
  const baseY12NoTerminal = dcf.base.cashflows[12]
    - (dcf.base.cashflows[11] * (1 + inputs.noi_growth)) / inputs.cap_rate;
  const stressY12NoTerminal = dcf.stress.cashflows[12]
    - (dcf.stress.cashflows[11] * (1 + inputs.noi_growth)) / inputs.cap_rate;

  const data = dcf.base.cashflows.map((cf, i) => ({
    year: `Y${i}`,
    base: i === 12 ? baseY12NoTerminal : cf,
    stress: i === 12 ? stressY12NoTerminal : dcf.stress.cashflows[i],
    baseTerminal: i === 12 ? cf - baseY12NoTerminal : 0,
    stressTerminal: i === 12 ? dcf.stress.cashflows[12] - stressY12NoTerminal : 0,
  }));

  return (
    <div className="h-[340px] w-full">
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 12, right: 24, left: 12, bottom: 8 }}>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            stroke="hsl(var(--border))"
          />
          <YAxis
            tickFormatter={(v) => `${v < 0 ? "-" : ""}$${Math.abs(v / 1e6).toFixed(0)}M`}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            stroke="hsl(var(--border))"
            width={60}
          />
          <ReferenceLine y={0} stroke="hsl(var(--border))" />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--surface-raised))",
              border: "1px solid hsl(var(--border))",
              fontSize: 12,
              borderRadius: 8,
            }}
            formatter={(v: number, key) => [fmtCurrency(v, { compact: true }), key === "base" ? "Base" : "Stress"]}
          />
          <Legend
            verticalAlign="top"
            height={32}
            iconType="circle"
            wrapperStyle={{ fontSize: 12, color: "hsl(var(--foreground))" }}
            formatter={(v) => {
              if (v === "base") return "Base — operating CF";
              if (v === "stress") return "Stress — operating CF";
              if (v === "baseTerminal") return "Base — terminal value";
              if (v === "stressTerminal") return "Stress — terminal value";
              return v as string;
            }}
          />
          <Bar dataKey="baseTerminal" name="baseTerminal" fill="hsl(var(--accent))" fillOpacity={0.45} barSize={18} stackId="t" />
          <Bar dataKey="stressTerminal" name="stressTerminal" fill="hsl(var(--warning))" fillOpacity={0.45} barSize={18} stackId="t2" />
          <Line
            type="monotone"
            dataKey="base"
            stroke="hsl(var(--accent))"
            strokeWidth={2.5}
            dot={{ r: 3, stroke: "hsl(var(--accent))", fill: "hsl(var(--surface-raised))" }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="stress"
            stroke="hsl(var(--warning))"
            strokeWidth={2.5}
            strokeDasharray="5 4"
            dot={{ r: 3, stroke: "hsl(var(--warning))", fill: "hsl(var(--surface-raised))" }}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
