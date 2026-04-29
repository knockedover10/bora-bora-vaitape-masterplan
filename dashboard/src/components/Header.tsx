import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: Props) {
  return (
    <header className="border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))]">
      <div className="container-page flex items-center justify-between py-5">
        <div className="flex items-center gap-3">
          <Logo />
          <div className="flex flex-col">
            <h1 className="text-base font-semibold tracking-tight sm:text-lg">
              Vaitape Bora Bora
            </h1>
            <p className="text-xs text-[hsl(var(--muted-foreground))] sm:text-sm">
              Ultra-Luxury Hotel Feasibility
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden sm:inline-block label-caps text-[hsl(var(--accent))]">
            v7 · Patient-Capital
          </span>
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
