import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, ReferenceArea, Cell, LabelList,
} from "recharts";
import { fmtPercent } from "@/lib/utils";
import type { ScenarioBundle } from "@/hooks/useScenarios";
import { useChartColors } from "@/hooks/useChartColors";
import { SafeBarRect } from "@/components/SafeBarRect";

interface Props {
  scenarios: ScenarioBundle[];
  /** The currently-active scenario key — its bar gets a thick outline + label so it stands out. */
  activeKey?: string;
}

export function IrrBarChart({ scenarios, activeKey }: Props) {
  const c = useChartColors();
  const data = scenarios
    .filter((s) => s.irr12yr !== null && Number.isFinite(s.irr12yr))
    .map((s) => ({
      key: s.key,
      label: s.label,
      irr: (s.irr12yr ?? 0) * 100,
      isActive: s.key === activeKey,
    }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 24, right: 24, left: 8, bottom: 8 }}>
          <CartesianGrid stroke={c["--border"]} strokeDasharray="2 4" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: c["--muted-foreground"], fontSize: 11 }}
            stroke={c["--border"]}
            interval={0}
            tickFormatter={(v) => (v.length > 12 ? v.replace(" ", "\n") : v)}
          />
          <YAxis
            tickFormatter={(v) => `${v.toFixed(0)}%`}
            tick={{ fill: c["--muted-foreground"], fontSize: 11 }}
            stroke={c["--border"]}
            domain={[0, "auto"]}
          />
          {/* Patient-capital target band 8–12% */}
          <ReferenceArea
            y1={8}
            y2={12}
            fill={c["--accent"]}
            fillOpacity={0.08}
            stroke={c["--accent"]}
            strokeOpacity={0.25}
          />
          <Tooltip
            contentStyle={{
              background: c["--surface-raised"],
              border: `1px solid ${c["--border"]}`,
              fontSize: 12,
              borderRadius: 8,
            }}
            formatter={(v: number) => [`${v.toFixed(2)}%`, "Internal Rate Of Return (IRR)"]}
          />
          <Bar
            dataKey="irr"
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
            shape={(p: any) => <SafeBarRect {...p} />}
          >
            {data.map((d, i) => {
              const tone =
                d.irr >= 12
                  ? c["--accent"]
                  : d.irr >= 8
                  ? c["--positive"]
                  : c["--warning"];
              return (
                <Cell
                  key={i}
                  fill={tone}
                  fillOpacity={activeKey && !d.isActive ? 0.28 : 1}
                  stroke={d.isActive ? c["--foreground"] : "transparent"}
                  strokeWidth={d.isActive ? 3 : 0}
                />
              );
            })}
            <LabelList
              dataKey="irr"
              position="top"
              content={(props: any) => {
                const { x, y, width, value, index } = props;
                const isActive = data[index]?.isActive;
                return (
                  <g>
                    {isActive && (
                      <polygon
                        points={`${x + width / 2 - 5},${y - 4} ${x + width / 2 + 5},${y - 4} ${x + width / 2},${y + 2}`}
                        fill={c["--accent"]}
                      />
                    )}
                    <text
                      x={x + width / 2}
                      y={y - 8}
                      fill={c["--foreground"]}
                      fontSize={isActive ? 13 : 11}
                      fontWeight={isActive ? 700 : 600}
                      textAnchor="middle"
                    >
                      {`${Number(value).toFixed(1)}%`}
                    </text>
                  </g>
                );
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11.5px] text-[hsl(var(--muted-foreground))]">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[hsl(var(--accent-soft))] border border-[hsl(var(--accent))/40%]" />
          Patient-Capital Band 8–12%
        </span>
        <span>Target Floor {fmtPercent(0.08, 0)} · Ceiling {fmtPercent(0.12, 0)}</span>
        {activeKey && (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm border-2 border-[hsl(var(--foreground))]" />
            Active Scenario (Outlined)
          </span>
        )}
      </div>
    </div>
  );
}
