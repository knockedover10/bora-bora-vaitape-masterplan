import { Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import type { ScenarioKey } from "@/data/model";
import type { ScenarioBundle } from "@/hooks/useScenarios";

interface Props {
  scenarios: ScenarioBundle[];
  activeKey: ScenarioKey;
  setActiveKey: (k: ScenarioKey) => void;
  toggle: (k: ScenarioKey) => void;
  isActive: (k: ScenarioKey) => boolean;
  onEditCustoms: () => void;
}

export function ScenarioBar({
  scenarios,
  activeKey,
  setActiveKey,
  toggle,
  isActive,
  onEditCustoms,
}: Props) {
  return (
    <div className="border-y border-[hsl(var(--border))] bg-[hsl(var(--surface))]">
      <div className="container-page flex flex-wrap items-center gap-2 py-3 sm:gap-3">
        <span className="label-caps shrink-0 mr-1 sm:mr-2">Scenarios</span>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {scenarios.map((s) => {
            const on = isActive(s.key);
            const isPrimary = activeKey === s.key && on;
            return (
              <div key={s.key} className="flex items-center">
                <button
                  type="button"
                  onClick={() => on && setActiveKey(s.key)}
                  disabled={!on}
                  aria-pressed={isPrimary}
                  className={cn(
                    "inline-flex h-8 items-center gap-2 rounded-full border px-3 text-[12.5px] font-medium transition-colors focus-ring",
                    on
                      ? isPrimary
                        ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent))/10%] text-[hsl(var(--accent))]"
                        : "border-[hsl(var(--border))] bg-[hsl(var(--surface-raised))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--accent))/40%]"
                      : "border-[hsl(var(--border))] bg-transparent text-[hsl(var(--muted-foreground))] cursor-not-allowed opacity-60"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-1.5 w-1.5 rounded-full",
                      on ? "bg-[hsl(var(--accent))]" : "bg-[hsl(var(--muted-foreground))/40%]"
                    )}
                  />
                  {s.label}
                </button>
                <Switch
                  checked={on}
                  onCheckedChange={() => toggle(s.key)}
                  ariaLabel={`Toggle ${s.label}`}
                  className="ml-1.5"
                />
              </div>
            );
          })}
        </div>
        <div className="ml-auto">
          <Button variant="outline" size="sm" onClick={onEditCustoms}>
            <Settings2 size={14} />
            Edit Customs
          </Button>
        </div>
      </div>
    </div>
  );
}
