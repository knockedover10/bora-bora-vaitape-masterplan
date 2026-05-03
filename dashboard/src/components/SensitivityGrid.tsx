import { sensitivityNOI, inputs } from "@/data/model";
import { fmtCurrency, fmtPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { ScenarioBundle } from "@/hooks/useScenarios";

interface SensitivityGridProps {
  /** Active scenario — used to highlight the matching ADR × Occupancy cell. */
  active?: ScenarioBundle;
}

/**
 * 5×5 ADR × Occupancy NOI grid coloured by Development Yield thresholds.
 * Thresholds: green ≥10%, gold 8–10%, red <8% (per Excel legend).
 *
 * The cell that best matches the active scenario's ADR × Occupancy pair
 * is highlighted with an accent ring so the user can see exactly which
 * point on the grid the selected scenario sits at.
 */
export function SensitivityGrid({ active }: SensitivityGridProps) {
  // Find the closest row (ADR) and column (Occupancy) to the active scenario
  const activeAdr = active?.adr ?? null;
  const activeOcc = active?.occ ?? null;

  // Each row carries an explicit numeric ADR — find the closest row to the active ADR.
  // NOTE: the matrix ADRs are room-revenue-equivalent (Base $2,150) while scenario ADRs
  // are the rack rates ($4,200 etc). The +/- step structure is the same so we map by
  // step position relative to scenario base ADR ($4,200 = row 'Base').
  const baseScenarioAdr = 4200;
  const activeRowIdx =
    activeAdr !== null
      ? sensitivityNOI.rows.reduce((best, r, i) => {
          // map row.adr -> equivalent rack ADR by ratio: r.adr / 2150 * 4200
          const rackEq = (r.adr / 2150) * baseScenarioAdr;
          const bestRackEq = (sensitivityNOI.rows[best].adr / 2150) * baseScenarioAdr;
          return Math.abs(rackEq - activeAdr) < Math.abs(bestRackEq - activeAdr) ? i : best;
        }, 0)
      : -1;

  // Column headers like "55%" / "60%" / "65%" / "70%" / "75%" — match closest occupancy
  const colOccs = sensitivityNOI.occHeaders.map((h) => {
    const m = /(\d+)/.exec(h);
    return m ? Number(m[1]) / 100 : NaN;
  });
  const activeColIdx =
    activeOcc !== null && colOccs.some((n) => Number.isFinite(n))
      ? colOccs.reduce((best, v, i) => {
          if (!Number.isFinite(v)) return best;
          return Math.abs(v - activeOcc) < Math.abs(colOccs[best] - activeOcc) ? i : best;
        }, 0)
      : -1;

  return (
    <div className="card-base p-5">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="text-[15px] font-semibold tracking-tight">Average Daily Rate (ADR) × Occupancy — Net Operating Income (NOI)</h3>
        <span className="text-[12px] text-[hsl(var(--muted-foreground))]">
          Coloured By Development Yield (NOI ÷ $42M)
        </span>
      </div>
      {active && activeRowIdx >= 0 && activeColIdx >= 0 && (
        <div className="mb-3 rounded-md border border-[hsl(var(--accent))/30%] bg-[hsl(var(--accent-soft))] px-3 py-2 text-[12px] num text-[hsl(var(--accent))]">
          <strong>{active.label}</strong> sits at row{" "}
          <strong>{sensitivityNOI.rows[activeRowIdx].label}</strong> × column{" "}
          <strong>{sensitivityNOI.occHeaders[activeColIdx]}</strong>{" "}
          (ADR {fmtCurrency(active.adr ?? 0)} · Occupancy {fmtPercent(active.occ ?? 0, 0)}). Highlighted cell below.
        </div>
      )}
      <div className="-mx-2 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-[12.5px] num">
          <thead>
            <tr className="text-left">
              <th className="px-2 py-1.5 label-caps font-medium">ADR \ Occupancy</th>
              {sensitivityNOI.occHeaders.map((h, i) => (
                <th
                  key={h}
                  className={cn(
                    "px-2 py-1.5 label-caps text-right font-medium",
                    i === activeColIdx && "text-[hsl(var(--accent))]"
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sensitivityNOI.rows.map((r, rIdx) => (
              <tr key={r.label}>
                <td
                  className={cn(
                    "border-t border-[hsl(var(--border))] px-2 py-2 font-medium text-[hsl(var(--foreground))]",
                    rIdx === activeRowIdx && "text-[hsl(var(--accent))]"
                  )}
                >
                  {r.label}
                </td>
                {r.vals.map((v, i) => {
                  const yld = v / inputs.total_dev_cost;
                  const tone =
                    yld >= 0.1
                      ? "bg-[hsl(var(--success))/14%] text-[hsl(var(--success))]"
                      : yld >= 0.08
                      ? "bg-[hsl(var(--warning))/14%] text-[hsl(var(--warning))]"
                      : "bg-[hsl(var(--danger))/14%] text-[hsl(var(--danger))]";
                  // Original-deck base anchor (occ 65%, base ADR row)
                  const isDeckBase = r.label === "Average Daily Rate Base" && i === 3;
                  // Active scenario coordinate
                  const isActiveCell = rIdx === activeRowIdx && i === activeColIdx;
                  return (
                    <td
                      key={i}
                      className={cn(
                        "border-t border-[hsl(var(--border))] px-2 py-2 text-right font-medium",
                        tone,
                        isDeckBase && !isActiveCell && "ring-1 ring-inset ring-[hsl(var(--border))]",
                        isActiveCell && "ring-2 ring-inset ring-[hsl(var(--accent))] shadow-[0_0_0_3px_hsl(var(--accent)/0.18)]"
                      )}
                    >
                      <div>{fmtCurrency(v, { compact: true })}</div>
                      <div className="text-[10.5px] opacity-80">{fmtPercent(yld, 1)}</div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Legend hasActive={!!active && activeRowIdx >= 0 && activeColIdx >= 0} />
    </div>
  );
}

/**
 * 5×5 Cap Rate × Op Cost ratio asset-value grid.
 * Generated analytically from base NOI: AV = NOI(opCost) / cap.
 */
export function CapRateOpCostGrid() {
  const baseNoi = 4_762_482.9525;
  const baseRev = 24_101_634.375;
  const baseGopMargin = 0.28;
  // Derive NOI at differing OpCost ratios (holding revenue + mgmt + ffe assumption)
  const opRatios = [0.67, 0.7, 0.72, 0.75, 0.78];
  const caps = [0.055, 0.06, 0.065, 0.07, 0.075];

  // Approximation: NOI changes linearly with OpEx ratio
  // ΔNOI ≈ -ΔOpEx × Total Revenue (with mgmt/ffe scaling negligible for grid)
  const noiAt = (op: number) => {
    const totalRev = baseRev;
    const opex = totalRev * op;
    const gop = totalRev - opex;
    const mgmt = totalRev * 0.03 + gop * 0.08;
    const ebitda = gop - mgmt;
    const ffe = totalRev * 0.03;
    return ebitda - ffe;
  };

  return (
    <div className="card-base p-5">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="text-[15px] font-semibold tracking-tight">Capitalisation Rate × Operating Cost — Asset Value</h3>
        <span className="text-[12px] text-[hsl(var(--muted-foreground))]">
          Asset Value = Net Operating Income ÷ Exit Cap Rate
        </span>
      </div>
      <div className="-mx-2 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-[12.5px] num">
          <thead>
            <tr className="text-left">
              <th className="px-2 py-1.5 label-caps font-medium">Operating Expenses \ Cap Rate</th>
              {caps.map((c) => (
                <th key={c} className="px-2 py-1.5 label-caps text-right font-medium">
                  {fmtPercent(c, 1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {opRatios.map((op) => {
              const noi = noiAt(op);
              return (
                <tr key={op}>
                  <td className="border-t border-[hsl(var(--border))] px-2 py-2 font-medium">
                    {fmtPercent(op, 0)}
                  </td>
                  {caps.map((c) => {
                    const av = noi / c;
                    const tone =
                      av >= 70_000_000
                        ? "bg-[hsl(var(--success))/14%] text-[hsl(var(--success))]"
                        : av >= 50_000_000
                        ? "bg-[hsl(var(--warning))/14%] text-[hsl(var(--warning))]"
                        : "bg-[hsl(var(--danger))/14%] text-[hsl(var(--danger))]";
                    const isBase = op === 0.72 && c === 0.065;
                    return (
                      <td
                        key={c}
                        className={cn(
                          "border-t border-[hsl(var(--border))] px-2 py-2 text-right font-medium",
                          tone,
                          isBase && "ring-2 ring-inset ring-[hsl(var(--accent))]"
                        )}
                      >
                        {fmtCurrency(av, { compact: true })}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[11.5px] text-[hsl(var(--muted-foreground))] num">
        Highlighted Cell = Base (Operating Expenses 72% × Cap Rate 6.5%). Anchor Base Net Operating Income ${(baseNoi / 1e6).toFixed(2)}M;
        Gross Operating Profit Margin {fmtPercent(baseGopMargin, 0)} Held Constant.
      </p>
    </div>
  );
}

function Legend({ hasActive }: { hasActive: boolean }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-3 text-[11.5px] text-[hsl(var(--muted-foreground))]">
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[hsl(var(--success))/40%]" />
        Green: Development Yield ≥ 10%
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[hsl(var(--warning))/40%]" />
        Gold: 8–10% (Patient-Capital)
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[hsl(var(--danger))/40%]" />
        Red: &lt; 8%
      </span>
      {hasActive && (
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm border-2 border-[hsl(var(--accent))]" />
          Active Scenario Coordinate
        </span>
      )}
    </div>
  );
}
