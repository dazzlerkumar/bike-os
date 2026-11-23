"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type {
  BikeSetup,
  ChecklistItemDef,
  ItemAnswer,
  ZoneDef,
} from "@/lib/pdi-data";
import { itemAppliesToSetup } from "@/lib/pdi-data";
import { ItemRow } from "./item-row";

interface ZoneAccordionProps {
  zone: ZoneDef;
  setup: BikeSetup;
  answers: Record<string, ItemAnswer>;
  isOpen: boolean;
  showHints: boolean;
  onToggle: () => void;
  onUpdateAnswer: (itemId: string, answer: ItemAnswer) => void;
  onMarkZoneAsNa?: (items: ChecklistItemDef[]) => void;
  onMarkRemainingAsOk?: (items: ChecklistItemDef[]) => void;
}

export function ZoneAccordion({
  zone,
  setup,
  answers,
  isOpen,
  showHints,
  onToggle,
  onUpdateAnswer,
  onMarkZoneAsNa,
  onMarkRemainingAsOk,
}: ZoneAccordionProps) {
  const visibleItems = zone.items.filter((item) =>
    itemAppliesToSetup(item, setup),
  );

  const answeredCount = visibleItems.filter((item) => {
    const st = answers[item.id]?.state;
    return st && st !== "unanswered";
  }).length;

  const unansweredItems = visibleItems.filter(
    (item) =>
      !answers[item.id]?.state || answers[item.id]?.state === "unanswered",
  );

  const issueCount = visibleItems.filter(
    (item) => answers[item.id]?.state === "issue",
  ).length;

  const isComplete =
    answeredCount === visibleItems.length && visibleItems.length > 0;

  return (
    <div
      id={`zone-${zone.id}`}
      className={`rounded-2xl border transition-all ${
        isOpen
          ? "border-glacier-blue/60 bg-card shadow-sm"
          : isComplete
            ? issueCount > 0
              ? "border-racing-red/40 bg-card/70"
              : "border-glacier-blue/30 bg-card/60"
            : "border-border/80 bg-card"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left select-none focus:outline-none"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`flex size-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold transition-colors ${
              isComplete
                ? issueCount > 0
                  ? "bg-racing-red text-white shadow-xs"
                  : "bg-glacier-blue text-slate-950 shadow-xs"
                : answeredCount > 0
                  ? "bg-glacier-blue/20 text-sky-950 dark:text-sky-200 border border-glacier-blue/40"
                  : "border border-border bg-muted/50 text-muted-foreground"
            }`}
          >
            {isComplete ? (
              issueCount > 0 ? (
                <AlertTriangle className="size-4" />
              ) : (
                <CheckCircle2 className="size-4" />
              )
            ) : (
              zone.order
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm sm:text-base text-foreground tracking-tight truncate">
                {zone.title}
              </span>
              {issueCount > 0 && (
                <span className="rounded-full bg-racing-red/15 border border-racing-red/30 px-2 py-0.5 font-mono text-[10px] font-bold text-racing-red">
                  {issueCount} {issueCount === 1 ? "issue" : "issues"}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {answeredCount} of {visibleItems.length} checked
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isOpen ? (
            <ChevronUp className="size-4 text-glacier-blue" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="flex flex-col gap-3 px-3.5 sm:px-4 pb-4 pt-1 border-t border-border/60">
          <div className="flex items-center justify-between gap-2 pt-1 text-xs">
            <p className="text-muted-foreground leading-relaxed line-clamp-2">
              {zone.description}
            </p>

            {unansweredItems.length > 0 && onMarkRemainingAsOk && (
              <button
                type="button"
                onClick={() => onMarkRemainingAsOk(unansweredItems)}
                className="shrink-0 text-[11px] font-bold text-sky-950 dark:text-sky-200 hover:text-glacier-blue hover:underline whitespace-nowrap bg-glacier-blue/15 border border-glacier-blue/40 rounded-lg px-2.5 py-1 transition-colors"
              >
                Mark remaining {unansweredItems.length} OK
              </button>
            )}
          </div>

          {zone.id === "test-ride" && onMarkZoneAsNa && (
            <div className="rounded-xl border border-racing-red/30 bg-racing-red/[0.05] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <span className="text-xs text-foreground/90 font-medium">
                Dealership does not permit dynamic road ride before
                registration?
              </span>
              <button
                type="button"
                onClick={() => onMarkZoneAsNa(visibleItems)}
                className="text-xs font-bold text-racing-red hover:underline shrink-0 bg-racing-red/15 border border-racing-red/30 px-2.5 py-1 rounded-lg transition-colors"
              >
                Mark all test-ride items N/A
              </button>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-1">
            {visibleItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                answer={answers[item.id]}
                showHints={showHints}
                onUpdateAnswer={onUpdateAnswer}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
