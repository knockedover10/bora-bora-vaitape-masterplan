import { useState } from "react";
import { RotateCcw, Link2, Check } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { cn, fmtCurrency, fmtPercent, fmtNumber } from "@/lib/utils";
import {
  INPUT_METAS,
  type ModelInputs,
  type InputMeta,
} from "@/hooks/useModelInputs";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  inputs: ModelInputs;
  setInput: <K extends keyof ModelInputs>(key: K, value: ModelInputs[K]) => void;
  resetAll: () => void;
  resetOne: <K extends keyof ModelInputs>(key: K) => void;
  modifiedKeys: Set<keyof ModelInputs>;
  sharableUrl: string;
}

const GROUP_ORDER: InputMeta["group"][] = [
  "Programme & Cost",
  "Revenue Drivers",
  "Cost Structure",
  "Valuation Assumptions",
];

function fmtInputValue(meta: InputMeta, v: number): string {
  if (meta.unit === "USD") {
    if (meta.key === "totalDevCost") return fmtCurrency(v, { compact: true });
    return fmtCurrency(v);
  }
  if (meta.unit === "%") return fmtPercent(v, 2);
  if (meta.unit === "years") return `${v} years`;
  if (meta.unit === "keys") return `${fmtNumber(v)} keys`;
  return String(v);
}

export function EditInputsDrawer({
  open,
  onOpenChange,
  inputs,
  setInput,
  resetAll,
  resetOne,
  modifiedKeys,
  sharableUrl,
}: Props) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(sharableUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      });
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Model Inputs"
      description="Override the 11 core levers. Changes recalculate every scenario, gate, KPI, and chart live."
    >
      <div className="flex flex-col gap-6">
        {GROUP_ORDER.map((group) => {
          const metas = INPUT_METAS.filter((m) => m.group === group);
          return (
            <section key={group} className="card-base p-5">
              <h3 className="mb-4 text-[14px] font-semibold tracking-tight">{group}</h3>
              <div className="flex flex-col gap-5">
                {metas.map((meta) => (
                  <InputRow
                    key={meta.key}
                    meta={meta}
                    value={inputs[meta.key] as number}
                    onChange={(v) => setInput(meta.key, v as ModelInputs[typeof meta.key])}
                    onReset={() => resetOne(meta.key)}
                    modified={modifiedKeys.has(meta.key)}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* Footer actions */}
        <div className="sticky bottom-0 -mx-6 mt-2 flex flex-col gap-2 border-t border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-6 py-4 sm:flex-row">
          <Button variant="outline" size="sm" onClick={resetAll} className="flex-1">
            <RotateCcw size={14} />
            Reset All To Defaults
          </Button>
          <Button variant="default" size="sm" onClick={copyLink} className="flex-1">
            {copied ? <Check size={14} /> : <Link2 size={14} />}
            {copied ? "Link Copied" : "Copy Shareable Link"}
          </Button>
        </div>
      </div>
    </Sheet>
  );
}

function InputRow({
  meta,
  value,
  onChange,
  onReset,
  modified,
}: {
  meta: InputMeta;
  value: number;
  onChange: (v: number) => void;
  onReset: () => void;
  modified: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-md p-3 transition-colors",
        modified
          ? "border-l-4 border-l-[hsl(var(--warning))] bg-[hsl(var(--warning)/8%)]"
          : "border-l-4 border-l-transparent"
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {modified && (
            <span
              className="inline-block h-2 w-2 shrink-0 rounded-full bg-[hsl(var(--warning))]"
              aria-label="Modified"
            />
          )}
          <span className="text-[12.5px] font-medium leading-tight">{meta.label}</span>
        </div>
        <div className="flex items-center gap-2">
          {modified && (
            <span className="rounded-full bg-[hsl(var(--warning)/15%)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--warning))]">
              Modified
            </span>
          )}
          <button
            type="button"
            onClick={onReset}
            disabled={!modified}
            aria-label={`Reset ${meta.label}`}
            className={cn(
              "rounded-md p-1 transition-colors focus-ring",
              modified
                ? "text-[hsl(var(--warning))] hover:bg-[hsl(var(--warning)/15%)]"
                : "text-[hsl(var(--muted-foreground))] opacity-40 cursor-not-allowed"
            )}
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <span className="num text-[15px] font-semibold tracking-tight">
          {fmtInputValue(meta, value)}
        </span>
        <span className="text-[10.5px] text-[hsl(var(--muted-foreground))] num">
          {fmtInputValue(meta, meta.min)} – {fmtInputValue(meta, meta.max)}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Slider
          min={meta.min}
          max={meta.max}
          step={meta.step}
          value={value}
          onChange={onChange}
          ariaLabel={meta.label}
          className="flex-1"
        />
        <input
          type="number"
          min={meta.min}
          max={meta.max}
          step={meta.step}
          value={value}
          onChange={(e) => {
            const n = parseFloat(e.target.value);
            if (Number.isFinite(n)) onChange(n);
          }}
          className="w-24 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--surface-raised))] px-2 py-1 text-right text-[12px] num focus-ring"
          aria-label={`${meta.label} numeric input`}
        />
      </div>
    </div>
  );
}
