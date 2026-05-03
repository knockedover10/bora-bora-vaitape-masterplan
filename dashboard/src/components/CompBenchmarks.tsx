/**
 * CompBenchmarks — luxury / ultra-luxury island resort competitive set.
 *
 * Tier 1: Bora Bora incumbents (published ADR ranges)
 * Tier 2: French Polynesia regional (Tetiaroa, Taha'a)
 * Tier 3: Global ultra-luxury island benchmarks for the 35-key tier
 *
 * Tier 1 ADRs match the source-deck published ranges (low-season lead-in to
 * peak-season top suite). Tier 2 and 3 use the same range convention.
 * Citations link to original rate sheets, agent partner sites, and travel
 * publications. URLs are inline so the user can audit each figure.
 */
export function CompBenchmarks() {
  return (
    <div className="card-base p-5">
      <div className="mb-3">
        <h3 className="text-[16px] font-semibold tracking-tight">
          Average Daily Rate (ADR) Benchmark — Comparable Set
        </h3>
        <p className="mt-1 text-[13px] text-[hsl(var(--muted-foreground))]">
          Published ADR ranges (low-season lead-in to peak-season top suite).
          Sourced from rate cards, partner agent sites and travel-press reviews.
          Tier 1 anchors local pricing; Tier 3 sets the ceiling for true 35-key
          ultra-luxury pricing power.
        </p>
      </div>

      <div className="-mx-2 overflow-x-auto">
        <table className="w-full min-w-[840px] text-[13px]">
          <thead>
            <tr className="text-left">
              <th className="px-3 py-2 label-caps">Property</th>
              <th className="px-3 py-2 label-caps">Location</th>
              <th className="px-3 py-2 label-caps text-right">Keys</th>
              <th className="px-3 py-2 label-caps">Density Tier</th>
              <th className="px-3 py-2 label-caps text-right">ADR (USD)</th>
              <th className="px-3 py-2 label-caps">Source</th>
            </tr>
          </thead>
          <tbody>
            {/* Tier 1 — Bora Bora incumbents */}
            <tr className="bg-[hsl(var(--surface))]">
              <td colSpan={6} className="px-3 py-1.5 label-caps text-[hsl(var(--muted-foreground))]">
                Bora Bora Incumbents
              </td>
            </tr>
            <CompRow
              property="Conrad Bora Bora Nui"
              location="Bora Bora (Motu Toopua)"
              keys={114}
              density="Very High"
              adr="$1,200–4,000+"
              source={{ name: "Hotels.com", url: "https://www.hotels.com/ho645426/conrad-bora-bora-nui-bora-bora-french-polynesia/" }}
            />
            <CompRow
              property="Four Seasons Bora Bora"
              location="Bora Bora (Motu Tehotu)"
              keys={100}
              density="High"
              adr="$1,800–6,000+"
              source={{ name: "fourseasons.com", url: "https://www.fourseasons.com/borabora/accommodations/" }}
            />
            <CompRow
              property="St. Regis Bora Bora"
              location="Bora Bora (Motu Ome'e)"
              keys={90}
              density="High"
              adr="$1,200–8,000+"
              source={{ name: "ILX Travel rate sheet", url: "https://www.ilxtravel.com/st-regis-bora-bora-prices/" }}
            />
            <CompRow
              property="InterContinental Thalasso"
              location="Bora Bora (Motu Piti Aau)"
              keys={84}
              density="High"
              adr="$700–2,000"
              source={{ name: "thalasso.intercontinental.com", url: "https://thalasso.intercontinental.com/overwater-villas-suites" }}
            />
            <CompRow
              property="Le Bora Bora by Pearl Resorts"
              location="Bora Bora (Motu Tevairoa)"
              keys={108}
              density="Very High"
              adr="$1,300–2,500"
              source={{ name: "Kayak", url: "https://www.kayak.com/Vaitape-Hotels-Le-Bora-Bora-by-Pearl-Resorts.286970.ksp" }}
            />

            {/* Tier 2 — French Polynesia regional */}
            <tr className="bg-[hsl(var(--surface))]">
              <td colSpan={6} className="px-3 py-1.5 label-caps text-[hsl(var(--muted-foreground))]">
                French Polynesia Regional
              </td>
            </tr>
            <CompRow
              property="The Brando"
              location="Tetiaroa Atoll"
              keys={35}
              density="Very Low"
              adr="$4,800–5,800+"
              source={{ name: "Brando 2025-26 rate card", url: "https://www.calameo.com/books/004500545ad47cb15cb60" }}
              highlight
            />
            <CompRow
              property="Le Taha'a by Pearl"
              location="Taha'a (Motu Tautau)"
              keys={60}
              density="Low"
              adr="$1,300–4,100+"
              source={{ name: "Moana Voyages", url: "https://www.moanavoyages.com/en/hotels/le-tahaa-by-pearl-resorts/" }}
            />

            {/* Tier 3 — Global ultra-luxury 35-key tier */}
            <tr className="bg-[hsl(var(--surface))]">
              <td colSpan={6} className="px-3 py-1.5 label-caps text-[hsl(var(--muted-foreground))]">
                Global Ultra-Luxury Island Benchmarks (Sub-50-Key Tier)
              </td>
            </tr>
            <CompRow
              property="North Island"
              location="Seychelles"
              keys={11}
              density="Very Low"
              adr="$11,500"
              source={{ name: "Dorsia Travel", url: "https://dorsiatravel.com/north-island-returning-to-all-inclusive/" }}
            />
            <CompRow
              property="Amanyara"
              location="Turks & Caicos"
              keys={38}
              density="Very Low"
              adr="$3,104–5,592"
              source={{ name: "Kayak", url: "https://www.kayak.com/Providenciales-Hotels-Amanyara.180651.ksp" }}
            />
            <CompRow
              property="Cheval Blanc Randheli"
              location="Maldives (Noonu Atoll)"
              keys={45}
              density="Low"
              adr="$2,456–4,875"
              source={{ name: "Kayak", url: "https://www.kayak.com/Randheli-Hotels-Cheval-Blanc-Randheli.733386.ksp" }}
            />
            <CompRow
              property="Soneva Jani"
              location="Maldives (Noonu Atoll)"
              keys={59}
              density="Low"
              adr="$2,259–2,664"
              source={{ name: "PrivateUpgrades", url: "https://www.privateupgrades.com/maldives/soneva-jani-hotel-noonu-atoll" }}
            />
            <CompRow
              property="Necker Island"
              location="British Virgin Islands"
              keys={20}
              density="Very Low"
              adr="$5,000–8,000"
              source={{ name: "Head for Points", url: "https://www.headforpoints.com/2023/05/07/review-necker-island-british-virgin-islands/" }}
            />
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-md border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--surface-alt))] p-3 text-[12.5px] leading-relaxed text-[hsl(var(--muted-foreground))]">
        <span className="font-semibold text-[hsl(var(--foreground))]">
          Scenario calibration:
        </span>{" "}
        Vaitape (35-key, sustainable, town-adjacent) is benchmarked against The
        Brando peak-season rates with an accessibility discount applied for the
        off-motu town location.{" "}
        <span className="font-semibold text-[hsl(var(--foreground))]">Base</span>{" "}
        ADR is anchored at $4,200, sitting below Amanyara's blended high-season
        rate and well below Necker / North Island.{" "}
        <span className="font-semibold text-[hsl(var(--foreground))]">Upside</span>{" "}
        ADR of $5,000 mirrors The Brando high-season top range; the{" "}
        <span className="font-semibold text-[hsl(var(--foreground))]">Stress</span>{" "}
        ADR of $3,000 floors the model at the Conrad Bora Bora Nui Premium
        Suite tier. See the{" "}
        <a
          href="https://www.linkedin.com/posts/jpfelix_a-50-key-ultra-luxury-resort-is-a-better-activity-7446829085814611970-bsS6"
          className="underline decoration-dotted underline-offset-2 hover:text-[hsl(var(--foreground))]"
          target="_blank"
          rel="noopener noreferrer"
        >
          industry note
        </a>{" "}
        on sub-50-key pricing dynamics for further context.
      </div>
    </div>
  );
}

interface CompRowProps {
  property: string;
  location: string;
  keys: number;
  density: "Very Low" | "Low" | "Medium" | "High" | "Very High";
  adr: string;
  source: { name: string; url: string };
  highlight?: boolean;
}

function CompRow({ property, location, keys, density, adr, source, highlight }: CompRowProps) {
  return (
    <tr
      className={`border-t border-[hsl(var(--border))] ${
        highlight ? "bg-[hsl(var(--accent-soft)/30%)]" : ""
      }`}
    >
      <td className="px-3 py-2.5 font-semibold">{property}</td>
      <td className="px-3 py-2.5 text-[hsl(var(--muted-foreground))]">{location}</td>
      <td className="px-3 py-2.5 text-right num">{keys}</td>
      <td className="px-3 py-2.5">
        <DensityChip tier={density} />
      </td>
      <td className="px-3 py-2.5 text-right num font-semibold">{adr}</td>
      <td className="px-3 py-2.5">
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12.5px] text-[hsl(var(--primary))] underline decoration-dotted underline-offset-2 hover:opacity-80"
        >
          {source.name}
        </a>
      </td>
    </tr>
  );
}

function DensityChip({ tier }: { tier: "Very Low" | "Low" | "Medium" | "High" | "Very High" }) {
  const palette: Record<typeof tier, { bg: string; fg: string }> = {
    "Very Low": { bg: "hsl(var(--success)/20%)", fg: "hsl(var(--success))" },
    "Low": { bg: "hsl(var(--success)/12%)", fg: "hsl(var(--success))" },
    "Medium": { bg: "hsl(var(--muted)/40%)", fg: "hsl(var(--muted-foreground))" },
    "High": { bg: "hsl(var(--warning)/15%)", fg: "hsl(var(--warning))" },
    "Very High": { bg: "hsl(var(--danger)/15%)", fg: "hsl(var(--danger))" },
  };
  const c = palette[tier];
  return (
    <span
      className="inline-flex rounded-full px-2 py-0.5 text-[11.5px] font-medium"
      style={{ backgroundColor: c.bg, color: c.fg }}
    >
      {tier}
    </span>
  );
}
