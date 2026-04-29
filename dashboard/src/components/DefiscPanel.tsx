import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { fmtCurrency, fmtPercent } from "@/lib/utils";
import { inputs } from "@/data/model";

export function DefiscPanel() {
  const theoretical = inputs.defisc_rate * inputs.total_dev_cost;            // 25% × $42M = $10.5M
  const capUsd = inputs.defisc_cap_xpf / inputs.fx_xpf_usd;                  // ≈ $4.184M
  const effective = inputs.defisc_effective;                                 // $4,184,100.42
  const baseDevYield = 0.11339245125;
  const baseDevYieldWithDefisc = 4_762_482.9525 / (inputs.total_dev_cost - effective);

  return (
    <div className="card-base overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-[hsl(var(--border))] bg-[hsl(var(--accent))/8%] px-6 py-4">
        <Badge tone="accent">
          <Sparkles size={11} />
          Upside Lever
        </Badge>
        <span className="text-[13px] font-medium text-[hsl(var(--accent))]">
          Held In Reserve — NOT In Base Case
        </span>
      </div>

      <div className="grid gap-6 p-6 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-[16px] font-semibold tracking-tight">
            Defiscalisation (Defisc) — Polynesian Tax Credit
          </h3>
          <p className="text-[13px] text-[hsl(var(--muted-foreground))]">
            French Polynesia's investment defiscalisation regime (Loi de Pays n° 2017-3)
            offers a 25% credit on qualifying Capital Expenditure (CapEx), capped at
            Cours Pacifique Franc (XPF) 500M. The cap binds for this asset.
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-y-3 text-[13px]">
            <dt className="label-caps">Theoretical 25% Rate</dt>
            <dd className="num text-right font-semibold">
              {fmtCurrency(theoretical, { compact: true })}
            </dd>
            <dt className="label-caps">XPF 500M Cap (÷ {inputs.fx_xpf_usd})</dt>
            <dd className="num text-right font-semibold">
              {fmtCurrency(capUsd, { compact: true })}
            </dd>
            <dt className="label-caps">Effective Credit Applied</dt>
            <dd className="num text-right font-semibold text-[hsl(var(--accent))]">
              {fmtCurrency(effective)}
            </dd>
          </dl>
        </div>

        <div>
          <h3 className="mb-2 text-[16px] font-semibold tracking-tight">
            Bridge — Base Development Yield
          </h3>
          <p className="text-[13px] text-[hsl(var(--muted-foreground))]">
            With Defisc, effective development cost falls to ${(inputs.total_dev_cost - effective).toLocaleString()}.
            Base Net Operating Income (NOI) Is Unchanged — Yield Rises Mechanically.
          </p>

          <div className="mt-5 flex items-center gap-4 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4">
            <div className="flex-1 text-center">
              <div className="label-caps">Without Defisc</div>
              <div className="num text-2xl font-semibold">
                {fmtPercent(baseDevYield, 2)}
              </div>
            </div>
            <ArrowRight size={20} className="text-[hsl(var(--accent))]" />
            <div className="flex-1 text-center">
              <div className="label-caps">With Defisc</div>
              <div className="num text-2xl font-semibold text-[hsl(var(--accent))]">
                {fmtPercent(baseDevYieldWithDefisc, 2)}
              </div>
            </div>
          </div>

          <p className="mt-3 text-[11.5px] text-[hsl(var(--muted-foreground))]">
            +{((baseDevYieldWithDefisc - baseDevYield) * 100).toFixed(2)} Percentage Points Uplift On
            Development Yield. Internal Rate of Return (IRR) Uplift ≈ +60–80 Basis Points (12-Year Unleveraged).
          </p>
        </div>
      </div>
    </div>
  );
}
