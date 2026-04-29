import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { ScenarioBar } from "@/components/ScenarioBar";
import { ScenarioEditor } from "@/components/ScenarioEditor";
import { EditInputsDrawer } from "@/components/EditInputsDrawer";
import { TabVerdict } from "@/components/tabs/TabVerdict";
import { TabBuildUp } from "@/components/tabs/TabBuildUp";
import { TabReturns } from "@/components/tabs/TabReturns";
import { TabSensitivities } from "@/components/tabs/TabSensitivities";
import { TabAppendix } from "@/components/tabs/TabAppendix";
import { useScenarios } from "@/hooks/useScenarios";
import { useTheme } from "@/hooks/useTheme";
import { useModelInputs } from "@/hooks/useModelInputs";

type TabId = "overview" | "buildup" | "returns" | "sensitivities" | "appendix";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "buildup", label: "Build-Up" },
  { id: "returns", label: "Returns & Discounted Cash Flow" },
  { id: "sensitivities", label: "Sensitivities" },
  { id: "appendix", label: "Appendix" },
];

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { inputs, setInput, resetAll, resetOne, modifiedKeys, isModified, sharableUrl } =
    useModelInputs();
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
  } = useScenarios(inputs);

  const [tab, setTab] = useState<TabId>("overview");
  const [editorOpen, setEditorOpen] = useState(false);
  const [inputsOpen, setInputsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenInputs={() => setInputsOpen(true)}
        inputsModified={isModified}
      />

      <ScenarioBar
        scenarios={scenarios}
        activeKey={activeKey}
        setActiveKey={setActiveKey}
        toggle={toggle}
        isActive={isActive}
        onEditCustoms={() => setEditorOpen(true)}
      />

      {/* Modified-inputs warning banner */}
      {isModified && (
        <div
          role="status"
          className="border-y border-l-4 border-[hsl(var(--warning))] border-l-[hsl(var(--warning))] bg-[hsl(var(--warning)/15%)]"
        >
          <div className="container-page flex flex-wrap items-center gap-3 py-2.5">
            <AlertTriangle size={16} className="shrink-0 text-[hsl(var(--warning))]" />
            <span className="text-[13px] font-medium text-[hsl(var(--foreground))]">
              Inputs Modified — Showing Custom Projection
            </span>
            <span className="hidden text-[12px] text-[hsl(var(--muted-foreground))] sm:inline">
              {modifiedKeys.size} of 11 levers overridden
            </span>
            <button
              type="button"
              onClick={resetAll}
              className="ml-auto rounded-md border border-[hsl(var(--warning)/40%)] bg-[hsl(var(--surface-raised))] px-3 py-1 text-[12px] font-medium text-[hsl(var(--warning))] hover:bg-[hsl(var(--warning)/15%)] focus-ring"
            >
              Reset All To Defaults
            </button>
          </div>
        </div>
      )}

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
        {tab === "overview" && (
          <TabVerdict
            active={active}
            inputs={inputs}
            isModified={isModified}
            onJumpToAppendix={() => setTab("appendix")}
          />
        )}
        {tab === "buildup" && (
          <TabBuildUp active={active} scenarios={scenarios} inputs={inputs} isModified={isModified} />
        )}
        {tab === "returns" && (
          <TabReturns scenarios={activeScenarios} inputs={inputs} isModified={isModified} />
        )}
        {tab === "sensitivities" && <TabSensitivities />}
        {tab === "appendix" && <TabAppendix />}
      </main>

      <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--surface))]">
        <div className="container-page py-5 text-center text-[12px] text-[hsl(var(--muted-foreground))]">
          © SJ Group 2026 · Beta
        </div>
      </footer>

      <ScenarioEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        customs={customs}
        updateCustom={updateCustom}
        toggleActive={(k) => toggle(k)}
        inputs={inputs}
      />

      <EditInputsDrawer
        open={inputsOpen}
        onOpenChange={setInputsOpen}
        inputs={inputs}
        setInput={setInput}
        resetAll={resetAll}
        resetOne={resetOne}
        modifiedKeys={modifiedKeys}
        sharableUrl={sharableUrl}
      />
    </div>
  );
}
