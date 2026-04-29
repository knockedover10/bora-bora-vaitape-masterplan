import { ExternalLink } from "lucide-react";
import { sources } from "@/data/model";

export function SourcesList() {
  const grouped = sources.reduce<Record<string, typeof sources>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="card-base p-6">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-[16px] font-semibold tracking-tight">Sources</h3>
        <span className="label-caps">{sources.length} references</span>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(grouped).map(([cat, items]) => (
          <section key={cat}>
            <h4 className="label-caps mb-2">{cat}</h4>
            <ul className="space-y-1.5 text-[13px]">
              {items.map((s) => (
                <li key={s.id} className="leading-snug">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-1.5 text-[hsl(var(--foreground))] hover:text-[hsl(var(--accent))] focus-ring rounded-sm"
                  >
                    <span className="num text-[hsl(var(--muted-foreground))] tabular-nums">
                      [{s.id.toString().padStart(2, "0")}]
                    </span>
                    <span>{s.ref}</span>
                    <ExternalLink
                      size={11}
                      className="mt-0.5 shrink-0 text-[hsl(var(--muted-foreground))]"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
