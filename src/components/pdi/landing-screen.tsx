"use client";

import { ArrowRight, Check, Copy, Lock, Smartphone } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { type InspectionRecord, PDI_ZONES } from "@/lib/pdi-data";

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
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToExplainer = () => {
    document
      .getElementById("what-is-pdi")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative w-full">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-gradient-to-r from-glacier-blue/20 via-racing-red/15 to-glacier-blue/60 blur-3xl opacity-75 dark:opacity-30"
      />
      <div className="mx-auto flex w-full max-w-xl flex-col px-5 pb-16 pt-5 sm:pt-8">
        <header className="flex justify-end">
          <span className="inline-flex items-center gap-2 font-bold tracking-tight text-foreground">
            <Image
              src="/tripmeter-primary.svg"
              alt="tripmeter"
              width={20}
              height={20}
              className="size-5 rounded-md"
            />
            tripmeter
          </span>
        </header>

        <div className="flex flex-col items-center gap-6 py-14 sm:py-20">
          <h1 className="text-center text-3xl font-black leading-[1.1] tracking-tight text-foreground sm:text-4xl">
            Check your new bike <br />
            <span className="bg-gradient-to-r from-racing-red via-racing-red to-orange-600 bg-clip-text text-transparent">
              before you sign for it.
            </span>
          </h1>

          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            free, no login, works offline once loaded, about 25 minutes.
          </p>

          <div className="flex w-full max-w-sm flex-col items-stretch gap-3">
            {existingInspection ? (
              <>
                <Button
                  type="button"
                  size="lg"
                  onClick={onContinue}
                  className="h-14 justify-between bg-racing-red px-5 font-bold text-white shadow-md shadow-racing-red/25 hover:bg-racing-red/90"
                >
                  <span>Continue where you left off</span>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 font-mono text-xs">
                    {progressPercent}%
                  </span>
                </Button>
                <button
                  type="button"
                  onClick={onResetAndStartNew}
                  className="min-h-11 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Start a new one
                </button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  size="lg"
                  onClick={onStart}
                  className="h-14 justify-between bg-racing-red px-5 font-bold text-white shadow-md shadow-racing-red/25 hover:bg-racing-red/90"
                >
                  <span>Start checklist</span>
                  <ArrowRight className="size-5" />
                </Button>
                <button
                  type="button"
                  onClick={scrollToExplainer}
                  className="min-h-11 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  What is a PDI?
                </button>
              </>
            )}
          </div>

          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="size-3.5 shrink-0" />
            Your notes stay on this device.
          </p>
        </div>

        <div className="hidden items-start justify-between gap-3 rounded-xl border border-border/70 bg-card/60 p-3 sm:flex">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Smartphone className="size-4 shrink-0" />
            <span>On a computer? Open this on your phone at the showroom.</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="shrink-0 gap-1.5"
          >
            {copied ? (
              <Check className="size-3.5" />
            ) : (
              <Copy className="size-3.5" />
            )}
            <span>{copied ? "Copied" : "Copy link"}</span>
          </Button>
        </div>

        <noscript>
          <section className="mt-12 flex flex-col gap-4">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Plain-text checklist
            </h2>
            {PDI_ZONES.map((zone) => (
              <details key={zone.id} open className="flex flex-col gap-2">
                <summary className="cursor-pointer font-semibold text-foreground">
                  {zone.title}
                </summary>
                <ol className="mt-2 list-decimal pl-5 text-sm text-muted-foreground">
                  {zone.items.map((item) => (
                    <li key={item.id} className="py-0.5">
                      {item.label}
                    </li>
                  ))}
                </ol>
              </details>
            ))}
          </section>
        </noscript>

        <section
          id="what-is-pdi"
          className="mt-14 flex scroll-mt-6 flex-col gap-3 border-t border-border pt-8"
        >
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            What is a PDI?
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            A Pre-Delivery Inspection is the check you do yourself before you
            sign for a new bike. While it is still the dealer&rsquo;s
            responsibility, you confirm the paperwork, paint, tyres, brakes,
            fluids and electronics are right. Once you sign, the bike is yours.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            This checklist walks you around the bike in a sensible order and
            lets you flag anything you want fixed or written down. No account,
            no cloud: notes and photos stay in this browser.
          </p>
        </section>

        {referenceGuide ? (
          <details className="mt-10 border-t border-border pt-6">
            <summary className="cursor-pointer list-none text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              Read the full inspection guide
            </summary>
            <div className="mt-4">{referenceGuide}</div>
          </details>
        ) : null}
      </div>
    </div>
  );
}
