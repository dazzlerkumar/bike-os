"use client";

import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  Gauge,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { InspectionRecord } from "@/lib/pdi-data";

interface LandingScreenProps {
  existingInspection: InspectionRecord | null;
  progressPercent: number;
  onStart: () => void;
  onContinue: () => void;
  onResetAndStartNew: () => void;
  referenceGuide?: React.ReactNode;
}

export function LandingScreen({
  existingInspection,
  progressPercent,
  onStart,
  onContinue,
  onResetAndStartNew,
  referenceGuide,
}: LandingScreenProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleScrollToGuide = () => {
    const target = document.getElementById("pdi-reference-guide");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-gradient-to-r from-glacier-blue/30 via-racing-red/15 to-glacier-blue/20 blur-3xl opacity-75 dark:opacity-30"
      />

      <div className="relative max-w-xl mx-auto w-full px-4 py-6 sm:py-10 flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-mono backdrop-blur-xs shadow-2xs">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-racing-red opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-racing-red" />
            </span>
            <span className="font-semibold text-foreground tracking-tight">
              SHOWROOM BAY PROTOCOL
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-glacier-blue/40 bg-glacier-blue/15 px-2.5 py-1 text-[11px] font-mono font-semibold text-sky-950 dark:text-sky-200">
            <span className="size-1.5 rounded-full bg-glacier-blue" />
            <span>36-POINT SCAN</span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black tracking-tight text-foreground leading-[1.08]">
            Check before you sign.{" "}
            <span className="bg-gradient-to-r from-racing-red via-racing-red to-orange-600 bg-clip-text text-transparent">
              Leave zero defects behind.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Dealers inspect new bikes for warranty clearance. This independent
            tool inspects it for{" "}
            <strong className="text-foreground">you</strong>. Verify stamped
            VIN, tyre DOT dates, fluid banjo seals, and electronics before
            signing the gate pass.
          </p>
        </div>

        <div className="relative rounded-2xl border border-border/80 bg-card/90 shadow-sm overflow-hidden backdrop-blur-xs">
          <div className="p-4 sm:p-5 flex flex-col gap-4">
            {existingInspection ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-border/80 pb-3">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      Active Inspection
                    </span>
                    <span className="font-bold text-sm sm:text-base text-foreground">
                      {existingInspection.bikeModel || "New Motorcycle"}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-glacier-blue/40 bg-glacier-blue/15 px-2.5 py-1 font-mono text-xs font-bold text-sky-950 dark:text-sky-200">
                    <span>{progressPercent}% Complete</span>
                  </div>
                </div>

                <div className="w-full bg-muted rounded-full h-2 overflow-hidden flex">
                  <div
                    className="bg-glacier-blue h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <Button
                    type="button"
                    size="lg"
                    onClick={onContinue}
                    className="w-full justify-between bg-racing-red text-white hover:bg-racing-red/90 shadow-md shadow-racing-red/25 font-bold text-sm sm:text-base py-5 px-4"
                  >
                    <span>Resume Inspection</span>
                    <ChevronRight className="size-5" />
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={onResetAndStartNew}
                    className="w-full justify-center gap-1.5 border-border hover:bg-muted font-medium text-xs sm:text-sm py-5"
                  >
                    <RotateCcw className="size-4 text-muted-foreground" />
                    <span>Start Fresh Inspection</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Button
                  type="button"
                  size="lg"
                  onClick={onStart}
                  className="w-full justify-between bg-racing-red text-white hover:bg-racing-red/90 shadow-lg shadow-racing-red/25 hover:shadow-racing-red/40 active:scale-[0.99] font-bold text-base sm:text-lg py-6 px-5 transition-all group"
                >
                  <div className="flex flex-col items-start leading-tight">
                    <span>Start Showroom Inspection</span>
                    <span className="text-[11px] font-normal text-white/80 font-mono">
                      36 Checks • ~25 Min Daylight Protocol
                    </span>
                  </div>
                  <div className="flex size-9 items-center justify-center rounded-lg bg-white/20 group-hover:translate-x-0.5 transition-transform">
                    <ChevronRight className="size-5 text-white" />
                  </div>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleScrollToGuide}
                  className="w-full justify-center gap-1.5 border-glacier-blue/40 text-foreground hover:bg-glacier-blue/10 font-medium text-xs py-2"
                >
                  <span>Explore Checklist Zones &amp; FAQ</span>
                  <ArrowRight className="size-3.5 text-glacier-blue" />
                </Button>
              </div>
            )}

            <div className="flex flex-col gap-2.5 pt-3 border-t border-border/70">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-muted-foreground uppercase tracking-wider">
                  Critical Failure Radar
                </span>
                <span className="text-sky-950 dark:text-sky-200 flex items-center gap-1 text-[11px]">
                  <span className="size-1.5 rounded-full bg-glacier-blue" />
                  Showroom Bay Watch
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="flex flex-col gap-1 rounded-xl border border-racing-red/30 bg-racing-red/5 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <ShieldAlert className="size-3.5 text-racing-red" />
                      Chassis Headstock VIN
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-racing-red/15 text-racing-red border border-racing-red/30">
                      CRITICAL
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    Inspect physical stamped VIN vs. Invoice &amp; Insurance.
                    Zero tolerance for inverted characters.
                  </p>
                </div>

                <div className="flex flex-col gap-1 rounded-xl border border-racing-red/30 bg-racing-red/5 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <AlertTriangle className="size-3.5 text-racing-red" />
                      Fluid Sealing &amp; Calipers
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-racing-red/15 text-racing-red border border-racing-red/30">
                      LEAK WATCH
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    Brake banjo bolts, master cylinder max window, and crankcase
                    gasket weep lines.
                  </p>
                </div>

                <div className="flex flex-col gap-1 rounded-xl border border-glacier-blue/40 bg-glacier-blue/10 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Gauge className="size-3.5 text-sky-950 dark:text-sky-200" />
                      DOT Tyre Age &amp; Rims
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-glacier-blue/25 text-sky-950 dark:text-sky-200 border border-glacier-blue/40">
                      CALIBRATED
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    4-digit DOT date (WWYY). Tyres must be &lt;6 months old with
                    no transit rim scuffs.
                  </p>
                </div>

                <div className="flex flex-col gap-1 rounded-xl border border-glacier-blue/40 bg-glacier-blue/10 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Zap className="size-3.5 text-sky-950 dark:text-sky-200" />
                      Console Startup &amp; Idle
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-glacier-blue/25 text-sky-950 dark:text-sky-200 border border-glacier-blue/40">
                      TELEMETRY
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    Clean diagnostic boot, zero check-engine codes, cold idle
                    stability, odometer under 15 km.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-border rounded-xl border border-border/80 bg-card py-2.5 shadow-2xs">
          <div className="flex flex-col items-center justify-center px-2 text-center">
            <span className="text-xs sm:text-sm font-extrabold text-foreground flex items-center gap-1">
              <CheckCircle2 className="size-3.5 text-glacier-blue" />
              36 Points
            </span>
            <span className="text-[10px] text-muted-foreground">
              6 Walk-around zones
            </span>
          </div>

          <div className="flex flex-col items-center justify-center px-2 text-center">
            <span className="text-xs sm:text-sm font-extrabold text-foreground flex items-center gap-1">
              <Clock className="size-3.5 text-muted-foreground" />
              ~25 Mins
            </span>
            <span className="text-[10px] text-muted-foreground">
              Daylight bay pace
            </span>
          </div>

          <div className="flex flex-col items-center justify-center px-2 text-center">
            <span className="text-xs sm:text-sm font-extrabold text-foreground flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-racing-red" />
              100% Offline
            </span>
            <span className="text-[10px] text-muted-foreground">
              Saves on device
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-border/70 bg-card/60 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground min-w-0">
            <Smartphone className="size-4 shrink-0 text-glacier-blue" />
            <span className="truncate">
              On a computer? Open this on your smartphone at the showroom bay.
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="shrink-0 gap-1.5 border-glacier-blue/30 hover:bg-glacier-blue/10 text-xs"
          >
            {copied ? (
              <Check className="size-3.5 text-racing-red" />
            ) : (
              <Copy className="size-3.5 text-muted-foreground" />
            )}
            <span className="font-semibold text-foreground">
              {copied ? "Link Copied" : "Copy Link"}
            </span>
          </Button>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
            3 Non-Negotiable Showroom Rules
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-3 shadow-2xs">
              <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                <span className="flex size-4 items-center justify-center rounded-full bg-glacier-blue/20 text-sky-950 dark:text-sky-200 text-[10px] font-mono font-bold">
                  1
                </span>
                Natural Daylight
              </span>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Wheel the vehicle out of the dim basement or yard into open
                sunlight to catch paint swirls.
              </p>
            </div>

            <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-3 shadow-2xs">
              <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                <span className="flex size-4 items-center justify-center rounded-full bg-glacier-blue/20 text-sky-950 dark:text-sky-200 text-[10px] font-mono font-bold">
                  2
                </span>
                Centre Stand Check
              </span>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Spin both wheels freely to verify brake calliper drag, rim
                trueness, and upright fluid levels.
              </p>
            </div>

            <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-3 shadow-2xs">
              <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                <span className="flex size-4 items-center justify-center rounded-full bg-racing-red/20 text-racing-red text-[10px] font-mono font-bold">
                  3
                </span>
                Written Endorsement
              </span>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Never accept verbal promises. Endorse any cosmetic scratch or
                pending accessory on the gate pass.
              </p>
            </div>
          </div>
        </div>

        {referenceGuide}
      </div>
    </div>
  );
}
