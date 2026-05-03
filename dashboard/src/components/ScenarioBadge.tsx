/**
 * ScenarioBadge — pill that names the current active scenario and pulses
 * briefly whenever the scenario key changes. Helps the operator see
 * instantly that the figures below were recomputed.
 *
 * Use this at the top of every chart / table that's driven by the active
 * scenario so the linkage is unambiguous.
 */
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  /** The active scenario key (e.g. "base", "upside", "stress"). */
  activeKey: string;
  /** The active scenario label (e.g. "Base", "Upside", "Stress"). */
  activeLabel: string;
  /** Optional caption shown after the label, e.g. "Live · 12-Year DCF". */
  caption?: string;
  className?: string;
}

const TONE_BY_KEY: Record<string, { bg: string; ring: string; fg: string; dot: string }> = {
  base: {
    bg: "bg-[hsl(var(--accent-soft))]",
    ring: "ring-[hsl(var(--accent))/40%]",
    fg: "text-[hsl(var(--accent))]",
    dot: "bg-[hsl(var(--accent))]",
  },
  upside: {
    bg: "bg-[hsl(var(--success))/12%]",
    ring: "ring-[hsl(var(--success))/40%]",
    fg: "text-[hsl(var(--success))]",
    dot: "bg-[hsl(var(--success))]",
  },
  stress: {
    bg: "bg-[hsl(var(--danger))/12%]",
    ring: "ring-[hsl(var(--danger))/40%]",
    fg: "text-[hsl(var(--danger))]",
    dot: "bg-[hsl(var(--danger))]",
  },
};

export function ScenarioBadge({ activeKey, activeLabel, caption, className }: Props) {
  const [pulse, setPulse] = useState(false);
  const prev = useRef(activeKey);

  useEffect(() => {
    if (prev.current !== activeKey) {
      prev.current = activeKey;
      setPulse(true);
      const t = window.setTimeout(() => setPulse(false), 900);
      return () => window.clearTimeout(t);
    }
  }, [activeKey]);

  const tone =
    TONE_BY_KEY[activeKey] ??
    {
      bg: "bg-[hsl(var(--muted))/40%]",
      ring: "ring-[hsl(var(--border))]",
      fg: "text-[hsl(var(--foreground))]",
      dot: "bg-[hsl(var(--foreground))]",
    };

  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11.5px] font-semibold uppercase tracking-wide ring-1 ring-inset transition-all",
        tone.bg,
        tone.ring,
        tone.fg,
        pulse && "scale-105 shadow-[0_0_0_4px_hsl(var(--accent)/0.10)]",
        className
      )}
      title={`Showing figures for the ${activeLabel} scenario.`}
    >
      <span
        className={cn(
          "inline-block h-2 w-2 rounded-full",
          tone.dot,
          pulse && "animate-pulse"
        )}
      />
      <span>Showing: {activeLabel}</span>
      {caption && (
        <span className="font-normal normal-case opacity-70">· {caption}</span>
      )}
    </span>
  );
}
