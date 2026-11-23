"use client";

import {
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { InspectionRecord } from "@/lib/pdi-data";

interface LandingScreenProps {
  existingInspection: InspectionRecord | null;
  progressPercent: number;
  onStart: () => void;
  onContinue: () => void;
  onResetAndStartNew: () => void;
}

export function LandingScreen({
  existingInspection,
  progressPercent,
  onStart,
  onContinue,
  onResetAndStartNew,
}: LandingScreenProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto w-full px-4 py-6 sm:py-10">
      <div className="flex items-center gap-2 text-xs font-mono tracking-wide text-muted-foreground uppercase">
        <span className="flex size-2 rounded-full bg-racing-red" />
        <span>bikeOS • Showroom Inspection</span>
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
          Check your new bike before you sign for it.
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          Dealers inspect new bikes for their checklist. This independent tool
          inspects it for <strong className="text-foreground">yours</strong>.
          Catch cosmetic scratches, chassis number mismatches, and fluid leaks
          while standing at the delivery bay.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2.5 py-1">
        <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-3 shadow-2xs">
          <ShieldCheck className="size-4 text-glacier-blue" />
          <span className="font-semibold text-xs text-foreground">
            100% Free
          </span>
          <span className="text-[11px] text-muted-foreground leading-tight">
            No login, private
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-3 shadow-2xs">
          <Clock className="size-4 text-glacier-blue" />
          <span className="font-semibold text-xs text-foreground">
            ~25 Minutes
          </span>
          <span className="text-[11px] text-muted-foreground leading-tight">
            Walk-around order
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-3 shadow-2xs">
          <Smartphone className="size-4 text-glacier-blue" />
          <span className="font-semibold text-xs text-foreground">
            Works Offline
          </span>
          <span className="text-[11px] text-muted-foreground leading-tight">
            Saves on device
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        {existingInspection ? (
          <>
            <Button
              type="button"
              variant="default"
              size="lg"
              onClick={onContinue}
              className="w-full justify-between bg-foreground text-background hover:bg-foreground/90 font-semibold shadow-md py-6 text-base"
            >
              <span>Continue inspection ({progressPercent}% done)</span>
              <ChevronRight className="size-5" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={onResetAndStartNew}
              className="w-full text-muted-foreground hover:text-foreground"
            >
              Start a fresh inspection
            </Button>
          </>
        ) : (
          <Button
            type="button"
            variant="default"
            size="lg"
            onClick={onStart}
            className="w-full justify-between bg-foreground text-background hover:bg-foreground/90 font-semibold shadow-md py-6 text-base"
          >
            <span>Start inspection checklist</span>
            <ChevronRight className="size-5" />
          </Button>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Your photos, notes, and checklist answers stay exclusively on this
          browser.
        </p>
      </div>

      <div className="rounded-xl border border-border/80 bg-muted/40 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-foreground font-medium">
          <Smartphone className="size-4 shrink-0 text-muted-foreground" />
          <span>
            Opening on a computer? Open this on your smartphone at the showroom.
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="shrink-0 gap-1.5"
        >
          {copied ? (
            <Check className="size-3.5 text-green-600" />
          ) : (
            <Copy className="size-3.5" />
          )}
          <span>{copied ? "Copied" : "Copy link"}</span>
        </Button>
      </div>

      <section
        id="what-is-pdi"
        className="flex flex-col gap-4 pt-6 border-t border-border"
      >
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          What is a PDI and why should you run one?
        </h2>

        <div className="flex flex-col gap-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            A <strong>Pre-Delivery Inspection (PDI)</strong> is the formal
            physical and legal verification conducted on a brand new two-wheeler
            before signing the delivery acceptance receipt.
          </p>
          <p>
            Once you sign the delivery note and ride off the dealer forecourt,
            any preexisting cosmetic scratch, manufacturing defect, or missing
            toolkit becomes{" "}
            <strong className="text-foreground">your responsibility</strong> to
            prove under warranty.
          </p>
        </div>

        <div className="grid gap-3 pt-2">
          <Card className="border-border shadow-2xs">
            <CardContent className="p-4 flex flex-col gap-1.5">
              <span className="font-semibold text-foreground text-sm flex items-center gap-2">
                <CheckCircle2 className="size-4 text-glacier-blue" />
                Catch chassis & engine number mismatches
              </span>
              <p className="text-xs text-muted-foreground">
                Dealers occasionally assign registration paperwork with inverted
                digits. Verifying the stamped headstock VIN saves months of RTO
                disputes.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-2xs">
            <CardContent className="p-4 flex flex-col gap-1.5">
              <span className="font-semibold text-foreground text-sm flex items-center gap-2">
                <CheckCircle2 className="size-4 text-glacier-blue" />
                Verify tyre manufacturing date (DOT)
              </span>
              <p className="text-xs text-muted-foreground">
                Ensure the bike was not fitted with old stock tyres manufactured
                more than 6 months prior to vehicle assembly.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-2xs">
            <CardContent className="p-4 flex flex-col gap-1.5">
              <span className="font-semibold text-foreground text-sm flex items-center gap-2">
                <CheckCircle2 className="size-4 text-glacier-blue" />
                Written endorsement of dealer commitments
              </span>
              <p className="text-xs text-muted-foreground">
                Any cosmetic flaw, promised accessory, or pending document is
                formatted into an actionable summary to get signed on the
                delivery note.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
