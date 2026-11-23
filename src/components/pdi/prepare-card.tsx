"use client";

import { Check, SunMedium, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PrepareCardProps {
  onDismiss: (dontShowAgain: boolean) => void;
}

export function PrepareCard({ onDismiss }: PrepareCardProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  return (
    <div className="relative rounded-xl border border-glacier-blue/40 bg-glacier-blue/[0.06] p-3.5 sm:p-4 shadow-2xs">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-glacier-blue/20 text-sky-950 dark:text-sky-200">
            <SunMedium className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-sky-950 dark:text-sky-200">
              Showroom Daylight Protocol
            </span>
            <span className="font-bold text-xs sm:text-sm text-foreground">
              3 Quick Rules Before Inspecting
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDismiss(dontShowAgain)}
          className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted"
          title="Dismiss guide"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 text-xs">
        <div className="flex items-start gap-2 rounded-lg border border-border/80 bg-card p-2.5">
          <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-glacier-blue/20 text-[10px] font-mono font-bold text-sky-950 dark:text-sky-200">
            1
          </span>
          <p className="text-muted-foreground leading-normal">
            <strong className="text-foreground">Daylight:</strong> Wheel bike
            outside. Dim indoor spotlights hide panel scratches.
          </p>
        </div>

        <div className="flex items-start gap-2 rounded-lg border border-border/80 bg-card p-2.5">
          <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-glacier-blue/20 text-[10px] font-mono font-bold text-sky-950 dark:text-sky-200">
            2
          </span>
          <p className="text-muted-foreground leading-normal">
            <strong className="text-foreground">Centre Stand:</strong> Spin
            wheels freely to verify brake drag and upright oil levels.
          </p>
        </div>

        <div className="flex items-start gap-2 rounded-lg border border-border/80 bg-card p-2.5">
          <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-racing-red/20 text-[10px] font-mono font-bold text-racing-red">
            3
          </span>
          <p className="text-muted-foreground leading-normal">
            <strong className="text-foreground">In Writing:</strong> Endorse
            defects on delivery gate pass with dealer stamp.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 mt-1 border-t border-border/60 text-xs">
        <label className="flex items-center gap-1.5 text-muted-foreground cursor-pointer select-none text-[11px]">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="size-3.5 rounded border-border accent-glacier-blue"
          />
          <span>Don&apos;t show again</span>
        </label>

        <Button
          type="button"
          size="xs"
          onClick={() => onDismiss(dontShowAgain)}
          className="bg-foreground text-background font-medium hover:bg-foreground/90 text-xs h-7 px-3"
        >
          <span>Begin</span>
          <Check className="size-3 ml-1" />
        </Button>
      </div>
    </div>
  );
}
