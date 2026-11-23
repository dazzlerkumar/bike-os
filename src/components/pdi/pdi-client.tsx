"use client";

import {
  ArrowLeft,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  MoreVertical,
  Settings2,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  type BikeSetup,
  type ChecklistItemDef,
  type InspectionRecord,
  type ItemAnswer,
  itemAppliesToSetup,
  PDI_ZONES,
  type ZoneDef,
} from "@/lib/pdi-data";
import {
  createNewInspection,
  getActiveInspectionId,
  getInspection,
  listInspections,
  saveInspection,
  setActiveInspectionId,
} from "@/lib/pdi-storage";
import { LandingScreen } from "./landing-screen";
import { PrepareCard } from "./prepare-card";
import { SetupScreen } from "./setup-screen";
import { SummaryScreen } from "./summary-screen";
import { ZoneAccordion } from "./zone-accordion";

interface PdiClientProps {
  zones?: ZoneDef[];
  guideContent?: React.ReactNode;
}

type Stage = "landing" | "setup" | "checklist" | "summary";

const PREPARE_DISMISSED_KEY = "tripmeter_pdi_prepare_dismissed";
const OLD_PREPARE_DISMISSED_KEY = "bikeos_pdi_prepare_dismissed";
const SHOW_HINTS_KEY = "tripmeter_pdi_show_hints";
const OLD_SHOW_HINTS_KEY = "bikeos_pdi_show_hints";

export function PdiClient({ zones = PDI_ZONES, guideContent }: PdiClientProps) {
  const [stage, setStage] = useState<Stage>("landing");
  const [inspection, setInspection] = useState<InspectionRecord | null>(null);
  const [activeZoneId, setActiveZoneId] = useState<string>("paperwork");
  const [showPrepareCard, setShowPrepareCard] = useState(true);
  const [showHints, setShowHints] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    async function loadInitial() {
      if (typeof window === "undefined") return;

      const dismissed =
        window.localStorage.getItem(PREPARE_DISMISSED_KEY) ||
        window.localStorage.getItem(OLD_PREPARE_DISMISSED_KEY);
      if (dismissed === "true") {
        setShowPrepareCard(false);
      }

      const hintsPref =
        window.localStorage.getItem(SHOW_HINTS_KEY) ||
        window.localStorage.getItem(OLD_SHOW_HINTS_KEY);
      if (hintsPref === "true") {
        setShowHints(true);
      }

      const activeId = getActiveInspectionId();
      if (activeId) {
        const record = await getInspection(activeId);
        if (record) {
          setInspection(record);
          return;
        }
      }

      const list = await listInspections();
      if (list.length > 0) {
        setInspection(list[0]);
        setActiveInspectionId(list[0].id);
      }
    }

    loadInitial();
  }, []);

  const currentSetup: BikeSetup = inspection?.setup || {
    drive: "all",
    brakes: "all",
    tyres: "all",
    cooling: "all",
    start: "all",
    fuelSystem: "all",
  };

  const visibleItems = zones.flatMap((z) =>
    z.items.filter((i) => itemAppliesToSetup(i, currentSetup)),
  );

  const totalVisibleCount = visibleItems.length;
  const answers = inspection?.answers || {};

  const answeredCount = visibleItems.filter((i) => {
    const st = answers[i.id]?.state;
    return st && st !== "unanswered";
  }).length;

  const issueCount = visibleItems.filter(
    (i) => answers[i.id]?.state === "issue",
  ).length;

  const progressPercent =
    totalVisibleCount > 0
      ? Math.round((answeredCount / totalVisibleCount) * 100)
      : 0;

  const issuePercent =
    totalVisibleCount > 0
      ? Math.round((issueCount / totalVisibleCount) * 100)
      : 0;

  const activeZone = zones.find((z) => z.id === activeZoneId) || zones[0];
  const activeZoneItems = activeZone.items.filter((i) =>
    itemAppliesToSetup(i, currentSetup),
  );
  const activeRemainingCount = activeZoneItems.filter(
    (i) => !answers[i.id]?.state || answers[i.id]?.state === "unanswered",
  ).length;

  const handleStartFresh = async () => {
    const newRecord = await createNewInspection("New Motorcycle");
    setInspection(newRecord);
    setStage("setup");
  };

  const handleContinueExisting = () => {
    setStage("checklist");
  };

  const handleSaveSetup = async (setup: BikeSetup, bikeModel: string) => {
    if (!inspection) return;
    const updated: InspectionRecord = {
      ...inspection,
      setup,
      bikeModel: bikeModel.trim() || inspection.bikeModel || "New Motorcycle",
    };
    setInspection(updated);
    await saveInspection(updated);
    setStage("checklist");
  };

  const handleSkipSetup = () => {
    setStage("checklist");
  };

  const handleUpdateAnswer = (itemId: string, answer: ItemAnswer) => {
    if (!inspection) return;
    const nextAnswers = { ...inspection.answers, [itemId]: answer };
    const updated: InspectionRecord = { ...inspection, answers: nextAnswers };

    setInspection(updated);
    startTransition(() => {
      saveInspection(updated);
    });
  };

  const handleMarkZoneAsNa = (items: ChecklistItemDef[]) => {
    if (!inspection) return;
    const nextAnswers = { ...inspection.answers };
    for (const item of items) {
      nextAnswers[item.id] = {
        state: "na",
        value: "Dealer did not allow test ride",
        note: "Dealer did not permit dynamic test ride prior to delivery",
        photos: [],
        updatedAt: Date.now(),
      };
    }
    const updated: InspectionRecord = { ...inspection, answers: nextAnswers };
    setInspection(updated);
    saveInspection(updated);
  };

  const handleMarkRemainingAsOk = (items: ChecklistItemDef[]) => {
    if (!inspection) return;
    const nextAnswers = { ...inspection.answers };
    for (const item of items) {
      if (
        !nextAnswers[item.id]?.state ||
        nextAnswers[item.id]?.state === "unanswered"
      ) {
        nextAnswers[item.id] = {
          state: "ok",
          value: "",
          note: "",
          photos: [],
          updatedAt: Date.now(),
        };
      }
    }
    const updated: InspectionRecord = { ...inspection, answers: nextAnswers };
    setInspection(updated);
    saveInspection(updated);
  };

  const handleDismissPrepare = (dontShowAgain: boolean) => {
    setShowPrepareCard(false);
    if (dontShowAgain && typeof window !== "undefined") {
      window.localStorage.setItem(PREPARE_DISMISSED_KEY, "true");
    }
  };

  const handleToggleHints = () => {
    const next = !showHints;
    setShowHints(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SHOW_HINTS_KEY, String(next));
    }
  };

  const handleNextUnchecked = () => {
    for (const zone of zones) {
      const zoneItems = zone.items.filter((i) =>
        itemAppliesToSetup(i, currentSetup),
      );
      const nextUnchecked = zoneItems.find(
        (i) => !answers[i.id]?.state || answers[i.id]?.state === "unanswered",
      );

      if (nextUnchecked) {
        setActiveZoneId(zone.id);
        setTimeout(() => {
          const el = document.getElementById(`item-${nextUnchecked.id}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 150);
        return;
      }
    }

    setStage("summary");
  };

  const handleJumpToItem = (itemId: string, zoneId: string) => {
    setStage("checklist");
    setActiveZoneId(zoneId);
    setTimeout(() => {
      const el = document.getElementById(`item-${itemId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 200);
  };

  if (stage === "landing") {
    return (
      <LandingScreen
        existingInspection={inspection}
        progressPercent={progressPercent}
        onStart={handleStartFresh}
        onContinue={handleContinueExisting}
        onResetAndStartNew={handleStartFresh}
        referenceGuide={guideContent}
      />
    );
  }

  if (stage === "setup") {
    return (
      <SetupScreen
        initialSetup={currentSetup}
        bikeModel={inspection?.bikeModel || ""}
        onSave={handleSaveSetup}
        onSkip={handleSkipSetup}
        onBack={() => setStage("landing")}
      />
    );
  }

  if (stage === "summary" && inspection) {
    return (
      <SummaryScreen
        inspection={inspection}
        zones={zones}
        onBackToChecklist={() => setStage("checklist")}
        onJumpToItem={handleJumpToItem}
        onStartNewInspection={handleStartFresh}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-dvh pb-28">
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur-md pt-[env(safe-area-inset-top,0px)] shadow-2xs">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-2.5">
          <button
            type="button"
            onClick={() => setStage("landing")}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Exit</span>
          </button>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-racing-red" />
              <span className="font-bold text-xs sm:text-sm text-foreground tracking-tight">
                {inspection?.bikeModel || "PDI Inspection"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] mt-0.5">
              <span className="text-sky-950 dark:text-sky-200 bg-glacier-blue/20 border border-glacier-blue/40 px-1.5 py-0.2 rounded font-bold">
                {answeredCount}/{totalVisibleCount} checked
              </span>
              {issueCount > 0 && (
                <span className="text-racing-red bg-racing-red/15 border border-racing-red/30 px-1.5 py-0.2 rounded font-bold">
                  {issueCount} {issueCount === 1 ? "issue" : "issues"}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleHints}
              className={`flex size-9 items-center justify-center rounded-lg border transition-colors ${showHints
                  ? "border-glacier-blue bg-glacier-blue/20 text-sky-950 dark:text-sky-200"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              title={showHints ? "Hide hints" : "Expand all hints"}
            >
              {showHints ? (
                <Eye className="size-4" />
              ) : (
                <EyeOff className="size-4" />
              )}
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-muted"
                title="Options"
              >
                <MoreVertical className="size-4" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-11 z-30 w-52 rounded-xl border border-border bg-popover p-1.5 shadow-lg text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setStage("setup");
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg hover:bg-muted font-medium text-foreground"
                  >
                    <Settings2 className="size-4 text-muted-foreground" />
                    <span>Configure Bike Filters</span>
                  </button>

                  <div className="my-1 border-t border-border" />

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      handleStartFresh();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg hover:bg-muted text-racing-red font-medium"
                  >
                    <span>Start new inspection</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-2 w-full bg-muted/80 overflow-hidden flex">
          <div
            className="h-full bg-glacier-blue transition-all duration-300"
            style={{ width: `${Math.max(0, progressPercent - issuePercent)}%` }}
          />
          <div
            className="h-full bg-racing-red transition-all duration-300"
            style={{ width: `${issuePercent}%` }}
          />
        </div>

        <div className="border-t border-border/80 bg-card/80 backdrop-blur-sm px-4 py-2 overflow-x-auto no-scrollbar">
          <div className="mx-auto flex max-w-xl items-center gap-1.5 min-w-max">
            {zones.map((zone) => {
              const zItems = zone.items.filter((i) =>
                itemAppliesToSetup(i, currentSetup),
              );
              const zAnswered = zItems.filter(
                (i) =>
                  answers[i.id]?.state && answers[i.id]?.state !== "unanswered",
              ).length;
              const zIssues = zItems.filter(
                (i) => answers[i.id]?.state === "issue",
              ).length;
              const zComplete =
                zAnswered === zItems.length && zItems.length > 0;
              const isActive = activeZoneId === zone.id;

              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => {
                    setActiveZoneId(zone.id);
                    const el = document.getElementById(`zone-${zone.id}`);
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all select-none ${isActive
                      ? "border border-glacier-blue bg-glacier-blue/20 text-sky-950 dark:text-sky-200 font-bold shadow-2xs"
                      : zComplete
                        ? zIssues > 0
                          ? "border border-racing-red/40 bg-racing-red/10 text-racing-red font-semibold"
                          : "border border-glacier-blue/40 bg-glacier-blue/10 text-sky-950 dark:text-sky-200"
                        : "border border-border/80 bg-card text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <span>
                    {zone.order}. {zone.shortTitle}
                  </span>
                  {zComplete ? (
                    zIssues > 0 ? (
                      <span className="size-1.5 rounded-full bg-racing-red" />
                    ) : (
                      <Check className="size-3 text-glacier-blue stroke-[3]" />
                    )
                  ) : zAnswered > 0 ? (
                    <span className="text-[10px] text-muted-foreground font-sans">
                      {zAnswered}/{zItems.length}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-4 px-4 pt-4">
        {showPrepareCard && <PrepareCard onDismiss={handleDismissPrepare} />}

        <div className="flex flex-col gap-3">
          {zones.map((zone) => (
            <ZoneAccordion
              key={zone.id}
              zone={zone}
              setup={currentSetup}
              answers={answers}
              isOpen={activeZoneId === zone.id}
              showHints={showHints}
              onToggle={() =>
                setActiveZoneId(activeZoneId === zone.id ? "" : zone.id)
              }
              onUpdateAnswer={handleUpdateAnswer}
              onMarkZoneAsNa={
                zone.id === "test-ride" ? handleMarkZoneAsNa : undefined
              }
              onMarkRemainingAsOk={handleMarkRemainingAsOk}
            />
          ))}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom,0px)] shadow-lg">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3 px-4 py-2.5">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={() => setStage("summary")}
            className="min-h-11 font-medium text-xs px-4 relative border-border/80 hover:bg-muted"
          >
            <span>Summary</span>
            {issueCount > 0 && (
              <span className="flex size-2 rounded-full bg-racing-red absolute top-2 right-2 animate-pulse" />
            )}
          </Button>

          <Button
            type="button"
            size="default"
            onClick={handleNextUnchecked}
            className={`min-h-11 flex-1 font-bold text-xs shadow-sm justify-center gap-1.5 transition-all group ${answeredCount === totalVisibleCount
                ? "bg-racing-red text-white hover:bg-racing-red/90 shadow-md shadow-racing-red/25"
                : "bg-foreground text-background hover:bg-foreground/90"
              }`}
          >
            <span>
              {answeredCount === totalVisibleCount
                ? `Review Summary (${issueCount} ${issueCount === 1 ? "issue" : "issues"})`
                : activeRemainingCount > 0
                  ? `Next Check (${activeRemainingCount} left in zone)`
                  : "Next Unchecked"}
            </span>
            <ChevronRight
              className={`size-4 transition-transform group-hover:translate-x-0.5 ${answeredCount === totalVisibleCount
                  ? "text-white"
                  : "text-racing-red"
                }`}
            />
          </Button>
        </div>
      </footer>
    </div>
  );
}
