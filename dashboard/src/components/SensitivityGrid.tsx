import { sensitivityNOI, inputs } from "@/data/model";
import { fmtCurrency, fmtPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * 5×5 ADR × Occupancy NOI grid coloured by Development Yield thresholds.
 * Thresholds: green ≥10%, gold 8–10%, red <8% (per Excel legend).
 */
export function SensitivityGrid() {
  return (
    <div className="card-base p-5">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="text-[15px] font-semibold tracking-tight">ADR × Occupancy — NOI</h3>
        <span className="text-[12px] text-[hsl(var(--muted-foreground))]">
          Coloured by Dev Yield (NOI ÷ $42M)
        </span>
      </div>
      <div className="-mx-2 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-[12.5px] num">
          <thead>
            <tr className="text-left">
              <th className="px-2 py-1.5 label-caps font-medium">ADR \ Occ</th>
              {sensitivityNOI.occHeaders.map((h) => (
                <th
                  key={h}
                  className="px-2 py-1.5 label-caps text-right font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sensitivityNOI.rows.map((r) => (
              <tr key={r.label}>
                <td className="border-t border-[hsl(var(--border))] px-2 py-2 font-medium text-[hsl(var(--foreground))]">
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
                  const isBase = r.label === "ADR Base" && i === 3; // Occ 65%
                  return (
                    <td
                      key={i}
                      className={cn(
                        "border-t border-[hsl(var(--border))] px-2 py-2 text-right font-medium",
                        tone,
                        isBase && "ring-2 ring-inset ring-[hsl(var(--accent))]"
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
      <Legend />
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
        <h3 className="text-[15px] font-semibold tracking-tight">Cap Rate × Op Cost — Asset Value</h3>
        <span className="text-[12px] text-[hsl(var(--muted-foreground))]">
          AV = NOI ÷ exit cap
        </span>
      </div>
      <div className="-mx-2 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-[12.5px] num">
          <thead>
            <tr className="text-left">
              <th className="px-2 py-1.5 label-caps font-medium">OpEx \ Cap</th>
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
        Highlighted cell = Base (OpEx 72% × Cap 6.5%). Anchor base NOI ${(baseNoi / 1e6).toFixed(2)}M;
        GOP margin {fmtPercent(baseGopMargin, 0)} held constant.
      </p>
    </div>
  );
}

function Legend() {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-3 text-[11.5px] text-[hsl(var(--muted-foreground))]">
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[hsl(var(--success))/40%]" />
        Green: Dev Yield ≥ 10%
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[hsl(var(--warning))/40%]" />
        Gold: 8–10% (patient-capital)
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[hsl(var(--danger))/40%]" />
        Red: &lt; 8%
      </span>
    </div>
  );
}
