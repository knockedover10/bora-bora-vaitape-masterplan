import { cn } from "@/lib/utils";

interface Props {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  className?: string;
  ariaLabel?: string;
}

export function Slider({ value, min, max, step, onChange, className, ariaLabel }: Props) {
  return (
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      aria-label={ariaLabel}
      className={cn(
        "h-2 w-full cursor-pointer appearance-none rounded-full bg-[hsl(var(--surface-raised))] focus-ring",
        "accent-[hsl(var(--accent))]",
        className
      )}
    />
  );
}
