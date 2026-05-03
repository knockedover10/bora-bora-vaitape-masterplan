/**
 * DeltaChip — colour-coded indicator showing the delta of a metric vs the Base
 * scenario. Used across the dashboard so users can see at a glance which
 * KPI values changed (and by how much) when toggling Upside / Base / Stress.
 *
 * Conventions:
 *   - Positive delta (good direction): success colour, up arrow
 *   - Negative delta (bad direction): danger colour, down arrow
 *   - Within ±0.5% (or ±$10k for currency): muted, dash icon
 *
 * "Good direction" depends on the metric — for a cost or cap rate, lower is
 * better. The `directionGood` prop flips the colour mapping.
 */
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeltaChipProps {
  /** Current scenario value (e.g. Upside or Stress). */
  value: number;
  /** Base scenario value to compare against. */
  base: number;
  /** Format type. */
  format: "currency" | "percent" | "pct_points" | "number";
  /** When true, an UP arrow uses success colour. When false (e.g. costs, cap rate, opex), DOWN is good. */
  directionGood?: "up" | "down";
  /** Hide the chip entirely when the active scenario IS the base. */
  hideOnBase?: boolean;
  className?: string;
}

const EPS = 1e-9;

function formatDelta(delta: number, format: DeltaChipProps["format"]): string {
  const abs = Math.abs(delta);
  if (format === "currency") {
    if (abs >= 1_000_000) return `${delta >= 0 ? "+" : "−"}$${(abs / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${delta >= 0 ? "+" : "−"}$${(abs / 1_000).toFixed(0)}K`;
    return `${delta >= 0 ? "+" : "−"}$${abs.toFixed(0)}`;
  }
  if (format === "percent") {
    // delta is a fractional change like +0.0832 (= +8.32% relative)
    return `${delta >= 0 ? "+" : "−"}${(abs * 100).toFixed(1)}%`;
  }
  if (format === "pct_points") {
    // delta is in absolute pp like +0.05 (= +5pp)
    return `${delta >= 0 ? "+" : "−"}${(abs * 100).toFixed(1)}pp`;
  }
  // raw number
  return `${delta >= 0 ? "+" : "−"}${abs.toFixed(1)}`;
}

export function DeltaChip({
  value,
  base,
  format,
  directionGood = "up",
  hideOnBase = true,
  className,
}: DeltaChipProps) {
  const delta = value - base;
  // Tolerance for "effectively flat":
  //  - currency: max(0.5% of base, $10) so ADR ($4.2K base → $21 tol) and NPV ($140M base → $700K tol) both behave sensibly
  //  - percent / pct_points / number: 0.5pp / 0.5%
  const baseTol =
    format === "currency"
      ? Math.max(Math.abs(base) * 0.005, 10)
      : 0.005;
  const isFlat = Math.abs(delta) < baseTol + EPS;

  if (hideOnBase && isFlat) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10.5px] font-medium",
          "bg-[hsl(var(--muted)/40%)] text-[hsl(var(--muted-foreground))]",
          className
        )}
        title="Same as Base"
      >
        <Minus size={10} aria-hidden />
        Base
      </span>
    );
  }

  const isPositiveDelta = delta > 0;
  // direction-good determines whether positive is "success"
  const goodWhenPositive = directionGood === "up";
  const isGood = goodWhenPositive ? isPositiveDelta : !isPositiveDelta;

  const tone = isFlat
    ? { bg: "hsl(var(--muted)/40%)", fg: "hsl(var(--muted-foreground))" }
    : isGood
    ? { bg: "hsl(var(--success)/15%)", fg: "hsl(var(--success))" }
    : { bg: "hsl(var(--danger)/15%)", fg: "hsl(var(--danger))" };

  const Icon = isFlat ? Minus : isPositiveDelta ? ArrowUp : ArrowDown;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10.5px] font-medium num",
        className
      )}
      style={{ backgroundColor: tone.bg, color: tone.fg }}
      title={`vs Base — ${isPositiveDelta ? "higher" : "lower"} by ${formatDelta(delta, format).replace(/^[+−]/, "")}`}
    >
      <Icon size={10} aria-hidden />
      {formatDelta(delta, format)}
    </span>
  );
}
