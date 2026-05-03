import { TornadoChart, TornadoLegend } from "@/components/TornadoChart";
import { SensitivityGrid, CapRateOpCostGrid } from "@/components/SensitivityGrid";
import { ScenarioBadge } from "@/components/ScenarioBadge";
import type { ScenarioBundle } from "@/hooks/useScenarios";
import { fmtCurrency } from "@/lib/utils";

interface Props {
  active: ScenarioBundle;
}

export function TabSensitivities({ active }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="card-base p-5">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-[16px] font-semibold tracking-tight">
            Tornado — Top 7 Net Present Value (NPV) @ 7% Drivers
          </h3>
          <ScenarioBadge
            activeKey={active.key}
            activeLabel={active.label}
            caption={`Centred on ${fmtCurrency(active.npv7 ?? 0, { compact: true })}`}
          />
        </div>
        <p className="mb-3 text-[12.5px] text-[hsl(var(--muted-foreground))]">
          Each bar shows how the {active.label} NPV @ 7% would move if a single driver swings across its
          stress-to-upside range, holding everything else constant. The vertical line is the active scenario's
          starting NPV — bars to the right of it are upside, bars to the left are downside.
        </p>
        <TornadoChart active={active} />
        <TornadoLegend />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SensitivityGrid active={active} />
        <CapRateOpCostGrid />
      </div>
    </div>
  );
}
