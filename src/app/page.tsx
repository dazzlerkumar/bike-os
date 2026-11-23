"use client";

import {
  AlertTriangle,
  BatteryCharging,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  Gauge,
  HelpCircle,
  Sparkles,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ItemStatus = "idle" | "ok" | "issue" | "na";

interface CheckItem {
  id: string;
  title: string;
  detail: string;
  status: ItemStatus;
}

export default function Home() {
  const [activeZone, setActiveZone] = useState("walkaround");
  const [checklist, setChecklist] = useState<CheckItem[]>([
    {
      id: "chassis-vin",
      title: "Chassis & VIN Match",
      detail: "Match VIN stamped on headstock with invoice & insurance paper.",
      status: "ok",
    },
    {
      id: "tyres-alloys",
      title: "Tyre DOT & Wheel Finish",
      detail:
        "Check manufacturing date on sidewall and inspect rims for scuffs.",
      status: "idle",
    },
    {
      id: "front-disc",
      title: "Front Brake Calliper & Fluid",
      detail: "Reservoir level at max window, no weeping around banjo bolt.",
      status: "idle",
    },
    {
      id: "screen-hud",
      title: "Display & Console Startup",
      detail: "Clean boot without error codes, odometer reading under 10 km.",
      status: "issue",
    },
  ]);

  const updateStatus = (id: string, status: ItemStatus) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === status ? "idle" : status }
          : item,
      ),
    );
  };

  const completedCount = checklist.filter((i) => i.status !== "idle").length;

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground pb-24 sm:pb-12">
      <header className="sticky top-0 z-20 border-b border-border bg-card/85 backdrop-blur-md pt-[env(safe-area-inset-top,0px)]">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3 sm:max-w-2xl sm:px-6">
          <div className="flex items-center gap-2.5">
            <Image
              src="/bikeos-primary.svg"
              alt="bikeOS"
              width={36}
              height={36}
              className="size-9 rounded-xl shadow-xs"
              priority
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-foreground text-sm">
                  bikeOS
                </span>
                <Badge
                  variant="outline"
                  className="border-border bg-polar-white text-[10px] font-mono px-1.5 py-0"
                >
                  Light
                </Badge>
              </div>
              <p className="text-[11px] font-mono text-muted-foreground">
                VIN • 26K-EV94
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-polar-white px-2.5 py-1 text-[11px] font-mono text-foreground shadow-2xs">
              <span className="size-1.5 rounded-full bg-accent animate-pulse" />
              Connected
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-5 px-4 pt-4 sm:max-w-2xl sm:px-6 sm:pt-6">
        <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          <Card className="border-border bg-card p-3 shadow-2xs">
            <CardContent className="p-0 flex flex-col gap-1">
              <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                <span>SPEED</span>
                <Gauge className="size-3.5 text-glacier-blue" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-2xl font-extrabold text-foreground tracking-tight sm:text-3xl">
                  42
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  KM/H
                </span>
              </div>
              <div className="h-1 w-full rounded-full bg-muted overflow-hidden mt-0.5">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: "55%" }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card p-3 shadow-2xs">
            <CardContent className="p-0 flex flex-col gap-1">
              <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                <span>BATTERY</span>
                <BatteryCharging className="size-3.5 text-glacier-blue" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-2xl font-extrabold text-foreground tracking-tight sm:text-3xl">
                  87
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  %
                </span>
              </div>
              <div className="h-1 w-full rounded-full bg-muted overflow-hidden mt-0.5">
                <div
                  className="h-full bg-glacier-blue rounded-full"
                  style={{ width: "87%" }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card p-3 shadow-2xs">
            <CardContent className="p-0 flex flex-col gap-1">
              <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                <span>DRIVE</span>
                <Zap className="size-3.5 text-accent" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-xl font-bold text-foreground sm:text-2xl">
                  SPORT
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground truncate">
                Throttle map 1:1
              </p>
            </CardContent>
          </Card>

          <Link href="/pdi" className="block focus:outline-none">
            <Card className="border-border bg-card p-3 shadow-2xs hover:border-glacier-blue/60 transition-colors">
              <CardContent className="p-0 flex flex-col gap-1">
                <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                  <span>INSPECTION</span>
                  <FileCheck2 className="size-3.5 text-glacier-blue" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-2xl font-extrabold text-foreground sm:text-3xl">
                    PDI Flow
                  </span>
                </div>
                <p className="text-[10px] text-glacier-blue font-semibold truncate flex items-center gap-0.5">
                  Launch Checklist &rarr;
                </p>
              </CardContent>
            </Card>
          </Link>
        </section>

        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base tracking-tight text-foreground">
                Walk-around Inspection
              </h2>
              <p className="text-xs text-muted-foreground">
                Tap items standing at the vehicle. Big touch targets.
              </p>
            </div>
            <Badge
              variant="outline"
              className="font-mono text-[11px] border-border bg-polar-white"
            >
              Zone 2 of 5
            </Badge>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar text-xs">
            {[
              { id: "paperwork", label: "Paperwork" },
              { id: "walkaround", label: "Front & Tyres" },
              { id: "controls", label: "Controls" },
              { id: "powertrain", label: "Battery" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveZone(tab.id)}
                className={`min-h-9 shrink-0 rounded-full px-3.5 text-xs font-medium transition-all ${
                  activeZone === tab.id
                    ? "bg-foreground text-background shadow-xs"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2.5">
            {checklist.map((item) => {
              const isOk = item.status === "ok";
              const isIssue = item.status === "issue";
              const isNa = item.status === "na";

              return (
                <div
                  key={item.id}
                  className={`flex flex-col gap-2 rounded-xl border p-3.5 transition-all shadow-2xs ${
                    isIssue
                      ? "border-accent/40 bg-accent/[0.04]"
                      : isOk
                        ? "border-glacier-blue/60 bg-glacier-blue/[0.08]"
                        : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-sm leading-snug text-foreground">
                        {item.title}
                      </span>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.detail}
                      </p>
                    </div>

                    {isIssue && (
                      <span className="shrink-0 rounded bg-accent/15 px-2 py-0.5 font-mono text-[10px] font-bold text-accent">
                        ISSUE
                      </span>
                    )}
                    {isOk && (
                      <span className="shrink-0 rounded bg-glacier-blue/25 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-800">
                        VERIFIED
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <Button
                      type="button"
                      variant={isOk ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateStatus(item.id, "ok")}
                      className={`min-h-11 font-medium text-xs ${
                        isOk
                          ? "bg-glacier-blue text-slate-950 border-glacier-blue shadow-xs font-bold"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <CheckCircle2 className="size-4" />
                      OK
                    </Button>

                    <Button
                      type="button"
                      variant={isIssue ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => updateStatus(item.id, "issue")}
                      className={`min-h-11 font-medium text-xs ${
                        isIssue
                          ? "bg-accent text-accent-foreground shadow-xs font-bold"
                          : "border-border hover:bg-muted text-accent"
                      }`}
                    >
                      <AlertTriangle className="size-4" />
                      Issue
                    </Button>

                    <Button
                      type="button"
                      variant={isNa ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => updateStatus(item.id, "na")}
                      className={`min-h-11 font-medium text-xs ${
                        isNa
                          ? "bg-muted text-foreground font-bold"
                          : "border-border hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      <HelpCircle className="size-4" />
                      N/A
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-2.5">
          <h2 className="font-bold text-base tracking-tight text-foreground">
            Design Tokens (OKLCH)
          </h2>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-2.5 shadow-2xs">
              <div className="h-14 rounded-lg bg-polar-white border border-border/80 flex items-end p-1.5 shadow-inner">
                <span className="font-mono text-[9px] font-bold text-foreground">
                  #f1f3f4
                </span>
              </div>
              <p className="font-semibold text-xs text-foreground truncate mt-0.5">
                Polar White
              </p>
              <p className="font-mono text-[9px] text-muted-foreground truncate">
                Primary
              </p>
            </div>

            <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-2.5 shadow-2xs">
              <div className="h-14 rounded-lg bg-glacier-blue border border-glacier-blue/60 flex items-end p-1.5 shadow-inner">
                <span className="font-mono text-[9px] font-bold text-slate-900">
                  #9cc6e0
                </span>
              </div>
              <p className="font-semibold text-xs text-foreground truncate mt-0.5">
                Glacier Blue
              </p>
              <p className="font-mono text-[9px] text-muted-foreground truncate">
                Secondary
              </p>
            </div>

            <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-2.5 shadow-2xs">
              <div className="h-14 rounded-lg bg-racing-red flex items-end p-1.5 shadow-inner">
                <span className="font-mono text-[9px] font-bold text-white">
                  #e4002B
                </span>
              </div>
              <p className="font-semibold text-xs text-foreground truncate mt-0.5">
                Racing Red
              </p>
              <p className="font-mono text-[9px] text-muted-foreground truncate">
                Accent
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-2.5 pb-2">
          <Card className="border-border bg-card shadow-2xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Component Variants</CardTitle>
              <CardDescription className="text-xs">
                Light theme button touch targets with 44px+ height on mobile.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button
                variant="default"
                className="w-full sm:w-auto border border-border/80 shadow-xs"
              >
                <Sparkles className="size-4" />
                Primary (Polar White)
              </Button>
              <Button variant="secondary" className="w-full sm:w-auto">
                Secondary (Glacier Blue)
              </Button>
              <Button variant="destructive" className="w-full sm:w-auto">
                Destructive (Racing Red)
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom,0px)] shadow-lg">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-2.5 sm:max-w-2xl sm:px-6">
          <div className="flex flex-col">
            <span className="font-mono text-[11px] text-muted-foreground">
              Progress
            </span>
            <span className="font-mono text-sm font-bold text-foreground">
              {completedCount} of {checklist.length} Checked
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/pdi">
              <Button
                variant="default"
                size="sm"
                className="min-h-11 border border-border/80 shadow-xs font-semibold text-xs px-4"
              >
                PDI Flow
                <ChevronRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
