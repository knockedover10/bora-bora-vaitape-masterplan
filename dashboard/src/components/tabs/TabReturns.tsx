import { DcfLineChart } from "@/components/DcfLineChart";
import { IrrBarChart } from "@/components/IrrBarChart";
import { fmtCurrency, fmtPercent } from "@/lib/utils";
import type { ScenarioBundle } from "@/hooks/useScenarios";

interface Props {
  scenarios: ScenarioBundle[];
}

export function TabReturns({ scenarios }: Props) {
  // NPV/IRR table for active scenarios
  return (
    <div className="flex flex-col gap-6">
      <div className="card-base p-5">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-[16px] font-semibold tracking-tight">12-year cashflow — Base &amp; Stress</h3>
          <span className="text-[12px] text-[hsl(var(--muted-foreground))] num">
            Y0–Y2 construction · Y3–Y5 ramp · Y6+ stabilised · Y12 includes terminal value
          </span>
        </div>
        <DcfLineChart />
      </div>

      <div className="card-base p-5">
        <h3 className="mb-3 text-[16px] font-semibold tracking-tight">
          12-yr Unleveraged IRR — by active scenario
        </h3>
        <IrrBarChart scenarios={scenarios} />
      </div>

      <div className="card-base p-5">
        <h3 className="mb-3 text-[16px] font-semibold tracking-tight">
          NPV at three discount rates
        </h3>
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full min-w-[600px] text-[13px] num">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2 label-caps">Scenario</th>
                <th className="px-3 py-2 label-caps text-right">12-yr IRR</th>
                <th className="px-3 py-2 label-caps text-right">NPV @ 7% (patient)</th>
                <th className="px-3 py-2 label-caps text-right">NPV @ 9% (mid)</th>
                <th className="px-3 py-2 label-caps text-right">NPV @ 11% (PE)</th>
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
          12-year unleveraged DCF per HVS convention (Hotel Investment Analysis 12th ed., 2021).
          Construction phasing 30 / 40 / 30 across Y0 / Y1 / Y2. Pre-opening reserve $2.73M
          (6.5%) lands in Y2. Operating ramp 50 / 72 / 90 / 100% across Y3–Y6. NOI grows at 3%
          p.a. from Y6. Terminal value at Y12 via Gordon exit at 6.5% cap. NPV at 7% (patient
          capital floor), 9% (midpoint) and 11% (PE bound). Hold horizon 12 years — no 20-year
          option modelled.
        </p>
      </div>
    </div>
  );
}
