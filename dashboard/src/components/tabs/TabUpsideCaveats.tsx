import { Ban } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { DefiscPanel } from "@/components/DefiscPanel";
import { RicsPanel } from "@/components/RicsPanel";

export function TabUpsideCaveats() {
  const excluded = [
    {
      title: "KPMG 65% TRevPAR uplift",
      tag: "Excluded",
      tone: "danger" as const,
      reason:
        "Polynesia Consulting principal Henry Terou is also an advisor to KPMG — a connected-party concern. Independence-of-evidence rule (RICS Red Book Global Standards 2024) requires that primary income forecasts not depend on parties with potential conflicts. The applied 35% uplift uses STR Global ultra-luxury and JLL APAC benchmarks instead.",
      source: "RICS Red Book Global Standards 2024 · C.7 Independence",
    },
    {
      title: "20-year hold",
      tag: "Excluded",
      tone: "danger" as const,
      reason:
        "HVS Hotel Investment Analysis 12th ed. (2021) recommends 5-10 year hold horizons for hotel DCFs; 12 years is already a long hold. A 20-year horizon adds compounding forecast error without commensurate analytical value. The hold horizon is fixed at 12 years.",
      source: "HVS Hotel Investment Analysis 12th ed., 2021",
    },
    {
      title: "Leverage uplift",
      tag: "Not modelled",
      tone: "warning" as const,
      reason:
        "Unleveraged returns are the institutional standard for asset-quality assessment (Cambridge Associates, MSCI Real Estate). A leveraged returns view is the investor's responsibility once debt structure is decided; modelling here would conflate asset quality with capital-structure choices.",
      source: "Cambridge Associates · MSCI Real Estate Investment Index",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <DefiscPanel />

      <div className="card-base p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge tone="muted">
            <Ban size={11} />
            Excluded levers ledger
          </Badge>
          <span className="text-[13px] text-[hsl(var(--muted-foreground))]">
            Fully transparent — every excluded lever, the reason, and the source
          </span>
        </div>
        <div className="grid gap-4">
          {excluded.map((e) => (
            <div
              key={e.title}
              className="rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge tone={e.tone}>{e.tag}</Badge>
                <span className="text-[14.5px] font-semibold tracking-tight">{e.title}</span>
              </div>
              <p className="text-[13px] leading-relaxed">{e.reason}</p>
              <p className="mt-2 text-[11.5px] text-[hsl(var(--muted-foreground))]">
                Source: {e.source}
              </p>
            </div>
          ))}
        </div>
      </div>

      <RicsPanel />
    </div>
  );
}
