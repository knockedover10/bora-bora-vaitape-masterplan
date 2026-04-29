import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, ReferenceArea, Cell,
} from "recharts";
import { fmtPercent } from "@/lib/utils";
import type { ScenarioBundle } from "@/hooks/useScenarios";

interface Props {
  scenarios: ScenarioBundle[];
}

export function IrrBarChart({ scenarios }: Props) {
  const data = scenarios
    .filter((s) => s.irr12yr !== null && Number.isFinite(s.irr12yr))
    .map((s) => ({
      label: s.label,
      irr: (s.irr12yr ?? 0) * 100,
    }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 12, right: 24, left: 8, bottom: 8 }}>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            stroke="hsl(var(--border))"
            interval={0}
            tickFormatter={(v) => (v.length > 12 ? v.replace(" ", "\n") : v)}
          />
          <YAxis
            tickFormatter={(v) => `${v.toFixed(0)}%`}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            stroke="hsl(var(--border))"
            domain={[0, "auto"]}
          />
          {/* Patient-capital target band 8–12% */}
          <ReferenceArea
            y1={8}
            y2={12}
            fill="hsl(var(--accent))"
            fillOpacity={0.08}
            stroke="hsl(var(--accent))"
            strokeOpacity={0.25}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--surface-raised))",
              border: "1px solid hsl(var(--border))",
              fontSize: 12,
              borderRadius: 8,
            }}
            formatter={(v: number) => [`${v.toFixed(2)}%`, "12-yr IRR"]}
          />
          <Bar dataKey="irr" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => {
              const tone =
                d.irr >= 12
                  ? "hsl(var(--accent))"
                  : d.irr >= 8
                  ? "hsl(var(--success))"
                  : "hsl(var(--warning))";
              return <Cell key={i} fill={tone} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11.5px] text-[hsl(var(--muted-foreground))]">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[hsl(var(--accent))/30%] border border-[hsl(var(--accent))/40%]" />
          Patient-capital band 8–12%
        </span>
        <span>Target floor {fmtPercent(0.08, 0)} · ceiling {fmtPercent(0.12, 0)}</span>
      </div>
    </div>
  );
}
