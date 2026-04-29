import { Check, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type Verdict = "PASS" | "FAIL" | "MARGINAL";

interface Props {
  gateNumber: number;
  title: string;
  rule: string;
  verdict: Verdict;
  detail: string;
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

export function GateTile({ gateNumber, title, rule, verdict, detail }: Props) {
  const s = styles[verdict];
  return (
    <div className={cn("card-base flex flex-col gap-3 border-l-4 p-5", s.wrap)}>
      <div className="flex items-center justify-between gap-2">
        <span className="label-caps">Gate {gateNumber}</span>
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
      <div className="text-[12px] text-[hsl(var(--muted-foreground))]">{rule}</div>
      <div className="text-[13px] num">{detail}</div>
    </div>
  );
}
