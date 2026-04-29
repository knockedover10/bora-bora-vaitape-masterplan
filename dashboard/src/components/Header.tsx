import { Moon, Sun, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onOpenInputs: () => void;
  inputsModified: boolean;
}

export function Header({ theme, onToggleTheme, onOpenInputs, inputsModified }: Props) {
  return (
    <header className="border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))]">
      <div className="container-page flex items-center justify-between gap-3 py-5">
        <div className="flex items-center gap-3">
          <Logo />
          <div className="flex flex-col">
            <h1 className="text-base font-semibold tracking-tight sm:text-lg">
              Bora Bora Net-Zero Luxury Masterplan | Luxury Hotel
            </h1>
            <p className="text-xs text-[hsl(var(--muted-foreground))] sm:text-sm">
              Feasibility Modeling Dashboard (Beta)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="default"
            size="sm"
            onClick={onOpenInputs}
            aria-label="Edit Model Inputs"
            className="relative"
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">Edit Inputs</span>
            {inputsModified && (
              <span
                className="absolute -right-1 -top-1 inline-block h-2.5 w-2.5 rounded-full bg-[hsl(var(--warning))] ring-2 ring-[hsl(var(--surface))]"
                aria-label="Inputs modified"
              />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            onClick={onToggleTheme}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <svg
      role="img"
      aria-label="Vaitape lagoon mark"
      viewBox="0 0 32 32"
      width={32}
      height={32}
      fill="none"
      className="shrink-0 text-[hsl(var(--accent))]"
    >
      <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="16" cy="16" r="4" fill="currentColor" />
    </svg>
  );
}
