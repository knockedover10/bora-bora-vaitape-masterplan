import { Ban } from "lucide-react";
import {
  inputsTable,
  spaceProgramme,
  holdPeriodSensitivity,
  coherenceNotes,
  inputs,
} from "@/data/model";
import { fmtNumber, fmtPercent } from "@/lib/utils";
import { SourcesList } from "@/components/SourcesList";
import { Badge } from "@/components/ui/Badge";
import { DefiscPanel } from "@/components/DefiscPanel";
import { RicsPanel } from "@/components/RicsPanel";
import { CompBenchmarks } from "@/components/CompBenchmarks";

function RenovationCycleCard() {
  const rows = [
    {
      label: "Upside",
      cycle: "10 Years",
      pct: "10% Of Build Cost",
      rationale:
        "Brand maintained at high level on a longer cycle; first major refurbishment lands outside the 10-year hold horizon, so the dip never appears in the chart.",
    },
    {
      label: "Base",
      cycle: "8 Years",
      pct: "12% Of Build Cost",
      rationale:
        "Industry-convention midpoint per the HVS Hotel Investment Analysis 12th edition (2021) and RICS Red Book Global Standards 2024 — typical refurbishment intensity for ultra-luxury overwater resorts. Drives the visible Year 8 dip in the cash flow chart.",
    },
    {
      label: "Stress",
      cycle: "7 Years",
      pct: "14% Of Build Cost",
      rationale:
        "Faster wear and higher remediation cost reflecting cyclone-zone exposure and a more cautious operator stance. Refurbishment lands inside the hold period and reduces terminal value.",
    },
  ];

  return (
    <div className="card-base p-5">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-[16px] font-semibold tracking-tight">
          Renovation Cycle — Why The Cash Flow Chart Dips
        </h3>
        <span className="text-[12px] text-[hsl(var(--muted-foreground))]">
          HVS 7–10 Year Convention · Per-Scenario Input
        </span>
      </div>
      <p className="mb-3 text-[13.5px] leading-relaxed">
        Ultra-luxury hotels do not maintain peak rate and occupancy without periodic
        soft-goods and case-goods refurbishment. The HVS Hotel Investment Analysis
        12th edition (2021) and the RICS Red Book Global Standards 2024 both treat
        a 7–10 year refurbishment cycle as the institutional norm; Aman, Four
        Seasons and Cheval Blanc precedent across French Polynesia and the
        Maldives confirms refurbishment capex of 10–15% of original build cost as
        typical for overwater resort product. The chart dip in Year 8 (Base) and
        Year 7 (Stress) is this scheduled refurbishment capex hitting the operating
        cash flow.
      </p>
      <div className="-mx-2 overflow-x-auto">
        <table className="w-full min-w-[560px] text-[13px] num">
          <thead>
            <tr className="text-left">
              <th className="px-3 py-2 label-caps">Scenario</th>
              <th className="px-3 py-2 label-caps text-right">Cycle</th>
              <th className="px-3 py-2 label-caps text-right">Capex Intensity</th>
              <th className="px-3 py-2 label-caps">Rationale</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-t border-[hsl(var(--border))]">
                <td className="px-3 py-2.5 font-medium">{r.label}</td>
                <td className="px-3 py-2.5 text-right font-semibold">{r.cycle}</td>
                <td className="px-3 py-2.5 text-right font-semibold">{r.pct}</td>
                <td className="px-3 py-2.5 text-[hsl(var(--muted-foreground))] text-[12.5px] leading-relaxed">
                  {r.rationale}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[11.5px] text-[hsl(var(--muted-foreground))]">
        Sources: HVS Hotel Investment Analysis, 12th edition (2021) · RICS Red
        Book Global Standards 2024 · ISHC Capital Expenditures in the Hotel
        Industry, 5th edition. Per-scenario values are driven from the OPERATING
        SCENARIO SWITCHER block in Hotel_DCF_Sensitivity_Model_v2.xlsx (Inputs
        sheet, rows 45–51) and exported to scenarios.json.
      </p>
    </div>
  );
}

export function TabAppendix() {
  // Group inputs
  const grouped = inputsTable.reduce<Record<string, typeof inputsTable>>((acc, row) => {
    (acc[row.group] ??= []).push(row);
    return acc;
  }, {});

  const excluded = [
    {
      title: "KPMG 65% Total Revenue per Available Room (TRevPAR) Uplift",
      tag: "Excluded",
      tone: "danger" as const,
      reason:
        "Polynesia Consulting principal Henry Terou is also an advisor to KPMG — a connected-party concern. Independence-of-evidence rule (RICS Red Book Global Standards 2024) requires that primary income forecasts not depend on parties with potential conflicts. The applied 35% uplift uses STR Global ultra-luxury and JLL APAC benchmarks instead.",
      source: "RICS Red Book Global Standards 2024 · C.7 Independence",
    },
    {
      title: "20-Year Hold",
      tag: "Excluded",
      tone: "danger" as const,
      reason:
        "HVS Hotel Investment Analysis 12th ed. (2021) recommends 5-10 year hold horizons for hotel Discounted Cash Flows (DCFs); 12 years is already a long hold. A 20-year horizon adds compounding forecast error without commensurate analytical value. The hold horizon is fixed at 12 years.",
      source: "HVS Hotel Investment Analysis 12th ed., 2021",
    },
    {
      title: "Leverage Uplift",
      tag: "Not Modelled",
      tone: "warning" as const,
      reason:
        "Unleveraged returns are the institutional standard for asset-quality assessment (Cambridge Associates, MSCI Real Estate). A leveraged returns view is the investor's responsibility once debt structure is decided; modelling here would conflate asset quality with capital-structure choices.",
      source: "Cambridge Associates · MSCI Real Estate Investment Index",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* === Upside Levers & Caveats (moved from former tab) === */}
      <div className="card-base p-5">
        <h3 className="text-[16px] font-semibold tracking-tight">Upside Levers & Caveats</h3>
        <p className="mt-1 text-[13px] text-[hsl(var(--muted-foreground))]">
          Upside levers held in reserve and excluded items disclosed for transparency.
        </p>
      </div>

      <DefiscPanel />

      <div className="card-base p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge tone="muted">
            <Ban size={11} />
            Excluded Levers Ledger
          </Badge>
          <span className="text-[13px] text-[hsl(var(--muted-foreground))]">
            Fully Transparent — Every Excluded Lever, The Reason, And The Source
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

      {/* === Inputs (read-only) === */}
      <div className="card-base p-5">
        <h3 className="mb-3 text-[16px] font-semibold tracking-tight">Inputs (Read-Only)</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {Object.entries(grouped).map(([group, rows]) => (
            <section key={group}>
              <h4 className="label-caps mb-2">{group}</h4>
              <table className="w-full text-[12.5px] num">
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-t border-[hsl(var(--border))]">
                      <td className="py-1.5 pr-2">{r.label}</td>
                      <td className="py-1.5 text-right font-semibold">{r.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}
        </div>
      </div>

      <div className="card-base p-5">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-[16px] font-semibold tracking-tight">
            Space Programme — {fmtNumber(inputs.total_gfa)} sqm Gross Floor Area (GFA)
          </h3>
          <span className="text-[12px] text-[hsl(var(--muted-foreground))] num">
            Plot Ratio {inputs.plot_ratio} · Site {fmtNumber(inputs.site_area_sqm)} sqm
          </span>
        </div>
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full min-w-[480px] text-[13px] num">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2 label-caps">Zone</th>
                <th className="px-3 py-2 label-caps text-right">sqm</th>
                <th className="px-3 py-2 label-caps text-right">Share</th>
                <th className="px-3 py-2 label-caps">Notes</th>
              </tr>
            </thead>
            <tbody>
              {spaceProgramme.map((r) => (
                <tr key={r.zone} className="border-t border-[hsl(var(--border))]">
                  <td className="px-3 py-2 font-medium">{r.zone}</td>
                  <td className="px-3 py-2 text-right">{fmtNumber(r.sqm)}</td>
                  <td className="px-3 py-2 text-right">{fmtPercent(r.share, 1)}</td>
                  <td className="px-3 py-2 text-[hsl(var(--muted-foreground))]">{r.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-base p-5">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-[16px] font-semibold tracking-tight">
            Hold-Period Sensitivity (5 / 8 / 10 / 12 — Never 20)
          </h3>
          <span className="text-[12px] text-[hsl(var(--muted-foreground))]">
            HVS Recommends 5–10 Years; 12 Is Already A Long Hold
          </span>
        </div>
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full min-w-[480px] text-[13px] num">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2 label-caps">Hold (Years)</th>
                <th className="px-3 py-2 label-caps text-right">Base Internal Rate of Return (IRR)</th>
                <th className="px-3 py-2 label-caps text-right">Stress IRR</th>
                <th className="px-3 py-2 label-caps">Note</th>
              </tr>
            </thead>
            <tbody>
              {holdPeriodSensitivity.map((r) => (
                <tr key={r.hold} className="border-t border-[hsl(var(--border))]">
                  <td className="px-3 py-2 font-medium">{r.hold}</td>
                  <td className="px-3 py-2 text-right">{fmtPercent(r.baseIrr, 2)}</td>
                  <td className="px-3 py-2 text-right">{fmtPercent(r.stressIrr, 2)}</td>
                  <td className="px-3 py-2 text-[hsl(var(--muted-foreground))]">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-base p-5">
        <h3 className="mb-3 text-[16px] font-semibold tracking-tight">Coherence Audit</h3>
        <ul className="grid gap-2 text-[13px] leading-relaxed">
          {coherenceNotes.map((n, i) => (
            <li key={i} className="flex gap-3">
              <span className="num shrink-0 text-[hsl(var(--muted-foreground))]">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <span>{n}</span>
            </li>
          ))}
        </ul>
      </div>

      <RenovationCycleCard />

      <CompBenchmarks />

      <SourcesList />
    </div>
  );
}
