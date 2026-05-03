/**
 * KpiVerdictTile — replaces the older GateTile. Each tile mirrors one of the
 * three Primary KPIs above (Dev Yield, IRR, NPV) for the *active* scenario,
 * and shows BY HOW MUCH it clears (or misses) the threshold so the operator
 * can see the cushion at a glance.
 *
 * Renaming rationale (per user feedback):
 *   1. "Gate" was confusing alongside the "Primary KPI" tiles above.
 *   2. The values weren't aligned with those primary KPIs — operators expected
 *      to see Dev Yield / IRR / NPV here too, not three separate concepts.
 *   3. There was no explanation of HOW the threshold was met. Now we surface
 *      the explicit cushion (e.g. "+1,533bps above 6.5% cap-rate floor").
 */
import { Check, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type Verdict = "PASS" | "FAIL" | "MARGINAL";

interface Props {
  /** Number shown in the eyebrow chip (1, 2, 3 — matches the Primary KPIs above). */
  kpiNumber: number;
  /** KPI name, e.g. "Development Yield". */
  title: string;
  /** Plain-language threshold rule, e.g. "≥ 6.5% Cap Rate". */
  rule: string;
  /** Pre-computed PASS/MARGINAL/FAIL verdict based on the rule. */
  verdict: Verdict;
  /** Active value (already formatted). e.g. "21.83%". */
  activeValue: string;
  /** Cushion description. e.g. "+1,533bps above 6.5% cap-rate floor". */
  cushion: string;
}

const styles: Record<Verdict, { wrap: string; pill: string; icon: JSX.Element; label: string }> = {
  PASS: {
    wrap: "border-[hsl(var(--success))/35%]",
    pill: "bg-[hsl(var(--success))/12%] text-[hsl(var(--success))]",
    icon: <Check size={14} strokeWidth={3} />,
    label: "PASS",
  },
  FAIL: {
    wrap: "border-[hsl(var(--danger))/35%]",
    pill: "bg-[hsl(var(--danger))/12%] text-[hsl(var(--danger))]",
    icon: <X size={14} strokeWidth={3} />,
    label: "FAIL",
  },
  MARGINAL: {
    wrap: "border-[hsl(var(--warning))/35%]",
    pill: "bg-[hsl(var(--warning))/12%] text-[hsl(var(--warning))]",
    icon: <AlertTriangle size={14} strokeWidth={2.5} />,
    label: "MARGINAL",
  },
};

export function KpiVerdictTile({
  kpiNumber,
  title,
  rule,
  verdict,
  activeValue,
  cushion,
}: Props) {
  const s = styles[verdict];
  return (
    <div className={cn("card-base flex flex-col gap-3 p-5", s.wrap)}>
      <div className="flex items-center justify-between gap-2">
        <span className="label-caps">KPI {kpiNumber} · Active Scenario</span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
            s.pill
          )}
        >
          {s.icon}
          {s.label}
        </span>
      </div>
      <div className="text-[15px] font-semibold leading-snug">{title}</div>
      <div className="text-[12px] italic text-[hsl(var(--muted-foreground))]">{rule}</div>
      <div className="num text-[26px] font-bold leading-none tracking-tight">{activeValue}</div>
      <div className="text-[12.5px] num text-[hsl(var(--muted-foreground))]">
        <span className="font-semibold text-[hsl(var(--foreground))]">Cushion:</span>{" "}
        {cushion}
      </div>
    </div>
  );
}
