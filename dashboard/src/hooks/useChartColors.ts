import { useEffect, useState } from "react";

/**
 * Resolves design-token CSS variables to concrete `hsl(...)` strings so they
 * can be passed as SVG `fill`/`stroke` attributes to Recharts.
 *
 * Recharts forwards `fill` directly to the SVG paint server, which on some
 * rasterisers (notably Playwright/headless screenshots) does not resolve
 * `var(--…)` references — leaving bars invisible. Concrete colour strings
 * always work.
 *
 * Re-reads on theme toggle (light/dark) by observing `data-theme` on <html>.
 */

const VARS = [
  "--accent",
  "--accent-soft",
  "--positive",
  "--negative",
  "--warning",
  "--foreground",
  "--muted-foreground",
  "--surface",
  "--surface-raised",
  "--border",
] as const;

type VarName = (typeof VARS)[number];

export type ChartColors = Record<VarName, string>;

function read(): ChartColors {
  const out = {} as ChartColors;
  if (typeof window === "undefined") {
    // Reasonable light-mode defaults for SSR-safe initial render.
    return {
      "--accent": "hsl(217, 33%, 35%)",
      "--accent-soft": "hsl(217, 33%, 92%)",
      "--positive": "hsl(145, 28%, 36%)",
      "--negative": "hsl(4, 50%, 45%)",
      "--warning": "hsl(35, 70%, 48%)",
      "--foreground": "hsl(220, 25%, 14%)",
      "--muted-foreground": "hsl(220, 10%, 45%)",
      "--surface": "hsl(0, 0%, 100%)",
      "--surface-raised": "hsl(40, 18%, 98%)",
      "--border": "hsl(220, 14%, 88%)",
    };
  }
  const styles = getComputedStyle(document.documentElement);
  for (const v of VARS) {
    const raw = styles.getPropertyValue(v).trim();
    out[v] = raw ? `hsl(${raw})` : "currentColor";
  }
  return out;
}

export function useChartColors(): ChartColors {
  const [colors, setColors] = useState<ChartColors>(() => read());

  useEffect(() => {
    setColors(read());
    const obs = new MutationObserver(() => setColors(read()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });
    return () => obs.disconnect();
  }, []);

  return colors;
}
