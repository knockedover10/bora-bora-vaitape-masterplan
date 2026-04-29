import { TornadoChart, TornadoLegend } from "@/components/TornadoChart";
import { SensitivityGrid, CapRateOpCostGrid } from "@/components/SensitivityGrid";

export function TabSensitivities() {
  return (
    <div className="flex flex-col gap-6">
      <div className="card-base p-5">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-[16px] font-semibold tracking-tight">
            Tornado — top 7 NPV @ 7% drivers
          </h3>
          <span className="text-[12px] text-[hsl(var(--muted-foreground))]">
            Centred on Base NPV @ 7% = $27.51M
          </span>
        </div>
        <TornadoChart />
        <TornadoLegend />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SensitivityGrid />
        <CapRateOpCostGrid />
      </div>
    </div>
  );
}
