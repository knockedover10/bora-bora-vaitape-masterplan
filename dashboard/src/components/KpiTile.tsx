import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: "default" | "accent" | "success" | "warning" | "danger";
  className?: string;
}

export function KpiTile({ label, value, sub, tone = "default", className }: Props) {
  const accentBar = {
    default: "bg-[hsl(var(--border))]",
    accent: "bg-[hsl(var(--accent))]",
    success: "bg-[hsl(var(--success))]",
    warning: "bg-[hsl(var(--warning))]",
    danger: "bg-[hsl(var(--danger))]",
  }[tone];

  return (
    <div
      className={cn(
        "card-base relative flex flex-col gap-3 overflow-hidden p-6",
        className
      )}
    >
      <span className={cn("absolute inset-y-0 left-0 w-1", accentBar)} aria-hidden />
      <div className="label-caps">{label}</div>
      <div className="kpi-value text-[28px] font-semibold leading-tight tracking-tight sm:text-[34px] num">
        {value}
      </div>
      {sub && <div className="text-[13px] text-[hsl(var(--muted-foreground))] num">{sub}</div>}
    </div>
  );
}
