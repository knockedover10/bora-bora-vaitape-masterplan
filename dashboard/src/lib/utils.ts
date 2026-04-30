import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const usdFine = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function fmtCurrency(
  n: number | null | undefined,
  opts?: { compact?: boolean; fine?: boolean; signed?: boolean }
) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  if (opts?.compact) {
    const abs = Math.abs(n);
    const sign = n < 0 ? "-" : opts?.signed ? "+" : "";
    if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
    if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}K`;
    return `${sign}$${Math.round(abs)}`;
  }
  return opts?.fine ? usdFine.format(n) : usd.format(n);
}

export function fmtPercent(n: number | null | undefined, decimals = 1) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return `${(n * 100).toFixed(decimals)}%`;
}

export function fmtBps(n: number | null | undefined) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  const bps = Math.round(n * 10000);
  return `${bps >= 0 ? "+" : ""}${bps} bps`;
}

export function fmtNumber(n: number | null | undefined, decimals = 0) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return n.toLocaleString("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
}
