import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "ghost" | "accent";
type Size = "sm" | "md" | "lg" | "icon";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const variantClass = {
      // Solid primary fill — slate-blue accent + light text + subtle shadow
      default:
        "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] shadow-sm hover:opacity-90 hover:shadow",
      // Visible filled outline — surface-raised fill, not transparent
      outline:
        "bg-[hsl(var(--surface-raised))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] shadow-sm hover:bg-[hsl(var(--accent-soft))] hover:shadow",
      // Subtle (icon-only chrome)
      ghost:
        "bg-transparent text-[hsl(var(--foreground))] hover:bg-[hsl(var(--surface-raised))]",
      // Same as default — explicit accent variant
      accent:
        "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] shadow-sm hover:opacity-90 hover:shadow",
    }[variant];

    const sizeClass = {
      sm: "h-8 px-3 text-sm",
      md: "h-9 px-4 text-sm",
      lg: "h-10 px-5 text-sm",
      icon: "h-9 w-9 p-0",
    }[size];

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-ring disabled:pointer-events-none disabled:opacity-50",
          variantClass,
          sizeClass,
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
