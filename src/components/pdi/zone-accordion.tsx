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
}: ZoneAccordionProps) {
  const visibleItems = zone.items.filter((item) =>
    itemAppliesToSetup(item, setup),
  );

  const answeredCount = visibleItems.filter((item) => {
    const st = answers[item.id]?.state;
    return st && st !== "unanswered";
  }).length;

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
          ? "border-foreground/20 bg-card shadow-sm"
          : isComplete
            ? "border-border bg-card/60"
            : "border-border bg-card"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left select-none focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex size-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${
              isComplete
                ? issueCount > 0
                  ? "bg-racing-red text-white"
                  : "bg-glacier-blue text-slate-900"
                : answeredCount > 0
                  ? "bg-muted text-foreground"
                  : "border border-border bg-background text-muted-foreground"
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

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-foreground tracking-tight">
                {zone.title}
              </span>
              {issueCount > 0 && (
                <span className="rounded-full bg-racing-red/15 px-2 py-0.5 font-mono text-[10px] font-bold text-racing-red">
                  {issueCount} {issueCount === 1 ? "issue" : "issues"}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {answeredCount} of {visibleItems.length} checked
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronUp className="size-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="flex flex-col gap-3 px-4 pb-4 pt-1 border-t border-border/60">
          <p className="text-xs text-muted-foreground leading-relaxed pt-1">
            {zone.description}
          </p>

          {zone.id === "test-ride" && onMarkZoneAsNa && (
            <div className="rounded-xl border border-border bg-muted/40 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <span className="text-xs text-muted-foreground">
                Dealer does not permit dynamic test ride before registration?
              </span>
              <button
                type="button"
                onClick={() => onMarkZoneAsNa(visibleItems)}
                className="text-xs font-semibold text-foreground hover:underline shrink-0"
              >
                Mark all test-ride items as N/A
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
