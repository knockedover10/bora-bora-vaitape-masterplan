import { Sheet } from "@/components/ui/Sheet";
import { Slider } from "@/components/ui/Slider";
import { Switch } from "@/components/ui/Switch";
import { fmtCurrency, fmtPercent } from "@/lib/utils";
import { computeScenario } from "@/lib/calc";
import type { CustomEdit } from "@/hooks/useScenarios";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  customs: Record<"customA" | "customB" | "customC", CustomEdit>;
  updateCustom: (k: "customA" | "customB" | "customC", patch: Partial<CustomEdit>) => void;
  toggleActive: (k: "customA" | "customB" | "customC") => void;
}

const labels = { customA: "Custom A", customB: "Custom B", customC: "Custom C" };

export function ScenarioEditor({ open, onOpenChange, customs, updateCustom, toggleActive }: Props) {
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title="Edit custom scenarios"
      description="Override ADR shift, Occupancy and TRevPAR uplift for each Custom slot. Toggle a slot on to include it in the dashboard."
    >
      <div className="flex flex-col gap-6">
        {(["customA", "customB", "customC"] as const).map((k) => {
          const c = customs[k];
          const computed = computeScenario({
            adrShift: c.adrShift,
            occupancy: c.occ,
            trevparUplift: c.trevpar,
          });
          return (
            <div key={k} className="card-base p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-[15px] font-semibold tracking-tight">{labels[k]}</div>
                <div className="flex items-center gap-2 text-[12px] text-[hsl(var(--muted-foreground))]">
                  Active
                  <Switch
                    checked={c.active}
                    onCheckedChange={() => toggleActive(k)}
                    ariaLabel={`Activate ${labels[k]}`}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Field
                  label="ADR shift"
                  value={fmtPercent(c.adrShift, 0)}
                >
                  <Slider
                    min={-0.25}
                    max={0.25}
                    step={0.01}
                    value={c.adrShift}
                    onChange={(v) => updateCustom(k, { adrShift: v })}
                    ariaLabel="ADR shift"
                  />
                </Field>
                <Field
                  label="Occupancy"
                  value={fmtPercent(c.occ, 0)}
                >
                  <Slider
                    min={0.3}
                    max={0.85}
                    step={0.01}
                    value={c.occ}
                    onChange={(v) => updateCustom(k, { occ: v })}
                    ariaLabel="Occupancy"
                  />
                </Field>
                <Field
                  label="TRevPAR uplift"
                  value={fmtPercent(c.trevpar, 0)}
                >
                  <Slider
                    min={0.15}
                    max={0.55}
                    step={0.01}
                    value={c.trevpar}
                    onChange={(v) => updateCustom(k, { trevpar: v })}
                    ariaLabel="TRevPAR uplift"
                  />
                </Field>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-3 text-[12.5px]">
                <Stat label="ADR" value={fmtCurrency(computed.adr)} />
                <Stat label="RevPAR" value={fmtCurrency(computed.revpar)} />
                <Stat label="Total Revenue" value={fmtCurrency(computed.totalRevenue, { compact: true })} />
                <Stat label="NOI" value={fmtCurrency(computed.noi, { compact: true })} />
                <Stat label="Asset Value" value={fmtCurrency(computed.assetValue, { compact: true })} />
                <Stat label="Dev Yield" value={fmtPercent(computed.devYield, 2)} />
              </dl>
            </div>
          );
        })}
      </div>
    </Sheet>
  );
}

function Field({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="label-caps">{label}</span>
        <span className="text-[13px] num font-semibold">{value}</span>
      </div>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="label-caps">{label}</dt>
      <dd className="num text-[14px] font-semibold">{value}</dd>
    </div>
  );
}
