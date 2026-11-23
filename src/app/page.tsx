import {
  BatteryCharging,
  Gauge,
  Navigation,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-card/75 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground font-mono font-bold text-sm shadow-xs">
              OS
            </span>
            <div>
              <p className="font-semibold tracking-tight text-foreground text-sm">
                BikeOS
              </p>
              <p className="text-muted-foreground text-xs font-mono">
                Design Tokens System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-border bg-polar-white gap-1.5 font-mono text-xs"
            >
              <span className="size-2 rounded-full bg-accent animate-pulse" />
              Light Mode Default
            </Badge>
            <Button
              variant="default"
              size="sm"
              className="border border-border/80 shadow-xs"
            >
              Primary
            </Button>
            <Button variant="secondary" size="sm">
              Glacier Action
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10">
        <section className="flex flex-col gap-2">
          <p className="text-xs uppercase font-mono tracking-widest text-muted-foreground">
            Design Tokens • OKLCH
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Color System & UI Tokens
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Light-first design foundation built with shadcn and perceptually
            uniform OKLCH color coordinates.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border bg-card shadow-xs">
            <CardHeader>
              <div className="h-28 rounded-lg bg-polar-white border border-border flex items-end p-4 shadow-inner">
                <span className="font-mono text-xs font-bold text-foreground bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded border border-border/60">
                  #f1f3f4
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 pt-0">
              <div className="flex items-center justify-between">
                <CardTitle>Polar White</CardTitle>
                <Badge variant="outline" className="font-mono text-[10px]">
                  Primary
                </Badge>
              </div>
              <CardDescription>
                Clean light foundation, crisp surfaces, neutral backdrop.
              </CardDescription>
              <code className="font-mono text-[11px] text-muted-foreground/80 mt-1">
                oklch(0.963 0.003 228.8)
              </code>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-xs">
            <CardHeader>
              <div className="h-28 rounded-lg bg-glacier-blue border border-glacier-blue/60 flex items-end p-4 shadow-inner">
                <span className="font-mono text-xs font-bold text-slate-900 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded border border-white/60">
                  #9cc6e0
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 pt-0">
              <div className="flex items-center justify-between">
                <CardTitle>Glacier Blue</CardTitle>
                <Badge variant="secondary" className="font-mono text-[10px]">
                  Secondary
                </Badge>
              </div>
              <CardDescription>
                Ambient indicators, telemetry badges, active focus states.
              </CardDescription>
              <code className="font-mono text-[11px] text-muted-foreground/80 mt-1">
                oklch(0.805 0.058 235.6)
              </code>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-xs">
            <CardHeader>
              <div className="h-28 rounded-lg bg-racing-red flex items-end p-4 shadow-inner">
                <span className="font-mono text-xs font-bold text-white bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded border border-white/20">
                  #e4002B
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 pt-0">
              <div className="flex items-center justify-between">
                <CardTitle>Racing Red</CardTitle>
                <Badge className="bg-accent text-accent-foreground font-mono text-[10px]">
                  Accent
                </Badge>
              </div>
              <CardDescription>
                High-visibility highlights, sport telemetry, alerts.
              </CardDescription>
              <code className="font-mono text-[11px] text-muted-foreground/80 mt-1">
                oklch(0.579 0.234 23.9)
              </code>
            </CardContent>
          </Card>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Cockpit Telemetry Preview
            </h2>
            <span className="font-mono text-xs text-muted-foreground">
              CAN-BUS: ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-border bg-card shadow-xs">
              <CardContent className="flex flex-col gap-2 pt-4">
                <div className="flex items-center justify-between text-muted-foreground text-xs">
                  <span>VELOCITY</span>
                  <Gauge className="size-4 text-glacier-blue" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold tracking-tight font-mono text-foreground">
                    42
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    KM/H
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full"
                    style={{ width: "55%" }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-xs">
              <CardContent className="flex flex-col gap-2 pt-4">
                <div className="flex items-center justify-between text-muted-foreground text-xs">
                  <span>BATTERY</span>
                  <BatteryCharging className="size-4 text-emerald-600" />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold tracking-tight font-mono text-foreground">
                    87
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    %
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-glacier-blue rounded-full"
                    style={{ width: "87%" }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-xs">
              <CardContent className="flex flex-col gap-2 pt-4">
                <div className="flex items-center justify-between text-muted-foreground text-xs">
                  <span>MODE</span>
                  <Zap className="size-4 text-accent" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
                    SPORT
                  </span>
                  <Badge className="bg-accent text-accent-foreground font-mono text-[10px]">
                    RACE
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Throttle map calibrated
                </p>
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-xs">
              <CardContent className="flex flex-col gap-2 pt-4">
                <div className="flex items-center justify-between text-muted-foreground text-xs">
                  <span>ROUTE</span>
                  <Navigation className="size-4 text-glacier-blue" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
                    18.4
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    KM
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Turn in 450m • Glacier Way
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Shadcn Component Variants
          </h2>
          <Card className="border-border bg-card shadow-xs">
            <CardContent className="flex flex-wrap items-center gap-3 pt-6">
              <Button
                variant="default"
                className="border border-border/80 shadow-xs"
              >
                <Sparkles className="size-4" />
                Primary (Polar White)
              </Button>
              <Button variant="secondary">Secondary (Glacier Blue)</Button>
              <Button variant="destructive">
                <ShieldAlert className="size-4" />
                Destructive (Racing Red)
              </Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
