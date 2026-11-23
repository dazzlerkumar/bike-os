"use client";

import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  HelpCircle,
  SunMedium,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PrepareCardProps {
  onDismiss: (dontShowAgain: boolean) => void;
}

export function PrepareCard({ onDismiss }: PrepareCardProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs font-bold text-glacier-blue tracking-wide uppercase">
            Before You Begin
          </span>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Get into the showroom mindset
          </h2>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-glacier-blue/20 text-slate-800 dark:text-slate-200 px-2.5 py-0.5 text-[11px] font-semibold">
          1 Min Read
        </span>
      </div>

      <p className="text-sm text-foreground/90 bg-muted/50 p-3 rounded-xl border border-border/80 font-medium leading-relaxed">
        &ldquo;A PDI is normal. Dealers expect thorough buyers. Take your time
        and inspect in natural daylight.&rdquo;
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-card/60 p-3.5">
          <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
            <FileText className="size-4 text-glacier-blue" />
            Have ready at the desk:
          </span>
          <ul className="text-xs text-muted-foreground flex flex-col gap-1.5 list-disc pl-4">
            <li>Tax invoice / booking receipt</li>
            <li>Insurance cover note copy</li>
            <li>Both ignition keys + security key tag</li>
            <li>Smartphone with camera &amp; torch</li>
          </ul>
        </div>

        <div className="flex flex-col gap-2 rounded-xl border border-border bg-card/60 p-3.5">
          <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
            <SunMedium className="size-4 text-glacier-blue" />
            Ask the showroom staff:
          </span>
          <ul className="text-xs text-muted-foreground flex flex-col gap-1.5 list-disc pl-4">
            <li>Wheel bike into open natural daylight</li>
            <li>Put bike on main centre stand</li>
            <li>15-20 unhurried minutes before signing</li>
            <li>Clean dust off panels with a microfiber</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-1 border-t border-border">
        <span className="font-semibold text-xs text-foreground">
          How each item row works:
        </span>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg border border-glacier-blue/60 bg-glacier-blue/10 p-2 flex flex-col items-center gap-1">
            <CheckCircle2 className="size-4 text-slate-800 dark:text-slate-200" />
            <span className="font-bold text-foreground">OK</span>
            <span className="text-[10px] text-muted-foreground">
              Looked &amp; good
            </span>
          </div>
          <div className="rounded-lg border border-racing-red/40 bg-racing-red/10 p-2 flex flex-col items-center gap-1">
            <AlertTriangle className="size-4 text-racing-red" />
            <span className="font-bold text-racing-red">Issue</span>
            <span className="text-[10px] text-muted-foreground">
              Notes &amp; photo
            </span>
          </div>
          <div className="rounded-lg border border-border bg-muted/60 p-2 flex flex-col items-center gap-1">
            <HelpCircle className="size-4 text-muted-foreground" />
            <span className="font-bold text-foreground">N/A</span>
            <span className="text-[10px] text-muted-foreground">
              Not applicable
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="size-4 rounded border-border text-foreground accent-foreground"
          />
          <span>Don&apos;t show this guide again</span>
        </label>

        <Button
          type="button"
          variant="default"
          size="default"
          onClick={() => onDismiss(dontShowAgain)}
          className="w-full sm:w-auto bg-foreground text-background font-semibold"
        >
          Begin inspection
        </Button>
      </div>
    </div>
  );
}
