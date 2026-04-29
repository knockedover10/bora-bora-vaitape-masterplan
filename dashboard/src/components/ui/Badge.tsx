import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "success" | "warning" | "danger" | "accent" | "muted";

interface Props extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ className, tone = "default", ...props }: Props) {
  const tones: Record<Tone, string> = {
    default: "border-[hsl(var(--border))] bg-[hsl(var(--surface-raised))] text-[hsl(var(--foreground))]",
    success: "border-[hsl(var(--success))/30%] bg-[hsl(var(--success))/12%] text-[hsl(var(--success))]",
    warning: "border-[hsl(var(--warning))/30%] bg-[hsl(var(--warning))/12%] text-[hsl(var(--warning))]",
    danger: "border-[hsl(var(--danger))/30%] bg-[hsl(var(--danger))/12%] text-[hsl(var(--danger))]",
    accent: "border-[hsl(var(--accent))/30%] bg-[hsl(var(--accent))/12%] text-[hsl(var(--accent))]",
    muted: "border-[hsl(var(--border))] bg-transparent text-[hsl(var(--muted-foreground))]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
