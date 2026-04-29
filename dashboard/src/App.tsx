import { useState } from "react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { ScenarioBar } from "@/components/ScenarioBar";
import { ScenarioEditor } from "@/components/ScenarioEditor";
import { TabVerdict } from "@/components/tabs/TabVerdict";
import { TabBuildUp } from "@/components/tabs/TabBuildUp";
import { TabReturns } from "@/components/tabs/TabReturns";
import { TabSensitivities } from "@/components/tabs/TabSensitivities";
import { TabUpsideCaveats } from "@/components/tabs/TabUpsideCaveats";
import { TabAppendix } from "@/components/tabs/TabAppendix";
import { useScenarios } from "@/hooks/useScenarios";
import { useTheme } from "@/hooks/useTheme";

type TabId = "verdict" | "buildup" | "returns" | "sensitivities" | "upside" | "appendix";

const TABS: { id: TabId; label: string; short: string }[] = [
  { id: "verdict", label: "Verdict", short: "Verdict" },
  { id: "buildup", label: "Build-up", short: "Build-up" },
  { id: "returns", label: "Returns & DCF", short: "Returns" },
  { id: "sensitivities", label: "Sensitivities", short: "Sens." },
  { id: "upside", label: "Upside & Caveats", short: "Upside" },
  { id: "appendix", label: "Appendix", short: "Appendix" },
];

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const {
    scenarios,
    activeScenarios,
    active,
    activeKey,
    setActiveKey,
    toggle,
    isActive,
    customs,
    updateCustom,
  } = useScenarios();

  const [tab, setTab] = useState<TabId>("verdict");
  const [editorOpen, setEditorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <ScenarioBar
        scenarios={scenarios}
        activeKey={activeKey}
        setActiveKey={setActiveKey}
        toggle={toggle}
        isActive={isActive}
        onEditCustoms={() => setEditorOpen(true)}
      />

      {/* Tabs */}
      <nav className="sticky top-0 z-20 border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))/95%] backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--surface))/85%]">
        <div className="container-page">
          {/* Mobile: select */}
          <div className="md:hidden py-2">
            <label className="sr-only" htmlFor="tab-select">
              Section
            </label>
            <select
              id="tab-select"
              className="w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--surface-raised))] px-3 py-2 text-[14px] focus-ring"
              value={tab}
              onChange={(e) => setTab(e.target.value as TabId)}
            >
              {TABS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          {/* Desktop: tabs */}
          <div className="hidden md:flex items-stretch gap-1 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-current={tab === t.id ? "page" : undefined}
                className={cn(
                  "relative px-4 py-3 text-[13.5px] font-medium tracking-tight transition-colors focus-ring",
                  tab === t.id
                    ? "text-[hsl(var(--foreground))]"
                    : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                )}
              >
                {t.label}
                {tab === t.id && (
                  <span className="absolute inset-x-3 -bottom-px h-[2px] bg-[hsl(var(--accent))]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container-page py-6 sm:py-8">
        {tab === "verdict" && (
          <TabVerdict active={active} onJumpToUpside={() => setTab("upside")} />
        )}
        {tab === "buildup" && <TabBuildUp active={active} />}
        {tab === "returns" && <TabReturns scenarios={activeScenarios} />}
        {tab === "sensitivities" && <TabSensitivities />}
        {tab === "upside" && <TabUpsideCaveats />}
        {tab === "appendix" && <TabAppendix />}
      </main>

      <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--surface))]">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-5 text-[12px] text-[hsl(var(--muted-foreground))]">
          <span>
            v7 · Patient-Capital frame · 12-yr unleveraged HVS DCF · RICS Red Book independent
          </span>
          <span className="num">
            Sovereign / family-office / insurance long-hold audience — not high-hurdle PE.
          </span>
        </div>
      </footer>

      <ScenarioEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        customs={customs}
        updateCustom={updateCustom}
        toggleActive={(k) => toggle(k)}
      />
    </div>
  );
}
