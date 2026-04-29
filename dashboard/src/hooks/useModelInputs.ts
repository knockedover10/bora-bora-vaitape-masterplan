import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * Editable model inputs (the 11 levers exposed in the Edit Inputs drawer).
 * The other anchors in `data/model.ts` (mgmt fees, phasing, ramp, defisc, etc.)
 * remain hard-coded — those are not user-tunable.
 */
export interface ModelInputs {
  totalDevCost: number;
  adrBase: number;
  occBase: number;
  opexRatio: number;
  capRate: number;
  discountRate: number; // for NPV "patient" headline
  holdYears: number;
  keys: number;
  noiGrowth: number;
  trevparUplift: number;
  ffeReserve: number;
}

export const DEFAULT_INPUTS: ModelInputs = {
  totalDevCost: 42_000_000,
  adrBase: 2_150,
  occBase: 0.65,
  opexRatio: 0.72,
  capRate: 0.065,
  discountRate: 0.07,
  holdYears: 12,
  keys: 35,
  noiGrowth: 0.03,
  trevparUplift: 0.35,
  ffeReserve: 0.03,
};

export interface InputMeta {
  key: keyof ModelInputs;
  label: string;
  group: "Programme & Cost" | "Revenue Drivers" | "Cost Structure" | "Valuation Assumptions";
  min: number;
  max: number;
  step: number;
  unit: "USD" | "%" | "years" | "keys";
  defaultValue: number;
}

export const INPUT_METAS: InputMeta[] = [
  { key: "totalDevCost", label: "Total Development Cost", group: "Programme & Cost", min: 25_000_000, max: 70_000_000, step: 500_000, unit: "USD", defaultValue: DEFAULT_INPUTS.totalDevCost },
  { key: "keys", label: "Number Of Keys", group: "Programme & Cost", min: 20, max: 80, step: 1, unit: "keys", defaultValue: DEFAULT_INPUTS.keys },
  { key: "ffeReserve", label: "Furniture, Fixtures And Equipment (FF&E) Reserve", group: "Programme & Cost", min: 0, max: 0.08, step: 0.005, unit: "%", defaultValue: DEFAULT_INPUTS.ffeReserve },

  { key: "adrBase", label: "Average Daily Rate (ADR) — Base", group: "Revenue Drivers", min: 1_500, max: 3_500, step: 25, unit: "USD", defaultValue: DEFAULT_INPUTS.adrBase },
  { key: "occBase", label: "Stabilised Occupancy — Base", group: "Revenue Drivers", min: 0.40, max: 0.85, step: 0.01, unit: "%", defaultValue: DEFAULT_INPUTS.occBase },
  { key: "trevparUplift", label: "Total Revenue Per Available Room (TRevPAR) Uplift", group: "Revenue Drivers", min: 0.10, max: 0.65, step: 0.05, unit: "%", defaultValue: DEFAULT_INPUTS.trevparUplift },

  { key: "opexRatio", label: "Operating Expense Ratio", group: "Cost Structure", min: 0.55, max: 0.85, step: 0.01, unit: "%", defaultValue: DEFAULT_INPUTS.opexRatio },

  { key: "capRate", label: "Capitalisation Rate (Going-In)", group: "Valuation Assumptions", min: 0.045, max: 0.095, step: 0.0025, unit: "%", defaultValue: DEFAULT_INPUTS.capRate },
  { key: "discountRate", label: "Discount Rate For Net Present Value (NPV)", group: "Valuation Assumptions", min: 0.05, max: 0.13, step: 0.0025, unit: "%", defaultValue: DEFAULT_INPUTS.discountRate },
  { key: "noiGrowth", label: "Annual Net Operating Income (NOI) Growth Rate", group: "Valuation Assumptions", min: 0, max: 0.06, step: 0.005, unit: "%", defaultValue: DEFAULT_INPUTS.noiGrowth },
  { key: "holdYears", label: "Hold Period", group: "Valuation Assumptions", min: 5, max: 20, step: 1, unit: "years", defaultValue: DEFAULT_INPUTS.holdYears },
];

const LOCAL_KEY = "vaitape-inputs-v1";
const HASH_PREFIX = "#i=";

function readHashOverride(): Partial<ModelInputs> | null {
  if (typeof window === "undefined") return null;
  const h = window.location.hash;
  if (!h.startsWith(HASH_PREFIX)) return null;
  try {
    const decoded = atob(decodeURIComponent(h.slice(HASH_PREFIX.length)));
    const parsed = JSON.parse(decoded);
    if (parsed && typeof parsed === "object") return parsed as Partial<ModelInputs>;
  } catch {
    return null;
  }
  return null;
}

function readLocalOverride(): Partial<ModelInputs> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as Partial<ModelInputs>;
  } catch {
    return null;
  }
  return null;
}

function diffFromDefaults(inputs: ModelInputs): Partial<ModelInputs> {
  const out: Partial<ModelInputs> = {};
  (Object.keys(DEFAULT_INPUTS) as Array<keyof ModelInputs>).forEach((k) => {
    if (inputs[k] !== DEFAULT_INPUTS[k]) {
      (out as Record<string, number>)[k] = inputs[k];
    }
  });
  return out;
}

function encodeHash(diff: Partial<ModelInputs>): string {
  if (Object.keys(diff).length === 0) return "";
  const json = JSON.stringify(diff);
  return HASH_PREFIX + encodeURIComponent(btoa(json));
}

export function useModelInputs() {
  const [inputs, setInputsState] = useState<ModelInputs>(() => {
    const hash = readHashOverride();
    const local = readLocalOverride();
    return { ...DEFAULT_INPUTS, ...(local ?? {}), ...(hash ?? {}) };
  });

  // Persist to localStorage + URL hash whenever inputs change
  useEffect(() => {
    if (typeof window === "undefined") return;
    const diff = diffFromDefaults(inputs);
    try {
      window.localStorage.setItem(LOCAL_KEY, JSON.stringify(diff));
    } catch {
      /* ignore */
    }
    const newHash = encodeHash(diff);
    if (newHash) {
      if (window.location.hash !== newHash) {
        history.replaceState(null, "", newHash);
      }
    } else if (window.location.hash.startsWith(HASH_PREFIX)) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, [inputs]);

  const setInput = useCallback(<K extends keyof ModelInputs>(key: K, value: ModelInputs[K]) => {
    setInputsState((p) => ({ ...p, [key]: value }));
  }, []);

  const resetAll = useCallback(() => setInputsState({ ...DEFAULT_INPUTS }), []);

  const resetOne = useCallback(<K extends keyof ModelInputs>(key: K) => {
    setInputsState((p) => ({ ...p, [key]: DEFAULT_INPUTS[key] }));
  }, []);

  const modifiedKeys = useMemo(() => {
    const set = new Set<keyof ModelInputs>();
    (Object.keys(DEFAULT_INPUTS) as Array<keyof ModelInputs>).forEach((k) => {
      if (inputs[k] !== DEFAULT_INPUTS[k]) set.add(k);
    });
    return set;
  }, [inputs]);

  const isModified = modifiedKeys.size > 0;

  const sharableUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const diff = diffFromDefaults(inputs);
    const hash = encodeHash(diff);
    return window.location.origin + window.location.pathname + window.location.search + hash;
  }, [inputs]);

  return { inputs, setInput, resetAll, resetOne, modifiedKeys, isModified, sharableUrl };
}
