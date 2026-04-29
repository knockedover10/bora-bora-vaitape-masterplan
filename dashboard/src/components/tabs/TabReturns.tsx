import { DcfLineChart } from "@/components/DcfLineChart";
import { IrrBarChart } from "@/components/IrrBarChart";
import { fmtCurrency, fmtPercent } from "@/lib/utils";
import type { ScenarioBundle } from "@/hooks/useScenarios";
import type { ModelInputs } from "@/hooks/useModelInputs";

interface Props {
  scenarios: ScenarioBundle[];
  inputs: ModelInputs;
  isModified: boolean;
}

export function TabReturns({ scenarios, inputs: m, isModified }: Props) {
  // Get base and stress for the DCF chart (always render even if toggled off)
  const base = scenarios.find((s) => s.key === "base");
  const stress = scenarios.find((s) => s.key === "stress");

  return (
    <div className="flex flex-col gap-6">
      <div className="card-base p-5">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-[16px] font-semibold tracking-tight">
            {m.holdYears}-Year Cash Flow — Base &amp; Combined Stress
            {isModified && (
              <span
                title="Recalculated From Your Inputs"
                className="ml-2 inline-block h-2 w-2 rounded-full bg-[hsl(var(--warning))] align-middle"
              />
            )}
          </h3>
          <span className="text-[12px] text-[hsl(var(--muted-foreground))] num">
            Year 0–Year 2 Construction · Year 3–Year 5 Ramp · Year 6+ Stabilised · Year {m.holdYears} Includes Terminal Value
          </span>
        </div>
        {base && stress ? (
          <DcfLineChart base={base} stress={stress} inputs={m} />
        ) : (
          <div className="text-sm text-[hsl(var(--muted-foreground))]">No Data</div>
        )}
      </div>

      <div className="card-base p-5">
        <h3 className="mb-3 text-[16px] font-semibold tracking-tight">
          {m.holdYears}-Year Unleveraged Internal Rate Of Return (IRR) — By Active Scenario
        </h3>
        <IrrBarChart scenarios={scenarios} />
      </div>

      <div className="card-base p-5">
        <h3 className="mb-3 text-[16px] font-semibold tracking-tight">
          Net Present Value (NPV) At Three Discount Rates
        </h3>
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full min-w-[640px] text-[13px] num">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2 label-caps">Scenario</th>
                <th className="px-3 py-2 label-caps text-right">{m.holdYears}-Year IRR</th>
                <th className="px-3 py-2 label-caps text-right">NPV @ 7% (Patient)</th>
                <th className="px-3 py-2 label-caps text-right">NPV @ 9% (Mid)</th>
                <th className="px-3 py-2 label-caps text-right">NPV @ 11% (Private Equity)</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((s) => (
                <tr key={s.key} className="border-t border-[hsl(var(--border))]">
                  <td className="px-3 py-2.5 font-medium">{s.label}</td>
                  <td className="px-3 py-2.5 text-right font-semibold">
                    {s.irr12yr === null || !Number.isFinite(s.irr12yr)
                      ? "—"
                      : fmtPercent(s.irr12yr, 2)}
                  </td>
                  <td
                    className={`px-3 py-2.5 text-right font-semibold ${
                      (s.npv7 ?? 0) > 0
                        ? "text-[hsl(var(--success))]"
                        : "text-[hsl(var(--danger))]"
                    }`}
                  >
                    {fmtCurrency(s.npv7 ?? 0, { compact: true })}
                  </td>
                  <td
                    className={`px-3 py-2.5 text-right font-semibold ${
                      (s.npv9 ?? 0) > 0
                        ? "text-[hsl(var(--success))]"
                        : "text-[hsl(var(--warning))]"
                    }`}
                  >
                    {fmtCurrency(s.npv9 ?? 0, { compact: true })}
                  </td>
                  <td
                    className={`px-3 py-2.5 text-right font-semibold ${
                      (s.npv11 ?? 0) > 0
                        ? "text-[hsl(var(--success))]"
                        : "text-[hsl(var(--danger))]"
                    }`}
                  >
                    {fmtCurrency(s.npv11 ?? 0, { compact: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-base border-l-4 border-l-[hsl(var(--accent))] p-5">
        <div className="label-caps mb-2 text-[hsl(var(--accent))]">Methodology</div>
        <p className="text-[13.5px] leading-relaxed">
          {m.holdYears}-Year Unleveraged Discounted Cash Flow (DCF) per Hotel Valuation Services
          (HVS) convention (Hotel Investment Analysis 12th Ed., 2021). Construction Phasing
          30 / 40 / 30 Across Year 0 / Year 1 / Year 2. Pre-Opening Reserve {fmtCurrency(m.totalDevCost * 0.065, { compact: true })}
          {" "}(6.5%) Lands In Year 2. Operating Ramp 50 / 72 / 90 / 100% Across Year 3–Year 6.
          Net Operating Income (NOI) Grows At {fmtPercent(m.noiGrowth, 1)} Per Annum From Year 6.
          Terminal Value At Year {m.holdYears} Via Gordon Exit At {fmtPercent(m.capRate, 2)} Cap Rate.
          Net Present Value (NPV) At 7% (Patient-Capital Floor), 9% (Midpoint) And 11% (Private
          Equity Bound).
        </p>
      </div>
    </div>
  );
}
