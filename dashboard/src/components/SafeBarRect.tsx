import * as React from "react";

/**
 * Recharts uses <path> elements with negative widths for negative-value bars
 * (and for any bar in a layout where the path goes "leftward"). Some headless
 * rasterisers (notably Playwright/Chromium screenshot mode) fail to fill these
 * paths even though the geometry is valid. Replacing with a plain <rect> using
 * absolute x/width fixes this reliably.
 *
 * Pass via: <Bar shape={(p) => <SafeBarRect {...p} />} />
 */
export function SafeBarRect(props: any) {
  const { x = 0, y = 0, width = 0, height = 0, fill, radius } = props;
  const w = Math.abs(width);
  const h = Math.abs(height);
  if (w === 0 || h === 0) return null;
  const rx = width < 0 ? x + width : x;
  const ry = height < 0 ? y + height : y;

  // Support a uniform corner radius if provided (number) or top-only radius array
  let r = 0;
  if (typeof radius === "number") r = radius;
  else if (Array.isArray(radius)) r = Math.max(...radius.map((v) => Number(v) || 0));
  r = Math.min(r, w / 2, h / 2);

  return (
    <rect
      x={rx}
      y={ry}
      width={w}
      height={h}
      rx={r || undefined}
      ry={r || undefined}
      fill={fill}
    />
  );
}
