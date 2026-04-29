import {
  inputsTable,
  spaceProgramme,
  holdPeriodSensitivity,
  coherenceNotes,
  inputs,
} from "@/data/model";
import { fmtNumber, fmtPercent } from "@/lib/utils";
import { SourcesList } from "@/components/SourcesList";

export function TabAppendix() {
  // Group inputs
  const grouped = inputsTable.reduce<Record<string, typeof inputsTable>>((acc, row) => {
    (acc[row.group] ??= []).push(row);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">
      <div className="card-base p-5">
        <h3 className="mb-3 text-[16px] font-semibold tracking-tight">Inputs (read-only)</h3>
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
            Space programme — {fmtNumber(inputs.total_gfa)} sqm GFA
          </h3>
          <span className="text-[12px] text-[hsl(var(--muted-foreground))] num">
            Plot ratio {inputs.plot_ratio} · Site {fmtNumber(inputs.site_area_sqm)} sqm
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
            Hold-period sensitivity (5 / 8 / 10 / 12 — never 20)
          </h3>
          <span className="text-[12px] text-[hsl(var(--muted-foreground))]">
            HVS recommends 5-10 yrs; 12 is already a long hold
          </span>
        </div>
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full min-w-[480px] text-[13px] num">
            <thead>
              <tr className="text-left">
                <th className="px-3 py-2 label-caps">Hold (years)</th>
                <th className="px-3 py-2 label-caps text-right">Base IRR</th>
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
        <h3 className="mb-3 text-[16px] font-semibold tracking-tight">Coherence audit</h3>
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

      <SourcesList />
    </div>
  );
}
