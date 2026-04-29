import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function RicsPanel() {
  return (
    <div className="card-base p-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge tone="accent">
          <ShieldCheck size={11} />
          C.7 Independence
        </Badge>
        <span className="text-[13px] font-medium">RICS Red Book Global Standards 2024</span>
      </div>
      <p className="text-[14px] leading-relaxed text-[hsl(var(--foreground))]">
        Valuation prepared on an independent basis per RICS Red Book Global Standards 2024.
        The KPMG report for this site is <span className="font-semibold">not relied upon</span>{" "}
        for income forecasts due to Henry Terou's dual role as principal of Polynesia
        Consulting and as advisor to KPMG — a connected-party concern under the
        independence-of-evidence rule. The applied TRevPAR uplift of{" "}
        <span className="font-semibold">35%</span> reflects independent STR Global ultra-luxury
        benchmarks and JLL APAC observations; the KPMG <span className="font-semibold">65%</span>{" "}
        figure is excluded from the base case.
      </p>
      <ul className="mt-4 grid gap-2 text-[13px] text-[hsl(var(--muted-foreground))]">
        <li>• Valuer registration: RICS Valuer Registration Scheme.</li>
        <li>• Methodology: HVS Income-Capitalisation, 12-yr unleveraged DCF, Gordon exit at 6.5% cap.</li>
        <li>• Connected-party disclosure: KPMG report retained as a contextual reference only.</li>
      </ul>
    </div>
  );
}
